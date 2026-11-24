import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { legacyCategorySlugs } from "@/content/gear-categories";
import { allGuides, isPublic } from "@/content/guides";

const root = resolve(__dirname, "../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

// Authored content that readers and crawlers see: guide markdown, guide TS sources, town articles.
const contentFiles = [
  ...readdirSync(resolve(root, "content/guides")).map((f) => `content/guides/${f}`),
  ...readdirSync(resolve(root, "src/content/guides"))
    .filter((f) => f.endsWith(".ts") && f !== "index.ts")
    .map((f) => `src/content/guides/${f}`),
  ...readdirSync(resolve(root, "src/content/town-reads"))
    .filter((f) => f.endsWith(".ts"))
    .map((f) => `src/content/town-reads/${f}`),
];

describe("body links do not go through redirects (2026-11-24 SEO crawl)", () => {
  it("never links to a legacy gear category slug, which 301s to the current category", () => {
    for (const file of contentFiles) {
      const text = read(file);
      for (const legacy of Object.keys(legacyCategorySlugs)) {
        expect(text.includes(`](/gear/${legacy})`), `${file} links to /gear/${legacy}`).toBe(false);
      }
    }
  });

  it("never links to the retired tool URLs, which 301 to /tools", () => {
    for (const file of contentFiles) {
      const text = read(file);
      for (const gone of ["cost-calculator", "host-questions", "pet-cost-check"]) {
        expect(text.includes(`](/tools/${gone})`), `${file} links to /tools/${gone}`).toBe(false);
      }
    }
  });
});

describe("dataset links (the 38-manager data page is the main differentiator)", () => {
  it("guides that cite the dataset by name link to it", () => {
    const mustLink = [
      "content/guides/puppy-at-a-vacation-rental.md",
      "content/guides/can-you-leave-a-dog-alone-in-a-vacation-rental.md",
      "content/guides/how-vacation-rental-pet-fees-work.md",
      "content/guides/vacation-rentals-with-no-pet-fee.md",
    ];
    for (const f of mustLink) expect(read(f), f).toContain("](/data/pet-policies)");
  });
});

describe("guide snippets", () => {
  it("no published guide description has a doubled colon or exceeds 160 characters", () => {
    for (const g of allGuides.filter(isPublic)) {
      const d = g.seoDescription ?? "";
      expect(d.split(": ").length - 1, `${g.slug} description colons`).toBeLessThanOrEqual(1);
      expect(d.length, `${g.slug} description length`).toBeLessThanOrEqual(160);
    }
  });
});

describe("things-to-do articles are reachable from an indexable page", () => {
  // Mendocino and Monterey town pages are noindex, nofollow (no listed stays), so the state page is the only
  // crawlable inbound link for their things-to-do articles, which ARE in the sitemap.
  it("the state page links every public town read", () => {
    const src = read("src/routes/destinations.$state.index.tsx");
    expect(src).toContain("getPublicTownRead");
    expect(src).toContain('to="/destinations/$state/$town/things-to-do"');
  });
});
