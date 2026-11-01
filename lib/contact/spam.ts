export const MIN_FILL_MS = 3_000;
export const MAX_FILL_MS = 86_400_000;

/** The hidden "website" field must stay empty; bots tend to fill every input. */
export function isHoneypotTripped(value: unknown): boolean {
  return typeof value === "string" && value.trim().length > 0;
}

/**
 * The form carries the time it was rendered. A submission faster than three
 * seconds or older than a day is treated as automated.
 */
export function isTimingValid(renderedAt: unknown, now = Date.now()): boolean {
  const rendered =
    typeof renderedAt === "string"
      ? Number(renderedAt)
      : typeof renderedAt === "number"
        ? renderedAt
        : NaN;
  if (!Number.isFinite(rendered)) return false;
  const elapsed = now - rendered;
  return elapsed >= MIN_FILL_MS && elapsed <= MAX_FILL_MS;
}

/** Timestamp stamped into the form at request time (the contact page renders per request). */
export function renderTimestamp(): number {
  return Date.now();
}
