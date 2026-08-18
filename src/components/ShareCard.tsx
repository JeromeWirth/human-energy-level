import { forwardRef } from "react";
import { BatteryGauge } from "./BatteryGauge";
import { batteryColor } from "@/lib/categories";
import { EnergyEvent } from "@/lib/types";
import { timeAgo } from "@/lib/time";

const MAX_VISIBLE_EVENTS = 5;
const CARD_WIDTH = 380;

export const ShareCard = forwardRef<
  HTMLDivElement,
  { level: number; events: EnergyEvent[] }
>(function ShareCard({ level, events }, ref) {
  const color = batteryColor(level);
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const visible = events.slice(0, MAX_VISIBLE_EVENTS);
  const hiddenCount = events.length - visible.length;

  return (
    <div
      ref={ref}
      style={{
        width: CARD_WIDTH,
        position: "relative",
        overflow: "hidden",
        background: "var(--background)",
        color: "var(--foreground)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "32px 24px 28px",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 50% 30%, ${color}33, transparent 65%)`,
        }}
      />

      <div style={{ position: "relative", textAlign: "center" }}>
        <p style={{ fontSize: 13, letterSpacing: 1, opacity: 0.55, margin: 0 }}>
          MY ENERGY LEVEL
        </p>
        <p style={{ fontSize: 13, opacity: 0.55, margin: "2px 0 0" }}>
          {today}
        </p>
      </div>

      <div style={{ position: "relative", marginTop: 20, marginBottom: 24 }}>
        <BatteryGauge level={level} size="lg" />
      </div>

      <div style={{ position: "relative", width: "100%" }}>
        <p
          style={{
            fontSize: 12,
            letterSpacing: 0.5,
            opacity: 0.5,
            margin: "0 0 10px",
            textTransform: "uppercase",
          }}
        >
          Recent activity
        </p>

        {visible.length === 0 ? (
          <p style={{ fontSize: 13, opacity: 0.4, margin: 0, textAlign: "center" }}>
            No activity logged yet.
          </p>
        ) : (
          visible.map((e, i) => (
            <div
              key={e.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: "1px solid color-mix(in srgb, var(--foreground) 12%, transparent)",
                borderRadius: 12,
                padding: "9px 12px",
                marginTop: i === 0 ? 0 : 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontSize: 18, marginRight: 10 }}>{e.emoji}</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{e.label}</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    margin: 0,
                    color: e.delta > 0 ? "#16a34a" : "#ef4444",
                  }}
                >
                  {e.delta > 0 ? `+${e.delta}` : e.delta}
                </p>
                <p style={{ fontSize: 10, opacity: 0.5, margin: 0 }}>
                  {timeAgo(e.timestamp)}
                </p>
              </div>
            </div>
          ))
        )}

        {hiddenCount > 0 && (
          <p
            style={{
              fontSize: 12,
              opacity: 0.4,
              textAlign: "center",
              margin: "8px 0 0",
            }}
          >
            +{hiddenCount} more
          </p>
        )}
      </div>

      <p
        style={{
          position: "relative",
          fontSize: 11,
          opacity: 0.3,
          margin: "24px 0 0",
        }}
      >
        Energy Level
      </p>
    </div>
  );
});
