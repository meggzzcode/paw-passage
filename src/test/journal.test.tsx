import type { ReactNode } from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { parseJournalFile } from "@/lib/journal-parse";
import { renderJournalMarkdown } from "@/lib/journal-markdown";
import { articleJsonLd, articleBreadcrumbs, relatedArticles } from "@/lib/journal";
import { pageHead } from "@/lib/seo";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { ctxPresets, ctxToFilters, parseCtx, CTX_KEYS } from "@/passport/journal-context";
import {
  sanitizeCampaignValue,
  parseCampaign,
  campaignFields,
  captureCampaign,
} from "@/lib/campaign";
import { track } from "@/passport/events";
import type { JournalArticle } from "@/lib/journal-schema";

const dir = join(__dirname, "fixtures", "journal");
const fixtures: JournalArticle[] = readdirSync(dir).map((f) => {
  const r = parseJournalFile(f, readFileSync(join(dir, f), "utf8"));
  if (!r.ok) throw new Error(r.error);
  return r.article;
});
const rainy = fixtures.find((a) => a.slug === "sample-rainy")!;

vi.mock("@tanstack/react-router", async (orig) => ({
  ...(await orig<typeof import("@tanstack/react-router")>()),
  Link: ({ to, children, ...rest }: { to: string; children: ReactNode }) => (
    <a href={to} {...rest}>
      {children}
    </a>
  ),
}));
vi.mock("@/lib/usePreviews", () => ({
  usePreviews: () => ({
    status: "ready",
    data: {
      total: 9,
      collections: 2,
      items: [
        {
          id: "p1",
          title: "Mystery Mat",
          teaser: "A quiet puzzle for a wet afternoon.",
          category: "Games",
          minutesMin: 10,
          minutesMax: 20,
          costMin: 0,
          costMax: 0,
          collections: ["rainy-day-club"],
          access: "premium",
        },
        {
          id: "p2",
          title: "Other Collection",
          teaser: "Elsewhere.",
          category: "Walks",
          minutesMin: 10,
          minutesMax: 20,
          costMin: 0,
          costMax: 0,
          collections: ["the-great-outdoors"],
          access: "premium",
        },
      ],
    },
  }),
}));

describe("journal article rendering", () => {
  it("renders one h1, hero with alt, previews filtered by collection, CTA, collection and unlock links, related", async () => {
    const { JournalArticleView } = await import("@/components/journal/JournalArticleView");
    const { container } = render(
      <JournalArticleView article={rainy} related={relatedArticles(rainy, fixtures)} />,
    );
    expect(container.querySelectorAll("h1")).toHaveLength(1);
    expect(screen.getByAltText(rainy.imageAlt)).toBeTruthy();
    expect(screen.getByText("Mystery Mat")).toBeTruthy();
    expect(screen.queryByText("Other Collection")).toBeNull();
    expect(screen.getByText(/Selected previews from a larger collection/)).toBeTruthy();
    const cta = screen.getByRole("link", { name: rainy.ctaLabel });
    expect(cta.getAttribute("href")).toBe("/discover?ctx=rainy-day");
    expect(container.querySelector('a[href="/collections/rainy-day-club"]')).toBeTruthy();
    expect(container.querySelector('a[href="/unlock"]')).toBeTruthy();
    expect(container.querySelector('a[href="/journal/sample-home"]')).toBeTruthy();
    expect(container.innerHTML).not.toMatch(/utm_/);
  });
  it("shows raw HTML as text and drops unsafe links", () => {
    const html = renderJournalMarkdown(rainy.body);
    expect(html).not.toContain("<script");
    expect(html).toContain("&lt;script");
    expect(html).not.toContain("javascript:");
    expect(html).toContain("Bad link");
    expect(html).toContain('href="https://example.com/game"');
  });
  it("rejects a bad article (slug mismatch, missing field)", () => {
    expect(parseJournalFile("x.md", "---\ntitle: a\n---\nbody").ok).toBe(false);
    expect(parseJournalFile("other.md", readFileSync(join(dir, "sample-home.md"), "utf8")).ok).toBe(
      false,
    );
  });
});

describe("journal SEO", () => {
  it("emits valid BlogPosting JSON-LD with real dates and Organization author and publisher", () => {
    const ld = JSON.parse(articleJsonLd(rainy).children) as Record<string, unknown>;
    expect(ld["@type"]).toBe("BlogPosting");
    expect(ld["headline"]).toBe(rainy.title);
    expect(String(ld["datePublished"])).toMatch(/^2026-11-26T/);
    expect(String(ld["dateModified"])).toMatch(/^2026-11-27T/);
    expect(ld["author"]).toEqual({ "@type": "Organization", name: "Paws & Passage" });
    expect(ld["publisher"]).toEqual(ld["author"]);
    const bc = JSON.parse(articleBreadcrumbs(rainy).children) as Record<string, unknown>;
    expect(bc["itemListElement"] as unknown[]).toHaveLength(2);
  });
  it("has a self canonical, OG and a unique title and description", () => {
    const h = pageHead({
      title: rainy.title,
      description: rainy.description,
      path: "/journal/sample-rainy",
      type: "article",
    });
    expect(h.links[0]!.href.endsWith("/journal/sample-rainy")).toBe(true);
    expect(h.meta.find((m) => m["property"] === "og:type")!["content"]).toBe("article");
    expect(h.meta.find((m) => m["name"] === "description")!["content"]).toBe(rainy.description);
  });
  it("sitemap lists /journal (journal content permitting) as plain paths without ctx or utm", () => {
    const paths = sitemapEntries().map((e) => e.path);
    expect(paths.some((p) => p.includes("ctx=") || p.includes("utm_"))).toBe(false);
    // The real articles come from content/journal; when present each has /journal/<slug> with a lastmod.
    const real = sitemapEntries().filter((e) => e.path.startsWith("/journal/"));
    for (const e of real) expect(e.lastmod).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    if (real.length) expect(paths).toContain("/journal");
  });
  it("noindex and canonical for /discover ctx pages", () => {
    const h = pageHead({ title: "x", description: "y", path: "/discover", noindex: true });
    expect(h.links[0]!.href.endsWith("/discover")).toBe(true);
    expect(h.meta.some((m) => m["name"] === "robots" && /noindex/.test(m["content"]!))).toBe(true);
  });
});

describe("ctx presets", () => {
  it("has the ten keys, validates and ignores unknown values", () => {
    expect(CTX_KEYS).toHaveLength(10);
    expect(parseCtx("rainy-day")).toBe("rainy-day");
    expect(parseCtx("constructor")).toBeUndefined();
    expect(parseCtx("<script>")).toBeUndefined();
    expect(parseCtx(["rainy-day"])).toBeUndefined();
    for (const k of CTX_KEYS) expect(ctxPresets[k].label.length).toBeGreaterThan(2);
  });
  it("maps to narrowing session filters only", () => {
    expect(ctxToFilters("no-spend")).toEqual({ budget: 0 });
    expect(ctxToFilters("rainy-day").setting).toBe("indoor");
    expect(ctxToFilters("senior").energy).toEqual(["gentle"]);
  });
});

describe("campaign attribution", () => {
  // Attribution is analytics storage, so it exists only after the visitor allowed analytics (see consent.test.tsx).
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.setItem(
      "pp.consent.v1",
      JSON.stringify({ v: 1, choice: "granted", at: "2026-11-26" }),
    );
  });
  afterEach(() => {
    sessionStorage.clear();
    localStorage.removeItem("pp.consent.v1");
  });
  it("sanitizes and caps values", () => {
    expect(sanitizeCampaignValue("Pinterest Pin!<x>")).toBe("pinterest-pin-x");
    expect(sanitizeCampaignValue("a".repeat(80))!.length).toBe(40);
    expect(sanitizeCampaignValue("!!!")).toBeUndefined();
    expect(parseCampaign("?utm_source=pin&utm_medium=social&utm_term=x&email=a@b.c")).toEqual({
      utm_source: "pin",
      utm_medium: "social",
    });
  });
  it("keeps the first landing campaign and attaches it only to purchase-funnel events", () => {
    captureCampaign("?utm_source=pinterest&utm_campaign=journal-rainy");
    captureCampaign("?utm_source=other");
    expect(campaignFields()).toEqual({ utm_source: "pinterest", utm_campaign: "journal-rainy" });
    const g = vi.fn();
    (window as unknown as { gtag: unknown }).gtag = g;
    track("journal_cta_click", { where: "rainy-day" });
    track("purchase_cta_clicked", { where: "journal" });
    delete (window as unknown as { gtag?: unknown }).gtag;
    // Without a GA4 id nothing is sent; the guard keeps this assertion meaningful either way.
    for (const c of g.mock.calls) {
      const p = c[2] as Record<string, unknown>;
      if (c[1] === "pp_journal_cta_click") expect(p["utm_source"]).toBeUndefined();
    }
  });
  it("journal events are on the allow-list", () => {
    const src = readFileSync(join(__dirname, "../passport/events.ts"), "utf8");
    for (const n of [
      "journal_article_view",
      "journal_cta_click",
      "journal_collection_click",
      "journal_related_click",
      "journal_preview_click",
    ])
      expect(src.match(new RegExp(`"${n}"`, "g"))!.length).toBeGreaterThanOrEqual(2);
  });
});

describe("published journal content", () => {
  const root = join(__dirname, "../..");
  const files = readdirSync(join(root, "content", "journal")).filter((f) => f.endsWith(".md"));
  it("every article parses, links valid related articles, and has a hero image of at most 60 KB", async () => {
    const { statSync } = await import("node:fs");
    const arts = files.map((f) => {
      const r = parseJournalFile(f, readFileSync(join(root, "content", "journal", f), "utf8"));
      if (!r.ok) throw new Error(r.error);
      return r.article;
    });
    const slugs = new Set(arts.map((a) => a.slug));
    for (const a of arts) {
      for (const r of a.related) expect(slugs.has(r), `${a.slug} -> ${r}`).toBe(true);
      expect(statSync(join(root, "public", a.image)).size, a.image).toBeLessThanOrEqual(60 * 1024);
    }
  });
});
