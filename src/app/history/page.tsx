"use client";

import { useMemo, useState } from "react";
import { useEnergy } from "@/lib/energy-context";
import { BatteryHistoryChart } from "@/components/BatteryHistoryChart";
import { buildHistorySeries, WINDOW_OPTIONS, WindowDays } from "@/lib/history";

export default function HistoryPage() {
  const { events, level, deleteEvent, hydrated } = useEnergy();
  const [windowDays, setWindowDays] = useState<WindowDays>(7);

  const points = useMemo(
    () => buildHistorySeries(events, level, windowDays),
    [events, level, windowDays]
  );

  if (!hydrated) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-lg font-semibold">History</h1>
          <div className="flex border border-foreground/15 rounded-lg overflow-hidden text-xs">
            {WINDOW_OPTIONS.map((opt) => (
              <button
                key={opt.label}
                onClick={() => setWindowDays(opt.days)}
                className={`px-2.5 py-1.5 ${
                  windowDays === opt.days
                    ? "bg-foreground text-background"
                    : "text-foreground/60"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <div className="border border-foreground/10 rounded-xl px-2 pt-3 pb-1">
          <BatteryHistoryChart points={points} windowDays={windowDays} />
        </div>
      </div>

      {events.length === 0 ? (
        <p className="text-sm text-foreground/40 py-6 text-center border border-dashed border-foreground/15 rounded-xl">
          No entries yet.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {events.map((e) => (
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
                  <p className="text-xs text-foreground/40">
                    {new Date(e.timestamp).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <p
                  className={`text-sm font-semibold ${
                    e.delta > 0 ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {e.delta > 0 ? `+${e.delta}` : e.delta}
                </p>
                <button
                  onClick={() => deleteEvent(e.id)}
                  aria-label="Delete entry"
                  className="text-foreground/30 text-lg leading-none"
                >
                  ×
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
