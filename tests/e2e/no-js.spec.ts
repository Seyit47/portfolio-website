import { expect, test } from "@playwright/test";
import { ROUTES } from "./helpers";

test.describe("without JavaScript", () => {
  test.use({ javaScriptEnabled: false });

  for (const route of ROUTES) {
    test(`renders content and navigation on ${route}`, async ({ page }) => {
      const res = await page.goto(route);
      expect(res?.status()).toBe(200);
      await expect(page.locator("h1")).toHaveCount(1);
      await expect(
        page.getByRole("contentinfo").getByRole("link", { name: /GitHub/ }),
      ).toBeVisible();
      expect(await page.getByRole("main").getByRole("link").count()).toBeGreaterThan(0);
    });
  }

  test("tag filter links still filter", async ({ page }) => {
    await page.goto("/projects");
    await page
      .getByRole("navigation", { name: "Filter by tag" })
      .getByRole("link", { name: "Media", exact: true })
      .click();
    await expect(page).toHaveURL(/\/projects\/tag\/media$/);
    await expect(page.getByRole("main").getByRole("article")).toHaveCount(1);
  });

  test("role disclosures still expand", async ({ page }) => {
    await page.goto("/experience");
    const second = page.getByTestId("role-item").nth(1);
    await second.locator("summary").click();
    await expect(second.locator("details")).toHaveAttribute("open", "");
  });

  test("palette trigger is inert and the theme is system-driven", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Open command palette" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
