"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Category, EnergyEvent, EnergyState } from "./types";

const STORAGE_KEY = "hel-energy-state-v1";
const BASELINE_LEVEL = 70;

const DEFAULT_STATE: EnergyState = {
  level: BASELINE_LEVEL,
  events: [],
  onboarded: false,
};

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

// Events saved before `levelAfter` existed don't have it. Replay them in
// chronological order from the baseline so the history chart has a real
// (if approximate, for that legacy stretch) value to plot instead of NaN.
function backfillLevels(events: EnergyEvent[]): EnergyEvent[] {
  const needsBackfill = events.some(
    (e) => typeof e.levelAfter !== "number" || Number.isNaN(e.levelAfter)
  );
  if (!needsBackfill) return events;

  const byId = new Map<string, EnergyEvent>();
  let running = BASELINE_LEVEL;
  for (const e of [...events].sort((a, b) => a.timestamp - b.timestamp)) {
    if (typeof e.levelAfter === "number" && !Number.isNaN(e.levelAfter)) {
      running = e.levelAfter;
      byId.set(e.id, e);
    } else {
      running = clamp(running + e.delta);
      byId.set(e.id, { ...e, levelAfter: running });
    }
  }
  return events.map((e) => byId.get(e.id) ?? e);
}

interface EnergyContextValue {
  level: number;
  events: EnergyEvent[];
  addEvent: (
    category: Category,
    delta: number,
    note?: string,
    timestamp?: number
  ) => void;
  deleteEvent: (id: string) => void;
  onboarded: boolean;
  completeOnboarding: (level: number) => void;
  hydrated: boolean;
}

const EnergyContext = createContext<EnergyContextValue | null>(null);

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EnergyState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as EnergyState;
        // One-time hydration from localStorage, which isn't available during SSR.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          level: parsed.level ?? BASELINE_LEVEL,
          events: backfillLevels(parsed.events ?? []),
          onboarded: parsed.onboarded ?? false,
        });
      }
    } catch {
      // ignore corrupted storage, fall back to defaults
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state, hydrated]);

  function addEvent(
    category: Category,
    delta: number,
    note?: string,
    timestamp?: number
  ) {
    setState((prev) => {
      const newLevel = clamp(prev.level + delta);
      const event: EnergyEvent = {
        id: crypto.randomUUID(),
        categoryId: category.id,
        label: category.label,
        emoji: category.emoji,
        delta,
        note: note?.trim() ? note.trim() : undefined,
        timestamp: timestamp ?? Date.now(),
        levelAfter: newLevel,
      };
      return {
        ...prev,
        level: newLevel,
        events: [event, ...prev.events].sort((a, b) => b.timestamp - a.timestamp),
      };
    });
  }

  function deleteEvent(id: string) {
    setState((prev) => {
      const event = prev.events.find((e) => e.id === id);
      if (!event) return prev;
      return {
        ...prev,
        level: clamp(prev.level - event.delta),
        events: prev.events.filter((e) => e.id !== id),
      };
    });
  }

  function completeOnboarding(level: number) {
    setState((prev) => ({ ...prev, level: clamp(level), onboarded: true }));
  }

  return (
    <EnergyContext.Provider
      value={{
        level: state.level,
        events: state.events,
        addEvent,
        deleteEvent,
        onboarded: state.onboarded,
        completeOnboarding,
        hydrated,
      }}
    >
      {children}
    </EnergyContext.Provider>
  );
}

export function useEnergy() {
  const ctx = useContext(EnergyContext);
  if (!ctx) throw new Error("useEnergy must be used within EnergyProvider");
  return ctx;
}
