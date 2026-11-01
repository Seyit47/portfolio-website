# Portfolio Website

Personal portfolio for Seyit Geldiyev. Governed by `.specify/memory/constitution.md`;
feature docs live in `specs/001-portfolio-website/`.

## Stack

Next.js 16 App Router (Turbopack, classic prerendering; `cacheComponents` is off so the
contact page can render per request), React 19, TypeScript strict,
Tailwind CSS 4 (`styles/tokens.css` -> `styles/globals.css` `@theme`), Content Collections
(Zod-validated YAML + MDX under `content/`), CSS-driven reveals (`RevealObserver`), OGL hero,
cmdk, next-themes, Resend,
Upstash Ratelimit. Deployed on Vercel.

Next 16 differs from older training data: read `node_modules/next/dist/docs/` before using
an unfamiliar API.

## Commands

| Command                                      | Purpose                                                                                                           |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `pnpm dev`                                   | dev server on :3000                                                                                               |
| `pnpm typecheck` / `pnpm lint` / `pnpm test` | static checks and unit tests                                                                                      |
| `pnpm build && pnpm start`                   | production build and server                                                                                       |
| `pnpm e2e`                                   | Playwright on port 3100 (builds first unless `PW_SKIP_BUILD=1`; `PW_EXTERNAL_SERVER=1` to reuse a running server) |
| `pnpm lhci`                                  | Lighthouse CI budgets                                                                                             |
| `pnpm check:resume`                          | experience.yaml vs public/resume.pdf                                                                              |
| `pnpm ci`                                    | everything, in order                                                                                              |

## Rules

- Content changes never require component changes. Add a project = one file in
  `content/projects/*.mdx` plus visuals under `public/images/projects/<slug>/`.
- Components read content only through `lib/content.ts`.
- Test-first for everything in `lib/` and `scripts/`; one e2e spec per page.
- Motion only on transform/opacity, always through tokens, always reduced-motion aware.
- Primary content and navigation must work without JavaScript.
- Never add a runtime dependency without recording it in `specs/001-portfolio-website/research.md` R10.
- Conventional Commits; Husky runs lint-staged and commitlint.
