import { describe, expect, it } from "vitest";
import { allGuides } from "@/content/guides";
import { pageHead } from "@/lib/seo";
import { Route as home } from "@/routes/index";
import { Route as about } from "@/routes/about";
import { Route as contact } from "@/routes/contact";
import { Route as privacy } from "@/routes/privacy";
import { Route as terms } from "@/routes/terms";
import { Route as affiliateDisclosure } from "@/routes/affiliate-disclosure";
import { Route as editorial } from "@/routes/editorial-standards";
import { Route as refund } from "@/routes/refund-policy";
import { Route as guidesIndex } from "@/routes/guides.index";
import { Route as packing } from "@/routes/tools.packing-list";
import { Route as guidePage } from "@/routes/guides.$slug";

// Expedia Group's affiliate terms bar its marks in meta tags (section 12.7 as read 2026-11-18). H1 and body text may use the names.
const EXPEDIA = /vrbo|expedia|hotels\.com|homeaway/i;
// Non-guide pages (written in the route files) also stay free of Airbnb.
const BRANDS = /vrbo|expedia|hotels\.com|homeaway|airbnb/i;

type Head = { meta?: Record<string, string>[]; links?: unknown[] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const headOf = (route: any, ctx: Record<string, unknown> = {}): Head => route.options.head(ctx);
const text = (h: Head) => JSON.stringify(h.meta ?? []);
const prop = (h: Head, key: string) =>
  h.meta?.find((m) => m["property"] === key || m["name"] === key)?.["content"] ?? "";

describe("meta tags", () => {
  it("no guide's seoTitle or seoDescription names an Expedia Group brand", () => {
    for (const g of allGuides) {
      expect(`${g.seoTitle} ${g.seoDescription}`, g.slug).not.toMatch(
        /vrbo|expedia|hotels\.com|homeaway/i,
      );
    }
  });

  it("no brand name in any page's title, description, og or twitter tags, and titles/descriptions stay short", () => {
    const heads: [string, Head][] = [
      ["/", headOf(home)],
      ["/about", headOf(about)],
      ["/contact", headOf(contact)],
      ["/privacy", headOf(privacy)],
      ["/terms", headOf(terms)],
      ["/affiliate-disclosure", headOf(affiliateDisclosure)],
      ["/editorial-standards", headOf(editorial)],
      ["/refund-policy", headOf(refund)],
      ["/guides", headOf(guidesIndex)],
      ["/tools/packing-list", headOf(packing)],
    ];
    for (const g of allGuides)
      heads.push([
        `/guides/${g.slug}`,
        headOf(guidePage, { loaderData: { guide: g }, params: { slug: g.slug } }),
      ]);
    expect(heads.length).toBeGreaterThan(10);
    for (const [path, h] of heads) {
      expect(text(h), path).not.toMatch(path.startsWith("/guides/") ? EXPEDIA : BRANDS);
      // Brand names in a title/description are the rule; length limits apply to the non-guide pages tuned here.
      if (!path.startsWith("/guides/")) {
        expect(prop(h, "og:title").length, `${path} title`).toBeLessThanOrEqual(60);
        expect(prop(h, "description").length, `${path} description`).toBeLessThanOrEqual(155);
      }
      expect(prop(h, "og:title"), path).toBe(prop(h, "twitter:title"));
      expect(prop(h, "og:description"), path).toBe(prop(h, "twitter:description"));
    }
  });

  it("pageHead's final og/twitter tags carry no brand even when the title does not", () => {
    const h = pageHead({ title: "Dog fees", description: "What a dog costs.", path: "/x" });
    expect(text(h)).not.toMatch(BRANDS);
  });
});
