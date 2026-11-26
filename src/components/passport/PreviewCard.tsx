// One public preview card. It shows only the allowlisted preview fields: a mystery tile, the public title and teaser,
// and at-a-glance facts. Never instructions or anything about how the adventure works. Bookmarking is local.
import type { PreviewItem } from "@/lib/previews";
import { bookmarkPreview, unbookmarkPreview } from "@/passport/local-store";
import { has } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";
import { PreviewArt } from "./PreviewArt";
import { flow } from "./flow-events";
import {
  costText,
  effortChips,
  goodLabels,
  needChips,
  ownerBadges,
  settingText,
  timeText,
} from "./labels";

export function PreviewCard({ item }: { item: PreviewItem }) {
  const { save } = usePassport();
  const saved = has(save.saved, item.id);
  const labels = goodLabels(item);
  const needs = needChips(item);
  const badges = ownerBadges(item);
  return (
    <li className="pa-card pv-card">
      <article aria-label={item.title} className="pv-article">
        <PreviewArt family={item.keepsake.family} theme={item.keepsake.theme} />
        <p className="pa-kicker">{item.category}</p>
        <h3 className="pa-title">{item.title}</h3>
        <p className="pv-teaser">{item.teaser}</p>
        <ul className="pa-facts" aria-label="At a glance">
          <li>{timeText(item)}</li>
          <li>{costText(item)}</li>
          <li>{settingText(item.setting)}</li>
          {effortChips(item).map((c) => (
            <li key={c}>{c}</li>
          ))}
          {badges.map((b) => (
            <li key={b} className="pv-badge">
              {b}
            </li>
          ))}
        </ul>
        {needs.length > 0 && (
          <ul className="pa-meta pv-needs" aria-label="Good to know before you start">
            {needs.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
        )}
        {labels.length > 0 && (
          <ul className="pa-tags" aria-label="Good fit">
            {labels.slice(0, 6).map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        )}
        <div className="pa-actions">
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
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
            {saved ? "Saved ✓" : "Save for later"}
          </button>
        </div>
      </article>
    </li>
  );
}
