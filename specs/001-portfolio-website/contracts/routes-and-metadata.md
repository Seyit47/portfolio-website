# Contract: Routes, Metadata and Interaction Behaviour

## Routes

| Route | Rendering | Source | Title pattern | JSON-LD | OG image |
|-------|-----------|--------|---------------|---------|----------|
| `/` | static | profile, featured projects | `Seyit Geldiyev · Middle+ Software Engineer` | `Person`, `WebSite` | `/opengraph-image` (branded default) |
| `/projects` | static | projects, tags | `Projects · Seyit Geldiyev` | `ItemList` of `CreativeWork` | default |
| `/projects/tag/[tag]` | static (`generateStaticParams` per tag; `dynamicParams = true` so unknown tags render on demand) | projects, tags | `Projects · <Tag> · Seyit Geldiyev` | `ItemList` of `CreativeWork` | default |
| `/projects/[slug]` | static (`generateStaticParams`) | project | `<Title> · Projects · Seyit Geldiyev` | `CreativeWork` (or `SoftwareSourceCode` when `links.source`), `BreadcrumbList` | `/projects/[slug]/opengraph-image` (title + tags on brand frame) |
| `/experience` | static | roles, education, skills, profile | `Experience · Seyit Geldiyev` | `Person` with `hasOccupation`, `alumniOf` | default |
| `/contact` | static page + Server Action | profile | `Contact · Seyit Geldiyev` | `ContactPage` | default |
| any unknown | `not-found.tsx`, HTTP 404 | | `Page not found · Seyit Geldiyev` | none, `robots: noindex` | default |
| `/resume.pdf` | static file, `Content-Disposition: attachment` | `public/resume.pdf` | | | |
| `/sitemap.xml`, `/robots.txt`, `/manifest.webmanifest` | generated | content | | | |

Unknown `/projects/tag/<value>` renders the unfiltered list plus an
unobtrusive note "Filter "<value>" was not recognised" with
`robots: noindex` (spec edge case). Filtering uses path segments rather than
query strings so every filtered view is prerendered and works without JS.

## Metadata rules (every route)

- `title` via template `%s · Seyit Geldiyev`; Home uses `absolute`.
- `description` <= 160 chars, unique per route; project pages use `summary`.
- `alternates.canonical` absolute, derived from `metadataBase` (site URL env).
- `openGraph`: type `website` (Home, lists) or `article` (project), locale
  `en`, siteName, image 1200x630 with alt.
- `twitter.card = summary_large_image`.
- `robots`: index/follow everywhere except 404 and unpublished content.

## Page section contracts

### Home (`/`)

Order: Skip link -> Header -> Hero (h1 name, role, tagline, availability,
CTAs "View work" -> `/projects`, "Contact" -> `/contact`) -> Featured
projects (h2, 3-4 `ProjectCard`) -> About strip (summary, location,
languages, "More about me" -> `/experience`) -> Contact strip (email, GitHub,
LinkedIn, "Download resume") -> Footer.
Hero canvas: `aria-hidden="true"`, mounted after idle, absent under reduced
motion or without WebGL; LCP element is the h1.

### Projects index (`/projects`)

h1 "Projects" -> `TagFilter` (links, not buttons, so filtering works without
JS; current tag has `aria-current="page"`) -> grid of `ProjectCard` (title,
year, type, summary, tags, visual or placeholder) newest first -> empty-state
if a tag has no projects.

### Project (`/projects/[slug]`)

Breadcrumb -> h1 title -> meta row (year, type, role, period, employer link
to `/experience#<role-id>`) -> hero visual or placeholder -> Summary ->
Problem -> Solution -> Highlights (list) -> Outcome (+ metrics callouts) ->
Tags (links to filtered index) -> External links (only those present; `rel`
`noopener`, new tab with "(opens in new tab)" text for screen readers; when
none: "This work is described as a case study only.") -> MDX body -> Pager
(previous / next with titles).

### Experience (`/experience`)

h1 -> Timeline (`<ol>` chronological desc; overlapping roles rendered in
parallel lanes on >= 768 px and stacked with an "overlaps with" note below;
each `RoleItem` is a native `<details>`/`<summary>` disclosure enhanced with
animation, so expansion works without JS and is announced) -> Education ->
Skills (groups in `order`; each skill shows a depth indicator with visible
text label, not colour alone) -> Resume download CTA.

### Contact (`/contact`)

h1 -> direct links (email with copy button that falls back to plain link,
GitHub, LinkedIn, resume) -> `ContactForm` per contact-form contract.

### Not Found

h1 "Page not found" -> links to `/` and `/projects` -> palette hint.

## Interaction contracts

| Behaviour | Contract |
|-----------|----------|
| Theme | `next-themes`, class strategy, system default; toggle cycles system -> light -> dark; stored key `theme`; no flash on load (inline script); `color-scheme` set on `html` |
| Command palette | Opens on `Ctrl+K` / `Cmd+K` and the header button (`aria-haspopup="dialog"`, accessible name "Open command palette" from visually hidden text; the `Ctrl K` hint is `aria-hidden`); dialog with `aria-label="Command palette"`; groups: Pages, Projects, Links; arrow keys, Enter, Escape; focus returns to trigger on close; entries from `getPaletteEntries()`; the palette bundle loads on first open |
| Motion | CSS-only: `[data-reveal]` elements start hidden only under `html.js` (class set by an inline script) and `RevealObserver` flips them to `in` on intersection (opacity + translateY(16px), once per element); durations and easings from tokens; without JavaScript everything is visible; under reduced motion all reveals are instant and the hero canvas is not mounted |
| Page transition | `template.tsx` wrapper runs a CSS keyframe (fade + 6px lift, <= 250 ms) on client-side navigations only (`html.navigated`, set after the first route change) so the initial paint is never delayed; no exit animation; removed under reduced motion |
| Hero canvas | Mounted after `requestIdleCallback` and the first pointer/scroll/key/touch interaction, only with WebGL and without reduced motion; `?no-canvas=1` disables it for tests |
| Focus | Visible focus ring token on all interactive elements; skip link first in DOM targeting `#main` |
| External links | `target="_blank" rel="noopener noreferrer"` with visually hidden "(opens in new tab)" |
| Images | `next/image` with explicit width/height from content, `sizes` per breakpoint, `loading="lazy"` below the fold, placeholder SVG when `visuals` is empty |
| Analytics | `@vercel/analytics` only in production; no cookies; no consent banner |

## Headers (`next.config.ts`)

- `/resume.pdf`: `Content-Disposition: attachment; filename="Seyit-Geldiyev-Resume.pdf"`.
- Global: `X-Content-Type-Options: nosniff`, `Referrer-Policy:
  strict-origin-when-cross-origin`, `Permissions-Policy` denying camera,
  microphone, geolocation; a Content-Security-Policy compatible with Vercel
  Analytics and inline theme script (nonce or hash).
