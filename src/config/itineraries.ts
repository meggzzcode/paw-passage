// Curated itineraries: short suggested combinations of EXISTING adventures. An itinerary holds ids only; titles,
// instructions and everything else come from the adventure records, so nothing is duplicated here. Free visitors see
// only the title, the teaser and the number of adventures. The teasers never name an adventure.
export type Itinerary = {
  slug: string;
  title: string;
  teaser: string;
  ids: readonly string[];
};

export const ITINERARIES: readonly Itinerary[] = [
  {
    slug: "rainy-saturday",
    title: "Rainy Saturday",
    teaser: "Four cozy things to do at home when the weather says stay in.",
    ids: ["adv-l7p4z1", "adv-q6v2s9", "adv-l5c8m3", "adv-n8u3j5"],
  },
  {
    slug: "weekend-doggy-date",
    title: "Weekend Doggy Date",
    teaser: "A little weekend of treating each other, from an evening stroll to a special meal.",
    ids: ["adv-k3d9v2", "adv-h5t4n7", "adv-nd9r2m", "adv-9v7c2z"],
  },
  {
    slug: "no-spend-weekend",
    title: "No-Spend Weekend",
    teaser: "A full weekend of adventures that cost nothing at all.",
    ids: ["adv-ejbg17", "adv-h4s7k2", "adv-4k3z8f", "adv-1d9m2q"],
  },
  {
    slug: "family-afternoon",
    title: "Family Afternoon",
    teaser: "Adventures the whole household can join, indoors and out.",
    ids: ["adv-q7r4j5", "adv-7h9t5j", "adv-z7c4v5", "adv-7f2m6r"],
  },
  {
    slug: "puppy-weekend",
    title: "Puppy Weekend",
    teaser: "Gentle, home-based firsts made for a young puppy.",
    ids: ["adv-5t8m2c", "adv-6c8k3d", "adv-or9d3m", "adv-r4w7fa"],
  },
  {
    slug: "gentle-senior-weekend",
    title: "Gentle Senior Weekend",
    teaser: "Slow, comfortable adventures for an older dog who has earned an easy weekend.",
    ids: ["adv-5g9x4p", "adv-6a3n7y", "adv-6k2e8u", "adv-6d9p2s"],
  },
];
