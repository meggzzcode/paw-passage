import { site } from "@/config/site";
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

/** Date-only content dates (YYYY-MM-DD) as ISO 8601 with a timezone offset, as Google recommends for Article dates. */
export function isoDate(d: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(d) ? `${d}T00:00:00-05:00` : d;
}

export function pageHead({
  title,
  description,
  path,
  type = "website",
  noindex,
  image,
}: PageMetaInput) {
  // Keep the rendered title within 60 characters: the brand suffix is added only when it fits.
  const withBrand = `${title} | ${site.name}`;
  const fullTitle = title.includes(site.name) || withBrand.length > 60 ? title : withBrand;
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
  const previewUrl = /^https?:\/\//.test(preview)
    ? preview
    : site.siteUrl
      ? absoluteUrl(preview)
      : "";
  if (previewUrl)
    meta.push(
      { property: "og:image", content: previewUrl },
      { name: "twitter:image", content: previewUrl },
    );
  return { meta, links: [{ rel: "canonical", href: absoluteUrl(path) }] };
}

/** JSON for a <script type="application/ld+json"> block. "<" is escaped so text can never close the script tag. */
export function jsonLd(value: unknown): string {
  return JSON.stringify(value)
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    type: "application/ld+json",
    children: jsonLd({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: it.name,
        item: absoluteUrl(it.path),
      })),
    }),
  };
}
