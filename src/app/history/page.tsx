"use client";

import { useEnergy } from "@/lib/energy-context";

export default function HistoryPage() {
  const { events, deleteEvent, hydrated } = useEnergy();

  if (!hydrated) return null;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-lg font-semibold">History</h1>

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
