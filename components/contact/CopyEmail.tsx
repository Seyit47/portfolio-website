"use client";

import { useState } from "react";

/** Copies the address to the clipboard; the mailto link beside it remains the no-JS path. */
export function CopyEmail({ email }: { email: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
          setState("copied");
        } catch {
          setState("failed");
        }
        window.setTimeout(() => setState("idle"), 2000);
      }}
      className="inline-flex min-h-9 items-center rounded-md border border-border px-3 text-xs font-medium text-fg-muted hover:text-fg"
    >
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy email"}
      </span>
    </button>
  );
}
