"use client";

import { useState } from "react";
import { useEnergy } from "@/lib/energy-context";

export function BackupSheet({
  mode,
  onClose,
}: {
  mode: "export" | "restore";
  onClose: () => void;
}) {
  const { exportCode, importCode, events } = useEnergy();
  const [code, setCode] = useState(mode === "export" ? exportCode() : "");
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [confirmingOverwrite, setConfirmingOverwrite] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError("Couldn't copy automatically — select the text above and copy it manually.");
    }
  }

  function restore() {
    if (events.length > 0 && !confirmingOverwrite) {
      setConfirmingOverwrite(true);
      return;
    }
    setError(null);
    const ok = importCode(code);
    if (!ok) {
      setError("That code doesn't look right. Double check you copied the whole thing.");
      setConfirmingOverwrite(false);
      return;
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 pb-8 flex flex-col gap-4">
        <div className="mx-auto w-10 h-1 rounded-full bg-foreground/20" />
        <div>
          <h2 className="text-lg font-semibold">
            {mode === "export" ? "Export your data" : "Restore from a code"}
          </h2>
          <p className="text-sm text-foreground/50 mt-0.5">
            {mode === "export"
              ? "Copy this code and save it somewhere safe, or paste it into the app on another device."
              : "Paste a backup code exported from another device."}
          </p>
        </div>

        <textarea
          value={code}
          onChange={mode === "restore" ? (e) => setCode(e.target.value) : undefined}
          readOnly={mode === "export"}
          rows={6}
          placeholder={mode === "restore" ? "Paste your code here..." : undefined}
          className="w-full border border-foreground/15 rounded-lg px-3 py-2 text-xs font-mono bg-transparent resize-none"
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        {mode === "export" ? (
          <button
            onClick={copy}
            className="w-full bg-foreground text-background rounded-lg py-3 font-medium"
          >
            {copied ? "Copied!" : "Copy code"}
          </button>
        ) : confirmingOverwrite ? (
          <>
            <p className="text-sm text-red-500 text-center">
              This replaces all {events.length} {events.length === 1 ? "entry" : "entries"} currently
              on this device. This can&apos;t be undone.
            </p>
            <button
              onClick={restore}
              className="w-full bg-red-500 text-white rounded-lg py-3 font-medium"
            >
              Yes, overwrite my data
            </button>
            <button
              onClick={() => setConfirmingOverwrite(false)}
              className="w-full text-foreground/50 text-sm py-1"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={restore}
            disabled={!code.trim()}
            className="w-full bg-foreground text-background rounded-lg py-3 font-medium disabled:opacity-50"
          >
            Restore
          </button>
        )}
      </div>
    </div>
  );
}
