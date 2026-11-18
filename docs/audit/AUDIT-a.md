# Audit A: six rental-planning guides

Reviewer stance: skeptical buyer. Read in full: content/guides/how-vacation-rental-pet-fees-work.md and src/content/guides/{pet-friendly-vacation-rental-checklist, vacation-rental-secure-fenced-yard, traveling-with-two-dogs-accommodation-guide, vacation-rentals-that-welcome-large-dogs, dog-friendly-cabin-packing-list}.ts.

Labels: [MEASURED] = seen on a public page (URL given). [ESTIMATE] = my judgment. No search volume, difficulty or ranking data exists; none is claimed.

Method note on competitors: I ran WebSearch for each primary query and fetched four pages (Afar, Pawventures, plus two blocked/redirected, see below). For other competitor URLs, "appears in results" is the only thing I measured; where I cite "what they do" from the guide's own `research.competitors` block (written by the earlier author, who says each page was "read in full"), I mark it [FROM FILE, NOT RE-VERIFIED]. AARP returned HTTP 403 to my fetch; I moved on. gopetfriendly.com 301-redirected; not followed.

## Cross-cutting findings (apply to all six)

1. **None of the six uses the proprietary dataset.** The 38-manager pet-policy dataset is the stated differentiator. A grep of the six files finds no use of src/content/manager-policies.ts or docs/data figures. Large-dogs even writes "Vacasa's page says weight limits ... vary" and "One reviewed manager has a Dogs Over 30lb filter" when the site holds its own weight/fee/count data for 38 managers. This is the single biggest missed opportunity: "we compared 38 managers: X% cap weight at 50 lb, median pet fee $Y, Z% charge per dog" would be the backlink asset. [ESTIMATE that the data supports this; I did not audit the dataset itself.]
2. **Every dollar figure is hypothetical.** Good for honesty, bad for shareability. Hypothetical tables are not citable by journalists or bloggers.
3. **Prose is careful to the point of tiring.** Recurring tics: "Do not assume...", "ask", "confirm", "not a guarantee", "outcomes depend on...", "not a legal determination". Every paragraph ends in a hedge. Reads like a compliance memo, not a boutique travel publication. No scene, no dog, no voice, no first-person anecdote anywhere (which is also the honest outcome, since none can be invented, but a real editor-with-a-dog voice is absent).
4. **Same host-message template, same checklist ending, same "Related questions:" paragraph** repeated in nearly every guide. Four of the six contain the near-identical "Please confirm ... complete pet charge ... cancellation" message.
5. **Heavy internal duplication / cannibalization cluster** (see per-article notes): checklist vs fees vs large-dogs vs two-dogs vs how-many-dogs-can-you-bring vs breed-restrictions all restate weight-limit tables, fee-unit tables, and the host message.
6. **Monetization:** all link to /tools/pet-cost-check and /tools/checklist (good) but there is no product placement and no booking path; with no approved affiliates that is correct, yet a buyer sees zero CTA architecture beyond tools. Gear-adjacent guides (packing list, fenced-yard) have the natural hooks.
7. **Dates:** all six show publishedOn/lastReviewed 2026-11-16 and sources accessedOn 2026-11-16, i.e. two days old and brand new; no age signal yet.
8. No images/downloads/Pinterest assets are referenced beyond heroImage.

---

## 1. How Pet Fees Actually Work at Vacation Rentals
Slug: how-vacation-rental-pet-fees-work

**Current title:** How Pet Fees Actually Work at Vacation Rentals (seoTitle "Vacation Rental Pet Fees: $80 or $160?")
**Recommended title:** "Vacation Rental Pet Fees: What You'll Really Pay for 1 or 2 Dogs". Why: the current H1 is explainer-flat ("Actually" is a cliche); the seoTitle's $80 vs $160 hook is the best thing on the page and should be in the H1 too. If the dataset is used: "What 38 Vacation Rental Managers Really Charge for Dogs".
**Primary keyword:** vacation rental pet fees. Variants: Airbnb pet fee per night; Vrbo pet fee; pet fee vs pet deposit; how much is a pet fee at a vacation rental. [ESTIMATE: real, evergreen, high-ish demand; the file's own primary "how vacation rental pet fees work" is a weaker phrasing than "vacation rental pet fees".]

**Scores:** SEO 7 | Traffic opportunity 5 | Intent 8 | Content quality 8 | Originality 5 | Audience appeal 6 | Natural style 5 | Monetization 5 | Shareability 5 | Maintenance 7 | **Overall 6.1**

**Strengths**
- Best of the six: concrete answer in 100 words ("A pet fee is a formula, not a number"), four-structure table, $80/$100/$100/$160 worked example that delivers the headline's promise.
- Clear separation of fee / deposit / hold / waiver; break-even (4.5 nights); cap trap. Genuinely useful.
- Sourced to Airbnb/Vrbo help pages and DOJ; service-animal section is careful.
- Unusual honesty: a labeled one-listing Blue Ridge observation.

**Weaknesses**
- Hypothetical-only numbers. No real fee data although the site has a 38-manager dataset. A reader searching "how much is a pet fee" gets no range. [ESTIMATE: that is the dominant query shape.]
- The Blue Ridge paragraph ("In one check we ran in November 2026 ... $519.11 to $576.61") is a first-hand claim I cannot verify from the repo; it must be traceable to a saved screenshot/URL or removed. Flag for the owner.
- Style: "Do not pay an unexplained duplicate just to end the conversation." fine, but also "The official pages establish fee categories and display policy, not how every host's software is configured, so verify the full quote." Defensive.
- Service-animal section (about 300 words) is off-intent for most fee searchers and duplicates the checklist guide.
- Sections "What to do about an unexpected charge" overlaps airbnb-pet-damage-charge-after-checkout.
- seoDescription fine; FAQ answers hedge ("Either is possible").

**Competitors**
1. https://www.hostaway.com/vacation-rental-guide/pet-friendly-hosting/fees/ [MEASURED: appeared in results for "how vacation rental pet fees work per night per stay"]; host-side revenue framing. Misses guest arithmetic. [FROM FILE]
2. https://www.uplisting.io/blog/vrbo-can-i-charge-pet-fees-policy-listing-setup-guide [MEASURED: in results]; host setup. Misses guest side.
3. https://encyclopedia.lodgify.com/pet-fee [FROM FILE]; definitional, host-side.
4. https://www.afar.com/magazine/how-to-find-a-pet-friendly-airbnb-or-vacation-rental [MEASURED: fetched]; Afar, April 2021, about 1,400 words; says fees "typically run about $25 to $150 per stay"; named author, personal dog anecdote, tracked affiliate links. Does better: real voice, a stated dollar range, brand trust. Misses: fee units, deposits vs holds, any arithmetic, and it is five years old.
5. https://pawventures.pages.dev/blog/dog-friendly-vacation-rental-booking-guide-2026/ [MEASURED: in results; sister page fetched: anonymous "Editorial Team", affiliate-style, unsourced stats]. Gives dollar ranges; weak sourcing.
6. https://community.withairbnb.com/t5/Ask-about-your-listing/Pet-fee-how-much-do-you-charge/m-p/1738962 [MEASURED: in results]; forum threads, dated and contradictory on per-stay vs per-night, which shows the confusion this guide resolves.
Verdict on competition: [ESTIMATE] SERP is mostly host-side software blogs, forum threads and thin affiliate posts for the guest query; a new site can realistically rank for the long tails ("pet fee per dog or per stay", "pet deposit vs fee") but not for broad "pet fees" against Airbnb/Vrbo help pages.

**Recommended improvements (ordered)**
1. Add a real-data section from the 38-manager dataset: median/range of pet fee, share per-dog vs per-stay, share with caps. Make it the lead and the H1.
2. Verify or remove the Blue Ridge test; if kept, link the evidence.
3. Cut service-animal section to a 3-sentence box with a link to the dedicated guide (or move it); move "unexpected charge" workflow to the damage-charge guide.
4. Rewrite hedged sentences into plain statements; add a downloadable one-page "pet fee calculator card" (Pinterest-friendly).
5. Put the 4-structure table above the fold as an image/graphic for sharing.

**Priority:** High (best traffic fit of the six, clearest upgrade via dataset). **Verdict:** IMPROVE

---

## 2. What to Check Before Booking a Pet-Friendly Vacation Rental
Slug: pet-friendly-vacation-rental-checklist

**Current title:** What to Check Before Booking a Pet-Friendly Vacation Rental (seoTitle "Dog-Friendly Rental Checklist: 8 Questions")
**Recommended title:** "Dog-Friendly Vacation Rental Checklist: 8 Things to Confirm Before You Pay". Why: the actual query is "checklist"; "pet-friendly" in H1 vs "dog-friendly" in seoTitle is inconsistent; also the file contains an 8-item gate, so lean on "8".
**Primary keyword:** pet friendly vacation rental checklist. Variants: dog friendly rental checklist; questions to ask before booking a pet friendly rental; pet friendly airbnb checklist. [ESTIMATE: modest but real demand; strongly competed by rental-company blogs.]

**Scores:** SEO 6 | Traffic 4 | Intent 8 | Quality 7 | Originality 4 | Appeal 5 | Style 4 | Monetization 5 | Shareability 4 | Maintenance 7 | **Overall 5.4**

**Strengths**
- Eight-question gate up top is the right shape for the query; permission/practicality/price framing.
- Decision table (Bookable / Pending / Workable compromise / Reject).
- Good internal linking to tools and other guides.

**Weaknesses**
- 3,700 words for a "checklist". Reader wanting a list scrolls past service-animal law, cancellation policy, insurance, veterinary care. The gate is excellent, the rest is a wall. (reading time stated 9 min.)
- It is a hub that cannibalizes its own spokes: fees table repeats the fees guide; weight/size text repeats large-dogs; fenced yard paragraph repeats fenced-yard; unattended repeats can-you-leave guide; service animals repeats fees guide.
- Robotic phrasing: "Resolve permission, practicality and total cost before paying. Any one can sink a beautiful rental." and the table column "What not to assume" repeated seven times. "Do not treat a general ADA summary as a legal determination for every privately owned holiday home."
- No downloadable/printable checklist; the interactive tool is linked but the page itself is the obvious place for a PDF.
- Competitor-lists with real examples (Swack, Holiday Cottage) are shorter and scan faster.
- One unreferenced claim-style sentence: "a dog-friendly development can contain individually restricted homes" (plausible, unsourced).

**Competitors**
1. https://www.swackvacations.com/pet-friendly-vacation-rental-checklist-what-to-confirm-before-you-book/ [FROM FILE; same title as target query]; short, scannable, company-owned. Misses cancellation, vets.
2. https://holidaycottage.us/pet-friendly-vacation-rental-booking-checklist [FROM FILE]; three-stage checklist. Misses fees explanation.
3. https://blog.itrip.net/vacation-rentals-let-you-bring-your-pets-along/ [MEASURED: in results; 8 short tips]; thin, host-company.
4. https://www.booking.com/articles/pet-friendly-holiday-rentals-tips.html [MEASURED: in results]; big brand; no amounts. The big brand is the ranking threat.
5. https://www.gopetfriendly.com/blog/tips-for-booking-a-pet-friendly-vacation-rental [MEASURED: in results; fetch redirected, not read]; pet-travel specialist, aged.
6. https://pawventures.pages.dev/blog/dog-friendly-vacation-rental-booking-guide-2026/ [MEASURED: in results]; affiliate-style.
7. https://www.bringfido.ca/blog/how-to-book-pet-friendly-vacation-rental/ [MEASURED: in results]; BringFido, established pet-travel brand.
Verdict: [ESTIMATE] mixed SERP of rental companies, a big OTA and pet brands. Hard for a new site on the head term; viable only if the page is the best printable checklist or carries original data.

**Recommended improvements**
1. Split: keep a ~1,200-word checklist (gate, price table, house rules, decision table) and move service animals, cancellation and vet planning to dedicated spokes (service animals could be its own guide; the site lacks one).
2. Add a printable PDF "pre-booking card" (shareable asset) and an image for Pinterest.
3. Add dataset evidence: "what the 38 managers typically cap/charge", e.g. in the "what to check" table.
4. De-duplicate the fee table; link to fees guide in one sentence.
5. Edit voice: replace "What not to assume" column with plain examples.

**Priority:** High (hub page; its cannibalization of its own spokes is the main structural risk). **Verdict:** REPOSITION (shorten to a true checklist; push depth to spokes)

---

## 3. How to Find a Vacation Rental With a Truly Secure Fenced Yard
Slug: vacation-rental-secure-fenced-yard

**Current title:** How to Find a Vacation Rental With a Truly Secure Fenced Yard (seoTitle "Is a Rental's Fenced Yard Really Dog-Safe?")
**Recommended title:** "Fenced Yard Vacation Rentals for Dogs: How to Check the Fence Before You Book". Why: the money query is "vacation rentals with fenced yard for dogs"; "truly" is filler. Keep the question-style seoTitle only if CTR tests favor it.
**Primary keyword:** vacation rental fenced yard dogs. Variants: dog friendly rentals with fenced yard; fully fenced vacation rental; how high should a dog fence be. [ESTIMATE: strong demand and a transactional/browse-intent head term dominated by listing aggregators; the informational "what to check" variant is smaller but winnable.]

**Scores:** SEO 6 | Traffic 5 | Intent 6 | Quality 8 | Originality 7 | Appeal 7 | Style 6 | Monetization 5 | Shareability 6 | Maintenance 9 | **Overall 6.5**

**Strengths**
- The best original thinking of the six: "weakest section, not the average", the cleaner-and-driveway gate problem, dog-behavior matrix, pool vs child-safety CPSC distinction, evidence pack with gate video. [Competitors reviewed in the file cover pieces of this; none combine them.]
- Fully evergreen (no prices/policies); lowest maintenance.
- Decision table without false precision.

**Weaknesses**
- Intent mismatch: someone searching "dog friendly rentals with fenced yard" wants listings. [ESTIMATE] The page is a how-to-vet method with zero listings or filters. Georgia fenced-yard cabin guide exists but is only a related link.
- Cannibalization with dog-friendly-cabins-fenced-yards-georgia and portable-dog-fence-and-playpen-guide-for-rentals, and with large-dogs' yard section.
- Tone: "A lawn photo cannot tell you." strong; but "Ask for observable facts, not guarantees." and "Unknown is not the same as acceptable." are slogan-like; the "Invisible and electric fences" and "pool" sections run long relative to demand.
- No dog-owner emotion: nothing about the fear of an escape in a strange place (the real motivator).
- Citations are AKC/VCA/CPSC; no rental-industry data.

**Competitors**
1. https://www.afar.com/magazine/how-to-find-a-pet-friendly-airbnb-or-vacation-rental [MEASURED: fetched]; Afar tip 4: fenced yard if dog runs off, author's dog escaped a rental yard and was turned in to police; also microchip. Does better: a real, human escape story and brand authority. Misses: any inspection method.
2. https://www.avantstay.com/blog/pet-friendly-vacation-rentals-with-fenced-yard/ [MEASURED: in results]; listicle of fenced-yard properties; captures the transactional intent we ignore. Misses: how to verify.
3. https://www.cottagevacations.com/pet-friendly-cottage-rentals-fenced-yard/ [MEASURED: in results]; listings page.
4. https://blog.twiddy.com/?p=21761 [MEASURED: in results]; manager blog (Twiddy), local.
5. https://dogtripbritain.com/guides/self-catering-dog-secure-garden/ [FROM FILE]; closest method-guide competitor; UK.
6. https://www.bolberrycourt.com/blog/secure-enclosed-garden-holiday-cottages [FROM FILE]; single cottage, promotional.
7. https://wagabode.com/guides/cornwall-cottages-with-enclosed-gardens-what-enclosed-really-means [FROM FILE]; and a downloadable "Garden Clarity Assessment Kit" at https://wagabode.com/resources/garden-clarity-assessment, which is exactly the downloadable asset our page lacks.
Verdict: [ESTIMATE] US SERP for the head term is aggregator/listing pages (hard). The "how to check" angle has mostly UK cottage sites and small blogs; a new US site can realistically compete there.

**Recommended improvements**
1. Add a "which of the 38 managers list fenced yards" count from the dataset and links to the Georgia fenced-yard guide and state/dog-type hubs so the page can satisfy browsers as well as vetters.
2. Create a printable "Fence Check Card" (one-page PDF: weakest section, gate, pool, evidence list) and a Pinterest graphic; competitor Wagabode already sells/gives this asset.
3. Open with the fear (the escape, the 11 pm search), plain words; cut invisible-fence and shared-yard text by about 25%.
4. Add a "dog-by-dog" quick-pick (digger/jumper/squeezer) as a visual.
5. Resolve overlap with the portable-fence guide by one-line handoff.

**Priority:** Medium-High (best differentiation, lowest upkeep). **Verdict:** IMPROVE

---

## 4. Traveling With Two Dogs: The Accommodation Planning Guide
Slug: traveling-with-two-dogs-accommodation-guide

**Current title:** Traveling With Two Dogs: The Accommodation Planning Guide (seoTitle "Two Dogs, One Rental: Fees, Limits, Layout")
**Recommended title:** "Vacation Rentals With Two Dogs: Pet Fees, Weight Limits and Where They'll Eat". Why: the real query is "vacation rental two dogs / how many dogs allowed"; "The Accommodation Planning Guide" is a template phrase nobody searches.
**Primary keyword:** vacation rental two dogs (file uses "traveling with two dogs accommodation"). Variants: pet friendly rentals 2 dogs; two dog pet fee vacation rental; combined weight limit pet rental; traveling with two dogs road trip. [ESTIMATE: modest volume, real intent, long tail.]

**Scores:** SEO 5 | Traffic 5 | Intent 6 | Quality 7 | Originality 5 | Appeal 6 | Style 5 | Monetization 5 | Shareability 4 | Maintenance 7 | **Overall 5.5**

**Strengths**
- Specific, useful ideas: "individual vs combined weight" wording table; two feeding zones tied to ASPCA resource-guarding guidance; solo-driver logistics; fee-math table with a cap row.
- Appropriately cautious about aggression.

**Weaknesses**
- Identity split: half is accommodation, half is road trip/car safety/arrival. Matches neither query cleanly. "Treat the car as part of the booking" and extension-tether advice belong in the car-safety guide.
- Cannibalization: how-many-dogs-can-you-bring-to-a-vacation-rental covers count limits (the core two-dog question) and the fee table is a clone of the fees guide (same four formulas, different numbers).
- Style: "Make arrival boring on purpose" is a good line; surrounded by "Compare the awkward details" and "Common mistakes: declaring only one dog (disclose both and confirm the fee); assuming the dogs must share everything; ..." in one paragraph. Reference-sheet prose; no feel for the owner's anxiety about two different dogs.
- Pet fee numbers all hypothetical; no data on how many managers allow 2 vs 3 dogs though the dataset likely holds pet-count limits.
- Typos/oddities: "motorway" (British term) in a US-targeted guide.

**Competitors**
1. https://pawventures.pages.dev/blog/traveling-with-multiple-dogs-tips/ [MEASURED: fetched]; Feb 2026, 12-minute read, anonymous "Editorial Team", affiliate disclosures, hotel fee table (Kimpton/La Quinta/Loews etc.), cost table ($875-$1,075 for 2 dogs over 5 days), says Vrbo/Airbnb better for 3+ dogs. Does better: concrete dollar tables, broader coverage. Misses: authorship, sourcing (its 38% stat is unlinked), rental-specific verification.
2. https://dogtripbritain.com/guides/two-dogs-holiday/ [FROM FILE]; two-dog fee structures, UK.
3. https://iheartdogs.com/traveling-with-dogs/ [MEASURED: in results]; broad, large media brand.
4. https://vcahospitals.com/know-your-pet/traveling-with-your-pet [MEASURED: in results]; vet authority, hotel-oriented.
5. https://khpet.com/blogs/dogs/how-to-stay-at-a-hotel-or-vacation-rental-successfully-with-your-dog [MEASURED: in results]; retailer blog.
6. https://www.going.com/guides/staying-in-a-hotel-with-your-pet [FROM FILE]; hotel-led.
Verdict: [ESTIMATE] a mix of one detailed affiliate-style guide, a vet brand and generic travel-tips pages; the rental-specific two-dog angle is moderately open.

**Recommended improvements**
1. Decide the page's job: make it "Renting with two dogs" (count, combined weight, fees, layout, meals) and move car/solo-driver content to dog-car-safety guide. Merge or sharply delineate against how-many-dogs-can-you-bring (suggest merge the count content into one page or cross-cap).
2. Add dataset content: share of managers capping at 2 dogs, combined vs per-dog weight rules.
3. Replace fee clone table with a link plus a real two-dog example from the dataset.
4. Rewrite intro to open on the specific two-dog problem (the 22 lb terrier and the 74 lb lab), fewer lists.
5. US spelling and terms.

**Priority:** Medium. **Verdict:** MERGE (with how-many-dogs-can-you-bring, keep one stronger page) if the dataset-backed count data can be delivered; otherwise REPOSITION.

---

## 5. How to Find Vacation Rentals That Welcome Large Dogs
Slug: vacation-rentals-that-welcome-large-dogs

**Current title:** How to Find Vacation Rentals That Welcome Large Dogs (seoTitle "Renting With a Large Dog: 5 Checks")
**Recommended title:** "Vacation Rentals for Large Dogs: How to Find One That Actually Says Yes". Why: the headline should promise the outcome; seoTitle says "5 Checks" but the page does not have a numbered five-item list, so the numeric promise is unmet. Fix the mismatch.
**Primary keyword:** vacation rentals that allow large dogs. Variants: large dog friendly vacation rentals; vacation rentals no dog weight limit; pet friendly rentals big dogs; vacation rental breed restrictions. [ESTIMATE: high commercial intent, strong owner pain ("my 80 lb lab is always rejected"), broadly demanded.]

**Scores:** SEO 6 | Traffic 6 | Intent 5 | Quality 7 | Originality 5 | Appeal 8 | Style 5 | Monetization 6 | Shareability 5 | Maintenance 6 | **Overall 5.9**

**Strengths**
- Targets the most emotionally loaded problem in the set (big dog, repeated rejections).
- "Large dogs considered" means ask, not yes: a good line and useful decoder table.
- Permission vs practical-fit test; route/stairs/flooring section is genuinely useful.
- Honest insurance explanation via III (breed restrictions vary; health cover is not liability).

**Weaknesses**
- The headline promises "how to find ... that welcome large dogs" but the page cannot deliver the finding: no list of large-dog-welcoming managers, no state, no filter results. Only an unnamed local manager's "Dogs Over 30lb" filter and a generic Vacasa line. The site's own dataset (weight caps across 38 managers) is exactly the answer: which managers have no weight cap. This is a severe intent gap. [ESTIMATE, but strong.]
- "Large" never defined; the page says no universal definition, but a dataset-derived threshold would resolve it.
- Style: "Overvaluing acreage." / "Starting with photographs." in a bold-lead bullet list; mostly reference lists. Sentences like "Think about a wet walk, a minor injury or a tired evening, not only the dog's best day" are the closest thing to warmth; there should be more.
- Source mix: relies on a sample of 2 commercial pages; pawventures competitor critiqued by the file as "affiliate-style blog with unverified figures".
- Overlaps with breed-restrictions-at-vacation-rentals (not in my six, but exists) and two-dog guide's weight table.

**Competitors**
1. https://www.vacasa.com/usa/explore/Dog-friendly [MEASURED: in results for "vacation rentals that allow large dogs no weight limit"]; big brand, many city pages; says limits vary by home. Strong listings, weak advice.
2. https://www.sunpalacevacationhomes.com/pet-friendly/ [FROM FILE]; local manager with a size category; inventory-led.
3. https://searanchsonoma.com/pet-friendly [FROM FILE]; explicit 50 lb ceiling.
4. https://pawventures.pages.dev/blog/dog-friendly-vacation-rental-booking-guide-2026/ [MEASURED: in results; its sister article fetched shows affiliate-style tendencies]; says filter does not filter weight.
5. https://www.avantstay.com/blog/pet-friendly-vacation-rentals-with-fenced-yard/ [MEASURED: in results]; fenced-yard listicle.
6. https://blog.gopetfriendly.com/tips-for-booking-a-pet-friendly-vacation-rental/ [MEASURED: in results]; the search summary says it describes asking an owner to waive a size limit; a useful tactic our page lacks (persuading a host).
Verdict: [ESTIMATE] the broad term is owned by Vacasa-type managers and OTAs; the "no weight limit" and "how to get a yes" angles are open. The site's data could produce the only evidence-based list.

**Recommended improvements**
1. Add a dataset section: "Managers with no weight cap / caps at 50 / 75 lb", with the data table linked from the dog-type page for large dogs (src/content/dog-types.ts). This converts a method page into the answer.
2. Add "how to ask for an exception" (offer a pet cleaning fee/references) as Afar/GoPetFriendly do; it is the human problem.
3. Fix the seoTitle ("5 checks") to match content or restructure the page into five numbered checks.
4. Trim stairs/flooring text to scannable items; give examples ("an 80 lb dog and a spiral stair").
5. Define "large" using the dataset.

**Priority:** High (largest upside, most obvious mismatch between promise and delivery). **Verdict:** IMPROVE (data-led rewrite of the core)

---

## 6. What to Pack for a Dog-Friendly Cabin Vacation
Slug: dog-friendly-cabin-packing-list

**Current title:** What to Pack for a Dog-Friendly Cabin Vacation (seoTitle "Dog Cabin Packing List: Ticks, Bears, Cold")
**Recommended title:** "Dog-Friendly Cabin Packing List (With the Bear, Tick and Wood-Stove Stuff Most Lists Miss)". Why: the seoTitle's specificity is the hook; the primary query is "packing list".
**Primary keyword:** dog friendly cabin packing list. Variants: what to pack for a cabin with a dog; dog vacation checklist; dog travel packing list; printable dog packing list. [ESTIMATE: packing lists are evergreen and Pinterest-friendly; the generic "dog travel packing list" head term is crowded by Chewy, Eagle Creek, BetterPet.]

**Scores:** SEO 6 | Traffic 6 | Intent 6 | Quality 7 | Originality 6 | Appeal 6 | Style 5 | Monetization 7 | Shareability 6 | Maintenance 8 | **Overall 6.3**

**Strengths**
- Real differentiation on safety: bear-resistant vs ordinary bin, antifreeze in cabin toilets, mothballs/rodent bait in reopened cabins, stove clearances, ice melt. Competitors (per the file) skip these.
- Best monetization fit in the set: harness, towels, stair gate, first-aid kit, tick tool, bowls, headlamp, boots, collar light are all natural affiliate placements, once approved.
- Three-layer car-loading idea and offline emergency folder.
- Reasonably timeless; lowest upkeep after fenced yard.

**Weaknesses**
- Not a list-first page: "A practical packing list" is mostly paragraphs about hazards. Packers want checkboxes grouped by category (and a printable). There is the tools.packing-list route, but the guide does not clearly point to it; it links /tools/checklist (the booking checklist) instead. [Check: src/routes/tools.packing-list.tsx exists; the guide's relatedTools are checklist and pet-cost-check.] Mismatched tool.
- Overreach in the first 150 words: bear storage, poison control numbers, ticks and heaters before the reader has a list. The opener is a summary rather than a hook.
- Unsourced claim: "State parks in Georgia and California generally cap leashes at six feet" has no citation, unlike the rest. Tick/poison-control numbers are dated phone numbers needing periodic recheck (maintenance).
- Style: "Packing mistakes worth avoiding" and clipped bullets; 12 citations make parts read like a vet handout. Warm voice missing; no "the one thing I'd never leave behind".
- Overlap with dog-travel-first-aid-kit-guide, dog-travel-water-and-feeding-gear-guide, dog-id-tags-and-gps-trackers-for-travel-guide, dog-car-safety guide: this page contains a first-aid section, water/feeding, ID/chip, and car loading that each duplicate a separate guide on the site.
- Does not use any dataset (e.g. which cabin managers provide pet beds/bowls).

**Competitors**
1. https://unyoked.co/Journal/dog-friendly-cabin-packing-checklist [MEASURED: in results]; brand with a polished voice; short; no first aid or wildlife.
2. https://www.elkspringsresort.com/?p=37591 [MEASURED: in results]; Smoky Mountain cabin resort list with bear FAQ, stair gates.
3. https://www.clrm.ca/the-ultimate-packing-checklist-for-your-pet-friendly-cottage-vacation/ [MEASURED: in results]; cottage company; skunk kit, life jacket.
4. https://toccoacurrents.com/dog-friendly/dog-travel-packing-list [FROM FILE]; Georgia-mountain cabin angle.
5. https://be.chewy.com/?p=17398 [MEASURED: in results]; Chewy is a major pet retailer; links to product.
6. https://eaglecreek.com/blogs/articles/ultimate-dog-packing-list-what-to-pack-for-your-pet [MEASURED: in results]; gear brand.
7. https://betterpet.com/packing-list-for-pets-vacation [MEASURED: in results]; pet publisher.
8. https://youdidwhatwithyourweiner.com/?p=20722 [MEASURED: in results]; printable checklist blog; the sort of Pinterest-targeted asset our page lacks.
Verdict: [ESTIMATE] crowded with retailers and brands for the generic term; the cabin-specific long tail (bear, wood stove, winterized cabin) has thinner coverage but small volume.

**Recommended improvements**
1. Lead with a scannable, grouped checklist (documents, food, gear, cleanup, safety) with a printable PDF/Pinterest graphic; point the tool link to /tools/packing-list.
2. Source or delete the leash-length claim; recheck phone numbers on a schedule (put in maintenance doc).
3. Cut first-aid and ID sections to short summaries linking the existing first-aid and ID-tag guides to reduce cannibalization.
4. Tighten the opener to a hook (the cabin 40 minutes from a store) rather than a bullet summary.
5. Mark natural affiliate slots (harness, boots, bear-safe container, stair gate) for when programs are approved, without adding links yet.

**Priority:** Medium. **Verdict:** IMPROVE

---

## Ten-line summary
1. Weakest overall of six: checklist 5.4, two-dogs 5.5; strongest: fenced-yard 6.5, fees 6.1, packing 6.3. Mean about 5.9. Nothing earns a 9.
2. The proprietary 38-manager dataset appears in none of the six; this is the largest missed differentiator, and fixes the large-dogs promise-vs-delivery gap.
3. Hypothetical-only dollar figures make the fees/two-dog tables unshareable; swap in dataset ranges.
4. Prose is accurate, carefully sourced and over-hedged; repeated "Do not assume / ask / confirm" patterns and duplicated host-message templates read compliance-memo, not boutique.
5. Cannibalization cluster: checklist, fees, large-dogs, two-dogs and how-many-dogs (plus breed-restrictions); packing list vs first-aid/water/ID guides; fenced-yard vs Georgia fenced and portable-fence guides.
6. Checklist guide is 3,700 words for a "checklist": reposition and push depth to spokes.
7. Two-dogs guide should be merged with how-many-dogs-can-you-bring or narrowed; car content belongs in the car-safety guide.
8. Verify the unprovable first-hand claim in the fees guide (Blue Ridge Airbnb test, $519.11 to $576.61) or remove; source the unsourced leash-length claim in the packing list.
9. Missing downloadable assets: printable pre-booking card, fence-check card, packing list PDF/Pinterest graphics.
10. Priorities: High = fees, checklist, large-dogs; Medium-High = fenced-yard; Medium = two-dogs, packing. Verdicts: 3 IMPROVE (fees, fenced-yard, large-dogs plus packing = 4 IMPROVE), 1 REPOSITION (checklist), 1 MERGE (two-dogs).
