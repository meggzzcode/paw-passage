import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { ProductSpecCard, productSpecCardHtml } from "@/components/site/ProductSpecCard";

const p = {
  brand: "KONG",
  name: "KONG Classic",
  categories: ["feeding-and-hydration"],
  cardSpecs: ["A", "B", "C"],
};

describe("ProductSpecCard", () => {
  it("renders brand, name once, chips and a decorative icon", () => {
    const html = renderToStaticMarkup(<ProductSpecCard product={p} />);
    expect(html).toContain("KONG Classic");
    expect(html.match(/KONG Classic/g)).toHaveLength(1);
    expect(html.match(/speccard-chip"/g)).toHaveLength(3);
    expect(html).toContain('aria-hidden="true"');
    expect(html).not.toMatch(/<img|<a /);
  });
  it("renders without cardSpecs and unknown category", () => {
    const html = productSpecCardHtml({ brand: "X", name: "Y" });
    expect(html).toContain("X Y");
    expect(html).not.toContain("speccard-chips");
  });
});
