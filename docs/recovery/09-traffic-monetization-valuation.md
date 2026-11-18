# 09. Traffic, monetization, valuation and 90-day roadmap

Prepared 2026-11-18. Read-only investigation. Labels: VERIFIED / SUSPECTED / RECOMMENDATION / NEEDS-USER-ACTION / COULD-NOT-ACCESS. All traffic, revenue and ranking figures are "unknown": the site has no measured traffic or earnings (docs/audit/AUDIT-SUMMARY.md line "the site is new and has no traffic or Search Console data").

## Summary (10 lines)
1. VERIFIED: the domain was bought 2026-11-17 (docs/OPERATIONS-RECORD.md); there is no traffic history, no earnings history, and the only approved affiliate (Vrbo/Expedia) has generic links in content/affiliates.yml, not stay-specific ones.
2. Best free channels by evergreen value: Google organic (via Search Console, already set up per BUYER_HANDOVER) then Pinterest (assets already exist: 25 pins in public/pins, 1000x1500) then ethical data-led backlinks to /data/pet-policies. Bing Webmaster Tools and IndexNow are near-zero-cost add-ons.
3. Facebook groups, Instagram and forums are low-evergreen and high-risk for self-promotion; use only as answer-first participation, never link-dropping.
4. Display ads are not a near-term option: Raptive states 25,000 pageviews/month, Ezoic states 250,000 monthly users for new sites, Mediavine states $5,000 annual ad revenue (main) or 5,000 sessions/month plus a domain at least 4 months old (Journey). AdSense states no traffic figure but wants high-quality original content.
5. Recommended monetization order: fix the Vrbo link quality and compliance, add Amazon/other gear affiliates, then free printable resources with affiliate fit, then (much later) ads. Sponsored articles/placements last because they can damage the credibility that is the asset.
6. Current sale-readiness score: 3.75/10 (Traffic 2, Revenue 2, Content 6, Risk 5). A 9+ needs about 12 months of provable traffic and earnings plus diversification; it cannot be reached by documentation alone.
7. Planning value at $100/month net profit: $600 to $3,000 across all three owner ranges; at $1,000: $6,000 to $30,000 (tables in section C2). Planning estimates only, not evidence of what a buyer would pay.
8. Pre-revenue, the value is asset-based and low: original dataset, 24 guides, tools, clean no-backend stack. No official marketplace page I could read showed a comparable starter-site sale.
9. Buyer must re-apply for Vrbo/Expedia, Stay22 (non-assignable without consent, s.13(i)), Amazon, Awin, and Impact (unless ownership transfer is arranged).
10. 90-day plan: P1 days 1-7 foundations, P2 8-30 commercial, P3 31-60 traffic/authority (no newsletter), P4 61-90 analyze and reassess.

---
# TASK A. Traffic without paid ads

## A1. Channel findings

| # | Finding | Evidence | Label |
|---|---|---|---|
| 1 | Search Console and GA4 are set up. GA4 ID is in settings. sitemap.xml route exists; robots.txt allows Googlebot and Bingbot and lists the sitemap. | content/settings.yml `ga4MeasurementId: G-1J97C8CPC1`; public/robots.txt; src/routes/sitemap[.]xml.ts; BUYER_HANDOVER s.5 ("Google Analytics and Search Console are set up") | VERIFIED (repo); data inside GA4/GSC not checked |
| 2 | Bing Webmaster Tools: no record anywhere in docs that it is set up. Help page fetch returned only a title. | grep of docs; bing.com/webmasters help URL returned no body | NEEDS-USER-ACTION; COULD-NOT-ACCESS (Bing help text) |
| 3 | IndexNow is an open protocol: host a UTF-8 key file `{key}.txt` at site root, then GET `/indexnow?url=...&key=...` or POST JSON (`host`, `key`, `urlList`, up to 10,000 URLs per post). Submitted URLs are shared with all participating engines. The protocol page does not name participants or say whether Google takes part. Bing's page lists Microsoft, Yahoo and Yandex as adopters and does not mention Google. | indexnow.org/documentation, bing.com/indexnow, read 2026-11-18 | VERIFIED (protocol); Google participation NOT STATED |
| 4 | IndexNow on Netlify is feasible without a backend: a static key file in `public/` is served at root, and a submit step can be a one-line `curl` or a GitHub Action run after deploy. The site has no server code, so the submit must be external (GitHub Action or manual). Netlify docs page for build hooks was a 404 so I did not verify Netlify plugin options. | public/ is the static root (netlify.toml `publish = "dist"`); no server code (AGENTS.md "No backend in v1") | RECOMMENDATION; Netlify plugin route COULD-NOT-ACCESS |
| 5 | Pinterest: 25 pin images (1000x1500) and 22 share images (1200x630) exist; script builds them from each guide's own hero photo. A Pinterest share button exists on articles. | public/pins (25 jpg), public/share (22 jpg), scripts/make-share-images.py (header), src/components/site/ArticleActions.tsx:36 | VERIFIED |
| 6 | Pins reuse the guide's own hero photo, so more than one pin per article from the same assets would repeat a photo, which the owner rule forbids. Extra pin variants need non-photo designs (text/data graphics). | scripts/make-share-images.py `cover()`; owner rule in brief | RECOMMENDATION |
| 7 | Pinterest Business account is planned under hello@ (not an affiliate account, so the hello@ rule does not apply). Pinterest guideline says "In general, you should operate only one Pinterest account." | docs/RECORD-TRAIL.md:36, OPERATIONS-RECORD.md:35; policy.pinterest.com/en/commercial-and-branded-content-guidelines | VERIFIED |
| 8 | Share-row/Pin proposal was already made; the Pin button is built. Article metadata for Rich Pins: Pinterest requires og:title, og:description and og:type "article" (or Schema.org Article with author). The site sets og:image and article:modified_time; I did not verify og:type or an author field. The owner chose no author bio, and Pinterest's article rich-pin description mentions an author. | help.pinterest.com/en/business/article/rich-pins; src/lib/seo.ts:35-38; guides.$slug.tsx:39 | SUSPECTED (rich pin eligibility without a named author unverified) |

## A2. Pinterest: what is permitted (official pages read 2026-11-18)
- Affiliate links are allowed; creators should "be transparent about the commercial nature of your content and about your links and their behavior", keep affiliate content original, and use affiliate links in moderation, avoiding affiliate Pins "repetitively or in large volumes" (commercial-and-branded-content-guidelines).
- Spam: "Don't create, save, or distribute content that is repetitive, deceptive, or irrelevant in an attempt to make money"; flooding and coordinated scaled activity are violations (community-guidelines). Do not pay or incentivize saves (same commercial page).
- Claiming the website (Settings > Link to Pinterest > Claim) requires an HTML tag, HTML file or DNS TXT record; it shows insights and your profile on pins from the site; one claimed account per website (help.pinterest.com claim-your-website).
- Merchant guidelines say merchants must not be affiliate marketers; this applies to product feeds, not to a publisher pinning its own articles. Do not upload product catalogs.
- Pins with affiliate links are not eligible for promotion as ads (search summary of Pinterest help; not needed since no paid ads).

Proposed workflow (RECOMMENDATION): (1) create Business account, claim domain via HTML file or DNS TXT (DNS at Namecheap; the handover says never change nameservers, a TXT record is not a nameserver change); (2) boards by user problem, not by article: "Renting with a dog: fees and rules", "Dog travel packing and gear", "Cabin and rental checklists", "Holiday trips with dogs", "Dog safety on the road" (5 boards at start); (3) pin each article once with its existing 1000x1500 pin, destination = the article (never an affiliate link directly; send to your own page, which carries the disclosure); (4) description: plain keyword sentence, no hashtags stuffing; (5) cadence: a small steady number (suggest 3 pins/week, an owner planning figure, not a Pinterest requirement) in batches, oldest unused guide first; the 25 existing pins give about 8 weeks without repeats; (6) after that, new non-photo pin designs (data graphic: "3 of 38 managers charge $0 pet fee" with source and read date) at most one extra variant per article, spaced weeks apart; (7) review Pinterest analytics monthly; keep a log in docs. Time cost about 1-2 hours/week; cost $0.

## A3. Channel ranking (organic only; no purchased traffic/links/followers/engagement)

| Rank | Channel | Evergreen | Effort | Cost | Notes / risk |
|---|---|---|---|---|---|
| 1 | Google organic (Search Console, sitemap, internal links, winnable narrow queries, seasonal pages) | High | Med-high | $0 | Slow on a new domain; all "ranking" outcomes unknown |
| 2 | Pinterest | Med-high (pins keep circulating) | Low-med | $0 | Assets ready; results unknown; policy: no repetitive spam |
| 3 | Ethical data-led backlinks (A4) | High | Med | $0 | Needs pitches that stand on the data; success unknown |
| 4 | Bing + IndexNow | Low-med | Very low | $0 | Faster discovery; share of traffic unknown |
| 5 | Facebook groups/pages | Low-med | Med | $0 | Most dog-travel and rental groups restrict links; join as a member, answer questions, mention a source only where rules allow, never post links in groups that ban them. A Page for the brand is optional and low reach (unknown). Read each group's rules first. |
| 6 | Instagram | Low (posts decay) | Med | $0 | Reuse 1200x630 or pin graphics only if photos match articles; links limited to bio, so it supports brand only |
| 7 | Online communities and forums | Low-med | Med | $0 | Reddit: blocked for our tools (COULD-NOT-ACCESS); the owner can participate personally by helping in dog-travel and vacation-rental threads, disclosing affiliation, following each subreddit's self-promotion rule, linking only when a page answers the question, and never from multiple accounts. |

Seasonal searches (RECOMMENDATION; demand unknown): Christmas week and New Year's Eve pages exist (christmas-week-in-a-cabin-with-a-dog, new-years-eve-with-a-dog); Valentine's/romantic weekend must go live by about Dec 14 (AUDIT-SUMMARY s.6); then spring break, Memorial Day, summer road trips and July 4th fireworks (a natural evergreen-seasonal for a "settle a dog" angle). Refresh and re-date each before its season, and pin 4-6 weeks ahead.

## A4. Ethical backlinks (from AUDIT-opportunities.md / AUDIT-SUMMARY s.4)
- Anchor asset: /data/pet-policies (38 managers, source link per row, downloadable CSV public/pet-policies-38-managers.csv, Dataset JSON-LD in the route). Weaknesses to state honestly in pitches: convenience sample, 11 managers blocked, silence is not "no rule", one snapshot dated 2026-11-18. Reconcile the CSV/TS "no limit" count (11 vs 14) first (AUDIT-SUMMARY s.4).
- Pitches (RECOMMENDATION): (1) journalists and bloggers who write pet-fee stories: a 3-line finding ("3 of 38 charge $0") plus the CSV and method; (2) HARO-style/journalist-request services (e.g., Connectively-type and Qwoted-type; I did not verify any service's current terms; answer only requests where the data fits; never sign up to buy links); (3) host-software blogs listed in the audit (Breezeway, IGMS, Lodgify, AirROI, Hostex: SERP-seen/REPORTED): offer the CSV to help hosts see how managers handle pets; (4) pet-friendly businesses/partners: a listing or resource-page mention only where genuinely relevant, no link swaps at scale; (5) dog-travel roundups and statistics pages that cite data.
- No purchased links, no guest-post farms, no reciprocal schemes. Owner has no author bio, so pitches go from the brand with a contact address; some outlets want a named source, which may reduce pitch success (SUSPECTED).

## A5. Free resources (check existing first)

Existing (VERIFIED, src/routes): `tools.checklist` (printable, Print button, tools.checklist.tsx:32), `tools.packing-list` (builder, PackingBuilder has print code), `tools.pet-cost-check` (cost + host confirmation; `/tools/cost-calculator` 301-redirects to it), `tools.host-questions`, `tools.will-my-dog-be-accepted`; src/content/checklist.ts has one checklist including an emergency-vet line. No newsletter exists (owner decision), so no email-gated downloads.

| Resource | Exists? | Organic | Backlinks | Affiliate fit | Verdict |
|---|---|---|---|---|---|
| Printable packing checklist | Builder exists; a clean print/PDF version unverified | Med | Low-med | High (gear picks) | Add print layout + PDF to existing builder |
| Dog travel cost calculator | Exists as pet-cost-check | Med | Med | Low-med | Retitle/market, no new build |
| Pet-friendly vacation planner | Partly (checker + checklist + host-questions) | Med | Med | Med (stays) | Bundle as a hub page, not a new tool |
| Road trip planner | No | Med but broad, big competitors | Low | Med (gear, hotels not approved) | Defer |
| Senior travel checklist | No (a senior guide exists) | Low-med | Low | Med | Cheap printable variant |
| Emergency prep checklist | Only one line today | Med | Med (vet/rescue sites) | High (first-aid kit guide) | Build; best affiliate fit |
| Multi-dog checklist | Partly (how-many-dogs guide, data) | Low-med | Low | Med | Section/printable of existing guide |
| Cabin packing list | Guide exists (strong, 6.3) | Med | Low | High | Make printable PDF of the guide |

Priority: emergency prep printable, cabin/packing PDF, fee-data graphic. Each printable should carry the site name, a read/updated date and the disclosure if it names products.

---
# TASK B. Monetization

## B1. Display advertising: official eligibility (read 2026-11-18)

| Network | What the official page states | Source | Fit now |
|---|---|---|---|
| Google AdSense | Applicants at least 18; "content must be high-quality, original, and attract an audience"; applicant must access the site's HTML source. No traffic number was visible in the text I got (page was truncated, so a requirement may exist). | support.google.com/adsense/answer/9724 | Possible now on paper; revenue negligible at no traffic (unknown); ads hurt UX and trust framing |
| Mediavine (main) | "Generate a minimum of $5,000 in annual ad revenue"; original audience-first content; clean human brand-safe traffic; good standing with Google AdSense/AdExchange. | mediavine.com/application-requirements | No |
| Journey by Mediavine | "At least 5,000 sessions a month" from US, UK, Canada, Australia, Germany, France or Netherlands; "domain must also be at least 4 months old." (A search summary said 1,000 sessions; the page I read says 5,000: use the page.) | same | Earliest ~2027-03-17 by domain age, and only with 5,000 sessions |
| Raptive | "at least 25,000 pageviews each month" consistently; 100% original content; most traffic from US/CA/UK/AU/NZ; Google Analytics set up. | raptive.com/creators | No |
| Ezoic | "sites are generally required to have 250,000+ monthly active users"; grandfathering only for sites using Ezoic before Feb 19, 2026; smaller sites may apply to its Incubator (page says "highly selective, ~10-20 applicants accepted monthly"). | support.ezoic.com KB "getting started ezoics requirements"; ezoic.com/ezoic-access-now | No |

UX/valuation effect (RECOMMENDATION, reasoning not evidence): ads add layout shift and clutter on a site whose pitch is a trustworthy research publication; low-traffic ad income is small. Buyers value ad income only with provable history, and ad networks require a buyer to re-apply or transfer (terms not read). Defer ads until traffic justifies them, then use Journey/Raptive-tier and keep ad-free tool and data pages.

## B2. Revenue stream evaluation (all revenue "unknown": no evidence in repo)

| Stream | Potential | Startup cost | Traffic needed | Difficulty | Maintenance | Margin | Scalability | Valuation effect |
|---|---|---|---|---|---|---|---|---|
| Accommodation referrals (Vrbo/Expedia approved; Stay22 parked) | Unknown; best intent fit | $0 | Unknown | Med: Vrbo links are generic, not stay-specific (AUDIT-SUMMARY s.5); no verified stays | Low | ~100% | Med | Positive once earnings are provable; accounts do not transfer |
| Gear affiliates (Amazon etc.; Chewy declined) | Unknown | $0 | Unknown | Med: needs approval (Amazon Associates generally expects sales within a window: NOT verified) | Low | ~100% | Med | Positive; diversifies away from Vrbo |
| Printable checklists (free, with affiliate fit) | Indirect | $0-low | Low | Low | Low | High | Med | Positive (engagement, backlinks) |
| Digital planners/premium guides (paid) | Unknown | Low (design time, payment processor) | Needs audience; no newsletter limits conversion | Med; needs payment/tax setup (owner rule: never store tax/bank details in repo) | Med (support, updates) | High | Low-med | Mixed: income is owner-dependent and harder to transfer |
| Pet travel accessories (own products) | Unknown | High (inventory) | High | High | High | Low-med | Low | Negative (turns a content asset into an operations business) |
| Directory listings (/list-your-property exists) | Unknown | $0 | Needs traffic first | Med | Med (verification) | High | Med | Positive if paid listings are clearly labelled and editorial standards hold; conflicts with "verified" claims if undisclosed |
| Direct brand partnerships | Unknown | $0 | Unknown, usually brands want proven audience | Med | Med | High | Low | Neutral; relationship-dependent; transferability unclear |
| Sponsored articles / placements | Unknown | $0 | Unknown | Low | Low | High | Low | Negative risk: credibility and FTC disclosure; editorial-standards page promises independence |

Sequencing (credibility first): (1) compliance fixes and stay-specific Vrbo links; (2) gear affiliates already planned in AFFILIATE-OPPORTUNITIES.md; (3) printables/hub; (4) directory listings only after verified stays; (5) premium guides only if an audience exists; (6) ads at traffic thresholds; (7) sponsored content last, labelled and sparse. Never sell editorial rankings.

---
# TASK C. Valuation and sale readiness

## C1. Scores (evidence from repo/docs)

| Dimension | Score | Evidence |
|---|---|---|
| Traffic quality | 2 | New domain bought 2026-11-17; no traffic data (AUDIT-SUMMARY); organic opportunity avg 4.4/10 across guides |
| Revenue and monetization | 2 | Vrbo approved but links are generic; monetization 4.5/10 avg in audit; Chewy declined; Stay22 empty `stay22AccountId`; no earnings |
| Content quality and authority | 6 | Guides avg 5.6, content quality 6.8, original dataset of 38 managers, sourced claims, fact-check docs; over-hedged prose, no named author (owner choice) |
| Risk and operational stability (10=lowest risk) | 5 | Positive: no backend, tests, buyer handover, accounts excluded. Negatives: Netlify free plan with silent build failures, Lovable config dependency, 15 code-only guides, Pages CMS not verified (BUYER_HANDOVER s.5, s.8), single affiliate, domain age, owner-identity dependence |
| Average | 3.75 | (2+2+6+5)/4 |

To reach 9+ on each (RECOMMENDATION): Traffic: 12 months of Search Console/GA4 history, steady growth, 3+ meaningful sources (no source over ~50%; threshold is my planning rule). Revenue: 12 months of statements from 2+ affiliate programs, none over ~50%, screenshots/recordings ready. Content: guides re-scored 8.5+ per PATH-TO-9.md, dataset refreshed on the 6-month cadence, original assets per guide. Risk: failure alerts, finished Pages CMS migration, tested transfer runbook, accounts documented. Documentation alone cannot lift Traffic and Revenue.

## C2. Planning resale tables (owner's planning multiples; not market evidence)
Formula: value = monthly net profit x multiple. Starter 6-12x; Growing 12-24x; Strong 24-30x.

| Monthly net profit | Starter (6-12x) | Growing (12-24x) | Strong (24-30x) |
|---|---|---|---|
| $100 | 100x6=$600 to 100x12=$1,200 | $1,200 to $2,400 | $2,400 to $3,000 |
| $250 | $1,500 to $3,000 | $3,000 to $6,000 | $6,000 to $7,500 |
| $500 | $3,000 to $6,000 | $6,000 to $12,000 | $12,000 to $15,000 |
| $1,000 | $6,000 to $12,000 | $12,000 to $24,000 | $24,000 to $30,000 |
| $2,500 | $15,000 to $30,000 | $30,000 to $60,000 | $60,000 to $75,000 |
| $5,000 | $30,000 to $60,000 | $60,000 to $120,000 | $120,000 to $150,000 |

Marketplace reference (what I actually read): Empire Flippers' public marketplace page (read 2026-11-18) listed 15 ecommerce/Amazon FBA/SaaS/agency businesses, no content or affiliate sites; it states a minimum of "$24,000 or more in yearly net profit" ($2,000/month), published multiples "Typical 2.2X, Premium 2.4X" of net profit and listings "between 1.7x and 5x or more" of trailing 12-month net profit. The page did not state the period; if annual, 2.2x is about 26x monthly. This implies a site below $2,000/month would not qualify there. Motion Invest's homepage showed asking prices (one example $1,300 for a site named smartdecorfinds.com) without published multiples; I could not read the monthly income or listing detail (login needed). Flippa returned 403 and FE International showed no multiples for content sites (it linked only an ecommerce multiples article): COULD-NOT-ACCESS / not stated. So I have no verified starter-site comparable.

Pre-revenue value (qualitative): asset-based and small. Contributing: domain (new, no history), original dataset, 24 guides, working tools, clean portable stack, documentation. Detracting: no traffic/earnings, non-transferable affiliate accounts, no named author. Treat as the cost of rebuilding the assets, not a multiple.

## C3. Buyer documentation

| Need | Exists | Gap |
|---|---|---|
| Architecture, hosting, content management | BUYER_HANDOVER.md s.1-4, s.9; HANDOVER.md; docs/MIGRATION-PLAN.md | BUYER_HANDOVER stale (says 15 articles; audit notes it); Pages CMS untested |
| Domain/DNS/transfer | docs/DNS-AND-TRANSFER.md; BUYER_HANDOVER s.7 | Private Email fees/downtime not confirmed |
| Affiliate relationships | docs/AFFILIATE-AND-SELLING.md, AFFILIATE-PROGRAMS.md | Per-program re-application checklist, current status table |
| Expenses | docs/OPERATIONS-RECORD.md (domain+email order $24.16; renewal not confirmed) | Monthly P&L sheet |
| Revenue tracking | None (no earnings) | Monthly statement archive, screen recordings (suggested in AFFILIATE-AND-SELLING) |
| SOPs | WRITING-IN-MARKDOWN.md, DATA-RECHECK-LOG.md, LAUNCH-CHECKLIST.md | Pinterest/backlink SOP, publishing QA SOP |
| Automation | scripts/ (make-share-images, make-policy-csv, verify-site) | Automation index; failure alerts |
| Transfer procedure | DNS-AND-TRANSFER.md | Tested runbook |

Forced re-application: Vrbo/Expedia (termination on 30 days' notice; confidential commission info; links must be removed, AFFILIATE-AND-SELLING); Stay22 (agreement not assignable without written consent, s.13(i), licence non-transferable; section numbers from a summarizing fetch, re-read before relying); Amazon (Operating Agreement s.12 per repo); Impact (ownership transfer only if account sold with site; brand contracts do not move); Awin (not confirmed). Google Analytics/Search Console are owner-added users, transferable by access grant (RECOMMENDATION).

Reduce dependence: second and third affiliate program; a second traffic source (Pinterest, Bing) tracked separately; keep affiliate ids in content/affiliates.yml; brand-level identity ("editorial standards" page) with a documented editorial process so the buyer does not need the owner personally; written transition offer (30 days).

---
# TASK D. 90-day roadmap (start 2026-11-23)

| Phase | Task | Priority | Impact | Effort | Ongoing cost | Depends on |
|---|---|---|---|---|---|---|
| P1 (1-7) | Apply compliance fixes: remove "Vrbo" from meta tags, drop noreferrer on Expedia links, relabel stay button (AUDIT-SUMMARY s.5) | High | Protects only active affiliate | S | $0 | Developer/Lovable |
| P1 | Fix defects (LA typo, large-dogs title, BUYER_HANDOVER) | Med | Credibility | S | $0 | none |
| P1 | Bing Webmaster Tools (import from GSC) + sitemap | High | New source | S | $0 | Owner login |
| P1 | IndexNow key file + post-deploy submit | Med | Faster Bing/others | S | $0 | Deploy |
| P1 | Netlify failure alerts (free GitHub status) | Med | Stability | S | $0 | none |
| P1 | Verify GA4/GSC data flowing; set tool-event custom dimensions (TOOL-TRACKING.md) | High | Measurement | S | $0 | Owner |
| P2 (8-30) | Travel essentials hub (packing, emergency, gear) | High | Affiliate surface | M | $0 | P1 |
| P2 | Improve product articles; buying guides; internal links to 4 tools, homepage 38-manager claim | High | Conversion, SEO | M | $0 | affiliate approvals |
| P2 | Apply to alternative gear/travel affiliates (not hello@); keep Chewy for re-application | High | Diversification | S | $0 | separate email |
| P2 | Stay-specific Vrbo links via Expedia hub | High | Revenue path | M | $0 | Hub access |
| P2 | Publish flagship data pieces (no-pet-fee, true cost, reactive dog, Christmas) | High | Backlink/traffic | M | $0 | dataset count reconciliation |
| P3 (31-60) | Pinterest: account, claim domain, 5 boards, 3 pins/week | High | Evergreen traffic | M | $0 | Account |
| P3 | Printables: emergency prep, packing PDF | Med | Backlinks/affiliate fit | M | $0 | P2 hub |
| P3 | Data-led outreach: 10 targeted pitches over the period (planning number) | Med | Backlinks | M | $0 | CSV reconciled |
| P3 | Topical authority: weekly article per AUDIT sequence | High | Organic | M-L | $0 | none |
| P4 (61-90) | Analyze traffic and conversions; trim low performers | High | Decisions | S | $0 | 60 days data |
| P4 | Improve conversions; cut costs; automate recurring tasks (data recheck, pins) | Med | Margin | M | $0 | P3 |
| P4 | Reapply to Chewy when ready; reassess valuation (C1, C2) | Med | Optionality | S | $0 | Impact status |

No newsletter in any phase unless the owner reverses.

---
## Prioritized recommendations
1. Compliance fixes then stay-specific Vrbo links. Impact high; effort S-M; cost $0; depends on developer.
2. Bing Webmaster Tools + IndexNow. Impact low-med; effort S; $0; owner login.
3. Pinterest workflow above. Impact med-high long term; effort 1-2 h/week; $0.
4. Data page backlink outreach. Impact high if the data holds; effort M; $0; fix count mismatch first.
5. Printables with affiliate fit. Impact med; effort M; $0.
6. Delay ads; revisit at Raptive's stated 25,000 pageviews or Journey's 5,000 sessions plus domain age.

## Needs your personal action
1. Bing Webmaster Tools sign-in and verification.
2. Pinterest Business account, domain claim (DNS TXT/HTML), and board creation.
3. Affiliate applications under a non-hello@ email.
4. Decide on printables behind no email gate; decide on sponsorship policy.
5. Real Reddit/Facebook/forum participation if wanted (read each rule).
6. Confirm GA4/GSC data and give exports for P4.

## Could not verify
- Mediavine/Ezoic/Raptive/AdSense pages: Mediavine's /apply redirect 404'd; read /application-requirements instead. AdSense page was truncated (traffic requirement unknown).
- Flippa (403), FE International multiples (403/404), Motion Invest detail (login), Netlify build docs (404), Bing help (empty).
- Pinterest help on affiliate links (404): relied on the commercial guidelines page and a search summary.
- Any traffic, revenue, ranking, or sale-price figure for this site: unknown.
