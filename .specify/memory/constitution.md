<!--
Sync Impact Report
==================
Version change: (unversioned template) -> 1.0.0
Bump rationale: Initial ratification. All template placeholders replaced with
project-specific principles for the portfolio website.

Modified principles:
  - [PRINCIPLE_1_NAME] -> I. Showcase-First
  - [PRINCIPLE_2_NAME] -> II. Performance Is a Feature
  - [PRINCIPLE_3_NAME] -> III. Accessible by Default
  - [PRINCIPLE_4_NAME] -> IV. Deliberate Motion & Polish
  - [PRINCIPLE_5_NAME] -> V. Quality Gates Before Merge

Added sections:
  - Technical Standards (replaces [SECTION_2_NAME])
  - Development Workflow (replaces [SECTION_3_NAME])
  - Governance (filled)

Removed sections: none

Templates requiring updates: none. plan-template.md, spec-template.md,
tasks-template.md and checklist-template.md read the constitution at runtime
and contain no hard-coded principle names.

Follow-up TODOs: none. Ratification date set to the initial adoption date
(2026-11-01). The portfolio owner's name, highlighted project list and
chosen framework are feature-level decisions and are intentionally left to
/speckit-specify and /speckit-plan rather than fixed here.
-->

# Portfolio Website Constitution

## Core Principles

### I. Showcase-First

The website exists to highlight the owner's work, skills and professional
identity. Every page, section and interaction MUST serve that goal.

- Every feature MUST trace to one of: presenting projects, presenting skills
  and experience, establishing credibility, or enabling contact.
- Featured projects MUST be presented with concrete evidence: what was built,
  the owner's role, the technologies used, and a visible outcome (demo, live
  link, repository, screenshots or metrics).
- Content MUST be stored as structured data (for example Markdown, JSON or a
  typed content layer) separate from presentation code, so that adding or
  editing a project never requires touching layout or component logic.
- Decorative or "advanced" elements that do not help a visitor understand the
  owner's work within the first screen MUST be justified in the feature spec.

Rationale: a portfolio is judged in seconds. Technical sophistication only
matters when it makes the work easier to find, understand and trust.

### II. Performance Is a Feature

"Advanced" MUST never mean slow. The site MUST feel instant on a mid-range
mobile device over a throttled connection.

- Core Web Vitals targets on the production build, measured at the 75th
  percentile on a simulated mid-tier mobile device: Largest Contentful Paint
  under 2.5 s, Interaction to Next Paint under 200 ms, Cumulative Layout
  Shift under 0.1.
- Initial JavaScript shipped to the landing page MUST stay under 150 KB
  compressed. Heavy visual features (3D scenes, shaders, large animation
  libraries) MUST be code-split and loaded lazily after the primary content
  is interactive.
- Every image and video MUST be served in a modern format, correctly sized
  for the viewport, and lazy-loaded when below the fold.
- Every pull request that touches the landing page or a shared layout MUST
  include a Lighthouse (or equivalent) performance report. A regression of
  more than 5 points in the performance score blocks the merge until
  justified or fixed.

Rationale: recruiters and clients visit from phones and unfamiliar networks.
A slow portfolio contradicts the competence it is trying to demonstrate.

### III. Accessible by Default

The site MUST be usable by everyone, with every input method, and without
relying on visuals alone.

- All pages MUST conform to WCAG 2.2 Level AA.
- Every interactive element MUST be reachable and operable by keyboard with
  a visible focus indicator.
- Text contrast MUST meet AA ratios in every theme (light, dark or custom).
- Non-text content (images, 3D scenes, canvases, charts) MUST have a text
  alternative that conveys the same information.
- Automated accessibility checks (for example axe) MUST run in CI and MUST
  report zero serious or critical violations.

Rationale: accessibility is a baseline of professional front-end work. A
portfolio that fails it undermines the owner's credibility with exactly the
audience it targets.

### IV. Deliberate Motion & Polish

Rich interaction and animation are encouraged, but they MUST be intentional,
progressive and respectful of the visitor.

- Every animation MUST have a purpose: guiding attention, communicating state,
  or reinforcing spatial relationships. Motion for its own sake is not
  permitted on the critical path.
- The site MUST honour `prefers-reduced-motion`; with it enabled, all
  non-essential motion MUST be disabled or reduced to simple fades, and the
  site MUST remain fully functional and complete.
- Core content and navigation MUST render and work without JavaScript or
  WebGL. Advanced effects are enhancements layered on top, never
  prerequisites.
- Animations MUST run on compositor-friendly properties (transform, opacity)
  and MUST sustain 60 fps on a mid-tier mobile device; anything that drops
  frames on that target MUST be simplified or removed.
- Visual language (type scale, spacing, colour tokens, motion durations and
  easings) MUST be defined once as design tokens and reused; ad-hoc values in
  components are not permitted.

Rationale: polish is what makes the site feel "advanced". Consistency and
restraint are what make polish read as expertise rather than noise.

### V. Quality Gates Before Merge

No change reaches the main branch without automated proof that it works and
does not regress the principles above.

- Testing follows a test-first discipline for logic: content loaders, data
  transforms, routing and utilities MUST have unit tests written before or
  alongside the implementation, and those tests MUST fail before the change
  and pass after it.
- Every user-facing page MUST have at least one end-to-end test covering its
  primary purpose (for example "the projects page lists every published
  project and each links to its detail page").
- Visual regression snapshots MUST exist for the landing page and every
  shared layout, and MUST be reviewed, not blindly updated, when they change.
- CI MUST run, and MUST pass, before merge: type-check, lint, unit tests,
  end-to-end tests, accessibility checks, and the performance budget check.
- The production build MUST succeed with zero warnings treated as errors.

Rationale: a portfolio is a long-lived, frequently tweaked site. Automated
gates keep every small content edit from quietly breaking the whole.

## Technical Standards

- **Language**: TypeScript in strict mode for all application code. Untyped
  JavaScript is not permitted outside build tooling configuration.
- **Rendering**: Pages MUST be statically generated or server-rendered so that
  content is present in the initial HTML for crawlers and no-JS visitors.
  Client-only rendering of primary content is not permitted.
- **SEO and sharing**: Every page MUST define a unique title, meta
  description, canonical URL and Open Graph / Twitter card metadata. A
  sitemap and robots file MUST be generated at build time. Projects and the
  owner profile MUST emit structured data (JSON-LD).
- **Responsiveness**: Layouts MUST be designed mobile-first and verified at a
  minimum of 360 px, 768 px, 1024 px and 1440 px widths with no horizontal
  scrolling.
- **Security and privacy**: No third-party script may be added without a
  stated purpose in the spec. Analytics, if any, MUST be privacy-preserving
  and cookieless. Contact forms MUST validate input server-side and MUST
  include spam protection. Secrets MUST never be committed.
- **Dependencies**: Each new runtime dependency MUST be justified in the plan
  by the capability it provides and its size impact. Prefer platform APIs
  over libraries when the gap is small.
- **Browser support**: The latest two major versions of Chrome, Firefox,
  Safari and Edge, plus iOS Safari and Android Chrome of the same vintage.

## Development Workflow

- All work follows the Spec Kit flow: `/speckit-specify` -> `/speckit-plan`
  -> `/speckit-tasks` -> `/speckit-implement`. Code is not written for a
  feature that has no approved spec.
- Every spec MUST include a "Constitution Check" listing how the feature
  satisfies Principles I to V, and MUST state which performance and
  accessibility budgets it affects.
- Work happens on short-lived feature branches merged through pull requests.
  Direct commits to the main branch are not permitted.
- Every pull request MUST describe what a visitor will see differently and
  link the spec it implements. Screenshots or recordings are required for
  any visual change.
- Reviews MUST verify constitution compliance explicitly. Any deviation
  (for example exceeding a budget) MUST be recorded in the plan's Complexity
  Tracking table with the reason and the simpler alternative rejected.
- The main branch MUST always be deployable. Deployment to production is
  automated from the main branch after all CI gates pass; preview
  deployments are generated for every pull request.

## Governance

This constitution supersedes all other project practices, conventions and
ad-hoc agreements. Where a spec, plan or task conflicts with it, the
constitution wins until formally amended.

- **Amendments**: Any change MUST be proposed as a pull request that edits
  this file, states the motivation, and lists affected specs, plans or
  templates. The owner approves amendments. A migration note MUST accompany
  any amendment that invalidates existing work.
- **Versioning**: This document follows semantic versioning. MAJOR for
  removing or redefining a principle in a backward-incompatible way; MINOR
  for adding a principle or section or materially expanding guidance; PATCH
  for clarifications and wording fixes that do not change meaning.
- **Compliance review**: Every pull request review and every
  `/speckit-plan` Constitution Check MUST assess compliance against the
  current version. Unjustified violations block the work; justified ones are
  recorded in Complexity Tracking and revisited before the next release.
- **Guidance files**: Runtime development guidance for agents lives in
  `CLAUDE.md` at the repository root once created; it MUST NOT contradict
  this constitution.

**Version**: 1.0.0 | **Ratified**: 2026-11-01 | **Last Amended**: 2026-11-01
