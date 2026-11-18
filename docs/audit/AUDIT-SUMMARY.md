# Paws & Passage: consolidated audit (2026-11-18)

Read-only audit by seven reviewers: four article audits (24 guides), compliance, tools/site/dataset, and 20 new article opportunities. Reviewed as a skeptical buyer. Full detail is in the AUDIT-*.md files in this folder. All search and competition judgments are [ESTIMATE] unless a file says [MEASURED]; the site is new and has no traffic or Search Console data, so no demand figure is real.

## 1. Verdict

A trustworthy, well-sourced research publication with real original assets (the 38-manager dataset, three tools, the three-clocks damage table). It is not yet a business a buyer would pay for: no traffic history, no approved revenue path in use, prose that reads like a compliance memo, and the best asset (the dataset) is barely used. Average article score is 5.6/10; none reaches 9. A 9 across the board is not realistic today. A realistic target after the fixes below is about 7 to 7.5.

## 2. Scores (24 guides, 10 criteria each)

| Criterion | Average | Range |
|---|---|---|
| SEO targeting | 5.9 | 4-8 |
| Organic traffic opportunity (new site) | 4.4 | 2-6 |
| Search intent alignment | 6.6 | 5-9 |
| Content quality | 6.8 | 5-8 |
| Originality and differentiation | 5.8 | 4-8 |
| Audience appeal | 5.6 | 4-8 |
| Natural writing style | 5.2 | 4-7 |
| Monetization potential | 4.5 | 3-7 |
| Shareability and backlink potential | 5.0 | 3-7 |
| Maintenance and resale suitability | 5.7 | 3-9 |
| **Overall** | **5.6** | 4.6-6.5 |

Verdicts: 18 IMPROVE, 5 REPOSITION, 1 MERGE, 0 KEEP-as-is. Priorities: 12 High, 11 Medium, 1 Low.

Strongest: fenced-yard guide 6.5, can-you-leave-a-dog-alone 6.4, cabin packing list 6.3, car-safety gear 6.3, damage-charge 6.3.
Weakest: water and feeding gear 4.6 (REPOSITION), California beachfront 4.8 (REPOSITION), LA getaways 4.9, breed restrictions 5.0, Airbnb vs Vrbo 5.0.

## 3. What is dragging scores down (cross-cutting)

1. The dataset is unused in all 24 guides. Fees and two-dogs guides use hypothetical dollar figures; large-dogs promises "how to find" rentals but names none.
2. Prose is accurate but over-hedged and repetitive ("do not assume / ask / confirm", seven sections opening "Direct answer:"). The certainty-label system reads clinically when repeated. One plain-language box would do.
3. Length: breed and senior (about 4,800 words) should be cut roughly in half; damage, how-many and NYE by about a third. Only no-pets is near the right length.
4. Destination guides (Georgia cabins, CA beachfront, Atlanta, LA) promise listings but deliver checklists, and none of the head terms looks winnable without verified stays. Their winnable parts are narrow questions buried as sections (Tallulah Gorge bridge dog rule, Joshua Tree trail rules, "a gated deck is not a fenced yard").
5. Cannibalization clusters: checklist, fees, large-dogs, two-dogs and how-many-dogs repeat the same tables; packing list duplicates first-aid, water and ID-tag guides; fenced-yard overlaps Georgia fenced-yard and portable-fence; unapproved-dog penalties repeat across four guides.
6. Monetization is the weakest dimension (4.5): no approved link renders anywhere; four platform-policy guides lead only to unapproved platforms or tools; the four gear guides say "some links are affiliate links" while none are.
7. Unverifiable first-hand claim: the Blue Ridge Airbnb example ($519.11 to $576.61) in the fees and Airbnb vs Vrbo guides; the "six-foot leash" claim in the packing list has no source.
8. Defects: LA guide typo ("leash.It may"); large-dogs seoTitle says "5 Checks" with no five-item list; packing guide links to the checklist instead of the packing tool; damage guide has a duplicate source entry; BUYER_HANDOVER is stale (says 15 articles).

## 4. Tools, site, dataset (scores: tools 5, site structure 6, dataset asset 4)

- The checker gave false reassurance when a manager was silent on breed. Fixed during the audit (silence now means "ask first"), pending merge.
- The two best tools (checker, packing builder) have one inbound link each. Guides mention the cost tool 36 times, the checklist 24, the checker never. Homepage and footer show only 2 of 4 tools.
- The homepage never states the 38-manager proof; destination tiles show only Georgia and California though the data is mostly NC, TN, FL, CO; homepage ships about 111 KB gzip of guide text.
- No public tool tests dog count, weight and breed against many named managers with a source link each (competitors reviewed: Pets Around the World calculator, NimbusCalc, DogSizeGuide, TripsWithPets).
- Dataset numbers (computed from manager-policies.ts): limit stated by 24 (22 say two, 2 say three), 14 state none; fee stated by 25, 3 charge $0 (Sliding Rock, Hapey, Twiddy on listed homes, the last fragile); breed: 31 silent, 2 named, 3 unnamed, 2 "none"; weight limit stated by 6; unauthorized-pet penalty stated by 12.
- Weaknesses: convenience sample; 11 blocked managers; uneven regions (NC heavy); silence is not "no rule"; single snapshot; no generator from CSV to TS; the raw CSV and TS counts of "no limit" disagree (11 vs 14) and must be reconciled before any new "X of 38" claim.
- Backlink targets (mostly [REPORTED] from search summaries): pet-travel statistics roundups, host-software blogs (Breezeway, IGMS, Lodgify, AirROI, Hostex), pet-brand surveys, destination boards. Competing data posts are weak (one says it is "not an audited survey").

## 5. Compliance (Expedia terms read in full; FTC and Amazon read)

Passes: disclosure wording in articles, gear picks and packing tool; Amazon sentence exact; direct links; no Vrbo/Expedia prices, coupons or commission figures; privacy page covers cookies and pixels.
Fixes (nothing changed yet):
1. Expedia 12.7 bars Expedia Marks in meta tags: remove "Vrbo" from the Airbnb vs Vrbo guide's title, description and social tags (H1 and body may keep it). Whether the title tag counts is UNCLEAR: ask Expedia (affiliatehubsupport@expediagroup.com; trademark: IPMatters@expedia.com). Add a build test that fails on brand names in seoTitle/seoDescription.
2. Stay Book button: the link is the generic affiliate link, not the cabin, so relabel "Search stays on Vrbo"; keep the sponsored note beside it; add nofollow.
3. Drop `noreferrer` on Expedia links (Expedia 7.1.9 bars masking referrers): BookingButton, Markdown, GearPicks, PackingBuilder.
4. Footer and privacy page say "some links may be affiliate links" even though nothing renders: make conditional or reword.
5. Add the required trademark notice ("VRBO is a trademark or registered trademark of Expedia, Inc.") where the mark appears.
6. Check disclosure contrast (FTC: hard to miss). Clause numbers came through a summarizing tool, so a human should re-check them against the page before relying on them.

## 6. The 20 article opportunities (details in AUDIT-opportunities.md)

Top ranked: (1) no-pet-fee rentals, the flagship data story; (2) what a dog really costs on a rental; (3) pet fees at 38 managers (data page); (4) reactive dog rental (only two pages target it; one competitor is from 2013); (5) Christmas week cabin with a dog (time-sensitive); then romantic weekend (live by about Dec 14 for Valentine's), dogs in the pool or hot tub, beach houses and beach rules, plan a trip around your dog (hub), no weight limit rentals, 3+ dogs, puppy at a rental, settle a dog, red flags in "pet-friendly" listings. Only the data-led ones (no fee, cost, fee data page, no weight limit, red flags) use something competitors lack. Deferred: OBX and Smokies regional pages, hotel chains, road-trip stops, unusual stays, service-dog fees. Rejected: generic "best rentals", airline policies, ESA letters, best US beaches, standalone 4 or 5 dog pages.

90-day sequence (start week of Nov 23): wk1 Christmas cabin + no-pet-fee; wk2 true cost; wk3 reactive dog; wk4 romantic weekend; wk5 pool/hot tub; wk6 fees data page; wk7 red flags; wk8 no weight limit; wk9 puppy; wk10 3+ dogs; wk11 beach houses; wk12 trip-planning hub. Update one existing guide a fortnight. Every data piece ships with a dated "last checked" line and a re-check log entry.

## 7. Quick wins vs longer term

Quick wins (days): compliance fixes above; fix the defects in section 3.8; remove or label the unverifiable claims; link all four tools from homepage, footer and guides; state the 38-manager proof on the homepage; retitle the cabins, beachfront and rental-protection guides; drop the stale "affiliate links" sentence on gear guides until links exist; refresh BUYER_HANDOVER.
Medium (weeks): wire the dataset into fees, large-dogs, two-dogs, checklist and how-many guides; cut breed and senior in half and the others by a third; one plain-language certainty box; merge two-dogs into how-many; cut the checklist to a true checklist; make no-pets the single home for unapproved-dog penalties; publish the dataset as its own page with a CSV download; add pool/hot-tub, minimum age and unattended-pet columns; one shareable asset (printable or graphic) per guide; regional filter and fee column in the checker.
Long term (months): verified stays (needs host confirmation); first affiliate approvals and a real earnings history; outreach for data-led backlinks; refresh cadence for volatile rules; evidence of traffic.

## 8. Buyer view

Strengths: genuine original data, honest sourcing, working tools, clean no-database stack, handover docs, accounts excluded from sale.
Worries: domain bought 2026-11-17 so no history; no revenue; affiliate accounts do not transfer; hard-coded dated counts across the site; BUYER_HANDOVER stale and its "no developer needed" claim does not hold for the 15 code-file guides; no named human editor (the owner chose no author bio, a trade-off a buyer will weigh).
