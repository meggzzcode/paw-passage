import { describe, expect, it } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { HTML_SECURITY_HEADERS } from "@/lib/security-headers";
import { PWA_ENABLED } from "@/lib/pwa";

// Guards for what a Netlify deploy depends on: netlify.toml, the API function's route list, static-file headers and the
// camera decision. They read the files as text (no TOML parser is installed). A real preview deploy is still required to
// prove Netlify honors them (docs/NETLIFY-PREVIEW.md).
const toml = readFileSync("netlify.toml", "utf8");
const blocks = (kind: "redirects" | "headers") =>
  toml
    .split(new RegExp(`^\\[\\[${kind}\\]\\]`, "m"))
    .slice(1)
    .map((b) => b.split(/^\[\[/m)[0]!);
const field = (b: string, k: string) =>
  new RegExp(`^\\s*${k}\\s*=\\s*"?([^"\\n]+)"?`, "m").exec(b)?.[1];

describe("netlify.toml build settings", () => {
  it("publishes dist with the netlify Nitro preset, Node 22 and a skip-build ignore command", () => {
    expect(toml).toMatch(/^\s*publish\s*=\s*"dist"/m);
    expect(toml).toMatch(/^\s*command\s*=\s*"npm run build"/m);
    expect(toml).toMatch(/NITRO_PRESET\s*=\s*"netlify"/);
    expect(toml).toMatch(/NODE_VERSION\s*=\s*"22"/);
    expect(toml).toMatch(/^\s*ignore\s*=\s*"/m);
  });

  it("never sets a secret or the test-provider flag in the file", () => {
    for (const n of ["SESSION_SECRET", "PP_DATA_KEY", "GUMROAD_PRODUCT_ID", "VAPID_PRIVATE_KEY"])
      expect(toml).not.toContain(n);
    expect(toml).not.toContain("PP_ALLOW_TEST_PROVIDER");
    expect(toml).not.toMatch(/SHOW_DRAFTS/);
  });
});

describe("netlify.toml redirects", () => {
  const rules = blocks("redirects");
  it("every rule is a forced 301 or 410 and none sends visitors to the home page", () => {
    expect(rules.length).toBeGreaterThan(50);
    for (const r of rules) {
      const status = field(r, "status");
      expect(["301", "410"], r).toContain(status);
      expect(field(r, "force"), r).toBe("true");
      expect(field(r, "to"), r).not.toBe("/");
    }
  });
  it("retired addresses answer 410 through /gone.html, which ships in public/", () => {
    const gone = rules.filter((r) => field(r, "status") === "410");
    expect(gone.length).toBeGreaterThanOrEqual(40);
    for (const r of gone) expect(field(r, "to")).toBe("/gone.html");
    expect(existsSync("public/gone.html")).toBe(true);
  });
  it("has exactly ten 301 rules and each target is a real internal path (not a retired one)", () => {
    const moved = rules.filter((r) => field(r, "status") === "301");
    expect(moved).toHaveLength(10);
    for (const r of moved) expect(field(r, "to"), r).toMatch(/^\/[a-z0-9\-/]+$/);
  });
  it("rule order: no 410 rule comes after a catch-all", () => {
    const froms = rules.map((r) => field(r, "from")!);
    expect(froms.filter((f) => f === "/*" || f === "/:splat")).toEqual([]);
  });
});

describe("netlify.toml static headers and Permissions-Policy", () => {
  const all = blocks("headers").find((b) => field(b, "for") === "/*")!;
  it("static files get the same Referrer-Policy and Permissions-Policy as HTML pages", () => {
    expect(field(all, "Referrer-Policy")).toBe(HTML_SECURITY_HEADERS["Referrer-Policy"]);
    expect(field(all, "Permissions-Policy")).toBe(HTML_SECURITY_HEADERS["Permissions-Policy"]);
  });
  it("hashed assets are immutable for a year", () => {
    const a = blocks("headers").find((b) => field(b, "for") === "/assets/*")!;
    expect(field(a, "Cache-Control")).toBe("public, max-age=31536000, immutable");
  });
  it("static files get nosniff, as pages do", () => {
    expect(field(all, "X-Content-Type-Options")).toBe("nosniff");
    expect(HTML_SECURITY_HEADERS["X-Content-Type-Options"]).toBe("nosniff");
  });
  it("sends no frame header and no enforced CSP anywhere (frame policy: none, the Lovable preview iframes the site)", () => {
    expect(toml).not.toMatch(/X-Frame-Options\s*=|Content-Security-Policy\s*=/i);
    expect(HTML_SECURITY_HEADERS).not.toHaveProperty("Content-Security-Policy");
    expect(HTML_SECURITY_HEADERS).not.toHaveProperty("X-Frame-Options");
    expect(HTML_SECURITY_HEADERS["Content-Security-Policy-Report-Only"]).not.toMatch(
      /frame-ancestors/,
    );
  });
  it("the CSP is report-only and permits the inline scripts the document needs", () => {
    expect(HTML_SECURITY_HEADERS["Content-Security-Policy-Report-Only"]).toMatch(
      /script-src[^;]*'unsafe-inline'/,
    );
  });
  it("/api/* keeps the no-store fallback and there is no per-route previews header rule", () => {
    const api = blocks("headers").find((b) => field(b, "for") === "/api/*")!;
    expect(field(api, "Cache-Control")).toBe("no-store");
    expect(blocks("headers").some((b) => (field(b, "for") ?? "").startsWith("/api/previews"))).toBe(
      false,
    );
  });
});

describe("camera decision: keep camera=() because the editor uses only native file inputs", () => {
  // DECISION: Permissions-Policy `camera=()` blocks getUserMedia (an in-page camera stream). It is NOT documented to block
  // <input type="file" capture>, which hands off to the operating system's camera or photo picker. UNVERIFIED across
  // browsers: Cowork must test on a real iPhone (Safari) and Android (Chrome) (docs/NETLIFY-PREVIEW.md, section 7).
  // If the editor ever adopts getUserMedia, change the policy to camera=(self) for the editor route only, and update this test.
  const walk = (dir: string): string[] => {
    return readdirSync(dir).flatMap((n: string) => {
      const p = `${dir}/${n}`;
      return statSync(p).isDirectory() ? walk(p) : /\.(ts|tsx)$/.test(n) ? [p] : [];
    });
  };
  const sources = walk("src").filter((p) => !p.startsWith("src/test/"));
  it("no source file opens a camera stream or other gated device API", () => {
    for (const p of sources) {
      const t = readFileSync(p, "utf8");
      expect(t, p).not.toMatch(/getUserMedia|mediaDevices|navigator\.geolocation|getDisplayMedia/);
    }
  });
  it("the Keepsake editor offers a camera input via capture and a library input, both native file inputs", () => {
    const k = readFileSync("src/components/passport/Keepsake.tsx", "utf8");
    expect(k).toMatch(/type="file"\s+accept="image\/\*"\s+capture="environment"/);
    expect(k).toMatch(/type="file"\s+accept="image\/\*"\s+className="kp-file"/);
  });
  it("the policy therefore keeps camera, microphone, geolocation, payment and usb disabled everywhere", () => {
    expect(HTML_SECURITY_HEADERS["Permissions-Policy"]).toBe(
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
  });
});

describe("netlify/functions/api.ts route list", () => {
  const api = readFileSync("netlify/functions/api.ts", "utf8");
  const paths = [...(/path:\s*\[([\s\S]*?)\]/.exec(api)?.[1] ?? "").matchAll(/"([^"]+)"/g)].map(
    (m) => m[1]!,
  );
  it("routes every /api endpoint the client calls, including the public previews", () => {
    for (const p of [
      "/api/session",
      "/api/session/signout",
      "/api/access/activate",
      "/api/access/restore",
      "/api/progress",
      "/api/premium/adventures",
      "/api/premium/summary",
      "/api/previews",
      "/api/previews/match",
      "/api/account/export",
      "/api/account/delete",
    ])
      expect(paths, p).toContain(p);
  });
  it("every route the function claims starts with /api/ and the scheduled push function has no schedule while paused", () => {
    for (const p of paths) expect(p.startsWith("/api/"), p).toBe(true);
    const pd = readFileSync("netlify/functions/push-deliver.ts", "utf8");
    expect(pd).not.toMatch(/^export const config/m);
  });
});

describe("PWA is paused", () => {
  it("PWA_ENABLED is false so the service worker is unregistered and no manifest link is emitted", () => {
    expect(PWA_ENABLED).toBe(false);
    expect(readFileSync("src/routes/__root.tsx", "utf8")).toMatch(
      /PWA_ENABLED \? \[\{ rel: "manifest"/,
    );
  });
});
