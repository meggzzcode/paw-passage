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
  state: "georgia",
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

export const georgiaReads: TownRead[] = [
  {
    ...base,
    town: "blue-ridge",
    title: "What Can You Do With a Dog in Blue Ridge, Georgia?",
    seoTitle: "Dog-Friendly Things to Do in Blue Ridge, GA",
    seoDescription:
      "Leashed forest trails, fenced dog parks and patios near Blue Ridge, Georgia, with the dog rule for each and the page it came from.",
    dek: "Trails, a lake, three fenced dog areas and a few patios, each with the rule the source page gives.",
    relatedGuides: [
      "vacation-rentals-that-welcome-large-dogs",
      "how-vacation-rental-pet-fees-work",
    ],
    sources: [
      {
        title: "Fido-friendly Blue Ridge",
        url: "https://www.blueridgemountains.com/blog/fido-friendly-blue-ridge/",
        publisher: "Blue Ridge Mountains visitor site",
        accessedOn: read,
      },
      {
        title: "Enjoy the outdoors",
        url: "https://www.fs.usda.gov/r08/chattahoochee-oconee/safety-ethics/enjoy-outdoors",
        publisher: "U.S. Forest Service",
        accessedOn: read,
      },
      {
        title: "Georgia's pet-friendly wineries",
        url: "https://exploregeorgia.org/list/georgias-pet-friendly-wineries",
        publisher: "Explore Georgia",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `Blue Ridge is easiest with a dog when you split the day: a leashed walk in the forest, a run in a fenced dog area, then a patio. The rule to carry is plain. Keep the leash on everywhere except inside a fenced dog area. The [Blue Ridge Mountains visitor site](https://www.blueridgemountains.com/blog/fido-friendly-blue-ridge/) lists "always keep your dog leashed" as its main tip.

## Outdoors

Start with the Aska Adventure Area, which the visitor site describes as trails and waterfalls and where it asks for a leash. It is the simplest first stop from a cabin.

For the wider national forest, the [U.S. Forest Service](https://www.fs.usda.gov/r08/chattahoochee-oconee/safety-ethics/enjoy-outdoors) says to keep a dog under verbal or physical restraint on the trail, to use a leash in crowded areas, and to keep dogs on a leash and under control in campgrounds. Individual sites can add rules, so read the board at the trailhead.

## Water

The visitor site suggests Morganton Point on Lake Blue Ridge and the Toccoa River for dogs that like to splash. It states no dog rule for either place, so the signs at the site decide, especially at any designated swim area. Bring water for the dog either way. A bowl that folds flat is easy to keep in a jacket pocket: the [Kurgo](${KURGO}) Collaps A Bowl holds 24 ounces and, per the maker, collapses to under an inch.

${PICK}

## Off-leash time

If your dog needs to run, the visitor site names three fenced options. Toccoa River Park in McCaysville has a fenced area where dogs can be off leash. Blue Ridge Adventure Dog is an outdoor dog park with drinks for the people. The Blue Ridge Private Dog Park is a wooded space you book by the hour, so it is yours alone. The page gives no fees or hours for any of them, so check before you drive over.

## Eating and sipping

The visitor site lists a "Pooch Patio" and a canine menu at Toccoa Riverside Restaurant. [Explore Georgia](https://exploregeorgia.org/list/georgias-pet-friendly-wineries) says you can relax on the covered outdoor patio at Bear Claw Vineyards with your dog. Neither page states a leash rule, so keep the leash on until a sign says otherwise.

## A rainy or quiet day

The pages we read name no indoor dog attractions. The visitor site says many downtown boutiques welcome dogs, so a slow browse is the realistic wet-weather plan. Ask at the door, since each shop decides.

## A simple day plan

Walk Aska in the morning while it is cool. Take the dog to a fenced area at midday, then finish on a patio. Keep the bowl in your day pack, and keep the leash clipped on until you are inside a fenced area.

## Leash and season notes

In hot weather, the [Forest Service](https://www.fs.usda.gov/r08/chattahoochee-oconee/safety-ethics/enjoy-outdoors) says to watch your dog for signs of stress and fatigue on long hikes. The visitor site says its visitor centers offer a free pet bag dispenser, and that the Humane Society holds PawsFest, with a pet parade and costume contest, in October. It gives no date, so check before you plan around it.

## Where to stay with a dog

Blue Ridge cabins vary a lot on fences, fees and dog limits. See the stays and planning notes on the [Blue Ridge page](/destinations/georgia/blue-ridge). For fees, read [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work). If your dog is big, [vacation rentals that welcome large dogs](/guides/vacation-rentals-that-welcome-large-dogs) covers what hosts allow.

Rules change. Check each linked page before you go.`,
  },
  {
    ...base,
    town: "ellijay",
    title: "What Can You Do With a Dog Around Ellijay, Georgia?",
    seoTitle: "Dog-Friendly Things to Do in Ellijay, GA",
    seoDescription:
      "Ellijay trails, town parks, Carters Lake and winery patios for dogs, with the leash rule each source page states and where it stays silent.",
    dek: "Town parks, lake trails and orchard-country wineries, with a clear note where a page gives no leash rule.",
    relatedGuides: ["vacation-rental-secure-fenced-yard", "how-vacation-rental-pet-fees-work"],
    sources: [
      {
        title: "Ellijay, Georgia: a pet-friendly paradise",
        url: "https://www.gilmerchamber.com/blog/explore-the-ellijays/ellijay-georgia-a-pet-friendly-paradise/",
        publisher: "Gilmer County Chamber",
        accessedOn: read,
      },
      {
        title: "Woodring Branch Primitive Campground, Carters Lake",
        url: "https://www.recreation.gov/camping/campgrounds/10009939",
        publisher: "Recreation.gov",
        accessedOn: read,
      },
      {
        title: "Georgia's pet-friendly wineries",
        url: "https://exploregeorgia.org/list/georgias-pet-friendly-wineries",
        publisher: "Explore Georgia",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `Around Ellijay, the best three things for a dog are a lake trail at Carters Lake, a walk in the town's river and woodland parks, and a winery visit in orchard country. The main rule is a leash. The [Gilmer County Chamber](https://www.gilmerchamber.com/blog/explore-the-ellijays/ellijay-georgia-a-pet-friendly-paradise/) says to keep your companion leashed and to carry water and waste bags.

## Outdoors

The chamber points to Tumbling Waters Nature Trail at Carters Lake with that leash reminder. Carters Lake is run by the Army Corps of Engineers, and the [Recreation.gov](https://www.recreation.gov/camping/campgrounds/10009939) page for Woodring Branch Campground says pets must be penned, caged or on a leash under six feet. That is a campground rule, but it is a good guide for the lake.

In town, the chamber names Harrison Park and River Park, both with walking trails and wooded areas; Harrison Park is a short walk from the Downtown Square. It also lists Bear Creek Trail among the pet-friendly hiking trails. The page states no leash rule for these three, so carry a leash and use it.

## Water

The river and lake are the draw on a warm day. We found no dog rule for the river parks beyond the chamber's general leash advice, and none we could read for swimming at Carters Lake, so go by the signs on site. Pack water for the dog, because a folding bowl is the lightest way to carry it. The [Kurgo](https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl) Collaps A Bowl holds 24 ounces and collapses under an inch, per the maker.

${PICK}

## Eating and sipping

[Explore Georgia](https://exploregeorgia.org/list/georgias-pet-friendly-wineries) lists three Ellijay-area wineries. Roo Mountain Vineyards asks you to bring a leashed, well-behaved dog. Ott Vineyards and Winery welcomes leashed dogs in its outdoor areas. Engelheim Vineyards invites you to bring your dog to meet the family pets, with no leash or indoor rule on the page.

The chamber adds that some downtown restaurants have patios and temperature-controlled porches for dining with pets. It tells you to check each business first, and so should you.

## Rain and the off-season

The chamber lists seasonal festivals and a pet party. Festival grounds can have their own dog rules, so check the event page first. For a wet day, a winery with covered seating is the safer bet, so ask the winery.

## A simple day plan

Walk the Tumbling Waters trail in the morning, on the leash. Stretch your legs in Harrison Park near the square at midday. Finish with a winery patio. None of the pages we read gives winery hours or seasonal patio closures, so call ahead before you drive over.

## Leash lengths

The only length on any of these pages is under six feet at the Carters Lake campgrounds. The town park and winery pages give none. A standard six-foot leash fits every rule we read.

## Where to stay with a dog

Rural Ellijay lots often border farmland, so ask about the fence and what lies beyond it. See the stays and notes on the [Ellijay page](/destinations/georgia/ellijay). For the money side, read [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work), and for fence checks, [how to find a rental with a secure fenced yard](/guides/vacation-rental-secure-fenced-yard).

Rules change. Check each linked page before you go.`,
  },
  {
    ...base,
    town: "helen",
    title: "What Can You Do With a Dog in Helen, Georgia?",
    seoTitle: "Dog-Friendly Things to Do in Helen, GA",
    seoDescription:
      "Helen's river trails, Smithgall Woods, Anna Ruby Falls and patios for dogs, with the leash rule from each official page and what stays unclear.",
    dek: "Leashed trails along the Chattahoochee, a state park with a six-foot leash rule, and a deck and a winery for the break.",
    relatedGuides: [
      "vacation-rentals-that-welcome-large-dogs",
      "how-vacation-rental-pet-fees-work",
    ],
    sources: [
      {
        title: "Helen to Unicoi Trail",
        url: "https://helenga.org/helen-to-unicoi-trail/",
        publisher: "Alpine Helen visitor site",
        accessedOn: read,
      },
      {
        title: "Helen to Hardman Heritage Trail",
        url: "https://helenga.org/helen-to-hardman-heritage-trail/",
        publisher: "Alpine Helen visitor site",
        accessedOn: read,
      },
      {
        title: "Starter hikes near Helen",
        url: "https://helenga.org/you-need-a-hike-starter-hikes-near-helen-ga-for-people-who-need-to-get-away/",
        publisher: "Alpine Helen visitor site",
        accessedOn: read,
      },
      {
        title: "Cowboys & Angels",
        url: "https://helenga.org/cowboys-angels-restaurant-bar/",
        publisher: "Alpine Helen visitor site",
        accessedOn: read,
      },
      {
        title: "Tails on Trails Club",
        url: "https://gastateparks.org/TailsOnTrailsClub",
        publisher: "Georgia State Parks",
        accessedOn: read,
      },
      {
        title: "Dog walking in Georgia State Parks",
        url: "https://gastateparks.org/DogWalking",
        publisher: "Georgia State Parks",
        accessedOn: read,
      },
      {
        title: "Smithgall Woods State Park",
        url: "https://gastateparks.org/SmithgallWoods",
        publisher: "Georgia State Parks",
        accessedOn: read,
      },
      {
        title: "Anna Ruby Falls Recreation Area",
        url: "https://www.fs.usda.gov/r08/chattahoochee-oconee/recreation/anna-ruby-falls-recreation-area",
        publisher: "U.S. Forest Service",
        accessedOn: read,
      },
      {
        title: "Georgia's pet-friendly wineries",
        url: "https://exploregeorgia.org/list/georgias-pet-friendly-wineries",
        publisher: "Explore Georgia",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `The three best things to do with a dog in Helen are the Helen to Unicoi Trail, a walk in Smithgall Woods State Park, and a meal on a dog-friendly deck. The rule to know is the leash. [Georgia State Parks](https://gastateparks.org/TailsOnTrailsClub) says dogs must be on a leash of six feet at most in any state park, and the Helen trail pages ask for a leash too.

## Outdoors

The [Helen to Unicoi Trail](https://helenga.org/helen-to-unicoi-trail/) is a moderate 5.2-mile out-and-back from a city park in Helen to Unicoi State Park. The page says dogs can use it but must be kept on a leash. For a shorter option, the [Helen to Hardman Heritage Trail](https://helenga.org/helen-to-hardman-heritage-trail/) is a one-mile accessible path along the Chattahoochee River. The page calls it pet friendly and states no leash rule, so keep one on. It closes at dusk.

[Georgia State Parks](https://gastateparks.org/DogWalking) welcomes leashed dogs on state park trails, which covers [Smithgall Woods](https://gastateparks.org/SmithgallWoods). All visitors there register at the Visitor Center, and a ParkPass fee applies. The park page says its five miles of trails and 18 miles of roads are open to hikers and bicyclists, so expect bikes and keep your dog close. The same state page notes that some trails at Tallulah Gorge and Panola Mountain exclude dogs, so check before you drive to another park.

Anna Ruby Falls is a paved walk to the falls, with an admission fee. The Helen visitor site calls the path [dog-friendly](https://helenga.org/you-need-a-hike-starter-hikes-near-helen-ga-for-people-who-need-to-get-away/) in a hiking roundup, but the [U.S. Forest Service](https://www.fs.usda.gov/r08/chattahoochee-oconee/recreation/anna-ruby-falls-recreation-area) page states no pet rule. Keep your dog leashed and under control, and read the signs at the gate.

## Water

We found no dog rule for tubing or the river beaches in Helen, so we leave them out. Walk the riverside trail instead and carry water. A folding bowl packs small: the [Kurgo](https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl) Collaps A Bowl holds 24 ounces, per the maker.

${PICK}

## Eating and sipping

The [Alpine Helen visitor site](https://helenga.org/cowboys-angels-restaurant-bar/) lists a "Pet Friendly Deck" at Cowboys & Angels on Chattahoochee Street. [Explore Georgia](https://exploregeorgia.org/list/georgias-pet-friendly-wineries) says leashed dogs are allowed outside and in the pavilion at Habersham Vineyards & Winery. Neither page covers indoor seating.

## Festival weekends and off-season

Crowds can strain an anxious dog, so check the town calendar before you pick dates. Off-season weekends make the river trails easier, but the Hardman trail still closes at dusk and the days are short in winter.

## A simple day plan

Walk the Hardman trail early, since it closes at dusk, and have lunch on the Cowboys & Angels deck. Save the longer Helen to Unicoi Trail or Smithgall Woods for a day with fewer festival crowds. On state park land, the state's [Tails on Trails page](https://gastateparks.org/TailsOnTrailsClub) also asks you to clean up after your pet.

## Where to stay with a dog

Helen has cabins, motels and rentals with different pet terms. See the stays and notes on the [Helen page](/destinations/georgia/helen). To compare fees, read [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work). If you travel with a large dog, [vacation rentals that welcome large dogs](/guides/vacation-rentals-that-welcome-large-dogs) is the place to start.

Rules change. Check each linked page before you go.`,
  },
  {
    ...base,
    town: "dahlonega",
    title: "What Can You Do With a Dog in Dahlonega, Georgia?",
    seoTitle: "Dog-Friendly Things to Do in Dahlonega, GA",
    seoDescription:
      "Dahlonega parks, river trail, courthouse-square patios and three leashed-dog wineries, with the rule each visitor page states.",
    dek: "Creekside parks, a river trail, the square and three winery patios, with leash rules quoted from the pages.",
    relatedGuides: [
      "how-many-dogs-can-you-bring-to-a-vacation-rental",
      "how-vacation-rental-pet-fees-work",
    ],
    sources: [
      {
        title: "Exploring Dahlonega with your pet",
        url: "https://www.dahlonega.org/articles/post/exploring-dahlonega-with-your-pet-must-visit-spots-for-you-and-your-furry-friend",
        publisher: "Dahlonega-Lumpkin County Visitors Bureau",
        accessedOn: read,
      },
      {
        title: "Georgia's pet-friendly wineries",
        url: "https://exploregeorgia.org/list/georgias-pet-friendly-wineries",
        publisher: "Explore Georgia",
        accessedOn: read,
      },
      {
        title: "Park rules and regulations",
        url: "https://gastateparks.org/ParkRules",
        publisher: "Georgia State Parks",
        accessedOn: read,
      },
      kurgoSource,
    ],
    body: `Dahlonega is a good dog town for a short, easy weekend: a creek or river walk in the morning, the square at midday, and a winery patio in the afternoon. The one rule to carry is to keep the leash on. The [Dahlonega-Lumpkin County Visitors Bureau](https://www.dahlonega.org/articles/post/exploring-dahlonega-with-your-pet-must-visit-spots-for-you-and-your-furry-friend) says: "Please always keep your Dog on a leash for their safety and others."

## Outdoors

The bureau names three outdoor spots. Yahoola Creek Park has pet-friendly walking paths and places where dogs can wade. Hancock Park is open green space for fetch, with shade to rest in. The Etowah River Trail is a wooded hike with river views. The bureau gives that leash line as a general rule for the list, not as a posted rule for each park, so read the signs on arrival.

## Water

Yahoola Creek is the water option the bureau names. It gives no depth, flow or swimming rule, so judge the creek on the day, especially after rain. A folding bowl keeps the dog hydrated on any of these walks. The [Kurgo](https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl) Collaps A Bowl holds 24 ounces and collapses under an inch, per the maker.

${PICK}

## Eating and sipping

The bureau says many outdoor restaurants and shops in historic downtown welcome pets. Each business sets its own rule, so ask before you sit down.

Three wineries have clear wording on [Explore Georgia](https://exploregeorgia.org/list/georgias-pet-friendly-wineries). Three Sisters Vineyards & Winery asks for well-behaved, leashed dogs on the deck. Wolf Mountain Vineyards & Winery welcomes leashed dogs on the tasting room's lower-level patios. Montaluce Winery & Restaurant says you can relax with your pup at the outside tables, and gives no leash rule. Expect to keep the leash on at all three.

## A wet or slow day

The bureau's list also includes pet-friendly shops downtown. Policies are per shop, so ask at the door. Winery patios depend on the weather, and none of the pages mentions covered seating.

## A simple day plan

Walk a creek or river trail in the morning, spend midday on the square, and save a winery patio for the afternoon. Bring a leash for all three, plus water and waste bags.

## State parks nearby

If your trip includes a Georgia state park, the [state's park rules](https://gastateparks.org/ParkRules) say pets are welcome if leashed (no longer than six feet) and accompanied by the owner at all times. They are not allowed in state park and historic site buildings, lodges, yurts or group camps, or in swimming areas and beaches. Dog-friendly cottages charge a fee of $50 per dog (limit two) at check-in, per the same page. Each park's own page can add detail, so read it before you drive.

## Where to stay with a dog

Dahlonega has cabins in the hills and stays closer to the square. See the listings and notes on the [Dahlonega page](/destinations/georgia/dahlonega). If you bring more than one dog, read [how many dogs a rental allows](/guides/how-many-dogs-can-you-bring-to-a-vacation-rental) first, and [how vacation rental pet fees work](/guides/how-vacation-rental-pet-fees-work) before you book.

Rules change. Check each linked page before you go.`,
  },
];
