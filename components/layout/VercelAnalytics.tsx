"use client";

import dynamic from "next/dynamic";

// Vercel exposes NEXT_PUBLIC_VERCEL_ENV at build time on its platform only, so the
// analytics bundle is never part of local or self-hosted builds' initial scripts.
const Analytics = process.env.NEXT_PUBLIC_VERCEL_ENV
  ? dynamic(() => import("@vercel/analytics/next").then((m) => m.Analytics), { ssr: false })
  : null;

export function VercelAnalytics() {
  return Analytics ? <Analytics /> : null;
}
