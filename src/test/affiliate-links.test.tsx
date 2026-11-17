import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

// Pretend exactly two links exist: one approved (Amazon) and one that is not approved yet.
vi.mock("@/content/affiliates", async (orig) => {
  const real = (await orig()) as Record<string, unknown>;
  const links = [
    { id: "kurgo-heather-hammock", network: "Amazon Associates", url: "https://www.amazon.com/dp/EXAMPLE?tag=test-20", approved: true },
    { id: "ruffwear-pad", network: "Impact", url: "https://example.com/ruffwear", approved: false },
  ];
  return { ...real, getApprovedLink: (id?: string) => links.find((l) => l.id === id && l.approved) };
});

import { Markdown } from "@/components/site/Markdown";
import { affiliateUsage, inlineAffiliateIds, productLinkId } from "@/content/affiliate-usage";
import { AMAZON_DISCLOSURE } from "@/content/affiliates";

const html = (s: string) => renderToStaticMarkup(<Markdown source={s} />);

describe("inline affiliate links in article text", () => {
  it("an APPROVED link shows as a sponsored link that opens in a new tab", () => {
    const out = html("Try the [Heather Hammock](aff:kurgo-heather-hammock) for the back seat.");
    expect(out).toContain('href="https://www.amazon.com/dp/EXAMPLE?tag=test-20"');
    expect(out).toContain('rel="sponsored nofollow noopener noreferrer"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('data-aff="kurgo-heather-hammock"');
    expect(out).toContain(">Heather Hammock</a>");
  });
  it("an UNAPPROVED link shows only the words, with no link at all", () => {
    const out = html("See the [Ruffwear pad](aff:ruffwear-pad) too.");
    expect(out).not.toContain("<a");
    expect(out).not.toContain("example.com/ruffwear");
    expect(out).toContain("Ruffwear pad");
  });
  it("a link name that does not exist shows only the words", () => {
    const out = html("Maybe [this](aff:no-such-link).");
    expect(out).not.toContain("<a");
    expect(out).toContain("this");
  });
  it("normal links are not treated as affiliate links", () => {
    const out = html("[maker](https://example.com) and [guide](/guides/x)");
    expect(out).not.toContain("data-aff");
    expect(out).not.toContain("sponsored");
  });
});

describe("which affiliate links an article shows", () => {
  it("finds inline link names once each", () => {
    expect(inlineAffiliateIds("a [x](aff:one) b [y](aff:two) c [z](aff:one) [n](https://x.com)")).toEqual(["one", "two"]);
  });
  it("a product uses the link with its own id unless it names another", () => {
    expect(productLinkId({ id: "kurgo-heather-hammock" })).toBe("kurgo-heather-hammock");
    expect(productLinkId({ id: "a", affiliateId: "b" })).toBe("b");
  });
  it("counts only approved links, and notices Amazon", () => {
    const u = affiliateUsage({ body: "[a](aff:kurgo-heather-hammock) [b](aff:ruffwear-pad) [c](aff:none)" });
    expect(u.count).toBe(1);
    expect(u.anyAmazon).toBe(true);
    expect(affiliateUsage({ body: "no links here" }).count).toBe(0);
    expect(affiliateUsage({ body: "[b](aff:ruffwear-pad)" }).count).toBe(0);
  });
});

describe("Amazon's required disclosure", () => {
  it("is Amazon's exact sentence from the Operating Agreement (Section 5)", () => {
    expect(AMAZON_DISCLOSURE).toBe("As an Amazon Associate I earn from qualifying purchases.");
  });
});


import { productButton } from "@/content/affiliate-usage";
import type { Product } from "@/content/gear";

const base: Product = { id: "some-product", name: "Thing", brand: "Maker", summary: "s", keySpecs: [], specSource: { title: "t", url: "https://maker.example/thing", publisher: "Maker", accessedOn: "2026-11-16" } };

describe("the button under a product pick", () => {
  it("goes to the maker's own page when there is no approved affiliate link", () => {
    const b = productButton(base)!;
    expect(b.kind).toBe("direct");
    expect(b.url).toBe("https://maker.example/thing");
    expect(b.label).toBe("See it on Maker's website");
  });
  it("uses the product page instead of a PDF manual", () => {
    expect(productButton({ ...base, specSource: { ...base.specSource, url: "https://maker.example/manual.pdf" }, productUrl: "https://maker.example/product" })!.url).toBe("https://maker.example/product");
    expect(productButton({ ...base, specSource: { ...base.specSource, url: "https://maker.example/manual.pdf" } })).toBeUndefined();
  });
  it("is replaced by the affiliate link once that link is approved", () => {
    const b = productButton({ ...base, id: "kurgo-heather-hammock" })!;
    expect(b.kind).toBe("affiliate");
    expect(b.url).toContain("amazon.com");
    expect(b.label).toBe("See it at Amazon");
  });
  it("an unapproved affiliate link does not replace the direct link", () => {
    expect(productButton({ ...base, id: "ruffwear-pad" })!.kind).toBe("direct");
  });
});
