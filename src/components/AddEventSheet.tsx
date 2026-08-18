"use client";

import { useState } from "react";
import { useEnergy } from "@/lib/energy-context";
import { Category } from "@/lib/types";

function toLocalInputValue(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

export function AddEventSheet({ onClose }: { onClose: () => void }) {
  const { allCategories, addEvent } = useEnergy();
  const [selected, setSelected] = useState<Category | null>(null);
  const [delta, setDelta] = useState(0);
  const [note, setNote] = useState("");
  const [when, setWhen] = useState(() => toLocalInputValue(new Date()));

  const draining = allCategories.filter((c) => c.defaultDelta < 0);
  const charging = allCategories.filter((c) => c.defaultDelta >= 0);

  function select(category: Category) {
    setSelected(category);
    setDelta(category.defaultDelta);
  }

  function save() {
    if (!selected) return;
    const parsed = when ? new Date(when).getTime() : NaN;
    addEvent(selected, delta, note, Number.isNaN(parsed) ? Date.now() : parsed);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end">
      <button
        className="absolute inset-0 bg-black/40"
        aria-label="Close"
        onClick={onClose}
      />
      <div className="relative bg-background rounded-t-2xl max-h-[85vh] overflow-y-auto p-5 pb-8 flex flex-col gap-5">
        <div className="mx-auto w-10 h-1 rounded-full bg-foreground/20" />
        <h2 className="text-lg font-semibold">What happened?</h2>

        <div className="flex flex-col gap-3">
          <div>
            <p className="text-xs uppercase tracking-wide text-foreground/50 mb-2">
              Drains energy
            </p>
            <ChipGrid
              categories={draining}
              selectedId={selected?.id}
              onSelect={select}
            />
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-foreground/50 mb-2">
              Charges energy
            </p>
            <ChipGrid
              categories={charging}
              selectedId={selected?.id}
              onSelect={select}
            />
          </div>
        </div>

        {selected && (
          <div className="flex flex-col gap-4 border-t border-foreground/10 pt-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-foreground/70">
                Energy change: {delta > 0 ? `+${delta}` : delta}
              </span>
              <input
                type="range"
                min={-30}
                max={30}
                value={delta}
                onChange={(e) => setDelta(Number(e.target.value))}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-foreground/70">
                When did this happen?
              </span>
              <input
                type="datetime-local"
                value={when}
                max={toLocalInputValue(new Date())}
                onChange={(e) => setWhen(e.target.value)}
                className="border border-foreground/15 rounded-lg px-3 py-2 bg-transparent"
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-foreground/70">
                Note (optional)
              </span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a detail..."
                className="border border-foreground/15 rounded-lg px-3 py-2 bg-transparent"
              />
            </label>
            <button
              onClick={save}
              className="w-full bg-foreground text-background rounded-lg py-3 font-medium"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChipGrid({
  categories,
  selectedId,
  onSelect,
}: {
  categories: Category[];
  selectedId?: string;
  onSelect: (c: Category) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c)}
          className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
            selectedId === c.id
              ? "border-foreground bg-foreground text-background"
              : "border-foreground/15"
          }`}
        >
          <span>{c.emoji}</span>
          {c.label}
        </button>
      ))}
    </div>
  );
}
