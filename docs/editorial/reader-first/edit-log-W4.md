# Edit log W4 (reader-first pass)

Word counts are body words (text after the frontmatter, `wc -w`).

| Guide | Before | After | Target |
| --- | --- | --- | --- |
| how-many-dogs-can-you-bring-to-a-vacation-rental | 1,424 | 1,246 | about 1,500 (merge) |
| can-you-leave-a-dog-alone-in-a-vacation-rental | 1,487 | 1,189 | about 1,000 |
| bringing-a-dog-to-a-no-pets-rental | 1,510 | 1,239 | about 1,050 |
| vacation-rental-with-a-reactive-dog | 2,022 | 1,534 | about 1,350 |
| vacation-rental-with-a-senior-dog | 1,654 | 1,382 | about 1,250 |
| puppy-at-a-vacation-rental | 1,832 | 1,202 | about 1,250 |

## how-many-dogs (Article 7 merge, owner-approved)
- Opening now the audit's friend opening (22 / 2 / 14, ask for the count in writing, per dog or combined). Removed "The short answer" (restated the opening).
- Merged the three platform/manager/weight sections into "What do platforms and managers allow?"; kept the 3-row manager table and the weight-wording table. Deleted the hosting-software explainer, the 50-character Vrbo note, the Vacasa/AvantStay/Kinlin Grover sentences, the fee-range paragraph, "What if you bring more dogs" (penalties stay in the table's third column and one sentence), and the puppies/service-animal section (now one checklist box with Airbnb's "service animals always stay free" and the unknown-cap caveat).
- New H2 "Booking two or more dogs: worksheet" between the tables and the host message: seven checkboxes (count, weight and breed, fee model, total for dates, house rules, where each dog rests and eats, written approval), the two-dog cost line, and the gate and crate cards (once, here only). Replaced the layout bullets and the thin cost section.
- Host message merged: heading now "second or third dog"; added the bedroom-door question. Closing checklist gained "two resting spots and a door that latches".
- FAQ answer "Can I bring three dogs" pointed at the deleted penalties section; changed to point at the table (frontmatter text only, no sources touched).
- Cost line, recomputed by script from `public/pet-policies-38-managers.csv` (script kept at scratchpad `two.py`): nine managers with a stated per-pet amount; two-dog totals (stated amount doubled, or first plus second pet where stated): Elk Springs $100, Hearthside $110 (35 lb tier), Aunt Bugs $150, Bear Camp $150, Tahoe Vacation Rentals $150, A Blue Ridge Cabin Rental $300, My Vacation Haven $350 ($250 + $100), St. Simons $400 ($250 + $150, under-14-day rate), Rosemary Beach $600. Sorted: 100, 110, 150, 150, 150, 300, 350, 400, 600; n = 9, min $100, max $600, median $150, before tax. Matches the plan. The one other figure used, Cabin Rentals of Georgia $50 per pet per night x 2 dogs x 5 nights = $500, is simple arithmetic from its stated rate. Sample limits stated in the guide: 38 managers we chose, read 2026-11-18, only managers stating an amount, before tax, "not the market". The plan's "$475 per-night illustration" was not published (could not be reproduced from the CSV).
- Disagreed with audit: the "Rental A / Rental B" cross-link was not added (I did not verify that example exists in `what-a-dog-really-costs-on-a-vacation-rental`); the fee guide link carries the pointer. Body is 1,246, below the 1,500 budget, because the worksheet needed fewer words than planned.

## can-you-leave-a-dog-alone
- Opening replaced with the audit's answer-first opening; "The short answer" rebuilt as three bullets (silence is not a yes, crate only if accepted, ask in writing; the never-the-first-night list moved to its own section directly below, which is now the second section).
- Merged "Is it allowed?" and "What do hosts actually write?" into "What does the listing say?" (table kept); deleted the Airhosts quote, three of four manager bullets (kept the Brindley Beach crate/bedroom-lock rule as the example), the Psychology Today four-hour summary, and "What we could not confirm". "How long" is now two sentences. Noise and camera merged into one section; crate and gate prose halved; settling-in routine turned into four bullets; host message kept.
- Kept: "no unattended pets, do not rely on being quick or quiet", storms/fireworks with ID and microchip line, never in a parked car, only crate a dog that accepts it, camera rule.
- Declined: dropping the gate card or crate card (frontmatter relatedProducts); body is 1,189, about 19 percent above target because every safety item and both cards stayed.

## bringing-a-dog-to-a-no-pets-rental
- New opening; reordered to ask-first (message and offer), then "If the host says no", then consequences, then service animals, then checklist. Consequences collapsed to one paragraph with the dataset numbers (14 of 38, 11 name an amount) and five amounts; the Cabin Rentals of Georgia line was dropped. "Why hosts say no" is now one sentence with the Proper Insurance link; "Damage and cleaning" two sentences with the damage-charge guide link; "What not to do" folded into the checklist (last box).
- Service-animal and ESA section kept in full (legal), separate, with the "never pass a pet off as a service animal" stance in it and in the checklist; DOJ and Vrbo links kept.
- Declined: dropping the floor-pad card (kept all three `{{pick}}` cards, prose around them shortened). Body 1,239, about 18 percent above the 1,050 target because the legal section was left intact.

## vacation-rental-with-a-reactive-dog
- Opening now carries the four checks, the message, the first-day plan and the vet trigger (hook sentence kept). Deleted "Start with your dog's triggers" definitions (Humane Colorado, ASPCA, Best Friends, Cornell), kept the three-line instruction and the see-through-fence example. Trigger blocks turned into a three-column table. Moved the host message and "A first-day plan" (all six steps, stress signs, do not force greetings) up directly after it. Merged neighbors, sightlines, doors and walking into "Four places a trigger shows up". Vet section keeps call-your-vet-before-booking and the medication line, AVSAB red flags cut to one clause. Gear prose shortened, all four `{{pick}}` lines unchanged. Anchors #what-to-tell-the-host, #a-first-day-plan and the vet anchor kept.
- Body 1,534, about 14 percent above target (host message and all gear cards kept).

## vacation-rental-with-a-senior-dog
- Opening and "Do this first" kept. Source attributions inside the checklist and floors/vet bullets compressed to parenthetical links; Airbnb step-free paragraph reduced to one sentence; manager rules paragraph cut to three points; forum-thread paragraph, Tripawds anecdote and host-forum links in the leaks section deleted; vet section cut to two bullets (joint signs, behavior changes with the routine-consistency line); trailing "forum threads are a small sample" line deleted.
- Kept: call vet before booking and again on the trip, do not force it, cancellation terms in writing, poison numbers, emergency vet, medication list with extra, parked-car line. Body 1,382, about 10 percent above target.

## puppy-at-a-vacation-rental
- New opening (answer first, five-of-38 finding with the so-what, the three asks); manager quotes cut to one line each; "Age rules in the managers' own words" and "Does a puppy count" sections deleted (house-trained fact and the treat-as-full-dog line merged into the opening). Host message moved directly under it. "Age and vaccination" cut to the vet/record line plus the CDC sentences. First-night plan promoted; accidents, who pays (two legal facts kept), crates (one-to-two-hour limit, not the place to start crate training) and a three-line chewing list merged under "Making it easy once you're there". Products moved last under "What to bring", each cut to who-for and who-skip; size lists and colours removed; all four `{{pick}}` lines unchanged. Resort Realty damage bullet and the ASPCA quotes on house training dropped except the one used.
- Body 1,202 (target about 1,250).

## Checks
`bunx tsc --noEmit` clean; `bunx vitest run src/test/content.test.ts src/test/internal-guide-links.test.ts` 371 passed. Full run recorded in the final reply.
