"use client";

import { useState } from "react";
import { useEnergy } from "@/lib/energy-context";
import { BackupSheet } from "@/components/BackupSheet";

export default function SettingsPage() {
  const { username, setUsername, hydrated } = useEnergy();
  // null = no local edit yet, so the field tracks the saved username as it
  // loads in from storage; once the user types, their draft takes over.
  const [draft, setDraft] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [backupMode, setBackupMode] = useState<"export" | "restore" | null>(null);
  const name = draft ?? username;

  if (!hydrated) return null;

  function saveName() {
    setUsername(name);
    setDraft(name);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-lg font-semibold">Settings</h1>

      <section>
        <h2 className="text-sm font-medium text-foreground/60 mb-1">
          Your name
        </h2>
        <p className="text-xs text-foreground/45 mb-3">
          Shown on links and previews you share, e.g. &ldquo;{name || "Jamie"}
          &rsquo;s Energy Level&rdquo;.
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={name}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Your name"
            maxLength={24}
            className="flex-1 border border-foreground/15 rounded-lg px-3 py-2 bg-transparent"
          />
          <button
            onClick={saveName}
            className="border border-foreground/15 rounded-lg px-4 py-2 text-sm font-medium"
          >
            {saved ? "Saved!" : "Save"}
          </button>
        </div>
      </section>

      <section className="border-t border-foreground/10 pt-6">
        <h2 className="text-sm font-medium text-foreground/60 mb-1">
          Backup &amp; transfer
        </h2>
        <p className="text-xs text-foreground/45 mb-3">
          Move your data to another device, or save a copy for yourself.
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setBackupMode("export")}
            className="flex-1 border border-foreground/15 rounded-lg py-2.5 text-sm font-medium"
          >
            Export data
          </button>
          <button
            onClick={() => setBackupMode("restore")}
            className="flex-1 border border-foreground/15 rounded-lg py-2.5 text-sm font-medium"
          >
            Restore from code
          </button>
        </div>
      </section>

      {backupMode && (
        <BackupSheet mode={backupMode} onClose={() => setBackupMode(null)} />
      )}
    </div>
  );
}
