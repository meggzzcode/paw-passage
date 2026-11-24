import type { TownRead } from "../town-reads";

const base: Pick<
  TownRead,
  | "state"
  | "status"
  | "approvedBy"
  | "approvedOn"
  | "author"
  | "publishedOn"
  | "lastReviewed"
  | "research"
> = {
  state: "california",
  status: "published",
  approvedBy: "Paws & Passage Editors",
  approvedOn: "2026-11-24",
  author: "Paws & Passage Editors",
  publishedOn: "2026-11-24",
  lastReviewed: "2026-11-24",
  research: { unverified: [], researchComplete: true },
};

const read = "2026-11-24";

const KURGO = "https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl";
const PICK =
  "{{pick:kurgo-collaps-a-bowl|Collapses under 1 in, holds 24 oz|Listed as top-rack dishwasher safe.|" +
  KURGO +
  "}}";
const kurgoSource = {
  title: "Collaps A Bowl",
  url: KURGO,
  publisher: "Kurgo",
  accessedOn: "2026-11-16",
};

export const californiaReads: TownRead[] = [
  {
    ...base,
    town: "san-diego",
    title: "What Can You Do With a Dog in San Diego?",
    seoTitle: "Dog-Friendly Things to Do in San Diego, CA",
    seoDescription:
      "San Diego's leash-free Dog Beach, Fiesta Island and Balboa Park areas, plus the hours dogs are barred from other beaches and Mission Bay.",
    dek: "Three official leash-free spots, and the daytime hours when dogs are not allowed on the city's other beaches.",
    relatedGuides: [
      "how-vacation-rental-pet-fees-work",
      "vacation-rentals-that-welcome-large-dogs",
    ],
    sources: [
      {
        title: "Approved leash-free locations",
        url: "https://sandiego.gov/park-and-recreation/parks/dogs/leashfree",
        publisher: "City of San Diego",
        accessedOn: read,
      },
      {
        title: "Dogs at beaches and Mission Bay",
        url: "https://sandiego.gov/park-and-recreation/parks/dogs/bchdog",
        publisher: "City of San Diego",
        accessedOn: read,
      },
      {
        title: "Beach amenities and regulations",
        url: "https://www.sandiego.gov/lifeguards/safety/bchreg",
        publisher: "City of San Diego Lifeguards",
        accessedOn: read,
      },
      {
        title: "Your dogs and city parks",
        url: "https://www.sandiego.gov/park-and-recreation/parks/dogs",
        publisher: "City of San Diego Parks",
        accessedOn: read,
      },
      {
        title: "California dog beaches, parks and recreation areas in San Diego",
        url: "https://sandiego.org/articles/pets/California-dog-beaches-parks-recreation-areas-in-san-diego.aspx",
        publisher: "San Diego Tourism Authority",
        accessedOn: read,
      },
      {
        title: "Dogs at the beach",
        url: "https://www.delmar.ca.us/FAQ.aspx?QID=96",
        publisher: "City of Del Mar",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `The best three things to do with a dog in San Diego are Dog Beach in Ocean Beach, Fiesta Island in Mission Bay, and the off-leash areas in Balboa Park. The rule to know: off leash only inside a posted area. Everywhere else, the city's other beaches and Mission Bay have hours when dogs are not allowed at all.

## Leash-free spots

The city's [leash-free list](https://sandiego.gov/park-and-recreation/parks/dogs/leashfree) shows Dog Beach at the foot of Voltaire Street, Ocean Beach, open 24 hours. It also lists Fiesta Island in Mission Bay Park, with a 5.2-mile asphalt path around the island, and two Balboa Park areas, Nate's Point and Morley Field, both listed as open 24 hours. Owners use these areas at their own risk and are responsible for their dogs.

Fiesta Island needs a closer read. The leash-free list gives hours of 6 a.m. to 10 p.m., while the [city's beach and bay page](https://sandiego.gov/park-and-recreation/parks/dogs/bchdog) says 4 a.m. to 10 p.m. That page also says two tern nesting sites are gated year-round, the buffer zones around them are closed April 15 through September 15, and dogs are barred from the Youth Aquatic Center. The island is leash-optional, shoreline included.

## Other beaches and Mission Bay

Outside the leash-free areas, the [City of San Diego Lifeguards](https://www.sandiego.gov/lifeguards/safety/bchreg) say dogs are not allowed on the beach, boardwalk or adjacent parks from 9 a.m. to 4 p.m. between Nov. 1 and Mar. 31, or from 9 a.m. to 6 p.m. between Apr. 1 and Oct. 31. At other hours they must be on a leash. The city's beach and bay page lists the winter start as Oct. 31, so check the date if you arrive at the changeover.

In city parks, including trails and canyons, the [city](https://www.sandiego.gov/park-and-recreation/parks/dogs) says the leash may not exceed 8 feet.

## Water

Water is the point of Dog Beach, but the pages we read state no water-quality or swim rules, so check lifeguard advice on the day. Carry fresh water for the dog and a bowl that packs flat. The [Kurgo](https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl) Collaps A Bowl holds 24 ounces and collapses under an inch, per the maker.

${PICK}

## Beyond the city line

The [San Diego Tourism Authority](https://sandiego.org/articles/pets/California-dog-beaches-parks-recreation-areas-in-san-diego.aspx) lists the Coronado North Beach Dog Run, on Ocean Boulevard near Sunset Park, as off leash around the clock, with dogs leashed until they reach the beach. Del Mar changes with the season, says the [City of Del Mar](https://www.delmar.ca.us/FAQ.aspx?QID=96). From the day after Labor Day to June 15, dogs may be off leash on North Beach under voice control. From June 16 to Labor Day they must be leashed except from dawn to 8 a.m. on North Beach, and no dogs are allowed on Main Beach at any time.

## Eating and rainy days

The sources we read give no dog rules for patios or indoor attractions in San Diego, so we do not list any. Ask each place before you go.

## Where to stay with a dog

San Diego rentals range from beach cottages to apartments, and pet terms differ. See the stays and notes on the [San Diego page](/destinations/california/san-diego). For fees, read [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work), and for big dogs, [vacation rentals that welcome large dogs](/guides/vacation-rentals-that-welcome-large-dogs).

Rules change. Check each linked page before you go.`,
  },
  {
    ...base,
    town: "santa-barbara",
    title: "What Can You Do With a Dog in Santa Barbara?",
    seoTitle: "Dog-Friendly Things to Do in Santa Barbara, CA",
    seoDescription:
      "Santa Barbara's off-leash Douglas Family Preserve, Arroyo Burro Beach, leashed bluff parks and Funk Zone tasting rooms, with each rule.",
    dek: "One off-leash preserve, one beach with mixed signals, and leashed parks and patios around town.",
    relatedGuides: ["pet-friendly-vacation-rental-checklist", "how-vacation-rental-pet-fees-work"],
    sources: [
      {
        title: "Douglas Family Preserve",
        url: "https://sbparksandrec.santabarbaraca.gov/park/douglas-family-preserve",
        publisher: "City of Santa Barbara",
        accessedOn: read,
      },
      {
        title: "Shoreline Park",
        url: "https://sbparksandrec.santabarbaraca.gov/parks/shoreline-park",
        publisher: "City of Santa Barbara",
        accessedOn: read,
      },
      {
        title: "Off-leash dog areas",
        url: "https://www.countyofsb.org/887/Off-Leash-Dog-Areas",
        publisher: "Santa Barbara County",
        accessedOn: read,
      },
      {
        title: "Arroyo Burro Beach",
        url: "https://santabarbaraca.com/businesses/arroyo-burro-beach/",
        publisher: "Visit Santa Barbara",
        accessedOn: read,
      },
      {
        title: "Dog friendly beaches in Santa Barbara",
        url: "https://santabarbaraca.com/plan-your-trip/know-before-you-go/pet-friendly-santa-barbara/",
        publisher: "Visit Santa Barbara",
        accessedOn: read,
      },
      {
        title: "Dog-friendly wineries in Santa Barbara",
        url: "https://santabarbaraca.com/itinerary/dog-friendly-wineries-in-santa-barbara/",
        publisher: "Visit Santa Barbara",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `For a dog in Santa Barbara, the three best stops are Douglas Family Preserve, Arroyo Burro Beach and a Funk Zone tasting room. The rule to carry: off leash is allowed in a few marked places only, and the official pages do not agree on exactly where, so bring the leash everywhere.

## Off-leash time

The [City of Santa Barbara](https://sbparksandrec.santabarbaraca.gov/park/douglas-family-preserve) says dogs are allowed off leash in certain areas of Douglas Family Preserve, if they stay under sight and voice control. Owners must carry a leash at all times and use it when needed. The preserve sits above the beach and has walking trails and a dog water fountain.

Next door, the [county's off-leash list](https://www.countyofsb.org/887/Off-Leash-Dog-Areas) includes Arroyo Burro Beach, but [Visit Santa Barbara](https://santabarbaraca.com/businesses/arroyo-burro-beach/) says dogs must always be leashed on the beach. Its [dog guide](https://santabarbaraca.com/plan-your-trip/know-before-you-go/pet-friendly-santa-barbara/) calls it the only beach in town that allows dogs off leash in select locations, and says dogs must be leashed elsewhere on the beach. Treat the beach as leashed unless a sign marks an off-leash stretch. The beach also has self-serve dog washing stations.

## Leashed walks

Dogs are on leash at Shoreline Park, according to the [city's park page](https://sbparksandrec.santabarbaraca.gov/parks/shoreline-park), which describes a park overlooking the beach and harbor with a stairway down to it. Visit Santa Barbara says leash required at Chase Palm Park, and that dogs of all sizes are allowed downtown on a leash.

## Water

The pages we read state no swim rules for dogs at Santa Barbara beaches, so go by posted signs, and keep the dog on the leash where you are not in a marked off-leash spot. Carry water and a bowl that folds flat. The [Kurgo](https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl) Collaps A Bowl holds 24 ounces and collapses under an inch, per the maker.

${PICK}

## Eating and sipping

Downtown, Visit Santa Barbara says dogs can join you on open-air dining patios. In the Funk Zone, its [winery page](https://santabarbaraca.com/itinerary/dog-friendly-wineries-in-santa-barbara/) gives different rules room by room. Kunin Wines, Whitcraft and The Valley Project require a leash. Margerum Wine Company and the Santa Barbara Wine Collective allow pets on the patio only. Pali Wine Co welcomes dogs indoors and out, but its Santa Barbara tasting room is under renovation, with tastings temporarily on Anacapa Street.

## A rainy day

The pages we read name no indoor dog attractions. Tasting rooms that allow dogs indoors, such as Pali Wine Co, are the likeliest wet-weather option, so check which room you are visiting.

## A simple day plan

Start at Douglas Family Preserve while the light is soft. Keep the leash in hand, since off leash there depends on sight and voice control. Then head to Shoreline Park or the Funk Zone for lunch, and pick tasting rooms that fit your dog's leash habits.

## Where to stay with a dog

Walk-to-the-beach listings may not be near a beach that welcomes dogs, so check which beach before you book. See the stays and notes on the [Santa Barbara page](/destinations/california/santa-barbara). Our [pet-friendly rental checklist](/guides/pet-friendly-vacation-rental-checklist) covers the questions to ask, and [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work) covers the cost.

Rules change. Check each linked page before you go.`,
  },
  {
    ...base,
    town: "monterey",
    title: "What Can You Do With a Dog Around Monterey, California?",
    seoTitle: "Dog-Friendly Things to Do in Monterey, CA",
    seoDescription:
      "Carmel Beach, Carmel River State Beach, the Fort Ord Dunes trail and Monterey's dog park for dogs, plus where state parks bar dogs.",
    dek: "Carmel Beach is the big off-leash draw. Most state land nearby is leash-only, and a few places bar dogs outright.",
    relatedGuides: ["pet-friendly-vacation-rental-checklist", "how-vacation-rental-pet-fees-work"],
    sources: [
      {
        title: "Carmel Beach rules",
        url: "https://ci.carmel.ca.us/post/beach-rules",
        publisher: "City of Carmel-by-the-Sea",
        accessedOn: read,
      },
      {
        title: "Animal services",
        url: "https://ci.carmel.ca.us/post/animal-services",
        publisher: "City of Carmel-by-the-Sea",
        accessedOn: read,
      },
      {
        title: "Dog friendly restaurants",
        url: "https://www.carmelcalifornia.com/dog_friendly-dog_friendly_restaurants_604.htm",
        publisher: "Carmel-by-the-Sea visitor site",
        accessedOn: read,
      },
      {
        title: "Carmel River State Beach",
        url: "https://www.parks.ca.gov/?page_id=567",
        publisher: "California State Parks",
        accessedOn: read,
      },
      {
        title: "Asilomar State Beach",
        url: "https://www.parks.ca.gov/?page_id=566",
        publisher: "California State Parks",
        accessedOn: read,
      },
      {
        title: "Fort Ord Dunes State Park",
        url: "https://www.parks.ca.gov/?page_id=580",
        publisher: "California State Parks",
        accessedOn: read,
      },
      {
        title: "Point Lobos State Natural Reserve",
        url: "https://www.parks.ca.gov/?page_id=571",
        publisher: "California State Parks",
        accessedOn: read,
      },
      {
        title: "Visiting state parks with your dog",
        url: "https://www.parks.ca.gov/Dogs",
        publisher: "California State Parks (dog rules)",
        accessedOn: read,
      },
      {
        title: "Dog park",
        url: "https://monterey.gov/your_city_hall/departments/parks_and_recreation/parks/dog_park.php",
        publisher: "City of Monterey",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `Around Monterey, the best three for a dog are Carmel Beach, Carmel River State Beach and the Monterey Dog Park. The main rule: Carmel Beach is the one big off-leash beach, and almost everywhere else on state land your dog stays on a leash of six feet or less. A few places bar dogs altogether.

## Beaches

Carmel Beach allows dogs without a leash if they stay under voice control, says the [City of Carmel-by-the-Sea](https://ci.carmel.ca.us/post/beach-rules). Leash your dog at the bottom of the stairways or sand ramps, and everywhere else in town, including the Scenic Pathway. The city's [animal services page](https://ci.carmel.ca.us/post/animal-services) sets the test for voice command: the dog stays within 25 feet of you and returns to within three feet on command.

At [Carmel River State Beach](https://www.parks.ca.gov/?page_id=567) dogs are allowed on a leash at all times. The page asks you to watch for late-winter and early-spring snowy plover resting areas and gives no dates, so read the signs. [Asilomar State Beach](https://www.parks.ca.gov/?page_id=566) allows leashed dogs on the beach, trails and conference grounds, but not in conference buildings. On our read date the park page said the beach and Coast Trail were closed for large swells and high tides, so check it before you go.

## Trails

[Fort Ord Dunes State Park](https://www.parks.ca.gov/?page_id=580) allows leashed dogs on the recreation trail that runs north and south. They are not allowed on the spur trails to the beach or on the beach, to protect bird habitat.

## Where dogs are not allowed

[Point Lobos](https://www.parks.ca.gov/?page_id=571) bars dogs anywhere in the reserve and says never to leave one in a parked vehicle. The state's [dog rules table](https://www.parks.ca.gov/Dogs) says dogs are not allowed beyond the day-use parking lot at Marina State Beach. It also lists Monterey State Historic Park as dogs allowed, but not inside park buildings.

## Water

We found no water or swim rules for dogs in the sources above beyond the beach rules already quoted. Bring fresh water and a bowl that folds flat. The [Kurgo](https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl) Collaps A Bowl holds 24 ounces and collapses under an inch, per the maker.

${PICK}

## Off-leash and eating

The city's [dog park](https://monterey.gov/your_city_hall/departments/parks_and_recreation/parks/dog_park.php) sits across from the El Estero Park Center and lake, open dawn to dusk, with separate areas for small and larger dogs. Carmel's visitor site says many [restaurants](https://www.carmelcalifornia.com/dog_friendly-dog_friendly_restaurants_604.htm) seat dogs on covered and open-air patios, and a few indoors. Each restaurant sets its own rule.

## Off-season

Plover seasons and closures change what is open. Asilomar's page listed a closure on our read date, so check the park page the morning you go.

## A simple day plan

Start at Carmel Beach, where your dog may be off leash under voice control, then leash up for the village patios. Use Carmel River State Beach or the Fort Ord Dunes trail for a leashed walk on state land. The dog park at El Estero is the easy stop when the dog still has energy.

## Where to stay with a dog

Cold water and sneaker waves make the surf line a poor place to be with a dog, whatever the rental says. See the stays and notes on the [Monterey page](/destinations/california/monterey). The [pet-friendly rental checklist](/guides/pet-friendly-vacation-rental-checklist) and [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work) cover the booking side.

Rules change. Check each linked page before you go.`,
  },
  {
    ...base,
    town: "mendocino",
    title: "What Can You Do With a Dog in Mendocino, California?",
    seoTitle: "Dog-Friendly Things to Do in Mendocino, CA",
    seoDescription:
      "Mendocino Headlands, Russian Gulch, Van Damme, Jug Handle and the Noyo Headlands Trail for dogs, with the state park trails that bar them.",
    dek: "The coast has leashed dogs on headlands and beaches, and state park trails inland that bar them. Here is where each rule applies.",
    relatedGuides: ["vacation-rental-secure-fenced-yard", "how-vacation-rental-pet-fees-work"],
    sources: [
      {
        title: "Visiting state parks with your dog",
        url: "https://www.parks.ca.gov/Dogs",
        publisher: "California State Parks (dog rules)",
        accessedOn: read,
      },
      {
        title: "Mendocino Headlands State Park",
        url: "https://www.parks.ca.gov/?page_id=442",
        publisher: "California State Parks",
        accessedOn: read,
      },
      {
        title: "Noyo Headlands Trail",
        url: "https://www.mendocinolandtrust.org/trails/noyo-headlands-trail/",
        publisher: "Mendocino Land Trust",
        accessedOn: read,
      },
      {
        title: "The world's dog-friendliest wine region",
        url: "https://avwines.com/blog/worlds-dog-friendliest-wine-region/",
        publisher: "Anderson Valley wine site",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `The three best things to do with a dog near Mendocino are the Mendocino Headlands, a beach day at Russian Gulch or Van Damme, and the Noyo Headlands Trail in Fort Bragg. The rule to know: the state's leash is six feet at most, and [California State Parks](https://www.parks.ca.gov/Dogs) says dogs are generally not allowed on trails unless a park opens them to dogs.

## Headlands and trails

The [state's dog table](https://www.parks.ca.gov/Dogs) lists Mendocino Headlands State Park as dogs allowed, with no restriction named. The [park page](https://www.parks.ca.gov/?page_id=442) also answers yes and says admission is free. Dogs are leashed at all times. The park page describes miles of trails along the cliffs. Unfenced edges are a real hazard, so keep the leash short near them.

North of town, the [Mendocino Land Trust](https://www.mendocinolandtrust.org/trails/noyo-headlands-trail/) says dogs on leash are welcome on the Noyo Headlands Trail in Fort Bragg, which has entrances near Glass Beach and north of the Noyo bridge.

## State parks, where each rule starts and stops

The same state table is specific about where the rules change:

- **Russian Gulch:** dogs allowed in the campground, on the beach and on trails west of Highway 1, not on Fern Canyon Trail or trails east of the highway.
- **Van Damme:** dogs allowed in the campground, on the beach and at Spring Ranch; not on Fern Canyon Trail, Old Logging Road Trail or Pygmy Forest Trail.
- **Jug Handle:** dogs allowed on the beach and headland trails west of Highway 1, not on the Staircase Trail or east of the highway.
- **MacKerricher:** dogs allowed in the park except at the Seal Rookery, Virgin Creek Beach, and Ten Mile Beach and Dunes.

## Water

The sources we read state no swim or tide rules for dogs on this coast. Keep your dog leashed near the cliff edges and back from the surf line. Bring fresh water and a bowl that folds flat. The [Kurgo](https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl) Collaps A Bowl holds 24 ounces and collapses under an inch, per the maker.

${PICK}

## Eating and sipping

A 2024 article on the [Anderson Valley wine site](https://avwines.com/blog/worlds-dog-friendliest-wine-region/) says Goldeneye in Philo has a dog-friendly patio and that Foursight in Boonville has water and treats for dogs. It states no leash or indoor rules, so ask each winery. 

## A rainy day

The pages we read name no indoor dog attractions on the coast, so we list none.

## A simple day plan

Walk the Headlands in the morning, take the dog to a beach at Russian Gulch or Van Damme in the afternoon, and save the Noyo Headlands Trail for a second day. The state's page says to check its table before bringing a dog to a state beach, because dogs are not permitted on most beaches.

## Where to stay with a dog

Some rural rentals have no fence at all, so ask before you book. See the stays and notes on the [Mendocino page](/destinations/california/mendocino). For fence checks, read [how to find a rental with a secure fenced yard](/guides/vacation-rental-secure-fenced-yard), and for fees, [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work).

Rules change. Check each linked page before you go.`,
  },
];
