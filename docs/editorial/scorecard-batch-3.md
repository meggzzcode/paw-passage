# Editorial scorecard, batch 3 (6 guides)

Method: source read in full or in large part; each page rendered with Playwright Chromium at 390 and 1280 px against the frozen build (localhost:4174). Counts come from the DOM `article` element; word counts are rendered innerText (source `wc -w` includes frontmatter and is higher). No screenshots were visually inspected, so "formatting" judgements rest on DOM structure and on the markdown. No horizontal overflow at 390 (scrollWidth = 390 everywhere). Product cards: the DOM class probe found 0, so card counts are the `{{pick:...}}` tokens in source.

**Citation markers, all six pages:** source is `[[1]](url)`; rendered as a linked numeral `<a aria-label="Source 1">1</a>`, one per claim, often stacked ("[1] [2]") or repeated 3x in one paragraph. Real examples: "Georgia: ...must request a dog-friendly cottage prior to arrival', and bars leaving a dog unattended at any time. 1" and "Airbnb's guest page lets guests declare 0 to 5 pets 1, and its host guide lets hosts set a limit 'from one to five' 2." Phone-reader cost: a numeral wedged in nearly every sentence; only the first citation per paragraph is needed.

**Site-wide pattern:** every page has a "How sure we are" section, a source-date stamp ("as of 2026-11-18", "read 2026-11-18") repeated inline, "our suggestion, not from a source" tags, and often a "What we could not confirm" table. Trust-sentence counts (regex on rendered text, phone view): GA 11, How-many 10, Fees 7, Loose 15, Cool 25, NYE 24.

---

## 1. Dog Friendly Cabins in Georgia State Parks: Rules, Fee and How to Request
- URL: /guides/dogs-in-georgia-state-park-cabins | Source: /home/user/paw-passage-aff/content/guides/dogs-in-georgia-state-park-cabins.md
- Rendered ~2,910 words (phone), 17,459 px scroll on phone, 29 markers, 4 tables, 3 product cards, 16 H2, trust sentences ~11 ("How sure we are", dated reads, "What we could not confirm" table, 1 disclaimer-ish "cannot assess").
- A fit: Strong. Specific, searchable, one state, answers a real dog-parent question (fee, count, how to request).
- B intro: "Dog friendly cabins in Georgia state parks exist, but only designated cottages take dogs. The Georgia State Parks rules page (read 2026-11-18) allows two dogs per cottage, charges $50 per dog (limit 2) at check-in for the whole stay, says you 'must request a dog-friendly cottage prior to arrival', and bars leaving a dog unattended at any time." Answer-first and useful, but sentence 2 is a 55-word citation-laden slab; "Below: ..." roadmap and a second intro paragraph restate it.
- C length: Cut ~25% (to ~2,200). Padded: "State park cabin or private cabin" (4-row comparison plus 38-manager stat plus dataset plug), "Where other pages differ" (competitor sniping, no reader value), "What to ask the park" (duplicates request steps and message), the closing "What we could not confirm" table repeating earlier text.
- D voice: Mostly clean and concrete. Hedging/meta: "That is the gap this page fills", "Treat it as a lead", "Ask for ... in writing" repeated 4x; "the rules make three things non-negotiable ... That leaves a short list."
- E format: Good tables (rules, parks, comparison); the phone view runs 17k px, so the 4 tables need horizontal handling; three buy blocks are heavy for a leash/bottle/bowl. Copy-paste message block is a real win.
- F utility/affiliate: Utility high. Affiliate: leash is tied to the 6-ft rule (natural, though "skip if yours is shorter" is honest); water bottle and 1 L bowl are generic and bolted on. Tellingly, `aff` links: 0 (only pick cards).
- G Verdict: LIGHT EDIT. Scores: Appeal 7, Format 7, Readability 6, Utility 9, Commercial 6 -> AVG 7.0. Priority P1.
- Issues/changes: in the same file, trim the intro to 2 short sentences and move the fee/limit facts into the table; delete "Where other pages differ" and the "What to ask the park" list (fold 2 items into the message); cut the private-cabin section to the table plus the 2-line "which to choose"; collapse buy section to the leash plus one water item; keep one trust section.

## 2. How Many Dogs Are Allowed at an Airbnb or Vacation Rental?
- URL: /guides/how-many-dogs-can-you-bring-to-a-vacation-rental | Source: /home/user/paw-passage-aff/content/guides/how-many-dogs-can-you-bring-to-a-vacation-rental.md
- ~3,380 words, 20,179 px phone, 42 markers, 4 tables, 8 boxes, 3 cards (gate, 2 crates), 15 H2, trust ~10.
- A fit: Good search intent, broad audience, but the finding is thin: "two is common, the listing decides."
- B intro: "Two dogs is the most common cap, and no platform sets one number: the listing's own pet rule decides. Of the 38 managers we read on 2026-11-18 (a convenience sample), 22 state a limit of two, 2 allow three pets and 14 give no number." Strong first sentence; second is stats-for-stats-sake and discloses sample weakness before value. Then "The short answer" restates it.
- C length: Cut ~35% (to ~2,200). Padded: the 10-row source table (Kinlin Grover "no number"; Vacasa "varies"; rows with "Not stated" x4), the "What 38 manager pages add" subsection (repeats the lead), "What if you bring more dogs" and weight section (duplicate of the table), a second fee-math table that duplicates the fees guide.
- D voice: Hedge-heavy: "Whether a host limit of two stops a guest from declaring three is unknown", "What the platforms do is unknown", "no standard exists". Repeats "message the host / in writing" 5+ times. Crate and gate picks justified by a ASPCA resource-guarding citation: stretches.
- E format: The weight-wording table ("Dogs under 50 pounds" -> does "under" exclude 50?) is the best thing on the page. Markers 42 on a phone are noisy; checklist at the end good.
- F utility/affiliate: The three-dog message template is useful. Affiliate FORCED: a baby gate and two crates for two dogs who might guard food; the page is about asking hosts, not about gear.
- G Verdict: STRUCTURAL EDIT (merge candidate with the fees guide on the cost section). Scores: Appeal 5, Format 6, Readability 5, Utility 7, Commercial 3 -> AVG 5.2. Priority P1.
- Changes: file above. Replace the 10-row table with ~5 meaningful rows; delete "38 manager pages add"; remove the duplicate fee calc and link to /guides/how-vacation-rental-pet-fees-work; keep weight-wording table, host message, checklist; drop or reduce gear to one "separate your dogs" pick with a clear condition, or remove.

## 3. How Vacation Rental Pet Fees Work: Per Night, Per Dog or Per Stay
- URL: /guides/how-vacation-rental-pet-fees-work | Source: /home/user/paw-passage-aff/content/guides/how-vacation-rental-pet-fees-work.md
- ~3,070 words, 19,150 px phone, 16 markers (lowest), 5 tables, 5 boxes, 3 cards, 1 `aff:vrbo` link in body, 16 H2, trust ~7.
- A fit: Best topic of the batch: every traveler hits it. The "same fee, four structures, four totals" idea is the evergreen hook.
- B intro: "A vacation rental pet fee is a formula, not a number: it can be per stay, per night, per dog, or per dog per night, and managers write it in very different ways. Get one total for your dogs and your dates before you book." Best intro in the batch; the third paragraph then wanders into dataset numbers.
- C length: Cut ~20%. Padded: "Fees, deposits, holds, and waivers" table (6 rows of tautologies: "Definite expense", "Contingent liability"), "Compare the full stay" hypotheticals, "Service animals are not pets" (legal explainer, tangent), "If a charge surprises you" and the near-duplicate "Questions to send" plus final checklist.
- D voice: Slightly legalistic/AI-neutral: "The agreement matters more than the label", "Practical consequence:", "Budget treatment". Repeats "ask the host" ~6x. Stats "25 of 38 stated a fee, 3 charge $0, the other 13 gave no amount" is confusingly arithmetic (25-3=22 not 13).
- E format: Fee-structure table with worked totals is excellent and scannable. Platform comparison table is good. "Rental A vs B" table is padding.
- F utility/affiliate: Utility high. The lone Vrbo link ("To compare a few real listings side by side, you can start a pet-friendly search") is the most natural affiliate in the batch but is buried mid-article. The product block (puppy pads, doormat, shammy towel) is unrelated to fee math and reads tacked-on.
- G Verdict: LIGHT EDIT. Scores: Appeal 7, Format 7, Readability 6, Utility 9, Commercial 5 -> AVG 6.8. Priority P1 (high-traffic topic).
- Changes: fix the 25/22/13 arithmetic in the lead; cut the deposits table to 3 lines; delete "Compare the full stay" and merge "surprise charge" into the message; move Vrbo CTA right after the four-fee table; delete gear section or replace with the "full-stay price" tool/Vrbo CTA.

## 4. Dog Got Loose on Vacation: The First Hour, ID and Prevention
- URL: /guides/if-your-dog-gets-loose-on-a-trip | Source: /home/user/paw-passage-aff/content/guides/if-your-dog-gets-loose-on-a-trip.md
- ~4,110 words (longest), 22,358 px phone, 48 markers, 3 tables, 6 boxes, 4 cards (Tractive, Fi, Petcube, Beacon light), 12 H2, trust ~15.
- A fit: Excellent emergency and prevention audience; urgent search intent.
- B intro: "If your dog ran away or got loose on vacation, search close to where it was last seen right now, then call your microchip registry and your host. Do the steps in order; if you only have time for three, those are steps 1, 5 and 6 below." Genuinely good: action-first, numbered list immediately. Best structure for a panic reader.
- C length: Cut ~35% (to ~2,700), but split: the emergency half should stay tight. Padded: "What worked in reported cases" (three anecdotes with unknown endings), the microchip explainer (grain-sized capsule, AAHA lookup trivia), the three-tracker comparison with battery and fit specs, "Fireworks and holidays" (duplicates the NYE guide), checklist plus "What to buy first" plus "How sure we are".
- D voice: "our suggestion, not from a source" x6; "Three layers cover for each other"; heavy citation of AKC Reunite (which "sells enrollment and ID tags, so read its pages with that in mind"). Anecdotes narrated flatly.
- E format: Numbered emergency list works on a phone; the layer table is good. But the emergency steps are immediately followed by a 20k px page, so a sticky "jump to prevention" is needed.
- F utility/affiliate: Real utility. Affiliate: a GPS tracker is a natural fit AFTER the loss, but listing three tracker products plus a light turns the prevention half into a buyer's guide; Petcube and Fi both need subscription caveats the page has to include.
- G Verdict: STRUCTURAL EDIT (split into "if your dog is lost now" and "ID and tracker setup before the trip", or cut hard). Scores: Appeal 7, Format 7, Readability 6, Utility 8, Commercial 6 -> AVG 6.8. Priority P0 (safety content, highest stakes, most exposed to the citation and "not tested" clutter).
- Changes: keep the first two sections as is; delete the anecdote section and the fireworks section (link to NYE guide); shrink microchip detail to the 4-step record check; cut trackers to one recommended pick plus an "AirTag is weaker" line; delete the second "what to buy first".

## 5. Keep a Dog Cool in the Car, at the Beach and in a Rental
- URL: /guides/keep-a-dog-cool-on-a-summer-trip | Source: /home/user/paw-passage-aff/content/guides/keep-a-dog-cool-on-a-summer-trip.md
- ~3,980 words, 21,292 px phone, 44 markers, 3 tables, 6 boxes, 4 cards (vest, gel pad, bowl, bottle), 15 H2, trust ~25 (highest).
- A fit: Good seasonal topic; weak launch timing (today is 24 Nov) but evergreen for summer.
- B intro: "You are packing the car for a week at a rental, the forecast is hot, and the dog will ride, walk, wait and sleep somewhere unfamiliar. To keep a dog cool in the car and on the trip, the sources we read agree on the basics: heat illness is an emergency, a parked car is never a safe place to leave a dog..." Scene-setting sentence is fine; the second sentence leads with "the sources we read agree" (about us, not the reader). Dek says gear "has little independent testing behind it", which undercuts the sales content below.
- C length: Cut ~35% (to ~2,600). Padded: state hot-car-law table (4 states, 4 identical citations), the temperature-thresholds discussion (AKC pages disagree), "What the studies looked at" (a study "we could not open"), "What we could not confirm" (11 hits) and "How sure we are", beach/rental/hydration sections that repeat water-and-shade advice.
- D voice: The worst hedging: "We cannot assess a dog from here", "we found no source on safe cabin temperatures", "we could not open the full text to check its findings, so we do not report them" (a source cited then not used), "What the source or maker says / What we could not find" columns. The page tells the reader it lacks evidence about its own products.
- E format: Early bullets ("If your dog is showing these signs now") are right for a panic reader. The evidence table has columns of "What we could not find", which sells nothing and informs little.
- F utility/affiliate: Safety content strong; affiliate FORCED and contradictory: a vest and gel pad the page says have no independent testing, presented under "If most heat exposure is on foot, this is the item". Bowl/bottle are fine and honest.
- G Verdict: STRUCTURAL EDIT. Scores: Appeal 5, Format 6, Readability 5, Utility 7, Commercial 3 -> AVG 5.2. Priority P0 (health-safety page with 25 trust statements, commercially undermined).
- Changes: lead with the signs and first-aid steps (keep); cut the state-law table to one sentence; remove the study paragraph; drop gel pad, keep one vest with a plain "water, shade and rest first" caveat or none; merge beach/rental/hydration into one 5-bullet "on the trip" section; merge "could not confirm" and "how sure" into one line.

## 6. New Year's Eve With a Dog in a Cabin: Vet the Fireworks Claim, Plan the Night
- URL: /guides/new-years-eve-with-a-dog-in-a-vacation-rental | Source: /home/user/paw-passage-aff/content/guides/new-years-eve-with-a-dog-in-a-vacation-rental.md
- ~3,340 words, 19,655 px phone, 42 markers, 3 tables, 6 boxes, 3 cards (KONG, travel bed, Beacon light plus tracker text), 15 H2, trust ~24.
- A fit: Very good and timely (publish date near the holiday; 24 Nov is the right moment). Specific "firework-free claim" angle is original.
- B intro: "Before you book, ask the host how far the nearest homes are: a 'firework-free' label may cover only the grounds. On the night, keep the dog on a leash with a tag that has a mobile number you will answer, in a quiet familiar room, with a person at every door." Strong and actionable; the next sentence turns to "We read the sources ... and did not t[est]" disclaimer.
- C length: Cut ~25% (to ~2,500). Padded: manager table (Aunt Bug's, CRoG, Vacasa) with weak relevance to dogs and fireworks, escapes anecdotes (3 bullets, one a July 4 case), Christmas-week cross-link blurbs, the desensitization science table (Riemer review, avsab survey) which is accurate but more than a rental guest can act on in one week.
- D voice: Heavy sourcing, e.g. "Riemer's 2023 review calls gradual desensitization ... 'gold standard'" in a post aimed at people booking next week. Contradiction: tells you desensitization is the gold standard, then you cannot do it before 31 Dec.
- E format: "Do this first" numbered list, host-questions checklist and copyable host message are excellent. The sourced efficacy table is dense on a phone.
- F utility/affiliate: Utility good. Affiliate mixed: stuffable chew is natural (the page's own evidence supports "food during noise"), travel bed plausible; the Beacon light and a tracker are reused from the loose-dog page and feel forced for a cabin.
- G Verdict: LIGHT EDIT. Scores: Appeal 7, Format 7, Readability 6, Utility 8, Commercial 6 -> AVG 6.8. Priority P1 (time-sensitive: fix before Dec).
- Changes: file above. Delete the manager table or reduce to the 2 fireworks-rule rows; trim escapes to one sentence linking /guides/if-your-dog-gets-loose-on-a-trip; compress the science table to 3 rows; drop the light and the Petcube text; keep KONG plus bed.

---

## Batch summary
| Guide | Appeal | Format | Read | Utility | Commercial | AVG | Verdict | Pri |
|---|---|---|---|---|---|---|---|---|
| GA state park cabins | 7 | 7 | 6 | 9 | 6 | 7.0 | LIGHT EDIT | P1 |
| How many dogs | 5 | 6 | 5 | 7 | 3 | 5.2 | STRUCTURAL | P1 |
| Pet fees | 7 | 7 | 6 | 9 | 5 | 6.8 | LIGHT EDIT | P1 |
| Dog got loose | 7 | 7 | 6 | 8 | 6 | 6.8 | STRUCTURAL | P0 |
| Keep dog cool | 5 | 6 | 5 | 7 | 3 | 5.2 | STRUCTURAL | P0 |
| NYE with a dog | 7 | 7 | 6 | 8 | 6 | 6.8 | LIGHT EDIT | P1 |
| **Batch mean** | 6.3 | 6.7 | 5.7 | 8.0 | 4.8 | **6.3** | | |

Cross-article patterns:
1. Every page is 3,300-4,100 words (about 17-22k px on a phone) for questions answered in the first 300; target about 2,000-2,700.
2. Source-hygiene theatre: 16-48 numbered markers per page, plus "How sure we are", "could not confirm", "our suggestion, not from a source" and dated reads in every article (7 to 25 trust sentences each). Keep one short "last checked" line; cite once per paragraph.
3. Hedging as voice ("unknown", "we could not find", "the page gives no..."), strongest on the cooling and how-many pages; it makes the reader do the editor's job.
4. Affiliate picks are template-bolted ("What to buy first" with 3-4 pick cards each) and often unrelated to the topic (crates on a dog-count page, pads on a fee page, uncertified gel pads on a safety page). Only the loose-dog tracker, NYE chew and Georgia leash read as natural. The only real booking CTA (Vrbo) is buried in the fees page.
5. Strongest assets to keep: first-hour list (loose), the fee-structure table (fees), weight-wording table (how-many), "Do this first" plus host message (NYE), the Georgia rules table and request script.
