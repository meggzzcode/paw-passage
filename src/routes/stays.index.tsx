import { createFileRoute, Link, useNavigate, stripSearchParams } from "@tanstack/react-router";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { staySearchSchema, featureFilters } from "@/lib/stay-search";
import { filterStays, activeFilterCount, stayTypeLabels, defaultFilters } from "@/lib/filters";
import { visibleStays } from "@/content/stays";
import { destinations } from "@/content/destinations";
import { StayCard } from "@/components/site/StayCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";
import { hasStays } from "@/lib/launch";
import { Stay22Map } from "@/components/site/Stay22Map";

export const Route = createFileRoute("/stays/")({
  validateSearch: staySearchSchema,
  // Keep /stays clean: drop params that equal their defaults so the bare URL is not redirected
  // to a long query string (which crawlers would see as a redirect, not a page).
  search: { middlewares: [stripSearchParams(staySearchSchema.parse({}))] },
  head: ({ match }) => {
    const filtered = activeFilterCount(match.search) > 0 || match.search.sort !== "recommended";
    return pageHead({
      title: "Dog-friendly stays and their pet policies",
      description:
        "Search dog-friendly cabins, cottages and beach houses by fenced yard, large dogs, number of dogs, pet fees and breed rules. Details come from each listing, and anything we could not confirm is marked Not confirmed.",
      path: "/stays",
      noindex: filtered || !hasStays(),
    });
  },
  component: StaysPage,
});

function StaysPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/stays/" });
  const [drawer, setDrawer] = useState(false);
  const all = visibleStays();
  const results = filterStays(all, search);
  const count = activeFilterCount(search);
  const state = destinations.find((d) => d.slug === search.state);

  const set = (patch: Partial<typeof search>) =>
    navigate({ search: (p) => ({ ...p, ...patch }), replace: true });

  const filters = (
    <div className="space-y-6">
      <label className="block">
        <span className="text-sm font-semibold">Search</span>
        <input
          value={search.q}
          onChange={(e) => set({ q: e.target.value })}
          placeholder="Town or stay name"
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        />
      </label>
      <label className="block">
        <span className="text-sm font-semibold">State</span>
        <select
          value={search.state}
          onChange={(e) => set({ state: e.target.value, town: "" })}
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All states</option>
          {destinations.map((d) => (
            <option key={d.slug} value={d.slug}>
              {d.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Town</span>
        <select
          value={search.town}
          onChange={(e) => set({ town: e.target.value })}
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">All towns</option>
          {(state ? [state] : destinations)
            .flatMap((d) => d.towns)
            .map((t) => (
              <option key={t.slug} value={t.slug}>
                {t.name}
              </option>
            ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Stay type</span>
        <select
          value={search.type}
          onChange={(e) => set({ type: e.target.value })}
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">Any type</option>
          {Object.entries(stayTypeLabels).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Number of dogs</span>
        <select
          value={search.dogs}
          onChange={(e) => set({ dogs: Number(e.target.value) })}
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value={0}>Any</option>
          {[1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n}
              {n === 4 ? "+" : ""} dog{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-sm font-semibold">Weight limit</span>
        <select
          value={search.weightMin}
          onChange={(e) => set({ weightMin: Number(e.target.value) })}
          className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value={0}>Any</option>
          {[20, 30, 50, 70].map((n) => (
            <option key={n} value={n}>
              Limit of {n} lb or more stated
            </option>
          ))}
        </select>
        <span className="mt-1 block text-xs text-muted-foreground">
          Only stays that state a weight limit match. "Not confirmed" never does.
        </span>
      </label>
      <fieldset>
        <legend className="text-sm font-semibold">Must-haves</legend>
        <p className="mt-1 text-xs text-muted-foreground">
          Only stays where the feature is confirmed will match.
        </p>
        <div className="mt-3 space-y-2.5">
          {featureFilters.map((f) => (
            <label key={f.key} className="flex items-center gap-2.5 text-sm">
              <input
                type="checkbox"
                checked={search[f.key]}
                onChange={(e) => set({ [f.key]: e.target.checked })}
                className="size-4 accent-[var(--primary)]"
              />
              {f.label}
            </label>
          ))}
        </div>
      </fieldset>
      {count > 0 && (
        <button
          type="button"
          onClick={() => navigate({ search: { ...defaultFilters }, replace: true })}
          className="text-sm font-medium text-primary underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Stays" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Dog-friendly stays</h1>
        <p className="mt-3 text-muted-foreground">
          The details here come from each listing. Ask the host any additional questions before
          booking. Anything marked "Not confirmed" is unknown, not a yes, and filters only match
          details that are confirmed.
        </p>
      </header>

      <div className="mt-10 grid gap-10 md:grid-cols-[260px_1fr]">
        <aside className="hidden md:block" aria-label="Filters">
          {filters}
        </aside>
        <section>
          <div className="mb-6 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              {results.length} {results.length === 1 ? "stay" : "stays"}
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDrawer(true)}
                className="inline-flex items-center gap-2 rounded-full border border-input px-4 py-2 text-sm md:hidden"
              >
                <SlidersHorizontal className="size-4" /> Filters{count ? ` (${count})` : ""}
              </button>
              <label className="text-sm">
                <span className="sr-only">Sort</span>
                <select
                  value={search.sort}
                  onChange={(e) => set({ sort: e.target.value })}
                  className="h-10 rounded-full border border-input bg-background px-3"
                >
                  <option value="recommended">Recommended</option>
                  <option value="name">Name A–Z</option>
                  <option value="dogs">Most dogs allowed</option>
                </select>
              </label>
            </div>
          </div>

          {all.length === 0 ? (
            <EmptyInventory />
          ) : results.length === 0 ? (
            <div className="rounded-xl border border-border bg-card p-10 text-center">
              <h2 className="text-2xl">No stays match all of those filters yet</h2>
              <p className="mt-2 text-muted-foreground">
                Try removing a filter or two. Remember, a filter only matches details that are
                confirmed.
              </p>
              <button
                type="button"
                onClick={() => navigate({ search: { ...defaultFilters }, replace: true })}
                className="mt-6 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((s) => (
                <StayCard key={s.slug} stay={s} />
              ))}
            </div>
          )}
        </section>
      </div>

      <Stay22Search />

      {drawer && (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Filters"
        >
          <div className="absolute inset-0 bg-foreground/40" onClick={() => setDrawer(false)} />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <p className="font-display text-xl">Filters</p>
              <button type="button" aria-label="Close filters" onClick={() => setDrawer(false)}>
                <X className="size-6" />
              </button>
            </div>
            {filters}
            <button
              type="button"
              onClick={() => setDrawer(false)}
              className="mt-8 h-12 w-full rounded-full bg-primary font-medium text-primary-foreground"
            >
              Show {results.length} {results.length === 1 ? "stay" : "stays"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="rounded-xl border border-border bg-card p-8 md:p-10">
      <h2 className="text-2xl">Stays are on their way</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">
        We compile each stay's pet details from its public listing and mark anything we could not
        find as Not confirmed. While we add our first ones, these will help you vet any rental
        yourself:
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          to="/tools/checklist"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Before-you-book checklist
        </Link>
        <Link
          to="/guides/$slug"
          params={{ slug: "vacation-rental-secure-fenced-yard" }}
          className="rounded-full border border-input px-5 py-2.5 text-sm font-medium"
        >
          Checking a fenced yard
        </Link>
        <Link
          to="/guides/$slug"
          params={{ slug: "pet-friendly-vacation-rental-checklist" }}
          className="rounded-full border border-input px-5 py-2.5 text-sm font-medium"
        >
          Before-you-book guide
        </Link>
      </div>
    </div>
  );
}

function Stay22Search() {
  const places = destinations.flatMap((d) =>
    d.towns.map((t) => ({ key: `${d.slug}:${t.slug}`, label: `${t.name}, ${d.name}` })),
  );
  const [place, setPlace] = useState(places[0]?.label ?? "");
  if (!places.length) return null;
  return (
    <>
      <div className="container-page mt-10 max-w-3xl">
        <label className="text-sm font-medium">
          Where do you want to look?
          <select
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            className="mt-1 block h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
          >
            {places.map((p) => (
              <option key={p.key} value={p.label}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <Stay22Map address={place} campaign="stays-directory" heading="Search more stays" />
    </>
  );
}
