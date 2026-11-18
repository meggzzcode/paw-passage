# Travel essentials hub: design spec (investigation only, nothing implemented)

Date: 2026-11-18. Repo read: /home/user/paw-passage-aff. Labels: VERIFIED (read in repo or on a public page today), RECOMMENDATION, NEEDS-USER-ACTION, COULD-NOT-ACCESS.

## Summary (10 lines)
1. VERIFIED: 25 products exist in 6 files under src/content/gear/ (car 5, first aid 5, water/feeding 5, loose-dog 4, fence 3, rental protection 3). Only 17 are attached to a live guide; the 8 water/feeding and rental-protection products belong to guides retired by 301 (netlify.toml:59-70) and now appear only in the packing tool.
2. VERIFIED: no product has an approved affiliate link. content/affiliates.yml holds only 10 Vrbo "stay" links; no `kind: product` entry. So every button today is a maker-site link.
3. VERIFIED: no /gear route exists and no redirect, guide slug or file uses /gear. Recommended routes /gear and /gear/$category are collision-free.
4. Design: an editorial hub, one data file for categories plus an extended Product record, new route files, and reuse of GearPicks/productButton logic. No cart, no prices, no ratings.
5. The existing Product type already holds most of the owner's fields; missing: category tags, retailer URL, alternative retailer, network/approval (derivable from affiliates.yml), lastVerified, active flag, image policy.
6. Link logic: approved affiliate -> manufacturer -> plain retailer -> no button. Already implemented for the first two in src/content/affiliate-usage.ts `productButton`.
7. Images: no maker or retailer photos (docs/PRODUCT-PHOTOS.md: no brand grants blogger use). Use credited Unsplash category photos from the existing gear-* assets, or photo-less cards.
8. Product count is thin: 25 products across 9 requested categories; senior, beach, multi-dog and comfort have 0 dedicated products. I read 8 manufacturer pages for candidates (section 8); 5 others returned 404 and were skipped.
9. Estimate: about 14 new files, 9 edited files, 3-4 new or extended tests.
10. Biggest risk: safety-critical claims. The Ruffwear Load Up page says "crash tested" but names no testing body or CPS certification; do not repeat CPS language for it.

## 1. Inventory (VERIFIED, with file references)

| Area | What exists | Note |
|---|---|---|
| Product type | src/content/gear.ts:4-20 `Product`: id, name, brand, summary, keySpecs[], specSource{title,url,publisher,accessedOn}, productUrl?, affiliateId?. `GearPick` (23-31): productId, bestFor, whyItMadeTheList, watchOuts[]. Files auto-collected by `import.meta.glob("./gear/*.ts")` (gear.ts:37). | No category, no lastVerified, no "could not confirm" field. |
| Gear files | 6 files; ids listed in section 3. | Header comments: "No prices, ratings or tested claims". |
| GearPicks | src/components/site/GearPicks.tsx: heading "Picks by criteria", affiliate disclosure shown only if an approved link exists, "We haven't tested these products" line, card = bestFor eyebrow, brand+name, summary, why, keySpecs, "Check before you buy", spec source with accessedOn, button via `productButton`. Click tracking `trackProductClick`. | Reusable almost as-is; it takes `GearPick[]` and renders inside a guide. A hub card needs a compact variant. |
| Link logic | src/content/affiliate-usage.ts: `productLinkId` = affiliateId ?? id; `productButton` returns affiliate (rel "sponsored nofollow noopener") else direct maker link ("See it on X's website") else none (PDF spec URLs excluded). affiliates.ts `getApprovedLink` needs approved && url. `AMAZON_DISCLOSURE` exact sentence. | Stale doc warning: docs/AFFILIATE-OPPORTUNITIES.md section 2.3 describes a bug (GearPicks using affiliateId only); code now uses `productLinkId` in both places. |
| Affiliates data | content/affiliates.yml (51 lines): 10 Vrbo links, `kind: stay`, approved. `AffiliateLink`: id, network, url, approved, notes, kind. | docs/AFFILIATE-OPPORTUNITIES.md says `links: []`: stale. |
| Packing tool | src/components/site/PackingBuilder.tsx + src/lib/packing.ts (15 items, `productIds`, profile toggles car/rental/senior/bolter/noFence) + src/routes/tools.packing-list.tsx. Popover "Picks from our guides" shows up to 3 products with `productButton`. `guideFor()` finds the guide whose `gear` contains the product. | For the 8 orphaned products `guideFor` returns undefined, so no "How we chose" link, yet the label says "Picks from our guides". Hub fixes this. |
| Packing photos | src/content/pack-photos.ts: 15 Unsplash entries with photographer + URL; src/lib/pack-images.ts loads src/assets/pack-<id>.jpg (only items whose file exists get credited). Disclaimer line: "Photos are for illustration and do not show specific products". | Good precedent for the image rule. |
| Hero/images | src/lib/images.ts: `stockImages` map (key -> {src, card?, alt}); `guideHero`, `srcSetFor` (800 w variants from scripts/optimize-images.py), credits in src/content/image-credits.ts. Existing gear-* keys: gear-car-safety, gear-first-aid, gear-feeding, gear-rental-protection, gear-portable-fence, gear-id-tracking (each with -card and -800 files in src/assets). | Reusable for category tiles. Missing: beach, senior, multi-dog, comfort category images (guide-ca-beach, guide-senior, guide-two-dogs, guide-large-dogs, guide-how-many-dogs exist and could be reused). |
| Share images | tests/share-images.test.ts requires public/share/<slug>.jpg and public/pins/<slug>.jpg for every public GUIDE only (made by scripts/make-share-images.py). pageHead falls back to hero-porch for og:image (src/lib/seo.ts). | Hub pages are not guides, so no test forces share images; recommend 1 hub share image anyway. |
| Tools routes | tools.index.tsx (4 tool cards), tools.packing-list, checklist, pet-cost-check, will-my-dog-be-accepted, cost-calculator, host-questions. | |
| Nav | src/config/site.ts `nav`: Stays, Destinations, Dog rules, Guides, Tools (Stays and Dog rules filtered by launch state in SiteHeader). Footer cols Explore/Plan/About/Legal in SiteFooter.tsx. Header CTA: "Find a stay" or "Free tools". | |
| Homepage | src/routes/index.tsx: hero, "Browse by travel style", "Find the right trip for your dog" (dogTypes), destinations, "Read before you book" guides. No gear section. | |
| Dog types | src/content/dog-types.ts: /dogs/senior-dogs, /dogs/big-dogs, /dogs/multi-dog-families, /dogs/escape-artists, each with guideSlugs, live only with 3+ public guides. | Three of the owner's categories already exist as reader collections; hub should link to them, not rebuild them. |
| Sitemap | src/lib/sitemap-entries.ts `staticPaths` (hard-coded list). | New routes must be added here. |
| CMS | .pages.yml: guides have `gear` picks field (lines 172-179); category enum includes Gear; products are NOT editable in the CMS (TS files). | |
| Guides with gear | car-safety (4 picks used: sleepypod-clickit-range, saker-bomber-harness, sleepypod-atom, gunner-g1-kennel, lucky-duck-lucky-kennel = 5), first-aid (5), fence (3: midwest, carlson-convertible-pet-yard, north-states), content/guides/if-your-dog-gets-loose-on-a-trip.md (4, category Planning not Gear). | The loose-dog guide is category Planning, so TrustStrip "Not tested by us" does not show and the "gear guides need 3 picks" test (content.test.ts:49) skips it. Inconsistency. |
| Existing tests touching gear | content.test.ts:45-70 (product source, no prices/ratings, unique ids, picks resolve, affiliateId exists); packing.test.ts; affiliate-links.test.tsx (productButton); article-ux.test.tsx; pages-config.test.ts:43 (CMS gear fields equal schema); meta-brands.test.ts (guides' seo fields must not name vrbo/expedia/hotels.com/homeaway). | |

## 2. Routes (RECOMMENDATION)

- `/gear` (src/routes/gear.index.tsx): hub. Public nav label "Travel essentials"; URL stays short.
- `/gear/$category` (src/routes/gear.$category.tsx): one page per category; slugs below; unknown slug -> `notFound()`. Pattern matches destinations.$state.index.tsx / dogs.$slug.tsx.
- No per-product pages in v1 (thin pages, and product pages invite price/rating expectations). Product anchors `#<product-id>` on category pages for deep links from the packing tool and guides.
- Collision check: VERIFIED. Existing routes: about, affiliate-disclosure, contact, data.pet-policies, destinations.*, dog-rules.*, dogs.*, editorial-standards, guides.*, index, list-your-property, privacy, sitemap.xml, stays.*, terms, tools.*. No guide slug or redirect starts with /gear (grep of src, content, netlify.toml, public). All existing URLs, including the two 301s for retired gear guides, stay untouched. Optional: keep both 301s pointing at the cabin packing list; do not repoint them to /gear without a decision, since a retired-guide redirect to a topical page is already valid.
- Category slugs (all lowercase, hyphenated): `road-trips`, `cabin-vacations`, `beach-vacations`, `senior-dogs`, `large-dogs`, `multiple-dogs`, `travel-safety`, `feeding-and-hydration`, `travel-comfort`.
- Drop empty categories from nav, sitemap and tiles until they have 3+ active products (same gate as `dogTypeIsLive`), and set noindex on a category below that threshold. This keeps the "no thin pages" posture the site already uses.

## 3. Category map (existing product ids only)

Products may appear in more than one category (a `categories: string[]` array). Primary category is first.

| Category | Existing products (ids) | Count | Verdict |
|---|---|---|---|
| road-trips | sleepypod-clickit-range, saker-bomber-harness, sleepypod-atom, gunner-g1-kennel, lucky-duck-lucky-kennel, kurgo-heather-hammock, kurgo-kibble-carrier, kurgo-collaps-a-bowl | 8 | Adequate |
| cabin-vacations | midwest-exercise-pen-with-door, north-states-petyard-passage-8-panel, carlson-convertible-pet-yard, kurgo-loft-wander-dog-bed, orvis-embossed-sherpa-throw | 5 | Adequate, but all indoor/rental comfort; nothing cabin-specific (traction, cold weather) |
| beach-vacations | none (kurgo-collaps-a-bowl, springland bottles are generic hydration) | 0 dedicated | Gap |
| senior-dogs | kurgo-loft-wander-dog-bed (bed, "no weight listed"), kurgo-heather-hammock; none mobility-specific | 0 to 2 | Gap; do not claim senior suitability the makers do not state |
| large-dogs | gunner-g1-kennel (Large 71+ lbs not listed as CPS certified), lucky-duck-lucky-kennel (Large 70-110 lbs), sleepypod-clickit-range (to 110 lbs), tractive-dog-6-xl (dogs over 44.1 lbs) | 4 | Adequate if each states why it fits |
| multiple-dogs | north-states-petyard-passage-8-panel, midwest-exercise-pen-with-door, vittles-vault-travel-tainer (two bowls), springland bottles | 3-4 | Thin; no multi-dog-specific product (e.g. dual leash) |
| travel-safety | amk-me-and-my-dog, amk-trail-dog, kurgo-dog-first-aid-kit, kurgo-rsg-dog-first-aid-kit, baskerville-ultra-muzzle, akc-reunite-stainless-collar-tag, tractive-dog-6, tractive-dog-6-xl, fi-series-3-plus, plus the car-safety items cross-listed | 9 + | Strong |
| feeding-and-hydration | kurgo-collaps-a-bowl, springland-22oz-original-travel-bottle, springland-20oz-flip-travel-bottle, vittles-vault-travel-tainer, kurgo-kibble-carrier | 5 | Adequate; only 5 products and no sourced capacity beyond 24 oz / 6 cups |
| travel-comfort | kurgo-loft-wander-dog-bed, orvis-embossed-sherpa-throw, kurgo-heather-hammock | 3 | Thin |

Ids that currently lack any guide (orphans, section 1): kurgo-collaps-a-bowl, springland-22oz-original-travel-bottle, springland-20oz-flip-travel-bottle, vittles-vault-travel-tainer, kurgo-kibble-carrier, orvis-embossed-sherpa-throw, kurgo-loft-wander-dog-bed, kurgo-heather-hammock. The hub becomes their "how we chose" home (replacing the dead guideFor link in PackingBuilder).

Also note: dog-friendly-cabin-packing-list.ts:100 links "our rental protection gear guide" to /guides/dog-friendly-cabin-packing-list (itself): wrong link left after the retirement; fix to /gear/cabin-vacations when the hub ships (NEEDS an edit to that guide).

## 4. Product record: what to add (RECOMMENDATION)

Owner's desired fields mapped to the current type:

| Owner field | Today | Proposed |
|---|---|---|
| name, brand | `name`, `brand` | keep |
| category | none | `categories: GearCategory[]` (required, first = primary) |
| description | `summary` + `keySpecs` | keep; no new field |
| image | none | `image?: { key: ImageKey; kind: "category" } ` only; see section 6. Never a product photo field in v1 |
| manufacturer URL | `productUrl?` (falls back to `specSource.url` unless a PDF) | rename conceptually, keep field name `productUrl` to avoid churn |
| retailer URL | none | `retailerUrl?: string` plain, non-affiliate retailer page |
| affiliate URL | in affiliates.yml, joined by `affiliateId ?? id` | keep out of the product file (single place); do not duplicate the URL |
| network | `AffiliateLink.network` | derived from the link, not stored on the product |
| approval status | `AffiliateLink.approved` | derived; the product never stores its own flag (prevents fake-approved links) |
| alternative retailer | none | `altRetailer?: { name: string; url: string }` (plain link) |
| last verification date | `specSource.accessedOn` (spec date only) | add `lastVerified: string` (ISO date the whole record, incl. availability of the page, was re-read). Keep `accessedOn` per spec source |
| active/inactive | none | `active?: boolean` (default true). Inactive = hidden from hub and packing tool; kept in file for history |

Additional editorial fields (needed by the owner's per-product card requirement; today they live only inside a guide's `GearPick`):
- Hub copy per product per category: reuse `GearPick` (`bestFor`, `whyItMadeTheList`, `watchOuts`) stored in a new `src/content/gear-categories.ts` as `picks: GearPick[]` per category. Guide picks and hub picks may differ in wording; shared product facts stay in Product.
- `couldNotConfirm?: string[]` on Product (e.g. "Weight limits not stated on the maker's page"). VERIFIED precedent: keySpecs already contain such lines ("No weight is listed on the page"); a dedicated field makes them renderable as "What we could not confirm".
- `evidence: "researched"` (all current) vs a future `"tested"`: `basis: "researched" | "tested"`, default researched. The site rule is that nothing is claimed tested (content.test.ts:63 regex). Only allow `tested` when the owner supplies a dated, first-hand note field `testNote` and a photo they took; tests must fail if `basis: "tested"` has no `testNote`.
- Zod/CMS: products are TS, not in .pages.yml; no pages-config test change needed. If the owner wants CMS editing of products, that is a separate migration (move to content/gear.yml); out of scope.

## 5. Link fallback logic (RECOMMENDATION, extends `productButton`)

Order of the single primary button:
1. Approved affiliate link (`getApprovedLink(productLinkId(p))`, approved && url): label "See it at {network}", `rel="sponsored nofollow noopener"` (as today).
2. Manufacturer: `productUrl` or non-PDF `specSource.url`: label "See it on {brand}'s website", `rel="noopener noreferrer"` (as today).
3. Retailer: `retailerUrl` plain link, label "See it at {retailer}", `rel="noopener noreferrer"`. Never labelled sponsored; never has a tracking tag.
4. Nothing. Never a search-results URL or a generic Amazon search (docs/AFFILIATE-OPPORTUNITIES.md already forbids this).

Secondary line "Also at {altRetailer.name}" renders only if `altRetailer` is set and is a plain link.

Rules:
- Never fake: a link is affiliate only if its entry exists in affiliates.yml with approved true; the product file stores no affiliate URL. Test: every `rel` containing "sponsored" must come from an approved link (extend affiliate-links.test.tsx).
- rel per network: all affiliate links keep `sponsored nofollow noopener` regardless of network. Amazon: also show `AMAZON_DISCLOSURE` exactly (affiliates.ts) near any approved Amazon link, not on the hub pages when no Amazon link is approved. Amazon links must be Amazon-tagged links from the Associates account, no shorteners (docs/AFFILIATE-PROGRAMS.md). Network-specific disclosure text: none confirmed for Awin/AvantLink/Pepperjam/Impact: NOT CONFIRMED, check in each dashboard.
- Affiliate link kind: new entries use `kind: product`; `affiliateId` must exist (already tested content.test.ts:68). Add: a `kind: stay` link must never be used by a product (new test).
- Disclosure placement: top of each hub page whenever any approved product link renders (reuse `hasAffiliateLinks`-style check across the page's picks), plus a link to /affiliate-disclosure. NEEDS-USER-ACTION/EDIT: src/routes/affiliate-disclosure.tsx and the editorial-standards "Money" paragraph only describe booking links today (docs/AFFILIATE-OPPORTUNITIES.md section 2.1); update before the first product link goes live.
- Chewy was declined on Impact: no Chewy affiliate links, and the hub must not imply a Chewy relationship.
- Visible "Sponsored"/"Affiliate link" text label next to affiliate buttons: recommended (the old water guide promised it; GearPicks only sets rel).

## 6. Image rules (RECOMMENDATION)

Evidence: docs/PRODUCT-PHOTOS.md (research 2026-11-17): no brand on the list was found to grant blogger use of its photos; credit does not cure infringement; hotlinking legally unsettled; Unsplash licence allows free use with attribution appreciated but says nothing on trademarks.

Rules for the hub:
1. No scraped, copied, re-hosted or hotlinked maker or retailer product images. Enforce with a test: no `<img>` on /gear pages with an external `src`; images only from src/assets via the `images` map.
2. Allowed imagery: (a) category photos from the existing credited Unsplash set (gear-car-safety, gear-first-aid, gear-feeding, gear-rental-protection, gear-portable-fence, gear-id-tracking; reuse guide-ca-beach, guide-senior, guide-two-dogs, guide-large-dogs, guide-how-many-dogs for beach/senior/large/multi) used for category tiles and hero only; (b) credit lines via image-credits.ts as today.
3. Product cards are photo-less by default (icon + text, like the packing tool's fallback `Icon`). A product photo is allowed only with a written permission on file (the owner's permission email template exists in docs/PRODUCT-PHOTOS.md section 5a) or the owner's own photo of a unit they bought; add `image.kind: "permitted" | "own"` with `permissionRef`/`photoCredit` required, and a test that fails without them. v1 ships without any.
4. A caption line under category photos: "Illustration only. Photos show dogs and gear in general, not the products below." (mirrors PackingBuilder line 119.) Do not place a stock photo of a dog in a harness next to a named harness; keep photos on tiles/hero.
5. Stock photos still follow the owner rule "photos must match articles and never repeat": a photo used on a guide hero should not be reused as a tile on the same page. Using the same asset on two different pages is a repeat the owner may object to; NEEDS-USER-ACTION: decide whether category tiles may reuse guide heroes, or whether 4-5 new Unsplash photos (beach, senior, large, multi, comfort) are sourced (needs scripts/optimize-images.py run and image-credits.ts entries).
6. Retailer-served images (Amazon SiteStripe): not before Amazon approval and the 3-sales-in-180-days rule; not part of v1.

## 7. Page layout (text wireframe)

### /gear (hub)
```
[Breadcrumb: Home > Travel essentials]
HERO: H1 "Travel essentials for dogs" ; dek 1-2 sentences ("Researched gear picks for road trips, rentals and the beach. Not a store: no prices, no ratings, and we say what we could not confirm.")
      hero photo (credited Unsplash, caption "Illustration only")
DISCLOSURE strip (only if an approved product link exists) + link /affiliate-disclosure
CATEGORY TILES (grid, 3 col desktop / 1 col phone): photo or icon, name, one-line, product count   x9 (live ones only)
HOW WE PICK (block):
   - Researched: every product is chosen against stated criteria from the maker's own page or an independent standard; each spec cites its source and read date.
   - Personally tested: none yet. Nothing is marked tested unless a dated first-hand note is shown.
   - Selection is fixed before links: we list products whether or not a programme pays; a link, if present, never changes what we write. (supports docs/AFFILIATE-OPPORTUNITIES.md point 6)
   - Re-verified: each card shows "Last verified {date}".
START WITH A GUIDE: 4 cards: car safety, first aid, portable fence, lost dog (existing GuideCard)
TOOLS: Pack your dog's bag (/tools/packing-list)
DISCLOSURE (footer block): link to /affiliate-disclosure and editorial standards
```
### /gear/<category>
```
Breadcrumb: Home > Travel essentials > {Category}
H1 + dek ; short "Who this is for" and "What to check first" (3 bullets, from existing guide facts only)
Link strip: related dog-type page (/dogs/senior-dogs, /dogs/big-dogs, /dogs/multi-dog-families) and related guides
COMPARISON TABLE (see below)
PRODUCT CARDS (one per product, anchor id):
   eyebrow  bestFor
   H3       Brand + Name         badge "Researched, not tested by us"
   summary
   Why it made the list
   Key specs (from maker; source link + read date)
   Check before you buy (watchOuts)
   What we could not confirm (couldNotConfirm)
   Last verified {date}
   [Primary button per fallback]  [Also at {alt retailer}]   (affiliate buttons carry a visible "Affiliate link" label)
RELATED GUIDES (from guides whose gear[] contains these products, via a productId -> guide lookup that replaces the dead guideFor)
DISCLOSURE + AMAZON sentence if applicable
```
Comparison table columns (no price, no stars): Product | Best for | Key spec the maker states (1 line) | Sized for (only if the maker states weights/girth) | Not stated by the maker | Last verified. Table is a plain `<table>` with scoped headers; horizontal scroll wrapper on phones.

## 8. Homepage and navigation (RECOMMENDATION)

- Header: add `{ to: "/gear", label: "Travel essentials" }` to `nav` (src/config/site.ts) between Guides and Tools. Five items already; mobile menu and noscript nav map `nav`, so no component change. Check width: replacing none, "Travel essentials" is long; alternative label "Gear" if the header wraps (visual check needed). Gate the item with a `hasGear()` helper like `hasStays` (true when 3+ active products and one live category).
- Footer: add `["/gear", "Travel essentials"]` to the Explore column; add per-category links to the Plan column only if space allows (otherwise hub only).
- Homepage: one new section after "Find the right trip for your dog": "Travel essentials" with 3 category tiles (road trips, travel safety, feeding and hydration, i.e. the strongest) and a "See all" link; reuse the tile markup from "Browse by travel style". Do not add gear copy to the hero.
- /tools index and PackingBuilder popover: add "How we chose" link to `/gear/<category>#<id>`; fixes the orphan issue.
- Guides: GearPicks gets a link "More {category} picks" to the matching /gear page. Guides.index already has a "Gear guides" group (guides.index.tsx:17); add a link to the hub there.
- Sitemap: add "/gear" and each live category to `staticPaths`/a helper in src/lib/sitemap-entries.ts, gated by the same live check.

## 9. SEO (RECOMMENDATION)

- Titles/meta via `pageHead` (src/lib/seo.ts). Keep under 60/160 characters like content.test.ts:40. Hub: title "Dog Travel Gear We Researched" (no site name needed; pageHead appends it, mind the 60-character total? the guide test limits seoTitle only; keep titles short). Description: "Researched dog travel gear for road trips, rentals and the beach, with sources, what we could not confirm and no fake reviews."
- Expedia rule (meta-brands.test.ts): no vrbo, expedia, hotels.com or homeaway in title or description of any hub page. Product brand names (Sleepypod, Kurgo...) in meta are not covered by that rule, but prefer category language in meta for the same reason (avoid implying endorsement) except where it helps (e.g. none needed).
- Extend meta-brands test to cover hub meta (new test).
- Canonical: `pageHead` already sets it. Category pages below the live threshold: `noindex: true`.
- JSON-LD: `breadcrumbLd` already exists (seo.ts) and fits. `ItemList` (schema.org) of products is allowed only if honest: list `name` and `url` of the on-page anchors, no `aggregateRating`, no `review`, no `offers`/price. Recommendation: ship BreadcrumbList only in v1; add ItemList later only if desired. Do not mark products as `Product` with brand-owned images or ratings.
- Share image: one hub share image in public/share (not test-enforced); the pageHead image falls back to hero-porch.
- No thin pages: category pages with fewer than 3 products are noindex and out of the sitemap.

## 10. Tests (src/test)

Add:
- src/test/gear-hub.test.ts (new): every product has at least one valid category; category slugs unique; every category's picks resolve to real, active products; live-category gate; no prices/ratings/"tested" claims in hub copy (same regexes as content.test.ts:52,63); `basis: "tested"` requires `testNote`; no external image `src`; inactive products excluded; `lastVerified` is an ISO date no later than today and not older than a configurable limit (warn only).
- src/test/gear-routes.test.tsx (new): `router.matchRoutes("/gear")`, `/gear/road-trips` match a non-root route; unknown category 404s (pattern from app-routing.test.tsx); no existing static path collides (compare against staticPaths).
- src/test/affiliate-links.test.tsx (extend): fallback chain (affiliate > manufacturer > retailer > none); a retailer link never has `sponsored`; `kind: stay` ids never used by products; Amazon sentence appears with an approved Amazon link.
- src/test/meta-brands.test.ts (extend): hub meta contains no Expedia Group brands.
- src/test/sitemap tests (there is a launch-state/sitemap-related area; add a case or a new sitemap-gear test): hub and live categories present; non-live absent.
Adjust:
- src/test/content.test.ts: loop already covers all products; update only if new required fields are added (it checks `specSource.url` and no prices in `JSON.stringify(p)`; new notes like `couldNotConfirm` must stay free of `$n`, "stars", "rated n").
- src/test/packing.test.ts: add an assertion that each packing product resolves to a category page anchor.
- src/test/pages-config.test.ts: no change unless guide schema `gear` fields change (it does not).
- src/test/share-images.test.ts: unchanged (guides only).
- scripts/optimize-images.py / image tests: src/test/images.test.ts will pick up any new `stockImages` keys; run after adding.

## 11. Work estimate (files)

New (about 14): src/routes/gear.index.tsx, src/routes/gear.$category.tsx, src/content/gear-categories.ts, src/components/site/GearCard.tsx (compact card, shares logic with GearPicks), src/components/site/GearCompareTable.tsx, src/lib/gear-hub.ts (live gate, product->guide lookup), 4 tests (gear-hub, gear-routes, plus extensions counted below), up to 5 new Unsplash assets x3 sizes plus image-credits (owner decision), 1 share image, and new product files for added products (e.g. src/content/gear/road-trips-and-beach.ts).
Edited (about 9): src/content/gear.ts (type), src/content/affiliate-usage.ts (retailer fallback), src/components/site/GearPicks.tsx (visible affiliate label, hub link), src/components/site/PackingBuilder.tsx (guideFor replacement), src/config/site.ts (nav), src/components/site/SiteFooter.tsx, src/routes/index.tsx, src/lib/sitemap-entries.ts, src/routes/affiliate-disclosure.tsx and src/routes/editorial-standards.tsx (product-link wording), src/lib/images.ts + src/content/image-credits.ts (new images), src/content/guides/dog-friendly-cabin-packing-list.ts (broken self link), src/routes/guides.index.tsx (link). routeTree.gen.ts regenerates automatically.
Effort: roughly 2-3 working days of code plus review, excluding content research for new products and photo sourcing.

## 12. Product-count adequacy and candidates

Assessment (VERIFIED counts above): 25 products; 4 live gear guides use 17 (car 5, first aid 5, fence 3, loose-dog 4). For a "hub" a category page wants at least 3 and ideally 4-6 products. Meeting the 3-product threshold: road trips, cabin, large dogs, travel safety, feeding, comfort (barely). Short: beach (0), senior (0 dedicated), multiple dogs (thin). The packing tool has 15 items but 3 have no products to show (paperwork, meds-food, leash-waste, towels = 4 items without products) and several items have only one product, so recommendations feel one-sided. Docs/AFFILIATE-OPPORTUNITIES.md section 2.4 also lists gaps: strap kits for the two crates, dog-only towels, a larger bowl, a leash, a tick tool, a traction runner.

Candidate products. Method: I fetched each manufacturer page on 2026-11-18 and note only what the page stated. These are candidates for the owner to approve; none is added to the repo. Prices appear on some pages; do not store them (site rule).

| Proposed product | Category | URL read | Specs actually read | Cautions |
|---|---|---|---|---|
| Ruffwear Float Coat Dog Life Jacket | beach-vacations, travel-safety | https://ruffwear.com/products/float-coat-dog-life-jacket | Sizes XXS-XL by girth: XXS 13-17 in, XS 17-22, S 22-27, M 27-32, L 32-36, XL 36-42. Shell 800D ballistic polyester with DWR and PU, EVA and PE layered foams, side-release buckles. Hand wash, air dry. Page describes "optimal buoyancy" | Page states no weight ranges and no flotation certification or buoyancy rating: record as "could not confirm" |
| Ruffwear Load Up Dog Car Harness | road-trips, large-dogs | https://ruffwear.com/products/load-up-dog-car-harness | Sizes XXS-L/XL by girth (L/XL 32-42 in). Described as "a crash tested dog harness"; strength-rated hardware; universal seat belt loop attaches to existing belts | Page names no testing body and no CPS certification: do not say "CPS certified". Safety-critical; must sit beside the Sleepypod/Saker picks with the CPS caveat and no weight limits stated |
| Ruffwear Web Master Dog Harness | senior-dogs (conditional), travel-safety | https://ruffwear.com/products/web-master-dog-harness | Sizes XXS-L/XL by girth; reinforced padded lift handle ("balanced lift and assist support"); 150-denier polyester ripstop, closed-cell foam padding; aluminum V-ring back leash attachment | Page says nothing about older or mobility-limited dogs, so do NOT list it as a senior pick unless a veterinary or independent source is found. All sizes showed out of stock |
| Ruffwear Swamp Cooler Cooling Vest | beach-vacations, travel-comfort | https://ruffwear.com/products/swamp-cooler-dog-cooling-vest | Sizes XXS-XL by chest girth; works by wetting the vest (evaporative), light outer fabric, UPF 50+ per page, mesh lining; leash portal on the back; cold-water gentle-cycle wash | Sizing guidance inconsistent on page (size up vs smaller). Cooling effectiveness is the maker's claim; do not present as heat-stroke prevention. Out of stock at read time |
| Ruffwear Quencher Packable Dog Bowl | feeding-and-hydration | https://ruffwear.com/products/quencher-dog-bowl | Medium listed 5.5 in opening, 4.2 cups (1 L); 300D polyester ripstop shell, 210D nylon taffeta lining with 4,000 mm waterproof rating, food-contact safe; hand wash | Only Medium shown; "Coming Soon" and out of stock at read time |
| Ruffwear Grip Trex Dog Boots | cabin-vacations, travel-comfort | https://ruffwear.com/products/grip-trex-dog-boots | Sold as a set of two; paw widths 1.50-3.25 in; Vibram non-marking outsole, polyester mesh upper; wash cold, air dry; described as for hiking, biking, running | Page does not claim hot-sand or senior-grip use. Out of stock at read time |
| Ruffwear Highlands Dog Sleeping Bag | cabin-vacations, travel-comfort | https://ruffwear.com/products/highlands-dog-sleeping-bag | Medium 25.2 x 33.5 in, Large 28.3 x 43.3 in flat; loft 2 in; weights 1.6 lb (M) and 2.2 lb (L); 75D cire polyester shell, 120 g recycled polyester insulation; compression sack; tumble dry low | Aimed at trail/camp/backcountry, not rental furniture; out of stock at read time. Page also shows a rating (4.7 from 100 reviews): do not copy ratings |
| Ruffwear Knot-a-Leash | travel-safety, large-dogs | https://ruffwear.com/products/knot-a-leash-dog-leash | 5 ft in Small (7 mm rope) and Large (11 mm); reflective polypropylene kernmantle rope; aluminum tri-action autolocking carabiner; accessory loop for bags | Nothing stated about strength rating or fit by dog weight |

Single-brand concentration: all 8 are Ruffwear because Ruffwear's pages loaded. That is a selection bias, not an editorial choice; the owner should diversify before adding (we do not know Ruffwear's affiliate status: NOT CONFIRMED; do not state it runs one). The hub should choose products on criteria, never on programme availability.

Skipped (COULD-NOT-ACCESS, page returned 404 on 2026-11-18, no workaround tried): Lucky Duck Lucky Ratchet Strap Kit (https://www.luckyduck.com/products/lucky-ratchet-strap-kit), Kurgo Wander Hammock (https://www.kurgo.com/dog-travel/wander-hammock), ThunderShirt Classic (https://thundershirt.com/products/thundershirt-classic), PetSafe Happy Ride Folding Dog Ramp (https://www.petsafe.com/products/happy-ride-folding-dog-ramp, after the redirect from petsafe.net), Ruffwear The Beacon (https://ruffwear.com/products/the-beacon-safety-light-for-dogs). These URLs were guesses; the right URLs may differ. The exercise was not repeated with search-found URLs.

Recommended additions by category (to reach 3+ per category), subject to the criteria and sources:
- beach-vacations: Float Coat, Swamp Cooler (both read). A third (shade/paw/sand) not researched: NEEDS-USER-ACTION or a follow-up read.
- senior-dogs: no candidate qualified. A ramp or orthopedic travel bed page could not be read; Web Master read but not senior-supported. Hold the category (noindex) until 3 sourced items exist, or make it a guide-led page (it already exists at /dogs/senior-dogs).
- multiple-dogs: no candidate read (dual-leash coupler, large shared water bowl). Hold.
- large-dogs: Load Up, existing Lucky Kennel Large, Clickit (to 110 lbs), Tractive XL: enough with Load Up.
- travel-comfort: Highlands, Grip Trex, Swamp Cooler plus existing 3: enough.
- feeding-and-hydration: Quencher adds a 4.2-cup option.
- Road trips: strap kits remain the most useful add (they are required by the crates' crash-rating claims in the maker text), but the pages were not loadable.

## 13. Prioritized recommendations

| # | Priority | Item | Expected impact | Effort | Ongoing cost | Dependencies |
|---|---|---|---|---|---|---|
| 1 | High | Hub routes /gear and /gear/$category with live-gate and noindex rule | New indexable commercial-intent pages from content already researched; gives orphaned products a home | M (2-3 days) | Re-verify products on a schedule (add `lastVerified` review every ~90 days) | None |
| 2 | High | Extend Product (categories, retailerUrl, altRetailer, lastVerified, active, couldNotConfirm, basis) | Delivers the owner's data model without duplicating affiliate data | S | Low | #1 shares it |
| 3 | High | Update disclosure page and editorial standards for product links; add visible "Affiliate link" label | Required before first product link goes live (docs/AFFILIATE-OPPORTUNITIES.md 2.1) | S | None | Owner copy approval |
| 4 | High | No product photos in v1; credited Unsplash category photos only | Avoids copyright risk (docs/PRODUCT-PHOTOS.md) | S | Photo sourcing | Owner decision on image reuse |
| 5 | Medium | Tests listed in section 10 | Prevents fake affiliate links, prices, ratings, external images | S | Low | #1, #2 |
| 6 | Medium | Add 4-8 sourced products (beach, comfort, large) after owner chooses brands | Fills thin categories | M | Re-read pages | Owner approval; fix the 404 URLs by search |
| 7 | Medium | Homepage block, nav item, footer, tools links | Discovery | S | None | #1 |
| 8 | Low | ItemList JSON-LD (no ratings) | Minor SEO | S | None | #1 |
| 9 | Low | Fix retired-guide leftovers (PackingBuilder `guideFor`, cabin packing guide self-link) | Honesty and navigation | S | None | #1 |

## Needs your personal action
1. Decide the hub name in the nav ("Travel essentials" vs "Gear").
2. Decide whether category tiles may reuse existing guide photos or whether new Unsplash photos should be sourced (owner rule: photos never repeat).
3. Approve which candidate brands/products to add, and whether to diversify beyond Ruffwear; none was added to the repo.
4. Send permission emails (template in docs/PRODUCT-PHOTOS.md) only if you want maker photos later.
5. Approve the disclosure wording change before any product affiliate link goes live.
6. Decide if any product will be marked "tested": only possible if you buy and use it and supply a dated note and your own photo.

## Could not verify
- Five candidate product pages (404, listed in section 12). Ruffwear's affiliate programme status and any Ruffwear image-use terms: not looked up.
- Availability: all Ruffwear pages read showed items out of stock at read time, except Load Up, Float Coat and Knot-a-Leash where the page text gave no stock note. Availability changes; do not assert it.
- Network-specific disclosure wording (Awin, AvantLink, Pepperjam, Impact): NOT CONFIRMED.
- Whether category tiles at 9 categories fit the header/tiles visually; not rendered (no builds run).
- docs/AFFILIATE-PROGRAMS.md lists ids that no longer exist in the gear files (e.g. carlson-extra-wide-walk-thru-gate-0930, akc-reunite-reflective-id-collar, carlson-36-extra-tall-walk-thru-gate, carlson-design-paw-freestanding-gate) and says 27 products (repo has 25); not reconciled here.
