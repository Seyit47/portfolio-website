import { readMotionDuration } from "@/lib/utils/css-time";

let timer: number | undefined;

/**
 * Runs a theme change while `html.theme-switching` is set, which turns on colour transitions
 * for every element (see globals.css) so the switch cross-fades instead of flashing.
 * The class is removed once the transition has finished; reduced motion zeroes the duration.
 */
export function withThemeTransition(change: () => void) {
  const root = document.documentElement;
  const duration = readMotionDuration("--motion-base");
  root.classList.add("theme-switching");
  change();
  window.clearTimeout(timer);
  timer = window.setTimeout(() => root.classList.remove("theme-switching"), duration + 50);
}
