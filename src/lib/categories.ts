import { Category } from "./types";

export const PRESET_CATEGORIES: Category[] = [
  { id: "preset-argument", label: "Argument", emoji: "💥", defaultDelta: -15, isCustom: false },
  { id: "preset-misunderstood", label: "Felt misunderstood", emoji: "😞", defaultDelta: -10, isCustom: false },
  { id: "preset-no-affection", label: "No affection today", emoji: "🚫", defaultDelta: -10, isCustom: false },
  { id: "preset-ignored", label: "Felt ignored", emoji: "🙈", defaultDelta: -15, isCustom: false },
  { id: "preset-nothing", label: "Nothing happened today", emoji: "😐", defaultDelta: -5, isCustom: false },
  { id: "preset-hug", label: "Hug", emoji: "🤗", defaultDelta: 10, isCustom: false },
  { id: "preset-listened", label: "Really listened to", emoji: "👂", defaultDelta: 15, isCustom: false },
  { id: "preset-compliment", label: "Compliment", emoji: "✨", defaultDelta: 10, isCustom: false },
  { id: "preset-surprise", label: "Surprise", emoji: "🎁", defaultDelta: 15, isCustom: false },
  { id: "preset-quality-time", label: "Quality time", emoji: "⏳", defaultDelta: 10, isCustom: false },
];

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
