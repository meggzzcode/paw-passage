# Evidence pack: what a buyer can inspect before paying

Purpose: better evidence moves a buyer more than a higher asking price. This page lists each piece of evidence, where it lives, what it proves, and what it does NOT prove. Nothing here claims traffic, revenue, rankings, buyer interest or affiliate approval. Counts are those of the release in [`docs/SALE_RELEASE_STATUS.md`](../SALE_RELEASE_STATUS.md) (target commit `ca2ffbd`, 2026-11-25); recount with [`docs/buyer/ROUTE_AND_ASSET_COUNTS.md`](ROUTE_AND_ASSET_COUNTS.md) before quoting.

## Be upfront first (put this above the evidence in the listing)

- **Seller affiliate accounts do not transfer.** The Amazon tracking ID, the Vrbo/Impact deeplinks, the Impact verification value, the GA4 property and the Pinterest account are the seller's. The buyer applies for their own and replaces them ([`BUYER_AFFILIATE_TRANSITION.md`](../BUYER_AFFILIATE_TRANSITION.md); `node scripts/audit-seller-ids.mjs --expect-none` proves nothing of the seller's remains).
- **The Vrbo links are not an asset.** 79 Vrbo deeplinks in the repository are the seller's tracking links. The asset is the researched stay directory: 83 stay files, 78 shown, 23 indexable, **none confirmed with a host**. With the shipped `public-sources` mode the directory keeps working after the seller's links are removed, using plain public source links that earn nothing. Say "83 stay files, 78 shown", never "83 stays with their Vrbo links".
- **No revenue, no established traffic.** The domain was registered 2026-11-16.

## Evidence items

| # | Evidence | Where / how to show it | What it proves | What it does NOT prove | Status |
|---|---|---|---|---|---|
| 1 | **Search Console screenshot (fresh, dated)** | Cowork C4: Performance, Pages indexing and Sitemaps reports for the domain property, with the date range visible; store privately, share via the marketplace's evidence upload | The site is verified, the sitemap is read, how many URLs Google reports as indexed, early impressions | Traffic, demand, or future rankings. Earlier export: 306 impressions, 0 clicks, 16 to 23 Nov, historical | PENDING: take it after the live deploy and the sitemap resubmission; caption with the exact range |
| 2 | **Buyer handover kit** | [`BUYER_HANDOVER.md`](../../BUYER_HANDOVER.md) (START HERE owner's guide), [`TRANSFER_CHECKLIST.md`](../TRANSFER_CHECKLIST.md), [`BUYER_OVERVIEW.md`](../BUYER_OVERVIEW.md), [`BUYER_AFFILIATE_TRANSITION.md`](../BUYER_AFFILIATE_TRANSITION.md), [`BUYER_WALKTHROUGH_SCRIPT.md`](../BUYER_WALKTHROUGH_SCRIPT.md), the costs table, the seller-ID audit script | The buyer can take over, edit and publish without a developer for routine content, and knows costs and limits | That the Pages CMS save-to-live loop was tested (UNVERIFIED); real-device screen reader checks | AVAILABLE. Screenshots in the owner's guide are PENDING (Cowork D2) |
| 3 | **Original 38-manager research** | `/data/pet-policies`, CSV download, [`DATA-RECHECK-LOG.md`](../DATA-RECHECK-LOG.md); read dates 2026-11-18 | Original, sourced, dated research a buyer cannot get elsewhere | That policies are current today (single-date sample) | AVAILABLE |
| 4 | **31 published guides, about 48,100 words, 449 sources** | Live site; Sources list on every guide; editorial records `docs/editorial/FINAL-*.md`; independent reader reviews `docs/review/` (mean 7.1 of 10 before the final fixes: state honestly) | Researched, answer-first content with dated sources | Quality scores above 7.1, or that guides rank | AVAILABLE |
| 5 | **Stay directory** | `/stays`: 83 files, 78 shown, 23 indexable, 55 shown but `noindex`, 5 hidden; every page says it is not confirmed with the host | A built directory with filters and a rule that keeps thin pages out of search | Host verification, availability, or commissions | AVAILABLE |
| 6 | **Working product, verified live** | Live site (production `main@f02e4f9`): `scripts/verify-site.mjs` 331 checks, 0 failed; 147 local browser checks and 5 journeys; axe 0 serious/critical on 21 pages ([`PRESALE_BROWSER_QA_RESULTS.md`](../PRESALE_BROWSER_QA_RESULTS.md)); live review with no must-fix findings ([`LIVE_REVIEW_2026-11-25.md`](../LIVE_REVIEW_2026-11-25.md)) | It works, on the deployed domain, on the date stated | Real-device Safari/VoiceOver/Android results (owner-reported Safari only) | AVAILABLE |
| 7 | **Planner and Gear** | `/tools/packing-list`, `/gear`; [`PACKING_PLANNER_PRODUCT_GUIDE.md`](../PACKING_PLANNER_PRODUCT_GUIDE.md); every one of 65 active products reachable ([`PACKING_GEAR_COVERAGE.md`](../PACKING_GEAR_COVERAGE.md)) | Tools a buyer can open and use in a minute; content editable in one YAML file | Conversion or earnings | AVAILABLE |
| 8 | **Transferability** | `node scripts/audit-seller-ids.mjs`, `scripts/test-netlify-ignore.mjs`, 805 tests, clean `npm ci`, `npm audit` 0 vulnerabilities, no secrets in the tree or 514 commits scanned ([`REPO_CLEANUP_NOTES.md`](../REPO_CLEANUP_NOTES.md)) | A clean, documented, runnable codebase | A legal assignment (a seller/lawyer item) | AVAILABLE |
| 9 | **Account evidence (private)** | Cowork C0 read-only report: Netlify project and plan, domain expiry and transfer options, CMS forms load | The seller really controls the domain, repository and hosting | Anything about earnings | AVAILABLE (privately; show screenshots only inside the marketplace) |
| 10 | **Buyer screenshots and walkthrough** | Cowork D2/C5 per [`BUYER_WALKTHROUGH_SCRIPT.md`](../BUYER_WALKTHROUGH_SCRIPT.md) | A five to seven minute look at the real site | A video (none exists unless recorded) | PENDING |
| 11 | **Google search observations (2026-11-25, Cowork)** | Private screenshots from the owner's signed-in, US-localized Chrome: `site:pawsandpassage.com` returned roughly 81 to 90 URLs (Google gives no exact count); the brand search returns the site first; on page 1 for "no pet fee vacation rentals" (#1 organic), "what happens if you bring a dog to a no pets rental" (#2 organic) and "vacation rental pet fees per night per dog" (about #9); page 2 for "how much are pet fees at vacation rentals"; not in the top 30 for four other searches. Search Console: 3 months, 0 clicks, 306 impressions, average position 17.4 (older build); the no-pets guide 83 impressions at average position 6.6, all from Nov 18 | That Google has crawled and lists the pages and that a few niche searches already show the guides on page 1 | Traffic or demand: 0 clicks; one signed-in, localized browser (ranks differ for other users); a snapshot that moves. Google Keyword Planner shows "airbnb pet fee" and "dog friendly vacation rental" at about 100 to 1K searches a month and no data for the other long-tail phrases: the niche is small | AVAILABLE as a dated snapshot. Retake after the next deploy and the indexing requests |

## How to present the Search Console screenshot honestly

1. Take it after the final deploy and the sitemap resubmission, from the domain property, with the date range and "last updated" visible.
2. Caption: "Search Console for pawsandpassage.com, <dates>: <impressions> impressions, <clicks> clicks, <indexed> pages reported indexed. Site registered 2026-11-16; early data, not established traffic."
3. Never crop out the date range, the totals or the indexing counts. Do not show an earlier export as the current state.
4. Do not call impressions "visitors" or "traffic", and do not extrapolate.

## What would make the case stronger before listing (in order of value)

1. The fresh Search Console baseline (item 1).
2. The Owner's Guide screenshots (item 2, Cowork D2).
3. A short screen recording of the walkthrough script (item 10).
4. A signed IP assignment and bill of sale template from the marketplace's escrow or a lawyer (seller task).
5. Optional: publish a few of the 31 Pinterest pins now so a buyer can see referral evidence over the listing period (needs the owner's approval; separate from organic search reporting).
