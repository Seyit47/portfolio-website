"use client";

import { Command } from "cmdk";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { PaletteEntry } from "@/lib/content/types";
import { usePalette } from "./PaletteContext";

const GROUPS: PaletteEntry["group"][] = ["Pages", "Projects", "Links"];

export default function CommandPalette() {
  const { entries, open, setOpen, triggerRef } = usePalette();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const grouped = useMemo(
    () => GROUPS.map((group) => ({ group, items: entries.filter((e) => e.group === group) })),
    [entries],
  );

  function select(entry: PaletteEntry) {
    setOpen(false);
    setQuery("");
    window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
    if (entry.external) {
      if (entry.href.startsWith("mailto:") || entry.href.startsWith("/")) {
        window.location.assign(entry.href);
      } else {
        window.open(entry.href, "_blank", "noopener,noreferrer");
      }
      return;
    }
    router.push(entry.href);
  }

  return (
    <Command.Dialog
      open={open}
      onOpenChange={(next) => {
        // A dismiss event from a dialog that is already closing must not cancel a fresh open.
        if (next === open) return;
        setOpen(next);
        if (!next) {
          setQuery("");
          // Radix restores focus during unmount; run after it so the trigger reliably wins.
          window.setTimeout(() => triggerRef.current?.focus({ preventScroll: true }), 0);
        }
      }}
      label="Command palette"
      overlayClassName="palette-overlay fixed inset-0 z-50 bg-fg/40 backdrop-blur-sm"
      contentClassName="palette-content fixed top-[12vh] left-1/2 z-50 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-lg border border-border bg-bg-elevated shadow-lg"
      loop
    >
      <div className="border-b border-border px-3">
        <Command.Input
          value={query}
          onValueChange={setQuery}
          placeholder="Search pages, projects, links..."
          className="h-12 w-full bg-transparent text-base text-fg outline-none placeholder:text-fg-subtle"
        />
      </div>
      <Command.List className="max-h-[50vh] overflow-y-auto p-2">
        <Command.Empty className="px-3 py-6 text-center text-sm text-fg-subtle">
          No results.
        </Command.Empty>
        {grouped.map(({ group, items }) => (
          <Command.Group
            key={group}
            heading={group}
            className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-semibold [&_[cmdk-group-heading]]:tracking-[0.14em] [&_[cmdk-group-heading]]:text-fg-subtle [&_[cmdk-group-heading]]:uppercase"
          >
            {items.map((entry) => (
              <Command.Item
                key={entry.id}
                value={`${entry.label} ${entry.hint ?? ""} ${(entry.keywords ?? []).join(" ")}`}
                onSelect={() => select(entry)}
                className="flex cursor-pointer items-center justify-between gap-3 rounded-md px-3 py-2 text-sm text-fg data-[selected=true]:bg-accent-soft data-[selected=true]:text-fg"
              >
                <span>{entry.label}</span>
                <span className="truncate text-xs text-fg-subtle">
                  {entry.hint}
                  {entry.external ? " ↗" : ""}
                </span>
              </Command.Item>
            ))}
          </Command.Group>
        ))}
      </Command.List>
      <div className="flex items-center justify-between border-t border-border px-3 py-2 text-xs text-fg-subtle">
        <span>Enter to open · Esc to close</span>
        <span>Ctrl K</span>
      </div>
    </Command.Dialog>
  );
}
