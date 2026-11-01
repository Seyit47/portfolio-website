/**
 * Measures the compressed JavaScript a modern browser downloads for a page.
 * Usage: node scripts/measure-bundle.mjs [baseURL] [path]   (defaults: http://localhost:3100 /)
 */
import { gzipSync } from "node:zlib";
import { chromium } from "@playwright/test";

const base = process.argv[2] ?? "http://localhost:3100";
const path = process.argv[3] ?? "/";
const browser = await chromium.launch({ channel: "chrome" });
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const rows = [];
page.on("response", async (res) => {
  const url = res.url();
  if (!url.includes("/_next/static/") || !url.endsWith(".js")) return;
  const body = await res.body().catch(() => Buffer.alloc(0));
  rows.push({
    name: url.split("/").pop(),
    raw: body.length,
    gz: gzipSync(body, { level: 6 }).length,
  });
});
await page.goto(base + path);
await page.waitForLoadState("networkidle");
await page.waitForTimeout(2500);
await browser.close();
rows.sort((a, b) => b.gz - a.gz);
for (const r of rows)
  console.log(
    `${(r.gz / 1024).toFixed(1).padStart(7)} KB gz ${(r.raw / 1024).toFixed(1).padStart(7)} KB raw  ${r.name}`,
  );
const total = rows.reduce((a, r) => a + r.gz, 0);
console.log(
  `\n${path}: ${rows.length} scripts, ${(total / 1024).toFixed(1)} KB compressed (budget 150 KB on /)`,
);
process.exit(total / 1024 > 150 && path === "/" ? 1 : 0);
