# Audience research: what dog travelers struggle with and ask for

Researched 2026-11-17 for Paws & Passage (launch regions: North Georgia mountains, coastal California).

## Read this first: limits of this research

Labels used throughout:

- **SEEN** = I fetched the page and read it myself (via WebFetch, which summarizes the page; I did not read raw HTML).
- **REPORTED** = taken from a web-search result summary. I did not open the underlying page. Treat as secondhand.
- **NOT CONFIRMED** = looked for it, could not verify.

What I could and could not reach:

- **Reddit: NOT CONFIRMED.** The search tool refuses `reddit.com` as a domain. Ordinary searches for r/dogs, r/travel, r/VRBO, r/AirBnB, r/camping, r/RVLiving and r/CaliTravel returned no Reddit threads. A fetch of one Reddit mirror returned HTTP 403. The only Reddit material I have is REPORTED: search summaries that paraphrase a couple of r/AirBnB and r/airbnb_hosts threads (links in the source list). No r/dogs, r/travel, r/VRBO, r/camping, r/RVLiving or r/CaliTravel threads were read or even surfaced.
- **Airbnb Community forum:** search results listed many threads, but fetches redirected to a new community site and did not load the posts. Everything about those threads is REPORTED.
- **Vrbo community, Tripadvisor forums, Quora: NOT CONFIRMED.** Vrbo returned only host-side forums (Hospitable, OwnerRez). Tripadvisor returned nothing relevant (a Fodor's thread, not dog-related). Quora returned nothing.
- **Reviews of dog travel sites:** BringFido on Trustpilot (SEEN, one page of about 20 reviews out of about 440) and on an app-review aggregator (SEEN, 28 reviews). Other BringFido figures (BBB, SmartCustomer) are REPORTED.
- **Blog comments:** one comment page read (Whole Dog Journal, seat belts; SEEN).

Consequences:

1. "In their own words" is only partly met. Most paraphrases below come from Airbnb-forum and review-site summaries, not Reddit.
2. **Frequency ratings are rough and based only on how often a theme appeared in the small sample above.** They are not volumes. I have no search counts or traffic numbers and do not claim any.
3. The host-side forums over-represent host complaints (guests sneaking dogs in). I note this where it applies.
4. Recommended follow-up: someone with a normal browser should spend an hour in r/dogs, r/AirBnB, r/VRBO and r/CaliTravel to validate the ranking.

---

## Pain points by stage

Frequency key: frequent / occasional / rare, based only on the sample above.

### (a) Rental and hotel stage

| # | Pain point | Frequency (in my sample) | Representative paraphrase | Help that would solve it | Evidence |
|---|---|---|---|---|---|
| A1 | Pet fee appears or grows after booking, or is per pet / per night when the guest assumed a flat fee | **Frequent** (several separate Airbnb-forum threads, a Trustpilot complaint, hotel-fee advice pieces) | "Listing said $100 pet fee; turned out to be per pet." "Host asked for $125 per pet after the stay even though a fee was on the receipt." "App said no pet fee, hotel charged $50 per pet after I paid." | **Calculator** (all-in cost: fee x pets x nights, deposit, cleaning) plus a **question script** for hosts | REPORTED (Airbnb forum threads via search summary: [Pet fee change after booking](https://community.withairbnb.com/t5/Help/Pet-fee-change-after-booking-Suggestions-on-how-to-handle/td-p/1337329), [Undisclosed Extra Pet Fee](https://community.withairbnb.com/t5/Help/Undisclosed-Extra-Pet-Fee-Would-you-pay-it/m-p/1148890)). SEEN: Trustpilot review of BringFido ([page 2](https://ca.trustpilot.com/review/bringfido.com?page=2)) mentions a hotel that stopped accepting dogs and charged anyway; the "$50 per pet" quote is REPORTED. |
| A2 | After-stay "pet cleaning" / dog-hair charges, including on listings that said pets were allowed | **Occasional** | Guest charged extra for dog hair at a pet-friendly property; another asked to pay $90 for towels and linens after a $300 non-refundable pet fee. | **Template** (pre-stay written confirmation of what fees cover) and a short **dispute guide** | REPORTED (search summary of a news item and a Reddit thread; no page opened) |
| A3 | Conflicting policy information between platform and host: listing says pets OK, house manual or rules say otherwise, or the platform's fee rules changed | **Occasional** | A 2025 r/airbnb_hosts thread has one commenter saying hosts can no longer add a pet fee and another saying they still can if it is listed and paid via Airbnb. I could not tell which is current. | **Verified lookup** of current platform rules with a last-checked date. **Alert** when rules change | REPORTED ([r/airbnb_hosts mirror](https://pol1.lr.ggtyler.dev/r/airbnb_hosts/comments/1jwq3ub/new_fee_structure)) |
| A4 | On Vrbo, the pet fee may not show up unless the guest enters the pet in the guest count | **Occasional** (host-forum only) | Hosts say guests often do not list a pet, so the fee is missing from the booking; they advise putting the pet count in the guest field. | **Checklist** ("how to book so the fee shows up and is on the receipt") | REPORTED, from host forum ([Hospitable community](https://community.hospitable.com/industry-conversations-33/undisclosed-pets-1772)). Host-side view only. |
| A5 | "Fenced yard" that is not fully fenced | **Occasional** (one concrete complaint, a recurring Airbnb-forum thread title, and a missing-filter complaint) | A guest found the yard fenced on three sides only; a second "yard" was tiny and open. Posters say there is no fenced-yard filter and hosts often omit or mislabel the amenity. | **Checklist** of questions (height, gaps, gate latch, dimensions, photos) and a **review-keyword search tip** | REPORTED (search summary of a Vrbo listing review and the Airbnb [Fenced yard](https://community.withairbnb.com/t5/Support-with-your-bookings/Fenced-yard/m-p/1903059/highlight/true) threads; Airbnb Community pages did not load for me). |
| A6 | Breed and weight limits, "pet-tolerant" not pet-friendly, cap on number of pets, "case-by-case approval" | **Frequent** in advice articles; user complaints seen are fewer | Hotels with a 5-lb cap, or staff questioning a dog's breed at check-in. Typical caps are 40 to 50 lb, but policy is set per property, not per chain. | **Lookup / filter** by dog size and breed, plus a **call script** | SEEN: [DogTrekker hidden-costs article](https://dogtrekker.com/traveling-pets-california-beware-hidden-costs/) (author's opinion; the page had no reader comments). REPORTED: [PetTravel](https://www.pettravel.com/information/articles/pet-friendly-hotel-policies/), Hyatt/NerdWallet figures via search summary. |
| A7 | Directory listings out of date (hotel dropped dog policy; reservation sent to a hotel that did not know about the dog) | **Frequent among reviews of dog-booking sites** (about 4 of 28 app reviews on listing accuracy, about 5 of 28 on reservation problems; about 2 of about 20 Trustpilot reviews on hotels unprepared for pets) | Users ask the site to verify that places are really pet-friendly. | **Verified lookup with "last verified" date and source link**; **alert** when the source changes | SEEN: [app-review aggregator](https://justuseapp.com/en/app/682820712/bringfido/reviews) (counts are the page summarizer's, over 28 reviews only), [Trustpilot page 2](https://ca.trustpilot.com/review/bringfido.com?page=2). Most reviews on both pages were positive. |
| A8 | Guest vs host confusion over service animal vs pet (fee exemptions) | **Occasional** (mostly host forums) | Hosts expect guests to claim "service animal"; Vrbo says hosts cannot charge pet fees for service animals but may for emotional support animals. | **Plain-language explainer** (static content) | SEEN: [Hospitable summary of Vrbo policy](https://hospitable.com/vrbo-service-animal-policy) (vendor blog, not Vrbo's own page). REPORTED: Airbnb host-forum threads. |
| A9 | How people verify before booking | Advice is consistent across sources | Call or message the property; get fees per stay/night/pet in writing; read reviews for "dog"; ask for photos of the fence. | **Checklist + message template** | REPORTED (AARP, Rover and similar advice pieces via search summary) and SEEN (DogTrekker). |

### (b) Road trip

| # | Pain point | Frequency | Representative paraphrase | Help | Evidence |
|---|---|---|---|---|---|
| B1 | "Crash-tested" label confusion: marketing claims vs independent testing, clip-on tethers, harness fit, large dogs, cargo area of an SUV | **Frequent in comment sections and guides** | Readers doubt that many products pass real tests, owners of very large dogs cannot find restraints that fit, and many ask for updated crash-test reviews. | **Selector / checklist** ("what to look for; what to ignore"), size-aware, with an honest note on what is and is not independently certified | SEEN: [Whole Dog Journal comments](https://www.whole-dog-journal.com/blog/zeal-of-the-convert-canine-seat-belts/comment-page-2/) (one page). REPORTED: Rover and retailer guides, including the Center for Pet Safety being named as an independent certifier. Retailer sources have a sales interest. |
| B2 | State restraint requirements unclear | **Occasional** (guides, not user complaints) | Few states have dog-specific restraint rules; most enforcement is through distracted-driving or animal-cruelty laws; sources conflict and are old. | **Lookup by state along a route**, with a last-verified date | REPORTED ([Pew 2017](https://www.pewtrusts.org/research-and-analysis/blogs/stateline/2017/12/20/distracted-dogging-legal-in-most-states-controversial-in-all), [GoPetFriendly](https://gopetfriendly.com/blog/state-laws-require-pets-to-be-restrained-in-vehicles), others). Sources disagreed on which states; I do not state a list. |
| B3 | Heat: dogs left in parked cars, "quick stops," cracked windows, even air-conditioned SUVs | **Frequent as news/advocacy content; no user-voice sample** | Incident logs show deaths on mild days; a Dallas news item describes heatstroke in an air-conditioned SUV. | **Checklist + alert** (temperature-based "do not leave" reminder, break planner) | REPORTED ([PETA annual logs](https://www.peta.org/features/dogs-and-other-companion-animals-suffer-heat-related-deaths/2025-incidents/), [CBS Texas](https://www.cbsnews.com/amp/texas/news/dog-dies-of-heat-stroke-after-riding-with-owners-in-air-conditioned-suv)). PETA is an advocacy source and counts only reported incidents. |
| B4 | How often to stop, where dog-friendly rest stops are | **NOT CONFIRMED** (no user discussion found) | | **Map / planner** if validated | NOT CONFIRMED |

### (c) Destination stage

| # | Pain point | Frequency | Representative paraphrase | Help | Evidence |
|---|---|---|---|---|---|
| C1 | California beaches: most state beaches ban dogs, off-leash is local and seasonal, signage and sources disagree | **Frequent as a theme in guides** (every guide emphasizes check-before-you-go); no first-hand user complaint seen | Same city can mix rules (e.g. Morro Bay State Park allows leashed dogs but Morro Strand State Beach does not; Oceanside bans dogs in peak season, allows limited off-leash hours in the off-season). | **Lookup by beach** (dogs yes/no, leash, hours, season), **map**, "last verified" date | SEEN: [California State Parks dog page](https://www.parks.ca.gov/dogs) (baseline: 6-ft leash, dogs barred from most beaches and trails, each park differs). REPORTED: Dogster, DogTrekker, Coastkeeper and local guides via search summary; some are from 2014. A search result suggested one official page would stop updating on 1/30/2026; I could not confirm which. |
| C2 | Georgia trails: jurisdiction differences (national forest vs National Recreation Area vs state parks), no statewide leash law | **Occasional** (no user voice; agency pages) | Forest Service asks for restraint in developed sites and swim areas; the Chattahoochee River NRA requires a 6-ft leash and is enforcing it. | **Lookup by trail/area** naming the managing agency | REPORTED (search summaries of [Forest Service](https://fs.usda.gov/r08/chattahoochee-oconee/safety-ethics) and [NPS](https://www.nps.gov/chat/planyourvisit/pets.htm) pages; I did not open them). |
| C3 | Restaurant patios: California allows dogs on patios under conditions, but counties interpret differently, and one county page appears to conflict with another source | **Occasional** | The business must opt in, post notice, and have a separate patio entrance; local health departments vary. | **Lookup / explainer** | REPORTED (county health department PDFs and news via search summary; 2014 to 2015 era). |
| C4 | Wildlife and hazards on trails (venomous snakes, bears) | **Rare in my sample** | The national forest lists rattlesnakes and copperheads; I found no first-hand dog-and-bear discussion. | **Region briefing** | REPORTED (Forest Service page via search summary). Bear guidance for dogs: NOT CONFIRMED. |

### (d) Emergencies

| # | Pain point | Frequency | Paraphrase | Help | Evidence |
|---|---|---|---|---|---|
| D1 | Finding an emergency or 24-hour vet in an unfamiliar area; knowing the poison-control numbers; xylitol and similar ingestions | **Occasional in vet content; no user-voice sample** | Advice: save emergency vet numbers and poison hotlines before the trip; call early, do not wait for symptoms; bring packaging. | **Printable trip card** (route/region vets, hotline numbers, "what to do first") | REPORTED (vet-hospital and Chewy pages via search summary; ASPCA 888-426-4435 and Pet Poison Helpline 855-764-7661 are quoted there; verify before publishing). Do not give dosing or treatment advice; defer to a vet. |
| D2 | Heat illness | See B3 | | | |

### (e) Flying and hotels (air)

| # | Pain point | Frequency | Paraphrase | Help | Evidence |
|---|---|---|---|---|---|
| E1 | Airline carrier-size rules differ by airline and even by aircraft; sources disagree on exact dimensions; large dogs generally cannot go in cabin | **Occasional** (guide content; no user voice) | "Assume the approved carrier is your carry-on"; confirm dimensions with the airline for the aircraft type. | **Lookup / checker** with source link and date; **checklist** | REPORTED (Chewy, Thrifty Traveler, Air Canada page via search summary). Dimension figures conflicted between sources, so none are repeated here. |

---

## Top 12 jobs to be done, ranked

Ranking = (pain intensity) x (how often it appeared) x (how poorly existing sites serve it). All three factors are my judgment on a small, partly secondhand sample, not measurements. "Existing sites" = what I saw: directories (BringFido-style listings), platform filters, and general guide blogs.

AI-chatbot column (opinion): **Satisfies / Partly / Poorly**.

| Rank | Job to be done | Why it ranks here | Best tool type | Would a generic AI chatbot satisfy it? |
|---|---|---|---|---|
| 1 | Know the **all-in pet cost and rules before booking** (fee per pet, per night or stay, deposit, cleaning, number-of-pets cap) and get it in writing | Most repeated pain (A1, A2, A3, A4); money lost; platforms show it late or inconsistently | **Calculator + question script + "get this in writing" template** | **Partly.** It can explain the questions and do the arithmetic, but it cannot know a specific property's current fee or the platform's current rules. Value is in the structured, saved tool and a verified rule summary. |
| 2 | Find **where dogs are actually allowed at the destination** (beach, trail, park, patio), with leash rules and season/hours | Rules vary by tiny jurisdiction; sources conflict and age (C1, C2, C3); our two launch regions are exactly where this is messy | **Lookup / map** with a verified-on date and a link to the managing agency | **Poorly.** Needs current, location-specific data. A chatbot may repeat stale or wrong rules with confidence. |
| 3 | **Verify a "fenced yard"** and other amenity claims before booking | Concrete, recurring (A5); no platform filter; failure is a safety issue (escape) | **Checklist + host message template + review-search tip** | **Partly.** It can write the checklist. It cannot verify any listing, so the tool's value is the ready-to-send questions. |
| 4 | **Avoid and handle after-stay charges** (pre-stay confirmation, screenshots, dispute path) | Money and stress (A2, A3); disputes go through platform processes that change | **Template pack + short guide** | **Partly.** General advice is easy; current platform-specific dispute steps are not. |
| 5 | **Screen by breed and weight limits** and spot "pet-tolerant" red flags | Hits many dogs, especially large ones (A6); often discovered at check-in | **Filter / lookup + call script** | **Poorly to partly.** The red-flag list is easy; limits are per property and change. |
| 6 | **Emergency preparedness on the road**: nearest 24-hour vet, poison hotlines, first steps | Highest stakes, though I found no user-voice sample (D1); generic content is plentiful but not route-specific | **Printable region/route card** | **Partly.** It can give the first-steps outline, but the vet list needs verified local data (hours, 24-hour status). |
| 7 | **Choose a restraint** without being fooled by "crash-tested" marketing | Frequent confusion (B1), and a retail sales environment | **Selector / checklist**, honest about certification | **Partly.** It can explain the issue but tends to list brands from marketing; independent test data needs a verified source. |
| 8 | **Keep the dog safe from heat** during the drive and at stops | High severity; widely covered (B3); user pain not directly sampled | **Checklist + temperature-based alert / break planner** | **Satisfies mostly** for the general advice. Weaker for a live local-temperature alert. |
| 9 | **Know state rules for restraint** along a route | Sources conflict (B2); lower frequency; low enforcement visibility | **Lookup by state** with verified date | **Poorly to partly.** Needs current statutes; chatbots may overstate. |
| 10 | **Fly with a dog**: carrier size, aircraft, cabin vs cargo | Occasional; dimension conflicts (E1) | **Airline checker / checklist** | **Poorly.** Needs the airline's current rule. |
| 11 | **Eat out with a dog** (California patio rules) | Moderate (C3); local variation | **Explainer + city lookup** | **Partly.** The state rule is easy; the local practice is not. |
| 12 | **Wildlife and trail hazards** for the region (snakes, bears, ticks) | Low in sample (C4); common sense overlaps with vet content | **Region briefing** | **Satisfies mostly** for general advice. Region-specific current alerts need data. |

Caveat: ranks 5 to 9 are close and could swap with better data. Rank 6 is high on severity and low on evidence of unmet demand, so validate it before building.

---

## Final: top 6 jobs

1. **All-in pet cost and rule check before booking** (calculator, host question script, written confirmation): the most repeated complaint in the sample, and platforms and directories surface fees late or inconsistently.
2. **Where dogs are allowed at the destination** (beaches, trails, patios, leash rules, seasons): rules are local, sources conflict and age, and a chatbot cannot supply verified current rules.
3. **"Fenced yard" and amenity verification**: concrete recurring failure with no platform filter; a checklist and message template solve it directly.
4. **After-stay charge protection** (confirmation templates, dispute steps): money at stake, and platform rules appear to be in flux.
5. **Breed and weight limit screening**: excludes many dogs, found out late; needs a call script and a per-property lookup.
6. **Emergency trip card** (24-hour vets along the route, poison hotlines, first steps): highest stakes and not served route-specifically, but demand evidence is thin, so validate first.

---

## Sources

Opened (SEEN):

- [BringFido reviews on Trustpilot, page 2](https://ca.trustpilot.com/review/bringfido.com?page=2)
- [BringFido app reviews (aggregator)](https://justuseapp.com/en/app/682820712/bringfido/reviews)
- [DogTrekker: hidden costs of pet-friendly hotels in California](https://dogtrekker.com/traveling-pets-california-beware-hidden-costs/)
- [California State Parks: visiting with your dog](https://www.parks.ca.gov/dogs)
- [Whole Dog Journal: canine seat belts, comments page 2](https://www.whole-dog-journal.com/blog/zeal-of-the-convert-canine-seat-belts/comment-page-2/)
- [Hospitable: Vrbo service animal policy](https://hospitable.com/vrbo-service-animal-policy)

Surfaced in search only (REPORTED):

- Airbnb Community threads: [Undisclosed Extra Pet Fee](https://community.withairbnb.com/t5/Help/Undisclosed-Extra-Pet-Fee-Would-you-pay-it/m-p/1148890), [Pet fee change after booking](https://community.withairbnb.com/t5/Help/Pet-fee-change-after-booking-Suggestions-on-how-to-handle/td-p/1337329), [Fenced yard](https://community.withairbnb.com/t5/Support-with-your-bookings/Fenced-yard/m-p/1903059/highlight/true), [NO Pets, guest brought dog](https://community.withairbnb.com/t5/Hosting/NO-Pets-Guest-brought-dog/m-p/1478153/highlight/true)
- [r/airbnb_hosts new fee structure (mirror)](https://pol1.lr.ggtyler.dev/r/airbnb_hosts/comments/1jwq3ub/new_fee_structure) and [r/AirBnB pet procedure (mirror; 403 on fetch)](https://libreddit.winscloud.net/r/AirBnB/comments/1ntg4ur/proper_pet_procedure_when_booking_a_stayus/ngu4z0t/?context=3)
- [Hospitable host forum: undisclosed pets](https://community.hospitable.com/industry-conversations-33/undisclosed-pets-1772)
- [PetTravel hotel policies](https://www.pettravel.com/information/articles/pet-friendly-hotel-policies/)
- [Pew: distracted dogging](https://www.pewtrusts.org/research-and-analysis/blogs/stateline/2017/12/20/distracted-dogging-legal-in-most-states-controversial-in-all), [GoPetFriendly: state restraint laws](https://gopetfriendly.com/blog/state-laws-require-pets-to-be-restrained-in-vehicles)
- [PETA 2025 heat-death log](https://www.peta.org/features/dogs-and-other-companion-animals-suffer-heat-related-deaths/2025-incidents/), [CBS Texas](https://www.cbsnews.com/amp/texas/news/dog-dies-of-heat-stroke-after-riding-with-owners-in-air-conditioned-suv)
- [Forest Service safety and ethics](https://fs.usda.gov/r08/chattahoochee-oconee/safety-ethics), [NPS Chattahoochee pets](https://www.nps.gov/chat/planyourvisit/pets.htm)
- [Chewy airline pet policy guide](https://www.chewy.com/education/dog/general/complete-airline-pet-policy-guide-for-all-u-s-airlines)
- [Rover: dog car seat belts](https://rover.com/blog/dog-car-seat-belts/)
