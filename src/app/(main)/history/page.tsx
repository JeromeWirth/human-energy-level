"use client";

import { useMemo, useState } from "react";
import { useEnergy } from "@/lib/energy-context";
import { BatteryHistoryChart } from "@/components/BatteryHistoryChart";
import { Pressable } from "@/components/Pressable";
import {
  buildHistorySeries,
  filterEventsByWindow,
  WINDOW_OPTIONS,
  WindowDays,
} from "@/lib/history";
import { deltaColorClass } from "@/lib/categories";

export default function HistoryPage() {
  const { events, level, startEditingEvent, hydrated } = useEnergy();
  const [windowDays, setWindowDays] = useState<WindowDays>("today");

  const points = useMemo(
    () => buildHistorySeries(events, level, windowDays),
    [events, level, windowDays]
  );

  const windowedEvents = useMemo(
    () => filterEventsByWindow(events, windowDays),
    [events, windowDays]
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

      {windowedEvents.length === 0 ? (
        <p className="text-sm text-foreground/40 py-6 text-center border border-dashed border-foreground/15 rounded-xl">
          {events.length === 0 ? "No entries yet." : "No entries in this range."}
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {windowedEvents.map((e) => (
            <li
              key={e.id}
              className="flex items-center justify-between border border-foreground/10 rounded-xl pl-3 pr-2 py-2.5 overflow-hidden hover:bg-foreground/5 transition-colors"
            >
              <Pressable
                onClick={() => startEditingEvent(e)}
                className="flex-1 flex items-center gap-2.5 text-left min-w-0"
              >
                <span className="text-xl">{e.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium">{e.label}</p>
                  {e.note && (
                    <p className="text-xs text-foreground/50 truncate">
                      {e.note}
                    </p>
                  )}
                  <p className="text-xs text-foreground/40">
                    {new Date(e.timestamp).toLocaleString(undefined, {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </Pressable>
              <p
                className={`text-sm font-semibold pl-2 ${deltaColorClass(
                  e.delta
                )}`}
              >
                {e.delta > 0 ? `+${e.delta}` : e.delta}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
