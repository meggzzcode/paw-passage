import { marked, type Tokens, type Token, type TokensList, type Renderer } from "marked";
import { cn } from "@/lib/utils";
import { getApprovedLink } from "@/content/affiliates";
import { trackProductClick } from "@/lib/analytics";
import { getProduct } from "@/content/gear";
import { resolveProductLink } from "@/content/gear-links";
import { isMonetized } from "@/content/affiliate-usage";
import { PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK } from "@/content/publish-rule";
import { productTitle, defaultPickLabel } from "@/lib/product-display";
import { linkProductMentions, type ProductLinkToken } from "@/lib/product-text-links";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Only web, email and on-site addresses are allowed in links and images. Anything else (javascript:, data:...) is dropped. */
const safeUrl = (href: string | null | undefined) =>
  href && /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href.trim()) ? href.trim() : null;

// Articles are edited in a CMS, so treat the text as untrusted: raw HTML typed into an article is shown as
// plain text instead of being run, and unsafe link addresses are removed.
marked.use({
  gfm: true,
  renderer: {
    html: (token: Tokens.HTML | Tokens.Tag) => escapeHtml(token.text),
    link(this: Renderer, { href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      // [words](aff:link-id): an affiliate link. It is a real link ONLY if that link exists and is approved;
      // otherwise the words show as plain text, so an article never shows a link nobody is approved for.
      const aff = /^aff:([a-z0-9-]+)$/.exec((href ?? "").trim());
      if (aff) {
        const link = getApprovedLink(aff[1]);
        if (!link) return text;
        return `<a data-aff="${escapeHtml(aff[1]!)}" data-partner="${escapeHtml(link.network)}" href="${escapeHtml(link.url)}" target="_blank" rel="sponsored nofollow noopener">${text}</a>`;
      }
      const url = safeUrl(href);
      if (!url) return text;
      // A source number written as [[5]](url) is shown as a small, quiet superscript instead of a full-size "[5]" link.
      const cite = /^\[(\d{1,3})\]$/.exec(text.trim());
      if (cite)
        return `<sup class="cite"><a href="${escapeHtml(url)}" aria-label="Source ${cite[1]}">${cite[1]}</a></sup>`;
      return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ""}>${text}</a>`;
    },
    heading(this: Renderer, token: Tokens.Heading & { id?: string }) {
      const inner = this.parser.parseInline(token.tokens);
      const id = token.id ? ` id="${escapeHtml(token.id)}" class="scroll-mt-28"` : "";
      return `<h${token.depth}${id}>${inner}</h${token.depth}>\n`;
    },
    image({ href, text }: Tokens.Image) {
      const url = safeUrl(href);
      return url
        ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}" loading="lazy" />`
        : escapeHtml(text);
    },
  },
});

/**
 * {{pick:product-id}} or {{pick:product-id|Best value}} on a line of its own is a product card inside an article.
 * It shows only when the product has an approved affiliate link (so every callout can earn); otherwise nothing is
 * rendered, which is why the sentences around it must read well without the card.
 */
interface PickToken extends Tokens.Generic {
  type: "pick";
  id: string;
  label: string;
  note: string;
  sourceUrl: string;
}
marked.use({
  extensions: [
    {
      name: "pick",
      level: "block",
      start: (src: string) => src.indexOf("{{pick:"),
      tokenizer(src: string): PickToken | undefined {
        // {{pick:id}}  {{pick:id|Label}}  {{pick:id|Label|Why we picked it}}  {{pick:id|Label|Why|https://source}}
        const m = /^\{\{pick:([a-z0-9-]+)((?:\|[^}\n]*)?)\}\}[ \t]*(?:\n|$)/.exec(src);
        if (!m) return undefined;
        const parts = (m[2] ?? "")
          .split("|")
          .slice(1)
          .map((x) => x.trim());
        const src4 = parts[2] && /^https:\/\//.test(parts[2]) ? parts[2] : "";
        return {
          type: "pick",
          raw: m[0],
          id: m[1]!,
          label: parts[0] ?? "",
          note: parts[1] ?? "",
          sourceUrl: src4,
        };
      },
      renderer(token: Tokens.Generic) {
        const t = token as PickToken;
        const product = getProduct(t.id);
        if (!product) return "";
        if (PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK && !isMonetized(product)) return "";
        const link = resolveProductLink(product);
        if (!link) return "";
        const cat = product.categories?.[0];
        const attrs =
          link.kind === "affiliate"
            ? ` data-aff="${escapeHtml(product.affiliateId ?? product.id)}" data-partner="${escapeHtml(link.network ?? "")}"`
            : "";
        return `<aside class="no-print not-prose my-8 rounded-xl border border-border bg-secondary/50 p-5" data-pick="${escapeHtml(product.id)}">
<p class="text-xs font-semibold uppercase tracking-[0.14em] text-terracotta">${escapeHtml(t.label && t.label.toLowerCase() !== "our pick" ? t.label : defaultPickLabel(product))}</p>
<p class="mt-1 font-display text-xl">${escapeHtml(productTitle(product))}</p>
<p class="mt-2 text-sm text-muted-foreground">${escapeHtml(product.summary)}</p>${t.note ? `\n<p class="mt-2 text-sm"><span class="font-medium">Why we picked it:</span> ${escapeHtml(t.note)}${t.sourceUrl ? ` <a href="${escapeHtml(t.sourceUrl)}" target="_blank" rel="noopener noreferrer" class="underline">Source</a>` : ""}</p>` : ""}
<p class="mt-4 flex flex-wrap items-center gap-4"><a${attrs} href="${escapeHtml(link.url)}" target="_blank" rel="${escapeHtml(link.rel)}" class="inline-flex h-10 items-center rounded-full bg-terracotta-button px-5 text-sm font-medium text-terracotta-foreground hover:brightness-95">${escapeHtml(link.label)}</a>${cat ? `<a href="/gear/${escapeHtml(cat)}#${escapeHtml(product.id)}" class="text-sm underline">Details and specs</a>` : ""}</p>
<p class="mt-3 text-xs text-muted-foreground">Check the current price on the listing before you buy.</p>
</aside>
`;
      },
    },
  ],
});

/**
 * A product name in running text (paragraphs, lists, tables) that earns: an inline affiliate link, built exactly like
 * the pick card's button (same address, rel, data attributes for click tracking). linkProductMentions() creates these
 * tokens only for products with an approved link, so a product that stops earning renders as plain text again.
 */
marked.use({
  extensions: [
    {
      name: "productlink",
      level: "inline",
      renderer(token: Tokens.Generic) {
        const t = token as ProductLinkToken;
        return `<a data-aff="${escapeHtml(t.link.affId)}" data-partner="${escapeHtml(t.link.partner)}" data-product-link="${escapeHtml(t.link.id)}" href="${escapeHtml(t.link.url)}" target="_blank" rel="${escapeHtml(t.link.rel)}">${escapeHtml(t.text)}</a>`;
      },
    },
  ],
});

const plain = (t: Token): string =>
  "tokens" in t && Array.isArray(t.tokens)
    ? (t.tokens as Token[]).map(plain).join("")
    : "text" in t
      ? String((t as { text: string }).text)
      : t.raw;
export const slugify = (s: string) =>
  s
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/['\u2019]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

export interface ArticleHeading {
  id: string;
  text: string;
  depth: 2 | 3;
}

/** Lexes the article and gives every ## and ### a stable id, unique within the article (repeats get -2, -3...). */
function lexWithIds(source: string): { tokens: TokensList; headings: ArticleHeading[] } {
  const tokens = marked.lexer(source);
  const seen = new Map<string, number>();
  const headings: ArticleHeading[] = [];
  for (const t of tokens) {
    if (t.type !== "heading" || (t.depth !== 2 && t.depth !== 3)) continue;
    const text = plain(t).trim();
    const base = slugify(text);
    const n = (seen.get(base) ?? 0) + 1;
    seen.set(base, n);
    const id = n === 1 ? base : `${base}-${n}`;
    (t as Tokens.Heading & { id?: string }).id = id;
    headings.push({ id, text, depth: t.depth });
  }
  return { tokens, headings };
}

/** The article's ## and ### headings with the same ids the rendered article uses. */
export const articleHeadings = (source: string): ArticleHeading[] => lexWithIds(source).headings;

/** Renders Markdown for articles. Raw HTML in the text is escaped, never run. */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const { tokens } = lexWithIds(source);
  linkProductMentions(tokens);
  const html = marked
    .parser(tokens)
    // Wide tables scroll sideways inside their own box instead of widening the page on phones.
    .replace(
      /<table>/g,
      '<p class="table-swipe-hint no-print" aria-hidden="true">Swipe sideways to see all columns</p><div class="table-scroll max-w-full overflow-x-auto" tabindex="0" role="region" aria-label="Table, scrolls sideways"><table>',
    )
    // A task-list item shows its checkbox, not a bullet as well.
    .replace(/<li><input (checked=""\s)?disabled=""/g, '<li class="task-item"><input $1disabled=""')
    .replace(/<\/table>/g, "</table></div>")
    .replace(
      /<a href="(https?:\/\/[^"]+)"/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer"',
    );
  const onClick = (e: import("react").MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest?.("a[data-aff]") as HTMLAnchorElement | null;
    if (a)
      trackProductClick({
        product: a.dataset["aff"] ?? "",
        partner: a.dataset["partner"] ?? "",
        url: a.href,
        page: window.location.pathname,
      });
  };
  return (
    <div
      className={cn("prose-article", className)}
      onClick={onClick}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
