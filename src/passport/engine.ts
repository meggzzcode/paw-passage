// Picks adventures with fixed rules (no AI, no network).
// Stage A is hard eligibility: it is never overridden by ranking, randomness, session filters or a wish for more results.
// Stage B ranks what is left with a deterministic, explainable score.
// Missing information is UNKNOWN, never "safe": where an unknown fact decides an adventure, it is HELD with a question.
import {
  ENJOY_LABELS,
  ENJOY_TYPES,
  type CustomCollection,
  type DogProfile,
  type OwnerPrefs,
  type Scope,
  type SessionFilters,
} from "./profile";
import type { ActivityType, Adventure } from "./schema";

export type Ctx = { dog: DogProfile; owner: OwnerPrefs; unlocked: boolean };
/** `eligible` = may be recommended now (no exclusion reason and nothing left to confirm). */
export type Verdict = { eligible: boolean; reasons: string[]; confirm: string[] };
export type History = {
  done: Set<string>;
  favorites: Set<string>;
  skipped: Set<string>;
  lastKeepsakeFamily?: string | undefined;
  feedback?: Record<string, "liked" | "not-for-us"> | undefined;
};
export type Ranked = { adventure: Adventure; score: number; why: string[] };
export type Held = { adventure: Adventure; confirm: string[] };
export type Result =
  | { ok: true; ranked: Ranked[]; held: Held[] }
  | { ok: false; reason: "none-eligible" | "filters-too-narrow"; relax: (keyof SessionFilters)[] };

const OWNER_MOBILITY_ORDER: Record<Adventure["ownerMobility"], number> = {
  seated: 0,
  "minimal-walking": 1,
  "short-walk": 2,
  "long-walk": 3,
};
const PREP_ORDER: Record<Adventure["prep"], number> = { none: 0, light: 1, some: 2 };

const Q = {
  size: "How big is your dog (small, medium or large)?",
  food: "Does your dog do food activities?",
  swim: "Does your dog swim?",
  car: "Do you have a car, and does your dog ride in one?",
  yard: "Do you have a yard?",
};

// ---------- Stage A: hard eligibility ----------

export function eligibility(a: Adventure, ctx: Ctx): Verdict {
  const { dog, owner } = ctx;
  const reasons: string[] = [];
  const confirm: string[] = [];
  const ask = (q: string) => {
    if (!confirm.includes(q)) confirm.push(q);
  };

  if (a.status !== "published") reasons.push("This adventure is not available yet.");
  if (a.access === "premium" && !ctx.unlocked)
    reasons.push("This adventure is part of the full Passport.");

  // A mixed household lists several stages: the adventure must suit every one of them (most conservative wins).
  const stages = [
    ...new Set([...(dog.lifeStages ?? []), ...(dog.lifeStage ? [dog.lifeStage] : [])]),
  ];
  const unsuited = stages.filter((st) => !a.lifeStages.includes(st));
  if (unsuited.length > 0)
    reasons.push(
      stages.length > 1
        ? "This one does not suit every age in your household."
        : `This one is not meant for a ${unsuited[0]}.`,
    );
  // "It varies" means gentle-to-moderate only, never the liveliest adventures.
  if (dog.energyVariable && (a.energy === "lively" || a.dogMobility === "high"))
    reasons.push("Your dog's energy varies, so we keep to gentle and moderate adventures.");

  if (a.sizes.length > 0) {
    if (dog.size === undefined) ask(Q.size);
    else if (!a.sizes.includes(dog.size))
      reasons.push(`This one is not meant for a ${dog.size} dog.`);
  }

  if (dog.limitedMobility && a.dogMobility !== "low")
    reasons.push("It asks for more movement than you said suits your dog.");

  if (
    owner.mobility !== undefined &&
    OWNER_MOBILITY_ORDER[a.ownerMobility] > OWNER_MOBILITY_ORDER[owner.mobility]
  )
    reasons.push("It asks for more walking than you wanted.");
  if (owner.stepFree && !a.stepFree) reasons.push("It may involve steps or uneven ground.");

  if (dog.crowds === "nervous" && a.crowd !== "none")
    reasons.push("Your dog is nervous in crowds.");
  if (dog.people === "nervous" && a.strangers)
    reasons.push("Your dog is nervous around unfamiliar people.");
  if (dog.dogs === "nervous" && a.otherDogs) reasons.push("Your dog is nervous around other dogs.");
  if (dog.noiseSensitive === "yes" && a.noise !== "quiet")
    reasons.push("Your dog is sensitive to noise.");

  const foodish = a.food || a.activityTypes.includes("food-and-treats");
  if (foodish) {
    if (dog.foodActivities === "no") reasons.push("Your dog does not do food activities.");
    else if (dog.foodActivities !== "yes") ask(Q.food);
  }

  if (a.water !== "none" && dog.water === "avoids")
    reasons.push("Your dog prefers to stay away from water.");
  if (a.water === "in-water") {
    if (dog.swims === "no") reasons.push("Your dog does not swim.");
    else if (dog.swims !== "yes") ask(Q.swim);
  }

  if (a.transport === "car") {
    if (owner.hasCar === "no") reasons.push("It needs a car and you do not have one.");
    else if (dog.carTravel === "no") reasons.push("Your dog does not ride in cars.");
    else if (owner.hasCar !== "yes" || dog.carTravel !== "yes") ask(Q.car);
  }

  if (dog.home !== undefined && !a.homes.includes(dog.home))
    reasons.push("It does not suit the kind of home you have.");
  if (a.space === "yard") {
    if (dog.home === "apartment" || dog.home === "house-no-yard" || dog.yard === "no")
      reasons.push("It needs a yard.");
    else if (dog.home !== "house-with-yard" && dog.yard !== "yes") ask(Q.yard);
  }

  // Reservation-needed adventures stay eligible; the reservation note is surfaced in the UI and in `why`.
  return { eligible: reasons.length === 0 && confirm.length === 0, reasons, confirm };
}

// ---------- Activity-specific confirmation ----------

export type ActivityConfirm = {
  /** One concise question about this adventure's single most relevant unknown. */
  question: string;
  field: "dogs" | "people" | "crowds" | "noiseSensitive";
};

/**
 * The ONE question to ask before an eligible adventure is revealed, when the profile does not say how the dog copes with
 * the thing this adventure involves (other dogs, new people, busy places, noise). Unknown is never treated as fine, so
 * a "not sure" answer means "pick another". Returns null when nothing relevant is unknown.
 */
export function activityConfirm(a: Adventure, dog: DogProfile): ActivityConfirm | null {
  const unknown = (v: string | undefined) => v === undefined || v === "unknown";
  if (a.otherDogs && unknown(dog.dogs))
    return {
      field: "dogs",
      question: "This one may meet other dogs. Is your dog comfortable with that?",
    };
  if (a.strangers && unknown(dog.people))
    return {
      field: "people",
      question: "This one may meet new people. Is your dog comfortable with that?",
    };
  if (a.crowd !== "none" && unknown(dog.crowds))
    return {
      field: "crowds",
      question: "This one can be busy. Is your dog comfortable in busy places?",
    };
  if (a.noise !== "quiet" && unknown(dog.noiseSensitive))
    return {
      field: "noiseSensitive",
      question: "This one can be noisy. Is your dog fine with some noise?",
    };
  return null;
}

// ---------- Session filters (soft) ----------

const FILTER_ORDER: (keyof SessionFilters)[] = [
  "minutes",
  "budget",
  "setting",
  "types",
  "energy",
  "prep",
  "haveSupplies",
  "transport",
  "places",
  "season",
  "weather",
  "foodFree",
  "quiet",
  "novelty",
  "favoritesOnly",
  "collection",
  "chair",
  "quick",
  "noYard",
  "puppy",
  "highEnergy",
  "household",
];

/** The filter fields this adventure fails. An empty or missing field means "no preference". */
function failing(
  a: Adventure,
  f: SessionFilters,
  h: Pick<History, "done" | "favorites">,
): (keyof SessionFilters)[] {
  const bad: (keyof SessionFilters)[] = [];
  if (f.minutes !== undefined && a.minutesMin > f.minutes) bad.push("minutes");
  if (f.budget !== undefined && a.costMin > f.budget) bad.push("budget");
  if (f.setting && a.setting !== "either" && a.setting !== f.setting) bad.push("setting");
  if (f.types?.length && !a.activityTypes.some((t) => f.types?.includes(t))) bad.push("types");
  if (f.energy?.length && !f.energy.includes(a.energy)) bad.push("energy");
  if (f.prep && PREP_ORDER[a.prep] > PREP_ORDER[f.prep]) bad.push("prep");
  if (f.haveSupplies?.length && !a.requires.every((r) => f.haveSupplies?.includes(r)))
    bad.push("haveSupplies");
  if (f.transport === "none-or-walk" && a.transport === "car") bad.push("transport");
  if (f.places?.length && !a.places.some((p) => f.places?.includes(p))) bad.push("places");
  if (f.season && a.seasons.length > 0 && !a.seasons.includes(f.season)) bad.push("season");
  if (f.weather && a.avoidWeather.includes(f.weather)) bad.push("weather");
  if (f.foodFree && a.food) bad.push("foodFree");
  if (f.quiet && a.noise !== "quiet") bad.push("quiet");
  if (f.novelty === "new-only" && h.done.has(a.id)) bad.push("novelty");
  if (f.novelty === "done-only" && !h.done.has(a.id)) bad.push("novelty");
  if (f.favoritesOnly && !h.favorites.has(a.id)) bad.push("favoritesOnly");
  if (f.collection && !a.collections.includes(f.collection)) bad.push("collection");
  if (f.chair && a.ownerMobility !== "seated") bad.push("chair");
  if (f.quick && a.minutesMax > 15) bad.push("quick");
  if (f.noYard && a.space === "yard") bad.push("noYard");
  if (f.puppy && !a.lifeStages.includes("puppy")) bad.push("puppy");
  if (f.highEnergy && a.energy !== "lively" && a.dogMobility !== "high") bad.push("highEnergy");
  if (f.household?.length && !f.household.some((x) => a.household.includes(x)))
    bad.push("household");
  return bad;
}

/** Every SessionFilters field combined with AND. Filters never override Stage A (rank/pickSurprise apply Stage A first). */
export function matchesFilters(
  a: Adventure,
  f: SessionFilters,
  h: Pick<History, "done" | "favorites">,
): boolean {
  return failing(a, f, h).length === 0;
}

// ---------- Stage B: ranking ----------

const TYPE_LOVE: Record<ActivityType, string> = {
  "play-and-games": "play and games",
  "food-and-treats": "treats and food games",
  "scent-and-discovery": "scent games",
  "problem-solving": "puzzles and problem-solving",
  "creative-projects": "creative projects",
  photography: "photo adventures",
  "outdoor-exploration": "outdoor exploring",
  travel: "travel",
  water: "water play",
  relaxation: "relaxing together",
  celebrations: "celebrations",
  "memory-making": "memory-making",
};

const PERSONALITY_TYPES: Record<
  NonNullable<DogProfile["personality"]>[number],
  { types: ActivityType[]; label: string }
> = {
  curious: { types: ["scent-and-discovery", "problem-solving"], label: "a curious dog" },
  playful: { types: ["play-and-games"], label: "a playful dog" },
  cozy: { types: ["relaxation", "memory-making"], label: "a cozy dog" },
  gentle: { types: ["relaxation", "creative-projects"], label: "a gentle dog" },
  adventurous: { types: ["outdoor-exploration", "travel"], label: "an adventurous dog" },
};

// Breed is a tiny soft hint ONLY: a small bonus for scent games for a short list of well-known scent-hound-type
// breeds. It is never a penalty and never touches eligibility. Keep this list short.
const SCENT_HOUND_WORDS = ["beagle", "basset", "bloodhound", "coonhound", "foxhound", "dachshund"];
const BREED_BONUS = 0.4;

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) h = Math.imul(h ^ str.charCodeAt(i), 16777619);
  return h >>> 0;
}
const jitter = (seed: string | undefined, id: string, amount: number) =>
  ((hash(`${seed ?? ""}|${id}`) % 1000) / 1000) * amount;

/**
 * True when we know nothing about how the dog copes (no life stage, and no answer on people, dogs, crowds or noise).
 * This only ever changes ranking. Hard eligibility still treats unknown as unknown, never as "safe".
 */
export function profileUnknown(dog: DogProfile): boolean {
  const unset = (v: string | undefined) => v === undefined || v === "unknown";
  return (
    dog.lifeStage === undefined &&
    !dog.lifeStages?.length &&
    unset(dog.people) &&
    unset(dog.dogs) &&
    unset(dog.crowds) &&
    unset(dog.noiseSensitive)
  );
}

export const GENTLE_START_NOTE = "Starting gentle until we know your dog";
const GENTLE_STEP = 1.2;
const GENTLE_NOTE_MIN = 6;

/** Soft bonus for the conservative traits of an adventure: 0 to 7 steps. */
function gentleSteps(a: Adventure): number {
  return [
    !a.strangers,
    !a.otherDogs,
    a.crowd === "none",
    a.noise === "quiet",
    a.minutesMax <= 30,
    a.setting === "indoor" || a.places.includes("home") || a.space === "yard",
    a.stepFree,
    a.energy === "gentle",
  ].filter(Boolean).length;
}

const money = (n: number) => `$${Number.isInteger(n) ? n : n.toFixed(2)}`;

function score(
  a: Adventure,
  ctx: Ctx,
  filters: SessionFilters,
  h: History,
  seed: string | undefined,
  jitterAmount: number,
): Ranked {
  const { dog, owner } = ctx;
  let s = 10;
  const notes: { w: number; text: string }[] = [];
  const note = (w: number, text: string) => {
    s += w;
    notes.push({ w, text });
  };

  const dogType = a.activityTypes.find((t) => dog.favoriteTypes?.includes(t));
  if (dogType) note(3, `Matches your dog's love of ${TYPE_LOVE[dogType]}`);
  const ownerType = a.activityTypes.find((t) => owner.preferredTypes?.includes(t));
  if (ownerType && !dogType) note(2, `Matches your taste for ${TYPE_LOVE[ownerType]}`);
  else if (ownerType) s += 1;

  // "What they enjoy" is a soft nudge only: it never rescues an adventure that failed Stage A.
  const enjoyed = (dog.enjoy ?? []).find((e) =>
    ENJOY_TYPES[e].some((t) => a.activityTypes.includes(t)),
  );
  if (enjoyed && !dogType) note(2.5, `Something they enjoy: ${ENJOY_LABELS[enjoyed]}`);
  else if (enjoyed) s += 1;

  if (h.favorites.has(a.id)) note(2, "One of your favorites");

  for (const p of dog.personality ?? []) {
    const m = PERSONALITY_TYPES[p];
    if (a.activityTypes.some((t) => m.types.includes(t))) note(1.5, `Suits ${m.label}`);
  }
  if (dog.energy && !dog.energyVariable && dog.energy === a.energy)
    note(1.5, `A ${a.energy} pace, like your dog`);

  const budget = filters.budget ?? owner.typicalBudget;
  if (budget !== undefined) {
    if (a.costMax <= budget)
      note(1, a.costMax === 0 ? "Free to do" : `Under your ${money(budget)} budget`);
    else if (a.costMin > budget) s -= 2;
  }
  if (owner.prep !== undefined && PREP_ORDER[a.prep] <= PREP_ORDER[owner.prep] && a.prep === "none")
    note(0.5, "No prep needed");
  if (owner.preferredPlaces?.some((p) => a.places.includes(p))) note(1, "Fits the places you like");
  if (
    a.requires.length > 0 &&
    owner.supplies &&
    a.requires.every((r) => owner.supplies?.includes(r))
  )
    note(1, "Uses things you already have");
  if (
    (dog.noiseSensitive === "yes" || filters.quiet) &&
    a.noise === "quiet" &&
    a.setting === "indoor"
  )
    note(1, "Quiet and indoors");
  if (filters.minutes !== undefined && a.minutesMax <= filters.minutes)
    note(0.5, `Done within ${filters.minutes} minutes`);
  if (profileUnknown(dog)) {
    const steps = gentleSteps(a);
    // Every adventure gets the bonus; only clearly gentle ones are labelled as such in `why`.
    if (steps >= GENTLE_NOTE_MIN) note(steps * GENTLE_STEP, GENTLE_START_NOTE);
    else s += steps * GENTLE_STEP;
  }
  if (a.reservation.needed) notes.push({ w: 0, text: "Needs a booking ahead" });

  const fb = h.feedback?.[a.id];
  if (fb === "liked") note(2, "You liked this one before");
  if (fb === "not-for-us") s -= 6;
  if (h.lastKeepsakeFamily && a.keepsake.family === h.lastKeepsakeFamily) s -= 1.5;
  if (h.skipped.has(a.id)) s -= 3;
  if (h.done.has(a.id)) s -= 2;

  const breed = dog.breed?.toLowerCase() ?? "";
  if (
    a.activityTypes.includes("scent-and-discovery") &&
    SCENT_HOUND_WORDS.some((w) => breed.includes(w))
  )
    s += BREED_BONUS;

  s += jitter(seed, a.id, jitterAmount);
  const why = notes
    .sort((x, y) => y.w - x.w)
    .map((n) => n.text)
    .slice(0, 3);
  return { adventure: a, score: s, why };
}

type Pool = { eligible: Adventure[]; held: Held[] };

function stageA(library: Adventure[], ctx: Ctx): Pool {
  const eligible: Adventure[] = [];
  const held: Held[] = [];
  for (const a of library) {
    const v = eligibility(a, ctx);
    if (v.reasons.length > 0) continue;
    if (v.confirm.length > 0) held.push({ adventure: a, confirm: v.confirm });
    else eligible.push(a);
  }
  return { eligible, held };
}

export function rank(
  library: Adventure[],
  ctx: Ctx,
  filters: SessionFilters,
  history: History,
  opts: { seed?: string; includeDone?: boolean } = {},
): Result {
  const pool = stageA(library, ctx);
  if (pool.eligible.length === 0 && pool.held.length === 0)
    return { ok: false, reason: "none-eligible", relax: [] };

  const showDone = opts.includeDone === true || filters.novelty === "done-only";
  const pass = (a: Adventure) =>
    matchesFilters(a, filters, history) && (showDone || !history.done.has(a.id));

  const ranked = pool.eligible
    .filter(pass)
    .map((a) => score(a, ctx, filters, history, opts.seed, 0.05))
    .sort((x, y) => y.score - x.score || x.adventure.id.localeCompare(y.adventure.id));
  const held = pool.held.filter((x) => pass(x.adventure));
  if (ranked.length > 0 || held.length > 0) return { ok: true, ranked, held };

  // Which session filters blocked, most blocking first. Stage A rules are never listed here.
  const counts = new Map<keyof SessionFilters, number>();
  for (const a of [...pool.eligible, ...pool.held.map((x) => x.adventure)]) {
    const bad = new Set(failing(a, filters, history));
    if (!showDone && history.done.has(a.id)) bad.add("novelty");
    for (const k of bad) counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const relax = [...counts.entries()]
    .sort((x, y) => y[1] - x[1] || FILTER_ORDER.indexOf(x[0]) - FILTER_ORDER.indexOf(y[0]))
    .map(([k]) => k);
  return { ok: false, reason: "filters-too-narrow", relax };
}

// ---------- Surprise and collections ----------

/** A saved smart collection, evaluated against today's profile. Held and ineligible adventures are not members. */
export function smartMembers(
  library: Adventure[],
  c: Extract<CustomCollection, { kind: "smart" }>,
  ctx: Ctx,
  history: History,
): Adventure[] {
  return stageA(library, ctx).eligible.filter((a) => matchesFilters(a, c.filters, history));
}

export function pickSurprise(
  library: Adventure[],
  scope: Scope,
  ctx: Ctx,
  filters: SessionFilters,
  history: History,
  custom: CustomCollection[],
  opts: { seed?: string; includeDone?: boolean } = {},
): Adventure | null {
  let inScope: (a: Adventure) => boolean;
  switch (scope.kind) {
    case "all":
    case "made-for-you":
      inScope = () => true;
      break;
    case "curated":
      inScope = (a) => a.collections.includes(scope.slug);
      break;
    case "favorites":
      inScope = (a) => history.favorites.has(a.id);
      break;
    case "done":
      inScope = (a) => history.done.has(a.id);
      break;
    case "custom": {
      const c = custom.find((x) => x.id === scope.id);
      if (!c) return null;
      if (c.kind === "handpicked") {
        const ids = new Set(c.ids);
        inScope = (a) => ids.has(a.id);
      } else {
        inScope = (a) => matchesFilters(a, c.filters, history);
      }
      break;
    }
  }
  const candidates = stageA(library, ctx).eligible.filter(
    (a) => inScope(a) && matchesFilters(a, filters, history) && !history.skipped.has(a.id),
  );
  const fresh = candidates.filter((a) => !history.done.has(a.id));
  const wantsDone = scope.kind === "done" || opts.includeDone === true;
  // Completed adventures are never drawn unless the customer asked for repeats (or the "done" scope).
  const pool = wantsDone ? candidates : fresh;
  if (pool.length === 0) return null;
  const amount = scope.kind === "made-for-you" ? 1.5 : 4;
  const best = pool
    .map((a) => score(a, ctx, filters, history, opts.seed, amount))
    .sort((x, y) => y.score - x.score || x.adventure.id.localeCompare(y.adventure.id))[0];
  return best ? best.adventure : null;
}

// ---------- Describing saved filters ----------

export const FILTER_LABELS: Record<keyof SessionFilters, string> = {
  minutes: "Time available",
  budget: "Budget",
  setting: "Indoors or outdoors",
  types: "Kind of adventure",
  energy: "Energy",
  prep: "Preparation",
  haveSupplies: "Things I have",
  transport: "Getting there",
  places: "Places",
  season: "Season",
  weather: "Weather",
  foodFree: "No food",
  quiet: "Quiet",
  novelty: "New or done",
  favoritesOnly: "Favorites only",
  collection: "Collection",
  chair: "From a chair",
  quick: "Quick",
  noYard: "No yard needed",
  puppy: "Puppy-friendly",
  highEnergy: "High energy",
  household: "Household",
};

const PREP_PHRASE: Record<Adventure["prep"], string> = {
  none: "No prep",
  light: "Light prep at most",
  some: "Some prep is fine",
};
const humanize = (s: string) => s.replace(/-/g, " ");

export function describeFilters(f: SessionFilters): string[] {
  const out: string[] = [];
  if (f.minutes !== undefined) out.push(`Fits in ${f.minutes} minutes`);
  if (f.budget !== undefined) out.push(f.budget === 0 ? "Free" : `Up to ${money(f.budget)}`);
  if (f.setting) out.push(f.setting === "indoor" ? "Indoors" : "Outdoors");
  if (f.types?.length) out.push(`Kinds: ${f.types.map((t) => TYPE_LOVE[t]).join(", ")}`);
  if (f.energy?.length) out.push(`Energy: ${f.energy.join(" or ")}`);
  if (f.prep) out.push(PREP_PHRASE[f.prep]);
  if (f.haveSupplies?.length)
    out.push(`Only things you have: ${f.haveSupplies.map(humanize).join(", ")}`);
  if (f.transport === "none-or-walk") out.push("No car needed");
  if (f.places?.length) out.push(`Places: ${f.places.map(humanize).join(", ")}`);
  if (f.season) out.push(`In ${f.season}`);
  if (f.weather) out.push(`Fine in the ${f.weather === "rain" ? "rain" : f.weather}`);
  if (f.foodFree) out.push("No food");
  if (f.quiet) out.push("Quiet");
  if (f.novelty === "new-only") out.push("Not done yet");
  if (f.novelty === "done-only") out.push("Already done");
  if (f.favoritesOnly) out.push("Favorites only");
  if (f.collection) out.push(`Collection: ${humanize(f.collection)}`);
  if (f.chair) out.push("From a chair");
  if (f.quick) out.push("Quick (15 min or less)");
  if (f.noYard) out.push("No yard needed");
  if (f.puppy) out.push("Puppy-friendly");
  if (f.highEnergy) out.push("High energy");
  if (f.household?.length)
    out.push(
      f.household.map((h) => (h === "two-dogs" ? "Two dogs" : "Family friendly")).join(" or "),
    );
  return out;
}
