import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { allGuides, isPublic } from "@/content/guides";
import { renderInlineMarkdown } from "@/components/site/Markdown";
import { faqPageJsonLd, faqPlainText } from "@/lib/faq-text";
import { guideReadingMinutes } from "@/lib/reading-time";
import { GuideCard } from "@/components/site/GuideCard";
import { guideSummary } from "../../plugins/content";

const published = allGuides.filter(isPublic);

describe("FAQ answers", () => {
  it("never show raw Markdown link syntax, and links render as real anchors", () => {
    const withLinks = [];
    for (const g of published)
      for (const f of g.faqs) {
        const html = renderInlineMarkdown(f.a);
        expect(html, `${g.slug}: ${f.q}`).not.toContain("](");
        expect(html, `${g.slug}: ${f.q}`).not.toMatch(/\[[^\]]+\]\(/);
        if (/\]\(/.test(f.a)) withLinks.push(html);
      }
    expect(withLinks.length).toBeGreaterThan(0);
    for (const html of withLinks) expect(html).toContain("<a ");
  });
  it("renders the pet-fee link in the large-dogs FAQ as a link to the guide", () => {
    const html = renderInlineMarkdown(
      "the [pet-fee guide](/guides/how-vacation-rental-pet-fees-work) explains the terms.",
    );
    expect(html).toContain('<a href="/guides/how-vacation-rental-pet-fees-work">pet-fee guide</a>');
  });
  it("escapes raw HTML and drops unsafe addresses", () => {
    expect(renderInlineMarkdown("<script>x</script>")).not.toContain("<script>");
    expect(renderInlineMarkdown("[x](javascript:alert(1))")).not.toContain("javascript:");
  });
  it("keeps FAQPage JSON-LD answers as clean plain text", () => {
    const ld = JSON.stringify(faqPageJsonLd(published.flatMap((g) => g.faqs)));
    expect(ld).not.toContain("](");
    expect(ld).not.toMatch(/\[[^\]]*\]\(|\*\*|`/);
    expect(faqPlainText("See the [pet-fee guide](/guides/x) and **this**.")).toBe(
      "See the pet-fee guide and this.",
    );
  });
});

describe("reading time", () => {
  const cards = (slug: string) => {
    const g = allGuides.find((x) => x.slug === slug)!;
    // A production build gives list pages a summary without the text; the header has the full guide.
    const summary = guideSummary(g) as unknown as typeof g;
    expect(summary.body).toBe("");
    return { g, summary };
  };
  it.each(["how-vacation-rental-pet-fees-work", "dog-ramp-or-steps-for-the-car-and-cabin"])(
    "header and guide card show the same minutes: %s",
    async (slug) => {
      const { g, summary } = cards(slug);
      const header = guideReadingMinutes(g);
      expect(guideReadingMinutes(summary)).toBe(header);
      const { RouterProvider, createMemoryHistory, createRouter, createRootRoute } =
        await import("@tanstack/react-router");
      const root = createRootRoute({ component: () => <GuideCard guide={summary} /> });
      const router = createRouter({
        routeTree: root,
        history: createMemoryHistory({ initialEntries: ["/"] }),
      });
      await router.load();
      const html = renderToStaticMarkup(<RouterProvider router={router} />);
      expect(html).toContain(`${header} min read`);
    },
  );
});
