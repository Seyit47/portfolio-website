import { expect, test } from "@playwright/test";
import { ROUTES } from "./helpers";

test.describe("reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("no hero canvas and no animated reveals", async ({ page }) => {
    await page.goto("/");
    await page.waitForTimeout(2500);
    await page.mouse.move(100, 100);
    await page.waitForTimeout(500);
    await expect(page.locator("[data-hero-canvas]")).toHaveCount(0);
    expect(await page.locator("[data-reveal]").count()).toBeGreaterThan(0);
    const styles = await page.evaluate(() =>
      [...document.querySelectorAll("[data-hero-line], [data-reveal], .page-enter")].map((el) => {
        const cs = getComputedStyle(el);
        return {
          opacity: cs.opacity,
          transform: cs.transform,
          anim: cs.animationName,
          transition: cs.transitionDuration,
        };
      }),
    );
    for (const s of styles) {
      expect(s.opacity).toBe("1");
      expect(s.transform).toBe("none");
      expect(s.anim).toBe("none");
      expect(["0s", ""]).toContain(s.transition.split(",")[0]?.trim());
    }
  });

  for (const route of ROUTES) {
    test(`content and navigation work on ${route}`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(
        page.getByRole("navigation", { name: "Primary" }).getByRole("link", { name: "Projects" }),
      ).toBeVisible();
      await expect(page.getByRole("main")).toBeVisible();
    });
  }
});
