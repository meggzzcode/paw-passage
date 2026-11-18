# 07 - Analytics, affiliate management system, automation (audit and design only)

Read 2026-11-18 (repo checkout /home/user/paw-passage-aff + public production pages). Labels: VERIFIED / SUSPECTED / RECOMMENDATION / NEEDS-USER-ACTION / COULD-NOT-ACCESS. No repo file other than this one was edited; no external APIs, Google Sheet or dashboards were called.

## Summary
1. GA4 is installed and live: production homepage HTML loads `gtag/js?id=G-1J97C8CPC1` (VERIFIED); the ID comes from `content/settings.yml:5`. Event code is in `src/lib/analytics.ts`.
2. Click tracking exists for stay booking buttons (`booking_click`), gear/product buttons and inline `aff:` links (`product_click`), and tool use (`tool_*`, `rules_*`). Nothing is missing in code for clicks; the gap is GA4-side configuration (custom dimensions for `partner`, `product_id`, `stay_slug`, `link_url`; key events) which is not documented and cannot be verified from the repo. Without it, you cannot break clicks down by partner/product in GA4 reports.
3. No consent banner or consent mode: GA4 loads unconditionally (`__root.tsx:105-109`). The privacy page discloses GA4 and affiliate cookies and links Google's opt-out add-on. Acceptable for a US-first site only at the owner's risk (legal review skipped by owner); a risk if EU/UK traffic grows.
4. Search Console: BUYER_HANDOVER.md:96 says "set up"; LAUNCH-CHECKLIST.md:14,29 says "Not done". Contradictory and stale; no verification meta tag in live HTML (VERIFIED), so if it exists it is a DNS TXT record (could not check). Bing Webmaster Tools: no evidence anywhere (no meta tag, `/BingSiteAuth.xml` returns 404). Status MISSING.
5. Revenue per visitor, monthly expenses and net profit cannot be computed from anything in the repo. The "Website Flipping Tracker" sheet is NOT mentioned in any repo doc (grep "flipping" only hits an unrelated marketplace line in LAUNCH-CHECKLIST.md:39). Only a "monthly numbers log" is listed as "Not started".
6. Product data is split: `content/affiliates.yml` (CMS-editable; only Vrbo, 10 entries, all `kind: stay`) vs 26 products hardcoded in 6 TS files (`src/content/gear/*.ts`), not CMS-editable. 0 of 26 products have an `affiliateId`; every product button is a plain maker link today.
7. Of the desired product record, the repo has name, brand, summary, maker URL, affiliate link (indirectly, by id), network and approval (on the affiliate entry). Missing: category, image, retailer URL, alternative retailer, last verification date (only `specSource.accessedOn`), active/inactive, per-product CMS editing.
8. Proposed design: one `content/products.yml` (or `content/products/*.yml`) collection in Pages CMS, with fallback affiliate -> manufacturer -> retailer, no price/commission fields, migrated with zero URL changes via a generator script plus parity tests.
9. Automation: the highest value-for-effort items are a scheduled GitHub Action for broken-link and freshness checks (free), a free external uptime monitor, and Search Console sitemap/coverage emails; none needs a paid plan.
10. Owner-only actions are listed at the end (13 items).

## Task A - Analytics audit

| # | Integration | State | Evidence | Notes |
|---|---|---|---|---|
| A1 | GA4 base tag | OPERATIONAL (VERIFIED) | `content/settings.yml:5` `G-1J97C8CPC1`; `src/routes/__root.tsx:105-109`; `curl` of https://www.pawsandpassage.com/ shows `gtag/js?id=G-1J97C8CPC1`. Schema `src/content/schema.ts:181` validates `G-XXXXXXXX`. | Page views, sessions, sources, popular pages (Reports > Engagement > Pages) are collected by default. I cannot see whether data actually arrives or how much (COULD-NOT-ACCESS). Note: LAUNCH-CHECKLIST.md:29 still says "Not set up". |
| A2 | Consent / privacy | INCOMPLETE (VERIFIED, risk SUSPECTED) | No banner or consent-mode code anywhere in `src`. `src/routes/privacy.tsx` has "Analytics" (L13-15, GA4 cookies, opt-out add-on) and "Affiliate links, cookies and tracking" (L25-27, mentions GA4 click counting). | Privacy text matches behaviour. "We may use" wording is soft but accurate. No Google Consent Mode v2: matters for EU/UK users and any future Google ads/remarketing. Owner skipped legal review. |
| A3 | Stay booking clicks `booking_click` | OPERATIONAL (code) | `src/lib/analytics.ts:8-12`; called from `src/components/site/BookingButton.tsx:19,26` (affiliate and plain-link variants, partner labelled). | Params: stay_slug, partner, link_url, page_path. Per-slug reporting needs GA4 custom dimensions (not documented as created). Few live stays are verified, so volume is low. |
| A4 | Product clicks `product_click` | OPERATIONAL (code) | `analytics.ts:15-19`; fired from `GearPicks.tsx:50`, `PackingBuilder.tsx:160`, `Markdown.tsx:80` (inline `aff:` links; only for approved links, since unapproved render as text). | `partner` = network or "maker website". Direct maker clicks are counted too, good for demand evidence before any approval. Clicks from plain-markdown outbound links (not `aff:`) are not tracked. |
| A5 | Tool events | OPERATIONAL (code), reporting INCOMPLETE | `analytics.ts:21-45`; used in PetCostWorkflow, PackingBuilder, DogAcceptedChecker, tools.checklist, dog-rules routes, StayFeeCalculator. Doc: `docs/TOOL-TRACKING.md`. | The doc lists only `pet-cost-workflow`, `checklist`, `dog-rules` as tool_name values; code also emits `packing`, `stay-fee-calculator`, and the dog-accepted tool. Doc is out of date. `trackToolOnce` dedupes per page view only. Privacy-safe: sends no typed input (stated in code comment). |
| A6 | GA4 custom dimensions and key events | NEEDS-USER-ACTION / unknown | `TOOL-TRACKING.md` step 1 asks for `tool_name` and `tool_label`; nothing documents `partner`, `product_id`, `stay_slug`, `link_url`, `page_path`; no doc says `booking_click`/`product_click` are marked as key events. | Events record regardless, but cannot be reported by those fields until registered, and only from registration date forward. |
| A7 | Google Search Console | UNKNOWN / INCOMPLETE | BUYER_HANDOVER.md:96 "Google Analytics and Search Console are set up"; LAUNCH-CHECKLIST.md:14 "Not done" (DNS TXT method). Live homepage has no `google-site-verification` meta (VERIFIED). | DNS check not possible here (no `dig`; no external lookups). Sitemap exists (below). Whether it was submitted: COULD-NOT-ACCESS. |
| A8 | Bing Webmaster Tools | MISSING | grep for `msvalidate`/Bing verification: only `public/robots.txt:4` allows Bingbot. `/BingSiteAuth.xml` -> 404. | Free; can import the Search Console site, which needs no repo change. Bing also feeds DuckDuckGo/Ecosia. |
| A9 | Sitemap | OPERATIONAL (VERIFIED) | `src/routes/sitemap[.]xml.ts`; `src/lib/sitemap-entries.ts` (lastmod from `lastReviewed`); live sitemap has 47 `<loc>` entries; robots.txt L14 references it. | |
| A10 | Impact site verification | OPERATIONAL (VERIFIED) | `__root.tsx:94` and live HTML meta `impact-site-verification`. | Remove at sale (comment says so). |
| A11 | Error monitoring | INCOMPLETE | `src/lib/lovable-error-reporting.ts` posts to `window.__lovableEvents`, which exists only in Lovable's runtime; `src/lib/error-capture.ts` only recovers stacks for server logs. No Sentry or similar. | On Netlify the Lovable hook is probably inert (SUSPECTED). Client JS errors are invisible. |
| A12 | Affiliate network reporting | OPERATIONAL (outside repo) | Vrbo/Expedia Creator hub is the only source of earnings (`content/affiliates.yml` has Vrbo only). | Not joinable with GA4 automatically. |
| A13 | Email conversions | NOT APPLICABLE | Owner chose no newsletter (AGENTS.md; LAUNCH-CHECKLIST.md:13; docs/LEAD-CAPTURE.md). | Non-email options: see recommendations R-A3. |
| A14 | Revenue per visitor | MISSING | Needs GA4 sessions + network earnings per month; no store of either in repo. | Compute by hand monthly: earnings / GA4 sessions (organic sessions are the cleaner denominator). |
| A15 | Monthly expenses, net profit | MISSING in repo / COULD-NOT-ACCESS | No doc describes the sheet's columns. LAUNCH-CHECKLIST.md:14,39-40 call for a monthly log: "Not started". | Known costs (domain at Namecheap, mailbox, Netlify free, Pages CMS free) are in docs/OPERATIONS-RECORD.md. I did not open the Google Sheet (instructed to rely on docs only). |
| A16 | Traffic sources, popular pages | OPERATIONAL in GA4 (not verified) | Default GA4 reports; Search Console for queries. | Owner reads them in the UIs; nothing exports them. |

### Measurements currently impossible or unreliable
- Click-through by partner/product/stay inside GA4 reports until custom dimensions exist (A6).
- Revenue per visitor, per page or per article: no join between network earnings and GA4. Vrbo/Expedia links are single program links stored in `affiliates.yml` with no per-article sub-ID, and Expedia terms (docs/AFFILIATE-AND-SELLING.md) forbid editing the link or adding parameters, so per-page revenue attribution via link parameters is not allowed. Use GA4 `booking_click` counts by `page_path` as a proxy only.
- Conversions of clicks to bookings: the network knows, the site does not.
- Visitors who decline or block GA4 (ad blockers) are invisible; no server-side logs on Netlify free.
- Historical traffic before the GA4 start date (cannot be backfilled; LAUNCH-CHECKLIST.md:29).
- Client-side error rates (A11).
- Outbound clicks from non-`aff:` Markdown links (e.g. manufacturer links inside articles).
- Net profit: no records the code can see.

## Task B - Affiliate management system

### What exists today (VERIFIED, files read)
| Desired field | Where it lives now | Status |
|---|---|---|
| name, brand | `Product.name`, `.brand` (`src/content/gear.ts`) | Exists, TS only |
| category | none (only the guide it sits in; `PackItem` groups in `src/lib/packing.ts`) | Missing |
| description | `Product.summary` + `keySpecs[]` + `specSource` | Exists |
| image | none for products. `src/content/pack-photos.ts` has 15 Unsplash illustration photos keyed by pack item id (explicitly "never pictures of a specific product"). `docs/PRODUCT-PHOTOS.md` says no maker photos used | Missing by owner design |
| manufacturer URL | `Product.productUrl?` (3 products set) else `specSource.url` unless PDF (`affiliate-usage.ts` `productButton`) | Exists, implicit |
| retailer URL | none | Missing |
| affiliate URL | `content/affiliates.yml` entry whose `id` equals the product id, or `Product.affiliateId` | Exists (indirect) |
| network, approval status | `affiliates.yml`: `network`, `approved`, `kind`, `notes` | Exists |
| alternative retailer | none | Missing |
| last verification date | `specSource.accessedOn` (spec date only; not link date) | Partial |
| active/inactive | none (a product is "inactive" only by removing it from a guide or by guides not referencing it) | Missing |

Counts: 6 gear files, 26 product ids; 0 have `affiliateId`; `affiliates.yml` has 10 entries, all `kind: stay` Vrbo; `docs/affiliate-link-worksheet.csv` has 27 product rows (all unapproved) and `scripts/affiliate-worksheet.ts` / `import-affiliate-links.ts` import them. `.pages.yml:378-403` exposes `affiliates.yml` only; products are not in Pages CMS (editing prices-free spec text needs code).

How links render today:
- `GearPicks.tsx:33-60`: approved affiliate -> terracotta button `rel="sponsored nofollow noopener"`; otherwise maker button `rel="noopener noreferrer"`; disclosure appears only if some link is approved; Amazon sentence added only if an Amazon link is approved.
- `PackingBuilder.tsx:140-165`: same logic via `productButton`, up to 3 products per item.
- Markdown `aff:id` (`Markdown.tsx:~22-28`): approved -> `sponsored nofollow noopener` with `data-aff`; unapproved -> plain text (link silently dropped). All other external Markdown links are forced to `noopener noreferrer` (`Markdown.tsx:~76`).
- `BookingButton.tsx:19`: stays use `sponsored nofollow noopener` (no noreferrer), fallback to `stay.sourceUrl` with `nofollow noopener`.
- No cloaking: the stored URL is rendered as-is (VERIFIED in the above). No prices, ratings, commission figures in product data (enforced by `src/test/content.test.ts:50,59`).

Gaps and risks (VERIFIED unless noted):
- `PackingBuilder` and `GearPicks` always give the affiliate link `sponsored` but the rel is chosen by "affiliate vs direct", not by network. Fine today (only Vrbo/Expedia = no noreferrer); if another network is added with different requirements, rel is not per-network. Amazon's policy about rel/redirects is NOT CONFIRMED here; check the program terms when it is approved.
- `Markdown.tsx` rewrite of external links to `noopener noreferrer` would add `noreferrer` to a future raw Expedia link written without `aff:`; always use `aff:`.
- A product's affiliate link and its maker link cannot be both shown (single button); no "alternative retailer" button.
- Product facts are editable only in code, so a non-technical buyer cannot deactivate a product or fix a URL in Pages CMS.
- No "last link check" record; broken maker links would only be found by hand (docs/REVIEW-LINKS.md is a one-off).

### Minimal design (do not implement)
New file `content/products.yml` (single file edited as a CMS "file" type with a list, like `affiliates.yml`; a folder `content/products/*.yml` is the alternative if per-product history is wanted, but a single file is simpler to validate and keeps the existing `affiliates.ts` pattern).

Per-product fields (all strings unless noted; none for price or commission):
```
id            # unchanged ids (e.g. kurgo-heather-hammock); unique; matches affiliates.yml id
name, brand, category            # category: select (car, safety, feeding, first-aid, containment, rental-protection, id-tracking)
summary, keySpecs[], specSource{title,url,publisher,accessedOn}   # as now
manufacturerUrl                   # = today's productUrl or specSource.url
retailerUrl                       # plain, non-affiliate retailer page (optional)
retailerName                      # optional, shown in button label
alternativeRetailerUrl/Name       # optional second plain link
affiliateId                       # optional, id of an entry in affiliates.yml
active                            # boolean, default true; false hides from guides/packing/search but keeps data
linksCheckedOn                    # date: when URLs were last opened by a human or the link check
imageUrl                          # OPTIONAL, only a self-uploaded or permissioned image in /uploads, with imageCredit; otherwise empty (no scraped images)
```
Network, approval status, URL stay in `affiliates.yml` (single source of truth for programs; keep `kind: product`). Add to that file optional `rel`-policy keys instead of hardcoding: `network` -> rel map in code, e.g. default `sponsored nofollow noopener`; Expedia Group/Vrbo explicitly without `noreferrer`; plain links `noopener` (and `noreferrer` only where analytics referrer privacy is wanted; current plain-link behaviour keeps `noreferrer`). Expose this policy in one TS function (`relFor(network|kind)`) used by GearPicks, PackingBuilder, BookingButton and Markdown so rel can never diverge.

Link fallback order, implemented in `productButton()`:
1. `getApprovedLink(affiliateId ?? id)` -> affiliate button, rel per network, disclosure shown.
2. else `manufacturerUrl` -> "See it on {brand}'s website", plain rel.
3. else `retailerUrl` (+ optional alternative) -> "See it at {retailerName}", plain rel, no sponsored claim.
4. else no button (as today). If `active: false`, return nothing and drop the pick from guides and packing.
Disclosure rule stays: shown only when an approved affiliate link actually renders. No redirect, no shortener, no parameter editing (Expedia terms in docs/AFFILIATE-AND-SELLING.md).

Pages CMS: add a `products` file entry (list of objects) to `.pages.yml` mirroring the schema; extend `src/test/pages-config.test.ts` pattern (form fields equal schema keys, select values equal enums).

### Migration plan (zero URL changes)
1. Add Zod schema `productsSchema` in `src/content/schema.ts`; add `virtual:content` export for `products.yml` (follow how `affiliates` is wired in `plugins/` and `virtual.d.ts`).
2. Write a one-off script `scripts/migrate-gear-to-yaml.ts` that imports the six `src/content/gear/*.ts` arrays and emits `content/products.yml` with `manufacturerUrl = productUrl ?? (non-PDF specSource.url)`, preserving every existing field verbatim, `active: true`, empty new fields. Do not hand-type URLs.
3. Make `src/content/gear.ts` read `products` from the YAML (keep `Product` shape; add optional fields), leave `src/content/gear/*.ts` in place for one release as the comparison baseline.
4. Parity test (temporary): for every product, old `productButton` result (kind, url, label, rel) equals new result. Then delete `gear/*.ts` and the glob.
5. Add `active` handling, `relFor` helper and fallback steps 3-4; add `.pages.yml` entry and CMS test.
6. Update `docs/affiliate-link-worksheet.csv` columns and `scripts/affiliate-worksheet.ts` to read from the YAML.

Tests that must keep passing: `src/test/content.test.ts` (product source readable, no price/rating at L50, unique ids L56, gear guides only pick existing products and never state prices or testing L59, affiliateId exists L68); `src/test/affiliate-links.test.tsx` (L51-93: product link id rule, button goes to maker until approved, PDF spec falls back to product page, approved replaces, unapproved does not; Amazon sentence L65; inline `aff:` L21-45); `src/test/packing.test.ts` L9 (every `productIds` entry resolves); `src/test/pages-config.test.ts` L82 (form matches schema) plus a new products case; `src/test/affiliate-import.test.ts`; `src/test/launch-state.test.ts` L9 (footer affiliate line only when an approved link exists); `src/test/markdown-safety.test.tsx`; `src/test/content-pipeline.test.ts` (loader errors name the file and field). New tests to add: fallback order, `active:false` hides, `relFor` (Expedia/Vrbo never `noreferrer`, affiliate always `sponsored`), no `price`/`commission` keys allowed in the schema (`.strict()`).

## Task C - Automation (ranked)

Scoring: Value (V), Complexity (C), Cost (K). Rank = V high, C low, K zero first.

| Rank | Item | Existing infrastructure | V | C | K | Owner needed? |
|---|---|---|---|---|---|---|
| 1 | Scheduled broken-link check (weekly GitHub Action running a link checker, or a small Node script over product/source/maker URLs and affiliate URLs; opens an issue on failure) | `.github/workflows/ci.yml` runs tests+build on push/PR only; `scripts/verify-site.mjs` already crawls a deployed site (guides, info pages, images, canonical, sitemap) | High | Low-Med | Free (GitHub Actions minutes are free for this size; private repo limits NOT CONFIRMED) | Allow Actions; read issue emails |
| 2 | Content-freshness alert (scheduled Action or a vitest that warns, listing guides with `lastReviewed` older than N months, places via `placeNeedsRecheck`, and the six-month recheck in `docs/DATA-RECHECK-LOG.md`; opens an issue) | `lastReviewed` (schema:34), `lastChecked` (schema:218), `placeNeedsRecheck` (`publish-rule.ts:44`, only used for UI badges), `specSource.accessedOn`, DATA-RECHECK-LOG says "at least every six months" but nothing enforces it | High | Low | Free | Owner does the actual re-checks |
| 3 | Uptime monitoring (free external monitor of `/` and `/sitemap.xml`; email alert) | None. `verify-site.mjs` is manual | Med | Very low | Free tier at a monitor service (terms NOT CONFIRMED; choose any) | Yes: owner creates account under a non-`hello@`-bound address if desired |
| 4 | Search Console + Bing email alerts and weekly "coverage" review | Sitemap live with 47 URLs | High | Very low | Free | Yes (A7, A8) |
| 5 | Netlify deploy-failure alert | BUYER_HANDOVER.md:44 says email alerts are paid; free alternative described there (commit status) | Med | Low | Free (status marks) | Yes (Netlify/GitHub settings) |
| 6 | SEO validation tests (already present) | `content.test.ts:39` SEO fields fit, canonicals/sitemap tests, `verify-site.mjs`; run in CI on every push | Done | - | Free | Extend: assert every indexed URL in sitemap returns 200 + canonical self + not noindex; run `verify-site` post-deploy weekly |
| 7 | Related-article logic | Hand-curated `relatedGuides`/`relatedTools` (`guides.$slug.tsx:48-49`, max 3). Add a test that no published guide has zero inbound internal links (orphan check) rather than automatic related logic | Med | Low | Free | No |
| 8 | Backups | Git is the backup (GitHub main; Pages CMS writes commits; Lovable mirrors). Add a periodic `git bundle`/mirror to a second location only if the owner wants a copy outside GitHub | Low-Med | Low | Free | Owner holds GitHub account recovery codes (do not store them in repo) |
| 9 | Error monitoring (client JS) | Lovable hook likely inert on Netlify (A11). Options: GA4 `exception` events via a tiny `window.onerror` handler (no new vendor, free), or a free tier of an error service | Med | Low (GA4 route) | Free (GA4 route) | No for GA4 route |
| 10 | Analytics monthly report | Nothing automates it. Could use GA4 scheduled email (built in, free) + Search Console performance export; paste totals plus network earnings into the tracker sheet monthly | Med-High (proves value to a buyer) | Very low | Free | Yes (owner's Google login) |
| 11 | Pinterest pins | `scripts/make-share-images.py` already generates 1000x1500 pins for every guide into `public/pins` and 1200x630 shares into `public/share`; `src/test/share-images.test.ts` guards them. Posting is manual (Pinterest Business account "being set up", LAUNCH-CHECKLIST.md); scheduling tools are not verified here | Med | Low (batch of pins + CSV of titles/URLs/descriptions from script) | Free to prepare; scheduling via Pinterest's own scheduler is NOT CONFIRMED | Yes (account, posting, owner's "photos must match articles and never repeat" rule applies) |
| 12 | Paid monitoring/alerting (Netlify email notifications, paid uptime/SEO suites) | - | Low | - | Paid subscription | Owner's decision; not recommended now |

Do not automate: affiliate link approval, price scraping, image scraping (owner/policy rules), or anything that edits articles without review.

## Prioritized recommendations
| Priority | Recommendation | Impact | Effort | Ongoing cost | Dependencies |
|---|---|---|---|---|---|
| 1 | Register GA4 custom dimensions (`partner`, `product_id`, `stay_slug`, `link_url`, `page_path`, `tool_name`, `tool_label`) and mark `booking_click`/`product_click` as key events; update `docs/TOOL-TRACKING.md` with the missing tool_name values | High (enables click reporting) | 15 min | 0 | Owner's Google login |
| 2 | Resolve Search Console status; submit sitemap; add Bing via GSC import; fix contradictory docs (BUYER_HANDOVER.md:96 vs LAUNCH-CHECKLIST.md:14,29) | High (indexing evidence, sale proof) | 30 min | 0 | Owner login |
| 3 | Weekly scheduled GitHub Action: link check + freshness report -> opens issue | High | 0.5 day | 0 | Owner enables notifications |
| 4 | Central `content/products.yml` + Pages CMS entry + fallback logic (design above) | High for buyer handover and new network approvals | 1-2 days | 0 | None; follows migration plan and test list |
| 5 | Monthly numbers routine: GA4 sessions, GSC clicks, network earnings, expenses -> sheet; document the sheet's columns in docs (without sharing the sheet) | High for sale | 20 min/month | 0 | Owner |
| 6 | Free uptime monitor on `/` | Med | 10 min | 0 | Owner account |
| 7 | GA4 `exception` event for client errors | Med | 1 hour | 0 | None |
| 8 | Decide on consent handling before EU/UK traffic matters: either geo-limited consent banner with Consent Mode v2, or accept the risk explicitly | Med (risk) | 0.5 day | 0 | Owner decision; legal review was skipped |
| 9 | Orphan-guide and sitemap-vs-live tests | Low-Med | 0.5 day | 0 | None |
| 10 | Pin batch preparation (CSV from the pin script); keep posting manual | Med | 0.5 day | 0 | Pinterest account |

Non-newsletter conversion options (R-A3): downloadable ungated checklists (the printable `/tools/checklist` and packing list already exist; a "print/save as PDF" button needs no email), track `tool_print`/`tool_copy` as the engagement signal; this uses existing events.

## Needs your personal action
1. Create GA4 custom dimensions and key events (A6).
2. Confirm in Search Console whether the domain property exists and the sitemap is submitted; add a read-only user for a buyer later.
3. Add the site in Bing Webmaster Tools (import from GSC).
4. Confirm GA4 is receiving data and note the start date (needed for sale proof).
5. Decide on consent banner/Consent Mode (A2).
6. Provide or document the "Website Flipping Tracker" columns (income, expenses, net profit, traffic) so docs can reference it; keep it out of the repo if it holds financial details.
7. Create a free uptime monitor account (use an address that is not `hello@` for affiliate accounts; monitoring is not affiliate, owner's choice).
8. Enable GitHub Actions notifications/issues for the scheduled checks.
9. Netlify: enable free GitHub commit status for deploy results (BUYER_HANDOVER.md section 6 step 4).
10. Approve the product-catalog design before implementation.
11. Do the six-month policy recheck on the schedule in DATA-RECHECK-LOG.md (first snapshot 2026-11-18, next due about 2027-05-18).
12. Pinterest Business account posting and pin approval.
13. Record monthly Vrbo/Expedia earnings from the Creator hub (not accessible to the repo).

## Could not verify
- Whether GA4 is receiving data, its start date, custom dimensions, key events, any consent settings in the GA4 property.
- Search Console property, DNS TXT verification, sitemap submission status (no `dig`; no external lookups; no google-site-verification meta on the live homepage).
- Bing Webmaster Tools account (only absence of tag/file is verified).
- Contents and structure of the Google Sheet "Website Flipping Tracker"; no repo doc describes it.
- Whether Lovable's `__lovableEvents` error hook runs on Netlify.
- GitHub Actions minutes limits for this repo and any free-tier uptime/monitoring terms (NOT CONFIRMED; check on the provider pages before signing up).
- Amazon or other network rel/redirect requirements (no Amazon account yet).
