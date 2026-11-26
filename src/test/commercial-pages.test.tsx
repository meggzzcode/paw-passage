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

const PRIORITY = [
  "/things-to-do-with-your-dog",
  "/indoor-dog-adventures",
  "/doggy-date-ideas",
  "/puppy-bucket-list",
  "/senior-dog-adventures",
  "/free-things-to-do-with-your-dog",
  "/weekend-adventure-finder",
];

describe("landing pages", () => {
  it("covers the seven priority needs, each with a route file and a sitemap entry", () => {
    expect(LANDINGS.map((l) => l.path).sort()).toEqual([...PRIORITY].sort());
    const sm = sitemapEntries().map((e) => e.path);
    for (const l of LANDINGS) {
      expect(existsSync(`src/routes/${l.slug}.tsx`), l.slug).toBe(true);
      expect(sm, l.path).toContain(l.path);
    }
    expect(sm).toContain("/faq");
    expect(sm.some((p) => p.includes("?"))).toBe(false);
  });
  it("has real guidance on each page (500+ words, several sections)", () => {
    for (const l of LANDINGS) {
      expect(landingWords(l), l.slug).toBeGreaterThanOrEqual(500);
      expect(l.sections.length, l.slug).toBeGreaterThanOrEqual(5);
    }
  });
  it("has accurate, unique metadata and a canonical for each page", () => {
    const titles = new Set<string>();
    for (const l of LANDINGS) {
      const h = landingHead(l.slug);
      const title = h.meta.find((m) => "title" in m)?.["title"] ?? "";
      expect(title.length, title).toBeLessThanOrEqual(60);
      expect(title.length).toBeGreaterThan(10);
      titles.add(title);
      const desc = h.meta.find((m) => m["name"] === "description")?.["content"] ?? "";
      expect(desc.length).toBeGreaterThan(70);
      expect(desc.length).toBeLessThanOrEqual(155);
      expect(h.links[0]?.href.endsWith(l.path)).toBe(true);
      expect(h.meta.some((m) => m["name"] === "robots")).toBe(false);
    }
    expect(titles.size).toBe(LANDINGS.length);
  });
  it("links only to real internal addresses and never to a filter combination", () => {
    for (const l of LANDINGS) {
      expect(l.related.length).toBeGreaterThanOrEqual(3);
      for (const r of l.related) {
        expect(r.to.startsWith("/"), r.to).toBe(true);
        expect(r.to).not.toContain("?");
      }
    }
  });
  it("explains that the free adventure differs from paid access", () => {
    const l = LANDINGS.find((x) => x.slug === "free-things-to-do-with-your-dog")!;
    const t = JSON.stringify(l.sections);
    expect(t).toMatch(/separate from the paid library/);
    expect(t).toMatch(/cost nothing extra/);
  });
});

describe("faq", () => {
  it("answers all twenty-one questions, with unique ids", () => {
    expect(FAQS).toHaveLength(21);
    expect(new Set(FAQS.map((f) => f.id)).size).toBe(21);
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
  it("has at least eight finished examples, each under 120KB and 1.2MB in total", () => {
    expect(FILTER_EXAMPLES.length).toBeGreaterThanOrEqual(8);
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
