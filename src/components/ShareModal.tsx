"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { useEnergy } from "@/lib/energy-context";
import { ShareCard } from "./ShareCard";

export function ShareModal({ onClose }: { onClose: () => void }) {
  const { level, events } = useEnergy();
  const cardRef = useRef<HTMLDivElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate(): Promise<Blob | null> {
    if (!cardRef.current) return null;
    const dataUrl = await toPng(cardRef.current, {
      pixelRatio: 3,
      cacheBust: true,
    });
    const res = await fetch(dataUrl);
    return res.blob();
  }

  async function handleShare() {
    setBusy(true);
    setError(null);
    try {
      const blob = await generate();
      if (!blob) return;
      const file = new File([blob], "energy-level.png", { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "My energy level",
        });
      } else {
        downloadBlob(blob);
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError("Couldn't share the image. Try downloading instead.");
      }
    } finally {
      setBusy(false);
    }
  }

  async function handleDownload() {
    setBusy(true);
    setError(null);
    try {
      const blob = await generate();
      if (blob) downloadBlob(blob);
    } catch {
      setError("Couldn't generate the image.");
    } finally {
      setBusy(false);
    }
  }

  function downloadBlob(blob: Blob) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "energy-level.png";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-t-2xl max-h-[90vh] overflow-y-auto p-5 pb-8 flex flex-col items-center gap-5">
        <div className="mx-auto w-10 h-1 rounded-full bg-foreground/20" />
        <h2 className="text-lg font-semibold self-start">Share your energy</h2>

        <div className="rounded-xl overflow-hidden shadow-md scale-90 origin-top">
          <ShareCard ref={cardRef} level={level} events={events} />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <div className="w-full flex flex-col gap-2">
          <button
            onClick={handleShare}
            disabled={busy}
            className="w-full bg-foreground text-background rounded-lg py-3 font-medium disabled:opacity-50"
          >
            {busy ? "Preparing..." : "Share"}
          </button>
          <button
            onClick={handleDownload}
            disabled={busy}
            className="w-full border border-foreground/20 rounded-lg py-3 font-medium disabled:opacity-50"
          >
            Download image
          </button>
        </div>
      </div>
    </div>
  );
}
