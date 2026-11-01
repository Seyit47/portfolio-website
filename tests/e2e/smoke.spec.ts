import { expect, test } from "@playwright/test";

test.describe("smoke", () => {
  test("home responds with 200, one h1 and landmarks", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("contentinfo")).toBeVisible();
  });

  test("skip link is the first focusable element", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Skip to content" })).toBeFocused();
  });

  test("unknown routes return 404 with the designed page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Browse projects" })).toHaveAttribute(
      "href",
      "/projects",
    );
  });

  test("no console errors on any route", async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });
    page.on("response", (res) => {
      if (res.status() >= 400) errors.push(`${res.status()} ${res.url()}`);
    });
    for (const path of ["/", "/projects", "/experience", "/contact"]) {
      await page.goto(path);
      await page.waitForLoadState("networkidle");
    }
    expect(errors, errors.join("\n")).toEqual([]);
  });

  test("sitemap and robots are served", async ({ request }) => {
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).toContain("/projects/audit-app");
    const robots = await request.get("/robots.txt");
    expect(await robots.text()).toContain("sitemap.xml");
  });
});
