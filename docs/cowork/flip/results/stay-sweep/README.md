# Stay sweep (Georgia and California), staged 2026-11-24

Staged results only. Nothing here is on `main`, nothing is deployed, and builds stay off.

| What | File |
|---|---|
| 31 new stay files (copy into `content/stays/`) | `stays/*.yml` |
| 31 new link rows (paste into `content/affiliates.yml` under the other `vrbo-` rows) | `affiliates-add-31.yml` |
| Buyer guide | `BUYER-HOWTO-stays-and-links.md` |
| All 68 stays and their links, and whether the site shows each | `AUDIT-stays-and-links.csv` |
| Test time-limit fix needed after merging | `test-timeout.patch` |
| The 31 stays with every detail read | `stays-all-with-links-2026-11-24.csv` |

Checked against `main` (34fa780) by applying the files temporarily: all tests pass except `stay-indexing` timing out at 5 s (7.4 s with 68 stays); with the patch it passes. 63 of 68 stays would show (31 new + 32 existing). Five existing stays have no Vrbo link and stay hidden (four Vacasa listings, one Explore Georgia page). None of the 31 new pages is indexable yet; the 23 already-indexable stays are unchanged.
