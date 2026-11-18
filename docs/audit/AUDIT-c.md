# Audit c: six guides (read in full)

Reviewer stance: skeptical buyer. READ-ONLY audit; no site file edited.
Labels: [MEASURED] = seen on a page/result (URL given); [ESTIMATE] = my judgment. Competitor evidence note: for each query I ran one WebSearch and recorded the URLs that came back [MEASURED that they rank in that result set for me, US, 2026-11-18]; I did NOT open those pages, so "what they do better / miss" is drawn from result snippets plus the guides' own research.competitors notes (written by the site's earlier research pass and not re-verified by me). No search volume or difficulty figures exist for this site; none are claimed.

## Cross-cutting findings (all six)

1. None of the six uses the 38-manager pet-policy dataset (src/content/manager-policies.ts). The "alone in a rental" guide is the obvious place for it, but the dataset has no unattended-pet field (fields: maxDogs, breed, weight, fee). Cheapest high-value fix: add an `unattended` column on the next re-read of the 38 pages and publish "X of 38 managers say pets may not be left alone". That single stat would make guide 5 linkable.
2. The four gear guides share one template and the same weaknesses: citation clutter after nearly every sentence ("[[4]](https://www.akcreunite.org/travel/)"), a stock "How we choose and how this site earns money" block, "Paws & Passage has not tested..." repeated in body, FAQ and watch-outs, and the five picks described twice on the page (once as body paragraphs, once as gear cards). That reads like compliance copy, not a boutique publication.
3. Stale/false disclosure: all four gear guides say "Some links are affiliate links, marked as sponsored, with a notice at the top of the article." content/affiliates.yml is empty, so no affiliate link exists. Accurate only after approval; today it is a claim about nothing. Gate it on the presence of a link.
4. Pick quality is "spec-readable", not "best". Picks were chosen because the maker's page was fetchable (the water guide's own gapsFound: Ruffwear Bivy Bowl and Outward Hound Port-A-Bowl "dropped because the maker page was out of stock or could not be loaded"). Selection by fetchability is a process artifact a reader cannot see and a buyer should not accept. Result: popular, frequently-recommended products are absent (see per-guide notes).
5. No first-hand experience anywhere (honestly disclosed). That is ethically right but caps these pages below tested roundups for "best X" queries. They only win on angle (rental/cabin/travel framing, safety accuracy).
6. Affiliate fit (from docs/AFFILIATE-PROGRAMS.md): Kurgo (Pepperjam, rate unconfirmed, may want ~6-month-old site), Adventure Medical Kits (AvantLink, 8-15%), Fi (Awin, 10%), Tractive (Impact, $20 per tracker, but its page says it excludes "Content publishers not relevant to Tractive"), MidWest/Carlson (no program found, so Amazon only). Amazon needs 3 qualifying sales in 180 days after applying. Product pages are `src/content/gear/*.ts` with no prices: low upkeep for prices, but model churn (Fi Series 3+, Tractive DOG 6, Springer->Springland rename) is real.
7. Nothing here is a Pinterest/share asset yet. Obvious builds: printable lost-dog flyer, cabin vet-and-poison-control card, host-message cards.

---

## 1. Dog ID Tags, Microchips and GPS Trackers for Travel
Slug: dog-id-tags-and-gps-trackers-for-travel-guide

**Current title:** Dog ID Tags, Microchips and GPS Trackers for Travel
**Recommended title:** "Microchip vs GPS Tracker: What Actually Gets a Lost Dog Home on a Trip" (answers the real comparison query, carries a curiosity hook; the current title is a noun list).
**Primary keyword:** dog microchip vs GPS tracker [ESTIMATE: the comparison is the genuine query; "dog ID tags and GPS trackers for travel" as written in research.primaryKeyword is not how people search]. Variants: "does a microchip track my dog", "GPS tracker for dog while traveling", "what to do if dog lost on vacation".

**Scores** (SEO 6 | Traffic 3 | Intent 7 | Quality 7 | Originality 4 | Audience 5 | Style 5 | Monetization 5 | Shareability 5 | Maintenance 5) **Overall 5.2**

**Strengths**
- Genuinely correct and careful about what a chip is (ID number, not locator), the registry-lookup/ownership distinction, and a first-hour/first-day plan that is more useful than tracker roundups.
- Honest on Fi (product page silent on coverage/subscription) and AirTag (maker page describes keys, not pets).
- Good fit with the rental/cabin audience: escape-risk row, link to fenced-yard guide.

**Weaknesses**
- Opening is bullets, not a hook; first 100 words are a rule list: "Use three layers that cover for each other: a visible tag, a registered microchip and, if your trip suits it, a tracker." Nothing emotional about the fear of losing a dog in a strange town.
- Citation clutter breaks reading: nearly every sentence ends in "[[3]](https://www.akcreunite.org/lostpettips/)".
- Self-referential hedging: "(Our own reasoning, not from the sources.)"; "AKC Reunite sells enrollment and collar tags, so read its pages with that in mind".
- Picks are mismatched to the article: two of five picks are AKC Reunite tags/collar (the guide itself says "any durable, legible tag with a mobile number does the visible job"), so they are not strong recommendations; no QR/engraved tag makers, no AirTag collar holder though AirTag is discussed; no Garmin/Apple-ecosystem option. Tracker picks are only Tractive x2 and Fi.
- "Pick by situation" table does not name any product (unlike other gear guides), so the CTA path is unclear.
- Fi Series 3+ and Tractive DOG 6 are model names that age fast [ESTIMATE: newer generations likely within 12-18 months].
- Affiliate sentence is untrue today (no links).

**Competitors** (all [MEASURED: in my WebSearch result for "dog GPS tracker vs microchip travel" unless noted; pages not opened])
- https://www.petlink.net/blog/dog-gps-trackers-vs-microchips-whats-difference/ : registry's own authority on chips; guide matches it and adds a travel plan.
- https://www.life360.com/blog/microchip-vs-gps-tracker : big-brand, product-led; guide is more neutral.
- https://tractive.com/blog/en/tech/difference-between-microchip-for-dogs-and-the-tractive-gps-pet-tracker : manufacturer; will outrank on authority. Guide's edge: independence and the lost-dog plan.
- https://www.petsmart.com/learning-center/dog-care/gps-dog-trackers-how-they-work : retailer domain authority.
- https://blog.tryfi.com/microchips-vs-gps-trackers and https://jiobit.com/blog/pet-gps-tracker-vs-pet-microchip : maker blogs.
- Also (from the guide's own notes, not re-verified): treelinereview.com best GPS collars (tested-style roundup).
Pattern: [ESTIMATE] this SERP is brand-owned (makers, registries, big retailers) with few independent voices. A new site is unlikely to rank on the head term; the winnable angle is "lost dog while traveling / vacation" long-tail.
What they do better: tested/priced roundups, real brand authority, subscription price tables. What they miss: registry upkeep, travel lost-dog routine, neutrality.

**Improvements (ordered)**
1. Retitle and rewrite the first 120 words around the stranger-town scenario, then one-line answer.
2. Cut inline citations to one per paragraph or move to numbered footnotes; delete "(Our own reasoning...)" asides.
3. Add a printable "lost dog in a strange town" flyer + first-hour card (Pinterest/backlink asset).
4. Replace the two AKC Reunite picks with one tag option the reader can actually buy and customise; add an AirTag-style collar holder with the pet caveat; name products in the situation table.
5. Gate the affiliate disclosure sentence on an approved link.
6. Check Tractive's affiliate acceptance before investing in tracker CTAs (their stated exclusions).
**Priority:** Medium. **Verdict: IMPROVE**

---

## 2. Dog First-Aid Kit for Trips and Cabin Stays: What to Carry
Slug: dog-travel-first-aid-kit-guide

**Current title:** Dog First-Aid Kit for Trips and Cabin Stays: What to Carry
**Recommended title:** "The Dog First-Aid Kit for Cabin Weekends and Road Trips (and What Ready-Made Kits Leave Out)". Keeps the gap-based differentiator the SEO title already hints at.
**Primary keyword:** dog first aid kit for travel. Variants: "dog first aid kit checklist", "what to put in a dog first aid kit", "dog first aid kit for hiking / camping".

**Scores** (SEO 5 | Traffic 3 | Intent 8 | Quality 8 | Originality 4 | Audience 5 | Style 5 | Monetization 6 | Shareability 5 | Maintenance 6) **Overall 5.5**

**Strengths**
- Safest, most responsible treatment of the six: anchored to the AVMA brochure, firm "ask your vet" limits on peroxide/charcoal/human meds, poison control numbers with fee note, heatstroke steps.
- Spots a real quirk: kits (AMK Me & My Dog, Trail Dog) bundle aspirin/diphenhydramine/peroxide that the AVMA says not to give unprompted.
- Cabin/car/trail layering and "Leave out" list are useful and not generic.

**Weaknesses**
- Fully competitive head term; the cabin angle is a sentence, not a theme.
- The "Learn the basics" bullets (bleeding: "firm pressure ... for at least three minutes", seizure, transport) carry no citation; a medical claim without a source is the one real liability on a trust-led site.
- Hotline numbers hard-coded in body, short answer and FAQ (888-426-4435, 855-764-7661): three places to update. Verify these yearly.
- Muzzle pick (Baskerville Ultra, UK maker page "so check availability and sizing where you live") is an odd product for a first-aid kit page and a UK link for a US site.
- Product copy is a spec transcript: "The listing gives no quantities, weight or dimensions." "Lists about 20 line items against a stated 49 pieces." Honest but dull and it tells shoppers nothing about whether to buy.
- Same five kits described in body and again in cards (duplication).
- Style: "A hybrid is often best: a ready-made kit gives you organized, often waterproof basics." Fine but flat; no stakes (no story of why a cabin 40 minutes from a vet changes the kit).

**Competitors** (MEASURED in WebSearch results for "dog first aid kit for travel what to pack", pages not opened)
- https://www.akc.org/expert-advice/health/general-health/dog-first-aid-kit-essentials/ : AKC authority; will beat this on trust.
- https://www.orvis.com/dog-first-aid-kit-for-travel.html : brand + products; the closest travel-framed commercial page.
- https://www.rover.com/blog/dog-first-aid-kit-checklist : big-brand checklist.
- https://www.preventivevet.com/pet-first-aid-kit : vet-authored, very detailed.
- https://dogtrekker.com/packing-ultimate-dog-travel-first-aid/ : independent travel blogger, closest peer.
- https://articles.hepper.com/best-dog-first-aid-kits/ : "best kits" commercial roundup.
- https://www.petmd.com/dog/general-health/what-pack-your-dog-emergency-kit-how-prepare-your-pup-disaster
[ESTIMATE] Very crowded; 5+ big brands and a vet-written page. A new site wins only on the cabin/rental angle and the "what kits omit" angle, not the head term.
What they do better: authority, brand trust, fuller item detail. What they miss (per guide's notes): cabin framing, ready-made kit audit against a standard.

**Improvements**
1. Lead with the cabin-far-from-a-vet scenario; make the "what ready-made kits omit" audit (a table: AVMA item vs each kit) the centerpiece. That table is the linkable asset.
2. Source or delete the uncited first-aid bullets.
3. Replace the muzzle pick with a US-available option or drop it; keep the AVMA muzzle note in prose.
4. Build a printable one-page "cabin emergency card" (vet, ER, poison control, address of rental, records).
5. Compress product text to verdicts ("Buy this if..., skip if..."), remove duplicate descriptions.
6. Centralize hotline numbers in one component.
**Priority:** Medium (monetization decent, but medical stakes make errors costly). **Verdict: IMPROVE**

---

## 3. Dog Travel Water and Feeding Gear: Bowls, Bottles and Food Containers
Slug: dog-travel-water-and-feeding-gear-guide

**Current title:** Dog Travel Water and Feeding Gear: Bowls, Bottles and Food Containers
**Recommended title:** Split. Keep a lean gear page "Collapsible Dog Bowls and Water Bottles for Trips" and turn the unique half into "Dog Food Storage at a Cabin or Campsite: What Actually Keeps Bears and Raccoons Out" (Why: the bear/NPS/BearWise section is the only thing competitors lack; it is buried under a crowded bowl topic.)
**Primary keyword:** collapsible dog bowl / dog travel water bottle [ESTIMATE: head terms high volume, dominated by review sites]. Variants: "best dog water bottle for travel", "dog food container for travel", "can you keep dog food in car at national park".

**Scores** (SEO 4 | Traffic 2 | Intent 6 | Quality 7 | Originality 4 | Audience 4 | Style 5 | Monetization 5 | Shareability 3 | Maintenance 6) **Overall 4.6**

**Strengths**
- Real insight: "Airtight" is not "bear-resistant", correctly sourced to BearWise/NPS, with honest note that NPS page doesn't name pet food.
- Heat/parked-car safety correctly sourced (CDC, ASPCA); refuses the unsourced "raised bowl prevents bloat" claim.
- Specific, checkable specs per pick.

**Weaknesses**
- Mixed intent: a hydration/heat safety essay, a bowl buyer's guide, a bear-storage explainer and a packing list in one page; none can win its own query.
- Weakest pick set of the four. Five low-ticket items from three brands (Kurgo x2, Springland x2, Vittles Vault). The popular names appearing in the SERP I ran are absent: Dexas Popware, MalsiPree, Ruffwear, KONG H2O, COMSUN [MEASURED in result snippets for "best travel dog water bottle and collapsible bowl"]. "Pick" justification is circular: "That covers capacity, packed size, cleaning and a stated warranty in one listing."
- Spec-only "whyItMadeTheList": a Lifetime Guarantee and dishwasher rating are not reasons to prefer a bowl.
- Table row "Large dog on a hot day ... A larger bowl than the small ones above" recommends a product the page doesn't have.
- Low commission ceiling: $10-25 items; EPC likely poor even with Kurgo (rate unconfirmed) [ESTIMATE].
- Cannibalization: overlaps dog-friendly-cabin-packing-list (packing list, food storage) and dog-car-safety guide (heat in car) [ESTIMATE, did not read those two in this audit].
- Duplicate picks (body + cards); "Our five picks are chosen on maker-published specs, not tested" appears in the short answer, body, FAQ and watch-outs.

**Competitors** (MEASURED in WebSearch results, pages not opened)
- https://www.akc.org/expert-advice/travel/best-dog-bowls-and-water-bottles/ : AKC authority.
- https://www.rover.com/blog/best-dog-water-bottles-and-travel-dog-bowls/ : big brand.
- https://popsci.com/reviews/best-dog-water-bottle : tested-review publication.
- https://reviewed.com/home-outdoors/best-right-now/the-best-travel-dog-bowls : tested-review.
- https://www.hepper.com/best-collapsible-dog-bowls-for-travel/ and https://www.pawtracks.com/dogs/the-best-collapsible-dog-water-bowls : volume affiliate publishers.
- https://iheartdogs.com/best-collapsible-dog-bowls/ , https://www.bustle.com/life/best-collapsible-dog-bowls : (guide's notes: dated, no hydration guidance).
[ESTIMATE] The bowls/bottles SERP is saturated with tested or brand-backed roundups; this page has no testing and no edge on that query. Not winnable.
What they do better: hands-on testing, wider selection, brand authority. What they miss: heat guidance, wildlife-safe storage, cabin rules.

**Improvements**
1. Split as above; make the food-storage/wildlife piece the standalone page and link it from the cabin packing list.
2. Replace picks with best-sellers (or fewer, clearer picks) chosen by use, not fetchability; add the hot-day large-dog bowl you reference.
3. Rewrite "whyItMadeTheList" as a buyer reason, not a spec echo.
4. Remove duplicated pick descriptions from the body.
5. Check overlap with cabin-packing-list before keeping both.
**Priority:** Medium for the wildlife-storage rewrite; Low for the bowl roundup. **Verdict: REPOSITION**

---

## 4. Portable Dog Fences, Playpens and Gates for Rentals Without a Fenced Yard
Slug: portable-dog-fence-and-playpen-guide-for-rentals

**Current title:** Portable Dog Fences, Playpens and Gates for Rentals Without a Fenced Yard
**Recommended title:** "No Fenced Yard at Your Rental? How to Contain a Dog Without Annoying the Host". Hooks the real worry (host), keeps the niche.
**Primary keyword:** portable dog fence for rental / temporary dog fence for renters [ESTIMATE: renter-fence queries seem more rental-specific than the camping/RV ones]. Variants: "dog playpen for vacation rental", "no dig dog fence renters", "pressure mounted dog gate rental".

**Scores** (SEO 6 | Traffic 4 | Intent 7 | Quality 7 | Originality 6 | Audience 5 | Style 5 | Monetization 5 | Shareability 5 | Maintenance 6) **Overall 5.6**

**Strengths**
- Best niche of the gear guides: rental host etiquette, floor/trim/lawn-stake questions, photograph before/after, practice at home. The guide's own gapsFound say competitors skip this and my SERP run agrees: results lean on camping/RV and DIY renter blogs.
- Responsible stance on tethering and unattended pens; flags the gate that needs wall mounting.
- Includes a sensible "When not to use a portable pen" section.

**Weaknesses**
- Pick set undermines the page: 3 of 5 are gates (title promises fences/playpens), one gate requires drilling, one is 20 inches and "specifically designed for puppies and toy breeds", and the situation table concedes: "Jumper, host allows pressure mounts only | No gate in this guide is a confirmed tall pressure-only option." A page whose own pick list can't serve the main use case is not a good affiliate page.
- Pen picks are only MidWest and a 26-inch plastic North States yard; no freestanding travel playpen, no wire/mesh renter-friendly pen, no soft-sided option, no wireless fence discussed though the SERP shows PetSafe Stay & Play and Halo [MEASURED: appear in my WebSearch results].
- Affiliate path is thin: MidWest/Carlson have no program found, so Amazon Associates only (3 sales/180 days to survive).
- Spec dump style: "Weight, enclosed area and intended dog size are not stated in the sources we read."
- Title is 12 words; reader promise "Fences" contradicts "we do not recommend leaving any dog alone in one" and the answer to the core worry (the dog is unsupervised) is "don't", leaving the user with a gear page for a use case it discourages. Honest but limits conversion.
- Repetition: MidWest stabilizer detail appears three times.

**Competitors** (MEASURED in WebSearch results for "portable dog fence for rental no fenced yard", not opened)
- https://diydanielle.com/portable-fence-panels/ : renter-oriented blog; DIY angle.
- https://blog.tryfi.com/renter-friendly-dog-fence : maker blog (wireless-fence angle).
- https://www.critterfence.com/2025/07/13/can-renters-install-temporary-pet-fences-2025-guide/ : the closest direct competitor; vendor-promotional per guide notes.
- https://bobvila.com/articles/best-fences-for-dogs : big brand, generic.
- https://barrierbossusa.com/blogs/news/10-temporary-fence-ideas-for-dogs : vendor.
- https://www.petsmart.com/dog/crates-gates-and-containment/fence-systems/petsafe-stay-and-play-compact-wireless-pet-fence---secure-up-to-3%2F4-acre---no-dig-portable-fencing-13821.html : retailer product page for wireless alternative.
- Also from the guide's notes (not re-verified): petsradar best dog playpens, rvtravel.com.
[ESTIMATE] Mostly vendors, small blogs and camping pages; a rental-specific page by an independent site has a real shot at long-tail. Best organic prospect among the four gear guides.
What they do better: product breadth, wireless options. What they miss: host permission, lawn/floor etiquette, supervision.

**Improvements**
1. Rebuild the pick list to serve the title: 2-3 freestanding pens (including one taller/stronger and one lightweight travel pen), one pressure-mount gate, one no-drill freestanding gate; add a short, sceptical wireless-fence section.
2. Reopen the title and first 100 words around the host/landlord fear.
3. Add a printable "message to your host about a pen or gate" (reuses the host-message pattern from guide 5).
4. De-duplicate stabilizer text; compress specs.
5. Decide the Amazon plan before approving CTAs here (no brand program found).
**Priority:** Medium-High (best niche of the set, weakest picks). **Verdict: IMPROVE**

---

## 5. Can You Leave a Dog Alone in a Vacation Rental?
Slug: can-you-leave-a-dog-alone-in-a-vacation-rental

**Current title:** Can You Leave a Dog Alone in a Vacation Rental?
**Recommended title:** Keep; add the Airbnb long-tail in the SEO title: "Can You Leave a Dog Alone in an Airbnb or Vacation Rental?" [ESTIMATE: "in an Airbnb" is the likelier typed phrase.]
**Primary keyword:** can you leave a dog alone in an Airbnb / vacation rental. Variants: "leaving dog alone in vacation rental", "airbnb no unattended pets rule", "pet camera in airbnb".

**Scores** (SEO 7 | Traffic 6 | Intent 8 | Quality 7 | Originality 6 | Audience 7 | Style 6 | Monetization 4 | Shareability 6 | Maintenance 7) **Overall 6.4**

**Strengths**
- Hits a genuine worry with a direct answer, a decision table for house-rule wording, a ready host message, camera-policy reading (Airbnb help article read directly, with the guest-device gap stated plainly), and storm/first-night cautions from Cornell/ASPCA.
- Opening works: "You booked a cabin that says dogs are welcome, and the plan includes a dinner reservation and one trail that does not allow dogs." Concrete and relatable.
- SERP seen [MEASURED, query "can you leave a dog alone in an Airbnb vacation rental"] is mostly Airbnb community threads, host-side blogs (hostex, touchstay, redawning) and small blogs: weak competition for a guest-side answer.

**Weaknesses**
- Pattern repetition: every section opens "**Direct answer:**" (seven times), which reads templated.
- Over-hedged: "No source we read gives one safe number of hours", "we cannot tell you whether a guest camera is allowed", "We did not read Vrbo's camera rules". Honest, but the answer to "how long" rests on one 2018 Psychology Today column ("about four hours"), and the host-wording evidence is a single 2018 forum thread (Airhosts, a host-side site).
- Not using the 38-manager dataset (no field exists) and no original number anywhere; the page is a synthesis of platform pages.
- No money path: no crate, camera or sitter/daycare links; monetization depends on adding Rover/Wag or crate gear (Rover program not verified in docs).
- Forum-heavy sourcing (Airhosts) for a trust-led site; fine as illustration, weak as evidence.
- Cannibalization: slight overlap with airbnb-vs-vrbo (cross-linked), pet-friendly-vacation-rental-checklist, and the portable pen guide's "when not to use" section [ESTIMATE].

**Competitors** (MEASURED in results for the query above; not opened unless noted)
- https://regretless.com/travel-and-places/leaving-pets-alone-in-pet-friendly-airbnbs-guidelines-and-considerations : closest direct competitor.
- https://www.hepper.com/does-airbnb-allow-pets/ : big pet-publisher, broader.
- https://dutch.com/blogs/dogs/airbnb-for-dogs : brand blog.
- https://www.trvlguides.com/articles/airbnb-pets-policy-dogs : small guide.
- https://community.withairbnb.com/t5/Support-with-your-bookings/Dog-policy/td-p/2245279 : Airbnb community forum thread.
- https://hello.pricelabs.co/blog/airbnb-service-animal-policy/ : host-side tool blog (service-animal angle).
- From the guide's notes (not re-verified): booking.com pet tips, afar.com tips, travelnuity.com.
What they do better: forums give lived anecdotes and variety of host rules. What they miss: a guest decision framework, a message to send, camera/noise-monitor rules, dog-behavior triage.

**Improvements**
1. Add the dataset angle: collect "unattended pets" policy in the next manager re-read and publish the count.
2. Vary section openers; lose "Direct answer:" pattern.
3. Add a real second source for duration (ASPCA/AVMA/vet-college) or flag the number as a rule of thumb earlier.
4. Add a rental dog-sitter/daycare/camera section with links once affiliates exist.
5. Make the host message a downloadable/copyable card.
6. Read Vrbo's camera/noise rules so the "we did not read" caveat can go.
**Priority:** High (best traffic/intent fit and cheapest to improve). **Verdict: IMPROVE**

---

## 6. Airbnb vs Vrbo With a Dog: Pet Fees and Rules Compared
Slug: airbnb-vs-vrbo-with-a-dog

**Current title:** Airbnb vs Vrbo With a Dog: Pet Fees and Rules Compared
**Recommended title:** "Airbnb vs Vrbo With a Dog: What Each One Charges and Where the Pet Fee Hides" (promise something checkable).
**Primary keyword:** Airbnb vs Vrbo with a dog. Variants: "Vrbo pet fees vs Airbnb pet fees", "is Airbnb or Vrbo better for dogs", "does Vrbo include pet fee in price".

**Scores** (SEO 6 | Traffic 4 | Intent 7 | Quality 5 | Originality 5 | Audience 5 | Style 5 | Monetization 5 | Shareability 4 | Maintenance 4) **Overall 5.0**

**Strengths**
- Disciplined sourcing from platform help pages; service-animal/ADA separated from pet fees; useful compare-the-total method and host message.
- Candid about unknowns.
- One real observation: a worked Airbnb checkout (two adults, $519.11 to $576.61, "no separate pet-fee line"). I could not verify it; the same figures appear in how-vacation-rental-pet-fees-work. It is n=1, one platform, one listing.

**Weaknesses**
- Does not deliver the headline: "We could not find a platform-wide rule that makes one better" and "We cannot verify a general winner." A reader who searches the comparison leaves without an answer. In the side-by-side table six of sixteen cells say "Not confirmed" (Vrbo pet filter, Vrbo fee units, pet-count entry, Airbnb fee-after-booking, Airbnb taxes, ...). For a publication positioned as research-backed, a comparison with a half-empty Vrbo column reads as unfinished work.
- Vrbo help URLs include "HomeAway" ("What-is-HomeAway-s-service-animal-policy"): a sign of dated source pages.
- Maintenance: platform UI paths ("Filters, Booking options, Allows pets") and fee options change; every claim is tied to a page read on one day. Highest upkeep of the six.
- Overlaps how-vacation-rental-pet-fees-work, how-many-dogs, and bringing-a-dog-to-a-no-pets-rental; the $519.11 example is reused in two guides. Cannibalization risk with the pet-fees guide [ESTIMATE].
- Style: "We cannot verify a general winner, so use these as questions rather than verdicts." Accurate but unsatisfying; "Direct answer:" template again.
- Bookings path exists (Expedia Travel Creator Program covers Vrbo, up to 4% per docs) but the page promises no booking outcome; low EPC.

**Competitors** (MEASURED in results for "Airbnb vs Vrbo with a dog pet fees", not opened)
- https://pawventures.pages.dev/blog/airbnb-vs-vrbo-vs-hotels-dog-friendly-2026/ : direct dog-specific comparison; unsourced figures per guide notes; a pages.dev site, i.e. a small competitor.
- https://financebuzz.com/vrbo-vs-airbnb : big brand, general guest/host.
- https://www.tripping.com/industry/rental-companies/vrbo-vs-airbnb : travel-industry site.
- https://www.hostaway.com/blog/airbnb-vs-vrbo-the-key-hosting-differences/ : host-side authority.
- https://wise.com/us/blog/vrbo-vs-airbnb : big brand, hosts.
- https://www.biggerpockets.com/forums/530/topics/1015603-finally-airbnb-has-added-an-option-for-pet-fees : investor forum on the Airbnb pet-fee feature.
[ESTIMATE] The general "Airbnb vs Vrbo" head term is owned by big brands; the dog-specific sub-query has few strong pages, but this guide currently isn't more satisfying than the small dog-specific competitor in its conclusions.
What they do better: give a verdict and numbers (even if unsourced). What they miss: sourcing, a method.

**Improvements**
1. Run the same dated checkout test on a Vrbo listing and publish both breakdowns (screenshots, 3-5 listing pairs) so the "Not confirmed" cells become real findings; this is the only way to earn the title.
2. Add a verdict by dog situation ("two dogs, a week: ...") grounded in those tests.
3. Resolve the cannibalization with how-vacation-rental-pet-fees-work: make one the hub, differentiate queries.
4. Use the manager dataset: cross-tab fee structure ("per night" vs per stay) of the 38 managers as a third platform column ("direct from manager").
5. Add re-verification dates per platform claim to simplify upkeep.
**Priority:** Medium. **Verdict: IMPROVE**

---

## Gear-page viability (affiliate)

| Guide | Product fit | Pick quality | CTA placement | Upkeep | Viable? |
|---|---|---|---|---|---|
| ID/GPS | High-ticket tracker (good) | Mixed: 2 of 5 are AKC Reunite tags the guide says aren't special | Cards at bottom only; situation table names no product | Models and plans go stale | Conditionally, if Tractive approves |
| First aid | Natural kit purchase, AMK 8-15% | Reasonable kits; muzzle is a stray UK pick | Cards at end; situation table names options | Low (no prices), re-check hotline numbers | Yes, best of the four |
| Water/feeding | Low-ticket | Weak, missing best-sellers | Cards at end | Low | Poor; reposition |
| Portable fence | Real need, mid-ticket | Pick set does not match the main use case | Cards at end | Medium | Yes after pick rebuild |
Note: no buy buttons render until content/affiliates.yml is approved (empty now) and all four have untested picks, so none can claim review authority. Product pages (src/content/gear/*.ts) carry no prices, so heavy price upkeep is avoided; the real upkeep is model replacement, discontinued SKUs and a quarterly link-check.

## Summary table
| # | Slug | Overall | Verdict | Priority |
|---|---|---|---|---|
| 1 | dog-id-tags-and-gps-trackers-for-travel-guide | 5.2 | IMPROVE | Medium |
| 2 | dog-travel-first-aid-kit-guide | 5.5 | IMPROVE | Medium |
| 3 | dog-travel-water-and-feeding-gear-guide | 4.6 | REPOSITION | Low/Medium |
| 4 | portable-dog-fence-and-playpen-guide-for-rentals | 5.6 | IMPROVE | Medium-High |
| 5 | can-you-leave-a-dog-alone-in-a-vacation-rental | 6.4 | IMPROVE | High |
| 6 | airbnb-vs-vrbo-with-a-dog | 5.0 | IMPROVE | Medium |
