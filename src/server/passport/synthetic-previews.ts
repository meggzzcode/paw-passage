// SYNTHETIC teaser catalogue for Netlify branch deploys and deploy previews ONLY (see syntheticPreviewsEnabled).
// A preview deploy has no imported library, so without this the previews pages would be empty. These cards are
// invented sample teasers: generic titles, no mechanics, no real adventure content. They go through the SAME
// buildPreviewIndex allowlist projection as the real library, so an anonymous response carries public fields only.
// Never used in production, dev or an unknown context, and never a substitute for an authorized real import.
import type { Adventure } from "../../passport/schema";
import { PREVIEW_CONTEXTS, type DeployContext } from "./config";
import { buildPreviewIndex, type PreviewIndex } from "./previews";

/** True only for the Netlify preview contexts. Production, dev, undefined and anything unknown are false. */
export const syntheticPreviewsEnabled = (ctx: DeployContext): boolean =>
  typeof ctx === "string" && PREVIEW_CONTEXTS.includes(ctx);

/** Response header that marks a synthetic catalogue. The JSON shape is identical; the UI may ignore it. */
export const SYNTHETIC_HEADER = "x-pp-synthetic";

type Row = {
  slug: string; // collection slug
  title: string;
  teaser: string;
  type: Adventure["activityTypes"][number];
  mins: [number, number];
  cost: [number, number];
  setting: Adventure["setting"];
  energy: Adventure["energy"];
  owner: Adventure["ownerMobility"];
  role: Adventure["role"];
  family: Adventure["keepsake"]["family"];
  stages?: Adventure["lifeStages"];
  car?: boolean;
  food?: boolean;
  water?: Adventure["water"];
};

const ALL_STAGES: Adventure["lifeStages"] = ["puppy", "adult", "senior"];

// Six worlds, three sample teasers each. Teasers pass the same no-mechanics check as real ones.
const ROWS: Row[] = [
  // Cozy days in
  {
    slug: "rainy-day-club",
    title: "Sample: A rainy-day treat",
    teaser: "A sample teaser for a slow, snuggly afternoon indoors.",
    type: "relaxation",
    mins: [10, 20],
    cost: [0, 0],
    setting: "indoor",
    energy: "gentle",
    owner: "seated",
    role: "everyday",
    family: "certificate",
  },
  {
    slug: "home-sweet-home",
    title: "Sample: A cozy corner",
    teaser: "A sample teaser for a calm little moment at home.",
    type: "problem-solving",
    mins: [10, 25],
    cost: [0, 5],
    setting: "indoor",
    energy: "moderate",
    owner: "seated",
    role: "everyday",
    family: "trading-card",
  },
  {
    slug: "apartment-adventures",
    title: "Sample: A small-space surprise",
    teaser: "A sample teaser for a small home with big curiosity.",
    type: "play-and-games",
    mins: [10, 20],
    cost: [0, 0],
    setting: "indoor",
    energy: "moderate",
    owner: "seated",
    role: "everyday",
    family: "id-card",
  },
  // Little doggy dates
  {
    slug: "doggy-date-club",
    title: "Sample: A little doggy date",
    teaser: "A sample teaser for a themed outing for two.",
    type: "memory-making",
    mins: [30, 60],
    cost: [5, 15],
    setting: "either",
    energy: "gentle",
    owner: "minimal-walking",
    role: "lifestyle",
    family: "magazine-cover",
    food: true,
  },
  {
    slug: "taste-and-treat",
    title: "Sample: A tasty afternoon",
    teaser: "A sample teaser for a snack-themed afternoon together.",
    type: "food-and-treats",
    mins: [20, 40],
    cost: [5, 15],
    setting: "either",
    energy: "gentle",
    owner: "minimal-walking",
    role: "lifestyle",
    family: "seasonal-frame",
    food: true,
  },
  {
    slug: "little-splurges",
    title: "Sample: A little splurge",
    teaser: "A sample teaser for a small treat worth saving up for.",
    type: "celebrations",
    mins: [45, 90],
    cost: [20, 40],
    setting: "outdoor",
    energy: "moderate",
    owner: "short-walk",
    role: "aspirational",
    family: "travel-postcard",
    food: true,
  },
  // The great outdoors
  {
    slug: "the-great-outdoors",
    title: "Sample: A breezy walk",
    teaser: "A sample teaser for a fresh-air outing with room to sniff.",
    type: "outdoor-exploration",
    mins: [30, 60],
    cost: [0, 0],
    setting: "outdoor",
    energy: "moderate",
    owner: "short-walk",
    role: "everyday",
    family: "travel-postcard",
  },
  {
    slug: "city-explorers",
    title: "Sample: A city wander",
    teaser: "A sample teaser for a stroll through somewhere new.",
    type: "scent-and-discovery",
    mins: [30, 60],
    cost: [0, 10],
    setting: "outdoor",
    energy: "moderate",
    owner: "short-walk",
    role: "lifestyle",
    family: "id-card",
  },
  {
    slug: "seasons-together",
    title: "Sample: A seasonal outing",
    teaser: "A sample teaser for enjoying the weather together.",
    type: "photography",
    mins: [20, 45],
    cost: [0, 0],
    setting: "outdoor",
    energy: "gentle",
    owner: "minimal-walking",
    role: "lifestyle",
    family: "seasonal-frame",
  },
  // Let's play
  {
    slug: "the-playful-pup",
    title: "Sample: A playful moment",
    teaser: "A sample teaser for a burst of silly fun.",
    type: "play-and-games",
    mins: [10, 20],
    cost: [0, 0],
    setting: "either",
    energy: "lively",
    owner: "minimal-walking",
    role: "signature",
    family: "trading-card",
  },
  {
    slug: "five-minute-wonders",
    title: "Sample: A quick wonder",
    teaser: "A sample teaser for a very short, very happy break.",
    type: "play-and-games",
    mins: [5, 10],
    cost: [0, 0],
    setting: "indoor",
    energy: "moderate",
    owner: "seated",
    role: "everyday",
    family: "certificate",
  },
  {
    slug: "the-playful-pup",
    title: "Sample: A clever challenge",
    teaser: "A sample teaser for a gentle brain workout.",
    type: "problem-solving",
    mins: [10, 20],
    cost: [0, 5],
    setting: "indoor",
    energy: "gentle",
    owner: "seated",
    role: "everyday",
    family: "magazine-cover",
  },
  // Every chapter
  {
    slug: "puppys-first-chapter",
    title: "Sample: A puppy chapter",
    teaser: "A sample teaser for a little one's new experiences.",
    type: "scent-and-discovery",
    mins: [10, 25],
    cost: [0, 5],
    setting: "indoor",
    energy: "gentle",
    owner: "seated",
    role: "lifestyle",
    family: "id-card",
    stages: ["puppy"],
  },
  {
    slug: "the-golden-years",
    title: "Sample: A golden-years amble",
    teaser: "A sample teaser for an easygoing outing at a gentle pace.",
    type: "relaxation",
    mins: [15, 30],
    cost: [0, 0],
    setting: "either",
    energy: "gentle",
    owner: "minimal-walking",
    role: "lifestyle",
    family: "certificate",
    stages: ["senior", "adult"],
  },
  {
    slug: "birthday-and-gotcha-day",
    title: "Sample: A celebration day",
    teaser: "A sample teaser for marking a milestone together.",
    type: "celebrations",
    mins: [30, 60],
    cost: [5, 20],
    setting: "either",
    energy: "gentle",
    owner: "seated",
    role: "signature",
    family: "magazine-cover",
    food: true,
  },
  // A little getaway
  {
    slug: "road-trip-adventures",
    title: "Sample: A road-trip stop",
    teaser: "A sample teaser for a break in the journey.",
    type: "travel",
    mins: [20, 45],
    cost: [0, 10],
    setting: "outdoor",
    energy: "moderate",
    owner: "short-walk",
    role: "aspirational",
    family: "travel-postcard",
    car: true,
  },
  {
    slug: "camping-companions",
    title: "Sample: A campsite evening",
    teaser: "A sample teaser for a cozy evening under the sky.",
    type: "outdoor-exploration",
    mins: [45, 90],
    cost: [0, 20],
    setting: "outdoor",
    energy: "moderate",
    owner: "short-walk",
    role: "aspirational",
    family: "seasonal-frame",
    car: true,
  },
  {
    slug: "beach-days-and-waterside",
    title: "Sample: A waterside day",
    teaser: "A sample teaser for a day by the water.",
    type: "water",
    mins: [45, 90],
    cost: [0, 15],
    setting: "outdoor",
    energy: "lively",
    owner: "short-walk",
    role: "aspirational",
    family: "travel-postcard",
    car: true,
    water: "near-water",
  },
];

/** Structural defaults only; every text field is empty so a synthetic card can never carry steps or reveals. */
function card(r: Row, i: number): Adventure {
  const water = r.water ?? "none";
  return {
    schema: 2,
    id: `adv-pv${String(i + 1).padStart(3, "0")}`,
    title: r.title,
    teaser: r.teaser,
    previewTitle: r.title,
    clue: "",
    reveal: "",
    twist: "",
    objective: "",
    instructions: [],
    variations: [],
    completion: "",
    memoryPrompt: "",
    minutesMin: r.mins[0],
    minutesMax: r.mins[1],
    costMin: r.cost[0],
    costMax: r.cost[1],
    prep: "none",
    supplies: [],
    optionalSupplies: [],
    substitutes: [],
    personalities: [],
    requires: [],
    transport: r.car ? "car" : "none",
    reservation: { needed: false },
    setting: r.setting,
    homes: ["apartment", "house-no-yard", "house-with-yard"],
    space: "none",
    places: [],
    seasons: [],
    avoidWeather: [],
    lifeStages: r.stages ?? ALL_STAGES,
    sizes: [],
    energy: r.energy,
    dogMobility: "low",
    ownerMobility: r.owner,
    stepFree: r.owner === "seated",
    crowd: "none",
    strangers: false,
    otherDogs: false,
    noise: "quiet",
    food: !!r.food,
    water,
    safety: [],
    activityTypes: [r.type],
    collections: [r.slug],
    household: [],
    role: r.role,
    showcase: true,
    stamps: [],
    achievements: [],
    keepsake: { family: r.family, theme: "favorite-moments", headline: "SAMPLE" },
    access: "premium",
    status: "published",
    relatedGuides: [],
    affiliateProducts: [],
    research: [],
  };
}

/** The synthetic index, built through the real allowlist path. Pure, so tests and the handler share it. */
export function buildSyntheticPreviewIndex(): PreviewIndex {
  // total and collections stay 0: the sample catalogue must never feed a library size into the home or purchase pages.
  return { ...buildPreviewIndex(ROWS.map(card), []), total: 0, collections: 0 };
}
