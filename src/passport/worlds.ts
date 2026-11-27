// Six "worlds" that group the curated collections for browsing. Presentation only: no new data, no counts of their own.
// Every collection slug appears in exactly one world (a test checks this against content/collections.yml). A collection
// that is not listed here (a future addition) still shows up, under "More collections", so nothing is ever hidden.
import type { CtxKey } from "./journal-context";

export type WorldId = "cozy" | "dates" | "outdoors" | "play" | "chapters" | "getaway";

export type World = {
  id: WorldId;
  /** Used in the address: /collections?world=<slug> */
  slug: string;
  title: string;
  /** One line for the directory. */
  blurb: string;
  /** A longer editorial intro for the world page. */
  intro: string;
  /** Existing site photo, shown decoratively (the title carries the meaning). */
  image: string;
  /** Existing accent token name (see collections.yml `accent`). */
  accent: "ink" | "poppy" | "ochre" | "sage" | "sky" | "plum";
  /** The free intro quiz starting point that fits this world best. */
  ctx: CtxKey;
  slugs: readonly string[];
};

export const WORLDS: readonly World[] = [
  {
    id: "cozy",
    slug: "cozy-days-in",
    title: "Cozy days in",
    blurb: "Rainy afternoons, small spaces and slow evenings at home.",
    intro:
      "Nothing to book and nowhere to be. These collections turn a living room, a hallway or a wet Sunday into something you will both remember.",
    image: "/journal/rainy-day-dog-activities.webp",
    accent: "sky",
    ctx: "rainy-day",
    slugs: [
      "rainy-day-club",
      "home-sweet-home",
      "apartment-adventures",
      "after-hours",
      "creative-companions",
      "adventures-without-spending",
    ],
  },
  {
    id: "dates",
    slug: "little-doggy-dates",
    title: "Little doggy dates",
    blurb: "An unhurried outing for two, with a theme and a treat.",
    intro:
      "A blanket, a morning and a little theme. Dates for you and your dog, from a snack-led stroll to a small splurge worth saving up for.",
    image: "/journal/doggy-date-ideas.webp",
    accent: "ochre",
    ctx: "doggy-date",
    slugs: ["doggy-date-club", "taste-and-treat", "little-splurges"],
  },
  {
    id: "outdoors",
    slug: "the-great-outdoors",
    title: "The great outdoors",
    blurb: "Fresh air, familiar streets and every season.",
    intro:
      "Trails, city blocks and the park you pass every day, seen again through your dog's nose. Let curiosity set the pace.",
    image: "/journal/things-to-do-with-your-dog-this-weekend.webp",
    accent: "sage",
    ctx: "weekend",
    slugs: ["the-great-outdoors", "city-explorers", "the-curious-explorer", "seasons-together"],
  },
  {
    id: "play",
    slug: "lets-play",
    title: "Let's play",
    blurb: "Games, energy and short bursts of fun.",
    intro: "Quick games and happy chaos for the dog who always wants one more round.",
    image: "/journal/activities-for-high-energy-dogs.webp",
    accent: "poppy",
    ctx: "high-energy",
    slugs: ["the-playful-pup", "five-minute-wonders"],
  },
  {
    id: "chapters",
    slug: "every-chapter",
    title: "Every chapter",
    blurb: "Puppyhood, the golden years, birthdays and the days in between.",
    intro:
      "Adventures shaped around where your dog is in life, plus the milestones and celebrations worth marking and a place to keep your story.",
    image: "/journal/puppy-bucket-list.webp",
    accent: "plum",
    ctx: "puppy",
    slugs: [
      "puppys-first-chapter",
      "the-golden-years",
      "rescue-and-new-beginnings",
      "the-gentle-soul",
      "birthday-and-gotcha-day",
      "holidays-and-celebrations",
      "our-story",
    ],
  },
  {
    id: "getaway",
    slug: "a-little-getaway",
    title: "A little getaway",
    blurb: "Road trips, campsites and days by the water.",
    intro: "Small escapes that travel well: a car, a cooler and a dog who is ready to go.",
    image: "/journal/free-things-to-do-with-your-dog.webp",
    accent: "ink",
    ctx: "weekend",
    slugs: ["road-trip-adventures", "camping-companions", "beach-days-and-waterside"],
  },
];

export const worldBySlug = (slug: string | undefined): World | undefined =>
  WORLDS.find((w) => w.slug === slug);

export const worldOf = (collectionSlug: string): World | undefined =>
  WORLDS.find((w) => w.slugs.includes(collectionSlug));

/** Practical shortcuts: each one is an existing collection, so nothing here is a new filter or a new count. */
export const SHORTCUT_COLLECTIONS: readonly { slug: string; label: string }[] = [
  { slug: "adventures-without-spending", label: "No spend" },
  { slug: "rainy-day-club", label: "Rainy day" },
  { slug: "five-minute-wonders", label: "Quick" },
  { slug: "home-sweet-home", label: "At home" },
];

/** A seasonal or occasion pick from existing collections, by calendar month (0 = January). */
export function seasonalPick(month: number): { slug: string; lead: string } {
  if (month === 10 || month === 11)
    return { slug: "holidays-and-celebrations", lead: "For the holidays" };
  if (month >= 5 && month <= 7) return { slug: "beach-days-and-waterside", lead: "For summer" };
  if (month >= 2 && month <= 4) return { slug: "the-great-outdoors", lead: "For spring" };
  if (month === 8 || month === 9) return { slug: "seasons-together", lead: "For autumn" };
  return { slug: "rainy-day-club", lead: "For a cold, wet day" };
}

/** The collection to feature at the top of the directory. */
export const FEATURED_SLUG = "home-sweet-home";

/** The one featured collection: this season's pick when the calendar has one, otherwise the evergreen starting point. */
export function featuredPick(month: number): { slug: string; lead: string } {
  if (month === 0 || month === 1) return { slug: FEATURED_SLUG, lead: "Start here" };
  return seasonalPick(month);
}
