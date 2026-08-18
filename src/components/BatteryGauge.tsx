import { batteryColor, batteryStatusLabel } from "@/lib/categories";

export function BatteryGauge({
  level,
  size = "lg",
  showStatus = true,
}: {
  level: number;
  size?: "lg" | "sm";
  showStatus?: boolean;
}) {
  const color = batteryColor(level);
  const width = size === "lg" ? 260 : 140;
  const height = width * 0.46;
  const bodyWidth = width * 0.92;
  const nubWidth = width * 0.05;
  const padding = height * 0.12;
  const innerWidth = bodyWidth - padding * 2;
  const innerHeight = height - padding * 2;
  const fillWidth = (innerWidth * level) / 100;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        width={width}
        height={height + 8}
        viewBox={`0 0 ${width} ${height + 8}`}
        className="drop-shadow-sm"
      >
        <rect
          x={1}
          y={1}
          width={bodyWidth - 2}
          height={height - 2}
          rx={height * 0.16}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={3}
        />
        <rect
          x={padding}
          y={padding}
          width={innerWidth}
          height={innerHeight}
          rx={innerHeight * 0.15}
          fill="#94a3b8"
          opacity={0.12}
        />
        <rect
          x={padding}
          y={padding}
          width={fillWidth}
          height={innerHeight}
          rx={innerHeight * 0.15}
          fill={color}
          style={{ transition: "width 400ms ease, fill 400ms ease" }}
        />
        <rect
          x={bodyWidth}
          y={height / 2 - (height * 0.28) / 2}
          width={nubWidth}
          height={height * 0.28}
          rx={nubWidth * 0.4}
          fill="currentColor"
          opacity={0.35}
        />
      </svg>
      <div className="flex flex-col items-center gap-0.5">
        <span
          className="font-bold tabular-nums"
          style={{ color, fontSize: size === "lg" ? 40 : 22 }}
        >
          {Math.round(level)}%
        </span>
        {size === "lg" && showStatus && (
          <span className="text-sm text-foreground/60">
            {batteryStatusLabel(level)}
          </span>
        )}
      </div>
    </div>
  );
}
