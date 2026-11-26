// "What matches my answers": an explicit button, never automatic. The answers (without the dog's name or notes) are
// sent only when the button is pressed. On any failure we fall back to a plain local count of the public previews that
// fit the basics, and say so. Counts are never invented.
import { useState } from "react";
import { fetchMatch, type MatchResponse, type PreviewItem } from "@/lib/previews";
import { matchPayload, previewFitsBasics } from "@/passport/preview-view";
import { usePassport } from "@/passport/usePassport";

type Result =
  | { kind: "match"; data: MatchResponse }
  | { kind: "fallback"; fit: number; of: number }
  | { kind: "unavailable" };

const n = (count: number, one: string, many: string) => `${count} ${count === 1 ? one : many}`;

export function PreviewMatch({
  items,
  hasIntro = false,
}: {
  /** The public previews when already loaded; used only for the fallback count. */
  items?: readonly PreviewItem[] | null | undefined;
  /** Whether this visitor already has a free introductory adventure picked. */
  hasIntro?: boolean;
}) {
  const { save } = usePassport();
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function check() {
    setBusy(true);
    const { dog, owner } = matchPayload(save.profile.data, save.owner.data);
    const data = await fetchMatch(dog, owner);
    if (data) setResult({ kind: "match", data });
    else if (items && items.length > 0) {
      const fit = items.filter((i) => previewFitsBasics(i, save.profile.data, save.owner.data));
      setResult({ kind: "fallback", fit: fit.length, of: items.length });
    } else setResult({ kind: "unavailable" });
    setBusy(false);
  }

  return (
    <section className="pa-panel" aria-labelledby="pm-h">
      <h2 className="pa-h" id="pm-h">
        What fits your answers?
      </h2>
      <p className="pa-fine">
        Press the button to count the adventures that suit what you told us. It sends your dog's
        answers to our server to be counted. Your dog's name and notes are not sent.
      </p>
      <div className="pa-row">
        <button type="button" className="pp-btn pp-btn-secondary" disabled={busy} onClick={check}>
          {busy ? "Checking..." : "Count what matches"}
        </button>
      </div>
      <div role="status" aria-live="polite">
        {result?.kind === "match" && (
          <>
            <p className="pm-lead">
              We found {n(result.data.matching, "adventure", "adventures")} that match your current
              preferences.
            </p>
            <ul className="pa-list-plain">
              {hasIntro && <li>1 is your free introductory adventure.</li>}
              <li>
                {n(result.data.previews.length, "matching adventure is", "matching adventures are")}{" "}
                among the public previews.
              </li>
              <li>
                The full Passport has all {result.data.matching}
                {result.data.total > 0 ? `, from a library of ${result.data.total}` : ""}. This
                count includes the introductory adventure and the previews.
              </li>
            </ul>
          </>
        )}
        {result?.kind === "fallback" && (
          <p>
            We could not check the whole library just now. Of the {result.of} public previews,{" "}
            {result.fit} fit the basics you told us (life stage, food, car and how far your dog
            likes to move). The full check also looks at things a preview does not show, so treat
            this as a rough guide.
          </p>
        )}
        {result?.kind === "unavailable" && (
          <p>We could not check right now. Please try again in a little while.</p>
        )}
      </div>
    </section>
  );
}
