import { describe, expect, it } from "vitest";
import { affiliateDisclosureBody } from "@/lib/disclosure";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";
import { affiliateUsage } from "@/content/affiliate-usage";
import { products } from "@/content/gear";
import { site } from "@/config/site";

const body = (m: "affiliate-only" | "public-sources") =>
  affiliateDisclosureBody(m, AMAZON_DISCLOSURE);

describe("/affiliate-disclosure text", () => {
  it("carries Amazon's exact required sentence", () => {
    expect(AMAZON_DISCLOSURE).toBe("As an Amazon Associate I earn from qualifying purchases.");
    for (const m of ["affiliate-only", "public-sources"] as const)
      expect(body(m)).toContain("As an Amazon Associate I earn from qualifying purchases.");
  });

  it("the stay-listing paragraph is true for the active mode", () => {
    const a = body("affiliate-only");
    const p = body("public-sources");
    expect(a).toContain(
      "Stays are listed when we have a booking link we can use for them, which means a link that may pay us a commission.",
    );
    expect(a).not.toContain("does not depend on commissions");
    expect(p).toContain("Whether a stay is listed does not depend on commissions.");
    expect(p).not.toContain("which means a link that may pay us a commission");
    expect(a).not.toBe(p);
  });

  it("makes no false blanket claims", () => {
    for (const m of ["affiliate-only", "public-sources"] as const) {
      const t = body(m);
      expect(t).not.toMatch(/every (affiliate )?(buy|booking|buy or booking) button/i);
      expect(t).not.toMatch(/never decide|never affect/i);
      expect(t).not.toMatch(/approved arrangement|approved by/i);
      expect(t).not.toMatch(/partner(ship)? with|official partner|we have tested|we tested/i);
    }
  });

  it("the committed site setting renders one of the two texts", () => {
    expect(["affiliate-only", "public-sources"]).toContain(site.stayDirectoryMode);
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
