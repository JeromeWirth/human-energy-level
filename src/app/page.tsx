"use client";

import { BatteryGauge } from "@/components/BatteryGauge";
import { useEnergy } from "@/lib/energy-context";
import { timeAgo } from "@/lib/time";

export default function Home() {
  const { level, events, hydrated } = useEnergy();

  if (!hydrated) return null;

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="pt-6">
        <BatteryGauge level={level} size="lg" />
      </div>

      <div className="w-full">
        <h2 className="text-sm font-medium text-foreground/60 mb-2">
          Recent activity
        </h2>
        {events.length === 0 ? (
          <p className="text-sm text-foreground/40 py-6 text-center border border-dashed border-foreground/15 rounded-xl">
            Tap + to log what happened today.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {events.slice(0, 5).map((e) => (
              <li
                key={e.id}
                className="flex items-center justify-between border border-foreground/10 rounded-xl px-3 py-2.5"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xl">{e.emoji}</span>
                  <div>
                    <p className="text-sm font-medium">{e.label}</p>
                    {e.note && (
                      <p className="text-xs text-foreground/50">{e.note}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p
                    className={`text-sm font-semibold ${
                      e.delta > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {e.delta > 0 ? `+${e.delta}` : e.delta}
                  </p>
                  <p className="text-xs text-foreground/40">
                    {timeAgo(e.timestamp)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
