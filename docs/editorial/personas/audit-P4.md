# Persona audit P4: other audiences and needs

Date: 2026-11-25. Production main@f02e4f9; repo read at the current checkout. Auditor: Claude (simulated personas, NOT user research).
Scope: topic, navigation, product and call-to-action gaps for 12 audiences outside the core "dog owner booking a cabin in Georgia or California". Repo content is being edited for tone; this audit judges topics only. No site file was changed.

## Ground rules and evidence

- Every persona is simulated. "How they would arrive" lists hypothesis phrases only. No search volumes are claimed anywhere.
- Real evidence available (docs/SEO_ROOT_CAUSE_INVESTIGATION.md, docs/SALE_RELEASE_STATUS.md): domain registered 2026-11-16; Search Console 2026-11-16 to 11-23 = 0 clicks, 306 impressions, average position 17.4, 47 queries, on the older build; GA4 Oct 28 to Nov 24 = 527 sessions (513 Direct, 11 Paid Search, 2 Referral, 1 Organic Social, 0 Organic Search); 0 external links; SERP snapshot: page 1 for 3 of 9 tracked queries (no pet fee, no-pets rental, about #9 per night per dog). The 47 query strings are not in the repo, so I cannot say whether any P4 persona already appears in Search Console.
- Competition below comes from WebSearch summaries run 2026-11-25 (not ordered SERPs) and is labeled as such.
- Owner rules respected: dogs first; no stock/prices/ratings/testing claims; no calculators; no newsletter/accounts; Amazon-sourced products only; nothing below is started without approval.

## 1. Coverage map

### Published guides (31 per owner; 24 in content/guides + 7 code-file guides in src/content/guides)

| Slug | Purpose in one line |
|---|---|
| how-vacation-rental-pet-fees-work | Per night vs per dog vs per stay; how to read a fee |
| what-a-dog-really-costs-on-a-vacation-rental | Total cost of bringing a dog |
| vacation-rentals-with-no-pet-fee | The 3 of 38 managers that state no pet fee |
| how-many-dogs-can-you-bring-to-a-vacation-rental | Dog-count limits, how to ask for a third |
| vacation-rentals-that-welcome-large-dogs | Weight limits, wording, message to ask (code file) |
| guides/vacation-rentals-with-no-dog-weight-limit (route page) and guides/breed-restrictions-at-vacation-rentals (route page) | Dedicated route pages for weight and breed rules (not in the 31 count above; unverified whether the owner counts them) |
| bringing-a-dog-to-a-no-pets-rental | What happens if you bring one anyway |
| airbnb-pet-damage-charge-after-checkout | Dispute a post-checkout pet charge |
| pet-friendly-listing-red-flags | Spot a "pet-friendly" listing that isn't |
| pet-friendly-vacation-rental-checklist | Before-you-book checklist (code file) |
| vacation-rental-secure-fenced-yard | Verify a fenced yard (code file) |
| portable-dog-fence-and-playpen-guide-for-rentals | Pens, fences, gates (code file) |
| can-you-leave-a-dog-alone-in-a-vacation-rental | Alone-time rules, crates, cameras |
| can-dogs-go-in-a-rental-pool-or-hot-tub | Pool and hot tub rules |
| vacation-rental-with-a-reactive-dog | Choosing a rental for a reactive dog |
| vacation-rental-with-a-senior-dog | Senior-dog checks before booking |
| puppy-at-a-vacation-rental | Age rules, accidents, fees |
| dogs-in-georgia-state-park-cabins | Georgia State Park cabin rules and fee |
| christmas-week-in-a-cabin-with-a-dog | Holiday cabin week |
| new-years-eve-with-a-dog-in-a-vacation-rental | Fireworks night plan |
| keep-a-dog-cool-on-a-summer-trip | Car, beach, rental heat safety |
| if-your-dog-gets-loose-on-a-trip | First hour and prevention (loose dog) |
| dog-travel-first-aid-kit-guide | What to carry; emergency numbers (code file) |
| dog-friendly-cabin-packing-list | Packing list; links to planner (code file) |
| dog-car-safety-harness-and-crate-guide | How to check crash-test claims (code file) |
| two-large-dogs-in-one-car | Two-dog layouts, barriers |
| protect-your-car-interior-from-a-dog-on-a-road-trip | Seat covers, hammocks, liners |
| dog-ramp-or-steps-for-the-car-and-cabin | Ramp or steps for a big dog |
| dog-travel-bowls-and-food-storage | Bowls, bottles, food storage |
| dog-hiking-gear-for-a-cabin-vacation | Trail gear |
| dog-life-jacket-for-lakes-and-beaches | Life jacket size and fit |
| cold-weather-dog-gear-for-winter-cabin-trips | Coat or boots |

Drafts (not public): smoky-mountain-cabins-with-dogs, winter-road-trip-with-a-dog, winter-rv-travel-with-a-dog, dog-boots-or-paw-wax-for-winter, dog-enrichment-for-vacation-rentals.

### Gear shop (content/products.yml: 92 products, active flag per product)
11 categories: car-safety, car-interior, ramps-and-steps, feeding-and-hydration, pens-and-gates, comfort-and-cooling, water-and-beach, trail-and-hiking, cold-weather, safety-id-first-aid, rental-cleanup. 5 trip collections: road-trip, cabin-stay, beach-and-lake, winter-trip, hiking. 9 "shop by" shortcuts (5 trips + large dogs, senior dogs, escape artists, multi-dog). Notable catalog items for this audit: tractive-dog-6, fi-series-3-plus, petcube-gps-tracker, whoseid-qr-nfc-dog-tag-silicone-small, ruffwear-the-beacon-dog-safety-light (ID/GPS); arca-pet-cat-dog-first-aid-kit-100, adventure-medical-kits-dog-wipes, fdk-8-second-pet-thermometer, baskerville-ultra-muzzle (first aid); midwest-icrate-36-inch-double-door-crate, lucky-duck-lucky-kennel(-large), petsafe-happy-ride-extra-long-ramp (big dogs); north-states-mypet-universal-petgate, carlson-convertible-pet-yard (gates/pens). No tick/flea/paw-injury-specific product exists.

### Tools
Public (/tools index): Will my dog be accepted? (38-manager comparison), Pack your dog's bag (packing planner), Before-you-book checklist. Routes also exist for cost-calculator, pet-cost-check and host-questions (not on the index; the owner rule is no calculators).

### Other hubs
/data/pet-policies (38-manager dataset, CSV, citation block, six regions), /dogs (escape artists, big dogs, multi-dog families, senior dogs), /dog-rules (14 place pages: state/national parks, beaches), /stays (83 stay files), /destinations: Georgia (Blue Ridge, Ellijay, Helen, Dahlonega) and California (San Diego, Santa Barbara, Monterey, Mendocino) with 8 town "things to do" pages, /list-your-property, /methodology, /editorial-standards, /corrections.

### Dataset geography (important for persona 8)
Manager rows by region: North Carolina 10, Georgia 9, Smoky Mountains TN 7, Colorado and Florida Gulf Coast 6, California 5, Many regions 1. So 23 of 38 managers are outside Georgia and California, and the dataset already serves Tennessee, North Carolina, Colorado and Florida readers, but the home page, nav and destinations hub say only Georgia and California.

## 2. Personas

### P4-1. Cat owner who lands here by mistake (and the "all pets" question)
WHO (simulated): someone searching "pet friendly vacation rentals" or "does Airbnb allow cats" who owns a cat, or a cat-and-dog household.
HOW THEY ARRIVE (hypothesis): "pets allowed Airbnb cat", "how many pets allowed vacation rental", "pet fee per pet". No Search Console evidence exists for any cat query.
WHAT THEY FIND: nothing cat-specific. The home page names no cats; the fee, count and no-pet-fee guides speak about dogs. One real overlap: some of the 38 managers set limits on "pets of any kind" (limitBasis "pets"), and the first-aid guide's pick arca-pet-cat-dog-first-aid-kit-100 mentions cats.
WHAT'S MISSING: for the stray cat visitor, a one-line "This site is about dogs" statement on the About page or the dataset page, with a pointer to the official host or manager pet page. No article.
PRODUCT FIT: none that the brand can credibly serve (cat carriers, litter, scratchers would need a new category and a second audience).
SHOULD THE SITE EVER COVER CATS? Recommendation: NO. Reasons: the brand promise is "dog-friendly travel, done properly" and every guide, tool and product is dog-specific; cat travel is a different topic (cats rarely travel to rentals; the questions are carriers, litter, stress); the competition is Catster, Hepper and Cuteness (WebSearch 2026-11-25); the dataset only records dog policy and would need re-reading for cats; mixing audiences would dilute the trust angle. Cheapest honest alternative: add "pets of any kind" notes where a manager's limit counts cats.
IS IT WORTH BUILDING: 1 of 5. Need real but off-brand; no overlap; strengths do not transfer; no product fit.

### P4-2. Traveler who wants pet-friendly hotels and motels for a road trip
WHO: a driver crossing several states with a dog who needs one-night stops, not rentals.
HOW THEY ARRIVE: "pet friendly hotels road trip with dog", "dog friendly motels near me", "hotel pet fee per night". No Search Console evidence.
WHAT THEY FIND: a road-trip gear collection and car guides, but zero hotel content beyond passing mentions (reactive-dog guide compares hotel vs house; puppy guide links a hotel article). Nothing on one-night stops, hotel pet fees, "can't leave dog alone in room", or ground-floor requests. The "can you leave a dog alone" guide is rental-framed.
WHAT'S MISSING: "What should I ask a hotel before I book a room with my dog?" built as a method (call-the-property script, chain vs individual property, fee wording, leaving the dog in the room, car-park relief areas), plus a link from the road-trip gear collection. Not a hotel directory.
PRODUCT FIT: strong on existing catalog: road-trip collection, crate (midwest-icrate-36-inch-double-door-crate), crate cover (amazon-basics-dog-crate-cover-36-inch), rabbitgoo-frosted-window-privacy-film, travel bowls, petsafe ramp. No new category needed.
COMPETITION (WebSearch 2026-11-25): BringFido says it lists hotels in 150 countries with filters; AKC, AAA, NerdWallet, Yahoo carry chain roundups. The directory race is unwinnable; a method guide is less crowded.
IS IT WORTH BUILDING: 3 of 5. Large reader need and good product fit, but heavy competition and the original dataset does not cover hotels. Strengths that transfer: honest sourcing and the "ask the manager" scripts.

### P4-3. International traveler taking a dog to Canada, Mexico or Europe
WHO: a US owner driving to Banff or Cancun, or flying to Europe.
HOW THEY ARRIVE: "bring dog to Canada from US requirements", "Mexico dog health certificate". No evidence.
WHAT THEY FIND: nothing. The only mention of Canada or Mexico in the repo is a passing line in the winter road-trip draft.
WHAT'S MISSING: at most a short "Crossing a border with your dog: where the rules actually live" section naming the official agencies (USDA APHIS, CFIA, CDC for return entry) and stating that rules change and a vet visit is needed. A full guide would need constant verification; WebSearch snippets show the rules change (for example Mexico dropped the health certificate in 2019; screwworm re-entry rules applied from late 2024), so any article goes stale and a wrong answer harms a reader.
PRODUCT FIT: none beyond what exists (crate, ID tag, GPS tracker: tractive-dog-6, whoseid tag). Airline-approved carriers would be a new category and a safety-claim risk.
COMPETITION: USDA APHIS, Government of Canada and CFIA pages rank for these queries (WebSearch 2026-11-25); the site cannot beat them and has no data edge.
IS IT WORTH BUILDING: 2 of 5. Reader need is real but low overlap, no strengths transfer, no products, and high accuracy risk. Recommendation: DO NOT BUILD an article; consider a two-sentence pointer in the first-aid or records section.

### P4-4. "Should I bring my dog or board it?" decider
WHO: an owner choosing between a dog-friendly rental and a boarding kennel or sitter.
HOW THEY ARRIVE: "should I take my dog on vacation or board", "dog boarding vs bringing dog". No evidence.
WHAT THEY FIND: the alone-in-a-rental guide (mentions kennels and crates), the reactive and puppy guides, and the cost guide ("how much a dog really costs"). None frames the decision. No trial-run advice (short boarding stay first, one-night test trip).
WHAT'S MISSING: "Will my dog actually enjoy this trip?" as a section in what-a-dog-really-costs or the checklist: a short test (settles in new places, copes with car, alone-time tolerance) ending in either "come along" or "book a sitter," with a one-night trial stay idea. A boarding directory is out of scope.
PRODUCT FIT: weak to moderate: car-safety, crates and a trial-run pack list; sitter/boarding services are not Amazon products.
COMPETITION (WebSearch 2026-11-25): Chewy, Rover, AKC, WebMD, Gingr, Dogster and VCA all answer it. Heavy.
IS IT WORTH BUILDING: 2 of 5 as an article; 3 as a section inside an existing guide, because it also helps convert "I'm unsure" readers into stay searchers.

### P4-5. Remote worker on a month-long stay with a dog
WHO: a laptop worker renting a place for 30 or more days.
HOW THEY ARRIVE: "monthly rental that allows dogs", "pet rent vs pet deposit monthly", "dog friendly furnished rental". No evidence.
WHAT THEY FIND: nothing on long stays. The fee guide covers per-night/per-stay fees, not monthly pet rent or deposits. The 38-manager dataset is short-stay vacation rentals and does not record month-plus policies.
WHAT'S MISSING: "Does a monthly stay change the pet fee and rules?" would need data the site does not have (monthly rates, deposits, extended-stay policies). Remote-work needs (Wi-Fi, desk, day alone with the dog) overlap the "leave a dog alone" guide and the enrichment draft.
PRODUCT FIT: moderate: dog-bed, crate, enrichment (kong-classic), long-lead, gates. These items exist already.
COMPETITION: RentCafe, Apartments.com, Zillow, AKC rule the "pet rent" space (WebSearch 2026-11-25), which is long-lease, not vacation stays.
IS IT WORTH BUILDING: 2 of 5. Reader need is niche and the original data does not transfer. Recommendation: DO NOT BUILD; add a "stays of a month or more" question to the host-questions/checklist if the owner wants.

### P4-6. Parents with kids and a dog on a family trip
WHO: a family choosing a rental that works for toddlers and a dog.
HOW THEY ARRIVE: "family friendly pet friendly cabin", "kids and dog vacation rental". No evidence.
WHAT THEY FIND: stays and filters (fenced yard, large dogs, multiple dogs); a fenced-yard guide that mentions children; nothing on baby gates, dog and toddler safety, supervised greetings or who handles the leash in a crowded place.
WHAT'S MISSING: a section "Which rental works when there are kids and a dog?" added to the checklist or fenced-yard guide (separate sleeping spaces, gates for the dog and for the baby, pool fencing, a dog-free zone). Not a standalone article.
PRODUCT FIT: good: north-states-mypet-universal-petgate, midwest-exercise-pen-with-door, carlson-convertible-pet-yard, crate; the pens-and-gates category exists.
COMPETITION: parenting blogs, AKC, Rover; moderate.
IS IT WORTH BUILDING: 3 of 5. Overlap with existing yard/pen content is high, so a section wins over an article.

### P4-7. The "treat my dog" traveler (restaurants, breweries, wineries, beaches, trails)
WHO: someone who plans meals and outings around the dog.
HOW THEY ARRIVE: "dog friendly restaurants Blue Ridge GA", "dog friendly breweries Santa Barbara", "dog friendly things to do in Dahlonega". Evidence: Blue Ridge things-to-do was "Discovered, not indexed" in Search Console (docs/SALE_RELEASE_STATUS.md), so no demand evidence.
WHAT THEY FIND: 8 town things-to-do pages (live check of Blue Ridge: 8 named places in 8 sections; one restaurant and one winery, no brewery; each rule is sourced to a visitor page; one gear link). Also /dog-rules with 14 place pages.
WHAT'S MISSING: depth, not new pages: more eating and sipping entries per town (each needs a dated source), a "Eating and sipping" jump link from the town page and /stays, a nearby-activities strip on stay pages, and "rainy day" entries that name places. The rainy-day section currently names none.
PRODUCT FIT: good with existing catalog: travel bowls (kurgo-collaps-a-bowl, gunner-dog-bowl), water bottles, hiking gear, life jacket, towels (soggy-doggy-super-shammy-towel), cooling pad.
COMPETITION: BringFido, Explore Georgia, local visitor bureaus and rental companies. The site's sourcing method (rule plus source plus date) is its only edge.
IS IT WORTH BUILDING: 4 of 5 as expansion of existing pages. It matches the owner's local, sourced approach and connects stays to gear.

### P4-8. Traveler heading to a destination we do not cover
WHO: someone planning Colorado, Florida, the Smokies in Tennessee, Arizona or New England.
HOW THEY ARRIVE: "pet friendly cabins Gatlinburg", "dog friendly vacation rental Breckenridge", "Florida Gulf Coast pet policy vacation rentals". Evidence: none from Search Console; but the dataset covers 7 Smoky Mountain TN managers and 6 Colorado/Florida Gulf Coast managers, and a SERP check found the dataset page the only recent original source.
WHAT THEY FIND: home page, nav and destinations show only Georgia and California; "Anywhere" search adds no states. The dataset page and the Will-my-dog-be-accepted tool do cover TN, NC, CO and FL managers, but nothing tells a Colorado reader that. The Smokies guide sits in draft.
WHAT'S MISSING: (a) publish the finished Smokies draft; (b) a "Dog-friendly rentals anywhere: how to read a manager's pet policy" hub that uses the 38-manager table by region (NC, TN, CO, FL) with links to the fee, count, large-dog and red-flag guides; (c) one line on the home page and /destinations: "Policies for managers in six regions".
PRODUCT FIT: the whole gear shop is destination-free, so it already serves these readers.
COMPETITION: Vacasa, Airbnb, VRBO, regional managers on destination queries. Regions are not winnable as stays directories, but the method hub and the dataset can win on "policy" queries.
IS IT WORTH BUILDING: 5 of 5. Cheapest, highest-leverage gap: data already exists; effort is mostly a hub page and nav copy.

### P4-9. Owner of a giant breed or a dog above typical limits
WHO: Great Dane, mastiff, or 100+ lb dog owner.
HOW THEY ARRIVE: "rentals that allow great danes", "vacation rental no weight limit large dog". Evidence: the site tracked per-night/no-pet-fee SERP queries only; no giant-breed evidence.
WHAT THEY FIND: a strong set: vacation-rentals-that-welcome-large-dogs (6 managers state weight limits of 35 to 65 lb; 2 say none), a no-weight-limit route page, the breed-restrictions guide, ramps, two-large-dogs-in-car, big-dogs page. This is the best-served audience in the site.
WHAT'S MISSING: little. Gaps: nothing for dogs over 100 lb (crate size, ramp weight, getting into a bed or stairs, a car that fits), and no "is my dog counted as large?" line. Add as a section in the large-dogs guide with sizes taken from the product pages.
PRODUCT FIT: ramps (petsafe-happy-ride-extra-long-ramp), midwest-icrate-36-inch-double-door-crate and lucky-duck-lucky-kennel-large, cargo liner, XL hammock; weight limits would need to be quoted from makers.
COMPETITION: Vacasa and VRBO listing pages, small blogs (WebSearch 2026-11-25 found no dedicated giant-breed rental guide).
IS IT WORTH BUILDING: 3 of 5, as improvement not new article.

### P4-10. Dog slipped away or got sick on a trip
WHO: an owner in a hurry, on a phone, in a place they do not know.
HOW THEY ARRIVE: "dog ate something on vacation what to do", "emergency vet near me" (likely beyond the site), "dog tick on trip", "dog paw cut hiking". No evidence.
WHAT THEY FIND: if-your-dog-gets-loose-on-a-trip (first hour; vets, shelters), keep-a-dog-cool (heat), the first-aid kit guide (numbers, emergency clinic near the stay, poison hotlines, heatstroke signs), plus GPS and ID products. Good base.
WHAT'S MISSING: (a) "How do I find an emergency vet before my trip?" as a section: a method (map clinics near each stop, check hours and walk-ins, save numbers, bring records); (b) a "paw, tick and flea" section: paw injuries on hot ground or snow (links to boots in the cold-weather guide and the draft boots-or-wax guide), tick check after trails; (c) a one-page printable "Trip emergency card". The first-aid kit guide is the natural home. No veterinary instructions beyond what AVMA-style sources say.
PRODUCT FIT: strong and honest: first aid kit, thermometer, muzzle, GPS trackers (tractive-dog-6, fi-series-3-plus), ID tags, boots, wipes. A tick remover would be a new product in safety-id-first-aid (Amazon only, no claims).
COMPETITION: AKC, AVMA, AAA, PetMD, Rover, VEG (WebSearch 2026-11-25). The site wins on trust and sourcing, not on volume.
IS IT WORTH BUILDING: 4 of 5. Low effort via existing guides; strongest product connection.

### P4-11. Host or property manager who finds the site
WHO: a cabin owner or manager who lands from the dataset or the "list your property" link.
HOW THEY ARRIVE: "how many dogs should my rental allow", "pet policy template vacation rental", or from the footer. No evidence.
WHAT THEY FIND: a /list-your-property page (what is needed to be reviewed, free, sponsored placement "if we offer it"), a /tools/host-questions route not on the index, and the dataset showing other managers' policies. The home page has a host invitation.
WHAT'S MISSING: a B2B route is possible (compare your policy to the 38; a clearer pet policy page template) but dilutes a reader-first brand, invites conflict of interest with the honest-sourcing promise, and the owner's rules exclude accounts, newsletters and (by implication) sales funnels. The listing page is enough; hosts are also the source of "verify" data.
PRODUCT FIT: none (Amazon affiliate does not suit hosts; "sponsored placement" would need new disclosure).
COMPETITION: Hospitable, Hostaway, Lodgify, Airbnb Help dominate host policy content (SEO_ROOT_CAUSE_INVESTIGATION.md).
IS IT WORTH BUILDING: 1 of 5. Recommendation: DO NOT BUILD more; keep the existing page as a low-cost source of verified listings, and keep it off the main nav (it already is a footer/section link).

### P4-12. Journalist or blogger who wants to cite the 38-manager research
WHO: a travel writer, pet blogger or editor writing about pet fees.
HOW THEY ARRIVE: "vacation rental pet fee study", "how many vacation rentals charge pet fees". The dataset page is the only recent original source found in the SERP checks.
WHAT THEY FIND (live fetch 2026-11-25): headline numbers (22 of 38 state a two-dog limit, 3 no fee, 31 silent on breed, 25 state a fee amount, 6 state a weight limit), a convenience-sample caveat, 11 managers excluded because sites refused automated reading, per-row source links, a CSV, a "Using these numbers?" citation block ("Paws & Passage, pet policies of 38 vacation rental managers, read 2026-11-18"), and a Corrections page. That is already good.
WHAT'S MISSING: no press or contact line on the page; no named author or reviewer; no license statement for the CSV; no stable per-finding anchors or short quotable stat block; no "last re-read" schedule or version/changelog; no preformatted APA/MLA lines; no summary graphic. A dedicated "For writers" box (what you can reuse, how to cite, who to ask) would help.
PRODUCT FIT: none directly; the value is backlinks, which the site lacks (0 external links).
COMPETITION: none observed; vendor blogs and a 2019 study only (SEO_ROOT_CAUSE_INVESTIGATION.md).
IS IT WORTH BUILDING: 5 of 5 for the small fix. The dataset is the one asset the SEO investigation says is not yet linked from outside; making it citable is the cheapest path to authority.

## 3. Ranked top 10 topic and audience gaps

| # | Reader question (title) | Why it matters | Product connection | Evidence strength | Effort | Recommendation |
|---|---|---|---|---|---|---|
| 1 | "Where can I find a dog-friendly rental in Tennessee, Colorado, Florida or anywhere else?" (hub using the 38-manager table by region, plus publish the Smokies draft) | 23 of 38 managers are outside GA/CA but nothing says so; the only unique asset serves readers the site never mentions | Whole gear shop is location-free; road-trip and cabin collections | Medium: dataset geography is factual; no query data | Low (hub page, home and destinations copy, publish an existing draft) | BUILD NOW (needs owner approval for the new hub page and Smokies publish) |
| 2 | "How do I cite your pet-policy research?" (writers box on /data/pet-policies) | Zero external links is the stated top blocker; dataset is the only original source found | None | Strong (docs say 0 external links; dataset unique in SERP checks) | Very low | BUILD NOW |
| 3 | "What is there to do with my dog near the stay, including where to eat and drink?" (expand 8 town pages) | Matches "treat my dog" intent; pages exist and are sourced | Bowls, bottles, trail, towels | Weak-medium (one page "Discovered, not indexed"; no query data) | Medium (each entry needs a dated source) | BUILD NOW as extensions; no new articles |
| 4 | "My dog got hurt or sick on a trip: how do I find help?" (emergency vet, paw, tick sections) | Highest stakes; a first aid guide and loose-dog guide already exist | First aid kit, thermometer, muzzle, GPS, ID tags, boots; a tick tool would be new | Medium (reader need; competition by big publishers) | Low | BUILD NOW inside the first-aid guide; BUILD LATER a standalone guide |
| 5 | "What should I ask a hotel before booking with my dog on a road trip?" | Road-trippers are a large audience not covered; the road-trip gear collection has no hotel entry | Road-trip collection, crate, crate cover, window film | Weak (no query data; BringFido dominates) | Medium | BUILD LATER (method guide only) |
| 6 | "How big a dog is too big, and what changes over 100 lb?" (giant breed section) | The large-dog guide is the strongest content; a gap for 100+ lb | Ramp, large crate, cargo liner | Weak-medium | Low | BUILD NOW as a section; no new article |
| 7 | "Is my dog going to enjoy this trip, or should I board or hire a sitter?" | Pre-decision readers; feeds stays search | Crate, car safety (indirect) | Weak | Low | BUILD LATER as a section in the cost guide |
| 8 | "Which rental works with kids and a dog?" | Common family question; overlap with yard/pen content | Gates, pens, crates | Weak | Low | BUILD LATER as a section |
| 9 | "Does a month-long stay change the dog rules and fees?" | Niche; needs new data | Beds, enrichment | Weak | High (new data) | DO NOT BUILD (no data edge) |
| 10 | "What do I need to take my dog to Canada, Mexico or Europe?" | Real need but strict official rules change often | None | Weak | High (constant verification) | DO NOT BUILD; at most a pointer to APHIS, CFIA and CDC |

Also DO NOT BUILD: cat content (off-brand; see P4-1) and a B2B host funnel (see P4-11).

## 4. Gaps best answered by improving what exists

- Gap 1: a hub on /data/pet-policies or /destinations plus home-page copy; publish the existing Smokies draft rather than starting an article.
- Gap 2: edit the dataset page only.
- Gap 3: extend the 8 town things-to-do pages and add a "Nearby" strip on stay pages.
- Gap 4: add sections to dog-travel-first-aid-kit-guide and if-your-dog-gets-loose-on-a-trip, and link the cold-weather guide for paws.
- Gap 6: add a section to vacation-rentals-that-welcome-large-dogs and /dogs/big-dogs.
- Gaps 7 and 8: sections in what-a-dog-really-costs-on-a-vacation-rental and pet-friendly-vacation-rental-checklist or the fenced-yard guide.
- Only gap 5 (hotels) would be a new article, and only later with owner approval.

## 5. What I could not verify

- Any query volume, ranking or user behavior for these personas (no Search Console query list in the repo; no GA4 beyond the 527-session total).
- Whether the two extra route guides (breed restrictions, no weight limit) are counted in the owner's 31.
- Whether the live production site matches the checkout beyond the pages I fetched (home, /data/pet-policies, one things-to-do page).
- Competitor SERP order: WebSearch returns summaries, not ranked pages; BringFido blocked automated reading earlier (competitors-pet-travel.md), so its claims here come from a search summary only.
- International pet-entry rules: taken from search snippets only; they change and must be checked on official pages before any publishing.
- Whether /tools/cost-calculator, /tools/pet-cost-check and /tools/host-questions are reachable from public nav (they are not on the Tools index).
