import { EnergyState, EnergyEvent, DEFAULT_HIDE_NOTES_IN_SHARES } from "./types";
import {
  isFiniteNumber,
  isBoundedString,
  clampLevel,
  MAX_TEXT_LENGTH,
  MAX_EMOJI_LENGTH,
  MAX_USERNAME_LENGTH,
} from "./decode-utils";

const MAX_ID_LENGTH = 100;
// Decoded entirely client-side from the user's own paste, so this is a
// sanity bound rather than an anti-abuse one — generous by design.
const MAX_BACKUP_EVENTS = 10_000;

/** Encodes app state as a portable, copy-pasteable backup code. */
export function encodeState(state: EnergyState): string {
  const json = JSON.stringify(state);
  const bytes = new TextEncoder().encode(json);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

function isValidBackupEvent(value: unknown): value is EnergyEvent {
  if (typeof value !== "object" || value === null) return false;
  const e = value as Record<string, unknown>;
  return (
    isBoundedString(e.id, MAX_ID_LENGTH) &&
    isBoundedString(e.categoryId, MAX_ID_LENGTH) &&
    isBoundedString(e.label, MAX_TEXT_LENGTH) &&
    isBoundedString(e.emoji, MAX_EMOJI_LENGTH) &&
    isFiniteNumber(e.delta) &&
    isFiniteNumber(e.timestamp) &&
    (e.note === undefined || isBoundedString(e.note, MAX_TEXT_LENGTH))
  );
}

/** Decodes a backup code back into app state, or null if it's invalid. */
export function decodeState(code: string): EnergyState | null {
  try {
    const binary = atob(code.trim());
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    const parsed = JSON.parse(new TextDecoder().decode(bytes));

    if (typeof parsed !== "object" || parsed === null) return null;

    // Older backup codes only carried the current `level`, not a baseline —
    // fall back to it as an approximation so pre-existing codes still import.
    const rawBaseline =
      typeof parsed.baselineLevel === "number" ? parsed.baselineLevel : parsed.level;

    if (
      !isFiniteNumber(rawBaseline) ||
      !isBoundedString(parsed.username, MAX_USERNAME_LENGTH) ||
      !Array.isArray(parsed.events) ||
      parsed.events.length > MAX_BACKUP_EVENTS ||
      !parsed.events.every(isValidBackupEvent)
    ) {
      return null;
    }

    const baselineLevel = clampLevel(rawBaseline);
    return {
      baselineLevel,
      level: baselineLevel,
      events: parsed.events,
      onboarded: true,
      username: parsed.username,
      hideNotesInShares:
        typeof parsed.hideNotesInShares === "boolean"
          ? parsed.hideNotesInShares
          : DEFAULT_HIDE_NOTES_IN_SHARES,
    };
  } catch {
    return null;
  }
}
