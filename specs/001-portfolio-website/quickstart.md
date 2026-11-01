# Quickstart: Portfolio Website

Validation and run guide for the feature. Implementation details live in
`tasks.md`; contracts are in [contracts/](contracts/).

## Prerequisites

- Node.js 24 (`.nvmrc`), pnpm 12 (`corepack enable` or `npm i -g pnpm`)
- Playwright browsers: `pnpm exec playwright install --with-deps chromium`
- Optional for the contact form: Resend API key, Upstash Redis REST URL and
  token (see [contracts/contact-form.md](contracts/contact-form.md)); without
  them the form logs instead of sending and rate limiting is a no-op.

## Setup

```bash
git init && git checkout -b 001-portfolio-website      # once, at repo root
pnpm install
cp .env.example .env.local                             # fill SITE_URL, RESEND_*, UPSTASH_*, CONTACT_*
cp geldiyev-seyitmyrat-resume.pdf public/resume.pdf
pnpm dev                                               # http://localhost:3000
```

Expected: the dev server starts, `.content-collections/generated` appears,
and `/` renders the hero with the name "Seyit Geldiyev" in the initial HTML
(`curl -s localhost:3000 | grep -c "Seyit Geldiyev"` prints >= 1).

## Commands

| Command | Purpose | Expected result |
|---------|---------|-----------------|
| `pnpm typecheck` | `tsc --noEmit` | exit 0, no errors |
| `pnpm lint` | ESLint (next + jsx-a11y) | exit 0, zero warnings |
| `pnpm test` | Vitest unit tests | all pass |
| `pnpm build` | `next build` (content validated, pages prerendered) | exit 0; route table lists `/`, `/projects`, `/projects/[slug]` (static, one per project), `/experience`, `/contact`; zero warnings |
| `pnpm check:resume` | `tsx scripts/check-resume.ts` | prints each role as `OK`; exit 1 on any mismatch |
| `pnpm e2e` | Playwright against `next start` | all specs pass |
| `pnpm e2e:update` | refresh visual snapshots (review the diff before committing) | snapshots updated |
| `pnpm lhci` | Lighthouse CI on 5 routes | all assertions pass (>= 0.95 each category; script budget on `/` <= 150 KB) |
| `pnpm ci` | runs all of the above in order | exit 0 |

## Validation scenarios (map to spec user stories)

### US1 Landing (`tests/e2e/us1-landing.spec.ts`)

1. Viewport 360x740, open `/`: h1 "Seyit Geldiyev", role, tagline, availability
   and both CTAs are within the first viewport; `document.scrollingElement.scrollWidth
   === clientWidth`.
2. Scroll: a "Featured" section with 3-4 cards, each with visual/placeholder,
   title, summary, tags, link to `/projects/<slug>`.
3. Footer contains `mailto:seyitbu1111@gmail.com`, `https://github.com/Seyit47`,
   the LinkedIn URL and `/resume.pdf`; `HEAD /resume.pdf` returns 200 with
   `Content-Disposition: attachment`.
4. `GET /` head contains `og:title`, `og:description`, `og:image` (200 OK,
   1200x630), `twitter:card=summary_large_image`.

### US2 Case studies (`tests/e2e/us2-projects.spec.ts`)

1. `/projects` lists every published project newest first; card count equals
   `getProjects().length`.
2. Click tag "dashboard": URL becomes `/projects/tag/dashboard`; only tagged
   cards remain; reload keeps the filter; `/projects/tag/nope` shows all with
   the "not recognised" note.
3. Open `/projects/audit-app`: sections appear in contract order; live and
   source links present and `target=_blank`.
4. Open `/projects/belli-creative-tools`: no "source"/"live" link; the
   case-study-only note is visible.
5. Pager previous/next navigates between adjacent projects.

### US3 Experience (`tests/e2e/us3-experience.spec.ts`)

1. Five roles plus education in descending order; overlapping roles
   (KinesteX and Ynamly Belentlik; ForEach Partners and Ynamly Belentlik)
   carry the overlap marker.
2. Keyboard: Tab to a role, press Enter: highlights expand; `aria-expanded`
   toggles; works with JS disabled (native `<details>`).
3. Skills groups match `content/skills.yaml` order; each skill shows a level
   text label.
4. `pnpm check:resume` passes.

### US4 Contact (`tests/e2e/us4-contact.spec.ts`, run with env unset so
sending is logged)

1. Valid submission: status region "Message sent" appears within 3 s; server
   log shows the payload.
2. Empty message / malformed email: inline errors with `aria-describedby`,
   focus on first invalid field, nothing logged as sent.
3. Honeypot filled or `renderedAt` within 3 s: UI shows success, server log
   shows `rejected`.
4. Simulated delivery failure (`CONTACT_FORCE_FAIL=1`): alert with `mailto:`
   link.
5. No-JS project: the same four outcomes via native POST.

### US5 Polish (`tests/e2e/us5-polish.spec.ts`, `reduced-motion.spec.ts`, `no-js.spec.ts`)

1. Hero text visible at first paint (LCP element is the h1, measured via
   Playwright `performance` entries); canvas mounts after idle only when motion
   allowed.
2. `reducedMotion: 'reduce'`: no `canvas` element; all content and links work;
   computed animations on `.reveal` elements have zero duration.
3. Press `Control+K`: dialog "Command palette" opens; typing "audit" filters to
   Audit App; Enter navigates; Escape closes and focus returns to trigger.
4. `colorScheme: 'dark'`: first paint has `html.dark` (no class flip after
   load); toggle to light persists after reload (`localStorage.theme`).
5. `javaScriptEnabled: false`: every route renders its content and
   navigation; tag filter and role disclosures still work.

### Accessibility (`tests/e2e/a11y.spec.ts`)

For each route in light and dark: axe reports zero `serious`/`critical`
violations; a skip link is first in tab order; exactly one h1; landmarks
`banner`, `main`, `contentinfo` present.

### Visual (`tests/e2e/visual.spec.ts`)

`toHaveScreenshot` for `/`, `/projects`, `/projects/audit-app`,
`/experience`, `/contact` at 360 and 1440 px, reduced motion forced, hero
canvas disabled via `?no-canvas=1` test flag.

### Performance (`lighthouserc.cjs`)

`lhci autorun` with mobile preset on the five routes; assertions:
`categories:performance >= 0.95`, `accessibility >= 0.95`,
`best-practices >= 0.95`, `seo >= 0.95`; `resource-summary:script:size <= 150000`
on `/`.

## Deploy

Connect the GitHub repository to Vercel; set the environment variables from
`.env.example` in the project settings (Production and Preview). Every PR gets
a preview URL; merging to `main` deploys production. Vercel Analytics is
enabled in the dashboard (cookieless).
