import { createFileRoute, Link, useNavigate, stripSearchParams } from "@tanstack/react-router";
import { placeSearchSchema } from "@/lib/place-search";
import { visiblePlaces, filterPlaces, placeKindLabels, defaultPlaceFilters } from "@/content/places";
import { destinations } from "@/content/destinations";
import { PlaceCard } from "@/components/site/PlaceCard";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { pageHead } from "@/lib/seo";
import { hasPlaces } from "@/lib/launch";
import { trackTool, trackToolOnce } from "@/lib/analytics";

export const Route = createFileRoute("/dog-rules/")({
  validateSearch: placeSearchSchema,
  // Keep /dog-rules clean: drop params that equal their defaults so the bare URL is not redirected.
  search: { middlewares: [stripSearchParams(placeSearchSchema.parse({}))] },
  head: ({ match }) => {
    const s = match.search;
    const filtered = !!(s.q || s.state || s.kind || s.trails);
    return pageHead({
      title: "Can my dog go here? Dog rules for parks, trails and beaches",
      description: "Look up whether dogs are allowed at a park, trail or beach, with the leash rule, exclusions and a link to the official page. Only places we checked against the official source are listed.",
      path: "/dog-rules",
      // Until at least one place is verified the page is empty, so it stays out of search.
      noindex: filtered || !hasPlaces(),
    });
  },
  component: DogRulesPage,
});

function DogRulesPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/dog-rules/" });
  const all = visiblePlaces();
  const results = filterPlaces(all, search);
  const active = !!(search.q || search.state || search.kind || search.trails);

  // Only the NAME of the filter is sent, never what a visitor typed.
  const set = (patch: Partial<typeof search>) => {
    for (const key of Object.keys(patch)) {
      if (key === "q") trackToolOnce("rules_search", { tool: "dog-rules", label: "search" });
      else trackTool("rules_search", { tool: "dog-rules", label: key });
    }
    navigate({ search: (p) => ({ ...p, ...patch }), replace: true });
  };

  return (
    <div className="container-page pt-10">
      <Breadcrumbs items={[{ label: "Home", to: "/" }, { label: "Dog rules" }]} />
      <header className="mt-6 max-w-3xl">
        <h1 className="text-4xl md:text-5xl">Can my dog go here?</h1>
        <p className="mt-3 text-muted-foreground">Dog rules for parks, trails and beaches, each with the official page it came from, the exact sentence we read and the date we checked. A place is only listed once someone has read the official page. Rules change, so confirm with the park before you go.</p>
      </header>

      {all.length === 0 ? (
        <EmptyInventory />
      ) : (
        <div className="mt-10">
          <div className="grid gap-4 rounded-xl border border-border bg-card p-5 sm:grid-cols-2 lg:grid-cols-4" role="search" aria-label="Find a place">
            <label className="block">
              <span className="text-sm font-semibold">Search</span>
              <input value={search.q} onChange={(e) => set({ q: e.target.value })} placeholder="Park, beach or trail name" className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm" />
            </label>
            <label className="block">
              <span className="text-sm font-semibold">State</span>
              <select value={search.state} onChange={(e) => set({ state: e.target.value })} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">All states</option>
                {destinations.map((d) => <option key={d.slug} value={d.slug}>{d.name}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Kind of place</span>
              <select value={search.kind} onChange={(e) => set({ kind: e.target.value })} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Any kind</option>
                {Object.entries(placeKindLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold">Dogs on trails or beaches</span>
              <select value={search.trails} onChange={(e) => set({ trails: e.target.value })} className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
                <option value="">Either</option>
                <option value="yes">Yes, allowed there</option>
                <option value="no">No, not allowed there</option>
              </select>
            </label>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground" aria-live="polite">{results.length} {results.length === 1 ? "place" : "places"}</p>
            {active && <button type="button" onClick={() => navigate({ search: { ...defaultPlaceFilters }, replace: true })} className="text-sm font-medium text-primary underline">Clear filters</button>}
          </div>

          {!hasPlaces() && (
            <p className="mt-4 rounded-lg border border-dashed border-terracotta/60 bg-accent/40 p-4 text-sm">Preview only: these places are unverified and are not on the live site until someone checks them against the official page.</p>
          )}

          {results.length === 0 ? (
            <div className="mt-6 rounded-xl border border-border bg-card p-10 text-center">
              <h2 className="text-2xl">No place matches those filters</h2>
              <p className="mt-2 text-muted-foreground">Try removing a filter. We only list places we have checked, so a missing place means we have not checked it yet, not that dogs are banned.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">{results.map((p) => <PlaceCard key={p.slug} place={p} />)}</div>
          )}
        </div>
      )}
    </div>
  );
}

function EmptyInventory() {
  return (
    <div className="mt-10 rounded-xl border border-border bg-card p-8 md:p-10">
      <h2 className="text-2xl">Checked dog rules are on their way</h2>
      <p className="mt-2 max-w-2xl text-muted-foreground">We list a park, trail or beach only after we have read its official page and recorded the exact wording, so there is nothing here yet. Until then, the official page for the place is always the final word, and these will help you plan:</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link to="/guides" className="rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">Dog-travel guides</Link>
        <Link to="/tools/checklist" className="rounded-full border border-input px-5 py-2.5 text-sm font-medium">Before-you-book checklist</Link>
      </div>
    </div>
  );
}
