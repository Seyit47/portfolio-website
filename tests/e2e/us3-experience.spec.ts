import { expect, test } from "@playwright/test";

const ORDER = ["KinesteX", "ForEach Partners", "Datacorda", "Ynamly Belentlik", "Belli Creative"];

test.describe("US3 experience timeline and skills", () => {
  test("lists five roles and education in descending order with overlap markers", async ({
    page,
  }) => {
    await page.goto("/experience");
    await expect(page.getByRole("heading", { level: 1, name: "Experience" })).toBeVisible();
    const roles = page.getByTestId("role-item");
    await expect(roles).toHaveCount(5);
    const employers = await roles.locator("[data-employer]").allTextContents();
    expect(employers).toEqual(ORDER);
    for (const item of [
      "Software Developer",
      "May 2025 - Jun 2026",
      "Dubai, United Arab Emirates",
    ]) {
      await expect(roles.first()).toContainText(item);
    }
    await expect(page.locator("#kinestex").getByTestId("overlap-note")).toContainText(
      "Ynamly Belentlik",
    );
    await expect(page.locator("#foreach-partners").getByTestId("overlap-note")).toContainText(
      "Ynamly Belentlik",
    );
    await expect(page.locator("#belli-creative").getByTestId("overlap-note")).toHaveCount(0);
    await expect(
      page.getByText("Institute of Telecommunications and Informatics of Turkmenistan"),
    ).toBeVisible();
    await expect(page.getByText("Information Security Engineering")).toBeVisible();
  });

  test("roles expand by keyboard and expose their state", async ({ page }) => {
    await page.goto("/experience");
    const second = page.getByTestId("role-item").nth(1);
    const summary = second.locator("summary");
    await expect(second.locator("details")).not.toHaveAttribute("open", "");
    await summary.focus();
    await page.keyboard.press("Enter");
    await expect(second.locator("details")).toHaveAttribute("open", "");
    await expect(second.getByRole("list", { name: /highlights/i })).toBeVisible();
    await page.keyboard.press("Enter");
    await expect(second.locator("details")).not.toHaveAttribute("open", "");
  });

  test("skills are grouped in content order with visible level labels", async ({ page }) => {
    await page.goto("/experience");
    const groups = page.getByTestId("skill-group");
    const names = await groups.locator("h3").allTextContents();
    expect(names[0]).toBe("Front-end frameworks & server rendering");
    expect(names[names.length - 1]).toBe("AI-assisted & spec-driven development");
    const skills = page.getByTestId("skill");
    expect(await skills.count()).toBeGreaterThan(20);
    const labels = await skills.locator("[data-level-label]").allTextContents();
    expect(labels.every((l) => ["Primary", "Working", "Familiar"].includes(l))).toBe(true);
  });

  test("resume download is offered", async ({ page }) => {
    await page.goto("/experience");
    await expect(
      page
        .getByRole("main")
        .getByRole("link", { name: /download resume/i })
        .first(),
    ).toHaveAttribute("href", "/resume.pdf");
  });
});
