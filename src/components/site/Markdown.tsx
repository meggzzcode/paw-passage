import { marked, type Tokens, type Renderer } from "marked";
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
      return `<a href="${escapeHtml(url)}"${title ? ` title="${escapeHtml(title)}"` : ""}>${text}</a>`;
    },
    image({ href, text }: Tokens.Image) {
      const url = safeUrl(href);
      return url ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}" loading="lazy" />` : escapeHtml(text);
    },
  },
});

/** Renders Markdown for articles. Raw HTML in the text is escaped, never run. */
export function Markdown({ source, className }: { source: string; className?: string }) {
  const html = (marked.parse(source, { async: false }) as string)
    .replace(/<a href="(https?:\/\/[^"]+)"/g, '<a href="$1" target="_blank" rel="noopener noreferrer"');
  const onClick = (e: import("react").MouseEvent<HTMLDivElement>) => {
    const a = (e.target as HTMLElement).closest?.("a[data-aff]") as HTMLAnchorElement | null;
    if (a) trackProductClick({ product: a.dataset["aff"] ?? "", partner: a.dataset["partner"] ?? "", url: a.href, page: window.location.pathname });
  };
  return <div className={cn("prose-article", className)} onClick={onClick} dangerouslySetInnerHTML={{ __html: html }} />;
}
