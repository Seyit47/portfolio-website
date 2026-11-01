import type { NextConfig } from "next";
import { withContentCollections } from "@content-collections/next";

// Next.js and next-themes inject small inline scripts into prerendered HTML, and a
// per-request nonce would force every page to render dynamically. The policy therefore
// allows inline scripts and styles from this origin and locks down everything else
// (no framing, no plugins, no foreign form targets, only Vercel Analytics for beacons).
const contentSecurityPolicy = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://va.vercel-scripts.com https://vitals.vercel-insights.com",
  "worker-src 'self' blob:",
  "frame-ancestors 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-Frame-Options", value: "DENY" },
];

const buildDate = new Date();

const nextConfig: NextConfig = {
  // Classic rendering model: every page is prerendered except routes that opt into
  // per-request rendering (the contact page, so its anti-spam timestamp is fresh and
  // the form arrives in the initial HTML without client-side streaming).
  cacheComponents: false,
  env: {
    // Captured once at build time so prerendered pages never call Date.now() during render.
    BUILD_DATE: buildDate.toISOString(),
    BUILD_YEAR: String(buildDate.getFullYear()),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 640, 768, 1024, 1280, 1440, 1920],
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      {
        source: "/resume.pdf",
        headers: [
          {
            key: "Content-Disposition",
            value: 'attachment; filename="Seyit-Geldiyev-Resume.pdf"',
          },
        ],
      },
    ];
  },
};

export default withContentCollections(nextConfig);
