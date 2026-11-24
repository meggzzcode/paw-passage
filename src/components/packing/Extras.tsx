import { useId, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Plus } from "lucide-react";
import type { Extra } from "@/lib/packing/engine";
import { CATEGORY_ICONS, FALLBACK_ICON } from "./icons";

/** About this many extras are shown first; the rest are behind "See more packing ideas". */
export const VISIBLE_EXTRAS = 4;

/**
 * "A few extras worth considering": optional (level 3) items that suit this trip. Adding one puts the packing item on
 * the list (it is never marked "Need to buy" and no product card opens). The Gear link goes to the trip's collection.
 */
export function ExtrasSection({
  extras,
  gearTrip,
  onAdd,
}: {
  extras: Extra[];
  /** /gear trip collection slug for this trip, or undefined for /gear itself. */
  gearTrip: string | undefined;
  onAdd: (id: string) => void;
}) {
  const listId = useId();
  const [all, setAll] = useState(false);
  if (extras.length === 0) return null;
  const shown = all ? extras : extras.slice(0, VISIBLE_EXTRAS);
  const more = extras.length - VISIBLE_EXTRAS;
  return (
    <section className="pk-extras pk-panel no-print" aria-labelledby="pk-extras-h" data-ideas>
      <h2 id="pk-extras-h">A few extras worth considering</h2>
      <p className="pk-lede">Depending on your plans, these might make the trip easier.</p>
      <ul className="pk-extras-list" id={listId}>
        {shown.map(({ item }) => {
          const Icon = CATEGORY_ICONS[item.category] ?? FALLBACK_ICON;
          return (
            <li key={item.id} className="pk-extra" data-extra={item.id}>
              <span className="pk-extra-ico" aria-hidden="true">
                <Icon />
              </span>
              <span className="pk-extra-text">
                <span className="pk-extra-name">{item.name}</span>
                <span className="pk-extra-what">{item.what}</span>
              </span>
              <button
                type="button"
                className="pk-btn pk-btn-sm"
                aria-label={`Add to my list: ${item.name}`}
                onClick={() => onAdd(item.id)}
              >
                <Plus aria-hidden="true" focusable="false" />
                Add to my list
              </button>
            </li>
          );
        })}
      </ul>
      <div className="pk-extras-foot">
        {more > 0 && (
          <button
            type="button"
            className="pk-btn pk-btn-sm"
            aria-expanded={all}
            aria-controls={listId}
            onClick={() => setAll((v) => !v)}
          >
            {all ? "Show fewer ideas" : "See more packing ideas"}
            <ChevronDown
              aria-hidden="true"
              focusable="false"
              style={all ? { transform: "rotate(180deg)" } : undefined}
            />
          </button>
        )}
        {gearTrip ? (
          <Link
            to="/gear"
            search={{ trip: gearTrip }}
            hash="trip-collection"
            className="pk-btn pk-btn-sm pk-btn-quiet"
          >
            Explore more travel gear
          </Link>
        ) : (
          <Link to="/gear" className="pk-btn pk-btn-sm pk-btn-quiet">
            Explore more travel gear
          </Link>
        )}
      </div>
    </section>
  );
}
