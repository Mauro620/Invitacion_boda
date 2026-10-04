type Bucket = { count: number; resetAt: number };

export type RateLimiter = {
  check: (key: string) => boolean;
  reset: () => void;
};

/** Fixed-window in-memory limiter. Single instance only (fine for one container). */
export function createRateLimiter(limit: number, windowMs: number, now = () => Date.now()): RateLimiter {
  const buckets = new Map<string, Bucket>();
  return {
    check(key) {
      const t = now();
      if (buckets.size > 5000) {
        for (const [k, b] of buckets) if (b.resetAt <= t) buckets.delete(k);
      }
      const b = buckets.get(key);
      if (!b || b.resetAt <= t) {
        buckets.set(key, { count: 1, resetAt: t + windowMs });
        return true;
      }
      if (b.count >= limit) return false;
      b.count += 1;
      return true;
    },
    reset: () => buckets.clear(),
  };
}

export const rsvpLimiter = createRateLimiter(10, 10 * 60 * 1000);

export const rateKey = (ip: string, token: string) => `${ip}|${token}`;
