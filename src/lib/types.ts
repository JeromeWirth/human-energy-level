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

export interface EnergyState {
  level: number;
  events: EnergyEvent[];
  onboarded: boolean;
}
