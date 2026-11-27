import { beforeEach, describe, expect, it, vi } from "vitest";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";

vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
const tracked: [string, unknown][] = [];
vi.mock("@/passport/events", async (orig) => {
  const real = await orig<typeof import("@/passport/events")>();
  return {
    ...real,
    track: (n: string, p: unknown) => {
      tracked.push([n, p]);
      return true;
    },
  };
});

import { LANDINGS, landingWords } from "@/components/site/landing-pages";
import { FAQS, UNLOCK_FAQ_IDS } from "@/components/site/faq-content";
import { FILTER_EXAMPLES } from "@/components/site/keepsake-examples";
import { PurchasePrompt } from "@/components/site/PurchasePrompt";
import { landingHead } from "@/components/site/landing-head";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { offer } from "@/config/site";

const REMOVED: Record<string, string> = {
  "/doggy-date-ideas": "/journal/doggy-date-ideas",
  "/puppy-bucket-list": "/journal/puppy-bucket-list",
  "/senior-dog-adventures": "/journal/fun-things-to-do-with-your-senior-dog",
  "/free-things-to-do-with-your-dog": "/journal/free-things-to-do-with-your-dog",
  "/weekend-adventure-finder": "/journal/things-to-do-with-your-dog-this-weekend",
  "/indoor-dog-adventures": "/journal/things-to-do-with-your-dog-at-home",
};

describe("things-to-do hub and removed landing pages", () => {
  it("keeps one hub with a route file and a sitemap entry, plus the Journal pages", () => {
    expect(LANDINGS.map((l) => l.path)).toEqual(["/things-to-do-with-your-dog"]);
    expect(existsSync("src/routes/things-to-do-with-your-dog.tsx")).toBe(true);
    const sm = sitemapEntries().map((e) => e.path);
    expect(sm).toContain("/things-to-do-with-your-dog");
    expect(sm).toContain("/journal");
    expect(sm.some((p) => p.startsWith("/journal/"))).toBe(true);
    expect(sm).toContain("/faq");
    expect(sm.some((p) => p.includes("?"))).toBe(false);
  });
  it("the hub links to all ten Journal articles and has useful guidance of its own", () => {
    const hub = LANDINGS[0]!;
    expect(hub.journal).toHaveLength(10);
    for (const j of hub.journal!)
      expect(existsSync(`content/journal/${j.slug}.md`), j.slug).toBe(true);
    expect(hub.sections.length).toBeGreaterThanOrEqual(5);
    expect(landingWords(hub)).toBeGreaterThanOrEqual(400);
  });
  it("declares a permanent forced 301 for each removed route and keeps no route or sitemap entry", () => {
    const toml = readFileSync("netlify.toml", "utf8");
    const sm = sitemapEntries().map((e) => e.path);
    for (const [from, to] of Object.entries(REMOVED)) {
      expect(toml).toContain(`from = "${from}"\n  to = "${to}"\n  status = 301\n  force = true`);
      expect(existsSync(`src/routes${from}.tsx`), from).toBe(false);
      expect(sm, from).not.toContain(from);
      expect(existsSync(`content/journal/${to.replace("/journal/", "")}.md`), to).toBe(true);
    }
  });
  it("has accurate, unique metadata and a canonical for the hub", () => {
    const l = LANDINGS[0]!;
    const h = landingHead(l.slug);
    const title = h.meta.find((m) => "title" in m)?.["title"] ?? "";
    expect(title.length).toBeLessThanOrEqual(60);
    const desc = h.meta.find((m) => m["name"] === "description")?.["content"] ?? "";
    expect(desc.length).toBeGreaterThan(70);
    expect(desc.length).toBeLessThanOrEqual(155);
    expect(h.links[0]?.href.endsWith(l.path)).toBe(true);
    expect(h.meta.some((m) => m["name"] === "robots")).toBe(false);
  });
  it("links only to real internal addresses and never to a filter combination", () => {
    for (const l of LANDINGS) {
      expect(l.related.length).toBeGreaterThanOrEqual(3);
      for (const r of l.related) {
        expect(r.to.startsWith("/"), r.to).toBe(true);
        expect(r.to).not.toContain("?");
        expect(Object.keys(REMOVED)).not.toContain(r.to);
      }
    }
  });
});

describe("faq", () => {
  it("answers all twenty-five questions (no gift question while gifting is off), with unique ids", () => {
    expect(FAQS).toHaveLength(25);
    expect(new Set(FAQS.map((f) => f.id)).size).toBe(25);
    const all = FAQS.map((f) => `${f.q} ${f.a}`).join(" ");
    for (const w of [
      "subscription",
      "book",
      "app",
      "puppies",
      "senior",
      "mobility",
      "backyard",
      "car",
      "photos",
      "refund",
      "code",
      "sync",
    ])
      expect(all.toLowerCase(), w).toContain(w);
  });
  it("never promises unverified features or uses internal status wording", () => {
    const all = FAQS.map((f) => f.a).join(" ");
    expect(all).not.toMatch(/verified at launch|unverified|guarantee/i);
    expect(all).toContain(offer.price);
  });
  it("the unlock summary uses only real questions", () => {
    for (const id of UNLOCK_FAQ_IDS)
      expect(
        FAQS.some((f) => f.id === id),
        id,
      ).toBe(true);
  });
  it("is a real route", () => {
    expect(existsSync("src/routes/faq.tsx")).toBe(true);
  });
});

describe("no fabricated claims on the new commercial pages", () => {
  const files = [
    "src/routes/index.tsx",
    "src/routes/unlock.tsx",
    "src/routes/faq.tsx",
    "src/components/site/faq-content.ts",
    "src/components/site/landing-pages.ts",
    "src/components/site/LandingPage.tsx",
    "src/components/site/PurchasePrompt.tsx",
    "src/components/site/PreviewCards.tsx",
    "src/components/site/keepsake-examples.ts",
  ];
  const BANNED =
    /bestsell|thousands|\brated\b|ratings?\b|limited time|only \d+ left|hurry|act now|testimonial|\breviews?\b|#1\b|money-back guarantee|\b150\b|% off|was \$/i;
  it("contains no bestselling, thousands, rated, limited-time or similar words", () => {
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(BANNED);
  });
  it("keeps the retired slogan out of the new pages", () => {
    for (const f of files) expect(readFileSync(f, "utf8"), f).not.toMatch(/collect\s+adventures/i);
  });
  it("never uses the old premium-gap wording or protected-text words as page copy", () => {
    for (const l of LANDINGS) {
      const t = [l.intro, ...l.sections.flatMap((s) => s.body)].join(" ");
      expect(t).not.toMatch(/\bthe twist\b|reveal text|step 1\b/i);
    }
  });
});

describe("keepsake examples", () => {
  const dir = "public/examples";
  it("has at least seven finished examples, each under 120KB and 1.2MB in total", () => {
    expect(FILTER_EXAMPLES.length).toBeGreaterThanOrEqual(7);
    let total = 0;
    for (const e of FILTER_EXAMPLES) {
      const f = `public${e.src}`;
      expect(existsSync(f), f).toBe(true);
      const size = statSync(f).size;
      expect(size, f).toBeLessThan(120 * 1024);
      total += size;
      expect(e.alt.length).toBeGreaterThan(20);
    }
    expect(total).toBeLessThan(1.2 * 1024 * 1024);
    for (const f of readdirSync(dir)) expect(f).toMatch(/\.(webp|jpe?g|png)$/);
  });
  it("labels the art as a sample, not a customer", () => {
    const t = readFileSync("src/routes/index.tsx", "utf8");
    expect(t).toMatch(/sample/i);
  });
});

describe("purchase prompt", () => {
  beforeEach(() => {
    tracked.length = 0;
  });
  it("is a quiet in-page note that fires purchase_cta_clicked with where", () => {
    render(<PurchasePrompt where="collection" />);
    const a = screen.getByRole("link");
    expect(a.getAttribute("href")).toBe("/unlock");
    expect(document.querySelector('[role="dialog"], dialog')).toBeNull();
    fireEvent.click(a);
    expect(tracked).toEqual([["purchase_cta_clicked", { where: "collection" }]]);
  });
  it("uses the count when given and has no urgency or discount", () => {
    render(<PurchasePrompt where="previews" count={7} />);
    expect(document.body.textContent).toContain("7 of these suit your dog");
    expect(document.body.textContent).toContain(offer.price);
    expect(document.body.textContent).not.toMatch(/hurry|today only|% off|left/i);
  });
});
