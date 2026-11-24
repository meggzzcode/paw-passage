import { QueryClient } from "@tanstack/react-query";
import { createMemoryHistory, createRouter, RouterContextProvider } from "@tanstack/react-router";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { products, type Product } from "@/content/gear";
import { GearProductCard } from "@/components/site/GearProductCard";

const router = createRouter({
  routeTree,
  history: createMemoryHistory({ initialEntries: ["/gear"] }),
  context: { queryClient: new QueryClient() } as never,
});
const render = (el: React.ReactElement) =>
  renderToStaticMarkup(<RouterContextProvider router={router}>{el}</RouterContextProvider>);

const base: Product = {
  id: "x-product",
  name: "Thing Ramp",
  brand: "Maker",
  summary: "A folding ramp.",
  cardSpecs: ["A", "B", "C", "D"],
  keySpecs: ["Spec one"],
  specSource: {
    title: "Page",
    url: "https://maker.example/p",
    publisher: "Maker",
    accessedOn: "2026-11-16",
  },
  categories: ["ramps-and-steps"],
  lastVerified: "2026-11-16",
};
const live = products.find((p) => p.active !== false)!;

describe("GearProductCard", () => {
  it("uses the requested heading level, a native details panel and decorative icons", () => {
    for (const level of [2, 3, 4] as const) {
      const html = render(<GearProductCard product={base} headingLevel={level} />);
      expect(html).toContain(`<h${level} class="gearcard-name"`);
    }
    const html = render(<GearProductCard product={base} />);
    expect(html).toMatch(/<details[^>]*><summary>Specs, fit &amp; sources/);
    expect(html).not.toMatch(/<details[^>]* open/);
    expect(html).toContain('aria-label="Maker Thing Ramp"');
    // every svg is decorative
    for (const svg of html.match(/<svg[^>]*>/g) ?? []) expect(svg).toContain('aria-hidden="true"');
    expect(html).not.toMatch(/<img/);
  });
  it("shows at most three facts", () => {
    const html = render(<GearProductCard product={base} />);
    expect(html.match(/class="gearcard-fact"/g)).toHaveLength(3);
  });
  it("has no per-card affiliate label, price or stock text", () => {
    const html = render(<GearProductCard product={live} />);
    expect(html).not.toMatch(
      /Affiliate link|may earn a commission|Check the current price|in stock|best seller|top rated/i,
    );
    expect(html).not.toMatch(/\$\d/);
  });
  it("puts the buy button before the details link, and the details panel last", () => {
    const html = render(<GearProductCard product={live} />);
    const btn = html.indexOf("gearcard-cta");
    const quiet = html.indexOf("Details and specs");
    const panel = html.indexOf("Specs, fit &amp; sources");
    if (quiet > -1) expect(btn).toBeLessThan(quiet);
    expect(btn).toBeGreaterThan(-1);
    expect(panel).toBeGreaterThan(btn);
  });
  it("link precedence and wording match the destination, with rel preserved", () => {
    const maker = render(<GearProductCard product={base} />);
    expect(maker).toContain("See it on Maker&#x27;s website");
    expect(maker).toContain('rel="nofollow noopener"');
    expect(maker).not.toContain("sponsored");
    const retailer = render(
      <GearProductCard
        product={{
          ...base,
          specSource: { ...base.specSource, url: "https://maker.example/m.pdf" },
          retailerUrl: "https://shop.example/x",
          retailerName: "Shop",
        }}
      />,
    );
    expect(retailer).toContain("See it at Shop");
    expect(retailer).not.toMatch(/Buy now/);
  });
  it("shows an information-only state and no button when there is no valid link", () => {
    const html = render(
      <GearProductCard
        product={{
          ...base,
          specSource: { ...base.specSource, url: "https://maker.example/m.pdf" },
        }}
      />,
    );
    expect(html).not.toContain("gearcard-cta");
    expect(html).toContain("Information only");
  });
  it("compact variant renders one row with the same button and details", () => {
    const html = render(<GearProductCard product={base} variant="compact" />);
    expect(html).toContain('data-gearcard="compact"');
    expect(html).toContain("gearcard-cta");
    expect(html).toContain("<details");
    expect(html).not.toContain(` id="${base.id}"`);
  });
});
