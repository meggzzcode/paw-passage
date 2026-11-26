// Saved tab: everything hearted or saved for later, a surprise from just those, and a way to log doing one again.
import { useState } from "react";
import type { Adventure } from "@/passport/schema";
import { pickSurprise } from "@/passport/engine";
import { repeatAdventure } from "@/passport/local-store";
import { listCollections, members } from "@/passport/progress";
import { usePassport } from "@/passport/usePassport";
import { Button } from "@/components/shell/Button";
import { SavedPublic } from "@/components/collections/Invites";
import { RevealedCard } from "./AdventureCard";
import {
  AdventureRow,
  ctxFor,
  historyFor,
  useAccessLibrary,
  useLibrary,
} from "./collections-shared";

/** Saved: for a visitor without the full Passport only the intro adventure and bookmarked public previews. */
export function FavoriteCollections() {
  const { unlocked } = useAccessLibrary();
  return unlocked ? <SavedFull /> : <SavedPublic />;
}

function SavedFull() {
  const { save, profile } = usePassport();
  const lib = useLibrary(save);
  const [picked, setPicked] = useState<Adventure | null>(null);
  const [none, setNone] = useState(false);
  const doneIds = new Set(members(save.done));
  const favs = [...new Set([...members(save.favorites), ...members(save.saved)])]
    .map((id) => lib.byId.get(id))
    .filter((a): a is Adventure => a !== undefined);
  const suited = favs.filter((a) => lib.eligibleIds.has(a.id));

  return (
    <section aria-labelledby="fav-h" className="co-stack">
      <h2 id="fav-h" className="pa-h">
        Saved
      </h2>
      {favs.length === 0 ? (
        <div className="pa-card">
          <p>
            Nothing saved yet. Tap the heart on any adventure, or "Save for later" on a preview, and
            it will wait for you here.
          </p>
          <Button to="/discover">Find an adventure</Button>
        </div>
      ) : (
        <>
          <div className="pa-row">
            <button
              type="button"
              className="pp-btn pp-btn-primary"
              onClick={() => {
                const a = pickSurprise(
                  lib.all,
                  { kind: "favorites" },
                  ctxFor(save, lib.unlocked),
                  {},
                  historyFor(save),
                  listCollections(save),
                  { seed: String(Date.now()), includeDone: true },
                );
                setPicked(a);
                setNone(a === null);
              }}
            >
              Surprise me from my saved
            </button>
          </div>
          {none && (
            <p role="status" className="pa-fine">
              None of your saved adventures suit your dog's profile right now, so nothing was
              picked.
            </p>
          )}
          {picked && <RevealedCard a={picked} dogName={profile.name} onAnother={undefined} />}
          <ul className="co-list">
            {favs.map((a) => {
              const n = save.repeats[a.id] ?? 0;
              return (
                <AdventureRow
                  key={a.id}
                  a={a}
                  done={doneIds.has(a.id)}
                  dogName={profile.name}
                  note={
                    !lib.eligibleIds.has(a.id)
                      ? "doesn't suit your dog's profile right now"
                      : n > 0
                        ? `repeated ${n} ${n === 1 ? "time" : "times"}`
                        : undefined
                  }
                  actions={
                    suited.includes(a) && doneIds.has(a.id) ? (
                      <button
                        type="button"
                        className="pp-btn pp-btn-secondary"
                        onClick={() => repeatAdventure(a.id)}
                      >
                        Did it again
                        <span className="sr-only"> {a.title}</span>
                      </button>
                    ) : undefined
                  }
                />
              );
            })}
          </ul>
          <p className="pa-fine">
            Doing one again is a lovely memory, not a new adventure: it never raises your count.
          </p>
        </>
      )}
    </section>
  );
}
