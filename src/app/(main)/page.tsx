"use client";

import { useEffect, useState } from "react";
import { BatteryGauge } from "@/components/BatteryGauge";
import { Pressable } from "@/components/Pressable";
import { useEnergy } from "@/lib/energy-context";
import { timeAgo } from "@/lib/time";
import { groupEventsByDay } from "@/lib/day-groups";
import { deltaColorClass } from "@/lib/categories";

const COMPACT_SCROLL_THRESHOLD = 24;

export default function Home() {
  const { level, events, hydrated, startEditingEvent } = useEnergy();
  const [compact, setCompact] = useState(false);
  const [headerOffset, setHeaderOffset] = useState(0);

  useEffect(() => {
    const header = document.querySelector("header");
    // One-time measurement of the app header's rendered height, which isn't
    // known until after mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (header) setHeaderOffset(header.getBoundingClientRect().height);

    function onScroll() {
      setCompact(window.scrollY > COMPACT_SCROLL_THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!hydrated) return null;

  const groups = groupEventsByDay(events);

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Scroll to top"
        className={`sticky z-10 w-full flex justify-center bg-background/95 backdrop-blur transition-[padding] duration-300 ${
          compact ? "py-2" : "pt-6 pb-2"
        }`}
        style={{ top: headerOffset }}
      >
        <BatteryGauge
          level={level}
          size={compact ? "xs" : "lg"}
          layout={compact ? "row" : "column"}
        />
      </button>

      <div className="w-full">
        {events.length === 0 ? (
          <p className="text-sm text-foreground/40 py-6 text-center border border-dashed border-foreground/15 rounded-xl">
            Tap + to log what happened today.
          </p>
        ) : (
          <div className="flex flex-col gap-5">
            {groups.map((group) => (
              <div key={group.label}>
                <h3 className="text-xs font-medium uppercase tracking-wide text-foreground/40 mb-2">
                  {group.label}
                </h3>
                <ul className="flex flex-col gap-2">
                  {group.events.map((e) => (
                    <li key={e.id}>
                      <Pressable
                        onClick={() => startEditingEvent(e)}
                        className="w-full flex items-center justify-between border border-foreground/10 rounded-xl px-3 py-2.5 text-left"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">{e.emoji}</span>
                          <div>
                            <p className="text-sm font-medium">{e.label}</p>
                            {e.note && (
                              <p className="text-xs text-foreground/50">
                                {e.note}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`text-sm font-semibold ${deltaColorClass(
                              e.delta
                            )}`}
                          >
                            {e.delta > 0 ? `+${e.delta}` : e.delta}
                          </p>
                          <p className="text-xs text-foreground/40">
                            {timeAgo(e.timestamp)}
                          </p>
                        </div>
                      </Pressable>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
