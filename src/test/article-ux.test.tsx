import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { Markdown, articleHeadings } from "@/components/site/Markdown";
import { TableOfContents } from "@/components/site/TableOfContents";
import { TrustStrip } from "@/components/site/ArticleActions";

const src =
  "## The short answer\n\ntext\n\n## Fees\n\n### Fees\n\n## Fees\n\n| a | b |\n|---|---|\n| 1 | 2 |\n";
const base = { lastReviewed: "2026-11-16", sources: [{}, {}], body: "plain", gear: undefined };

describe("article UX", () => {
  it("wraps tables in a scroll container", () => {
    const out = renderToStaticMarkup(<Markdown source={src} />);
    expect(out).toMatch(/<div class="table-scroll[^"]*overflow-x-auto"[^>]*><table>/);
  });
  it("gives headings unique, stable ids", () => {
    const ids = articleHeadings(src).map((h) => h.id);
    expect(ids).toEqual(["the-short-answer", "fees", "fees-2", "fees-3"]);
    expect(articleHeadings(src).map((h) => h.id)).toEqual(ids);
    const out = renderToStaticMarkup(<Markdown source={src} />);
    for (const id of ids) expect(out).toContain(`id="${id}"`);
  });
  it("lists h2s only in the table of contents", () => {
    const out = renderToStaticMarkup(
      <TableOfContents headings={articleHeadings(src)} variant="sidebar" />,
    );
    expect(out).toContain('href="#the-short-answer"');
    expect(out).toContain('href="#fees-3"');
    expect(out).not.toContain('href="#fees-2"');
  });
  it("does not show a 'Not tested by us' label on any guide", () => {
    expect(
      renderToStaticMarkup(<TrustStrip guide={{ ...base, category: "Gear" }} />),
    ).not.toContain("Not tested");
    const planning = renderToStaticMarkup(<TrustStrip guide={{ ...base, category: "Planning" }} />);
    expect(planning).not.toContain("Not tested");
    expect(planning).toContain("Nov 16, 2026");
    expect(planning).toContain("2 sources cited");
    expect(planning).not.toContain("Affiliate");
    // No separator glyphs that could wrap to the start of a line.
    expect(planning).not.toContain("·");
  });
  it("never shows an 'Affiliate links disclosed' chip, even for monetised guides", () => {
    const out = renderToStaticMarkup(
      <TrustStrip
        guide={{ ...base, category: "Gear", body: "{{pick:kong-classic}}" }}
        lead="By Us · 5 min read"
      />,
    );
    expect(out).not.toMatch(/Affiliate links disclosed/);
    expect(out).toContain("By Us");
  });
});

describe("source numbers in article text", () => {
  it("are small superscript links that jump to the Sources list, not off-site", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { Markdown } = await import("@/components/site/Markdown");
    const html = renderToStaticMarkup(
      <Markdown
        source={
          "A claim. [[5]](https://example.com/a) More. [[10]](https://example.com/b) Again [[5]](https://example.com/a)"
        }
      />,
    );
    expect(html).toContain('<sup class="cite">');
    expect(html).toContain('href="#src-5"');
    expect(html).toContain('href="#src-10"');
    expect(html).toContain('id="cite-5-1"');
    expect(html).toContain('id="cite-5-2"');
    expect(html).toContain('aria-label="Source 5: jump to the sources list"');
    expect(html).not.toContain("[5]");
    // The marker stays on the page: no new tab, no off-site address.
    expect(html).not.toContain("example.com");
    expect(html).not.toMatch(/<sup class="cite"><a[^>]*target=/);
  });
  it("gives the first inline link to a source's exact URL a back-link id", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { Markdown } = await import("@/components/site/Markdown");
    const html = renderToStaticMarkup(
      <Markdown
        source={"[PetMD](https://example.com/a) says so. Also [other](https://example.com/z)."}
        sourceUrls={["https://example.com/a"]}
      />,
    );
    expect(html).toMatch(/<a href="https:\/\/example.com\/a"[^>]* id="cite-1-1"/);
    expect(html).toContain('rel="noopener noreferrer"');
    expect(html).not.toContain('id="cite-1-2"');
  });
});

describe("Sources list", () => {
  it("is a details element with an id per entry, publisher, read date and back-links", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { SourcesList } = await import("@/components/site/SourcesList");
    const { RouterProvider, createMemoryHistory, createRouter, createRootRoute } =
      await import("@tanstack/react-router");
    const sources = [
      {
        title: "Pet fees",
        url: "https://example.com/a",
        publisher: "Airbnb",
        accessedOn: "2026-11-18",
      },
      { title: "Rules", url: "https://example.com/b", publisher: "Vrbo", accessedOn: "2026-11-19" },
    ];
    const root = createRootRoute({
      component: () => <SourcesList sources={sources} backLinks={new Set([1])} />,
    });
    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    await router.load();
    const html = renderToStaticMarkup(<RouterProvider router={router} />);
    expect(html).toContain("<details");
    expect(html).toContain('id="src-1"');
    expect(html).toContain('id="src-2"');
    expect(html).toContain("Airbnb.");
    expect(html).toContain("(read 2026-11-18)");
    expect(html).toContain('href="#cite-1-1"');
    expect(html).not.toContain('href="#cite-2-1"');
    expect(html).toContain("back to text");
    expect(html).toContain('href="/methodology"');
    expect(html).toContain('href="/editorial-standards#use-of-artificial-intelligence"');
    expect(html).toContain('href="https://example.com/a"');
  });
});
