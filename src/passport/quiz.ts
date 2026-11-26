// The free intro quiz: its questions, how answers map onto the existing DogProfile / OwnerPrefs / SessionFilters, and
// which questions can be skipped. Pure functions, no network. At most ten steps; the default path is eight.
// Unknown stays unknown: a skipped question writes nothing, and "Not sure" never counts as a safe answer.
import {
  ENJOY,
  type DogProfile,
  type Enjoy,
  type KeepItem,
  type OwnerPrefs,
  type SessionFilters,
} from "./profile";
import { ctxPresets, type CtxAnswers, type CtxKey } from "./journal-context";
import type { Save } from "./progress";
import type { Adventure } from "./schema";

export type LifeStage = NonNullable<DogProfile["lifeStage"]>;

export type QuizAnswers = {
  names?: string;
  lifeStages?: LifeStage[]; // one stage, or several for a mixed household
  energy?: "gentle" | "moderate" | "lively" | "variable";
  enjoy?: Enjoy[];
  keepInMind?: KeepItem[];
  where?: "home" | "nearby" | "anywhere";
  time?: "short" | "medium" | "longer";
  spend?: "none" | "inexpensive" | "flexible";
  walking?: Adventure["ownerMobility"];
  stepFree?: boolean;
  car?: "yes" | "no";
  quiet?: boolean;
  kids?: boolean;
};

export type StepId =
  "names" | "life" | "energy" | "enjoy" | "keep" | "where" | "time" | "spend" | "works" | "extra";

/** The default path: eight steps. Two optional steps are added only when the visitor asks for them. */
export const DEFAULT_STEPS: readonly StepId[] = [
  "names",
  "life",
  "energy",
  "enjoy",
  "keep",
  "where",
  "time",
  "spend",
];
export const OPTIONAL_STEPS: readonly StepId[] = ["works", "extra"];
export const MAX_STEPS = 10;

export const STEP_QUESTION: Record<StepId, string> = {
  names: "Who's coming on the adventure?",
  life: "What life stage is your dog or dogs?",
  energy: "How would you describe their energy?",
  enjoy: "What do they enjoy?",
  keep: "Anything to keep in mind?",
  where: "Where would you like to go?",
  time: "How much time do you have?",
  spend: "How much would you like to spend?",
  works: "What works for you?",
  extra: "One more thing?",
};

type Opt<T extends string> = { value: T; label: string };
export const LIFE_OPTIONS: Opt<LifeStage>[] = [
  { value: "puppy", label: "Puppy" },
  { value: "adult", label: "Adult" },
  { value: "senior", label: "Senior" },
];
export const ENERGY_OPTIONS: Opt<NonNullable<QuizAnswers["energy"]>>[] = [
  { value: "gentle", label: "Gentle" },
  { value: "moderate", label: "Moderate" },
  { value: "lively", label: "Lively" },
  { value: "variable", label: "It varies" },
];
export const ENJOY_OPTIONS: Opt<Enjoy>[] = [
  { value: "sniffing", label: "Sniffing" },
  { value: "games", label: "Games" },
  { value: "exploring", label: "Exploring" },
  { value: "food", label: "Food" },
  { value: "creative", label: "Creative" },
  { value: "relaxing", label: "Relaxing" },
];
export const KEEP_OPTIONS: Opt<KeepItem>[] = [
  { value: "mobility", label: "Mobility" },
  { value: "food", label: "Food limits" },
  { value: "water", label: "Water" },
  { value: "noise", label: "Noise" },
  { value: "crowds", label: "Crowds" },
  { value: "dogs", label: "Other dogs" },
  { value: "exercise", label: "Exercise limits" },
];
/** Exclusive answers: choosing one clears the specific picks. None of them writes a "safe" value. */
export const KEEP_EXCLUSIVE: Opt<KeepItem>[] = [
  { value: "none", label: "Nothing in particular" },
  { value: "unsure", label: "Not sure" },
  { value: "private", label: "Prefer not to say" },
];
export const WHERE_OPTIONS: Opt<NonNullable<QuizAnswers["where"]>>[] = [
  { value: "home", label: "At home" },
  { value: "nearby", label: "Nearby outdoors" },
  { value: "anywhere", label: "Anywhere suitable" },
];
export const TIME_OPTIONS: Opt<NonNullable<QuizAnswers["time"]>>[] = [
  { value: "short", label: "Short (about 15 min)" },
  { value: "medium", label: "Medium (about 30 min)" },
  { value: "longer", label: "Longer is fine" },
];
export const SPEND_OPTIONS: Opt<NonNullable<QuizAnswers["spend"]>>[] = [
  { value: "none", label: "Nothing" },
  { value: "inexpensive", label: "Inexpensive (under $10)" },
  { value: "flexible", label: "Flexible" },
];
export const WALK_OPTIONS: Opt<Adventure["ownerMobility"]>[] = [
  { value: "seated", label: "I'd rather sit" },
  { value: "minimal-walking", label: "Very little walking" },
  { value: "short-walk", label: "A short walk" },
  { value: "long-walk", label: "Happy to walk further" },
];
export const CAR_OPTIONS: Opt<"yes" | "no">[] = [
  { value: "yes", label: "I have a car" },
  { value: "no", label: "No car" },
];

// ---------------------------------------------------------------- answers <-> save

type Loose<T> = { [K in keyof T]?: T[K] | undefined };

/** The quiz answers this save already holds (undefined fields are unanswered). */
export function answersFromSave(save: Save): QuizAnswers {
  const d = save.profile.data;
  const o = save.owner.data;
  const stages = d.lifeStages?.length ? d.lifeStages : d.lifeStage ? [d.lifeStage] : undefined;
  const keep: KeepItem[] = [...(d.keepInMind ?? [])];
  const add = (k: KeepItem, on: boolean) => {
    if (on && !keep.includes(k)) keep.push(k);
  };
  add("mobility", d.limitedMobility === true && !keep.includes("exercise"));
  add("food", d.foodActivities === "no");
  add("water", d.water === "avoids");
  add("noise", d.noiseSensitive === "yes");
  add("crowds", d.crowds === "nervous");
  add("dogs", d.dogs === "nervous");
  const out: Loose<QuizAnswers> = {
    names: d.name,
    lifeStages: stages,
    energy: d.energyVariable ? "variable" : d.energy,
    enjoy: d.enjoy,
    keepInMind: keep.length ? keep : undefined,
    where: o.where,
    time: o.time,
    spend: o.spend,
    walking: o.mobility,
    stepFree: o.stepFree,
    car: o.hasCar === "yes" || o.hasCar === "no" ? o.hasCar : undefined,
    quiet: o.quiet,
    kids: o.kids,
  };
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v !== undefined)) as QuizAnswers;
}

/** True when the save already answers this step, so the intro quiz does not ask it again. */
export function stepAnswered(id: StepId, save: Save): boolean {
  const d = save.profile.data;
  const o = save.owner.data;
  switch (id) {
    case "names":
      return !!d.name?.trim();
    case "life":
      return d.lifeStage !== undefined || !!d.lifeStages?.length;
    case "energy":
      return d.energy !== undefined || d.energyVariable !== undefined;
    case "enjoy":
      return !!d.enjoy?.length;
    case "keep":
      return (
        d.keepInMind !== undefined ||
        d.limitedMobility !== undefined ||
        d.foodActivities !== undefined ||
        d.water !== undefined ||
        d.noiseSensitive !== undefined ||
        d.crowds !== undefined ||
        d.dogs !== undefined
      );
    case "where":
      return o.where !== undefined;
    case "time":
      return o.time !== undefined;
    case "spend":
      return o.spend !== undefined;
    case "works":
      return o.mobility !== undefined || o.stepFree !== undefined || o.hasCar !== undefined;
    case "extra":
      return o.quiet !== undefined || o.kids !== undefined;
  }
}

/**
 * The steps to ask. First time through, steps the saved profile already answers are skipped; when editing answers
 * (`all`), every default step is shown with its saved value. `extras` adds the optional steps the visitor asked for.
 */
export function stepsToAsk(
  save: Save,
  opts: { all?: boolean; extras?: readonly StepId[] } = {},
): StepId[] {
  const base = DEFAULT_STEPS.filter((s) => opts.all || !stepAnswered(s, save));
  const extra = OPTIONAL_STEPS.filter((s) => opts.extras?.includes(s));
  return [...base, ...extra].slice(0, MAX_STEPS);
}

/** The profile and owner fields that the answers to the shown steps write. Steps that were not shown write nothing. */
export function applyAnswers(
  a: QuizAnswers,
  shown: readonly StepId[],
  save: Save,
): { dog: Loose<DogProfile>; owner: Loose<OwnerPrefs> } {
  const dog: Loose<DogProfile> = {};
  const owner: Loose<OwnerPrefs> = {};
  const has = (s: StepId) => shown.includes(s);
  const cur = save.profile.data;
  if (has("names")) dog.name = a.names?.trim().slice(0, 60) || undefined;
  if (has("life")) {
    const st = a.lifeStages ?? [];
    dog.lifeStages = st.length > 1 ? st : undefined; // several stages = mixed: every one must be suited
    dog.lifeStage = st.length === 1 ? st[0] : undefined;
  }
  if (has("energy")) {
    dog.energyVariable = a.energy === "variable" ? true : undefined;
    dog.energy = a.energy && a.energy !== "variable" ? a.energy : undefined;
  }
  if (has("enjoy"))
    dog.enjoy = a.enjoy?.length ? ENJOY.filter((e) => a.enjoy?.includes(e)) : undefined;
  if (has("keep")) {
    const k = a.keepInMind ?? [];
    dog.keepInMind = k.length ? k : undefined;
    // Cautious fields: a pick sets the restrictive value; un-picking only clears a restrictive value, never a "comfortable".
    const set = <K extends keyof DogProfile>(on: boolean, key: K, value: DogProfile[K]) => {
      if (on) dog[key] = value;
      else if (cur[key] === value) dog[key] = undefined;
    };
    set(k.includes("mobility") || k.includes("exercise"), "limitedMobility", true);
    set(k.includes("food"), "foodActivities", "no");
    set(k.includes("water"), "water", "avoids");
    set(k.includes("noise"), "noiseSensitive", "yes");
    set(k.includes("crowds"), "crowds", "nervous");
    set(k.includes("dogs"), "dogs", "nervous");
  }
  if (has("where")) owner.where = a.where;
  if (has("time")) owner.time = a.time;
  if (has("spend")) owner.spend = a.spend;
  if (has("works")) {
    owner.mobility = a.walking;
    owner.stepFree = a.stepFree ? true : undefined;
    owner.hasCar = a.car;
  }
  if (has("extra")) {
    owner.quiet = a.quiet ? true : undefined;
    owner.kids = a.kids ? true : undefined;
  }
  return { dog, owner };
}

/**
 * Today's filters from the owner's quiz answers, through the existing SessionFilters mechanism.
 * `relax` drops only the OPTIONAL preferences (where, time, spend, children joining). No car and quiet stay, and so does
 * every hard suitability rule in the engine (life stage, mobility, noise/crowd/dogs, food, water).
 */
export function starterFilters(owner: OwnerPrefs, opts: { relax?: boolean } = {}): SessionFilters {
  const f: SessionFilters = {};
  if (!opts.relax) {
    if (owner.where === "home") f.places = ["home"];
    if (owner.where === "nearby") {
      f.setting = "outdoor";
      f.transport = "none-or-walk";
    }
    if (owner.time === "short") f.minutes = 15;
    if (owner.time === "medium") f.minutes = 30;
    if (owner.spend === "none") f.budget = 0;
    if (owner.spend === "inexpensive") f.budget = 10;
  }
  if (owner.hasCar === "no") f.transport = "none-or-walk";
  if (owner.quiet) f.quiet = true;
  // Children joining is an optional preference: it narrows the list, and "widen" can set it aside. The engine still
  // prefers family-friendly adventures when it is set (see `score`). Hard suitability is never relaxed.
  if (owner.kids && !opts.relax) f.household = ["family"];
  return f;
}

// ---------------------------------------------------------------- context presets ("Starting from")

/** Preset key -> partial quiz answers. Safety answers are never preset. */
export type CtxPresets = Record<string, Partial<QuizAnswers>>;

/** Converts the Journal's preset answers (journal-context.ts) into quiz answers. "mixed" is never preset: it is the visitor's call. */
export function quizAnswersFromCtx(a: CtxAnswers): Partial<QuizAnswers> {
  const out: Partial<QuizAnswers> = {};
  if (a.lifeStage && a.lifeStage !== "mixed") out.lifeStages = [a.lifeStage];
  if (a.energy) out.energy = a.energy;
  if (a.enjoy) out.enjoy = [...a.enjoy];
  if (a.where) out.where = a.where;
  if (a.time) out.time = a.time;
  if (a.spend) out.spend = a.spend;
  if (a.owner)
    out.walking =
      a.owner === "seated"
        ? "seated"
        : a.owner === "easy-walking"
          ? "minimal-walking"
          : "long-walk";
  if (a.refine?.includes("quiet")) out.quiet = true;
  if (a.refine?.includes("kids")) out.kids = true;
  return out;
}

export const CTX_QUIZ_PRESETS: CtxPresets = Object.fromEntries(
  Object.entries(ctxPresets).map(([k, v]) => [k, quizAnswersFromCtx(v.answers)]),
);

export const ctxLabel = (key: string): string | undefined =>
  Object.hasOwn(ctxPresets, key) ? ctxPresets[key as CtxKey].label : undefined;

/** The preset for a `?ctx=` value: only known keys, only fields the save has not already answered, never a cautious answer. */
export function presetFor(
  key: string | null | undefined,
  save: Save,
  presets: CtxPresets = CTX_QUIZ_PRESETS,
): Partial<QuizAnswers> {
  if (!key || !Object.hasOwn(presets, key)) return {};
  const wanted = presets[key] ?? {};
  const saved = answersFromSave(save);
  const out: Partial<QuizAnswers> = {};
  for (const [k, v] of Object.entries(wanted)) {
    if (saved[k as keyof QuizAnswers] === undefined) (out as Record<string, unknown>)[k] = v;
  }
  delete out.keepInMind;
  return out;
}
