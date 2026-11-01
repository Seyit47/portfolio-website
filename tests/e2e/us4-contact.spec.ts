import { expect, test, type Page } from "@playwright/test";

async function fillForm(page: Page, values: { name?: string; email?: string; message?: string }) {
  await page.getByLabel("Name").fill(values.name ?? "");
  await page.getByLabel("Email").fill(values.email ?? "");
  await page.getByLabel("Message").fill(values.message ?? "");
}

/** The anti-spam timer requires three seconds between render and submit. */
async function backdateRender(page: Page) {
  await page.evaluate(() => {
    const input = document.querySelector<HTMLInputElement>('input[name="renderedAt"]');
    if (input) input.value = String(Date.now() - 10_000);
  });
}

for (const js of [true, false]) {
  test.describe(`US4 contact (javascript ${js ? "on" : "off"})`, () => {
    test.use({ javaScriptEnabled: js });

    test("direct links are present", async ({ page }) => {
      await page.goto("/contact");
      const main = page.getByRole("main");
      await expect(main.getByRole("heading", { level: 1, name: "Let's talk" })).toBeVisible();
      await expect(main.getByRole("link", { name: "seyitbu1111@gmail.com" })).toHaveAttribute(
        "href",
        "mailto:seyitbu1111@gmail.com",
      );
      await expect(main.getByRole("link", { name: /GitHub profile/ })).toHaveAttribute(
        "href",
        "https://github.com/Seyit47",
      );
      await expect(main.getByRole("link", { name: /LinkedIn profile/ })).toHaveAttribute(
        "href",
        /linkedin\.com/,
      );
      await expect(main.getByRole("link", { name: /Download resume/ })).toHaveAttribute(
        "href",
        "/resume.pdf",
      );
    });

    test("valid submission shows a confirmation", async ({ page }) => {
      await page.goto("/contact");
      await expect(page.getByLabel("Name")).toBeVisible();
      await fillForm(page, {
        name: "Playwright Tester",
        email: "tester@example.com",
        message: "This is an automated end-to-end test message.",
      });
      await page.waitForTimeout(3_100);
      await page.getByRole("button", { name: "Send message" }).click();
      await expect(page.getByRole("status")).toContainText("Message sent", { timeout: 10_000 });
    });

    test("invalid input shows inline errors and keeps values", async ({ page }) => {
      await page.goto("/contact");
      await fillForm(page, { name: "Playwright Tester", email: "not-an-email", message: "short" });
      await page.waitForTimeout(3_100);
      await page.getByRole("button", { name: "Send message" }).click();
      const errors = page.getByTestId("field-error");
      await expect(errors).toHaveCount(2, { timeout: 10_000 });
      const email = page.getByLabel("Email");
      await expect(email).toHaveAttribute("aria-invalid", "true");
      await expect(email).toHaveAttribute("aria-describedby", /error/);
      await expect(email).toHaveValue("not-an-email");
      await expect(page.getByLabel("Name")).toHaveValue("Playwright Tester");
      if (js) await expect(email).toBeFocused();
      await expect(page.getByRole("status")).toHaveCount(0);
    });
  });
}

test.describe("US4 contact spam protection", () => {
  test("a filled honeypot is silently accepted without sending", async ({ page }) => {
    await page.goto("/contact");
    await fillForm(page, {
      name: "Bot",
      email: "bot@example.com",
      message: "Buy things from this automated message.",
    });
    await page.evaluate(() => {
      const hp = document.querySelector<HTMLInputElement>('input[name="website"]');
      if (hp) hp.value = "http://spam.example";
    });
    await backdateRender(page);
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Message sent", { timeout: 10_000 });
  });

  test("submitting faster than three seconds is silently accepted without sending", async ({
    page,
  }) => {
    await page.goto("/contact");
    await fillForm(page, {
      name: "Fast Bot",
      email: "fast@example.com",
      message: "Submitted immediately by a script.",
    });
    await page.getByRole("button", { name: "Send message" }).click();
    await expect(page.getByRole("status")).toContainText("Message sent", { timeout: 10_000 });
  });
});
