export interface PackProfile {
  car: boolean;
  rental: boolean;
  senior: boolean;
  bolter: boolean;
  noFence: boolean;
}
export type PackGroup =
  | "Car and safety"
  | "Sleep and comfort"
  | "Eat and drink"
  | "Keep them findable"
  | "Keep them contained"
  | "Health"
  | "Don't forget";

export interface PackItem {
  id: string;
  name: string;
  group: PackGroup;
  /** Plain description of what it is. */
  what: string;
  /** What it is for. */
  use: string;
  /** Ids from the gear guides; shown with a buy or maker button. Items without any are reminders only. */
  productIds: string[];
  /** A reason to pack it for this trip, or null when it is optional. */
  reason: (p: PackProfile) => string | null;
}

export const defaultProfile: PackProfile = {
  car: true,
  rental: true,
  senior: false,
  bolter: false,
  noFence: false,
};

export const packItems: PackItem[] = [
  {
    id: "car-restraint",
    name: "Car harness or crate",
    group: "Car and safety",
    what: "A harness that clips into the seat belt system, or a crate you can secure in the car.",
    use: "Keeps your dog restrained and you focused on the road.",
    productIds: ["sleepypod-clickit-sport", "sleepypod-atom", "lucky-duck-lucky-kennel"],
    reason: (p) =>
      p.car
        ? "You are driving: a properly fitted harness or a secured crate is the safer way to travel."
        : null,
  },
  {
    id: "seat-cover",
    name: "Back-seat cover or hammock",
    group: "Car and safety",
    what: "A washable cover that protects the back seat.",
    use: "Catches hair, mud and drool. It is not a restraint, so use it alongside a harness or crate.",
    productIds: ["petsafe-happy-ride-bench-seat-cover"],
    reason: (p) => (p.car ? "Protects the back seat on the drive." : null),
  },
  {
    id: "bed",
    name: "Travel bed",
    group: "Sleep and comfort",
    what: "A roll-up or foldable bed that smells like home.",
    use: "Gives your dog a place of their own in an unfamiliar room.",
    productIds: ["kurgo-loft-wander-dog-bed"],
    reason: (p) =>
      p.rental
        ? "A familiar bed helps your dog settle in a new rental."
        : p.senior
          ? "A familiar bed is worth packing for an older dog."
          : null,
  },
  {
    id: "throw",
    name: "Washable throw",
    group: "Sleep and comfort",
    what: "A washable blanket for furniture or the car.",
    use: "Only for furniture the host allows dogs on. Ask before you bring it.",
    productIds: [],
    reason: (p) => (p.rental ? "Only if the host allows dogs on furniture. Ask first." : null),
  },
  {
    id: "bowl",
    name: "Collapsible bowl",
    group: "Eat and drink",
    what: "A bowl that folds flat.",
    use: "Water and food on the road and at the rental.",
    productIds: ["kurgo-collaps-a-bowl"],
    reason: () => "Every trip needs a water bowl.",
  },
  {
    id: "bottle",
    name: "Travel water bottle",
    group: "Eat and drink",
    what: "A bottle with a built-in drinking trough.",
    use: "Water on rest stops and walks.",
    productIds: ["springland-22oz-original-travel-bottle", "springland-20oz-flip-travel-bottle"],
    reason: (p) => (p.car ? "Handy at rest stops on the drive." : null),
  },
  {
    id: "id-tag",
    name: "ID tag",
    group: "Keep them findable",
    what: "A collar tag with your phone number.",
    use: "The fastest way for a stranger to reach you if your dog slips out.",
    productIds: [],
    reason: () => "Make sure the number on it is one that will be answered on this trip.",
  },
  {
    id: "gps",
    name: "GPS tracker",
    group: "Keep them findable",
    what: "A tracker that clips to the collar.",
    use: "Shows where your dog is if they get out. Check its plan and coverage first.",
    productIds: ["tractive-dog-6", "fi-series-3-plus"],
    reason: (p) =>
      p.bolter ? "Your dog bolts: a tracker adds a second chance if a tag is not enough." : null,
  },
  {
    id: "fence",
    name: "Portable pen",
    group: "Keep them contained",
    what: "A freestanding play pen you can set up indoors or outside.",
    use: "A safe space when the rental has no fence. Ask the host before you set one up.",
    productIds: ["midwest-exercise-pen-with-door"],
    reason: (p) =>
      p.bolter || p.noFence
        ? "No fence, or a dog that slips out: a pen gives you a safe space."
        : null,
  },
  {
    id: "first-aid",
    name: "First aid kit",
    group: "Health",
    what: "A kit made for dogs.",
    use: "For minor cuts and problems until you reach a vet. It does not replace one.",
    productIds: ["amk-trail-dog"],
    reason: () => "Pack one on every trip.",
  },
  {
    id: "muzzle",
    name: "Muzzle",
    group: "Health",
    what: "A basket muzzle your dog is used to wearing.",
    use: "Some injured dogs snap. Ask your vet whether your dog should have one ready.",
    productIds: [],
    reason: () => null,
  },
  {
    id: "paperwork",
    name: "Vaccination and microchip records",
    group: "Don't forget",
    what: "Paper or phone copies.",
    use: "Needed at a vet in an emergency, and some places ask for them.",
    productIds: [],
    reason: () => "Keep a copy where you can reach it.",
  },
  {
    id: "meds-food",
    name: "Food, treats and any medicine",
    group: "Don't forget",
    what: "Their regular food, plus every medicine.",
    use: "A change in food can upset a dog's stomach on the road.",
    productIds: [],
    reason: () => "Pack a little extra in case of delays.",
  },
  {
    id: "leash-waste",
    name: "Leash and waste bags",
    group: "Don't forget",
    what: "A sturdy leash and more bags than you think.",
    use: "Every walk, every rest stop.",
    productIds: [],
    reason: () => "Pack a spare leash.",
  },
  {
    id: "towels",
    name: "Dog towels",
    group: "Don't forget",
    what: "Old towels you do not mind getting muddy.",
    use: "Wet and muddy paws before they reach the rental floor.",
    productIds: [],
    reason: (p) => (p.rental ? "Use dog-only towels, not the rental's." : null),
  },
];

export const groupsInOrder: PackGroup[] = [
  "Car and safety",
  "Sleep and comfort",
  "Eat and drink",
  "Keep them findable",
  "Keep them contained",
  "Health",
  "Don't forget",
];

export function recommended(p: PackProfile, items: PackItem[] = packItems) {
  return items.map((item) => ({ item, reason: item.reason(p) }));
}

export function packingText(packedIds: string[], items: PackItem[] = packItems) {
  const lines = items.filter((i) => packedIds.includes(i.id)).map((i) => `[x] ${i.name}`);
  const rest = items.filter((i) => !packedIds.includes(i.id)).map((i) => `[ ] ${i.name}`);
  return ["Dog travel packing list (pawsandpassage.com)", ...lines, ...rest].join("\n");
}
