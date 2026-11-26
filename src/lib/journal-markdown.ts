// Safe Markdown to HTML for journal articles. Raw HTML in an article is shown as text; only web, mail and on-site links survive.
import { Marked, type Tokens } from "marked";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const safe = (h?: string | null) =>
  h && /^(https?:\/\/|mailto:|\/(?!\/)|#)/i.test(h.trim()) ? h.trim() : null;

const md = new Marked({
  gfm: true,
  renderer: {
    html: (t: Tokens.HTML | Tokens.Tag) => esc(t.text),
    link({ href, title, tokens }: Tokens.Link) {
      const text = this.parser.parseInline(tokens);
      const url = safe(href);
      if (!url) return text;
      const external = /^https?:\/\//i.test(url);
      return `<a href="${esc(url)}"${title ? ` title="${esc(title)}"` : ""}${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>${text}</a>`;
    },
    image: ({ text }: Tokens.Image) => esc(text), // inline images are not supported; the hero image comes from the settings block
    // An article has exactly one h1 (the title), so any "# " in the body becomes an h2 and deeper levels follow.
    heading({ tokens, depth }: Tokens.Heading) {
      const level = Math.min(Math.max(depth, 1) + (depth === 1 ? 1 : 0), 4);
      return `<h${level}>${this.parser.parseInline(tokens)}</h${level}>\n`;
    },
  },
});

export function renderJournalMarkdown(source: string): string {
  return md.parse(source, { async: false });
}
