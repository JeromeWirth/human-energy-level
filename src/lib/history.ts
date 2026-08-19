import { EnergyEvent } from "./types";
import { startOfDay } from "./day-groups";

export interface HistoryPoint {
  timestamp: number;
  level: number;
}

export const WINDOW_OPTIONS = [
  { label: "Today", days: "today" },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "All", days: null },
] as const;

export type WindowDays = (typeof WINDOW_OPTIONS)[number]["days"];

/** Start of the given window, or null for "All" (caller decides the bound). */
function windowStartFor(windowDays: WindowDays, now: number): number | null {
  if (windowDays === null) return null;
  if (windowDays === "today") return startOfDay(new Date(now));
  return now - windowDays * 86_400_000;
}

/** Filters events to those within the given window (or all, when null). */
export function filterEventsByWindow(
  events: EnergyEvent[],
  windowDays: WindowDays,
  now: number = Date.now()
): EnergyEvent[] {
  const cutoff = windowStartFor(windowDays, now);
  if (cutoff === null) return events;
  return events.filter((e) => e.timestamp >= cutoff);
}

/**
 * Reconstructs a step-wise battery level series for the given window.
 * Events only carry the level *after* they were logged, so the level
 * "in effect" at any point is whatever the most recent prior event set it
 * to (or an approximation of the pre-history level if none exists yet).
 */
export function buildHistorySeries(
  events: EnergyEvent[],
  currentLevel: number,
  windowDays: WindowDays,
  now: number = Date.now()
): HistoryPoint[] {
  const ascending = [...events].sort((a, b) => a.timestamp - b.timestamp);

  if (ascending.length === 0) {
    const start = windowStartFor(windowDays, now) ?? now - 7 * 86_400_000;
    return [
      { timestamp: start, level: currentLevel },
      { timestamp: now, level: currentLevel },
    ];
  }

  const windowStart = windowStartFor(windowDays, now) ?? ascending[0].timestamp;

  const before = ascending.filter((e) => e.timestamp <= windowStart);
  const within = ascending.filter((e) => e.timestamp > windowStart);

  const startLevel =
    before.length > 0
      ? before[before.length - 1].levelAfter
      : Math.min(100, Math.max(0, ascending[0].levelAfter - ascending[0].delta));

  const points: HistoryPoint[] = [
    { timestamp: windowStart, level: startLevel },
    ...within.map((e) => ({ timestamp: e.timestamp, level: e.levelAfter })),
  ];

  const last = points[points.length - 1];
  if (last.timestamp < now) {
    points.push({ timestamp: now, level: currentLevel });
  }

  return points;
}
