#!/usr/bin/env node
// Premium smoke test for a deployed PREVIEW (deploy-preview or branch deploy). Run by Cowork, never against production.
//
//   PREVIEW_URL=https://deploy-preview-12--your-site.netlify.app TEST_LICENSE_KEY=TEST-VALID-XXXXXXXX \
//     node scripts/preview-smoke.mjs
//
// The preview must run with PP_ALLOW_TEST_PROVIDER=1 and premium content seeded in the preview store (see
// docs/PREMIUM-INTEGRATION-TESTS.md). TEST_LICENSE_KEY must be a TEST-VALID-... code for the isolated test provider:
// a real Gumroad key is refused here on purpose. No secret lives in this file; the key is read from the environment,
// never printed, and sent only in request bodies. Prints PASS or FAIL per step; exit code 1 if any step fails.
// The script writes one throwaway marker into the test account and deletes the whole account at the end.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

/** The production host from content/settings.yml (the value src/config/site.ts exposes as site.siteUrl). */
export function productionHost(settingsText) {
  const m = /^siteUrl:\s*["']?([^"'\s#]+)/m.exec(settingsText);
  if (!m) return null;
  try {
    return new URL(m[1]).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** Throws unless the target is clearly NOT production. Fails closed when the production domain cannot be read. */
export function checkTarget(previewUrl, key, settingsText) {
  const prod = productionHost(settingsText);
  if (!prod) throw new Error("Refusing to run: could not read siteUrl from content/settings.yml.");
  if (!previewUrl) throw new Error("PREVIEW_URL is not set.");
  let u;
  try {
    u = new URL(previewUrl);
  } catch {
    throw new Error("PREVIEW_URL is not a valid URL.");
  }
  const host = u.hostname.toLowerCase().replace(/\.$/, "");
  const local = host === "localhost" || host === "127.0.0.1" || host === "[::1]";
  if (host === prod || host.endsWith(`.${prod}`) || host.replace(/^www\./, "") === prod)
    throw new Error(`Refusing to run: ${host} looks like the production domain.`);
  if (u.protocol !== "https:" && !(local && u.protocol === "http:"))
    throw new Error("PREVIEW_URL must be https (http is allowed only for localhost).");
  if (!key) throw new Error("TEST_LICENSE_KEY is not set.");
  if (!/^TEST-VALID-[A-Z0-9]{1,40}$/.test(key))
    throw new Error(
      "TEST_LICENSE_KEY must be a TEST-VALID-... code for the test provider (never a real key).",
    );
  return u.origin;
}

/** A tiny cookie jar so a second "device" can be simulated with a fresh one. */
class Jar {
  cookie = "";
  csrf = "";
  constructor(origin) {
    this.origin = origin;
  }
  async call(method, path, body) {
    const headers = { "content-type": "application/json", origin: this.origin };
    if (this.cookie) headers.cookie = this.cookie;
    if (this.csrf) headers["x-pp-csrf"] = this.csrf;
    const res = await fetch(this.origin + path, {
      method,
      headers,
      ...(body === undefined ? {} : { body: JSON.stringify(body) }),
      redirect: "manual",
      signal: AbortSignal.timeout(15000),
    });
    const sc = res.headers.get("set-cookie");
    if (sc) {
      const first = sc.split(";")[0];
      this.cookie = first.slice(first.indexOf("=") + 1) ? first : "";
    }
    let json = {};
    try {
      json = await res.json();
    } catch {
      /* not JSON */
    }
    return { status: res.status, json, res };
  }
}

const FORBIDDEN = ["instructions", "twist", "reveal", "clue", "objective", "variations", "safety"];

export async function run(origin, key, out = console.log) {
  const results = [];
  const step = async (name, fn) => {
    try {
      const detail = await fn();
      results.push(true);
      out(`PASS  ${name}${detail ? `  (${detail})` : ""}`);
    } catch (e) {
      results.push(false);
      out(`FAIL  ${name}  (${e instanceof Error ? e.message : "error"})`);
    }
  };
  const expect = (cond, msg) => {
    if (!cond) throw new Error(msg);
  };
  const marker = `adv-${Math.random().toString(36).slice(2, 8).padEnd(6, "0")}`;
  const phone = new Jar(origin);
  const laptop = new Jar(origin); // a fresh cookie jar = another device

  await step("1  GET /api/previews is public and carries no premium fields", async () => {
    const r = await new Jar(origin).call("GET", "/api/previews");
    expect(r.status === 200, `status ${r.status}`);
    expect(Array.isArray(r.json.items) && typeof r.json.total === "number", "bad shape");
    const text = JSON.stringify(r.json);
    for (const f of FORBIDDEN) expect(!text.includes(`"${f}"`), `leaks field ${f}`);
    return `${r.json.items.length} previews, library total ${r.json.total}`;
  });

  await step("2  premium library is refused without a session", async () => {
    const r = await new Jar(origin).call("GET", "/api/premium/adventures");
    expect(r.status === 401, `status ${r.status}`);
  });

  await step("3  bad, refunded and revoked keys are refused and create no session", async () => {
    for (const code of [
      "NOT-A-REAL-KEY-0000",
      "TEST-REFUNDED-SMOKE0001",
      "TEST-REVOKED-SMOKE0001",
    ]) {
      const j = new Jar(origin);
      const r = await j.call("POST", "/api/access/activate", { code });
      expect(r.status === 403, `status ${r.status} for a refused key`);
      expect(!j.cookie, "a session cookie was issued for a refused key");
      expect((await j.call("GET", "/api/premium/adventures")).status === 401, "premium reachable");
    }
  });

  await step("4  activate with the test key", async () => {
    const r = await phone.call("POST", "/api/access/activate", { code: key });
    expect(
      r.status === 200 && r.json.entitled === true,
      `status ${r.status} ${r.json.reason ?? ""}`,
    );
    expect(!!phone.cookie, "no session cookie");
    phone.csrf = r.json.csrf;
    return r.json.reason;
  });

  await step("5  authenticated /api/premium/adventures returns the full library", async () => {
    const r = await phone.call("GET", "/api/premium/adventures");
    expect(r.status === 200, `status ${r.status}`);
    const list = r.json.adventures;
    expect(
      Array.isArray(list) && list.length > 0,
      "empty premium library (seed the preview store)",
    );
    expect(
      list.every((a) => Array.isArray(a.instructions) && a.access === "premium"),
      "records are not full premium cards",
    );
    return `${list.length} adventures`;
  });

  await step("6  session reports entitled", async () => {
    const r = await phone.call("GET", "/api/session");
    expect(
      r.status === 200 && r.json.entitled === true && r.json.status === "active",
      `status ${r.status}`,
    );
  });

  await step("7  progress written on the first device is stored", async () => {
    const save = {
      v: 2,
      rev: 0,
      profile: { data: {}, at: 0 },
      owner: { data: {}, at: 0 },
      done: { added: { [marker]: Date.now() }, removed: {} },
      favorites: { added: {}, removed: {} },
      saved: { added: {}, removed: {} },
      memories: {},
      repeats: {},
      feedback: {},
      collections: {},
    };
    const r = await phone.call("PUT", "/api/progress", { save, baseRev: 0 });
    expect(r.status === 200, `status ${r.status}`);
  });

  await step("8  restore on a fresh cookie jar with the key only pulls the progress", async () => {
    const r = await laptop.call("POST", "/api/access/restore", { code: key });
    expect(
      r.status === 200 && r.json.reason === "restored",
      `status ${r.status} ${r.json.reason ?? ""}`,
    );
    laptop.csrf = r.json.csrf;
    expect(r.json.save?.done?.added?.[marker] !== undefined, "progress did not come back");
    expect(
      (await laptop.call("GET", "/api/premium/adventures")).status === 200,
      "premium not reachable",
    );
  });

  await step(
    "9  an empty save from the second device cannot erase the first device's progress",
    async () => {
      const empty = {
        v: 2,
        rev: 0,
        profile: { data: {}, at: 0 },
        owner: { data: {}, at: 0 },
        done: { added: {}, removed: {} },
        favorites: { added: {}, removed: {} },
        saved: { added: {}, removed: {} },
        memories: {},
        repeats: {},
        feedback: {},
        collections: {},
      };
      const w = await laptop.call("PUT", "/api/progress", { save: empty, baseRev: 0 });
      expect(w.status === 200, `status ${w.status}`);
      const r = await phone.call("GET", "/api/progress");
      expect(r.json.save?.done?.added?.[marker] !== undefined, "progress was overwritten");
    },
  );

  await step("10 cleanup: delete the test account; the old session stops working", async () => {
    const d = await phone.call("POST", "/api/account/delete", { confirm: "DELETE" });
    expect(d.status === 200 && d.json.deleted === true, `status ${d.status}`);
    expect((await laptop.call("GET", "/api/session")).status === 401, "session survived deletion");
  });

  const failed = results.filter((x) => !x).length;
  out(
    failed === 0
      ? `\nAll ${results.length} steps passed.`
      : `\n${failed} of ${results.length} steps FAILED.`,
  );
  return failed === 0;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let origin;
  try {
    const settings = readFileSync(join(root, "content", "settings.yml"), "utf8");
    origin = checkTarget(process.env.PREVIEW_URL, process.env.TEST_LICENSE_KEY, settings);
  } catch (e) {
    console.error(e instanceof Error ? e.message : "bad configuration");
    process.exit(2);
  }
  console.log(`Premium smoke test against ${origin}\n`);
  process.exit((await run(origin, process.env.TEST_LICENSE_KEY)) ? 0 : 1);
}
