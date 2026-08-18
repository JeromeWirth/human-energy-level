/** Shared field-level checks for validating decoded share/backup codes. */

export function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

export function isBoundedString(value: unknown, maxLength: number): value is string {
  return typeof value === "string" && value.length <= maxLength;
}

export function clampLevel(value: number): number {
  return Math.min(100, Math.max(0, value));
}

export const MAX_TEXT_LENGTH = 200;
export const MAX_EMOJI_LENGTH = 32;
export const MAX_USERNAME_LENGTH = 24;
