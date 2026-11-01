"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia(QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

function getServerSnapshot() {
  // Assume reduced motion on the server so nothing animates before hydration confirms otherwise.
  return true;
}

/** True when the visitor prefers reduced motion (or before hydration). */
export function useMotionPreference(): { reduced: boolean } {
  const reduced = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { reduced };
}
