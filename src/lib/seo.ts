import { site } from "@/config/site";
import { visibleStays, type Stay } from "@/content/stays";
import { getState, getTown } from "@/content/destinations";
import { stayIndexability, townIndexability, stateIndexability, type Indexability } from "@/content/publish-rule";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  image?: string; // absolute https only
}

/** Absolute URL for a path once siteUrl is configured; otherwise the path unchanged. */
export function absoluteUrl(path: string) {
  const base: string = site.siteUrl;
  if (!base || /^https?:\/\//.test(path)) return path;
  return base.replace(/\/+$/, "") + (path.startsWith("/") ? path : `/${path}`);
}

/** Stable 1200x630 share image for pages without their own (not the hashed hero import, so cached shares survive rebuilds). */
export const DEFAULT_SHARE_IMAGE = "/share/default.jpg";

/** True when a verified stay exists in the town (kept for callers that ask only about verification; indexing no longer depends on it). */
export function townHasVerifiedStay(townSlug: string, list: Stay[] = visibleStays({ includeSamples: false })) {
  return list.some((s) => s.town === townSlug && s.status === "verified");
}

// Indexing decisions. One source of truth for page heads AND the sitemap (see src/content/publish-rule.ts for the rule).
const publicStays = () => visibleStays({ includeSamples: false });

/** Why a stay page is or is not offered to search engines. */
export function stayIndexDecision(s: Stay, list: Stay[] = publicStays()): Indexability {
  return stayIndexability(s, list);
}
export function stayIsIndexable(s: Stay, list: Stay[] = publicStays()) {
  return stayIndexDecision(s, list).indexable;
}
export function indexableStays(list: Stay[] = publicStays()) {
  return list.filter((s) => stayIsIndexable(s, list));
}
export function townIndexDecision(stateSlug: string, townSlug: string, list: Stay[] = publicStays()): Indexability {
  const t = getTown(stateSlug, townSlug);
  if (!t) return { indexable: false, missing: ["unknown town"], sections: 0 };
  return townIndexability(t, indexableStays(list).filter((s) => s.town === townSlug).length);
}
export const townIsIndexable = (stateSlug: string, townSlug: string, list: Stay[] = publicStays()) => townIndexDecision(stateSlug, townSlug, list).indexable;
export function stateIndexDecision(stateSlug: string, list: Stay[] = publicStays()): Indexability {
  const d = getState(stateSlug);
  if (!d) return { indexable: false, missing: ["unknown destination"], sections: 0 };
  return stateIndexability(d, d.towns.filter((t) => townIsIndexable(d.slug, t.slug, list)).length);
}
export const stateIsIndexable = (stateSlug: string, list: Stay[] = publicStays()) => stateIndexDecision(stateSlug, list).indexable;

/** Date-only content dates (YYYY-MM-DD) as ISO 8601 with a timezone offset, as Google recommends for Article dates. */
export function isoDate(d: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00-05:00` : d;
}

export function pageHead({ title, description, path, type = "website", noindex, image }: PageMetaInput) {
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const meta: Record<string, string>[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: absoluteUrl(path) },
    { property: "og:site_name", content: site.name },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  // Share previews (Facebook, Pinterest, iMessage...) need an absolute image address, so they appear once siteUrl is set.
  const preview = image ?? DEFAULT_SHARE_IMAGE;
  const previewUrl = /^https?:\/\//.test(preview) ? preview : site.siteUrl ? absoluteUrl(preview) : "";
  if (previewUrl) meta.push({ property: "og:image", content: previewUrl }, { name: "twitter:image", content: previewUrl });
  return { meta, links: [{ rel: "canonical", href: absoluteUrl(path) }] };
}

/** JSON for a <script type="application/ld+json"> block. "<" is escaped so text can never close the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c").replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    type: "application/ld+json",
    children: jsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
    }),
  };
}
