"use client";

import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef } from "react";
import { sameTransitionGroup } from "@/lib/utils/routes";
import { playFlip, snapshotFlip } from "./flip";

declare global {
  interface Window {
    __revealScan?: (animate?: boolean) => void;
  }
}

/**
 * Re-runs the inline reveal scan after client-side navigations and keeps navigation
 * feeling stable: links to another section scroll to the top before the new page commits
 * (so the footer never jumps into view mid-swap), while links inside the same transition
 * group (project filters) keep the scroll position and animate the list in place.
 */
export function RevealObserver() {
  const pathname = usePathname();
  const previous = useRef(pathname);

  // Layout effect: the FLIP animation and reveal states must be applied before the new DOM is
  // painted, otherwise the first frame shows content at its final position and then jumps back.
  useLayoutEffect(() => {
    if (previous.current === pathname) return;
    const inPlace = sameTransitionGroup(previous.current, pathname);
    previous.current = pathname;
    // In-place updates slide surviving items to their new place and fade new ones in with the
    // stagger; section changes show above-the-fold content immediately so the page-enter
    // animation is the only motion.
    if (inPlace) playFlip();
    window.__revealScan?.(inPlace);
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
      if (sameTransitionGroup(href, window.location.pathname)) {
        snapshotFlip();
        return;
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
