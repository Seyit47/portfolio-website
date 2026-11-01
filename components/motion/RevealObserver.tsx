"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __revealScan?: () => void;
  }
}

/**
 * Re-runs the inline reveal bootstrap after each client-side navigation and
 * marks `html.navigated` so the page-enter animation only plays on navigations,
 * never on the initial load.
 */
export function RevealObserver() {
  const pathname = usePathname();
  const first = useRef(true);
  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    document.documentElement.classList.add("navigated");
    window.__revealScan?.();
  }, [pathname]);
  return null;
}
