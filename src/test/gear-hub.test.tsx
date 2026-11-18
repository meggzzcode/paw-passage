import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import { routeTree } from "@/routeTree.gen";
import { products, type Product } from "@/content/gear";
import { gearCategories } from "@/content/gear-categories";
import {
  categoryProducts,
  categoryIsLive,
  liveCategories,
  hasGear,
  MIN_LIVE,
} from "@/content/gear-hub";
import { relFor, resolveProductLink } from "@/content/gear-links";
import type { AffiliateLink } from "@/content/affiliates";
import {
  gearCategorySlugs,
  productRecordObject,
  productRecordSchema,
  productsSchema,
} from "@/content/products-schema";
import { sitemapEntries, staticPaths } from "@/lib/sitemap-entries";
import { GearDisclosure } from "@/components/site/GearHubCards";
import { Route as hub } from "@/routes/gear.index";
import { Route as category } from "@/routes/gear.$category";

type HeadResult = { meta: Record<string, string>[]; scripts?: unknown[] };

const base: Product = {
  id: "some-product",
  name: "Thing",
  brand: "Maker",
  summary: "s",
  keySpecs: [],
  specSource: {
    title: "t",
    url: "https://maker.example/thing",
    publisher: "Maker",
    accessedOn: "2026-11-16",
  },
};
const link = (o: Partial<AffiliateLink>): AffiliateLink => ({
  id: "some-product",
  network: "Amazon Associates",
  url: "https://www.amazon.com/dp/X?tag=t",
  approved: true,
  kind: "product",
  ...o,
});

describe("gear data", () => {
  it("every product has a valid category, a verification date not in the future, and no price/rating/testing claim", () => {
    for (const p of products) {
      expect(p.categories?.length, p.id).toBeGreaterThan(0);
      for (const c of p.categories ?? []) expect(gearCategorySlugs, `${p.id}: ${c}`).toContain(c);
      expect(p.lastVerified!, p.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(p.lastVerified! <= new Date().toISOString().slice(0, 10), p.id).toBe(true);
      expect(JSON.stringify(p), p.id).not.toMatch(
        /\$\s?\d|stars?\b|rated \d|best price|\bwe (have )?(tested|tried)|hands-on/i,
      );
    }
  });
  it("category slugs are unique and a category is live only with enough active products", () => {
    expect(new Set(gearCategories.map((c) => c.slug)).size).toBe(gearCategories.length);
    for (const c of gearCategories)
      expect(categoryIsLive(c.slug)).toBe(categoryProducts(c.slug).length >= MIN_LIVE);
    expect(liveCategories().map((c) => c.slug)).toContain("beach-vacations");
    expect(hasGear()).toBe(true);
  });
  it("inactive products are left out of categories", () => {
    const list = products.map((p, i) => (i === 0 ? { ...p, active: false } : p));
    expect(categoryProducts(products[0]!.categories![0]!, list).map((p) => p.id)).not.toContain(
      products[0]!.id,
    );
  });
  it("the schema rejects price and commission fields and stay links on products", () => {
    const rec = parse(readFileSync("content/products.yml", "utf8")).products[0];
    expect(productRecordSchema.safeParse(rec).success).toBe(true);
    expect(productRecordSchema.safeParse({ ...rec, price: "9" }).success).toBe(false);
    expect(productRecordSchema.safeParse({ ...rec, commission: "5%" }).success).toBe(false);
    expect(productsSchema.safeParse({ products: [{ ...rec, categories: [] }] }).success).toBe(
      false,
    );
  });
  it("the Pages CMS Products form has exactly the schema's fields and categories", () => {
    const cfg = parse(readFileSync(".pages.yml", "utf8")) as {
      content: {
        name: string;
        path?: string;
        fields: {
          name: string;
          fields?: { name: string; options?: { values: { value: string }[] } }[];
        }[];
      }[];
    };
    const entry = cfg.content.find((c) => c.name === "products")!;
    expect(entry.path).toBe("content/products.yml");
    const fields = entry.fields[0]!.fields!;
    expect(fields.map((f) => f.name).sort()).toEqual(Object.keys(productRecordObject.shape).sort());
    expect(
      fields
        .find((f) => f.name === "categories")!
        .options!.values.map((v) => v.value)
        .sort(),
    ).toEqual([...gearCategorySlugs].sort());
  });
});

describe("link fallback", () => {
  it("approved affiliate link wins, with sponsored rel and no noreferrer", () => {
    const r = resolveProductLink({ ...base, retailerUrl: "https://shop.example/x" }, [link({})])!;
    expect(r.kind).toBe("affiliate");
    expect(r.rel).toBe("sponsored nofollow noopener");
    expect(r.rel).not.toMatch(/noreferrer/);
  });
  it("an unapproved link, or a stay link, is never used for a product", () => {
    expect(resolveProductLink(base, [link({ approved: false })])!.kind).toBe("manufacturer");
    expect(resolveProductLink(base, [link({ kind: "stay" })])!.kind).toBe("manufacturer");
  });
  it("then the manufacturer, then a plain retailer, then nothing; plain links are never sponsored", () => {
    const pdf = {
      ...base,
      specSource: { ...base.specSource, url: "https://maker.example/manual.pdf" },
    };
    const m = resolveProductLink(base, [])!;
    expect(m.kind).toBe("manufacturer");
    expect(m.rel).toBe("nofollow noopener");
    const r = resolveProductLink(
      { ...pdf, retailerUrl: "https://shop.example/x", retailerName: "Shop" },
      [],
    )!;
    expect(r).toMatchObject({
      kind: "retailer",
      url: "https://shop.example/x",
      label: "See it at Shop",
    });
    expect(r.rel).not.toContain("sponsored");
    expect(resolveProductLink(pdf, [])).toBeUndefined();
  });
  it("relFor: affiliate sponsored, plain nofollow, never noreferrer", () => {
    expect(relFor("affiliate")).toContain("sponsored");
    for (const k of ["affiliate", "manufacturer", "retailer"] as const)
      expect(relFor(k)).not.toContain("noreferrer");
    expect(relFor("manufacturer")).toBe("nofollow noopener");
  });
  it("every real product today resolves to a plain, non-sponsored link", () => {
    for (const p of products) {
      const r = resolveProductLink(p);
      if (r) expect(r.rel, p.id).not.toContain("sponsored");
    }
  });
});

describe("disclosure", () => {
  it("renders nothing when no approved affiliate link renders", () => {
    expect(renderToStaticMarkup(<GearDisclosure products={products} />)).toBe("");
  });
});

describe("routes, meta and sitemap", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
  it("/gear and /gear/<category> match real pages; other paths are unchanged", () => {
    expect(router.matchRoutes("/gear").at(-1)?.routeId).toBe("/gear/");
    expect(router.matchRoutes("/gear/road-trips").at(-1)?.routeId).toBe("/gear/$category");
    expect(router.matchRoutes("/guides").at(-1)?.routeId).toBe("/guides/");
    expect(router.matchRoutes("/methodology").at(-1)?.routeId).toBe("/methodology");
  });
  it("unknown or empty categories 404 in the loader", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const load = (slug: string) => (category.options as any).loader({ params: { category: slug } });
    expect(() => load("nope")).toThrow();
    expect(() => load("multiple-dogs")).toThrow();
    expect(load("road-trips")).toEqual({ slug: "road-trips" });
  });
  it("meta names no Expedia Group brand and no product brand, and stays short", () => {
    const heads = [
      (hub.options as unknown as { head: () => HeadResult }).head(),
      ...liveCategories().map((c) =>
        (category.options as unknown as { head: (a: unknown) => HeadResult }).head({
          loaderData: { slug: c.slug },
          params: { category: c.slug },
        }),
      ),
    ];
    const brands = new Set(products.map((p) => p.brand.toLowerCase()));
    for (const h of heads) {
      const t = JSON.stringify(h.meta);
      expect(t).not.toMatch(/vrbo|expedia|hotels\.com|homeaway|airbnb/i);
      for (const b of brands)
        expect(t, b).not.toMatch(
          new RegExp(`\\b${b.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i"),
        );
      expect(JSON.stringify(h.scripts ?? [])).not.toMatch(
        /aggregateRating|"review"|"offers"|"price"/,
      );
      const title = h.meta.find((m) => m["property"] === "og:title")?.["content"] as string;
      expect(title.length).toBeLessThanOrEqual(60);
    }
  });
  it("the sitemap lists the hub, live category pages, methodology and corrections, and no other /gear path", () => {
    const paths = sitemapEntries().map((e) => e.path);
    for (const p of ["/gear", "/methodology", "/corrections"]) expect(paths).toContain(p);
    for (const c of liveCategories()) expect(paths).toContain(`/gear/${c.slug}`);
    expect(paths.filter((p) => p.startsWith("/gear/")).sort()).toEqual(
      liveCategories()
        .map((c) => `/gear/${c.slug}`)
        .sort(),
    );
    expect(new Set(paths).size).toBe(paths.length);
    expect(staticPaths).toContain("/tools");
  });
});
