import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/content/validate", () => ({ validateContent: () => undefined }));

import {
  getEducation,
  getPaletteEntries,
  getProfile,
  getProject,
  getProjects,
  getRoles,
  getSkillGroups,
  getTags,
} from "@/lib/content";

describe("getProfile", () => {
  it("returns the single profile document", () => {
    expect(getProfile().name).toBe("Seyit Geldiyev");
    expect(getProfile().links.github).toBe("https://github.com/Seyit47");
  });
});

describe("getRoles", () => {
  it("orders roles by start descending", () => {
    expect(getRoles().map((r) => r.id)).toEqual([
      "kinestex",
      "foreach-partners",
      "datacorda",
      "ynamly-belentlik",
      "belli-creative",
    ]);
  });

  it("exposes period and duration labels", () => {
    const kinestex = getRoles().find((r) => r.id === "kinestex")!;
    expect(kinestex.periodLabel).toBe("May 2025 - Jun 2026");
    expect(kinestex.durationLabel).toBe("1 yr 2 mos");
  });

  it("computes overlapping roles", () => {
    const byId = Object.fromEntries(getRoles().map((r) => [r.id, r]));
    expect(byId.kinestex!.overlapsWith).toEqual(["ynamly-belentlik"]);
    expect(byId["foreach-partners"]!.overlapsWith).toEqual(["ynamly-belentlik"]);
    expect(byId["ynamly-belentlik"]!.overlapsWith).toEqual([
      "kinestex",
      "foreach-partners",
      "datacorda",
    ]);
    expect(byId["belli-creative"]!.overlapsWith).toEqual([]);
  });
});

describe("getEducation / getSkillGroups / getTags", () => {
  it("returns education entries", () => {
    expect(getEducation()).toHaveLength(1);
    expect(getEducation()[0]!.field).toBe("Information Security Engineering");
  });

  it("orders skill groups by order", () => {
    expect(getSkillGroups().map((g) => g.id)).toEqual(["ui", "frameworks"]);
  });

  it("returns tags with labels", () => {
    expect(getTags().map((t) => t.slug)).toContain("dashboard");
  });
});

describe("getProjects", () => {
  it("excludes unpublished projects", () => {
    expect(getProjects().map((p) => p.slug)).not.toContain("draft");
  });

  it("orders by year desc, then order asc, then title", () => {
    expect(getProjects().map((p) => p.slug)).toEqual([
      "audit-app",
      "sdd-navigator-dashboard",
      "instant-play-video-navigator",
      "kinestex-dashboard",
      "datacorda",
    ]);
  });

  it("filters by tag", () => {
    expect(getProjects({ tag: "media" }).map((p) => p.slug)).toEqual([
      "instant-play-video-navigator",
    ]);
  });

  it("returns 3-4 featured projects", () => {
    const featured = getProjects({ featured: true });
    expect(featured.length).toBeGreaterThanOrEqual(3);
    expect(featured.length).toBeLessThanOrEqual(4);
    expect(featured.every((p) => p.featured)).toBe(true);
  });
});

describe("getProject", () => {
  it("returns prev/next neighbours in display order", () => {
    const p = getProject("sdd-navigator-dashboard")!;
    expect(p.prev?.slug).toBe("audit-app");
    expect(p.next?.slug).toBe("instant-play-video-navigator");
  });

  it("has no prev for the first and no next for the last", () => {
    expect(getProject("audit-app")!.prev).toBeUndefined();
    expect(getProject("datacorda")!.next).toBeUndefined();
  });

  it("returns undefined for unknown or unpublished slugs", () => {
    expect(getProject("nope")).toBeUndefined();
    expect(getProject("draft")).toBeUndefined();
  });

  it("resolves the employer role", () => {
    expect(getProject("datacorda")!.employerRole?.employer).toBe("Datacorda");
    expect(getProject("audit-app")!.employerRole).toBeUndefined();
  });
});

describe("getPaletteEntries", () => {
  it("lists pages, projects newest first and external links", () => {
    const entries = getPaletteEntries();
    const groups = [...new Set(entries.map((e) => e.group))];
    expect(groups).toEqual(["Pages", "Projects", "Links"]);
    const projects = entries.filter((e) => e.group === "Projects");
    expect(projects[0]!.href).toBe("/projects/audit-app");
    expect(projects.map((e) => e.href)).not.toContain("/projects/draft");
    const links = entries.filter((e) => e.group === "Links");
    expect(links.every((e) => e.external)).toBe(true);
    expect(links.map((e) => e.href)).toContain("https://github.com/Seyit47");
  });
});
