"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { Category, EnergyEvent, EnergyState } from "./types";
import { PRESET_CATEGORIES } from "./categories";

const STORAGE_KEY = "hel-energy-state-v1";
const BASELINE_LEVEL = 70;

const DEFAULT_STATE: EnergyState = {
  level: BASELINE_LEVEL,
  events: [],
  customCategories: [],
  onboarded: false,
};

function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

interface EnergyContextValue {
  level: number;
  events: EnergyEvent[];
  customCategories: Category[];
  allCategories: Category[];
  addEvent: (
    category: Category,
    delta: number,
    note?: string,
    timestamp?: number
  ) => void;
  deleteEvent: (id: string) => void;
  addCustomCategory: (
    label: string,
    emoji: string,
    defaultDelta: number
  ) => void;
  deleteCustomCategory: (id: string) => void;
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
          events: parsed.events ?? [],
          customCategories: parsed.customCategories ?? [],
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
    const event: EnergyEvent = {
      id: crypto.randomUUID(),
      categoryId: category.id,
      label: category.label,
      emoji: category.emoji,
      delta,
      note: note?.trim() ? note.trim() : undefined,
      timestamp: timestamp ?? Date.now(),
    };
    setState((prev) => ({
      ...prev,
      level: clamp(prev.level + delta),
      events: [event, ...prev.events].sort((a, b) => b.timestamp - a.timestamp),
    }));
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

  function addCustomCategory(
    label: string,
    emoji: string,
    defaultDelta: number
  ) {
    const category: Category = {
      id: crypto.randomUUID(),
      label,
      emoji,
      defaultDelta,
      isCustom: true,
    };
    setState((prev) => ({
      ...prev,
      customCategories: [...prev.customCategories, category],
    }));
  }

  function deleteCustomCategory(id: string) {
    setState((prev) => ({
      ...prev,
      customCategories: prev.customCategories.filter((c) => c.id !== id),
    }));
  }

  function completeOnboarding(level: number) {
    setState((prev) => ({ ...prev, level: clamp(level), onboarded: true }));
  }

  const allCategories = [...PRESET_CATEGORIES, ...state.customCategories];

  return (
    <EnergyContext.Provider
      value={{
        level: state.level,
        events: state.events,
        customCategories: state.customCategories,
        allCategories,
        addEvent,
        deleteEvent,
        addCustomCategory,
        deleteCustomCategory,
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
