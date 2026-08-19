import { EnergyEvent } from "./types";
import { isToday } from "./day-groups";
import {
  isFiniteNumber,
  isBoundedString,
  clampLevel,
  MAX_TEXT_LENGTH,
  MAX_EMOJI_LENGTH,
  MAX_USERNAME_LENGTH,
} from "./decode-utils";

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
  /** The sharer's local date, pre-formatted at share time so the viewer
   *  sees the sharer's actual day rather than a server-timezone reformat. */
  dateLabel: string;
  username: string;
  events: DaySnapshotEvent[];
}

// A day's worth of logging is realistically under 20 events; 100 leaves
// generous headroom. Decoded server-side per request, so both caps also
// bound the work an arbitrary URL can make the server do.
const MAX_SNAPSHOT_EVENTS = 100;
const MAX_CODE_LENGTH = 20_000;

export function buildDaySnapshot(
  level: number,
  events: EnergyEvent[],
  username: string,
  includeNotes: boolean
): DaySnapshot {
  return {
    level,
    generatedAt: Date.now(),
    dateLabel: new Date().toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
    }),
    username,
    events: events
      .filter((e) => isToday(e.timestamp))
      .map((e) => ({
        emoji: e.emoji,
        label: e.label,
        delta: e.delta,
        note: includeNotes ? e.note : undefined,
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

function isValidSnapshotEvent(value: unknown): value is DaySnapshotEvent {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    isBoundedString(e.emoji, MAX_EMOJI_LENGTH) &&
    isBoundedString(e.label, MAX_TEXT_LENGTH) &&
    isFiniteNumber(e.delta) &&
    isFiniteNumber(e.timestamp) &&
    (e.note === undefined || isBoundedString(e.note, MAX_TEXT_LENGTH))
  );
}

/** Decodes a day-snapshot code, or null if it's invalid. */
export function decodeDaySnapshot(code: string): DaySnapshot | null {
  const trimmed = code.trim();
  if (trimmed.length === 0 || trimmed.length > MAX_CODE_LENGTH) return null;

  try {
    const binary = fromBase64Url(trimmed);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const parsed = JSON.parse(new TextDecoder().decode(bytes));

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !isFiniteNumber(parsed.level) ||
      !isFiniteNumber(parsed.generatedAt) ||
      !isBoundedString(parsed.dateLabel, MAX_TEXT_LENGTH) ||
      !isBoundedString(parsed.username, MAX_USERNAME_LENGTH) ||
      !Array.isArray(parsed.events) ||
      parsed.events.length > MAX_SNAPSHOT_EVENTS ||
      !parsed.events.every(isValidSnapshotEvent)
    ) {
      return null;
    }

    return {
      level: clampLevel(parsed.level),
      generatedAt: parsed.generatedAt,
      dateLabel: parsed.dateLabel,
      username: parsed.username,
      events: parsed.events,
    };
  } catch {
    return null;
  }
}
