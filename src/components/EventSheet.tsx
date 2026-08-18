"use client";

import { useState } from "react";
import { useEnergy } from "@/lib/energy-context";
import { Category, EnergyEvent } from "@/lib/types";
import { CATEGORIES, intensityLabel } from "@/lib/categories";

function toLocalInputValue(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 16);
}

function categoryForEvent(event: EnergyEvent): Category {
  return (
    CATEGORIES.find((c) => c.id === event.categoryId) ?? {
      id: event.categoryId,
      label: event.label,
      emoji: event.emoji,
      description: "",
      defaultDelta: event.delta,
    }
  );
}

export function EventSheet({
  event,
  onClose,
}: {
  event?: EnergyEvent;
  onClose: () => void;
}) {
  const { addEvent, updateEvent, deleteEvent } = useEnergy();
  const isEditing = Boolean(event);
  const [selected, setSelected] = useState<Category | null>(
    event ? categoryForEvent(event) : null
  );
  const [delta, setDelta] = useState(event?.delta ?? 0);
  const [note, setNote] = useState(event?.note ?? "");
  const [when, setWhen] = useState(() =>
    toLocalInputValue(event ? new Date(event.timestamp) : new Date())
  );

  function select(category: Category) {
    setSelected(category);
    if (!isEditing) setDelta(category.defaultDelta);
  }

  function save() {
    if (!selected) return;
    const parsed = when ? new Date(when).getTime() : NaN;
    const timestamp = Number.isNaN(parsed) ? Date.now() : parsed;
    if (event) {
      updateEvent(event.id, selected, delta, note, timestamp);
    } else {
      addEvent(selected, delta, note, timestamp);
    }
    onClose();
  }

  function remove() {
    if (!event) return;
    deleteEvent(event.id);
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
        <div>
          <h2 className="text-lg font-semibold">
            {isEditing ? "Edit entry" : "What happened?"}
          </h2>
          <p className="text-sm text-foreground/50 mt-0.5">
            {isEditing
              ? "Change the details or how it went."
              : "Pick a category, then say how it went."}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => select(c)}
              className={`flex flex-col items-start gap-1 rounded-xl border px-3 py-2.5 text-left ${
                selected?.id === c.id
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/15"
              }`}
            >
              <span className="text-base font-medium">
                {c.emoji} {c.label}
              </span>
              <span
                className={`text-xs ${
                  selected?.id === c.id
                    ? "text-background/70"
                    : "text-foreground/50"
                }`}
              >
                {c.description}
              </span>
            </button>
          ))}
        </div>

        {selected && (
          <div className="flex flex-col gap-4 border-t border-foreground/10 pt-4">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm text-foreground/70">
                {selected.emoji} {selected.label} &middot;{" "}
                <strong
                  className={delta >= 0 ? "text-green-600" : "text-red-500"}
                >
                  {intensityLabel(delta)}
                </strong>{" "}
                ({delta > 0 ? `+${delta}` : delta})
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
              {isEditing ? "Save changes" : "Save"}
            </button>
            {isEditing && (
              <button
                onClick={remove}
                className="w-full text-red-500 rounded-lg py-2.5 font-medium"
              >
                Delete entry
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
