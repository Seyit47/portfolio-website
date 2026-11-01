import { defineConfig, devices } from "@playwright/test";

const PORT = Number(process.env.PW_PORT ?? 3100);
const baseURL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  timeout: 30_000,
  expect: {
    timeout: 5_000,
    toHaveScreenshot: { maxDiffPixelRatio: 0.01, animations: "disabled" },
  },
  use: {
    baseURL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "mobile",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 360, height: 740 },
        channel: process.env.CI ? undefined : "chrome",
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
        channel: process.env.CI ? undefined : "chrome",
      },
    },
  ],
  // Set PW_EXTERNAL_SERVER=1 to test against a server you started yourself on PW_PORT.
  webServer: process.env.PW_EXTERNAL_SERVER
    ? undefined
    : {
        command: process.env.PW_SKIP_BUILD
          ? `pnpm start -p ${PORT}`
          : `pnpm build && pnpm start -p ${PORT}`,
        url: baseURL,
        reuseExistingServer: false,
        timeout: 300_000,
        env: {
          SITE_URL: baseURL,
          CONTACT_IP_SALT: "test-salt",
        },
      },
});
