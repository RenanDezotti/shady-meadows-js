const { defineConfig, devices } = require("@playwright/test");

const IS_CI = !!process.env.CI;

module.exports = defineConfig({
  // ── Test Discovery ────────────────────────────────────────────
  testDir: "./tests",

  // ── Execution ─────────────────────────────────────────────────
  // Site is live and shared — parallel runs risk data conflicts
  fullyParallel: false,
  workers: 1,
  retries: IS_CI ? 2 : 1,
  forbidOnly: IS_CI, // Prevent .only from silently skipping tests in CI

  // ── Reporters ─────────────────────────────────────────────────
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
    ["list"],
  ],

  // ── Shared Browser Config ──────────────────────────────────────
  use: {
    baseURL: "https://automationintesting.online",

    extraHTTPHeaders: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    actionTimeout: 15_000,
    navigationTimeout: 30_000,

    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "on-first-retry",
  },

  // ── Projects (Browsers) ────────────────────────────────────────
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
    },
  ],
});
