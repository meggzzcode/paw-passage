import { useId, useState } from "react";
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
import { Keepsake } from "./Keepsake";
import { AddToCollection } from "./AddToCollection";
import {
  ACTIVITY_LABELS,
  PREP_LABELS,
  SUPPLY_LABELS,
  formatCost,
  formatSetting,
  formatTime,
  keepsakeName,
  suitabilityNotes,
} from "./labels";

const EFFORT = { gentle: "Gentle effort", moderate: "Moderate effort", lively: "Lively effort" };

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
      <li>{EFFORT[a.energy]}</li>
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
        <button type="button" className="pp-btn pp-btn-primary" onClick={onReveal}>
          Reveal adventure
        </button>
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

export function AdventureCard({
  a,
  dogName,
  why,
  defaultOpen = false,
  onAnother,
  anotherLabel = "Try another",
}: {
  a: Adventure;
  dogName?: string | undefined;
  why?: string[] | undefined;
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
  const [open, setOpen] = useState(defaultOpen);
  const [memory, setMem] = useState(save.memories[a.id]?.text ?? "");
  const [showKeepsake, setShowKeepsake] = useState(false);
  const [note, setNote] = useState("");
  const detailsId = useId();
  const dog = dogName || "your dog";
  const key = a.supplies.slice(0, 3);
  const notes = suitabilityNotes(a);
  const book = logistics(a);

  function complete() {
    completeAdventure(a.id);
    track("adventure_completed", { adventure: a.id });
    const names = a.stamps
      .map((s) => stamps.find((x) => x.slug === s)?.title ?? "")
      .filter(Boolean);
    setNote(
      `Added to your passport.${names.length ? ` It counts toward: ${names.join(", ")}.` : ""} A keepsake is there if you would like one.`,
    );
  }

  return (
    <article className="pa-card pd-card" aria-label={a.title}>
      <ul className="pd-types" aria-label="Kinds of adventure">
        {a.activityTypes.map((t) => (
          <li key={t}>{ACTIVITY_LABELS[t]}</li>
        ))}
        {done && <li className="pd-done">✓ Completed</li>}
        {repeats > 0 && <li>Repeated {repeats}×</li>}
      </ul>
      <h3 className="pa-title">{a.title}</h3>
      {why && why.length > 0 && (
        <p className="pd-why">
          <strong>Why this one:</strong> {why.join(". ")}.
        </p>
      )}
      <Chips a={a} />
      {(key.length > 0 || notes.length > 0 || book.length > 0) && (
        <ul className="pd-facts">
          {key.length > 0 && <li>You will need: {key.join(", ")}</li>}
          {book.map((b) => (
            <li key={b}>{b}</li>
          ))}
          {notes.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
      )}
      <p className="pa-fine">Keepsake: {keepsakeName(a)}</p>

      <button
        type="button"
        className="pp-btn pp-btn-ghost pd-toggle"
        aria-expanded={open}
        aria-controls={detailsId}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Hide details" : "Show details"}
      </button>
      {open && (
        <div id={detailsId} className="pd-details">
          <p>{a.reveal}</p>
          <h4 className="pa-sec">How it goes</h4>
          <ol className="pa-steps">
            {a.instructions.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ol>
          <p className="pa-twist">
            <strong>The twist:</strong> {a.twist}
          </p>
          {a.supplies.length > 0 && (
            <p>
              <strong>You will need:</strong> {a.supplies.join(", ")}
              {a.optionalSupplies.length > 0 && ` (optional: ${a.optionalSupplies.join(", ")})`}
            </p>
          )}
          {a.variations.length > 0 && (
            <>
              <h4 className="pa-sec">Variations</h4>
              <ul>
                {a.variations.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </>
          )}
          <aside className="pa-safety" aria-label="Safety and suitability">
            <strong>For {dog}'s comfort</strong>
            <ul>
              {a.safety.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>
            <p>
              {dog[0]!.toUpperCase() + dog.slice(1)} can stop or skip any time. Ask your vet about
              health questions.
            </p>
          </aside>
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
        </div>
      )}

      <div className="pa-actions">
        {done ? (
          <>
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => {
                undoCompletion(a.id);
                setNote("");
              }}
            >
              Undo completion
            </button>
            <button
              type="button"
              className="pp-btn pp-btn-secondary"
              onClick={() => {
                repeatAdventure(a.id);
                setNote("Logged another time. Your unique adventure count stays the same.");
              }}
            >
              Do it again
            </button>
          </>
        ) : (
          <button type="button" className="pp-btn pp-btn-primary" onClick={complete}>
            Mark complete
          </button>
        )}
        <button
          type="button"
          className="pp-btn pp-btn-secondary"
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
          onClick={() => {
            if (fav) unfavorite(a.id);
            else {
              favorite(a.id);
              track("favorite_added", { adventure: a.id });
            }
          }}
        >
          {fav ? "♥ Favorite" : "♡ Favorite"}
        </button>
        <AddToCollection adventureId={a.id} title={a.title} />
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          aria-pressed={feedback === "liked"}
          onClick={() => setFeedback(a.id, feedback === "liked" ? null : "liked")}
        >
          Liked
        </button>
        <button
          type="button"
          className="pp-btn pp-btn-ghost"
          aria-pressed={feedback === "not-for-us"}
          onClick={() => setFeedback(a.id, feedback === "not-for-us" ? null : "not-for-us")}
        >
          Not for us
        </button>
        {onAnother && (
          <button type="button" className="pp-btn pp-btn-ghost" onClick={onAnother}>
            {anotherLabel}
          </button>
        )}
      </div>
      <p className="pd-status" role="status">
        {note}
      </p>

      {done && (
        <div className="pd-keepsake">
          <button
            type="button"
            className="pp-btn pp-btn-secondary"
            aria-expanded={showKeepsake}
            onClick={() => {
              setMemory(a.id, memory);
              setShowKeepsake((v) => !v);
            }}
          >
            {showKeepsake ? "Hide keepsake" : "Create keepsake"}
          </button>
          {showKeepsake && <Keepsake adventure={a} dogName={dogName} memory={memory} />}
        </div>
      )}
    </article>
  );
}

/** Kept for pages that still import the old name. */
export const RevealedCard = AdventureCard;
