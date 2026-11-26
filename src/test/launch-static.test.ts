// Launch-readiness static checks over the source tree: photos stay on the device, analytics carries no personal data,
// every environment variable the server reads is documented, and the cost safeguards exist. Source scans, no network.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(p, "utf8");
function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (/\.(ts|tsx)$/.test(n)) out.push(p);
  }
  return out;
}
const sources = walk("src").filter((p) => !p.includes("/test/") && !p.endsWith(".gen.ts"));

describe("launch: photos never leave the device", () => {
  const keepsake = sources.filter(
    (p) => p.includes("passport/keepsake/") || p.endsWith("Keepsake.tsx"),
  );
  it("the photo and keepsake code has no network, upload or storage call", () => {
    expect(keepsake.length).toBeGreaterThan(3);
    for (const p of keepsake) {
      const s = read(p);
      for (const bad of [
        "fetch(",
        "XMLHttpRequest",
        "sendBeacon",
        "FormData",
        "WebSocket",
        "localStorage",
        "indexedDB",
      ])
        expect(s.includes(bad), `${p} uses ${bad}`).toBe(false);
    }
  });
  it("the photo is redrawn onto a canvas and exported as a fresh PNG, which carries no EXIF or location", () => {
    expect(read("src/passport/keepsake/photo.ts")).toContain("drawImage");
    expect(read("src/passport/keepsake/render.ts")).toContain('"image/png"');
  });
  it("no server module accepts an image upload", () => {
    for (const p of walk("src/server"))
      expect(/multipart|image\/(png|jpeg)|FormData|\.arrayBuffer\(\)/.test(read(p)), p).toBe(false);
  });
});

describe("launch: analytics carries no personal or subscription data", () => {
  const SAFE_KEYS = new Set(["where", "source", "adventure", "kind", "stage", "reason", "n"]);
  const BAD_KEYS =
    /(name|email|code|license|endpoint|subscription|token|memory|note|text|customer|phone|address)/i;
  it("every track() call passes only allow-listed parameter keys", () => {
    let calls = 0;
    for (const p of sources) {
      const s = read(p);
      for (const m of s.matchAll(/\btrack\(\s*"[a-z_]+"\s*,\s*\{([^}]*)\}/g)) {
        calls++;
        for (const k of (m[1] ?? "").matchAll(/(?:^|[\s,{])([a-zA-Z_]+)\s*[:,}]/g))
          expect(SAFE_KEYS.has(k[1]!) && !BAD_KEYS.test(k[1]!), `${p}: key ${k[1]}`).toBe(true);
      }
    }
    expect(calls).toBeGreaterThan(8);
  });
  it("the event list names no person, license or subscription event", () => {
    const s = read("src/passport/events.ts");
    expect(/"(?:[a-z_]*(?:email|license|code_|dog_name)[a-z_]*)"/.test(s)).toBe(false);
  });
});

describe("launch: documented configuration and operating-cost safeguards", () => {
  it("every environment variable the server reads is listed in OPERATIONS.md or NOTIFICATIONS.md", () => {
    const docs = read("docs/OPERATIONS.md") + read("docs/NOTIFICATIONS.md");
    const names = new Set<string>();
    for (const p of [
      ...walk("src/server"),
      "netlify/functions/api.ts",
      "netlify/functions/push-deliver.ts",
    ])
      for (const m of read(p).matchAll(/\benv\.([A-Z][A-Z0-9_]{3,})/g)) names.add(m[1]!);
    expect(names.size).toBeGreaterThanOrEqual(8);
    for (const n of names) expect(docs, n).toContain(n);
  });
  it("body size, rate limits, the preview match cap and the notification kill switch exist", () => {
    expect(read("src/server/passport/config.ts")).toMatch(/MAX_BODY_BYTES = 64 \* 1024/);
    expect(read("src/server/passport/limits.ts")).toContain("createRateLimiter");
    expect(read("src/server/passport/match.ts")).toMatch(/MATCH_MAX_BODY_BYTES = 4096/);
    const n =
      read("src/server/passport/notifications-api.ts") +
      read("src/server/passport/push-deliver.ts");
    expect(n).toContain("NOTIFICATIONS_ENABLED");
  });
  it("the service worker never caches API, premium or cross-origin responses", () => {
    const sw = read("public/sw.js");
    expect(sw).toContain('startsWith("/api/")');
    expect(sw).toContain("url.origin !== self.location.origin");
    expect(sw).not.toMatch(/cache\.put|cache\.add\(.*api/);
  });
});
