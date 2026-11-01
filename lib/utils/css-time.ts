/** Parses a CSS `<time>` such as `250ms`, `.25s` or `0s` into milliseconds (0 when unparseable). */
export function cssTimeToMs(value: string): number {
  const match = value.trim().match(/^(-?\d*\.?\d+)\s*(ms|s)?$/i);
  if (!match) return 0;
  const number = parseFloat(match[1] ?? "0");
  return match[2]?.toLowerCase() === "s" ? number * 1000 : number;
}

/** Reads a custom property holding a duration from the root element. */
export function readMotionDuration(name: string): number {
  return cssTimeToMs(getComputedStyle(document.documentElement).getPropertyValue(name));
}
