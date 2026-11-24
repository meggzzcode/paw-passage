import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "@/components/site/Markdown";
import {
  productTitle,
  defaultPickLabel,
  pickIdsInBody,
  DEFAULT_PICK_LABELS,
} from "@/lib/product-display";
import { gearCategorySlugs } from "@/content/products-schema";
import { products } from "@/content/gear";
import { isMonetized } from "@/content/affiliate-usage";
import { TrustStrip } from "@/components/site/ArticleActions";

describe("template fixes", () => {
  it("does not repeat the brand", () => {
    expect(productTitle({ brand: "KONG", name: "KONG Classic" })).toBe("KONG Classic");
    expect(productTitle({ brand: "Petcube", name: "Petcube GPS Tracker" })).toBe(
      "Petcube GPS Tracker",
    );
    expect(productTitle({ brand: "Kurgo", name: "Loft Wander Dog Bed" })).toBe(
      "Kurgo Loft Wander Dog Bed",
    );
  });
  it("no product title on a pick card doubles its brand", () => {
    for (const p of products) {
      const t = productTitle(p).toLowerCase();
      expect(t.split(p.brand.toLowerCase()).length - 1).toBeLessThanOrEqual(
        p.name.toLowerCase().split(p.brand.toLowerCase()).length - 1 || 1,
      );
    }
  });
  it("wraps tables in a scroll container with a swipe cue", () => {
    const out = renderToStaticMarkup(<Markdown source={"| a | b |\n|-|-|\n| 1 | 2 |"} />);
    expect(out).toContain("table-scroll");
    expect(out).toContain("Swipe sideways");
  });
  it("says 'sources', not 'official sources'", () => {
    const out = renderToStaticMarkup(
      <TrustStrip
        guide={{ category: "x", lastReviewed: "2026-11-16", sources: [{}, {}], body: "" }}
      />,
    );
    expect(out).toContain("2 sources cited");
    expect(out).not.toContain("official");
  });
  it("task items carry a class that removes the bullet", () => {
    const out = renderToStaticMarkup(<Markdown source={"- [ ] one\n- [x] two\n- plain"} />);
    expect(out.match(/<li class="task-item">/g)).toHaveLength(2);
    expect(out).toContain("<li>plain</li>");
  });
  it("has a default pick label for every category", () => {
    for (const s of gearCategorySlugs) expect(DEFAULT_PICK_LABELS[s]).toBeTruthy();
    expect(defaultPickLabel({ categories: ["car-safety"] })).toBe("Car safety pick");
    expect(defaultPickLabel({})).toBe("Our pick");
  });
  it("pick cards use the category label unless one is given", () => {
    const p = products.find((x) => isMonetized(x) && x.categories?.[0]);
    if (!p) return;
    const none = renderToStaticMarkup(<Markdown source={`{{pick:${p.id}}}`} />);
    expect(none).toContain(defaultPickLabel(p));
    const generic = renderToStaticMarkup(<Markdown source={`{{pick:${p.id}|Our pick}}`} />);
    expect(generic).toContain(defaultPickLabel(p));
    const own = renderToStaticMarkup(<Markdown source={`{{pick:${p.id}|Best value}}`} />);
    expect(own).toContain("Best value");
    expect(own).not.toContain(defaultPickLabel(p));
  });
  it("finds product ids that already have a pick card in the body", () => {
    expect(pickIdsInBody("a\n\n{{pick:aa-1|x}}\n\n{{pick:bb}}\n")).toEqual(["aa-1", "bb"]);
  });
});
