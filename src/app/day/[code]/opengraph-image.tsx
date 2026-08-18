import { ImageResponse } from "next/og";
import { decodeDaySnapshot } from "@/lib/day-share";
import { batteryColor, batteryStatusLabel } from "@/lib/categories";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BATTERY_W = 420;
const BATTERY_H = 196;
const PAD = 16;
const NUB_W = 22;

export default async function Image({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const snapshot = decodeDaySnapshot(code);
  const level = snapshot ? Math.max(0, Math.min(100, snapshot.level)) : 0;
  const color = batteryColor(level);
  const status = batteryStatusLabel(level);
  const fillWidth = Math.max(6, Math.round(((BATTERY_W - PAD * 2) * level) / 100));
  const label = snapshot?.username
    ? `${snapshot.username.toUpperCase()} ENERGY LEVEL`
    : "MY ENERGY LEVEL";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 22,
            letterSpacing: 4,
            color: "#8c8c8c",
            marginBottom: 28,
          }}
        >
          {label}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: BATTERY_W,
            height: BATTERY_H,
            border: "10px solid #d4d4d4",
            borderRadius: 32,
            padding: PAD,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              width: fillWidth,
              height: BATTERY_H - PAD * 2,
              background: color,
              borderRadius: 18,
            }}
          />
          <div
            style={{
              display: "flex",
              position: "absolute",
              right: -NUB_W,
              top: BATTERY_H / 2 - 34,
              width: NUB_W,
              height: 68,
              background: "#d4d4d4",
              borderRadius: 8,
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            fontSize: 96,
            fontWeight: 700,
            color,
            marginTop: 40,
          }}
        >
          {Math.round(level)}%
        </div>
        <div style={{ display: "flex", fontSize: 30, color: "#a3a3a3", marginTop: 4 }}>
          {status}
        </div>
      </div>
    ),
    {
      ...size,
      // The image is a pure function of `code`, so it's safe to cache
      // per-URL at the CDN indefinitely — ImageResponse otherwise defaults
      // to `max-age=0, must-revalidate`, meaning zero CDN caching and a
      // fresh serverless render on every single request.
      headers: {
        "Cache-Control": "public, immutable, no-transform, s-maxage=31536000",
      },
    }
  );
}
