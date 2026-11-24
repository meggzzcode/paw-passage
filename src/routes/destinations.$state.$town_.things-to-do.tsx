import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getState, getTown } from "@/content/destinations";
import {
  getTownRead,
  townReadIsPublic,
  townReadPath,
  townReadWordCount,
} from "@/content/town-reads";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Markdown, articleHeadings } from "@/components/site/Markdown";
import { SourcesList } from "@/components/site/SourcesList";
import { AffiliateNotice } from "@/components/site/AffiliateNotice";
import { TableOfContents } from "@/components/site/TableOfContents";
import { PreviewBadge } from "@/components/site/StatusBadge";
import { pageHead, breadcrumbLd, jsonLd, absoluteUrl, isoDate } from "@/lib/seo";
import { site } from "@/config/site";

// A companion article under a destination town: /destinations/<state>/<town>/things-to-do. It is not a guide.
// Drafts are reachable for preview but noindex; the page gate is the same one guides use (guideIsPublic).
export const Route = createFileRoute("/destinations/$state/$town_/things-to-do")({
  loader: ({ params }) => {
    const d = getState(params.state);
    const t = getTown(params.state, params.town);
    const r = getTownRead(params.state, params.town);
    if (!d || !t || !r) throw notFound();
    return { d, t, r };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    const { d, t, r } = loaderData;
    const path = townReadPath(params.state, params.town);
    const h = pageHead({
      title: r.seoTitle,
      description: r.seoDescription,
      path,
      type: "article",
      noindex: !townReadIsPublic(r),
    });
    return {
      ...h,
      meta: [...h.meta, { property: "article:modified_time", content: isoDate(r.lastReviewed) }],
      scripts: [
        {
          type: "application/ld+json",
          children: jsonLd({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: r.title,
            description: r.seoDescription,
            datePublished: isoDate(r.publishedOn),
            dateModified: isoDate(r.lastReviewed),
            author: { "@type": "Organization", name: r.author },
            publisher: { "@type": "Organization", name: site.name },
            mainEntityOfPage: absoluteUrl(path),
            about: { "@type": "TouristDestination", name: `${t.name}, ${d.name}` },
          }),
        },
        breadcrumbLd([
          { name: "Home", path: "/" },
          { name: "Destinations", path: "/destinations" },
          { name: d.name, path: `/destinations/${d.slug}` },
          { name: t.name, path: `/destinations/${d.slug}/${t.slug}` },
          { name: "Things to do", path },
        ]),
      ],
    };
  },
  component: TownReadPage,
});

function TownReadPage() {
  const { d, t, r } = Route.useLoaderData();
  const headings = articleHeadings(r.body);
  const minutes = Math.max(1, Math.round(townReadWordCount(r.body) / 220));
  return (
    <article>
      <div className="container-page pt-4 sm:pt-10">
        <Breadcrumbs
          hideCurrentOnPhone
          items={[
            { label: "Home", to: "/" },
            { label: "Destinations", to: "/destinations" },
            { label: d.name, to: `/destinations/${d.slug}` },
            { label: t.name, to: `/destinations/${d.slug}/${t.slug}` },
            { label: "Things to do" },
          ]}
        />
        {!townReadIsPublic(r) && (
          <div className="mt-6 rounded-lg border border-dashed border-terracotta/60 bg-accent/40 p-4 text-sm">
            <PreviewBadge>Draft, preview only</PreviewBadge>
          </div>
        )}
        <header className="mx-auto mt-3 max-w-3xl text-center sm:mt-10">
          <p className="eyebrow">
            {t.name}, {d.name}
          </p>
          <h1 className="mt-1.5 text-[1.7rem] leading-tight sm:mt-3 sm:text-4xl md:text-5xl">
            {r.title}
          </h1>
          <p className="mt-2 text-[0.95rem] leading-snug text-muted-foreground sm:mt-4 sm:text-lg sm:leading-normal">
            {r.dek}
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            By {r.author} · {minutes} min read · Sources read {r.lastReviewed}
          </p>
        </header>
      </div>
      <div className="container-page mt-6 grid gap-12 sm:mt-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="mx-auto w-full min-w-0 max-w-[42rem]">
          <AffiliateNotice guide={r} />
          <TableOfContents headings={headings} variant="mobile" />
          <Markdown source={r.body} sources={r.sources} />
          <section className="mt-16 rounded-xl bg-muted p-6 text-sm">
            <h2 className="font-display text-xl">Sources and how we researched this</h2>
            <SourcesList sources={r.sources} />
          </section>
          <p className="mt-8">
            <Link
              to="/destinations/$state/$town"
              params={{ state: d.slug, town: t.slug }}
              className="text-primary underline"
            >
              Back to dog-friendly {t.name}
            </Link>
          </p>
        </div>
        <aside className="no-print hidden lg:block lg:sticky lg:top-24 lg:self-start">
          <TableOfContents headings={headings} variant="sidebar" />
        </aside>
      </div>
    </article>
  );
}
