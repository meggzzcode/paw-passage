import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getState } from "@/content/destinations";
import { getGuide } from "@/content/guides";
import { visibleStays } from "@/content/stays";
import { images, srcSetForKey } from "@/lib/images";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GuideCard } from "@/components/site/GuideCard";
import { StayCard } from "@/components/site/StayCard";
import { pageHead, breadcrumbLd, stateIsIndexable } from "@/lib/seo";

export const Route = createFileRoute("/destinations/$state/")({
  loader: ({ params }) => {
    const d = getState(params.state);
    if (!d) throw notFound();
    return { d };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return { meta: [{ title: "Destination not found" }, { name: "robots", content: "noindex" }] };
    const { d } = loaderData;
    return { ...pageHead({ title: `Dog-friendly ${d.name} trip planning`, description: d.intro.slice(0, 155), path: `/destinations/${params.state}`, noindex: !stateIsIndexable(params.state) }), scripts: [breadcrumbLd([{ name: "Destinations", path: "/destinations" }, { name: d.name, path: `/destinations/${d.slug}` }])] };
  },
  component: StatePage,
});

function StatePage() {
  const { d } = Route.useLoaderData();
  const guides = d.guides.map((g) => getGuide(g)).filter((g) => !!g);
  const stays = visibleStays().filter((s) => s.state === d.slug).slice(0, 3);
  return (
    <div>
      <section className="relative isolate">
        <img src={images[d.image].src} srcSet={srcSetForKey(d.image)} sizes="100vw" alt={images[d.image].alt} width={1600} height={1008} className="absolute inset-0 -z-10 h-full w-full object-cover" />
        <div className="absolute inset-0 -z-10 bg-scrim" />
        <div className="container-page pb-14 pt-40 text-primary-foreground">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">{d.focus}</p>
          <h1 className="mt-2 max-w-3xl text-5xl md:text-6xl">{d.headline}</h1>
        </div>
      </section>
      <div className="container-page pt-8">
        <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Destinations", to: "/destinations" }, { label: d.name }]} />
        <p className="mt-8 max-w-3xl text-lg leading-relaxed">{d.intro}</p>
        <h2 className="mt-16 text-3xl">Towns to start with</h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {d.towns.map((t) => (
            <Link key={t.slug} to="/destinations/$state/$town" params={{ state: d.slug, town: t.slug }} className="group">
              <img src={images[t.image].card ?? images[t.image].src} alt="" loading="lazy" decoding="async" width={800} height={600} className="aspect-[4/3] w-full rounded-lg object-cover" />
              <p className="mt-3 font-display text-xl group-hover:text-primary">{t.name}</p>
              <p className="text-xs text-muted-foreground">{t.region}</p>
              <p className="mt-2 text-sm text-muted-foreground">{t.blurb}</p>
            </Link>
          ))}
        </div>
        {guides.length > 0 && (<><h2 className="mt-20 text-3xl">Guides for {d.name}</h2><div className="mt-6 grid gap-8 md:grid-cols-2">{guides.map((g) => <GuideCard key={g!.slug} guide={g!} />)}</div></>)}
        <h2 className="mt-20 text-3xl">Stays in {d.name}</h2>
        {stays.length ? <div className="mt-6 grid gap-6 md:grid-cols-3">{stays.map((s) => <StayCard key={s.slug} stay={s} />)}</div> : <p className="mt-3 text-muted-foreground">We haven't listed any stays here yet. <Link to="/tools/pet-cost-check" className="text-primary underline">Use the pet cost and host confirmation tool</Link> to check any rental you're considering.</p>}
      </div>
    </div>
  );
}
