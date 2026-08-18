import { ImageResponse } from "next/og";
import { batteryIcon } from "@/lib/app-icon";

export const dynamic = "force-static";

export async function GET() {
  return new ImageResponse(batteryIcon(192), { width: 192, height: 192 });
}
