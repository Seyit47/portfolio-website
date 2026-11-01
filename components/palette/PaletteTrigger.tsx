"use client";

import { usePalette } from "./PaletteContext";

export function PaletteTrigger() {
  const { open, setOpen, triggerRef } = usePalette();
  return (
    <button
      ref={triggerRef}
      type="button"
      onClick={() => setOpen(true)}
      aria-haspopup="dialog"
      aria-expanded={open}
      className="inline-flex min-h-10 items-center gap-2 rounded-md px-2.5 text-fg-muted transition-colors duration-(--motion-fast) hover:bg-bg-muted hover:text-fg"
    >
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>
      <span className="sr-only">Open command palette</span>
      <kbd
        aria-hidden="true"
        className="hidden rounded-sm border border-border bg-bg-muted px-1.5 py-0.5 font-mono text-[11px] text-fg-subtle sm:inline"
      >
        Ctrl K
      </kbd>
    </button>
  );
}
