import { allGuides, isPublic } from "@/content/guides";
import type { Guide } from "@/content/types";

/** Reader-facing collections: one page per kind of dog, gathering existing guides. No new claims live here beyond plain questions to ask. */
export interface DogType {
  slug: string;
  name: string;
  tagline: string;
  seoTitle: string;
  seoDescription: string;
  intro: string;
  ask: string[];
  facts?: { text: string; to?: string }[];
  guideSlugs: string[];
}

export const dogTypes: DogType[] = [
  {
    slug: "escape-artists",
    name: "The escape artist",
    tagline: "Fences, gates and what to ask before you book.",
    seoTitle: "Rentals for Dogs That Bolt or Dig",
    seoDescription: "Guides for dogs that slip out or dig under: how to judge a fenced yard, what to ask the host, portable fences, ID tags and GPS trackers.",
    intro: "If your dog bolts through a door or finds the one gap in a fence, \"has a fenced yard\" is not enough. These guides cover what to ask the host, what a portable fence can and cannot do, and how to prepare if the worst happens.",
    ask: ["Is the fence around the whole yard, and how tall is it?", "Does the gate latch by itself, and can I see a photo of it?", "Are there gaps at the bottom, or soft ground a dog could dig under?", "Is there a second door or a porch between the dog and the street?"],
    guideSlugs: ["vacation-rental-secure-fenced-yard", "portable-dog-fence-and-playpen-guide-for-rentals", "dog-id-tags-and-gps-trackers-for-travel-guide", "can-you-leave-a-dog-alone-in-a-vacation-rental", "new-years-eve-with-a-dog-in-a-vacation-rental"],
  },
  {
    slug: "big-dogs",
    name: "The big dog",
    tagline: "Weight limits, fees and space.",
    seoTitle: "Vacation Rentals for Big Dogs",
    seoDescription: "Weight limits, extra fees and what to ask before booking a vacation rental with a large dog, with real policies from rental managers.",
    intro: "Weight and size limits are where large dogs get turned away. These guides show how to find rentals that accept big dogs, what the fees can look like, and how to travel with one safely.",
    ask: ["What is the weight or size limit, and is it per dog or combined?", "Is there a higher fee for a large dog?", "Which homes accept big dogs? It is often only some of them.", "Is there a fenced yard or room for a big crate?"],
    facts: [
      { text: "Weight limits we found on manager pages: Hearthside Cabin Rentals allows dogs up to 35 lb ($55 fee), with a $75 fee for larger dogs at some cabins; Brindley Beach says 60 lb each; AMI Locals sets a combined 50 lb for two dogs.", to: "/guides/how-many-dogs-can-you-bring-to-a-vacation-rental" },
    ],
    guideSlugs: ["vacation-rentals-that-welcome-large-dogs", "how-vacation-rental-pet-fees-work", "how-many-dogs-can-you-bring-to-a-vacation-rental", "dog-car-safety-harness-and-crate-guide", "pet-friendly-vacation-rental-checklist"],
  },
  {
    slug: "multi-dog-families",
    name: "The multi-dog family",
    tagline: "How many dogs are allowed, and what they cost.",
    seoTitle: "Vacation Rentals for Two or More Dogs",
    seoDescription: "How many dogs rentals allow, what extra dogs cost, and what to ask before you book with two or more dogs, with real manager policies.",
    intro: "Two dogs is the usual cap, but each manager and listing sets its own. These guides show what to expect, how fees stack up, and how to ask for a third dog.",
    ask: ["What is the dog limit for this exact home?", "Is the fee per dog, per night, or per stay?", "Is the second dog charged at a different rate?", "Can you confirm the total for my dates in writing?"],
    facts: [
      { text: "Of 38 manager pet pages we read, 22 state a limit of two, and 2 set it at three pets.", to: "/guides/how-many-dogs-can-you-bring-to-a-vacation-rental" },
    ],
    guideSlugs: ["how-many-dogs-can-you-bring-to-a-vacation-rental", "traveling-with-two-dogs-accommodation-guide", "how-vacation-rental-pet-fees-work", "portable-dog-fence-and-playpen-guide-for-rentals", "pet-friendly-vacation-rental-checklist"],
  },
  {
    slug: "senior-dogs",
    name: "The senior dog",
    tagline: "Comfort, stairs and being ready for a vet.",
    seoTitle: "Vacation Rentals With a Senior Dog",
    seoDescription: "What to ask a host and pack when traveling with an older dog: stairs, floors, emergency care, comfort gear and time alone in a rental.",
    intro: "Older dogs need a different kind of rental: fewer stairs, easy floors and a plan for emergencies. A full guide on senior dogs is in the works. In the meantime, these guides cover what applies.",
    ask: ["How many steps are there to the door, the bed and the yard?", "What are the floors like, and is there a rug that could slip?", "How far is the nearest emergency vet?", "Is there a spot outside close to the door?"],
    guideSlugs: ["dog-travel-first-aid-kit-guide", "dog-friendly-cabin-packing-list", "can-you-leave-a-dog-alone-in-a-vacation-rental", "dog-car-safety-harness-and-crate-guide", "dog-travel-water-and-feeding-gear-guide"],
  },
];

export const getDogType = (slug: string) => dogTypes.find((d) => d.slug === slug);

export function dogTypeGuides(d: DogType): Guide[] {
  return d.guideSlugs.map((s) => allGuides.find((g) => g.slug === s)).filter((g): g is Guide => !!g && isPublic(g));
}

/** A page is indexable only when it has something to show. */
export const dogTypeIsLive = (d: DogType) => dogTypeGuides(d).length >= 3;
