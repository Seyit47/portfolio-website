import { describe, expect, it, vi } from "vitest";
import { projectsFixture } from "../../fixtures/content";

vi.mock("@/lib/content/validate", () => ({ validateContent: () => undefined }));

import { breadcrumbJsonLd, buildMetadata, personJsonLd, projectJsonLd, siteUrl } from "@/lib/seo";
import { getProject } from "@/lib/content";

describe("buildMetadata", () => {
  it("applies the title template and absolute canonical", () => {
    const m = buildMetadata({ title: "Projects", description: "All projects.", path: "/projects" });
    expect(m.title).toBe("Projects");
    expect(m.alternates?.canonical).toBe(`${siteUrl()}/projects`);
    expect(m.openGraph?.url).toBe(`${siteUrl()}/projects`);
    expect(m.openGraph?.siteName).toBe("Seyit Geldiyev");
    expect((m.twitter as { card?: string } | undefined)?.card).toBe("summary_large_image");
  });

  it("uses an absolute title for the home page", () => {
    const m = buildMetadata({
      title: { absolute: "Seyit Geldiyev · Middle+ Software Engineer" },
      description: "x",
      path: "/",
    });
    expect(m.title).toEqual({ absolute: "Seyit Geldiyev · Middle+ Software Engineer" });
  });

  it("truncates descriptions longer than 160 characters", () => {
    const m = buildMetadata({ title: "T", description: "y".repeat(200), path: "/t" });
    expect((m.description as string).length).toBeLessThanOrEqual(160);
  });

  it("marks noindex pages", () => {
    const m = buildMetadata({ title: "404", description: "x", path: "/404", noindex: true });
    expect(m.robots).toEqual({ index: false, follow: false });
  });
});

describe("personJsonLd", () => {
  it("includes sameAs links and alternate name", () => {
    const ld = personJsonLd();
    expect(ld["@type"]).toBe("Person");
    expect(ld.sameAs).toEqual(
      expect.arrayContaining([
        "https://github.com/Seyit47",
        "https://www.linkedin.com/in/seyitgeldiyev-55a17b230",
      ]),
    );
    expect(ld.alternateName).toContain("Seyitmyrat Geldiyew");
  });
});

describe("projectJsonLd", () => {
  it("uses SoftwareSourceCode when a source link exists", () => {
    const ld = projectJsonLd(getProject("audit-app")!);
    expect(ld["@type"]).toBe("SoftwareSourceCode");
    expect("codeRepository" in ld && ld.codeRepository).toBe(
      "https://github.com/Seyit47/audit-app",
    );
  });

  it("uses CreativeWork otherwise", () => {
    const ld = projectJsonLd(getProject("datacorda")!);
    expect(ld["@type"]).toBe("CreativeWork");
    expect(ld.url).toBe(`${siteUrl()}/projects/datacorda`);
  });
});

describe("breadcrumbJsonLd", () => {
  it("numbers items from 1 in order", () => {
    const ld = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
      { name: projectsFixture[0]!.title, path: "/projects/audit-app" },
    ]);
    expect(ld.itemListElement.map((i) => i.position)).toEqual([1, 2, 3]);
    expect(ld.itemListElement[2]!.item).toBe(`${siteUrl()}/projects/audit-app`);
  });
});
