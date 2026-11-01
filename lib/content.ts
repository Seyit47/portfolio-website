import fs from "node:fs";
import path from "node:path";
import { allExperiences, allProfiles, allProjects, allSkills, allTags } from "content-collections";
import { PAGES } from "@/lib/content/pages";
import { validateContent } from "@/lib/content/validate";
import type {
  Education,
  PaletteEntry,
  Profile,
  Project,
  ProjectRecord,
  Role,
  SkillGroup,
  Tag,
} from "@/lib/content/types";
import { durationLabel, overlaps, periodLabel } from "@/lib/utils/dates";

export type { Education, PaletteEntry, Profile, Project, Role, SkillGroup, Tag };
export { PAGES };

function single<T>(docs: readonly T[], name: string): T {
  const doc = docs[0];
  if (!doc) throw new Error(`Content is incomplete: ${name} document is required`);
  return doc;
}

const profile = single(allProfiles as Profile[], "profile");
const experience = single(allExperiences, "experience");
const skillsDoc = single(allSkills, "skills");
const tagsDoc = single(allTags, "tags");

const publicDir = path.join(process.cwd(), "public");
const projectsDir = path.join(process.cwd(), "content", "projects");

// Content Collections logs, but does not fail on, documents that cannot be parsed.
// Guard against a case study silently disappearing from the site.
if (process.env.NODE_ENV !== "test" && fs.existsSync(projectsDir)) {
  const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
  const built = new Set((allProjects as ProjectRecord[]).map((p) => p.slug));
  const missing = files.map((f) => f.replace(/\.mdx$/, "")).filter((slug) => !built.has(slug));
  if (missing.length > 0) {
    throw new Error(
      `Content validation failed: project file(s) did not build (check frontmatter): ${missing.join(", ")}`,
    );
  }
}

validateContent({
  profile,
  experience,
  skills: skillsDoc,
  tags: tagsDoc,
  projects: allProjects as ProjectRecord[],
  fileExists: (publicPath) => fs.existsSync(path.join(publicDir, publicPath)),
});

const roles: Role[] = [...experience.roles]
  .sort((a, b) => b.start.localeCompare(a.start))
  .map((role, _i, all) => ({
    ...role,
    periodLabel: periodLabel(role.start, role.end),
    durationLabel: durationLabel(role.start, role.end),
    overlapsWith: all
      .filter((other) => other.id !== role.id && overlaps(role, other))
      .map((other) => other.id),
  }));

function displayOrder(a: ProjectRecord, b: ProjectRecord): number {
  if (b.year !== a.year) return b.year - a.year;
  const ao = a.order ?? Number.MAX_SAFE_INTEGER;
  const bo = b.order ?? Number.MAX_SAFE_INTEGER;
  if (ao !== bo) return ao - bo;
  return a.title.localeCompare(b.title);
}

const publishedProjects: ProjectRecord[] = (allProjects as ProjectRecord[])
  .filter((p) => p.published)
  .sort(displayOrder);

function readingMinutes(mdx: string): number {
  const words = mdx.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function enrich(project: ProjectRecord, index: number): Project {
  const prev = publishedProjects[index - 1];
  const next = publishedProjects[index + 1];
  return {
    ...project,
    prev: prev ? { slug: prev.slug, title: prev.title } : undefined,
    next: next ? { slug: next.slug, title: next.title } : undefined,
    employerRole: project.employer ? roles.find((r) => r.id === project.employer) : undefined,
    readingMinutes: readingMinutes(project.mdx ?? ""),
  };
}

const projects: Project[] = publishedProjects.map(enrich);

export function getProfile(): Profile {
  return profile;
}

export function getRoles(): Role[] {
  return roles;
}

export function getRole(id: string): Role | undefined {
  return roles.find((r) => r.id === id);
}

export function getEducation(): Education[] {
  return experience.education;
}

export function getSkillGroups(): SkillGroup[] {
  return [...skillsDoc.groups].sort((a, b) => a.order - b.order);
}

export function getTags(): Tag[] {
  return tagsDoc.tags;
}

export function getTag(slug: string): Tag | undefined {
  return tagsDoc.tags.find((t) => t.slug === slug);
}

export function getProjects(opts: { tag?: string; featured?: boolean } = {}): Project[] {
  return projects.filter((p) => {
    if (opts.tag && !p.tags.includes(opts.tag)) return false;
    if (opts.featured && !p.featured) return false;
    return true;
  });
}

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getPaletteEntries(): PaletteEntry[] {
  const p = getProfile();
  const pages: PaletteEntry[] = PAGES.map((page) => ({
    id: `page:${page.href}`,
    group: "Pages",
    label: page.label,
    hint: page.hint,
    href: page.href,
  }));
  const projectEntries: PaletteEntry[] = projects.map((project) => ({
    id: `project:${project.slug}`,
    group: "Projects",
    label: project.title,
    hint: `${project.year} · ${project.type}`,
    href: `/projects/${project.slug}`,
    keywords: project.tags,
  }));
  const links: PaletteEntry[] = [
    {
      id: "link:github",
      group: "Links",
      label: "GitHub",
      hint: "github.com/Seyit47",
      href: p.links.github,
      external: true,
    },
    {
      id: "link:linkedin",
      group: "Links",
      label: "LinkedIn",
      hint: "Profile",
      href: p.links.linkedin,
      external: true,
    },
    {
      id: "link:email",
      group: "Links",
      label: "Email",
      hint: p.email,
      href: `mailto:${p.email}`,
      external: true,
    },
    {
      id: "link:resume",
      group: "Links",
      label: "Download resume",
      hint: "PDF",
      href: p.resume.path,
      external: true,
    },
  ];
  return [...pages, ...projectEntries, ...links];
}
