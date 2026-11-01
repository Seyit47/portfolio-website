import { describe, expect, it } from "vitest";
import { durationLabel, overlaps, periodLabel, timelineLanes } from "@/lib/utils/dates";

describe("periodLabel", () => {
  it("formats short month ranges", () => {
    expect(periodLabel("2025-05", "2026-06")).toBe("May 2025 - Jun 2026");
  });
  it("formats long month ranges", () => {
    expect(periodLabel("2022-12", "2026-06", "long")).toBe("December 2022 - June 2026");
  });
  it("renders present", () => {
    expect(periodLabel("2025-05", "present")).toBe("May 2025 - Present");
  });
});

describe("durationLabel", () => {
  it("counts inclusive months", () => {
    expect(durationLabel("2025-05", "2026-06")).toBe("1 yr 2 mos");
    expect(durationLabel("2024-12", "2025-03")).toBe("4 mos");
    expect(durationLabel("2022-12", "2026-06")).toBe("3 yrs 7 mos");
    expect(durationLabel("2023-06", "2023-10")).toBe("5 mos");
    expect(durationLabel("2020-06", "2022-11")).toBe("2 yrs 6 mos");
  });
  it("omits zero parts", () => {
    expect(durationLabel("2024-01", "2024-12")).toBe("1 yr");
    expect(durationLabel("2024-01", "2024-01")).toBe("1 mo");
  });
  it("uses the provided now for present", () => {
    expect(durationLabel("2026-01", "present", new Date(2026, 10, 1))).toBe("11 mos");
  });
});

describe("overlaps", () => {
  it("detects overlapping and touching intervals", () => {
    expect(
      overlaps({ start: "2025-05", end: "2026-06" }, { start: "2022-12", end: "2026-06" }),
    ).toBe(true);
    expect(
      overlaps({ start: "2024-12", end: "2025-03" }, { start: "2025-03", end: "2025-08" }),
    ).toBe(true);
  });
  it("rejects disjoint intervals", () => {
    expect(
      overlaps({ start: "2020-06", end: "2022-11" }, { start: "2022-12", end: "2026-06" }),
    ).toBe(false);
  });
});

describe("timelineLanes", () => {
  it("places overlapping roles in different lanes and keeps input order", () => {
    const lanes = timelineLanes([
      { id: "a", start: "2025-05", end: "2026-06" },
      { id: "b", start: "2022-12", end: "2026-06" },
      { id: "c", start: "2020-06", end: "2022-11" },
    ]);
    expect(lanes.map((l) => l.id)).toEqual(["a", "b", "c"]);
    expect(lanes.find((l) => l.id === "b")!.lane).toBe(0);
    expect(lanes.find((l) => l.id === "a")!.lane).toBe(1);
    expect(lanes.find((l) => l.id === "c")!.lane).toBe(0);
  });
});
