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

describe("sources in article text", () => {
  it("shows no superscript numbers: a leftover [[n]] marker becomes a parenthetical publisher link", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { Markdown } = await import("@/components/site/Markdown");
    const html = renderToStaticMarkup(
      <Markdown
        source={"A claim. [[2]](https://example.com/b) More [[9]](https://www.example.org/x)."}
        sources={[{ publisher: "Airbnb" }, { publisher: "U.S. Department of Justice" }]}
      />,
    );
    expect(html).not.toContain("<sup");
    expect(html).not.toContain("cite");
    expect(html).not.toContain("#src-");
    expect(html).not.toContain("[2]");
    expect(html).toContain(
      '<span class="src-paren">(<a href="https://example.com/b" target="_blank" rel="noopener noreferrer">DOJ</a>)</span>',
    );
    // A number the sources list does not know falls back to the address host.
    expect(html).toContain(">example.org</a>");
  });
  it("renders an inline publisher link as a normal external link, a parenthetical one quietly", async () => {
    const { renderToStaticMarkup } = await import("react-dom/server");
    const { Markdown } = await import("@/components/site/Markdown");
    const html = renderToStaticMarkup(
      <Markdown
        source={
          "[PetMD](https://example.com/a) says so. It holds ([Airbnb](https://example.com/b), [Vrbo](https://example.com/c)). See (our [guide](/guides/x))."
        }
      />,
    );
    expect(html).toContain(
      '<a href="https://example.com/a" target="_blank" rel="noopener noreferrer">PetMD</a>',
    );
    expect(html).toContain('<span class="src-paren">(<a href="https://example.com/b"');
    expect(html).toContain(">Vrbo</a>)</span>");
    // An on-site link in parentheses is not a publisher link.
    expect(html).not.toContain('<span class="src-paren">(our');
    expect(html).not.toMatch(/<a [^>]*id="cite/);
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
  it("is a collapsed details element with an unnumbered list: publisher, linked title, read date", async () => {
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
      component: () => <SourcesList sources={sources} />,
    });
    const router = createRouter({
      routeTree: root,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    await router.load();
    const html = renderToStaticMarkup(<RouterProvider router={router} />);
    expect(html).toContain("<details");
    expect(html).toContain("<ul");
    expect(html).not.toContain("<ol");
    expect(html).not.toMatch(/id="src-/);
    expect(html).toContain("Show the 2 sources");
    expect(html).toContain("Airbnb.");
    expect(html).toContain("(read 2026-11-18)");
    expect(html).not.toContain("back to text");
    expect(html).not.toContain("#cite-");
    expect(html).toContain('href="/methodology"');
    expect(html).toContain('href="/editorial-standards#use-of-artificial-intelligence"');
    expect(html).toContain('href="https://example.com/a"');
  });
});
