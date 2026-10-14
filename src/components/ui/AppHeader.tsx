"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import type { TextSize } from "@/content/types";
import { useProgress } from "@/lib/progress-context";

const sizes: { id: TextSize; label: string }[] = [
  { id: "default", label: "Default" },
  { id: "large", label: "Large" },
  { id: "extra", label: "Extra large" },
];

export function TextSizeControl() {
  const { state, setTextSize } = useProgress();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const panelId = useId();
  const index = Math.max(0, sizes.findIndex((size) => size.id === state.textSize));
  const current = sizes[index] ?? sizes[0];

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      triggerRef.current?.focus();
    }
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      setOpen(false);
    }
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
    };
  }, [open]);

  function step(direction: -1 | 1) {
    const next = sizes[index + direction];
    if (next) setTextSize(next.id);
  }

  return (
    <div className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-haspopup="dialog"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex min-h-14 items-center gap-2 rounded-xl border-2 border-navy bg-surface px-4 font-bold text-navy"
      >
        Text size
        <span aria-hidden="true">{open ? "▴" : "▾"}</span>
      </button>
      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-label="Text size"
          className="absolute right-0 z-20 mt-2 w-80 max-w-[calc(100vw-2.5rem)] rounded-2xl border-2 border-navy bg-surface p-4"
        >
          <p className="font-bold">Text size</p>
          <div className="mt-3 flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease text size"
              disabled={index === 0}
              onClick={() => step(-1)}
              className="inline-flex min-h-14 min-w-14 items-center justify-center rounded-xl border-2 border-navy bg-navy text-2xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              <span aria-hidden="true">−</span>
            </button>
            <p className="min-w-0 flex-1 text-center font-bold" aria-live="polite">
              {current.label}
            </p>
            <button
              type="button"
              aria-label="Increase text size"
              disabled={index === sizes.length - 1}
              onClick={() => step(1)}
              className="inline-flex min-h-14 min-w-14 items-center justify-center rounded-xl border-2 border-navy bg-navy text-2xl font-bold text-white disabled:cursor-not-allowed disabled:opacity-55"
            >
              <span aria-hidden="true">+</span>
            </button>
          </div>
          <button
            type="button"
            onClick={() => setTextSize("default")}
            className="mt-3 inline-flex min-h-14 w-full items-center justify-center rounded-xl border-2 border-ink bg-paper px-4 font-bold"
          >
            Reset text size
          </button>
        </div>
      ) : null}
    </div>
  );
}

function NavLink({
  href,
  current,
  children,
}: {
  href: string;
  current: boolean;
  children: string;
}) {
  return (
    <Link
      href={href}
      aria-current={current ? "page" : undefined}
      className={`inline-flex min-h-12 items-center rounded-xl px-4 font-bold ${current ? "bg-navy text-white" : "text-ink hover:bg-paper"}`}
    >
      {children}
    </Link>
  );
}

export function AppHeader() {
  const pathname = usePathname();
  const onUnit =
    pathname.startsWith("/unit-1") ||
    pathname.startsWith("/lesson") ||
    pathname.startsWith("/unit-complete");

  return (
    <header className="border-b-2 border-ink bg-surface">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-30 focus:bg-white focus:px-4 focus:py-3"
      >
        Skip to content
      </a>
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-6 py-4">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <Link href="/" className="text-2xl font-bold text-ink underline-offset-4 hover:underline">
            Meet AI
          </Link>
          <nav aria-label="Main" className="flex flex-wrap items-center gap-2">
            <NavLink href="/" current={pathname === "/"}>
              Home
            </NavLink>
            <NavLink href="/unit-1" current={onUnit}>
              Unit 1
            </NavLink>
          </nav>
        </div>
        <TextSizeControl />
      </div>
    </header>
  );
}
