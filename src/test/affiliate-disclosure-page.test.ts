import { describe, expect, it } from "vitest";
import { affiliateDisclosureBody } from "@/lib/disclosure";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import { affiliateUsage } from "@/content/affiliate-usage";
import { products } from "@/content/gear";

const body = () => affiliateDisclosureBody(AMAZON_DISCLOSURE);

describe("/affiliate-disclosure text", () => {
  it("carries Amazon's exact required sentence", () => {
    expect(AMAZON_DISCLOSURE).toBe("As an Amazon Associate I earn from qualifying purchases.");
    expect(body()).toContain("As an Amazon Associate I earn from qualifying purchases.");
  });

  it("describes the Adventure Passport purchase and no retired stay or booking business", () => {
    expect(body()).toContain("one-time purchase");
    expect(body()).not.toMatch(/\bstays?\b|vrbo|airbnb|stay22|booking/i);
  });

  it("makes no false blanket claims", () => {
    const t = body();
    expect(t).not.toMatch(/every (affiliate )?(buy|booking|buy or booking) button/i);
    expect(t).not.toMatch(/never decide|never affect/i);
    expect(t).not.toMatch(/approved arrangement|approved by/i);
    expect(t).not.toMatch(/partner(ship)? with|official partner|we have tested|we tested/i);
  });
});

describe("Amazon sentence appears wherever Amazon links render", () => {
  it("an article with an Amazon pick shows the Amazon sentence in its notice, one without does not", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { createElement } = await import("react");
    const { AffiliateNotice } = await import("@/components/site/AffiliateNotice");
    const { RouterProvider, createMemoryHistory, createRouter, createRootRoute } =
      await import("@tanstack/react-router");
    const render = async (guide: { body: string }) => {
      const root = createRootRoute({ component: () => createElement(AffiliateNotice, { guide }) });
      const router = createRouter({
        routeTree: root,
        history: createMemoryHistory({ initialEntries: ["/"] }),
      });
      await router.load();
      return renderToStaticMarkup(createElement(RouterProvider, { router }));
    };
    const amazon = products.find((p) => affiliateUsage({ body: `{{pick:${p.id}}}` }).anyAmazon);
    expect(amazon).toBeDefined();
    expect(await render({ body: `{{pick:${amazon!.id}}}` })).toContain(AMAZON_DISCLOSURE);
    expect(await render({ body: "No links here." })).toBe("");
  });
});
