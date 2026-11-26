import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CarFront,
  ClipboardList,
  Dog,
  HeartHandshake,
  House,
  MapPin,
  MountainSnow,
  Snowflake,
  Users,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { SPEC_CARD_STYLE } from "@/components/site/ProductSpecCard";
import { GearProductCard } from "@/components/site/GearProductCard";
import { getGearCategory } from "@/content/gear-categories";
import {
  categoryProducts,
  type FeaturedGear,
  type GearShortcut,
  type ResolvedTripCollection,
} from "@/content/gear-hub";
import type { GearCategory } from "@/content/gear-categories";
import type { Guide } from "@/content/types";

const tonePanel = {
  sage: "bg-secondary text-primary",
  sand: "bg-muted text-primary",
  terracotta: "bg-accent text-accent-foreground",
} as const;

const linkFocus =
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring";

export function GearSectionHeader({
  id,
  eyebrow,
  title,
  lead,
}: {
  id: string;
  eyebrow?: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="max-w-2xl">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 id={id} className="mt-1 text-2xl md:text-3xl">
        {title}
      </h2>
      {lead && <p className="mt-2 text-muted-foreground">{lead}</p>}
    </header>
  );
}

const TRIP_STYLE: Record<string, { icon: LucideIcon; tag: string; tone: keyof typeof tonePanel }> =
  {
    "road-trip": { icon: CarFront, tag: "On the road", tone: "sage" },
    "cabin-stay": { icon: House, tag: "Settling in", tone: "terracotta" },
    "beach-and-lake": { icon: Waves, tag: "By the water", tone: "sage" },
    "winter-trip": { icon: Snowflake, tag: "Cold days", tone: "sand" },
    hiking: { icon: MountainSnow, tag: "On the trail", tone: "terracotta" },
  };

export function TripCollectionCard({
  trip,
  active,
  count,
}: {
  trip: GearShortcut;
  active: boolean;
  count: number;
}) {
  const style = TRIP_STYLE[trip.slug] ?? { icon: MapPin, tag: "Trip", tone: "sand" as const };
  const Icon = style.icon;
  return (
    <li>
      <Link
        to="/gear"
        search={{ trip: trip.slug }}
        hash="trip-collection"
        resetScroll={false}
        aria-current={active ? "true" : undefined}
        className={`group flex h-full items-start gap-4 rounded-2xl border bg-card p-4 transition hover:border-primary hover:bg-background sm:p-5 ${linkFocus} ${
          active ? "border-primary ring-1 ring-primary" : "border-border"
        }`}
      >
        <span
          aria-hidden="true"
          className={`flex size-14 shrink-0 items-center justify-center rounded-xl ${tonePanel[style.tone]}`}
        >
          <Icon className="size-8" strokeWidth={1.4} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow block">{style.tag}</span>
          <span className="mt-0.5 block font-display text-xl leading-snug">{trip.label}</span>
          <span className="mt-1 block text-sm text-muted-foreground">{trip.line}</span>
          <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary">
            See {count} picks
            <ArrowRight
              aria-hidden="true"
              className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
            />
          </span>
        </span>
      </Link>
    </li>
  );
}

export function TripCollectionSection({ resolved }: { resolved: ResolvedTripCollection }) {
  const { collection, groups, count } = resolved;
  return (
    <section
      id="trip-collection"
      aria-label={`${collection.heading}: ${count} picks`}
      className="mt-8 scroll-mt-20 rounded-3xl bg-muted/60 p-4 sm:p-6 lg:p-8"
    >
      <div className="flex flex-wrap items-end justify-between gap-3">
        <GearSectionHeader
          id="trip-collection-title"
          eyebrow={`${count} picks`}
          title={collection.heading}
          lead={collection.intro}
        />
        <Link
          to="/gear"
          hash="trips"
          className={`inline-flex h-10 items-center rounded-full border border-border bg-background px-4 text-sm font-medium transition hover:bg-card ${linkFocus}`}
        >
          Choose another trip
        </Link>
      </div>
      {groups.map((g) => (
        <div key={g.title} className="mt-8">
          <h3 className="text-lg">{g.title}</h3>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.products.map((p) => (
              <GearProductCard key={p.id} product={p} variant="standard" headingLevel={4} />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

export function FeaturedGearSection({ items }: { items: FeaturedGear[] }) {
  if (items.length === 0) return null;
  return (
    <section className="mt-14" aria-labelledby="gear-featured">
      <GearSectionHeader
        id="gear-featured"
        eyebrow="Featured"
        title="A few good places to start"
        lead="One dependable pick for each part of the trip, each backed by the maker's own details."
      />
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map(({ product, guideSlug }) => (
          <GearProductCard
            key={product.id}
            product={product}
            variant="standard"
            {...(guideSlug ? { guideSlug } : {})}
            headingLevel={3}
          />
        ))}
      </div>
    </section>
  );
}

export function GearCategoryTile({ category }: { category: GearCategory }) {
  const style = SPEC_CARD_STYLE[category.slug];
  const Icon = style?.icon ?? Dog;
  const n = categoryProducts(category.slug).length;
  return (
    <li>
      <Link
        to="/gear/$category"
        params={{ category: category.slug }}
        className={`group flex h-full items-center gap-4 rounded-2xl border border-border bg-card p-4 transition hover:border-primary hover:bg-background ${linkFocus}`}
      >
        <span
          aria-hidden="true"
          className={`flex size-12 shrink-0 items-center justify-center rounded-xl ${tonePanel[style?.tone ?? "sand"]}`}
        >
          <Icon className="size-7" strokeWidth={1.4} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-lg leading-snug">{category.name}</span>
          <span className="mt-0.5 block text-sm text-muted-foreground">{category.tagline}</span>
          <span className="mt-1 block text-xs font-medium text-muted-foreground">
            {n} {n === 1 ? "product" : "products"}
          </span>
        </span>
        <ArrowRight
          aria-hidden="true"
          className="size-4 shrink-0 text-primary transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </Link>
    </li>
  );
}

const DOG_ICON: Record<string, LucideIcon> = {
  "large-dogs": Dog,
  "senior-dogs": HeartHandshake,
  "escape-artists": MapPin,
  "multi-dog-families": Users,
};

export function DogTypeCard({
  shortcut,
}: {
  shortcut: GearShortcut & { categories: GearCategory[] };
}) {
  const Icon = DOG_ICON[shortcut.slug] ?? Dog;
  return (
    <li className="rounded-2xl border border-border bg-card p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <Icon aria-hidden="true" className="size-6 text-terracotta" strokeWidth={1.5} />
        <h3 className="text-lg">{shortcut.label}</h3>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{shortcut.line}</p>
      <p className="mt-3 flex flex-wrap gap-2">
        {shortcut.categories.map((c) => (
          <Link
            key={c.slug}
            to="/gear/$category"
            params={{ category: c.slug }}
            className={`inline-flex min-h-9 items-center rounded-full bg-secondary px-3 text-sm font-medium text-primary transition hover:brightness-95 ${linkFocus}`}
          >
            {getGearCategory(c.slug)?.name ?? c.name}
          </Link>
        ))}
      </p>
    </li>
  );
}

export function PlanTripSection({ guides, children }: { guides: Guide[]; children?: ReactNode }) {
  return (
    <section className="mt-14" aria-labelledby="gear-plan">
      <GearSectionHeader
        id="gear-plan"
        eyebrow="Before you go"
        title="Plan the trip, not just the packing"
        lead="Buying guides for the gear that is hardest to choose."
      />
      <div className="mt-6 grid gap-4 lg:grid-cols-[1.3fr_1fr]">
        {guides.length > 0 && (
          <ul className="divide-y divide-border rounded-2xl border border-border bg-card">
            {guides.map((g) => (
              <li key={g.slug}>
                <Link
                  to="/guides/$slug"
                  params={{ slug: g.slug }}
                  className={`group flex items-start gap-3 p-4 transition hover:bg-background sm:p-5 ${linkFocus}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-lg leading-snug group-hover:text-primary">
                      {g.title}
                    </span>
                    <span className="mt-1 block text-sm text-muted-foreground">{g.dek}</span>
                  </span>
                  <ArrowRight aria-hidden="true" className="mt-1.5 size-4 shrink-0 text-primary" />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <div className="flex flex-col justify-between rounded-2xl bg-primary p-5 text-primary-foreground sm:p-6">
          <div>
            <ClipboardList aria-hidden="true" className="size-8" strokeWidth={1.4} />
            <h3 className="mt-3 text-xl text-primary-foreground">Pack your dog's bag</h3>
            <p className="mt-2 text-sm opacity-90">
              Answer a few questions about your trip and get a packing list that matches it.
            </p>
          </div>
          <Link
            to="/tools/packing-list"
            className={`mt-5 inline-flex h-12 items-center justify-center self-start rounded-full bg-background px-6 font-medium text-foreground transition hover:bg-card ${linkFocus}`}
          >
            Make a packing list
          </Link>
        </div>
      </div>
      {children}
    </section>
  );
}
