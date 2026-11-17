import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getGuide, isPublic } from "@/content/guides";
import { guideHero } from "@/lib/images";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { Markdown } from "@/components/site/Markdown";
import { GearPicks } from "@/components/site/GearPicks";
import { AffiliateNotice } from "@/components/site/AffiliateNotice";
import { GuideCard } from "@/components/site/GuideCard";
import { PreviewBadge } from "@/components/site/StatusBadge";
import { pageHead, breadcrumbLd, jsonLd } from "@/lib/seo";
import { site } from "@/config/site";

const toolLabels = {
  checklist: { to: "/tools/checklist", label: "Before-you-book checklist" },
  "host-questions": { to: "/tools/host-questions", label: "Host question generator" },
  "cost-calculator": { to: "/tools/cost-calculator", label: "Trip cost calculator" },
  compare: { to: "/tools/compare", label: "Compare stays" },
} as const;

export const Route = createFileRoute("/guides/$slug")({
  loader: ({ params }) => {
    const guide = getGuide(params.slug);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Guide unavailable" }, { name: "robots", content: "noindex" }] };
    const g = loaderData.guide;
    const path = `/guides/${params.slug}`;
    const h = pageHead({ title: g.seoTitle, description: g.seoDescription, path, type: "article", noindex: !isPublic(g) });
    const scripts = [
      { type: "application/ld+json", children: jsonLd({ "@context": "https://schema.org", "@type": "Article", headline: g.title, description: g.seoDescription, datePublished: g.publishedOn, dateModified: g.lastReviewed, author: { "@type": "Organization", name: g.author }, publisher: { "@type": "Organization", name: site.name }, mainEntityOfPage: path }) },
      breadcrumbLd([{ name: "Guides", path: "/guides" }, { name: g.title, path }]),
    ];
    if (g.faqs.length) scripts.push({ type: "application/ld+json", children: jsonLd({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) });
    return { ...h, meta: [...h.meta, { property: "article:modified_time", content: g.lastReviewed }], scripts };
  },
  component: GuidePage,
});

function GuidePage() {
  const { guide: g } = Route.useLoaderData();
  const img = guideHero(g);
  const related = g.relatedGuides.map((s) => getGuide(s)).filter((x) => !!x).slice(0, 3);
  return (
    <article>
      <div className="container-page pt-10">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Guides", to: "/guides" }, { label: g.title }]} />
        {!isPublic(g) && (
          <div className="mt-6 rounded-lg border border-dashed border-terracotta/60 bg-accent/40 p-4 text-sm">
            <PreviewBadge>Draft, preview only</PreviewBadge>
            <span className="ml-2">Hidden from the live site and search engines until these are checked:</span>
            <ul className="mt-2 list-disc pl-6">{g.research.unverified.map((u) => <li key={u}>{u}</li>)}</ul>
          </div>
        )}
        <header className="mx-auto mt-10 max-w-3xl text-center">
          <p className="eyebrow">{g.category} guide</p>
          <h1 className="mt-3 text-4xl leading-tight md:text-6xl">{g.title}</h1>
          <p className="mt-5 text-lg text-muted-foreground">{g.dek}</p>
          <p className="mt-5 text-sm text-muted-foreground">By {g.author} · Last reviewed {g.lastReviewed} · {g.readingMinutes} min read</p>
        </header>
      </div>
      <img src={img.src} alt={img.alt} width={1600} height={1008} decoding="async" fetchPriority="high" className="mx-auto mt-10 aspect-[21/9] w-full max-w-6xl object-cover md:rounded-xl" />
      <div className="container-page mt-12 grid gap-12 lg:grid-cols-[1fr_260px]">
        <div className="mx-auto w-full max-w-[42rem]">
          <AffiliateNotice guide={g} />
          <Markdown source={g.body} />
          {g.gear && g.gear.length > 0 && <GearPicks picks={g.gear} />}
          {g.faqs.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl">Questions people ask</h2>
              <div className="mt-6 divide-y divide-border border-y border-border">
                {g.faqs.map((f) => (
                  <details key={f.q} className="group py-4">
                    <summary className="cursor-pointer list-none font-display text-lg marker:hidden">{f.q}<span className="float-right text-terracotta group-open:rotate-45 transition">+</span></summary>
                    <p className="mt-3 text-muted-foreground">{f.a}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
          <section className="mt-16 rounded-xl bg-muted p-6 text-sm">
            <h2 className="font-display text-xl">Sources and how we researched this</h2>
            <p className="mt-2 text-muted-foreground">Before writing, we reviewed {g.research.competitors.length} of the pages that currently rank for this topic, noted what they leave out, and checked facts against the official sources below. We haven't stayed at or inspected any property for this guide. Read our <Link to="/editorial-standards" className="text-primary underline">editorial standards</Link>.</p>
            <ol className="mt-4 list-decimal space-y-1.5 pl-5">
              {g.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{s.title}</a> <span className="text-muted-foreground">({s.publisher}, accessed {s.accessedOn})</span></li>)}
            </ol>
          </section>
        </div>
        <aside className="no-print space-y-6 lg:sticky lg:top-24 lg:self-start">
          {g.relatedTools.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-5">
              <p className="font-display text-lg">Tools for this</p>
              <ul className="mt-3 space-y-2 text-sm">{g.relatedTools.map((t) => <li key={t}><Link to={toolLabels[t].to} className="text-primary underline">{toolLabels[t].label}</Link></li>)}</ul>
            </div>
          )}
        </aside>
      </div>
      {related.length > 0 && (
        <section className="container-page mt-20"><h2 className="text-3xl">Keep reading</h2><div className="mt-6 grid gap-8 md:grid-cols-3">{related.map((r) => <GuideCard key={r!.slug} guide={r!} />)}</div></section>
      )}
    </article>
  );
}
