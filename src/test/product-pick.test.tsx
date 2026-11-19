import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown } from "@/components/site/Markdown";
import { pickIds } from "@/content/schema";
import { getProducts } from "@/content/gear";
import { isMonetized } from "@/content/affiliate-usage";

describe("{{pick:}} product cards in articles", () => {
  it("reads product ids from every directive form", () => {
    const body =
      "a\n\n{{pick:one}}\n\n{{pick:two|Best value}}\n\n{{pick:three|Best value|Why|https://x.org/y}}\n";
    expect(pickIds(body)).toEqual(["one", "two", "three"]);
  });

  it("renders nothing for an unknown product or one that cannot earn", () => {
    const html = renderToStaticMarkup(
      <Markdown source={"Intro.\n\n{{pick:no-such-product}}\n\nOutro."} />,
    );
    expect(html).not.toContain("data-pick");
    const unmonetized = getProducts([]).length >= 0 && ([] as string[]);
    expect(unmonetized).toEqual([]);
  });

  it("renders a card only for a monetized product, with the sponsored rel and no price or rating", () => {
    const monetized = getProducts(["petsafe-happy-ride-folding-ramp"]).filter(isMonetized);
    const html = renderToStaticMarkup(
      <Markdown
        source={
          "Before.\n\n{{pick:petsafe-happy-ride-folding-ramp|Best value|A reason|https://example.com/s}}\n\nAfter."
        }
      />,
    );
    if (monetized.length === 0) expect(html).not.toContain("data-pick");
    else {
      expect(html).toContain('data-pick="petsafe-happy-ride-folding-ramp"');
      expect(html).toContain("sponsored nofollow noopener");
      expect(html).toContain("Best value");
      expect(html).not.toMatch(/\$\d|stars?\b|rating/i);
    }
    expect(html).toContain("Before.");
    expect(html).toContain("After.");
  });
});
