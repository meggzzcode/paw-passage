# Paws & Passage: site, tools and dataset audit (buyer view)

Audited 2026-11-18, read-only. Labels: [MEASURED] = I ran it, counted it, or opened the public page (URL given). [ESTIMATE] = my judgment. No traffic, Search Console or search-volume data exists, so no demand number appears here. Reddit and logins were not used. BringFido and Sniffspot returned 403 to my fetch and Dogster returned 403, so I say nothing about their content beyond what a search summary showed.

## Overall scores (0-10)

| Area | Score | One-line reason |
|---|---|---|
| Tools | 5 | One genuinely differentiated tool (dog-accepted) is hidden and has a false-reassurance flaw; the cost tool is good but competes with free calculators; nothing is shareable. |
| Site structure | 6 | Clean, honest, fast, well built; but the first visit is a stock-photo hero with no proof, the best assets are unlinked, and copy still describes stays that do not exist. |
| Dataset asset | 4 | Careful, cited, re-verified, but 38 rows of convenience sample, 14 of 38 with no stated dog limit, 31 of 38 silent on breed, one date, no region balance. Not yet defensible; potential is real. |

A note that contradicts the brief: `content/affiliates.yml` contains a Vrbo link with `approved: true` (kind stay). The brief says the file is empty. Stays are hidden (`hasStays()` false) so no button shows today, but `hasApprovedAffiliates()` is true, which turns on the footer disclosure line. Confirm that approval is real before handover. [MEASURED from the file]

---

## 1. The tools

### What exists [MEASURED from source]
- `/tools/will-my-dog-be-accepted`: client-side checker over the 38 managers (`src/lib/dog-accepted.ts`).
- `/tools/pet-cost-check`: three-stay cost comparison (fee basis per stay/night/dog/dog-night, tax, deposit) plus a generated message to the host.
- `/tools/packing-list`: profile toggles, tick-off list, copy/print, product pop-overs (affiliate-ready).
- `/tools/checklist`: 5 groups, 26 items, localStorage, print.
- `/tools/cost-calculator` and `/tools/host-questions` are 6-line redirect files into the cost workflow.

### Competitor comparison
Opened by me:
- Pets Around the World cost-comparison calculator, https://petsaroundtheworld.org/cost-comparison-calculator-pet-friendly-accommodation/ [MEASURED]: up to 3 options; per-stay / per-stay-per-pet / per-night / per-night-per-pet fee basis; resort, parking, misc fees. No deposits, tax or host message mentioned. Published April 2024. Functionally close to our cost tool minus deposit, tax and message.
- NimbusCalc pet travel checklist generator, https://www.nimbuscalc.com/tool/pet-travel-checklist-generator-dog-cat-trip-packing-list/ [MEASURED]: 4 selectors (pet, transport, destination, length), "Print / Save as PDF", two ad blocks, no product links, no sharing. Our packing builder is more personalised and nicer, but a user cannot tell that from search results.
- Dog Size Guide packing list, https://www.dogsizeguide.com/travel/dog-travel-packing-list [MEASURED]: static article, four trip variants, updated 5 July 2026, an unrelated crate calculator CTA. Shows the packing-list SERP is mostly static articles.
- TripsWithPets, https://www.tripswithpets.com/ [MEASURED]: RoutePaws route planner, hotel-chain pet-policy pages, a kqzyfj.com (CJ-style) Vrbo link, an "Advertise With Us" link; no downloads, no share buttons visible.
- Prior session's notes (docs/RESEARCH-COMPETITOR-TOOLS.md, not re-opened by me): DogFriendly.com has no per-listing dates; GoPetFriendly shut its directory in Feb 2025; BringFido is the large directory/booking competitor. [REPORTED by earlier audit]

Search-listed but not opened: pawcostguide.com, calcbee, pawcalculator.com, rvcostcalculator.com (pet travel cost calculators; mostly boarding vs sitter vs bring-along, not rental fee decoding). [search summary only]

### Where we are genuinely different [ESTIMATE, supported by the above]
1. Dog-accepted checker: I found no public tool that tests your dog count, weight and breed against many named rental managers' own pages with a source link each. This is the only tool nobody else has. It is also the one hidden on the site.
2. Cost tool's "message to the host" step (confirm the fee basis in writing) is a real product idea; competitors stop at the total.
3. Everything is client-side and ad-free, a trust positive against NimbusCalc's ad blocks.

### Flaws and UX gaps

**Critical: false reassurance in the breed logic.** [MEASURED, I ran `evaluate()`]
In `dog-accepted.ts` a manager whose page says nothing about breeds (31 of 38) adds no ask and no note. So a visitor with one 80 lb pit-bull-type dog sees "19 of 38 show no conflict", 5 conflicts, 14 ask. Output for 1 dog, no weight, breed "none": 20 fits / 18 ask / 0 conflict; for 1 pit-type dog: 19 / 17 / 2. A buyer reading this will say: "silence on a page is shown as a green light for the breed most often refused." The page footnote ("a blank rule means the page did not say") is below 38 cards. Fix: when breed is not "none" and the manager's breed field is `not-stated`, downgrade to "Ask first: page does not mention breeds". Likewise "fits" should not appear green for a manager with an unlisted fee basis.

**No location filter.** The 38 managers sit in 7 regions (Outer Banks, Smokies, Blue Ridge, Tahoe, Gulf, Georgia coast, others). A family going to Gatlinburg sees Tahoe results. The most useful framing, "which managers near where I'm going", is missing. [MEASURED: no region field in `ManagerPolicy`; `place` text only]

**Other gaps** [MEASURED from code unless noted]
- Result is a list of 38 cards, not an answer. No "cheapest stated fee", no fee sort, no share link, no "email me this". Output not printable or copyable (cost tool has copy/print; this one does not).
- No URL state: `?dogs=2&weight=40` is not supported, so results cannot be linked or shared and the tool cannot be a link target from articles with a pre-filled scenario.
- Max 4 dogs, weights in lb only, no puppies/age, no "service animal" note (fees barred for service animals on Airbnb/Vrbo per search summaries I read; not checked on the platforms' own pages).
- Cost tool: Step 3 message does not carry the stay's cost summary into a shareable form beyond copy; no URL state; no "what do these fees usually look like" benchmark drawn from our dataset (25 of 38 give a dollar figure, so a median is computable: see section 3). This is the obvious bridge between tool and data and it is missing.
- Packing builder: product pop-overs are hover/pin pop-ups (Escape to close); on touch devices hover does not exist, so the product reason depends on the pinned state. [ESTIMATE; not tested on a phone]
- Checklist is a static list; strong print, but no "email it to me", no link back to the data.
- Tool shell cross-links are thin: dog-accepted lists 2 guides + 1 tool; no link to checklist or packing list.

### Conversion paths [MEASURED]
- `will-my-dog-be-accepted` is linked from exactly one place outside itself: the `/tools` index. Not the homepage, not the footer Plan column (2 of 4 tools only), not any guide, not any dog-type page. `packing-list` has the same single inbound link. Meanwhile pet-cost-check appears 36 times and checklist 24 times in guide source. [grep of content/ and src/]
- The homepage "Free planning tools" block shows 2 of the 4 tools and omits the flagship.
- Guides that quote manager counts ("22 of 38 state two") do not embed the checker next to the number. The checker is the best CTA those articles have.
- Affiliate path: packing builder is the only tool with product links (gated by approved links). Cost and accepted tools have no booking path; with stays hidden the Vrbo approval has nowhere to appear. A "stays for your result" row would be the natural place once Vrbo/Booking links go live. [ESTIMATE]

### Shareability [ESTIMATE, from code]
Low. No share image, no result URL, no Open Graph card specific to a result, no PDF. A tool with no shareable output earns no links. NimbusCalc and Dog Size Guide are not better, so this is an open lane.

### Tool improvements, ordered
1. Fix breed/silence logic (hours). 2. Link the checker from home, footer, every guide that cites the 38-manager numbers and every dog-type page. 3. Add region selector and a "stated fee" sort/column. 4. URL-encoded scenarios + copyable/printable result. 5. Fee benchmarks from the dataset inside the cost tool ("managers who state a per-night fee: median $X; range $Y-$Z", computed). 6. Add the tool's result as an auto-generated share image (long-term).

---

## 2. Homepage, collections, navigation

### What a new visitor gets [MEASURED, local production build]
- `/`: 25 KB HTML (7 KB gzip). Hero: 1600 px JPEG 200 KB (68 KB phone variant). JS preloaded on home includes `guides` chunk 361 KB raw / 111 KB gzip and `index` 369 KB / 116 KB gzip: the full text of all guides ships on the homepage. CSS 95 KB. Total public dir 13 MB. HTML for a guide: 84 KB (21 KB gzip). Page weight is good on HTML and images; JS is the soft spot (`docs/PERFORMANCE.md` already knows). Netlify will brotli this; I did not run Lighthouse or load on a real phone.
- Title and description are honest. Hero: "Their favorite getaway starts here." with two buttons, Read the guides / Use the free tools (stays hidden). Subtext: "Every fact is sourced, and anything we could not confirm says so."
- Sections in order: dog-type tiles (4), "Where we're starting" (Georgia, California), "More than just pet-friendly", guides, tools block (2 of 4), "For hosts: List your property".

### Trust and boutique feel [ESTIMATE]
Strengths: restrained palette, serif display type, a real About/Editorial standards/Affiliate disclosure trail, a promise not to invent reviews, "unknown means unknown". Weaknesses a skeptical visitor will notice:
1. No proof on the first screen. The data that is the whole positioning (38 managers, 7 regions, date, 25 stating a dollar fee) appears nowhere on the homepage. The strongest line the site owns, "we read 38 managers' pet pages on 2026-11-18", is only in a tool description.
2. The "More than just pet-friendly" block promises "Fence, in detail... we record" for stays. Stays are hidden. A visitor looking for stays finds none, and this copy describes a product that is not live. Same for the "For hosts / List your property" box and the destination tiles that show only 2 of 7 dataset regions. [MEASURED: `hasStays()` false in production; sitemap lists only georgia and california destinations]
3. "Where we're starting" shows Georgia and California; the dataset and many articles are about NC Outer Banks, Smokies, Florida Gulf, Colorado. Mismatch between what we have data on and what we headline.
4. Stock-photo-grade hero with the dog nowhere (alt text aside; I did not open the image). No author, no human face. About page exists but the homepage carries no editor, no "last verified", no press line. Boutique publications lead with a point of view and a person. [ESTIMATE]
5. Header nav on desktop: Destinations, Guides, Tools (Stays and Dog rules hidden). On mobile the header collapses to a menu; the primary CTA button is desktop-only. [MEASURED from SiteHeader.tsx]
6. Tagline "Better adventures, together." is generic.

### /guides and /dogs
- `/guides`: 24 guides in four groups (Destination, Planning, Checklist, Gear) with a "Start here" line (two links) and filter chips. Fine for 24; reads as an index, not a magazine. No featured/original-data tag, no dates or "updated" sort, no search. At 24 it is OK; at 60 it will not scale.
- `/dogs`: 4 collections (escape artist, big dog, multi-dog, senior), each with intro, "questions to ask", an optional fact box and 5-6 guides. The pages are the best-organised idea on the site: they map to how owners actually describe themselves. [ESTIMATE] Weaknesses: only one fact box each, pulled from the dataset as one sentence; no tool embedded (the checker belongs on `big-dogs` and `multi-dog-families`); `/dogs` index is four plain bordered boxes, no imagery; no cross-links between collections; "Hearthside... Brindley... AMI Locals" examples hard-coded in `dog-types.ts` (maintenance, see section 5).
- Each live dog-type page needs at least 3 guides to be indexed (`dogTypeIsLive`), a sensible thin-content guard.
- Internal linking: guides link to checklist and cost tool heavily (36/24 mentions); the destination pages, dog types and guides do cross-link. Missing: checker everywhere, packing list everywhere, a "data" hub page. The sitemap lists the 4 tools, `/dogs/*`, 24 guides, 2 destinations: 52 URLs total. [MEASURED by curl of /sitemap.xml: 14 static + 2 destinations + 4 dogs + 24 guides... as listed]

### Structure recommendations
1. Add a proof strip under the hero: "38 rental managers read; 25 state a dollar fee; 22 cap dogs at two; source and date on every row" linking to a `/data` page.
2. Hide or reword any stay-specific block until stays are live.
3. Put the checker on the homepage as the first tool and give the nav a "Data" or "Research" entry.
4. Show 4 of 4 tools in the footer and homepage block.
5. Add "Reviewed by / last verified" to cards and guide headers (the Editorial standards page already promises it).
6. Reconsider the generic hero; a sentence that carries the research angle ("We read the fine print so you do not get a surprise fee") would differentiate. [ESTIMATE]

---

## 3. The 38-manager dataset

### What it is [MEASURED]
`docs/data/verified-1..3.csv` (13+13+12 rows = 38), mirrored as structured data in `src/content/manager-policies.ts`; verdict 33 MATCH / 5 MINOR on re-check against live pages on 2026-11-18. Each row has page URL, a verbatim evidence quote and notes. Raw collection files (`pet-policies-*.csv`) hold 58 rows: 46 fetched OK, 11 blocked, 1 not found; the 38 are the verified subset of the 46 OK rows. (I did not trace which 8 of the 46 were dropped; a buyer will ask.) Regions in the raw file: NC 16, CA 9, Smokies TN 9, Florida Gulf 8, N. Georgia 8, Colorado 4, Georgia coast 4.

### Numbers I computed from the 38 (reusable in articles) [MEASURED from the CSV/TS]
- Dog limit stated: 24 of 38. Two dogs: 22. Three: 2. No number stated: 14. (In the TS: 28 "dogs" basis, 6 "pets of any kind" basis, 4 "most homes".) Note: the CSV's `max_dogs` column counts 11 "not stated"; the TS has 14 nulls. The two files differ in how they treat "varies by home" rows. Reconcile before publishing any "X of 38" claim.
- Dollar pet fee stated: 25 of 38. Basis also stated for 18 of those. $0 fee: 3 (Sliding Rock Cabins, Twiddy, Hapey). Fee basis named at all: 23. 10 give neither amount nor basis.
- Per-night fees seen: $20, $25, $35, $40, $50 (Cabin Rentals of Georgia $50/night plus $75 cleaning). One-time/stay fees seen: $50 to $300, with St. Simons $250 first dog / $150 second / $400 for 14+ nights, Resort Realty "up to $1,000".
- Breed rule: 31 not stated, 3 unnamed, 2 named (Elk Springs 11 entries, Emmons pit), 2 explicitly none.
- Weight limit: 6 of 38 (35, 50 combined, 50, 60, 65 lb).
- Unauthorized-pet penalty stated: 12 of 38; 9 of those mention eviction or vacating.
- Holiday or peak surcharge: stated for 1 of 38 ("none stated"); 37 silent.
- Tool outcome: for three dogs, only 2 of 38 show no conflict; 18 conflict. For two dogs of 70 lb each: 20 fit, 13 ask, 5 conflict.

### Use it to the fullest (ideas)
Data-report articles (each uses numbers above, recomputed and cited):
1. "We read 38 vacation-rental pet policies: the median dog limit is two" (limit distribution, how many say nothing).
2. "The pet fee is not one number: 38 managers, 12 ways to charge it" (basis zoo: per stay, per night, per dog, per week, flat flea fee; show the same 4-night, 2-dog trip costed under each, using our cost tool).
3. "Three dogs: only 2 of 38 managers show no conflict" (strong, shareable, headline-able; but the sample caveat must be in the first paragraph).
4. "What happens if you sneak a dog in: the penalty clauses in 12 manager policies" (eviction, $300, $400 per dog, doubled fees).
5. "Which pet policies say nothing about breeds: 31 of 38" (careful framing: silence is not permission).
6. "Does your dog fit? The weight limits managers actually state" (6 of 38; shows how rare stated weight limits are).
7. Region splits once n per region is larger (NC Outer Banks 16 raw rows is the only region with enough for a regional claim; I would not publish state-level medians below n of 10).

Assets:
- Downloadable CSV, "Dog-Friendly Rental Policy Dataset 2026-11" on its own `/data` page with a data dictionary, source URLs, evidence quotes, licence (CC BY 4.0 with required attribution link), a versioned changelog and a "report an error" email. The files already exist; they need a public page and a clean header-friendly CSV (the current file mixes quotes and `not stated (...)` free text).
- A single-page "pet policy cheat sheet" PDF for the 5 most-asked questions.
- Embeddable widgets: an iframe of the dog-accepted checker with attribution link. Cheap link-earner for travel and dog bloggers.
- Shareable graphics (design-ready stats): "22 of 38 cap dogs at two", "14 of 38 give no dog limit at all", "3 dogs: 2 of 38", "25 of 38 show a dollar fee, 10 don't show any". Square and tall variants.

Pinterest angles [ESTIMATE; I did not measure Pinterest demand]: pins read as checklists and "what to ask" cards: "5 pet-fee words that mean different things", "3 dogs? Read this before you book", "The pet fee question to ask every host", "Sneaking a dog in: what the contracts say". The checklist already prints cleanly; export the five groups as a five-pin series. Pinterest rewards vertical images with text overlay; the site has no pin images today. [MEASURED: no pin assets in public/ or src/assets listing; `ls public` returns favicon and robots only]

### Weaknesses (be honest)
1. Sample: convenience, 38 managers, not a census or random draw. 11 managers (19% of the 58 collected) blocked automated reads and were skipped, which biases toward sites that allow fetching, typically smaller regional operators; the big platforms (Vacasa row is "many locations", Evolve, Airbnb, Vrbo) are barely represented or are per-listing. [MEASURED: 11 blocked, 1 not found in `pet-policies-*.csv`; ESTIMATE on bias direction]
2. Coverage: 7 regions, uneven. Outer Banks 16 raw rows against Colorado 4. No Northeast, Midwest, Texas, Hawaii, Pacific Northwest, Arizona. A national claim cannot be made; only "38 managers in 7 US regions".
3. Silence ambiguity: 31 of 38 "breed not stated" and 37 of 38 "holiday surcharge not stated" cannot be read as "no rule". The dataset records what a web page said, not the policy.
4. One snapshot, one date (2026-11-18). A dataset used as a link asset needs a visible "re-verified" cadence; a stale 2026 data page is worse than none.
5. Single researcher, single method: no second reader, no inter-rater check, and the verifier has been the same pipeline. The 33/5 MATCH/MINOR re-check is a good start but is self-audit.
6. Policies are per-property for many managers (4 "most homes" rows; "only some properties: yes"). A manager-level label can be misleading in a tool that says "no conflict".
7. CSV vs TS drift: 11 vs 14 "no dog number" (see above); fee strings in the TS are hand-shortened ("$75 plus tax per pet", "$100"), losing basis. Two sources of truth, no generator script I could find that builds the TS from the CSV. [MEASURED: counts differ; I did not find a build script]
8. The editorial standard says "never invent". The dataset has no licence and no explicit statement of what scraping/reading terms permit; publishing a CSV of third-party policy text needs a one-line legal check (facts are not copyrightable, verbatim quote blocks in `evidence_quote` could be an issue at volume). [ESTIMATE, not legal advice]

### What it takes to become defensible
- Grow to 100+ managers across 12+ regions; target the 11 blocked ones by reading their pages manually (a human opening the page is normal use; do not circumvent technical blocks). Record "could not read" as a coded value, not a drop.
- Second-reader verification on a random 20% and publish the agreement rate.
- Publish methodology on a page: selection rule, read date, quote rule, what "not stated" means, how rows are corrected. Add a stable ID per row and a changelog.
- Schedule a quarterly re-verification and show "last verified" per row; automate a diff (hash the page text; flag changes).
- Add one or two measures other sources lack: fee per dog per night normalised to a 4-night, 2-dog stay; share that cap dogs at 2; days since policy page was changed (if the page shows a date).
- Single generator: CSV is the source, TS is generated, tests assert counts against article claims (the article text hard-codes "22 of 38").

---

## 4. Backlink and PR opportunities from original data

What I opened [MEASURED]: the competing "data" posts are weak, which is the opening.
- https://rapideyeinspections.com/research/airbnb-pet-fee-statistics/ : compiles 30 stats from 8 named sources (BnB Facts 2022: about 12,000 scraped listings, 2,858 pet-friendly, 377 with a disclosed fee), explicitly "not an audited survey", has APA/MLA/Chicago citation buttons, no charts or CSV. Published 31 July 2026. Shows the format journalists and bloggers cite, and that nobody has a per-manager, quote-level dataset.
- https://www.captiva-island.com/post/pet-policies-captiva-rentals : "30 years" authority, no sample, no method, no year on the post. Opened, confirmed.
- https://petsaroundtheworld.org/... (tool above): shows that a plain calculator gets built into a blog post.
- Search results surfaced industry/host content: Breezeway, IGMS, Lodgify, AirROI, Hostex (host-facing blogs) and aggregator "pet travel statistics" lists (Dogster, Soocial, Condor Ferries, TravelTrends.io, Wag survey page, Kinship survey page). Those aggregator lists cite Wag, Kinship, Subaru/Talker Research and Booking.com. I read only search summaries for these, not the pages themselves. [REPORTED]

Targets, named as seen in search results (not contacted, no response measured):
- Pet travel "statistics" roundups (Dogster, Soocial, Condor Ferries, dreambigtravelfarblog, TravelTrends.io) update yearly and link to sources: pitch the dataset as a citable stat with a methodology page. Easiest link class. [ESTIMATE on acceptance]
- Short-term-rental host/software blogs (Breezeway, IGMS, Lodgify, AirROI, Hostex, Hospitable): they publish pet-fee benchmarks and need data; pitch "what 38 managers state, with sources". Audience is hosts, not guests, so keep the angle "benchmark your policy". [ESTIMATE]
- Pet brands that run travel surveys (Wag, Kinship, Sniffspot): partner/cross-cite rather than cold pitch; I could not open Sniffspot (403) or Wag. [REPORTED]
- Academic and housing-policy context pages I saw: AVMA JAVMA News ("Pet-friendly rental housing comes with restrictions, hard to find", 2021), HABRI/Michelson 2019 renter report (1,299 renters, 551 property owners and operators), Rose et al. 2020 on racial and spatial inequality in pet-friendly housing, and a 2026 Frontiers in Built Environment paper. [REPORTED via search summaries.] These are long-term rental, not vacation rental, so we cannot claim them as comparators, but the vacation-rental count of "no federal data" is a real PR gap: "no study of vacation-rental pet policies exists that I could find in one search" is an ESTIMATE, not a verified absence.
- Local and regional tourism boards for the dataset regions (Outer Banks, Blue Ridge/Fannin County, Smokies, Gulf Coast): a "pet policies across managers in your destination" release is relevant to destination marketing organisations. I did not open any specific one, so I name no URL. [ESTIMATE]
- Communities: Reddit and Facebook groups are where the questions live; I did not use Reddit per the rules and cannot report their rules or tolerance for links. Expect answer-first participation to be required; do not plan link dumping.

Realism check [ESTIMATE]: a brand-new site with no domain authority, no author, and 38 rows will get a trickle of citations from roundups and the odd local reporter; the realistic outcome in year one is a handful of editorial links, not hundreds. A larger, refreshed, licensed dataset with a named editor is what changes that.

---

## 5. Buyer-view risks and strengths

### Strengths
- Honest build: no database, no logins, plain files, tests (`src/test`), PERFORMANCE and handover docs, a record trail, claims and fact-check files per article (docs/CLAIMS-*, FACTCHECK-*), a consistency audit. Rare at this stage and a diligence time-saver.
- Strong editorial rules (unknown means unknown, no fake reviews) that fit an affiliate business that needs to survive Google quality updates. [ESTIMATE]
- Affiliate research is candid: Amazon account is explicitly not transferable (Operating Agreement section 12 per docs/AFFILIATE-PROGRAMS.md); DNS and domain transfer risks documented. A buyer will be grateful and will also see the problem (below).
- Clean, fast static site; images already optimised; sitemap, structured breadcrumbs, noindex guards for thin pages.
- Original-data angle is real and, if scaled, hard to copy.

### What I would diligence and what would worry me
1. **No traffic, no revenue, no history.** Brand new domain (bought 2026-11-17 per BUYER_HANDOVER.md). A buyer is paying for a build and a plan, not a business. Valuation should reflect asset cost, not earnings. [MEASURED from the handover doc]
2. **Affiliate accounts are not assets.** Amazon cannot be assigned; others unconfirmed (docs/AFFILIATE-AND-SELLING.md: "NOT CONFIRMED"). The one Vrbo link is approved in the owner's name; the buyer must reapply. The site as handed over earns nothing until the buyer is approved elsewhere. Amazon also wants 3 qualifying sales in 180 days (per docs), which a no-traffic site may miss.
3. **Handover doc is stale vs reality.** BUYER_HANDOVER.md (dated 2026-11-16) says only 1 sample article and 1 sample stay are in Pages CMS, "the other 15 articles" are code, and "nothing has been tried on live Netlify, Namecheap, GitHub or Pages CMS". The site now has 24 guides; the 24 guides are split: 9 in `content/guides/*.md`, 15 in `src/content/guides/*.ts`. Counts and the claim "no developer needed" are not true today: 15 of the 24 guides are `.ts` files in code (9 are Markdown). A non-technical buyer cannot edit a `.ts` guide. [MEASURED: BUYER_HANDOVER lines 21 and 134; guide counts from the repo]
4. **Maintenance burden is heavy and not obvious.** Dated facts are hard-coded: the dataset date, "38", "22 of 38", named managers inside `dog-types.ts`, guide claims with prices and policies, a privacy page that references the date. Every policy change means re-reading pages by hand. 38 managers x quarterly = 150 page reads a year with no tooling. A buyer should price the labour (rough ESTIMATE: 1-2 days per quarter for 38 rows; 3x that at 100+).
5. **Single point of failure in content production.** Content, fact-checks and audits were produced by one pipeline; no named human author or editor on the site. Google's guidance leans on experience and expertise, which a brand with no byline lacks. [ESTIMATE]
6. **Platform and policy exposure.** Dependent on Netlify free tier (limits flagged in handover), TanStack Start (young framework), and a Lovable-origin codebase; upgrade risk and developer availability. `package.json` is large (Radix, shadcn). A non-technical buyer will need a retained developer for security updates, as the handover itself concedes. [MEASURED for package list; ESTIMATE for burden]
7. **Compliance.** Affiliate disclosure wording and FTC placement need a legal glance; the verbatim-quote evidence column in the dataset should be checked before publishing. No lawyer review recorded.
8. **Data defensibility.** See section 3: today the dataset is a differentiator in positioning, not in moat.
9. **Content quality is audited elsewhere** (AUDIT-a..d); I did not re-score. If those audits show cannibalisation or thin posts among the 24, the buyer inherits cleanup.
10. **Contradictions a buyer will find fast:** `affiliates.yml` approved Vrbo vs "no affiliate approved"; homepage stays copy vs no stays; handover counts vs repo; CSV vs TS counts for "no dog number".

### Handover docs I would still want
Revenue and traffic history (none yet), an account-transfer runbook per service with who pays (exists in draft), a content calendar and keyword plan, the re-verification runbook for the dataset, a list of all hard-coded counts and where they live, a one-page "what breaks if X" for Netlify/Pages CMS, and a clean statement of what is code vs CMS.

---

## Prioritised actions

### Quick wins (days)
1. Fix the breed-silence false green in the checker (section 1). Highest trust risk.
2. Link `will-my-dog-be-accepted` and `packing-list` from the homepage, footer and every guide/dog-type page citing the dataset; show all 4 tools in the homepage block.
3. Put a data proof strip on the homepage and a one-line method statement on the checker page.
4. Remove or hold stay/host copy that has no product behind it (homepage "More than just pet-friendly", "For hosts") until stays are live.
5. Reconcile CSV vs TS counts (11 vs 14) and update every "X of 38" claim; add a test.
6. Update BUYER_HANDOVER.md to the real state (24 guides, what is code vs CMS, the Vrbo approval status).
7. Publish a `/data` page with the CSV download, data dictionary, method and licence line (after the legal glance).
8. Add region filter and a fee column to the checker.

### Medium (weeks)
9. Write 3 data articles first (three-dogs, pet-fee basis, penalty clauses), each with a chart, CSV link and an embedded checker.
10. URL-state, copy and print for the checker; fee benchmark inside the cost tool.
11. Square and vertical share graphics and a Pinterest pin set from the checklist and stats.
12. Reduce homepage JS: do not ship all guide bodies to `/` (the 361 KB `guides` chunk); lazy-load tools. Check mobile touch behaviour of packing pop-overs on a real phone.
13. Add a named editor, bio and "last verified" to guide pages.

### Long term (months)
14. Grow the dataset to 100+ managers, 12+ regions, second-reader checks, quarterly re-verification with change detection, versioned releases.
15. Embeddable widget and outreach to roundup, host-software and destination-board targets in section 4.
16. Move all guides into the CMS-editable folder so the non-technical-owner promise is true; add a generator CSV to TS.
17. Obtain approvals from affiliate programs in the buyer's name at transfer and re-test the booking-button path once stays are live.
