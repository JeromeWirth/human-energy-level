export interface Category {
  id: string;
  label: string;
  emoji: string;
  description: string;
  defaultDelta: number;
}

export interface EnergyEvent {
  id: string;
  categoryId: string;
  label: string;
  emoji: string;
  delta: number;
  note?: string;
  timestamp: number;
  /** Battery level immediately after this event was logged, 0-100. */
  levelAfter: number;
}

export const DEFAULT_BASELINE_LEVEL = 70;

export const DEFAULT_HIDE_NOTES_IN_SHARES = true;

export interface EnergyState {
  /** Level the replay starts from, before any event's delta is applied. */
  baselineLevel: number;
  level: number;
  events: EnergyEvent[];
  onboarded: boolean;
  username: string;
  /** When true, notes are omitted from shared pictures and live links. */
  hideNotesInShares: boolean;
}
