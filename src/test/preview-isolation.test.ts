import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// Preview isolation, through the REAL Netlify handler (handleNetlify) with an in-memory fake of @netlify/blobs that records
// which stores are opened. Complements netlify-env.test.ts (provider/store-name unit rules). See docs/SECURITY-REVIEW.md.
const opened = vi.hoisted(() => [] as string[]);
vi.mock("@netlify/blobs", () => ({
  getStore: ({ name }: { name: string }) => {
    opened.push(name);
    return {
      getWithMetadata: async () => null,
      setJSON: async () => ({ modified: true, etag: "e" }),
      delete: async () => undefined,
    };
  },
}));

import { handleNetlify } from "@/server/passport/netlify";

const ORIGIN = "https://example.test";
const SAVED = { ...process.env };
const call = (path: string, ctx: string | undefined, init: RequestInit = {}) =>
  handleNetlify(new Request(`${ORIGIN}${path}`, init), {
    deploy: ctx === undefined ? {} : { context: ctx },
  });
const activate = (ctx: string | undefined) =>
  call("/api/access/activate", ctx, {
    method: "POST",
    headers: { "content-type": "application/json", origin: ORIGIN },
    body: JSON.stringify({ code: "TEST-VALID-ABC12345" }),
  });

beforeEach(() => {
  opened.length = 0;
  for (const k of ["SESSION_SECRET", "PP_DATA_KEY", "GUMROAD_PRODUCT_ID", "PP_ALLOW_TEST_PROVIDER"])
    delete process.env[k];
});
afterEach(() => {
  process.env = { ...SAVED };
});

describe("preview isolation through the real handler", () => {
  it("branch deploys and deploy previews open only preview stores; production opens only production stores", async () => {
    for (const ctx of ["branch-deploy", "deploy-preview", "dev", undefined, "staging"]) {
      opened.length = 0;
      await call("/api/session", ctx);
      expect(opened.length, String(ctx)).toBeGreaterThan(0);
      for (const n of opened) expect(n, String(ctx)).toMatch(/-preview$/);
    }
    opened.length = 0;
    await call("/api/session", "production");
    for (const n of opened) expect(n).toMatch(/-production$/);
  });

  it("a preview works with no environment variables (throwaway defaults), and its test code activates", async () => {
    for (const ctx of ["branch-deploy", "deploy-preview"])
      expect((await activate(ctx)).status, ctx).toBe(200);
  });

  it("production with no secrets fails safely: a safe error, never a grant, never the preview defaults", async () => {
    const r = await activate("production");
    expect(r.status).toBe(503);
    const body = await r.text();
    expect(body).not.toContain('"entitled":true');
    expect(body).not.toMatch(/preview-only|synthetic/);
    expect(r.headers.get("set-cookie") ?? "").not.toMatch(/pp_session=[^;]+/);
    const s = await call("/api/session", "production");
    expect(await s.text()).not.toContain('"entitled":true');
  });

  it("production with secrets but no GUMROAD_PRODUCT_ID, and PP_ALLOW_TEST_PROVIDER=1 by mistake, still grants nothing", async () => {
    process.env["SESSION_SECRET"] = "s".repeat(48);
    process.env["PP_DATA_KEY"] = "k".repeat(48);
    process.env["PP_ALLOW_TEST_PROVIDER"] = "1";
    for (const ctx of ["production", undefined, "staging"]) {
      const r = await activate(ctx);
      expect(r.status, String(ctx)).toBe(503);
      expect(await r.text()).not.toContain('"entitled":true');
    }
  });

  it("premium endpoints without a session return nothing in any context (a preview holds only its own premium store)", async () => {
    for (const ctx of ["branch-deploy", "deploy-preview", "production"]) {
      const r = await call("/api/premium/adventures", ctx);
      expect([401, 503], ctx).toContain(r.status);
      const t = await r.text();
      expect(t).not.toMatch(/instructions|reveal|twist/i);
    }
  });
});
