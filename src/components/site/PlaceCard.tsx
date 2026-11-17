import { Link } from "@tanstack/react-router";
import { placeKindLabels, placeIsPublic, placeNeedsRecheck, type Place } from "@/content/places";
import { getState } from "@/content/destinations";
import { PreviewBadge } from "@/components/site/StatusBadge";

/** Small badges for a place: "Unverified" (preview builds only) and "Needs recheck" (last read more than 12 months ago). */
export function PlaceBadges({ place }: { place: Place }) {
  const unverified = !placeIsPublic(place);
  const recheck = !unverified && placeNeedsRecheck(place);
  if (!unverified && !recheck) return null;
  return (
    <span className="inline-flex flex-wrap gap-2">
      {unverified && <PreviewBadge>Unverified</PreviewBadge>}
      {recheck && <PreviewBadge>Needs recheck</PreviewBadge>}
    </span>
  );
}

export function PlaceCard({ place }: { place: Place }) {
  const summary = place.dogsAllowed.slice(0, 3);
  return (
    <article className="flex flex-col rounded-xl border border-border bg-card p-6 shadow-card">
      <p className="eyebrow">{placeKindLabels[place.kind]} · {getState(place.state)?.name ?? place.state}</p>
      <h2 className="mt-2 text-xl">
        <Link to="/dog-rules/$slug" params={{ slug: place.slug }} className="hover:underline">{place.name}</Link>
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">Managed by {place.managedBy}</p>
      <div className="mt-3"><PlaceBadges place={place} /></div>
      {summary.length > 0 && (
        <ul className="mt-4 space-y-1 text-sm">
          {summary.map((d) => <li key={d.area}><span className="font-medium">{d.area}:</span> <span className="text-muted-foreground">{{ yes: "dogs allowed", leash: "on a leash", no: "no dogs", some: "some places" }[d.rule]}</span></li>)}
        </ul>
      )}
      <p className="mt-4 text-xs text-muted-foreground">{place.lastChecked ? `Last checked ${place.lastChecked}` : "Not yet checked against the official page"}</p>
    </article>
  );
}
