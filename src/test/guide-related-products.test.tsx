import { QueryClient } from "@tanstack/react-query";
import { createRouter, createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { renderToString } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { guideSchema, relatedProductProblems } from "@/content/schema";
import { allGuides, loadGuide } from "@/content/guides";
import { products } from "@/content/gear";

const ids = products.map((p) => p.id);

describe("guide relatedProducts validation", () => {
  it("unknown ids and more than 4 ids are reported with a clear message", () => {
    const p = relatedProductProblems([{ slug: "g", relatedProducts: ["kurgo-backseat-barrier", "no-such-product"] }], ids);
    expect(p).toHaveLength(1);
    expect(p[0]).toContain('"no-such-product"');
    expect(p[0]).toContain("content/products.yml");
    expect(relatedProductProblems([{ slug: "g", relatedProducts: ids.slice(0, 5) }], ids)[0]).toMatch(/most allowed is 4/);
  });
  it("the schema caps the field at 4 and defaults to empty", () => {
    const shape = guideSchema.shape.relatedProducts;
    expect(shape.safeParse(["a", "b", "c", "d", "e"]).success).toBe(false);
    expect(shape.parse(undefined)).toEqual([]);
  });
  it("every guide in the repo names only real products", () => {
    expect(relatedProductProblems(allGuides, ids)).toEqual([]);
  });
});

describe("guide page section", () => {
  async function render(slug: string) {
    const router = createRouter({ routeTree, history: createMemoryHistory({ initialEntries: [`/guides/${slug}`] }), context: { queryClient: new QueryClient() } });
    await router.load();
    return renderToString(<RouterProvider router={router} />);
  }
  it("loadGuide carries the field and the page renders the section after the sources and before Keep reading", async () => {
    const slug = "dog-car-safety-harness-and-crate-guide";
    const g = await loadGuide(slug);
    expect(g?.relatedProducts?.length).toBeGreaterThan(0);
    const html = await render(slug);
    expect(html).toContain("Gear for this trip");
    expect(html).toContain("Researched, not tested by us");
    expect(html).toContain('href="/gear"');
    expect(html).toContain("Ruffwear");
    const sources = html.indexOf("Sources and how we researched this");
    const gear = html.indexOf("Gear for this trip");
    const keep = html.lastIndexOf("Keep reading");
    expect(sources).toBeGreaterThan(-1);
    expect(gear).toBeGreaterThan(sources);
    expect(keep).toBeGreaterThan(gear);
    const section = html.slice(html.indexOf('aria-labelledby="related-products"'), keep);
    expect(section).not.toMatch(/\$\s?\d|\bstars?\b/i);
    // No approved affiliate link exists, so no affiliate notice or label inside the section.
    expect(section).not.toMatch(/Affiliate/i);
  });
  it("a guide without products has no section", async () => {
    const other = allGuides.find((x) => !x.relatedProducts?.length && x.status === "published");
    expect(other).toBeTruthy();
    expect(await render(other!.slug)).not.toContain("Gear for this trip");
  });
});
