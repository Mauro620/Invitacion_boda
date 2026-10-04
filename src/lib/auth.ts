import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { createRateLimiter } from "./rate-limit";
import { getSession } from "./session";

export type AdminUser = { email: string; hash: string };

/** Parses `email:bcryptHash,email:bcryptHash`. Malformed entries are skipped. */
export function parseAdminUsers(raw: string | undefined): AdminUser[] {
  if (!raw) return [];
  return raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .flatMap((entry) => {
      const i = entry.indexOf(":");
      if (i < 1) return [];
      const email = entry.slice(0, i).trim().toLowerCase();
      const hash = entry.slice(i + 1).trim();
      return email && hash.startsWith("$2") ? [{ email, hash }] : [];
    });
}

// Valid-shaped hash of a random string: unknown emails cost the same bcrypt work.
const DUMMY_HASH = "$2b$12$FETHnd4/F2rM8LSz5qHCAuLARlpX3owLLNUmeE7tCIFiDckBSKIiG";

/** Returns the normalized email on success, null otherwise. Always runs one bcrypt compare. */
export async function verifyAdmin(email: string, password: string): Promise<string | null> {
  const normalized = email.trim().toLowerCase();
  const user = parseAdminUsers(process.env.ADMIN_USERS).find((u) => u.email === normalized);
  let ok = false;
  try {
    ok = await bcrypt.compare(password, user?.hash ?? DUMMY_HASH);
  } catch {
    ok = false;
  }
  return user && ok ? user.email : null;
}

/** 5 attempts / 15 min per IP. */
export const loginLimiter = createRateLimiter(5, 15 * 60 * 1000);

/** Redirects to the login page when there is no valid admin session. */
export async function requireAdmin(): Promise<string> {
  const session = await getSession();
  const email = session.email;
  if (!email || !parseAdminUsers(process.env.ADMIN_USERS).some((u) => u.email === email)) {
    redirect("/admin/login");
  }
  return email;
}
