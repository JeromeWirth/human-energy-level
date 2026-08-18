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

export interface EnergyState {
  /** Level the replay starts from, before any event's delta is applied. */
  baselineLevel: number;
  level: number;
  events: EnergyEvent[];
  onboarded: boolean;
  username: string;
}
