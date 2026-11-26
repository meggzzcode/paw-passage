import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { legacyCategorySlugs } from "@/content/gear-categories";
import { allGuides, isPublic } from "@/content/guides";

const root = resolve(__dirname, "../..");
const read = (rel: string) => readFileSync(resolve(root, rel), "utf8");

// Authored content that readers and crawlers see: guide markdown.
const contentFiles = [
  ...readdirSync(resolve(root, "content/guides")).map((f) => `content/guides/${f}`),
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

  it("never links to the retired tool URLs, which are gone (410)", () => {
    for (const file of contentFiles) {
      const text = read(file);
      for (const gone of [
        "checklist",
        "cost-calculator",
        "host-questions",
        "pet-cost-check",
        "will-my-dog-be-accepted",
      ]) {
        expect(text.includes(`](/tools/${gone})`), `${file} links to /tools/${gone}`).toBe(false);
      }
    }
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
