"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  Category,
  EnergyEvent,
  EnergyState,
  DEFAULT_BASELINE_LEVEL,
  DEFAULT_HIDE_NOTES_IN_SHARES,
} from "./types";
import { encodeState, decodeState } from "./backup-code";

const STORAGE_KEY = "hel-energy-state-v1";

const DEFAULT_STATE: EnergyState = {
  baselineLevel: DEFAULT_BASELINE_LEVEL,
  level: DEFAULT_BASELINE_LEVEL,
  events: [],
  onboarded: false,
  username: "",
  hideNotesInShares: DEFAULT_HIDE_NOTES_IN_SHARES,
};

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/**
 * Single source of truth for `levelAfter` and the current level: replays
 * every event's delta from the baseline, in chronological order. Called
 * after every mutation (add/update/delete/import/hydrate) so a stored
 * `levelAfter` is never trusted — editing or deleting one event can't leave
 * later events' levels stale, and clamping is always applied in event order
 * rather than against whatever the current level happened to be.
 */
function replayLevels(
  events: EnergyEvent[],
  baselineLevel: number
): { events: EnergyEvent[]; level: number } {
  const ascending = [...events].sort((a, b) => a.timestamp - b.timestamp);
  let running = clamp(baselineLevel);
  const withLevels = ascending.map((e) => {
    running = clamp(running + e.delta);
    return { ...e, levelAfter: running };
  });
  return {
    events: withLevels.sort((a, b) => b.timestamp - a.timestamp),
    level: running,
  };
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
  updateEvent: (
    id: string,
    category: Category,
    delta: number,
    note?: string,
    timestamp?: number
  ) => void;
  deleteEvent: (id: string) => void;
  editingEvent: EnergyEvent | null;
  startEditingEvent: (event: EnergyEvent) => void;
  stopEditingEvent: () => void;
  onboarded: boolean;
  completeOnboarding: (level: number, username: string) => void;
  username: string;
  setUsername: (username: string) => void;
  hideNotesInShares: boolean;
  setHideNotesInShares: (hide: boolean) => void;
  exportCode: () => string;
  importCode: (code: string) => boolean;
  hydrated: boolean;
}

const EnergyContext = createContext<EnergyContextValue | null>(null);

export function EnergyProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<EnergyState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EnergyEvent | null>(null);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<EnergyState>;
        const baselineLevel =
          typeof parsed.baselineLevel === "number"
            ? parsed.baselineLevel
            : DEFAULT_BASELINE_LEVEL;
        const { events, level } = replayLevels(parsed.events ?? [], baselineLevel);
        // One-time hydration from localStorage, which isn't available during SSR.
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setState({
          baselineLevel,
          level,
          events,
          onboarded: parsed.onboarded ?? false,
          username: parsed.username ?? "",
          hideNotesInShares:
            parsed.hideNotesInShares ?? DEFAULT_HIDE_NOTES_IN_SHARES,
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
      const draft: EnergyEvent = {
        id: crypto.randomUUID(),
        categoryId: category.id,
        label: category.label,
        emoji: category.emoji,
        delta,
        note: note?.trim() ? note.trim() : undefined,
        timestamp: timestamp ?? Date.now(),
        // Placeholder: replayLevels below recomputes this for every event,
        // draft included, so the value here is never read.
        levelAfter: 0,
      };
      const { events, level } = replayLevels([draft, ...prev.events], prev.baselineLevel);
      return { ...prev, events, level };
    });
  }

  function updateEvent(
    id: string,
    category: Category,
    delta: number,
    note?: string,
    timestamp?: number
  ) {
    setState((prev) => {
      const existing = prev.events.find((e) => e.id === id);
      if (!existing) return prev;
      const draft: EnergyEvent = {
        ...existing,
        categoryId: category.id,
        label: category.label,
        emoji: category.emoji,
        delta,
        note: note?.trim() ? note.trim() : undefined,
        timestamp: timestamp ?? existing.timestamp,
      };
      const { events, level } = replayLevels(
        prev.events.map((e) => (e.id === id ? draft : e)),
        prev.baselineLevel
      );
      return { ...prev, events, level };
    });
  }

  function deleteEvent(id: string) {
    setState((prev) => {
      if (!prev.events.some((e) => e.id === id)) return prev;
      const { events, level } = replayLevels(
        prev.events.filter((e) => e.id !== id),
        prev.baselineLevel
      );
      return { ...prev, events, level };
    });
  }

  function completeOnboarding(level: number, username: string) {
    setState((prev) => {
      const baselineLevel = clamp(level);
      const replayed = replayLevels(prev.events, baselineLevel);
      return {
        ...prev,
        baselineLevel,
        level: replayed.level,
        events: replayed.events,
        username: username.trim(),
        onboarded: true,
      };
    });
  }

  function setUsername(username: string) {
    setState((prev) => ({ ...prev, username: username.trim() }));
  }

  function setHideNotesInShares(hide: boolean) {
    setState((prev) => ({ ...prev, hideNotesInShares: hide }));
  }

  function exportCode(): string {
    return encodeState(state);
  }

  function importCode(code: string): boolean {
    const decoded = decodeState(code);
    if (!decoded) return false;
    const { events, level } = replayLevels(decoded.events, decoded.baselineLevel);
    setState({ ...decoded, events, level });
    return true;
  }

  return (
    <EnergyContext.Provider
      value={{
        level: state.level,
        events: state.events,
        addEvent,
        updateEvent,
        deleteEvent,
        editingEvent,
        startEditingEvent: setEditingEvent,
        stopEditingEvent: () => setEditingEvent(null),
        onboarded: state.onboarded,
        completeOnboarding,
        username: state.username,
        setUsername,
        hideNotesInShares: state.hideNotesInShares,
        setHideNotesInShares,
        exportCode,
        importCode,
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
