// Curated itineraries: short suggested combinations of existing adventures. Free visitors see the title, the teaser and
// how many adventures it holds, nothing else. Entitled customers see the adventures, can save the combination as an
// ordinary handpicked collection (never twice) and can plan any adventure that suits their dog. Planning is optional,
// uses the existing planner, and an adventure that may not suit the dog is marked and never offered for planning.
import { useState } from "react";
import "@/design/shortcuts.css";
import { AppLink } from "@/components/shell/AppLink";
import { RevealedCard } from "./AdventureCard";
import { ScheduleAdventure } from "./ScheduleAdventure";
import { costText, timeText, useAdventureLibrary } from "./collections-shared";
import {
  ITINERARIES,
  collectionNameFor,
  itineraryItems,
  savedCollectionFor,
  type Itinerary,
} from "@/passport/itineraries";
import type { Ctx } from "@/passport/engine";
import { getSave, newCollection } from "@/passport/local-store";
import { has, listCollections, newCollectionId } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";

export const MAY_NOT_SUIT = "May not suit your dog";

const countText = (n: number) => `${n} ${n === 1 ? "adventure" : "adventures"}`;

export function Itineraries({ heading = "Suggested weekends" }: { heading?: string }) {
  const { unlocked } = useAdventureLibrary();
  return (
    <section className="it-wrap" aria-labelledby="it-h">
      <h2 className="pa-h" id="it-h">
        {heading}
      </h2>
      <p className="pa-fine">
        Ready-made combinations of adventures to try together. Nothing is scheduled unless you
        choose to plan it.
      </p>
      <ul className="it-list">
        {ITINERARIES.map((it) => (
          <li key={it.slug}>
            {unlocked ? <EntitledItinerary it={it} /> : <FreeItinerary it={it} />}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Free visitors: title, teaser and a count. The adventures themselves are part of the full Passport. */
function FreeItinerary({ it }: { it: Itinerary }) {
  return (
    <article className="pa-card it-card" aria-label={it.title}>
      <h3 className="pa-title">{it.title}</h3>
      <p>{it.teaser}</p>
      <p className="pa-fine">{countText(it.ids.length)} in the full Passport</p>
    </article>
  );
}

function EntitledItinerary({ it }: { it: Itinerary }) {
  const { save, profile } = usePassport();
  const { all, unlocked } = useAdventureLibrary();
  const byId = new Map(all.map((a) => [a.id, a]));
  const ctx: Ctx = { dog: profile, owner: save.owner.data, unlocked };
  const items = itineraryItems(it, byId, ctx);
  const existing = savedCollectionFor(it, listCollections(save));
  const [open, setOpen] = useState(false);
  const [planning, setPlanning] = useState<string | null>(null);
  const [opened, setOpened] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const usable = items.filter((i) => i.kind !== "unavailable");

  function saveCollection() {
    if (savedCollectionFor(it, listCollections(getSave()))) return;
    newCollection({
      id: newCollectionId(),
      kind: "handpicked",
      name: collectionNameFor(it),
      ids: usable.map((i) => i.id),
    });
    setNote(
      savedCollectionFor(it, listCollections(getSave()))
        ? "Saved to My collections."
        : "We could not save that collection. You may have reached the limit of collections.",
    );
  }

  return (
    <article className="pa-card it-card" aria-label={it.title}>
      <h3 className="pa-title">{it.title}</h3>
      <p>{it.teaser}</p>
      <p className="pa-fine">{countText(it.ids.length)}</p>
      <div className="pa-row">
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Hide the combination" : "View the combination"}
        </button>
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          disabled={!!existing || usable.length === 0}
          onClick={saveCollection}
        >
          {existing ? "Saved as a collection ✓" : "Save as a collection"}
        </button>
      </div>
      <p className="pa-fine" role="status">
        {note}
      </p>
      {open && (
        <ol className="it-items">
          {items.map((i) =>
            i.kind === "unavailable" ? (
              <li key={i.id} className="it-item">
                <p className="co-row-title">One adventure is not available right now</p>
              </li>
            ) : (
              <li key={i.id} className="it-item">
                <p className="co-row-title">
                  {has(save.done, i.id) && <span aria-label="Completed">✓ </span>}
                  {i.adventure.title}
                </p>
                <p className="pa-fine">
                  {timeText(i.adventure)} · {costText(i.adventure)}
                </p>
                {i.kind === "may-not-suit" ? (
                  <p className="it-warn" role="note">
                    <strong>{MAY_NOT_SUIT}.</strong> {i.why} Left out of planning.
                  </p>
                ) : (
                  <div className="pa-row">
                    <button
                      type="button"
                      className="pp-btn pp-btn-ghost"
                      aria-expanded={planning === i.id}
                      onClick={() => setPlanning(planning === i.id ? null : i.id)}
                    >
                      Plan it
                      <span className="sr-only"> {i.adventure.title}</span>
                    </button>
                    <button
                      type="button"
                      className="pp-btn pp-btn-ghost"
                      aria-expanded={opened === i.id}
                      onClick={() => setOpened(opened === i.id ? null : i.id)}
                    >
                      {opened === i.id ? "Close" : "Open"}
                      <span className="sr-only"> {i.adventure.title}</span>
                    </button>
                  </div>
                )}
                {i.kind === "ok" && planning === i.id && <ScheduleAdventure a={i.adventure} />}
                {i.kind === "ok" && opened === i.id && (
                  <RevealedCard a={i.adventure} dogName={profile.name} />
                )}
              </li>
            ),
          )}
        </ol>
      )}
      {!open && (
        <p className="pa-fine">
          <AppLink to="/collections" search={{ tab: "mine" } as never} className="pa-linkbtn">
            My collections
          </AppLink>
        </p>
      )}
    </article>
  );
}
