# Fact-check: can-dogs-go-in-a-rental-pool-or-hot-tub

Checked 2026-11-18 by re-fetching every cited public page. No dossier exists; the ledger and the article's research block were used.

## Corrections

| Before | After | Why |
| --- | --- | --- |
| Cornell signs: "...vomiting, diarrhea, weakness and collapse" | "...vomiting, bloody diarrhea, ..." | Cornell lists bloody diarrhea, not plain diarrhea (PARTIAL) |
| "CDC puts the water in a 77 to 113 degree range" (hot tub section) | Adds that the range favors Legionella growth and that CDC recommends 104 F or below to prevent scalding | Original read like a safe-temperature statement; CDC's range is about Legionella |
| FAQ hot tub: "hot tubs keep water in a temperature range of 77 to 113" | Adds "that favors Legionella growth", "looks like a poor place", flags it as our reading | Same context problem; labels inference |
| FAQ cleaning charge: "a guest can be asked to pay for damage or unexpected cleaning caused by a pet" | Damage caused by a pet; host can send a request for damage, missing items or unexpected cleaning costs; 24 hours | Airbnb does not tie cleaning costs specifically to pets |
| Cornell treatment: "safely and immediately cool the pet and seek intensive care" | "cool the dog right away and get it to a veterinary hospital for intensive care" | Closer paraphrase of the page |
| Sources [[10]] sentence | Adds the 104 F scalding recommendation | Accuracy, read this session |

Ledger rows for Cornell and the CDC hot tub page updated to match.

## Could not verify / removed
- None could not load. Nothing removed.
- Twiddy blog Sunnybuns quote: the sentence appears on the page, but the fetch tool placed it as a heading in the Sunnybuns entry, with the home description before it. Wording confirmed; attribution to Sunnybuns accepted as written. Rated VERIFIED with this note.
- Brindley Beach "charge may apply" is a manager statement; unchanged.

## Counts (ledger rows, 20 rows; 16 sourced plus the 4 level-3 rows)
- Sourced rows checked: 17 (dataset row, 7 manager quotes, Twiddy page, CDC x2, VCA, Cornell, Airbnb x2, Vrbo x2 = 17)
- VERIFIED: 15
- PARTIAL: 2 (Cornell sign list; CDC range context)
- WRONG: 0
- COULD NOT LOAD: 0
- Level-3 rows (inference/unknown): 4, correctly labelled with "Check for yourself" actions.

## Other checks
- Dataset: 38 managers in src/content/manager-policies.ts, 7 with a `pool` field (matches "7 of 38", "31 of 38"). Sample/not-survey wording present. The article has no policy-table caption with an "as of" date; the quote table says "re-read on 2026-11-18".
- "Six managers bar dogs from the pool" plus Twiddy blog's one-home statement equals seven; consistent.
- No medication names or doses, no poison hotline numbers needed, no breed stereotyping, no invented statistics. Liability and legal points are hedged ("ask a professional"). Level 2 not used (stated).
- Mechanics: [[1]]-[[16]] match source order and each is cited. Internal links all exist (airbnb-pet-damage-charge-after-checkout, how-vacation-rental-pet-fees-work, can-you-leave-a-dog-alone-in-a-vacation-rental, /tools/pet-cost-check, /tools/checklist, /data/pet-policies). Note: /tools/will-my-dog-be-accepted is outside the brief's tool list but the route exists in src/routes. Source URLs all https. readingMinutes 8 is consistent with roughly 1,900 body words.
- tsc and vitest both pass (19 files, 310 tests).

## Remaining risks
- Manager pages change; re-check at next data re-check.
- Twiddy dataset entry (one home) understates the pet page; the article discloses this.

## Verdict: PUBLISH-AFTER-NOTED-FIXES
Fixes above applied; all quotes and claims match sources. Status, approvedBy and heroImage untouched.
