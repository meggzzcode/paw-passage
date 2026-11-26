// Previews from one collection, for visitors who do not have the full Passport. Public previews only.
import { useEffect } from "react";
import { AppLink } from "@/components/shell/AppLink";
import { usePreviews } from "@/lib/usePreviews";
import { premiumPreviews } from "@/passport/preview-view";
import { PREVIEWS_PATH } from "@/passport/starter";
import { PreviewCard } from "./PreviewCard";
import { flow } from "./flow-events";

export function CollectionPreviews({ slug }: { slug: string }) {
  const { status, data } = usePreviews();
  const items = premiumPreviews(data?.items ?? []).filter((i) => i.collections.includes(slug));
  useEffect(() => {
    if (status === "ready" && items.length > 0)
      flow("collection_preview_viewed", { collection: slug });
  }, [status, items.length, slug]);
  if (status !== "ready" || items.length === 0) return null;
  return (
    <section aria-labelledby="cp-h" className="pa-panel">
      <h2 className="pa-h" id="cp-h">
        Selected previews from this collection
      </h2>
      <p className="pa-fine">
        A few picks from a larger collection. Instructions are part of the full Passport.
      </p>
      <ul className="pa-grid pv-grid">
        {items.map((i) => (
          <PreviewCard key={i.id} item={i} />
        ))}
      </ul>
      <p>
        <AppLink to={PREVIEWS_PATH} className="pa-linkbtn">
          All previews
        </AppLink>
      </p>
    </section>
  );
}
