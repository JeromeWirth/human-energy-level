import { Category } from "./types";

// Each category is a life domain, not a direction — the same one covers
// both a good and a bad version of that moment. The logged value's sign
// and magnitude (see intensityLabel) carry the direction and strength.
// Specifics go in the note, so there's no need for custom categories.
export const CATEGORIES: Category[] = [
  {
    id: "domain-us",
    label: "Us",
    emoji: "🤝",
    description: "Time, touch, talking, or friction between you two.",
    defaultDelta: 15,
  },
  {
    id: "domain-body",
    label: "Body",
    emoji: "💪",
    description: "Sleep, exercise, illness, physical energy.",
    defaultDelta: 15,
  },
  {
    id: "domain-mind",
    label: "Mind",
    emoji: "🧠",
    description: "Stress, mood, focus, mental load.",
    defaultDelta: 15,
  },
  {
    id: "domain-life",
    label: "Life",
    emoji: "🌍",
    description: "Work, chores, logistics, everything else.",
    defaultDelta: 15,
  },
];

export function intensityLabel(delta: number): string {
  const abs = Math.abs(delta);
  if (delta > 0) {
    if (abs > 25) return "Deeply charging";
    if (abs > 10) return "Charging";
    return "Slightly charging";
  }
  if (delta < 0) {
    if (abs > 25) return "Deeply draining";
    if (abs > 10) return "Draining";
    return "Slightly draining";
  }
  return "Neutral";
}

export function batteryColor(level: number): string {
  if (level > 60) return "#22c55e";
  if (level > 20) return "#eab308";
  return "#ef4444";
}

export function batteryStatusLabel(level: number): string {
  if (level > 60) return "Charged";
  if (level > 20) return "Getting low";
  return "Critical";
}
