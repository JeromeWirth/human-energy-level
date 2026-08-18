import { EnergyEvent } from "./types";

export interface HistoryPoint {
  timestamp: number;
  level: number;
}

export const WINDOW_OPTIONS = [
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "All", days: null },
] as const;

export type WindowDays = (typeof WINDOW_OPTIONS)[number]["days"];

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
    const start = windowDays ? now - windowDays * 86_400_000 : now - 7 * 86_400_000;
    return [
      { timestamp: start, level: currentLevel },
      { timestamp: now, level: currentLevel },
    ];
  }

  const windowStart = windowDays
    ? now - windowDays * 86_400_000
    : ascending[0].timestamp;

  const before = ascending.filter((e) => e.timestamp <= windowStart);
  const within = ascending.filter((e) => e.timestamp > windowStart);

  const startLevel =
    before.length > 0
      ? before[before.length - 1].levelAfter
      : ascending[0].levelAfter - ascending[0].delta;

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
