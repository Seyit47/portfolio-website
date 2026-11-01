import { describe, expect, it } from "vitest";
import { sameTransitionGroup, transitionKey } from "@/lib/utils/routes";

describe("transitionKey", () => {
  it("groups the projects index with its tag filters", () => {
    expect(transitionKey("/projects")).toBe("/projects");
    expect(transitionKey("/projects/tag/dashboard")).toBe("/projects");
    expect(sameTransitionGroup("/projects", "/projects/tag/media")).toBe(true);
  });

  it("keeps every other route distinct", () => {
    expect(transitionKey("/projects/audit-app")).toBe("/projects/audit-app");
    expect(sameTransitionGroup("/projects", "/projects/audit-app")).toBe(false);
    expect(sameTransitionGroup("/", "/experience")).toBe(false);
    expect(sameTransitionGroup("/contact", "/contact")).toBe(true);
  });
});
