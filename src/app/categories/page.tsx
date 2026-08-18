"use client";

import { useState } from "react";
import { useEnergy } from "@/lib/energy-context";
import { PRESET_CATEGORIES } from "@/lib/categories";

export default function CategoriesPage() {
  const { customCategories, addCustomCategory, deleteCustomCategory, hydrated } =
    useEnergy();
  const [label, setLabel] = useState("");
  const [emoji, setEmoji] = useState("⚡");
  const [sign, setSign] = useState<1 | -1>(1);
  const [magnitude, setMagnitude] = useState(10);

  if (!hydrated) return null;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!label.trim()) return;
    addCustomCategory(label.trim(), emoji || "⚡", sign * Math.abs(magnitude));
    setLabel("");
    setEmoji("⚡");
    setSign(1);
    setMagnitude(10);
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-lg font-semibold">Actions</h1>

      <section>
        <h2 className="text-sm font-medium text-foreground/60 mb-2">
          Built-in
        </h2>
        <ul className="flex flex-col gap-1.5">
          {PRESET_CATEGORIES.map((c) => (
            <li
              key={c.id}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-foreground/5 text-sm"
            >
              <span>
                {c.emoji} {c.label}
              </span>
              <span
                className={c.defaultDelta > 0 ? "text-green-600" : "text-red-500"}
              >
                {c.defaultDelta > 0 ? `+${c.defaultDelta}` : c.defaultDelta}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-medium text-foreground/60 mb-2">
          Your custom actions
        </h2>
        {customCategories.length === 0 ? (
          <p className="text-sm text-foreground/40">None yet — add one below.</p>
        ) : (
          <ul className="flex flex-col gap-1.5">
            {customCategories.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-foreground/5 text-sm"
              >
                <span>
                  {c.emoji} {c.label}
                </span>
                <div className="flex items-center gap-3">
                  <span
                    className={
                      c.defaultDelta > 0 ? "text-green-600" : "text-red-500"
                    }
                  >
                    {c.defaultDelta > 0 ? `+${c.defaultDelta}` : c.defaultDelta}
                  </span>
                  <button
                    onClick={() => deleteCustomCategory(c.id)}
                    aria-label="Delete action"
                    className="text-foreground/30 text-lg leading-none"
                  >
                    ×
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <form
        onSubmit={submit}
        className="flex flex-col gap-3 border-t border-foreground/10 pt-5"
      >
        <h2 className="text-sm font-medium text-foreground/60">
          Add a new action
        </h2>
        <div className="flex gap-2">
          <input
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
            maxLength={2}
            className="w-14 border border-foreground/15 rounded-lg px-2 py-2 text-center text-lg"
            aria-label="Emoji"
          />
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="e.g. Cooked dinner together"
            className="flex-1 border border-foreground/15 rounded-lg px-3 py-2"
            aria-label="Action name"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="flex border border-foreground/15 rounded-lg overflow-hidden">
            <button
              type="button"
              onClick={() => setSign(1)}
              className={`px-3 py-2 text-sm ${
                sign === 1 ? "bg-foreground text-background" : ""
              }`}
            >
              Charge +
            </button>
            <button
              type="button"
              onClick={() => setSign(-1)}
              className={`px-3 py-2 text-sm ${
                sign === -1 ? "bg-foreground text-background" : ""
              }`}
            >
              Drain −
            </button>
          </div>
          <input
            type="number"
            min={1}
            max={50}
            value={magnitude}
            onChange={(e) => setMagnitude(Number(e.target.value))}
            className="w-20 border border-foreground/15 rounded-lg px-2 py-2"
            aria-label="Amount"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-foreground text-background rounded-lg py-2.5 font-medium"
        >
          Add action
        </button>
      </form>
    </div>
  );
}
