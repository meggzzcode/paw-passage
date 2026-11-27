// What a visitor without the full Passport sees where the paid features would be, and the Saved list for that visitor.
import { useNavMode } from "@/components/shell/useNavMode";
import { Button } from "@/components/shell/Button";
import { AppLink } from "@/components/shell/AppLink";
import { PreviewCard } from "@/components/passport/PreviewCard";
import { AdventureRow, useAccessLibrary } from "@/components/passport/collections-shared";
import { usePreviews } from "@/lib/usePreviews";
import { premiumPreviews, savedIdCount, savedPreviews } from "@/passport/preview-view";
import { has } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";

/** My collections is a Passport feature: no creation UI, a short invitation instead. */
export function MineInvite() {
  const { mode } = useNavMode();
  if (mode === "loading")
    return (
      <div className="co-stack" aria-busy="true" role="status">
        Checking your access...
      </div>
    );
  return (
    <section aria-labelledby="mine-inv-h" className="co-stack">
      <h2 id="mine-inv-h" className="pa-h">
        My collections
      </h2>
      <div className="pa-card co-invite">
        <p>
          Your own collections, hand-picked lists and smart lists that fill themselves, come with
          the full Passport.
        </p>
        <p className="pa-fine">
          Until then you can save any preview with "Save for later" and find it under Saved.
        </p>
        <div className="pa-row">
          <Button to="/unlock">See what's included</Button>
          <AppLink
            to="/collections"
            search={{ tab: "favorites" } as never}
            className="pp-btn pp-btn-secondary"
          >
            Go to Saved
          </AppLink>
        </div>
      </div>
    </section>
  );
}

/** Saved, for a visitor without the full Passport: their own intro adventure and the public previews they bookmarked. */
export function SavedPublic() {
  const { save } = usePassport();
  const { all } = useAccessLibrary();
  const { status, data, retry } = usePreviews();
  const previews = savedPreviews(premiumPreviews(data?.items ?? []), save);
  const savedTotal = savedIdCount(save);
  const own = all.filter((a) => has(save.favorites, a.id) || a.id === save.starter?.id);
  const empty = own.length === 0 && previews.length === 0;
  return (
    <section aria-labelledby="sv-h" className="co-stack">
      <h2 id="sv-h" className="pa-h">
        Saved
      </h2>
      {own.length > 0 && (
        <ul className="co-list" aria-label="Your first adventure">
          {own.map((a) => (
            <AdventureRow
              key={a.id}
              a={a}
              done={has(save.done, a.id)}
              dogName={save.profile.data.name}
              note="your first adventure"
            />
          ))}
        </ul>
      )}
      {previews.length > 0 && (
        <ul className="pa-grid pv-grid" aria-label="Saved previews">
          {previews.map((i) => (
            <PreviewCard key={i.id} item={i} />
          ))}
        </ul>
      )}
      {previews.length === 0 && savedTotal > 0 && status !== "loading" && (
        <p className="pa-fine" role="status">
          {savedTotal} saved {savedTotal === 1 ? "preview is" : "previews are"} on this device.
          {status === "unavailable" ? " We can't load the previews right now. " : " "}
          {status === "unavailable" && (
            <button type="button" className="pa-linkbtn" onClick={() => retry?.()}>
              Retry
            </button>
          )}
        </p>
      )}
      {empty && savedTotal === 0 && (
        <div className="pa-card">
          <p>
            Nothing saved yet. Tap "Save for later" on any preview and it will wait for you here.
          </p>
          <Button to="/previews">Explore adventures</Button>
        </div>
      )}
    </section>
  );
}
