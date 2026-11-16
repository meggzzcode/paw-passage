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
  if (image) meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
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
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.path })),
    }),
  };
}
