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

describe("source numbers follow reading order", () => {
  const sources = [
    { url: "https://e.com/one" },
    { url: "https://e.com/two" },
    { url: "https://e.com/three" },
    { url: "https://e.com/four" },
  ];
  const body =
    "A [[3]](https://e.com/three) b [[1]](https://e.com/one) c [two](https://e.com/two) d [[3]](https://e.com/three).";
  it("numbers by first appearance (marker or exact-URL link); unreferenced sources follow", async () => {
    const { citationDisplayMap } = await import("@/content/citations");
    expect([...citationDisplayMap(body, sources)]).toEqual([
      [3, 1],
      [1, 2],
      [2, 3],
      [4, 4],
    ]);
  });
  it("uses display numbers for text, aria-label, anchors and inline back-link ids", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { Markdown } = await import("@/components/site/Markdown");
    const html = renderToStaticMarkup(
      <Markdown source={body} sourceUrls={sources.map((s) => s.url)} />,
    );
    expect(html).toContain(
      '<sup class="cite"><a id="cite-1-1" href="#src-1" aria-label="Source 1: jump to the sources list">1</a></sup>',
    );
    expect(html).toContain('id="cite-1-2" href="#src-1"');
    expect(html).toContain('id="cite-2-1" href="#src-2"');
    expect(html).toMatch(/<a href="https:\/\/e.com\/two"[^>]* id="cite-3-1"/);
    expect(html).not.toContain('jump to the sources list">[');
    expect(html.indexOf("cite-1-1")).toBeLessThan(html.indexOf("cite-2-1"));
  });
  it("lists sources in display order with matching ids and back-links", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { SourcesList } = await import("@/components/site/SourcesList");
    const { citationDisplayMap, citedSourceNumbers } = await import("@/content/citations");
    const { RouterProvider, createMemoryHistory, createRouter, createRootRoute } =
      await import("@tanstack/react-router");
    const items = sources.map((s, i) => ({
      ...s,
      title: `T${i + 1}`,
      publisher: `P${i + 1}`,
      accessedOn: "2026-11-18",
    }));
    const root = createRootRoute({
      component: () => (
        <SourcesList
          sources={items}
          backLinks={citedSourceNumbers(body, items)}
          display={citationDisplayMap(body, items)}
        />
      ),
    });
    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    await router.load();
    const html = renderToStaticMarkup(<RouterProvider router={router} />);
    const order = [...html.matchAll(/id="src-(\d+)"[^>]*>.*?(T\d)/g)].map((m) => [m[1], m[2]]);
    expect(order).toEqual([
      ["1", "T3"],
      ["2", "T1"],
      ["3", "T2"],
      ["4", "T4"],
    ]);
    expect(html).toContain('href="#cite-1-1"');
    expect(html).toContain('href="#cite-3-1"');
    expect(html).not.toContain('href="#cite-4-1"');
  });
  it("shows the swipe hint hidden by default (the overflow check shows it client-side)", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { Markdown } = await import("@/components/site/Markdown");
    const html = renderToStaticMarkup(<Markdown source={"| a | b |\n|-|-|\n| 1 | 2 |"} />);
    expect(html).not.toContain("is-overflowing");
    expect(html).not.toContain('tabindex="0"');
  });
});

describe("reading time", () => {
  it("is computed from the body at 220 wpm, rounded up, ignoring link addresses", async () => {
    const { readingMinutes, bodyWordCount } = await import("@/lib/reading-time");
    const body = `${"word ".repeat(441)}[[1]](https://example.com/very/long/url) [link](https://example.com/x)`;
    expect(bodyWordCount(body)).toBe(442);
    expect(readingMinutes(body, 12)).toBe(3);
    expect(readingMinutes("word ".repeat(220), 12)).toBe(1);
    expect(readingMinutes("", 7)).toBe(7);
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
