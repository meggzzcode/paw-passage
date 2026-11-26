// Plain-words labels for the controlled lists, shared by the discovery screens.
import type { Adventure, ActivityType } from "@/passport/schema";

export const ACTIVITY_LABELS: Record<ActivityType, string> = {
  "play-and-games": "Play and games",
  "food-and-treats": "Food and treats",
  "scent-and-discovery": "Scent and discovery",
  "problem-solving": "Problem solving",
  "creative-projects": "Creative projects",
  photography: "Photography",
  "outdoor-exploration": "Outdoor exploring",
  travel: "Travel",
  water: "Water",
  relaxation: "Relaxation",
  celebrations: "Celebrations",
  "memory-making": "Memory making",
};
export const PLACE_LABELS: Record<Adventure["places"][number], string> = {
  home: "At home",
  city: "City",
  countryside: "Countryside",
  beach: "Beach",
  mountains: "Mountains",
  "road-trip": "Road trip",
};
export const SUPPLY_LABELS: Record<Adventure["requires"][number], string> = {
  toys: "Toys",
  treats: "Treats",
  blanket: "A blanket",
  "camera-phone": "Camera or phone",
  "paper-and-pens": "Paper and pens",
  "picnic-gear": "Picnic gear",
  "bake-ingredients": "Baking ingredients",
  towels: "Towels",
  "household-items": "Household items",
  "cardboard-boxes": "Cardboard boxes",
  "leash-and-harness": "Leash and harness",
  car: "A car",
};
export const FAMILY_LABELS: Record<Adventure["keepsake"]["family"], string> = {
  "travel-postcard": "travel postcard",
  "magazine-cover": "magazine cover",
  "id-card": "ID card",
  "trading-card": "trading card",
  certificate: "certificate",
  "seasonal-frame": "seasonal frame",
  "event-ticket": "event ticket",
  "then-and-now": "photo pair",
  collage: "collage",
  poster: "poster",
};
export const PREP_LABELS: Record<Adventure["prep"], string> = {
  none: "No prep",
  light: "Light prep",
  some: "Some prep",
};
export const OWNER_MOBILITY_LABELS: Record<Adventure["ownerMobility"], string> = {
  seated: "Seated",
  "minimal-walking": "Minimal walking",
  "short-walk": "Short walks",
  "long-walk": "Longer walks",
};
export const SEASON_LABELS: Record<Adventure["seasons"][number], string> = {
  spring: "Spring",
  summer: "Summer",
  autumn: "Autumn",
  winter: "Winter",
};

/** Derived quick-pick chips: every one is computed from fields the adventure already has. */
export const QUICK_PICKS = [
  "chair",
  "quick",
  "quiet",
  "noYard",
  "puppy",
  "highEnergy",
  "two-dogs",
  "family",
] as const;
export type QuickPick = (typeof QUICK_PICKS)[number];
export const QUICK_PICK_LABELS: Record<QuickPick, string> = {
  chair: "From a chair",
  quick: "Quick (15 min or less)",
  quiet: "Quiet",
  noYard: "No yard needed",
  puppy: "Puppy-friendly",
  highEnergy: "High energy",
  "two-dogs": "Two dogs",
  family: "Family friendly",
};

export const formatCost = (a: Adventure): string =>
  a.costMax === 0
    ? "Free"
    : a.costMin === a.costMax
      ? `$${a.costMax}`
      : `$${a.costMin}–$${a.costMax}`;
export const formatTime = (a: Adventure): string =>
  a.minutesMin === a.minutesMax ? `${a.minutesMin} min` : `${a.minutesMin}–${a.minutesMax} min`;
export const formatSetting = (a: Adventure): string =>
  a.setting === "either" ? "Indoors or out" : a.setting === "indoor" ? "Indoors" : "Outdoors";

const titleCase = (s: string) =>
  s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0]!.toUpperCase() + w.slice(1) : w))
    .join(" ");
/** e.g. "Toy Champion magazine cover" */
export const keepsakeName = (a: Adventure): string =>
  `${titleCase(a.keepsake.headline)} ${FAMILY_LABELS[a.keepsake.family]}`;

/** Important limits to know before you start; shown even on a mystery card. Never medical claims. */
export function suitabilityNotes(a: Adventure): string[] {
  const n: string[] = [];
  if (a.ownerMobility === "long-walk") n.push("Includes longer walking");
  else if (a.ownerMobility === "short-walk") n.push("Includes a short walk");
  if (!a.stepFree) n.push("Steps or uneven ground");
  if (a.water === "in-water") n.push("Dog may be in water");
  else if (a.water === "near-water") n.push("Near water");
  if (a.food) n.push("Involves food or treats");
  if (a.crowd === "busy") n.push("Busy places");
  else if (a.crowd === "some") n.push("Some people around");
  if (a.strangers) n.push("Meets unfamiliar people");
  if (a.otherDogs) n.push("Other dogs likely nearby");
  if (a.noise === "loud") n.push("Can be loud");
  if (a.avoidWeather.length > 0) n.push(`Not for ${a.avoidWeather.join(" or ")} days`);
  if (a.lifeStages.length < 3) n.push(`Suits ${a.lifeStages.join(" and ")} dogs`);
  return n;
}

/**
 * Up to four plain chips for a revealed card, chosen by relevance: things that may rule an adventure out
 * (a yard, other people or dogs) come first, then the reassuring ones. Everything else is under "More details".
 */
export function tagChips(a: Adventure): string[] {
  const out: string[] = [];
  if (a.space === "yard" || (a.homes.length === 1 && a.homes[0] === "house-with-yard"))
    out.push("Needs a yard");
  if (a.strangers || a.otherDogs) out.push("Meets people or dogs");
  if (a.ownerMobility === "seated") out.push("From a chair");
  if (a.noise === "quiet") out.push("Quiet");
  if (a.stepFree) out.push("No stairs");
  if (a.lifeStages.includes("puppy")) out.push("Puppy-friendly");
  if (a.lifeStages.includes("senior")) out.push("Senior-friendly");
  return out.slice(0, 4);
}

// ---------------------------------------------------------------- at a glance (cards and previews)

/** The facts a card shows at a glance. Both a full adventure and a public preview can be read as one. */
export type Glance = {
  minutesMin: number;
  minutesMax: number;
  costMin: number;
  costMax: number;
  setting: "indoor" | "outdoor" | "either";
  effort: "gentle" | "moderate" | "lively";
  needs: { car: boolean; booking: boolean; food: boolean; water: boolean };
  lifeStages: readonly ("puppy" | "adult" | "senior")[];
};

export const glanceOf = (a: Adventure): Glance => ({
  minutesMin: a.minutesMin,
  minutesMax: a.minutesMax,
  costMin: a.costMin,
  costMax: a.costMax,
  setting: a.setting,
  effort: a.energy,
  needs: {
    car: a.transport === "car" || a.requires.includes("car"),
    booking: a.reservation.needed,
    food: a.food,
    water: a.water !== "none",
  },
  lifeStages: a.lifeStages,
});

export const timeText = (g: Pick<Glance, "minutesMin" | "minutesMax">): string =>
  g.minutesMin === g.minutesMax ? `${g.minutesMin} min` : `${g.minutesMin}–${g.minutesMax} min`;
export const costText = (g: Pick<Glance, "costMin" | "costMax">): string =>
  g.costMax === 0
    ? "Free"
    : g.costMin === g.costMax
      ? `$${g.costMax}`
      : `$${g.costMin}–$${g.costMax}`;
export const settingText = (s: Glance["setting"]): string =>
  s === "either" ? "Indoors or out" : s === "indoor" ? "Indoors" : "Outdoors";

const DOG_EFFORT = { gentle: "Gentle", moderate: "Moderate", lively: "Lively" } as const;
const OWNER_AS_EFFORT: Record<Adventure["ownerMobility"], Glance["effort"]> = {
  seated: "gentle",
  "minimal-walking": "gentle",
  "short-walk": "moderate",
  "long-walk": "lively",
};

/**
 * One effort chip when the dog's effort and yours are alike, two when they differ ("Dog: Lively", "You: Seated").
 * A preview has no owner field, so it shows the one effort level.
 */
export function effortChips(
  g: Pick<Glance, "effort">,
  owner?: Adventure["ownerMobility"],
): string[] {
  if (!owner || OWNER_AS_EFFORT[owner] === g.effort) return [`${DOG_EFFORT[g.effort]} effort`];
  return [`Dog: ${DOG_EFFORT[g.effort]}`, `You: ${OWNER_MOBILITY_LABELS[owner]}`];
}

/** Public owner-effort badges for a preview, only when true: "From a chair" and "No stairs". */
export function ownerBadges(p: { ownerEffort?: string; stepFree?: boolean }): string[] {
  const out: string[] = [];
  if (p.ownerEffort === "seated") out.push("From a chair");
  if (p.stepFree === true) out.push("No stairs");
  return out;
}

/** Practical prerequisites that matter before choosing: food, booking and travel are always obvious. */
export function needChips(g: Pick<Glance, "needs">): string[] {
  const out: string[] = [];
  if (g.needs.car) out.push("Car needed");
  if (g.needs.booking) out.push("Booking needed");
  if (g.needs.food) out.push("Involves food or treats");
  if (g.needs.water) out.push("Near or in water");
  return out;
}

/** Positive labels, only when true of this adventure. `quiet` is known only for a full adventure. */
export function goodLabels(g: Glance, quiet?: boolean): string[] {
  const out: string[] = [];
  if (!g.needs.food) out.push("Food-free");
  if (g.costMax === 0) out.push("No additional spending");
  if (!g.needs.car) out.push("No car needed");
  if (g.effort === "gentle") out.push("Gentle");
  if (g.setting === "indoor") out.push("Indoor");
  if (g.lifeStages.includes("puppy")) out.push("Puppy-compatible");
  if (g.lifeStages.includes("senior")) out.push("Senior-friendly");
  if (quiet) out.push("Quiet");
  return out;
}
