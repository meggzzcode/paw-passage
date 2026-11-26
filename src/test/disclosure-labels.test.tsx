import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { AFFILIATE_BUY_LABEL } from "@/lib/disclosure";
import { Markdown } from "@/components/site/Markdown";
import { getApprovedLink } from "@/content/affiliates";
import { products } from "@/content/gear";
import { AffiliateNotice } from "@/components/site/AffiliateNotice";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import { productLinkId } from "@/content/affiliate-usage";

describe("affiliate button labels", () => {
  it("labels use the agreed wording and never say Sponsored", () => {
    expect(AFFILIATE_BUY_LABEL).toBe("Affiliate link · We may earn a commission if you buy.");
    expect(AFFILIATE_BUY_LABEL).not.toMatch(/sponsored/i);
  });

  it("pick cards put the buy button before Details and carry no per-button label (the page notice discloses)", () => {
    const affiliate = products.filter((p) => getApprovedLink(productLinkId(p)));
    expect(affiliate.length).toBeGreaterThan(0);
    for (const p of affiliate) {
      const html = renderToStaticMarkup(<Markdown source={`{{pick:${p.id}}}`} />);
      if (!html.includes("data-pick")) continue;
      expect(html).not.toContain("data-affiliate-label");
      expect(html).not.toContain("We may earn a commission if you ");
      expect(html).not.toContain("Check the current price");
      if (html.includes("Details and specs"))
        expect(html.indexOf('rel="sponsored')).toBeLessThan(html.indexOf("Details and specs"));
    }
  });

  it("the page-level notice still carries the Amazon sentence", async () => {
    const { RouterProvider, createMemoryHistory, createRouter, createRootRoute } =
      await import("@tanstack/react-router");
    const { affiliateUsage } = await import("@/content/affiliate-usage");
    const withAmazon = products.find(
      (p) => affiliateUsage({ body: `{{pick:${p.id}}}`, gear: [] }).anyAmazon,
    );
    expect(withAmazon).toBeDefined();
    const guide = { body: `{{pick:${withAmazon!.id}}}`, gear: [] };
    const root = createRootRoute({ component: () => <AffiliateNotice guide={guide} /> });
    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    await router.load();
    expect(renderToStaticMarkup(<RouterProvider router={router} />)).toContain(AMAZON_DISCLOSURE);
  });
});
