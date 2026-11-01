import { describe, expect, it } from "vitest";
import { cssTimeToMs } from "@/lib/utils/css-time";

describe("cssTimeToMs", () => {
  it("handles milliseconds, seconds and minified seconds", () => {
    expect(cssTimeToMs("250ms")).toBe(250);
    expect(cssTimeToMs(" 0.25s ")).toBe(250);
    expect(cssTimeToMs(".6s")).toBe(600);
    expect(cssTimeToMs("0s")).toBe(0);
    expect(cssTimeToMs("0ms")).toBe(0);
  });

  it("returns 0 for anything else", () => {
    expect(cssTimeToMs("")).toBe(0);
    expect(cssTimeToMs("fast")).toBe(0);
  });
});
