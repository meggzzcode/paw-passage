import { describe, expect, it } from "vitest";
import { allGuides, isPublic } from "@/content/guides";

const tools = ["checklist", "will-my-dog-be-accepted", "packing-list"];
// Published guides name their sources with plain publisher links (scripts/remove-citation-numbers.mjs): no numbered
// markers, every source listed in the Sources list at the end of the page (rendered from the frontmatter), and any inline
// link to an outside site pointing at one of the guide's own sources.
const published = (g: (typeof allGuides)[number]) => isPublic(g);
const text = (g: (typeof allGuides)[number]) => g.body + "\n" + g.faqs.map((f) => f.a).join("\n");
const sentences = (s: string) => s.split(/(?<=[.!?])\s+(?=[A-Z"([*])/);
// ([Airbnb](https://...)) or ([Airbnb](https://...), [Vrbo](https://...))
const PAREN = /\(\[[^\]]+\]\(https?:[^)\s]+\)(?:, \[[^\]]+\]\(https?:[^)\s]+\))*\)/g;
const PAREN_LINK = /\[[^\]]+\]\(https?:[^)\s]+\)/g;

describe.each(allGuides.map((g) => [g.slug, g] as const))("guide content: %s", (_slug, g) => {
  it("shows no numbered [[n]] source markers in a published guide", () => {
    if (!published(g)) return;
    expect(text(g).match(/\[\[\d+\]\]/g) ?? [], `${g.slug}: numbered markers`).toEqual([]);
  });
  it("every source is listed in the guide's Sources list (title, publisher, URL, date read)", () => {
    if (!published(g)) return;
    // The Sources list at the end of the page is rendered from the frontmatter `sources` (SourcesList), so a source
    // is listed when it has everything the list prints. Inline links in the text are optional and light.
    const incomplete = g.sources
      .map((s, i) => [i + 1, s] as const)
      .filter(
        ([, s]) =>
          !s.title?.trim() || !s.publisher?.trim() || !/^https?:\/\//.test(s.url) || !s.accessedOn,
      )
      .map(([n]) => n);
    expect(incomplete, `${g.slug}: sources the list cannot show in full`).toEqual([]);
    expect(new Set(g.sources.map((s) => s.url)).size, `${g.slug}: duplicate source URLs`).toBe(
      g.sources.length,
    );
  });
  it("every inline link to an external site goes to one of the guide's own sources", () => {
    if (!published(g)) return;
    const sources = new Set(g.sources.map((s) => s.url));
    const foreign = [...text(g).matchAll(/\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g)]
      .map((m) => m[1]!)
      .filter((u) => !sources.has(u));
    expect(foreign, `${g.slug}: inline links that are not in the frontmatter sources`).toEqual([]);
  });
  it("a parenthetical publisher link names the publisher, never a number or 'source'", () => {
    if (!published(g)) return;
    const bad = [...g.body.matchAll(PAREN)]
      .flatMap((m) => [...m[0].matchAll(/\[([^\]]+)\]/g)].map((x) => x[1]!))
      .filter((label) => /^\d+$/.test(label) || /^(source|link|here)$/i.test(label));
    expect(bad, `${g.slug}: parenthetical labels`).toEqual([]);
  });
  it("no more than 2 parenthetical publisher links stand in one sentence", () => {
    if (!published(g)) return;
    const over = g.body
      .split("\n")
      .flatMap(sentences)
      .filter((s) => (s.match(PAREN)?.join("").match(PAREN_LINK) ?? []).length > 2);
    expect(over, `${g.slug}: sentences with 3+ parenthetical links`).toEqual([]);
  });
  it("table rows carry no source links or markers (sources sit in a line under the table)", () => {
    if (!published(g)) return;
    const sources = new Set(g.sources.map((s) => s.url));
    const bad = g.body
      .split("\n")
      .filter(
        (l) =>
          /^\s*\|/.test(l) &&
          (/\[\[\d+\]\]/.test(l) ||
            [...l.matchAll(/\]\((https?:[^)\s]+)\)/g)].some((m) => sources.has(m[1]!))),
      );
    expect(bad, `${g.slug}: source links inside table rows`).toEqual([]);
  });
  it("internal links resolve", () => {
    // Retired guides keep a 301 to their replacement (netlify.toml), so a leftover link to one still resolves.
    const slugs = new Set([
      ...allGuides.map((x) => x.slug),
      "vacation-rentals-with-no-dog-weight-limit",
    ]);
    const links = [...text(g).matchAll(/\]\((\/[^)\s#?]*)\)/g)].map((m) => m[1]!);
    const broken = links.filter((l) =>
      l.startsWith("/guides/")
        ? !slugs.has(l.slice(8))
        : l.startsWith("/tools/")
          ? !tools.includes(l.slice(7))
          : false,
    );
    expect(broken).toEqual([]);
    for (const r of g.relatedGuides) expect(slugs.has(r), `relatedGuides: ${r}`).toBe(true);
  });
  it("has no leftover draft wording or stale dated closure notices", () => {
    expect(text(g)).not.toMatch(/for this draft|full-page review (is )?outstanding|TODO|TBD/i);
  });
  it("has at least five competitors, each with a check date", () => {
    if (!isPublic(g)) return; // drafts and unapproved articles (like the CMS test articles) are still being written
    expect(g.research.competitors.length).toBeGreaterThanOrEqual(5);
    for (const c of g.research.competitors) expect(c.checkedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
  it("SEO fields fit", () => {
    expect(g.seoTitle.length).toBeLessThanOrEqual(60);
    expect(g.seoDescription.length).toBeLessThanOrEqual(160);
  });
});

import { getProduct, products } from "@/content/gear";
import { affiliateLinks } from "@/content/affiliates";

describe("gear guides and affiliate products", () => {
  const gearGuides = allGuides.filter((g) => g.category === "Gear");
  it("every product has a readable source and no price or rating", () => {
    for (const p of products) {
      expect(p.specSource.url, p.id).toMatch(/^https:\/\//);
      expect(JSON.stringify(p), `${p.id}: prices/ratings must not be stored`).not.toMatch(
        /\$\s?\d|stars?\b|rated \d|best price/i,
      );
    }
  });
  it("product ids are unique", () => {
    expect(new Set(products.map((p) => p.id)).size).toBe(products.length);
  });
  it("gear guides only pick products that exist, and never state prices or testing", () => {
    for (const g of gearGuides) {
      expect((g.gear ?? []).length, `${g.slug} needs picks`).toBeGreaterThanOrEqual(3);
      for (const pick of g.gear ?? [])
        expect(getProduct(pick.productId), `${g.slug}: ${pick.productId}`).toBeDefined();
      const all = g.body + JSON.stringify(g.gear) + JSON.stringify(g.faqs);
      expect(all, `${g.slug}: no static prices`).not.toMatch(/\$\s?\d/);
      expect(all, `${g.slug}: must not claim we tested`).not.toMatch(
        /\bwe (have )?(tested|tried|used|reviewed it)|our testing|hands-on/i,
      );
    }
  });
  it("a product's affiliateId must exist in affiliates.ts and be an approved product link to show a button", () => {
    for (const p of products)
      if (p.affiliateId)
        expect(
          affiliateLinks.some((l) => l.id === p.affiliateId),
          `${p.id}: unknown affiliateId`,
        ).toBe(true);
  });
});

describe("publisher names used for source links", () => {
  it("shortens a few long names with a small override map and strips notes", async () => {
    const { publisherDisplayName } = await import("@/content/citations");
    expect(publisherDisplayName("Cornell University College of Veterinary Medicine")).toBe(
      "Cornell Vet",
    );
    expect(publisherDisplayName("U.S. Centers for Disease Control and Prevention")).toBe("CDC");
    expect(publisherDisplayName("ASPCA (2018-12-04)")).toBe("ASPCA");
    expect(publisherDisplayName("Animals (Basel), 2022")).toBe("Animals (Basel)");
    expect(publisherDisplayName("Airbnb")).toBe("Airbnb");
  });
});
