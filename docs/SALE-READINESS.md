# Sale readiness (planning notes)

> Superseded (2026-11-24): scores and counts (30 guides, 32 listed stays, 53 products) are from 2026-11-17 to 11-23. Current state and verdict: `docs/FINAL_SALE_CODE_RELEASE.md`; counts: `docs/buyer/ROUTE_AND_ASSET_COUNTS.md`. <!-- SUPERSEDED-NOTE -->


Scored 2026-11-18, reasons updated 2026-11-23 to the verified facts in `docs/BUYER_ASSET_INVENTORY.md`; scoring rules unchanged. Scored from the evidence in `docs/recovery/09-traffic-monetization-valuation.md` (section C). These are the owner's planning notes. They are **not a valuation, not market evidence and not a guarantee** of any price.

## Score (1 to 10; for risk, 10 means lowest risk)

| Category | Score | Why |
|---|---|---|
| Traffic quality | 2 | New domain bought 2026-11-17; no traffic data yet. |
| Revenue and monetization | 2 | Vrbo approved with 32 per-listing deeplinks (33 approved entries); Amazon tag and 53 approved product links wired to all 53 active products; Chewy declined; Stay22 account ID empty; no earnings. Revenue is $0 (not verifiable from the repo, and the affiliate accounts are the seller's and not part of the sale). |
| Content quality and authority | 6 | Original 38-manager dataset, 30 published guides with sourced claims and fact-check documents, 32 listed stays (none verified), 53 active products. Held back by over-hedged prose, no named author (owner's choice), 7 code-only guides and 0 verified stays. |
| Risk and operational stability | 5 | Positives: no backend, tests, buyer handover, accounts excluded from sale. Negatives: Netlify free plan (300-credit hard limit, silent build failures, removable at Netlify's discretion), Lovable config dependency (public npm, no account needed), Pages CMS not yet verified (6 collections defined, never opened in the live app), 486 passing tests, one main affiliate relationship, young domain, dependence on the owner's identity. |
| **Average** | **3.75** | (2 + 2 + 6 + 5) / 4 |

## What moves each score

- **Traffic (aim for 9+):** about 12 months of Search Console and GA4 history, steady growth, and three or more meaningful sources with none above roughly 50% (that threshold is a planning rule, not an industry standard). Documentation alone cannot raise this.
- **Revenue (aim for 9+):** 12 months of statements from two or more affiliate programs, none above roughly 50%, with screenshots or recordings ready. Documentation alone cannot raise this.
- **Content (aim for 9+):** re-score the guides to 8.5 or better per `docs/audit/PATH-TO-9.md`, refresh the dataset every six months (the weekly Site health workflow flags it), and add an original asset per guide.
- **Risk (aim for 9+):** cost and account facts are now verified (`docs/COSTS-AND-ACCOUNTS.md`: about $34.86 a year to run (from the 2026-11-18 cost record, not re-verified), Netlify commercial use not prohibited but removable at will, Lovable not needed), and a rebuild-from-repo runbook exists (`docs/SECURITY-AND-RECOVERY.md`); still open: failure alerts for builds (done in part by the weekly Site health issues), finish the Pages CMS migration and test it, rehearse the transfer, document every account (`docs/OPERATIONS-HANDBOOK.md`), add a second and third affiliate program and a second traffic source.

## Planning multiples (owner's, not market evidence)

Formula: value = monthly net profit x multiple. Starter 6 to 12x; Growing 12 to 24x; Strong 24 to 30x.

| Monthly net profit | Starter (6-12x) | Growing (12-24x) | Strong (24-30x) |
|---|---|---|---|
| $100 | 100 x 6 = $600 to 100 x 12 = $1,200 | $1,200 to $2,400 | $2,400 to $3,000 |
| $250 | $1,500 to $3,000 | $3,000 to $6,000 | $6,000 to $7,500 |
| $500 | $3,000 to $6,000 | $6,000 to $12,000 | $12,000 to $15,000 |
| $1,000 | $6,000 to $12,000 | $12,000 to $24,000 | $24,000 to $30,000 |
| $2,500 | $15,000 to $30,000 | $30,000 to $60,000 | $60,000 to $75,000 |
| $5,000 | $30,000 to $60,000 | $60,000 to $120,000 | $120,000 to $150,000 |
| $10,000 | 10,000 x 6 = $60,000 to 10,000 x 12 = $120,000 | 10,000 x 12 = $120,000 to 10,000 x 24 = $240,000 | 10,000 x 24 = $240,000 to 10,000 x 30 = $300,000 |

Worked example: $500 a month of net profit in the Growing band is 500 x 12 = $6,000 up to 500 x 24 = $12,000.

Where the site stands: monthly net profit is $0 today, so none of these rows applies. Pre-revenue, the site is worth roughly what its assets would cost to rebuild (domain, original dataset, 30 published guides, 4 working tools, 32 listed stays, 53 products, a portable stack, documentation), not a multiple. These planning multiples do not apply to a pre-revenue sale.

Marketplace reference read 2026-11-18 (unverified here): Empire Flippers' public page was noted as having a minimum net profit well above this site's, so it is not a fit. The newer `docs/research/MARKETPLACES-AND-COMPS-2026-11.md` (read 2026-11-23) does not repeat the multiples. No verified comparable for a starter content site was found.

## Owner's immediate-flip objective (2026-11-23)

The owner now intends to sell the site quickly, pre-revenue and turnkey, at an ask of about $1,500. This is a different basis from the scores and multiples above: it prices the built assets (see `docs/BUYER_ASSET_INVENTORY.md`), makes no traffic, ranking or earnings claim, and excludes all accounts, affiliate IDs and links, which the buyer replaces (`docs/TRANSFER_CHECKLIST.md`). The multiples table does not apply to it.

## What a buyer will want to see

Dated statements, GA4 and Search Console access, the documents `BUYER_HANDOVER.md`, `docs/OPERATIONS-HANDBOOK.md` and `docs/DNS-AND-TRANSFER.md`, a clear statement that affiliate accounts (Expedia Group, Stay22, Impact, Awin, Ascend, Amazon) are excluded and must be re-applied for, and a written transition offer (for example 30 days). Do not publish or quote Expedia commission figures.
