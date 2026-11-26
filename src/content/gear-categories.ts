// Categories for the /gear hub: a category is the JOB a product does. Trips and dog
// types are "shop by" shortcuts in gear-hub.ts, not categories. Copy is descriptive only: no prices, ratings or "tested"
// claims, and no suitability claim the makers do not state. Which products belong to a category is set in
// content/products.yml (categories: the first entry is the primary category, an optional second is a cross-listing).
import type { GearCategorySlug } from "./products-schema";

export interface GearCategory {
  slug: GearCategorySlug;
  name: string;
  /** One line for tiles. */
  tagline: string;
  /** Page title (60 characters or fewer) and meta description (120-155) for the category page. */
  metaTitle: string;
  metaDescription: string;
  /** Two sentences at the top of the category page. */
  intro: string;
  /** Exactly three short bullets: who it suits, what to check before buying, what it does not do. */
  howToChoose: [string, string, string];
  /**
   * Two or three plain sentences with the distinctions that matter for safety. Only set on safety-critical categories
   * (restraints, ramps, pens): the page shows them above the products instead of leaving them in "How to choose".
   */
  safetyNote?: string;
  /** Existing guides worth reading first (shown only if public). */
  guideSlugs?: string[];
}

export const gearCategories: GearCategory[] = [
  {
    slug: "car-safety",
    name: "Car safety and restraints",
    tagline: "Harnesses, crash-tested crates, booster and barriers.",
    metaTitle: "Dog Car Safety Gear: Crates, Harness Advice and Barriers",
    metaDescription:
      "Dog car safety gear for road trips: harnesses, crash-tested crates, a booster and barriers, with what each maker says and what we could not confirm.",
    intro:
      "Keep your dog secure and settled for the drive, with harnesses, crates, a booster seat and a barrier. Each pick separates what the maker says about crash testing from what a named independent tester says, if one is cited.",
    safetyNote:
      "A harness or crate restrains or contains a dog, a booster raises a small dog, and a barrier only keeps a dog in the back. A barrier or booster is not a crash-tested restraint on its own, and nothing here promises a dog will be unharmed in a crash.",
    howToChoose: [
      "Harnesses and crates restrain or contain a dog, a booster raises a small one, and a barrier keeps a dog in the back.",
      "Check the size chart or weight range the maker lists, and whether the page names an independent tester or only says crash tested.",
      "A barrier or a booster is not a crash-tested restraint on its own, and none of these pages promises a dog will be unharmed in a crash.",
    ],
    guideSlugs: ["dog-car-safety-harness-and-crate-guide", "two-large-dogs-in-one-car"],
  },
  {
    slug: "car-interior",
    name: "Seat covers and cargo liners",
    tagline: "Keep the seats and cargo area clean.",
    metaTitle: "Dog Seat Covers and Cargo Liners for the Car",
    metaDescription:
      "Seat covers, bench hammocks and cargo liners that keep dog hair, mud and water off your car, with the sizes each maker lists and what they do not do.",
    intro:
      "Keep dog hair, mud and water off your car with a bench-seat hammock, a seat cover or a cargo cover. Sizes are the dimensions each maker lists, so measure your seat or cargo area first.",
    howToChoose: [
      "Best for a car that carries a wet or muddy dog. Pick by seat type (bench seat or cargo area) and vehicle size.",
      "Check the listed dimensions against your vehicle, and whether seat belts and latches stay reachable, as the makers describe.",
      "A cover or hammock is not a restraint, and it does not stop a dog moving around the car.",
    ],
    guideSlugs: ["protect-your-car-interior-from-a-dog-on-a-road-trip"],
  },
  {
    slug: "ramps-and-steps",
    name: "Ramps and steps",
    tagline: "Getting a dog into the car or up to the cabin.",
    metaTitle: "Dog Ramps and Steps for the Car and Cabin",
    metaDescription:
      "Dog ramps and steps for the car or a cabin door, with the lengths, step heights and weight limits makers list and what we could not confirm.",
    intro:
      "Help a dog get into the car or up to the cabin door without jumping. The makers do not sell these as senior or mobility products, so ask your vet whether a ramp or steps suit an older dog.",
    safetyNote:
      "A ramp reaches a long way, while steps and a hitch step are shorter, so compare the listed length or step heights with your vehicle and the weight the maker says it supports. None of these pages gives vehicle height guidance, and a ramp does not teach a dog to use it.",
    howToChoose: [
      "Best for a dog that is too big, too old or too sore to jump up. A ramp reaches a long way, steps and a hitch step are shorter.",
      "Check the maker's listed length or step heights against your vehicle, the weight it states it supports, and the ramp's own weight.",
      "None of these pages gives vehicle height guidance, and a ramp does not teach a dog to use it.",
    ],
    guideSlugs: ["dog-ramp-or-steps-for-the-car-and-cabin"],
  },
  {
    slug: "feeding-and-hydration",
    name: "Bowls, bottles and food storage",
    tagline: "Eating and drinking on the road and at the campsite or cabin.",
    metaTitle: "Dog Travel Bowls, Bottles and Food Storage",
    metaDescription:
      "Collapsible dog bowls, water bottles and food containers for the car, trail and cabin, with the capacities makers list and what we could not confirm.",
    intro:
      "Keep your dog fed and watered on the road and at the cabin, with collapsible bowls, bottles and food containers. Capacities are the sizes the maker lists, and some pages list none.",
    howToChoose: [
      "Collapsible bowls and bottles suit the car and trail, and bins and carriers suit food. Most trips need one of each kind.",
      "Check the capacity the maker lists, the material and how it is washed; some bowls are top-rack dishwasher safe only.",
      "A food bin is not a travel bowl and a bottle is not a full bowl.",
    ],
    guideSlugs: ["dog-travel-bowls-and-food-storage"],
  },
  {
    slug: "pens-and-gates",
    name: "Pens, fences and gates",
    tagline: "Contain a dog at a cabin or campsite with no fenced yard.",
    metaTitle: "Dog Pens, Fences and Gates for Trips",
    metaDescription:
      "Exercise pens, yard fences, doorway gates and folding crates for a stay with no fenced yard, with what each maker states and what we could not confirm.",
    intro:
      "Give your dog a safe space where there is no fenced yard, with exercise pens, a yard fence, a doorway gate or a folding crate. Check the rules of wherever you are staying first, since some places limit what you can set up.",
    safetyNote:
      "Pens and gates differ in whether they stand alone, and a pet gate is held either by pressure or by hardware. None of these is a reliable barrier for a determined jumper or chewer, and the makers warn that a dog not trained to a pen may try to escape.",
    howToChoose: [
      "Best for a stay with no fenced yard, or a dog that must stay out of a room. Pens and gates differ in whether they stand alone.",
      "Check the height and panel count the maker lists, how it sets up, and whether a pet gate is held by pressure or by hardware.",
      "None of these is a reliable barrier for a determined jumper or chewer, and the makers warn a dog that is not trained to a pen may try to escape.",
    ],
    guideSlugs: ["portable-dog-fence-and-playpen-guide-for-rentals"],
  },
  {
    slug: "comfort-and-cooling",
    name: "Beds, comfort and cooling",
    tagline: "A place to settle, and ways to stay cool.",
    metaTitle: "Dog Beds, Cooling Pads and Comfort Gear for Travel",
    metaDescription:
      "Roll-up beds, cooling pads, an evaporative vest and a stuffable chew toy for dogs away from home, with the sizes and warnings makers list on their pages.",
    intro:
      "Help your dog settle and stay comfortable away from home, with a roll-up bed, a cooling pad, an evaporative cooling vest and a stuffable chew toy. Dimensions and materials come from the maker's page.",
    howToChoose: [
      "Best for a dog that needs its own spot in an unfamiliar place, or one that gets warm. Match the size band the maker lists.",
      "Check the size by weight or girth, the care instructions, and the maker's warnings, such as keeping a gel pad out of sun and heat.",
      "The makers do not claim these prevent overheating, and a toy is not for unsupervised use or a determined chewer.",
    ],
    guideSlugs: ["keep-a-dog-cool-on-a-summer-trip", "dog-friendly-cabin-packing-list"],
  },
  {
    slug: "water-and-beach",
    name: "Life jackets and water safety",
    tagline: "For lakes, rivers and beaches.",
    metaTitle: "Dog Life Jackets and Water Safety Gear",
    metaDescription:
      "Dog life jackets and water gear for lakes, rivers and beaches, with the sizing, buoyancy and warnings each maker states and what we could not confirm.",
    intro:
      "Give your dog a flotation aid for the boat, the lake or the beach. Buoyancy wording is the maker's own, and none of these pages names an independent test.",
    howToChoose: [
      "Best for a dog that will be on a boat, at a lake or near moving water. Sizes are by girth, so measure the dog.",
      "Check the maker's size chart, the handle for lifting a dog out of the water, and the maker's own warnings about supervision.",
      "A life jacket is a flotation aid, not a promise a dog will stay safe, and it does not replace watching the dog.",
    ],
    guideSlugs: ["dog-life-jacket-for-lakes-and-beaches"],
  },
  {
    slug: "trail-and-hiking",
    name: "Trail and hiking gear",
    tagline: "Harness, boots and leash for the trail.",
    metaTitle: "Dog Trail and Hiking Gear: Harnesses, Boots, Leashes",
    metaDescription:
      "Dog hiking gear for the trail: harnesses, boots, leashes and trail supplies, with the sizes and specs each maker lists and what we could not confirm.",
    intro:
      "Get ready for trails and rough ground with a harness, boots and a rope leash made for time outdoors. Sizing is by girth or paw width, so measure your dog and read the maker's size chart.",
    howToChoose: [
      "Best for a dog that hikes or walks rough ground. Boots are sold as a set of two, and front and rear paws may need different sizes.",
      "Check the girth or paw-width chart, and the maker's advice on fit, such as sizing down between sizes.",
      "None of these pages gives a strength rating or a weight guide, and the harness page makes no car or crash-test claim.",
    ],
    guideSlugs: ["dog-hiking-gear-for-a-cabin-vacation"],
  },
  {
    slug: "cold-weather",
    name: "Cold-weather gear",
    tagline: "Fleece, vest and snow boots.",
    metaTitle: "Dog Cold-Weather Gear: Fleece, Vests and Snow Boots",
    metaDescription:
      "Fleece, vests and snow boots for dogs on winter cabin trips, with the sizing each maker lists and what we could not confirm about warmth or fit.",
    intro:
      "Keep your dog warm for a winter trip with a fleece, a vest with a built-in harness and snow boots. Warmth and traction wording is the maker's own, and none of these pages states a temperature rating.",
    howToChoose: [
      "Best for a dog that spends time outside on a winter trip. Sizes are by chest girth or paw width.",
      "Check the size chart, whether you want a layer, a vest with a harness or boots, and the care instructions.",
      "No page states an insulation rating or a temperature range, so these do not tell you how cold is too cold.",
    ],
    guideSlugs: ["cold-weather-dog-gear-for-winter-cabin-trips"],
  },
  {
    slug: "safety-id-first-aid",
    name: "ID, GPS and first aid",
    tagline: "Find a lost dog and handle a small injury.",
    metaTitle: "Dog ID Tags, GPS Trackers and First Aid Kits",
    metaDescription:
      "ID tags, GPS trackers and first aid kits for traveling with a dog, with what each maker states, any membership involved and what we could not confirm.",
    intro:
      "Be ready if your dog gets loose or hurt on a trip, with GPS trackers, a clip-on safety light and a small first aid kit. Subscription and coverage wording is the maker's own, and some pages state none.",
    howToChoose: [
      "Best for a dog that may bolt, travels to new places or goes out at night. Trackers need a charged battery and an app.",
      "Check what the maker says about subscription, coverage and battery, and whether the page gives a dog size range.",
      "A tracker does not stop a dog getting loose, and a kit is for a small injury, not a substitute for a vet.",
    ],
    guideSlugs: ["if-your-dog-gets-loose-on-a-trip", "dog-travel-first-aid-kit-guide"],
  },
  {
    slug: "cleanup-and-protection",
    name: "Cleanup and protection",
    tagline: "Towels, mats, pads and wipes.",
    metaTitle: "Dog Towels, Mats and Cleanup Gear",
    metaDescription:
      "Towels, doormats, pads and wipes to keep a car or cabin clean after a dog, with the sizes and care notes each maker lists and what we could not confirm.",
    intro:
      "Keep floors, seats and furniture clean after a muddy or wet adventure with a drying towel, a doormat, washable pads and wipes. Check the rules of wherever you are staying, since some do not allow dogs on furniture, with or without a cover.",
    howToChoose: [
      "Best for a stay where a muddy or wet dog could mark floors or furniture. Pick by the size the maker lists.",
      "Check the listed dimensions, whether it can be machine washed, and whether the page states absorbency or a warranty.",
      "Protection is not a guarantee against damage, and it does not replace the rules of wherever you are staying.",
    ],
  },
];

/** Old category addresses and where each now points. Used for redirects. */
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
  "cleaning-and-rental-protection": "cleanup-and-protection",
  "rental-cleanup": "cleanup-and-protection",
};

export function getGearCategory(slug: string): GearCategory | undefined {
  return gearCategories.find((c) => c.slug === slug);
}
