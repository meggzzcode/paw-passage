// A handful of public adventure previews (title, teaser and practical facts only; never the steps).
// Graceful states: while loading nothing jumps, and when previews are unavailable a plain link takes their place.
import { AppLink } from "@/components/shell/AppLink";
import { PREVIEWS_PATH } from "@/passport/starter";
import type { PreviewItem } from "@/lib/previews";
import { usePreviews } from "@/lib/usePreviews";
import {
  PREVIEWS_NONE_COPY,
  PREVIEWS_NO_MATCH_COPY,
  PreviewsError,
  PreviewsLoading,
} from "@/components/passport/PreviewsNotice";

const costText = (p: PreviewItem) =>
  p.costMax <= 0
    ? "No cost"
    : p.costMin === p.costMax
      ? `$${p.costMax}`
      : `$${p.costMin}-$${p.costMax}`;
const timeText = (p: PreviewItem) =>
  p.minutesMin === p.minutesMax ? `${p.minutesMax} min` : `${p.minutesMin}-${p.minutesMax} min`;
const settingText = { indoor: "Indoors", outdoor: "Outdoors", either: "Indoors or out" } as const;

export function PreviewCards({
  filter,
  limit = 3,
  heading = "A few selected previews",
}: {
  filter?: (p: PreviewItem) => boolean;
  limit?: number;
  heading?: string;
}) {
  const { status, data, retry } = usePreviews();
  const all = data?.items ?? [];
  const items = all.filter((p) => (filter ? filter(p) : true)).slice(0, limit);
  return (
    <section className="pp-previews" aria-label={heading}>
      <h2 className="pp-h2">{heading}</h2>
      {status === "loading" && <PreviewsLoading />}
      {status === "unavailable" && <PreviewsError retry={retry} />}
      {status === "ready" && items.length === 0 && (
        <p className="pp-lede" role="status">
          {all.length > 0 ? PREVIEWS_NO_MATCH_COPY : PREVIEWS_NONE_COPY}{" "}
          <AppLink to={PREVIEWS_PATH} className="pp-textlink">
            Explore the adventure collection
          </AppLink>
          .
        </p>
      )}
      {items.length > 0 && (
        <>
          <p className="pp-fine">
            Selected previews from a larger collection. Each one shows what to expect, not the
            steps.
          </p>
          <ul className="pp-preview-grid">
            {items.map((p) => (
              <li key={p.id} className="pp-card pp-preview">
                <span className="pp-meta">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.teaser}</p>
                <p className="pp-preview-facts">
                  {timeText(p)} &middot; {costText(p)} &middot; {settingText[p.setting]}
                </p>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            <AppLink to={PREVIEWS_PATH} className="pp-textlink">
              See more previews
            </AppLink>
          </p>
        </>
      )}
    </section>
  );
}
