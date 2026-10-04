import { defineConfig, devices } from "@playwright/test";

const port = process.env.E2E_PORT ?? "3100";

// Mobile viewports from the QA brief. Run on Chromium (the only browser the project installs);
// the device descriptors give the exact viewport, DPR, touch and UA of each phone.
const { defaultBrowserType: _ios, ...iPhone13 } = devices["iPhone 13"];
const { defaultBrowserType: _android, ...pixel7 } = devices["Pixel 7"];
void _ios;
void _android;

// Needs a prior `npm run build`. The token e2e also needs DATABASE_URL (migrated + seeded);
// demo.spec.ts needs no database.
export default defineConfig({
  testDir: "e2e",
  workers: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${port}`,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  },
  projects: [
    { name: "iphone-13", use: { ...iPhone13, browserName: "chromium", reducedMotion: "reduce" } },
    { name: "pixel-7", use: { ...pixel7, browserName: "chromium", reducedMotion: "reduce" } },
  ],
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${port}`,
        url: `http://localhost:${port}/api/health`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
