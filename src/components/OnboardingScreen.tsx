"use client";

import { useState } from "react";
import { BatteryGauge } from "./BatteryGauge";
import { useEnergy } from "@/lib/energy-context";

export function OnboardingScreen() {
  const { completeOnboarding } = useEnergy();
  const [level, setLevel] = useState(70);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6 py-10 text-center">
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

      <button
        onClick={() => completeOnboarding(level)}
        className="w-full max-w-xs bg-foreground text-background rounded-lg py-3 font-medium"
      >
        Get started
      </button>
    </div>
  );
}
