/**
 * Minimal FLIP helper for in-place route updates (for example a tag filter changing which
 * project cards are shown). `snapshotFlip` records where `[data-flip-key]` elements are and how
 * tall `[data-flip-size]` containers are before the DOM changes; `playFlip` then slides each
 * surviving item from its old position to its new one and animates container heights with the
 * Web Animations API. Items that were not snapshotted are left to the reveal transition.
 */
import { readMotionDuration } from "@/lib/utils/css-time";

const positions = new Map<string, DOMRect>();
const sizes = new Map<string, number>();

export function snapshotFlip(root: ParentNode = document) {
  positions.clear();
  sizes.clear();
  root.querySelectorAll<HTMLElement>("[data-flip-key]").forEach((el) => {
    positions.set(el.dataset.flipKey as string, el.getBoundingClientRect());
  });
  root.querySelectorAll<HTMLElement>("[data-flip-size]").forEach((el) => {
    sizes.set(el.dataset.flipSize as string, el.getBoundingClientRect().height);
  });
}

export function playFlip(root: ParentNode = document) {
  if (positions.size === 0 && sizes.size === 0) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const duration = readMotionDuration("--motion-base");
  const easing =
    getComputedStyle(document.documentElement).getPropertyValue("--ease-standard").trim() || "ease";
  if (!reduced && duration > 0 && typeof HTMLElement.prototype.animate === "function") {
    root.querySelectorAll<HTMLElement>("[data-flip-key]").forEach((el) => {
      const before = positions.get(el.dataset.flipKey as string);
      if (!before) return;
      // Survivors slide rather than fade: show them immediately (no reveal transition) and
      // measure their true layout position without the hidden-state offset.
      if (el.dataset.reveal === "out") {
        el.setAttribute("data-reveal-instant", "");
        el.setAttribute("data-reveal", "in");
      }
      const after = el.getBoundingClientRect();
      const dx = before.left - after.left;
      const dy = before.top - after.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) return;
      el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0, 0)" }], {
        duration,
        easing,
      });
    });
    // Containers whose height changed (a filtered grid) grow or shrink smoothly so content
    // below them, such as the footer, slides instead of jumping.
    root.querySelectorAll<HTMLElement>("[data-flip-size]").forEach((el) => {
      const before = sizes.get(el.dataset.flipSize as string);
      if (before === undefined) return;
      const after = el.getBoundingClientRect().height;
      if (Math.abs(before - after) < 1) return;
      el.animate([{ height: `${before}px` }, { height: `${after}px` }], { duration, easing });
    });
  }
  positions.clear();
  sizes.clear();
}
