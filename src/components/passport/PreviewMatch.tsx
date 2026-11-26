// "What matches my answers": an explicit button, never automatic. The answers (without the dog's name or notes) are
// sent only when the button is pressed. On any failure we fall back to a plain local count of the public previews that
// fit the basics, and say so. Counts are never invented.
import { useState } from "react";
import { fetchMatch, type MatchResponse, type PreviewItem } from "@/lib/previews";
import { matchPayload, previewFitsBasics, savedIdCount } from "@/passport/preview-view";
import { useEntitlement } from "@/passport/useEntitlement";
import { usePassport } from "@/passport/usePassport";
import { PurchaseValue } from "./PurchaseValue";

type Result =
  | { kind: "match"; data: MatchResponse }
  | { kind: "fallback"; fit: number; of: number }
  | { kind: "unavailable" };

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
  const { status } = useEntitlement();
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
        {result?.kind === "unavailable" && (
          <p>We could not check right now. Please try again in a little while.</p>
        )}
        {result && result.kind !== "unavailable" && (
          <PurchaseValue
            result={result}
            saved={savedIdCount(save)}
            hasIntro={hasIntro}
            entitled={status === "entitled"}
          />
        )}
      </div>
    </section>
  );
}
