# Persona audit P2: dog life-stage and needs

Date: 2026-11-25. Site walked: https://www.pawsandpassage.com (production main@f02e4f9). Method: WebFetch of home, /guides, /gear, /gear?trip=road-trip, five /gear/<category> pages, /dogs/senior-dogs, /dogs/multi-dog-families, /tools/packing-list, /data/pet-policies and ten guides, plus a read of content/products.yml and the guide sources. No bot wall was met. Judged: topics, navigation, products, calls to action. Not judged: sentence-level prose (being rewritten by other workers).

All eight personas are **SIMULATED PERSONAS** (invented by the auditor, not user research). Search phrases are **hypotheses**; no volumes are claimed. Real evidence available: Search Console 2026-11-16 to 11-23 showed 0 clicks, 306 impressions, 47 queries (docs/SALE_RELEASE_STATUS.md); GA4 Oct 28 to Nov 24 had 527 sessions, 513 Direct, 0 Organic Search; the domain is about 9 days old and has no authority (docs/SEO_ROOT_CAUSE_INVESTIGATION.md). So none of these personas is a measured visitor, and none arrives by search today.

Site-wide facts that apply to every persona: the site is a rental-and-road-trip site (Georgia and California cabins and beach houses, 38-manager pet-policy dataset, 11 gear categories, one packing planner). Tagline "Dog-friendly travel, done properly". The home page names four dog types (/dogs/escape-artists, big-dogs, multi-dog-families, senior-dogs) but no puppy, small, anxious, flat-faced or medical type. There is **zero air-travel content** anywhere (confirmed on home, /guides, /data/pet-policies, repo grep). There is **no calming/anxiety product**, **no orthopedic bed**, **no carrier other than one**, **no fan**, **no "travel health" section**.

---

## P1. Puppy parent on a first trip (SIMULATED PERSONA)

**WHO.** Maya, first-time owner of a 14-week-old lab mix, second round of shots done, booked a cabin for Thanksgiving: "Can I take my puppy to a cabin before he is fully vaccinated, and where does he sleep and pee?"

**HOW THEY ARRIVE (hypotheses).** "taking a puppy on first road trip", "puppy vacation rental rules", Pinterest pin "puppy travel checklist". The site has a matching guide, so this is the best-matched of my eight.

**FIRST 10 SECONDS.** Home page offers nothing for puppies (no puppy tile among the four dog types). She would have to use the guide list or search. In /guides she finds "Taking a Puppy to a Vacation Rental" by scanning.

**DO WE ANSWER IT.** /guides/puppy-at-a-vacation-rental is about 2,000 words, 8 numbered sections: age rules (strong: five managers quoted, 33 of 38 state no age), accidents and fees, crates and alone time, chewing, a first-night plan. Vaccines get one thin section with no schedule (points to CDC and the vet). Parvo is not mentioned. Sleep is thin. Missing: what to do about public-space exposure before vaccines finish, carsickness, a puppy vet near the stay, a puppy-only packing list.

**WHAT THEY WOULD BUY.** Four cards: Pawtect Pads, MidWest iCrate, Petmate soft play yard, KONG Classic. All four fit and she would click the crate and pads (she must buy them anyway). Nothing for carsickness, a puppy harness, or a car crate. The pads in the body link a different product id from the card (a possible mismatch seen in the page, not confirmed in the repo).

**TRUST AND FRICTION.** Good: sources cited, a host message template. Friction: the guide says nothing about the vaccine risk she is actually afraid of, so she may leave for a vet or AKC page and not come back.

**APPEAL SCORE: 6/10.** Real guide with correct products, but it answers "will the host allow it" better than "is it safe and how do I do it".

**THE GAP.** A short "puppy trip: before you go" section (vaccine status, what to ask the vet, parvo-safe places, records to carry, first-night sleep) on the existing guide, plus a /dogs/puppies hub tile on the home page.

---

## P2. Senior dog with arthritis, stairs and the car (SIMULATED PERSONA)

**WHO.** Dale, 68, 12-year-old golden with hip arthritis: "He can't jump into the SUV any more and the cabin has 14 steps. Is there a ramp that works and a place with no stairs?"

**HOW THEY ARRIVE (hypotheses).** "ramp for arthritic dog car", "senior dog vacation rental stairs", pin "senior dog travel tips".

**FIRST 10 SECONDS.** Home has "The senior dog" tile and a "Ramps and steps" gear link, a strong match. /dogs/senior-dogs is only a question list plus five guide links; it never says "arthritis" and has no product.

**DO WE ANSWER IT.** /guides/vacation-rental-with-a-senior-dog has ten sections (stairs, slippery floors, a dog that balks, accidents, when to call the vet), cited to Banfield and Cornell. Car entry is a pointer to the ramp guide. Honest: it says no source supports ramps for a full indoor flight. Answer to stairs reached in about 400 words.

**WHAT THEY WOULD BUY.** /gear/ramps-and-steps has 5 PetSafe cards (folding 150 lb, extra-long telescoping 300 lb, compact telescoping 300 lb, side-door steps 200 lb, hitch step 200 lb). Dale would click the extra-long telescoping ramp (the only one on the home gear row) and the side-door steps. Weights are maker claims; none is framed for senior dogs (the page says so). On the senior guide itself only two cards appear: Pawtect Pads and the Kurgo Loft bed, which is not orthopedic. He would ignore the bed (it admits it is not orthopedic) and the pads unless the dog leaks.

**TRUST AND FRICTION.** Honest caveats build trust but leave him unsure which ramp. The ramp category has no "which one for a stiff dog" pick and no step-height guide for his SUV. No filter for ground-floor or single-level stays; I could not confirm one.

**APPEAL SCORE: 7/10.** Best match of the eight for both topic and products; weakened by missing a recommendation and an orthopedic-bed option.

**THE GAP.** A "Senior dog car and stairs" pick block on /gear/ramps-and-steps (ramp vs steps by vehicle height and dog size) and an orthopedic-bed card; a "no stairs" / ground-floor stay filter or tag.

---

## P3. Anxious or reactive rescue dog (SIMULATED PERSONA)

**WHO.** Priya, six months into adopting a 4-year-old rescue who barks at footsteps and panics alone: "Will he be okay in a rental, will the neighbors complain, what can I give him to calm down?"

**HOW THEY ARRIVE (hypotheses).** "traveling with a reactive dog", "dog anxiety vacation rental", pin "calm dog travel".

**FIRST 10 SECONDS.** No anxiety tile on home. Guides list shows "Traveling With a Reactive Dog: Choose the Right Rental"; a good hit.

**DO WE ANSWER IT.** Reactive guide: strong on neighbors, shared walls, sightlines, quiet hours, a trigger checklist and a host message template; trainer red flags from AVSAB are a credible touch. Missing: thunder and fireworks, separation anxiety (only a pointer), anything about a rescue with unknown history, medication, or a practice-before-you-go plan. The leave-alone guide has warning signs but assumes you know the dog's history.

**WHAT THEY WOULD BUY.** Cards: rabbitgoo window film, Amazon Basics crate cover, MidWest iCrate. Window film and crate cover are clever and she would click them. She would look for calming products (anxiety wrap, chews, diffuser, white noise) and find none; the site says "no calming" and defers to the vet.

**TRUST AND FRICTION.** The site is careful (says it has not tested film). The risk is leaving with a feeling the site is about hosts, not her dog. No microchip or escape plan for a panicky dog beyond the loose-dog guide.

**APPEAL SCORE: 6/10.**

**THE GAP.** A "settling a nervous dog in a new place" section (arrival routine, a trial night, what to ask the vet, escape-proofing) and a small, claim-free "quiet and calm" gear group (white noise, crate cover, car window shade, ID tag) with a clear "no cure, ask your vet" frame.

---

## P4. Flat-faced (brachycephalic) breed owner (SIMULATED PERSONA)

**WHO.** Tom, French bulldog owner: "My Frenchie overheats in 10 minutes. Is it safe to drive 5 hours in July and can I fly him?"

**HOW THEY ARRIVE (hypotheses).** "French bulldog road trip heat", "bulldog summer travel", pin "pug summer tips".

**FIRST 10 SECONDS.** Nothing on home mentions flat-faced dogs. Search for "bulldog" or "pug" returns nothing; he finds the cooling guide only by guessing.

**DO WE ANSWER IT.** /guides/keep-a-dog-cool-on-a-summer-trip never uses the words "brachycephalic" or "flat-faced". The one mention is "short-snouted breeds" in a list of higher-risk dogs, about 350 words in, with "ask your vet how much heat is too much". The never-leave-in-a-car rule is present. Missing: why airways matter, early heat limits, car cooling (AC on, shade, trips at dawn), harness vs collar for airway, and all air-travel (many airlines restrict these breeds in hot months; the site has nothing).

**WHAT THEY WOULD BUY.** Cooling vest (Ruffwear Swamp Cooler) and gel Cool Pet Pad cards: relevant, but the guide itself says a pad is not heatstroke prevention, so he gets a mixed signal. Water bowl and bottle fit. No fan, no cooling car mat, no breathing-friendly harness. The Ruffwear Load Up harness and Kurgo harness are not discussed for airways.

**TRUST AND FRICTION.** His worry is a medical emergency. The site gives a hedge, not a plan, so he leaves for a vet or AKC page.

**APPEAL SCORE: 4/10.** The topic is a clear dog-travel need and the page that should answer it hardly addresses him.

**THE GAP.** A named "Flat-faced dogs: heat and car travel" section on the cooling guide (cited to AKC/Cornell/AVMA, vet check, early-warning signs, 5-hour car plan) and an honest "we do not cover flying" note with a pointer to the airline's own rules.

---

## P5. Small dog owner who wants to carry or fly with it (SIMULATED PERSONA)

**WHO.** Chen, 9-lb Maltese: "Which carrier fits under a Delta seat and what are the airline's rules?"

**HOW THEY ARRIVE (hypotheses).** "airline approved dog carrier", "flying with a small dog in cabin", pin "dog airplane travel". The site has no such page, so this is a non-arrival.

**FIRST 10 SECONDS.** The home page is cabins and car. No "flying" anywhere, in /guides, /tools, the pet-policy data or the packing planner (inputs are trip type, length, dogs, meals, extras; no air option).

**DO WE ANSWER IT.** No. Zero words. The only nearby item is the Sleepypod Atom crash-tested carrier on /gear/car-safety (up to 12 lb per the Atom's own page; Sleepypod's nav says 18 lb, a discrepancy the page flags). It is for cars, not airline-approved.

**WHAT THEY WOULD BUY.** A carrier. Sleepypod Atom is the single carrier card and Kurgo Heather booster (30 lb) a second small-dog item. He might click the Atom but cannot learn if it fits under a seat. Two other carrier-like items are containment crates, not carriers.

**TRUST AND FRICTION.** The site has no authority on air travel and would have to cite airline pages; any claim must be conservative.

**APPEAL SCORE: 2/10.** Not a trip the site serves.

**THE GAP.** Either say so openly (a one-paragraph "what we do not cover: flying" on the gear page with a pointer to the airline and the DOT) or a short "small dog in a carrier" guide that cites airline policy pages for carrier size and lists the Atom plus soft carriers. Owner decision: the first is cheap, the second widens scope.

---

## P6. Owner of three or more dogs (SIMULATED PERSONA)

**WHO.** Rosa, three beagles/terrier mixes: "Everyone says two dogs max. Can I bring three?"

**HOW THEY ARRIVE (hypotheses).** "how many dogs allowed airbnb", "3 dogs vacation rental", pin "traveling with 3 dogs". This matches a real Search Console-era topic (the guide is one of the site's core questions) but there is no measured query data.

**FIRST 10 SECONDS.** Home has "The multi-dog family" tile. Good. /dogs/multi-dog-families is a short hub: "Two dogs is the usual cap", 22 of 38 managers cap at two, 2 allow three, 14 give no number.

**DO WE ANSWER IT.** /guides/how-many-dogs-can-you-bring-to-a-vacation-rental has a clear answer in the first section (the listing's own rule is the only number that counts), how to ask for a third dog, a message template, a consequence list. Missing: no list of the 2 managers who allow three, no fee example for three, no word on per-dog vs combined weight, nothing on layout or car for three. The stay filter "Multiple dogs allowed" exists on the home search and /stays?multi=true; I could not verify how many stays allow three.

**WHAT THEY WOULD BUY.** MyPet gate and iCrate: the only cards; for three dogs she needs several crates, a bigger pen and a car for three. The pens-and-gates category (8 products) and the two large-dogs car guide do exist and fit, but are not linked from this hub, which links only a "portable fence" guide.

**TRUST AND FRICTION.** Strongest data-backed answer of the eight, but small sample (38 managers). She will ask "which stays take three" and the site has no answer.

**APPEAL SCORE: 7/10.**

**THE GAP.** A "stays that state three or more dogs" list or a stay tag (e.g. the 4-dog Cherry Lake cabin exists in content/stays) and a "three-dog car and layout" section linking /gear/pens-and-gates and the two-large-dogs car guide.

---

## P7. Service-dog handler or ESA owner (SIMULATED PERSONA)

**WHO.** Jordan, handler of a psychiatric service dog: "What can a host refuse and can they charge me a pet fee?"

**HOW THEY ARRIVE (hypotheses).** "service dog airbnb rules", "emotional support animal vacation rental", "pet fee service dog". There is no dedicated page.

**FIRST 10 SECONDS.** Nothing in navigation. The no-pets guide and the how-many-dogs FAQ ("Do puppies and service animals count?") are the only pointers.

**DO WE ANSWER IT.** Only a section of about 207 words in /guides/bringing-a-dog-to-a-no-pets-rental: Airbnb whole-home bookings allow a service animal with no extra cleaning fee, Vrbo excludes service animals from its pet category, ESAs are not covered by the ADA, no vest or ID needed. Cited to the DOJ FAQ and platform pages. Missing: the Fair Housing Act (not cited), state laws, what a host may ask, whether service animals count toward a cap, short-term-rental coverage. The /data/pet-policies table has no service-animal column. A handler reading a page about "bringing a dog to a no-pets rental" may feel treated like someone evading rules.

**WHAT THEY WOULD BUY.** Nothing specific (harness, ID, first aid maybe). Product side is irrelevant here, which is correct: no card should be forced.

**TRUST AND FRICTION.** Legal topic; the section correctly says "not legal advice". A wrong or thin answer is a bigger risk than none. Placing it under a no-pets guide is a navigation problem.

**APPEAL SCORE: 3/10.**

**THE GAP.** A standalone "Service animals and ESAs in vacation rentals" page with a handler-facing tone, the DOJ and platform policy citations, a "what a host may and may not ask" list, a link from the how-many-dogs FAQ and the home must-have filters. Needs legal review wording; no product slots.

---

## P8. Dog on medication or with a medical condition (SIMULATED PERSONA)

**WHO.** Sam, whose 9-year-old dog takes daily heart medication and is epileptic: "What do I bring so a rented cabin 3 hours from my vet is safe?"

**HOW THEY ARRIVE (hypotheses).** "traveling with a dog on medication", "dog seizure vacation checklist", "dog medical records trip".

**FIRST 10 SECONDS.** The planner has a "medication or special supplies" checkbox, and the home page lists a first-aid gear link. No medical-condition entry in navigation.

**DO WE ANSWER IT.** /guides/dog-travel-first-aid-kit-guide covers records (a copy of the medical record including medications), vet contacts, emergency hospital, poison control. The packing guide has a checklist line for medication in labeled packaging and for offline vaccination records and vet details. Missing: refill/supply planning (extra days), a vet letter, a destination pharmacy, storing meds in heat, missed doses, vaccination proof, seizure plan. Records are mentioned but not as a printable "dog medical card".

**WHAT THEY WOULD BUY.** Cards on that guide: ARCA 100-piece kit, Adventure Medical Trail Dog, Baskerville muzzle, FDK thermometer. He would ignore the Trail Dog kit (contains diphenhydramine, which the page says to ask the vet about) and the muzzle, and click the thermometer. A pill organizer or insulated med pouch is not a card. The Kurgo and AMK first-aid kits not featured are in products.yml.

**TRUST AND FRICTION.** Well hedged and vet-first; correct. He would still want a one-page "records to bring" he could print; the planner saves on device only.

**APPEAL SCORE: 5/10.**

**THE GAP.** A "Dog medical travel sheet" section (records, med list, supply plus buffer, vet and emergency contacts, vet letter) inside the first-aid guide, and a medical checkbox in the planner that adds those lines.

---

## Summary table

| Persona | Appeal | Top gap |
|---|---|---|
| P1 Puppy, first trip | 6 | Puppy "before you go" section (vaccines, parvo, sleep) and a puppy hub tile |
| P2 Senior, arthritis | 7 | Senior car-and-stairs picks plus an orthopedic bed; ground-floor stay tag |
| P3 Anxious/reactive rescue | 6 | Nervous-dog settling section and a quiet/calm gear group |
| P4 Flat-faced breed | 4 | Named brachycephalic heat and car section; flying disclosure |
| P5 Small dog, air cabin | 2 | No air-travel content at all; say so or add a carrier guide |
| P6 Three or more dogs | 7 | Stays that state three dogs; three-dog car and layout |
| P7 Service dog / ESA | 3 | Standalone rights page (FHA, state law, what hosts may ask) |
| P8 Medication / medical | 5 | Medical travel sheet (meds buffer, vet letter, records) |
| **Average** | **5.0** | |

## Five gaps that recur

1. **No dog-type hubs beyond four** (escape artist, big, multi-dog, senior). Puppy, small, flat-faced, anxious and medical have no front door, so these owners do not self-identify from the home page (P1, P3, P4, P5, P8).
2. **Vet-handoff without a plan.** On heat, anxiety, medication and puppies the site says "ask your vet" but gives no checklist of what to ask or bring (P1, P3, P4, P8).
3. **Air travel is absent**, and flat-faced and small-dog owners meet that wall (P4, P5).
4. **Medical, health and records content is scattered** across the first-aid guide, packing guide and each life-stage guide, never as one printable sheet (P1, P2, P8).
5. **The pet-policy data and stay filters ignore these dogs**: no column or tag for service animals, puppy age, ground-floor, three-plus dogs by name (P2, P6, P7).

## Product-side findings

- **Categories missing:** calming and anxiety aids; orthopedic beds; fans and car cooling; airline carriers; puppy-specific (harness, carsickness); medication storage (pill organizer, cooler pouch); water-resistant car crate for small dogs beyond one.
- **Cards that fit:** PetSafe extra-long and compact ramps and side-door steps (P2); MidWest iCrate, pads, KONG (P1, P3, P6); rabbitgoo film and crate cover (P3); Ruffwear Swamp Cooler and Cool Pet Pad (P4, with caveat); Sleepypod Atom (P5 only as a car carrier); FDK thermometer (P8).
- **Cards that do not fit:** Kurgo Loft Wander bed on the senior guide (not orthopedic, admits it); Trail Dog kit for a medicated dog (contains diphenhydramine); Baskerville muzzle for a typical first-aid reader; cooling pad for a flat-faced dog (guide says it is not heat prevention).
- **Possible data issues seen on the live site (stale build is possible):** pads link id differs between body and card in the puppy guide; the Kurgo harness size selector omits X-Small; no per-card anchor IDs on gear category pages although "Details and specs" links use them on /gear. None verified against the repo.
- **Inactive items in products.yml:** the MidWest LifeStages crate has active: false and no retailer URL; it is not a live card.
- **Compliance:** I saw no prices, stock, ratings or testing claims on the pages I read.

## What I could not verify

- Whether the live HTML build matches the repo at f02e4f9 (the other workers are editing; many findings come from live WebFetch, which summarizes pages through a small model and can misreport details such as word counts, which are estimates).
- Per-card links (Amazon destinations were reported, not clicked); whether affiliate ids are valid.
- Whether any stay has ground-floor or three-dog tagging beyond what the home filters list.
- Any real search volumes or visitors of these types; the site has 0 organic clicks to date, so all arrival phrases are hypotheses.
- Airline rules (I did not research them; the site has none).
- Legal accuracy of the service-animal section (needs counsel, not an editorial check).
- Pages not walked: /stays listings in detail, /destinations, /gear/pens-and-gates, /dogs/big-dogs, /tools/will-my-dog-be-accepted.
