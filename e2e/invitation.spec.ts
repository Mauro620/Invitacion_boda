import { expect, test } from "@playwright/test";
import { Pool } from "pg";

// Seed invitation with a single guest and no answer yet.
const DISPLAY_NAME = "Juan Carlos López";
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

let token = "";

test.beforeAll(async () => {
  const { rows } = await pool.query("select id, token from invitations where display_name = $1", [
    DISPLAY_NAME,
  ]);
  if (!rows[0]) throw new Error("Seed data missing: run npm run db:seed");
  token = rows[0].token;
  // Reset to the unanswered state so the test is repeatable.
  await pool.query(
    "update guests set attending = null, dietary_notes = null where invitation_id = $1",
    [rows[0].id],
  );
  await pool.query(
    "update invitations set responded_at = null, note_to_couple = null, open_count = 0 where id = $1",
    [rows[0].id],
  );
});

test.afterAll(() => pool.end());

async function openEnvelope(page: import("@playwright/test").Page) {
  await page.getByRole("button", { name: /sello/i }).click();
}

test("unknown or malformed tokens give a plain 404", async ({ page }) => {
  for (const bad of ["zzzzzzzzzzz", "x", "..%2F..%2Fetc"]) {
    const res = await page.goto(`/i/${bad}`);
    expect(res?.status()).toBe(404);
  }
});

test("open, confirm and see the saved answer", async ({ page }) => {
  const res = await page.goto(`/i/${token}`);
  expect(res?.status()).toBe(200);
  await expect(page).toHaveTitle(new RegExp(DISPLAY_NAME));
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);

  await openEnvelope(page);
  const rsvp = page.locator("#rsvp");
  await rsvp.scrollIntoViewIfNeeded();

  await rsvp.getByRole("radio", { name: "Asistiré" }).click();
  await rsvp.getByRole("button", { name: "Enviar mi respuesta" }).click();
  await expect(rsvp.locator("p", { hasText: "Gracias, recibimos tu respuesta." })).toBeVisible();

  // Persisted: a fresh load shows the saved answer and allows editing.
  await page.reload();
  await openEnvelope(page);
  const again = page.locator("#rsvp");
  await again.scrollIntoViewIfNeeded();
  await expect(again.locator("p", { hasText: "Gracias, recibimos tu respuesta." })).toBeVisible();
  await expect(again.getByText("Asistiré")).toBeVisible();
  await expect(again.getByRole("button", { name: "Cambiar mi respuesta" })).toBeVisible();

  const { rows } = await pool.query(
    "select attending from guests g join invitations i on i.id = g.invitation_id where i.token = $1",
    [token],
  );
  expect(rows[0].attending).toBe(true);
});

test("personalized og image renders", async ({ request }) => {
  const res = await request.get(`/i/${token}/opengraph-image`);
  expect(res.status()).toBe(200);
  expect(res.headers()["content-type"]).toContain("image/png");
});
