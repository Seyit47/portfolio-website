import { expect, test } from "@playwright/test";
import { describeViolations, ROUTES, runAxe, setTheme } from "./helpers";

const ALL_ROUTES = [...ROUTES, "/does-not-exist"] as const;

for (const theme of ["light", "dark"] as const) {
  test.describe(`accessibility (${theme})`, () => {
    test.use({ colorScheme: theme });

    for (const route of ALL_ROUTES) {
      test(`${route} has no serious or critical violations`, async ({ page }) => {
        await page.goto(route);
        await setTheme(page, theme);
        // Let the hero intro and reveals finish so axe measures final colours.
        await page.evaluate(() =>
          Promise.all(document.getAnimations().map((a) => a.finished.catch(() => undefined))),
        );
        await page.waitForTimeout(200);
        await expect(page.locator("h1")).toHaveCount(1);
        await expect(page.getByRole("banner")).toBeVisible();
        await expect(page.getByRole("main")).toBeVisible();
        await expect(page.getByRole("contentinfo")).toBeVisible();
        const violations = await runAxe(page);
        expect(violations, describeViolations(violations)).toEqual([]);
      });
    }

    test("skip link is first in tab order", async ({ page }) => {
      await page.goto("/");
      await page.keyboard.press("Tab");
      await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(page.locator("#main")).toBeFocused();
      await expect(page).toHaveURL(/#main$/);
    });
  });
}
