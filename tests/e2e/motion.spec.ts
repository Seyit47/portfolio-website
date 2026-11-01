import { expect, test } from "@playwright/test";

/** Records scroll position and the position of an element every animation frame. */
const FRAME_RECORDER = `
  window.__frames = [];
  window.__bodyTransitions = 0;
  document.addEventListener("transitionrun", (e) => {
    if (e.target === document.body && e.propertyName === "background-color") window.__bodyTransitions += 1;
  });
  window.__record = (selector, ms) => {
    const t0 = performance.now();
    window.__frames = [];
    function tick() {
      const el = document.querySelector(selector);
      window.__frames.push({
        t: performance.now() - t0,
        y: scrollY,
        top: el ? el.getBoundingClientRect().top : null,
        h: el ? el.getBoundingClientRect().height : null,
        bg: getComputedStyle(document.body).backgroundColor,
      });
      if (performance.now() - t0 < ms) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  };
`;

type Frame = { t: number; y: number; top: number | null; h: number | null; bg: string };

test.describe("motion and layout stability", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(FRAME_RECORDER);
  });

  test("filtering projects keeps the scroll position and the filter bar still", async ({
    page,
  }) => {
    await page.goto("/projects");
    await page.locator("html[data-palette-ready]").waitFor({ state: "attached" });
    const filter = page.getByRole("navigation", { name: "Filter by tag" });
    // Scroll so the filter bar sits just below the sticky header, like a visitor who scrolled to it.
    const target = await page.evaluate(() => {
      const nav = document.querySelector('nav[aria-label="Filter by tag"]')!;
      const header = document.querySelector("header")!;
      const top = Math.round(nav.getBoundingClientRect().top + scrollY - header.offsetHeight - 24);
      scrollTo({ top, behavior: "instant" });
      return top;
    });
    await page.waitForFunction((top) => Math.abs(scrollY - top) < 1, target);
    await page.waitForTimeout(300);
    const before = await page.evaluate(() => ({
      y: scrollY,
      top: document.querySelector('nav[aria-label="Filter by tag"]')!.getBoundingClientRect().top,
      heading: document.querySelector("h1")!.getBoundingClientRect().height,
    }));
    expect(before.y).toBeGreaterThan(50);

    await page.evaluate(() => window.__record('nav[aria-label="Filter by tag"]', 1200));
    await filter.getByRole("link", { name: "Dashboard", exact: true }).click();
    await expect(page).toHaveURL(/\/projects\/tag\/dashboard$/);
    await expect(page.getByTestId("filter-status")).toContainText("tagged Dashboard");
    await page.waitForTimeout(1300);

    const frames = (await page.evaluate(() => window.__frames)) as Frame[];
    expect(frames.length).toBeGreaterThan(10);
    for (const frame of frames) {
      expect(frame.y, `scroll position moved at ${frame.t.toFixed(0)}ms`).toBe(before.y);
      expect(frame.top, `filter bar moved at ${frame.t.toFixed(0)}ms`).toBe(before.top);
    }
    const heading = await page.evaluate(
      () => document.querySelector("h1")!.getBoundingClientRect().height,
    );
    expect(heading).toBe(before.heading);
  });

  test("filtered-in cards animate into view", async ({ page }) => {
    await page.goto("/projects/tag/dashboard");
    await page.locator("html[data-palette-ready]").waitFor({ state: "attached" });
    await page
      .getByRole("navigation", { name: "Filter by tag" })
      .getByRole("link", { name: "All", exact: true })
      .click();
    await expect(page).toHaveURL(/\/projects$/);
    // Cards that were already visible appear at once; newly shown cards either wait below the
    // fold for the scroll reveal or are mid-transition into view.
    const state = await page.evaluate(() => {
      const cards = [...document.querySelectorAll<HTMLElement>("[data-flip-key]")];
      return {
        survivorsInstant: cards
          .filter((el) => el.dataset.flipKey === "audit-app")
          .every((el) => el.dataset.reveal === "in" && el.hasAttribute("data-reveal-instant")),
        newcomerAnimated: cards.some(
          (el) =>
            el.dataset.reveal === "out" ||
            (el.dataset.reveal === "in" &&
              !el.hasAttribute("data-reveal-instant") &&
              (el.getAnimations().length > 0 || Number(getComputedStyle(el).opacity) < 1)),
        ),
      };
    });
    expect(state.survivorsInstant).toBe(true);
    expect(state.newcomerAnimated).toBe(true);
  });

  test("switching theme cross-fades instead of flashing", async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.setItem("theme", "light"));
    await page.reload();
    await page.locator("html[data-palette-ready]").waitFor({ state: "attached" });
    const toggle = page.getByRole("button", { name: /^Theme:/ });
    await expect(toggle).toHaveAttribute("aria-label", /switch to Dark/);
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    // The body's background runs a real CSS transition rather than switching in one frame.
    await expect
      .poll(() => page.evaluate(() => window.__bodyTransitions), { timeout: 2000 })
      .toBeGreaterThanOrEqual(1);
  });

  test("command palette animates open and closed", async ({ page }) => {
    await page.goto("/");
    await page.locator("html[data-palette-ready]").waitFor({ state: "attached" });
    await page.getByRole("button", { name: "Open command palette" }).click();
    const dialog = page.getByRole("dialog", { name: "Command palette" });
    await expect(dialog).toBeVisible();
    expect(await dialog.evaluate((el) => getComputedStyle(el).animationName)).toBe(
      "palette-content-in",
    );
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();
  });

  test("experience roles expand with an animated height where supported", async ({ page }) => {
    await page.goto("/experience");
    const supported = await page.evaluate(() =>
      CSS.supports("block-size", "calc-size(auto, size)"),
    );
    test.skip(!supported, "browser cannot animate to an automatic size");
    const item = page.getByTestId("role-item").nth(1);
    await item.scrollIntoViewIfNeeded();
    const closed = (await item.locator("details").boundingBox())!.height;
    await page.evaluate(() =>
      window.__record('[data-testid="role-item"]:nth-of-type(2) details', 900),
    );
    await item.locator("summary").click();
    await page.waitForTimeout(1000);
    const open = (await item.locator("details").boundingBox())!.height;
    expect(open).toBeGreaterThan(closed);
    const heights = ((await page.evaluate(() => window.__frames)) as Frame[]).map((f) => f.h ?? 0);
    // At least one frame is strictly between the closed and open heights: the panel grew over time.
    expect(heights.some((h) => h > closed + 1 && h < open - 1)).toBe(true);
  });
});

declare global {
  interface Window {
    __frames: Frame[];
    __bodyTransitions: number;
    __record: (selector: string, ms: number) => void;
  }
}
