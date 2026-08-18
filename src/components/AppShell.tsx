"use client";

import { ReactNode, useState } from "react";
import { EnergyProvider, useEnergy } from "@/lib/energy-context";
import { BottomNav } from "./BottomNav";
import { Fab } from "./Fab";
import { AddEventSheet } from "./AddEventSheet";
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
  const { hydrated, onboarded } = useEnergy();
  const [addOpen, setAddOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  if (!hydrated) return null;
  if (!onboarded) return <OnboardingScreen />;

  return (
    <>
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur border-b border-foreground/10">
        <div className="mx-auto max-w-md flex items-center justify-between px-4 py-3">
          <span className="font-semibold">Energy Level</span>
          <button
            onClick={() => setShareOpen(true)}
            className="text-sm border border-foreground/20 rounded-full px-3 py-1.5"
          >
            Share
          </button>
        </div>
      </header>

      <main className="flex-1 mx-auto w-full max-w-md px-4 pt-4 pb-24">
        {children}
      </main>

      <Fab onClick={() => setAddOpen(true)} />
      <BottomNav />

      {addOpen && <AddEventSheet onClose={() => setAddOpen(false)} />}
      {shareOpen && <ShareModal onClose={() => setShareOpen(false)} />}
    </>
  );
}
