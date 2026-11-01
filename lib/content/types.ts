import type { z } from "zod";
import type {
  educationSchema,
  experienceSchema,
  profileSchema,
  projectFrontmatter,
  roleSchema,
  skillsSchema,
  tagsSchema,
} from "@/content-collections";

export type Profile = z.infer<typeof profileSchema>;
export type RoleRecord = z.infer<typeof roleSchema>;
export type Education = z.infer<typeof educationSchema>;
export type Experience = z.infer<typeof experienceSchema>;
export type SkillGroup = z.infer<typeof skillsSchema>["groups"][number];
export type Skill = SkillGroup["skills"][number];
export type Tag = z.infer<typeof tagsSchema>["tags"][number];
export type ProjectRecord = z.infer<typeof projectFrontmatter> & {
  slug: string;
  mdx: string;
  _meta?: { filePath: string };
};

export type Role = RoleRecord & {
  periodLabel: string;
  durationLabel: string;
  overlapsWith: string[];
};

export type Project = ProjectRecord & {
  prev?: Pick<ProjectRecord, "slug" | "title">;
  next?: Pick<ProjectRecord, "slug" | "title">;
  employerRole?: Role;
  readingMinutes: number;
};

export type PaletteEntry = {
  id: string;
  group: "Pages" | "Projects" | "Links";
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
  keywords?: string[];
};
