import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getState, getTown } from "@/content/destinations";
import { getGuide } from "@/content/guides";
import { visibleStays } from "@/content/stays";
import { images, srcSetForKey } from "@/lib/images";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GuideCard } from "@/components/site/GuideCard";
import { StayCard } from "@/components/site/StayCard";
import { pageHead, breadcrumbLd, jsonLd } from "@/lib/seo";
import { hasStays } from "@/lib/launch";
import { Stay22Map } from "@/components/site/Stay22Map";

export const Route = createFileRoute("/destinations/$state/$town")({
  loader: ({ params }) => {
    const d = getState(params.state);
    const t = getTown(params.state, params.town);
    if (!d || !t) throw notFound();
    return { d, t };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Destination not found" }, { name: "robots", content: "noindex" }] };
    const { d, t } = loaderData;
    const path = `/destinations/${params.state}/${params.town}`;
    return { ...pageHead({ title: `Dog-friendly ${t.name}, ${d.name}: planning notes`, description: `${t.blurb} What to check before booking a dog-friendly stay in ${t.name}.`, path, noindex: !visibleStays().some((s) => s.town === t.slug) }), scripts: [breadcrumbLd([{ name: "Destinations", path: "/destinations" }, { name: d.name, path: `/destinations/${d.slug}` }, { name: t.name, path }]), { type: "application/ld+json", children: jsonLd({ "@context": "https://schema.org", "@type": "TouristDestination", name: `${t.name}, ${d.name}`, description: t.blurb }) }] };
  },
  component: TownPage,
});

function TownPage() {
  const { d, t } = Route.useLoaderData();
  const guides = t.guides.map((g) => getGuide(g)).filter((g) => !!g);
  const stays = visibleStays().filter((s) => s.town === t.slug);
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations", to: "/destinations" }, { label: d.name, to: `/destinations/${d.slug}` }, { label: t.name }]} />
      <div className="mt-8 grid gap-10 md:grid-cols-[1fr_1.1fr] md:items-center">
        <div>
          <p className="eyebrow">{t.region}, {d.name}</p>
          <h1 className="mt-2 text-5xl">Dog-friendly {t.name}</h1>
          <p className="mt-4 text-lg text-muted-foreground">{t.blurb}</p>
        </div>
        <img src={images[t.image].src} srcSet={srcSetForKey(t.image)} sizes="(max-width: 768px) 100vw, 50vw" alt={images[t.image].alt} width={1600} height={1008} className="aspect-[4/3] w-full rounded-xl object-cover" />
      </div>
      <section className="mt-16 grid gap-10 md:grid-cols-[1.3fr_1fr]">
        <div>
          <h2 className="text-3xl">What to check before you book here</h2>
          <ul className="mt-6 space-y-4">
            {t.planningNotes.map((n) => <li key={n} className="flex gap-3"><span className="mt-2 size-2 shrink-0 rounded-full bg-terracotta" /><span>{n}</span></li>)}
          </ul>
        </div>
        <div className="rounded-xl bg-secondary/70 p-6">
          <p className="font-display text-xl">Plan it properly</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><Link to="/tools/host-questions" className="text-primary underline">Generate questions for your host</Link></li>
            <li><Link to="/tools/cost-calculator" className="text-primary underline">Work out the true cost with pet fees</Link></li>
            {hasStays() ? <li><Link to="/stays" search={(p) => ({ ...p, state: d.slug, town: t.slug })} className="text-primary underline">Search stays in {t.name}</Link></li> : <li><Link to="/guides" className="text-primary underline">Read the dog-travel guides</Link></li>}
          </ul>
        </div>
      </section>
      <Stay22Map address={`${t.name}, ${d.name}`} campaign={`town-${t.slug}`} />
      {guides.length > 0 && (<section className="mt-16"><h2 className="text-3xl">Read next</h2><div className="mt-6 grid gap-8 md:grid-cols-2">{guides.map((g) => <GuideCard key={g!.slug} guide={g!} />)}</div></section>)}
      <section className="mt-16">
        <h2 className="text-3xl">Stays in {t.name}</h2>
        {stays.length ? <div className="mt-6 grid gap-6 md:grid-cols-3">{stays.map((s) => <StayCard key={s.slug} stay={s} />)}</div> : <p className="mt-3 text-muted-foreground">No verified stays published here yet.</p>}
      </section>
    </div>
  );
}
