// Security review (S): static checks over the repository. These read files; they prove the absence of specific patterns,
// not the absence of every vulnerability.
import { execSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const read = (p: string) => readFileSync(p, "utf8");

function trackedFiles(): string[] {
  try {
    return execSync("git ls-files", { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
      .split("\n")
      .filter(Boolean);
  } catch {
    return [];
  }
}
function walk(dir: string, out: string[] = []): string[] {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}
const TEXT = /\.(ts|tsx|js|mjs|json|md|yml|yaml|toml|html|css|txt|webmanifest)$/;

describe("secrets are not in git-tracked files", () => {
  const files = trackedFiles().filter(
    (f) => TEXT.test(f) && f !== "package-lock.json" && !f.startsWith("content/premium/"),
  );
  const PATTERNS: [string, RegExp][] = [
    ["private key block", /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
    ["live payment key", /\b(sk|rk)_live_[A-Za-z0-9]{16,}/],
    ["AWS access key", /\bAKIA[0-9A-Z]{16}\b/],
    ["GitHub token", /\bgh[pousr]_[A-Za-z0-9]{30,}/],
    ["Slack token", /\bxox[abp]-[A-Za-z0-9-]{10,}/],
    ["Netlify personal token", /\bnfp_[A-Za-z0-9]{30,}/],
    [
      "secret env assigned a literal",
      /\b(SESSION_SECRET|PP_DATA_KEY|VAPID_PRIVATE_KEY|NETLIFY_AUTH_TOKEN)\s*[:=]\s*["'`][A-Za-z0-9+/_=-]{16,}["'`]/,
    ],
    // A VAPID private key is 43 base64url characters; a bare one next to the word "private" would be a leak.
    ["VAPID private key literal", /private[^\n]{0,40}["'`][A-Za-z0-9_-]{43}["'`]/i],
  ];
  it("scans a non-trivial set of files", () => {
    if (files.length === 0) return; // not a git checkout: nothing to scan
    expect(files.length).toBeGreaterThan(200);
  });
  it.each(PATTERNS)("no %s", (_name, re) => {
    const bad = files.filter((f) => re.test(read(f)));
    expect(bad).toEqual([]);
  });
  it(".gitignore keeps env files, local dev vars and premium exports out of git", () => {
    const g = read(".gitignore");
    for (const line of [".env", ".env.*", ".dev.vars", "*.premium.json", "/premium-content/"])
      expect(g).toContain(line);
    expect(
      trackedFiles().filter((f) => /(^|\/)\.env(\.|$)/.test(f) && f !== ".env.example"),
    ).toEqual([]);
  });
  it("secrets are read only from the environment in server code", () => {
    const src = [...walk("src/server"), ...walk("netlify/functions")]
      .filter((f) => f.endsWith(".ts"))
      .map(read)
      .join("\n");
    expect(src).toMatch(/process\.env/);
    expect(src).not.toMatch(/VITE_[A-Z_]*(SECRET|PRIVATE|DATA_KEY)/);
  });
});

describe("the browser bundle never carries server secrets or sourcemaps", () => {
  it("no VITE_ variable holds a secret name anywhere in src or scripts", () => {
    const hits = [...walk("src"), ...walk("scripts")]
      .filter((f) => /\.(ts|tsx|mjs)$/.test(f) && !f.includes("/test/"))
      .filter((f) => /VITE_[A-Z_]*(SECRET|PRIVATE|DATA_KEY|VAPID_PRIVATE)/.test(read(f)));
    expect(hits).toEqual([]);
  });
  it("the Vite config does not turn sourcemaps on", () => {
    const cfg = read("vite.config.ts");
    expect(cfg).not.toMatch(/sourcemap\s*:\s*(true|"inline"|"hidden"|'inline'|'hidden')/i);
  });
  it("a built dist (when present) contains no .map files", () => {
    if (!existsSync("dist")) return;
    expect(walk("dist").filter((f) => f.endsWith(".map"))).toEqual([]);
  });
  it("the site build never reads the premium folder", () => {
    expect(read("plugins/content.ts")).toContain('EXCLUDED_CONTENT_DIR = "premium"');
  });
});

describe("service worker caches static files only", () => {
  const sw = read("public/sw.js");
  it("never handles /api/ and stores no pages", () => {
    expect(sw).toMatch(/startsWith\("\/api\/"\)\)\s*return/);
    expect(sw).not.toMatch(/cache\.put\(|\.put\(req/);
    expect(sw).toMatch(/if \(url\.origin !== self\.location\.origin\) return;/);
  });
  it("precaches only fixed static paths", () => {
    const m = /const PRECACHE = \[([\s\S]*?)\];/.exec(sw);
    expect(m).not.toBeNull();
    const paths = [...m![1]!.matchAll(/"([^"]+)"/g)].map((x) => x[1]!);
    expect(paths.length).toBeGreaterThan(3);
    for (const p of paths) expect(p).not.toMatch(/^\/api\/|premium|passport|session/);
  });
});

describe("photos never leave the device (code review, pinned)", () => {
  const photoFiles = [
    "src/passport/keepsake/photo.ts",
    "src/passport/keepsake/render.ts",
    "src/passport/keepsake/download.ts",
    "src/passport/keepsake/filter.ts",
    "src/passport/keepsake/artwork.ts",
    "src/components/passport/PhotoEditor.tsx",
    "src/components/passport/Keepsake.tsx",
    "src/components/passport/KeepsakeUnlock.tsx",
  ];
  it("the photo and keepsake code has no network, upload or beacon call", () => {
    for (const f of photoFiles) {
      const t = read(f);
      expect(t, f).not.toMatch(/\bfetch\s*\(/);
      expect(t, f).not.toMatch(/sendBeacon|XMLHttpRequest|new FormData|WebSocket|EventSource/);
      expect(t, f).not.toMatch(/\bimport\(\s*["']https?:/);
    }
  });
  it("file inputs only take images (capture only on the explicit camera input) and the progress Save has no image field", () => {
    const k = read("src/components/passport/Keepsake.tsx");
    expect(k).toMatch(/accept="image\/\*"/);
    // One input uses capture="environment" for an explicit "take a photo" tap: it opens the OS camera, the file stays local.
    expect(k.match(/\scapture=/g)?.length ?? 0).toBeLessThanOrEqual(1);
    expect(read("src/passport/progress.ts")).toMatch(
      /Photos and keepsakes are never part of a Save/,
    );
  });
  it("the keepsake image is re-encoded through a canvas, which drops EXIF/GPS metadata", () => {
    const r = read("src/passport/keepsake/render.ts");
    expect(r).toMatch(/toBlob|convertToBlob/);
    expect(r).toMatch(/image\/png/);
  });
  it("analytics events carry only listed small fields and no photo data", () => {
    const ev = read("src/passport/events.ts");
    expect(ev).toMatch(
      /Never put a dog's name, memory text, license code, email or any customer ID/,
    );
    expect(ev).not.toMatch(/blob:|data:image|toDataURL/);
  });
});

describe("paused features stay paused", () => {
  it("PWA and notifications are off by default", () => {
    expect(read("src/lib/pwa.ts")).toMatch(/export const PWA_ENABLED = false;/);
    expect(read("src/config/commercial.ts")).toMatch(/notifications:\s*false/);
  });
});

describe("netlify.toml security headers (read only)", () => {
  const toml = read("netlify.toml");
  it("API responses are no-store at the edge too", () => {
    expect(toml).toMatch(/for = "\/api\/\*"[\s\S]{0,80}Cache-Control = "no-store"/);
  });
  it("sends Referrer-Policy and Permissions-Policy for static files", () => {
    expect(toml).toMatch(/Referrer-Policy = "strict-origin-when-cross-origin"/);
    expect(toml).toMatch(/Permissions-Policy = /);
  });
});
