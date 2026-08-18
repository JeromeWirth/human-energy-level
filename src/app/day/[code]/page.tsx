import Link from "next/link";
import type { Metadata } from "next";
import { decodeDaySnapshot } from "@/lib/day-share";
import { BatteryGauge } from "@/components/BatteryGauge";

type Params = Promise<{ code: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { code } = await params;
  const snapshot = decodeDaySnapshot(code);
  const level = snapshot ? Math.round(snapshot.level) : null;
  const label = snapshot?.username
    ? `${snapshot.username}'s Energy Level`
    : "Shared Energy Level";

  return {
    title: level !== null ? `${level}% · ${label}` : "Energy Level",
    description:
      level !== null
        ? `${snapshot?.username ? `${snapshot.username}'s` : "Their"} energy is at ${level}% today.`
        : "A shared energy level snapshot.",
  };
}

export default async function DaySharePage({ params }: { params: Params }) {
  const { code } = await params;
  const snapshot = decodeDaySnapshot(code);

  if (!snapshot) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-lg font-semibold">This link isn&apos;t valid</p>
        <p className="text-sm text-foreground/60">
          The code might be incomplete, or the message got cut off when it
          was shared.
        </p>
        <Link href="/" className="text-sm text-foreground/50 underline mt-2">
          Open Energy Level
        </Link>
      </main>
    );
  }

  const date = new Date(snapshot.generatedAt).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
  const label = snapshot.username
    ? `${snapshot.username}'s Energy Level`
    : "Shared Energy Level";

  return (
    <main className="min-h-screen flex flex-col items-center px-4 pb-12 pt-[max(2.5rem,calc(env(safe-area-inset-top)+1rem))]">
      <div className="w-full max-w-md flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wide text-foreground/45">
            {label}
          </p>
          <p className="text-sm text-foreground/60 mt-0.5">{date}</p>
        </div>

        <BatteryGauge level={snapshot.level} size="lg" />

        <div className="w-full">
          <h2 className="text-xs font-medium uppercase tracking-wide text-foreground/40 mb-2">
            Today
          </h2>
          {snapshot.events.length === 0 ? (
            <p className="text-sm text-foreground/40 py-6 text-center border border-dashed border-foreground/15 rounded-xl">
              Nothing logged today yet.
            </p>
          ) : (
            <ul className="flex flex-col gap-2">
              {snapshot.events.map((e, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between border border-foreground/10 rounded-xl px-3 py-2.5"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-xl">{e.emoji}</span>
                    <div>
                      <p className="text-sm font-medium">{e.label}</p>
                      {e.note && (
                        <p className="text-xs text-foreground/50">{e.note}</p>
                      )}
                    </div>
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      e.delta > 0 ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {e.delta > 0 ? `+${e.delta}` : e.delta}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <Link
          href="/"
          className="text-sm text-foreground/45 underline underline-offset-2"
        >
          Track your own energy level
        </Link>
      </div>
    </main>
  );
}
