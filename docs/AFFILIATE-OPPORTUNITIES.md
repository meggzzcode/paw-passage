# Affiliate opportunities audit (proposals only)

Scope: the 16 published guides (15 TypeScript guides in `src/content/guides/*.ts` plus `content/guides/how-vacation-rental-pet-fees-work.md`) and the 6 gear files in `src/content/gear/*.ts` (28 products). Nothing in any article was changed. Two draft test articles in `content/guides/` (`cms-test-article.md`, `cowork-test-article.md`) are `status: draft`, are not part of this audit, and must never receive affiliate links.

Standards this audit holds to (`src/routes/editorial-standards.tsx`): no claim of visiting or testing, no invented experiences, no ratings or prices, no unverified rentals recommended, links only where the owner is approved.

## 1. How links and disclosures work today (verified in code)

- `content/affiliates.yml` is `links: []`. No link is approved, so no button, inline link or notice renders anywhere today.
- Product picks: a guide's `gear` array points at products in `src/content/gear/`. `GearPicks.tsx` renders a button only when `getApprovedLink(product.affiliateId)` returns an approved link. The button reads "See it at {network}" and carries `rel="sponsored nofollow noopener noreferrer"`. A box ("Some links below are affiliate links...") appears above the picks, with the Amazon sentence if any link is Amazon.
- Inline links: the Markdown renderer already supports `[words](aff:link-id)`. It renders a real link only if that id is approved (also `rel="sponsored"`).
- Top-of-article notice: `AffiliateNotice.tsx` (rendered by `guides.$slug.tsx` above the body) appears only when `affiliateUsage()` finds at least one approved link, inline or in picks. So the premise "inline links need a top-of-article disclosure" is already built; no per-article code is needed.
- Stays: `affiliateId` and `sponsored` exist on stays, but `verifiedStays` is empty and no article embeds a stay. There is currently no verified-stay booking inventory, so there is no honest booking link to place anywhere.

## 2. Site-wide findings that affect every article

1. **Disclosure copy only describes bookings.** `src/routes/affiliate-disclosure.tsx` says "If you click one and make a booking, we may earn a commission from the booking platform" and "Booking buttons appear only on stays...". It never mentions product links, Amazon, or retailer commissions. The "Money" paragraph in `editorial-standards.tsx` also says only "booking links". Both must be updated before the first product link goes live (Amazon's required statement is already in `affiliates.ts`).
2. **Five gear guides state that no links exist, in present tense.** These sentences become false the day a link is approved (quoted per article below). The two car-safety and first-aid versions say "may become affiliate links in future"; the water guide promises "any button will be marked as sponsored", but `GearPicks.tsx` shows no visible "Sponsored" label, only `rel="sponsored"`. Either add a visible label or reword the promise.
3. **Latent bug in link resolution.** `GearPicks.tsx` uses `getApprovedLink(product.affiliateId)` (no fallback), while `affiliate-usage.ts` uses `productLinkId()` = `affiliateId ?? id`. If an approved link has the same id as a product but the product's `affiliateId` is unset, the top-of-article notice shows while no button renders. Make both use `productLinkId`, or always set `affiliateId`.
4. **Product gaps readers genuinely need** (none yet in gear files; each needs a maker page read and a `specSource` before any link): strap kits for the two crash-tested crates (Lucky Ratchet Strap Kit, GUNNER tie-down straps), dog-only absorbent towels (the rental-protection guide says it "could not confirm current availability"), a large-capacity travel bowl (the water guide's table row "A larger bowl than the small ones above; check capacity on the maker's page"), a leash, a tick-removal tool, a traction runner or mat. Do not link search-result pages or generic Amazon searches as a stand-in.
5. **Inconsistency to fix before cross-linking.** `traveling-with-two-dogs-accommodation-guide` says "The AVMA recommends ... safely restraining dogs with harnesses, tethers, or similar accessories", while the car-safety guide says CPS warns that extension tethers "increase the risk of injury". Linking the two articles will put the contradiction side by side.
6. **Selection integrity.** Every gear guide says picks come from criteria and specs. Once commissions exist, record in each gear file that the pick set was fixed before links were added, and do not add or drop a product because a program pays or does not pay. The `affiliateId` can be left unset for products with no program; they must still be listed.
7. **Link destination vs the "check the maker" advice.** Several pick cards tell readers to confirm size or certification "with the maker". If a link goes to a marketplace (especially third-party sellers) rather than the maker or an authorised seller, that advice and the crash-test claims for Sleepypod, GUNNER and Lucky Duck can be undermined. Prefer maker or authorised-retailer programs for the car-safety and first-aid picks.

### Ground rules used for every proposal below

- Link only on a sentence that names a product or need plainly and already relies on maker specs. Never on a sentence implying use or testing.
- Prefer sending non-gear articles to the relevant gear article (it holds the specs, the "check before you buy" notes and the disclosure box) over putting a product link inside planning prose.
- No links in: crash-force or restraint-installation text, first aid and poisoning text, heat/heatstroke text, lost-dog procedure, the ADA/service-animal sections, fee/deposit/damage-waiver/insurance sections, or any sentence that tells the reader what to do for safety.
- Booking: platform-level search links (Airbnb, Vrbo) are the only booking links that could exist without verified stays, and they currently conflict with the disclosure page ("Booking buttons appear only on stays whose details we have verified"). They are marked "conditional: policy decision" below and are not counted as ready.

---

## 3. Gear guides (6)

### 3.1 `dog-car-safety-harness-and-crate-guide` (Gear)

**a) Readiness.** Highest. Four picks in `gear` (`sleepypod-clickit-range`, `sleepypod-atom`, `gunner-g1-kennel`, `lucky-duck-lucky-kennel`), spec-sourced, CPS-listing detail. No inline links, no stay mentions, no approved links. Safety-critical article.

**b) Opportunities (max 4).**
1. Sentence: "**Toy or very small dog:** A carrier tested for your dog's weight, such as the Atom's 12 lb rating." Product: Sleepypod Atom, `sleepypod-atom`. Helpful because the reader needs the maker page to see the 12 lb limit and the missing securing instructions. Keep the pick card's watch-out ("never leave it loose") adjacent.
2. Sentence: "**Medium dog, sedan:** A harness on the rear seat belt. Check that the size chart matches your dog's rib cage." Product: `sleepypod-clickit-range`. Helpful because the size chart and Regular/Long fits are on the maker page.
3. Sentence: "**One large dog, SUV with a cargo area:** A Large-size crate with strength-rated straps, after checking your anchor points with the vehicle maker." Product: `lucky-duck-lucky-kennel` (Large, 110 lb test dog). Not `gunner-g1-kennel`, whose Large is "not listed as certified". Helpful because only the Lucky Large is CPS-listed at this size in the article.
4. Sentence: "The maker lists Small (up to 30 lbs), Medium (up to 45 lbs), Intermediate (up to 70 lbs) and Large (71+ lbs) sizes, with built-in tie-down pins and straps sold separately." Product: none yet (GUNNER tie-down straps and Lucky Ratchet Strap Kit need product entries). Helpful because the tested configuration requires the maker's straps, and the article tells readers not to substitute bungee cords. Link only to the maker-specified strap.
Do not link: anything under "What 'crash-tested' does and does not mean", "Install it correctly", "Safety caveats worth repeating", or "After a crash, replace safety gear." A link there would read as a safety endorsement beyond CPS and the maker.

**c) Cross-links (gear to gear).** `dog-friendly-rental-protection-gear-guide` (a hammock or seat cover is not a restraint, so readers buying one should land here first); `dog-travel-water-and-feeding-gear-guide` (long drives need a water plan; its "never leave a pet in a parked vehicle" text matches this article); `dog-id-tags-and-gps-trackers-for-travel-guide` (this article already says to carry a temporary travel tag; the ID guide covers tag content).

**d) Risks.**
- "Some links in gear guides may become affiliate links in future, which means Paws & Passage may earn a commission if you buy through them, at no extra cost to you. We do not accept payment for placement." Rewrite in present tense. "We do not accept payment for placement" is defensible only if no sponsored placement exists; say plainly that commissions are earned on purchases.
- "These four products appear on a maker page we could load and, for the tested configurations noted, in CPS listings." Keep; do not let a link appear on products whose certification differs (Clickit "2X-Large" and Regular/Long are not on the CPS listing).
- FAQ "Does this site recommend one product above the rest?" / "No." Fine, but the visible order of picks must not follow commission rate.
- Pick-card `bestFor` strings use "A large dog up to 110 lbs in a secured crate"; keep factual, avoid "best".
- Product copy "Sizes can be out of stock; check availability with the maker" conflicts with a marketplace destination (finding 7).

### 3.2 `dog-friendly-rental-protection-gear-guide` (Gear)

**a) Readiness.** Three picks (`orvis-embossed-sherpa-throw`, `kurgo-loft-wander-dog-bed`, `kurgo-heather-hammock`). No inline links, no stays, no links. Explicitly says no towel is recommended.

**b) Opportunities (max 4).**
1. Sentence: "The Orvis Embossed Sherpa Throw is listed at 40 by 40 inches, which is a lap-and-seat-sized layer rather than full coverage." Product: `orvis-embossed-sherpa-throw`. The reader needs the maker's size and care page.
2. Sentence: "The Kurgo Loft Wander Dog Bed is an example of the type." Product: `kurgo-loft-wander-dog-bed`. The reader is told to compare the maker's open and rolled dimensions with their luggage.
3. Sentence: "Hammocks are made for bench seats. The Kurgo Heather Hammock page says to use it in vehicles with bench seats under it and not to use it with bucket seats or over an open space without a bench seat." Product: `kurgo-heather-hammock`. The reader must check width (55 in) and the bucket-seat warning on the page. Keep "A back-seat cover is not a restraint" within sight.
4. Sentence: "We do not recommend a specific towel in this guide. We looked at wearable, absorbent towels and could not confirm current availability on a maker page, so we left them out rather than guess." Product: none yet. This is a product-research task, not a link: add a towel only after a maker page is read. Do not substitute a search link.

**c) Cross-links.** `dog-car-safety-harness-and-crate-guide` (already linked in text; keep, it is the safety counterpart to the hammock); `portable-dog-fence-and-playpen-guide-for-rentals` (its text suggests a mat or rug under pens, and its floor-protection advice overlaps).

**d) Risks.**
- "Paws & Passage may earn a commission if you buy through an affiliate link on this site. No such links are active in this guide at the time of writing..." Must change at launch. Same for the FAQ answer "If an affiliate link is added later, the site may earn a commission".
- "We checked each seller's page on 2026-11-16 and each showed an Add to Cart button, but availability changes..." This implies the retailer we link to was checked. If the link goes to a different seller than the page checked, reword to "the maker's page".
- "A few pieces of washable gear handle a lot of it." Mild efficacy claim; soften to "can reduce".
- The "Choosing a washable furniture cover or throw" section tells readers a cotton throw or old bedsheet is fine. Keep it; it is what keeps the guide honest next to a link.

### 3.3 `dog-id-tags-and-gps-trackers-for-travel-guide` (Gear)

**a) Readiness.** Five picks (`akc-reunite-stainless-collar-tag`, `akc-reunite-reflective-id-collar`, `tractive-dog-6`, `tractive-dog-6-xl`, `fi-series-3-plus`). No inline links, no stays, no links. The gear file itself notes for Fi: "re-check the maker's current pages before adding an affiliate link."

**b) Opportunities (max 4).**
1. Sentence: "Check the ring and the connection before every trip, or choose a collar with the details built into a nameplate." Product: `akc-reunite-reflective-id-collar`. Directly answers the tag-detachment problem described.
2. Sentence: "The two AKC Reunite items put the ID number and a helpline where a finder can read it, which is what the first layer is for." Products: `akc-reunite-stainless-collar-tag`, `akc-reunite-reflective-id-collar`. The article already discloses that "AKC Reunite is a registry that sells enrollment and collar tags".
3. Sentence: "Tractive lists the DOG 6 for dogs above 8.8 lbs and the DOG 6 XL for dogs above 44.1 lbs." Products: `tractive-dog-6`, `tractive-dog-6-xl`. The reader needs the maker's current weight, coverage and subscription page.
4. Sentence: "Fi's collar page lists a long battery life in a collar-style design, but it does not state carrier, coverage or subscription terms..." Product: `fi-series-3-plus`. Conditional: only after the maker's coverage and membership terms are re-read, as the article itself says.
Do not link: the microchip-registration section (naming one registry as "the" place to register would contradict "There is more than one pet recovery registry"), the lost-dog plan, or the AirTag paragraph (Apple's page does not describe pet use and the article steers readers away).

**c) Cross-links.** `portable-dog-fence-and-playpen-guide-for-rentals` (its table row "A rental with a yard, or a dog that escapes" already sends readers to the secure-yard guide; a tracker buyer without a fence needs this one); `dog-car-safety-harness-and-crate-guide` (escapes at car stops; temporary travel tag).

**d) Risks.**
- "Paws & Passage may earn a commission if you buy through an affiliate link on this site. No such links are active in this guide at the time of writing..." Rewrite at launch.
- Trackers carry a subscription, so commissions may be recurring. The sentence "A subscription is part of the deal. Check the maker's current terms before you buy" stays true but the disclosure should say commissions can be earned on the product and the plan, if the program pays that way.
- "Tractive appears because its page states weight ranges, collar widths, battery figures, connectivity and the subscription requirement plainly." True now; it must remain the reason. Note it also says "AKC Reunite is a registry that sells enrollment and collar tags, so read its pages with that in mind", a good precedent for revealing commercial interest.
- "No gear can promise a dog will not get lost." Keep prominent; do not add "lost-dog insurance" style claims near links.

### 3.4 `dog-travel-first-aid-kit-guide` (Gear)

**a) Readiness.** Five picks (`amk-me-and-my-dog`, `amk-trail-dog`, `kurgo-dog-first-aid-kit`, `kurgo-rsg-dog-first-aid-kit`, `baskerville-ultra-muzzle`). No inline links, no stays, no links. Medical-adjacent: the highest need for restraint on links.

**b) Opportunities (max 4).**
1. Sentence: "Kurgo's listing names parachute cord, a first aid guide, tweezers, tape, a crepe bandage, gauze pads and rolls, a trauma pad, scissors, an instant cold pack, gloves, an emergency blanket and antiseptic wipes in a zippered case with interior mesh compartments." Product: `kurgo-dog-first-aid-kit`. No medications listed, so the lowest-risk kit link.
2. Sentence: "This is a smaller, MOLLE-compatible version designed to attach to the maker's RSG harnesses and utility belt, with a contents list very close to the larger Kurgo kit." Product: `kurgo-rsg-dog-first-aid-kit`.
3. Sentence: "The Baskerville Ultra is a basket-style muzzle made of thermoplastic rubber." Product: `baskerville-ultra-muzzle`. The reader needs the maker's sizing (nose length and circumference). Keep the vomiting warning and "Practice with the muzzle at home" in the same section.
4. Sentence: "This is the larger of the two Adventure Medical Kits options." Product: `amk-me-and-my-dog` (and `amk-trail-dog` at "The maker lists a smaller, dog-focused kit at 12 oz"). Conditional: these kits list aspirin, diphenhydramine and 3% hydrogen peroxide, and the article tells readers to discuss them with a vet. Link only with that paragraph intact.
Do not link: "Items with conditions attached" (charcoal, peroxide), poison control numbers, heatstroke, "Learn the basics before you need them", the thermometer or styptic add-ons (a link would look AVMA-endorsed; the styptic item is also described as containing benzocaine), or "Things to leave out unless your vet says otherwise".

**c) Cross-links.** `dog-travel-water-and-feeding-gear-guide` (the article says "Towels, a collapsible bowl and bottled water earn their place in a travel kit" for heat); `dog-car-safety-harness-and-crate-guide` (it contains the transport advice for an injured dog context).

**d) Risks.**
- "Some links on this site may become affiliate links in future. If you buy through one, Paws & Passage may earn a commission... No affiliate link is active on this page at the time of writing, and a commission would never change what we recommend." Rewrite at launch.
- "Both approaches work, and the best answer is often a hybrid." and "**Why buy a kit.** You get the basic bandaging supplies in one organized, often waterproof case, and you are less likely to leave the house without them." Reads pro-purchase once links exist; soften to a neutral comparison and keep "Why add to it" equally prominent.
- "Nothing here is veterinary advice." Keep, and never place a link in a sentence that tells the reader what to do in an emergency.
- Human-medication items inside two picks (see 4 above): the disclosure box must not sit directly above a card that lists them without the vet warning.

### 3.5 `dog-travel-water-and-feeding-gear-guide` (Gear)

**a) Readiness.** Five picks (`kurgo-collaps-a-bowl`, `springland-22oz-original-travel-bottle`, `springland-20oz-flip-travel-bottle`, `vittles-vault-travel-tainer`, `kurgo-kibble-carrier`). No inline links, no stays, no links. Cleanest gear article: low safety risk, clear specs.

**b) Opportunities (max 4).**
1. Table row: "Day hike with one dog | Packed size, a clip, a way to serve water | Kurgo Collaps A Bowl plus a bottle". Product: `kurgo-collaps-a-bowl`. Maker lists 24 oz and top-rack dishwasher safety.
2. Table row: "Long car trip, frequent stops | Water you can serve one-handed, familiar water from home | Springland 22oz Original Travel Dog Water Bottle". Product: `springland-22oz-original-travel-bottle` (and `springland-20oz-flip-travel-bottle` for the compact-shape row).
3. Sentence: "It fits the \"one rigid kit for a cabin or camp weekend\" situation: food, a seal and two bowls in one package." Product: `vittles-vault-travel-tainer`. Keep "an airtight seal is not wildlife protection" in view.
4. Sentence: "It is a packing tool: lighter and easier to squeeze into a bag than a rigid bin." Product: `kurgo-kibble-carrier`.
Product gap (not a link yet): the table row "Large dog on a hot day | Capacity and refills | A larger bowl than the small ones above; check capacity on the maker's page" points to a need no listed product meets. A bear-resistant container is the other obvious reader need, but a link there would be a wildlife-safety endorsement; add only with an independent certification source.
Do not link: the heat and heatstroke sections, the BearWise and NPS sections, "Leaving the dog in the car".

**c) Cross-links.** `dog-travel-first-aid-kit-guide` (heatstroke signs lead into what to do and carry); `dog-car-safety-harness-and-crate-guide` (it already warns about the parked vehicle; add the restraint context for long drives).

**d) Risks.**
- "At the time this guide was published, none of the products has an active affiliate link. If that changes, any button will be marked as sponsored." The button is not visibly marked "sponsored" today (finding 2). Fix the code or the sentence.
- "We have not tested these products, and we do not claim they are the best available." Keep. The heading "Our five picks" and "Pick to look at" stay factual; avoid adding "top" or "favorite".
- "Kurgo Collaps A Bowl ... **It earns a place because the spec list covers the practical points...**" Fine because it is spec-based; do not turn it into "great".
- Three of five picks are Kurgo: if only Kurgo has an affiliate program, the guide will look Kurgo-skewed. Disclose and keep the non-Kurgo picks (Springland, Vittles Vault) in the same visible position.

### 3.6 `portable-dog-fence-and-playpen-guide-for-rentals` (Gear)

**a) Readiness.** Five picks (`midwest-exercise-pen-with-door`, `north-states-petyard-passage-8-panel`, `carlson-extra-wide-walk-thru-gate-0930`, `carlson-36-extra-tall-walk-thru-gate`, `carlson-design-paw-freestanding-gate`). No inline links, no stays, no links.

**b) Opportunities (max 4).**
1. Sentence: "Carlson's 30-inch walk-thru gate lists adjustable pressure mounts as its default way to install." Product: `carlson-extra-wide-walk-thru-gate-0930`. The reader must check the "does not fit between 32 and 34 inches" gap on the maker page.
2. Sentence: "Carlson's Design Paw model is freestanding and eliminates wall mounting or drilling, but it is only 20 inches tall and the maker describes it as specifically designed for puppies and toy breeds." Product: `carlson-design-paw-freestanding-gate`.
3. Sentence: "The MidWest pen reviewed below is made of eight connected panels." Product: `midwest-exercise-pen-with-door`.
4. Sentence: "The North States play yard is also eight pre-connected panels." Product: `north-states-petyard-passage-8-panel`.
Leave `carlson-36-extra-tall-walk-thru-gate` as a pick-card link only: the article itself warns "'required wall mounting' language is the key issue for travelers", and an inline link would send renters toward drilling.
Do not link: the tie-out discussion (the article refuses to feature any; many programs sell them), "We do not recommend putting any pressure-mounted gate at the top of a staircase", or "When not to use a portable pen at all".

**c) Cross-links.** `dog-id-tags-and-gps-trackers-for-travel-guide` (a pen does not replace an escape plan); `dog-friendly-rental-protection-gear-guide` (floor and trim protection, mats and towels).

**d) Risks.**
- "Paws & Passage may earn a commission if you buy through a link on a page like this one. No commission links appear in this guide yet..." Rewrite at launch.
- "These are not ranked and not tested." Keep; card order must not be chosen by commission.
- The 36-inch gate card says "the maker calls it ideal for larger or active dogs" and the article says drilling "is almost certainly off the table". A buy button on that card should keep the watch-out visible.
- "The best portable setup is one that fits the dog you actually have." Generic; fine.

---

## 4. Non-gear guides (10)

For each, "links" means in-text opportunities, product or booking; "cross-links" means internal links to gear guides.

### 4.1 `dog-friendly-cabin-packing-list` (Checklist)

**a) Readiness.** No `gear` picks, no stay mentions, no links. Dense in product needs (about 80 packing items). Strongest non-gear source of reader intent.

**b) Opportunities (max 4).**
1. Sentence: "Separate food and water bowls, plus a portable drinking bowl." Product: `kurgo-collaps-a-bowl` (or the Springland bottle). Prefer routing via the water guide.
2. Sentence: "Use a closed container to contain kibble spills and keep packaging tidy." Products: `vittles-vault-travel-tainer`, `kurgo-kibble-carrier`. Safe because the next paragraph says "A regular food bin is **not** a bear-resistant container."
3. Sentence: "A portable gate or exercise pen can help separate a dog from an entrance, food preparation, or an unsuitable room." Products: `carlson-extra-wide-walk-thru-gate-0930`, `midwest-exercise-pen-with-door`. Link only on this first sentence; the next paragraph covers stairs and host permission.
4. Sentence: "A collar with a readable identification tag and a reachable phone number." Product: `akc-reunite-stainless-collar-tag`.
Considered and rejected: "A familiar bed or mat" (the article says "The best comfort item is usually something your dog already recognizes"), first-aid items (the article says "Discuss the contents with your veterinarian"; send to the first-aid guide only), the tick-removal tool (product gap), boots (no product, fit-sensitive), anything under Category 7 and 8 safety text.

**c) Cross-links (6).** `dog-travel-water-and-feeding-gear-guide` (Category 1 food and water); `dog-travel-first-aid-kit-guide` (Category 6); `dog-id-tags-and-gps-trackers-for-travel-guide` (Category 2); `portable-dog-fence-and-playpen-guide-for-rentals` (Category 3 barriers); `dog-friendly-rental-protection-gear-guide` (Category 4 and 5: covers, towels, car hammock); `dog-car-safety-harness-and-crate-guide` (the line "Your usual vehicle restraint or secured travel crate").

**d) Risks.**
- "Avoid making vacation the moment you introduce a new food, unfamiliar supplement, or elaborate chew collection." and "**Using the holiday to trial everything new.** Practice with boots, barriers, crates, and restraints at home." Directly in tension with a buy button next to new products; keep this advice visible next to any link.
- "Quantities should follow your actual itinerary, your dog's needs ... not a universal rule about how many bowls or blankets every dog needs." A good guard against upsell; do not convert the checklist into a shopping list.
- "A regular food bin is **not** a bear-resistant container. Neither is an ordinary cooler." Never link a container in this paragraph.

### 4.2 `pet-friendly-vacation-rental-checklist` (Checklist)

**a) Readiness.** No picks, no products, no links. Mostly booking, money and legal content. Mentions Airbnb and Vrbo neutrally; includes an ADA/service-animal section and an insurance sentence.

**b) Opportunities (max 4, only 3 honest).**
1. Sentence: "Bringing a throw is considerate when furniture use is allowed; it does not override a prohibition." Product: `orvis-embossed-sherpa-throw` via the rental-protection guide. Reader value: shows what a travel throw is, and the guide covers asking the host first.
2. Sentence: "If you need a sitter or day care, check availability, admission requirements, pickup times, and suitability before making nonrefundable activity reservations." Product: none yet (a pet sitting or day care marketplace, if the owner is approved). Real reader need; write neutrally and name no single provider as best.
3. Sentence: "Enter accurate travel dates, guest count, and pet count before comparing prices." Product: platform-level Airbnb or Vrbo search link. Conditional: policy decision, see ground rules (conflict with the disclosure page and with "Recommend a specific rental we haven't verified"). If used, link every platform the article cites (Airbnb and Vrbo) equally.
Do not link: "Understand service animals separately from pets" (ADA/legal), "Read cancellation terms" and the trip-insurance sentence "If buying trip insurance, read covered reasons, pet-related provisions, exclusions, and documentation requirements" (financial product), the damage-waiver table rows, or the veterinary-help section.

**c) Cross-links (4).** `dog-friendly-rental-protection-gear-guide` (furniture rules); `dog-id-tags-and-gps-trackers-for-travel-guide` (the "Rental escape routes checked" checklist item); `dog-travel-first-aid-kit-guide` (the "Find veterinary help before departure" section); `portable-dog-fence-and-playpen-guide-for-rentals` (the "Fencing and water" section).

**d) Risks.**
- "Vrbo's house-rules guidance specifically allows hosts to state pet type, number, and size restrictions." and "Airbnb's current help guidance describes pet fees..." The article is even-handed between platforms; a link to only one approved program would tilt it. Keep platform descriptions sourced and symmetrical.
- "Do not conceal a dog, understate weight..." and "Do not buy an online certificate expecting it to create legal status." Affiliate links must never appear near these.
- "The right rental is the one that supports your actual days, not the one with the longest amenities list." Fine, but a booking button below it implies a recommendation; label as a platform search, not a stay.

### 4.3 `vacation-rental-secure-fenced-yard` (Planning)

**a) Readiness.** No picks, products or links. Mentions portable pens only to dismiss them as a substitute.

**b) Opportunities (max 4, 2 honest).**
1. Sentence: "A portable pen is not an automatic substitute for a suitable boundary either. Its appropriateness depends on the dog, construction, surface, weather, and supervision." Route: cross-link to the portable-fence guide; product ids there (`midwest-exercise-pen-with-door`, `carlson-extra-wide-walk-thru-gate-0930`). Link the guide, not a product.
2. Sentence: "Walk the perimeter before unclipping the leash." Route: ID/GPS guide for tags and trackers, product `tractive-dog-6` / `tractive-dog-6-xl` only inside the gear guide. A yard escape is the reader scenario the ID guide's table row names.
Do not link: the invisible and electric fence section (many programs sell these and the article says a virtual boundary "does not satisfy" a physical-enclosure need), pool separation, or the evidence-pack and gate-latch sections.

**c) Cross-links (2).** `portable-dog-fence-and-playpen-guide-for-rentals`; `dog-id-tags-and-gps-trackers-for-travel-guide`.

**d) Risks.**
- "'Secure' is an opinion until the construction and management details are supplied." Fine. Avoid any "secure your yard" product framing.
- "For a short rental stay, our booking standard is simple: if your plan requires a physical enclosure, a virtual boundary does not satisfy it." Strong stance; do not accept invisible-fence affiliate links anywhere on the site.

### 4.4 `how-vacation-rental-pet-fees-work` (Planning; Markdown in `content/guides/`)

**a) Readiness.** No picks, products or links. Almost entirely money and legal content (fees, deposits, damage waivers, a full ADA service-animal section). Editable in Pages CMS, so editors could type `(aff:...)` links; give them the rules in section 6.

**b) Opportunities (max 4, 1 conditional).**
1. Sentence: "Enter the correct dates and guests." (step 1 of "For a reliable quote"). Product: platform-level Airbnb or Vrbo search. Conditional: policy decision; if used, include both platforms the article cites and make clear it is a search, not a recommendation.
No honest product opportunities. Do not link the damage waiver or insurance items, the unexpected-charge section, or anything in "Service animals cannot be charged ordinary pet fees".

**c) Cross-links (1).** `dog-friendly-rental-protection-gear-guide` (readers who learn "Is ordinary pet hair covered by the agreed pet fee?" need hair-and-mud gear). The gear guide already links here; add the reverse.

**d) Risks.**
- "Do not rely on a universal claim that a pet fee is always hidden until checkout, or that every pet charge will appear under the same visible label in every regional interface." Statements about Vrbo and Airbnb pricing become interested statements once either platform pays us; keep them tied to the quoted help pages.
- "Do not misrepresent a pet as a service animal to avoid charges." and the DOJ text: no commercial content anywhere in this section.

### 4.5 `traveling-with-two-dogs-accommodation-guide` (Planning)

**a) Readiness.** No picks, products or links. Strong product-adjacent needs (restraints, bowls, gates, tags per dog).

**b) Opportunities (max 4).**
1. Sentence: "Before committing, load the actual restraints or secured carriers, both dogs' equipment, and your luggage." Route: car-safety guide (a restraint per dog; the guide already says "Two dogs: Separate restraints for each dog, never a shared one"). Cross-link only.
2. Sentence: "Pack separate bowls, resting places, and necessary medication records." Product: `kurgo-collaps-a-bowl` or `springland-22oz-original-travel-bottle`; the water guide says "the water supply is the first thing to double."
3. Sentence: "A baby gate is not adequate merely because it is convenient; it must be appropriate for the dogs and the situation." Route: portable-fence guide only; no product link, because the sentence sits in the resource-guarding section and the article refers readers to a vet or behaviourist.
4. Sentence: "Records, identification, medication, and emergency contacts are packed." (final checklist) Product: `akc-reunite-stainless-collar-tag` via the ID guide ("a tag per dog").
Do not link: resource guarding, aggression and dog-fight text, the sedatives sentence, or the fee table.

**c) Cross-links (5).** `dog-car-safety-harness-and-crate-guide`; `dog-travel-water-and-feeding-gear-guide`; `portable-dog-fence-and-playpen-guide-for-rentals`; `dog-id-tags-and-gps-trackers-for-travel-guide`; `dog-friendly-rental-protection-gear-guide` (two beds, two towels).

**d) Risks.**
- "The AVMA recommends preparing for pet travel, safely restraining dogs with harnesses, tethers, or similar accessories, and never leaving pets unattended in a car." Conflicts with the car guide on extension tethers (finding 5). Reword before linking the two.
- "Take familiar beds rather than relying on one attractive rental-provided bed." Good neutrality; keep it near any bed link.
- "A camera may help you observe behavior where permitted, but it cannot provide care or change the accommodation rules." Do not add camera links.

### 4.6 `vacation-rentals-that-welcome-large-dogs` (Planning)

**a) Readiness.** No picks, products or links. Mentions platforms and managers (Airbnb, Vacasa, Vrbo) neutrally; includes insurance content.

**b) Opportunities (max 4, 3 honest).**
1. Sentence: "Crate dimensions, if a familiar crate is part of the plan." Route: car-safety guide; product `lucky-duck-lucky-kennel` (Large, interior 35.75 x 22 x 26.5 in, "sizing up for in-home use" caveat). Reader value: a large-dog crate that is also car-rated.
2. Sentence: "A large bed, familiar crate, or travel mat can occupy more usable floor space than expected." Product: `kurgo-loft-wander-dog-bed` (large 36 x 48 in open). The reader can check dimensions against the room.
3. Sentence: "A non-slip runner or familiar mat may be useful if the host permits it and it can be laid securely without creating a trip hazard or damaging the floor." Product: none yet (traction runner). Research needed; do not link an unverified product.
Do not link: pet insurance. The article says "A pet health policy is not the same product as liability protection ..." and tells readers to ask their own insurer; a pet-insurance link would be a financial product adjacent to a warning. Also none on breed-restriction text.

**c) Cross-links (4).** `dog-car-safety-harness-and-crate-guide` (the car guide already links here for "A very large breed"; add the reverse); `portable-dog-fence-and-playpen-guide-for-rentals` (its table row "Large dog | Check the maker's stated dog size first"); `dog-friendly-rental-protection-gear-guide`; `dog-id-tags-and-gps-trackers-for-travel-guide` (`tractive-dog-6-xl` is listed for dogs above 44.1 lbs).

**d) Risks.**
- "There is no useful universal booking definition of 'large.'" and "Do not round a dog's weight down to fit." Keep; never advertise gear as making a heavy dog "fit".
- "Do not build the plan around carrying a heavy dog unless that is genuinely safe and practical for the people traveling." Do not link ramps or lifts without a product source.
- "A host may have no discretion to waive a building or insurance condition." Fine.

### 4.7 `dog-friendly-cabins-fenced-yards-georgia` (Destination)

**a) Readiness.** No picks, products or links. States "This guide is a booking method, not a list of endorsed cabins. No rental has been inspected or tested for this article." No verified stays exist, so no stay-level booking link is possible.

**b) Opportunities (max 4, 1 conditional).**
1. Sentence: "Use it when comparing listings around Blue Ridge, Ellijay, Helen, Dahlonega, and the surrounding North Georgia mountains." Product: platform-level search. Conditional: policy decision. Must be framed as "search listings on X", never as recommended cabins.
Route-only mentions (no direct product link, because each sits in a safety sentence):
- "For the journey, the CDC advises keeping a pet in the back seat in a harness attached to the seat buckle, or securing a crate so it will not slide..." Cross-link to the car-safety guide, not to a harness; a product link here would look CDC-endorsed.
- "Feed your dog indoors and put food away afterward." Cross-link to the water and feeding guide.

**c) Cross-links (5).** `dog-car-safety-harness-and-crate-guide`; `dog-travel-water-and-feeding-gear-guide`; `dog-travel-first-aid-kit-guide` (rural cabin, "Plan veterinary access before the weekend"); `dog-id-tags-and-gps-trackers-for-travel-guide`; `portable-dog-fence-and-playpen-guide-for-rentals` (the article already says never "improvise a barrier that could damage the property").

**d) Risks.**
- Title "Dog-Friendly Cabins With Fenced Yards in Georgia" suggests a cabin list that the body disclaims. A booking button under that title would reinforce the wrong reading. Keep the "not a list of endorsed cabins" sentence above any link.
- "Do not make unauthorized fence repairs or leave your dog outside to test whether a gap matters." Fine.
- "A beautiful cabin is not a good match if every toilet break becomes an awkward transfer." Fine; avoid cabin-name inserts.

### 4.8 `dog-friendly-weekend-getaways-from-atlanta` (Destination)

**a) Readiness.** No picks, products or links. Says it "does not recommend individual rentals" and calls its shortlist "editorial matches, not claims that every part of a town or park suits every dog."

**b) Opportunities (max 4, 3 honest).**
1. Sentence: "Choose a route you can complete together, carry drinking water, and leave time for rest." Product: `springland-22oz-original-travel-bottle` or `kurgo-collaps-a-bowl`. Concrete need on a trail day.
2. Sentence: "Pack a normal leash, bags, bowls, usual food, medications, towels, bedding, and suitable vehicle restraint." Route: cabin packing list and car-safety guide; product `kurgo-collaps-a-bowl` for "bowls". Do not link "medications" or "restraint" with a product.
3. Sentence: "Read the house rules, not just the filter result." Product: platform-level search. Conditional: policy decision.
Do not link: Tallulah or Anna Ruby Falls access statements, BearWise, parked-vehicle text.

**c) Cross-links (4).** `dog-travel-water-and-feeding-gear-guide`; `dog-car-safety-harness-and-crate-guide`; `dog-travel-first-aid-kit-guide` (Blue Ridge and Tallulah are remote); `dog-id-tags-and-gps-trackers-for-travel-guide` (new place, trails).

**d) Risks.**
- "The recommendations below are editorial matches, not claims that every part of a town or park suits every dog." Keep. A booking link beside "Dahlonega: build a weekend around a suitable base" must not read as a lodging recommendation.
- "Consider Dahlonega when you want to find lodging first, then choose one confirmed outing..." Fine; no named lodging.
- The OSRM "modeled" time column is the site's own computation and is clearly labelled; do not let travel-affiliate content blur it.

### 4.9 `dog-friendly-weekend-getaways-from-los-angeles` (Destination)

**a) Readiness.** No picks, products or links. Mentions Santa Barbara, Big Bear, Palm Springs, San Diego, Idyllwild with agency-rule anchors; no stays.

**b) Opportunities (max 4, 3 honest).**
1. Sentence: "Bring water, turn back before the dog is tired, and leave the afternoon open." (Saturday plan) Product: `springland-22oz-original-travel-bottle`. Heat is a big theme in this article, so keep the link out of the ASPCA heat paragraph itself and do not suggest gear solves heat.
2. Sentence: "For a straightforward visitor plan, bring and use a six-foot leash." Product: none yet (leash). Low priority; product research needed.
3. Sentence: "Before choosing a rental, enter your actual starting address, destination address, and intended departure time into a current routing service." Not a product link. Platform search opportunity sits at "Start with our pet-friendly vacation-rental checklist, especially if you are booking a place because of its yard." Conditional: policy decision.
Do not link: Joshua Tree, Channel Islands and Mount San Jacinto rules, heat, sneaker waves.

**c) Cross-links (4).** `dog-travel-water-and-feeding-gear-guide`; `dog-car-safety-harness-and-crate-guide` (2 to 3 hour drives); `dog-travel-first-aid-kit-guide`; `dog-id-tags-and-gps-trackers-for-travel-guide`.

**d) Risks.**
- "A bargain rate does not compensate for a trip whose main activity cannot safely happen." Fine, but the article warns against booking a desert rental on dog-hiking assumptions; a rental link in Palm Springs or Joshua Tree sections would contradict this.
- "Treat the modeled figures as a floor, not a forecast." Fine.

### 4.10 `pet-friendly-beachfront-rentals-california` (Destination)

**a) Readiness.** No picks, products or links. Says "This guide does not recommend individual rental properties."

**b) Opportunities (max 4, 3 honest).**
1. Sentence: "Bring drinking water and a bowl." Product: `kurgo-collaps-a-bowl` or `springland-22oz-original-travel-bottle`. The article says saltwater and sand ingestion are preventable hazards.
2. Sentence: "Is there a permitted dog-rinsing area and somewhere to dry towels?" Product: none yet (dog-only towels; see rental-protection guide). Do not link generic towels.
3. Sentence: "Use the [host-question tool](/tools/host-questions), then adapt this message:" Product: platform-level search. Conditional: policy decision.
Considered and rejected: dog life vests (tempting for a beach guide, but the article says "Build the outing around walking rather than water entry" and warns about surf), beach umbrellas (adjacent to heat-safety text), and anything in the sneaker-wave and rip-current section.

**c) Cross-links (3).** `dog-travel-water-and-feeding-gear-guide`; `dog-id-tags-and-gps-trackers-for-travel-guide` (a dog separated at a beach); `dog-friendly-rental-protection-gear-guide` (the article asks "Are wet dogs allowed inside after drying?").

**d) Risks.**
- "The best rental is not necessarily the closest building to the ocean." With booking buttons this could read as a recommendation; reword to "The right rental..."
- "A sea-facing deck is not a fenced exercise yard." Fine.
- "A legal dog beach is not a declaration that the water is safe." Keep; no gear should be presented as making water entry safe.

---

## 5. Summary table

Links = in-text opportunities (product or booking), including conditional and "none yet"; cross-links = internal links to gear guides.

| Article | Type | Readiness | # proposed links | # proposed cross-links | Risk |
|---|---|---|---|---|---|
| dog-car-safety-harness-and-crate-guide | Gear | Ready (4 picks, no approved links) | 4 (1 none yet) | 3 | High (safety) |
| dog-friendly-rental-protection-gear-guide | Gear | Ready (3 picks) | 4 (1 none yet) | 2 | Medium |
| dog-id-tags-and-gps-trackers-for-travel-guide | Gear | Ready (5 picks); Fi needs re-check | 4 (1 conditional) | 2 | Medium-High |
| dog-travel-first-aid-kit-guide | Gear | Ready (5 picks) | 4 (1 conditional) | 2 | High (medical) |
| dog-travel-water-and-feeding-gear-guide | Gear | Ready (5 picks) | 4 | 2 | Low-Medium |
| portable-dog-fence-and-playpen-guide-for-rentals | Gear | Ready (5 picks) | 4 | 2 | Medium |
| dog-friendly-cabin-packing-list | Checklist | Not ready (no picks) | 4 | 6 | Medium |
| pet-friendly-vacation-rental-checklist | Checklist | Not ready | 3 (1 none yet, 1 conditional) | 4 | High (legal/insurance adjacency) |
| vacation-rental-secure-fenced-yard | Planning | Not ready | 2 (cross-link routes) | 2 | Medium |
| how-vacation-rental-pet-fees-work | Planning | Not ready | 1 (conditional) | 1 | Medium-High (legal/money) |
| traveling-with-two-dogs-accommodation-guide | Planning | Not ready | 4 | 5 | Medium |
| vacation-rentals-that-welcome-large-dogs | Planning | Not ready | 3 (1 none yet) | 4 | Medium |
| dog-friendly-cabins-fenced-yards-georgia | Destination | Not ready; no stays | 1 (conditional) | 5 | Medium |
| dog-friendly-weekend-getaways-from-atlanta | Destination | Not ready; no stays | 3 (1 conditional) | 4 | Medium |
| dog-friendly-weekend-getaways-from-los-angeles | Destination | Not ready; no stays | 3 (1 none yet, 1 conditional) | 4 | Medium |
| pet-friendly-beachfront-rentals-california | Destination | Not ready; no stays | 3 (1 none yet, 1 conditional) | 3 | Medium |
| **Total** | | | **51** | **51** | |

Of the 51 links, 24 are in gear guides (mostly matching existing pick cards). 14 are not ready to build: 6 are platform-level booking searches that need a policy decision first, 6 are "none yet" (a product must be researched and added to the gear files), and 2 are conditional on a re-check (Fi tracker, Adventure Medical Kits).

## 6. What each article needs for disclosure

Rule: a disclosure appears wherever approved affiliate links appear. Mechanically, the top-of-article `AffiliateNotice` appears automatically when an article has any approved inline `aff:` link or approved product pick; `GearPicks` adds its own box above the pick cards. So the work is content, not code.

| Article | Disclosure needed when | Text to fix or add |
|---|---|---|
| dog-car-safety-harness-and-crate-guide | any of 4 picks is approved | Replace "Some links in gear guides may become affiliate links in future" with present tense; clarify "We do not accept payment for placement". |
| dog-friendly-rental-protection-gear-guide | any pick approved | Replace "No such links are active in this guide at the time of writing" and the FAQ line "If an affiliate link is added later". |
| dog-id-tags-and-gps-trackers-for-travel-guide | any pick approved | Replace "No such links are active in this guide at the time of writing"; mention subscription-linked commissions if the program pays them. |
| dog-travel-first-aid-kit-guide | any pick approved | Replace "Some links on this site may become affiliate links in future ... No affiliate link is active on this page". |
| dog-travel-water-and-feeding-gear-guide | any pick approved | Replace "none of the products has an active affiliate link. If that changes, any button will be marked as sponsored" and make the button visibly say Sponsored, or reword. |
| portable-dog-fence-and-playpen-guide-for-rentals | any pick approved | Replace "No commission links appear in this guide yet". |
| 10 non-gear articles | the moment one inline `aff:` link, or one gear-guide product link is added to the body | Top notice appears automatically; no in-body "how we choose" section exists, so rely on the notice plus a link to the affiliate disclosure. A cross-link to a gear guide is an ordinary internal link and needs no disclosure. |
| All pages | first product link goes live | Update `affiliate-disclosure.tsx` (products, Amazon, retailers; today it covers bookings and sponsored stays only) and the "Money" paragraph in `editorial-standards.tsx`. Amazon's statement is already in `affiliates.ts`. |
| Any platform booking search link | when approved | Needs a policy decision and a disclosure-page rewrite first (it contradicts "Booking buttons appear only on stays whose details we have verified"). |

## 7. Ten best opportunities site-wide (prioritised)

1. **Water and feeding picks** (`kurgo-collaps-a-bowl`, `springland-22oz-original-travel-bottle`, `springland-20oz-flip-travel-bottle`, `vittles-vault-travel-tainer`, `kurgo-kibble-carrier`) in the gear guide's table rows and pick cards. Clear specs, lowest safety risk, universal need. Blocker: fix the "marked as sponsored" promise.
2. **Cabin packing list to the water/feeding and ID guides** (`Separate food and water bowls, plus a portable drinking bowl.`, `Use a closed container to contain kibble spills...`). Highest product intent in any non-gear article.
3. **Portable fence and gate picks** (`carlson-extra-wide-walk-thru-gate-0930`, `carlson-design-paw-freestanding-gate`, `midwest-exercise-pen-with-door`). Renters without a yard have a precise need; specs and fit warnings are already in the article.
4. **Rental protection picks** (`kurgo-heather-hammock`, `kurgo-loft-wander-dog-bed`, `orvis-embossed-sherpa-throw`). Low risk; host-permission framing already strong.
5. **Tractive trackers** (`tractive-dog-6`, `tractive-dog-6-xl`) with the ID guide's size sentence. High value per click; needs subscription disclosure and a fresh coverage check.
6. **Two-dog "Pack separate bowls" route** and the large-dog crate and bed dimension sentences: cheap internal links that send intent into gear guides.
7. **Car-safety picks** (`sleepypod-clickit-range`, `sleepypod-atom`, `lucky-duck-lucky-kennel`) on the "Pick by situation" bullets, restricted to maker or authorised sellers. Highest value but safety-critical, so only these three bullets.
8. **Strap kits for the crash-tested crates** (product gap). The article says the tested configuration needs the maker's straps; reader value is high once product entries exist.
9. **Beach and trail "bring water and a bowl" sentences** (beachfront, Atlanta, Los Angeles). Small, honest, repeated across three destination guides.
10. **Kurgo first-aid kit and RSG kit** (`kurgo-dog-first-aid-kit`, `kurgo-rsg-dog-first-aid-kit`), then the muzzle. These contain no medications; the Adventure Medical Kits pair only with the vet-conversation paragraph intact.

Not on the list on purpose: pet insurance, trip insurance, damage waivers, invisible fences, tie-outs, dog life vests, any ADA or service-animal text, and any link to a named rental until a verified stay exists.
