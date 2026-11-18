# Fact-check: what-a-dog-really-costs-on-a-vacation-rental

Checked 2026-11-18. No dossier exists; checked against the ledger, the research block and src/content/manager-policies.ts. All 13 cited pages loaded.

## Corrections

| Before | After | Why |
| --- | --- | --- |
| Flat or per-pet amounts "$50 to $300" (FAQ and body) | "$50 to $400" (body notes the $400 is one manager's 14+ day rate) | St. Simons Island Beach Rentals is $400 for stays of 14+ days in the dataset, above $300. Ledger updated. |
| Tahoe waiver quoted "in place of a security deposit" | "in lieu of a security deposit" | Page wording is "in lieu of". |
| Cabin Rentals of Georgia "$75 pet cleaning fee" charged once | Hedged: page does not label it per night, "so we read it as charged once"; worked example states the assumption | Page does not say once. |
| Twiddy "nine of ten homes ... no additional fee or deposit" | All ten waive pet fee and deposit; nine use those words | Tenth home (Kissed by the Wind) also waives both, in other words. |

## Could not verify / removed
None removed. Nothing could not load.

## Counts (ledger rows, 18 rows with a source)
VERIFIED 14, PARTIAL 3 (CRoG once-vs-nightly, Tahoe quote wording, Twiddy nine-vs-ten; all fixed), WRONG 1 (flat range top, fixed), COULD NOT LOAD 0. Level 3 rows are unknowns and are not scored.

## Checked and fine
Dataset counts (38, 25 state a fee, 3 at $0, 13 no amount, 22 charge); nightly range $20 to $50; all table rows (Big Bear, Tahoe, Rosemary Beach, AMI, Resort Realty); quoted Vrbo "damage deposit amount set by"; Airbnb quote "may be separate from cleaning fees"; worked examples A/B/C ($1,300/$1,250/$1,300; $1,550; two-dog $1,500/$1,300/$1,250) and the $325 CRoG sum; [[n]] order and all 13 sources cited; internal links and tools exist; readingMinutes 9 (about 1,946 words); no medication, medical or legal advice, no breed claims; three certainty levels present with counts and the small-sample caveat.

## Remaining risks
- The sibling guide how-vacation-rental-pet-fees-work says nightly "$20 to $75" and flat "$50 to $300"; it disagrees with the dataset (nightly max is $50, flat max $400). Not edited.
- tsc passes. vitest fails (11 files) because of content/guides/vacation-rental-with-a-reactive-dog.md (missing related slug "dog-id-tags-and-gps-trackers-for-travel-guide"); not this article, not edited. The two pet-cost-workflow test failures are unrelated to this article.

## Verdict
PUBLISH-AFTER-NOTED-FIXES: fixes applied; publish once the unrelated reactive-dog article failure is resolved and a human approves.
