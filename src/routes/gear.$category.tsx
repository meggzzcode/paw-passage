import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GuideCard } from "@/components/site/GuideCard";
import { GearDisclosure, GearProductCard, HowWePick } from "@/components/site/GearHubCards";
import {
  categoryProducts,
  categoryIsLive,
  getGearCategory,
  guidesFeaturing,
  legacyRedirectFor,
} from "@/content/gear-hub";
import { getGuide, isPublic } from "@/content/guides";
import { gearCategories } from "@/content/gear-categories";
import { dogTypeIsLive, getDogType } from "@/content/dog-types";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/gear/$category")({
  beforeLoad: ({ params }) => {
    // Old job-less category slugs: permanent redirect so existing links never 404.
    const next = legacyRedirectFor(params.category);
    if (next) throw redirect({ href: `/gear/${next}`, statusCode: 301 });
  },
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
      title: `${c.name} for Dogs`,
      description: `Researched picks for ${c.name.toLowerCase()}: the maker's own specs, sources and what we could not confirm. Not tested by us.`,
      path: `/gear/${params.category}`,
      noindex: !categoryIsLive(c.slug),
    });
    return {
      ...h,
      scripts: [
        breadcrumbLd([
          { name: "Travel essentials", path: "/gear" },
          { name: c.name, path: `/gear/${c.slug}` },
        ]),
      ],
    };
  },
  component: GearCategoryPage,
});

function GearCategoryPage() {
  const { slug } = Route.useLoaderData();
  const c = getGearCategory(slug)!;
  const all = categoryProducts(slug);
  const items = all.filter((p) => p.categories?.[0] === slug);
  const alsoFits = all.filter((p) => p.categories?.[0] !== slug);
  const siblings = gearCategories
    .filter((x) => x.slug !== slug && categoryIsLive(x.slug))
    .slice(0, 2);
  const guides = [
    ...new Map(
      [...(c.guideSlugs ?? []).map((s) => getGuide(s)), ...guidesFeaturing(all)]
        .filter((g): g is NonNullable<typeof g> => !!g && isPublic(g))
        .map((g) => [g.slug, g]),
    ).values(),
  ].slice(0, 3);
  const dogType = c.dogTypeSlug ? getDogType(c.dogTypeSlug) : undefined;
  return (
    <div className="container-page pt-10">
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Travel essentials", to: "/gear" },
          { label: c.name },
        ]}
      />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">{c.name}</h1>
        <p className="mt-3 text-muted-foreground">{c.intro}</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Researched, not personally tested. No prices, no ratings.
        </p>
      </header>
      {dogType && dogTypeIsLive(dogType) && (
        <p className="mt-4 text-sm">
          Also see{" "}
          <Link to="/dogs/$slug" params={{ slug: dogType.slug }} className="text-primary underline">
            {dogType.name}
          </Link>
          .
        </p>
      )}
      <section
        className="mt-8 max-w-3xl rounded-xl border border-border bg-card p-6"
        aria-labelledby="how-to-choose"
      >
        <h2 id="how-to-choose" className="text-2xl">
          How to choose
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-sm">
          {c.howToChoose.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </section>
      <GearDisclosure products={all} />
      <ul className="mt-8 max-w-3xl space-y-6">
        {items.map((p) => (
          <GearProductCard key={p.id} product={p} />
        ))}
      </ul>
      {alsoFits.length > 0 && (
        <section className="mt-12" aria-labelledby="also-fits">
          <h2 id="also-fits" className="text-2xl">
            Also fits here
          </h2>
          <div className="mt-6 max-w-3xl space-y-6">
            {alsoFits.map((p) => (
              <div key={p.id}>
                <p className="mb-2 text-xs text-muted-foreground">
                  Also fits here. Mainly listed under{" "}
                  {getGearCategory(p.categories?.[0] ?? "")?.name ?? "another category"}.
                </p>
                <ul>
                  <GearProductCard product={p} />
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}
      <HowWePick />
      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl">Related guides</h2>
          <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {guides.map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>
      )}
      <nav className="mt-12 text-sm" aria-label="More gear">
        <Link to="/gear" className="text-primary underline">
          All travel essentials
        </Link>
        {siblings.map((x) => (
          <span key={x.slug}>
            {" · "}
            <Link
              to="/gear/$category"
              params={{ category: x.slug }}
              className="text-primary underline"
            >
              {x.name}
            </Link>
          </span>
        ))}
      </nav>
    </div>
  );
}
