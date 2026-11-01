import type { Experience, Profile, ProjectRecord, Tag } from "./types";
import type { z } from "zod";
import type { skillsSchema, tagsSchema } from "@/content-collections";

type SkillsDoc = z.infer<typeof skillsSchema>;
type TagsDoc = z.infer<typeof tagsSchema>;

export type ContentBundle = {
  profile: Profile;
  experience: Experience;
  skills: SkillsDoc;
  tags: TagsDoc;
  projects: ProjectRecord[];
  /** Resolves a public path such as "/images/projects/x/hero.png" to whether the file exists. */
  fileExists: (publicPath: string) => boolean;
};

export class ContentValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ContentValidationError";
  }
}

function fileOf(project: ProjectRecord): string {
  return project._meta?.filePath ?? `projects/${project.slug}.mdx`;
}

/**
 * Cross-collection invariants from contracts/content-schema.md.
 * Throws a ContentValidationError naming the offending file.
 */
export function validateContent(bundle: ContentBundle): void {
  const errors: string[] = [];
  const roleIds = new Set(bundle.experience.roles.map((r) => r.id));
  const tagSlugs = new Set<string>((bundle.tags.tags as Tag[]).map((t) => t.slug));
  const projectSlugs = new Set(bundle.projects.map((p) => p.slug));

  for (const project of bundle.projects) {
    if (project.employer && !roleIds.has(project.employer)) {
      errors.push(`${fileOf(project)}: employer "${project.employer}" does not match any role id`);
    }
    for (const tag of project.tags) {
      if (!tagSlugs.has(tag)) {
        errors.push(`${fileOf(project)}: unknown tag "${tag}"`);
      }
    }
    for (const visual of project.visuals) {
      if (!bundle.fileExists(visual.src)) {
        errors.push(`${fileOf(project)}: visual "${visual.src}" does not exist under public/`);
      }
    }
  }

  for (const role of bundle.experience.roles) {
    for (const related of role.relatedProjects) {
      if (!projectSlugs.has(related)) {
        errors.push(
          `experience.yaml: role "${role.id}" relatedProjects "${related}" does not exist`,
        );
      }
    }
  }

  for (const group of bundle.skills.groups) {
    for (const skill of group.skills) {
      for (const tag of skill.tags ?? []) {
        if (!tagSlugs.has(tag)) {
          errors.push(`skills.yaml: skill "${skill.name}" has unknown tag "${tag}"`);
        }
      }
    }
  }

  const featured = bundle.projects.filter((p) => p.published && p.featured).length;
  if (featured < 3 || featured > 4) {
    errors.push(`projects: ${featured} featured published projects; expected 3 or 4`);
  }

  if (errors.length > 0) {
    throw new ContentValidationError(`Content validation failed:\n- ${errors.join("\n- ")}`);
  }
}
