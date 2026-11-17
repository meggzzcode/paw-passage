import { destinations } from "@/content/destinations";
import { allGuides, isPublic } from "@/content/guides";
import { visibleStays } from "@/content/stays";

export const staticPaths = [
  "/", "/stays", "/destinations", "/guides", "/tools",
  "/tools/checklist", "/tools/host-questions", "/tools/cost-calculator", "/tools/compare",
  "/about", "/contact", "/list-your-property", "/affiliate-disclosure", "/privacy", "/terms", "/editorial-standards",
];

/** Only public, indexable pages: published guides, verified stays. Never drafts or samples. */
export function sitemapEntries(): { path: string; lastmod?: string }[] {
  const liveStays = visibleStays({ includeSamples: false });
  // Until a verified stay exists, the stays directory, the compare tool and the town pages are noindexed, so they are left out of the sitemap too.
  const out: { path: string; lastmod?: string }[] = staticPaths
    .filter((path) => liveStays.length > 0 || (path !== "/stays" && path !== "/tools/compare"))
    .map((path) => ({ path }));
  for (const d of destinations) {
    out.push({ path: `/destinations/${d.slug}` });
    for (const t of d.towns) if (liveStays.some((s) => s.town === t.slug)) out.push({ path: `/destinations/${d.slug}/${t.slug}` });
  }
  for (const g of allGuides.filter(isPublic)) out.push({ path: `/guides/${g.slug}`, lastmod: g.lastReviewed });
  for (const s of visibleStays({ includeSamples: false })) out.push({ path: `/stays/${s.slug}`, ...(s.lastVerified ? { lastmod: s.lastVerified } : {}) });
  return out;
}

export function sitemapXml(baseUrl: string, entries: { path: string; lastmod?: string }[]) {
  const origin = new URL(baseUrl).origin;
  const esc = (v: string) => v.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const urls = entries.map((e) => `<url><loc>${esc(origin + e.path)}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ""}</url>`).join("");
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}
