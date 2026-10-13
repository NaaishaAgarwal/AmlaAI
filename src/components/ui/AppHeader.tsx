"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress-context";
import type { TextSize } from "@/content/types";

const sizes: { id: TextSize; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "large", label: "Large" },
  { id: "extra", label: "Extra large" },
];

export function TextSizeControl() {
  const { state, setTextSize } = useProgress();

  return (
    <fieldset className="min-w-0">
      <legend className="mb-2 font-bold">Text size</legend>
      <div className="flex flex-wrap gap-2">
        {sizes.map((size) => {
          const selected = state.textSize === size.id;
          return (
            <button
              key={size.id}
              type="button"
              aria-pressed={selected}
              onClick={() => setTextSize(size.id)}
              className={`min-h-12 rounded-xl border-2 border-ink px-3 py-2 font-bold ${selected ? "bg-navy text-white" : "bg-surface text-ink"}`}
            >
              {size.label}
              {selected ? <span className="sr-only"> selected</span> : null}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

export function AppHeader() {
  return (
    <header className="border-b-2 border-ink bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:bg-white focus:px-4 focus:py-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-5 py-4 sm:flex-row sm:items-end sm:justify-between">
        <Link href="/" className="text-2xl font-bold text-ink underline-offset-4 hover:underline">
          Meet AI
        </Link>
        <TextSizeControl />
      </div>
    </header>
  );
}
