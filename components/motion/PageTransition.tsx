import type { ReactNode } from "react";

/** CSS enter animation per navigation (template.tsx remounts it); zeroed under reduced motion. */
export function PageTransition({ children }: { children: ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
