import { destinations } from "@/content/destinations";
import { allGuides, isPublic } from "@/content/guides";
import { visibleStays } from "@/content/stays";
import { visiblePlaces } from "@/content/places";
import { dogTypes, dogTypeIsLive } from "@/content/dog-types";
import { hasGear, liveCategories } from "@/content/gear-hub";
import { indexableStays, townIsIndexable, stateIsIndexable } from "@/lib/seo";

export const staticPaths = [
  "/", "/stays", "/destinations", "/guides", "/tools",
  "/tools/checklist", "/tools/pet-cost-check", "/tools/will-my-dog-be-accepted", "/tools/packing-list", "/data/pet-policies",
  "/about", "/contact", "/list-your-property", "/affiliate-disclosure", "/privacy", "/terms", "/editorial-standards", "/methodology", "/corrections",
];

/** Only public, indexable pages: published guides, stays/towns/states that pass the indexing quality rule (src/content/publish-rule.ts). Never drafts or samples. */
export function sitemapEntries(): { path: string; lastmod?: string }[] {
  // A stay is indexed when it passes the quality rule (not when it is verified); thin stays are shown but kept out of search.
  const allStays = visibleStays({ includeSamples: false });
  const liveStays = indexableStays(allStays);
  // The stays directory is indexable once any stay is listed (its own filter tool and comparison cards are the content).
  const out: { path: string; lastmod?: string }[] = staticPaths
    .filter((path) => visibleStays({ includeSamples: false }).length > 0 || path !== "/stays")
    .map((path) => ({ path }));
  for (const d of destinations) {
    if (stateIsIndexable(d.slug, allStays)) out.push({ path: `/destinations/${d.slug}` });
    for (const t of d.towns) if (townIsIndexable(d.slug, t.slug, allStays)) out.push({ path: `/destinations/${d.slug}/${t.slug}` });
  }
  // The dog-rules lookup is noindexed until a verified place exists, so it joins the sitemap only then (verified places only, never unverified seeds).
  const livePlaces = visiblePlaces({ includeUnverified: false });
  if (livePlaces.length > 0) {
    out.push({ path: "/dog-rules" });
    for (const p of livePlaces) out.push({ path: `/dog-rules/${p.slug}`, ...(p.lastChecked ? { lastmod: p.lastChecked } : {}) });
  }
  out.push({ path: "/dogs" });
  for (const d of dogTypes.filter(dogTypeIsLive)) out.push({ path: `/dogs/${d.slug}` });
  // The gear hub and its category pages are indexable only once a category has enough products (see src/content/gear-hub.ts).
  if (hasGear()) {
    out.push({ path: "/gear" });
    for (const c of liveCategories()) out.push({ path: `/gear/${c.slug}` });
  }
  for (const g of allGuides.filter(isPublic)) out.push({ path: `/guides/${g.slug}`, lastmod: g.lastReviewed });
  for (const s of liveStays) out.push({ path: `/stays/${s.slug}`, ...(s.lastVerified ? { lastmod: s.lastVerified } : {}) });
  return out;
}

export function sitemapXml(baseUrl: string, entries: { path: string; lastmod?: string }[]) {
  const origin = new URL(baseUrl).origin;
  const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const urls = entries.map((e) => `<url><loc>${esc(origin + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
