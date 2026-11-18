# Next 20 evergreen article opportunities (Paws & Passage)

Prepared 2026-11-18. Read-only research: no site file was edited; this is the only file written.

## 0. How to read this (limits first)

- **[MEASURED]** = I saw it in a WebSearch result set or in a repo file (URL or path given). Searches were one standard WebSearch per query. A WebSearch result is a list of titles and URLs, not a live Google SERP: order is not reliable, and I did not see ads, People-Also-Ask, AI Overviews or maps packs. "Top results" below means "what appeared in the result set", not "ranked 1 to 10".
- **[ESTIMATE]** = my judgment. No search volume, keyword difficulty, traffic or ranking number appears anywhere in this document, because I have none. Long-tail variants are plausible phrasings I chose, NOT validated queries.
- Fees, policies and beach rules named from search snippets are what a snippet said, not verified; none should be copied into an article without opening the primary page.
- Several result sets contained throwaway-looking domains (pawventures.pages.dev, pawholt.pages.dev, presentationbuilder.internationaltrucks.com, travellingholidays2022.pages.dev). [MEASURED] they appeared; I did not evaluate them further. They suggest low-quality competition on money queries, but they may be churn rather than durable rankers [ESTIMATE].
- Date context: today is 2026-11-18. Time-sensitive windows below are computed from that.

## 1. What we already publish (24 guides) and what to avoid cannibalizing

Sources: `content/guides/*.md` front matter (9 files) and `src/content/guides/*.ts` (15 files). The 9 Markdown guides have no `primaryKeyword` field in front matter, so their primary keywords below are inferred from titles [ESTIMATE]. The 15 TS guides carry an explicit `primaryKeyword` [MEASURED, src/content/guides/*.ts].

| # | Title | Primary keyword |
|---|---|---|
| 1 | Charged for Pet Damage After Checkout? What to Do on Airbnb and Vrbo | airbnb pet damage charge after checkout (inferred) |
| 2 | Airbnb vs Vrbo With a Dog: Pet Fees and Rules Compared | airbnb vs vrbo with a dog (inferred) |
| 3 | Breed Restrictions at Vacation Rentals: How to Check Before You Book | breed restrictions vacation rentals (inferred) |
| 4 | What Happens If You Bring a Dog to a No-Pets Rental? | bring dog to no pets rental (inferred) |
| 5 | Can You Leave a Dog Alone in a Vacation Rental? | leave dog alone in vacation rental (inferred) |
| 6 | How Many Dogs Can You Bring to an Airbnb or Vacation Rental? | how many dogs airbnb / vacation rental (inferred) |
| 7 | How Pet Fees Actually Work at Vacation Rentals | vacation rental pet fees (inferred) |
| 8 | New Year's Eve With a Dog in a Rental or Cabin: Your Fireworks Plan | new year's eve with a dog in a rental (inferred) |
| 9 | Renting a Vacation Home With a Senior Dog: What to Check First | vacation rental with a senior dog (inferred) |
| 10 | Dog Car Safety: Crash-Tested Harness or Secured Crate | dog car safety harness and crate |
| 11 | What to Pack for a Dog-Friendly Cabin Vacation | dog friendly cabin packing list |
| 12 | Dog-Friendly Cabins With Fenced Yards in Georgia | dog friendly cabins fenced yards Georgia |
| 13 | Gear That Protects Rental Furniture and Cars From Dog Hair, Mud and Accidents | dog travel gear to protect rental furniture and car |
| 14 | Dog-Friendly Weekend Getaways From Atlanta | dog friendly weekend getaways from Atlanta |
| 15 | Dog-Friendly Weekend Getaways From Los Angeles | dog friendly weekend getaways from Los Angeles |
| 16 | Dog ID Tags, Microchips and GPS Trackers for Travel | dog ID tags and GPS trackers for travel |
| 17 | Dog First-Aid Kit for Trips and Cabin Stays | dog first aid kit for travel |
| 18 | Dog Travel Water and Feeding Gear | dog travel water and feeding gear |
| 19 | Pet-Friendly Beachfront Rentals in California | pet friendly beachfront rentals California |
| 20 | Pet-Friendly Vacation Rental Checklist (TS, no title captured by my grep) | pet friendly vacation rental checklist |
| 21 | Portable Dog Fences, Playpens and Gates for Rentals Without a Fenced Yard | portable dog fence for rentals |
| 22 | Traveling With Two Dogs: The Accommodation Planning Guide | traveling with two dogs accommodation |
| 23 | Vacation Rental Secure Fenced Yard (TS, no title captured) | vacation rental secure fenced yard |
| 24 | How to Find Vacation Rentals That Welcome Large Dogs | vacation rentals that welcome large dogs |

Cannibalization hot spots to respect: #6 and #22 (dog count), #24 (size), #7 and #2 (fees), #19 (beach), #11 and #20 (packing/checklist), #5 (alone/barking), #9 (senior), #12 and #23 (fenced yard).

## 2. What the dataset can and cannot power

Source: `src/content/manager-policies.ts` (38 entries, dataDate 2026-11-18, header says "a sample of managers whose sites could be read, not a survey") and `docs/data/*.csv` (five regional CSVs plus three verified-*.csv). Counts below were computed by me from the TS file [MEASURED].

- **Fee field**: 13 of 38 are "Not stated". Three are $0: Sliding Rock Cabins (CSV says every cabin, no pet fees, breed or weight limits), Hapey Cabin Rentals ($0, no deposit), and Twiddy and Company ("$0 on homes listed", from a blog post covering 10 sample homes; CSV confidence "medium", not a formal policy page). One more is a manager-level "$0 on homes listed". So "3 of 38" is correct as stated and fragile.
- **Fee bases are mixed** (per night, per stay, per pet, per pet per night, weekly, tiered first dog/second dog, "up to $1,000 varies by property"). Any average by region needs a stated normalization (for example a fixed 4-night, 2-dog trip) and n is small: with 13 unstated, most regions have 2 to 6 usable fees. Publish ranges and named examples, never a regional "average".
- **Dog limits**: 22 managers state 2; 2 state 3 (Tahoe Vacation Rentals, counted on a pets basis, and Rosemary Beach Cottage Rental Company); 14 state none. So the data supports "2 is the norm, 3+ is rare and often per-home", but is too thin to build a 3+ dog directory.
- **Weight limits**: only 6 state one (AMI Locals 50 combined; Cabin Rentals of Georgia 35; Emmons Realty 65; Brindley Beach 60; Hearthside 35 soft; Elk Springs 50). Useful as a "what limits actually look like" range, not as a market statistic.
- **Breed**: 31 not stated, 3 unnamed, 2 named, 2 none. The "not stated" majority is itself a finding: policy pages often are silent, so the real answer lives in each listing.
- **Geography** (by `place`): Outer Banks 6 plus Hatteras 2 (8); Smokies/Gatlinburg/Pigeon Forge around 7; Blue Ridge area 6; California and Tahoe about 8; St. Simons 3; Asheville 2; Gulf Florida 4. Regional pages are viable only for the NC coast, Smokies, North Georgia and California.
- **Gaps**: no hotel data, no per-listing data, no beach-access data, no puppy-age data except scattered notes in CSV `rules_notes` (for example "pets at least 18 months old" at A Blue Ridge Cabin Rental; "no puppies" for Resort Realty seen in search, not in our data), no pool/hot-tub column (but `rules_notes` mentions "no pets in pools or hot tubs" for Sun Realty and Brindley Beach).
- Tools available to link to (`src/routes`): `tools.cost-calculator`, `tools.pet-cost-check`, `tools.will-my-dog-be-accepted`, `tools.host-questions`, `tools.packing-list`, `tools.checklist`. Approved affiliate: Vrbo only; no buy buttons render for others (`content/affiliates.yml` empty per brief).

Legend for "Data power": **Strong** = dataset gives a headline finding no competitor has; **Partial** = dataset supports a section or sidebar; **None** = needs other research.

## 3. The 20 opportunities (ranked)

Ranking logic [ESTIMATE]: expected ease of ranking for a new site x data differentiation x commercial path x low upkeep, minus cannibalization risk. Rank 1 is first to write.

---

### 1. Vacation Rentals With No Pet Fee: What the Fee-Free Managers Actually Say
- **Primary query**: vacation rentals with no pet fee
- **Long-tail** [ESTIMATE phrasing]: pet friendly rentals no pet fee; vacation rental dogs stay free; cabins with no pet fee
- **Intent**: commercial investigation / list. People want a place to book plus reassurance on "what's the catch".
- **SERP seen** (query: "vacation rentals with no pet fee dogs stay free") [MEASURED]: Twiddy Duck rentals page (twiddy.com/outer-banks/pet-friendly/duck-rentals, operator category page); PureWow list (purewow.com/family/dog-friendly-airbnbs, editorial list); BringFido listing pages (bringfido.ca/blog/vrbos-with-dog-amenities, bringfido.ca/lodging/485491, directory); many Vacasa location pages (vacasa.com/usa/.../explore/Dog-friendly/, operator, and Vacasa's own snippet says a pet fee is charged at all its pet-friendly rentals); AARP (aarp.org/travel/travel-tips/lodging/vacation-rental-stays-with-pets/); Cheapism (blog.beta.cheapism.com/dog-friendly-rentals/amp). No forum threads seen in this set.
- **Competitiveness for a new site** [ESTIMATE]: Medium-Low. No result is a page built around "no fee"; they are generic lists or operator pages. The risk is the head term pulling directory pages (BringFido, Vacasa).
- **Commercial intent / path**: High. Stay path: Vrbo (approved) via a "how to filter for and confirm no-fee homes" section; tool path: `pet-cost-check` ("what would my trip cost at a typical fee vs $0"). Others pending.
- **Emotional hook**: "Fees add up for a dog who is family; here is who doesn't charge and what to watch for."
- **Data differentiation**: **Strong**. 3 of 38 managers charged nothing on pages we read (Sliding Rock, Hapey, Twiddy-on-listed-homes) versus 22 that publish a number. Honest framing: tiny sample, medium confidence on Twiddy, and "no fee" can mean higher nightly rates or a cleaning fee [ESTIMATE]. Name each manager with page link and date read.
- **Pinterest / shareable**: pin "3 of 38 managers charged $0 pet fee" with a fee-ladder graphic ($0 to $300+ from our data); embeddable "pet fee ladder" chart.
- **Maintenance**: Med. Each named manager must be re-read at least twice a year; fee-free policies are the first thing to change. Dated "last checked" lines and a re-check checklist are mandatory.
- **Cannibalization**: overlaps #7 (How Pet Fees Work). Make #7 the explainer and link to this as the "who doesn't charge" list; do not re-explain structures.
- **Priority rank**: 1

### 2. What a Dog Really Costs on a Vacation Rental (Fee, Deposit, Gear, Gas, Extras)
- **Primary query**: how much does it cost to take a dog on vacation
- **Long-tail**: cost of traveling with a dog; vacation rental pet fee vs boarding cost; is it cheaper to board my dog or bring her
- **Intent**: informational with a decision (bring vs board).
- **SERP seen** [MEASURED]: Rover (rover.com/blog/cost-traveling-with-dog, brand blog); Consumer Reports (consumerreports.org/vacations/cost-of-taking-a-vacation-with-your-dog); Yahoo Lifestyle (yahoo.com/lifestyle/heres-much-really-costs-travel-113001861.html) and a second Yahoo syndication; AmEx (americanexpress.com/en-us/credit-cards/credit-intel/cost-of-traveling-with-a-dog/, flying focus); Fox6, ABC7, CTV and KGUN local-news repostings of the Consumer Reports story; Motley Fool Ascent; travelbulletin.com large-dog costs; pawventures.pages.dev (spam-looking); traveldailynews.com.
- **Competitiveness** [ESTIMATE]: Medium. Many national outlets, but many are syndicated copies of one story and flying-heavy; none show a rental-specific line-by-line.
- **Commercial intent / path**: Medium-High. Tool: `cost-calculator` and `pet-cost-check` (the article is the on-ramp). Stay: Vrbo. Gear affiliates pending.
- **Emotional hook**: "Is the guilt of leaving her home worth the $400, or is bringing her cheaper than we think?"
- **Data**: **Strong/Partial**. Real fee wording from 38 managers feeds worked examples (for example $40/night x 4 nights vs $250 flat vs $0). Use our examples, label them illustrative; do not claim an average.
- **Pinterest**: "Dog trip cost cheat sheet" infographic; downloadable one-page budget worksheet (PDF) tied to the tool.
- **Maintenance**: Low-Med if examples use our dated data and no outside prices; High if it quotes boarding/sitter rates (change yearly).
- **Cannibalization**: overlaps #7; keep this "whole-trip total" and #7 "fee mechanics".
- **Priority rank**: 2

### 3. Pet Fees at 38 Vacation Rental Managers: What We Found (2026)
- **Primary query**: vacation rental pet fee how much
- **Long-tail**: average pet fee vacation rental; pet fee per night vs per stay by region; how much is the pet fee at Outer Banks rentals
- **Intent**: informational, research/data.
- **SERP seen** ("average pet fee vacation rental by state") [MEASURED]: RentCafe stats pages (rentcafe.com/blog/pet-friendly-housing-statistics/, long-term apartments); LandlordStudio and Apartments.com and ZipRent and Landlord Gurus explainers (long-term landlords); Hostaway glossary (hostaway.com/glossary/pet-fee/, host side); Beyond Pricing (host side); trazeetravel.com study on homestays charging most for pets; keydatadashboard.com blog (revenue, not fees). Snippet summary itself said no state-by-state vacation fee average was found.
- **Competitiveness** [ESTIMATE]: Low-Medium. Results are long-term-rental or host-side; the guest-side vacation data gap is real. [MEASURED gap: no vacation-rental guest fee dataset in the set.]
- **Commercial intent**: Medium. Funnels to the calculator and to #1.
- **Emotional hook**: "Is $250 normal? Here is what 38 managers actually charge."
- **Data**: **Strong, but be modest**: publish the distribution (range, how many state nothing, how many per-night vs flat) and a sortable table. Do not call it an average or a survey; the TS header already says "a sample ... not a survey". This is the best link-bait piece for journalists if framed correctly.
- **Pinterest/shareable**: fee-range chart per region, downloadable CSV (our own data), embeddable table with attribution.
- **Maintenance**: High. This is the most perishable asset; needs a documented annual re-read (CSV pipeline already exists: `verified-*.csv`).
- **Cannibalization**: overlaps #7 and #1. Position as "the data page" that both link to.
- **Priority rank**: 3 (high value, high upkeep; ship once the re-check process is owned)

### 4. Vacation Rental With a Reactive Dog: How to Choose a Place That Won't Set Her Off
- **Primary query**: vacation rental with a reactive dog
- **Long-tail**: traveling with a reactive dog; best vacation rental for a reactive dog; airbnb for reactive dogs
- **Intent**: informational with booking intent; high emotion.
- **SERP seen** [MEASURED]: GoPetFriendly (blog.gopetfriendly.com/pet-travel-dogs-with-issues/, www.gopetfriendly.com/blog/traveling-reactive-dog/); notesfromadogwalker.com (2013 blog post); Vtrips (vtrips.com/vacation-rentals-pet-friendly, operator); San Diego Home/Garden (2019); PureWow; Vacasa Dog-friendly page; Vacasa homeowner guide; AvantStay fenced-yard blog; Booking.com tips; a Vrbo affiliate page (vrbo.com/affiliate/D75fwgO); findrentals.com.
- **Competitiveness** [ESTIMATE]: Low. Only two pages target it directly; the rest are generic pet-rental pages and a 2013 post. [MEASURED: oldest hit dated 2013.]
- **Commercial intent / path**: Medium-High. Vrbo (filter secluded/fenced homes), `host-questions` tool (a reactive-dog question set), fence/gate and gear (affiliates pending: portable fence #21 internal link, white-noise machine).
- **Emotional hook**: "You are not a bad dog owner. You just need a house where nobody knocks on the door." Strong identity and empathy; people with reactive dogs are an underserved, loyal audience [ESTIMATE].
- **Data**: **Partial**. Our data shows fenced yards at "some cabins" (Sliding Rock, Hapey notes) and that many pages are silent; supports "ask these 9 questions" and the point that only some homes have fenced yards. Everything else is editorial: must be careful not to give behavior-medical advice; cite a trainer/vet-reviewed source or recommend a professional. Never invent first-hand experience.
- **Pinterest**: "Reactive dog rental checklist" pin; printable "Questions to ask the host about neighbors, walls, yard, and shared drives".
- **Maintenance**: Low (mostly evergreen advice, minimal prices).
- **Cannibalization**: overlaps #23 (fenced yard), #5 (leave alone), #21 (portable fence); link, don't repeat.
- **Priority rank**: 4

### 5. Vacation Rentals That Allow 3 or More Dogs (and How to Ask for Them)
- **Primary query**: vacation rental that allows 3 dogs
- **Long-tail**: pet friendly rentals 3 dogs; airbnb allow 4 dogs; cabin rental for 3 large dogs
- **Intent**: transactional/commercial investigation.
- **SERP seen** [MEASURED]: Houfy blog (Houfy.com/blog/traveling-with-pets-pet-friendly-rentals-for-furry-companions); a run of BringFido listing pages (bringfido.com/lodging/113449, /138886, /132257, /623785, /137543, /122494, /580987; bringfido.co.uk/lodging/610044); BringFido VRBO list (bringfido.com/blog/dog-friendly-vrbos/); Vacasa DC dog-friendly page.
- **Competitiveness** [ESTIMATE]: Medium-Low for the article (competition is individual listings, not guides), but the user may prefer search filters, so click-through of an article is uncertain.
- **Commercial path**: High. Vrbo; Houfy/BringFido pending; `will-my-dog-be-accepted` tool.
- **Hook**: "Two dogs is easy. Three is a negotiation."
- **Data**: **Partial**. 22 of 38 state a limit of 2; only 2 state 3 (Tahoe Vacation Rentals on a pets basis; Rosemary Beach Cottage Rental Company); 14 state none. Hapey's page says mention more than 2 dogs at booking. Twiddy's blog sample shows "one lists 4". A clear finding: "3+ is available mostly by exception; here is the script to ask".
- **Pinterest**: "Message template: asking for a 3rd dog" card.
- **Maintenance**: Low-Med.
- **Cannibalization**: HIGH vs #6 (How Many Dogs Can You Bring) and #22 (Two Dogs). Only write if it is a distinct "3+ and how to negotiate/where to look" page; consider upgrading #6 instead (see rejected list).
- **Priority rank**: 12 (cannibalization drags it down; reconsider as a section of #6)

### 6. Dog-Friendly Beach Houses Where Your Dog Can Actually Go on the Beach
- **Primary query**: pet friendly beach house rental dogs allowed on the beach
- **Long-tail**: dog friendly beach rentals east coast; which beaches allow dogs off leash vacation rental; dogs allowed on beach summer restrictions rental
- **Intent**: commercial investigation (list plus rules).
- **SERP seen** [MEASURED]: Lewes/LF Vacations (lfvacations.com/?p=5251); BringFido listings (bringfido.com/lodging/805262, /831857, /619183) and BringFido blog (bringfido.ca/blog/pet-friendly-beachfront-rentals/); Carolina Designs (assetsold.carolinadesigns.com/?p=13960); Vacasa Pacific Beach; many Expedia/Travelocity/Orbitz/Vrbo listing pages (OTA listings); Casago Daytona (casagodaytona.com/pet-friendly-rentals/).
- **Competitiveness** [ESTIMATE]: Medium-High on generic terms (OTA and directory listings), Low-Medium on a town-specific rules angle.
- **Commercial path**: High. Vrbo beach homes; others pending.
- **Hook**: "The listing says pet friendly. The beach out front says no dogs from May to September."
- **Data**: **Partial**. Our data covers 8 OBX/Hatteras managers, 4 Gulf FL, 3 St. Simons; rental policy yes, beach ordinances no. Combine our manager policies with a small table of town beach rules from primary town/NPS pages (must be re-verified; seen only in snippets: seasonal bans in Delaware towns, time windows in an NC town, Daytona restrictions).
- **Pinterest**: "Beach town dog rules cheat sheet" pins per region; seasonal calendar graphic.
- **Maintenance**: High (ordinances change annually).
- **Cannibalization**: #19 California beachfront. Build for East/Gulf coast; link to #19.
- **Priority rank**: 8 (needs a seasonal window; publish by mid-February for summer)

### 7. Outer Banks Pet-Friendly Rentals: Fees, Dog Limits and Beach Rules Compared
- **Primary query**: Outer Banks pet friendly rentals
- **Long-tail**: Outer Banks dog friendly beaches rules; OBX rental dog limit 2; pet fees Outer Banks vacation rentals
- **Intent**: commercial investigation / local.
- **SERP seen** [MEASURED]: Resort Realty (resortrealty.com/pet-friendly, /outer-banks-pet-friendly); Carolina Designs blogs and FAQ (blog.carolinadesigns.com/the-outer-banks/pet-laws-outer-banks-vacation/, carolinadesigns.com/obx-guide/faq/pet-friendly-outer-banks-rentals/, carolinadesigns.com/outer-banks-vacation/pet-friendly); outerbanks.org official tourism (outerbanks.org/plan-your-trip/beaches/pets-on-the-beach/); Twiddy (blog.twiddy.com/dog-beaches-outer-banks/, twiddy.com/outer-banks/guests/pets/); Brindley Beach, Beach Realty, Sun Realty, Outer Banks Vacations pages.
- **Competitiveness** [ESTIMATE]: High. Every result is an operator or official tourism site with a commercial stake; a new site will struggle on the head term. Better: comparison angle ("which OBX manager charges what").
- **Commercial path**: Medium: Vrbo OBX homes.
- **Hook**: "Eight Outer Banks managers, side by side."
- **Data**: **Strong for a comparison table** (8 OBX/Hatteras managers, including Twiddy $0 on listed homes, Brindley 60 lb each, Sun Realty $161 to $231, 2-dog limits). Note the search result noted conflicting sources on beach rules; use the town and NPS pages as authority.
- **Pinterest**: "OBX dog rules by town" map pin.
- **Maintenance**: High.
- **Priority rank**: 11 (strong data, tough SERP; use as a proof-of-concept regional page)

### 8. Smoky Mountains Pet-Friendly Cabins: Pet Fee and Weight-Limit Cheat Sheet
- **Primary query**: pet friendly cabins Smoky Mountains pet fee
- **Long-tail**: Gatlinburg cabins pet weight limit; Pigeon Forge cabins dogs 2 max; how many cabins in Gatlinburg allow pets
- **Intent**: commercial investigation.
- **SERP seen** [MEASURED]: PetsWelcome (petswelcome.com/pet-friendly-rentals/north-carolina/smoky-mountains, /tennessee); Bearcamp Cabins (bearcampcabins.com/blog/gatlinburg-cabins-pigeon-forge-pet-friendly-cabins); Cabins of the Smoky Mountains; Fireside Chalets (firesidechalets.com/pet-policy); Elk Springs Resort; smokymountains.com Gatlinburg blog; cabinsforyou.com; BringFido; Expedia listing; Patriot Getaways blog.
- **Competitiveness** [ESTIMATE]: High (dozens of local operators). A comparison framed around limits is differentiated; ranking still hard.
- **Path**: Medium-High: Vrbo Smokies cabins.
- **Hook**: "Most Smokies cabins don't take dogs, and the ones that do have a catch."
- **Data**: **Strong**: about 7 Smokies managers in our data with real figures: Hearthside ($55 up to 35 lb, $75 larger; up to $500 for unregistered), Aunt Bugs ($75, 40 lb, $500 fine), Elk Springs (50 lb), Cabins USA ($50, 2 pets). Search snippet claimed only about 15% of local cabins allow pets: [MEASURED in snippet only, one local lodging guide], do not repeat without opening the source.
- **Pinterest**: "Smokies cabin dog limits at a glance" table pin.
- **Maintenance**: High.
- **Cannibalization**: low vs existing guides (#12 is Georgia).
- **Priority rank**: 13

### 9. Vacation Rentals With No Dog Weight Limit (and How to Get Your 70-Pounder Approved)
- **Primary query**: vacation rentals no dog weight limit
- **Long-tail**: pet friendly rentals no size restrictions; dog weight limit vrbo; cabins that allow big dogs no weight limit
- **Intent**: commercial investigation.
- **SERP seen** [MEASURED]: Beyond Pricing host guide; GoPetFriendly (blog.gopetfriendly.com/tips-for-booking-a-pet-friendly-vacation-rental/); Vacasa Dog-friendly pages (10+ location pages, operator); pawventures.pages.dev booking guide (spam-looking). Snippet noted weight limits commonly 25 to 75 lb per one blog, 50 lb frequent on Vrbo (single-blog claim, unverified).
- **Competitiveness** [ESTIMATE]: Low-Medium for a precise page; results are generic.
- **Path**: High. Vrbo; `will-my-dog-be-accepted` tool; `pet-cost-check`.
- **Hook**: "She's 72 pounds of sweetheart and the listing says 50."
- **Data**: **Partial/Strong**: only 6 of 38 state a weight limit (35 to 65 lb; two at 35, three at 50 to 60), and Hearthside's limit is soft ("larger dogs allowed at some cabins for an extra fee"). Sliding Rock and Hapey state no weight limits. Finding: most managers don't publish a limit, so the limit lives in the listing.
- **Pinterest**: "Weight limits we found: 35 to 65 lb" graphic.
- **Maintenance**: Med.
- **Cannibalization**: HIGH vs #24 (Large Dogs). Do not publish as separate unless reframed as a negotiation/"limits we found" data page; otherwise fold into #24 (see rejects).
- **Priority rank**: 10

### 10. How to Plan a Trip Around Your Dog (A First-Trip Planner)
- **Primary query**: how to plan a vacation with your dog
- **Long-tail**: first vacation with a dog checklist; how to travel with a dog for the first time; planning a dog friendly trip step by step
- **Intent**: informational, evergreen.
- **SERP seen** [MEASURED]: Elanco (yourpetandyou.elanco.com/us/lifestyle/how-to-travel-with-a-dog); Vetster; Dogster (two pages); PetMD (petmd.com/dog/general-health/how-to-travel-with-your-dog-the-ultimate-guide); SmarterTravel; Four Paws; TopTenReviews; Spot & Tango; a Houston Chronicle reprint; susangarrettdogagility.com (2026-07 blog); several small blogs.
- **Competitiveness** [ESTIMATE]: High. Head term owned by brand and vet sites.
- **Path**: Medium. A hub linking to checklist, packing list, cost, car safety, first aid; tools: `checklist`, `packing-list`.
- **Hook**: "Start with the dog, not the destination."
- **Data**: **Weak**; best used as a hub with our fee/limit findings as the "lodging step". Value is internal linking (topical authority), not direct traffic.
- **Pinterest**: strong; "12-week dog trip planning timeline" pin and printable.
- **Maintenance**: Low.
- **Cannibalization**: overlaps #20 checklist and #11 packing list; make it a navigational hub.
- **Priority rank**: 9 (write after 4 to 6 supporting pieces exist so the hub has something to link to)

### 11. Romantic Weekend Getaway With Your Dog (Cabins, Hot Tubs and Dog-Friendly Dinners)
- **Primary query**: romantic getaway with dog
- **Long-tail**: dog friendly romantic cabins hot tub; Valentine's Day weekend with dog; couples getaway with dog US
- **Intent**: inspirational/list, commercial.
- **SERP seen** [MEASURED]: Pets Pyjamas (many petspyjamas.com/s/travel/... UK filter pages); BringFido UK blog (bringfido.co.uk/blog/pet-friendly-valentines-day-hotels/). Result set was UK-dominated; US-side competition was thin in this set (US picks were from the BringFido blog).
- **Competitiveness** [ESTIMATE]: Low-Medium for US, but SERP not fully understood from one query; check US-specific variants before writing.
- **Path**: High. Vrbo cabins with hot tubs; hotels pending.
- **Hook**: "Romance with a dog snoring at the foot of the bed."
- **Data**: **Weak**. Our fee data can add "what a hot-tub cabin with dog costs", and the note that Sun Realty and Brindley Beach bar pets from pools and hot tubs gives a useful warning. Mostly editorial list; photos matter.
- **Pinterest**: **Excellent**; cabin and fireplace imagery, seasonal.
- **Maintenance**: Med (named properties churn).
- **Time-sensitive**: Valentine's Day is 2027-02-14; publish by about Week 4 (mid-December) so it is indexed and pinned 6+ weeks early [ESTIMATE].
- **Priority rank**: 6

### 12. Unusual Stays You Can Book With a Dog (Treehouses, Yurts, Tiny Homes, Airstreams)
- **Primary query**: unique dog friendly stays
- **Long-tail**: dog friendly treehouse rental; dog friendly yurt; dog friendly tiny house airbnb; glamping with dogs USA
- **Intent**: inspirational list.
- **SERP seen** ("unique dog friendly stays treehouse yurt glamping with dogs") [MEASURED]: result set was almost entirely Pets Pyjamas UK filter pages (petspyjamas.com/s/travel/dog-friendly-glamping-...). No US editorial lists appeared in this set.
- **Competitiveness** [ESTIMATE]: Medium: the thin US result set suggests an opening, but my single query was UK-skewed; I would run US-phrased variants before committing. Also high competition from Airbnb/Hipcamp-type directories likely [ESTIMATE, not seen].
- **Path**: Medium. Vrbo unique stays; others pending.
- **Hook**: "A treehouse is a lot less charming when your dog can't do the stairs."
- **Data**: **None**; the angle must come from curation plus our checklist of unusual-stay pitfalls (stairs, ladders, shared decks, wildlife, no fence). Risk of being a thin list.
- **Pinterest**: **Excellent**, highly visual.
- **Maintenance**: High (listings vanish).
- **Priority rank**: 17 (shareable but weak on differentiation and upkeep)

### 13. Can Dogs Go in the Rental's Pool or Hot Tub? What House Rules Usually Say
- **Primary query**: can dogs go in vacation rental pool
- **Long-tail**: dogs in hot tub airbnb rules; pet friendly rental with private pool; dog friendly vacation rentals with pool fence
- **Intent**: informational with booking angle.
- **SERP seen** [MEASURED]: mostly property pet-policy pages (eagleridge.com pet hot tub policy, myvacationhaven.com pet-policy, margaritavilleresorts.com FAQ, bigcedar.com dog-friendly PDF, twiddy.com service-animals page), Expedia listing, Vacasa pet-friendly page, a few unusable spam-looking pages. Snippet reported most policies bar dogs from pool/hot tub.
- **Competitiveness** [ESTIMATE]: Low. No guide-style page seen; competition is policy pages for individual properties.
- **Path**: Medium. Vrbo private-pool filter; pool safety gear affiliates pending (dog life vest, pool ramp).
- **Hook**: "The listing has a pool. Does your dog get near it?"
- **Data**: **Partial**: Sun Realty and Brindley Beach `rules_notes` say no pets in pools or hot tubs [MEASURED in docs/data/pet-policies-north-carolina.csv]; verify more in remaining CSVs before counting. Could add a column to the dataset (small update).
- **Pinterest**: moderate.
- **Maintenance**: Low-Med.
- **Priority rank**: 7

### 14. Traveling With a Puppy to a Vacation Rental: Age Rules, Accidents and Deposits
- **Primary query**: traveling with a puppy vacation rental
- **Long-tail**: do vacation rentals allow puppies; puppy age minimum pet friendly rental; take puppy to airbnb
- **Intent**: informational, high anxiety.
- **SERP seen** [MEASURED]: Cottage Life, Kayak (ca.kayak.com/news/?p=18418), KH Pet blog, Resort Realty (resortrealty.com/?p=1938), Whimstay, Xplorie, DogTV Unleashed, AKC (two pages), Emerald Coast By Owner, Chewy (two pages), VCA, TravelAwaits.
- **Competitiveness** [ESTIMATE]: Medium-High (AKC, Chewy, VCA), but the puppy-age-rules angle is narrower.
- **Path**: Medium. Gear (pads, crate), Vrbo.
- **Hook**: "She's 14 weeks old and the listing says adult dogs only."
- **Data**: **Partial**: A Blue Ridge Cabin Rental requires pets at least 18 months old and house-trained (CSV); Resort Realty "no puppies" seen in search snippet only. Useful because puppy exclusion is a hidden rule.
- **Pinterest**: moderate to good (puppy audience).
- **Maintenance**: Low-Med.
- **Cannibalization**: low; touches #5.
- **Priority rank**: 14

### 15. How to Help Your Dog Settle in a Vacation Rental (First Night to Day Three)
- **Primary query**: help dog settle in vacation rental
- **Long-tail**: dog won't settle in new place first night; anxious dog airbnb tips; dog barking first night rental
- **Intent**: informational, emotional.
- **SERP seen** [MEASURED]: woodfarmbarns.com, yourdog.co.uk settling-on-holiday, PetSmart, Yumove, pawsandstay.co.uk, petsradar, Dogster, Better Pet, Tractive (moving-house), Sniffspot. The set skews UK and "moving house"; few US rental-specific pages.
- **Competitiveness** [ESTIMATE]: Medium. Rental-specific US angle is open; brand vet and pet sites dominate adjacent "new home" queries.
- **Path**: Low-Medium: gear affiliates pending (calming bed, white noise); Vrbo minimal.
- **Hook**: "The first night is the hard one. Here's the routine that makes it easier."
- **Data**: **Weak**; useful only for linking to rule-of-the-rental (crate when alone, per our CSV `rules_notes`).
- **Pinterest**: good ("First night checklist").
- **Maintenance**: Low.
- **Cannibalization**: #5 and #9 touch; keep to settling behavior.
- **Priority rank**: 15

### 16. Dogs and Pet Fees at Hotels: Chain by Chain (With a Rule for Spotting Fee Traps)
- **Primary query**: hotel pet fees by chain
- **Long-tail**: dog friendly hotel chains pet fees 2026; Kimpton pet fee; La Quinta pet policy
- **Intent**: informational/list.
- **SERP seen** [MEASURED]: Booking.com tips; Catster (two pages); Django Brand blog; NerdWallet (nerdwallet.com/travel/learn/best-hotels-that-allow-pets, nerdwallet.com/article/travel/traveling-with-pets-tips); Dogster (three pages); hotelierschoice.com/blog/hotel-pet-fees-by-brand/; pawventures.pages.dev (two, spam-looking); pawholt.pages.dev; AARP (aarp.org/travel/travel-tips/save-on-hotel-pet-fees/); directbooker.ai; petholidayclub.com; travelbulletin.com. Snippet noted most are affiliate/SEO blogs and no chain-by-chain table from the brands themselves was found.
- **Competitiveness** [ESTIMATE]: High (NerdWallet, Dogster, AARP). Prior repo research (docs/RESEARCH-DEMAND.md, query 4) reached the same conclusion on the head term.
- **Path**: Medium. Hotel affiliate programs pending; no Vrbo link fit.
- **Hook**: "The chain says pets welcome. The fine print says $150 per stay and 40 pounds."
- **Data**: **None** (our dataset is vacation rentals only). Value would be primary-source citation of each brand's page.
- **Pinterest**: good, but lists age fast.
- **Maintenance**: **HIGH, flag as upkeep risk.** Every chain fee must be re-verified from the brand's own page each quarter; one stale number damages trust. A buyer inherits that liability.
- **Priority rank**: 19 (only if we commit to quarterly re-checks; off-strategy for a rentals-focused site)

### 17. Christmas Week in a Cabin With Your Dog: Holiday Rules, Surcharges and Tree Safety
- **Primary query**: Christmas cabin with dog
- **Long-tail**: dog friendly cabin christmas; holiday week pet fee vacation rental; dog friendly christmas getaway US
- **Intent**: seasonal list/informational.
- **SERP seen** [MEASURED]: BringFido UK blog, countrycottagesonline.com (many pages, UK), dogfriendlycottages.co.uk, BringFido listing (bringfido.com/lodging/572527), Expedia/Travelocity/Vrbo listings (vrbo.com/3150487). UK-skewed.
- **Competitiveness** [ESTIMATE]: Low-Medium for US-specific seasonal content; but window is closing: Christmas is 37 days away, and a new site likely will not be indexed and ranking in time [ESTIMATE]. Treat as an evergreen annual page refreshed each October.
- **Path**: Medium. Vrbo.
- **Hook**: "A dog, a fireplace and a tree to knock over."
- **Data**: **Partial**: our "holiday_or_peak_surcharge" CSV column is mostly "not stated" (observed in the CSV heads), supporting "ask about holiday pricing". NYE guide (#8) already covers fireworks; link and avoid duplication.
- **Pinterest**: **Excellent** and seasonal, but Pinterest content generally needs to be live weeks before the season [ESTIMATE].
- **Maintenance**: Low once built (annual refresh).
- **Cannibalization**: medium vs #8.
- **Priority rank**: 5 (publish immediately for 2026 and treat 2027 as the real target)

### 18. Do Service Dogs Pay Pet Fees at Vacation Rentals? What Airbnb, Vrbo and the ADA Say
- **Primary query**: service dog pet fee vacation rental
- **Long-tail**: airbnb service animal policy; vrbo service animal fee; emotional support dog vacation rental fee
- **Intent**: informational, high-intent, needs accuracy.
- **SERP seen** [MEASURED]: igms.com/vrbo-service-animal-policy; hospitable.com (airbnb-esa-policy, vrbo-service-animal-policy); Turno; Uplisting; Lodgify; dutch.com/blogs/dogs/airbnb-for-dogs; community.hospitable.com; Guesty help; pawventures.pages.dev (spam-looking). Snippet noted the results were mostly third-party host-tool blogs, not platform help pages.
- **Competitiveness** [ESTIMATE]: Low-Medium; results are host-focused, so a guest-focused version is open.
- **Path**: Low (not a booking driver; trust/authority piece).
- **Hook**: "Know your rights before you're charged."
- **Data**: **None** beyond our existing FAQ in #7 (cites DOJ and Airbnb). Legal accuracy risk; must cite primary sources (ADA, Airbnb and Vrbo help pages); avoid legal advice tone.
- **Pinterest**: low.
- **Maintenance**: Med (policies change; legal wording).
- **Cannibalization**: partly answered in #7 FAQ; separate article only if we add depth. Risk of attracting ESA-letter spam intent [ESTIMATE].
- **Priority rank**: 18

### 19. How to Spot a "Pet-Friendly" Listing That Isn't: Red Flags Before You Book
- **Primary query**: pet friendly vacation rental red flags
- **Long-tail**: how to tell if a rental is really dog friendly; pet friendly airbnb tips what to check; vrbo house rules pet policy where to find
- **Intent**: informational/prebooking checklist.
- **SERP seen** [MEASURED]: Booking.com tips (pet-friendly-holiday-rentals-tips); Afar (afar.com/magazine/how-to-find-a-pet-friendly-airbnb-or-vacation-rental); Casago; Better Pet; Lodgify; Matador/Yahoo/TravelPulse "30 vacation rental mistakes"; Hostex; pawventures.pages.dev (two).
- **Competitiveness** [ESTIMATE]: Medium; the exact "red flags" angle isn't seen, but Afar and Booking.com occupy adjacent ground.
- **Path**: High. Vrbo; `host-questions` and `checklist` tools are a natural fit.
- **Hook**: "It said pet friendly. It meant one 15-pound dog."
- **Data**: **Strong/Partial**: 13 of 38 managers state no fee; 31 of 38 state no breed policy; many say "only some homes allow pets" (our `only_some_properties_allow_pets` field). Evidence for "policy pages are silent; ask for it in writing".
- **Pinterest**: good ("7 red flags" pin).
- **Maintenance**: Low.
- **Cannibalization**: HIGH vs #20 (Pet-Friendly Vacation Rental Checklist) and `host-questions` tool. Treat as an upgrade of #20 unless the angle is demonstrably different.
- **Priority rank**: 16

### 20. Road Trip With Your Dog: Where to Stop, How Often, and What to Do at the Rental End
- **Primary query**: road trip with dog how often to stop
- **Long-tail**: how long can a dog ride in a car without a break; dog road trip checklist; dog car sickness road trip tips
- **Intent**: informational.
- **SERP seen** [MEASURED]: youdidwhatwithyourweiner.com (two); Wag Walking; FirstVet; Chewy; sidewalkdog.com; AKC; Camping World; HowStuffWorks; citizenshipper.com (two); jetsetterguide; dogtrotting.net; wagbar.com; a spam-looking travellingholidays2022.pages.dev.
- **Competitiveness** [ESTIMATE]: High; AKC, Chewy, FirstVet and many established pet blogs.
- **Path**: Medium. Car gear (affiliates pending); our #10 car-safety guide is the money page.
- **Hook**: "The 100-mile rule" style hooks work for competitors; ours would be "plan the stops before the destination".
- **Data**: **None**. Differentiator would be a stop-planner tool, which does not exist.
- **Pinterest**: good.
- **Maintenance**: Low.
- **Cannibalization**: #10 (car safety), #11, #16 gear guides.
- **Priority rank**: 20

## 4. Summary table

| Rank | Working title (short) | Competitiveness [ESTIMATE] | Data power | Upkeep | Time-sensitive |
|---|---|---|---|---|---|
| 1 | No pet fee rentals | Med-Low | Strong | Med | No |
| 2 | True cost of a dog on a rental | Medium | Strong/Partial | Low-Med | No |
| 3 | Pet fees at 38 managers | Low-Med | Strong | High | No |
| 4 | Reactive dog rental | Low | Partial | Low | No |
| 5 | Christmas cabin with a dog | Low-Med | Partial | Low | Yes (now) |
| 6 | Romantic weekend with a dog | Low-Med | Weak | Med | Yes (Feb 14) |
| 7 | Dogs in the pool or hot tub | Low | Partial | Low-Med | No |
| 8 | Beach houses, beach rules | Med-High | Partial | High | Yes (Memorial Day) |
| 9 | Plan a trip around your dog (hub) | High | Weak | Low | No |
| 10 | No weight limit rentals | Low-Med | Partial/Strong | Med | No |
| 11 | OBX pet-friendly compared | High | Strong | High | Summer |
| 12 | 3+ dogs | Med-Low | Partial | Low-Med | No |
| 13 | Smokies pet cheat sheet | High | Strong | High | No |
| 14 | Puppy at a rental | Med-High | Partial | Low-Med | No |
| 15 | Settle a dog in a rental | Medium | Weak | Low | No |
| 16 | Red flags in "pet-friendly" listings | Medium | Partial | Low | No |
| 17 | Unusual stays with a dog | Medium | None | High | No |
| 18 | Service dog pet fees | Low-Med | None | Med | No |
| 19 | Hotel chain pet fees | High | None | High | No |
| 20 | Road trip stops | High | None | Low | No |

Strategic note [ESTIMATE]: ideas 1, 2, 3, 7, 10 and 16 are the only ones that use what no competitor has (our dataset and tools) on queries where the result sets looked weak or host-oriented. Ideas 11, 13, 19 and 20 compete head-on with operators or established brands and add upkeep; they should be published only as supporting pages once authority exists.

## 5. Recommended 90-day sequence (Weeks 1 to 12, starting week of 2026-11-23)

Principle: front-load time-sensitive pieces and the easiest wins; publish 2 pieces per week early, then 1 to 2 per week; update 1 existing guide per fortnight with internal links from the new ones. All dates are [ESTIMATE] schedule suggestions.

| Week | Publish | Why now |
|---|---|---|
| 1 (Nov 23) | **#17 Christmas cabin with a dog**; **#1 No pet fee rentals** | Christmas is 37 days out (best-effort for 2026, annual afterwards); #1 is the flagship data story |
| 2 (Nov 30) | **#2 True cost of a dog on a rental** | Pre-holiday budgeting; builds on #1 and the calculator |
| 3 (Dec 7) | **#4 Reactive dog rental** | Low competition, high loyalty, evergreen |
| 4 (Dec 14) | **#11 Romantic weekend with a dog** | Needs indexing and Pinterest lead time before Feb 14 |
| 5 (Dec 21) | **#13 Dogs in the pool or hot tub** (short); refresh #8 NYE internal links | Quiet holiday week: short, easy piece |
| 6 (Dec 28) | **#3 Pet fees at 38 managers (data page)**, positioned for New Year trip-planning season | Booking surge early January [ESTIMATE]; needs the re-check process documented first |
| 7 (Jan 4) | **#19 Red flags** (or upgrade the existing checklist instead) | Booking-season fit |
| 8 (Jan 11) | **#10 No weight limit** (only as a distinct data angle; otherwise fold into the large-dogs guide) | Uses the same data page |
| 9 (Jan 18) | **#14 Puppy at a rental** | Post-holiday puppy owners [ESTIMATE] |
| 10 (Jan 25) | **#12 3+ dogs** (or fold into #6) | Same-cycle internal linking |
| 11 (Feb 1) | **#8 Beach houses and beach rules** (East/Gulf), aimed at summer planning | Needs to be indexed before spring/summer planning |
| 12 (Feb 8) | **#15 Settle a dog** or hub **#9 Plan a trip around your dog** | Hub can link to all new pieces |

Defer past day 90: #7 OBX and #13 Smokies (competitive, high upkeep), #17 unusual stays, #18 service dogs, #19 hotel chains, #20 road trip stops.

Ordering rule of thumb: ship every data-led piece (1, 2, 3, 10) with a dated "last checked" and an entry in the re-check log before publishing; a buyer's biggest risk is stale numbers.

## 6. Five ideas rejected

1. **"Best dog-friendly vacation rentals" (generic list)**: the head term is owned by Vacasa, Vrbo, BringFido, PureWow and AARP in the result sets above [MEASURED], and we have no listing inventory or first-hand stays; no differentiation.
2. **Airline pet policies / "flying with a dog"**: the result sets for cost queries are dominated by AmEx and other big brands on flying [MEASURED], policies change constantly (High upkeep), and the site's strength is rentals, not air travel.
3. **Emotional support animal letters / ESA at rentals**: attracts letter-mill intent, carries legal accuracy risk and trust risk; keep to a careful service-dog explainer (#18) at most, or do nothing.
4. **"Best dog-friendly beaches in the US"**: crowded by established brand lists and destination boards; ordinances change; no data advantage. Beach rules fit only in a rental-tied form (#8).
5. **Separate "How many dogs"-style duplicates (4 dogs, 5 dogs, two-dog vs three-dog)**: cannibalize #6 and #22 and fragment authority; better to add a 3+ section to #6 than to publish #12 separately (note: I ranked #12 as a standalone only 12th; consider this a fifth rejection if it can't be given a distinct angle).

## 7. What to do before writing any of these

[ESTIMATE] recommendations, not findings:
1. Decide and document one owner for the dataset re-check (every named manager page, twice a year) before shipping #1, #3, #10.
2. Re-run the US-specific variants of the #11, #12 and #17 queries; two of my result sets (romantic, unusual stays, Christmas) were UK-dominated, so the US competitive picture is not established.
3. Open the primary pages behind every figure that appeared only in a search snippet (Daytona, Delaware towns, Gatlinburg 15 percent, Vrbo 50 lb) before using it.
4. Add two columns to the dataset (pool/hot-tub rule, minimum dog age) to power #13 and #14.
5. Resolve cannibalization by upgrading existing guides (#6, #24, #20) rather than adding near-duplicates (see 12, 10, 19 above).
