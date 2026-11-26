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
  setMemory,
  undoCompletion,
  unfavorite,
  unsaveForLater,
} from "@/passport/local-store";
import { has } from "@/passport/progress";
import { stamps } from "@/passport/content";
import { track } from "@/passport/events";
import { usePassport } from "@/passport/usePassport";
import { KeepsakeGate } from "./KeepsakeGate";
import { useKeepsakeEntitled } from "@/passport/useKeepsakeEntitled";
import { AddToCollection } from "./AddToCollection";
import { GoodToKnow } from "./ReadYourDog";
import {
  ACTIVITY_LABELS,
  PREP_LABELS,
  SUPPLY_LABELS,
  effortChips,
  formatCost,
  formatSetting,
  formatTime,
  glanceOf,
  goodLabels,
  keepsakeName,
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

/** The one "You'll need" line: the first few supplies, or "Nothing special". The full list is under More details. */
function needLine(a: Adventure): string {
  if (a.supplies.length === 0) return "Nothing special";
  const shown = a.supplies.slice(0, 3).join(", ");
  const more = a.supplies.length - 3;
  return more > 0 ? `${shown} and ${more} more` : shown;
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
}: {
  a: Adventure;
  dogName?: string | undefined;
  why?: string[] | undefined;
  /** Kept so existing callers still compile; the card no longer hides its steps. */
  defaultOpen?: boolean | undefined;
  onAnother?: (() => void) | undefined;
  anotherLabel?: string | undefined;
}) {
  const { save } = usePassport();
  const done = has(save.done, a.id);
  const fav = has(save.favorites, a.id);
  const later = has(save.saved, a.id);
  const repeats = save.repeats[a.id] ?? 0;
  const feedback = save.feedback[a.id]?.value;
  const [memory, setMem] = useState(save.memories[a.id]?.text ?? "");
  const [showKeepsake, setShowKeepsake] = useState(false);
  const canMakeKeepsake = useKeepsakeEntitled();
  const [note, setNote] = useState("");
  const dog = dogName || "your dog or dogs";
  // Restrictions first (yard, people, dogs), then the reassuring labels. Wording is shared with previews.
  const tags = (() => {
    const good = goodLabels(glanceOf(a), a.noise === "quiet");
    const restrict = tagChips(a).filter(
      (t) => !["Puppy-friendly", "Senior-friendly", "Quiet"].includes(t),
    );
    const travel = needChips(glanceOf(a)).filter((t) => t !== "Involves food or treats");
    return [...new Set([...restrict, ...travel, ...good])].slice(0, 7);
  })();
  const notes = suitabilityNotes(a);
  const book = logistics(a);
  const memoryField = (
    <label className="pa-field">
      <span>{a.memoryPrompt} (optional)</span>
      <textarea
        rows={2}
        maxLength={140}
        value={memory}
        onChange={(e) => setMem(e.target.value)}
        onBlur={() => setMemory(a.id, memory)}
      />
    </label>
  );

  function complete() {
    completeAdventure(a.id);
    track("adventure_completed", { adventure: a.id });
    const names = a.stamps
      .map((s) => stamps.find((x) => x.slug === s)?.title ?? "")
      .filter(Boolean);
    setNote(
      `Added to your passport.${names.length ? ` It counts toward: ${names.join(", ")}.` : ""} Next: turn it into a photo filter if you would like one.`,
    );
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

  return (
    <article className="pa-card pd-card" aria-label={a.title}>
      {(done || repeats > 0) && (
        <p className="pd-types">
          {done && <span className="pd-done">✓ Collected</span>}
          {repeats > 0 && <span>Repeated {repeats}×</span>}
        </p>
      )}
      <h2 className="pa-title">{a.title}</h2>
      {why && why.length > 0 && (
        <p className="pd-why">
          <strong>Why this one:</strong> {why.join(". ")}.
        </p>
      )}

      <p className="pa-twist">
        <span className="pa-twist-k">The twist</span>
        {a.twist}
      </p>
      <p className="pa-need">
        <strong>You'll need:</strong> {needLine(a)}
      </p>
      <FactChips a={a} />
      {tags.length > 0 && (
        <ul className="pa-tags" aria-label="Good fit">
          {tags.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      )}

      <details className="pa-fold">
        <summary>More details</summary>
        <div className="pa-fold-body">
          <p>{a.reveal}</p>
          {a.supplies.length > 0 && (
            <>
              <p className="pa-sec">You'll need</p>
              <ul className="pa-list-plain">
                {a.supplies.map((s) => (
                  <li key={s}>{s}</li>
                ))}
                {a.optionalSupplies.map((s) => (
                  <li key={s}>{s} (optional)</li>
                ))}
              </ul>
            </>
          )}
          {(notes.length > 0 || book.length > 0 || a.activityTypes.length > 0) && (
            <>
              <p className="pa-sec">At a glance</p>
              <ul className="pa-meta" aria-label="All details">
                {[...a.activityTypes.map((t) => ACTIVITY_LABELS[t]), ...book, ...notes].map((n) => (
                  <li key={n}>{n}</li>
                ))}
                <li>{PREP_LABELS[a.prep]}</li>
              </ul>
            </>
          )}
          <p className="pa-fine">Keepsake: {keepsakeName(a)}</p>
          {!done && memoryField}
        </div>
      </details>

      <p className="pa-sec">How it goes</p>
      <ol className="pa-steps">
        {a.instructions.map((s) => (
          <li key={s}>{s}</li>
        ))}
      </ol>

      {(a.variations.length > 0 || a.substitutes.length > 0) && (
        <details className="pa-fold">
          <summary>Easier ways</summary>
          <div className="pa-fold-body">
            <ul className="pa-list-plain">
              {[...a.variations, ...a.substitutes].map((v) => (
                <li key={v}>{v}</li>
              ))}
            </ul>
          </div>
        </details>
      )}

      <GoodToKnow lines={a.safety} />

      <div className="pa-actions">
        {done ? (
          <button
            type="button"
            className="pp-btn pp-btn-primary"
            aria-expanded={showKeepsake}
            onClick={() => {
              setMemory(a.id, memory);
              setShowKeepsake((v) => !v);
            }}
          >
            {showKeepsake
              ? canMakeKeepsake
                ? "Hide photo filter"
                : "Hide keepsake style"
              : canMakeKeepsake
                ? "Make my photo filter"
                : "See the keepsake style"}
          </button>
        ) : (
          <button type="button" className="pp-btn pp-btn-primary" onClick={complete}>
            Collect it
          </button>
        )}
        {onAnother && (
          <button type="button" className="pp-btn pp-btn-secondary" onClick={onAnother}>
            {anotherLabel}
          </button>
        )}
        <MoreMenu label={`More for ${a.title}`}>
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
                  setShowKeepsake(false);
                  setNote("");
                }}
              >
                Undo collecting
              </button>
            </>
          )}
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
        </MoreMenu>
      </div>
      <ScheduleAdventure a={a} />
      <p className="pd-status" role="status">
        {note}
      </p>

      {done && (
        <div className="pd-keepsake">
          {memoryField}
          {showKeepsake && <KeepsakeGate adventure={a} dogName={dogName} memory={memory} />}
        </div>
      )}
    </article>
  );
}

/** Kept for pages that still import the old name. */
export const RevealedCard = AdventureCard;
