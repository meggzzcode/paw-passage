# 03. Affiliate-manager review and credibility/trust audit (2026-11-18)

Scope: live https://www.pawsandpassage.com (WebFetch, 2026-11-18: /, /guides, /contact, /guides/dog-car-safety-harness-and-crate-guide) plus repo /home/user/paw-passage-aff. Investigation only. Not fetched: Chewy's own reviewer criteria beyond docs/AFFILIATE-PROGRAMS.md:81 (Chewy "can refuse any site that does not meet its quality and content standards", paraphrase there). I do not know why Chewy declined; everything below is a reviewer-eye inference, labelled as such.

## Summary (10 lines)
1. VERIFIED: the site reads as a dog-travel research publication, not a pet-product shopping site. A Chewy reviewer sees dog-rental policy content, not product commerce. Alignment with Chewy's catalogue is thin.
2. VERIFIED: homepage and nav contain zero product recommendations; nav is Stays / Destinations / Dog rules / Guides / Tools (src/config/site.ts:23-29). No home-to-product path exists in two clicks without hunting through /guides.
3. VERIFIED: only 3 of 23 live guides are product/gear guides (car safety, first aid, portable pens), and no gear guide names a Chewy-relevant consumable category (food, treats, litter, meds).
4. VERIFIED: the gear guides honestly state "not tested" and link only to makers' sites, no affiliate links (live car-safety page). Honest, but gives a reviewer no commerce signal.
5. VERIFIED: trust pages exist and are decent: About, Contact, Privacy, Terms, Affiliate Disclosure, Editorial Standards. Missing: a product review methodology page, a masthead/editors page, a corrections log, dates on About/Contact.
6. VERIFIED: site is new: all content dated 2026-11-16/18, no traffic, no social profiles, no stays verified (src/content/stays/verified.ts:6 empty array). It is a starter site.
7. VERIFIED overclaims to fix: "Top pick" (car-safety guide), "Every fact is sourced" (index.tsx:75), "We only publish a stay once... confirmed" (stays.index.tsx:155, about.tsx:15) while unverified stays render in production.
8. VERIFIED strengths: a real original dataset (38 managers, source per row), sourcing with access dates, explicit "not tested" labelling, "Paws & Passage Editors" byline already in use.
9. RECOMMENDATION: before reapplying anywhere pet-retail, add a product-shopping lane (3-6 buyer-intent gear guides), a Methodology page, a masthead, and several months of publishing history. Do not reapply to Chewy until then.
10. Needs-user-action: 6 items (end of report).

## Task A: affiliate manager review

| Question | Finding | Evidence | Label |
|---|---|---|---|
| Is business purpose immediately clear? | Partly. H1 "Their favorite getaway starts here." is brand copy; the subhead (index.tsx:75) clarifies "Researched guides and free tools for renting, driving and vacationing with your dog". Purpose = dog-friendly rental planning, clear after one read, but the hero is a lifestyle slogan and the CTAs are "Read the guides" / "Use the free tools". | index.tsx:73-110; live homepage | VERIFIED |
| Audience alignment with Chewy | Audience = dog owners planning vacation-rental trips (a pet-owning audience, good) but intent is lodging policy, not product purchase. Chewy sells food, supplies, meds, and some gear; the site's gear coverage is travel safety/first aid/pens only. Whether Chewy stocks the specific brands (Sleepypod, GUNNER, Saker, Lucky Duck) is NOT CONFIRMED. | content/gear/*.ts; docs/AFFILIATE-PROGRAMS.md:81 | VERIFIED / NOT CONFIRMED |
| Articles for active product shoppers? | 3 gear guides of 23 live (/guides: Gear 3, Checklist 2, Planning 19). src/content/gear holds 6 product modules (car safety, first aid, portable pens, plus water/feeding, rental protection, loose-dog); the last three are not shown as gear guides on the live /guides list. | src/content/gear (6 files); /guides live listing | VERIFIED |
| Product recs in two clicks from homepage/nav? | No. Home links to Guides; the Guides index mixes categories; a reviewer must open /guides then spot the "Gear" tag. Homepage featured list prefers fees, checklist, fenced-yard, car-safety (index.tsx:30) so one product guide can appear, but it is not labelled as shopping. Footer has no gear link. | index.tsx:30; SiteFooter.tsx:7-10; SiteHeader nav | VERIFIED |
| Established publication or starter site? | Starter. Every guide dated 2026-11-16 or 2026-11-18; publishedOn = lastReviewed for car-safety (guide .ts:14-15); no stays verified; no social/off-site presence found in repo (no sameAs in Organization JSON-LD, __root.tsx:104; no social links in footer or contact page live). Copyright "2026". | live pages; verified.ts:6 | VERIFIED |
| Is research credible? | Yes by method: per-claim sources with publisher and access date (GearPicks.tsx:40), CPS directory used for crash-test claims, 38-manager dataset with CSV (public/pet-policies-38-managers.csv), "Not tested by us" badge. Weak points: dataset is a convenience sample with 11 blocked managers (docs/audit/AUDIT-SUMMARY.md s.4); prior audit scored articles 5.6/10 average and flagged an unverifiable first-hand Airbnb example (AUDIT-SUMMARY s.3 item 7). | as cited | VERIFIED |
| Editorial identity clear? | Byline "By Paws & Passage Editors" appears on guides (live; guides.$slug.tsx:65; JSON-LD author is an Organization, line 35). There is no page explaining who "Editors" are or how to reach them. About page has no "who runs this". Owner chose no named person. | live guide; about.tsx | VERIFIED |
| Disclosures appropriate? | Mostly yes: article-top notice only when approved links exist (AffiliateNotice.tsx:6), `sponsored` rel, Amazon sentence, trademark line for Vrbo, FTC reference, privacy page covers affiliate cookies. Issue: live car-safety guide still shows "When a link is an affiliate link it is marked sponsored" language and footer "Some links may be affiliate links" while product buttons go to makers (not affiliate); conditional text is fine but reads as hedging. Affiliate Disclosure line 11 "A link appears only when we have an approved arrangement" is accurate. | SiteFooter.tsx:37; affiliate-disclosure.tsx:11 | VERIFIED |
| Differentiation from generic AI affiliate content? | Real differentiators: original policy dataset, "unknown means unknown" filter logic, sources with dates, explicit untested labelling, tools (pet-cost-check, will-my-dog-be-accepted). Risks: uniform template prose, "Direct answer:" repetition and over-hedging (AUDIT-SUMMARY s.3 item 2); no first-hand photos, no named experts, no experience signal. A reviewer skimming would still see a young, template-shaped site. | AUDIT-SUMMARY.md | VERIFIED |
| Evidence needed to be confident we can drive sales | NEEDS real data, none exists: organic sessions and top landing pages (GA4 G-1J97C8CPC1 is installed but no export in repo), click-through on outbound product links (trackProductClick exists in GearPicks.tsx:50, no data), Search Console impressions for product queries, repeat/direct visitors, email/social reach (no newsletter by owner rule). Do not state any of these until measured. | settings.yml; analytics.ts | NEEDS-USER-ACTION |

Reviewer's likely read (SUSPECTED, not Chewy's stated reason): "new site, travel-lodging focus, little pet-product content, no traffic proof, Vrbo-only monetisation."

## Task B: trust-page audit

| Item | Exists? Where | Quality | Missing / fix |
|---|---|---|---|
| About | Yes, src/routes/about.tsx; footer "About us" | Good honest voice; states what we do/don't do. | No "Last updated" date; no "who publishes" statement; line 15 "Stays, listed only after we confirm" conflicts with unverified stays rendering (AGENTS.md rule). Intro is the tagline "Better adventures, together." |
| Contact | Yes, contact.tsx; live shows "Email hello@pawsandpassage.com" | Functional, short; corrections process described. | No dated page, no response-time statement, no non-email path (form), no business name/entity or mailing address. Note owner rule: affiliate accounts must not use hello@ (settings.yml:3), so a second role address is needed for network accounts. |
| Privacy | Yes, privacy.tsx, updated 2026-11-18 | Strong: GA4, affiliate cookies, Stay22, children. | Fine. Mentions Stay22 although stay22AccountId is empty (settings.yml): conditional wording advisable. |
| Terms | Yes, terms.tsx, 2026-11-16 | Adequate generic terms (owner skips legal review). | No governing entity named. |
| Affiliate Disclosure | Yes, affiliate-disclosure.tsx, 2026-11-16 | Good; says untested, no ratings, sponsored labelled. | Mentions Amazon/Stay22 though neither is active; add current-partners list. |
| Editorial Policy | Yes, editorial-standards.tsx (route name differs from "policy"), 2026-11-16 | Good: process, never-do list, images, money, corrections. | Process promises (">= 5 ranking pages reviewed", ">= 3 practical insights") must stay true per guide; no corrections log; no named responsibility (accountable role). Images section discloses hero is AI-generated only here, not on the homepage. |
| Product Review Methodology | NO. Only inline notes in GearPicks.tsx:27 and affiliate-disclosure.tsx:14 | n/a | Add page (outline below). |
| Author/editor presentation | Partial: byline "Paws & Passage Editors" on each guide; JSON-LD Organization author | Legit, no fake people | No masthead page, no link from the byline. |
| Citations | Yes: per-guide source lists with publisher and access date (guides.$slug.tsx:121; live car guide "20 official sources") | Good | "official sources" count label may overstate when sources include makers/blogs; relabel "20 sources". |
| Publication/updated dates | Guides: "Last reviewed"; JSON-LD datePublished/dateModified (guides.$slug.tsx:35). Info pages: Privacy, Terms, Disclosure, Standards dated; About and Contact not | Mixed | Show "Published" and "Reviewed" both; add dates to About/Contact. |
| Brand consistency | "Paws & Passage" consistent in header, footer, JSON-LD (site.ts name) | Good | Hero slogan vs tagline differ ("Their favorite getaway..." / "Better adventures, together."); minor. |
| Imagery | Stock (Unsplash) on guides; hero is AI-generated; alt text descriptive (images.ts:74) | Disclosed in editorial-standards.tsx:28 | Hero not labelled where seen; a reviewer may take the golden-retriever porch hero as a real photo. Add a visible caption or note. |
| Business contact info | Email only | Weak | Add a role mailbox and optional contact form; no personal details. |
| Footer navigation | Yes: Explore / Plan / About / Legal (SiteFooter.tsx:7-10) | Good, includes disclosure | No Gear/Shopping link, no Masthead, no Methodology. |
| Social presence | None found in repo or live pages | n/a | NEEDS-USER-ACTION: only create profiles you will maintain; do not link empty ones. |

## Claims that imply testing, ratings, credentials or verification we cannot back

| Claim | Location | Issue | Fix |
|---|---|---|---|
| "Top pick for most dogs..." and "Top pick: ..." | content/guides/dog-car-safety-harness-and-crate-guide.ts:20, 86, 164 | Implies a ranking/judgement. Basis is the CPS listing's heaviest test dog, which is a spec comparison. | Reword to "Heaviest documented test dog among the options here" or "Best match to the criteria for..." |
| "Every fact is sourced" | index.tsx:75 | Absolute; the audit found unsourced claims (six-foot leash, AUDIT-SUMMARY s.3 item 7) | "Facts link to their sources" |
| "We only publish a stay once its pet policy, fees and fencing are confirmed" | stays.index.tsx:155 | Contradicts AGENTS.md: unverified stays render with a "Not yet verified" label | Reword to match behaviour |
| "Stays, listed only after we confirm the pet policy" | about.tsx:15 | Same | Same |
| "Featured stays" on homepage | index.tsx:192-196 uses visibleStays() incl. unverified | "Featured" implies endorsement | Show only verified or relabel "Stays we are still verifying" |
| "Original research" / "We read what 38 rental managers actually say" | index.tsx:222-223 | Fair, and a caveat sits below ("A convenience sample"); keep the caveat beside the headline | OK with caveat |
| "Crash-Tested Harness" in titles | gear guides | It is the makers'/CPS claim, not ours; title could be read as our test | Quote CPS "certified" or "independently tested (CPS)" |
| "Dog-friendly travel, done properly" | index.tsx:73 | Puffery, harmless | Optional |
| Guide count label "20 official sources" | live car-safety page | Includes maker pages | "20 sources" |

Good existing guard: src/test/content.test.ts:65 rejects "we tested/tried/used/hands-on" in guides; extend it to fail on "top pick", "best overall", "our pick", "recommended by", "expert" unless allow-listed.

## Recommended pages (honest outlines)

### 1. Product Review Methodology (/how-we-choose-products): MISSING
- H1 How we choose products
- Researched, not tested: we do not buy, handle or test products. State it in the first paragraph.
- What we use instead: maker spec pages, independent certification bodies (e.g. Center for Pet Safety), veterinary/government sources; every spec carries source, publisher, access date.
- Selection criteria (per category, listed before any product): safety standard, size/weight range, materials, return/warranty terms, availability.
- What "pick" labels mean: "meets the criteria best for [situation]", never "best overall" or a rating.
- What we omit: prices, star ratings, user reviews, testimonials.
- Brand relationships: none unless listed; commissions never decide inclusion; non-affiliate products are included in the same way.
- Update cadence and how to report a changed spec or recall; link to corrections.
- Future: if we ever do hands-on testing, it will be labelled "Tested by us" with method, dates, photos, and kept apart from "Researched" articles.

### 2. Masthead / About the editors (/about/masthead): MISSING
- H1 Paws & Passage Editors
- Who we are: an independent publication; "Editors" is the collective byline; the owner has chosen not to publish an individual's name (do not invent people, titles, credentials or pet ownership claims).
- Responsibility: editors research, write, fact-check against listed sources and own corrections.
- Roles described by function (research, source check, corrections), not by invented headcount.
- Not claimed: no veterinary, legal or certified-trainer credentials; direct readers to a vet for health decisions.
- Contact (role mailbox) and corrections link; "Last updated" date.
- Optional later: business entity name and registered address once the owner decides (NEEDS-USER-ACTION).

### 3. Corrections log (/corrections): MISSING
- How to report; what we review; table: date, page, what changed, why; honest "No corrections yet" at start.

### 4. Editorial policy upgrades (existing page)
- Rename H1 "Editorial standards and policy"; add "Researched vs tested" table; add affiliate separation ("editors choose before links exist"); add AI-assistance statement only if true (owner to confirm); add review cadence (e.g. re-check at most every N months; set only a number you will meet).

### 5. Contact upgrades
- Add dated page; role mailbox such as editors@ for readers and a separate non-hello@ address for affiliate accounts; expected reply window only if you can meet it; business-contact-only line "no personal addresses published".

## Prioritized recommendations

| # | Priority | Action | Impact | Effort | Ongoing cost | Dependencies |
|---|---|---|---|---|---|---|
| 1 | P0 | Remove/reword overclaims (table above); extend content test | Credibility, FTC-safe | S | none | none |
| 2 | P0 | Align stay copy with unverified-stay behaviour; relabel homepage "Featured stays" | Credibility | S | none | owner decision on unverified display |
| 3 | P1 | Publish Product Methodology page and link from gear guides, footer, disclosure | High for any pet-retail reviewer | S | none | none |
| 4 | P1 | Masthead + corrections page; link byline to masthead | Medium-High | S | low | owner wording approval |
| 5 | P1 | Add a visible "Gear" route/nav or homepage band linking gear guides (two-click product path) | High for pet-retail programs | S-M | none | existing 3 guides |
| 6 | P1 | Write 3-6 buyer-intent pet-product guides tied to the existing travel theme (not generic best-of lists), each researched, with criteria before picks | High | L | writing time | methodology page |
| 7 | P2 | Dates on About/Contact; "Published" plus "Reviewed" on guides | Low-Med | S | none | none |
| 8 | P2 | Hero AI-image caption | Low | S | none | none |
| 9 | P2 | Role mailboxes; optional contact form | Medium | S | low | owner |
| 10 | P2 | Social profiles only if maintained; add to Organization sameAs | Low-Med | S | recurring effort | owner |
| 11 | P3 | Accumulate 3+ months of GA4/Search Console data before any new pet-retail application; present real numbers only | High | none | time | none |

## Needs your personal action
1. Decide whether unverified stays should remain visible on the live site (affects About/stays copy and "Featured").
2. Approve masthead wording (collective byline only) and whether to name a business entity.
3. Create a role mailbox for readers and a separate one for affiliate accounts (not hello@).
4. Confirm whether AI assistance should be disclosed in editorial policy (state only what is true).
5. Export GA4 and Search Console data when available; decide on any social profiles you will maintain.
6. Confirm Chewy's reapplication rules directly via Impact/Chewy before reapplying (not verified here).

## Could not verify
- Chewy's actual rejection reason or current reapplication policy.
- Whether Chewy stocks Sleepypod, GUNNER, Saker or Lucky Duck products.
- Any traffic, impressions, or click data (none in repo).
- Rendered visual quality and mobile layout (text-only fetches).
- Whether stays pages show "Not yet verified" labels live (not fetched).
