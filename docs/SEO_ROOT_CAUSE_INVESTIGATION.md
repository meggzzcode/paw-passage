# SEO root-cause investigation, 2026-11-24

Question: why does the live site have no meaningful organic traffic, and what is the evidence-based fix? Scope: repository at `a659f05` plus uncommitted worker edits (build served locally), the live site https://www.pawsandpassage.com fetched 2026-11-24 about 22:40 UTC, and public web searches. No Search Console, GA4, Netlify or rank-tracking access. No keyword-volume, difficulty or backlink tool was used, so **no volume, difficulty, ranking or backlink number appears in this document**. Conclusions that depend on unavailable data are marked PROVISIONAL.

## 1. Executive findings

**Decision: INSUFFICIENT SEARCH CONSOLE DATA FOR A FINAL DIAGNOSIS, with no technical SEO blocker found in the built site.** The honest diagnosis is mostly time, deployment and authority, not a bug.

| # | Why visibility is limited | Confidence |
|---|---|---|
| 1 | **The domain is 8 days old** (registrar start 2026-11-16, docs/flip/cowork-stage0-results-2026-11-23.md). A brand-new .com with no inbound links normally takes weeks to be crawled, indexed and trusted, so 236 impressions, 0 clicks and average position about 15 to 16.5 are what a new site at the start looks like. | High that age is a major factor; PROVISIONAL on size (no GSC time series) |
| 2 | **Production is a stale build.** Live serves the build from about 2026-11-23 22:44 (`ced2c93`); `HEAD` is 214 commits later. Live has 98 sitemap URLs (HEAD 103), old titles/H1s on every guide compared, the retired weight-limit URL still returns 200, the town things-to-do pages 404, guides still carry "Check the current price" lines (3 to 8 per guide) and the live versions of the six rewritten guides are 6 to 120 percent longer in page words. Netlify builds were stopped on purpose to save credits (docs/IMMEDIATE_FLIP_EXIT_PLAN.md: "owner turns Netlify builds on and deploys ONCE"). **Deploying the final build is the top P0**, and any keyword advice here applies to the undeployed version. | Confirmed (fetched live and compared) |
| 3 | **No authority.** Nothing in the repo shows a single external link, mention or Pinterest pin: the 29 pins exist as image files and a CSV, but the Pinterest account claim is NEEDS-YOU (docs/PINTEREST-SETUP.md). GA4 for 2026-11-17 to 11-23 showed 463 sessions, 450 Direct, 0 Organic. Backlinks are PROVISIONAL (GSC Links report not read). | High that the site has no distribution yet; backlink count unverified |
| 4 | **The core topics face strong incumbents.** Searches for the fee, no-fee, large-dog and how-many-dogs questions return platform pages (Vacasa, Airbnb Help, Hostaway, Hospitable, Lodgify), host forums and big publishers. The site's real differentiator, the dated 38-manager dataset, is not yet linked from outside and is only moderately linked inside (9 body links). | Medium (SERP summaries, no volumes) |
| 5 | **Stale indexed pages.** Whatever Google has indexed is the old build, so impressions to date cannot test the new titles or rewritten pages. | High |

**What is not wrong** (checked on the HEAD build, 103 sitemap URLs, section 3): every sitemap URL returns 200, is indexable, is self-canonical on the correct www host, has exactly one H1, a title of at most 60 characters, a 120 to 160 character description, parseable JSON-LD, and appears in the server-rendered HTML without JavaScript. No noindex page is in the sitemap. robots.txt allows crawling. www/non-www/http redirect cleanly on production.

Fixed in this run (all tested, not deployed): two orphaned sitemap URLs (Mendocino and Monterey things-to-do, previously linked only from `noindex, nofollow` town pages), one internal link that went through a 301, five natural dataset and cluster links, and one description with a doubled colon. See docs/SEO_IMPLEMENTATION_RESULTS.md.

## 2. Production versus HEAD (live fetch 2026-11-24)

Method: `curl` of 19 live URLs plus robots.txt and sitemap.xml, compared with the same URLs from `NITRO_PRESET=node-server vite build` of the working tree served on port 4320. The local build includes other workers' uncommitted edits; none touch SEO head data.

| Item | Production | HEAD build | Verdict |
|---|---|---|---|
| Sitemap URLs | 98, `lastmod` 2026-11-19 on 30 | 103, guide `lastmod` 2026-11-24 | Stale |
| Retired `/guides/vacation-rentals-with-no-dog-weight-limit` | 200, full old guide, title "Rentals With No Dog Weight Limit: 2 of 38" | 301 to the large-dogs guide | Stale |
| `/destinations/georgia/blue-ridge/things-to-do` | 404 | 200, Article JSON-LD | Stale |
| `/guides/` (trailing slash) | 307 | 301 | Stale |
| "Check the current price" occurrences | 3 to 8 per guide (e.g. packing list 8) | 0 | Stale |
| Fees guide | title "Rental Pet Fees: 25 of 38 State a Fee", H1 "How Pet Fees Actually Work at Vacation Rentals", 6,923 page words, "25 state a fee" | title "Vacation Rental Pet Fees: Per Night or Per Stay?", H1 "How Vacation Rental Pet Fees Work: Per Night, Per Dog or Per Stay", 5,026 words, "22 state a charge" | Stale; the live number (25) disagrees with the dataset page logic now used (22) |
| Large-dog guide | title "Large Dog Rental: 5 Checks Before You Book" | "Large Dog Friendly Vacation Rentals and No Weight Limit" (absorbs the retired URL) | Stale |
| Packing guide | 8,397 words, "Ticks, Bears, Cold" title | 3,800 words, tickable checklist, links to the planner | Stale |
| `/data/pet-policies` | title "What 38 rental managers say about dogs", no BreadcrumbList | "Dog Policies at 38 Rental Managers: Fees and Limits", BreadcrumbList, absolute Dataset URLs | Stale |
| `/gear`, `/gear/car-safety` | H1 "Travel essentials for dogs", title "Car safety Gear for Dogs" | Gear redesign, new titles | Stale |
| `/tools/packing-list` | old tool, 605 words | new planner | Stale |
| Home | same title and H1, older description | description names the 38-manager dataset | Minor |
| `/stays`, Blue Ridge | same titles, older descriptions | longer pages (more links) | Minor |
| robots.txt | allows Googlebot, Bingbot, `*`; lists https://www.pawsandpassage.com/sitemap.xml | identical | Same |
| Host behaviour | `http://pawsandpassage.com` 301 to `https://pawsandpassage.com` 301 to `https://www.…`; `http://www` 301 to https | not applicable locally | OK, one extra hop on the apex |
| Draft `/guides/bringing-a-dog-to-a-no-pets-rental`, unknown paths | 404 | 404 | Same (update 2026-11-25: the guide was republished at the same URL in `6f9add3` and now returns 200 in the build; the drafts that still return 404 are `breed-restrictions-at-vacation-rentals` and `pet-friendly-listing-red-flags`) |

Consequence: Google's index and any impressions reflect the live (older) pages. The 236-impression baseline, any CTR conclusion and any "this guide is not ranking" conclusion are about the old titles and text. Deploying changes titles and H1s on all 8 guides compared and redirects one indexed URL, so expect a re-crawl period after deploy. **Do not read rankings as a verdict on the new build until 2 to 4 weeks after it is deployed.**

**netlify.toml.** At the start commit (`a659f05`) the build `ignore` command ended `':(exclude)*.md'`. Without the `glob` pathspec magic, git's `*` crosses directory separators, so it also excluded `content/guides/*.md`, `content/**/*.md` and `src/**/*.md`: a push changing only a published guide, or a Pages CMS save, would be skipped and never deployed. **The problem existed at `a659f05`.** Worker W2 fixed it in `75f7ff1` (`':(exclude,glob)*.md'`, repo-root Markdown only, an empty `CACHED_COMMIT_REF` now runs the build, plus `scripts/test-netlify-ignore.mjs`); I only read it and did not duplicate the fix. It is not the cause of the current staleness (builds were stopped, section 1), but it would have silently hidden content-only edits once builds resume, so the fix must be part of the deploy.

## 3. Technical crawl of the HEAD build

Crawled every URL in the built sitemap (103), then fetched every internal link target (161). Script: `crawl.py`/`graph2.py` in the session scratchpad (not committed; results below).

| Check | Result |
|---|---|
| Sitemap URLs: status 200, canonical = itself, absolute, host `https://www.pawsandpassage.com`, no `noindex`, no `X-Robots-Tag` | 103 of 103 pass |
| One H1, title at most 60, description 120 to 160 | 103 of 103 pass |
| JSON-LD parses | 103 of 103 (types: Organization everywhere; Article + BreadcrumbList on guides and things-to-do; Dataset + BreadcrumbList on the data page; TouristDestination on towns) |
| Duplicate sitemap URLs / drafts in sitemap | 0 / 0 (draft guide URL 404) |
| Noindex pages in sitemap | 0. 55 linked stay pages are `noindex, nofollow`, none in the sitemap (consistent) |
| Retired URL | 301 to the large-dog guide locally and in `netlify.toml`; other retired guides 301 in `netlify.toml` (tested by `src/test/retired-guide-redirects.test.ts`); trailing slashes 301; retired tool URLs 301 to `/tools` |
| SSR | H1, body text and links are in the raw HTML (curl, no JS). One inline hydration payload per page; no duplicated visible content. The print-only `<dl>` FAQ copy is hidden on screen (documented). |
| Article JSON-LD vs page | headline = H1, author "Paws & Passage Editors" (visible), image absolute, `dateModified` = sitemap `lastmod` = visible "Last reviewed" on all 29 guides. No ratings, offers or reviews in any JSON-LD. Dataset JSON-LD describes the table and CSV actually on the page. |
| `lastmod` honesty | All 29 guides show 2026-11-24, which matches the editorial release (every guide was edited that day: `git log` shows the Pass G commits). This is true, but a uniform date on every URL gives Google no signal about which pages changed; it will be ignored until dates diverge. Do not bump it without a real edit. Static pages and stays have none (stay `lastmod` only when verified). |
| Click depth from home | max 2 after the fix (before: 6 pages at depth 3, 2 unreachable) |
| Orphans | before: 2 (`/destinations/california/mendocino/things-to-do`, `.../monterey/things-to-do`); after: 0 |
| Internal link to a redirecting URL | before: 1 (`/gear/winter-travel` in the cold-weather guide); after: 0 |
| Broken internal links | 0 |
| Links to removed tools | 0 |
| Thin indexable pages | none among content pages; `/dogs` (275 words), `/tools/*` and legal pages are short by design. Not changed. |

**Stays (55 listed-but-noindex, 5 hidden): deliberate, not a defect.** 83 stay files; 5 are not listed because they lack an approved affiliate link (`STAYS_REQUIRE_AFFILIATE_LINK`, owner decision 2026-11-18); 78 are listed; 23 pass `stayIndexability` and are in the sitemap; 55 are `noindex, nofollow` and absent from the sitemap. Reasons from running the rule over the 78: 46 have only 3 or 4 of the 6 content sections filled (need 5), 24 have a description that duplicates another stay (4-word-shingle similarity of 0.6 or more), 17 state no weight limit, fee or fence information, 9 state no dog limit. This is the quality gate working as written ("do not loosen to inflate indexed counts"). One observation, not changed: `nofollow` on those pages stops link signals flowing to the rest of the site; `noindex, follow` would allow it. Low value, and the rule is documented in AGENTS.md, so left for the owner.

**Mendocino and Monterey town pages** are `noindex, nofollow` (no listed stays; text under the town-page threshold) while their things-to-do articles (about 2,000 words each, Article JSON-LD) are indexable and in the sitemap. That mismatch is intentional-looking but left those two articles with zero crawlable inbound links. Fixed by a state-page section (section 7).

**Stays titles** use a word-boundary ellipsis for long names ("5-Star Cabin with Views and…, Blue Ridge GA"). Tested and documented (`src/lib/stay-meta.ts`); it is a snippet-quality weakness on 23 low-priority pages; not changed.

### Performance (lab only, not field data)
PageSpeed Insights API: reachable through the proxy but returned HTTP 429 (shared keyless daily quota exhausted), so **no PSI or CrUX field data was obtained**. Lighthouse 12 mobile preset (simulated slow 4G, 4x CPU) against the local node build, uncompressed, run once each:

| URL | Perf | FCP | LCP | TBT | CLS |
|---|---|---|---|---|---|
| / | 75 | 3.6 s | 3.6 s | 310 ms | 0.035 |
| /guides | 57 | 3.1 s | 9.3 s | 410 ms | 0 |
| /guides/how-vacation-rental-pet-fees-work | 81 | 2.9 s | 2.9 s | 370 ms | 0.008 |
| /data/pet-policies | 77 | 3.1 s | 3.1 s | 420 ms | 0.045 |
| /gear | 82 | 2.9 s | 2.9 s | 340 ms | 0.005 |
| /gear/car-safety | 82 | 2.8 s | 2.8 s | 360 ms | 0.005 |
| /tools/packing-list | 80 | 3.2 s | 3.2 s | 290 ms | 0.009 |
| /stays | 62 | 4.2 s | 4.2 s | 460 ms | 0.088 |

Interpretation: lab figures under Lighthouse's pessimistic throttling, from an uncompressed local server (Netlify compresses). The `/guides` LCP of 9.3 s could not be attributed (the LCP-element audit errored); a separate Playwright run with the repo's own `scripts/perf/lcp.cjs` (fast 4G, 4x CPU) measured LCP 0.8 s on `/guides` and 0.9 s on the fees guide, so I treat the 9.3 s as a lab outlier, not a serious mobile problem, and made no performance change. `/stays` (CLS 0.088, 4.2 s) is the weakest and is 162 KB of HTML with 78 cards; it is not a landing page for the researched queries. Field data and Core Web Vitals: PROVISIONAL (Cowork brief section B).

## 4. Search Console findings: not accessible, PROVISIONAL
Known history only, from owner/Cowork notes: sitemap read OK (98 URLs); 21 of 23 inspected URLs indexed (owner, earlier); 236 impressions / 0 clicks / position about 16.5 over 28 days (owner, earlier); 163 impressions / 0 clicks / position 15.2 over 2026-11-16 to 11-21 (Cowork, 2026-11-23); a Page indexing report that showed "0 indexed, 2 not indexed" the same day (conflicts with the 21 of 23 reading: it was probably a not-yet-populated report, UNVERIFIED); `/stays` "crawled, currently not indexed" and a Blue Ridge noindex status "stale/unsure". None can be refreshed from here. docs/cowork/SEO_SEARCH_CONSOLE_INVESTIGATION.md is the standalone brief to collect the real numbers. Until it returns, every ranking, CTR and indexing statement is PROVISIONAL.

## 5. Content and intent for the priority URLs
Evidence: the built HTML of each page, plus public SERP summaries (section 6). Cannibalization is judged from page purpose and H2s, not from GSC query data (not available).

| URL | Real question | In title/H1? | Answer position | Unique value vs what ranks | Cannibalization risk |
|---|---|---|---|---|---|
| fees guide | "Is a vacation rental pet fee per night or per stay?" | Title yes, H1 yes | First paragraph defines the formula; H2 "The short answer" and "What 38 managers actually charge" | Counts and exact units from 38 manager pages; competitors (Hostaway, Hospitable, Uplisting) give ranges from host blogs | Low with no-pet-fee guide (different question); shares the dataset with four siblings |
| no-pet-fee | "Vacation rentals with no pet fee" | Yes ("3 of 38") | First paragraph names the three managers | Names the three; but SERP intent is largely inventory (Vacasa, Airbnb listings tagged "No Pet Fee"), which this page does not offer | Low; overlap with fees guide on "fee-free" wording only |
| large dogs | "Vacation rentals large dogs no weight limit" | Yes | First paragraph gives 6 caps, 2 none | Real wording of limits; absorbs the retired URL, so one page owns both phrasings | Resolved by the merge (do not recreate the retired page) |
| two large dogs | "Traveling with two large dogs in a car" | Yes | Measure-first answer in paragraph 1 | Layout decision tree; SERP is dominated by Consumer Reports, NBC Select and brand pages (publisher authority) | Moderate with the harness guide: the harness guide is "how to verify crash testing", this is "layout for two dogs"; keep both, cross-linked |
| multiple dogs | "How many dogs allowed at an Airbnb/rental" | Yes | Paragraph 1: "Two is the usual cap" | Dataset-based limits and the ask-for-a-third script; SERP is Airbnb Help, Hepper, Apartment Therapy | Low |
| fenced yard | "How to check a vacation rental's fenced yard" | Yes | Opening gives the method (weakest fence section) | Verification method; SERP is listing inventory and yard-rental sites | Low with the portable-fence guide |
| cabin packing | "Dog-friendly cabin packing list" | Yes | Tickable list at top, links to planner | Planner plus checklist; SERP is brand blogs (Chewy, Eagle Creek, Unyoked) | Low; planner page is the tool, guide is the reading |
| harness / road-trip gear | "Crash-tested dog harness: how to verify" | Yes | Paragraph 1 states the claim is unregulated | CPS-directory method and a retired product; SERP is CPS, Kurgo, Dogster, Cars.com (strong incumbents) | Moderate with two-large-dogs (above) |
| dataset page | "Vacation rental pet policy data / how many managers charge" | Title yes; H1 yes | Opening says what it is, read date 2026-11-18, convenience sample | The only original source found in the SERP checks (searches returned vendor blogs and a 2019 study, no recent independent dataset); method and limits are stated in a dedicated section | None; it is the hub |
| booking checklist | "Pet friendly vacation rental checklist" | Yes | List up front | Competitors are Booking.com, AARP, AFAR | Low |
| /stays | "Dog friendly rentals" | Yes | n/a (directory) | 23 indexable of 78 listed; compares dog limit, fee, yard | Competes with Vacasa/BringFido inventory; low realism |
| town things-to-do (Blue Ridge) | "Dog friendly things to do in Blue Ridge GA" | Yes | Opening names rule per place | SERP: BringFido, Explore Georgia, local rental companies; each item here cites the page it came from | Low |

Dataset linking: the data page links the five dataset guides and the will-my-dog tool; the five link back (verified in the crawl: 9 body inbound links, 7 from guides). I added two natural body links from guides that already cite "38 managers" or "our dataset" and did not link it (puppy, leave-alone). I did not add boilerplate. Not done: dataset links to destination pages, because no town page uses dataset figures.

## 6. Live SERP research (WebSearch, standard mode; no volume tool; no Google bot-wall bypass)
WebSearch returns a summary of results, not an ordered Google SERP, so "what ranks" below is the set of domains returned, not positions. 14 queries. No search-volume, difficulty or ranking number is claimed anywhere.

| Query | Intent | Result types | What top pages do | P&P offer | Class |
|---|---|---|---|---|---|
| vacation rental pet fees per night or per stay | Informational/pricing | Vendor blogs (Uplisting, Hostaway, Lodgify, Hospitable), Airbnb community threads | Give ranges per stay/night/pet from host viewpoint | Guest-side units from 38 pages | Strong fit, competitive |
| vacation rentals no pet fee dogs | Transactional/inventory | Almost all Vacasa dog-friendly pages; listings tagged "No Pet Fee" | Show inventory | Names three managers; no inventory | Weak fit for the query as typed; the page answers a sibling question |
| vacation rentals large dogs no weight limit | Mixed | Vacasa dog-friendly pages, platform filters | Inventory | Wording of limits, ask script | Strong fit, competitive |
| how many dogs allowed at an Airbnb | Informational | Airbnb help and host pages, Hepper, Apartment Therapy, AFAR | General answer "host sets it, 1 to 5" | Dataset limits, third-dog script | Strong fit, realistic once indexed |
| traveling with two large dogs in a car crates harness | Informational/shopping | NBC Select, Consumer Reports, Outside, Cars.com, Thule | Product roundups from large publishers | Layout/measure method | Strong fit, competitive |
| dog friendly cabin packing list | Informational | Chewy, Eagle Creek, Unyoked, resort blogs, Allianz | Generic lists | Tickable planner | Strong fit, competitive |
| crash tested dog car harness how to verify | Informational | Center for Pet Safety, Kurgo, Ruffwear, Dogster, Cars.com | Brand/test-body pages | Verification checklist | Strong fit, competitive (primary sources dominate) |
| fenced yard vacation rental dogs how to check secure | Informational | Rover, AvantStay, Cottage Vacations, inventory | Tips lists, listings | Verify-the-fence method | Strong fit, realistic |
| dog friendly things to do in Blue Ridge GA | Local | BringFido, Explore Georgia, local rental companies, Sniffspot | Directories | Cited per-item rules | Strong fit, competitive (directories) |
| pet friendly vacation rental checklist questions to ask host | Informational | Booking.com, AARP, AFAR, Hospitable | General checklists | Dataset-backed questions | Strong fit, competitive |
| Airbnb pet damage charge after checkout dog | Informational | Airbnb Community, Airbnb help pages | Official process | Timeline and scripts | Strong fit; primary source dominates |
| vacation rental pet policy study average pet fee data | Research | Vendor blogs (Vacasa, Hostaway), Skift, VRMA Arrival, Short Term Rentalz, 2nd Address 2019 | Vendor claims, 2019 and 2021 reports | A dated, sourced, downloadable dataset of 38 pages | **Strong fit, realistic** (link-earning angle) |
| dog friendly cabins Georgia fenced yard | Transactional | Explore Georgia, Vrbo/Airbnb/Expedia listings | Inventory | 23 indexable stays | Not worth pursuing before deploy |
| dog hot tub pool vacation rental allowed | Mixed | Listing pages | Inventory | Guide on dogs and pools from 7 manager pages | Weak fit as phrased |

Realism for a new domain: queries where primary sources or large publishers answer (CPS, Airbnb Help, Consumer Reports) are poor first targets. The realistic early opportunity is the research angle (dataset), plus long-tail question pages that platforms do not answer in guest terms (third dog, two-dog fee wording, fence verification). This is a judgement from result types, not from volumes.

## 7. Root-cause table

Classes: CB confirmed blocker; CW confirmed weakness; PL probable growth limitation; AW awaiting recrawl or data; NI non-issue; UV unverified.

| # | Finding | URL | Evidence | Root cause | Why it matters | Fix | Direction | Conf. | Effort | Risk | Pri | Class | Done |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Production serves a build 214 commits old | all | Live vs build table, section 2 | Netlify builds stopped to save credits, deploy planned once | Google sees old titles/H1s/redirects; new work cannot earn | Owner turns builds on, deploys the final `main` once, then re-run this crawl against live | Up (enables everything) | High | 15 min plus Cowork verification | Low; 15 credits | P0 | CB (for the new build) | No (owner action) |
| 2 | Build `ignore` excluded all Markdown at any depth | netlify.toml | `':(exclude)*.md'` at `a659f05` | Missing `glob` magic | Content-only pushes would never deploy after builds resume | W2 fix `75f7ff1` plus `scripts/test-netlify-ignore.mjs` | Prevents silent staleness | High | Done by W2 | Low | P0 | CW | W2 (committed) |
| 3 | New domain, little crawl history | whole site | Registrar start 2026-11-16 | Age | Slow indexing and trust | Time plus distribution | Up over weeks | High | n/a | none | P1 | PL | n/a |
| 4 | No inbound links or distribution | whole site | Pins not published; GA4 all Direct | No outreach yet | Biggest limiter of rankings after age | Outreach plan section 9; Pinterest per docs | Up | Medium (links PROVISIONAL, GSC Links not read) | Owner/Cowork | Low | P1 | PL | Plan only |
| 5 | Two sitemap URLs were orphans | `/destinations/california/{mendocino,monterey}/things-to-do` | Link graph; only inlink was a `noindex, nofollow` page | Town pages are noindex/nofollow | Google could not discover or weigh them | State page lists every public things-to-do article | Up (discovery) | High | 15 min | Low | P1 | CW | Yes |
| 6 | Internal link through a 301 | `/guides/cold-weather…` → `/gear/winter-travel` | Crawl | Legacy slug in body text | Extra hop, signal loss | Link `/gear/cold-weather`; test blocks legacy slugs | Neutral/slight up | High | 2 min | None | P1 | CW | Yes |
| 7 | Dataset under-linked in body | `/data/pet-policies` | 9 body inlinks | Guides cite "38 managers" without linking | Differentiator is under-signalled | Natural links in puppy and leave-alone guides | Slight up | Medium | 10 min | None | P1 | CW | Yes |
| 8 | Fees description had a doubled colon | fees guide | Metadata | Edit slip | Snippet readability | Semicolon | Slight up CTR (PROVISIONAL) | High | 1 min | None | P2 | CW | Yes |
| 9 | Car-interior guide had one guide inlink | `/guides/protect-your-car-interior…` | 4 body inlinks, 1 from a guide | Cluster gap | Weak internal support | Links from ramp and harness guides | Slight up | Medium | 5 min | None | P2 | CW | Yes |
| 10 | Page-level crawl/indexability across the sitemap | 103 URLs | Section 3 | n/a | n/a | None | n/a | High | n/a | n/a | n/a | NI | n/a |
| 11 | 55 stay pages noindex | `/stays/*` | Rule run | Quality gate | Fewer indexed pages | Keep | n/a | High | n/a | Loosening harms trust | n/a | NI | n/a |
| 12 | Uniform `lastmod` 2026-11-24 on 29 guides | sitemap | Sitemap | One real edit day | Weak freshness signal | Keep honest; never fake | None | High | n/a | Faking would be harmful | n/a | NI | n/a |
| 13 | Impressions at average position 15 to 16.5, 0 clicks | whole site | Owner/Cowork numbers | Page two plus tiny sample on a new site | CTR near zero | Wait for data; do not diagnose CTR from this sample | Unknown | Low | n/a | n/a | n/a | AW | No |
| 14 | `/stays` "crawled not indexed", Blue Ridge noindex status | two URLs | Owner notes, stale | Unverified | Possibly Google's older view | Cowork URL Inspection | Unknown | Low | 5 min | none | P2 | AW | No |
| 15 | Mobile lab LCP 9.3 s on `/guides` | `/guides` | Lighthouse vs Playwright | Unattributed; Playwright shows 0.8 s | Probably lab artifact | Re-check on live after deploy (PSI) | n/a | Low | n/a | n/a | P2 | UV | No |
| 16 | Stays titles with ellipsis | 23 stay pages | Built titles | Truncation rule | CTR for stay queries | Out of scope | n/a | Medium | n/a | n/a | P3 | CW | No |
| 17 | Backlinks, rankings, volumes | n/a | no data source | No tool | n/a | Cowork GSC Links report | n/a | n/a | n/a | n/a | n/a | UV | No |

## 8. Prioritized actions
- **P0 (owner, outside code):** confirm the Netlify `ignore` fix (W2, `75f7ff1`) is in the deployed branch, turn builds on, deploy the final `main` once, then Cowork re-runs FINAL_QA/this crawl against live and the Search Console brief. Only then consider indexing requests (owner-approved, one per URL).
- **P1 (done):** orphan and redirect-link fixes, dataset and cluster links, doubled-colon description. **P1 (not code):** distribution (section 9), Cowork GSC brief, GA4 Organic check.
- **P2:** after the Search Console return, check page-two queries; evaluate `noindex, follow` for thin stays; lengthen category and town descriptions if still short on live.
- **No P3 work done.**

## 9. Authority and discovery (backlinks PROVISIONAL)
There is no backlink data. Targets below are real sites that surfaced in the SERP checks; nothing has been contacted. Draft angle for each, to be sent only by the owner:

1. **Short Term Rentalz / VRMA Arrival / Skift (STR industry press).** They publish pet-policy trend pieces citing vendor data. Angle: "A dated, sourced read of 38 managers' own pet pages: 22 charge, 3 charge $0, six cap weight; every row linked; CSV attached."
2. **Hostaway, Hospitable, Uplisting (STR software blogs).** Their pet-fee guides cite vendor ranges. Angle: offer the dataset as a guest-side counterpart with the method and its limits.
3. **BringFido and Explore Georgia travel editors.** They run pet-friendly lodging and Blue Ridge/Ellijay pages. Angle: dated things-to-do pages with the per-place dog rule and source.
4. **Dog-travel writers and pet newsletters** (find via who cites BringFido and Rover guides). Angle: "Third dog? We counted what 38 managers actually say."
5. **Dog-owner communities (Reddit travel and dog subreddits, Facebook groups).** Share the third-dog and fenced-yard checks only where rules allow self-posts; never post affiliate pages.
6. **Whole Dog Journal / Center for Pet Safety readers.** Angle for the harness guide: the verification checklist uses CPS's directory; a courtesy note, no ask for a link.
7. **Pinterest.** `public/pins` holds 29 pins and `docs/pinterest-pins.csv` has the board, UTM-tagged links and descriptions; the account claim and publishing are NEEDS-YOU, so none are live. Treat Pinterest as a separate distribution channel, not organic search: publish a few pins per week once the final build is deployed so the destination pages match the pin text.

No purchases, no directories sold as link packages, no spam.

## 10. Limitations
No Search Console, GA4, Netlify, Ahrefs or volume tool; WebSearch returns summaries, not rank order; Lighthouse is lab, single run, local, uncompressed; PSI returned 429; the local build includes other workers' uncommitted edits; the crawl covers the built sitemap and its internal link targets, not external links; "stale production" reflects a fetch at one moment (the owner may deploy at any time).
