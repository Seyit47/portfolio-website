import { expect, test } from "@playwright/test";

test.describe("US2 project case studies", () => {
  test("index lists every published project newest first", async ({ page }) => {
    await page.goto("/projects");
    await expect(page.getByRole("heading", { level: 1, name: "Projects" })).toBeVisible();
    const cards = page.getByRole("main").getByRole("article");
    expect(await cards.count()).toBe(9);
    const years = await cards.locator("[data-project-year]").allTextContents();
    const numeric = years.map(Number);
    expect([...numeric].sort((a, b) => b - a)).toEqual(numeric);
    await expect(cards.first().getByRole("heading", { level: 2 })).toHaveText(/Audit App/);
  });

  test("tag filter navigates to a path, filters, survives reload and handles unknown tags", async ({
    page,
  }) => {
    await page.goto("/projects");
    const filter = page.getByRole("navigation", { name: "Filter by tag" });
    await filter.getByRole("link", { name: "Dashboard", exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/tag\/dashboard$/);
    await expect(filter.getByRole("link", { name: "Dashboard", exact: true })).toHaveAttribute(
      "aria-current",
      "page",
    );
    const cards = page.getByRole("main").getByRole("article");
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);
    expect(count).toBeLessThan(9);
    for (let i = 0; i < count; i += 1) {
      await expect(
        cards
          .nth(i)
          .getByTestId("project-tag")
          .filter({ hasText: /^Dashboard$/ }),
      ).toHaveCount(1);
    }
    await page.reload();
    expect(await page.getByRole("main").getByRole("article").count()).toBe(count);

    await page.goto("/projects/tag/nope");
    await expect(page.getByText(/not recognised/)).toBeVisible();
    expect(await page.getByRole("main").getByRole("article").count()).toBe(9);
  });

  test("case study renders sections in the contract order with external links", async ({
    page,
  }) => {
    await page.goto("/projects/audit-app");
    await expect(page.getByRole("navigation", { name: "Breadcrumb" })).toBeVisible();
    await expect(page.getByRole("heading", { level: 1, name: "Audit App" })).toBeVisible();
    const headings = await page.getByRole("main").locator("h2").allTextContents();
    const expected = ["Summary", "Problem", "Solution", "Highlights", "Outcome", "Links"];
    const positions = expected.map((h) => headings.findIndex((t) => t.startsWith(h)));
    expect(positions.every((p) => p >= 0)).toBe(true);
    expect([...positions].sort((a, b) => a - b)).toEqual(positions);
    await expect(page.getByTestId("project-meta")).toContainText("2026");
    await expect(page.getByTestId("project-meta")).toContainText("Full-stack platform");
    const live = page.getByRole("link", { name: /live demo/i });
    const source = page.getByRole("link", { name: /source code/i });
    await expect(live).toHaveAttribute("target", "_blank");
    await expect(live).toHaveAttribute("rel", /noopener/);
    await expect(source).toHaveAttribute("href", "https://github.com/Seyit47/audit-app");
    await expect(page.getByRole("navigation", { name: "Project pagination" })).toBeVisible();
  });

  test("case study without public source shows the case-study-only note", async ({ page }) => {
    await page.goto("/projects/belli-creative-tools");
    await expect(page.getByRole("link", { name: /live demo/i })).toHaveCount(0);
    await expect(page.getByRole("link", { name: /source code/i })).toHaveCount(0);
    await expect(page.getByText("This work is described as a case study only.")).toBeVisible();
  });

  test("pager moves between adjacent projects", async ({ page }) => {
    await page.goto("/projects/sdd-navigator-dashboard");
    const pager = page.getByRole("navigation", { name: "Project pagination" });
    await pager.getByRole("link", { name: /previous/i }).click();
    await expect(page).toHaveURL(/\/projects\/audit-app$/);
    await page
      .getByRole("navigation", { name: "Project pagination" })
      .getByRole("link", { name: /next/i })
      .click();
    await expect(page).toHaveURL(/\/projects\/sdd-navigator-dashboard$/);
  });

  test("project pages expose article metadata and a generated preview image", async ({
    page,
    request,
  }) => {
    await page.goto("/projects/audit-app");
    expect(await page.locator('meta[property="og:type"]').getAttribute("content")).toBe("article");
    const image = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(image).toContain("/projects/audit-app/opengraph-image");
    const res = await request.get(image!);
    expect(res.status()).toBe(200);
  });
});
