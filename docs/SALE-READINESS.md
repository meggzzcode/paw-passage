# Sale readiness (planning notes)

Scored 2026-11-18 from the evidence in `docs/recovery/09-traffic-monetization-valuation.md` (section C). These are the owner's planning notes. They are **not a valuation, not market evidence and not a guarantee** of any price.

## Score (1 to 10; for risk, 10 means lowest risk)

| Category | Score | Why |
|---|---|---|
| Traffic quality | 2 | New domain bought 2026-11-17; no traffic data yet. |
| Revenue and monetization | 2 | Vrbo approved but links are generic; Chewy declined; Stay22 account ID empty; no earnings. Revenue is $0. |
| Content quality and authority | 6 | Original 38-manager dataset, sourced claims, fact-check documents. Held back by over-hedged prose, no named author (owner's choice) and 15 code-only guides. |
| Risk and operational stability | 5 | Positives: no backend, tests, buyer handover, accounts excluded from sale. Negatives: Netlify free plan with silent build failures, Lovable config dependency, Pages CMS not yet verified, one affiliate relationship, young domain, dependence on the owner's identity. |
| **Average** | **3.75** | (2 + 2 + 6 + 5) / 4 |

## What moves each score

- **Traffic (aim for 9+):** about 12 months of Search Console and GA4 history, steady growth, and three or more meaningful sources with none above roughly 50% (that threshold is a planning rule, not an industry standard). Documentation alone cannot raise this.
- **Revenue (aim for 9+):** 12 months of statements from two or more affiliate programs, none above roughly 50%, with screenshots or recordings ready. Documentation alone cannot raise this.
- **Content (aim for 9+):** re-score the guides to 8.5 or better per `docs/audit/PATH-TO-9.md`, refresh the dataset every six months (the weekly Site health workflow flags it), and add an original asset per guide.
- **Risk (aim for 9+):** failure alerts for builds (done in part by the weekly Site health issues), finish the Pages CMS migration and test it, rehearse the transfer, document every account (`docs/OPERATIONS-HANDBOOK.md`), add a second and third affiliate program and a second traffic source.

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

Worked example: $500 a month of net profit in the Growing band is 500 x 12 = $6,000 up to 500 x 24 = $12,000.

Where the site stands: monthly net profit is $0 today, so none of these rows applies. Pre-revenue, the site is worth roughly what its assets would cost to rebuild (domain, original dataset, 24 guides, working tools, a portable stack, documentation), not a multiple.

Marketplace reference read 2026-11-18: Empire Flippers' public page stated a minimum of $24,000 a year net profit ($2,000 a month) and published multiples of about 2.2x to 2.4x of net profit, so a site below that would not qualify there. No verified comparable for a starter content site was found (other marketplaces blocked reading or showed no multiples).

## What a buyer will want to see

Dated statements, GA4 and Search Console access, the documents `BUYER_HANDOVER.md`, `docs/OPERATIONS-HANDBOOK.md` and `docs/DNS-AND-TRANSFER.md`, a clear statement that affiliate accounts (Expedia Group, Stay22, Impact, Awin, Ascend, Amazon) are excluded and must be re-applied for, and a written transition offer (for example 30 days). Do not publish or quote Expedia commission figures.
