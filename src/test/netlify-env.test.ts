import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { createApi } from "@/server/passport/api";
import { MemoryKV } from "@/server/passport/kv";
import { createRateLimiter } from "@/server/passport/limits";
import { selectProvider } from "@/server/passport/provider";
import { customersStoreName, premiumStoreName } from "@/server/passport/config";

// Preview/production separation and environment variable inventory (docs/OPERATIONS.md, docs/NETLIFY-PREVIEW.md).
const ORIGIN = "https://example.test";
const env = {
  SESSION_SECRET: "s".repeat(48),
  PP_DATA_KEY: "k".repeat(48),
  PP_ALLOW_TEST_PROVIDER: "1",
};

async function activate(ctx: string | undefined) {
  const api = createApi({
    customers: new MemoryKV(),
    premium: new MemoryKV(),
    provider: selectProvider(env, ctx),
    secret: env.SESSION_SECRET,
    dataKey: env.PP_DATA_KEY,
    ip: "1.2.3.4",
    accessLimiter: createRateLimiter({ windowMs: 60_000, max: 50 }),
    generalLimiter: createRateLimiter({ windowMs: 60_000, max: 50 }),
  });
  return api.handle(
    new Request(`${ORIGIN}/api/access/activate`, {
      method: "POST",
      headers: { "content-type": "application/json", origin: ORIGIN },
      body: JSON.stringify({ code: "TEST-VALID-ABC12345" }),
    }),
  );
}

describe("the test provider is disabled in production, end to end", () => {
  it("with PP_ALLOW_TEST_PROVIDER=1 set by mistake, a test code never unlocks in production or an unknown context", async () => {
    for (const ctx of ["production", undefined, "", "staging"]) {
      const r = await activate(ctx);
      expect(r.status, String(ctx)).toBe(503);
      const body = await r.text();
      expect(body).not.toContain('"entitled":true');
      expect(body).toContain("provider_unavailable");
    }
  });
  it("the same code unlocks only in dev, deploy-preview and branch-deploy contexts", async () => {
    for (const ctx of ["dev", "deploy-preview", "branch-deploy"])
      expect((await activate(ctx)).status, ctx).toBe(200);
  });
  it("the flag is exactly '1' (not 'true' or 'yes')", async () => {
    for (const v of ["true", "yes", "0", ""])
      expect(selectProvider({ PP_ALLOW_TEST_PROVIDER: v }, "deploy-preview").name).not.toBe("test");
  });
});

describe("preview and production stores are separate", () => {
  it("only the production context touches the production stores; every other context uses the preview stores", () => {
    expect(premiumStoreName("production")).toBe("premium-production");
    expect(customersStoreName("production")).toBe("customers-production");
    for (const c of ["deploy-preview", "branch-deploy", "dev", undefined, "", "anything"]) {
      expect(premiumStoreName(c)).toBe("premium-preview");
      expect(customersStoreName(c)).toBe("customers-preview");
    }
  });
});

describe("every environment variable read by server code is documented", () => {
  const walk = (d: string): string[] =>
    readdirSync(d).flatMap((n) => {
      const p = `${d}/${n}`;
      return statSync(p).isDirectory() ? walk(p) : /\.ts$/.test(n) ? [p] : [];
    });
  const files = [...walk("src/server"), ...walk("netlify")];
  const used = new Set<string>();
  for (const f of files) {
    const t = readFileSync(f, "utf8");
    for (const m of t.matchAll(/\benv\.([A-Z][A-Z0-9_]+)/g)) used.add(m[1]!);
    for (const m of t.matchAll(/process\.env\["([A-Z0-9_]+)"\]/g)) used.add(m[1]!);
  }
  const docs = ["docs/OPERATIONS.md", "docs/NOTIFICATIONS.md", "docs/NETLIFY-PREVIEW.md"]
    .map((f) => readFileSync(f, "utf8"))
    .join("\n");
  it("finds the expected set (update the docs when this list changes)", () => {
    expect([...used].sort()).toEqual(
      [
        "CONTEXT",
        "GUMROAD_PRODUCT_ID",
        "NOTIFICATIONS_ENABLED",
        "PP_ALLOW_TEST_PROVIDER",
        "PP_DATA_KEY",
        "SESSION_SECRET",
        "VAPID_PRIVATE_KEY",
        "VAPID_PUBLIC_KEY",
        "VAPID_SUBJECT",
      ].sort(),
    );
  });
  it("each one appears in the operations or notifications docs", () => {
    for (const n of used) expect(docs, n).toContain(n);
  });
});

describe("preview defaults (no environment variables needed on a preview)", () => {
  it("fills throwaway secrets and the test provider on branch deploys and deploy previews only", async () => {
    const { withPreviewDefaults } = await import("@/server/passport/config");
    for (const ctx of ["branch-deploy", "deploy-preview"]) {
      const e = withPreviewDefaults({}, ctx);
      expect((e.SESSION_SECRET ?? "").length).toBeGreaterThanOrEqual(32);
      expect((e.PP_DATA_KEY ?? "").length).toBeGreaterThanOrEqual(32);
      expect(e.SESSION_SECRET).not.toBe(e.PP_DATA_KEY);
      expect(e.PP_ALLOW_TEST_PROVIDER).toBe("1");
      expect(selectProvider(e, ctx).name).not.toBe("unconfigured");
    }
  });
  it("never changes production, dev or an unknown context", async () => {
    const { withPreviewDefaults } = await import("@/server/passport/config");
    for (const ctx of ["production", "dev", undefined, "something-else"]) {
      const e = withPreviewDefaults({}, ctx);
      expect(e.SESSION_SECRET).toBeUndefined();
      expect(e.PP_DATA_KEY).toBeUndefined();
      expect(e.PP_ALLOW_TEST_PROVIDER).toBeUndefined();
    }
  });
  it("keeps values the owner did set", async () => {
    const { withPreviewDefaults } = await import("@/server/passport/config");
    const e = withPreviewDefaults(
      { SESSION_SECRET: "x".repeat(40), PP_ALLOW_TEST_PROVIDER: "0" },
      "branch-deploy",
    );
    expect(e.SESSION_SECRET).toBe("x".repeat(40));
    expect(e.PP_ALLOW_TEST_PROVIDER).toBe("0");
  });
});
