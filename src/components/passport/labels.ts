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
  "then-and-now": "then-and-now",
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
