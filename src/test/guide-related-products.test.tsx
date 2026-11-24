import { QueryClient } from "@tanstack/react-query";
import { createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { guideSchema, relatedProductProblems } from "@/content/schema";
import { allGuides, isPublic, loadGuide } from "@/content/guides";
import { pickIdsInBody } from "@/lib/product-display";
import { products, getProducts } from "@/content/gear";
import { isMonetized } from "@/content/affiliate-usage";

const ids = products.map((p) => p.id);

describe("guide relatedProducts validation", () => {
  it("unknown ids and more than 4 ids are reported with a clear message", () => {
    const p = relatedProductProblems(
      [{ slug: "g", relatedProducts: ["kurgo-backseat-barrier", "no-such-product"] }],
      ids,
    );
    expect(p).toHaveLength(1);
    expect(p[0]).toContain('"no-such-product"');
    expect(p[0]).toContain("content/products.yml");
    expect(
      relatedProductProblems([{ slug: "g", relatedProducts: ids.slice(0, 7) }], ids)[0],
    ).toMatch(/most allowed is 6/);
  });
  it("the schema caps the field at 6 and defaults to empty", () => {
    const shape = guideSchema.shape.relatedProducts;
    expect(shape.safeParse(["a", "b", "c", "d", "e", "f", "g"]).success).toBe(false);
    expect(shape.parse(undefined)).toEqual([]);
  });
  it("every guide in the repo names only real products", () => {
    expect(relatedProductProblems(allGuides, ids)).toEqual([]);
  });
});

describe("guide page section", () => {
  async function render(slug: string) {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: [`/guides/${slug}`] }),
      context: { queryClient: new QueryClient() },
    });
    await router.load();
    return renderToString(<RouterProvider router={router} />);
  }
  it("loadGuide carries the field and the page renders the section after the sources and before Keep reading", async () => {
    // Products that already have a pick card in the article body are not repeated in this block.
    const cand = allGuides.find((x) => {
      const body = pickIdsInBody(x.body);
      return (
        isPublic(x) &&
        getProducts(x.relatedProducts ?? [])
          .filter(isMonetized)
          .slice(0, 4)
          .some((p) => !body.includes(p.id) && !(x.gear ?? []).some((y) => y.productId === p.id))
      );
    });
    if (!cand) {
      // Every guide's gear is already shown as pick cards in its body, so no guide repeats it in a block.
      const html = await render("dog-car-safety-harness-and-crate-guide");
      expect(html).not.toContain("Gear for this trip");
      return;
    }
    const slug = cand.slug;
    const g = await loadGuide(slug);
    expect(g?.relatedProducts?.length).toBeGreaterThan(0);
    const html = await render(slug);
    expect(html).toContain("Gear for this trip");
    expect(html).not.toContain("not tested by us");
    expect(html).toContain('href="/gear"');
    // The section lists only products that can earn; its first card names that product's brand.
    const inBody = pickIdsInBody(g!.body);
    const shown = getProducts(g!.relatedProducts ?? [])
      .filter(isMonetized)
      .slice(0, 4)
      .filter((p) => !inBody.includes(p.id) && !(g!.gear ?? []).some((y) => y.productId === p.id));
    expect(shown.length).toBeGreaterThan(0);
    expect(html).toContain(shown[0]!.brand);
    const sources = html.indexOf("Sources and how we researched this");
    const gear = html.indexOf("Gear for this trip");
    const keep = html.lastIndexOf("Keep reading");
    expect(sources).toBeGreaterThan(-1);
    expect(gear).toBeGreaterThan(sources);
    expect(keep).toBeGreaterThan(gear);
    const section = html.slice(html.indexOf('aria-labelledby="related-products"'), keep);
    expect(section).not.toMatch(/\$\s?\d|\bstars?\b/i);
    // A card renders only for a product that can earn, so the section always carries its per-button affiliate label; the page-level notice carries the Amazon sentence once.
    expect(section).toMatch(/Affiliate link/i);
    expect(html).toContain("As an Amazon Associate I earn from qualifying purchases.");
  });
  it("every published guide carries at least one product that can earn", () => {
    for (const g of allGuides.filter((x) => x.status === "published")) {
      const earning = getProducts(g.relatedProducts ?? []).filter(isMonetized);
      expect(earning.length, g.slug).toBeGreaterThan(0);
    }
  });
});
