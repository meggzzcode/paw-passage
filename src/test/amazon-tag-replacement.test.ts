import { afterEach, describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { readFileSync } from "node:fs";
import { parse as parseYaml } from "yaml";

// Buyer account replacement, Amazon part: the tracking ID lives in ONE place (settings.amazonTrackingId). These tests load the
// real content (content/affiliates.yml, content/products.yml, guides) with a different tag and check what is rendered.
// The tag currently configured (the seller's today). After a real buyer replacement this is the buyer's, and the test still holds.
const CURRENT_TAG = String(
  parseYaml(readFileSync("content/settings.yml", "utf8")).amazonTrackingId || "",
);
const SELLER_TAG =
  CURRENT_TAG && CURRENT_TAG !== "buyername-20" ? CURRENT_TAG : "no-current-tag-set";

async function loadWithTag(tag: string) {
  vi.resetModules();
  vi.doMock("virtual:content", async (orig) => {
    const real = (await orig()) as { settings: Record<string, unknown> };
    return { ...real, settings: { ...real.settings, amazonTrackingId: tag } };
  });
  const aff = await import("@/content/affiliates");
  const usage = await import("@/content/affiliate-usage");
  const links = await import("@/content/gear-links");
  const gear = await import("@/content/gear");
  return { aff, usage, links, gear };
}

vi.mock("@tanstack/react-router", () => ({
  Link: ({ children }: { children?: unknown }) => createElement("a", null, children as never),
}));

afterEach(() => {
  vi.doUnmock("virtual:content");
  vi.resetModules();
});

describe("Amazon tag replacement (one supported place)", () => {
  it("a replacement ID is used on every Amazon link and the seller's tag appears nowhere", async () => {
    const { aff } = await loadWithTag("buyername-20");
    const amazon = aff.affiliateLinks.filter(aff.isAmazon);
    expect(amazon.length).toBeGreaterThan(50);
    for (const l of amazon) {
      expect(l.url, l.id).toContain("tag=buyername-20");
      expect(l.url, l.id).not.toContain(SELLER_TAG);
      expect(l.url, l.id).not.toContain("{");
    }
    for (const l of aff.affiliateLinks) expect(l.url, l.id).not.toContain(SELLER_TAG);
  });

  it("an EMPTY tracking ID leaves no tagged Amazon link anywhere: every Amazon link resolves to nothing and none is approved-and-shown", async () => {
    const { aff } = await loadWithTag("");
    const amazon = aff.affiliateLinks.filter(aff.isAmazon);
    expect(amazon.length).toBeGreaterThan(50);
    for (const l of amazon) {
      expect(l.url, l.id).toBe("");
      expect(aff.getApprovedLink(l.id), l.id).toBeUndefined();
    }
    for (const l of aff.affiliateLinks) {
      expect(l.url, l.id).not.toContain(SELLER_TAG);
      expect(l.url, l.id).not.toMatch(/amazon\.[a-z.]+\/.*tag=/);
    }
  });

  it("with an empty ID, product buttons fall back to the maker, then a plain retailer, then nothing, and never to Amazon", async () => {
    const { usage, links, gear } = await loadWithTag("");
    const products = gear.products;
    expect(products.length).toBeGreaterThan(20);
    let maker = 0;
    for (const p of products) {
      const button = usage.productButton(p);
      if (button) {
        expect(button.kind, p.id).toBe("direct");
        // A plain link may point at an Amazon page only when that page is the maker/spec source; it carries no tag and says so.
        expect(button.url, p.id).not.toMatch(/[?&]tag=/);
        expect(button.url, p.id).not.toContain(SELLER_TAG);
        if (/amazon\./i.test(button.url)) expect(button.label, p.id).toBe("See it on Amazon");
        else expect(button.label, p.id).toBe(`See it on ${p.brand}'s website`);
        maker++;
      }
      const resolved = links.resolveProductLink(p);
      if (resolved) {
        expect(resolved.kind, p.id).not.toBe("affiliate");
        expect(resolved.rel, p.id).not.toContain("sponsored");
        expect(resolved.url, p.id).not.toContain(SELLER_TAG);
      }
      expect(usage.isMonetized(p), p.id).toBe(false);
    }
    expect(maker).toBeGreaterThan(0);
  });

  it("with an empty ID, an article notice and Amazon's statement are not shown (wording matches the real state)", async () => {
    const { usage, aff, gear } = await loadWithTag("");
    const picks = gear.products.slice(0, 5).map((p) => p.id);
    const body = picks.map((id) => `{{pick:${id}}}`).join("\n\n");
    const u = usage.affiliateUsage({ body, relatedProducts: picks });
    expect(u.anyAmazon).toBe(false);
    expect(u.links.filter(aff.isAmazon)).toHaveLength(0);
    const { AffiliateNotice } = await import("@/components/site/AffiliateNotice");
    const stayOnly = u.links.length === 0;
    const html = renderToStaticMarkup(
      createElement(
        "div",
        null,
        createElement(AffiliateNotice, { guide: { body, relatedProducts: picks } as never }),
      ),
    );
    expect(html).not.toContain("Amazon Associate");
    if (stayOnly) expect(html).not.toContain("affiliate links");
  });

  it("with the tag set, an article using Amazon products carries the notice and Amazon's statement", async () => {
    const { usage, aff, gear } = await loadWithTag("buyername-20");
    const monetized = gear.products.filter((p) => usage.isMonetized(p));
    expect(monetized.length).toBeGreaterThan(5);
    const body = monetized.map((p) => `{{pick:${p.id}}}`).join("\n\n");
    const u = usage.affiliateUsage({ body });
    expect(u.anyAmazon).toBe(true);
    const { AffiliateNotice } = await import("@/components/site/AffiliateNotice");
    const html = renderToStaticMarkup(
      createElement("div", null, createElement(AffiliateNotice, { guide: { body } as never })),
    );
    expect(html).toContain(aff.AMAZON_DISCLOSURE);
  });
});
