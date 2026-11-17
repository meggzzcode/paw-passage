import { marked, type Tokens, type Token, type TokensList, type Renderer } from "marked";
import { cn } from "@/lib/utils";
import { getApprovedLink } from "@/content/affiliates";
import { trackProductClick } from "@/lib/analytics";

const escapeHtml = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/** Only web, email and on-site addresses are allowed in links and images. Anything else (javascript:, data:...) is dropped. */
const safeUrl = (href: string | null | undefined) => (href && /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(href.trim()) ? href.trim() : null);

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
        return `<a data-aff="${escapeHtml(aff[1]!)}" data-partner="${escapeHtml(link.network)}" href="${escapeHtml(link.url)}" target="_blank" rel="sponsored nofollow noopener noreferrer">${text}</a>`;
      }
      const url = safeUrl(href);
      if (!url) return text;
      // A source number written as [[5]](url) is shown as a small, quiet superscript instead of a full-size "[5]" link.
      const cite = /^\[(\d{1,3})\]$/.exec(text.trim());
      if (cite) return `<sup class="cite"><a href="${escapeHtml(url)}" aria-label="Source ${cite[1]}">${cite[1]}</a></sup>`;
      return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ""}>${text}</a>`;
    },
    heading(this: Renderer, token: Tokens.Heading & { id?: string }) {
      const inner = this.parser.parseInline(token.tokens);
      const id = token.id ? ` id="${escapeHtml(token.id)}" class="scroll-mt-28"` : "";
      return `<h${token.depth}${id}>${inner}</h${token.depth}>\n`;
    },
    image({ href, text }: Tokens.Image) {
      const url = safeUrl(href);
      return url ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}" loading="lazy" />` : escapeHtml(text);
    },
  },
});

const plain = (t: Token): string => ("tokens" in t && Array.isArray(t.tokens) ? (t.tokens as Token[]).map(plain).join("") : "text" in t ? String((t as { text: string }).text) : t.raw);
export const slugify = (s: string) => s.toLowerCase().replace(/&/g, " and ").replace(/['\u2019]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "section";

export interface ArticleHeading { id: string; text: string; depth: 2 | 3 }

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
  const html = marked.parser(lexWithIds(source).tokens)
    // Wide tables scroll sideways inside their own box instead of widening the page on phones.
    .replace(/<table>/g, '<div class="table-scroll max-w-full overflow-x-auto"><table>')
    .replace(/<\/table>/g, "</table></div>")
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  const onClick = (e: import("react").MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest?.("a[data-aff]") as HTMLAnchorElement | null;
    if (a) trackProductClick({ product: a.dataset["aff"] ?? "", partner: a.dataset["partner"] ?? "", url: a.href, page: window.location.pathname });
  };
  return <div className={cn("prose-article", className)} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
