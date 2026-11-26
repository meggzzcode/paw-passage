// "Here's what's waiting for you": a calm panel shown after a visitor explicitly asks what fits their dog. Every number
// is either verified by the server (the match aggregates) or counted on this device (saved previews). A number that
// could not be verified is left out, never invented. No popup, no urgency; one contextual purchase link.
import { AppLink } from "@/components/shell/AppLink";
import { price, pricing } from "@/config/commercial";
import { collections } from "@/passport/content";
import { track } from "@/passport/events";
import type { MatchResponse } from "@/lib/previews";

export type ValueResult =
  { kind: "match"; data: MatchResponse } | { kind: "fallback"; fit: number; of: number };

const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

/** Public collection titles for the slugs we were given. Unknown slugs are dropped. */
export function collectionTitles(slugs: readonly string[] | undefined): string[] {
  if (!slugs) return [];
  const by = new Map(collections.map((c) => [c.slug, c.title]));
  return slugs.map((s) => by.get(s)).filter((t): t is string => !!t);
}

export function PurchaseValue({
  result,
  saved,
  hasIntro = false,
  entitled = false,
}: {
  result: ValueResult;
  /** Public previews saved on this device (a local count). */
  saved: number;
  hasIntro?: boolean;
  entitled?: boolean;
}) {
  const data = result.kind === "match" ? result.data : null;
  const titles = collectionTitles(data?.collections);
  return (
    <aside className="pa-panel pv-waiting" aria-labelledby="pv-waiting-h">
      <h3 className="pa-h" id="pv-waiting-h">
        Here's what's waiting for you
      </h3>
      {data ? (
        <>
          <p className="pm-lead">
            We found {n(data.matching, "adventure", "adventures")} that match your current
            preferences.
          </p>
          <ul className="pa-list-plain">
            {hasIntro && <li>1 is your free introductory adventure.</li>}
            <li>
              {n(data.previews.length, "matching adventure is", "matching adventures are")} among
              the public previews.
            </li>
            {typeof data.matchingNoSpend === "number" && (
              <li>
                {n(data.matchingNoSpend, "of them needs", "of them need")} no additional spending.
              </li>
            )}
            {saved > 0 && (
              <li>
                {n(saved, "preview", "previews")} saved on this device
                {entitled ? "" : ", and they stay saved if you get the full Passport"}.
              </li>
            )}
            {titles.length > 0 && <li>Found in: {titles.join(", ")}.</li>}
            <li>
              The full Passport has all {data.matching}
              {data.total > 0 ? `, from a library of ${data.total}` : ""}. This count includes the
              introductory adventure and the previews.
            </li>
          </ul>
        </>
      ) : (
        result.kind === "fallback" && (
          <>
            <p>
              We could not check the whole library just now. Of the {result.of} public previews,{" "}
              {result.fit} fit the basics you told us (life stage, food, car and how far your dog
              likes to move). The full check also looks at things a preview does not show, so treat
              this as a rough guide.
            </p>
            {saved > 0 && (
              <p className="pa-fine">{n(saved, "preview", "previews")} saved on this device.</p>
            )}
          </>
        )
      )}
      <div className="pa-row">
        {entitled ? (
          <AppLink to="/discover" className="pp-btn pp-btn-primary">
            Find my next adventure
          </AppLink>
        ) : (
          <>
            <AppLink
              to="/unlock"
              className="pp-btn pp-btn-primary"
              onClick={() => track("purchase_cta_clicked", { where: "match-panel" })}
            >
              {data && data.matching > 0
                ? `Unlock these ${data.matching} adventures, ${price}`
                : `See the full Passport, ${price}`}
            </AppLink>
            <span className="pa-fine">{pricing}</span>
          </>
        )}
      </div>
    </aside>
  );
}
