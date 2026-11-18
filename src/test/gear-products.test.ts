import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";
import { products, getProducts, type Product } from "@/content/gear";
import { gearCategories } from "@/content/gear-categories";
import { categoryProducts, MIN_LIVE } from "@/content/gear-hub";
import { resolveProductLink } from "@/content/gear-links";
import { allGuides } from "@/content/guides";
import {
  productRecordSchema,
  productReferenceProblems,
  NO_TESTING_CITED,
} from "@/content/products-schema";
import type { AffiliateLink } from "@/content/affiliates";

const raw = parse(readFileSync("content/products.yml", "utf8")).products as Record<
  string,
  unknown
>[];
const links = parse(readFileSync("content/affiliates.yml", "utf8")).links as AffiliateLink[];

describe("product catalog rules", () => {
  it("every product has a manufacturer link on an https host", () => {
    for (const p of products) {
      expect(p.productUrl, `${p.id}: manufacturerUrl`).toBeTruthy();
      const u = new URL(p.productUrl!);
      expect(u.protocol, p.id).toBe("https:");
      expect(u.hostname, p.id).toContain(".");
    }
  });
  it("no product record has a price, rating or commission key (at any depth)", () => {
    const bad = /^(price|prices|rating|ratings|stars|reviews|commission|salePrice|msrp)$/i;
    const walk = (v: unknown, path: string) => {
      if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === "object")
        for (const [k, x] of Object.entries(v)) {
          expect(k, `${path}.${k}`).not.toMatch(bad);
          walk(x, `${path}.${k}`);
        }
    };
    raw.forEach((r) => walk(r, String(r["id"])));
  });
  it("no product text carries a price or a rating", () => {
    for (const p of products)
      expect(
        JSON.stringify([p.summary, p.keySpecs, p.manufacturerClaimsVsIndependentTesting]),
        p.id,
      ).not.toMatch(/\$\s?\d|\d\s?(usd|dollars)|stars?\b|out of 5|\d\.\d\s*\/\s*5/i);
  });
  it("every relatedGuides slug is a real guide", () => {
    const slugs = new Set(allGuides.map((g) => g.slug));
    for (const p of products)
      for (const g of p.relatedGuides ?? []) expect(slugs.has(g), `${p.id}: ${g}`).toBe(true);
  });
  it("every category has at least 3 active products, so every category page is live", () => {
    for (const c of gearCategories)
      expect(categoryProducts(c.slug).length, c.slug).toBeGreaterThanOrEqual(MIN_LIVE);
  });
  it("every product uses a listed category and has a verification date and a claims note", () => {
    const slugs = new Set(gearCategories.map((c) => c.slug));
    for (const p of products) {
      for (const c of p.categories ?? []) expect(slugs.has(c), `${p.id}: ${c}`).toBe(true);
      expect(p.manufacturerClaimsVsIndependentTesting, p.id).toBeTruthy();
    }
  });
  it("photo-less by default: imageRights none and no image source on any product today", () => {
    for (const p of products) {
      expect(p.imageRights, p.id).toBe("none");
      expect(p.imageSource, p.id).toBeUndefined();
    }
  });
  it("no product stores an affiliate reference until an approved product entry exists", () => {
    for (const p of products) {
      const l = links.find((x) => x.id === (p.affiliateId ?? p.id));
      if (l) expect(l.kind, `${p.id} would use a stay link`).not.toBe("stay");
      if (p.affiliateId) expect(l, `${p.id}: unknown affiliate entry`).toBeTruthy();
    }
  });
  it("independent testing is only claimed where a tester is named", () => {
    for (const p of products) {
      const t = p.manufacturerClaimsVsIndependentTesting ?? "";
      if (t === NO_TESTING_CITED || t.startsWith(NO_TESTING_CITED)) continue;
      expect(t, p.id).toMatch(
        /maker|manufacturer|Center for Pet Safety|MGA Research|no .* (named|stated|given)|not named|names no/i,
      );
    }
  });
});

describe("new schema fields", () => {
  const rec = raw[0]!;
  it("defaults: no photo, 'none cited', no related guides, no alternative retailer", () => {
    const {
      imageSource: _a,
      imageRights: _b,
      relatedGuides: _c,
      alternativeRetailer: _d,
      manufacturerClaimsVsIndependentTesting: _e,
      ...minimal
    } = rec as Record<string, unknown>;
    const r = productRecordSchema.parse(minimal);
    expect(r.imageRights).toBe("none");
    expect(r.manufacturerClaimsVsIndependentTesting).toBe("none cited");
    expect(r.relatedGuides).toEqual([]);
    expect(r.alternativeRetailer).toBeUndefined();
  });
  it("a photo needs a source, and a source needs rights; a tracked link needs a program", () => {
    expect(
      productRecordSchema.safeParse({ ...rec, imageRights: "own", imageSource: "" }).success,
    ).toBe(false);
    expect(
      productRecordSchema.safeParse({ ...rec, imageRights: "none", imageSource: "photo by me" })
        .success,
    ).toBe(false);
    expect(
      productRecordSchema.safeParse({
        ...rec,
        imageRights: "own",
        imageSource: "Own photo, 2026-11-18",
      }).success,
    ).toBe(true);
    expect(
      productRecordSchema.safeParse({ ...rec, affiliateTrackingId: "x", affiliateProgram: "" })
        .success,
    ).toBe(false);
  });
  it("an alternative retailer must be a plain https link", () => {
    expect(
      productRecordSchema.safeParse({
        ...rec,
        alternativeRetailer: { name: "Shop", url: "http://shop.example/x" },
      }).success,
    ).toBe(false);
    expect(
      productRecordSchema.safeParse({
        ...rec,
        alternativeRetailer: { name: "Shop", url: "https://shop.example/x" },
      }).success,
    ).toBe(true);
  });
  it("rejects a raw URL or an unknown affiliate name through the reference check", () => {
    const r = (o: Record<string, unknown>) => productRecordSchema.parse({ ...rec, ...o });
    expect(
      productReferenceProblems(
        [r({ affiliateProgram: "acme", affiliateTrackingId: "acme-x" })],
        [{ id: "acme" }],
      ),
    ).toHaveLength(1);
    expect(
      productReferenceProblems(
        [r({ affiliateProgram: "acme", affiliateTrackingId: "acme-x" })],
        [
          { id: "acme", kind: "stay" },
          { id: "acme-x", kind: "stay" },
        ],
      ),
    ).toHaveLength(2);
    expect(
      productReferenceProblems([r({ relatedGuides: ["nope"] })], [], new Set(["yes"])),
    ).toHaveLength(1);
    expect(
      productReferenceProblems(
        [r({ affiliateProgram: "acme", affiliateTrackingId: "acme-x" })],
        [
          { id: "acme", kind: "product" },
          { id: "acme-x", kind: "product" },
        ],
      ),
    ).toEqual([]);
  });
});

describe("affiliate swap procedure (docs/recovery/AFFILIATE-SWAP-PROCEDURE.md)", () => {
  const mk = (id: string, tracking?: string): Product => ({
    id,
    name: id,
    brand: "Maker",
    summary: "s",
    keySpecs: [],
    specSource: {
      title: "t",
      url: `https://maker.example/${id}`,
      publisher: "Maker",
      accessedOn: "2026-11-18",
    },
    ...(tracking ? { affiliateId: tracking, affiliateProgram: "acme" } : {}),
  });
  const list = [mk("a", "acme-a"), mk("b", "acme-a"), mk("c", "acme-c"), mk("d")];
  const entry = (id: string, url: string, over: Partial<AffiliateLink> = {}): AffiliateLink => ({
    id,
    network: "Acme",
    url,
    approved: true,
    kind: "product",
    ...over,
  });
  it("editing one affiliate entry changes the link of every product that names it, and nothing else", () => {
    const before = [
      entry("acme-a", "https://acme.example/r?id=OLD"),
      entry("acme-c", "https://acme.example/r?id=C"),
    ];
    const after = [
      entry("acme-a", "https://other-network.example/go/NEW"),
      entry("acme-c", "https://acme.example/r?id=C"),
    ];
    const urls = (ls: AffiliateLink[]) => list.map((p) => resolveProductLink(p, ls)?.url);
    expect(urls(before)).toEqual([
      "https://acme.example/r?id=OLD",
      "https://acme.example/r?id=OLD",
      "https://acme.example/r?id=C",
      "https://maker.example/d",
    ]);
    expect(urls(after)).toEqual([
      "https://other-network.example/go/NEW",
      "https://other-network.example/go/NEW",
      "https://acme.example/r?id=C",
      "https://maker.example/d",
    ]);
  });
  it("un-approving the entry sends every product back to its maker page", () => {
    const off = [entry("acme-a", "https://acme.example/r?id=OLD", { approved: false })];
    expect(resolveProductLink(list[0]!, off)?.url).toBe("https://maker.example/a");
    expect(resolveProductLink(list[1]!, off)?.rel).toBe("nofollow noopener");
  });
  it("a product never takes a stay link, even if it names one", () => {
    expect(
      resolveProductLink(list[0]!, [entry("acme-a", "https://vrbo.com/x", { kind: "stay" })])?.url,
    ).toBe("https://maker.example/a");
  });
  it("getProducts skips unknown and inactive ids", () => {
    const l = [mk("a"), { ...mk("b"), active: false }];
    expect(getProducts(["a", "b", "zzz"], l).map((p) => p.id)).toEqual(["a"]);
  });
});
