import { describe, it, expect } from "vitest";
import { destinations } from "@/content/destinations";
import { townActivities, getTownActivities } from "@/content/town-activities";
import {
  allTownReads,
  getTownRead,
  townReadIsPublic,
  townReadPath,
  townReadWordCount,
} from "@/content/town-reads";
import { allGuides } from "@/content/guides";
import { getProduct } from "@/content/gear";
import { isMonetized } from "@/content/affiliate-usage";
import { pickIds } from "@/content/schema";
import { sitemapEntries } from "@/lib/sitemap-entries";

const httpsHost = (u: string) => {
  const url = new URL(u);
  return url.protocol === "https:" && url.hostname.includes(".");
};
const date = /^\d{4}-\d{2}-\d{2}$/;

describe("town activities", () => {
  it("every destination town has 4 to 7 sourced activities and nothing else is keyed", () => {
    const keys = destinations.flatMap((d) => d.towns.map((t) => `${d.slug}/${t.slug}`));
    expect(Object.keys(townActivities).sort()).toEqual([...keys].sort());
    for (const d of destinations)
      for (const t of d.towns) {
        const n = getTownActivities(d.slug, t.slug).length;
        expect(n, `${d.slug}/${t.slug}`).toBeGreaterThanOrEqual(4);
        expect(n, `${d.slug}/${t.slug}`).toBeLessThanOrEqual(7);
      }
  });
  it("each activity has a rule, an https source on a real host and a read date", () => {
    for (const [key, list] of Object.entries(townActivities)) {
      const names = new Set<string>();
      for (const a of list) {
        const id = `${key}: ${a.name}`;
        expect(a.name.trim(), id).not.toBe("");
        expect(names.has(a.name), `${id} duplicated`).toBe(false);
        names.add(a.name);
        expect(a.summary.trim(), id).not.toBe("");
        expect(a.dogNote.trim(), id).not.toBe("");
        expect(a.source.publisher.trim(), id).not.toBe("");
        expect(httpsHost(a.source.url), id).toBe(true);
        if (a.alsoSource) expect(httpsHost(a.alsoSource.url), id).toBe(true);
        expect(a.checkedOn, id).toMatch(date);
      }
    }
  });
});

describe("town companion articles", () => {
  it("every town has one, and none is a guide", () => {
    for (const d of destinations)
      for (const t of d.towns)
        expect(getTownRead(d.slug, t.slug), `${d.slug}/${t.slug}`).toBeTruthy();
    expect(allGuides.some((g) => g.slug.startsWith("dog-friendly-things-to-do"))).toBe(false);
  });
  it("meets the metadata, length, source-link and product rules", () => {
    for (const r of allTownReads) {
      const id = `${r.state}/${r.town}`;
      expect(r.seoTitle.length, id).toBeLessThanOrEqual(60);
      expect(r.seoDescription.length, id).toBeGreaterThanOrEqual(120);
      expect(r.seoDescription.length, id).toBeLessThanOrEqual(160);
      const words = townReadWordCount(r.body);
      expect(words, `${id} words`).toBeGreaterThanOrEqual(500);
      expect(words, `${id} words`).toBeLessThanOrEqual(800);
      for (const s of r.sources) expect(r.body, `${id} ${s.url}`).toContain(s.url);
      expect(r.body, id).not.toMatch(/\[\[\d+\]\]/);
      expect(r.body, id).toContain(`/destinations/${r.state}/${r.town}`);
      expect(r.body, id).not.toMatch(/pet-cost|cost-calculator|host-questions/);
      const picks = pickIds(r.body).map((p) => getProduct(p));
      expect(picks.length, id).toBe(1);
      expect(
        picks.every((p) => !!p && p.active && isMonetized(p)),
        id,
      ).toBe(true);
      expect(townReadIsPublic(r), id).toBe(true);
      for (const g of r.relatedGuides)
        expect(
          allGuides.some((x) => x.slug === g),
          `${id} ${g}`,
        ).toBe(true);
    }
  });
  it("articles are in the sitemap under the town, not under /guides", () => {
    const paths = sitemapEntries().map((e) => e.path);
    for (const r of allTownReads) expect(paths).toContain(townReadPath(r.state, r.town));
    expect(paths.some((p) => p.startsWith("/guides/dog-friendly-things"))).toBe(false);
  });
});
