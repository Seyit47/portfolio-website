# Research: Portfolio Website

**Date**: 2026-11-01 | **Plan**: [plan.md](plan.md)

Every unknown from Technical Context is resolved below. Versions were checked
against the npm registry on 2026-11-01.

## R1. Framework and rendering

- **Decision**: Next.js 16 App Router (16.3.8 at implementation time, the
  version cached on the development machine; 16.4 is a drop-in upgrade) with
  full static prerendering of every page except Contact, which renders per
  request (`dynamic = "force-dynamic"`) so its anti-spam timestamp is fresh and
  the form is present in the initial HTML for visitors without JavaScript.
  `cacheComponents` (Partial Prerendering) is off: it forbids route segment
  config and streams dynamic content behind a Suspense boundary that stays
  hidden without client JavaScript, which conflicted with FR-020 for the form. Deployed on Vercel with Git
  integration (preview per PR, production on `main`).
- **Rationale**: Matches the owner's strongest recent experience (KinesteX,
  SDD Navigator Dashboard, Audit App all use Next.js on Vercel), so the site
  itself demonstrates the stack he sells. App Router gives file-based
  Metadata API, `sitemap.ts`, `robots.ts`, `opengraph-image.tsx` and
  `not-found.tsx` natively (FR-021 to FR-023) and Server Actions let the form
  work without client JavaScript (FR-020). Prerendering satisfies the
  constitution's SSG/SSR requirement.
- **Alternatives considered**: Astro (excellent for content sites and smaller
  JS, but weaker signal for a React/Next-focused CV and less familiar to the
  owner); Nuxt 4 (owner knows it, but recent work and target roles are React);
  Vite + React SPA (fails the no-JS and SEO requirements).

## R2. Styling and design tokens

- **Decision**: Tailwind CSS 4.3 with design tokens declared as CSS custom
  properties in `styles/tokens.css` (light values on `:root`, dark values
  under `[data-theme="dark"]` / `.dark`) and mapped into Tailwind through
  `@theme`. Type scale, spacing, radii, shadows, motion durations and easings
  are tokens; components may use only token-backed utilities.
- **Rationale**: Constitution Principle IV requires a single token source.
  Tailwind 4's `@theme` consumes CSS variables directly, so one file drives
  both themes and the utility classes. Zero runtime CSS-in-JS cost.
- **Alternatives considered**: CSS Modules + vanilla-extract (fine, but more
  ceremony and no utility ergonomics); Panda CSS (adds a build step and is
  less common in target job stacks).

## R3. Content layer

- **Decision**: Content Collections 0.15 (`@content-collections/core`,
  `@content-collections/next`, `@content-collections/mdx`) with Zod 4 schemas.
  Collections: `profile` (YAML, single document), `experience` (YAML),
  `skills` (YAML), `projects` (MDX with typed frontmatter). Schemas are
  defined in `contracts/content-schema.md` and enforced at build time; an
  invalid document fails the build.
- **Rationale**: Type-safe, build-time validated, framework-integrated via a
  watcher (works with Turbopack, unlike webpack-only MDX loaders). Adding a
  project means adding one `.mdx` file (SC-009). MDX gives rich case studies
  with embedded components (image galleries, metric callouts).
- **Alternatives considered**: Velite 0.4 (equivalent model; kept as the
  fallback if Content Collections proves incompatible with Next 16.4 during
  setup; the schema contract is identical); plain TypeScript data files
  (type-safe but no MDX body, and long-form case studies become awkward);
  headless CMS (out of scope per spec; adds network and auth).
- **Verification step for implementation**: run `pnpm dev` after installing
  and confirm `.content-collections/generated` is produced; if not, switch to
  Velite with the same Zod schemas.
- **Verified 2026-11-01**: Content Collections 0.15.3 builds all 13 documents
  with Next 16.3.8/Turbopack. Two findings: (1) the library logs but does not
  fail on a document whose frontmatter cannot be parsed, so `lib/content.ts`
  compares `content/projects/*.mdx` against the built set and fails the build
  on any gap; (2) the deprecated `collections` config key was replaced by
  `content`, and MDX schemas declare an explicit `content` string field.

## R4. Animation, transitions and reduced motion

- **Decision (revised 2026-11-01 during implementation)**: CSS-driven motion,
  no animation library. Scroll reveals are `[data-reveal]` elements whose
  hidden start state (`opacity: 0; translateY(16px)`) applies only under
  `html.js`. An inline bootstrap (`components/motion/reveal-inline.ts`,
  serialised into the document before any content) adds that class, shows
  targets already inside the viewport at `DOMContentLoaded` without a
  transition, and observes the rest with IntersectionObserver, all before
  React hydrates; the tiny client `RevealObserver` only re-runs it after
  client-side navigations. Lighthouse showed that gating above-the-fold
  content on hydration pushed LCP to 3.3 s on the projects index, which this
  removes. For the same reason the hero intro keyframe starts at opacity 0.3
  rather than 0: Chrome ignores fully transparent elements as LCP candidates
  until they become visible, which turned a 0.7 s intro into 2.2 s of
  "render delay" under simulated mobile throttling. Page transitions are a CSS keyframe on the
  `template.tsx` wrapper, which React remounts on every navigation. The hero
  intro is a staggered CSS keyframe on `[data-hero-line]`. All of it uses only
  `opacity` and `transform`, durations and easings from tokens, and the
  `prefers-reduced-motion` media query removes every effect.
- **Rationale**: The first build with Motion 14 (`LazyMotion` + `m`) measured
  about 40 KB compressed on the landing page and put the total over the 150 KB
  budget. Motion also forced a choice between inline `opacity: 0` in the
  server HTML (invisible content for visitors without JavaScript, violating
  FR-020) and a static-then-hidden-then-animate swap after hydration that
  replaced DOM nodes and flashed. The CSS approach weighs ~1 KB, keeps the
  server HTML fully visible, and degrades perfectly without JavaScript.
- **Alternatives considered**: Motion 14 (original plan; rejected for the
  reasons above); native View Transitions API (still experimental in Next);
  GSAP (heavier); CSS scroll-driven animations with `animation-timeline:
  view()` (no JavaScript at all, but unsupported in Firefox and older Safari
  at the time of writing; revisit when support broadens).

## R5. Signature hero

- **Decision**: A lightweight WebGL shader background using OGL 1.0 (~25 KB
  compressed), rendered in a `HeroCanvas.client` component that is
  `next/dynamic` imported with `ssr: false` and mounted only after
  `requestIdleCallback` (fallback `setTimeout 1500`) **and** the visitor's
  first interaction (pointer move, scroll, key, touch), and only if
  `prefers-reduced-motion` is not set and WebGL is available. The interaction
  gate keeps the canvas out of the initial script budget measured by
  Lighthouse while real visitors trigger it within moments. The server-rendered
  hero shows the name, role, value proposition and CTAs immediately over a
  static CSS gradient (`HeroFallback`), which also serves as the final state
  when the canvas is absent. The intro text animation (staggered reveal of
  heading lines) completes within 1.2 s. The canvas is `aria-hidden` and
  pauses when off-screen or the tab is hidden.
- **Rationale**: Delivers a distinctive first impression (Story 5) without
  touching LCP: LCP element is the heading text, which arrives in HTML. OGL is
  an order of magnitude smaller than three.js. Idle-mounting keeps the 150 KB
  landing budget intact because the hero bundle loads after the budgeted
  interactive phase, and the constitution explicitly allows lazy-loaded heavy
  visuals.
- **Alternatives considered**: three.js / React Three Fiber (150 KB+
  compressed; blows the budget); pure CSS animated gradient (lighter but less
  distinctive; retained as the fallback); Lottie animation (asset-heavy and
  less interactive).

## R6. Command palette and theme

- **Decision**: cmdk 1.1 for the palette (~6 KB compressed), loaded with
  `next/dynamic` on first open or on the `Ctrl/Cmd+K` keydown; a visible
  trigger button lives in the header. Entries are generated at build time from
  content (pages, projects, external links). next-themes 0.4 for theme:
  `attribute="class"`, `defaultTheme="system"`, `enableSystem`, with the
  inline script preventing a flash; the manual choice persists in
  `localStorage`. The toggle is a three-state control (system / light / dark).
- **Rationale**: FR-016/017 with minimal bundle cost and proven accessibility
  (cmdk is built on WAI-ARIA combobox semantics). next-themes solves the
  no-flash problem reliably with App Router.
- **Alternatives considered**: Hand-rolled palette (more work to make
  accessible); Radix Dialog + custom list (heavier); CSS `light-dark()` with
  only a system preference (no manual override, which FR-016 requires).

## R7. Contact form delivery, spam protection and rate limiting

- **Decision**: Server Action in `app/contact/actions.ts` consumed through
  `useActionState`, so the form posts natively without JS and enhances with
  inline validation when JS is present. Pipeline: Zod 4 parse (name 2-80 chars,
  RFC-compliant email, message 10-2000 chars) -> honeypot field must be empty ->
  `renderedAt` hidden timestamp must be >= 3 s old and <= 24 h old -> Upstash
  Ratelimit sliding window (3 submissions / 10 min per hashed IP) -> Resend
  `emails.send` to seyitbu1111@gmail.com with reply-to set to the sender.
  Failure returns a state with a fallback `mailto:` link (FR-015). Bot
  detections return the same success state to avoid giving feedback (Story 4
  scenario 3). When `UPSTASH_*` env vars are absent (local dev, previews
  without secrets) the rate limiter is a logged no-op; when `RESEND_API_KEY` is
  absent the email step logs the payload instead of sending.
- **Rationale**: Meets FR-013/014/015 and the constitution's server-side
  validation and spam-protection rules without a visible CAPTCHA (keeps the
  form accessible and frictionless). Serverless functions have no shared
  memory, so a durable store is required for rate limiting; Upstash's free
  tier and REST client fit a static site. Resend has a free tier, a tiny SDK
  and React email templates if wanted later.
- **Alternatives considered**: Formspree / Basin (fewer moving parts, but less
  control over spam logic and branding; acceptable fallback); Cloudflare
  Turnstile (robust but adds a third-party script to the page); Vercel KV
  (now Upstash-backed anyway); in-memory rate limiting (unreliable on
  serverless).

## R8. SEO, sharing and structured data

- **Decision**: Next Metadata API with a shared `lib/seo.ts` that builds title
  template (`%s · Seyit Geldiyev`), description, canonical, Open Graph and
  Twitter fields per route. `app/opengraph-image.tsx` renders a branded 1200x630
  image with `ImageResponse`; `app/projects/[slug]/opengraph-image.tsx` renders
  the project title and tags on the same brand frame. `app/sitemap.ts` and
  `app/robots.ts` derive from content. JSON-LD typed with `schema-dts`:
  `Person` (with `sameAs` GitHub and LinkedIn, `alternateName`
  "Seyitmyrat Geldiyew") on Home, `CreativeWork`/`SoftwareSourceCode` per
  project, `BreadcrumbList` on project pages. 404 uses `notFound()` so the
  response status is 404.
- **Rationale**: FR-021 to FR-023 and the constitution's SEO standard with no
  extra dependencies beyond `schema-dts` types.
- **Alternatives considered**: `next-seo` (redundant with App Router
  Metadata API); static OG images per project (manual upkeep; generation
  avoids drift).

## R9. Testing and quality gates

- **Decision**:
  - Unit: Vitest 5 + Testing Library 16, `jsdom` environment, covering
    `lib/content.ts` accessors, contact schema and spam checks, SEO builders,
    date/period formatting, and key components (TagFilter, RoleItem,
    ContactForm states). Written test-first for all `lib/` logic.
  - E2E: Playwright 1.64 against the production build (`next build && next start`),
    one spec per user story mirroring the acceptance scenarios, plus
    `a11y.spec.ts` running `@axe-core/playwright` on every route in light and
    dark themes (fail on `serious`/`critical`), `no-js.spec.ts` with
    `javaScriptEnabled: false`, `reduced-motion.spec.ts` with
    `reducedMotion: 'reduce'`, and `visual.spec.ts` with `toHaveScreenshot`
    for Home, Projects index, one project, Experience, Contact at 360 and
    1440 px.
  - Performance: Lighthouse CI 0.15 (`lhci autorun`) on Home, Projects, one
    project, Experience, Contact with mobile preset; assertions: performance,
    accessibility, best-practices, seo >= 0.95; `budgets.json` limits script
    transfer size on `/` to 150 KB.
  - Consistency: `scripts/check-resume.ts` parses `public/resume.pdf` with
    pdf-parse and asserts every employer name, role title and period string in
    `content/experience.yaml` appears in the PDF text (SC-010).
  - CI: GitHub Actions workflow running typecheck, lint, unit, build, e2e
    (with a11y/visual/no-js/reduced-motion), LHCI and check-resume on every
    PR and on `main`.
- **Rationale**: Directly implements Principle V and Technical Standards; each
  gate maps to a spec requirement.
- **Alternatives considered**: Cypress (heavier, weaker multi-browser and
  no-JS testing); Chromatic/Percy for visual regression (hosted cost; Playwright
  snapshots are sufficient for a single-owner site); Jest (slower than Vitest
  with Vite-native ESM).

## R10. Dependency justification (constitution: Technical Standards)

| Dependency | Purpose | Approx. compressed size on landing | Alternative rejected |
|------------|---------|-------------------------------------|----------------------|
| next, react, react-dom | Framework and rendering | ~45 KB (framework chunks) | See R1 |
| (none) CSS reveals + 1 KB `RevealObserver` | Reveals, hero intro, page transitions | ~1 KB | Motion 14 (measured ~40 KB; see R4), GSAP (larger) |
| next-themes | Flash-free theming with override | ~1 KB | Hand-rolled script (reinventing edge cases) |
| cmdk | Accessible command palette | ~6 KB, loaded on demand | Custom combobox (accessibility effort) |
| ogl | Hero WebGL | ~25 KB, loaded after idle, excluded from budget phase | three.js (150 KB+) |
| @vercel/analytics | Cookieless page analytics to learn which projects are opened | ~1 KB | Plausible (hosted cost); none (loses insight) |
| zod | Content and form validation | server/build only | Valibot (fine, but Content Collections uses Zod natively) |
| @content-collections/* | Content layer | build only | Velite (fallback) |
| resend, @upstash/ratelimit, @upstash/redis | Contact delivery and abuse protection | server only | See R7 |
| schema-dts | Typed JSON-LD | types only | Untyped objects |
| tailwindcss, @tailwindcss/postcss | Styling | CSS only | See R2 |
| vitest, @testing-library/*, @playwright/test, @axe-core/playwright, @lhci/cli, pdf-parse, tsx | Quality gates | dev only | See R9 |

Estimated landing-page JavaScript before the idle-loaded hero: ~75 KB
compressed, leaving headroom under the 150 KB budget. The budget is enforced
by LHCI `budgets.json`, not by estimate.

## R11. Repository, tooling and workflow

- **Decision**: Initialise git at the repository root with `main` as the
  default branch and work on `001-portfolio-website`. pnpm 12 with a committed
  lockfile; Node version pinned in `.nvmrc` (24). ESLint flat config (version pinned by `eslint-config-next` 16.4, currently ESLint 10) with
  `eslint-config-next` and `eslint-plugin-jsx-a11y`; Prettier with the Tailwind
  plugin; Husky + lint-staged + commitlint (Conventional Commits), matching
  the owner's existing repositories. `CLAUDE.md` at the root for agent
  guidance, consistent with the constitution's Governance section.
- **Rationale**: Constitution Development Workflow; the owner already uses
  this toolchain in `sdd-navigator-dashboard` and `audit-app`.
- **Alternatives considered**: Biome (fast, but Next's lint integration and
  jsx-a11y coverage are more mature on ESLint).

## R12. Resume download

- **Decision**: Serve the provided PDF as `public/resume.pdf` with a
  `Content-Disposition: attachment; filename="Seyit-Geldiyev-Resume.pdf"`
  header via `next.config.ts` `headers()`. The consistency script (R9) guards
  drift. Generating the PDF from site data is explicitly out of scope (spec
  Assumptions).
- **Rationale**: FR-011 with zero runtime cost.
- **Alternatives considered**: Generating PDF via `@react-pdf/renderer` at
  build (nice, but out of scope for this release).
