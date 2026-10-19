import { ReactNode } from "react";
import Script from "next/script";
import { AppShell } from "@/components/AppShell";

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AppShell>{children}</AppShell>
      {/* Only here, not in the root layout: a shared /day/<code> URL carries
          the day's entries and notes, and Umami records every page URL. */}
      <Script
        id="umami-analytics"
        src="https://stats.jeromewirth.de/script.js"
        data-website-id="7faf77a9-c471-4499-bfa8-d41df1e2a859"
        strategy="afterInteractive"
      />
    </>
  );
}
