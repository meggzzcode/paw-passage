import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

// What the stay directory does when the seller's Vrbo links are removed (the buyer has not got an account yet).
const flags = vi.hoisted(() => ({ linksRemoved: false }));
vi.mock("@/content/affiliates", async (orig) => {
  const real = (await orig()) as { getApprovedLink: (id?: string) => unknown };
  return {
    ...real,
    getApprovedLink: (id?: string, ...rest: unknown[]) =>
      flags.linksRemoved
        ? undefined
        : (real.getApprovedLink as (...a: unknown[]) => unknown)(id, ...rest),
  };
});
vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/stays/x" }),
  Link: ({ children }: { children?: unknown }) => createElement("a", null, children as never),
}));

import { allStayRecords, visibleStays, hasPlainSourceLink, stayEarns } from "@/content/stays";
import { indexableStays } from "@/lib/seo";
import { sitemapEntries } from "@/lib/sitemap-entries";
import { settingsSchema } from "@/content/schema";
import { site } from "@/config/site";
import { BookingButton } from "@/components/site/BookingButton";

const SELLER_VRBO = /vrbo\.com\/affiliate\//;

describe("stay directory when seller Vrbo links are removed", () => {
  it("the sale configuration is public-sources (owner-approved 2026-11-25); the schema default stays affiliate-only", () => {
    expect(site.stayDirectoryMode).toBe("public-sources");
    expect(settingsSchema.parse({}).stayDirectoryMode).toBe("affiliate-only");
    expect(settingsSchema.parse({ stayDirectoryMode: "" }).stayDirectoryMode).toBe(
      "affiliate-only",
    );
    expect(settingsSchema.safeParse({ stayDirectoryMode: "anything" }).success).toBe(false);
    flags.linksRemoved = false;
    const listed = visibleStays({ includeSamples: false });
    expect(listed.length).toBe(78);
    // A public-sources switch changes nothing while every listed stay has its approved link.
    expect(
      visibleStays({ includeSamples: false, mode: "public-sources" }).length,
    ).toBeGreaterThanOrEqual(78);
  });

  it("AFFILIATE-ONLY mode with the links removed: every stay disappears (0 listed, 0 indexable, the sitemap rule follows the shipped mode)", () => {
    flags.linksRemoved = true;
    try {
      expect(allStayRecords().length).toBe(83);
      expect(visibleStays({ includeSamples: false, mode: "affiliate-only" })).toHaveLength(0);
      expect(
        indexableStays(visibleStays({ includeSamples: false, mode: "affiliate-only" })),
      ).toHaveLength(0);
    } finally {
      flags.linksRemoved = false;
    }
  });

  it("SHIPPED mode (public-sources) with the links removed: /stays and 23 stay pages stay in the sitemap", () => {
    flags.linksRemoved = true;
    try {
      const paths = sitemapEntries().map((e) => e.path);
      expect(paths).toContain("/stays");
      expect(paths.filter((p) => p.startsWith("/stays/"))).toHaveLength(23);
    } finally {
      flags.linksRemoved = false;
    }
  });

  it("PUBLIC-SOURCES mode with the links removed: stays with a public Vrbo/Airbnb source link stay listed, nothing earns", () => {
    flags.linksRemoved = true;
    try {
      const listed = visibleStays({ includeSamples: false, mode: "public-sources" });
      expect(listed.length).toBe(allStayRecords().filter(hasPlainSourceLink).length);
      expect(listed.length).toBeGreaterThanOrEqual(78);
      for (const s of listed) {
        expect(stayEarns(s), s.slug).toBe(false);
        expect(s.status === "verified" || s.status === "unverified", s.slug).toBe(true);
        expect(hasPlainSourceLink(s), s.slug).toBe(true);
      }
      // None of the stays with a non-Vrbo/Airbnb source (no button to offer) are pulled in.
      expect(
        allStayRecords()
          .filter((s) => !hasPlainSourceLink(s))
          .every((s) => !listed.includes(s)),
      ).toBe(true);
    } finally {
      flags.linksRemoved = false;
    }
  });

  it("PUBLIC-SOURCES button is a plain nofollow link to the public listing: no affiliate label, no seller deeplink, no approval claim", () => {
    flags.linksRemoved = true;
    try {
      const stay = visibleStays({ includeSamples: false, mode: "public-sources" })[0]!;
      const html = renderToStaticMarkup(createElement(BookingButton, { stay }));
      expect(html).toContain(`href="${stay.sourceUrl}"`);
      expect(html).toContain('rel="nofollow noopener"');
      expect(html).not.toContain("sponsored");
      expect(html).not.toMatch(SELLER_VRBO);
      expect(html).not.toMatch(/affiliate|commission|earn|verified|approved|partner/i);
      expect(html).toMatch(/View the listing on (Vrbo|Airbnb)/);
    } finally {
      flags.linksRemoved = false;
    }
  });

  it("with the seller links present the button is unchanged: an affiliate button with its label", () => {
    flags.linksRemoved = false;
    const stay = visibleStays({ includeSamples: false })[0]!;
    const html = renderToStaticMarkup(createElement(BookingButton, { stay }));
    expect(html).toContain('rel="sponsored nofollow noopener"');
    expect(html).toContain("Affiliate link");
  });
});
