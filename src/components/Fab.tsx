"use client";

export function Fab({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label="Add energy event"
      className="fixed right-5 bottom-20 z-30 w-14 h-14 rounded-full bg-foreground text-background text-3xl font-light flex items-center justify-center shadow-lg active:scale-95 transition-transform"
    >
      +
    </button>
  );
}
