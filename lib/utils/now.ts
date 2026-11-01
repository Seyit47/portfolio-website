/**
 * A single "now" captured at build time (see next.config.ts `env.BUILD_DATE`).
 * Prerendered pages must not call `new Date()` during render under cacheComponents.
 */
export const BUILD_NOW: Date = new Date(process.env.BUILD_DATE ?? "2026-11-01T00:00:00.000Z");
