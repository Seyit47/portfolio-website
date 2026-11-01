"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    __revealScan?: () => void;
  }
}

/**
 * Client-side navigation effects:
 * - re-runs the inline reveal bootstrap after each route change and marks
 *   `html.navigated` so the page-enter animation only plays on navigations;
 * - scrolls to the top as soon as an internal link is activated, so the route
 *   swap happens with the viewport already at the top instead of the footer
 *   jumping into view while the previous scroll offset is still applied.
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

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest("a[href]");
      if (!anchor || anchor.getAttribute("target") === "_blank" || anchor.hasAttribute("download"))
        return;
      const href = anchor.getAttribute("href") ?? "";
      if (!href.startsWith("/") || href.startsWith("//") || href.includes("#")) return;
      if (href === window.location.pathname) return;
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
