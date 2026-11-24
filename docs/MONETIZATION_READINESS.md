# Monetization readiness (verified 2026-11-24)

Purpose: tell a buyer exactly what earns, what is only configured, what they must own, and how to swap IDs. No revenue figures are given on purpose. A configured ID or link here is NOT evidence of an active, approved partnership: approval needs account access (see section 8).

Method. Repo at HEAD 882d8a3 (committed state; the working tree was mid-edit by other workers and did not build). The frozen build on port 4175 was not running, so I built HEAD into a scratch copy (`NITRO_PRESET=node-server vite build`) and crawled that with Playwright (107 pages: sitemap plus every link on the /stays, /guides, /gear, /destinations, /dogs and /tools indexes, so non-indexed stays are included). Counts below are from that crawl and may drift as the guides and templates change.

## 1. Revenue channel inventory

| Channel | State in repo | Evidence | Buyer must own |
|---|---|---|---|
| Amazon Associates | CONFIGURED (tag `pawspassage-20`); approval status UNKNOWN | `content/settings.yml` `amazonTrackingId`; 63 product entries in `content/affiliates.yml` (kind `product`): 53 `approved: true`, 10 `approved: false` (switched off 2026-11-18/19, no buy box). Rendered: 53 distinct Amazon product URLs | Own Associates account and tracking ID |
| Vrbo (Expedia Group creator hub deeplinks) | CONFIGURED: 33 entries (kind `stay`), all `approved: true` | 1 generic (`vrbo`, used only in 4 guides' text) + 32 per-listing `vrbo-<listingId>` deeplinks in `https://vrbo.com/affiliate/<code>` form. 37 stay files; 32 resolve to an approved deeplink and are listed (rule `STAYS_REQUIRE_AFFILIATE_LINK`); 5 (Vacasa / Explore Georgia source URLs) have none and are not listed. 23 of the 32 are in the sitemap (the rest are listed but not indexable) | Own Expedia Group / Vrbo affiliate account; regenerate every deeplink |
| Impact | NOT a revenue channel yet. Only a site-ownership meta tag `impact-site-verification` in `src/routes/__root.tsx` (comment says remove on sale) | No Impact link in `affiliates.yml` | Own Impact account; re-verify the site |
| Awin | NOT PRESENT in code or content. Proposed only in `docs/AFFILIATE-APPLICATION-PACK.md` (Fi, Petmate; docs say an account exists, unverified) | grep of src/content/scripts | Own Awin account |
| Stay22 map | Code present, DORMANT: `stay22AccountId: ""` so the map renders nothing | `src/components/site/Stay22Map.tsx`, `src/lib/stay22.ts` | Own Stay22 account |
| Others (Chewy, Ascend/Pepperjam, AvantLink, Rakuten, display ads) | Proposed in docs only; nothing in code | `docs/AFFILIATE-PROGRAMS.md` | Own accounts |
| Display ads (Mediavine/Raptive etc.) | Not present | no ad code | Own account; traffic gate |

All affiliate accounts are NON-transferable in practice. Amazon Operating Agreement section 12: "You may not assign this Agreement, by operation of law or otherwise, without our express prior written approval" (read today at affiliate-program.amazon.com/help/operating/agreement). Impact documents a transfer path and Awin handles ownership changes case by case, per the repo's research notes (`docs/AFFILIATE-APPLICATION-PACK.md`; not re-verified today). Plan on the buyer applying fresh, replacing every ID, and starting new qualification clocks. Seller email/tax-ID separation is in `docs/LAUNCH-CHECKLIST.md`.

Mechanism: product records store no affiliate URL. A product button appears only for an approved `affiliates.yml` entry (`src/content/gear-links.ts`); otherwise it falls back to the maker page, then a plain retailer page, then nothing. A stay's button is an affiliate button only with an approved deeplink; otherwise a plain Vrbo/Airbnb source link with `rel="nofollow noopener"` and no affiliate label (`BookingButton.tsx`).

## 2. Link crawl of the build (107 pages)

| Link type | Count (all pages) | Notes |
|---|---|---|
| Amazon affiliate | 359 occurrences, 53 distinct URLs | 297 in 30 guides, 62 on 11 gear pages, 0 on stays |
| Vrbo affiliate (`vrbo.com/affiliate/...`) | 69 occurrences, 33 distinct | 64 on 32 stay pages (2 per stay), 5 in guides (generic link) |
| Plain outbound | 1,875 | mostly guide source citations (`rel="noopener noreferrer"`, no nofollow), maker/retailer links (`nofollow noopener`), 60 `help.vrbo.com` support links, Pinterest, official sources |
| Internal | 5,114 | |

Checks, all passed on every page crawled: all 359 Amazon links match `https://www.amazon.com/dp/<ASIN>?tag=pawspassage-20` (no untagged URL, no leftover `{amazonTrackingId}` placeholder, none of a non-/dp/ shape); all 69 Vrbo links match `https://vrbo.com/affiliate/<code>`; every one carries exactly `rel="sponsored nofollow noopener"`; no plain link carries `sponsored`. Not checked: whether any plain outbound link is itself an unlabelled affiliate link on another network (hosts matching awin/impact/cj/shareasale/etc. found: none beyond help.vrbo.com).
Link health: I did NOT request Amazon or Vrbo (they block bots). UNVERIFIED: whether each ASIN has a buy box today, and whether each Vrbo short code still resolves. `affiliates.yml` notes record Cowork browser checks dated 2026-11-18/19 only. Do not read the shape check as proof the links pay.
Note: guides' plain links use `noopener noreferrer` (no `nofollow`); affiliate links deliberately omit `noreferrer` so the Vrbo/Expedia program receives the referrer (`relFor` in `gear-links.ts`).

## 3. Tracking

- GA4 ID `G-1J97C8CPC1` is injected in `src/routes/__root.tsx`: `gtag` stub and `dataLayer` are defined at once; the Google loader is added after load/idle.
- Events (`src/lib/analytics.ts`, table `EVENT_VOCABULARY`): `booking_click` (stay_slug, partner, link_url, page_path) from `BookingButton` for affiliate AND plain stay links (partner is `Vrbo (plain link)` for the latter); `product_click` (product_id, partner, link_url, page_path) from GearPicks, RelatedProducts, GearHubCards, PackingBuilder and inline text links in guides (`a[data-aff]`). Tool events: tool_start/complete/copy/print, rules_*. `outbound_click`, `hub_card_click` and `accommodation_referral_click` are defined but have NO call sites (verified by grep), so they never fire. Documented in `docs/ANALYTICS-SETUP.md`, `docs/TOOL-TRACKING.md`.
- TESTED (Playwright, GA hosts blocked at the network, Amazon/Vrbo requests aborted): on `/guides/dog-car-safety-harness-and-crate-guide` clicking a pick button pushed `["event","product_click",{product_id:"sleepypod-clickit-sport",partner:"Amazon Associates",link_url:"...?tag=pawspassage-20",page_path:...,transport_type:"beacon"}]` to `dataLayer`; clicking an inline text link pushed the same event; on `/stays/5-star-cabin-with-views-and-hot-tub-cherry-lake` clicking the Vrbo button pushed `booking_click` with stay_slug, partner "Vrbo", link_url, page_path.
- NOT TESTED: that GA4 actually receives events (loader blocked on purpose), event arrival in a real GA4 property, key-event/conversion setup, consent behaviour.
- Attribution parameters: NO UTM or sub-ID on any outbound affiliate link (Amazon has only `tag=`; no `ascsubtag`; Vrbo deeplinks are pasted unchanged). UTMs exist only on Pinterest pin destination URLs (`scripts/make-pin-sheet.py`). So per-page revenue attribution comes only from GA4 click events matched by `page_path`/`product_id` against each network's reports (clicks, not sales). Amazon can add extra tracking IDs per page type; not implemented.
- After the buyer replaces the ID: GA4 shows only events from then on (no history carries over). Clicks appear as `booking_click` / `product_click` events (register `partner`, `product_id`, `stay_slug`, `page_path` as custom dimensions to report on them; realtime view shows them within minutes, standard reports can take up to a day). Revenue never appears in GA4; it lives in Amazon/Expedia dashboards.

## 4. Disclosure coverage (mechanism; labels are being edited by another worker)

- Per button: `src/lib/disclosure.ts` constants (`AFFILIATE_BUY_LABEL`, `AFFILIATE_BOOK_LABEL`) printed under each affiliate button; plain stay links get no label.
- Per guide: `AffiliateNotice` (`aside[role=note]`) renders only when the guide has at least one approved affiliate link, and adds Amazon's sentence "As an Amazon Associate I earn from qualifying purchases." only if an Amazon link is present. Gear pages and the packing tool use the same helpers.
- Crawl result: every page with an affiliate link showed a notice or label: 30/30 guides, 11/11 gear pages, 32/32 stays. Amazon sentence present on 30/30 guides and 11/11 gear pages with Amazon links. Stay pages carry the booking label, no Amazon sentence needed. Site-wide page: `/affiliate-disclosure`. Because the sentence is conditional on Amazon links, setting the tag empty also removes the sentence (tested, below).
- Not verified: legal sufficiency (FTC/Amazon wording review needs counsel); proximity of the notice to the first link on each page was not measured.

## 5. Buyer: replace the IDs (steps)

1. Amazon tracking ID: edit `amazonTrackingId` in `content/settings.yml` (Pages CMS "Site settings"), format `name-20` (schema rejects other shapes; empty allowed). All 53 product URLs use the `{amazonTrackingId}` placeholder and rebuild with the new ID. TESTED on a scratch copy: tag set to `buyertest-20` and rebuilt: `/guides/dog-car-safety-harness-and-crate-guide` showed 21 links with `tag=buyertest-20`, 0 with the old tag; `/gear/car-safety` 9 and 0. Tag set empty and rebuilt: both pages showed 0 Amazon links, 0 Amazon sentences, 0 notices; stay pages still showed Vrbo links. Also remember: Amazon only allows links on the site(s) listed in the application; list the domain.
2. GA4: create a property, copy the `G-` ID into `ga4MeasurementId` in `settings.yml` (schema: `G-` plus 6+ caps/digits, or empty = no tracking). Update `privacy` wording if the property owner changes.
3. Vrbo/Expedia deeplinks: `bun scripts/stay-deeplink-worksheet.ts` writes `docs/stay-deeplink-worksheet.csv` (one row per stay NOT yet listed because it has no approved link). For each row generate the deeplink in the Expedia Group creator hub, paste it exactly (never edit or shorten), set `approved` to `yes`, then `bun scripts/import-affiliate-links.ts docs/stay-deeplink-worksheet.csv` updates `content/affiliates.yml`; the stay is listed on the next build. The 32 existing deeplinks belong to the seller's account: the buyer must regenerate and replace all of them (ids stay `vrbo-<listingId>`), plus the generic `vrbo` entry. Until replaced, clicks credit the seller. Same flow for Amazon via `scripts/affiliate-worksheet.ts` and `docs/affiliate-link-worksheet.csv`.
4. Search Console: no verification file or meta tag exists in the repo (grep of `public/` and `__root.tsx`); `docs/LAUNCH-CHECKLIST.md` plans DNS TXT verification (add only, keep existing TXT records). Buyer verifies the domain in their own Google account and submits `/sitemap.xml`. Status: not done per that checklist.
5. Bing / IndexNow: key file `public/c020721357f8d6912ac3f66e4c956986.txt` (public by design). To use your own key, rename the file to a new key, put the same string inside, and run `node scripts/indexnow.mjs` (dry run) then `--send`. Import the site into Bing Webmaster Tools.
6. Impact: delete the `impact-site-verification` meta in `__root.tsx` (seller's token) and verify with the buyer's own Impact account when applying.
7. Pages CMS: `.pages.yml` exists but its header says it has NOT been opened in the live app. Buyer connects own GitHub repo, signs in to Pages CMS, relinks, edits "Site settings" and "Affiliate links" and confirms the form saves. Untested here.
8. Rebuild/deploy, then re-run a crawl like section 2 against the live site and confirm no old tag remains (`grep pawspassage-20`).

## 6. Realistic path (no numbers)

Content today: 30 published guides, 11 gear category pages, 32 listed stays, 9 destination pages, tools. Intent is high for stays (people planning dog-friendly trips) and gear.
1. Vrbo/Expedia first for stays once the buyer's own deeplinks are in (needs program approval in their account; terms not read today, UNVERIFIED).
2. Amazon Associates: the buyer applies; Amazon's help says the application is reviewed after qualifying sales and requires at least three within the first 180 days, personal orders excluded; a rejected account cannot be reinstated (search results quoting the "Application Review Process" and "Account Dormancy" pages; the pages themselves returned other content when fetched through my tool, so re-read them at https://affiliate-program.amazon.com/help/topic/t21/). Until approved, tagged links cannot be assumed to pay: consider leaving the tag empty (links and Amazon sentence disappear, maker links remain) rather than showing links that might not earn.
3. Awin (Fi, Petmate) and Impact (Tractive, Gunner) next: proposed only, see `docs/AFFILIATE-APPLICATION-PACK.md`; brand-by-brand approval.
4. Display ads last: Raptive states a 25,000 pageviews/month minimum (read today at raptive.com/creators/; RPM guarantee at 100,000 monthly PVs). Mediavine: its own posts (found via search, not fetched directly: page URLs 404/redirected) state 50,000 sessions/month for new publishers, verified by Google Analytics, with a lower-threshold Journey program; recheck at publishers.mediavine.com. Traffic is not shown anywhere in the repo, so which gate applies is unknown.
Traffic gates: Amazon needs real referred sales within 180 days of applying; ads need GA4 history, so install GA4 under the buyer's account on day 1.
Month 1: (a) take over domain, Netlify, GitHub, CMS; (b) create GA4 and Search Console and verify; (c) apply to Expedia/Vrbo and Amazon with the buyer's email and tax details; (d) replace the IDs per section 5 as approvals arrive (leave `approved: false` for anything not approved); (e) re-run the link crawl; (f) apply to Awin/Impact brands.

## 7. Known observations

- 10 products are `approved: false` (no buy box on 2026-11-18/19) and show a maker link instead; re-enable only after stock is confirmed.
- Three analytics events have no call sites (above).
- Several affiliates.yml notes still say "owner to pick size/confirm" for variant ASINs.

## 8. NOT verified

- Approval or good standing of any affiliate account (Amazon `pawspassage-20`, the Vrbo/Expedia creator account, Impact, Awin): needs account access (Cowork / owner). Config proves nothing about commissions.
- Whether any Amazon ASIN or Vrbo code resolves/pays today (bots blocked; zero requests made to either).
- That GA4 receives events; any traffic, earnings, conversion or click numbers.
- Search Console/Bing verification state; Google indexing.
- Pages CMS live behaviour.
- Current Vrbo/Expedia, Awin, Impact program terms (not read today); Mediavine figure read via search snippets only.
- Frozen build 4175 was down, so crawl is of a HEAD build I made; later content edits are not reflected.
