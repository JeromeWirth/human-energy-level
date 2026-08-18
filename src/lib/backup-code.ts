import { EnergyState } from "./types";

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

/** Decodes a backup code back into app state, or null if it's invalid. */
export function decodeState(code: string): EnergyState | null {
  try {
    const binary = atob(code.trim());
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

    return {
      level: parsed.level,
      events: parsed.events,
      onboarded: true,
      username: typeof parsed.username === "string" ? parsed.username : "",
    };
  } catch {
    return null;
  }
}
