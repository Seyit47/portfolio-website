"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, type ReactNode } from "react";
import { transitionKey } from "@/lib/utils/routes";

/**
 * Wraps page content in a keyed element so a CSS enter animation plays on navigation.
 * The key is the route's transition group, so filtering projects (same group) updates
 * in place while moving between sections remounts and animates. `html.navigated` gates
 * the animation so the very first paint is never delayed; reduced motion zeroes it.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const key = transitionKey(usePathname());
  const previous = useRef(key);
  useEffect(() => {
    if (previous.current === key) return;
    previous.current = key;
    document.documentElement.classList.add("navigated");
  }, [key]);
  return (
    <div key={key} className="page-enter">
      {children}
    </div>
  );
}
