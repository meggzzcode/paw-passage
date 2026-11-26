// The single commercial config, the personalized purchase panel, the welcome page and the trust strip.
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { cleanup, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@tanstack/react-router", async (orig) => ({
  ...(await orig<typeof import("@tanstack/react-router")>()),
  Link: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
vi.mock("@/components/site/InstallCard", () => ({
  InstallCard: () => <div data-testid="install-card" />,
}));
const ent: { state: Record<string, unknown> } = { state: {} };
vi.mock("@/passport/useEntitlement", () => ({ useEntitlement: () => ent.state }));

import { offer } from "@/config/site";
import {
  DEMO_STEPS,
  LIBRARY_FALLBACK,
  MONTH_NAMES,
  SEASONAL_COLLECTIONS,
  TRUST_POINTS,
  featured,
  flags,
  libraryLine,
  price,
  seasonalFor,
} from "@/config/commercial";
import { PurchaseValue } from "@/components/passport/PurchaseValue";
import { TrustStrip } from "@/components/site/TrustStrip";
import { WelcomePage, unlockedTotals } from "@/components/site/WelcomePage";
import { fetchMatch } from "@/lib/previews";
import { matchProfile } from "@/server/passport/match";
import { buildPreviewIndex } from "@/server/passport/previews";
import { syntheticPremium } from "@/passport/fixtures/premium.synthetic";
import { freeLibrary } from "@/passport/content";
import { FAQS } from "@/components/site/faq-content";
import { renderUi } from "./collections-fixtures";
import { collections as allCollections } from "@/passport/content";
import { _resetForTests, bookmarkPreview } from "@/passport/local-store";

const walk = (dir: string): string[] =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
const sources = walk("src").filter(
  (f) =>
    /\.(ts|tsx)$/.test(f) &&
    !f.startsWith("src/test") &&
    !f.includes("routeTree") &&
    !f.includes("fixtures"),
);

describe("single-sourced commercial facts", () => {
  it("the price literal lives only in the offer constant", () => {
    expect(price).toBe(offer.price);
    const hits = sources.filter((f) => /\$\d+\.\d\d/.test(readFileSync(f, "utf8")));
    expect(hits).toEqual(["src/config/site.ts"]);
  });
  it("no source file hard-codes a library, collection or preview count", () => {
    const re = /\b\d{2,}\s+(premium\s+)?(adventures|collections|previews|stamps)\b/i;
    const hits = sources.filter((f) =>
      readFileSync(f, "utf8")
        .split("\n")
        .some(
          (l) =>
            !l.trim().startsWith("//") &&
            !l.trim().startsWith("*") &&
            !l.trim().startsWith("/**") &&
            re.test(l),
        ),
    );
    expect(hits).toEqual([]);
  });
  it("home, unlock and the previews panel read price and pricing from the config", () => {
    for (const f of [
      "src/routes/index.tsx",
      "src/routes/unlock.tsx",
      "src/components/site/PurchasePrompt.tsx",
    ])
      expect(readFileSync(f, "utf8"), f).toMatch(/config\/commercial/);
  });
  it("counts are worded from verified numbers only, with a plain fallback", () => {
    expect(libraryLine(null, null)).toBe(LIBRARY_FALLBACK);
    expect(libraryLine(0, 3)).toBe(LIBRARY_FALLBACK);
    expect(libraryLine(Number.NaN, 3)).toBe(LIBRARY_FALLBACK);
    expect(libraryLine(40, 5)).toBe("40 adventures across 5 collections, for every kind of dog.");
    expect(libraryLine(40, 0)).not.toMatch(/collection/);
    expect(LIBRARY_FALLBACK).not.toMatch(/\d/);
  });
});

describe("config content", () => {
  it("only mentions features that are switched on", () => {
    expect(flags.previewsShowcase).toBe(true);
    expect(typeof flags.itineraries).toBe("boolean");
    expect(typeof flags.printables).toBe("boolean");
  });
  it("maps every month to real collections, in hemisphere-neutral wording", () => {
    const real = new Set(
      [...readFileSync("content/collections.yml", "utf8").matchAll(/slug:\s*"([^"]+)"/g)].map(
        (m) => m[1]!,
      ),
    );
    for (let m = 1; m <= 12; m++) {
      expect(seasonalFor(m).length, String(m)).toBeGreaterThan(0);
      for (const s of seasonalFor(m)) expect(real.has(s), `${m}:${s}`).toBe(true);
    }
    expect(Object.keys(SEASONAL_COLLECTIONS)).toHaveLength(12);
    expect(MONTH_NAMES).toHaveLength(12);
    expect(seasonalFor(13)).toEqual([]);
    const src = readFileSync("src/config/commercial.ts", "utf8");
    expect(src.replace(/\/\/.*|\/\*[\s\S]*?\*\//g, "")).not.toMatch(
      /\b(summer|winter|spring|autumn)\b/i,
    );
  });
  it("never lists adventure ids; featured previews come from the private showcase flag", () => {
    expect(featured.method).toBe("showcase-flag-in-private-data");
    expect(readFileSync("src/config/commercial.ts", "utf8")).not.toMatch(/adv-[a-z0-9]{6}/);
  });
  it("ships five demo steps with small real images and alt text", () => {
    expect(DEMO_STEPS).toHaveLength(5);
    let total = 0;
    for (const s of DEMO_STEPS) {
      expect(existsSync(`public${s.src}`), s.src).toBe(true);
      total += statSync(`public${s.src}`).size;
      expect(s.alt.length).toBeGreaterThan(30);
    }
    expect(total).toBeLessThan(1.2 * 1024 * 1024);
  });
});

describe("match aggregates", () => {
  const free = freeLibrary();
  const premium = [
    {
      ...syntheticPremium[0]!,
      id: "adv-pre001",
      showcase: true,
      teaser: "A small mystery for a curious nose.",
      previewTitle: "Mystery one",
      costMax: 0,
      collections: ["rainy-day-club", "five-minute-wonders"],
    },
    {
      ...syntheticPremium[0]!,
      id: "adv-pre002",
      showcase: true,
      teaser: "A small mystery for a curious nose.",
      previewTitle: "Mystery two",
      costMax: 15,
      collections: ["rainy-day-club"],
    },
  ];
  const index = buildPreviewIndex(premium, free);
  const dog = { lifeStage: "adult", size: "medium", foodActivities: "yes" } as never;

  it("adds a no-spend count and at most six collection slugs, never titles", () => {
    const r = matchProfile(index, dog, {});
    expect(typeof r.matchingNoSpend).toBe("number");
    expect(r.matchingNoSpend!).toBeLessThanOrEqual(r.matching);
    expect(r.collections!.length).toBeLessThanOrEqual(6);
    expect(r.collections!).toContain("rainy-day-club");
    const json = JSON.stringify(r);
    expect(json).not.toMatch(/Mystery|curious nose|title|teaser/);
    expect(Object.keys(r).sort()).toEqual([
      "collections",
      "matching",
      "matchingNoSpend",
      "previews",
      "total",
    ]);
  });
  it("leaves the aggregates out when an older index lacks the fields, rather than guessing", () => {
    const old = {
      ...index,
      pool: index.pool.map(({ costMax: _c, collections: _k, ...rest }) => rest),
    } as never;
    const r = matchProfile(old, dog, {});
    expect(r.matching).toBeGreaterThan(0);
    expect("matchingNoSpend" in r).toBe(false);
    expect("collections" in r).toBe(false);
  });
  it("an empty index still answers with zeros and nothing else", () => {
    expect(matchProfile(null, dog, {})).toEqual({ matching: 0, total: 0, previews: [] });
  });
  it("the client keeps good aggregates and ignores bad ones", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({
          matching: 10,
          total: 50,
          previews: ["a"],
          matchingNoSpend: 4,
          collections: ["rainy-day-club", 7, "Bad Slug"],
        }),
      ),
    );
    expect(await fetchMatch({}, {})).toEqual({
      matching: 10,
      total: 50,
      previews: ["a"],
      matchingNoSpend: 4,
      collections: ["rainy-day-club"],
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () =>
        Response.json({ matching: 10, total: 50, previews: [], matchingNoSpend: 99 }),
      ),
    );
    expect((await fetchMatch({}, {}))!.matchingNoSpend).toBeUndefined();
    vi.unstubAllGlobals();
  });
});

describe("Here's what's waiting for you", () => {
  afterEach(cleanup);
  it("shows verified counts, saved count, public collection names and one calm purchase link", () => {
    render(
      <PurchaseValue
        result={{
          kind: "match",
          data: {
            matching: 31,
            total: 72,
            previews: ["a", "b"],
            matchingNoSpend: 12,
            collections: ["rainy-day-club", "no-such"],
          },
        }}
        saved={3}
      />,
    );
    const t = document.body.textContent ?? "";
    expect(t).toContain("Here's what's waiting for you");
    expect(t).toContain("31 adventures that match");
    expect(t).toContain("12 of them need no additional spending");
    expect(t).toContain("3 previews saved on this device");
    expect(t).toContain("Found in: Rainy Day Club");
    expect(t).not.toContain("no-such");
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByRole("link").textContent).toContain(`Unlock these 31 adventures, ${price}`);
    expect(document.querySelector('[role="dialog"], dialog')).toBeNull();
  });
  it("omits any number the server did not verify", () => {
    render(
      <PurchaseValue
        result={{ kind: "match", data: { matching: 5, total: 0, previews: [] } }}
        saved={0}
      />,
    );
    const t = document.body.textContent ?? "";
    expect(t).not.toMatch(/no additional spending|saved on this device|Found in/);
  });
  it("falls back to plain wording with only local counts", () => {
    render(<PurchaseValue result={{ kind: "fallback", fit: 2, of: 3 }} saved={1} />);
    const t = document.body.textContent ?? "";
    expect(t).toContain("We could not check the whole library just now");
    expect(t).toContain("rough guide");
    expect(t).toContain("1 preview saved on this device");
    expect(t).toContain(`See the full Passport, ${price}`);
  });
  it("offers no purchase link to someone who already has the full Passport", () => {
    render(<PurchaseValue result={{ kind: "fallback", fit: 2, of: 3 }} saved={0} entitled />);
    expect(screen.getByRole("link").getAttribute("href")).toBe("/discover");
  });
});

describe("welcome page", () => {
  beforeEach(() => {
    window.localStorage.clear();
    _resetForTests();
  });
  afterEach(cleanup);
  const premiumFixture = [
    { collections: ["a", "b"] },
    { collections: ["b"] },
    { collections: ["c"] },
  ] as never;
  it("computes verified totals from the delivered library", () => {
    expect(unlockedTotals(premiumFixture)).toEqual({
      adventures: 3,
      collections: allCollections.length,
    });
  });
  it("welcomes an entitled customer: totals, saved previews, one next action, optional extras", async () => {
    ent.state = {
      status: "entitled",
      premium: premiumFixture,
      signedIn: true,
      csrf: "c",
      message: null,
    };
    bookmarkPreview("adv-pre001");
    bookmarkPreview("adv-pre002");
    await renderUi(<WelcomePage />);
    const t = document.body.textContent ?? "";
    expect(t).toContain("Welcome to the full Passport");
    expect(t).toContain(`3 premium adventures across ${allCollections.length} collections`);
    expect(t).toContain("Your saved previews are now ready: 2 saved");
    expect(screen.getByRole("link", { name: "Open my Passport" })).toBeTruthy();
    expect(screen.getByTestId("install-card")).toBeTruthy();
    expect(t).not.toMatch(/Reminders are optional/); // push reminders are paused
    expect(t).not.toMatch(/code/i);
    expect(window.location.search).toBe("");
  });
  it("does not claim a purchase for a free visitor", async () => {
    ent.state = { status: "free", premium: [], signedIn: false, csrf: "", message: null };
    await renderUi(<WelcomePage />);
    expect(document.body.textContent).not.toContain("Your purchase is confirmed");
    expect(screen.getByRole("link", { name: "Restore access" })).toBeTruthy();
  });
  it("is a noindex route that is not in the sitemap", () => {
    expect(readFileSync("src/routes/welcome.tsx", "utf8")).toContain("noindex: true");
    expect(readFileSync("src/lib/sitemap-entries.ts", "utf8")).not.toContain("/welcome");
  });
  it("the activation success state links to it without putting anything in the address", () => {
    const f = readFileSync("src/components/passport/AccessForms.tsx", "utf8");
    expect(f).toContain('to="/welcome"');
  });
});

describe("trust and objections", () => {
  afterEach(cleanup);
  it("the strip states the facts and links to refund terms, restore and support", () => {
    render(<TrustStrip />);
    const t = document.body.textContent ?? "";
    expect(t).toMatch(/Digital/);
    expect(t).toContain(`One payment of ${price}, no subscription`);
    expect(t).toMatch(/cost nothing extra/);
    expect(t).toMatch(/Photos stay on your device/);
    expect(t).toMatch(/Restore it with your purchase code/);
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(["/refund-policy", "/restore-access", "/contact"]);
    expect(TRUST_POINTS.length).toBeGreaterThanOrEqual(6);
    expect(t).not.toMatch(/testimonial|rated|\bstars?\b|customers love|thousands/i);
  });
  it("is reused on the homepage, unlock and FAQ", () => {
    for (const f of ["src/routes/index.tsx", "src/routes/unlock.tsx", "src/routes/faq.tsx"])
      expect(readFileSync(f, "utf8"), f).toContain("<TrustStrip");
  });
  it("answers household and multi-dog honestly: one shared profile, no separate profiles", () => {
    const h = FAQS.find((f) => f.id === "household")!;
    expect(h.a).toMatch(/household/);
    const m = FAQS.find((f) => f.id === "multi-dog")!;
    expect(m.a).toMatch(/one shared profile/);
    expect(m.a).toMatch(/Luna and Milo/);
    expect(m.a).toMatch(/suit every dog/);
    expect(m.a).toMatch(/no separate profiles/);
    const unlock = readFileSync("src/routes/unlock.tsx", "utf8");
    expect(unlock.replace(/\s+/g, " ")).toMatch(/one shared profile/);
  });
  it("has no display ads inside the paid Passport", () => {
    for (const f of walk("src/components/passport")) {
      const s = readFileSync(f, "utf8");
      expect(s, f).not.toMatch(/adsbygoogle|googlesyndication|doubleclick|AffiliateNotice|amazon/i);
    }
  });
});
