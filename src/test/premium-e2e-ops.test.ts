// Premium integration, operations side: the test provider is OFF in production, the protected content export produces a
// package the importer accepts, and scripts/preview-smoke.mjs works against a local stand-in and refuses production.
// Synthetic data only. See docs/PREMIUM-INTEGRATION-TESTS.md.
import { execFile } from "node:child_process";
import {
  copyFileSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, afterEach, describe, expect, it, vi } from "vitest";
import { createApi } from "../server/passport/api";
import { customersStoreName, premiumStoreName } from "../server/passport/config";
import { MemoryKV } from "../server/passport/kv";
import { createRateLimiter } from "../server/passport/limits";
import { selectProvider, TestProvider } from "../server/passport/provider";
import { KEY, ORIGIN, PREMIUM, SECRET, customerKeys, world } from "./premium-e2e-harness";

const REPO = process.cwd();
const made: string[] = [];
const tmp = () => {
  const d = mkdtempSync(join(tmpdir(), "premium-e2e-"));
  made.push(d);
  return d;
};
afterAll(() => made.forEach((d) => rmSync(d, { recursive: true, force: true })));
afterEach(() => vi.unstubAllGlobals());

const run = (args: string[], env: Record<string, string>) =>
  new Promise<{ code: number; out: string; err: string }>((resolve) => {
    execFile(
      "node",
      args,
      {
        env: {
          PATH: process.env["PATH"] ?? "",
          HOME: tmpdir(),
          NO_PROXY: "127.0.0.1,localhost",
          ...env,
        },
      },
      (e, out, err) => resolve({ code: e ? ((e as { code?: number }).code ?? 1) : 0, out, err }),
    );
  });

describe("premium e2e: production safety", () => {
  const FLAG = { PP_ALLOW_TEST_PROVIDER: "1" };

  it("the test provider is DISABLED in a production context, even with the flag set", () => {
    for (const ctx of ["production", undefined, "", "Production", "staging", "unknown"]) {
      expect(() => new TestProvider(FLAG, ctx)).toThrow();
      expect(selectProvider(FLAG, ctx).name).not.toBe("test");
    }
    // the only contexts where it may exist, and only with the flag
    for (const ctx of ["dev", "deploy-preview", "branch-deploy"])
      expect(selectProvider(FLAG, ctx).name).toBe("test");
    expect(selectProvider({}, "deploy-preview").name).toBe("unconfigured");
    expect(selectProvider({ PP_ALLOW_TEST_PROVIDER: "true" }, "deploy-preview").name).toBe(
      "unconfigured",
    );
  });

  it("in production a test key grants nothing: no GUMROAD_PRODUCT_ID is unavailable, a real provider refuses it", async () => {
    for (const env of [{ ...FLAG }, { ...FLAG, GUMROAD_PRODUCT_ID: "prod-id" }]) {
      const fetchSpy = vi.fn(
        async () => new Response(JSON.stringify({ success: false }), { status: 404 }),
      );
      vi.stubGlobal("fetch", fetchSpy);
      const customers = new MemoryKV();
      const api = createApi({
        customers,
        premium: new MemoryKV(),
        provider: selectProvider(env, "production"),
        secret: SECRET,
        ip: "5.5.5.5",
        accessLimiter: createRateLimiter({ windowMs: 60_000, max: 100 }),
        generalLimiter: createRateLimiter({ windowMs: 60_000, max: 100 }),
        log: () => undefined,
      });
      const res = await api.handle(
        new Request(`${ORIGIN}/api/access/activate`, {
          method: "POST",
          headers: { "content-type": "application/json", origin: ORIGIN },
          body: JSON.stringify({ code: KEY }),
        }),
      );
      expect([403, 503]).toContain(res.status);
      expect(res.headers.get("set-cookie")).toBeNull();
      expect(customers.keys()).toEqual([]);
    }
  });

  it("production and preview use separate stores, so test accounts never touch customer data", () => {
    expect(customersStoreName("production")).toBe("customers-production");
    expect(premiumStoreName("production")).toBe("premium-production");
    for (const ctx of ["deploy-preview", "branch-deploy", "dev", undefined]) {
      expect(customersStoreName(ctx)).toBe("customers-preview");
      expect(premiumStoreName(ctx)).toBe("premium-preview");
    }
  });

  it("the committed Netlify config never sets the test flag for the production context", () => {
    const toml = readFileSync(join(REPO, "netlify.toml"), "utf8");
    const prod =
      /\[context\.production[^\]]*\][\s\S]*?(?=\n\[(?!context\.production)|$)/.exec(toml)?.[0] ??
      "";
    expect(prod).not.toContain("PP_ALLOW_TEST_PROVIDER");
    expect(toml).not.toMatch(/PP_ALLOW_TEST_PROVIDER\s*=\s*["']?1/);
  });
});

describe("premium e2e: protected content export", () => {
  it("premium-export produces the one-file-per-adventure package from the store, and premium-import accepts it", async () => {
    // Run the REAL export script text against a stub store: only the @netlify/blobs import is swapped.
    const base = tmp();
    const scripts = join(base, "repo", "scripts");
    mkdirSync(scripts, { recursive: true });
    copyFileSync(
      join(REPO, "scripts", "premium-dir-lib.mjs"),
      join(scripts, "premium-dir-lib.mjs"),
    );
    const src = readFileSync(join(REPO, "scripts", "premium-export.mjs"), "utf8");
    expect(src).toContain('from "@netlify/blobs"');
    writeFileSync(
      join(scripts, "premium-export.mjs"),
      src.replace('"@netlify/blobs"', '"./stub-blobs.mjs"'),
    );
    writeFileSync(
      join(scripts, "stub-blobs.mjs"),
      `import { readFileSync } from "node:fs";
export function getStore({ name }) {
  if (name !== "premium-preview") throw new Error("unexpected store " + name);
  const data = JSON.parse(readFileSync(process.env.STUB_STORE, "utf8"));
  return { get: async (key) => (key in data ? data[key] : null) };
}
`,
    );
    const data: Record<string, unknown> = { index: { ids: PREMIUM.map((a) => a.id) } };
    for (const a of PREMIUM) data[`adventure/${a.id}`] = a;
    const storeFile = join(base, "store.json");
    writeFileSync(storeFile, JSON.stringify(data));
    const out = join(base, "package-outside-repo");
    const env = { STUB_STORE: storeFile, NETLIFY_AUTH_TOKEN: "stub", SITE_ID: "stub" };

    const exp = await run(
      [join(scripts, "premium-export.mjs"), "--dir", out, "--env", "preview"],
      env,
    );
    expect(exp.err).toBe("");
    expect(exp.code).toBe(0);
    expect(exp.out).toContain(`Exported ${PREMIUM.length} adventures from premium-preview`);
    expect(readdirSync(out).sort()).toEqual(PREMIUM.map((a) => `${a.id}.json`).sort());
    for (const a of PREMIUM)
      expect(JSON.parse(readFileSync(join(out, `${a.id}.json`), "utf8"))).toEqual(
        JSON.parse(JSON.stringify(a)),
      );

    // the package is exactly what the importer reads (dry run: no credentials, nothing written)
    const imp = await run(
      [join(REPO, "scripts", "premium-import.mjs"), "--dir", out, "--env", "preview"],
      {},
    );
    expect(imp.err).toBe("");
    expect(imp.code).toBe(0);
    expect(imp.out).toContain(`Validated ${PREMIUM.length} premium adventures`);
    expect(imp.out).toContain("Dry run: nothing written");

    // refuses to overwrite, and refuses a folder inside the repository
    expect((await run([join(scripts, "premium-export.mjs"), "--dir", out], env)).code).not.toBe(0);
    const inRepo = await run(
      [join(REPO, "scripts", "premium-export.mjs"), "--dir", join(REPO, "src")],
      env,
    );
    expect(inRepo.err).toContain("outside the repository");
  });
});

// A real HTTP server around the real handler, so the smoke script can be exercised end to end on localhost.
function serve(w: ReturnType<typeof world>): Promise<{ server: Server; url: string }> {
  const server = createServer((req, res) => {
    const chunks: Buffer[] = [];
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => {
      const url = `http://${req.headers.host}${req.url}`;
      const headers = new Headers();
      for (const [k, v] of Object.entries(req.headers))
        if (typeof v === "string") headers.set(k, v);
      const hasBody = req.method !== "GET" && req.method !== "HEAD";
      const init: RequestInit = { method: req.method ?? "GET", headers };
      if (hasBody) init.body = Buffer.concat(chunks);
      void w.api.handle(new Request(url, init)).then(async (r) => {
        const out: Record<string, string | string[]> = {};
        r.headers.forEach((v, k) => {
          if (k !== "set-cookie") out[k] = v;
        });
        out["set-cookie"] = r.headers.getSetCookie();
        res.writeHead(r.status, out);
        res.end(Buffer.from(await r.arrayBuffer()));
      });
    });
  });
  return new Promise((resolve) =>
    server.listen(0, "127.0.0.1", () =>
      resolve({ server, url: `http://127.0.0.1:${(server.address() as AddressInfo).port}` }),
    ),
  );
}

describe("premium e2e: preview smoke script", () => {
  const smoke = join(REPO, "scripts", "preview-smoke.mjs");

  it("refuses the production domain, plain http, a missing key and a real-looking key", async () => {
    const settings = readFileSync(join(REPO, "content", "settings.yml"), "utf8");
    const prod = new URL(/^siteUrl:\s*"([^"]+)"/m.exec(settings)![1]!).hostname;
    const apex = prod.replace(/^www\./, "");
    for (const url of [
      `https://${prod}`,
      `https://${apex}`,
      `https://www.${apex}/`,
      `https://deploy-preview-1.${apex}`,
    ]) {
      const r = await run([smoke], { PREVIEW_URL: url, TEST_LICENSE_KEY: "TEST-VALID-ABCDEF12" });
      expect(r.code).toBe(2);
      expect(r.err).toContain("production domain");
      expect(r.out).not.toContain("PASS");
    }
    const ok = "https://deploy-preview-3--some-site.netlify.app";
    expect(
      (
        await run([smoke], {
          PREVIEW_URL: "http://some-site.netlify.app",
          TEST_LICENSE_KEY: "TEST-VALID-ABCDEF12",
        })
      ).err,
    ).toContain("https");
    expect((await run([smoke], { PREVIEW_URL: ok })).err).toContain("TEST_LICENSE_KEY is not set");
    const real = await run([smoke], {
      PREVIEW_URL: ok,
      TEST_LICENSE_KEY: "ABCD1234-EFGH5678-IJKL9012-MNOP3456",
    });
    expect(real.err).toContain("never a real key");
    expect((await run([smoke], {})).err).toContain("PREVIEW_URL is not set");
  });

  it("passes every step against a preview-like server and leaves no customer data behind", async () => {
    const w = world();
    const { server, url } = await serve(w);
    try {
      const r = await run([smoke], { PREVIEW_URL: url, TEST_LICENSE_KEY: KEY });
      expect(r.err).toBe("");
      expect(r.out).not.toContain("FAIL");
      expect(r.out.match(/^PASS /gm)).toHaveLength(10);
      expect(r.out).toContain("All 10 steps passed.");
      expect(r.out).not.toContain(KEY);
      expect(r.code).toBe(0);
      expect(customerKeys(w)).toEqual([]); // step 10 deleted the throwaway account
    } finally {
      server.close();
    }
  });

  it("prints FAIL and exits 1 when premium is not seeded or the key is refused", async () => {
    const empty = world({ seedPremium: false });
    const a = await serve(empty);
    try {
      const r = await run([smoke], { PREVIEW_URL: a.url, TEST_LICENSE_KEY: KEY });
      expect(r.code).toBe(1);
      expect(r.out).toMatch(/FAIL\s+5 /);
    } finally {
      a.server.close();
    }
    const w = world();
    w.provider.setStatus(KEY, "refunded");
    const b = await serve(w);
    try {
      const r = await run([smoke], { PREVIEW_URL: b.url, TEST_LICENSE_KEY: KEY });
      expect(r.code).toBe(1);
      expect(r.out).toMatch(/FAIL\s+4 /);
    } finally {
      b.server.close();
    }
  });
});
