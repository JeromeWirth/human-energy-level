"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { EnergyProvider, useEnergy } from "@/lib/energy-context";
import { BottomNav } from "./BottomNav";
import { Fab } from "./Fab";
import { EventSheet } from "./EventSheet";
import { ShareModal } from "./ShareModal";
import { OnboardingScreen } from "./OnboardingScreen";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <EnergyProvider>
      <AppShellInner>{children}</AppShellInner>
    </EnergyProvider>
  );
}

function AppShellInner({ children }: { children: ReactNode }) {
  const { hydrated, onboarded, username, editingEvent, stopEditingEvent } =
    useEnergy();
  const [addOpen, setAddOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);
  const pathname = usePathname();
  const title = username ? `${username} Energy Level` : "Energy Level";

  useEffect(() => {
    if (!hydrated) return;
    // Next reapplies the root layout's static title on every client-side
    // navigation, so this has to re-run per route (not just when the
    // username changes) to win against that reset.
    document.title = title;
  }, [hydrated, title, pathname]);

  if (!hydrated) return null;
  if (!onboarded) return <OnboardingScreen />;

  function closeEventSheet() {
    setAddOpen(false);
    stopEditingEvent();
  }

  return (
    <>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-foreground/10 pt-[env(safe-area-inset-top)]">
        <div className="mx-auto max-w-md flex items-center justify-between px-4 py-3">
          <span className="font-semibold truncate mr-3">{title}</span>
          <button
            onClick={() => setShareOpen(true)}
            aria-label="Share"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-foreground/20"
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 16V4" />
              <path d="M7 9l5-5 5 5" />
              <path d="M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-4 pt-4 pb-24">
        {children}
      </main>

      <Fab onClick={() => setAddOpen(true)} />
      <BottomNav />

      {(addOpen || editingEvent) && (
        <EventSheet event={editingEvent ?? undefined} onClose={closeEventSheet} />
      )}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </>
  );
}
