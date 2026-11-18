import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GuideCard } from "@/components/site/GuideCard";
import { GearDisclosure, GearProductCard, HowWePick } from "@/components/site/GearHubCards";
import { categoryProducts, categoryIsLive, getGearCategory, guidesFeaturing } from "@/content/gear-hub";
import { getGuide } from "@/content/guides";
import { dogTypeIsLive, getDogType } from "@/content/dog-types";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/gear/$category")({
  loader: ({ params }) => {
    const c = getGearCategory(params.category);
    // Unknown categories and categories with no products at all are not pages.
    if (!c || categoryProducts(c.slug).length === 0) throw notFound();
    return { slug: c.slug };
  },
  head: ({ loaderData, params }) => {
    const c = loaderData ? getGearCategory(loaderData.slug) : undefined;
    if (!c) return { meta: [{ title: "Page not found" }, { name: "robots", content: "noindex" }] };
    const h = pageHead({
      title: `${c.name}: Dog Travel Gear We Researched`,
      description: `Researched dog travel gear for ${c.name.toLowerCase()}, with the maker's own specs, sources and what we could not confirm. Not tested by us.`,
      path: `/gear/${params.category}`,
      noindex: !categoryIsLive(c.slug),
    });
    return { ...h, scripts: [breadcrumbLd([{ name: "Travel essentials", path: "/gear" }, { name: c.name, path: `/gear/${c.slug}` }])] };
  },
  component: GearCategoryPage,
});

function GearCategoryPage() {
  const { slug } = Route.useLoaderData();
  const c = getGearCategory(slug)!;
  const items = categoryProducts(slug);
  const guides = [...new Map([...(c.guideSlugs ?? []).map((s) => getGuide(s)), ...guidesFeaturing(items)].filter((g): g is NonNullable<typeof g> => !!g).map((g) => [g.slug, g])).values()].slice(0, 3);
  const dogType = c.dogTypeSlug ? getDogType(c.dogTypeSlug) : undefined;
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel essentials", to: "/gear" }, { label: c.name }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">{c.name}</h1>
        <p className="mt-3 text-muted-foreground">{c.intro}</p>
        <p className="mt-3 text-sm text-muted-foreground">Researched, not personally tested. No prices, no ratings.</p>
      </header>
      {dogType && dogTypeIsLive(dogType) && <p className="mt-4 text-sm">Also see <Link to="/dogs/$slug" params={{ slug: dogType.slug }} className="text-primary underline">{dogType.name}</Link>.</p>}
      <GearDisclosure products={items} />
      <ul className="mt-8 max-w-3xl space-y-6">{items.map((p) => <GearProductCard key={p.id} product={p} />)}</ul>
      <HowWePick />
      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl">Related guides</h2>
          <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">{guides.map((g) => <GuideCard key={g.slug} guide={g} />)}</div>
        </section>
      )}
    </div>
  );
}
