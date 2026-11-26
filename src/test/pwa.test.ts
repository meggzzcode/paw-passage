// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { readFileSync, statSync } from "node:fs";
import {
  INSTALL_COOLDOWN_MS,
  detectPlatform,
  dismissInstallPrompt,
  isInInstallCooldown,
  isStandalone,
  shouldShowInstallPrompt,
} from "@/lib/pwa";

const sw = readFileSync("public/sw.js", "utf8");
const manifest = JSON.parse(readFileSync("public/manifest.webmanifest", "utf8"));

describe("manifest", () => {
  it("is a valid standalone manifest with the required icons", () => {
    expect(manifest.name).toBe("Paws & Passage");
    expect(manifest.short_name).toBeTruthy();
    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/");
    expect(manifest.scope).toBe("/");
    expect(manifest.theme_color).toMatch(/^#[0-9a-f]{6}$/i);
    expect(manifest.background_color).toMatch(/^#[0-9a-f]{6}$/i);
    const key = (i: { sizes: string; purpose: string }) => `${i.sizes}/${i.purpose}`;
    const keys = manifest.icons.map(key);
    expect(keys).toEqual(
      expect.arrayContaining(["192x192/any", "512x512/any", "512x512/maskable"]),
    );
    for (const i of manifest.icons) {
      const size = statSync(`public${i.src}`).size;
      expect(size, i.src).toBeLessThan(60 * 1024);
    }
    expect(statSync("public/icons/apple-touch-icon.png").size).toBeLessThan(60 * 1024);
  });
  it("is linked from the root head", () => {
    expect(readFileSync("src/routes/__root.tsx", "utf8")).toContain("/manifest.webmanifest");
  });
  it("netlify serves sw.js uncached with root scope", () => {
    const t = readFileSync("netlify.toml", "utf8");
    const block = t.slice(t.indexOf('for = "/sw.js"'));
    expect(block).toMatch(/no-cache/);
    expect(block).toMatch(/Service-Worker-Allowed = "\/"/);
  });
});

describe("service worker source", () => {
  it("never caches /api, premium or authenticated content", () => {
    expect(sw).toMatch(/startsWith\("\/api\/"\)\) return/);
    const precache = sw.slice(
      sw.indexOf("const PRECACHE"),
      sw.indexOf("];", sw.indexOf("const PRECACHE")),
    );
    expect(precache).not.toMatch(/api|premium|passport|unlock/i);
    expect(sw).not.toMatch(/cache\.put|addAll\(\s*\[?\s*req/);
  });
  it("versions caches and deletes old ones on activate", () => {
    expect(sw).toMatch(/const VERSION = "v\d+"/);
    expect(sw).toMatch(/caches\.delete/);
    expect(sw).toMatch(/clients\.claim/);
    expect(sw).toMatch(/SKIP_WAITING/);
  });
  it("is network first for navigations with an offline fallback", () => {
    expect(sw).toMatch(/req\.mode === "navigate"/);
    expect(sw).toMatch(/OFFLINE_URL/);
  });
  it("handles push and validates click targets against the allow-list", () => {
    expect(sw).toMatch(/addEventListener\("push"/);
    expect(sw).toMatch(/addEventListener\("notificationclick"/);
    for (const u of ["/discover?mode=made", "/previews", "/passport?view=upcoming"])
      expect(sw).toContain(u);
    expect(sw).toMatch(/pl-\[a-z0-9\]\{8\}/);
  });
  it("offline page does not claim full offline use", () => {
    const html = readFileSync("public/offline.html", "utf8");
    expect(html).toMatch(/Nothing else is promised/);
    expect(html).not.toMatch(/work(s)? fully offline/i);
  });
  it("safeTarget behaves per the allow-list", () => {
    const body = sw.slice(
      sw.indexOf("const ALLOWED_URLS"),
      sw.indexOf('self.addEventListener("install"'),
    );
    const safe = new Function(`${body}; return safeTarget;`)() as (u: string, o: string) => string;
    const o = "https://x.test";
    expect(safe("/discover?mode=made", o)).toBe("/discover?mode=made");
    expect(safe("https://x.test/passport?view=upcoming&plan=pl-abcd1234", o)).toBe(
      "/passport?view=upcoming&plan=pl-abcd1234",
    );
    expect(safe("https://evil.test/previews", o)).toBe("/");
    expect(safe("/passport?view=upcoming&plan=pl-ABCD", o)).toBe("/");
    expect(safe("/unlock", o)).toBe("/");
    expect(safe("javascript:alert(1)", o)).toBe("/");
  });
});

describe("platform detection", () => {
  it("classifies user agents", () => {
    const sf =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1";
    expect(detectPlatform(sf)).toBe("ios-safari");
    expect(detectPlatform(sf.replace("Version/17.0", "CriOS/120.0 Version/17.0"))).toBe(
      "ios-other",
    );
    expect(
      detectPlatform(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
        5,
      ),
    ).toBe("ios-safari");
    expect(
      detectPlatform(
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/17.0 Safari/605.1.15",
        0,
      ),
    ).toBe("other");
    expect(
      detectPlatform(
        "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
      ),
    ).toBe("android-chrome");
    expect(
      detectPlatform(
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36",
      ),
    ).toBe("desktop-chromium");
    expect(
      detectPlatform("Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0"),
    ).toBe("other");
  });
});

describe("standalone and dismissal cooldown", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
    window.matchMedia = ((q: string) => ({
      matches: false,
      media: q,
      addEventListener() {},
      removeEventListener() {},
    })) as never;
  });
  it("detects display-mode standalone and iOS navigator.standalone", () => {
    expect(isStandalone()).toBe(false);
    window.matchMedia = ((q: string) => ({ matches: q.includes("standalone") })) as never;
    expect(isStandalone()).toBe(true);
    window.matchMedia = (() => ({ matches: false })) as never;
    Object.defineProperty(window.navigator, "standalone", { value: true, configurable: true });
    expect(isStandalone()).toBe(true);
    Object.defineProperty(window.navigator, "standalone", { value: undefined, configurable: true });
  });
  it("hides the prompt for 90 days after dismissal, then allows it", () => {
    const t0 = 1_700_000_000_000;
    expect(shouldShowInstallPrompt(t0)).toBe(true);
    dismissInstallPrompt(t0);
    expect(isInInstallCooldown(t0 + INSTALL_COOLDOWN_MS - 1)).toBe(true);
    expect(shouldShowInstallPrompt(t0 + 89 * 864e5)).toBe(false);
    expect(shouldShowInstallPrompt(t0 + 91 * 864e5)).toBe(true);
  });
  it("never shows in standalone", () => {
    window.matchMedia = ((q: string) => ({ matches: q.includes("standalone") })) as never;
    expect(shouldShowInstallPrompt()).toBe(false);
  });
  it("survives blocked storage", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(isInInstallCooldown()).toBe(false);
  });
});
