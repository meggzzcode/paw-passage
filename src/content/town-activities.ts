// Dog-friendly things to do in or near each destination town. Every entry carries the rule as the linked page states it,
// the page it came from and the date we read it. Anything we could not read on a public page is left out
// (see docs/editorial/DESTINATION-ACTIVITIES.md). Rules change: the town page tells readers to check the linked page.
// Pure data, no imports from the app, so tests can load it directly.

export type ActivityKind = "trail" | "beach" | "park" | "water" | "patio" | "tasting-room" | "town";

export interface ActivitySource {
  publisher: string;
  url: string;
}

export interface TownActivity {
  name: string;
  /** One short line: what it is. */
  summary: string;
  /** The dog rule in plain words, as the linked page states it. Says so when the page states none. */
  dogNote: string;
  kind: ActivityKind;
  /** The page the dog rule comes from. */
  source: ActivitySource;
  /** A second page the entry also relies on (optional). */
  alsoSource?: ActivitySource;
  /** YYYY-MM-DD */
  checkedOn: string;
}

const D = "2026-11-24";

const BR_VISIT: ActivitySource = {
  publisher: "Blue Ridge Mountains visitor site",
  url: "https://www.blueridgemountains.com/blog/fido-friendly-blue-ridge/",
};
const GA_WINERIES: ActivitySource = {
  publisher: "Explore Georgia",
  url: "https://exploregeorgia.org/list/georgias-pet-friendly-wineries",
};
const GA_PARK_RULES: ActivitySource = {
  publisher: "Georgia State Parks",
  url: "https://gastateparks.org/DogWalking",
};
const GILMER_PETS: ActivitySource = {
  publisher: "Gilmer County Chamber",
  url: "https://www.gilmerchamber.com/blog/explore-the-ellijays/ellijay-georgia-a-pet-friendly-paradise/",
};
const DAH_PETS: ActivitySource = {
  publisher: "Dahlonega-Lumpkin County Visitors Bureau",
  url: "https://www.dahlonega.org/articles/post/exploring-dahlonega-with-your-pet-must-visit-spots-for-you-and-your-furry-friend",
};
const CA_STATE_DOGS: ActivitySource = {
  publisher: "California State Parks",
  url: "https://www.parks.ca.gov/Dogs",
};
const SB_PETS: ActivitySource = {
  publisher: "Visit Santa Barbara",
  url: "https://santabarbaraca.com/plan-your-trip/know-before-you-go/pet-friendly-santa-barbara/",
};

export const townActivities: Record<string, TownActivity[]> = {
  "georgia/blue-ridge": [
    {
      name: "Aska Adventure Area",
      summary: "Trails and waterfalls in the national forest near town.",
      dogNote: "Dogs stay on a leash here, per the visitor site.",
      kind: "trail",
      source: BR_VISIT,
      checkedOn: D,
    },
    {
      name: "Lake Blue Ridge, Morganton Point",
      summary: "A lakeside recreation area the visitor site suggests for dogs that like water.",
      dogNote:
        "The page states no rule for this site. The Forest Service says dogs in campgrounds must be on a leash and under control, and to use a leash in crowded areas. Read the posted signs on arrival.",
      kind: "water",
      source: BR_VISIT,
      alsoSource: {
        publisher: "U.S. Forest Service",
        url: "https://www.fs.usda.gov/r08/chattahoochee-oconee/safety-ethics/enjoy-outdoors",
      },
      checkedOn: D,
    },
    {
      name: "Toccoa River Park, McCaysville",
      summary: "A park in McCaysville with a fenced area for dogs.",
      dogNote: "The fenced dog area is leash-free, per the visitor site. The page gives no hours.",
      kind: "park",
      source: BR_VISIT,
      checkedOn: D,
    },
    {
      name: "Blue Ridge Adventure Dog",
      summary: "An outdoor dog park with beer, wine and snacks for the people.",
      dogNote:
        "Dogs are welcome in the outdoor park, per the visitor site. The page does not list entry rules or fees.",
      kind: "park",
      source: BR_VISIT,
      checkedOn: D,
    },
    {
      name: "Blue Ridge Private Dog Park",
      summary: "A fenced, wooded space you book by the hour.",
      dogNote: "Reserved by the hour, so the space is yours alone, per the visitor site.",
      kind: "park",
      source: BR_VISIT,
      checkedOn: D,
    },
    {
      name: "Toccoa Riverside Restaurant",
      summary: "A restaurant with a patio set aside for dogs.",
      dogNote: 'The visitor site lists a "Pooch Patio" and a canine menu. It states no leash rule.',
      kind: "patio",
      source: BR_VISIT,
      checkedOn: D,
    },
    {
      name: "Bear Claw Vineyards",
      summary: "A winery with a covered outdoor patio.",
      dogNote:
        "Explore Georgia says you can relax on the covered patio with your dog. It states no leash rule.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
  ],
  "georgia/ellijay": [
    {
      name: "Tumbling Waters Nature Trail, Carters Lake",
      summary: "A nature trail at Carters Lake, an Army Corps lake.",
      dogNote:
        "Keep your dog leashed and carry water and waste bags, per the chamber. The Corps requires pets in its campgrounds to be on a leash under six feet.",
      kind: "trail",
      source: GILMER_PETS,
      alsoSource: {
        publisher: "Recreation.gov",
        url: "https://www.recreation.gov/camping/campgrounds/10009939",
      },
      checkedOn: D,
    },
    {
      name: "Harrison Park and River Park",
      summary:
        "Town parks with walking trails and wooded areas; Harrison Park is a short walk from the Downtown Square.",
      dogNote:
        "The chamber calls both pet-friendly. The page states no leash rule, so bring a leash.",
      kind: "park",
      source: GILMER_PETS,
      checkedOn: D,
    },
    {
      name: "Bear Creek Trail",
      summary: "One of the pet-friendly hiking trails the chamber lists.",
      dogNote: "The page names it as pet-friendly and states no leash rule, so bring a leash.",
      kind: "trail",
      source: GILMER_PETS,
      checkedOn: D,
    },
    {
      name: "Roo Mountain Vineyards",
      summary: "A winery that welcomes dogs, with water stations and pet areas.",
      dogNote: "Explore Georgia says to bring a leashed, well-behaved dog.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
    {
      name: "Ott Vineyards and Winery",
      summary: "A winery with outdoor areas for visitors and dogs.",
      dogNote: "Leashed dogs are welcome in the outdoor areas, per Explore Georgia.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
    {
      name: "Engelheim Vineyards",
      summary: "A family winery that invites dogs to meet its own pets.",
      dogNote: "Dogs are welcome, per Explore Georgia. The page states no leash or indoor rule.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
  ],
  "georgia/helen": [
    {
      name: "Helen to Unicoi Trail",
      summary: "A moderate out-and-back trail from a city park in Helen to Unicoi State Park.",
      dogNote:
        "Dogs must be kept on a leash, per the Helen visitor site. At Unicoi State Park the leash may be six feet at most.",
      kind: "trail",
      source: {
        publisher: "Alpine Helen visitor site",
        url: "https://helenga.org/helen-to-unicoi-trail/",
      },
      alsoSource: {
        publisher: "Georgia State Parks",
        url: "https://gastateparks.org/TailsOnTrailsClub",
      },
      checkedOn: D,
    },
    {
      name: "Helen to Hardman Heritage Trail",
      summary: "A one-mile accessible trail along the Chattahoochee River; it closes at dusk.",
      dogNote:
        "The visitor site calls the trail pet friendly and states no leash rule, so keep a leash on.",
      kind: "trail",
      source: {
        publisher: "Alpine Helen visitor site",
        url: "https://helenga.org/helen-to-hardman-heritage-trail/",
      },
      checkedOn: D,
    },
    {
      name: "Smithgall Woods State Park",
      summary:
        "Hardwood forest, streams and hiking trails; all visitors register at the Visitor Center.",
      dogNote:
        "Georgia State Parks welcome leashed dogs on trails. A ParkPass fee applies to visit.",
      kind: "trail",
      source: GA_PARK_RULES,
      alsoSource: {
        publisher: "Georgia State Parks",
        url: "https://gastateparks.org/SmithgallWoods",
      },
      checkedOn: D,
    },
    {
      name: "Anna Ruby Falls",
      summary: "A paved trail to the falls in the national forest; admission is charged.",
      dogNote:
        "The visitor site calls the path dog-friendly. The Forest Service page states no pet rule, so keep your dog leashed and under control.",
      kind: "trail",
      source: {
        publisher: "Alpine Helen visitor site",
        url: "https://helenga.org/you-need-a-hike-starter-hikes-near-helen-ga-for-people-who-need-to-get-away/",
      },
      alsoSource: {
        publisher: "U.S. Forest Service",
        url: "https://www.fs.usda.gov/r08/chattahoochee-oconee/recreation/anna-ruby-falls-recreation-area",
      },
      checkedOn: D,
    },
    {
      name: "Cowboys & Angels",
      summary: "A restaurant and bar on Chattahoochee Street with an outdoor deck.",
      dogNote: 'The visitor site lists a "Pet Friendly Deck". It states no leash or indoor rule.',
      kind: "patio",
      source: {
        publisher: "Alpine Helen visitor site",
        url: "https://helenga.org/cowboys-angels-restaurant-bar/",
      },
      checkedOn: D,
    },
    {
      name: "Habersham Vineyards & Winery",
      summary: "A winery in the Helen area with an outdoor pavilion.",
      dogNote: "Leashed dogs are allowed outside and in the pavilion, per Explore Georgia.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
  ],
  "georgia/dahlonega": [
    {
      name: "Yahoola Creek Park",
      summary: "Walking paths and spots where dogs can wade in the creek.",
      dogNote:
        "The visitors bureau asks that you always keep your dog on a leash. That is its general rule for outdoor spots, not a posted park rule.",
      kind: "park",
      source: DAH_PETS,
      checkedOn: D,
    },
    {
      name: "Hancock Park",
      summary: "Open green space for fetch, with shade to rest in.",
      dogNote:
        "The visitors bureau asks that you always keep your dog on a leash (its general rule, not a posted park rule).",
      kind: "park",
      source: DAH_PETS,
      checkedOn: D,
    },
    {
      name: "Etowah River Trail",
      summary: "A wooded hike with river views.",
      dogNote:
        "The visitors bureau asks that you always keep your dog on a leash (its general rule, not a posted trail rule).",
      kind: "trail",
      source: DAH_PETS,
      checkedOn: D,
    },
    {
      name: "Historic downtown",
      summary: "The square, with outdoor restaurants and shops that welcome dogs.",
      dogNote:
        "The bureau says many outdoor restaurants and shops welcome pets. Each business sets its own rule, so ask before you sit down.",
      kind: "town",
      source: DAH_PETS,
      checkedOn: D,
    },
    {
      name: "Three Sisters Vineyards & Winery",
      summary: "A winery with a deck for visitors.",
      dogNote: "Well-behaved, leashed dogs can relax on the deck, per Explore Georgia.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
    {
      name: "Wolf Mountain Vineyards & Winery",
      summary: "A tasting room with lower-level patios.",
      dogNote: "Leashed dogs are welcome on the lower-level patios, per Explore Georgia.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
    {
      name: "Montaluce Winery & Restaurant",
      summary: "A winery and restaurant with outside tables.",
      dogNote:
        "Explore Georgia says you can sit with your dog at the outside tables. It states no leash rule.",
      kind: "tasting-room",
      source: GA_WINERIES,
      checkedOn: D,
    },
  ],
  "california/san-diego": [
    {
      name: "Dog Beach, Ocean Beach",
      summary: "The city's leash-free beach, at the foot of Voltaire Street.",
      dogNote:
        "Leash-free, listed as open 24 hours. Owners use it at their own risk and are responsible for their dogs; outside leash-free areas, dogs must be leashed in most city parks.",
      kind: "beach",
      source: {
        publisher: "City of San Diego",
        url: "https://sandiego.gov/park-and-recreation/parks/dogs/leashfree",
      },
      alsoSource: {
        publisher: "City of San Diego",
        url: "https://sandiego.gov/park-and-recreation/parks/dogs/bchdog",
      },
      checkedOn: D,
    },
    {
      name: "Fiesta Island, Mission Bay Park",
      summary: "A leash-optional island with a 5.2-mile path around it.",
      dogNote:
        "Leash-optional, shoreline included. Hours differ by city page: 4 a.m. to 10 p.m. on one, 6 a.m. to 10 p.m. on another. Two tern nesting sites are gated year-round, the buffer zones around them are closed April 15 through September 15, and dogs are barred from the Youth Aquatic Center.",
      kind: "park",
      source: {
        publisher: "City of San Diego",
        url: "https://sandiego.gov/park-and-recreation/parks/dogs/bchdog",
      },
      alsoSource: {
        publisher: "City of San Diego",
        url: "https://sandiego.gov/park-and-recreation/parks/dogs/leashfree",
      },
      checkedOn: D,
    },
    {
      name: "Other city beaches and Mission Bay",
      summary: "Leashed walks outside the no-dog hours.",
      dogNote:
        "Dogs are not allowed on the beach, boardwalk or adjacent parks from 9 a.m. to 4 p.m. between Nov. 1 and Mar. 31, or 9 a.m. to 6 p.m. between Apr. 1 and Oct. 31. At other hours they must be on a leash.",
      kind: "beach",
      source: {
        publisher: "City of San Diego Lifeguards",
        url: "https://www.sandiego.gov/lifeguards/safety/bchreg",
      },
      checkedOn: D,
    },
    {
      name: "Balboa Park, Nate's Point and Morley Field",
      summary: "Two off-leash areas in the city's big park.",
      dogNote:
        "Both are listed as off-leash, open 24 hours. Elsewhere in city parks, trails and canyons, dogs must be on a leash no longer than 8 feet.",
      kind: "park",
      source: {
        publisher: "City of San Diego",
        url: "https://sandiego.gov/park-and-recreation/parks/dogs/leashfree",
      },
      alsoSource: {
        publisher: "City of San Diego",
        url: "https://www.sandiego.gov/park-and-recreation/parks/dogs",
      },
      checkedOn: D,
    },
    {
      name: "Coronado North Beach Dog Run",
      summary: "An off-leash stretch of sand across the bay, on Ocean Boulevard near Sunset Park.",
      dogNote:
        "Listed as off-leash around the clock. Dogs must be leashed until they reach the beach.",
      kind: "beach",
      source: {
        publisher: "San Diego Tourism Authority",
        url: "https://sandiego.org/articles/pets/California-dog-beaches-parks-recreation-areas-in-san-diego.aspx",
      },
      checkedOn: D,
    },
    {
      name: "Del Mar dog beaches",
      summary: "Beach zones in Del Mar, north of the city, with rules that change by season.",
      dogNote:
        "Off-season (day after Labor Day through June 15), dogs may be off leash on North Beach under voice control. In summer (June 16 through Labor Day) dogs must be leashed except from dawn to 8 a.m. on North Beach, and no dogs are allowed on Main Beach at any time. The city lists South Beach as leashed all year.",
      kind: "beach",
      source: { publisher: "City of Del Mar", url: "https://www.delmar.ca.us/FAQ.aspx?QID=96" },
      checkedOn: D,
    },
  ],
  "california/santa-barbara": [
    {
      name: "Arroyo Burro Beach (Hendry's)",
      summary: "A county beach park with self-serve dog wash stations.",
      dogNote:
        "The county lists it among its off-leash dog areas. Visit Santa Barbara says dogs must always be leashed on the beach, and its dog guide says off-leash is allowed only in select spots. Follow the posted signs.",
      kind: "beach",
      source: {
        publisher: "Santa Barbara County",
        url: "https://www.countyofsb.org/887/Off-Leash-Dog-Areas",
      },
      alsoSource: {
        publisher: "Visit Santa Barbara",
        url: "https://santabarbaraca.com/businesses/arroyo-burro-beach/",
      },
      checkedOn: D,
    },
    {
      name: "Douglas Family Preserve",
      summary: "A preserve above Arroyo Burro Beach with walking trails and a dog water fountain.",
      dogNote:
        "Dogs may be off leash in certain areas if they stay under sight and voice control. Carry a leash and use it when needed.",
      kind: "park",
      source: {
        publisher: "City of Santa Barbara",
        url: "https://sbparksandrec.santabarbaraca.gov/park/douglas-family-preserve",
      },
      checkedOn: D,
    },
    {
      name: "Shoreline Park",
      summary: "A park overlooking the beach and harbor, with a stairway to the beach.",
      dogNote: "Dogs on leash, per the city's park page.",
      kind: "park",
      source: {
        publisher: "City of Santa Barbara",
        url: "https://sbparksandrec.santabarbaraca.gov/parks/shoreline-park",
      },
      checkedOn: D,
    },
    {
      name: "Chase Palm Park",
      summary: "A park the visitor bureau suggests for a stroll.",
      dogNote: "Leash required, per Visit Santa Barbara.",
      kind: "park",
      source: SB_PETS,
      checkedOn: D,
    },
    {
      name: "Funk Zone tasting rooms",
      summary: "A cluster of wine tasting rooms near the waterfront.",
      dogNote:
        "Rules vary by room. Kunin, Whitcraft and The Valley Project want dogs on a leash, and Margerum and the Santa Barbara Wine Collective allow dogs on the patio only.",
      kind: "tasting-room",
      source: {
        publisher: "Visit Santa Barbara",
        url: "https://santabarbaraca.com/itinerary/dog-friendly-wineries-in-santa-barbara/",
      },
      checkedOn: D,
    },
    {
      name: "Downtown patios",
      summary: "Open-air dining patios around downtown.",
      dogNote:
        "Dogs of all sizes are allowed downtown on a leash, and can join you on open-air dining patios, per Visit Santa Barbara.",
      kind: "patio",
      source: SB_PETS,
      checkedOn: D,
    },
  ],
  "california/monterey": [
    {
      name: "Carmel Beach",
      summary: "The village beach, reached by stairways and sand ramps.",
      dogNote:
        "Dogs may be off leash if they stay under voice control. The city's test: within 25 feet of you and back within three feet on command. Leash again at the stairways and elsewhere in town, including the Scenic Pathway.",
      kind: "beach",
      source: {
        publisher: "City of Carmel-by-the-Sea",
        url: "https://ci.carmel.ca.us/post/beach-rules",
      },
      alsoSource: {
        publisher: "City of Carmel-by-the-Sea",
        url: "https://ci.carmel.ca.us/post/animal-services",
      },
      checkedOn: D,
    },
    {
      name: "Carmel restaurant patios",
      summary: "Covered and open-air patios around the village.",
      dogNote:
        "The village visitor site says many restaurants seat dogs on patios, and a few indoors. Policies are set by each restaurant.",
      kind: "patio",
      source: {
        publisher: "Carmel-by-the-Sea visitor site",
        url: "https://www.carmelcalifornia.com/dog_friendly-dog_friendly_restaurants_604.htm",
      },
      checkedOn: D,
    },
    {
      name: "Carmel River State Beach",
      summary: "A state beach open 8 a.m. to sunset, with no campground.",
      dogNote:
        "Dogs allowed on leash at all times. Watch for seasonal snowy plover resting areas in late winter and early spring; the page gives no dates.",
      kind: "beach",
      source: { publisher: "California State Parks", url: "https://www.parks.ca.gov/?page_id=567" },
      checkedOn: D,
    },
    {
      name: "Asilomar State Beach, Pacific Grove",
      summary: "A state beach and coast trail open 8 a.m. to sunset.",
      dogNote:
        "Dogs on leash are allowed on the beach, trails and conference grounds, not in conference buildings. The park page currently lists the beach and Coast Trail as closed for large swells and high tides, so check it first.",
      kind: "beach",
      source: { publisher: "California State Parks", url: "https://www.parks.ca.gov/?page_id=566" },
      checkedOn: D,
    },
    {
      name: "Fort Ord Dunes State Park",
      summary: "A state park with a north-south recreation trail, open 8 a.m. to sunset.",
      dogNote:
        "Leashed dogs are allowed on the recreation trail that runs north and south. They are not allowed on the spur trails to the beach or on the beach, to protect bird habitat.",
      kind: "trail",
      source: { publisher: "California State Parks", url: "https://www.parks.ca.gov/?page_id=580" },
      checkedOn: D,
    },
    {
      name: "Monterey Dog Park, El Estero Park",
      summary: "An off-leash park across from the El Estero Park Center and lake.",
      dogNote:
        "Open dawn to dusk, with separate areas for small and larger dogs. Elsewhere in the city dogs must be on a leash no longer than six feet.",
      kind: "park",
      source: {
        publisher: "City of Monterey",
        url: "https://monterey.gov/your_city_hall/departments/parks_and_recreation/parks/dog_park.php",
      },
      checkedOn: D,
    },
    {
      name: "Monterey State Historic Park",
      summary: "A state historic park in downtown Monterey.",
      dogNote:
        "Dogs are allowed but not inside park buildings. The statewide leash limit is six feet.",
      kind: "park",
      source: CA_STATE_DOGS,
      checkedOn: D,
    },
  ],
  "california/mendocino": [
    {
      name: "Mendocino Headlands State Park",
      summary: "Cliff trails above the village; admission is free.",
      dogNote:
        "The state lists dogs as allowed and names no restriction here. Statewide, the leash is six feet at most.",
      kind: "trail",
      source: CA_STATE_DOGS,
      alsoSource: {
        publisher: "California State Parks",
        url: "https://www.parks.ca.gov/?page_id=442",
      },
      checkedOn: D,
    },
    {
      name: "Russian Gulch State Park",
      summary: "A coastal state park with a campground and beach.",
      dogNote:
        "Dogs allowed in the campground, on the beach and on trails west of Highway 1. Not allowed on Fern Canyon Trail or trails east of Highway 1.",
      kind: "trail",
      source: CA_STATE_DOGS,
      checkedOn: D,
    },
    {
      name: "Van Damme State Park",
      summary: "A state park with a beach and the Spring Ranch area.",
      dogNote:
        "Dogs allowed in the campground, on the beach and at Spring Ranch. Not allowed on Fern Canyon Trail, Old Logging Road Trail or Pygmy Forest Trail.",
      kind: "beach",
      source: CA_STATE_DOGS,
      checkedOn: D,
    },
    {
      name: "Jug Handle State Natural Reserve",
      summary: "Headland trails and a beach on the Mendocino coast.",
      dogNote:
        "Dogs allowed on the beach and headland trails west of Highway 1. Not allowed on the Staircase Trail or east of Highway 1.",
      kind: "trail",
      source: CA_STATE_DOGS,
      checkedOn: D,
    },
    {
      name: "MacKerricher State Park",
      summary: "A coastal state park.",
      dogNote:
        "Dogs are allowed in the park except at the Seal Rookery, Virgin Creek Beach, and Ten Mile Beach and Dunes.",
      kind: "beach",
      source: CA_STATE_DOGS,
      checkedOn: D,
    },
    {
      name: "Noyo Headlands Trail, Fort Bragg",
      summary: "A blufftop trail with entrances near Glass Beach and north of the Noyo bridge.",
      dogNote: "Dogs on leash are welcome, per the Mendocino Land Trust.",
      kind: "trail",
      source: {
        publisher: "Mendocino Land Trust",
        url: "https://www.mendocinolandtrust.org/trails/noyo-headlands-trail/",
      },
      checkedOn: D,
    },
    {
      name: "Anderson Valley wineries",
      summary: "Tasting rooms inland in Anderson Valley, such as Goldeneye in Philo.",
      dogNote:
        "A 2024 article from the valley's wine site says Goldeneye has a dog-friendly patio and others offer water and treats. It states no leash or indoor rules, so ask each winery.",
      kind: "tasting-room",
      source: {
        publisher: "Anderson Valley wine site",
        url: "https://avwines.com/blog/worlds-dog-friendliest-wine-region/",
      },
      checkedOn: D,
    },
  ],
};

export function getTownActivities(stateSlug: string, townSlug: string): TownActivity[] {
  return townActivities[`${stateSlug}/${townSlug}`] ?? [];
}
