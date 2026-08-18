import { EnergyEvent } from "./types";
import { isToday } from "./day-groups";

export interface DaySnapshotEvent {
  emoji: string;
  label: string;
  delta: number;
  note?: string;
  timestamp: number;
}

export interface DaySnapshot {
  level: number;
  generatedAt: number;
  username: string;
  events: DaySnapshotEvent[];
}

export function buildDaySnapshot(
  level: number,
  events: EnergyEvent[],
  username: string
): DaySnapshot {
  return {
    level,
    generatedAt: Date.now(),
    username,
    events: events
      .filter((e) => isToday(e.timestamp))
      .map((e) => ({
        emoji: e.emoji,
        label: e.label,
        delta: e.delta,
        note: e.note,
        timestamp: e.timestamp,
      })),
  };
}

function toBase64Url(binary: string): string {
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(code: string): string {
  const padded = code.replace(/-/g, "+").replace(/_/g, "/");
  const padding = padded.length % 4 === 0 ? "" : "=".repeat(4 - (padded.length % 4));
  return atob(padded + padding);
}

/** Encodes a day snapshot as a URL-safe, copy-pasteable code. */
export function encodeDaySnapshot(snapshot: DaySnapshot): string {
  const json = JSON.stringify(snapshot);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return toBase64Url(binary);
}

/** Decodes a day-snapshot code, or null if it's invalid. */
export function decodeDaySnapshot(code: string): DaySnapshot | null {
  try {
    const binary = fromBase64Url(code.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const parsed = JSON.parse(new TextDecoder().decode(bytes));

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      typeof parsed.level !== "number" ||
      !Array.isArray(parsed.events)
    ) {
      return null;
    }

    return parsed as DaySnapshot;
  } catch {
    return null;
  }
}
