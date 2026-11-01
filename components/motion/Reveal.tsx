import type { CSSProperties, ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Stagger index; each step adds 60 ms of transition delay. */
  index?: number;
  as?: "div" | "li";
};

/**
 * Marks content to fade and lift into view once it scrolls on screen.
 * The effect is CSS-only: `RevealObserver` flips `data-reveal` to "in" when the element
 * intersects, `html.js` gates the hidden start state so visitors without JavaScript see
 * everything immediately, and `prefers-reduced-motion` disables the whole thing.
 */
export function Reveal({ children, className, index = 0, as: Tag = "div" }: RevealProps) {
  return (
    <Tag
      className={className}
      data-reveal="out"
      style={{ "--reveal-index": Math.min(index, 6) } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
