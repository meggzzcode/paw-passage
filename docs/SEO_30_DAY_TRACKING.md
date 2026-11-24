# SEO 30-day tracking plan

Start date for the clock: the day the final build is deployed (not before). Until then nothing below can be measured against the new pages. All numbers must come from Search Console or GA4 exports; none are estimated here.

## Baseline (historical, old build, not current)
| Source | Window | Impressions | Clicks | Avg position | Note |
|---|---|---|---|---|---|
| Owner report | 28 days, date not recorded | about 236 | 0 | about 16.5 | 21 of 23 inspected URLs indexed; sitemap read OK, 95 URLs then |
| Cowork 2026-11-23 | 2026-11-16 to 11-21 | 163 | 0 | 15.2 | sitemap read OK, 98 URLs; Page indexing showed "0 indexed, 2 not indexed" (probably not yet populated; UNVERIFIED) |
| GA4 2026-11-17 to 11-23 | 7 days | 463 sessions, 460 users, 14 engaged | n/a | n/a | 450 Direct, 11 Paid Search, 2 Referral, 0 Organic; not bot-filtered |

Domain registered 2026-11-16. Re-baseline on deploy day with the Cowork brief (docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md) and write the real numbers in the first row of the weekly table.

## Priority landing pages
`/data/pet-policies`, `/guides/how-vacation-rental-pet-fees-work`, `/guides/vacation-rentals-with-no-pet-fee`, `/guides/vacation-rentals-that-welcome-large-dogs`, `/guides/how-many-dogs-can-you-bring-to-a-vacation-rental`, `/guides/two-large-dogs-in-one-car`, `/guides/dog-car-safety-harness-and-crate-guide`, `/guides/dog-friendly-cabin-packing-list` with `/tools/packing-list`, `/guides/vacation-rental-secure-fenced-yard`, `/gear`, `/stays`, `/destinations/georgia/blue-ridge`, its `/things-to-do`, and the Mendocino and Monterey things-to-do pages.

## Query groups (classify the GSC query export by hand; do not buy volumes)
1. Fees: pet fee per night, per stay, how much; 2. no pet fee; 3. large dog or weight limit; 4. how many dogs; 5. car safety, harness, crate, two dogs; 6. packing; 7. fenced yard; 8. destination and things to do; 9. brand; 10. other.

## Weekly metrics (fill from GSC exports, same date range logic every week)
| Week ending | Sitemap URLs read | Indexed (Page indexing) | Not indexed: top reasons | Impressions | Clicks | Avg position | Queries with 1+ impression | Pages with 1+ impression | Brand queries | Referring sites (GSC Links) | GA4 organic sessions | Notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| deploy day | | | | | | | | | | | | |
| +7 | | | | | | | | | | | | |
| +14 | | | | | | | | | | | | |
| +21 | | | | | | | | | | | | |
| +28 | | | | | | | | | | | | |

Also record weekly: URL Inspection status for the 15 URLs in the Cowork brief (indexed or not, Google-selected canonical = declared canonical, last crawl); whether `/guides/vacation-rentals-with-no-dog-weight-limit` now shows as a redirect; things-to-do pages discovered.

## Method
- Compare identical windows (28 days vs previous 28, or 7 vs previous 7). GSC lags 2 to 3 days; always note the last day included.
- Use Search type Web; track Image and Discover separately.
- Record changes you made with dates (deploy, metadata edits, new links, pins, outreach) in a changelog row so effects are not mis-attributed.
- Take indexing numbers from the Page indexing report and URL Inspection, not from `site:` searches.

## Noise versus real change
- Under 100 impressions a week, week-to-week movement is noise: a handful of queries can double or halve the total. Average position is dominated by one or two queries and moves when a new low-ranked query appears; do not read it alone.
- Zero clicks with impressions at position 10 to 20 is expected for a new site; CTR from a few dozen impressions is not interpretable. Do not rewrite titles from it.
- Real change looks like: more distinct queries and pages with impressions over three or more consecutive weeks, indexed count rising towards the sitemap count, a first branded query, first external referring sites, and clicks on non-brand queries.
- A drop right after deploy is usually Google re-evaluating changed titles and a redirected URL; wait two to three weeks before reacting.
- Owner's own visits, Cowork checks and bots inflate GA4 "Direct"; filter internal traffic before reading engagement.

## Updating the sale listing honestly
Use only dated, exported numbers ("Search Console: X impressions, Y clicks, 2026-MM-DD to 2026-MM-DD"). Keep the sentence that indexed counts are not a traffic or revenue history. Do not state rankings, earnings or traffic projections, and do not round up. If the 28-day number is lower than the earlier 236, say so and keep the older figure labelled historical with its date. Refresh docs/SALE_LISTING_DRAFT.md and docs/TRANSFER_CHECKLIST.md from the first deploy-day export, then weekly if the listing is live.

## Distribution log (separate from organic reporting)
Keep a dated list of pins published, outreach sent and replies. Pinterest and referral traffic appear as Social/Referral in GA4 and must not be counted as organic search.
