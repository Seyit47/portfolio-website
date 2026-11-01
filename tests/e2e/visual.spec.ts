import { expect, test } from "@playwright/test";

const PAGES = ["/", "/projects", "/projects/audit-app", "/experience", "/contact"] as const;

test.describe("visual regression", () => {
  test.use({ reducedMotion: "reduce" });

  for (const path of PAGES) {
    test(`snapshot ${path}`, async ({ page }, testInfo) => {
      await page.goto(`${path}${path.includes("?") ? "&" : "?"}no-canvas=1`);
      await page.waitForLoadState("networkidle");
      await page.evaluate(() => document.fonts.ready);
      const name = `${path === "/" ? "home" : path.slice(1).replace(/\//g, "-")}-${testInfo.project.name}.png`;
      await expect(page).toHaveScreenshot(name, {
        fullPage: true,
        animations: "disabled",
        caret: "hide",
      });
    });
  }
});
