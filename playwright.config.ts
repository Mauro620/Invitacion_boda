import { defineConfig } from "@playwright/test";

const port = process.env.E2E_PORT ?? "3100";

// Needs DATABASE_URL (migrated + seeded) and a prior `npm run build`.
export default defineConfig({
  testDir: "e2e",
  workers: 1,
  use: {
    baseURL: process.env.E2E_BASE_URL ?? `http://localhost:${port}`,
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    reducedMotion: "reduce",
  },
  webServer: process.env.E2E_BASE_URL
    ? undefined
    : {
        command: `npm run start -- -p ${port}`,
        url: `http://localhost:${port}/api/health`,
        reuseExistingServer: true,
        timeout: 60_000,
      },
});
