# Seyit Geldiyev · Portfolio

Personal portfolio for Seyit Geldiyev, Middle+ Software Engineer. Content-driven, statically
generated, accessible, and tested in CI. Built with the Spec Kit workflow; the governing
constitution and feature documents live under `.specify/` and `specs/`.

## Stack

- Next.js 16 (App Router, Turbopack) with React 19 and TypeScript strict
- Tailwind CSS 4 with design tokens in `styles/tokens.css`
- Content Collections: Zod-validated YAML profile data and MDX case studies under `content/`
- CSS-driven reveals and page transitions (a 1 KB IntersectionObserver helper), OGL (WebGL hero loaded after idle and first interaction), cmdk (command palette), next-themes
- Server Action contact form: Zod validation, honeypot and timing checks, Upstash rate limit, Resend delivery
- Vitest, Playwright (end-to-end, accessibility via axe, visual snapshots), Lighthouse CI, resume consistency check

## Commands

| Command                     | What it does                                                                                  |
| --------------------------- | --------------------------------------------------------------------------------------------- |
| `pnpm dev`                  | development server on http://localhost:3000                                                   |
| `pnpm typecheck`            | TypeScript without emit                                                                       |
| `pnpm lint`                 | ESLint with `eslint-config-next` and strict jsx-a11y rules, zero warnings                     |
| `pnpm test`                 | Vitest unit tests (`tests/unit`)                                                              |
| `pnpm build` / `pnpm start` | production build and server                                                                   |
| `pnpm e2e`                  | Playwright suites in `tests/e2e` (builds first unless `PW_SKIP_BUILD=1`; serves on port 3100) |
| `pnpm e2e:update`           | refresh visual snapshots after reviewing the diff                                             |
| `pnpm lhci`                 | Lighthouse CI on five routes with budgets from `budgets.json`                                 |
| `pnpm check:resume`         | asserts `content/experience.yaml` matches `public/resume.pdf` (needs `pdftotext`)             |
| `pnpm ci`                   | everything above in order                                                                     |

Node 24 (`.nvmrc`) and pnpm 12. Playwright and Lighthouse use Google Chrome stable everywhere
(`channel: "chrome"`); CI installs it with `playwright install --with-deps chrome`.

## Content workflow

Adding a project means one file and its visuals, nothing in `components/` or `app/`:

1. Create `content/projects/<slug>.mdx` with the frontmatter from
   `specs/001-portfolio-website/contracts/content-schema.md` and an MDX body.
2. Put screenshots under `public/images/projects/<slug>/` and list them in `visuals`.
3. Use existing tag slugs from `content/tags.yaml`; keep three or four projects `featured: true`.
4. `pnpm build` validates every document and cross-reference and fails loudly on mistakes.

Profile, roles, education, skills and tags live in `content/*.yaml`. The resume PDF served at
`/resume.pdf` is `public/resume.pdf`; `pnpm check:resume` keeps the two in sync.

## Environment variables

See `.env.example`. `SITE_URL` must be the public origin (canonical URLs, sitemap, Open Graph
images). The contact form works without Resend or Upstash credentials by logging instead of
sending and by skipping rate limiting.

## Testing

- Unit tests cover the content accessors, cross-collection validation, date utilities, SEO
  builders, the contact pipeline and key components.
- End-to-end specs map one-to-one to the user stories in `specs/001-portfolio-website/spec.md`,
  plus `a11y.spec.ts` (both themes), `no-js.spec.ts`, `reduced-motion.spec.ts` and
  `visual.spec.ts`.
- Lighthouse CI enforces performance, accessibility, best-practices and SEO scores of at least
  0.95 and a 150 KB script budget on the home page.

## Deployment

Connect the repository to Vercel. Set the variables from `.env.example` for Production and
Preview. Every pull request gets a preview deployment; merging to `main` deploys production.
Vercel Analytics is cookieless and needs no consent banner.
