# Contract: Content Schema

Defines the Zod schemas implemented in `content-collections.ts`. Content
authors (the owner) write files that satisfy these shapes; components consume
only the typed output through `lib/content.ts`. Changing a schema is a
contract change and requires updating this file, the data model and any
affected tests.

## Collections

| Collection | Directory / file | Format | Cardinality |
|------------|------------------|--------|-------------|
| profile | `content/profile.yaml` | YAML | exactly 1 |
| experience | `content/experience.yaml` | YAML (`roles[]`, `education[]`) | 1 file |
| skills | `content/skills.yaml` | YAML (`groups[]`) | 1 file |
| tags | `content/tags.yaml` | YAML (`tags[]`) | 1 file |
| projects | `content/projects/*.mdx` | MDX with YAML frontmatter | 1 file per project |

## Schemas (TypeScript/Zod, abbreviated)

```ts
const slug = z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const url = z.string().url();

export const profileSchema = z.object({
  name: z.string().min(1),
  alternateNames: z.array(z.string()).default([]),
  title: z.string().min(1),
  tagline: z.string().min(60).max(160),
  summary: z.string().min(1),
  location: z.object({ city: z.string(), country: z.string() }),
  availability: z.object({
    status: z.enum(['open', 'limited', 'unavailable']),
    label: z.string().min(1),
  }),
  email: z.string().email(),
  links: z.object({ github: url, linkedin: url, website: url.optional() }),
  resume: z.object({ path: z.string().startsWith('/'), filename: z.string().endsWith('.pdf') }),
  languages: z.array(z.object({ name: z.string(), level: z.string() })),
  certifications: z.array(z.object({ name: z.string(), issuer: z.string().optional(), year: z.number().int().optional() })).default([]),
  seo: z.object({ siteName: z.string(), defaultDescription: z.string().max(160), ogImageAlt: z.string() }),
});

export const roleSchema = z.object({
  id: slug,
  employer: z.string().min(1),
  employerUrl: url.optional(),
  role: z.string().min(1),
  start: yearMonth,
  end: z.union([yearMonth, z.literal('present')]),
  location: z.string().min(1),
  remote: z.boolean().default(false),
  highlights: z.array(z.string().max(240)).min(1).max(8),
  relatedProjects: z.array(slug).default([]),
}).refine(r => r.end === 'present' || r.end >= r.start, { message: 'end before start' });

export const educationSchema = z.object({
  institution: z.string(), degree: z.string(), field: z.string(),
  start: yearMonth, end: yearMonth, location: z.string().optional(),
});

export const skillsSchema = z.object({
  groups: z.array(z.object({
    id: slug, name: z.string(), order: z.number().int(),
    skills: z.array(z.object({
      name: z.string(),
      level: z.enum(['primary', 'working', 'familiar']),
      tags: z.array(slug).default([]),
    })).min(1).max(15),
  })).min(1),
});

export const tagsSchema = z.object({
  tags: z.array(z.object({ slug, label: z.string(), description: z.string().optional() })),
});

export const projectFrontmatter = z.object({
  title: z.string().max(60),
  year: z.number().int().min(2018).max(2030),
  type: z.string(),
  summary: z.string().min(80).max(200),
  role: z.string(),
  period: z.string(),
  employer: slug.optional(),
  problem: z.string(), solution: z.string(),
  highlights: z.array(z.string()).min(2).max(8),
  outcome: z.string(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).max(4).default([]),
  tags: z.array(slug).min(1).max(6),
  featured: z.boolean().default(false),
  order: z.number().int().optional(),
  links: z.object({ live: url.optional(), source: url.optional() }).default({}),
  visuals: z.array(z.object({
    src: z.string().startsWith('/images/projects/'),
    alt: z.string().min(1),
    kind: z.enum(['image', 'video']).default('image'),
    width: z.number().int(), height: z.number().int(),
  })).default([]),
  published: z.boolean().default(true),
});
```

## Cross-collection invariants (enforced in a `transform`/post-build check)

1. `project.employer` must match a `role.id`.
2. `role.relatedProjects[*]` and `project.tags[*]` and `skill.tags[*]` must
   resolve to existing slugs.
3. Count of `featured && published` projects must be 3 or 4.
4. Each `visuals[].src` must exist under `public/`.
5. Project `slug` is derived from the filename; duplicate filenames are
   impossible by construction.

## Public accessor contract (`lib/content.ts`)

```ts
getProfile(): Profile
getRoles(): Role[]                       // start desc, with periodLabel, durationLabel, overlapsWith
getEducation(): Education[]
getSkillGroups(): SkillGroup[]           // ordered
getTags(): Tag[]
getProjects(opts?: { tag?: string; featured?: boolean }): Project[]  // published only, display order
getProject(slug: string): Project | undefined   // with prev/next
getPaletteEntries(): PaletteEntry[]      // pages + projects + external links
```

All functions are synchronous and pure over build output; no I/O at request
time.
