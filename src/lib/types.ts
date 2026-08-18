export interface Category {
  id: string;
  label: string;
  emoji: string;
  defaultDelta: number;
  isCustom: boolean;
}

export interface EnergyEvent {
  id: string;
  categoryId: string;
  label: string;
  emoji: string;
  delta: number;
  note?: string;
  timestamp: number;
}

export interface EnergyState {
  level: number;
  events: EnergyEvent[];
  customCategories: Category[];
  onboarded: boolean;
}
