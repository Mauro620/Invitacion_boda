import { describe, expect, it } from "vitest";
import { createRateLimiter, rateKey } from "./rate-limit";

describe("rate limiter", () => {
  it("blocks after limit and resets after window", () => {
    let t = 0;
    const rl = createRateLimiter(2, 1000, () => t);
    const k = rateKey("1.1.1.1", "tok");
    expect(rl.check(k)).toBe(true);
    expect(rl.check(k)).toBe(true);
    expect(rl.check(k)).toBe(false);
    expect(rl.check(rateKey("2.2.2.2", "tok"))).toBe(true);
    t = 1001;
    expect(rl.check(k)).toBe(true);
  });
});
