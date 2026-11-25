# Search-demand evidence (Cowork, read-only), collected 2026-11-25

Source: Cowork, Chrome signed in, SERPs localized to Alafaya FL (gl=us). Cowork's private copies: `/home/claude/private-evidence/search-demand-evidence-report.md` (not in this repo). No screenshots or exports were saved.

## Limits (read first)
- Search Console window is 2026-11-16 to 2026-11-23 only (site about 8 days old in Search Console): 306 impressions, 0 clicks, average position 17.4, 47 queries. **No basis to project traffic.**
- All 36 target queries: Search Console = NONE (exact match).
- Keyword Planner (US, Nov 2025 to Oct 2026) gave ranges only; NO DATA for nearly every long-tail query. NO DATA means "too small to report", not "unknown demand".
- Trends: US, 12 months; long-tail terms have no baseline. 90-day not pulled separately.
- SERPs: 18 of 36 queries were NOT CHECKED (time). No inference is made for them; they are labelled UNVERIFIED.
- Rank = page 1 seen in this one browser only. Not a ranking guarantee.

## Result by cluster

| Cluster | Queries checked | Our page on page 1 | Satisfies? | Verdict |
|---|---|---|---|---|
| C no pet fee | "no pet fee cabins" (P1), "vacation rentals with no pet fee" (P1, 3rd organic) | no-pet-fee guide | YES | WINNABLE; already there, volume unproven |
| F fee amounts | "how much are pet fees at vacation rentals" (P1, last organic) | fees guide | YES | WINNABLE, only 10th; competitors are host-side blogs |
| A dog limits | "vacation rental dog limit" (P1 via /data/pet-policies); "how many dogs are allowed at an airbnb" (absent) | data page; how-many-dogs | YES / YES | WINNABLE informational; cabins-for-2/3-dogs queries are booking listings (AVOID) |
| E cabin packing | "dog friendly cabin packing list" (P1, 2nd organic) | packing-list guide | YES | WINNABLE but demand tiny; broader "dog travel packing list" HARD |
| D large dogs | "large dog friendly vacation rentals no weight limit" (absent); question queries in Search Console at position 1.0 to 5.3 | large-dogs guide | YES | WINNABLE, tiny; fenced-yard rental queries HARD |
| B town cabins | Blue Ridge, fenced-yard Blue Ridge checked; others not | none | NO (destination pages list things to do, not cabins) | AVOID |

## Search Console, what is actually showing
Top pages (impressions / avg position): no-pets-rental guide 83 / 6.6; pet-fees guide 47 / 8.5; /gear/car-safety 43 / 45.1; Helen cabin stay 18 / 37.1; leave-dog-alone guide 17 / 8.1; Airbnb-vs-Vrbo guide 11 / 6.0; Santa Barbara 8 / 39.0; cleaning-and-rental-protection 7 / 6.6; bowls 7 / 26.4; multi-dog-families 6 / 11.8.

Top queries: dog car safety 8; best pet grooming kit for renters 7; fully fenced yard 5; car safety for dogs 5; is airbnb or vrbo better for traveling with a dog 4; best dog car seats 4; Santa Barbara pet friendly vacation rentals 4; Helen cabin queries about 10 combined; what's the best way to find a vacation rental that welcomes large dogs 3 (pos 5.3); what happens if you have pets in a no pet rental 1 (pos 10). 0 clicks on all.

## Keyword Planner head terms (ranges only)
dog friendly cabins 1K-10K; pet friendly cabins 1K-10K; cabins that allow dogs 1K-10K; pet friendly vacation rentals 10K-100K; vrbo pet friendly 1K-10K; pet friendly cabins near me 1K-10K; pet friendly cabins Gatlinburg 1K-10K; Pigeon Forge 100-1K; dog friendly cabins Blue Ridge GA 10-100 (high competition). "Pet friendly vacation rentals" is seasonal (peaks Feb and mid-June, lowest Oct and Nov). None of the six long-tail clusters has a reported volume.

## Issues Cowork flagged (QA-001 style)
- A. "vrbo pet policy" (1 impression, pos 28) is attached to `/corrections`, not a policy or fee page. Medium. Fix: link from /corrections to the fees and Airbnb-vs-Vrbo guides, or add a short Vrbo/Airbnb policy section to the fees guide.
- B. `/destinations/georgia/blue-ridge` opens with things to do while the queries are booking-style. High expectation gap; we should not target cabin queries.
- C. `/stays` shows "photos are on the booking page" placeholders and "Pet fee not confirmed" tags; not a competitive cabin result. Medium.
- E. Google ranked `/data/pet-policies`, not the how-many-dogs guide, for "vacation rental dog limit". Possible overlap; UNVERIFIED.
- Airbnb policy news of 2026-11-20 pushes fresh host blogs for "airbnb no pet fee"; HARD.
