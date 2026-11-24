import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { marked } from "marked";
import { Markdown } from "@/components/site/Markdown";
import {
  buildProductMatcher,
  linkProductMentions,
  productSpellings,
} from "@/lib/product-text-links";
import { products, type Product } from "@/content/gear";
import { isMonetized } from "@/content/affiliate-usage";
import { loadGuide } from "@/content/guides";
import type { AffiliateLink } from "@/content/affiliates";

const spec = { title: "t", url: "https://example.com/p", publisher: "p", accessedOn: "2026-01-01" };
const prod = (o: Partial<Product> & { id: string; name: string }): Product => ({
  brand: "Acme",
  summary: "s",
  keySpecs: [],
  specSource: spec,
  ...o,
});
const AMAZON = "https://www.amazon.com/dp/B000000000?tag=pawpass-20";
const link = (id: string, approved = true): AffiliateLink => ({
  id,
  network: "Amazon Associates",
  url: AMAZON,
  approved,
  kind: "product",
});
const fixture = [
  prod({ id: "crate-one", name: "Cozy Crate", aliases: ["Cozy"], affiliateId: "crate-one" }),
  prod({ id: "plain-one", name: "Plain Mat" }),
  prod({ id: "gone", name: "Retired Bowl", active: false, affiliateId: "gone" }),
  prod({ id: "plus", name: "Cozy Crate Plus" }),
];
const render = (md: string, links: AffiliateLink[] = [link("crate-one"), link("gone")]) => {
  const tokens = marked.lexer(md);
  linkProductMentions(tokens, buildProductMatcher(fixture, links));
  return marked.parser(tokens);
};

describe("product names in running text link to the affiliate link", () => {
  const md = [
    "# Cozy Crate heading",
    "",
    "We like the Cozy Crate for road trips. Cozy Crate again.",
    "",
    "| Product | Note |",
    "| --- | --- |",
    "| Cozy Crate (Large) | fits |",
    "",
    "- A list item about the Cozy Crate.",
    "",
    "## Why it matters",
    "",
    "Already [the Cozy Crate](https://example.com/x) linked, and `Cozy Crate` code.",
  ].join("\n");

  it("links a paragraph mention and a table cell, with the sponsored rel and the tagged Amazon address", () => {
    const html = render(md);
    const anchors = html.match(/<a [^>]*data-product-link="crate-one"[^>]*>Cozy Crate<\/a>/g) ?? [];
    expect(anchors.length).toBe(4); // two in the paragraph, one in the table, one in the list
    for (const a of anchors) {
      expect(a).toContain(`href="${AMAZON}"`);
      expect(a).toContain('rel="sponsored nofollow noopener"');
      expect(a).toContain('target="_blank"');
      expect(a).toContain('data-aff="crate-one"');
    }
    expect(html).toMatch(/<td>\s*<a [^>]*>Cozy Crate<\/a> \(Large\)/);
  });

  it("does not link headings, existing links or code", () => {
    const html = render(md);
    expect(html).toMatch(/<h1[^>]*>Cozy Crate heading<\/h1>/);
    expect(html).toContain('<a href="https://example.com/x">the Cozy Crate</a>');
    expect(html).toContain("<code>Cozy Crate</code>");
  });

  it("uses a longer non-earning name instead of half-linking it, and leaves non-earning products plain", () => {
    const html = render("The Cozy Crate Plus and the Plain Mat and the Retired Bowl.");
    expect(html).toContain("Cozy Crate Plus");
    expect(html).not.toContain("<a ");
  });

  it("uses an alias and respects word boundaries and case", () => {
    const html = render("Cozy is nice. Cozying up, the cozy crate, ACozy.");
    expect(html.match(/<a /g)?.length).toBe(1);
    expect(html).toContain(">Cozy</a> is nice");
  });

  it("turns back into plain text as soon as the product stops earning", () => {
    expect(render("The Cozy Crate.", [link("crate-one")])).toContain("<a ");
    expect(render("The Cozy Crate.", [link("crate-one", false)])).not.toContain("<a ");
    expect(render("The Cozy Crate.", [])).not.toContain("<a ");
  });

  it("does not link inside a Sources section", () => {
    const html = render("## Sources\n\n- Cozy Crate page\n\n## Next\n\nCozy Crate.");
    expect(html.match(/<a /g)?.length).toBe(1);
  });

  it("renders at SSR through <Markdown> with a real product", () => {
    const p = products.find((x) => x.active !== false && isMonetized(x))!;
    const html = renderToStaticMarkup(<Markdown source={`Our note on the ${p.name} today.`} />);
    expect(html).toContain(`data-product-link="${p.id}"`);
    expect(html).toContain("sponsored nofollow noopener");
  });
});

describe("real guides", () => {
  const sample = async (slug: string) => {
    const g = await loadGuide(slug, true);
    expect(g, slug).toBeTruthy();
    return renderToStaticMarkup(<Markdown source={g!.body} />);
  };
  const tableLinks = (html: string) =>
    [...html.matchAll(/<td>([^]*?)<\/td>/g)].filter((m) => m[1]!.includes("data-product-link"));

  it("dog-car-safety-harness-and-crate-guide links its table products", async () => {
    const html = await sample("dog-car-safety-harness-and-crate-guide");
    // The CPS listings table was removed as noise; the products must still link wherever they are named.
    expect(html).not.toMatch(/data-product-link="sleepypod-clickit-sport"/);
    expect(html).toMatch(/data-product-link="sleepypod-atom"/);
    expect(html).toMatch(/data-product-link="lucky-duck-lucky-kennel"/);
    expect(html).not.toMatch(/<h[1-6][^>]*>(?:(?!<\/h[1-6]>)[^])*data-product-link/);
  });

  it("dog-travel-bowls-and-food-storage links its table products", async () => {
    const html = await sample("dog-travel-bowls-and-food-storage");
    const ids = new Set([...html.matchAll(/data-product-link="([^"]+)"/g)].map((x) => x[1]));
    for (const id of [
      "kurgo-collaps-a-bowl",
      "springland-22oz-original-travel-bottle",
      "springland-20oz-flip-travel-bottle",
      "vittles-vault-travel-tainer",
      "kurgo-kibble-carrier",
      "ruffwear-quencher-bowl",
      "kurgo-splash-free-wander-bowl",
      "gunner-dog-bowl",
    ])
      expect(ids.has(id), id).toBe(true);
    expect(html).not.toMatch(/<h[1-6][^>]*>(?:(?!<\/h[1-6]>)[^])*data-product-link/);
  });
});

describe("product aliases", () => {
  const brands = new Set(products.map((p) => p.brand.toLowerCase()));
  it("are unique across products and never collide with another product's name", () => {
    const owner = new Map<string, string>();
    for (const p of products)
      for (const s of productSpellings(p)) {
        const prev = owner.get(s);
        expect(prev === undefined || prev === p.id, `"${s}" is used by ${prev} and ${p.id}`).toBe(
          true,
        );
        owner.set(s, p.id);
      }
  });
  it("are never a bare brand or a single word", () => {
    for (const p of products)
      for (const a of p.aliases ?? []) {
        expect(brands.has(a.toLowerCase()), `alias "${a}" is a bare brand`).toBe(false);
        expect(
          a.trim().split(/\s+/).length >= 2 || /[-0-9]/.test(a) || /[a-z][A-Z]/.test(a),
          `alias "${a}" is a single plain word`,
        ).toBe(true);
        expect(a.length).toBeGreaterThanOrEqual(5);
      }
  });
});
