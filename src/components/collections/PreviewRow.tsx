// One public preview as a compact row: small picture, public title, teaser and a one-line summary, with a local
// bookmark. Only allowlisted preview fields are used; never instructions or anything about how the adventure works.
import type { PreviewItem } from "@/lib/previews";
import { flow } from "@/components/passport/flow-events";
import { costText, settingText, timeText } from "@/components/passport/labels";
import { bookmarkPreview, unbookmarkPreview } from "@/passport/local-store";
import { has } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";
import type { Collection } from "@/passport/content";
import { worldOf } from "@/passport/worlds";
import { Thumb } from "./parts";

export function PreviewRow({ item, accent }: { item: PreviewItem; accent: Collection["accent"] }) {
  const { save } = usePassport();
  const saved = has(save.saved, item.id);
  const w = item.collections.map(worldOf).find(Boolean);
  return (
    <li className="co-crow co-prow">
      <Thumb world={w} accent={accent} />
      <div className="co-crow-main">
        <p className="co-crow-title">{item.title}</p>
        <p className="pa-fine">{item.teaser}</p>
        <p className="pa-fine">
          {timeText(item)} · {costText(item)} · {settingText(item.setting)}
        </p>
      </div>
      <button
        type="button"
        className="pp-btn pp-btn-ghost co-prow-save"
        aria-pressed={saved}
        aria-label={`${saved ? "Saved" : "Save"}: ${item.title}`}
        onClick={() => {
          if (saved) {
            unbookmarkPreview(item.id);
            flow("preview_unbookmarked", { preview: item.id });
          } else {
            bookmarkPreview(item.id);
            flow("preview_bookmarked", { preview: item.id });
          }
        }}
      >
        {saved ? "Saved ✓" : "Save"}
      </button>
    </li>
  );
}
