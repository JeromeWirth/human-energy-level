"use client";

import { useRef, useState } from "react";
import { HistoryPoint, WindowDays } from "@/lib/history";
import { batteryColor } from "@/lib/categories";

const VB_WIDTH = 340;
const VB_HEIGHT = 180;
const PAD_LEFT = 30;
const PAD_RIGHT = 10;
const PAD_TOP = 12;
const PAD_BOTTOM = 22;

function levelAtTime(points: HistoryPoint[], t: number): number {
  let level = points[0].level;
  for (const p of points) {
    if (p.timestamp <= t) level = p.level;
    else break;
  }
  return level;
}

function formatTick(timestamp: number, windowDays: WindowDays): string {
  const date = new Date(timestamp);
  if (windowDays === "today") {
    return date.toLocaleTimeString(undefined, { hour: "numeric" });
  }
  if (windowDays !== null && windowDays <= 7) {
    return date.toLocaleDateString(undefined, { weekday: "short" });
  }
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

export function BatteryHistoryChart({
  points,
  windowDays,
}: {
  points: HistoryPoint[];
  windowDays: WindowDays;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hover, setHover] = useState<{ x: number; t: number; level: number } | null>(
    null
  );

  const minT = points[0].timestamp;
  const maxT = points[points.length - 1].timestamp;
  const spanT = Math.max(maxT - minT, 1);

  const x = (t: number) =>
    PAD_LEFT + ((t - minT) / spanT) * (VB_WIDTH - PAD_LEFT - PAD_RIGHT);
  const y = (level: number) =>
    VB_HEIGHT -
    PAD_BOTTOM -
    (level / 100) * (VB_HEIGHT - PAD_TOP - PAD_BOTTOM);

  let linePath = `M ${x(points[0].timestamp)} ${y(points[0].level)}`;
  for (let i = 1; i < points.length; i++) {
    linePath += ` H ${x(points[i].timestamp)} V ${y(points[i].level)}`;
  }
  const areaPath = `${linePath} L ${x(maxT)} ${y(0)} L ${x(minT)} ${y(0)} Z`;

  const currentLevel = points[points.length - 1].level;
  const color = batteryColor(currentLevel);

  const ticks = [minT, minT + spanT / 2, maxT];

  function handlePointer(e: React.PointerEvent<SVGSVGElement>) {
    const svg = svgRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const pxInViewbox = ((e.clientX - rect.left) / rect.width) * VB_WIDTH;
    const clampedX = Math.min(
      Math.max(pxInViewbox, PAD_LEFT),
      VB_WIDTH - PAD_RIGHT
    );
    const t =
      minT +
      ((clampedX - PAD_LEFT) / (VB_WIDTH - PAD_LEFT - PAD_RIGHT)) * spanT;
    setHover({ x: clampedX, t, level: levelAtTime(points, t) });
  }

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="w-full h-auto touch-none"
        onPointerDown={handlePointer}
        onPointerMove={handlePointer}
        onPointerLeave={() => setHover(null)}
      >
        {[0, 50, 100].map((level) => (
          <g key={level}>
            <line
              x1={PAD_LEFT}
              x2={VB_WIDTH - PAD_RIGHT}
              y1={y(level)}
              y2={y(level)}
              stroke="currentColor"
              strokeOpacity={0.1}
              strokeWidth={1}
            />
            <text
              x={PAD_LEFT - 6}
              y={y(level)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={9}
              fill="currentColor"
              opacity={0.4}
            >
              {level}
            </text>
          </g>
        ))}

        <path d={areaPath} fill={color} opacity={0.12} />
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        <circle
          cx={x(maxT)}
          cy={y(currentLevel)}
          r={4}
          fill={color}
          stroke="var(--background)"
          strokeWidth={2}
        />

        {ticks.map((t, i) => (
          <text
            key={i}
            x={x(t)}
            y={VB_HEIGHT - 6}
            textAnchor={i === 0 ? "start" : i === ticks.length - 1 ? "end" : "middle"}
            fontSize={9}
            fill="currentColor"
            opacity={0.4}
          >
            {formatTick(t, windowDays)}
          </text>
        ))}

        {hover && (
          <line
            x1={hover.x}
            x2={hover.x}
            y1={PAD_TOP}
            y2={VB_HEIGHT - PAD_BOTTOM}
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
        )}
        {hover && (
          <circle
            cx={hover.x}
            cy={y(hover.level)}
            r={4}
            fill={batteryColor(hover.level)}
            stroke="var(--background)"
            strokeWidth={2}
          />
        )}
      </svg>

      {hover && (
        <div
          className="absolute top-0 -translate-x-1/2 bg-foreground text-background text-xs rounded-md px-2 py-1 pointer-events-none whitespace-nowrap"
          style={{ left: `${(hover.x / VB_WIDTH) * 100}%` }}
        >
          <strong>{Math.round(hover.level)}%</strong>{" "}
          <span className="opacity-70">{formatTick(hover.t, windowDays)}</span>
        </div>
      )}
    </div>
  );
}
