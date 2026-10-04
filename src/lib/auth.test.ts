import bcrypt from "bcryptjs";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));
vi.mock("./session", () => ({ getSession: vi.fn() }));

import { parseAdminUsers, verifyAdmin } from "./auth";

const hash = bcrypt.hashSync("secreto-largo", 4);

afterEach(() => vi.unstubAllEnvs());

describe("parseAdminUsers", () => {
  it("parses, lowercases and skips junk", () => {
    const users = parseAdminUsers(`A@x.co:${hash}, bad ,:nohash,b@x.co:plain`);
    expect(users).toEqual([{ email: "a@x.co", hash }]);
  });
  it("handles undefined", () => {
    expect(parseAdminUsers(undefined)).toEqual([]);
  });
});

describe("verifyAdmin", () => {
  it("accepts correct credentials", async () => {
    vi.stubEnv("ADMIN_USERS", `a@x.co:${hash}`);
    expect(await verifyAdmin(" A@x.co ", "secreto-largo")).toBe("a@x.co");
  });
  it("rejects wrong password and unknown email", async () => {
    vi.stubEnv("ADMIN_USERS", `a@x.co:${hash}`);
    expect(await verifyAdmin("a@x.co", "nope")).toBeNull();
    expect(await verifyAdmin("z@x.co", "secreto-largo")).toBeNull();
  });
  it("rejects everything when no users configured", async () => {
    vi.stubEnv("ADMIN_USERS", "");
    expect(await verifyAdmin("a@x.co", "secreto-largo")).toBeNull();
  });
});
