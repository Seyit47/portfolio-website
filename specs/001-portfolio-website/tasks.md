---

description: "Task list for the Portfolio Website feature"
---

# Tasks: Portfolio Website

**Input**: Design documents from `/specs/001-portfolio-website/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Included. The constitution (Principle V) requires test-first for all
`lib/` logic, one end-to-end test per page, visual snapshots for Home and shared
layouts, and accessibility scans in CI. Each story phase therefore starts with
its tests, which must fail before the implementation tasks begin.

**Organization**: Tasks are grouped by user story so each story is an
independently testable increment. Paths are relative to the repository root
(single Next.js project, see plan.md "Project Structure").

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1 to US5)
- Include exact file paths in descriptions

## Path Conventions

- App routes in `app/`, components in `components/`, logic in `lib/`, content
  in `content/`, styles in `styles/`, static files in `public/`, unit tests in
  `tests/unit/`, end-to-end tests in `tests/e2e/`, scripts in `scripts/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialise the repository, the Next.js project and the toolchain from research.md R1, R2, R9, R11.

- [X] T001 Initialise git at the repository root with default branch `main`, create and check out branch `001-portfolio-website`, and add `.gitignore` for Node/Next (`node_modules`, `.next`, `.content-collections`, `.env*.local`, `test-results`, `playwright-report`, `.lighthouseci`)
- [X] T002 Scaffold Next.js 16.4 with `pnpm create next-app@latest . --ts --app --tailwind --eslint --src-dir=false --import-alias "@/*" --use-pnpm --turbopack` (keep `app/`, remove sample content), then add `.nvmrc` containing `24` and `packageManager` field `pnpm@12` in `package.json`
- [X] T003 Install runtime dependencies with pnpm: `motion`, `cmdk`, `next-themes`, `ogl`, `zod`, `resend`, `@upstash/ratelimit`, `@upstash/redis`, `schema-dts`, `@vercel/analytics`, `@content-collections/core`, `@content-collections/next`, `@content-collections/mdx`; and dev dependencies: `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `@playwright/test`, `@axe-core/playwright`, `@lhci/cli`, `pdf-parse`, `tsx`, `prettier`, `prettier-plugin-tailwindcss`, `eslint-plugin-jsx-a11y`, `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional`
- [X] T004 [P] Enable TypeScript strict mode and `noUncheckedIndexedAccess` in `tsconfig.json`, add path alias `@/*`, and include `content-collections.ts`, `scripts/**`, `tests/**` in `include`
- [X] T005 [P] Configure ESLint flat config in `eslint.config.mjs` with `eslint-config-next` and `eslint-plugin-jsx-a11y` (strict), `--max-warnings 0`; add `.prettierrc` with `prettier-plugin-tailwindcss` and `.prettierignore`
- [X] T006 [P] Configure Husky, lint-staged and commitlint: `.husky/pre-commit` running `lint-staged`, `.husky/commit-msg` running `commitlint`, `lint-staged` config in `package.json` (eslint --fix, prettier --write), `commitlint.config.mjs` extending conventional
- [X] T007 [P] Configure Vitest in `vitest.config.ts` (react plugin, `jsdom` environment, `tests/unit/**/*.test.{ts,tsx}`, setup file `vitest.setup.ts` importing `@testing-library/jest-dom/vitest`, alias `@/*`)
- [X] T008 [P] Configure Playwright in `playwright.config.ts`: `testDir: tests/e2e`, `webServer` running `pnpm build && pnpm start` on port 3000 with `reuseExistingServer`, projects `mobile` (360x740, Pixel-like) and `desktop` (1440x900), `reducedMotion: 'no-preference'` default, `expect.toHaveScreenshot` with `maxDiffPixelRatio: 0.01`, and `baseURL` `http://localhost:3000`
- [X] T009 [P] Configure Lighthouse CI in `lighthouserc.cjs` (collect `/`, `/projects`, `/projects/audit-app`, `/experience`, `/contact` with mobile preset, 3 runs, `startServerCommand: pnpm start`) and `budgets.json` (script transfer size <= 150000 bytes on `/`); assert `categories:performance|accessibility|best-practices|seo >= 0.95`
- [X] T010 [P] Add npm scripts to `package.json`: `dev`, `build`, `start`, `typecheck` (`tsc --noEmit`), `lint`, `format`, `test` (vitest run), `test:watch`, `e2e` (playwright test), `e2e:update` (playwright test --update-snapshots), `lhci` (lhci autorun), `check:resume` (tsx scripts/check-resume.ts), `ci` (typecheck, lint, test, build, check:resume, e2e, lhci in order)
- [X] T011 [P] Create `.env.example` with `SITE_URL`, `RESEND_API_KEY`, `CONTACT_FROM`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `CONTACT_IP_SALT`, `CONTACT_FORCE_FAIL` and one-line comments per variable (behaviour when missing per contracts/contact-form.md)
- [X] T012 [P] Create GitHub Actions workflow `.github/workflows/ci.yml` running on pull requests and `main`: setup Node 24 + pnpm cache, `pnpm install --frozen-lockfile`, `playwright install --with-deps chromium`, then `typecheck`, `lint`, `test`, `build`, `check:resume`, `e2e`, `lhci`; upload `playwright-report` and `.lighthouseci` as artifacts on failure
- [X] T013 [P] Copy `geldiyev-seyitmyrat-resume.pdf` to `public/resume.pdf`, remove the root copy from the deliverable (keep it ignored or delete), and create `public/images/projects/placeholder.svg` (branded 1200x675 placeholder)
- [X] T014 [P] Write `CLAUDE.md` at the repository root summarising the stack, commands, content workflow (add a project = one MDX file), constitution pointers and the test-first rule

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Content layer, design tokens, root layout, SEO helpers and shared UI that every story depends on. Content schemas come from contracts/content-schema.md and data-model.md.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Content layer (test-first)

- [X] T015 [P] Write failing unit tests for the content accessors in `tests/unit/lib/content.test.ts`: `getProfile()` returns the profile; `getRoles()` is ordered by `start` descending and exposes `periodLabel`, `durationLabel`, `overlapsWith`; `getProjects()` excludes `published: false`, orders by `year` desc then `order` asc then `title`; `getProjects({ tag })` filters; `getProjects({ featured: true })` returns 3-4 items; `getProject(slug)` returns `prev`/`next`; `getPaletteEntries()` lists pages, projects and external links
- [X] T016 [P] Write failing unit tests for cross-collection validation in `tests/unit/lib/content-validate.test.ts`: dangling `employer`, `relatedProjects`, `tags`, skill `tags` throw with the file name; featured count outside 3-4 throws; missing `visuals[].src` under `public/` throws
- [X] T017 Create `content-collections.ts` defining collections `profile`, `experience`, `skills`, `tags`, `projects` with the exact Zod schemas from `contracts/content-schema.md` (slug regex `^[a-z0-9]+(?:-[a-z0-9]+)*$`, `yearMonth` regex, `tagline` 60-160 chars, `highlights` 1-8 items of <= 240 chars, role `end >= start` or `present`, project `title` <= 60, `summary` 80-200, `year` 2018-2030, `highlights` 2-8, `tags` 1-6, `metrics` <= 4, `visuals[].src` starts with `/images/projects/`, `published` default true, `featured` default false); MDX compiled with `@content-collections/mdx`
- [X] T018 Wire Content Collections into `next.config.ts` with `withContentCollections`, add `images` config (formats avif/webp, device sizes for 360/768/1024/1440), and verify `pnpm dev` generates `.content-collections/generated`; if generation fails on Next 16.4, switch to Velite 0.4 with the same schemas and record the change in `research.md` R3
- [X] T019 Implement `lib/content/validate.ts` enforcing the cross-collection invariants (resolvable `employer`, `relatedProjects`, `tags`, skill `tags`; featured published count is 3 or 4; every `visuals[].src` exists under `public/`), executed from `content-collections.ts` `onSuccess`/transform so an invalid document fails the build with its file name
- [X] T020 Implement `lib/content.ts` accessors (`getProfile`, `getRoles`, `getEducation`, `getSkillGroups`, `getTags`, `getProjects`, `getProject`, `getPaletteEntries`) and `lib/utils/dates.ts` (`periodLabel` "May 2025 - Jun 2026", `durationLabel` "1 yr 2 mos", `overlaps(a, b)`), making T015 and T016 pass

### Initial content (from spec "Profile Source Data")

- [X] T021 [P] Create `content/profile.yaml`: name "Seyit Geldiyev", `alternateNames` ["Seyitmyrat Geldiyew"], title "Middle+ Software Engineer", tagline (60-160 chars) on building fast, accessible dashboards and SaaS front-ends, summary from the resume, location Ashgabat / Turkmenistan, availability `open` "Open to new opportunities", email seyitbu1111@gmail.com, links github `https://github.com/Seyit47` and linkedin `https://www.linkedin.com/in/seyitgeldiyev-55a17b230`, resume `/resume.pdf` filename `Seyit-Geldiyev-Resume.pdf`, languages (Turkmen native, Turkish full professional, English professional C2, Russian professional), certifications (JavaScript Algorithms and Data Structures; JavaScript Intermediate; CSS; Introduction to Cybersecurity; EF SET English C2 71/100), `seo` siteName/defaultDescription/ogImageAlt
- [X] T022 [P] Create `content/experience.yaml` with five roles (ids `kinestex`, `ynamly-belentlik`, `foreach-partners`, `datacorda`, `belli-creative`) using exact employer names, titles, `YYYY-MM` periods (2025-05..2026-06, 2022-12..2026-06, 2024-12..2025-03, 2023-06..2023-10, 2020-06..2022-11), locations, `remote` flags, highlight bullets copied from the resume (<= 240 chars each), `relatedProjects`; and `education` entry (Institute of Telecommunications and Informatics of Turkmenistan, Engineer's degree, Information Security Engineering, 2021-09..2026-06)
- [X] T023 [P] Create `content/skills.yaml` with groups in order: Front-end frameworks & server rendering; Component systems & styling; State & data fetching; Backend-in-frontend APIs; Cloud, CI/CD & hosting; Containers & server administration; Scripting languages; Design-to-code workflow; AI-assisted & spec-driven development; each skill with `level` in `primary | working | familiar` and optional `tags`
- [X] T024 [P] Create `content/tags.yaml` with slugs `dashboard`, `full-stack`, `mobile`, `performance`, `e-commerce`, `canvas`, `media`, `saas`, `tooling`, `design-to-code` and labels/descriptions
- [X] T025 [P] Create featured case studies `content/projects/audit-app.mdx`, `content/projects/sdd-navigator-dashboard.mdx`, `content/projects/datacorda.mdx`, `content/projects/instant-play-video-navigator.mdx` with full frontmatter (title <= 60, summary 80-200 chars, year, type, role, period, employer id where applicable, problem, solution, 2-8 highlights, outcome, up to 4 metrics, 1-6 tags, `featured: true`, `links.live`/`links.source` from GitHub where they exist) and an MDX body with sections "Context", "What I built", "Decisions", "Result"
- [X] T026 [P] Create remaining case studies `content/projects/max-web-chat.mdx`, `content/projects/canvas-challenge.mdx`, `content/projects/checkout-challenge.mdx`, `content/projects/belli-creative-tools.mdx` (no `links`), `content/projects/kinestex-dashboard.mdx` (no `links`, employer `kinestex`) with the same frontmatter rules and `featured: false`

### Design tokens, layout and shared UI

- [X] T027 [P] Create `styles/tokens.css` with CSS custom properties: colour palette for light (`:root`) and dark (`.dark`) including AA-checked text/background pairs, accent, surface, border, focus ring; type scale (fluid `clamp()` steps), spacing scale, radii, shadows, motion durations (`--motion-fast 150ms`, `--motion-base 250ms`, `--motion-slow 600ms`) and easings; set `color-scheme` per theme
- [X] T028 Create `styles/globals.css` importing Tailwind 4 and mapping every token into `@theme` (colours, fonts, spacing, radii, shadows, durations, easings), base styles (focus-visible ring, `prefers-reduced-motion` media rule zeroing durations), and `.sr-only` utility; remove the scaffolded globals
- [X] T029 [P] Create UI primitives in `components/ui/`: `Button.tsx` (variants primary/secondary/ghost, renders `<a>` when `href`), `Card.tsx`, `Tag.tsx` (link to `/projects/tag/<slug>`), `Section.tsx` (heading levels and spacing), `Prose.tsx` (MDX typography), `ExternalLink.tsx` (`target=_blank rel="noopener noreferrer"` + visually hidden "(opens in new tab)"), `VisuallyHidden.tsx`, and `lib/utils/cn.ts`
- [X] T030 [P] Create layout components in `components/layout/`: `SkipLink.tsx` (first in DOM, targets `#main`), `Header.tsx` (logo/name, nav links Home/Projects/Experience/Contact with `aria-current`, slots for palette trigger and theme toggle), `Footer.tsx` (email, GitHub, LinkedIn, resume download, copyright), `Nav.tsx`
- [X] T031 Create `app/layout.tsx` with `<html lang="en" suppressHydrationWarning>`, font loading via `next/font` (one variable sans, one display), `styles/globals.css`, `SkipLink`, `Header`, `<main id="main">`, `Footer`, `metadataBase` from `SITE_URL`, default metadata via `lib/seo.ts`, and `app/manifest.ts`
- [X] T032 [P] Write failing unit tests for SEO builders in `tests/unit/lib/seo.test.ts`: `buildMetadata()` produces title template `%s · Seyit Geldiyev`, absolute canonical, OG and Twitter fields, description <= 160; `personJsonLd()` includes `sameAs` and `alternateName`; `projectJsonLd()` selects `SoftwareSourceCode` when `links.source` exists; `breadcrumbJsonLd()` ordering
- [X] T033 Implement `lib/seo.ts` (`buildMetadata`, `personJsonLd`, `projectJsonLd`, `breadcrumbJsonLd`, `itemListJsonLd`, `JsonLd` component rendering `<script type="application/ld+json">`) typed with `schema-dts`, making T032 pass
- [X] T034 [P] Create `app/not-found.tsx` (h1 "Page not found", links to `/` and `/projects`, `robots: noindex` metadata) and ensure unknown routes return HTTP 404
- [X] T035 [P] Create `app/sitemap.ts` (home, projects, each tag page, each published project, experience, contact with `lastModified`) and `app/robots.ts` (allow all, sitemap URL)
- [X] T036 [P] Add `headers()` to `next.config.ts`: `/resume.pdf` `Content-Disposition: attachment; filename="Seyit-Geldiyev-Resume.pdf"`; global `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=()`
- [X] T037 [P] Create e2e helpers in `tests/e2e/helpers.ts` (`expectNoHorizontalScroll(page)`, `gotoAndWaitForHydration`, `runAxe(page)` wrapping `@axe-core/playwright` with impact filter `serious`/`critical`, `setTheme(page, 'dark')`) and a smoke test `tests/e2e/smoke.spec.ts` asserting `/` returns 200, has one `h1`, landmarks `banner`/`main`/`contentinfo`, and `/does-not-exist` returns 404

**Checkpoint**: `pnpm build` succeeds with all content validated; `pnpm test` and `pnpm e2e tests/e2e/smoke.spec.ts` pass. User story phases can begin.

---

## Phase 3: User Story 1 - First-Impression Landing (Priority: P1) 🎯 MVP

**Goal**: Home page that, on a 360 px phone, shows name, role, value proposition, availability and CTAs in the first screen, followed by featured projects, an about strip and contact links with resume download, plus social preview metadata.

**Independent Test**: Deploy only `/` and run `tests/e2e/us1-landing.spec.ts`; a visitor can judge fit and reach contact without any other page.

### Tests for User Story 1

- [X] T038 [P] [US1] Write failing e2e test `tests/e2e/us1-landing.spec.ts` covering spec Story 1 scenarios: first viewport at 360x740 contains h1 "Seyit Geldiyev", role, tagline, availability label, links "View work" -> `/projects` and "Contact" -> `/contact`, no horizontal scroll; featured section has 3-4 cards each with visual or placeholder, title, summary, tags and link to `/projects/<slug>`; footer has `mailto:seyitbu1111@gmail.com`, GitHub, LinkedIn, `/resume.pdf` (HEAD 200 with `Content-Disposition: attachment`); head has `og:title`, `og:description`, `og:image` (GET 200), `twitter:card=summary_large_image`, canonical
- [X] T039 [P] [US1] Write failing unit test `tests/unit/components/ProjectCard.test.tsx`: renders title, year, type, summary, tags; uses placeholder image when `visuals` empty; link points to `/projects/<slug>`; image has `alt` from content

### Implementation for User Story 1

- [X] T040 [P] [US1] Create `components/hero/HeroFallback.tsx` (static CSS gradient background using tokens) and `components/hero/Hero.tsx` (server component: `h1` name, role, tagline, availability badge, CTAs via `Button`, location; reserves the canvas slot `<div data-hero-canvas aria-hidden="true">` for US5)
- [X] T041 [P] [US1] Create `components/projects/ProjectCard.tsx` (uses `next/image` with width/height from content, `sizes` per breakpoint, lazy loading, placeholder fallback, `Tag` list, whole-card link with single accessible name) making T039 pass
- [X] T042 [P] [US1] Create `components/home/FeaturedProjects.tsx` (h2 "Featured work", `getProjects({ featured: true })`, grid of `ProjectCard`, "All projects" link), `components/home/AboutStrip.tsx` (summary, location, languages, "More about me" -> `/experience`) and `components/home/ContactStrip.tsx` (email, GitHub, LinkedIn via `ExternalLink`, "Download resume" -> `/resume.pdf` with `download` attribute)
- [X] T043 [US1] Create `app/page.tsx` composing Hero, FeaturedProjects, AboutStrip, ContactStrip in that order with `Section` wrappers, `metadata` via `buildMetadata` using `title.absolute`, and `JsonLd` with `personJsonLd()` + `WebSite`
- [X] T044 [P] [US1] Create `app/opengraph-image.tsx` rendering a branded 1200x630 image with `ImageResponse` (name, title, tagline, site URL) and export `alt`, `size`, `contentType`
- [X] T045 [US1] Run `pnpm e2e tests/e2e/us1-landing.spec.ts` on mobile and desktop projects, fix failures, and capture the first visual snapshot of `/` at 360 and 1440 in `tests/e2e/visual.spec.ts` (hero canvas not yet present)

**Checkpoint**: User Story 1 passes its e2e test; `/` is deployable as the MVP.

---

## Phase 4: User Story 2 - Project Case Studies (Priority: P2)

**Goal**: Projects index with tag filtering reflected in the path, and a case-study page per project in the contract section order with prev/next navigation and generated OG images.

**Independent Test**: Run `tests/e2e/us2-projects.spec.ts`; browse index, filter, open at least four case studies, reach every live and source link.

### Tests for User Story 2

- [X] T046 [P] [US2] Write failing e2e test `tests/e2e/us2-projects.spec.ts` covering spec Story 2 scenarios: `/projects` card count equals published projects and order is newest first; clicking tag "dashboard" navigates to `/projects/tag/dashboard` showing only tagged cards, reload keeps the filter, `/projects/tag/nope` shows all cards plus the "not recognised" note; `/projects/audit-app` renders sections in order (breadcrumb, h1, meta row, visual, summary, problem, solution, highlights, outcome, tags, external links with `target=_blank`, body, pager); `/projects/belli-creative-tools` shows no live/source link and the case-study-only note; pager previous/next navigates between adjacent projects
- [X] T047 [P] [US2] Write failing unit test `tests/unit/components/TagFilter.test.tsx`: renders "All" plus every tag as links (`<a>`), active tag has `aria-current="page"`, unknown active value renders the note text

### Implementation for User Story 2

- [X] T048 [P] [US2] Create `components/projects/TagFilter.tsx` (link list from `getTags()`, "All" -> `/projects`, each tag -> `/projects/tag/<slug>`, `aria-current`, optional unknown-filter note) making T047 pass, and `components/projects/ProjectGrid.tsx` (responsive grid of `ProjectCard`, empty state "No projects with this tag yet")
- [X] T049 [US2] Create `app/projects/page.tsx` (h1 "Projects", `TagFilter`, `ProjectGrid` of all published projects, `metadata` "Projects", `itemListJsonLd`) and `app/projects/tag/[tag]/page.tsx` (`generateStaticParams` from `getTags()`, `dynamicParams = true`, unknown tag renders all projects with the note and `robots: noindex`, title "Projects · <Tag>")
- [X] T050 [P] [US2] Create `components/projects/ProjectPager.tsx` (previous/next links with project titles, `aria-label`s), `components/projects/ProjectMeta.tsx` (year, type, role, period, employer link to `/experience#<role-id>`), `components/projects/ProjectLinks.tsx` (renders only present links via `ExternalLink`; when none, the text "This work is described as a case study only."), `components/projects/MetricCallouts.tsx` (<= 4 metrics)
- [X] T051 [US2] Create `components/projects/mdx-components.tsx` (heading, list, image, callout and figure components for MDX bodies using `Prose` tokens) and `lib/mdx.tsx` exposing `MDXContent` built on `@content-collections/mdx/react` `useMDXComponent`
- [X] T052 [US2] Create `app/projects/[slug]/page.tsx`: `generateStaticParams` from published projects, `notFound()` for unknown slug, breadcrumb, h1, `ProjectMeta`, hero visual or placeholder (`priority` image), Summary, Problem, Solution, Highlights list, Outcome + `MetricCallouts`, Tags, `ProjectLinks`, `MDXContent`, `ProjectPager`; `generateMetadata` from `summary` with `openGraph.type: 'article'`; `JsonLd` with `projectJsonLd` and `breadcrumbJsonLd`
- [X] T053 [P] [US2] Create `app/projects/[slug]/opengraph-image.tsx` rendering title, type and tags on the brand frame with `ImageResponse`, exporting `alt`, `size`, `contentType`, and `generateStaticParams`
- [X] T054 [US2] Run `pnpm e2e tests/e2e/us2-projects.spec.ts`, fix failures, and add visual snapshots for `/projects` and `/projects/audit-app` at 360 and 1440 to `tests/e2e/visual.spec.ts`

**Checkpoint**: Index, tag pages and all nine case studies render statically; US1 and US2 pass independently.

---

## Phase 5: User Story 3 - Experience Timeline and Skills (Priority: P3)

**Goal**: Experience page with a chronological timeline that shows overlapping roles, expandable highlights that work without JS, education, grouped skills with depth indicators, and resume download that is verified against the PDF.

**Independent Test**: Run `tests/e2e/us3-experience.spec.ts` and `pnpm check:resume`; a recruiter can verify dates, employers and skills without opening the PDF.

### Tests for User Story 3

- [X] T055 [P] [US3] Write failing e2e test `tests/e2e/us3-experience.spec.ts` covering spec Story 3 scenarios: `/experience` lists five roles plus education in descending order with employer, title, period, location; KinesteX/Ynamly Belentlik and ForEach Partners/Ynamly Belentlik carry the overlap marker; Tab to a role and press Enter expands highlights with `aria-expanded`/`open` toggling (also with `javaScriptEnabled: false`); skills groups appear in `content/skills.yaml` order and every skill shows a visible level label; "Download resume" link resolves to `/resume.pdf`
- [X] T056 [P] [US3] Write failing unit tests `tests/unit/lib/dates.test.ts` for `periodLabel` ("2025-05".."2026-06" -> "May 2025 - Jun 2026", `present` -> "May 2025 - Present"), `durationLabel` ("1 yr 2 mos", "4 mos", "3 yrs 7 mos"), and `overlaps` (touching months count as overlap)
- [X] T057 [P] [US3] Write failing unit test `tests/unit/scripts/check-resume.test.ts` that runs the checker's `compare(pdfText, roles)` function against a fixture text and reports missing employer, role or period strings

### Implementation for User Story 3

- [X] T058 [US3] Make T056 pass by completing `lib/utils/dates.ts` (if not already complete from T020) and export a `timelineLanes(roles)` helper assigning parallel lane indexes to overlapping roles
- [X] T059 [P] [US3] Create `components/experience/RoleItem.tsx` as a native `<details>`/`<summary>` disclosure (summary shows employer, role, period, duration, location, remote badge; body lists highlights and related project links; `id` equals role id for deep links) and `components/experience/Timeline.tsx` (`<ol>` descending by start; on >= 768 px overlapping roles render in parallel lanes via `timelineLanes`, on narrower screens stacked with an "Overlaps with <employer>" note)
- [X] T060 [P] [US3] Create `components/experience/SkillsGrid.tsx` (groups in `order`, each skill with a depth indicator that includes visible text `Primary | Working | Familiar`, not colour alone) and `components/experience/EducationCard.tsx`
- [X] T061 [US3] Create `app/experience/page.tsx` composing h1 "Experience", `Timeline`, `EducationCard`, `SkillsGrid`, resume download CTA; `metadata` "Experience"; `JsonLd` with `personJsonLd()` extended by `hasOccupation` and `alumniOf`
- [X] T062 [US3] Implement `scripts/check-resume.ts`: parse `public/resume.pdf` with `pdf-parse`, load roles from `content/experience.yaml`, and for every role assert employer name, role title and the resume-formatted period (e.g. "May 2025 - June 2026") appear in the PDF text; print `OK <employer>` per role, exit 1 listing mismatches; export `compare()` so T057 passes
- [X] T063 [US3] Run `pnpm e2e tests/e2e/us3-experience.spec.ts` and `pnpm check:resume`, fix failures, and add the `/experience` visual snapshot at 360 and 1440 to `tests/e2e/visual.spec.ts`

**Checkpoint**: Experience page passes its e2e test; resume consistency check passes in CI.

---

## Phase 6: User Story 4 - Contact and Hire (Priority: P4)

**Goal**: Contact page with direct links and a progressively enhanced form (Server Action) that validates server-side, blocks bots silently, rate-limits, delivers by email and offers a mailto fallback on failure.

**Independent Test**: Run `tests/e2e/us4-contact.spec.ts` with email env unset (logging mode); submit valid, invalid, bot and forced-failure cases with and without JavaScript.

### Tests for User Story 4

- [X] T064 [P] [US4] Write failing unit tests `tests/unit/lib/contact/schema.test.ts` for the Zod schema from contracts/contact-form.md: `name` trimmed 2-80 chars, `email` valid and <= 254, `message` trimmed 10-2000, error messages per field; and `tests/unit/lib/contact/spam.test.ts`: honeypot `website` non-empty rejects; `renderedAt` younger than 3000 ms or older than 86 400 000 ms rejects; valid window passes
- [X] T065 [P] [US4] Write failing unit test `tests/unit/lib/contact/rate-limit.test.ts`: with Upstash env missing the limiter resolves `{ success: true }` and logs a warning once; with a mocked `Ratelimit` the 4th call within the window returns `success: false` and `retryAfterSeconds`
- [X] T066 [P] [US4] Write failing e2e test `tests/e2e/us4-contact.spec.ts` covering spec Story 4 scenarios in both JS-enabled and `javaScriptEnabled: false` modes: valid submission shows `role="status"` "Message sent" within 3 s; empty message / malformed email shows inline errors linked via `aria-describedby` with focus on the first invalid field and preserved values; filled honeypot shows success (server log `rejected`); `CONTACT_FORCE_FAIL=1` shows `role="alert"` with a `mailto:seyitbu1111@gmail.com` link; direct links (email, GitHub, LinkedIn, resume) present

### Implementation for User Story 4

- [X] T067 [P] [US4] Implement `lib/contact/schema.ts` (Zod `contactSchema`, `ContactState` union exactly as in contracts/contact-form.md) making the schema tests pass
- [X] T068 [P] [US4] Implement `lib/contact/spam.ts` (`isHoneypotTripped`, `isTimingValid` with 3 s minimum and 24 h maximum) making the spam tests pass
- [X] T069 [P] [US4] Implement `lib/contact/rate-limit.ts` (Upstash `Ratelimit.slidingWindow(3, '10 m')` keyed by `sha256(ip + CONTACT_IP_SALT + today)`, no-op with one warning when env is missing) making T065 pass, and `lib/contact/ip.ts` (first `x-forwarded-for` value)
- [X] T070 [P] [US4] Implement `lib/contact/email.ts` (Resend `emails.send` with `from: CONTACT_FROM`, `to: profile.email`, `reply_to`, subject "Portfolio contact from <name>", text body; when `RESEND_API_KEY` is missing log the payload and resolve; when `CONTACT_FORCE_FAIL=1` throw)
- [X] T071 [US4] Implement Server Action `app/contact/actions.ts` `sendContactMessage(prevState, formData)` following the contract processing order (parse -> honeypot/timing silent success -> rate limit `limited` -> send `failed` on error -> `success`), returning the serialisable `ContactState` including `mailto`
- [X] T072 [US4] Create `components/contact/ContactForm.tsx` using `useActionState` with native `<form action>` fallback: fields name/email/message with labels, hidden honeypot `website` (CSS hidden, `tabindex=-1`, `autocomplete=off`, label "Leave this field empty"), hidden `renderedAt`, inline errors with `aria-describedby`, focus management to first invalid field, pending state (`aria-busy`, "Sending..."), `role="status"` success with "Send another", `role="alert"` for `limited`/`failed` with mailto link
- [X] T073 [US4] Create `app/contact/page.tsx` (h1, direct links block with copy-email button that degrades to a plain `mailto:` link, `ContactForm`, resume download; `metadata` "Contact"; `JsonLd` `ContactPage`)
- [X] T074 [US4] Run `pnpm e2e tests/e2e/us4-contact.spec.ts` in both modes, fix failures, and add the `/contact` visual snapshot at 360 and 1440 to `tests/e2e/visual.spec.ts`

**Checkpoint**: Contact works with and without JavaScript; spam and failure paths verified.

---

## Phase 7: User Story 5 - Signature "Advanced" Experience (Priority: P5)

**Goal**: Animated hero with an idle-loaded WebGL canvas, page transitions and scroll reveals, flash-free light/dark theme with manual override, and a keyboard command palette, all respecting reduced motion and degrading without JavaScript.

**Independent Test**: Run `tests/e2e/us5-polish.spec.ts`, `tests/e2e/reduced-motion.spec.ts` and `tests/e2e/no-js.spec.ts`; all prior story tests still pass and budgets hold.

### Tests for User Story 5

- [X] T075 [P] [US5] Write failing e2e test `tests/e2e/us5-polish.spec.ts` covering spec Story 5 scenarios: on `/` the h1 is visible at first paint and is the LCP element (via `PerformanceObserver` `largest-contentful-paint` entries), the hero `canvas` mounts within 3 s after load when motion is allowed; `Control+K` opens a dialog named "Command palette", typing "audit" filters to "Audit App", Enter navigates to `/projects/audit-app`, Escape closes and focus returns to the trigger; with `colorScheme: 'dark'` the first paint has `html.dark` with no class flip, toggling to light persists after reload (`localStorage.theme === 'light'`)
- [X] T076 [P] [US5] Write failing e2e test `tests/e2e/reduced-motion.spec.ts` with `reducedMotion: 'reduce'`: no `canvas` on `/`; every route renders all content and navigation; elements with `data-reveal` have computed `animation-duration`/`transition-duration` of `0s`
- [X] T077 [P] [US5] Write failing e2e test `tests/e2e/no-js.spec.ts` with `javaScriptEnabled: false`: `/`, `/projects`, `/projects/tag/dashboard`, `/projects/audit-app`, `/experience`, `/contact` render content and links; tag filter links and role disclosures still work; palette trigger is hidden or inert
- [X] T078 [P] [US5] Write failing unit test `tests/unit/components/ThemeToggle.test.tsx` (cycles system -> light -> dark, exposes current state via `aria-label`) and `tests/unit/lib/palette.test.ts` (`getPaletteEntries()` groups Pages, Projects, Links; projects listed newest first; external links flagged)

### Implementation for User Story 5

- [X] T079 [P] [US5] Create `components/motion/MotionProvider.tsx` (`LazyMotion features={domAnimation} strict` + `MotionConfig reducedMotion="user"`), `components/motion/useMotionPreference.ts` (matchMedia hook, SSR-safe), and `components/motion/Reveal.tsx` (`m.div` with `whileInView` opacity 0->1 and translateY 16px->0 once, durations/easings from tokens, `data-reveal`, instant when reduced)
- [X] T080 [US5] Add `MotionProvider` to `app/layout.tsx`, create `app/template.tsx` applying a <= 250 ms enter fade/slide to page content (no exit animation, skipped under reduced motion), and wrap FeaturedProjects, AboutStrip, ContactStrip, ProjectGrid, Timeline and SkillsGrid items in `Reveal`
- [X] T081 [US5] Add staggered hero text intro to `components/hero/Hero.tsx` via a client `HeroIntro.tsx` wrapper (heading lines and CTAs reveal within 1.2 s; markup is server-rendered and visible before hydration; reduced motion renders static)
- [X] T082 [US5] Create `components/hero/HeroCanvas.client.tsx` with OGL: full-bleed low-cost fragment shader (gradient noise reacting subtly to pointer and time), `devicePixelRatio` capped at 1.5, pauses via `IntersectionObserver` and `visibilitychange`, disposes on unmount, `aria-hidden="true"`; and `components/hero/HeroCanvasLoader.tsx` that mounts it with `next/dynamic({ ssr: false })` only after `requestIdleCallback` (fallback `setTimeout` 1500 ms), only when `useMotionPreference()` allows motion, WebGL is available, and `?no-canvas=1` is not present
- [X] T083 [P] [US5] Create `components/theme/ThemeProvider.tsx` (next-themes, `attribute="class"`, `defaultTheme="system"`, `enableSystem`, `disableTransitionOnChange`) and `components/theme/ThemeToggle.tsx` (three-state button system -> light -> dark with icon + `aria-label` "Theme: <state>, switch to <next>") making the ThemeToggle unit test pass; add provider to `app/layout.tsx` and toggle to `Header`
- [X] T084 [P] [US5] Implement `lib/palette.ts` (`getPaletteEntries()` building Pages, Projects, Links groups from content) making T078's palette test pass, and `components/palette/CommandPalette.client.tsx` with cmdk (`role="dialog"` `aria-label="Command palette"`, groups, keyboard navigation, `router.push` for internal and `window.open` for external, focus restore on close) plus `components/palette/PaletteTrigger.tsx` (header button `aria-haspopup="dialog"`, shows `⌘K`/`Ctrl K` hint) and a `useGlobalShortcut` hook; palette module loaded with `next/dynamic` on first open or shortcut
- [X] T085 [US5] Mount `PaletteTrigger` in `Header` and the palette host in `app/layout.tsx`; add `@vercel/analytics` `<Analytics />` to `app/layout.tsx` for production only
- [X] T086 [US5] Update `tests/e2e/visual.spec.ts` to force reduced motion and `?no-canvas=1` for all snapshots, regenerate and review snapshots, then run `tests/e2e/us5-polish.spec.ts`, `reduced-motion.spec.ts`, `no-js.spec.ts` and all earlier story specs; fix regressions

**Checkpoint**: All five stories pass independently; the site is feature-complete.

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility and performance gates across every route, security headers, documentation and deployment.

- [X] T087 [P] Write `tests/e2e/a11y.spec.ts` running axe on `/`, `/projects`, `/projects/tag/dashboard`, `/projects/audit-app`, `/experience`, `/contact`, `/does-not-exist` in light and dark themes, asserting zero `serious`/`critical` violations, skip link first in tab order, exactly one `h1`, landmarks `banner`/`main`/`contentinfo`; fix any violations found in components
- [X] T088 Run `pnpm build && pnpm lhci`, record first-load JS per route from the build output, and bring `/` under 150 KB compressed script transfer and all categories to >= 0.95 (verify Motion is tree-shaken to `LazyMotion` + `m`, palette and canvas are separate chunks, fonts are subset and `display: swap`, images sized)
- [X] T089 [P] Add a Content-Security-Policy header in `next.config.ts` (self, Vercel Analytics script/connect, inline theme script via hash or nonce, `img-src` self data blob, `frame-ancestors 'none'`) and verify no console CSP errors on every route in `tests/e2e/smoke.spec.ts`
- [X] T090 [P] Write `README.md`: purpose, stack, commands table (from quickstart.md), content workflow (add a project = one MDX file + visuals), environment variables, testing and deployment
- [ ] T091 [P] Add `preview`/`production` environment variable documentation and a `vercel.json` only if needed (framework preset otherwise); connect the GitHub repository to Vercel, set env vars for Production and Preview, enable Vercel Analytics
- [ ] T092 Run the full `pnpm ci` pipeline locally and via `.github/workflows/ci.yml` on the `001-portfolio-website` branch; fix any failure so `main` is deployable
- [ ] T093 Execute every scenario in `quickstart.md` manually on a mid-tier Android phone and on desktop (both themes, reduced motion, no-JS); record results in `specs/001-portfolio-website/checklists/validation.md`
- [ ] T094 Open the pull request from `001-portfolio-website` to `main` (PR body template in `.github/pull_request_template.md`, created here) with screenshots of each route in both themes, the Lighthouse report link, and an explicit Constitution Check section per the Development Workflow

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T001 then T002 then T003 are sequential, T004 to T014 parallel after T003.
- **Foundational (Phase 2)**: Depends on Setup. Order inside: T015/T016 (tests) -> T017 -> T018 -> T019 -> T020; content files T021 to T026 parallel after T017; tokens T027 -> T028; T029/T030 parallel after T028; T031 after T030 and T033; T032 -> T033; T034 to T037 parallel after T031. BLOCKS all user stories.
- **User Stories (Phases 3 to 7)**: All depend on Phase 2. US1 to US4 are mutually independent and can run in parallel. US5 modifies `app/layout.tsx`, `Hero.tsx` and `Header.tsx`, so it starts after US1 (hero) and should run last to avoid file conflicts.
- **Polish (Phase 8)**: Depends on all five stories.

### User Story Dependencies

- **US1 Landing (P1)**: After Phase 2 only.
- **US2 Case Studies (P2)**: After Phase 2; reuses `ProjectCard` from US1 (T041), so run T041 first or in US2 if US1 is skipped.
- **US3 Experience (P3)**: After Phase 2; independent of US1/US2.
- **US4 Contact (P4)**: After Phase 2; independent of US1 to US3.
- **US5 Polish (P5)**: After US1 (edits `Hero.tsx`) and preferably after US2 to US4 because `Reveal` wraps their components (T080).

### Within Each User Story

- Tests are written first and must fail (T038/T039, T046/T047, T055 to T057, T064 to T066, T075 to T078).
- Logic (`lib/`) before components, components before pages, pages before the story's e2e run and visual snapshot.

### Parallel Opportunities

- Phase 1: T004 to T014 (11 tasks) in parallel.
- Phase 2: T015/T016; T021 to T026 (six content files); T029/T030; T032; T034 to T037.
- US1: T038/T039 tests; T040, T041, T042, T044 components.
- US2: T046/T047; T048, T050, T053.
- US3: T055 to T057; T059/T060.
- US4: T064 to T066; T067 to T070 (four `lib/contact` modules).
- US5: T075 to T078; T079, T083, T084.
- Phase 8: T087, T089, T090, T091.

---

## Parallel Example: User Story 4

```bash
# Tests first, in parallel:
Task: "Unit tests for contact schema and spam checks in tests/unit/lib/contact/schema.test.ts and spam.test.ts"
Task: "Unit test for rate limiter in tests/unit/lib/contact/rate-limit.test.ts"
Task: "E2E test in tests/e2e/us4-contact.spec.ts"

# Then the four independent lib modules together:
Task: "Implement lib/contact/schema.ts"
Task: "Implement lib/contact/spam.ts"
Task: "Implement lib/contact/rate-limit.ts and lib/contact/ip.ts"
Task: "Implement lib/contact/email.ts"

# Then sequentially: app/contact/actions.ts -> components/contact/ContactForm.tsx -> app/contact/page.tsx -> run e2e
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001 to T014).
2. Complete Phase 2: Foundational (T015 to T037); this includes all content, so the MVP already carries real data.
3. Complete Phase 3: User Story 1 (T038 to T045).
4. **STOP and VALIDATE**: `pnpm ci` with only `smoke`, `us1-landing` and `visual` specs; deploy a Vercel preview.

### Incremental Delivery

1. Setup + Foundational -> build passes with validated content.
2. US1 Landing -> preview deploy (MVP).
3. US2 Case Studies -> preview deploy.
4. US3 Experience -> preview deploy; resume check green.
5. US4 Contact -> preview deploy with Resend/Upstash env set.
6. US5 Polish -> preview deploy; budgets re-verified.
7. Phase 8 -> production via PR to `main`.

### Parallel Team Strategy

With one developer plus AI agents: after Phase 2, run US2, US3 and US4 in
parallel worktrees (they touch disjoint files), merge, then do US5 alone
because it edits the shared layout, header and hero.

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Constraint values quoted in tasks come from data-model.md and contracts/; do not relax them at implementation time
- Verify tests fail before implementing
- Commit after each task or logical group using Conventional Commits
- Stop at any checkpoint to validate a story independently
