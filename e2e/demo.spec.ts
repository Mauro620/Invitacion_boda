import { createRequire } from "node:module";
import { expect, test, type Page } from "@playwright/test";
import { wedding } from "../src/content/wedding";

// Database-free: /i/demo uses a mocked RSVP submit. Runs on the iPhone 13 and Pixel 7 projects.

const nodeRequire = createRequire(__filename);
let axePath: string | null = null;
try {
  axePath = nodeRequire.resolve("axe-core/axe.min.js");
} catch {
  axePath = null;
}

async function open(page: Page) {
  await page.goto("/i/demo");
  await page.getByRole("button", { name: /sello/i }).click();
  await expect(page.locator("#rsvp")).toBeAttached();
}

test("demo is noindex, Spanish and has no horizontal overflow", async ({ page }) => {
  await page.goto("/i/demo");
  await expect(page.locator("html")).toHaveAttribute("lang", /^es/);
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(0);
});

test("music does not start before the tap", async ({ page }) => {
  await page.addInitScript(() => {
    (window as unknown as { __plays: number }).__plays = 0;
    HTMLMediaElement.prototype.play = function () {
      (window as unknown as { __plays: number }).__plays += 1;
      return Promise.resolve();
    };
  });
  await page.goto("/i/demo");
  await page.waitForTimeout(500);
  expect(await page.evaluate(() => (window as unknown as { __plays: number }).__plays)).toBe(0);
});

test("envelope -> scroll -> RSVP -> closing", async ({ page }) => {
  await open(page);
  const rsvp = page.locator("#rsvp");
  await rsvp.scrollIntoViewIfNeeded();

  // Every guest must answer: a missing answer shows the error and saves nothing.
  await rsvp.getByRole("button", { name: wedding.rsvp.submit }).click();
  await expect(rsvp.getByRole("alert")).not.toBeEmpty();

  const groups = rsvp.getByRole("radiogroup");
  const n = await groups.count();
  expect(n).toBe(3);
  for (let i = 0; i < n; i++) {
    await groups.nth(i).getByRole("radio", { name: wedding.rsvp.attending }).click();
  }
  await rsvp.getByRole("button", { name: wedding.rsvp.submit }).click();
  await expect(rsvp.locator("p", { hasText: wedding.rsvp.success })).toBeVisible();
  await expect(rsvp.getByRole("button", { name: wedding.rsvp.edit })).toBeVisible();

  await page.getByRole("heading", { name: wedding.closing.attending.title }).scrollIntoViewIfNeeded();
  await expect(page.getByRole("heading", { name: wedding.closing.attending.title })).toBeVisible();
});

test("interactive targets are at least 44px", async ({ page }) => {
  await open(page);
  await page.locator("#rsvp").scrollIntoViewIfNeeded();
  const small = await page.evaluate(() => {
    const out: string[] = [];
    const sel = "button, a[href], input:not([type=hidden]), textarea, [role=radio]";
    for (const el of document.querySelectorAll<HTMLElement>(sel)) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) continue;
      // Inline links inside running text are exempt (WCAG 2.5.8 inline exception).
      if (el.tagName === "A" && getComputedStyle(el).display === "inline") continue;
      if (r.width < 44 || r.height < 44) {
        out.push(`${el.tagName} ${(el.textContent ?? "").trim().slice(0, 30)} ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
    }
    return out;
  });
  expect(small).toEqual([]);
});

test("axe: no serious violations before and after opening", async ({ page }) => {
  test.skip(!axePath, "axe-core not installed");
  const run = async () => {
    await page.addScriptTag({ path: axePath! });
    return page.evaluate(async () => {
      const r = await (window as unknown as { axe: { run: () => Promise<{ violations: { id: string; impact: string }[] }> } }).axe.run();
      return r.violations.filter((v) => v.impact === "serious" || v.impact === "critical").map((v) => v.id);
    });
  };
  await page.goto("/i/demo");
  expect(await run()).toEqual([]);
  await page.getByRole("button", { name: /sello/i }).click();
  await page.locator("#rsvp").scrollIntoViewIfNeeded();
  expect(await run()).toEqual([]);
});

test("admin and login are noindex; admin redirects to login without a session", async ({ request }) => {
  const login = await request.get("/admin/login");
  expect(login.headers()["x-robots-tag"]).toMatch(/noindex/);
  const admin = await request.get("/admin", { maxRedirects: 0 });
  expect(admin.status()).toBe(307);
  expect(admin.headers()["location"]).toContain("/admin/login");
  const demo = await request.get("/i/demo");
  expect(demo.headers()["x-robots-tag"]).toMatch(/noindex/);
});
