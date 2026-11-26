import { allGuides, isPublic } from "@/content/guides";
import { hasGear, liveCategories } from "@/content/gear-hub";
import { allJournal } from "@/lib/journal";
import { collections } from "@/passport/content";

export const staticPaths = [
  "/",
  "/discover",
  "/collections",
  "/unlock",
  "/faq",
  "/printables",
  // The broad hub (indexable; personalized filter combinations are never listed). Topic pages live in the Journal.
  "/things-to-do-with-your-dog",
  "/our-story",
  "/guides",
  "/tools/packing-list",
  "/about",
  "/contact",
  "/affiliate-disclosure",
  "/privacy",
  "/terms",
  "/refund-policy",
  "/disclaimer",
  "/editorial-standards",
  "/methodology",
  "/corrections",
];

/** Only public, indexable pages: the Passport pages, curated collections, published guides and the gear hub. Never drafts, and never the private pages (/passport, /restore-access, customer collections). */
export function sitemapEntries(): { path: string; lastmod?: string }[] {
  const out: { path: string; lastmod?: string }[] = staticPaths.map((path) => ({ path }));
  for (const c of collections) out.push({ path: `/collections/${c.slug}` });
  // The gear hub and its category pages are indexable only once a category has enough products (see src/content/gear-hub.ts).
  if (hasGear()) {
    out.push({ path: "/gear" });
    for (const c of liveCategories()) out.push({ path: `/gear/${c.slug}` });
  }
  for (const g of allGuides.filter(isPublic))
    out.push({ path: `/guides/${g.slug}`, lastmod: g.lastReviewed });
  // The Adventure Journal: the index (lastmod = newest article change) and every article with its real modified date.
  const newest = allJournal
    .map((a) => a.dateModified)
    .sort()
    .at(-1);
  if (allJournal.length) {
    out.push({
      path: "/journal",
      ...(newest ? { lastmod: newest } : {}),
    });
    for (const a of allJournal) out.push({ path: `/journal/${a.slug}`, lastmod: a.dateModified });
  }
  return out;
}

export function sitemapXml(baseUrl: string, entries: { path: string; lastmod?: string }[]) {
  const origin = new URL(baseUrl).origin;
  const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const urls = entries
    .map(
      (e) =>
        `<url><loc>${esc(origin + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`,
    )
    .join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
