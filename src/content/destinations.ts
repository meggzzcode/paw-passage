import type { ImageKey } from "@/lib/images";

// Destination content. Keep descriptions factual; link to guides for detail.
export interface Town {
  slug: string;
  name: string;
  region: string;
  blurb: string;
  image: ImageKey;
  guides: string[]; // guide slugs
  planningNotes: string[];
}

export interface StateDest {
  slug: "georgia" | "california";
  name: string;
  headline: string;
  intro: string;
  image: ImageKey;
  focus: string;
  towns: Town[];
  guides: string[];
}

export const destinations: StateDest[] = [
  {
    slug: "georgia",
    name: "Georgia",
    headline: "North Georgia mountains, with room for the dog",
    intro:
      "The Blue Ridge foothills north of Atlanta are cabin country: wooded lots, long porches, creeks and national forest trails within an easy drive of the city. They are also hilly, which matters more than most listings admit when you need a yard your dog can't slip out of.",
    image: "guide-ga-cabins",
    focus: "Cabins with fenced yards",
    guides: [
      "vacation-rental-secure-fenced-yard",
      "dog-friendly-cabin-packing-list",
    ],
    towns: [
      {
        slug: "blue-ridge", name: "Blue Ridge", region: "Fannin County",
        blurb: "A mountain town with a walkable downtown, surrounded by cabin rentals and the Chattahoochee-Oconee National Forest.",
        image: "guide-ga-cabins",
        guides: ["vacation-rental-secure-fenced-yard"],
        planningNotes: [
          "Many cabins sit on steep lots, so ask how the yard is graded and whether the fence runs the full perimeter.",
          "Gravel mountain roads and long driveways often mean the gate matters as much as the fence.",
          "Save the nearest emergency vet before you arrive; mobile signal can be patchy in the hollows.",
        ],
      },
      {
        slug: "ellijay", name: "Ellijay", region: "Gilmer County",
        blurb: "Apple-orchard country with river valleys and quieter cabin rentals, a short drive from Blue Ridge.",
        image: "guide-fenced-yard",
        guides: ["vacation-rental-secure-fenced-yard"],
        planningNotes: [
          "Orchards and farms set their own pet rules, so check each one before you bring the dog along.",
          "Rural properties may border livestock or open land. Ask what sits on the other side of the fence.",
        ],
      },
      {
        slug: "helen", name: "Helen", region: "White County",
        blurb: "An Alpine-style village on the Chattahoochee River, busy on festival weekends and close to state parks.",
        image: "guide-atlanta-getaways",
        guides: ["pet-friendly-vacation-rental-checklist"],
        planningNotes: [
          "Festival crowds can be a lot for anxious dogs. Check the town calendar before you pick dates.",
          "Georgia State Parks set their own pet rules. Read the park's page before you go.",
        ],
      },
      {
        slug: "dahlonega", name: "Dahlonega", region: "Lumpkin County",
        blurb: "A historic gold-rush town with a courthouse square, wineries and forested hills on every side.",
        image: "guide-two-dogs",
        guides: ["how-many-dogs-can-you-bring-to-a-vacation-rental"],
        planningNotes: [
          "Wineries and tasting rooms vary a lot on dogs. Confirm before you go rather than at the door.",
          "Cabins outside town can be well off paved roads. Ask about the access road if your car sits low.",
        ],
      },
    ],
  },
  {
    slug: "california",
    name: "California",
    headline: "Coastal California, beach rules included",
    intro:
      "California's coast has some of the most dog-welcoming towns in the country. It also has some of the most specific beach rules: leash hours, seasonal closures for nesting birds, and beaches where dogs aren't allowed at all, sometimes right next to beaches where they are. We focus on the details that decide whether a beach stay actually works.",
    image: "guide-ca-beach",
    focus: "Pet-friendly beachfront stays",
    guides: [
      "how-vacation-rental-pet-fees-work",
      "vacation-rentals-that-welcome-large-dogs",
    ],
    towns: [
      {
        slug: "san-diego", name: "San Diego", region: "Southern California",
        blurb: "A big coastal city with designated dog beaches and plenty of rentals. The rules change from one beach to the next.",
        image: "guide-ca-beach",
        guides: ["pet-friendly-vacation-rental-checklist"],
        planningNotes: [
          "Check the city's current rules for the specific beach. Leash and time-of-day rules differ by beach.",
          "Summer sand and pavement can get hot enough to hurt paws. Plan walks for early or late in the day.",
        ],
      },
      {
        slug: "santa-barbara", name: "Santa Barbara", region: "Central Coast",
        blurb: "A Spanish-revival town between mountains and sea, with a few beaches where dogs are welcome.",
        image: "guide-ca-beach",
        guides: ["pet-friendly-vacation-rental-checklist"],
        planningNotes: [
          "A rental listed as \"walk to the beach\" may be near a beach where dogs aren't allowed. Check which beach.",
          "Bluff-top homes can have long stairways down to the sand. Ask, if your dog is older or very large.",
        ],
      },
      {
        slug: "monterey", name: "Monterey", region: "Monterey Bay",
        blurb: "Cool, foggy coastline around Monterey Bay, close to Carmel and Pacific Grove.",
        image: "guide-ca-beach",
        guides: ["pet-friendly-vacation-rental-checklist"],
        planningNotes: [
          "Cold water and sneaker waves are real on this stretch. Keep dogs well back from the surf line.",
          "Some state beaches limit dogs or close areas for nesting birds. Read the beach's own page.",
        ],
      },
      {
        slug: "mendocino", name: "Mendocino", region: "North Coast",
        blurb: "A village on headlands above the Pacific, with bluff trails, coves and quiet rural rentals.",
        image: "guide-ca-beach",
        guides: ["vacation-rental-secure-fenced-yard"],
        planningNotes: [
          "Unfenced bluff edges are a genuine hazard. Use a leash on headland trails.",
          "Rural properties may have no fence at all, so a long line can be worth packing.",
        ],
      },
    ],
  },
];

export function getState(slug: string) {
  return destinations.find((d) => d.slug === slug);
}
export function getTown(stateSlug: string, townSlug: string) {
  return getState(stateSlug)?.towns.find((t) => t.slug === townSlug);
}
export function townName(slug: string) {
  for (const d of destinations) for (const t of d.towns) if (t.slug === slug) return t.name;
  return slug;
}
