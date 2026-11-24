// Turns every mention of an EARNING product's name (or one of its aliases) in a guide's text into its affiliate link.
// Deterministic and data-driven: the names come from content/products.yml (name + aliases) and a product links only
// while resolveProductLink() gives it an approved affiliate link, so a product that stops earning is plain text again.
import type { Token, Tokens } from "marked";
import { products as allProducts, type Product } from "@/content/gear";
import { affiliateLinks, type AffiliateLink } from "@/content/affiliates";
import { resolveProductLink } from "@/content/gear-links";

export interface ProductTextLink {
  id: string;
  /** Data attributes and address for the anchor, same as the pick card button. */
  affId: string;
  partner: string;
  url: string;
  rel: string;
}

export interface ProductMatcher {
  /** Matches any known product name or alias (longest first). null when there is nothing to match. */
  pattern: RegExp | null;
  /** Matched text to the link, or null when that product does not earn (the text then stays plain). */
  byText: Map<string, ProductTextLink | null>;
}

const escapeRe = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/** Every spelling a product is known by: its name, its name without a trailing "(...)", and its aliases. */
export const productSpellings = (p: Pick<Product, "name" | "aliases">): string[] => [
  ...new Set(
    [p.name, p.name.replace(/\s*\([^)]*\)\s*$/, ""), ...(p.aliases ?? [])]
      .map((s) => s.trim())
      .filter(Boolean),
  ),
];

/**
 * Names of ALL products are matched (so a longer name of a product that does not earn, such as "Clickit Sport Plus",
 * is not half-linked as a shorter one), but only earning, active products get a link.
 */
export function buildProductMatcher(
  list: Product[] = allProducts,
  links: AffiliateLink[] = affiliateLinks,
): ProductMatcher {
  const byText = new Map<string, ProductTextLink | null>();
  // Earning products are registered last for a spelling so they win a (tested-against) clash.
  for (const p of [...list].sort(
    (a, b) => Number(a.active === false) - Number(b.active === false),
  )) {
    const resolved = p.active === false ? undefined : resolveProductLink(p, links);
    const link: ProductTextLink | null =
      resolved && resolved.kind === "affiliate"
        ? {
            id: p.id,
            affId: p.affiliateId ?? p.id,
            partner: resolved.network ?? "",
            url: resolved.url,
            rel: resolved.rel,
          }
        : null;
    for (const s of productSpellings(p)) if (link || !byText.get(s)) byText.set(s, link);
  }
  const texts = [...byText.keys()].sort((a, b) => b.length - a.length || a.localeCompare(b));
  const pattern = texts.length
    ? new RegExp(`(?<![A-Za-z0-9])(?:${texts.map(escapeRe).join("|")})(?![A-Za-z0-9])`, "g")
    : null;
  return { pattern, byText };
}

let defaultMatcher: ProductMatcher | undefined;
const getDefaultMatcher = () => (defaultMatcher ??= buildProductMatcher());

export interface ProductLinkToken extends Tokens.Generic {
  type: "productlink";
  text: string;
  link: ProductTextLink;
}

// Block or inline tokens whose text must never become a link.
const SKIP = new Set([
  "heading",
  "link",
  "codespan",
  "code",
  "image",
  "html",
  "pick",
  "def",
  "escape",
]);
const SOURCE_HEADING = /^(sources?|references?)\b/i;

function splitText(text: string, m: ProductMatcher): Token[] | null {
  if (!m.pattern) return null;
  const out: Token[] = [];
  let last = 0;
  m.pattern.lastIndex = 0;
  for (let hit = m.pattern.exec(text); hit; hit = m.pattern.exec(text)) {
    const link = m.byText.get(hit[0]);
    if (!link) continue;
    if (hit.index > last)
      out.push({
        type: "text",
        raw: text.slice(last, hit.index),
        text: text.slice(last, hit.index),
        escaped: true,
      } as Tokens.Text);
    out.push({ type: "productlink", raw: hit[0], text: hit[0], link } as ProductLinkToken);
    last = hit.index + hit[0].length;
  }
  if (!out.length) return null;
  if (last < text.length)
    out.push({
      type: "text",
      raw: text.slice(last),
      text: text.slice(last),
      escaped: true,
    } as Tokens.Text);
  return out;
}

function visit(tokens: Token[], m: ProductMatcher, inSources: { on: boolean }): void {
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i] as Token & {
      tokens?: Token[];
      items?: Token[];
      header?: { tokens: Token[] }[];
      rows?: { tokens: Token[] }[][];
    };
    if (t.type === "heading") {
      inSources.on = SOURCE_HEADING.test(String(t.text ?? "").trim());
      continue;
    }
    if (SKIP.has(t.type) || inSources.on) continue;
    if (t.type === "text" && !t.tokens) {
      // An inline text token (a block-level "text" with children is handled below through its tokens).
      const parts = splitText(String(t.text), m);
      if (parts) {
        tokens.splice(i, 1, ...parts);
        i += parts.length - 1;
      }
      continue;
    }
    if (t.tokens) visit(t.tokens, m, inSources);
    if (t.items) visit(t.items, m, inSources);
    if (t.type === "table") {
      for (const c of t.header ?? []) visit(c.tokens, m, inSources);
      for (const row of t.rows ?? []) for (const c of row) visit(c.tokens, m, inSources);
    }
  }
}

/** Replaces product names in the lexed article with link tokens (in place). Only the default product list unless told otherwise. */
export function linkProductMentions(
  tokens: Token[],
  matcher: ProductMatcher = getDefaultMatcher(),
): void {
  visit(tokens, matcher, { on: false });
}
