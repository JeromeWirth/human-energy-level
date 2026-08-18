"use client";

import { useState } from "react";
import { BatteryGauge } from "./BatteryGauge";
import { useEnergy } from "@/lib/energy-context";

export function OnboardingScreen() {
  const { completeOnboarding, importCode } = useEnergy();
  const [level, setLevel] = useState(70);
  const [username, setUsername] = useState("");
  const [restoring, setRestoring] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);

  function restore() {
    setError(null);
    const ok = importCode(code);
    if (!ok) {
      setError("That code doesn't look right. Double check you copied the whole thing.");
    }
  }

  if (restoring) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-10 text-center">
        <div>
          <h1 className="text-xl font-semibold mb-1">Restore your data</h1>
          <p className="text-sm text-foreground/60">
            Paste the backup code from your other device.
          </p>
        </div>

        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          rows={6}
          placeholder="Paste your code here..."
          className="w-full max-w-xs border border-foreground/15 rounded-lg px-3 py-2 text-xs font-mono bg-transparent resize-none"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          onClick={restore}
          disabled={!code.trim()}
          className="w-full max-w-xs bg-foreground text-background rounded-lg py-3 font-medium disabled:opacity-50"
        >
          Restore
        </button>
        <button
          onClick={() => setRestoring(false)}
          className="text-sm text-foreground/50"
        >
          Start fresh instead
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6 py-10 text-center">
      <div>
        <h1 className="text-xl font-semibold mb-1">Welcome</h1>
        <p className="text-sm text-foreground/60">
          How&apos;s your energy right now? You can log what changes it from
          here on.
        </p>
      </div>

      <BatteryGauge level={level} />

      <input
        type="range"
        min={0}
        max={100}
        value={level}
        onChange={(e) => setLevel(Number(e.target.value))}
        className="w-full max-w-xs"
        aria-label="Starting energy level"
      />

      <label className="w-full max-w-xs flex flex-col gap-1.5 text-left">
        <span className="text-sm text-foreground/70">
          What should we call you?
        </span>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Your name"
          maxLength={24}
          className="border border-foreground/15 rounded-lg px-3 py-2 bg-transparent"
        />
      </label>

      <button
        onClick={() => completeOnboarding(level, username)}
        className="w-full max-w-xs bg-foreground text-background rounded-lg py-3 font-medium"
      >
        Get started
      </button>

      <button
        onClick={() => setRestoring(true)}
        className="text-sm text-foreground/50"
      >
        Restore from a backup code instead
      </button>
    </div>
  );
}
