import { createFileRoute } from "@tanstack/react-router";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { GearDisclosure } from "@/components/site/GearHubCards";
import { GearHero } from "@/components/gear/GearHero";
import {
  DogTypeCard,
  FeaturedGearSection,
  GearCategoryTile,
  GearSectionHeader,
  PlanTripSection,
  TripCollectionCard,
  TripCollectionSection,
} from "@/components/gear/GearHomeSections";
import {
  featuredGear,
  hasGear,
  liveCategories,
  liveShortcuts,
  liveTrips,
  parseGearSearch,
  planGuides,
  resolveTripCollection,
  shopByDog,
} from "@/content/gear-hub";
import { pageHead, breadcrumbLd } from "@/lib/seo";

export const Route = createFileRoute("/gear/")({
  validateSearch: parseGearSearch,
  head: (ctx) => {
    // ctx is optional so tests can call head() bare.
    const trip = (ctx?.match?.search as { trip?: string } | undefined)?.trip;
    const resolved = trip ? resolveTripCollection(trip) : undefined;
    return {
      ...pageHead({
        title: resolved ? resolved.collection.heading : "Dog Travel Gear for Road Trips and Cabins",
        description:
          "Dog travel essentials for road trips, cabin stays and trail days: car safety, feeding, cooling and cleanup gear, picked by trip, category or dog.",
        // The canonical stays /gear, and a trip view is a convenience filter, not a page to index.
        path: "/gear",
        noindex: !hasGear() || !!resolved,
      }),
      scripts: [breadcrumbLd([{ name: "Travel essentials", path: "/gear" }])],
    };
  },
  component: GearHub,
});

function GearHub() {
  const { trip } = Route.useSearch();
  const cats = liveCategories();
  const trips = liveTrips();
  const selected = trip ? resolveTripCollection(trip) : undefined;
  const featured = featuredGear();
  const dogs = liveShortcuts(shopByDog);
  const guides = planGuides();
  const shown = [
    ...featured.map((f) => f.product),
    ...(selected?.groups.flatMap((g) => g.products) ?? []),
  ];
  return (
    <div className="container-page pt-6 pb-16">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Travel essentials" }]} />
      <GearHero />
      <div className="[&>p]:mt-4 [&>p]:p-3 [&>p]:text-xs sm:[&>p]:text-sm">
        <GearDisclosure products={shown} />
      </div>

      <section id="trips" className="mt-8 scroll-mt-20" aria-labelledby="gear-trips">
        <GearSectionHeader
          id="gear-trips"
          eyebrow="Shop by trip"
          title="Where are you headed?"
          lead="Start with the kind of trip you're packing for."
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {trips.map((t) => (
            <TripCollectionCard
              key={t.slug}
              trip={t}
              active={selected?.trip.slug === t.slug}
              count={resolveTripCollection(t.slug)?.count ?? 0}
            />
          ))}
        </ul>
      </section>
      {selected && <TripCollectionSection resolved={selected} />}

      <FeaturedGearSection items={featured} />

      <section id="categories" className="mt-14 scroll-mt-20" aria-labelledby="gear-cats">
        <GearSectionHeader
          id="gear-cats"
          eyebrow="Shop by category"
          title="Find exactly what you need"
        />
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {cats.map((c) => (
            <GearCategoryTile key={c.slug} category={c} />
          ))}
        </ul>
      </section>

      {dogs.length > 0 && (
        <section className="mt-14" aria-labelledby="gear-dogs">
          <GearSectionHeader
            id="gear-dogs"
            eyebrow="Shop by dog"
            title="Every dog travels differently"
            lead="Start from your dog and jump to the gear categories and guides that fit."
          />
          <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
            {dogs.map((d) => (
              <DogTypeCard key={d.slug} shortcut={d} />
            ))}
          </ul>
        </section>
      )}

      <PlanTripSection guides={guides} />

      <p className="mt-12 max-w-3xl text-sm text-muted-foreground">
        Every product here comes from the maker's own page or a named independent source, and we say
        what we could not confirm. We have not tested these products.{" "}
        <a className="text-primary underline" href="/methodology">
          How we research gear
        </a>
        .
      </p>
    </div>
  );
}
