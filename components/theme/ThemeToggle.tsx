"use client";

import { useTheme } from "next-themes";
import { useSyncExternalStore } from "react";
import { withThemeTransition } from "./theme-transition";

const ORDER = ["system", "light", "dark"] as const;
type Theme = (typeof ORDER)[number];
const LABEL: Record<Theme, string> = { system: "System", light: "Light", dark: "Dark" };

function subscribeNoop() {
  return () => {};
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  // false on the server and during hydration, true afterwards: avoids a label mismatch.
  const mounted = useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
  const current: Theme = mounted && ORDER.includes(theme as Theme) ? (theme as Theme) : "system";
  const next = ORDER[(ORDER.indexOf(current) + 1) % ORDER.length] as Theme;

  return (
    <button
      type="button"
      onClick={() => withThemeTransition(() => setTheme(next))}
      aria-label={`Theme: ${LABEL[current]}, switch to ${LABEL[next]}`}
      title={`Theme: ${LABEL[current]}`}
      data-theme-state={current}
      className="inline-flex size-10 items-center justify-center rounded-md text-fg-muted transition-colors duration-(--motion-fast) hover:bg-bg-muted hover:text-fg"
    >
      <ThemeIcon theme={current} />
    </button>
  );
}

function ThemeIcon({ theme }: { theme: Theme }) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };
  if (theme === "light") {
    return (
      <svg {...common}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </svg>
    );
  }
  if (theme === "dark") {
    return (
      <svg {...common}>
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
      </svg>
    );
  }
  return (
    <svg {...common}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  );
}
