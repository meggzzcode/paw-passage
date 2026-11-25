// Best-effort per-IP fixed-window limiter, held in memory. A function instance keeps its own counters, so this slows
// down guessing and abuse but is not a global guarantee (documented in docs/ARCHITECTURE.md).
export function createRateLimiter(opts: { windowMs: number; max: number; now?: () => number }) {
  const hits = new Map<string, { start: number; n: number }>();
  const now = opts.now ?? Date.now;
  return {
    /** Returns true when the request is allowed. */
    allow(key: string): boolean {
      const t = now();
      if (hits.size > 5000)
        for (const [k, v] of hits) if (t - v.start > opts.windowMs) hits.delete(k);
      const e = hits.get(key);
      if (!e || t - e.start > opts.windowMs) {
        hits.set(key, { start: t, n: 1 });
        return true;
      }
      e.n++;
      return e.n <= opts.max;
    },
  };
}
export type RateLimiter = ReturnType<typeof createRateLimiter>;
