# Presale browser QA results (final production build, local)

Date: 2026-11-24. Build: `NITRO_PRESET=node-server bunx vite build`, served with `node server/index.mjs` on localhost; Playwright Chromium (headless); axe-core (npm cache). Nothing was deployed and no production URL was touched. Third-party hosts (Google Tag Manager, Amazon, Vrbo) were blocked in the browser, so no external site was followed. The first pass ran against the HEAD build (9797221); the defects below were fixed and the checks were re-run against the rebuilt site.

## Summary

- Pages: 21 URLs x 7 widths (320, 375, 390, 430, 768, 1024, 1440) = 147 page checks. After fixes: 147 PASS, 0 ISSUE. Before fixes: 8 checks failed (see Defects).
- Journeys: 5 of 5 pass (one note on the cabin guide link, below).
- Console errors and failed requests on the final build: 0 (the only failed request is the deliberately blocked `googletagmanager.com/gtag/js`).
- Internal link crawl (3 per page at 390): 63 links, all 200.
- axe-core: 0 serious, 0 critical on the final build (all 21 pages at 390 and 1440, 42 runs). Before fixes it found 2 serious/critical rule types (see Defects).
- Unit tests 771 pass, `tsc` clean, `eslint --quiet` clean, `scripts/verify-site.mjs`: 286 checks passed, 0 failed.

## Page table (final build)

Each row ran: horizontal overflow, raw markdown / `[[n]]` / `{{` / `undefined` leaks, duplicate FAQ headings, image load (visible images `naturalWidth > 0`), console and page errors, failed requests, affiliate notice near the top where affiliate links exist, the exact Amazon sentence where Amazon links exist, no per-button "Affiliate link" label on Amazon buttons, no "Check the current price", landmarks (one `main`, one `h1`), form labels, heading order, keyboard focus visibility, and 3 internal links.

| Page | Width | Result | Note |
|---|---|---|---|
| / | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /guides | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /guides/how-vacation-rental-pet-fees-work | 320, 375, 390, 430, 768, 1024, 1440 | PASS | Sources list and affiliate notice present; hidden desktop-only Keep reading rail not loaded on phones (by design) |
| /guides/vacation-rentals-that-welcome-large-dogs | 320, 375, 390, 430, 768, 1024, 1440 | PASS | Sources list and affiliate notice present; hidden desktop-only Keep reading rail not loaded on phones (by design) |
| /guides/dog-friendly-cabin-packing-list | 320, 375, 390, 430, 768, 1024, 1440 | PASS | Sources list and affiliate notice present; hidden desktop-only Keep reading rail not loaded on phones (by design) |
| /gear | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /gear/car-safety | 320, 375, 390, 430, 768, 1024, 1440 | PASS | Non-affiliate Amazon source link (no tag) correctly has no sponsored rel; all CTAs sponsored |
| /gear/rental-cleanup | 320, 375, 390, 430, 768, 1024, 1440 | PASS | Non-affiliate Amazon source link (no tag) correctly has no sponsored rel; all CTAs sponsored |
| /gear?trip=cabin-stay | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /gear?trip=road-trip | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /tools/packing-list | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /data/pet-policies | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /tools/will-my-dog-be-accepted | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /tools/checklist | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /stays | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /stays/5-star-cabin-with-views-and-hot-tub-cherry-lake | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /stays/avila-beach-retreat-for-pets-and-families | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /destinations/georgia/blue-ridge | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /destinations/georgia/blue-ridge/things-to-do | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /about | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |
| /contact | 320, 375, 390, 430, 768, 1024, 1440 | PASS | No overflow, no leaks, images load, no console errors |

Notes on the table:
- `/gear/car-safety` and `/gear/rental-cleanup` each contain one untagged Amazon "listing as read" source citation (no affiliate tag, no `sponsored`); every Amazon product button is `rel="sponsored nofollow noopener"`, `target="_blank"`. Intended.
- On the three articles, the "Keep reading" card rail is `max-lg:hidden`, so its lazy images are never requested below 1024 px; at 1024 and 1440 they load.
- Source links: the three articles each have a "Sources and how we researched this" list (7, 18 and 7 links, `rel="noopener noreferrer"`, `target="_blank"`) plus inline source links in the body (13, 38 and 15).
- Affiliate notice sits at about 436 to 470 px from the top of the article pages, and above the first product on `/gear`, with the sentence "As an Amazon Associate I earn from qualifying purchases."

Screenshots reviewed (final build): `docs/editorial/img/qa-final-{home,article,gear,planner,stays,stay}-{390,1440}.png`.

## Journeys (actual results)

1. Cabin planner (`/tools/packing-list?trip=cabin&days=3&dogs=2`, 390 px): the preset opened with 3 days and 2 dogs; "Build my packing list" produced 15 items. "Add to my list: Collapsible travel crate" took the list to 16 items and left "Need to buy" unchecked (0 checked, no product card). Ticking "Need to buy: Your dog's usual food" showed "Added to your shopping list" and a "Things to pick up before you go" entry (no product yet for that item, shown honestly). Ticking every item showed product cards for 8 items. CTA: "View at Amazon", `href=https://www.amazon.com/dp/<ASIN>?tag=pawspassage-20`, `rel="sponsored nofollow noopener"`, `target="_blank"`; the exact Amazon sentence appears; no "Check the current price"; no per-button "Affiliate link" label. "Explore more travel gear" opened `/gear?trip=cabin-stay#trip-collection` ("Gear for a cabin stay"); Back returned to the planner with 16 items, the extra and the Need to buy tick intact, and a reload kept them. PASS.
2. Road-trip Gear (`/gear?trip=road-trip`): 13 product cards; the first card (Kurgo harness) has "See it at Amazon" (sponsored, `_blank`), "Details and specs", a maker link (`nofollow noopener`) and, inside "Specs, fit and sources", a guide link to `/guides/dog-car-safety-harness-and-crate-guide`, which opened correctly. PASS.
3. Accommodation research (`/stays`): 78 stays listed. Filtering by State at 390 px (Filters drawer) gave 31 California stays; search `q=avila` gave 2. The listed stay `/stays/avila-beach-retreat-for-pets-and-families` is `noindex, nofollow`; the indexable stay (`/stays/5-star-cabin-with-views-and-hot-tub-cherry-lake`, in the sitemap) has no robots block. Both booking links are `https://vrbo.com/affiliate/Gp528Du`, `rel="sponsored nofollow noopener"`, `target="_blank"`, labelled "See photos and check dates on Vrbo" / "View on Vrbo" with "Affiliate link · We may earn a commission if you book, at no extra cost to you." beside them. PASS, with one wording note: no stay shows the literal words "Not yet verified". The owner removed those tags on 2026-11-18 (commit 13ce3f8); the pages say "Details read from the listing, not confirmed with the host", "Anything marked Not confirmed is unknown, not a yes" and "Confirm the fee, dog limits and fence with the host in writing". Buyer docs that say stays are "labelled Not yet verified" (BUYER_ASSET_INVENTORY, BUYER_OVERVIEW, BUYER_WALKTHROUGH_SCRIPT) should be reworded to match.
4. Research (`/data/pet-policies`): source method and "re-checked every figure against the live page" text visible; CSV link `/pet-policies-38-managers.csv` returns 200 `text/csv` (40 lines); 5 related guides linked, the first three return 200. PASS.
5. Owner maintenance: in a scratch copy (main tree untouched, copy deleted), a marker sentence was added to a product `summary` in `content/products.yml` and to a paragraph of `content/guides/how-vacation-rental-pet-fees-work.md`; after `vite build` the served HTML of `/gear/feeding-and-hydration` and of the guide contained the respective markers; the unedited build did not. PASS.

Also verified:
- Print: with `page.emulateMedia({media: "print"})` and `page.pdf` (Letter) the built cabin list prints to 2 pages; no `.no-print` element is visible.
- "Start over" opens a confirmation ("Start over? This clears your list, quantities and extras from this device."); the list is unchanged while it is open and after "Keep my list".
- Preset conflict: with a saved 3 day / 2 dog list, opening `/tools/packing-list?trip=cabin&days=5&dogs=1` shows "You already have a saved list ... Which would you like?". "Continue my saved list" keeps the list and clears the URL; "Start with this preset" opens setup with 5 days and 1 dog and clears the URL.
- Note: the cabin guide's own links point to plain `/tools/packing-list` (no `trip`, `days` or `dogs`), so that link does not apply a preset; the preset URL itself works as above. Not changed (content decision).

## Console errors and failed requests

Final build: none. Excluded by design: `net::ERR_FAILED` for `https://www.googletagmanager.com/gtag/js?id=G-1J97C8CPC1` (third-party analytics blocked in the test browser). The test harness otherwise logged `pageerror`, `console.error` and any same-origin HTTP status of 400 or more; there were none.

## Accessibility (axe-core 4.x plus script checks)

- Final build: 0 serious, 0 critical, 0 moderate on the pages re-run after the last fix (trip collections, home, stays, blue-ridge, packing list at 320, 390 and 1440); 0 serious/critical on all 21 pages at 390 and 1440. One `main` and one `h1` on every page; every form control labelled; keyboard Tab shows a visible focus indicator at 390 and 1440 on every page.
- Before fixes: color-contrast (serious) on terracotta eyebrow text, 2.6 to 2.8:1 (home 14 nodes, article 3 to 6 nodes) and the home "List your property" button; label (critical) on the unlabelled disabled task-list checkboxes in articles (5 on the fee guide, 25 on the cabin list); landmark-unique (moderate) on article table regions and on trip-collection sections; heading-order (moderate) on `/stays`. All fixed.
- Not covered by automation: screen reader behaviour, zoom and text-spacing user settings, reduced motion.

## Defects found and fixed

| # | Where | Evidence | Fix |
|---|---|---|---|
| 1 | `/stays`, 320 px | Sort control row 26 px wider than the viewport (horizontal scroll) | Wrap the count / Filters / Sort row (`stays.index.tsx`) |
| 2 | `/destinations/georgia/blue-ridge`, 320 and 375 px | 65 px and 10 px overflow from a `whitespace-nowrap` source credit | `sm:whitespace-nowrap` only (`destinations.$state.$town.tsx`) |
| 3 | Home, articles, gear (all widths) | Terracotta eyebrow text 2.6 to 2.8:1 (axe serious); home button text on light terracotta | New `--terracotta-text` token for eyebrows and pick labels; home button uses `bg-terracotta-button` |
| 4 | Article task lists (fee guide, cabin list) | Disabled checkboxes with no accessible name (axe critical) | Checkbox gets `aria-label` from its item text (`Markdown.tsx`) |
| 5 | Article tables; trip collections on `/gear` | Duplicate landmark names | Numbered table region labels; collection section labelled "heading: N picks" |
| 6 | `/stays` | Heading order h1 then h3 | Visually hidden h2 before the cards |
| 7 | `/stays` intro | Said "this directory lists 32 stays" while 78 are shown | Count now comes from the list |
| 8 | Planner "Need to buy" product cards | "See more trail and hiking gear gear"; "id, gps and first aid" lower-cased | New `categoryGearPhrase` helper; no repeated word, acronyms kept |

Code commit: 84c0577 (fixes 1 to 8). Docs and screenshots commit follows it.

## UNVERIFIED (could not be tested here)

- Real iPhone Safari (WebKit rendering, safe-area insets, sticky header and Filters drawer behaviour, print dialog). Chromium emulation only.
- VoiceOver and other screen readers; real keyboard-only passes beyond the scripted Tab checks.
- Production: DNS, headers and caching behind Netlify, the real Google Tag Manager / GA4 load, redirects and the live sitemap domain. Run `node scripts/verify-site.mjs https://<domain> --site-url https://<domain>` after deploy.
- Amazon and Vrbo destinations (external sites were not followed), affiliate link validity and attribution in the partners' dashboards.
- Real-world 3G performance and Core Web Vitals.


## Owner-reported update (2026-11-25)
The owner reported that real iPhone Safari looks good. This is the owner's statement; no screenshots or per-page notes were captured, so it is recorded as owner-reported, not as a tested result. Safari should be re-checked on the live site after the deploy using docs/cowork/FINAL_PRE_SALE_BROWSER_QA.md.
