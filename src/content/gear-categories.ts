// Categories for the /gear hub, decided in docs/GEAR-TAXONOMY.md: a category is the JOB a product does. Trips and dog
// types are "shop by" shortcuts in gear-hub.ts, not categories. Copy is descriptive only: no prices, ratings or "tested"
// claims, and no suitability claim the makers do not state. Which products belong to a category is set in
// content/products.yml (categories: the first entry is the primary category, an optional second is a cross-listing).
import type { GearCategorySlug } from "./products-schema";

export interface GearCategory {
  slug: GearCategorySlug;
  name: string;
  /** One line for tiles. */
  tagline: string;
  /** Two sentences at the top of the category page. */
  intro: string;
  /** Exactly three short bullets: who it suits, what to check before buying, what it does not do. */
  howToChoose: string[];
  /** Existing guides worth reading first (shown only if public). */
  guideSlugs?: string[];
  /** An existing /dogs/<slug> page for readers with this kind of dog. */
  dogTypeSlug?: string;
}

export const gearCategories: GearCategory[] = [
  {
    slug: "car-safety",
    name: "Car safety and restraints",
    tagline: "Harnesses, crash-tested crates, booster and barriers.",
    intro:
      "Restraints, crates, a booster seat and barriers for the drive. Crash-test wording is split on each card: what the maker says, and what a named independent tester says, if one is cited.",
    howToChoose: [
      "Suits a dog that rides in a car: harnesses and crates restrain or contain, a booster raises a small dog, a barrier keeps a dog in the back.",
      "Check the size chart or weight range the maker lists, and whether the page names an independent tester or only says crash tested.",
      "A barrier or a booster is not a crash-tested restraint on its own, and none of these pages promises a dog will be unharmed in a crash.",
    ],
    guideSlugs: ["dog-car-safety-harness-and-crate-guide", "two-large-dogs-in-one-car"],
    dogTypeSlug: "big-dogs",
  },
  {
    slug: "car-interior",
    name: "Seat covers and cargo liners",
    tagline: "Keep the seats and cargo area clean.",
    intro:
      "A bench-seat hammock, a seat cover and a cargo cover for keeping dog hair, mud and water off the car. Sizes are the dimensions the maker lists, so measure your seat or cargo area first.",
    howToChoose: [
      "Suits a car that carries a wet or muddy dog; pick by seat type (bench seat or cargo area) and vehicle size.",
      "Check the listed dimensions against your vehicle, and whether seat belts and latches stay reachable, as the makers describe.",
      "A cover or hammock is not a restraint, and it does not stop a dog moving around the car.",
    ],
    guideSlugs: ["protect-your-car-interior-from-a-dog-on-a-road-trip"],
  },
  {
    slug: "ramps-and-steps",
    name: "Ramps and steps",
    tagline: "Getting a dog into the car or up to the cabin.",
    intro:
      "Ramps and steps for a dog that should not or cannot jump into a vehicle. The makers do not describe these as senior or mobility products, so ask your vet whether a ramp or steps suit an older dog.",
    howToChoose: [
      "Suits a dog that is too big, too old or too sore to jump up; a ramp reaches a long way, steps and a hitch step are shorter.",
      "Check the maker's listed length or step heights against your vehicle, the weight the maker states it supports, and the ramp's own weight.",
      "None of these pages gives vehicle height guidance, and a ramp does not teach a dog to use it.",
    ],
    guideSlugs: ["dog-ramp-or-steps-for-the-car-and-cabin", "vacation-rental-with-a-senior-dog"],
    dogTypeSlug: "senior-dogs",
  },
  {
    slug: "feeding-and-hydration",
    name: "Bowls, bottles and food storage",
    tagline: "Eating and drinking on the road and in the rental.",
    intro:
      "Bowls, bottles and food containers for the road and the rental. Capacities are the sizes the maker lists, and some pages list none.",
    howToChoose: [
      "Suits a dog that eats and drinks away from home: collapsible bowls and bottles for the car and trail, bins and carriers for food.",
      "Check the capacity the maker lists, the material and how it is washed; some bowls are top-rack dishwasher safe only.",
      "A food bin is not a travel bowl and a bottle is not a full bowl, so most trips need one of each kind.",
    ],
    guideSlugs: ["dog-travel-bowls-and-food-storage"],
  },
  {
    slug: "pens-and-gates",
    name: "Pens, fences and gates",
    tagline: "Contain a dog in a rental with no fenced yard.",
    intro:
      "Exercise pens, a yard fence, a play yard, a doorway gate and a folding crate for containing a dog in a rental. Check the rental's own rules first: some hosts limit what you can set up.",
    howToChoose: [
      "Suits a stay with no fenced yard, or a dog that must be kept out of a room; pens and gates differ in whether they stand alone.",
      "Check the height and panel count the maker lists, how it sets up, and whether a pet gate is held by pressure or by hardware.",
      "None of these is a reliable barrier for a determined jumper or chewer, and the makers warn a dog that is not trained to a pen may try to escape.",
    ],
    guideSlugs: [
      "portable-dog-fence-and-playpen-guide-for-rentals",
      "vacation-rental-secure-fenced-yard",
      "can-you-leave-a-dog-alone-in-a-vacation-rental",
    ],
    dogTypeSlug: "escape-artists",
  },
  {
    slug: "comfort-and-cooling",
    name: "Beds, comfort and cooling",
    tagline: "A place to settle, and ways to stay cool.",
    intro:
      "A roll-up bed, a cooling pad, an evaporative cooling vest and a stuffable chew toy to keep a dog settled and comfortable away from home. Dimensions and materials come from the maker's page.",
    howToChoose: [
      "Suits a dog that needs its own spot in an unfamiliar place, or one that gets warm; match the size band the maker lists.",
      "Check the size by weight or girth, the care instructions, and the maker's warnings, such as keeping a gel pad out of sun and heat.",
      "The makers do not claim these prevent overheating, and a toy is not for unsupervised use or a determined chewer.",
    ],
    guideSlugs: ["keep-a-dog-cool-on-a-summer-trip", "dog-friendly-cabin-packing-list"],
  },
  {
    slug: "water-and-beach",
    name: "Life jackets and water safety",
    tagline: "For lakes, rivers and beaches.",
    intro:
      "Life jackets for a dog near water. Buoyancy wording is the maker's own: none of these pages names an independent test, so each card says what we could not confirm.",
    howToChoose: [
      "Suits a dog that will be on a boat, at a lake or near moving water; sizes are by girth, so measure the dog.",
      "Check the maker's size chart, the handle for lifting a dog out of the water, and the maker's own warnings about supervision.",
      "A life jacket is a flotation aid, not a promise a dog will stay safe, and it does not replace watching the dog.",
    ],
    guideSlugs: [
      "dog-life-jacket-for-lakes-and-beaches",
      "can-dogs-go-in-a-rental-pool-or-hot-tub",
    ],
  },
  {
    slug: "trail-and-hiking",
    name: "Trail and hiking gear",
    tagline: "Harness, boots and leash for the trail.",
    intro:
      "A harness, boots and a rope leash made by the maker for hiking and time outdoors. Sizing is by girth or paw width, so measure your dog and read the maker's size chart.",
    howToChoose: [
      "Suits a dog that hikes or walks rough ground; boots are sold as a set of two and front and rear paws may need different sizes.",
      "Check the girth or paw-width chart, and the maker's advice on fit, such as sizing down between sizes.",
      "None of these pages gives a strength rating or a weight guide, and the harness page makes no car or crash-test claim.",
    ],
    guideSlugs: ["dog-hiking-gear-for-a-cabin-vacation"],
  },
  {
    slug: "cold-weather",
    name: "Cold-weather gear",
    tagline: "Fleece, vest and snow boots.",
    intro:
      "A fleece, a vest with a built-in harness and snow boots for a winter trip. Warmth and traction wording is the maker's own, and none of these pages states a temperature rating.",
    howToChoose: [
      "Suits a dog on a winter trip that spends time outside; sizes are by chest girth or paw width.",
      "Check the size chart, whether you want a layer, a vest with a harness or boots, and the care instructions.",
      "No page states an insulation rating or a temperature range, so these do not tell you how cold is too cold.",
    ],
    guideSlugs: [
      "cold-weather-dog-gear-for-winter-cabin-trips",
      "christmas-week-in-a-cabin-with-a-dog",
    ],
  },
  {
    slug: "safety-id-first-aid",
    name: "ID, GPS and first aid",
    tagline: "Find a lost dog and handle a small injury.",
    intro:
      "GPS trackers, a clip-on safety light and a small first aid kit for a dog that gets loose or hurt on a trip. Subscription and coverage wording is the maker's own, and some pages state none.",
    howToChoose: [
      "Suits a dog that may bolt, travels to new places or goes out at night; trackers need a charged battery and an app.",
      "Check what the maker says about subscription, coverage and battery, and whether the page gives a dog size range.",
      "A tracker does not stop a dog getting loose, and a kit is for a small injury, not a substitute for a vet.",
    ],
    guideSlugs: [
      "if-your-dog-gets-loose-on-a-trip",
      "dog-travel-first-aid-kit-guide",
      "new-years-eve-with-a-dog-in-a-vacation-rental",
    ],
    dogTypeSlug: "escape-artists",
  },
  {
    slug: "rental-cleanup",
    name: "Rental cleanup and protection",
    tagline: "Towels, mats, pads and wipes.",
    intro:
      "A drying towel, a doormat, washable pads and wipes to keep floors and furniture clean in a rental. Check the host's rules: some do not allow dogs on furniture, with or without a cover.",
    howToChoose: [
      "Suits a stay where a muddy or wet dog could mark floors or furniture; pick by the size the maker lists.",
      "Check the listed dimensions, whether it can be machine washed, and whether the page states absorbency or a warranty.",
      "Protection is not a guarantee against a damage charge, and it does not replace the host's pet rules.",
    ],
    guideSlugs: [
      "airbnb-pet-damage-charge-after-checkout",
      "what-a-dog-really-costs-on-a-vacation-rental",
    ],
  },
];

/** Old category addresses and where each now points (docs/GEAR-TAXONOMY.md, "Old URL handling"). Used for redirects. */
export const legacyCategorySlugs: Record<string, GearCategorySlug> = {
  "road-trips": "car-safety",
  "cabin-vacations": "pens-and-gates",
  "beach-vacations": "water-and-beach",
  "senior-dogs": "ramps-and-steps",
  "large-dogs": "car-safety",
  "travel-safety": "safety-id-first-aid",
  "travel-comfort": "comfort-and-cooling",
  "winter-travel": "cold-weather",
  "outdoor-adventures": "trail-and-hiking",
  "cleaning-and-rental-protection": "rental-cleanup",
};

export function getGearCategory(slug: string): GearCategory | undefined {
  return gearCategories.find((c) => c.slug === slug);
}
