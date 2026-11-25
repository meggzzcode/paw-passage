# Persona audit P1: trip-type owners (2026-11-25)

Scope: eight SIMULATED PERSONAS walked against the live site (https://www.pawsandpassage.com, production main@f02e4f9, which is a stale build: see docs/SEO_ROOT_CAUSE_INVESTIGATION.md section 2) and the repo's content (`content/products.yml`, `content/guides`, `src/content/gear-hub.ts`). Pages were read with WebFetch (text summaries; I never saw a rendered phone screen). Quotes are invented personas, not user research. Search phrases are hypotheses: the only real search evidence is Search Console 2026-11-16 to 11-23 (0 clicks, 306 impressions, position 17.4, 47 queries, top page the no-pets-rental draft) and GA4 (527 sessions, 513 Direct, 0 Organic Search). No volumes are claimed. Scores are editorial judgements. Owner rules respected in every proposal: no stock, prices, ratings, testing claims, calculators, newsletter or accounts.

What I walked: `/`, `/guides` (31 live guides), `/gear` (11 categories, 5 trip filters), `/gear?trip=road-trip` (13 cards), `/gear?trip=winter-trip`, `/gear/water-and-beach`, `/tools/packing-list` (5 questions, no product links), `/stays` (78 stays, 8 towns in the filter), `/destinations` (Georgia and California only), `/destinations/georgia`, `/destinations/california`, `/data/pet-policies` (38 managers, 7-column table), `/dogs/big-dogs`, one stay page, and the fees, Christmas, hiking and life-jacket guides.

Structural facts that drive every score below:
- Every product button reads "See it at Amazon" plus "Details and specs". Cards show no price, rating or stock (by rule). 92 product records, about 63 active; none has a motion-sickness, tent, sleeping-bag, trailer or RV item.
- Stay pages send people to Vrbo ("See photos and check dates on Vrbo"); the fee row is often "Not confirmed".
- Three guides that would serve P6 and P7 exist only as drafts and are not live: `smoky-mountain-cabins-with-dogs`, `winter-road-trip-with-a-dog`, `winter-rv-travel-with-a-dog` (also `dog-boots-or-paw-wax-for-winter`, `dog-enrichment-for-vacation-rentals`).
- Destinations are Georgia and California only. Smokies, Tennessee, Florida, Colorado are absent from the destination pages (they appear only as manager regions in the dataset).
- Zero published guides mention carsickness, Husky or double coat in context, lake house, rattlesnake.

---

## P1-1. First-time cabin renter, one small dog

**WHO (SIMULATED PERSONA).** "I'm renting a cabin in Blue Ridge for the first time with my 12 lb terrier mix. I keep reading 'pet fee' and 'pet-friendly' and I don't know what I'll really pay or what can go wrong."

**HOW THEY ARRIVE (hypotheses).** "pet fee vacation rental per night or per stay"; "is it okay to bring my dog to an airbnb"; Pinterest pin "what to check before booking a dog friendly cabin". The fees guide and the no-pets guide are the only pages with any Search Console footprint, so this is the persona with the most real evidence.

**FIRST 10 SECONDS.** Home says "Dog-friendly travel, done properly", with a stay search, "Find the right trip for your dog" tiles and a fees guide in "Start here" on /guides. They stay: this is the site's best fit.

**DO WE ANSWER IT.** Fees guide: the short answer is about 90 words in and gives a range ($20 to $50 nightly, $50 to $300 one-time, 3 of 38 charge nothing), but no worked total for one small dog on a 3 to 5 night stay; examples use two dogs. No page says whether small dogs pay less. The checklist and "Will my dog be accepted?" tool exist.

**WHAT THEY WOULD BUY.** Little, and that is fine. Cards in the fees guide (doormat, towel) are irrelevant to the fee question; a first-timer would ignore them. A bowl or the cabin packing list is more plausible.

**TRUST AND FRICTION.** Affiliate notice is visible near the top; good. Stay cards say "Not confirmed" for most fees, which is honest but leaves the anxious reader with the question unanswered. Fees guide is about 3,000 words with three tables.

**APPEAL: 6/10** (editorial judgement). Right topic, right honesty, no single "your total" answer.

**GAP.** A short "What one small dog really adds to a 4-night cabin bill" worked-example block at the top of the fees guide, plus a "first booking: five questions to send the host" copy block (not a calculator: static example lines).

---

## P1-2. Family with two large Labs, lake house

**WHO (SIMULATED PERSONA).** "We're renting a lake house for a week with our two 70 lb Labs. Half the listings say 'one dog under 50 lb'."

**HOW THEY ARRIVE.** "lake house rental two large dogs"; "vacation rental no weight limit"; "how many dogs allowed airbnb". Hypotheses; the large-dog and no-limit URLs are the ones Search Console shows as competing with Vacasa, Airbnb Help and Hostaway.

**FIRST 10 SECONDS.** Home tile "Big dogs" and the "Large dogs" must-have are strong entry points. Stay filter allows weight 20/30/50/70 lb and 2+ dogs.

**DO WE ANSWER IT.** Large-dog guide: six of 38 managers cap weight (35 to 65 lb), two state no limit. /dogs/big-dogs states Labrador weights are not given and links only to guides. No lake-house content, no lakes in Georgia or California destination pages beyond a Cherry Lake stay. No two-dog-plus-kids section.

**WHAT THEY WOULD BUY.** Life jackets (Ruffwear Float Coat, Outward Hound Dawson, EzyDog DFD), a pen (MidWest Exercise Pen), a ramp, two-dog car guide with crates (MidWest iCrate, Lucky Duck large kennel). The large-dog page shows no product cards at all, so the strongest-fit cards are one click away rather than on the page they are on. They would click the life jackets; they would ignore the Swamp Cooler and Super Shammy towel (not what they came for).

**TRUST AND FRICTION.** Life-jacket page has a 29-word intro and gives sizing by girth, honest; but no dock, no algae, no "supervised swimming" lake rules. Dataset table: 7 columns on a phone.

**APPEAL: 5/10.**

**GAP.** "Lake house with dogs" guide: dock and water rules, algae, swim breaks, two-dog sleeping and cleanup, with life jackets and towels placed in context. Add a three-card strip on /dogs/big-dogs.

---

## P1-3. Road-tripper, 8 hours each way, medium dog who gets carsick

**WHO (SIMULATED PERSONA).** "Eight hours each way with my 40 lb beagle mix, and she throws up by hour two. What do I do?"

**HOW THEY ARRIVE.** "dog carsick long road trip"; "how often to stop with dog on a road trip"; pin "dog road trip checklist". Hypotheses.

**FIRST 10 SECONDS.** /gear?trip=road-trip: "Keep them secure, get them in, keep the car clean". Reads like a safety page, not an answer.

**DO WE ANSWER IT.** No. Zero guides or gear pages mention carsickness or motion sickness. The road-trip trip page has 13 cards but no text on nausea, windows, facing forward, empty stomach, stops, or asking a vet. Closest content: car harness/crate guide (restraint), cargo cape (clean-up). The draft winter road-trip guide is unpublished.

**WHAT THEY WOULD BUY.** Seat cover or hammock and a bowl (clean-up, water), maybe the Lucky Duck kennel (secure, calm). They would click Kurgo Rover Hammock (mess) first; they would ignore the ramp and steps (not their problem). Missing: no vet-sourced nausea content, no cleanup kit for vomit, no stop-planning content.

**TRUST AND FRICTION.** "See it at Amazon" on seat covers is credible; but a visitor with a sick dog needs a vet-sourced answer and gets a shop page. Leaves for a vet or forum.

**APPEAL: 3/10.**

**GAP.** "Dog gets carsick on a long drive: what to do before you leave and every two hours" (vet-source only, no medicine claims, "ask your vet about options"), linked from the road-trip gear page with a cleanup trio (hammock, cargo cape, wipes) and a "road-trip day plan" section on the packing list.

---

## P1-4. Hiker/camper, high-energy dog

**WHO (SIMULATED PERSONA).** "Weekend of trail running and camping with a 2-year-old border collie mix."

**HOW THEY ARRIVE.** "dog hiking gear checklist"; "camping with a dog what to bring"; pin "trail essentials for dogs". Hypotheses.

**FIRST 10 SECONDS.** /gear?trip=hiking: "A harness, a leash, boots, water and a small first aid kit". Good first read.

**DO WE ANSWER IT.** Hiking guide opens with "Most dog hikes need very little gear", covers trail rules, heat, paw care. It never mentions high-energy dogs, pacing, distance, ticks or camping. Packing planner has "camping or hiking trip" but no tent/sleeping-bag items and no product links.

**WHAT THEY WOULD BUY.** Ruffwear Web Master harness, Knot-a-Leash, Grip Trex boots, Quencher bowl, Beacon light, AMK Trail Dog kit: a genuine, coherent set; the only persona where our cards map almost one-to-one. Ignored: ramp and doormat in "Featured". Missing: sleeping pad/bag (Ruffwear Highlands is inactive), tick removal, GPS collar on this trip page (Tractive/Fi are active but not in the hiking collection).

**TRUST AND FRICTION.** Honest "boots only if needed" tone builds trust, but "no distance guidance" will read as vague to a serious hiker.

**APPEAL: 4/10** (4 because camping, ticks and energy matching are absent).

**GAP.** Add "Camping and tick check" section to the hiking guide plus Tractive/Fi to the trail collection; separate "Camping with a dog" page covering campground rules, sleeping set-up, night safety.

---

## P1-5. Beach and lake summer family, swimming dog

**WHO (SIMULATED PERSONA).** "We're doing a week at the lake and a day at the beach with our lab mix who swims all day."

**HOW THEY ARRIVE.** "dog life jacket do they need one"; "dog friendly beaches California"; pin "lake day with dog packing list". Hypotheses.

**FIRST 10 SECONDS.** /gear/water-and-beach: three jackets, clear sizing. California destination pages say which beaches allow dogs (San Diego, Monterey, Santa Barbara, Mendocino): one of the site's most useful pieces.

**DO WE ANSWER IT.** Yes for jackets and beach rules; partly for heat (keep-cool guide). No: algae, saltwater drinking, sand heat, post-swim rinse, ear care, freshwater parasites.

**WHAT THEY WOULD BUY.** Float Coat or Dawson jacket, Swamp Cooler vest, Super Shammy towel, Quencher bowl. They would click the jackets; they would ignore the ramp/pen "Featured" cards. Missing: umbrella/shade, paw wax, travel shower (Kurgo Mud Dog is inactive), beach-only cooling mat.

**TRUST AND FRICTION.** Page honestly says a jacket "is not a promise a dog will stay safe": trust-building. Algae and dock rules, where lake owners worry most, are missing.

**APPEAL: 5/10.**

**GAP.** "Beach and lake day with a dog" section/guide (algae and blue-green notice, hot sand, drinking water, rinse routine) with a shade/cool-down group; add Mud Dog shower back if the card can be verified.

---

## P1-6. Winter traveler to the Smokies for Christmas, Husky

**WHO (SIMULATED PERSONA).** "Christmas week in a cabin outside Gatlinburg with my Husky. Snow is fine for him but I'm worried about cabin heat, shedding and whether they allow him."

**HOW THEY ARRIVE.** "Gatlinburg cabins that allow dogs christmas"; "husky in a hot cabin"; pin "christmas with dog in a cabin". Hypotheses.

**FIRST 10 SECONDS.** /destinations says "starting with two places" (Georgia and California). No Smokies. The Christmas guide's title lands, though.

**DO WE ANSWER IT.** Christmas guide: yes on booking, tree hazards, fire and cold, vet, but never mentions Smokies, Tennessee, Husky, shedding or overheating of thick-coated dogs. The Smokies guide (7 managers) and winter road-trip guide are drafts, not live. Dataset has a Smoky Mountains region but no landing page.

**WHAT THEY WOULD BUY.** Ruffwear boots (Polar Trex), a bed, a gate, KONG; no brush/shedding, no cooling for a double coat in heated rooms, no snow-trail gear for a dog who needs none. Winter cards are aimed at thin-coated dogs ("Climate Changer fleece") and mismatch a Husky.

**TRUST AND FRICTION.** Searching Gatlinburg and getting a Georgia-and-California site reads as "not for me".

**APPEAL: 3/10.**

**GAP.** Publish the Smokies draft and add a Smokies destination page; add a "thick-coated dog in winter" block (heat, shedding, ice-melt on paws).

---

## P1-7. RV or van-lifer with a dog

**WHO (SIMULATED PERSONA).** "Full-time in a small camper van with a 55 lb shepherd mix."

**HOW THEY ARRIVE.** "dog in van in hot weather"; "RV campground dog rules"; pin "van life with dog essentials". Hypotheses.

**FIRST 10 SECONDS.** Nothing on home or /guides is for RV. Home is rentals, stays and destinations.

**DO WE ANSWER IT.** No. `winter-rv-travel-with-a-dog` is a draft; "RV" matches are incidental. No heat, ventilation, campground-rule, or hookup content live.

**WHAT THEY WOULD BUY.** Collaps-A-Bowl, Vittles Vault, crate cover, cooling pad, Tractive GPS, privacy film (rabbitgoo is a car item they'd use). Cards exist but are filed under rental categories. No trip filter for them.

**TRUST AND FRICTION.** Vrbo/stay content irrelevant.

**APPEAL: 2/10.**

**GAP.** Publish the RV draft and add an "RV and van" trip collection; otherwise state on the home page who the site is not for.

---

## P1-8. Weekend traveler from Atlanta or Los Angeles

**WHO (SIMULATED PERSONA).** "Weekend from Atlanta with my beagle, in a cabin that takes dogs, ideally under two hours."

**HOW THEY ARRIVE.** "dog friendly cabins near Atlanta"; "weekend getaway from Los Angeles with dog"; pin "dog friendly weekend". Hypotheses.

**FIRST 10 SECONDS.** Home tile "weekend getaways" and Georgia/California tiles. Good.

**DO WE ANSWER IT.** Georgia page: four towns, things-to-do pages, "within an easy drive" with no drive times. California page: no LA content at all and no drive times; Los Angeles is not a town on the site (Ventura, Santa Barbara are). The city guides were retired; the destination pages do not replace them: no "from Atlanta in 1.5 to 2 hours" line.

**WHAT THEY WOULD BUY.** Short trip, so a bowl, bed, doormat, kit. They would click the weekend packing list link, not Amazon.

**TRUST AND FRICTION.** Stay cards: many "Not confirmed" fees; some internal contradictions on the stays list (fenced yard tags). No prices, no availability.

**APPEAL: 4/10.**

**GAP.** Add "From Atlanta" and "From Los Angeles" lines (drive-time ranges from official maps, no promises) to destination pages and a short "weekend packing list" link.

---

## Summary table

| Persona | Appeal | Top gap |
|---|---|---|
| P1-1 first-time cabin, small dog | 6 | one worked fee total for a small dog |
| P1-2 two Labs, lake house | 5 | lake-house guide, cards on /dogs/big-dogs |
| P1-3 carsick 8-hour driver | 3 | carsickness guide |
| P1-4 hiker/camper, high-energy | 4 | camping and ticks |
| P1-5 beach and lake family | 5 | algae, hot sand, rinse routine |
| P1-6 Smokies winter, Husky | 3 | Smokies page and thick-coat winter block |
| P1-7 RV or van | 2 | RV guide live and a trip collection |
| P1-8 Atlanta/LA weekend | 4 | drive-time lines on destination pages |

Average appeal: 4.0. Lowest: P1-7 (2/10).

## Five gaps that recur

1. Destination reach: Georgia and California only; Smokies, Tennessee, Florida, Colorado, lakes, RV all outside.
2. Live content stale: five drafts (Smokies, winter road trip, winter RV, boots or wax, enrichment) are not deployed; production is the old build.
3. Behavior and health questions (carsickness, ticks, algae, heat, pacing) are unanswered; the site answers booking and gear only.
4. No camping or RV pathway: no tent, sleeping, campground rules, or hookup content, and no trip filter.
5. Cards sit away from the need: /dogs/big-dogs and fee guides have no or mismatched cards; "Featured" always shows pen, bed, doormat, kit, ramp regardless of trip (ramp on the winter and road pages fits few people).

## Product-side findings

- Categories missing: motion-sickness help (vet-sourced only), tick removal, camping (sleeping pad or bag, tent), RV or van (ventilation, door gates), shedding or grooming, shade or cooling for a thick coat, sand and paw care, GPS in the hiking collection (Tractive and Fi are active but unused there).
- Cards that fit: hiking collection (Web Master, Knot-a-Leash, Grip Trex, Quencher, Trail Dog kit, Beacon); beach jackets; road-trip restraint and car-interior cards; Springland bottles and Collaps-A-Bowl.
- Cards that do not fit: ramp in "Featured" on winter/road pages for small-dog and van users; doormat and towel under the fees guide answer; Polar Trex or fleece for a Husky; sleeping bag Ruffwear Highlands and Kurgo Mud Dog are inactive, so P1-4/P1-5 miss them.
- Every button is "See it at Amazon": an anxious or cautious buyer sees no reassurance that the product suits their dog.

## What I could not verify

- Only text summaries of the live pages; no phone rendering, tap targets or layout.
- Live is a stale build; HEAD pages (trip cards, packing list, guides) differ. I judged topics and CTAs, not prose.
- No Search Console query list was available beyond the docs; all search phrases are hypotheses.
- I did not follow Amazon links or check that products are available, in stock or correctly sized.
- Drive times for Atlanta and Los Angeles are not verified here; I only observed that the pages give none.
- The "dog-friendly" nature of Smokies managers beyond the repo draft was not checked.
