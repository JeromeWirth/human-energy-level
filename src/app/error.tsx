"use client";

import { useState } from "react";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [confirming, setConfirming] = useState(false);

  function resetData() {
    try {
      window.localStorage.clear();
    } catch {
      // ignore
    }
    // A hard navigation (not router.push) is deliberate: the app crashed,
    // so a full reload is needed to re-mount providers against the now-
    // cleared storage rather than continue from whatever broke.
    // eslint-disable-next-line @next/next/no-location-assign-relative-destination
    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-lg font-semibold">Something went wrong</p>
      <p className="text-sm text-foreground/60 max-w-xs">
        Sorry about that. You can try again, or reset the app if it keeps
        happening.
      </p>
      <div className="flex flex-col gap-2 w-full max-w-xs mt-2">
        {confirming ? (
          <>
            <p className="text-sm text-red-500">
              This erases all your data on this device. This can&apos;t be
              undone.
            </p>
            <button
              onClick={resetData}
              className="w-full bg-red-500 text-white rounded-lg py-3 font-medium"
            >
              Yes, erase everything
            </button>
            <button
              onClick={() => setConfirming(false)}
              className="w-full text-foreground/50 text-sm py-1"
            >
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              onClick={reset}
              className="w-full bg-foreground text-background rounded-lg py-3 font-medium"
            >
              Try again
            </button>
            <button
              onClick={() => setConfirming(true)}
              className="w-full border border-foreground/20 rounded-lg py-3 font-medium text-red-500"
            >
              Reset app data
            </button>
          </>
        )}
      </div>
    </div>
  );
}
