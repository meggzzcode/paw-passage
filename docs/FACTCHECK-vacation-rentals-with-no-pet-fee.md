# Fact-check: vacation-rentals-with-no-pet-fee

Checked 2026-11-18 against live public pages. Article stays status: draft. Checker did not write the article.

## Corrections made

| # | Before | After | Why |
|---|---|---|---|
| 1 | "numbers run from $35 a night to 'up to $1,000'" | "from $20 a night [[22]] to 'up to $1,000'"; new source 22 added | WRONG. Our own dataset has A Blue Ridge Vacation at $20/night (page: "pet fee of $20/night", plus a small cleaning fee), and Rocky Mountain Resorts at $25. |
| 2 | Sliding Rock: "It does not give a limit on the number of dogs." | Home page gives none, but the booking site lists "2 dog max" (Creekside Manner) and "4 dogs max" (Forever Friday) | PARTIAL. The escapia page we cite does state per-cabin limits. |
| 3 | Sliding Rock: "Pet-free is the one line that is clear." | "No pet fee is the one line that is clear." | Wording. "Pet-free" reads as pet-free homes. |
| 4 | Cabin Rentals of Georgia row omitted the deposit | Added "a refundable $250 pet deposit is also listed" | PARTIAL. The page lists a refundable $250 pet deposit. Omission understated the cost. |
| 5 | Hearthside: "One-time, non-refundable $55 per pet; $75 for a large pet" | "Some owners: ..." | PARTIAL. Page says "Some owners allow pets for a one-time, non-refundable fee of $55." |
| 6 | FAQ: "Hosts can still charge a normal cleaning fee that applies to every guest." | "Check the price breakdown for any cleaning fee, since the page we read is about pet fees." | Unlisted claim. The Airbnb pages we read do not say this. |
| 7 | "A $0 fee with a cleaning fee can land close to a $40 fee with none" | Rephrased with no number, labelled "our reading, not a figure from any page" | Unlisted inference with a mismatched unit. Big Bear's $40 is per pet per night. |
| 8 | Ledger | Updated rows for Sliding Rock limits, CRG deposit, Hearthside "some owners", and a new A Blue Ridge Vacation row | Keep the ledger aligned with the article. |

## Row-by-row result

All 28 sourced ledger rows plus the dataset row and the hypothetical row were checked; the table below counts the article's claims by outcome.

- Dataset: 38 entries, 3 at $0, 22 stating a charge, 13 "Not stated". Counts match (3+22+13=38).
- Sliding Rock home page: quote, "select cabins" fenced yards, and the amenities all confirmed (the page also lists blankets).
- Sliding Rock booking site: "Each cabin has nominal cleaning fees" confirmed, with no amount and no deposit mentioned.
- Hapey: "No pet fees. Ever. What you see when you book is what you pay." confirmed verbatim. The FAQ quote "No pet deposit, no nightly pet surcharge, no pet fee of any kind" is confirmed. The "more than two dogs" quote is confirmed. Crate, vaccinated and housebroken are confirmed. Exactly five cabins are named with enclosed space.
- Hapey Pet Paradise Promise: no cleaning surcharge, no pet deposit, damage not addressed, no restriction on how many dogs, and direct booking skips service fees are all confirmed.
- Hapey direct-booking page: Vrbo exclusively, 6%-14% falling as the total rises, and "No Service Fees, No Cleaning Fees" rolled into rates are all confirmed.
- Twiddy blog: 10 homes. Eight have a 2-dog or 2-pet max (6 dogs and 2 pets). Atlantic View has 4 dogs. Kissed by the Wind allows 1 pet. Wording is confirmed.
- Twiddy Duck page: "no additional pet fees", the 2-pet max unless advertised, "Pets Allowed" and the pool/hot tub rule are confirmed.
- Big Bear, Tahoe, Rosemary Beach, My Vacation Haven, Resort Realty and Vacasa: confirmed as written.
- Cabin Rentals of Georgia and Hearthside: PARTIAL (see corrections 4 and 5).
- Airbnb articles 86, 3623 and 1869: all claims confirmed, including the 0-5 pets, the per-booking/night/pet/pet-per-night structures, the base-rate cap, expected cleaning rather than damage, and fee shown in nightly rate and total. Service animals "always stay for free", and the emotional-support default is confirmed.
- Vrbo help pages (fees, price display, house rules): all confirmed, including the 50-character note.
- Neither platform page describes a no-pet-fee filter: consistent with what the pages say.
- Worked table: 800+120+0=920 and 720+100+60=880. Correct, and labelled hypothetical.

| Status | Count |
|---|---|
| VERIFIED | 29 |
| PARTIAL (fixed) | 3 (Sliding Rock dog limit, CRG deposit, Hearthside "some owners") |
| WRONG (fixed) | 1 ($35 low end of fee range) |
| COULD NOT LOAD | 0 |

Unlisted claims found and fixed: 2 (Airbnb cleaning-fee sentence in the FAQ, $40 comparison). Nothing was removed outright.

## Other checks

- Certainty levels: level 2 is explicitly "nothing here", the sample is labelled as a small convenience sample read on 2026-11-18, and the "as of" wording is present. No anecdote is stated as a rule.
- Risk areas: no medication names or doses, no breed stereotyping, no legal or medical advice. There are no poison-hotline numbers in this article, so none were needed.
- Mechanics: [[1]]-[[22]] match the sources order, and every source is cited. Internal links point to existing slugs (the five relatedGuides exist) and /tools/pet-cost-check and /tools/will-my-dog-be-accepted exist. The checklist tool is in relatedTools. External URLs use https. readingMinutes is 8 (about 1,880 body words / 238).
- Checks run: `bunx tsc --noEmit` passes. `bunx vitest run`: 11 suites fail to load and 2 pet-cost-workflow tests fail. A sample failure (content.test.ts) comes from content/stays/cozy-romantic-cabin-with-a-view-and-hot-tub-near-downtown.yml ("accessNotes: Expected array, received string"), which is not this article, so I did not edit it. I did not diagnose the 2 pet-cost-workflow failures, but they are in component tests, not content for this article. Not a result of my edits, which touched only the article and its ledger.

## Remaining risks

- Hapey pages conflict slightly: one says Vrbo exclusively, another says direct booking skips service fees and mentions "third-party pet fees some OTAs still allow". The article already flags the conflict.
- Hapey's FAQ says "Most of our cabins" have fenced runs, while the page names five. The article hedges with "check the individual cabin page".
- The Twiddy $0 rests on a blog sample, which the article states.
- Policies drift. Re-read the three fee-free pages at least twice a year.

## Verdict

PUBLISH-AFTER-NOTED-FIXES. All factual errors are corrected and the article is internally consistent. Before publishing, the unrelated failing vitest suites (stays YAML, pet-cost-workflow) must be fixed by their owners. Status left as draft.
