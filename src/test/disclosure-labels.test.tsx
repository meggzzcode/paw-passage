import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AFFILIATE_BOOK_LABEL, AFFILIATE_BUY_LABEL } from "@/lib/disclosure";
import { Markdown } from "@/components/site/Markdown";
import { getApprovedLink } from "@/content/affiliates";
import { products } from "@/content/gear";
import { productLinkId } from "@/content/affiliate-usage";

describe("affiliate button labels", () => {
  it("labels use the agreed wording and never say Sponsored", () => {
    expect(AFFILIATE_BUY_LABEL).toBe("Affiliate link · We may earn a commission if you buy.");
    expect(AFFILIATE_BOOK_LABEL).toBe(
      "Affiliate link · We may earn a commission if you book, at no extra cost to you.",
    );
    expect(AFFILIATE_BUY_LABEL + AFFILIATE_BOOK_LABEL).not.toMatch(/sponsored/i);
  });

  it("every affiliate pick card carries the label after its button, and none keeps the old price line", () => {
    const affiliate = products.filter((p) => getApprovedLink(productLinkId(p)));
    expect(affiliate.length).toBeGreaterThan(0);
    for (const p of affiliate) {
      const html = renderToStaticMarkup(<Markdown source={`{{pick:${p.id}}}`} />);
      if (!html.includes("data-pick")) continue;
      expect(html).toContain("Affiliate link · We may earn a commission if you ");
      expect(html).toContain("data-affiliate-label");
      expect(html).not.toContain("Check the current price");
      expect(html.indexOf("data-affiliate-label")).toBeGreaterThan(html.indexOf('rel="sponsored'));
    }
  });
});
