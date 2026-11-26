import { landingFor } from "@/components/site/landing-pages";
import { breadcrumbLd, pageHead } from "@/lib/seo";

/** Route head for one landing page: canonical, metadata and breadcrumb data. Never a personalized filter URL. */
export function landingHead(slug: string) {
  const l = landingFor(slug);
  const h = pageHead({ title: l.title, description: l.description, path: l.path });
  return { ...h, scripts: [breadcrumbLd([{ name: l.h1, path: l.path }])] };
}
