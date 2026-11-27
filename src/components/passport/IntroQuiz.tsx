// The free intro quiz: FOUR short screens (life stage, energy, mood, anything to keep in mind) and an honest
// "Question n of 4" indicator. Single-choice screens move on when you tap an answer (Back is always there); the last
// screen is a multi-select with an explicit button. Optional refinements sit behind one control, "Make it more
// personal (optional)", and add no screens. Skipping leaves a question UNKNOWN. Answers stay in this component until
// the last step, then are written to the existing profile / owner preferences. No network.
// Browser Back steps back inside the quiz (history state), and a reload resumes where you were (session storage).
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  MULTI_DOG_NOTE,
  type DogProfile,
  type KeepItem,
  type OwnerPrefs,
} from "@/passport/profile";
import { setOwner, setProfile } from "@/passport/local-store";
import type { Save } from "@/passport/progress";
import {
  CAR_OPTIONS,
  ENERGY_OPTIONS,
  ENJOY_OPTIONS,
  KEEP_EXCLUSIVE,
  KEEP_HIDDEN,
  KEEP_OPTIONS,
  KIDS_OPTION,
  LIFE_CHOICES,
  MIXED_STAGES,
  MOOD_OPTIONS,
  whereOfMood,
  PERSONAL_STEPS,
  SPEND_OPTIONS,
  STEP_QUESTION,
  TIME_OPTIONS,
  WALK_OPTIONS,
  answersFromSave,
  applyAnswers,
  stepsToAsk,
  type QuizAnswers,
  type StepId,
} from "@/passport/quiz";

type Opt<T> = { value: T; label: string };

/** Decorative emoji for the answer tiles (the Everyday Magic look). aria-hidden: the label alone names the button. */
const TILE_EMOJI: Record<string, string> = {
  Puppy: "🐶",
  Adult: "🐕",
  Senior: "🦮",
  Gentle: "🌿",
  Moderate: "🚶",
  Lively: "⚡",
  "It varies": "🎲",
  Sniffing: "👃",
  Games: "🎾",
  Exploring: "🧭",
  Food: "🦴",
  Creative: "🎨",
  Relaxing: "🛋️",
  "A mix of ages": "🐾",
  "A cozy day at home": "🛋️",
  "A little outing": "🌳",
  "Something quiet": "🤫",
  "Something playful": "🎾",
  "Surprise us": "🎁",
  "Mobility limits": "🐾",
  "Food restrictions": "🥣",
  "Children joining": "🧒",
  Water: "💧",
  Noise: "🔊",
  Crowds: "👥",
  "Other dogs": "🐕‍🦺",
  "Exercise or health limits": "🛑",
  "Nothing in particular": "✨",
  "Not sure": "🤔",
  "Prefer not to say": "🤐",
  "At home": "🏡",
  "Nearby outdoors": "🌳",
  "Anywhere suitable": "🗺️",
  "I'd rather sit": "🪑",
  "Very little walking": "🐢",
  "A short walk": "🚶",
  "Happy to walk further": "🥾",
  "I have a car": "🚗",
  "No car": "🚶‍♀️",
  "Short (about 15 min)": "⏱️",
  "Medium (about 30 min)": "⏳",
  "Longer is fine": "🕰️",
  Nothing: "🆓",
  "Inexpensive (under $10)": "🪙",
  Flexible: "🎈",
};
const Emoji = ({ label }: { label: string }) =>
  TILE_EMOJI[label] ? (
    <span className="pa-chip-emoji" aria-hidden="true">
      {TILE_EMOJI[label]}
    </span>
  ) : null;

const DRAFT_KEY = "pp.quiz.draft.v1";
type Stored = { draft: QuizAnswers; open: boolean; mode: string };

function readStored(mode: string): Stored | null {
  try {
    const v = JSON.parse(window.sessionStorage.getItem(DRAFT_KEY) ?? "null") as Stored | null;
    return v && v.mode === mode && typeof v.draft === "object" ? v : null;
  } catch {
    return null;
  }
}
function writeStored(v: Stored | null) {
  try {
    if (v) window.sessionStorage.setItem(DRAFT_KEY, JSON.stringify(v));
    else window.sessionStorage.removeItem(DRAFT_KEY);
  } catch {
    /* blocked storage: the quiz still works, a reload just starts over */
  }
}
const histIdx = (): number | undefined => {
  try {
    const v = (window.history.state as { ppQuiz?: unknown } | null)?.ppQuiz;
    return typeof v === "number" ? v : undefined;
  } catch {
    return undefined;
  }
};
function setHist(kind: "push" | "replace", idx: number) {
  try {
    const st = { ...((window.history.state as object | null) ?? {}), ppQuiz: idx };
    if (kind === "push") window.history.pushState(st, "");
    else window.history.replaceState(st, "");
  } catch {
    /* history unavailable: the in-app Back button still works */
  }
}

/** Moves focus to an element and brings it into view only when needed. Honors reduced motion. */
export function focusInto(el: HTMLElement | null) {
  if (!el) return;
  el.focus({ preventScroll: true });
  const r = el.getBoundingClientRect();
  const h = window.innerHeight || 800;
  if (r.top < 64 || r.top > h * 0.55) {
    const calm = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    el.scrollIntoView?.({ block: "start", behavior: calm ? "auto" : "smooth" });
  }
}

function Choices<T extends string>({
  labelledBy,
  options,
  value,
  onPick,
}: {
  labelledBy: string;
  options: readonly Opt<T>[];
  value: T | undefined;
  onPick: (v: T) => void;
}) {
  return (
    <fieldset className="pa-field pd-choices" aria-labelledby={labelledBy}>
      <div className="pa-chips">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="pa-chip"
            aria-pressed={o.value === value}
            onClick={() => onPick(o.value)}
          >
            <Emoji label={o.label} />
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

/** A small labelled group for the optional refinements (a legend is right here: there is no step heading for these). */
function Group({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset className="pa-field pd-opt">
      <legend>{legend}</legend>
      <div className="pa-chips">{children}</div>
    </fieldset>
  );
}
function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: string }) {
  return (
    <button type="button" className="pa-chip" aria-pressed={on} onClick={onClick}>
      <Emoji label={children} />
      {children}
    </button>
  );
}

/** True when this step has an answer in the draft (the quiet link then says "Next" instead of "Skip"). */
function answeredIn(id: StepId, a: QuizAnswers): boolean {
  switch (id) {
    case "life":
      return !!a.lifeStages?.length;
    case "energy":
      return !!a.energy;
    case "mood":
      return !!a.mood;
    case "keep":
      return !!a.keepInMind?.length || !!a.kids;
    default:
      return false;
  }
}

export function IntroQuiz({
  save,
  mode,
  preset,
  submitLabel,
  onDone,
  onCancel,
}: {
  save: Save;
  mode: "first" | "edit";
  /** Pre-selected answers from a "Starting from" context. Already stripped of anything the save answers. */
  preset?: Partial<QuizAnswers> | undefined;
  submitLabel: string;
  onDone: () => void;
  onCancel?: (() => void) | undefined;
}) {
  // A reload (or Back from the recommendation) mid-quiz resumes: the history entry carries the step, session storage the answers.
  const resume = useRef<{ idx: number; stored: Stored | null } | null>(null);
  if (resume.current === null) {
    const idx = mode === "first" ? histIdx() : undefined;
    resume.current = { idx: idx ?? 0, stored: idx === undefined ? null : readStored(mode) };
  }
  const [open, setOpen] = useState(resume.current.stored?.open ?? false);
  const [draft, setDraft] = useState<QuizAnswers>(
    () => resume.current?.stored?.draft ?? { ...(preset ?? {}), ...answersFromSave(save) },
  );
  const steps = useMemo(
    () => stepsToAsk(save, { all: mode === "edit" }),
    // The save is only written at the end, so the list stays stable while answering.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode],
  );
  const [i, setI] = useState(() =>
    Math.min(resume.current?.idx ?? 0, Math.max(0, steps.length - 1)),
  );
  const heading = useRef<HTMLHeadingElement>(null);
  // Editing starts on the first question after a tap on "Edit preferences", so focus follows it from the start.
  const moved = useRef(resume.current.idx > 0 || mode === "edit");

  const setHistory = useCallback(
    (n: number) => {
      if (n === i) return;
      setHist("push", n);
      moved.current = true;
      setI(n);
    },
    [i],
  );

  // Mark the first screen so a reload or Back lands on a quiz step, and follow the browser's Back/Forward inside the quiz.
  useEffect(() => {
    if (mode === "edit" || histIdx() === undefined) setHist("replace", 0);
    const pop = () => {
      moved.current = true;
      setI(Math.min(histIdx() ?? 0, Math.max(0, steps.length - 1)));
    };
    window.addEventListener("popstate", pop);
    return () => window.removeEventListener("popstate", pop);
  }, [steps.length, mode]);

  useEffect(() => writeStored({ draft, open, mode }), [draft, open, mode]);

  // Every move scrolls the new question into view and moves focus to its heading (no trap: Tab continues into the answers).
  useEffect(() => {
    if (moved.current) focusInto(heading.current);
  }, [i]);

  const set = (p: Partial<QuizAnswers>) => setDraft((d) => ({ ...d, ...p }));
  const clear = (...keys: (keyof QuizAnswers)[]) =>
    setDraft((d) => {
      const n = { ...d };
      for (const k of keys) delete n[k];
      return n;
    });

  function finish() {
    const shown = [...steps, ...(open ? PERSONAL_STEPS : [])];
    const { dog, owner } = applyAnswers(draft, shown, save);
    if (Object.keys(dog).length) setProfile(dog as Partial<DogProfile>);
    if (Object.keys(owner).length) setOwner(owner as OwnerPrefs);
    onDone();
  }

  if (steps.length === 0)
    return (
      <section className="pa-panel pd-quiz" aria-labelledby="fs-quiz-h">
        <h2 className="pa-h" id="fs-quiz-h">
          We already know about your dog
        </h2>
        <p className="pa-sub">Your saved answers are enough to pick a first adventure.</p>
        <div className="pd-quiz-nav">
          <button type="button" className="pp-btn pp-btn-primary" onClick={finish}>
            {submitLabel}
          </button>
        </div>
      </section>
    );

  const idx = Math.min(i, steps.length - 1);
  const id = steps[idx]!;
  const last = idx === steps.length - 1;
  const n = steps.length;
  const advance = () => (last ? finish() : setHistory(idx + 1));
  const pick = (p: Partial<QuizAnswers>) => {
    set(p);
    advance();
  };
  const back = () => {
    if (histIdx() === idx && idx > 0) window.history.back();
    else setI(idx - 1);
  };

  const stages = draft.lifeStages ?? [];
  const toggleKeep = (v: KeepItem) =>
    setDraft((d) => {
      const cur = d.keepInMind ?? [];
      const hidden = cur.filter((x) => KEEP_HIDDEN.includes(x));
      const next = { ...d };
      const exclusive = KEEP_EXCLUSIVE.some((e) => e.value === v);
      let list: KeepItem[];
      if (cur.includes(v)) list = cur.filter((x) => x !== v);
      else if (exclusive) list = [...hidden, v];
      else list = [...cur.filter((x) => x !== "none" && x !== "unsure"), v];
      if (list.length) next.keepInMind = list;
      else delete next.keepInMind;
      return next;
    });
  const toggleKids = () =>
    setDraft((d) => {
      const next = { ...d };
      if (d.kids) delete next.kids;
      else next.kids = true;
      return next;
    });

  const qid = "fs-quiz-h";
  let body;
  switch (id) {
    case "life":
      body = (
        <>
          <Choices
            labelledBy={qid}
            options={LIFE_CHOICES}
            value={stages.length > 1 ? "mixed" : stages[0]}
            onPick={(v) =>
              pick({
                lifeStages: v === "mixed" ? (stages.length > 1 ? stages : [...MIXED_STAGES]) : [v],
              })
            }
          />
          <p className="pa-fine">
            More than one dog? One shared profile is fine: choose “A mix of ages” and we pick
            something that suits every dog.
          </p>
        </>
      );
      break;
    case "energy":
      body = (
        <Choices
          labelledBy={qid}
          options={ENERGY_OPTIONS}
          value={draft.energy}
          onPick={(v) => pick({ energy: v })}
        />
      );
      break;
    case "mood":
      body = (
        <Choices
          labelledBy={qid}
          options={MOOD_OPTIONS}
          value={draft.mood}
          onPick={(v) =>
            pick({
              mood: v,
              where: whereOfMood(v),
            })
          }
        />
      );
      break;
    default:
      body = (
        <fieldset className="pa-field pd-choices" aria-labelledby={qid}>
          <p className="pa-fine">
            Pick any that apply. Only you know your dog. “Not sure” stays unknown, and we ask before
            an adventure that depends on it.
          </p>
          <div className="pa-chips">
            {KEEP_OPTIONS.map((o) => (
              <Chip
                key={o.value}
                on={!!draft.keepInMind?.includes(o.value)}
                onClick={() => toggleKeep(o.value)}
              >
                {o.label}
              </Chip>
            ))}
            <Chip on={!!draft.kids} onClick={toggleKids}>
              {KIDS_OPTION.label}
            </Chip>
            {KEEP_EXCLUSIVE.map((o) => (
              <Chip
                key={o.value}
                on={!!draft.keepInMind?.includes(o.value)}
                onClick={() => toggleKeep(o.value)}
              >
                {o.label}
              </Chip>
            ))}
          </div>
        </fieldset>
      );
  }

  const answered = answeredIn(id, draft);
  const personalId = "fs-personal";
  return (
    <section className="pa-panel pd-quiz">
      <p className="pd-quiz-count" id="fs-quiz-count">
        Question {idx + 1} of {n}
      </p>
      <div
        className="pd-quiz-bar"
        role="progressbar"
        aria-label="Quiz progress"
        aria-valuemin={1}
        aria-valuemax={n}
        aria-valuenow={idx + 1}
        aria-valuetext={`Question ${idx + 1} of ${n}`}
      >
        <span style={{ width: `${((idx + 1) / n) * 100}%` }} />
        {/* Decorative segment dividers (the segmented look); the real progressbar above carries the meaning. */}
        <i aria-hidden="true" style={{ ["--steps" as string]: n }} />
      </div>
      <div className="pd-quiz-step" key={id}>
        <h2 className="pa-h pd-quiz-q" id={qid} tabIndex={-1} ref={heading}>
          {STEP_QUESTION[id]}
        </h2>
        <div className="pd-editor">{body}</div>
      </div>
      {last && (
        <div className="pd-quiz-more">
          <button
            type="button"
            className="pa-linkbtn"
            aria-expanded={open}
            aria-controls={personalId}
            onClick={() => setOpen((o) => !o)}
          >
            Make it more personal (optional)
          </button>
          {open && (
            <div id={personalId} className="pd-personal">
              <label className="pa-field">
                <span className="pa-fine">
                  Dog name or names, like “Luna and Milo”. We keep one shared profile.
                </span>
                <input
                  aria-label="Your dog's name, or names"
                  value={draft.names ?? ""}
                  maxLength={60}
                  autoComplete="off"
                  placeholder="Luna and Milo"
                  onChange={(e) => set({ names: e.target.value })}
                />
              </label>
              {draft.names && draft.names.split(/,|&|\band\b/i).length > 1 && (
                <p className="pa-fine">{MULTI_DOG_NOTE}</p>
              )}
              <Group legend="Available time">
                {TIME_OPTIONS.map((o) => (
                  <Chip
                    key={o.value}
                    on={draft.time === o.value}
                    onClick={() =>
                      draft.time === o.value ? clear("time") : set({ time: o.value })
                    }
                  >
                    {o.label}
                  </Chip>
                ))}
              </Group>
              <Group legend="Budget">
                {SPEND_OPTIONS.map((o) => (
                  <Chip
                    key={o.value}
                    on={draft.spend === o.value}
                    onClick={() =>
                      draft.spend === o.value ? clear("spend") : set({ spend: o.value })
                    }
                  >
                    {o.label}
                  </Chip>
                ))}
              </Group>
              <Group legend="Walking">
                {WALK_OPTIONS.map((o) => (
                  <Chip
                    key={o.value}
                    on={draft.walking === o.value}
                    onClick={() =>
                      draft.walking === o.value ? clear("walking") : set({ walking: o.value })
                    }
                  >
                    {o.label}
                  </Chip>
                ))}
                <Chip
                  on={!!draft.stepFree}
                  onClick={() => (draft.stepFree ? clear("stepFree") : set({ stepFree: true }))}
                >
                  Step-free routes only
                </Chip>
              </Group>
              <Group legend="Transport">
                {CAR_OPTIONS.map((o) => (
                  <Chip
                    key={o.value}
                    on={draft.car === o.value}
                    onClick={() => (draft.car === o.value ? clear("car") : set({ car: o.value }))}
                  >
                    {o.label}
                  </Chip>
                ))}
              </Group>
              <Group legend="Interests (a gentle nudge, never a rule)">
                {ENJOY_OPTIONS.map((o) => (
                  <Chip
                    key={o.value}
                    on={!!draft.enjoy?.includes(o.value)}
                    onClick={() =>
                      set({
                        enjoy: draft.enjoy?.includes(o.value)
                          ? draft.enjoy.filter((x) => x !== o.value)
                          : [...(draft.enjoy ?? []), o.value],
                      })
                    }
                  >
                    {o.label}
                  </Chip>
                ))}
              </Group>
            </div>
          )}
        </div>
      )}
      <div className="pd-quiz-nav">
        {idx > 0 ? (
          <button type="button" className="pp-btn pp-btn-ghost" onClick={back}>
            Back
          </button>
        ) : (
          onCancel && (
            <button type="button" className="pp-btn pp-btn-ghost" onClick={onCancel}>
              Cancel
            </button>
          )
        )}
        {last ? (
          <button type="button" className="pp-btn pp-btn-primary" onClick={finish}>
            {submitLabel}
          </button>
        ) : (
          <button type="button" className="pa-linkbtn" onClick={advance}>
            {answered ? "Next" : "Skip"}
          </button>
        )}
      </div>
      <p className="pa-fine">Skipped questions stay unknown. Nothing leaves this device.</p>
    </section>
  );
}
