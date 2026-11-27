// The free intro quiz: its questions, how answers map onto the existing DogProfile / OwnerPrefs / SessionFilters, and
// which questions can be skipped. Pure functions, no network. The default path is FOUR short screens (life stage, energy,
// mood, anything to keep in mind); the optional "Make it more personal" fields add no screens.
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

/**
 * "What feels right today?": it maps onto the existing where / enjoy / quiet answers (no new engine field).
 * cozy = at home; outing = nearby outdoors (walkable, no car); playful = anywhere, leaning on games;
 * quiet = anywhere, noise-quiet adventures only; surprise = anywhere suitable.
 */
export type Mood = "cozy" | "outing" | "playful" | "quiet" | "surprise";

export type QuizAnswers = {
  names?: string;
  mood?: Mood;
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
  | "names"
  | "life"
  | "energy"
  | "mood"
  | "enjoy"
  | "keep"
  | "where"
  | "time"
  | "spend"
  | "works"
  | "extra";

/** The default path: four short screens. */
export const DEFAULT_STEPS: readonly StepId[] = ["life", "energy", "mood", "keep"];
/** The optional fields behind the single "Make it more personal (optional)" control. They are never extra screens. */
export const PERSONAL_STEPS: readonly StepId[] = ["names", "enjoy", "time", "spend", "works"];
export const OPTIONAL_STEPS: readonly StepId[] = PERSONAL_STEPS;
export const MAX_STEPS = 10;

export const STEP_QUESTION: Record<StepId, string> = {
  names: "Who's coming on the adventure?",
  life: "Who is your little sidekick?",
  energy: "What's their usual vibe?",
  mood: "What feels right today?",
  enjoy: "What do they enjoy?",
  keep: "Anything we should keep in mind?",
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
/** The life-stage screen offers one shared profile for several dogs: "mixed" lists every stage, the most cautious reading. */
export const MIXED_STAGES: LifeStage[] = ["puppy", "adult", "senior"];
export const LIFE_CHOICES: Opt<LifeStage | "mixed">[] = [
  { value: "puppy", label: "Puppy" },
  { value: "adult", label: "Adult" },
  { value: "senior", label: "Senior" },
  { value: "mixed", label: "A mix of ages" },
];
export const MOOD_OPTIONS: Opt<Mood>[] = [
  { value: "cozy", label: "A cozy day at home" },
  { value: "outing", label: "A little outing" },
  { value: "playful", label: "Something playful" },
  { value: "quiet", label: "Something quiet" },
  { value: "surprise", label: "Surprise us" },
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
/** The options the keep-in-mind screen shows. Each is its own distinct safety field; they are never merged into one flag. */
export const KEEP_OPTIONS: Opt<KeepItem>[] = [
  { value: "mobility", label: "Mobility limits" },
  { value: "food", label: "Food restrictions" },
  { value: "noise", label: "Noise" },
  { value: "crowds", label: "Crowds" },
  { value: "dogs", label: "Other dogs" },
  { value: "exercise", label: "Exercise or health limits" },
];
/** Children joining is an owner preference (not a dog safety field); it sits beside the dog options on the same screen. */
export const KIDS_OPTION: Opt<"kids"> = { value: "kids", label: "Children joining" };
/**
 * Exclusive answers: choosing one clears the specific picks. "Not sure" writes nothing (unknown, never safe).
 * "Nothing in particular" confirms none ONLY for the options shown above (see applyAnswers).
 */
export const KEEP_EXCLUSIVE: Opt<KeepItem>[] = [
  { value: "unsure", label: "Not sure" },
  { value: "none", label: "Nothing in particular" },
];
/** Saved answers the keep screen does not show (water, prefer-not-to-say) are kept untouched when the screen is saved. */
export const KEEP_HIDDEN: readonly KeepItem[] = ["water", "private"];
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

/** The mood a where/enjoy/quiet triple stands for (undefined when no where answer is held). */
export function moodOf(
  where: QuizAnswers["where"],
  enjoy: readonly Enjoy[] | undefined,
  quiet?: boolean,
): Mood | undefined {
  if (where === "home") return "cozy";
  if (where === "nearby") return "outing";
  if (where === "anywhere")
    return quiet ? "quiet" : enjoy?.includes("games") ? "playful" : "surprise";
  return undefined;
}

/** The `where` answer a mood writes. */
export const whereOfMood = (m: Mood): NonNullable<QuizAnswers["where"]> =>
  m === "cozy" ? "home" : m === "outing" ? "nearby" : "anywhere";

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
    mood: moodOf(o.where, d.enjoy, o.quiet),
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
    case "mood":
      return o.where !== undefined;
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
        d.dogs !== undefined ||
        o.kids !== undefined
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
  if (has("mood")) {
    // The mood maps onto the existing where / enjoy answers. "Playful" leans on games, never overriding other interests.
    const m = a.mood;
    owner.where = m ? whereOfMood(m) : undefined;
    // "Something quiet" is the existing noise-quiet filter. Moving off it clears only a quiet it set itself.
    const owned = moodOf(save.owner.data.where, cur.enjoy, save.owner.data.quiet) === "quiet";
    if (m === "quiet") owner.quiet = true;
    else if (owned && !has("extra")) owner.quiet = undefined;
    if (m === "playful" && !has("enjoy") && !(a.enjoy ?? cur.enjoy)?.includes("games"))
      dog.enjoy = ENJOY.filter((e) => e === "games" || (a.enjoy ?? cur.enjoy)?.includes(e));
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
    // "Nothing in particular" confirms none ONLY for the options the screen shows, and never overrides a cautious answer.
    // "Not sure" and "prefer not to say" write nothing: those fields stay unknown, never safe.
    if (k.includes("none")) {
      const unknown = (v: string | undefined) => v === undefined || v === "unknown";
      if (unknown(cur.noiseSensitive)) dog.noiseSensitive = "no";
      if (unknown(cur.crowds)) dog.crowds = "comfortable";
      if (unknown(cur.dogs)) dog.dogs = "comfortable";
      if (unknown(cur.foodActivities)) dog.foodActivities = "yes";
    }
    owner.kids = a.kids ? true : undefined;
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

/** The optional preferences a visitor can explicitly set aside, one at a time. Never a safety rule. */
export type RelaxKey = "where" | "time" | "spend" | "kids";
export const RELAX_KEYS: readonly RelaxKey[] = ["where", "time", "spend", "kids"];
/** `true` sets aside every optional preference; an array sets aside just those the visitor chose. */
export type Relax = boolean | readonly RelaxKey[];

/**
 * Today's filters from the owner's quiz answers, through the existing SessionFilters mechanism.
 * `relax` drops only the OPTIONAL preferences (where, time, spend, children joining). No car and quiet stay, and so does
 * every hard suitability rule in the engine (life stage, mobility, noise/crowd/dogs, food, water).
 */
export function starterFilters(owner: OwnerPrefs, opts: { relax?: Relax } = {}): SessionFilters {
  const f: SessionFilters = {};
  const drop = (k: RelaxKey) =>
    opts.relax === true || (Array.isArray(opts.relax) && opts.relax.includes(k));
  if (!drop("where")) {
    if (owner.where === "home") f.places = ["home"];
    if (owner.where === "nearby") {
      f.setting = "outdoor";
      f.transport = "none-or-walk";
    }
  }
  if (!drop("time")) {
    if (owner.time === "short") f.minutes = 15;
    if (owner.time === "medium") f.minutes = 30;
  }
  if (!drop("spend")) {
    if (owner.spend === "none") f.budget = 0;
    if (owner.spend === "inexpensive") f.budget = 10;
  }
  if (owner.hasCar === "no") f.transport = "none-or-walk";
  if (owner.quiet) f.quiet = true;
  // Children joining is an optional preference: it narrows the list, and "widen" can set it aside. The engine still
  // prefers family-friendly adventures when it is set (see `score`). Hard suitability is never relaxed.
  if (owner.kids && !drop("kids")) f.household = ["family"];
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
  if (a.where) {
    out.where = a.where;
    const m = moodOf(a.where, a.enjoy);
    if (m) out.mood = m;
  }
  if (a.mood) {
    out.mood = a.mood;
    out.where = whereOfMood(a.mood);
    if (a.mood === "quiet") out.quiet = true;
  }
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
