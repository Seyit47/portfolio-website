# Implementation Plan: Portfolio Website

**Branch**: `001-portfolio-website` | **Date**: 2026-11-01 | **Spec**: [spec.md](spec.md)

**Input**: Feature specification from `/specs/001-portfolio-website/spec.md`

## Summary

Build Seyit Geldiyev's personal portfolio: a statically generated, content-driven
site (Home, Projects index, project case studies, Experience, Contact, Not Found)
with a signature animated hero, page transitions, command palette and
light/dark theme, all layered progressively over server-rendered HTML.
Technical approach: Next.js 16 App Router on Vercel, TypeScript strict,
Tailwind CSS 4 with CSS-variable design tokens, Zod-validated content
collections (YAML profile data + MDX case studies), Motion for animation,
a lightweight WebGL hero loaded after the page is interactive, a Server Action
for the contact form (Zod validation, honeypot + timing, Upstash rate limit,
Resend delivery), and a CI gate of Vitest, Playwright (e2e + visual + axe),
Lighthouse CI budgets and a resume-consistency script.

## Technical Context

**Language/Version**: TypeScript (`strict: true`; the version `create-next-app` pins for Next 16.4, currently 5.9+, with TypeScript 7 native compiler adopted once Next declares support), Node.js 24 LTS, pnpm 12

**Primary Dependencies**: Next.js 16 (16.3.8 installed; App Router, Turbopack, static
prerendering, `cacheComponents` off, see research R1), React 19.3, Tailwind CSS 4.3, Content Collections 0.15 with
MDX (`@content-collections/core|next|mdx`), Zod 4, CSS-driven motion with a
1 KB IntersectionObserver helper (Motion dropped during implementation, see
research R4), OGL 1.0 (hero WebGL, lazy), cmdk 1.1 (palette),
next-themes 0.4 (theme), Resend 6 (email), `@upstash/ratelimit` 2
(rate limit), `schema-dts` (JSON-LD types), `@vercel/analytics` (cookieless,
optional)

**Storage**: No database. Content lives in the repository (`content/*.yaml`,
`content/projects/*.mdx`, `public/resume.pdf`). Contact messages are transient
(delivered by email, not persisted). Rate-limit counters live in Upstash Redis
with a 10-minute TTL.

**Testing**: Vitest 5 + Testing Library (unit: content loaders, validation,
utilities, components); Playwright 1.64 (e2e per user story, visual snapshots
for Home and shared layouts, `@axe-core/playwright` accessibility scans in
both themes); Lighthouse CI 0.15 with budget assertions; `scripts/check-resume.ts`
(pdf-parse) asserting site data matches the resume PDF

**Target Platform**: Vercel (static pages + one Server Action on Node runtime);
browsers: latest two majors of Chrome, Firefox, Safari, Edge, iOS Safari,
Android Chrome

**Project Type**: Web application, single Next.js project (no separate backend)

**Performance Goals**: LCP < 2.5 s, INP < 200 ms, CLS < 0.1 at p75 on simulated
mid-tier mobile; landing-page JavaScript < 150 KB compressed; animations
sustain 60 fps on mid-tier mobile; Lighthouse >= 95 in all four categories

**Constraints**: Primary content and navigation work without JavaScript;
WCAG 2.2 AA in both themes; `prefers-reduced-motion` honoured everywhere; no
tracking cookies, no cookie banner; every runtime dependency justified in
research.md; content changes never require component changes

**Scale/Scope**: Single owner; 6 route types, ~8-10 projects, 5 roles,
1 education entry, ~40 skills; expected traffic < 10k visits/month; one
contributor plus AI tooling

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Gate | Status (pre-research) | Status (post-design) |
|---|-----------|------|------------------------|----------------------|
| I | Showcase-First | Every route serves projects, skills, credibility or contact; content as structured data separate from presentation; decorative features justified in spec | PASS: routes = Home, Projects, Project, Experience, Contact, 404 (spec FR-001). Content in `content/` validated by Zod (FR-004). Hero/palette/transitions justified in spec Story 5 | PASS: data-model.md and contracts/content-schema.md define the content layer; no component reads data outside `lib/content.ts` |
| II | Performance Is a Feature | CWV targets; < 150 KB compressed JS on landing; heavy visuals lazy; Lighthouse report per PR touching landing/layout; regression > 5 points blocks | PASS: budget set in Technical Context; OGL hero and Motion features dynamically imported; Lighthouse CI in CI with `budgets.json` | PASS: research.md R3/R4 size estimates total ~75 KB compressed on landing before hero; hero loads post-interactive |
| III | Accessible by Default | WCAG 2.2 AA; keyboard + visible focus; AA contrast in every theme; text alternatives for canvases; axe in CI with zero serious/critical | PASS: FR-024/025; axe scans in Playwright for both themes; hero canvas `aria-hidden` with text content outside it | PASS: contracts/routes-and-metadata.md lists landmarks, skip link and focus rules per route |
| IV | Deliberate Motion & Polish | Purposeful motion; reduced-motion honoured; core content works without JS/WebGL; compositor-only properties at 60 fps; design tokens single source | PASS: FR-016 to FR-020; tokens in `styles/tokens.css` consumed by Tailwind 4 `@theme`; Motion limited to transform/opacity | PASS: research.md R4/R5 define motion rules and the reduced-motion matrix |
| V | Quality Gates Before Merge | Test-first for logic; e2e per page; visual snapshots for Home + layouts; CI: typecheck, lint, unit, e2e, a11y, perf budget; build zero warnings | PASS: tooling chosen (Vitest, Playwright, LHCI); CI workflow in `.github/workflows/ci.yml`; `next build` with `--no-lint`-free config and warnings as errors | PASS: quickstart.md lists the exact commands and expected results |
| TS | Technical Standards | TypeScript strict; SSG/SSR; SEO metadata, sitemap, robots, JSON-LD; mobile-first at 360/768/1024/1440; privacy-preserving analytics; spam-protected server-validated form; dependencies justified | PASS: all pages prerendered; Metadata API + `sitemap.ts` + `robots.ts` + JSON-LD; Vercel Analytics cookieless; Server Action with Zod + honeypot + rate limit | PASS: dependency table in research.md R10 |
| WF | Development Workflow | Spec -> plan -> tasks -> implement; Constitution Check in spec; feature branches + PRs; preview deploys; main always deployable | PASS: this document; repository to be initialised with `main` protected and `001-portfolio-website` branch; Vercel Git integration for previews | PASS |

**Gate result**: PASS. No violations; Complexity Tracking left empty.

## Project Structure

### Documentation (this feature)

```text
specs/001-portfolio-website/
├── plan.md              # This file (/speckit-plan command output)
├── research.md          # Phase 0 output (/speckit-plan command)
├── data-model.md        # Phase 1 output (/speckit-plan command)
├── quickstart.md        # Phase 1 output (/speckit-plan command)
├── contracts/           # Phase 1 output (/speckit-plan command)
│   ├── content-schema.md
│   ├── contact-form.md
│   └── routes-and-metadata.md
└── tasks.md             # Phase 2 output (/speckit-tasks command - NOT created by /speckit-plan)
```

### Source Code (repository root)

```text
app/
├── layout.tsx                  # html/body, theme provider, skip link, header, footer, palette mount
├── template.tsx                # page-transition wrapper (Motion, reduced-motion aware)
├── page.tsx                    # Home: hero, featured projects, about strip, contact strip
├── not-found.tsx               # designed 404
├── sitemap.ts                  # generated from content
├── robots.ts
├── manifest.ts
├── opengraph-image.tsx         # branded default OG image
├── projects/
│   ├── page.tsx                # index (all projects)
│   ├── tag/[tag]/page.tsx      # filtered index, generateStaticParams per tag
│   └── [slug]/
│       ├── page.tsx            # case study (MDX), prev/next, JSON-LD CreativeWork
│       └── opengraph-image.tsx # generated per-project OG image
├── experience/
│   └── page.tsx                # timeline, skills, education, resume download
└── contact/
    ├── page.tsx                # links + form
    └── actions.ts              # Server Action: validate, spam checks, rate limit, send

components/
├── ui/                         # Button, Card, Tag, Badge, Link, Section, Prose
├── layout/                     # Header, Footer, SkipLink, Nav
├── hero/                       # Hero (server), HeroCanvas.client (OGL, dynamic import), HeroFallback
├── projects/                   # ProjectCard, ProjectGrid, TagFilter, ProjectPager
├── experience/                 # Timeline, RoleItem (disclosure), SkillsGrid, EducationCard
├── contact/                    # ContactForm (useActionState, progressive enhancement)
├── palette/                    # CommandPalette.client (cmdk), PaletteTrigger
├── theme/                      # ThemeProvider, ThemeToggle
└── motion/                     # MotionProvider (LazyMotion), Reveal, useMotionPreference

content/
├── profile.yaml                # Owner Profile
├── experience.yaml             # Experience + Education entries
├── skills.yaml                 # Skill groups
└── projects/*.mdx              # one case study per project (frontmatter = Project)

lib/
├── content.ts                  # typed accessors over content-collections output
├── seo.ts                      # metadata helpers, JSON-LD builders (schema-dts)
├── contact/
│   ├── schema.ts               # Zod schema for ContactMessage
│   ├── spam.ts                 # honeypot + timing checks
│   ├── rate-limit.ts           # Upstash wrapper (no-op when env missing)
│   └── email.ts                # Resend wrapper
└── utils/                      # cn, dates, slugs

styles/
├── tokens.css                  # design tokens: colour (light/dark), type scale, spacing, motion
└── globals.css                 # Tailwind 4 @import + @theme mapping tokens

public/
├── resume.pdf                  # served download (copy of provided PDF)
└── images/projects/<slug>/     # visuals; placeholder.svg when none

scripts/
└── check-resume.ts             # asserts experience.yaml matches public/resume.pdf

tests/
├── unit/                       # Vitest: content loaders, contact schema/spam, seo builders, components
└── e2e/                        # Playwright: one spec per user story + a11y.spec + visual.spec
    └── __snapshots__/

content-collections.ts          # collection definitions (Zod schemas from contracts/content-schema.md)
next.config.ts                  # withContentCollections, images, headers
lighthouserc.cjs + budgets.json # LHCI assertions
playwright.config.ts · vitest.config.ts · eslint.config.mjs · tsconfig.json
.github/workflows/ci.yml        # typecheck, lint, unit, build, e2e+a11y+visual, lhci, check-resume
```

**Structure Decision**: Single Next.js application at the repository root (no
monorepo): there is one deployable and one backend concern (the contact
Server Action), so separate `frontend/` and `backend/` trees would add
indirection without benefit. Content is isolated under `content/` and reached
only through `lib/content.ts`, satisfying Principle I's separation of data and
presentation. Tests live under `tests/` split by runner.

## Complexity Tracking

No constitution violations. Nothing to justify.
