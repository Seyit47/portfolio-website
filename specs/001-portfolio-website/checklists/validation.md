# Validation Record: Portfolio Website

**Purpose**: Evidence that the quickstart.md scenarios were executed
**Created**: 2026-11-01
**Feature**: [spec.md](../spec.md) · [quickstart.md](../quickstart.md)

**Marker Semantics**: `[x]` means the scenario was executed and passed with the evidence noted. Manual device checks are listed separately because they require a physical phone.

## Automated (executed on the development machine, Chrome stable, Node 24)

- [x] VAL001 `pnpm typecheck` exits 0 — verified 2026-11-01
- [x] VAL002 `pnpm lint` exits 0 with zero warnings — verified 2026-11-01
- [x] VAL003 `pnpm test` (Vitest) passes — 12 files, 70 tests
- [x] VAL004 `pnpm build` prerenders every route with zero warnings — 38 routes static, `/contact` dynamic
- [x] VAL005 `pnpm check:resume` reports all five roles as OK — KinesteX, Ynamly Belentlik, ForEach Partners, Datacorda, Belli Creative
- [x] VAL006 US1 landing spec passes on mobile and desktop — 8/8
- [x] VAL007 US2 projects spec passes on mobile and desktop — 12/12
- [x] VAL008 US3 experience spec passes on mobile and desktop — 8/8
- [x] VAL009 US4 contact spec passes with JavaScript on and off — 16/16 incl. honeypot and timing cases
- [x] VAL010 US5 polish, reduced-motion and no-JS specs pass — full suite 136/136 in 53 s
- [x] VAL011 a11y spec reports zero serious/critical axe violations in light and dark — 7 routes x 2 themes
- [x] VAL012 visual snapshots captured and reviewed at 360 and 1440 — 10 snapshots (home, projects, project, experience, contact)
- [x] VAL018 Home-page JavaScript budget — 139.9 KB compressed across 8 scripts (`node scripts/measure-bundle.mjs`), limit 150 KB
- [x] VAL019 Motion and layout stability (`tests/e2e/motion.spec.ts`, 5 scenarios x 2 viewports): filtering projects keeps scroll position and filter-bar position frame by frame, survivors slide and newcomers stagger in, theme switch runs a real background transition, palette animates open and closed, role panels animate height — passed 8 repeated runs on 2026-11-02; per-frame probe shows no single-frame jumps on filter, theme, palette, pager or role actions at 360 and 1440
- [x] VAL013 Lighthouse CI: all four categories >= 0.95 on five routes, script budget on `/` <= 150 KB — 15 runs, 0 failed assertions: performance 97, accessibility 100, best-practices 100, SEO 100 on every route; home scripts 148 KiB transfer; simulated-mobile LCP 2.5-2.7 s (borderline against the 2.5 s field target, see Notes)

## Manual (requires the owner's devices and accounts)

- [ ] VAL014 Mid-tier Android phone, both themes, reduced motion on and off: every user story completes
- [ ] VAL015 Social preview cards render on LinkedIn, Telegram and X for `/` and a project page
- [ ] VAL016 Contact form delivers to the inbox with real Resend and Upstash credentials
- [ ] VAL017 Vercel project connected; preview deployment per PR; production on `main`

## Notes

- Lighthouse simulated slow-4G mobile throttling reports LCP between 2.5 and 2.7 s on every route; fonts (Inter + Sora, ~74 KB) are the largest remaining critical-path cost. Field p75 on real mid-tier devices is expected to be lower; verify with Vercel Speed Insights after launch and consider dropping the second font family if the field number exceeds 2.5 s.

- Record the command output or report link next to each item when marking it.
