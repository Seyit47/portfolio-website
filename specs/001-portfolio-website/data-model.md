# Data Model: Portfolio Website

**Date**: 2026-11-01 | **Plan**: [plan.md](plan.md) | **Schemas**: [contracts/content-schema.md](contracts/content-schema.md)

All entities except Contact Message are static content validated at build
time. There is no database; relationships are resolved by slug at build time
in `lib/content.ts`. Field types below are conceptual; exact Zod shapes are in
the content-schema contract.

## Owner Profile (`content/profile.yaml`, exactly one)

| Field | Type | Rules |
|-------|------|-------|
| name | string | required; "Seyit Geldiyev" |
| alternateNames | string[] | optional; includes "Seyitmyrat Geldiyew" |
| title | string | required; "Middle+ Software Engineer" |
| tagline | string | required; 60-160 chars; the one-sentence value proposition |
| summary | string (markdown) | required; 1-3 paragraphs for the About strip |
| location | { city, country } | required |
| availability | enum `open` \| `limited` \| `unavailable` + label | required; default `open`, label "Open to new opportunities" |
| email | string | required; valid email |
| links | { github, linkedin, website? } | required URLs |
| resume | { path, filename } | required; path under `public/`, filename for download |
| languages | { name, level }[] | required; level from CEFR-like enum |
| certifications | { name, issuer?, year? }[] | optional |
| seo | { siteName, defaultDescription, ogImageAlt } | required |

## Experience Entry (`content/experience.yaml`, list)

| Field | Type | Rules |
|-------|------|-------|
| id | slug | required, unique |
| employer | string | required |
| employerUrl | URL | optional |
| role | string | required |
| start | YYYY-MM | required |
| end | YYYY-MM \| `present` | required; `end >= start` |
| location | string | required |
| remote | boolean | default false |
| highlights | string[] | required; 1-8 items, each <= 240 chars |
| relatedProjects | slug[] | optional; must resolve to Project slugs |

Derived: `periodLabel` ("May 2025 - Jun 2026"), `durationLabel`
("1 yr 2 mos"), `overlapsWith` (ids of entries whose intervals intersect, used
by the timeline to draw parallel lanes). Entries are ordered by `start`
descending. Validation: at least one entry; no duplicate ids; resume
consistency script asserts employer, role and period for every entry.

## Education Entry (`content/experience.yaml`, key `education`)

| Field | Type | Rules |
|-------|------|-------|
| institution | string | required |
| degree | string | required |
| field | string | required |
| start / end | YYYY-MM | required |
| location | string | optional |

## Skill Group and Skill (`content/skills.yaml`)

| Entity | Field | Type | Rules |
|--------|-------|------|-------|
| SkillGroup | id | slug | required, unique |
| SkillGroup | name | string | required |
| SkillGroup | order | integer | required; display order |
| SkillGroup | skills | Skill[] | 1-15 items |
| Skill | name | string | required |
| Skill | level | enum `primary` \| `working` \| `familiar` | required; rendered as depth indicator |
| Skill | tags | slug[] | optional; links a skill to project Tags for cross-highlighting |

## Project (`content/projects/<slug>.mdx`, frontmatter + body)

| Field | Type | Rules |
|-------|------|-------|
| slug | slug | required, unique, equals filename |
| title | string | required; <= 60 chars |
| year | integer | required; 2018-2030 |
| type | string | required; e.g. "Full-stack platform" |
| summary | string | required; 80-200 chars (card + meta description) |
| role | string | required |
| period | string | required; free text, e.g. "2026" or "Jun 2023 - Oct 2023" |
| employer | Experience id | optional; resolves to an Experience Entry |
| problem | string (markdown) | required |
| solution | string (markdown) | required |
| highlights | string[] | required; 2-8 items |
| outcome | string (markdown) | required; may contain metrics |
| metrics | { label, value }[] | optional; up to 4 callouts |
| tags | slug[] | required; 1-6; each must exist in the Tag registry |
| featured | boolean | default false; exactly 3-4 featured across the collection (validated) |
| order | integer | optional; manual sort within the same year |
| links | { live?: URL, source?: URL } | optional; omitted links are never rendered |
| visuals | { src, alt, kind: `image` \| `video`, width, height }[] | optional; when empty, `placeholder = true` |
| published | boolean | default true; unpublished projects are excluded from index, sitemap, palette and prev/next |
| body | MDX | required; long-form case study rendered below the fixed sections |

Derived: `prev` / `next` (adjacent published projects in display order),
`ogImageUrl`, `jsonLd` (CreativeWork), `readingTime`. Display order: `year`
descending, then `order` ascending, then `title`.

Initial records (from spec Profile Source Data): audit-app,
sdd-navigator-dashboard, max-web-chat, canvas-challenge, checkout-challenge,
instant-play-video-navigator, datacorda, belli-creative-tools,
kinestex-dashboard. Featured: audit-app, sdd-navigator-dashboard, datacorda,
instant-play-video-navigator.

## Tag (registry in `content/tags.yaml`)

| Field | Type | Rules |
|-------|------|-------|
| slug | slug | required, unique; used in `/projects/tag/<slug>` |
| label | string | required |
| description | string | optional; shown when filter is active |

Initial tags: dashboard, full-stack, mobile, performance, e-commerce,
canvas, media, saas, tooling, design-to-code.

## Contact Message (transient, server only)

| Field | Type | Rules |
|-------|------|-------|
| name | string | 2-80 chars, trimmed |
| email | string | valid email, <= 254 chars |
| message | string | 10-2000 chars, trimmed |
| website (honeypot) | string | must be empty; hidden from humans |
| renderedAt | integer (ms epoch) | form render time; now - renderedAt must be between 3 s and 24 h |
| ipHash | string | SHA-256 of client IP + daily salt; rate-limit key only, never logged in full |

### Submission state machine (client `useActionState`)

```text
idle -> submitting -> success
                   -> invalid  (field errors; stays on form, focus first error)
                   -> rejected (spam detected; rendered identically to success)
                   -> limited  (rate limit hit; message with retry-after + mailto fallback)
                   -> failed   (delivery error; message with mailto fallback)
```

No state is persisted on the site. Rate-limit counters expire after 10
minutes.

## Relationships

```text
OwnerProfile 1 ── * ExperienceEntry ── * Project (via employer)
OwnerProfile 1 ── * SkillGroup ── * Skill ── * Tag (optional)
Project * ── * Tag
Project ── prev/next ── Project (derived)
```

## Build-time validation summary

- Every YAML/MDX document parses against its Zod schema or the build fails.
- Cross-references (`relatedProjects`, `employer`, `tags`, skill `tags`) must
  resolve; dangling references fail the build with the offending file name.
- Featured count must be 3 or 4.
- Every `visuals[].src` must exist under `public/`; otherwise the build fails.
- `scripts/check-resume.ts` asserts Experience entries appear in the PDF.
