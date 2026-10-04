import { describe, expect, it } from "vitest";
import { generateToken, isValidTokenShape } from "./tokens";

describe("tokens", () => {
  it("generates valid unique tokens", () => {
    const set = new Set(Array.from({ length: 500 }, generateToken));
    expect(set.size).toBe(500);
    for (const t of set) expect(isValidTokenShape(t)).toBe(true);
  });
  it("rejects bad shapes", () => {
    expect(isValidTokenShape("short")).toBe(false);
    expect(isValidTokenShape("../../etc/passwd")).toBe(false);
    expect(isValidTokenShape(5)).toBe(false);
  });
});
