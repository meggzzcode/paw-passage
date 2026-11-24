import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getGuide, isPublic, loadGuide } from "@/content/guides";
import { guideHero, srcSetForKey } from "@/lib/images";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Markdown, articleHeadings } from "@/components/site/Markdown";
import { RelatedProducts } from "@/components/site/RelatedProducts";
import { GearPicks } from "@/components/site/GearPicks";
import { AffiliateNotice } from "@/components/site/AffiliateNotice";
import { GuideCard } from "@/components/site/GuideCard";
import { PreviewBadge } from "@/components/site/StatusBadge";
import { pageHead, breadcrumbLd, jsonLd, absoluteUrl, isoDate } from "@/lib/seo";
import { site } from "@/config/site";
import { TableOfContents } from "@/components/site/TableOfContents";
import { pickIdsInBody } from "@/lib/product-display";
import { ArticleActions, TrustStrip } from "@/components/site/ArticleActions";

const toolLabels = {
  checklist: { to: "/tools/checklist", label: "Before-you-book checklist" },
  "will-my-dog-be-accepted": {
    to: "/tools/will-my-dog-be-accepted",
    label: "Will my dog be accepted?",
  },
  "packing-list": { to: "/tools/packing-list", label: "Pack your dog's bag" },
} as const;

export const Route = createFileRoute("/guides/$slug")({
  loader: async ({ params }) => {
    const guide = await loadGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData)
      return { meta: [{ title: "Guide unavailable" }, { name: "robots", content: "noindex" }] };
    const g = loaderData.guide;
    const path = `/guides/${params.slug}`;
    const h = pageHead({
      title: g.seoTitle,
      description: g.seoDescription,
      path,
      type: "article",
      noindex: !isPublic(g),
      image: `/share/${g.slug}.jpg`,
    });
    const scripts = [
      {
        type: "application/ld+json",
        children: jsonLd({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: g.title,
          description: g.seoDescription,
          image: absoluteUrl(`/share/${g.slug}.jpg`),
          datePublished: isoDate(g.publishedOn),
          dateModified: isoDate(g.lastReviewed),
          author: { "@type": "Organization", name: g.author },
          publisher: { "@type": "Organization", name: site.name },
          mainEntityOfPage: absoluteUrl(path),
        }),
      },
      breadcrumbLd([
        { name: "Guides", path: "/guides" },
        { name: g.title, path },
      ]),
    ];
    // No FAQPage JSON-LD: Google stopped showing FAQ rich results on May 7, 2026 (docs/recovery/FAQPAGE-DECISION.md). The visible questions below stay.
    return {
      ...h,
      meta: [...h.meta, { property: "article:modified_time", content: isoDate(g.lastReviewed) }],
      scripts,
    };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide: g } = Route.useLoaderData();
  const img = guideHero(g);
  const headings = articleHeadings(g.body);
  const tools = g.relatedTools;
  const inBody = pickIdsInBody(g.body);
  const shownAsPicks = [...inBody, ...(g.gear ?? []).map((x) => x.productId)];
  const related = g.relatedGuides
    .map((s) => getGuide(s))
    .filter((x) => !!x)
    .slice(0, 3);
  return (
    <article>
      <div className="container-page pt-6 sm:pt-10">
        <Breadcrumbs
          items={[
            { label: "Home", to: "/" },
            { label: "Guides", to: "/guides" },
            { label: g.title },
          ]}
        />
        {!isPublic(g) && (
          <div className="mt-6 rounded-lg border border-dashed border-terracotta/60 bg-accent/40 p-4 text-sm">
            <PreviewBadge>Draft, preview only</PreviewBadge>
            <span className="ml-2">
              Hidden from the live site and search engines until these are checked:
            </span>
            <ul className="mt-2 list-disc pl-6">
              {g.research.unverified.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          </div>
        )}
        <header className="mx-auto mt-6 max-w-3xl text-center sm:mt-10">
          <p className="eyebrow">{g.category} guide</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-6xl">{g.title}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{g.dek}</p>
          <p className="mt-4 text-sm text-muted-foreground sm:mt-5">
            By {g.author} · {g.readingMinutes} min read
          </p>
          <TrustStrip guide={g} />
          <ArticleActions slug={g.slug} title={g.title} />
        </header>
      </div>
      <img
        src={img.src}
        srcSet={g.heroUpload ? undefined : srcSetForKey(g.heroImage)}
        sizes="(max-width: 800px) 100vw, 1152px"
        alt={img.alt}
        width={1600}
        height={1008}
        decoding="async"
        fetchPriority="high"
        className="mx-auto mt-6 aspect-[16/9] sm:mt-10 sm:aspect-[21/9] w-full max-w-6xl object-cover md:rounded-xl"
      />
      <div className="container-page mt-8 grid gap-12 sm:mt-12 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="mx-auto w-full min-w-0 max-w-[42rem]">
          <AffiliateNotice guide={g} />
          <TableOfContents headings={headings} variant="mobile" />
          <Markdown source={g.body} />
          {g.gear && g.gear.length > 0 && <GearPicks picks={g.gear} excludeIds={inBody} />}
          {g.faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl">Questions people ask</h2>
              <div className="mt-6 divide-y divide-border border-y border-border print:hidden">
                {g.faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="cursor-pointer list-none font-display text-lg marker:hidden">
                      {f.q}
                      <span className="float-right text-terracotta group-open:rotate-45 transition">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
              {/* Closed <details> hide their answers when printing, so print gets a plain list of answers instead. */}
              <dl className="mt-6 hidden space-y-4 print:block">
                {g.faqs.map((f) => (
                  <div key={f.q}>
                    <dt className="font-display text-lg">{f.q}</dt>
                    <dd className="mt-1">{f.a}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}
          {(tools.length > 0 || related.length > 0) && (
            <section className="no-print mt-16 rounded-xl border border-border bg-card p-6 lg:hidden">
              <h2 className="font-display text-2xl">What next?</h2>
              {tools.length > 0 && (
                <>
                  <p className="mt-3 text-sm font-medium">Free tools for this</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {tools.map((t) => (
                      <li key={t}>
                        <Link to={toolLabels[t].to} className="text-primary underline">
                          {toolLabels[t].label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
              {related.length > 0 && (
                <>
                  <p className="mt-4 text-sm font-medium">Keep reading</p>
                  <ul className="mt-2 space-y-1.5 text-sm">
                    {related.map((r) => (
                      <li key={r!.slug}>
                        <Link
                          to="/guides/$slug"
                          params={{ slug: r!.slug }}
                          className="text-primary underline"
                        >
                          {r!.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </section>
          )}
          <section className="mt-16 rounded-xl bg-muted p-6 text-sm">
            <h2 className="font-display text-xl">Sources and how we researched this</h2>
            <p className="mt-2 text-muted-foreground">
              Before writing, we reviewed {g.research.competitors.length} of the pages that
              currently rank for this topic, noted what they leave out, and checked facts against
              the official sources below. We research from published sources; we have not tested or
              inspected what we cover here. Read our{" "}
              <Link to="/editorial-standards" className="text-primary underline">
                editorial standards
              </Link>
              .
            </p>
            <ol className="mt-4 list-decimal space-y-1.5 pl-5">
              {g.sources.map((s) => (
                <li key={s.url}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    {s.title}
                  </a>{" "}
                  <span className="text-muted-foreground">
                    ({s.publisher}, accessed {s.accessedOn})
                  </span>
                </li>
              ))}
            </ol>
          </section>
          {g.relatedProducts && g.relatedProducts.length > 0 && (
            <RelatedProducts productIds={g.relatedProducts} excludeIds={shownAsPicks} />
          )}
        </div>
        <aside className="no-print hidden space-y-6 lg:block lg:sticky lg:top-24 lg:self-start">
          <TableOfContents headings={headings} variant="sidebar" />
          {tools.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-display text-lg">Tools for this</p>
              <ul className="mt-3 space-y-2 text-sm">
                {tools.map((t) => (
                  <li key={t}>
                    <Link to={toolLabels[t].to} className="text-primary underline">
                      {toolLabels[t].label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
      {related.length > 0 && (
        <section className="container-page mt-20 max-lg:hidden print:hidden">
          <h2 className="text-3xl">Keep reading</h2>
          <div className="mt-6 grid gap-8 md:grid-cols-3">
            {related.map((r) => (
              <GuideCard key={r!.slug} guide={r!} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
