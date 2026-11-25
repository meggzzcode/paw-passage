import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

// Readiness checks for stayDirectoryMode "public-sources" (NOT activated: the committed setting stays "affiliate-only").
// The mode and the set of approved links are flipped per test through these flags.
const flags = vi.hoisted(() => ({
  mode: "" as "" | "affiliate-only" | "public-sources",
  /** null = real links; a Set = only these affiliate ids count as approved; empty Set = all links removed. */
  approvedOnly: null as Set<string> | null,
}));
vi.mock("@/config/site", async (orig) => {
  const real = (await orig()) as { site: Record<string, unknown> };
  return {
    ...real,
    site: new Proxy(real.site, {
      get: (t, p) => (p === "stayDirectoryMode" && flags.mode ? flags.mode : t[p as string]),
    }),
  };
});
vi.mock("@/content/affiliates", async (orig) => {
  const real = (await orig()) as { getApprovedLink: (id?: string) => unknown };
  return {
    ...real,
    getApprovedLink: (id?: string, ...rest: unknown[]) =>
      flags.approvedOnly && !(id && flags.approvedOnly.has(id))
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
import { BookingButton } from "@/components/site/BookingButton";

const HOSTS = new Set(["www.vrbo.com", "www.airbnb.com", "vrbo.com", "airbnb.com"]);
const TRACKING =
  /affiliate|irclickid|clickid|sharedid|subid|impact|prf\.hn|evyy\.net|tidd\.ly|utm_|cjevent|awc=|ref=|[?#]/i;

function under(
  mode: "affiliate-only" | "public-sources",
  approvedOnly: Set<string> | null,
  fn: () => void,
) {
  flags.mode = mode;
  flags.approvedOnly = approvedOnly;
  try {
    fn();
  } finally {
    flags.mode = "";
    flags.approvedOnly = null;
  }
}
const stayPaths = () =>
  sitemapEntries()
    .map((e) => e.path)
    .filter((p) => p.startsWith("/stays/"));
const count = () => {
  const visible = visibleStays({ includeSamples: false });
  return {
    visible: visible.length,
    indexable: indexableStays(visible).length,
    sitemap: stayPaths().length,
  };
};

describe("public-sources readiness: source URLs", () => {
  it("every displayed source URL is a clean public Vrbo/Airbnb listing address (no seller deeplink, no tracking)", () => {
    under("public-sources", new Set(), () => {
      const listed = visibleStays({ includeSamples: false });
      expect(listed).toHaveLength(78);
      for (const s of listed) {
        const u = new URL(s.sourceUrl);
        expect(u.protocol, s.slug).toBe("https:");
        expect(HOSTS.has(u.host), `${s.slug} ${u.host}`).toBe(true);
        expect(s.sourceUrl, s.slug).not.toMatch(TRACKING);
        expect(u.search + u.hash, s.slug).toBe("");
        expect(u.pathname, s.slug).toMatch(/^\/\d+$/);
      }
    });
  });
});

describe("public-sources readiness: button labels", () => {
  it("plain button names the real destination and claims nothing else", () => {
    under("public-sources", new Set(), () => {
      for (const stay of visibleStays({ includeSamples: false })) {
        for (const props of [{}, { book: true }, { compact: true }]) {
          const html = renderToStaticMarkup(createElement(BookingButton, { stay, ...props }));
          const text = html.replace(/<[^>]+>/g, "");
          const name = /vrbo\.com/.test(stay.sourceUrl) ? "Vrbo" : "Airbnb";
          expect(text, stay.slug).toMatch(new RegExp(`^View (the listing )?on ${name}$`));
          expect(text, stay.slug).not.toMatch(
            /book|reserve|affiliate|commission|earn|sponsor|verified|confirmed|available|partner|deal|best price/i,
          );
          expect(html, stay.slug).toContain(`href="${stay.sourceUrl}"`);
          expect(html, stay.slug).toContain('rel="nofollow noopener"');
        }
      }
    });
  });
});

describe("public-sources readiness: visible, indexable and sitemap counts", () => {
  it("with the current links: 78 listed, 23 indexable, 55 noindex, identical in both modes", () => {
    let a = { visible: 0, indexable: 0, sitemap: 0 };
    let p = { visible: 0, indexable: 0, sitemap: 0 };
    under("affiliate-only", null, () => (a = count()));
    under("public-sources", null, () => (p = count()));
    expect(a).toEqual({ visible: 78, indexable: 23, sitemap: 23 });
    expect(p).toEqual(a);
    expect(a.visible - a.indexable).toBe(55);
  });

  it("the same stays are indexable in both modes (the rule does not look at the mode)", () => {
    let a: string[] = [];
    let p: string[] = [];
    under("affiliate-only", null, () => (a = stayPaths()));
    under("public-sources", null, () => (p = stayPaths()));
    expect(p).toEqual(a);
  });

  it("seller Vrbo links removed: public-sources keeps 78 listed / 23 indexable; affiliate-only goes to 0", () => {
    let a = { visible: -1, indexable: -1, sitemap: -1 };
    let p = { visible: -1, indexable: -1, sitemap: -1 };
    under("affiliate-only", new Set(), () => (a = count()));
    under("public-sources", new Set(), () => (p = count()));
    expect(a).toEqual({ visible: 0, indexable: 0, sitemap: 0 });
    expect(p).toEqual({ visible: 78, indexable: 23, sitemap: 23 });
    under("public-sources", new Set(), () => {
      expect(sitemapEntries().map((e) => e.path)).toContain("/stays");
    });
    under("affiliate-only", new Set(), () => {
      expect(sitemapEntries().map((e) => e.path)).not.toContain("/stays");
    });
  });
});

describe("public-sources with some affiliate links still approved (defined behaviour)", () => {
  it("a stay with an approved link keeps its labelled affiliate button; the rest get the plain, unlabelled link", () => {
    const withLink = allStayRecords().filter(hasPlainSourceLink).slice(0, 3);
    const ids = new Set(withLink.map((s) => s.affiliateId!));
    under("public-sources", ids, () => {
      const listed = visibleStays({ includeSamples: false });
      expect(listed).toHaveLength(78);
      for (const s of listed) {
        const html = renderToStaticMarkup(createElement(BookingButton, { stay: s }));
        if (ids.has(s.affiliateId ?? "")) {
          expect(stayEarns(s), s.slug).toBe(true);
          expect(html, s.slug).toContain('rel="sponsored nofollow noopener"');
          expect(html, s.slug).toContain("Affiliate link");
        } else {
          expect(stayEarns(s), s.slug).toBe(false);
          expect(html, s.slug).toContain('rel="nofollow noopener"');
          expect(html, s.slug).not.toMatch(/affiliate|sponsored|commission/i);
          expect(html, s.slug).toContain(`href="${s.sourceUrl}"`);
        }
      }
    });
  });
});
