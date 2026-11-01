import { expect, test } from "@playwright/test";
import { expectNoHorizontalScroll } from "./helpers";

test.describe("US1 first-impression landing", () => {
  test("first screen shows identity, value proposition and primary actions", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByTestId("hero");
    const h1 = hero.getByRole("heading", { level: 1 });
    await expect(h1).toHaveText(/Seyit Geldiyev/);
    await expect(h1).toBeInViewport();
    await expect(hero.getByText("Middle+ Software Engineer")).toBeInViewport();
    await expect(hero.getByTestId("hero-tagline")).toBeInViewport();
    await expect(hero.getByText("Open to new opportunities")).toBeInViewport();
    const viewWork = hero.getByRole("link", { name: "View work" });
    const contact = hero.getByRole("link", { name: "Contact me" });
    await expect(viewWork).toBeInViewport();
    await expect(contact).toBeInViewport();
    await expect(viewWork).toHaveAttribute("href", "/projects");
    await expect(contact).toHaveAttribute("href", "/contact");
    await expectNoHorizontalScroll(page);
  });

  test("featured section lists three to four projects with visuals, tags and links", async ({
    page,
  }) => {
    await page.goto("/");
    const section = page.getByRole("region", { name: /featured work/i });
    await section.scrollIntoViewIfNeeded();
    const cards = section.getByRole("article");
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(3);
    expect(count).toBeLessThanOrEqual(4);
    for (let i = 0; i < count; i += 1) {
      const card = cards.nth(i);
      await expect(card.getByRole("img")).toHaveCount(1);
      await expect(card.getByRole("heading", { level: 3 })).toBeVisible();
      await expect(card.getByTestId("project-summary")).toBeVisible();
      expect(await card.getByTestId("project-tag").count()).toBeGreaterThan(0);
      const href = await card.getByRole("link", { name: /read case study/i }).getAttribute("href");
      expect(href).toMatch(/^\/projects\/[a-z0-9-]+$/);
    }
  });

  test("contact links and resume download are present and correct", async ({ page, request }) => {
    await page.goto("/");
    const footer = page.getByRole("contentinfo");
    await expect(footer.getByRole("link", { name: "seyitbu1111@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:seyitbu1111@gmail.com",
    );
    await expect(footer.getByRole("link", { name: /GitHub/ })).toHaveAttribute(
      "href",
      "https://github.com/Seyit47",
    );
    await expect(footer.getByRole("link", { name: /LinkedIn/ })).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/seyitgeldiyev-55a17b230",
    );
    await expect(footer.getByRole("link", { name: /Download resume/ })).toHaveAttribute(
      "href",
      "/resume.pdf",
    );
    const pdf = await request.head("/resume.pdf");
    expect(pdf.status()).toBe(200);
    expect(pdf.headers()["content-disposition"]).toContain("attachment");
  });

  test("social preview metadata is complete", async ({ page, request }) => {
    await page.goto("/");
    const og = async (prop: string) =>
      page.locator(`meta[property="${prop}"]`).getAttribute("content");
    expect(await og("og:title")).toContain("Seyit Geldiyev");
    expect(await og("og:description")).toBeTruthy();
    const image = await og("og:image");
    expect(image).toBeTruthy();
    const res = await request.get(image!);
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
    expect(await page.locator('meta[name="twitter:card"]').getAttribute("content")).toBe(
      "summary_large_image",
    );
    expect(await page.locator('link[rel="canonical"]').getAttribute("href")).toMatch(
      /^http:\/\/localhost:3100\/?$/,
    );
  });
});
