import { describe, expect, it } from "vitest";
import { validateContent } from "@/lib/content/validate";
import {
  experienceFixture,
  profileFixture,
  projectsFixture,
  skillsFixture,
  tagsFixture,
} from "../../fixtures/content";

function bundle(overrides: Partial<Parameters<typeof validateContent>[0]> = {}) {
  return {
    profile: profileFixture,
    experience: experienceFixture,
    skills: skillsFixture,
    tags: tagsFixture,
    projects: projectsFixture,
    fileExists: () => true,
    ...overrides,
  };
}

describe("validateContent", () => {
  it("accepts a consistent bundle", () => {
    expect(() => validateContent(bundle())).not.toThrow();
  });

  it("rejects a project whose employer does not resolve", () => {
    const projects = projectsFixture.map((p) =>
      p.slug === "datacorda" ? { ...p, employer: "ghost-corp" } : p,
    );
    expect(() => validateContent(bundle({ projects }))).toThrow(
      /projects\/datacorda\.mdx.*ghost-corp/,
    );
  });

  it("rejects dangling relatedProjects on a role", () => {
    const experience = {
      ...experienceFixture,
      roles: experienceFixture.roles.map((r) =>
        r.id === "kinestex" ? { ...r, relatedProjects: ["missing-project"] } : r,
      ),
    };
    expect(() => validateContent(bundle({ experience }))).toThrow(
      /experience\.yaml.*missing-project/,
    );
  });

  it("rejects unknown project tags", () => {
    const projects = projectsFixture.map((p) =>
      p.slug === "audit-app" ? { ...p, tags: ["full-stack", "nope"] } : p,
    );
    expect(() => validateContent(bundle({ projects }))).toThrow(/projects\/audit-app\.mdx.*nope/);
  });

  it("rejects unknown skill tags", () => {
    const skills = {
      ...skillsFixture,
      groups: skillsFixture.groups.map((g) =>
        g.id === "frameworks"
          ? { ...g, skills: [{ name: "X", level: "primary" as const, tags: ["unknown-tag"] }] }
          : g,
      ),
    };
    expect(() => validateContent(bundle({ skills }))).toThrow(/skills\.yaml.*unknown-tag/);
  });

  it("rejects featured counts outside 3-4", () => {
    const two = projectsFixture.map((p) =>
      p.slug === "instant-play-video-navigator" ? { ...p, featured: false } : p,
    );
    expect(() => validateContent(bundle({ projects: two }))).toThrow(/featured/i);
    const five = projectsFixture.map((p) => ({ ...p, featured: p.published }));
    expect(() => validateContent(bundle({ projects: five }))).toThrow(/featured/i);
  });

  it("rejects visuals whose file is missing under public/", () => {
    const projects = projectsFixture.map((p) =>
      p.slug === "audit-app"
        ? {
            ...p,
            visuals: [
              {
                src: "/images/projects/audit-app/hero.png",
                alt: "x",
                kind: "image" as const,
                width: 1,
                height: 1,
              },
            ],
          }
        : p,
    );
    expect(() => validateContent(bundle({ projects, fileExists: () => false }))).toThrow(
      /projects\/audit-app\.mdx.*hero\.png/,
    );
  });
});
