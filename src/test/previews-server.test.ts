// Public previews: allowlist projection, endpoints, matching, import refusal, leak guards. Synthetic data only.
import { execFileSync } from "node:child_process";
import {
  mkdirSync,
  mkdtempSync,
  readdirSync,
  readFileSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, sep } from "node:path";
import { describe, expect, it } from "vitest";
import { syntheticPremium } from "../passport/fixtures/premium.synthetic";
import {
  adventureSchema,
  PUBLISH_MIN_ORIGINALITY_NON_SIGNATURE,
  type Adventure,
} from "../passport/schema";
import { freeLibrary } from "../passport/content";
import { createApi, type ApiDeps } from "../server/passport/api";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { TestProvider } from "../server/passport/provider";
import {
  assertPreviewShape,
  buildPreviewIndex,
  FORBIDDEN_KEYS,
  PREVIEW_INDEX_KEY,
  PREVIEW_KEYS,
  projectPreview,
  teaserProblem,
} from "../server/passport/previews";

const ORIGIN = "https://pawsandpassage.test";
const TEASER = "A small mystery for a curious nose.";

const card = (over: Partial<Adventure> & { id: string }): Adventure => ({
  ...syntheticPremium[0]!,
  ...over,
});
const show = (id: string, over: Partial<Adventure> = {}) =>
  card({ id, showcase: true, teaser: TEASER, previewTitle: `Mystery ${id}`, ...over });

function harness(premium = new MemoryKV(), over: Partial<ApiDeps> = {}) {
  const api = createApi({
    customers: new MemoryKV(),
    premium,
    provider: new TestProvider({ PP_ALLOW_TEST_PROVIDER: "1" }, "dev"),
    secret: undefined,
    ip: "1.2.3.4",
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1000 }),
    ...over,
  });
  return {
    premium,
    async call(
      method: string,
      path: string,
      body?: unknown,
      raw?: string,
      origin: string | null = ORIGIN,
    ) {
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (origin) headers["origin"] = origin;
      const init: RequestInit = { method, headers };
      if (raw !== undefined) init.body = raw;
      else if (body !== undefined) init.body = JSON.stringify(body);
      const res = await api.handle(new Request(`${ORIGIN}${path}`, init));
      const text = await res.text();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return { res, status: res.status, text, json: (text ? JSON.parse(text) : {}) as any };
    },
  };
}

async function seeded() {
  const free = freeLibrary();
  const premium = [
    show("adv-pre001"),
    show("adv-pre002", { lifeStages: ["puppy"] }),
    card({ id: "adv-pre003" }), // premium, not showcase
    show("adv-pre004", { food: true, activityTypes: ["food-and-treats"] }), // needs the food answer
    show("adv-pre005", { status: "draft" }),
  ];
  const kv = new MemoryKV();
  await kv.put(PREVIEW_INDEX_KEY, buildPreviewIndex(premium, free));
  return { kv, free, premium };
}

describe("allowlist projection", () => {
  it("emits exactly the allowlisted keys and never a forbidden one", () => {
    const p = projectPreview(show("adv-pre001"))!;
    expect(Object.keys(p).sort()).toEqual([...PREVIEW_KEYS].sort());
    expect(Object.keys(p.needs).sort()).toEqual(["booking", "car", "food", "water"]);
    expect(Object.keys(p.keepsake).sort()).toEqual(["family", "theme"]);
    const json = JSON.stringify(p);
    for (const k of FORBIDDEN_KEYS) expect(json).not.toContain(`"${k}"`);
    expect(() => assertPreviewShape(p)).not.toThrow();
  });
  it("fails the shape check if any extra field appears", () => {
    const p = { ...projectPreview(show("adv-pre001"))!, instructions: ["x"] };
    expect(() => assertPreviewShape(p)).toThrow(/not allowed/);
    const q = projectPreview(show("adv-pre001"))!;
    expect(() => assertPreviewShape({ ...q, needs: { ...q.needs, secret: true } })).toThrow();
  });
  it("carries no premium text and no marker from the source card", () => {
    const a = show("adv-pre001");
    const json = JSON.stringify(projectPreview(a));
    for (const t of [
      a.clue,
      a.reveal,
      a.twist,
      a.objective,
      a.completion,
      ...a.instructions,
      ...a.safety,
    ])
      expect(json).not.toContain(t);
    expect(json).not.toContain(a.title);
  });
  it("uses previewTitle when present, the title otherwise", () => {
    expect(projectPreview(show("adv-pre001"))!.title).toBe("Mystery adv-pre001");
    expect(projectPreview(card({ id: "adv-pre009", teaser: TEASER }))!.title).toBe(a0().title);
  });
  it("does not project unpublished cards or cards without a valid teaser", () => {
    expect(projectPreview(show("adv-pre005", { status: "draft" }))).toBeNull();
    expect(projectPreview(card({ id: "adv-pre006" }))).toBeNull();
    expect(
      projectPreview(card({ id: "adv-pre007", teaser: "First, hide the treat. Then you wait." })),
    ).toBeNull();
  });
  it("teaser check rejects mechanics and over-long text", () => {
    expect(teaserProblem(TEASER)).toBeNull();
    expect(teaserProblem("")).not.toBeNull();
    expect(teaserProblem("Step 1 is easy")).not.toBeNull();
    expect(teaserProblem("x".repeat(111))).not.toBeNull();
  });
  it("buildPreviewIndex refuses a showcase card without a teaser", () => {
    expect(() => buildPreviewIndex([card({ id: "adv-pre008", showcase: true })], [])).toThrow(
      /adv-pre008/,
    );
    expect(() =>
      buildPreviewIndex([show("adv-pre008", { teaser: "Then you hide the treat." })], []),
    ).toThrow(/adv-pre008/);
  });
  it("premium previews come only from showcase cards", async () => {
    const { kv, free } = await seeded();
    const h = harness(kv);
    const r = await h.call("GET", "/api/previews");
    const premiumIds = r.json.items
      .filter((i: { access: string }) => i.access === "premium")
      .map((i: { id: string }) => i.id)
      .sort();
    expect(premiumIds).toEqual(["adv-pre001", "adv-pre002", "adv-pre004"]);
    expect(r.json.total).toBe(free.length + 4); // three showcase + one non-showcase, draft excluded
  });
});

function a0() {
  return syntheticPremium[0]!;
}

describe("GET /api/previews", () => {
  it("returns only allowed fields and is cacheable", async () => {
    const { kv } = await seeded();
    const r = await harness(kv).call("GET", "/api/previews");
    expect(r.status).toBe(200);
    expect(r.res.headers.get("cache-control")).toBe("public, max-age=300");
    expect(Object.keys(r.json).sort()).toEqual(["collections", "items", "total"]);
    expect(r.json.items.length).toBeGreaterThan(0);
    for (const it of r.json.items) assertPreviewShape(it);
    for (const k of FORBIDDEN_KEYS) expect(r.text).not.toContain(`"${k}"`);
    for (const a of syntheticPremium) {
      expect(r.text).not.toContain(a.reveal);
      expect(r.text).not.toContain(a.twist);
      expect(r.text).not.toContain(a.clue);
      expect(r.text).not.toContain("SYNTHETIC step");
    }
    expect(r.text).not.toContain("adv-pre003");
    expect(r.text).not.toContain('"pool"');
  });
  it("is empty and honest with no store", async () => {
    const r = await harness().call("GET", "/api/previews");
    expect(r.status).toBe(200);
    expect(r.json).toEqual({ items: [], total: 0, collections: 0 });
  });
  it("treats a malformed stored record as empty and an unreadable store as 503", async () => {
    const kv = new MemoryKV();
    await kv.put(PREVIEW_INDEX_KEY, { nonsense: true });
    expect((await harness(kv).call("GET", "/api/previews")).json.items).toEqual([]);
    const broken = new MemoryKV();
    broken.get = () => Promise.reject(new Error("down"));
    const r = await harness(broken).call("GET", "/api/previews");
    expect(r.status).toBe(503);
    expect(r.text).not.toContain("down");
  });
  it("needs no session secret, is rate limited, and is GET only", async () => {
    const h = harness(new MemoryKV(), {
      generalLimiter: createRateLimiter({ windowMs: 60_000, max: 1 }),
    });
    expect((await h.call("GET", "/api/previews")).status).toBe(200);
    expect((await h.call("GET", "/api/previews")).status).toBe(429);
    expect((await harness().call("POST", "/api/previews", {})).status).toBe(405);
  });
  it("reads the premium store of its own environment only", async () => {
    const { kv } = await seeded();
    const other = harness(new MemoryKV()); // e.g. the preview store while production holds the data
    expect((await other.call("GET", "/api/previews")).json.total).toBe(0);
    expect((await harness(kv).call("GET", "/api/previews")).json.total).toBeGreaterThan(0);
  });
});

describe("POST /api/previews/match", () => {
  const dog = { lifeStage: "adult", size: "medium", foodActivities: "yes" };
  it("counts hard-eligible cards over the full library and returns ids only", async () => {
    const { kv, free, premium } = await seeded();
    const r = await harness(kv).call("POST", "/api/previews/match", { dog, owner: {} });
    expect(r.status).toBe(200);
    expect(Object.keys(r.json).sort()).toEqual([
      "collections",
      "matching",
      "matchingNoSpend",
      "previews",
      "total",
    ]);
    expect(r.json.matchingNoSpend).toBeLessThanOrEqual(r.json.matching);
    expect(r.json.collections.length).toBeLessThanOrEqual(6);
    for (const c of r.json.collections) expect(c).toMatch(/^[a-z0-9-]+$/);
    expect(r.json.total).toBe(free.length + 4);
    // pre001, pre003 and pre004 suit an adult who does food; pre002 is puppy-only; pre005 is a draft.
    const premiumMatches = 3;
    const freeMatches = r.json.matching - premiumMatches;
    expect(freeMatches).toBeGreaterThanOrEqual(0);
    expect(freeMatches).toBeLessThanOrEqual(free.length);
    expect(r.json.previews).toContain("adv-pre001");
    expect(r.json.previews).toContain("adv-pre004");
    expect(r.json.previews).not.toContain("adv-pre002");
    expect(r.json.previews).not.toContain("adv-pre003"); // not a showcase preview, still counted in matching
    expect(r.text).not.toMatch(/title|teaser|Mystery|SYNTHETIC/);
    void premium;
  });
  it("narrows when the profile excludes cards", async () => {
    const { kv } = await seeded();
    const h = harness(kv);
    const adult = await h.call("POST", "/api/previews/match", {
      dog: { lifeStage: "adult" },
      owner: {},
    });
    const puppy = await h.call("POST", "/api/previews/match", {
      dog: { lifeStage: "puppy" },
      owner: {},
    });
    expect(puppy.json.previews).toContain("adv-pre002");
    expect(adult.json.previews).not.toContain("adv-pre002");
    const noFood = await h.call("POST", "/api/previews/match", {
      dog: { lifeStage: "adult", foodActivities: "no" },
      owner: {},
    });
    expect(noFood.json.previews).not.toContain("adv-pre004");
  });
  it("does not count held cards: an unknown profile only matches cards with nothing to confirm", async () => {
    const { kv } = await seeded();
    const h = harness(kv);
    const unknown = await h.call("POST", "/api/previews/match", { dog: {}, owner: {} });
    expect(unknown.status).toBe(200);
    expect(unknown.json.previews).toContain("adv-pre001");
    expect(unknown.json.previews).not.toContain("adv-pre004"); // food answer unknown => held => not counted
    const known = await h.call("POST", "/api/previews/match", {
      dog: { foodActivities: "yes" },
      owner: {},
    });
    expect(known.json.matching).toBeGreaterThan(unknown.json.matching);
  });
  it("ignores unknown fields and free text, and rejects bad values", async () => {
    const { kv } = await seeded();
    const h = harness(kv);
    const ok = await h.call("POST", "/api/previews/match", {
      dog: { lifeStage: "adult", name: "Rex", restrictions: "free text", evil: { a: 1 } },
      owner: { mobility: "seated", extra: 1 },
    });
    expect(ok.status).toBe(200);
    expect(ok.text).not.toContain("Rex");
    for (const body of [
      { dog: { lifeStage: "ancient" } },
      { dog: { limitedMobility: "yes" } },
      { dog: [] },
      { owner: {} },
      { dog: {}, owner: { hasCar: "maybe" } },
      [],
      "x",
    ])
      expect((await h.call("POST", "/api/previews/match", body)).status).toBe(400);
    expect((await h.call("POST", "/api/previews/match", undefined, "{not json")).status).toBe(400);
  });
  it("limits the body to 4 KB", async () => {
    const { kv } = await seeded();
    const big = JSON.stringify({ dog: { restrictions: "x".repeat(5000) }, owner: {} });
    const r = await harness(kv).call("POST", "/api/previews/match", undefined, big);
    expect(r.status).toBe(413);
  });
  it("needs a same-origin request, is not cacheable, and never logs the body", async () => {
    const { kv } = await seeded();
    const logs: unknown[] = [];
    const h = harness(kv, { log: (e, f) => logs.push([e, f]) });
    expect(
      (await h.call("POST", "/api/previews/match", { dog, owner: {} }, undefined, null)).status,
    ).toBe(403);
    const r = await h.call("POST", "/api/previews/match", {
      dog: { name: "SECRETNAME" },
      owner: {},
    });
    expect(r.res.headers.get("cache-control")).toBe("no-store");
    expect(JSON.stringify(logs)).not.toContain("SECRETNAME");
    expect((await h.call("GET", "/api/previews/match")).status).toBe(405);
  });
  it("answers zeros with an empty store", async () => {
    const r = await harness().call("POST", "/api/previews/match", { dog: {}, owner: {} });
    expect(r.json).toEqual({ matching: 0, total: 0, previews: [] });
  });
  it("the stored pool carries no card text", async () => {
    const { kv } = await seeded();
    const dump = kv.dump();
    expect(dump).not.toContain("SYNTHETIC reveal");
    expect(dump).not.toContain("SYNTHETIC step");
    expect(dump).not.toContain("SYNTHETIC safety");
    expect(dump).not.toContain("SYNTHETIC twist");
  });
});

describe("schema: role, teaser, previewTitle, showcase and the publication bar", () => {
  const rev = (o: Partial<NonNullable<Adventure["review"]>>) => ({
    ownerAppeal: 8,
    dogEnjoyment: 8,
    originality: 8,
    adventureFactor: 8,
    practicality: 8,
    memoryValue: 8,
    reviewedOn: "2026-11-26",
    ...o,
  });
  const ok = (over: Partial<Adventure>) => adventureSchema.safeParse({ ...a0(), ...over });
  it("defaults role to everyday and showcase to false", () => {
    const { role: _r, showcase: _s, ...rest } = a0();
    const r = adventureSchema.parse(rest);
    expect(r.role).toBe("everyday");
    expect(r.showcase).toBe(false);
  });
  it("validates role, teaser and previewTitle", () => {
    expect(ok({ role: "legendary" as never }).success).toBe(false);
    expect(ok({ teaser: "x".repeat(111) }).success).toBe(false);
    expect(ok({ previewTitle: "x".repeat(61) }).success).toBe(false);
    expect(ok({ teaser: TEASER, previewTitle: "A Quiet Mystery", role: "lifestyle" }).success).toBe(
      true,
    );
  });
  it("a showcase card needs a teaser, and the teaser must not explain how it works", () => {
    expect(ok({ showcase: true }).success).toBe(false);
    expect(ok({ showcase: true, teaser: TEASER }).success).toBe(true);
    expect(ok({ teaser: "Then you hide it." }).success).toBe(false);
  });
  it("publication bar: originality 5 for non-signature, 6 for signature", () => {
    expect(PUBLISH_MIN_ORIGINALITY_NON_SIGNATURE).toBe(5);
    expect(
      ok({ role: "everyday", review: rev({ originality: 5, ownerAppeal: 9, dogEnjoyment: 9 }) })
        .success,
    ).toBe(true);
    expect(
      ok({ role: "signature", review: rev({ originality: 5, ownerAppeal: 9, dogEnjoyment: 9 }) })
        .success,
    ).toBe(false);
    expect(
      ok({ role: "signature", review: rev({ originality: 6, ownerAppeal: 9, dogEnjoyment: 9 }) })
        .success,
    ).toBe(true);
    expect(
      ok({
        role: "aspirational",
        review: rev({ originality: 4, ownerAppeal: 10, dogEnjoyment: 10 }),
      }).success,
    ).toBe(false);
    expect(
      ok({ role: "lifestyle", review: rev({ practicality: 5, ownerAppeal: 10, dogEnjoyment: 10 }) })
        .success,
    ).toBe(false);
    expect(
      ok({ role: "everyday", review: rev({ originality: 5, ownerAppeal: 6, dogEnjoyment: 6 }) })
        .success,
    ).toBe(false); // average below 7.0
  });
});

const REPO = join(__dirname, "..", "..");
function* walk(d: string): Generator<string> {
  for (const n of readdirSync(d)) {
    if (n === "node_modules" || n === ".git") continue;
    const p = join(d, n);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (/\.(?:ts|tsx|js|mjs|json|ya?ml|md|html|css|svg|txt|xml)$/i.test(n)) yield p;
  }
}

describe("leak scans", () => {
  const markers = new Set<string>();
  for (const a of syntheticPremium) {
    for (const t of [
      a.clue,
      a.reveal,
      a.twist,
      a.objective,
      a.completion,
      a.memoryPrompt,
      ...a.instructions,
      ...a.safety,
    ])
      markers.add(t);
  }
  // content/premium/ is the owner-approved home of the real premium JSON (one file per adventure). It is never read by the site
  // build (see src/test/handover-premium-isolation.test.ts); the public bundle is protected by scripts/check-leaks.mjs on dist/.
  it("no premium text marker appears in src/, public/ or content/ (fixtures, tests and content/premium excluded)", () => {
    const hits: string[] = [];
    for (const top of ["src", "public", "content"])
      for (const f of walk(join(REPO, top))) {
        if (
          f.includes(join("src", "passport", "fixtures")) ||
          f.includes(join("src", "test")) ||
          f.includes(join("content", "premium") + sep)
        )
          continue;
        const text = readFileSync(f, "utf8");
        for (const m of markers) if (text.includes(m)) hits.push(`${f}: ${m}`);
      }
    expect(hits).toEqual([]);
  });
  it("content/ holds no premium card", () => {
    for (const f of walk(join(REPO, "content", "adventures"))) {
      expect(readFileSync(f, "utf8"), f).not.toMatch(/^access:\s*["']?premium/m);
    }
  });
  it("the synthetic fixture is imported by tests and scripts only", () => {
    const importers: string[] = [];
    for (const f of walk(join(REPO, "src")))
      if (/\.(?:ts|tsx)$/.test(f) && readFileSync(f, "utf8").includes("premium.synthetic"))
        importers.push(f);
    for (const f of importers)
      expect(f.includes(join("src", "test")) || f.includes("fixtures")).toBe(true);
  });
});

describe("scripts/check-leaks.mjs", () => {
  const run = (dir: string) => {
    try {
      execFileSync("node", [join(REPO, "scripts", "check-leaks.mjs"), dir], { stdio: "pipe" });
      return 0;
    } catch (e) {
      return (e as { status: number }).status;
    }
  };
  it("passes a clean dist and fails on fixture text or a premium instructions array", () => {
    const clean = mkdtempSync(join(tmpdir(), "leak-clean-"));
    mkdirSync(join(clean, "assets"));
    writeFileSync(
      join(clean, "assets", "a.js"),
      'const x={access:"free",instructions:["a","b","c"]};',
    );
    expect(run(clean)).toBe(0);
    const dirty = mkdtempSync(join(tmpdir(), "leak-dirty-"));
    writeFileSync(join(dirty, "a.js"), `const x="${syntheticPremium[0]!.reveal}";`);
    expect(run(dirty)).toBe(1);
    const dirty2 = mkdtempSync(join(tmpdir(), "leak-dirty2-"));
    writeFileSync(join(dirty2, "b.js"), 'const x={access:"premium",instructions:["a","b","c"]};');
    expect(run(dirty2)).toBe(1);
    expect(run(mkdtempSync(join(tmpdir(), "leak-empty-")))).toBe(2);
  });
});
