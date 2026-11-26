import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { RevealSurface, wasRevealed } from "./RevealSurface";
import { ScheduleAdventure } from "./ScheduleAdventure";
import type { Adventure } from "@/passport/schema";
import {
  completeAdventure,
  favorite,
  repeatAdventure,
  saveForLater,
  setFeedback,
  undoCompletion,
  unfavorite,
  unsaveForLater,
} from "@/passport/local-store";
import { has } from "@/passport/progress";
import { track } from "@/passport/events";
import { usePassport } from "@/passport/usePassport";
import { CompletionPanel } from "./CompletionPanel";
import "@/design/ux-detail.css";
import { AddToCollection } from "./AddToCollection";
import { DogSigns } from "./ReadYourDog";
import {
  PREP_LABELS,
  SUPPLY_LABELS,
  effortChips,
  formatCost,
  formatSetting,
  formatTime,
  glanceOf,
  goodLabels,
  needChips,
  suitabilityNotes,
  tagChips,
} from "./labels";

function logistics(a: Adventure): string[] {
  const out: string[] = [];
  if (a.transport === "car") out.push("Car needed");
  else if (a.transport === "walkable") out.push("Walkable");
  if (a.reservation.needed)
    out.push(`Booking needed${a.reservation.note ? `: ${a.reservation.note}` : ""}`);
  return out;
}

/** The at-a-glance facts. Safe on a mystery card: none of these give the title away. */
export function Chips({ a }: { a: Adventure }) {
  return (
    <ul className="pa-meta" aria-label="At a glance">
      <li>{formatTime(a)}</li>
      <li>{formatCost(a)}</li>
      <li>{formatSetting(a)}</li>
      {effortChips(glanceOf(a), a.ownerMobility).map((c) => (
        <li key={c}>{c}</li>
      ))}
      <li>{PREP_LABELS[a.prep]}</li>
    </ul>
  );
}

/** The mystery face: duration, cost, setting, prep and practical limits only. No title, no instructions. */
export function MysteryCard({
  a,
  onReveal,
  onAnother,
}: {
  a: Adventure;
  onReveal: () => void;
  onAnother?: (() => void) | undefined;
}) {
  const { save } = usePassport();
  const later = has(save.saved, a.id);
  const notes = [
    ...suitabilityNotes(a),
    ...logistics(a),
    ...a.requires.filter((r) => r !== "car").map((r) => `Needs: ${SUPPLY_LABELS[r]}`),
  ];
  const before = wasRevealed(a.id);
  // An adventure this browser already revealed never asks again.
  const fired = useRef("");
  useEffect(() => {
    if (before && fired.current !== a.id) {
      fired.current = a.id;
      onReveal();
    }
  }, [before, a.id, onReveal]);
  if (before) return null;
  return (
    <article className="pa-card pa-mystery" aria-label="Mystery adventure">
      <p className="pa-kicker">Mystery adventure</p>
      <p className="pa-clue">“{a.clue}”</p>
      <Chips a={a} />
      {notes.length > 0 && (
        <ul className="pa-meta" aria-label="Good to know before you reveal">
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <div className="pa-actions">
        <RevealSurface adventureId={a.id} onReveal={onReveal} />
        {onAnother && (
          <button type="button" className="pp-btn pp-btn-ghost" onClick={onAnother}>
            Try another
          </button>
        )}
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          aria-pressed={later}
          onClick={() => (later ? unsaveForLater(a.id) : saveForLater(a.id))}
        >
          {later ? "Saved for later ✓" : "Save for later"}
        </button>
      </div>
    </article>
  );
}

/** Labelled facts for a revealed card: time, cost and where. Plain labels, nothing else. */
export function FactChips({ a }: { a: Adventure }) {
  const facts: [string, string][] = [
    ["Time", formatTime(a)],
    ["Cost", formatCost(a)],
    ["Where", formatSetting(a)],
  ];
  const effort = effortChips(glanceOf(a), a.ownerMobility);
  return (
    <ul className="pa-facts" aria-label="At a glance">
      {facts.map(([k, v]) => (
        <li key={k}>
          <span className="pa-facts-k">{k}</span> {v}
        </li>
      ))}
      {effort.map((c) => (
        <li key={c}>{c}</li>
      ))}
    </ul>
  );
}

/** A small disclosure of secondary actions. Plain button + panel (not a hover menu); Escape closes it. */
function MoreMenu({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  const btn = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btn.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className="pa-more">
      <button
        ref={btn}
        type="button"
        className="pp-btn pp-btn-ghost"
        aria-expanded={open}
        aria-controls={panel}
        onClick={() => setOpen((v) => !v)}
      >
        More
      </button>
      {open && (
        <div id={panel} className="pa-more-panel" role="group" aria-label={label}>
          {children}
        </div>
      )}
    </div>
  );
}

export function AdventureCard({
  a,
  dogName,
  why,
  onAnother,
  anotherLabel = "Try another",
  focusOnMount = false,
}: {
  a: Adventure;
  dogName?: string | undefined;
  why?: string[] | undefined;
  /** Kept so existing callers still compile; the card no longer hides its steps. */
  defaultOpen?: boolean | undefined;
  onAnother?: (() => void) | undefined;
  anotherLabel?: string | undefined;
  /** Move keyboard and screen-reader focus to the title when the card first appears (after a reveal). */
  focusOnMount?: boolean | undefined;
}) {
  const { save } = usePassport();
  const done = has(save.done, a.id);
  const fav = has(save.favorites, a.id);
  const later = has(save.saved, a.id);
  const repeats = save.repeats[a.id] ?? 0;
  const feedback = save.feedback[a.id]?.value;
  const [note, setNote] = useState("");
  const [justDone, setJustDone] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const dog = dogName || "your dog or dogs";
  useEffect(() => {
    if (focusOnMount) titleRef.current?.focus();
  }, [focusOnMount]);
  // Restrictions first (yard, people, dogs), then the reassuring labels. Wording is shared with previews.
  const tags = (() => {
    const good = goodLabels(glanceOf(a), a.noise === "quiet");
    const restrict = tagChips(a).filter(
      (t) => !["Puppy-friendly", "Senior-friendly", "Quiet"].includes(t),
    );
    const travel = needChips(glanceOf(a)).filter((t) => t !== "Involves food or treats");
    return [...new Set([...restrict, ...travel, ...good])].slice(0, 7);
  })();
  // Suitability and preparation are always on the page: never inside a fold.
  const before = [...new Set([...a.safety, ...suitabilityNotes(a), ...logistics(a)])];
  const extras = [...a.variations, ...a.substitutes];

  function complete() {
    completeAdventure(a.id);
    track("adventure_completed", { adventure: a.id });
    setJustDone(true);
  }
  function toggleHeart() {
    if (fav) {
      unfavorite(a.id);
      if (feedback === "liked") setFeedback(a.id, null);
    } else {
      favorite(a.id);
      setFeedback(a.id, "liked");
      track("favorite_added", { adventure: a.id });
    }
  }
  const saveButton = (
    <button
      type="button"
      className="pp-btn pp-btn-ghost"
      aria-pressed={later}
      onClick={() => {
        if (later) unsaveForLater(a.id);
        else {
          saveForLater(a.id);
          track("adventure_saved", { adventure: a.id });
        }
      }}
    >
      {later ? "Saved for later ✓" : "Save for later"}
    </button>
  );

  return (
    <article className="pa-card pd-card" aria-label={a.title}>
      {(done || repeats > 0) && (
        <p className="pd-types">
          {done && <span className="pd-done">✓ Done together</span>}
          {repeats > 0 && <span>Repeated {repeats}×</span>}
        </p>
      )}
      <h2 className="pa-title" tabIndex={-1} ref={titleRef}>
        {a.title}
      </h2>
      {why && why.length > 0 && (
        <p className="pd-why">
          <strong>Why this one:</strong> {why.join(". ")}.
        </p>
      )}

      <p className="pa-twist">{a.twist}</p>
      {a.reveal && <p className="ux-about">{a.reveal}</p>}
      <FactChips a={a} />
      {tags.length > 0 && (
        <ul className="pa-tags" aria-label="Good fit">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      {before.length > 0 && (
        <section className="ux-before" aria-labelledby={`${a.id}-before`}>
          <h3 className="pa-sec" id={`${a.id}-before`}>
            Before you start
          </h3>
          <ul className="pa-list-plain" aria-label={`Safety and preparation for ${a.title}`}>
            {before.map((n) => (
              <li key={n}>{n}</li>
            ))}
            <li>{PREP_LABELS[a.prep]}</li>
          </ul>
          <details className="pa-gtk">
            <summary>Signs your dog needs a break</summary>
            <div className="pa-gtk-body">
              <DogSigns />
            </div>
          </details>
        </section>
      )}

      <section aria-labelledby={`${a.id}-need`}>
        <h3 className="pa-sec" id={`${a.id}-need`}>
          What you'll need
        </h3>
        {a.supplies.length === 0 && a.optionalSupplies.length === 0 ? (
          <p>Nothing special.</p>
        ) : (
          <ul className="pa-list-plain">
            {a.supplies.map((s) => (
              <li key={s}>{s}</li>
            ))}
            {a.optionalSupplies.map((s) => (
              <li key={s}>{s} (optional)</li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby={`${a.id}-steps`}>
        <h3 className="pa-sec" id={`${a.id}-steps`}>
          How it goes
        </h3>
        <ol className="pa-steps ux-steps">
          {a.instructions.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ol>
      </section>

      {extras.length > 0 && (
        <details className="pa-fold">
          <summary>Easier ways and swaps</summary>
          <div className="pa-fold-body">
            <ul className="pa-list-plain">
              {extras.map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </details>
      )}

      {!done && (
        <div className="pa-actions">
          <button type="button" className="pp-btn pp-btn-primary" onClick={complete}>
            We did it
          </button>
          {saveButton}
          {onAnother && (
            <button type="button" className="pp-btn pp-btn-secondary" onClick={onAnother}>
              {anotherLabel}
            </button>
          )}
          <MoreMenu label={`More for ${a.title}`}>{moreItems()}</MoreMenu>
        </div>
      )}
      {done && (
        <div className="pa-actions">
          {saveButton}
          {onAnother && (
            <button type="button" className="pp-btn pp-btn-secondary" onClick={onAnother}>
              {anotherLabel}
            </button>
          )}
          <MoreMenu label={`More for ${a.title}`}>{moreItems()}</MoreMenu>
        </div>
      )}
      <ScheduleAdventure a={a} />
      <p className="pd-status" role="status">
        {note}
      </p>

      {done && <CompletionPanel a={a} dogName={dogName} focus={justDone} />}
    </article>
  );

  function moreItems() {
    return (
      <>
        {done && (
          <>
            <button
              type="button"
              className="pp-btn pp-btn-ghost"
              onClick={() => {
                repeatAdventure(a.id);
                setNote("Logged another time. Your unique adventure count stays the same.");
              }}
            >
              Do it again
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-ghost"
              onClick={() => {
                undoCompletion(a.id);
                setJustDone(false);
                setNote("");
              }}
            >
              Undo
            </button>
          </>
        )}
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          aria-pressed={fav}
          onClick={toggleHeart}
        >
          {fav ? "♥ Favorite" : "♡ Favorite"}
        </button>
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          aria-pressed={feedback === "not-for-us"}
          onClick={() => {
            if (feedback === "not-for-us") setFeedback(a.id, null);
            else {
              if (fav) unfavorite(a.id);
              setFeedback(a.id, "not-for-us");
              setNote(`Noted. We will treat this one as not for ${dog}.`);
            }
          }}
        >
          Not for us
        </button>
        <AddToCollection adventureId={a.id} title={a.title} />
      </>
    );
  }
}

/** Kept for pages that still import the old name. */
export const RevealedCard = AdventureCard;
