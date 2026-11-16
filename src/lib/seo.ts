import { site } from "@/config/site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  noindex?: boolean;
  image?: string; // absolute https only
}

export function pageHead({ title, description, path, type = "website", noindex, image }: PageMetaInput) {
  const fullTitle = title.includes(site.name) ? title : `${title} | ${site.name}`;
  const meta: Record<string, string>[] = [
    { title: fullTitle },
    { name: "description", content: description },
    { property: "og:title", content: fullTitle },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:url", content: path },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: fullTitle },
    { name: "twitter:description", content: description },
  ];
  if (noindex) meta.push({ name: "robots", content: "noindex, nofollow" });
  if (image) meta.push({ property: "og:image", content: image }, { name: "twitter:image", content: image });
  return { meta, links: [{ rel: "canonical", href: path }] };
}

export function breadcrumbLd(items: { name: string; path: string }[]) {
  return {
    type: "application/ld+json",
    children: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.path })),
    }),
  };
}
