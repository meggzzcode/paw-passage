// The free intro quiz: at most ten steps, one concise question each, attractive answer chips and an honest
// "Question n of N" progress indicator. The default path is eight steps; two optional steps appear only on request, and
// questions the saved profile already answers are skipped. Skipping a question leaves it UNKNOWN. Answers are kept in
// this component until the last step, then written to the existing profile / owner preferences. No network.
import { useMemo, useState } from "react";
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
  KEEP_OPTIONS,
  LIFE_OPTIONS,
  SPEND_OPTIONS,
  STEP_QUESTION,
  TIME_OPTIONS,
  WALK_OPTIONS,
  WHERE_OPTIONS,
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
  Mobility: "🐾",
  "Food limits": "🥣",
  Water: "💧",
  Noise: "🔊",
  Crowds: "👥",
  "Other dogs": "🐕‍🦺",
  "Exercise limits": "🛑",
  "Nothing in particular": "✨",
  "Not sure": "🤔",
  "Prefer not to say": "🤐",
  "At home": "🏡",
  "Nearby outdoors": "🌳",
  "Anywhere suitable": "🗺️",
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

function Single<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: readonly Opt<T>[];
  value: T | undefined;
  onChange: (v: T | undefined) => void;
}) {
  return (
    <fieldset className="pa-field">
      <legend>{legend}</legend>
      <div className="pa-chips">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            className="pa-chip"
            aria-pressed={o.value === value}
            onClick={() => onChange(o.value === value ? undefined : o.value)}
          >
            <Emoji label={o.label} />
            {o.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function Multi<T extends string>({
  legend,
  hint,
  options,
  values,
  onChange,
  extra,
}: {
  legend: string;
  hint?: string;
  options: readonly Opt<T>[];
  values: readonly T[];
  onChange: (v: T[]) => void;
  extra?: readonly Opt<T>[];
}) {
  const toggle = (v: T, exclusive: boolean) => {
    const on = values.includes(v);
    if (on) return onChange(values.filter((x) => x !== v));
    const ex = new Set((extra ?? []).map((e) => e.value));
    onChange(exclusive ? [v] : [...values.filter((x) => !ex.has(x)), v]);
  };
  const chip = (o: Opt<T>, exclusive: boolean) => (
    <button
      key={o.value}
      type="button"
      className="pa-chip"
      aria-pressed={values.includes(o.value)}
      onClick={() => toggle(o.value, exclusive)}
    >
      <Emoji label={o.label} />
      {o.label}
    </button>
  );
  return (
    <fieldset className="pa-field">
      <legend>{legend}</legend>
      {hint && <p className="pa-fine">{hint}</p>}
      <div className="pa-chips">
        {options.map((o) => chip(o, false))}
        {extra?.map((o) => chip(o, true))}
      </div>
    </fieldset>
  );
}

/** True when this step has an answer in the draft (the button then says "Next" instead of "Skip"). */
function answeredIn(id: StepId, a: QuizAnswers): boolean {
  switch (id) {
    case "names":
      return !!a.names?.trim();
    case "life":
      return !!a.lifeStages?.length;
    case "energy":
      return !!a.energy;
    case "enjoy":
      return !!a.enjoy?.length;
    case "keep":
      return !!a.keepInMind?.length;
    case "where":
      return !!a.where;
    case "time":
      return !!a.time;
    case "spend":
      return !!a.spend;
    case "works":
      return !!(a.walking || a.stepFree || a.car);
    case "extra":
      return !!(a.quiet || a.kids);
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
  const [extras, setExtras] = useState<StepId[]>([]);
  const [draft, setDraft] = useState<QuizAnswers>(() => ({
    ...(preset ?? {}),
    ...(mode === "edit" ? answersFromSave(save) : {}),
  }));
  const [i, setI] = useState(0);
  const steps = useMemo(
    () => stepsToAsk(save, { all: mode === "edit", extras }),
    // The save is only written at the end, so the list stays stable while answering.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mode, extras],
  );
  const set = (p: Partial<QuizAnswers>) => setDraft((d) => ({ ...d, ...p }));
  const clear = (...keys: (keyof QuizAnswers)[]) =>
    setDraft((d) => {
      const n = { ...d };
      for (const k of keys) delete n[k];
      return n;
    });

  function finish() {
    const { dog, owner } = applyAnswers(draft, steps, save);
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
  const q = STEP_QUESTION[id];
  const n = steps.length;

  let body;
  switch (id) {
    case "names":
      body = (
        <label className="pa-field">
          <span className="pa-fine">
            Optional.{" "}
            {MULTI_DOG_NOTE.replace(
              /^More than one dog\? /,
              "More than one dog? Add every name, like “Luna and Milo”. ",
            )}
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
      );
      break;
    case "life":
      body = (
        <Multi
          legend={q}
          hint="Pick every one that applies. For a mix of ages we choose something that suits all of them."
          options={LIFE_OPTIONS}
          values={draft.lifeStages ?? []}
          onChange={(v) => set({ lifeStages: v })}
        />
      );
      break;
    case "energy":
      body = (
        <Single
          legend={q}
          options={ENERGY_OPTIONS}
          value={draft.energy}
          onChange={(v) => (v ? set({ energy: v }) : clear("energy"))}
        />
      );
      break;
    case "enjoy":
      body = (
        <Multi
          legend={q}
          hint="Pick any. It is a gentle nudge for ideas, never a rule."
          options={ENJOY_OPTIONS}
          values={draft.enjoy ?? []}
          onChange={(v) => set({ enjoy: v })}
        />
      );
      break;
    case "keep":
      body = (
        <Multi<KeepItem>
          legend={q}
          hint="Pick any that apply. Only you know your dog. Anything left open stays unknown, and we ask before an adventure that depends on it."
          options={KEEP_OPTIONS}
          extra={KEEP_EXCLUSIVE}
          values={draft.keepInMind ?? []}
          onChange={(v) => set({ keepInMind: v })}
        />
      );
      break;
    case "where":
      body = (
        <Single
          legend={q}
          options={WHERE_OPTIONS}
          value={draft.where}
          onChange={(v) => (v ? set({ where: v }) : clear("where"))}
        />
      );
      break;
    case "time":
      body = (
        <Single
          legend={q}
          options={TIME_OPTIONS}
          value={draft.time}
          onChange={(v) => (v ? set({ time: v }) : clear("time"))}
        />
      );
      break;
    case "spend":
      body = (
        <Single
          legend={q}
          options={SPEND_OPTIONS}
          value={draft.spend}
          onChange={(v) => (v ? set({ spend: v }) : clear("spend"))}
        />
      );
      break;
    case "works":
      body = (
        <>
          <Single
            legend="Walking"
            options={WALK_OPTIONS}
            value={draft.walking}
            onChange={(v) => (v ? set({ walking: v }) : clear("walking"))}
          />
          <Multi
            legend="Getting around"
            options={[{ value: "stepfree", label: "Step-free routes only" }]}
            values={draft.stepFree ? ["stepfree"] : []}
            onChange={(v) => (v.length ? set({ stepFree: true }) : clear("stepFree"))}
          />
          <Single
            legend="Transport"
            options={CAR_OPTIONS}
            value={draft.car}
            onChange={(v) => (v ? set({ car: v }) : clear("car"))}
          />
        </>
      );
      break;
    case "extra":
      body = (
        <Multi
          legend={q}
          options={[
            { value: "quiet", label: "Keep it quiet" },
            { value: "kids", label: "Children will join" },
          ]}
          hint="With children, an adult supervises and the dog can always walk away. We never ask for a child's name or age."
          values={[...(draft.quiet ? ["quiet"] : []), ...(draft.kids ? ["kids"] : [])]}
          onChange={(v) => {
            const next = { ...draft };
            delete next.quiet;
            delete next.kids;
            if (v.includes("quiet")) next.quiet = true;
            if (v.includes("kids")) next.kids = true;
            setDraft(next);
          }}
        />
      );
  }

  const answered = answeredIn(id, draft);
  const more = (s: StepId) => {
    setExtras((e) => [...e, s]);
    setI(idx + 1);
  };
  return (
    <section className="pa-panel pd-quiz" aria-labelledby="fs-quiz-h">
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
      <h2 className="pa-h" id="fs-quiz-h">
        {q}
      </h2>
      <div className="pd-editor">{body}</div>
      <div className="pd-quiz-nav">
        {idx > 0 ? (
          <button type="button" className="pp-btn pp-btn-ghost" onClick={() => setI(idx - 1)}>
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
          <button type="button" className="pp-btn pp-btn-primary" onClick={() => setI(idx + 1)}>
            {answered ? "Next" : "Skip"}
          </button>
        )}
      </div>
      {last && (!steps.includes("works") || !steps.includes("extra")) && (
        <div className="pd-quiz-more">
          {!steps.includes("works") && (
            <button type="button" className="pa-linkbtn" onClick={() => more("works")}>
              Add what works for you (walking, steps, car)
            </button>
          )}
          {!steps.includes("extra") && (
            <button type="button" className="pa-linkbtn" onClick={() => more("extra")}>
              Add a detail (quiet, children joining)
            </button>
          )}
        </div>
      )}
      <p className="pa-fine">Skipped questions stay unknown. Nothing leaves this device.</p>
    </section>
  );
}
