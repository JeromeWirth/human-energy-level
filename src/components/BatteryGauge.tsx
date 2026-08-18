import { batteryColor, batteryStatusLabel } from "@/lib/categories";

// Drawing geometry is computed once at a fixed base size; different `size`
// values only change the CSS display width/height, never the SVG's own
// coordinate system. That makes the rendered size a plain CSS property, so
// it can be smoothly transitioned (e.g. shrinking into a compact header).
const BASE_WIDTH = 260;
const BASE_HEIGHT = BASE_WIDTH * 0.46;
const VIEWBOX_HEIGHT = BASE_HEIGHT + 8;

const DISPLAY_WIDTH = { lg: 260, md: 190, sm: 140, xs: 90 } as const;
const FONT_SIZE = { lg: 40, md: 30, sm: 22, xs: 16 } as const;

export function BatteryGauge({
  level,
  size = "lg",
  showStatus = true,
  layout = "column",
}: {
  level: number;
  size?: "lg" | "md" | "sm" | "xs";
  showStatus?: boolean;
  layout?: "column" | "row";
}) {
  const color = batteryColor(level);
  const bodyWidth = BASE_WIDTH * 0.92;
  const nubWidth = BASE_WIDTH * 0.05;
  const padding = BASE_HEIGHT * 0.12;
  const innerWidth = bodyWidth - padding * 2;
  const innerHeight = BASE_HEIGHT - padding * 2;
  const fillWidth = (innerWidth * level) / 100;

  const displayWidth = DISPLAY_WIDTH[size];
  const displayHeight = (displayWidth / BASE_WIDTH) * VIEWBOX_HEIGHT;
  const isRow = layout === "row";

  return (
    <div
      className={`flex ${
        isRow ? "flex-row items-center gap-3" : "flex-col items-center gap-3"
      }`}
    >
      <svg
        viewBox={`0 0 ${BASE_WIDTH} ${VIEWBOX_HEIGHT}`}
        style={{
          width: displayWidth,
          height: displayHeight,
          transition: "width 300ms ease, height 300ms ease",
        }}
        className="drop-shadow-sm shrink-0"
      >
        <rect
          x={1}
          y={1}
          width={bodyWidth - 2}
          height={BASE_HEIGHT - 2}
          rx={BASE_HEIGHT * 0.16}
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
          y={BASE_HEIGHT / 2 - (BASE_HEIGHT * 0.28) / 2}
          width={nubWidth}
          height={BASE_HEIGHT * 0.28}
          rx={nubWidth * 0.4}
          fill="currentColor"
          opacity={0.35}
        />
      </svg>
      <div
        className={`flex flex-col ${
          isRow ? "items-start gap-0" : "items-center gap-0.5"
        }`}
      >
        <span
          className="font-bold tabular-nums"
          style={{
            color,
            fontSize: FONT_SIZE[size],
            transition: "font-size 300ms ease",
          }}
        >
          {Math.round(level)}%
        </span>
        {showStatus && (
          <span
            className="text-foreground/60"
            style={{
              fontSize: isRow ? 12 : 14,
              transition: "font-size 300ms ease",
            }}
          >
            {batteryStatusLabel(level)}
          </span>
        )}
      </div>
    </div>
  );
}
