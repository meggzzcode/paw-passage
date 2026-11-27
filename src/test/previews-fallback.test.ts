// Synthetic preview catalogue: served ONLY in Netlify preview contexts, through the real allowlist path.
import { describe, expect, it } from "vitest";
import { createApi } from "../server/passport/api";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { TestProvider } from "../server/passport/provider";
import { FORBIDDEN_KEYS, PREVIEW_KEYS, assertPreviewShape } from "../server/passport/previews";
import {
  SYNTHETIC_HEADER,
  buildSyntheticPreviewIndex,
  syntheticPreviewsEnabled,
} from "../server/passport/synthetic-previews";
import { WORLDS } from "../passport/worlds";

const ORIGIN = "https://pawsandpassage.test";
const api = (ctx: string | undefined, kv = new MemoryKV()) =>
  createApi({
    customers: new MemoryKV(),
    premium: kv,
    provider: new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "dev"),
    secret: undefined,
    ip: "1.2.3.4",
    syntheticPreviews: syntheticPreviewsEnabled(ctx),
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
  });
const get = (a: ReturnType<typeof api>) => a.handle(new Request(`${ORIGIN}/api/previews`));
const match = (a: ReturnType<typeof api>) =>
  a.handle(
    new Request(`${ORIGIN}/api/previews/match`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: ORIGIN },
      body: JSON.stringify({ dog: { lifeStage: "adult" }, owner: {} }),
    }),
  );

describe("synthetic previews are gated by context", () => {
  it("is on for branch-deploy and deploy-preview only", () => {
    expect(syntheticPreviewsEnabled("branch-deploy")).toBe(true);
    expect(syntheticPreviewsEnabled("deploy-preview")).toBe(true);
    for (const c of ["production", "dev", "", "staging", "Production", undefined])
      expect(syntheticPreviewsEnabled(c)).toBe(false);
  });

  it("production and unknown contexts with no index return the empty JSON and no marker", async () => {
    for (const ctx of ["production", "dev", "something-else", undefined]) {
      const res = await get(api(ctx));
      expect(res.status).toBe(200);
      expect(res.headers.get(SYNTHETIC_HEADER)).toBeNull();
      expect(await res.json()).toEqual({ items: [], total: 0, collections: 0 });
      const m = await match(api(ctx));
      expect(m.headers.get(SYNTHETIC_HEADER)).toBeNull();
      expect(await m.json()).toMatchObject({ matching: 0, total: 0, previews: [] });
    }
  });

  it("a preview context with no index serves the marked synthetic catalogue", async () => {
    const res = await get(api("deploy-preview"));
    expect(res.status).toBe(200);
    expect(res.headers.get(SYNTHETIC_HEADER)).toBe("1");
    const b = (await res.json()) as {
      items: Record<string, unknown>[];
      total: number;
      collections: number;
    };
    expect(Object.keys(b).sort()).toEqual(["collections", "items", "total"]);
    expect(b.items.length).toBeGreaterThanOrEqual(12);
    expect(b.items.length).toBeLessThanOrEqual(20);
    // no library size is advertised from a sample catalogue
    expect(b.total).toBe(0);
    expect(b.collections).toBe(0);
    // every world has rows
    for (const w of WORLDS)
      expect(
        b.items.some((i) => (i["collections"] as string[]).some((c) => w.slugs.includes(c))),
      ).toBe(true);
  });

  it("carries only allowlisted fields and nothing that explains an adventure", async () => {
    const b = (await (await get(api("branch-deploy"))).json()) as {
      items: Record<string, unknown>[];
    };
    for (const i of b.items) {
      expect(Object.keys(i).every((k) => (PREVIEW_KEYS as readonly string[]).includes(k))).toBe(
        true,
      );
      assertPreviewShape(i);
    }
    const text = JSON.stringify(b);
    for (const k of FORBIDDEN_KEYS) expect(text).not.toContain(`"${k}"`);
    for (const i of b.items) expect(String(i["title"])).toMatch(/^Sample/);
  });

  it("match is consistent with the synthetic catalogue", async () => {
    const m = (await (await match(api("deploy-preview"))).json()) as {
      matching: number;
      total: number;
      previews: string[];
    };
    const ids = new Set(buildSyntheticPreviewIndex().items.map((i) => i.id));
    expect(m.total).toBe(0);
    expect(m.matching).toBeGreaterThan(0);
    expect(m.previews.every((id) => ids.has(id))).toBe(true);
  });

  it("a stored index always wins over the synthetic one", async () => {
    const kv = new MemoryKV();
    await kv.put("previews/index", { v: 1, items: [], total: 5, collections: 2, pool: [] });
    const res = await get(api("deploy-preview", kv));
    expect(res.headers.get(SYNTHETIC_HEADER)).toBeNull();
    expect(await res.json()).toEqual({ items: [], total: 5, collections: 2 });
  });
});
