import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown, articleHeadings } from "@/components/site/Markdown";
import { TableOfContents } from "@/components/site/TableOfContents";
import { TrustStrip } from "@/components/site/ArticleActions";

const src = "## The short answer\n\ntext\n\n## Fees\n\n### Fees\n\n## Fees\n\n| a | b |\n|---|---|\n| 1 | 2 |\n";
const base = { lastReviewed: "2026-11-16", sources: [{}, {}], body: "plain", gear: undefined };

describe("article UX", () => {
  it("wraps tables in a scroll container", () => {
    const out = renderToStaticMarkup(<Markdown source={src} />);
    expect(out).toMatch(/<div class="table-scroll[^"]*overflow-x-auto"><table>/);
  });
  it("gives headings unique, stable ids", () => {
    const ids = articleHeadings(src).map((h) => h.id);
    expect(ids).toEqual(["the-short-answer", "fees", "fees-2", "fees-3"]);
    expect(articleHeadings(src).map((h) => h.id)).toEqual(ids);
    const out = renderToStaticMarkup(<Markdown source={src} />);
    for (const id of ids) expect(out).toContain(`id="${id}"`);
  });
  it("lists h2s only in the table of contents", () => {
    const out = renderToStaticMarkup(<TableOfContents headings={articleHeadings(src)} variant="sidebar" />);
    expect(out).toContain('href="#the-short-answer"');
    expect(out).toContain('href="#fees-3"');
    expect(out).not.toContain('href="#fees-2"');
  });
  it("shows 'Not tested by us' only on gear guides", () => {
    expect(renderToStaticMarkup(<TrustStrip guide={{ ...base, category: "Gear" }} />)).toContain("Not tested by us");
    const planning = renderToStaticMarkup(<TrustStrip guide={{ ...base, category: "Planning" }} />);
    expect(planning).not.toContain("Not tested");
    expect(planning).toContain("Nov 16, 2026");
    expect(planning).toContain("2 official sources");
    expect(planning).not.toContain("Affiliate");
  });
});

describe("source numbers in article text", () => {
  it("are small superscript links, not full-size bracketed links", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { Markdown } = await import("@/components/site/Markdown");
    const html = renderToStaticMarkup(<Markdown source={"A claim. [[5]](https://example.com/a) [[10]](https://example.com/b)"} />);
    expect(html).toContain('<sup class="cite">');
    expect(html).toContain('aria-label="Source 5"');
    expect(html).not.toContain("[5]");
    expect(html).toContain("https://example.com/b");
  });
});
