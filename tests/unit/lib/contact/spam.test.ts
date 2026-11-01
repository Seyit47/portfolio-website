import { describe, expect, it } from "vitest";
import { isHoneypotTripped, isTimingValid, MAX_FILL_MS, MIN_FILL_MS } from "@/lib/contact/spam";

describe("isHoneypotTripped", () => {
  it("is false for empty or missing values", () => {
    expect(isHoneypotTripped("")).toBe(false);
    expect(isHoneypotTripped("   ")).toBe(false);
    expect(isHoneypotTripped(undefined)).toBe(false);
  });
  it("is true when a bot fills the field", () => {
    expect(isHoneypotTripped("http://spam.example")).toBe(true);
  });
});

describe("isTimingValid", () => {
  const now = 1_700_000_000_000;
  it("rejects submissions faster than the minimum", () => {
    expect(isTimingValid(String(now - MIN_FILL_MS + 1), now)).toBe(false);
  });
  it("rejects submissions older than the maximum", () => {
    expect(isTimingValid(String(now - MAX_FILL_MS - 1), now)).toBe(false);
  });
  it("accepts submissions inside the window", () => {
    expect(isTimingValid(String(now - MIN_FILL_MS), now)).toBe(true);
    expect(isTimingValid(String(now - 60_000), now)).toBe(true);
    expect(isTimingValid(now - MAX_FILL_MS, now)).toBe(true);
  });
  it("rejects missing or malformed timestamps", () => {
    expect(isTimingValid(undefined, now)).toBe(false);
    expect(isTimingValid("abc", now)).toBe(false);
  });
});
