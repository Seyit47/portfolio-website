import { BUILD_NOW } from "./now";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export type YearMonth = `${number}-${string}` | string;

/** Parses "YYYY-MM" into { year, month } with month 1-12. */
export function parseYearMonth(value: string): { year: number; month: number } {
  const [y, m] = value.split("-");
  const year = Number(y);
  const month = Number(m);
  if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
    throw new Error(`Invalid YYYY-MM value: ${value}`);
  }
  return { year, month };
}

/** Months since year 0 for ordering and arithmetic. */
export function monthIndex(value: string): number {
  const { year, month } = parseYearMonth(value);
  return year * 12 + (month - 1);
}

export function formatMonth(value: string, style: "short" | "long" = "short"): string {
  const { year, month } = parseYearMonth(value);
  const names = style === "long" ? MONTHS_LONG : MONTHS;
  return `${names[month - 1]} ${year}`;
}

/** "May 2025 - Jun 2026" or "May 2025 - Present". */
export function periodLabel(
  start: string,
  end: string | "present",
  style: "short" | "long" = "short",
): string {
  const from = formatMonth(start, style);
  const to = end === "present" ? "Present" : formatMonth(end, style);
  return `${from} - ${to}`;
}

/** Inclusive month span, e.g. 2025-05..2026-06 => 14 months. */
export function monthSpan(start: string, end: string | "present", now: Date = BUILD_NOW): number {
  const from = monthIndex(start);
  const to = end === "present" ? now.getFullYear() * 12 + now.getMonth() : monthIndex(end);
  return Math.max(1, to - from + 1);
}

/** "1 yr 2 mos", "4 mos", "3 yrs 7 mos", "1 yr". */
export function durationLabel(
  start: string,
  end: string | "present",
  now: Date = BUILD_NOW,
): string {
  const months = monthSpan(start, end, now);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  const parts: string[] = [];
  if (years > 0) parts.push(`${years} ${years === 1 ? "yr" : "yrs"}`);
  if (rest > 0) parts.push(`${rest} ${rest === 1 ? "mo" : "mos"}`);
  return parts.join(" ");
}

type Interval = { start: string; end: string | "present" };

/** True when two month intervals share at least one month (touching months overlap). */
export function overlaps(a: Interval, b: Interval, now: Date = BUILD_NOW): boolean {
  const nowIndex = now.getFullYear() * 12 + now.getMonth();
  const aEnd = a.end === "present" ? nowIndex : monthIndex(a.end);
  const bEnd = b.end === "present" ? nowIndex : monthIndex(b.end);
  return monthIndex(a.start) <= bEnd && monthIndex(b.start) <= aEnd;
}

/**
 * Assigns a lane index to each interval so overlapping intervals sit in
 * different lanes. Input order is preserved in the output.
 */
export function timelineLanes<T extends Interval & { id: string }>(
  items: T[],
  now: Date = BUILD_NOW,
): Array<T & { lane: number }> {
  const laneEnds: number[] = [];
  const nowIndex = now.getFullYear() * 12 + now.getMonth();
  const sorted = [...items].sort((x, y) => monthIndex(x.start) - monthIndex(y.start));
  const laneById = new Map<string, number>();
  for (const item of sorted) {
    const start = monthIndex(item.start);
    const end = item.end === "present" ? nowIndex : monthIndex(item.end);
    let lane = laneEnds.findIndex((laneEnd) => laneEnd < start);
    if (lane === -1) {
      lane = laneEnds.length;
      laneEnds.push(end);
    } else {
      laneEnds[lane] = end;
    }
    laneById.set(item.id, lane);
  }
  return items.map((item) => ({ ...item, lane: laneById.get(item.id) ?? 0 }));
}
