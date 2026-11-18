import { createFileRoute, Link } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GuideCard } from "@/components/site/GuideCard";
import { HowWePick } from "@/components/site/GearHubCards";
import { liveCategories, categoryProducts, hasGear } from "@/content/gear-hub";
import { getGuide } from "@/content/guides";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/gear/")({
  head: () => ({
    ...pageHead({
      title: "Dog Travel Gear We Researched",
      description:
        "Researched dog travel gear for road trips, rentals and cabins, with sources, what we could not confirm and no fake reviews.",
      path: "/gear",
      noindex: !hasGear(),
    }),
    scripts: [breadcrumbLd([{ name: "Travel essentials", path: "/gear" }])],
  }),
  component: GearHub,
});

const startGuides = [
  "dog-car-safety-harness-and-crate-guide",
  "dog-travel-first-aid-kit-guide",
  "portable-dog-fence-and-playpen-guide-for-rentals",
  "if-your-dog-gets-loose-on-a-trip",
];

function GearHub() {
  const cats = liveCategories();
  const guides = startGuides.map((s) => getGuide(s)).filter((g): g is NonNullable<typeof g> => !!g);
  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel essentials" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Travel essentials for dogs</h1>
        <p className="mt-3 text-muted-foreground">
          Researched gear picks for road trips and rentals. This is not a store: no prices, no
          ratings, and we say what we could not confirm. We have not tested these products.
        </p>
      </header>
      <section className="mt-10" aria-labelledby="gear-cats">
        <h2 id="gear-cats" className="text-2xl">
          Browse by category
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cats.map((c) => (
            <Link
              key={c.slug}
              to="/gear/$category"
              params={{ category: c.slug }}
              className="rounded-lg border border-border bg-card p-5 transition hover:border-primary"
            >
              <h3 className="text-xl">{c.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{c.tagline}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {categoryProducts(c.slug).length} products
              </p>
            </Link>
          ))}
        </div>
      </section>
      <HowWePick />
      {guides.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl">Start with a guide</h2>
          <div className="mt-6 grid gap-10 md:grid-cols-2 lg:grid-cols-3">
            {guides.slice(0, 3).map((g) => (
              <GuideCard key={g.slug} guide={g} />
            ))}
          </div>
        </section>
      )}
      <p className="mt-12 text-sm text-muted-foreground">
        Packing for a trip? Try{" "}
        <Link to="/tools/packing-list" className="text-primary underline">
          Pack your dog's bag
        </Link>
        . How we earn money:{" "}
        <Link to="/affiliate-disclosure" className="text-primary underline">
          affiliate disclosure
        </Link>
        .
      </p>
    </div>
  );
}
