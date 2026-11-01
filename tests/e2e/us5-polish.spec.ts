import { expect, test } from "@playwright/test";

test.describe("US5 signature experience", () => {
  test("the LCP element is hero text and the canvas mounts after idle plus interaction", async ({
    page,
  }) => {
    await page.goto("/");
    const h1 = page.getByTestId("hero").getByRole("heading", { level: 1 });
    await expect(h1).toBeVisible();
    const lcp = await page.evaluate(
      () =>
        new Promise<{ tag: string; at: number }>((resolve) => {
          const done = (list: Array<{ element?: Element; startTime: number }>) => {
            const last = list[list.length - 1];
            if (last) resolve({ tag: last.element?.tagName ?? "NONE", at: last.startTime });
          };
          new PerformanceObserver((l) =>
            done(l.getEntries() as Array<{ element?: Element; startTime: number }>),
          ).observe({
            type: "largest-contentful-paint",
            buffered: true,
          });
          setTimeout(() => resolve({ tag: "NONE", at: 0 }), 3000);
        }),
    );
    expect(lcp.tag, `LCP element was ${lcp.tag}`).not.toBe("CANVAS");
    expect(lcp.at, `LCP at ${Math.round(lcp.at)} ms`).toBeLessThan(2500);
    await expect(page.locator("[data-hero-canvas]")).toHaveCount(0);
    await page.mouse.move(200, 300);
    await expect(page.locator("[data-hero-canvas]")).toHaveCount(1, { timeout: 8000 });
  });

  test("command palette opens with Ctrl+K, filters, navigates and restores focus", async ({
    page,
  }, testInfo) => {
    await page.goto("/projects");
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();
    await page.keyboard.type("audit");
    const option = dialog.getByRole("option", { name: /Audit App/ });
    await expect(option).toBeVisible();
    await expect(dialog.getByRole("option")).toHaveCount(1);
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/audit-app$/);
    await expect(dialog).toBeHidden();

    const trigger = page.getByRole("button", { name: "Open command palette" });
    await trigger.click();
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog", { name: "Command palette" })).toBeHidden();
    // Touch taps do not focus buttons, so focus restoration is only observable with a pointer.
    if (!testInfo.project.name.includes("mobile")) await expect(trigger).toBeFocused();
  });

  test("palette lists pages, projects and external links", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open command palette" }).click();
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog.getByRole("group", { name: "Pages" })).toBeVisible();
    await expect(dialog.getByRole("group", { name: "Projects" })).toBeVisible();
    await expect(dialog.getByRole("group", { name: "Links" })).toBeVisible();
    await expect(dialog.getByRole("option", { name: /GitHub/ })).toBeVisible();
  });
});

test.describe("US5 theme", () => {
  test.use({ colorScheme: "dark" });

  test("dark system preference renders dark on first paint and manual choice persists", async ({
    page,
  }) => {
    await page.goto("/");
    const classAtLoad = await page.evaluate(() => document.documentElement.className);
    expect(classAtLoad).toContain("dark");
    const toggle = page.getByRole("button", { name: /^Theme:/ });
    await expect(toggle).toHaveAttribute("aria-label", "Theme: System, switch to Light");
    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("light");
    await page.reload();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await expect(page.getByRole("button", { name: /^Theme:/ })).toHaveAttribute(
      "aria-label",
      "Theme: Light, switch to Dark",
    );
  });
});
