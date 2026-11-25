# Trend articles: Amazon product matrix (stage E2)

Status: research and audit, 2026-11-25. Docs only; no code, guide, `products.yml`, `affiliates.yml`, settings or test was touched. Nothing is deployed and builds are stopped.
Companion: `docs/cowork/AMAZON_TREND_ARTICLE_PRODUCT_RESEARCH.md` (the browser brief that closes everything marked PENDING-COWORK or UNVERIFIED below). The article plan lives in `docs/editorial/TREND_EIGHT_ARTICLE_PLAN.md` (written by another worker; not read or edited here).

## 0. Read this first

- **Editorial assessments, not lab ratings.** Scores below are our own reading of the evidence we could open on 2026-11-25. They are not test results, certifications or rankings, and they must never appear on the site as scores, stars, "best" or "tested".
- **Owner rules applied:** Amazon products only (that is where the site earns); a product that cannot be verified is not used; no photos, prices, ratings, stock labels, "tested" or "best" claims; existing catalog first; no second catalog; no duplicated product metadata (this file points at catalog ids instead of copying the catalog); no vests or ESA gear that imply legal status; the site must stay useful with all seller affiliate IDs removed (so every shortlist below includes a no-product alternative).
- **What a read means.** Evidence codes: `M` maker page read today; `C` catalog record (maker page read by an earlier worker 2026-11-16 to 2026-11-24, not re-read today); `V` veterinary source read today; `P` press release or maker blog read today; `S` search snippet or retailer listing only (weak, never enough to state a spec); `N` nothing read. A spec appears below only if it came from the page named for it. Nothing is attributed to a product because a similarly named model has it.
- **Rubric (owner's 100 points):** A fit for the article's reader and use (30); B quality and independence of supporting evidence (25); C safety, suitability, compatibility and documented limitations (20); D correct model/variant and confirmed shopping destination (15); E practical value and ownership (10). **D is split:** up to 7 points are scored now for how clearly the exact model and variant are identified on pages we read; the other 8 points (the Amazon destination) are PENDING-COWORK and not scored. So every total below is out of **92**, and none can reach a final score until Cowork returns the Amazon facts.
- **Disqualification rule (car restraints).** A restraint with no readable independent certification record for the exact model and size is disqualified from the safety guide regardless of score. The maker saying "crash-tested" never counts.
- **Tiers:** SHORTLIST (proposed for an article), RESERVE (fallback; mention only if a shortlist item fails Cowork), HOLD (evidence incomplete: not used until a named check passes), REJECT (do not use, reason given), UNSCORED (named by us but nothing was read; Cowork must read the maker page before it can be scored).

## 1. Pages and sources read on 2026-11-25

| Source | What it gave | Status |
|---|---|---|
| `content/products.yml`, `content/affiliates.yml`, `content/packing.yml`, `src/content/gear-hub.ts`, `src/content/gear-categories.ts`, `docs/PACKING_GEAR_COVERAGE.md` | The catalog audit in section 2 | read in the repo |
| https://www.centerforpetsafety.org/certified-products/ , `/?p=807`, `/?p=4216`, `/lucky-kennel-intermediate/`, `/gunner-kennel-g1-small/`, `centerforpetsafety.org/certified-products/` | Returned EMPTY content to the page reader (probable script rendering or bot wall). A direct `curl` with a browser-style user agent was refused by the session's permission policy and was not retried or worked around. | **UNVERIFIED: Cowork must read these in Chrome** |
| https://www.prweb.com/releases/center_for_pet_safety_awards_a_5_star_crash_test_rating_to_lucky_ducks_large_kennel/prweb17861510.htm | Lucky Kennel Large with Lucky Anchor Straps: 5 Star rating, first crate to pass with a 110 lb engineered test dog, release dated 2021-04-15, no test date | read (secondary to the CPS record) |
| https://gunner.com/5-star-crash-test-rating | Post dated 2016-11-15: G1 Intermediate with 8 ft Tie-Down Straps got a CPS 5 Star rating; names a CPS page URL; says other sizes were to be submitted | read (maker blog) |
| https://www.gunner.com/blogs/pack/small-dog-crate-received-5-star-certification | Post dated 2017-07-11: G1 Small with Strength-Rated Tie-Down Straps, top rating in crate and carrier classes; links CPS page `centerforpetsafety.org/gunner-kennel-g1-small/` | read (maker blog) |
| https://www.gunner.com/products/g1-kennel | Maker: Small, Medium and Intermediate "5 Star Crash Tested per the Center For Pet Safety"; Large not listed as certified; sizes, weights and interior dimensions; strap kit sold separately; all sizes showed Sold Out | read (maker) |
| https://www.luckyduck.com/products/lucky-kennel | Maker: "5 Star Crash Test Rating from the Center For Pet Safety"; linked CPS page titled lucky-kennel-intermediate; no test dates, no sizes stated | read (maker) |
| https://sleepypod.com/pages/clickit-sport-safety | "Certified and crash tested by the Center for Pet Safety" for the Clickit Sport; no years, no weights, no CPS record links; names FMVSS 213 / CMVSS 213 / ECE R4 child-seat standards in headings | read (maker) |
| https://sleepypod.com/products/clickit-terrain-plus | The fetch returned copy about "Clickit Range" (Long and Regular 5 Star for 18 to 110 lb; S-Clip, Buckle Shield; non-Sleepypod accessory warning; every color shown sold out). The page identity could not be established, so it is used only as a Clickit Range maker statement and flagged | read (ambiguous) |
| https://www.kongcompany.com/kong-wobbler/ | KONG Wobbler: sizes, dimensions, material, top-shelf dishwasher, fill limit, supervision warning | read (maker) |
| https://lickimat.com/ | Product lines; Indoor Keeper "100% dishwasher safe"; no sizes, materials or safety text on the page | read (maker, thin) |
| https://ruffwear.com/products/powder-hound-jacket | Girth sizes (two charts disagree), 70D nylon shell 10,000 mm, 250 g insulation, care | read (maker) |
| https://www.aspca.org/pet-care/general-pet-care/cold-weather-safety-tips | Wipe or wash paws after walks; vet-approved paw protectants; booties add coverage; pet-friendly ice melts; "too cold for you, probably too cold for your pet" | read (animal-welfare charity, no named author) |
| https://petmd.com/dog/care/how-to-protect-dog-paws-in-winter | Article by Jennifer Coates, DVM, reviewed by Barri J. Morrison, DVM (updated 2024-12-18): boots fit and materials, avoid latex or rubber, remove boots indoors, balm limits, wipe after walks | read (veterinary-authored) |
| https://vcahospitals.com/resources/lifestyle-dog/hazards-safety/dog-be-careful-with-ice-melt | Avoid rock salt; wipe paws after walks; balms form a barrier; follow the maker's boot sizing; walks of 15 to 20 minutes for dogs not used to cold; no named author on the page | read (hospital group page) |
| Search snippets (not pages read): Musher's Secret retailer listings, Woof Pupsicle retailer listings, West Paw Toppl retailer listings, Waggle RV Pet Monitor, Hurtta Extreme Warmer III, Tufts and other articles on CPS lists | Used only as leads, marked `S` | weak |
| Not reachable or not usable: woofpets.com (for-sale domain page), westpawdesign.com (host not allowed in this session), hurtta.com boots page (404), kurgo.com Loft jacket (404), dogster.com and onegreenplanet.org (403), vet.tufts.edu CPS article (404), avma.org (empty), akc.org winter paw page (404), us.govee.com (no specs on the page read) | | UNVERIFIED |

Amazon pages were not opened (bot-walled for scripts; no bypass attempted). No ASIN is recorded below unless it already exists in `content/affiliates.yml` (marked "in repo").

## 2. Catalog audit (existing products first)

### 2.1 What the catalog holds

- `content/products.yml`: **92 records, 65 active, 27 inactive**. Every one of the 65 active records has an approved Amazon Associates link in `content/affiliates.yml` (`link type = Amazon Associates dp URL with the tracking-id placeholder`); products store no URL, price or photo. `docs/PACKING_GEAR_COVERAGE.md` shows 37 products directly recommended by a packing item, 28 reachable only through a live Gear category, 0 hub-only, 0 unreachable.
- Gear categories (slug: live products): car-safety, car-interior, ramps-and-steps, pens-and-gates, comfort-and-cooling, rental-cleanup, water-and-beach, cold-weather, trail-and-hiking, feeding-and-hydration, safety-id-first-aid. The Gear hub's trip collection for **winter-trip** has 5 products (Climate Changer, Timberline Fuse, Polar Trex, Beacon, Soggy Doggy doormat); **road-trip** has 11; **cabin-stay** 9. There is no collection for RV, enrichment, gifts or multi-dog (the multi-dog shortcut only points to pens-and-gates).
- Packing planner items that recommend products in scope: boots (Polar Trex then Grip Trex), warm layer (Climate Changer, Timberline Fuse), car restraint (Ruffwear Load Up then Lucky Kennel), collapsible crate, car bowl, towel, paw-care (AMK wipes), door mat, bed, portable pen.
- All 27 inactive records stay inactive: `sleepypod-clickit-range`, `sleepypod-clickit-sport-plus`, `sleepypod-clickit-sport`, `saker-bomber-harness`, `gunner-g1-kennel` (affiliate link OFF, no buy box 2026-11-18), `kong-ultimate-cargo-liner`, `kong-bench-seat-cover-hammock-xl`, `kurgo-rover-backseat-bridge`, `gunner-long-haul-bed`, `ruffwear-highlands-sleeping-bag`, and others (first aid, thermometer, cover alternatives).
- **Discrepancy to note:** the task said the ramp and the exercise kit are OFF in the repo. In `products.yml` and `affiliates.yml` all five PetSafe ramp and step records are `active: true` with approved links, and there is no "exercise kit" record (the only exercise product is `midwest-exercise-pen-with-door`, active and approved). Nothing was changed; the owner or lead should confirm which items were meant.
- **Replacement harness:** none was ever verified. Evidence in the repo: `sleepypod-clickit-sport` skipped 2026-11-24 (Amazon listing is the 2020 Clickit Sport; maker sells Sport Plus; weight ratings conflict); `sleepypod-clickit-sport-plus` OFF (no buy box, no brand on page, no weight range or CPS wording on Amazon, 2026-11-19); `sleepypod-clickit-range` OFF (no buy box 2026-11-18); the Kurgo Tru-Fit and Ruffwear Load Up are active but neither is CPS certified (Kurgo: maker claim at an unnamed facility; Ruffwear: maker-commissioned sled tests, and the maker says it would not meet CPS excursion limits). `task 16` Part A, which asked Cowork to find a CPS-listed harness with a matching Amazon buy box, has no result in the repo.

### 2.2 Audit table: active products that already fit one or more of the eight articles

Use-case key: 1 winter road trips, 2 Smoky Mountain Christmas cabins, 3 enrichment, 4 restraints, 5 boots vs wax, 6 winter RV, 7 multi-dog, 8 gifts. "Maker page" means the record has `manufacturerUrl`; "Amazon listing" means the only spec source is the Amazon listing (a weaker, non-independent source). "Last verified" is the catalog's `lastVerified`. Stock is not stated on the site and is not assessed here.

| Product id | Name | Primary category | Active | Link type | Spec source | Last verified | Maker page | Uses | Known limitations / flags |
|---|---|---|---|---|---|---|---|---|---|
| `sleepypod-atom` | Sleepypod Atom Crash-Tested Carrier | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B08J7S6C4V | maker/independent page | 2026-11-16 | yes | 1,4 | CPS wording is the maker's; CPS page not read (earlier note); maker pages disagreed 12 vs 18 lb; only for very small dogs. |
| `lucky-duck-lucky-kennel` | Lucky Duck Lucky Kennel | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B0BMQY39R5 | maker/independent page | 2026-11-16 | yes | 1,4,7 | Maker says CPS-rated; this pass found a press release (Large) and a search snippet (Intermediate), not the CPS pages; Amazon link is Intermediate only, title seen in search results, strap kit separate. |
| `lucky-duck-lucky-kennel-large` | Lucky Duck Lucky Dog Kennel Large | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B0DW9JGDJM | maker/independent page | 2026-11-24 | yes | 1,4,7 | Specs from Amazon listing (Cowork 2026-11-24) and match maker page; the CPS release names the Large WITH Lucky Anchor Straps, which are sold separately; no strap-kit link in catalog. |
| `ruffwear-load-up-car-harness` | Ruffwear Load Up Dog Car Harness | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B0C7D11DT4 | maker/independent page | 2026-11-18 | yes | 1,4 | NOT CPS certified (maker's own testing page); Amazon link is one size ASIN (XS to L/XL set); no weight limits on the maker page. |
| `kurgo-enhanced-strength-tru-fit` | Kurgo Enhanced Strength Tru-Fit Dog Car Harness | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B009CE8106 | maker/independent page | 2026-11-18 | yes | 1,4 | Crash-test claim is the maker's only (unnamed university); size selector vs size chart mismatch; Amazon link default size. |
| `kurgo-heather-booster-seat` | Kurgo Heather Dog Booster Seat | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B01D0KEKHU | maker/independent page | 2026-11-18 | yes | 1 | Not claimed crash tested; colour ASINs show different weight limits. |
| `kurgo-backseat-barrier` | Kurgo Backseat Barrier | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B000F71DF4 | maker/independent page | 2026-11-18 | yes | 1 | Barrier, not a restraint; no dimensions on maker page. |
| `petsafe-happy-ride-dog-barrier` | PetSafe Happy Ride Dog Barrier | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B00JZHRYFI | maker/independent page | 2026-11-18 | yes | 1,7 | Barrier, not a restraint; no weight capacity on page. |
| `petsafe-happy-ride-collapsible-crate` | PetSafe Happy Ride Collapsible Travel Crate | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B09T1P2B7J | maker/independent page | 2026-11-18 | yes | 1,4 | Contains, no crash-test claim. |
| `rabbitgoo-suv-dog-car-barrier` | rabbitgoo Dog Car Barrier for SUV, steel wire, foldable | car-safety | yes | Amazon Associates dp link, approved=True, ASIN B0CKQV4R3C | Amazon listing (no maker page) | 2026-11-24 | no | 1,7 | Amazon-listing-only specs; brand page not read; no two-dog statement. |
| `petsafe-happy-ride-bench-seat-cover` | PetSafe Happy Ride Quilted Bench Seat Cover | car-interior | yes | Amazon Associates dp link, approved=True, ASIN B09MXG2K8L | maker/independent page | 2026-11-18 | yes | 1 | none noted |
| `kurgo-rover-cargo-cape` | Kurgo Rover Cargo Cape | car-interior | yes | Amazon Associates dp link, approved=True, ASIN B01LY6DXU4 | maker/independent page | 2026-11-18 | yes | 1,7 | none noted |
| `kurgo-rover-hammock-extended-width` | Kurgo Rover Hammock, Extended Width | car-interior | yes | Amazon Associates dp link, approved=True, ASIN B07CRTPX8D | maker/independent page | 2026-11-18 | yes | 1,7 | Third-party seller on the Amazon listing (Cowork 2026-11-24); not a restraint. |
| `kurgo-rover-hammock-standard` | Kurgo Rover Hammock, Standard 55 x 56 in | car-interior | yes | Amazon Associates dp link, approved=True, ASIN B00164SZPQ | maker/independent page | 2026-11-24 | yes | 1 | none noted |
| `petsafe-happy-ride-folding-ramp` | PetSafe Happy Ride Folding Dog Ramp | ramps-and-steps | yes | Amazon Associates dp link, approved=True, ASIN B0016HNU12 | maker/independent page | 2026-11-18 | yes | 1 | none noted |
| `petsafe-happy-ride-extra-long-ramp` | PetSafe Happy Ride Extra Long Telescoping Dog Ramp | ramps-and-steps | yes | Amazon Associates dp link, approved=True, ASIN B0016HPTFW | maker/independent page | 2026-11-18 | yes | 1 | Independent-test wording has no named tester; not a mobility product; site recommends asking a vet for older dogs. |
| `petsafe-happy-ride-side-door-steps` | PetSafe Happy Ride Side Door Pet Steps | ramps-and-steps | yes | Amazon Associates dp link, approved=True, ASIN B0CCZGJQTB | maker/independent page | 2026-11-18 | yes | 1,6 | none noted |
| `petsafe-happy-ride-hitch-step` | PetSafe Happy Ride Dog Hitch Step | ramps-and-steps | yes | Amazon Associates dp link, approved=True, ASIN B01LCJAU4I | maker/independent page | 2026-11-18 | yes | 1 | none noted |
| `petsafe-happy-ride-compact-telescoping-ramp` | PetSafe Happy Ride Compact Telescoping Dog Ramp | ramps-and-steps | yes | Amazon Associates dp link, approved=True, ASIN B00YYL14FG | maker/independent page | 2026-11-18 | yes | 1 | none noted |
| `kurgo-collaps-a-bowl` | Kurgo Collaps A Bowl | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B005QZ4YZQ | maker/independent page | 2026-11-16 | yes | 1,6,8 | none noted |
| `springland-22oz-original-travel-bottle` | Springland (formerly Springer) 22oz Classic Travel Dog Water Bottle | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B09CHBNGDT | maker/independent page | 2026-11-16 | yes | 1,6,8 | Catalog name says Original, Amazon says Classic (rename flagged by an earlier worker). |
| `springland-20oz-flip-travel-bottle` | Springland (formerly Springer) 20oz Flip Travel Dog Water Bottle | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B0C15FWR7J | maker/independent page | 2026-11-16 | yes | 1,6 | none noted |
| `vittles-vault-travel-tainer` | Vittles Vault Travel-Tainer Portable Food Storage Container | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B000HHMCT8 | maker/independent page | 2026-11-16 | yes | 1,6,8 | none noted |
| `kurgo-kibble-carrier` | Kurgo Kibble Carrier | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B07MWB9XW1 | maker/independent page | 2026-11-16 | yes | 1,6 | none noted |
| `ruffwear-quencher-bowl` | Ruffwear Quencher Collapsible Dog Bowl | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B0CLB4CV6F | maker/independent page | 2026-11-18 | yes | 1,6,8 | Catalog name says Packable; maker name is Quencher Collapsible Dog Bowl. |
| `kurgo-splash-free-wander-bowl` | Kurgo Splash Free Wander Dog Water Bowl | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B06XWJGT88 | maker/independent page | 2026-11-18 | yes | 1,6 | none noted |
| `gunner-dog-bowl` | Gunner Dog Bowl with Travel Lid | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B0CZ5F9L2H | maker/independent page | 2026-11-18 | yes | 1,6,7 | Material (nylon vs silicone) and dishwasher wording disagree across maker page and Amazon. |
| `iris-usa-airtight-dog-food-container-10-lb` | IRIS USA Airtight Dog Food Storage Container Up to 10 lbs | feeding-and-hydration | yes | Amazon Associates dp link, approved=True, ASIN B08WHSVYV6 | maker/independent page | 2026-11-18 | yes | 6 | none noted |
| `amk-trail-dog` | Adventure Medical Kits Adventure Dog Medical Kit: Trail Dog | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B00T72ST1Y | maker/independent page | 2026-11-16 | yes | 1,8 | none noted |
| `tractive-dog-6` | Tractive DOG 6 | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B0D6Z4L6BW | maker/independent page | 2026-11-16 | yes | 6,7,8 | Amazon page title does not say DOG 6 (identity inferred by Cowork 2026-11-19); subscription required. |
| `fi-series-3-plus` | Fi Series 3+ | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B0HJ3XJFQ7 | maker/independent page | 2026-11-16 | yes | 6,7,8 | Amazon default is XS; maker page does not state coverage or subscription terms. |
| `ruffwear-the-beacon-dog-safety-light` | Ruffwear The Beacon Dog Safety Light | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B073WPG2KR | maker/independent page | 2026-11-18 | yes | 1,6,8 | none noted |
| `petcube-gps-tracker` | Petcube GPS Tracker | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B0C89SV8VP | maker/independent page | 2026-11-18 | yes | 6,7 | Subscription required; an independent source calls its location accuracy the weakest of those compared. |
| `arca-pet-cat-dog-first-aid-kit-100` | ARCA PET Cat and Dog First Aid Kit, 100 pieces | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B09FKVQQVH | Amazon listing (no maker page) | 2026-11-24 | no | 1,8 | none noted |
| `whoseid-qr-nfc-dog-tag-silicone-small` | WhoseID QR Code Dog Tag, NFC, silent silicone, small | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B0C9MCCDH9 | Amazon listing (no maker page) | 2026-11-24 | no | 6,8 | Specs from the Amazon listing only; brand page unread. |
| `midwest-exercise-pen-with-door` | MidWest Homes for Pets MidWest Exercise Pen with Door | pens-and-gates | yes | Amazon Associates dp link, approved=True, ASIN B005OCWML4 | maker/independent page | 2026-11-16 | yes | 2,7 | Cowork saw it "currently unavailable" on 2026-11-25 (owner: stock is not stated on the site; do not fix now); Amazon link is the 42 in size; heavy. |
| `carlson-convertible-pet-yard` | Carlson Pet Products Convertible Pet Yard | pens-and-gates | yes | Amazon Associates dp link, approved=True, ASIN B0026MSQAG | maker/independent page | 2026-11-18 | yes | 2,7 | none noted |
| `petmate-precision-pet-soft-side-play-yard` | Petmate Precision Pet Soft Side Play Yard | pens-and-gates | yes | Amazon Associates dp link, approved=True, ASIN B001GS71KW | maker/independent page | 2026-11-18 | yes | 2,6,7 | Dimensions on the maker page have no units; not shown to hold a determined or large dog. |
| `north-states-mypet-universal-petgate` | North States MyPet Universal Petgate | pens-and-gates | yes | Amazon Associates dp link, approved=True, ASIN B000A796WG | maker/independent page | 2026-11-18 | yes | 2,7 | none noted |
| `midwest-icrate-dog-crate` | MidWest Homes for Pets iCrate Dog Crate | pens-and-gates | yes | Amazon Associates dp link, approved=True, ASIN B000QFWCK0 | maker/independent page | 2026-11-18 | yes | 2,7 | Linked 30 in listing defaults to Amazon Resale (condition unconfirmed); many sizes, each its own ASIN. |
| `midwest-icrate-36-inch-double-door-crate` | MidWest Homes for Pets MidWest iCrate 36-inch double door crate | pens-and-gates | yes | Amazon Associates dp link, approved=True, ASIN B000QFT1R2 | Amazon listing (no maker page) | 2026-11-24 | no | 2,7 | Home crate; Amazon-listing specs; no crash-test claim. |
| `kurgo-loft-wander-dog-bed` | Kurgo Loft Wander Dog Bed | comfort-and-cooling | yes | Amazon Associates dp link, approved=True, ASIN B01JFEAL1O | maker/independent page | 2026-11-16 | yes | 1,2,6,8 | Amazon link is Large (Medium showed unavailable earlier); no weight on page. |
| `kong-classic` | KONG Classic | comfort-and-cooling | yes | Amazon Associates dp link, approved=True, ASIN B0002AR0I8 | maker/independent page | 2026-11-18 | yes | 2,3,8 | Amazon link is Large, sold by a third-party seller; categorised under comfort-and-cooling; dishwasher claim not found. |
| `rabbitgoo-frosted-window-privacy-film` | rabbitgoo Frosted Glass Window Privacy Film, 35.4 x 78.7 in | comfort-and-cooling | yes | Amazon Associates dp link, approved=True, ASIN B00RDVE71W | Amazon listing (no maker page) | 2026-11-24 | no | 2 | Not a dog product; Amazon-listing specs. |
| `amazon-basics-dog-crate-cover-36-inch` | Amazon Basics Dog Crate Cover for 36 inch wire crates | comfort-and-cooling | yes | Amazon Associates dp link, approved=True, ASIN B0DPQ4PFD6 | Amazon listing (no maker page) | 2026-11-24 | no | 2,7 | Amazon-listing specs; blocks view only (no noise claim). |
| `joejoy-xl-dog-bed-41-42-inch-crates` | JOEJOY XL Dog Bed for Large Dogs up to 80 lbs, fits 41 and 42 in crates | comfort-and-cooling | yes | Amazon Associates dp link, approved=True, ASIN B0FRMRRZV3 | Amazon listing (no maker page) | 2026-11-24 | no | 2,7 | Lesser-known brand; maker page unread. |
| `adventure-medical-kits-dog-wipes` | Adventure Medical Kits Adventure Dog Wipes (8 wipes per pack) | rental-cleanup | yes | Amazon Associates dp link, approved=True, ASIN B07PF1RCGD | maker/independent page | 2026-11-18 | yes | 2,5,6 | Amazon listing is a 4-pack of the 8-wipe packages; pack count needs owner confirmation. |
| `soggy-doggy-super-shammy-towel` | Soggy Doggy Super Shammy Towel | rental-cleanup | yes | Amazon Associates dp link, approved=True, ASIN B007679312 | maker/independent page | 2026-11-18 | yes | 1,2,5,6,8 | none noted |
| `soggy-doggy-microfiber-doormat` | Soggy Doggy Microfiber Doormat (no bone) | rental-cleanup | yes | Amazon Associates dp link, approved=True, ASIN B00OZW8I4O | maker/independent page | 2026-11-18 | yes | 2,5,6 | Amazon link opens the Large; XL separate. |
| `pet-parents-pawtect-pads` | Pet Parents Pawtect Pads (washable pee pads, 2 pack) | rental-cleanup | yes | Amazon Associates dp link, approved=True, ASIN B07DZSF2C2 | maker/independent page | 2026-11-18 | yes | 2,6 | none noted |
| `pet-parents-pawtect-pads-24x36` | Pet Parents Pawtect Pads 24x36 (2 pack) | rental-cleanup | yes | Amazon Associates dp link, approved=True, ASIN B07H2RHVK4 | Amazon listing (no maker page) | 2026-11-24 | no | 2,6,7 | none noted |
| `ameritex-waterproof-dog-bed-blanket-cover` | Ameritex Waterproof Dog Bed Blanket Cover | rental-cleanup | yes | Amazon Associates dp link, approved=True, ASIN B08R74XVCS | Amazon listing (no maker page) | 2026-11-24 | no | 2,6 | Amazon-listing specs only; brand page unread. |
| `ruffwear-climate-changer-fleece` | Ruffwear Climate Changer Dog Fleece | cold-weather | yes | Amazon Associates dp link, approved=True, ASIN B0F5TMJTH1 | maker/independent page | 2026-11-18 | yes | 1,6 | Amazon default size XXS; no temperature range. |
| `ruffwear-timberline-fuse-vest` | Ruffwear Timberline Fuse Fleece Vest | cold-weather | yes | Amazon Associates dp link, approved=True, ASIN B0H133R562 | maker/independent page | 2026-11-18 | yes | 1,6 | Size-specific ASINs; no thermal rating. |
| `ruffwear-polar-trex-boots` | Ruffwear Polar Trex Winter Dog Boots | cold-weather | yes | Amazon Associates dp link, approved=True, ASIN B0H13D93JM | maker/independent page | 2026-11-18 | yes | 1,5,6,8 | Amazon link opens the 2.50 in size only; no insulation or temperature rating. |
| `ruffwear-grip-trex-boots` | Ruffwear Grip Trex Dog Boots | trail-and-hiking | yes | Amazon Associates dp link, approved=True, ASIN B01MY7S3H8 | maker/independent page | 2026-11-18 | yes | 5 | Amazon link opens the 2.00 in size only; maker does not describe it for snow. |
| `ruffwear-knot-a-leash` | Ruffwear Knot-a-Leash Rope Dog Leash | trail-and-hiking | yes | Amazon Associates dp link, approved=True, ASIN B0991GNL5B | maker/independent page | 2026-11-18 | yes | 8 | Size-specific ASIN (Large linked); no strength rating. |
| `ruffwear-web-master-harness` | Ruffwear Web Master Dog Harness with Handle | trail-and-hiking | yes | Amazon Associates dp link, approved=True, ASIN B0DNV6MBKK | maker/independent page | 2026-11-18 | yes | 8 | none noted |
| `fdk-8-second-pet-thermometer` | FDK 8-Second Pet Thermometer | safety-id-first-aid | yes | Amazon Associates dp link, approved=True, ASIN B0FC2HZHPJ | Amazon listing (no maker page) | 2026-11-24 | no | 1,6 | Pet thermometer, NOT a temperature monitor; Amazon-listing specs; little-known brand. |

### 2.3 Fit by article (existing products, ids only)

**1. Winter road trips with dogs.** Restraint: none is independently certified in the catalog (Lucky Kennel and Sleepypod Atom carry maker CPS claims; Ruffwear Load Up is maker-tested, not CPS). Cold gear: `ruffwear-polar-trex-boots`, `ruffwear-climate-changer-fleece`, `ruffwear-timberline-fuse-vest`. Car protection: `kurgo-rover-hammock-extended-width`, `kurgo-rover-hammock-standard`, `kurgo-rover-cargo-cape`, `petsafe-happy-ride-bench-seat-cover`. Water: `kurgo-collaps-a-bowl`, `kurgo-splash-free-wander-bowl`, `ruffwear-quencher-bowl`. Visibility and cleanup: `ruffwear-the-beacon-dog-safety-light`, `soggy-doggy-super-shammy-towel`, `adventure-medical-kits-dog-wipes`.

Gaps: no insulated or waterproof coat in the catalog (Powder Hound is a candidate), no paw balm, no CPS-evidenced restraint.

**2. Smoky Mountain Christmas cabins with dogs.** Containment and comfort already used by the cabin-stay collection: `midwest-exercise-pen-with-door`, `north-states-mypet-universal-petgate`, `carlson-convertible-pet-yard`, `kurgo-loft-wander-dog-bed`, `soggy-doggy-microfiber-doormat`, `soggy-doggy-super-shammy-towel`, `pet-parents-pawtect-pads`, `ameritex-waterproof-dog-bed-blanket-cover`, `rabbitgoo-frosted-window-privacy-film`.

The article is a pet-policy guide: products are secondary. No stay is invented; no product needed to answer the main questions.

**3. Low-mess enrichment for rentals.** Only `kong-classic` (Large, third-party seller on Amazon, filed under comfort-and-cooling).

Gaps: no refillable dispenser, lick mat or freezable toy. Woof Pupsicle is not in the catalog.

**4. Car restraints and crash-test claims.** `lucky-duck-lucky-kennel` (Intermediate link), `lucky-duck-lucky-kennel-large`, `sleepypod-atom` (up to 12 lb per maker), `ruffwear-load-up-car-harness`, `kurgo-enhanced-strength-tru-fit`, `petsafe-happy-ride-collapsible-crate`, `kurgo-heather-booster-seat`, barriers.

No catalog record has a CPS record that we could read; see section 3 for what is claimed vs evidenced.

**5. Dog boots vs paw wax.** Boots: `ruffwear-polar-trex-boots`, `ruffwear-grip-trex-boots`. Cleanup: `adventure-medical-kits-dog-wipes`, `soggy-doggy-super-shammy-towel`, `soggy-doggy-microfiber-doormat`.

Gap: no paw balm or wax; nothing from a veterinary source is attached to any boot record yet.

**6. Winter RV travel with dogs.** Bowls: `kurgo-collaps-a-bowl`, `ruffwear-quencher-bowl`, `kurgo-splash-free-wander-bowl`. Bedding: `kurgo-loft-wander-dog-bed`, `pet-parents-pawtect-pads`. Food: `vittles-vault-travel-tainer`, `kurgo-kibble-carrier`. Paw protection: `ruffwear-polar-trex-boots`. Safety: `ruffwear-the-beacon-dog-safety-light`, trackers.

Gaps: no temperature monitor (a pet thermometer exists but it is a handheld thermometer), no organizer, no RV-specific item.

**7. Multi-dog rental getaway.** `carlson-convertible-pet-yard`, `midwest-icrate-36-inch-double-door-crate`, `midwest-icrate-dog-crate`, `midwest-exercise-pen-with-door`, `petmate-precision-pet-soft-side-play-yard`, `north-states-mypet-universal-petgate`, `kurgo-rover-hammock-extended-width`, `kurgo-rover-cargo-cape`, `lucky-duck-lucky-kennel-large`, `rabbitgoo-suv-dog-car-barrier`, trackers.

Gap: nothing is sized or described for two dogs by its maker; the existing two-large-dogs guide covers the car.

**8. Gifts for dog travelers.** Size-agnostic or one-size: `kurgo-collaps-a-bowl`, `soggy-doggy-super-shammy-towel`, `adventure-medical-kits-dog-wipes`, `vittles-vault-travel-tainer`, `springland-22oz-original-travel-bottle`, `amk-trail-dog`. Needs a measurement: `ruffwear-polar-trex-boots`, `kurgo-loft-wander-dog-bed`, `kong-classic`, `ruffwear-knot-a-leash`, trackers, harnesses.

Gift-specific gap: no gift collection exists; all picks must come from the catalog first.

### 2.4 Weak, outdated, unavailable or missing-detail records (flagged, not changed)

| Record | Issue | Evidence | Matters for |
|---|---|---|---|
| `midwest-exercise-pen-with-door` | Cowork saw it "currently unavailable" on 2026-11-25 (owner: the site does not state stock; not a defect to fix now). Amazon link is the 42 in size. | Cowork report as relayed in the task | 2, 7 |
| `midwest-icrate-dog-crate` | The linked 30 in listing defaults to Amazon Resale (condition not confirmed new). The 36 in record is the verified one. | `affiliates.yml` note, Cowork 2026-11-24 | 2, 7 |
| `lucky-duck-lucky-kennel` | Amazon title seen in search results only; no Add-to-Cart verification noted; the maker's CPS wording has not been matched to a CPS record. | `affiliates.yml` note 2026-11-19 | 4, 1, 7 |
| `sleepypod-atom` | Weight rating conflict between maker pages; CPS page unread. | `products.yml` | 4, 1 |
| `gunner-g1-kennel` | OFF (no buy box 2026-11-18); maker page shows all sizes Sold Out 2026-11-25; Amazon ASIN is Intermediate only. | `affiliates.yml`; maker page read today | 4 |
| `kong-classic` | Third-party seller, Large size only; dishwasher claim not found. | `affiliates.yml` | 3, 8 |
| `ruffwear-polar-trex-boots`, `ruffwear-grip-trex-boots`, `ruffwear-climate-changer-fleece`, `ruffwear-timberline-fuse-vest` | Each Amazon link opens one size; an article cannot say the link fits every dog. The brief must state "choose your size". | `affiliates.yml` | 1, 5, 6, 8 |
| `springland-22oz-original-travel-bottle`, `ruffwear-quencher-bowl` | Name mismatch with the Amazon title (rename pending from an earlier worker). | `affiliates.yml` | 1, 6, 8 |
| `tractive-dog-6` | Model identity inferred from listing details. | `affiliates.yml` | 6, 7, 8 |
| `ameritex-waterproof-dog-bed-blanket-cover`, `rabbitgoo-*`, `joejoy-*`, `amazon-basics-dog-crate-cover-36-inch`, `whoseid-*`, `fdk-*`, `arca-*` | Specs come only from the Amazon listing (no maker page): lower independence. | `products.yml` specSource | 2, 7, 8 |
| `kurgo-loft-wander-dog-bed` | Large variant linked; Medium ASIN showed unavailable earlier. | `affiliates.yml` | 2, 6, 8 |

No record is older than 2026-11-16, so none is stale by date; the ones above are weak by evidence or variant, not by age.

## 3. Article 4: certification evidence picture (what is claimed vs what we could read)

**No Center for Pet Safety record could be opened in this pass** (the site returns empty content to our reader; no workaround attempted). Everything below that mentions a CPS rating is therefore a maker statement, a press release, a maker blog or a repo catalog note from an earlier read, never a CPS record read today. **Nothing here may be written on the site as "certified" until Cowork reads the exact CPS record.**

| Model and size | What is claimed | Source and read status | CPS record read today? | Verdict |
|---|---|---|---|---|
| Lucky Kennel Large with Lucky Anchor Straps | 5 Star, first crate to pass with a 110 lb engineered test dog (release 2021-04-15) | PRWeb release read | No | HOLD: strongest lead; needs CPS record, test date, strap kit link |
| Lucky Kennel Intermediate with Lucky Ratchet Strap Kit | 5 Star; snippet says tested July 2022 (original April 2020), up to 75 lb | Maker page read; CPS snippet only | No | HOLD |
| Lucky Kennel Medium | maker says "crash test rated" only | catalog | No | not evidenced |
| GUNNER G1 Intermediate (8 ft Tie-Down Straps) | 5 Star (post dated 2016-11-15) | Maker blog read | No | HOLD |
| GUNNER G1 Small (Strength-Rated Tie-Down Straps) | top rating in crate and carrier classes (post dated 2017-07-11) | Maker blog read | No | HOLD |
| GUNNER G1 Medium | maker page says 5 Star per CPS | Maker page read | No | HOLD |
| GUNNER G1 Large | maker does not list it as certified | Maker page read | n/a | not evidenced |
| Sleepypod Clickit Range (Regular and Long) | 5 Star for 18 to 110 lb; CPS listing recorded earlier covers Small to X-Large, Nov 2024 | Maker copy read; catalog note | No | HOLD: 2X-Large and Long not in the catalog's CPS note |
| Sleepypod Clickit Sport Plus | maker says 5 Star; CPS record held is for "Clickit Sport", July 2014 | catalog | No | REJECT for A4 (model mismatch, conflicting weights) |
| Sleepypod Clickit Sport (2014 CPS record; Amazon listing is the 2020 model) | passed, test dogs up to 90 lb | catalog (CPS page read by an earlier worker 2026-11-19) | No | REJECT (Amazon mismatch) |
| Sleepypod Clickit Terrain Plus | maker says 5 Star (snippet) | not read | No | UNSCORED |
| Saker Canine Bomber | CPS lists passed, tested Nov 2022, 75 lb test dog | catalog (earlier read 2026-11-18) | No | HOLD: no Amazon link yet |
| Sleepypod Atom | maker says 12 lb CPS | catalog | No | HOLD (very small dogs only) |
| Ruffwear Load Up | NOT CPS certified (maker's own page); maker-commissioned FMVSS 213 sled tests | catalog | n/a | RESERVE: only with that label |
| Kurgo Tru-Fit | maker claim, unnamed university | catalog | n/a | REJECT |
| Crates without a claim (PetSafe collapsible, MidWest iCrate) | none | catalog | n/a | not restraints; may appear as "contains, not crash tested" |

Findings that change the article: (1) crash-tested crates carry their rating **with a specific strap kit**, which is a separate product; (2) a certified weight is the test dog's weight, not a promise for every dog; (3) the Sleepypod records disagree with themselves on weight; (4) the site's existing `dog-car-safety-harness-and-crate-guide` and category copy already say "maker says" vs "named independent tester": keep that distinction.

**No-product alternative for Article 4 (use if no model clears Cowork):** teach the reader how to check a claim themselves (open the CPS certified-products list, match brand, model and size, read the test date and the test dog weight, confirm the strap kit), and recommend no crash-certified product by name. A manufacturer link, rather than an Amazon button, may be the right destination for a model Amazon sells in a different variant.

## 4. Candidate evaluations (scores are editorial, out of 92; D destination 8 points PENDING-COWORK)

Columns: ID, brand and exact model, catalog id if already present, articles (numbers as above), evidence code, facts as read, limitations, scores A/B/C/D/E, total, tier.

| ID | Brand and model | Catalog id | Articles | Ev | Facts as read | Limitations / not ideal | A/B/C/D/E | Total /92 | Tier |
|---|---|---|---|---|---|---|---|---|---|
| C01 | Lucky Duck Lucky Kennel, Large (with Lucky Anchor Straps) | `lucky-duck-lucky-kennel-large` | 4,1,7 | P+C | CPS awarded a 5 Star rating to the Large with Lucky Anchor Straps, first crate to pass with a 110 lb engineered test dog (press release dated 2021-04-15, read at prweb.com; no test date in the release). Maker page (read earlier): Large for dogs about 70 to 110 lb, interior 35.75 x 22 x 26.5 in, 45 lb kennel. | CPS record page NOT read (site returns empty to our reader). Certified configuration includes the straps, which are sold separately. Maker says size up for home use. Amazon record in catalog is specs from the listing (Tan, Large). | 26/17/14/5/7 | 69 | HOLD |
| C02 | Lucky Duck Lucky Kennel, Intermediate (with Lucky Ratchet Strap Kit) | `lucky-duck-lucky-kennel` | 4,1,7 | M+S | Maker page (read 2026-11-25) says 5 Star Crash Test Rating from CPS; the linked CPS page is titled 'lucky-kennel-intermediate' (page does not say which size is certified or give a date). A search snippet of the CPS page (centerforpetsafety.org/?p=4216, NOT read directly) says Intermediate with Ratchet Strap Kit, test July 2022, original test April 2020, rated up to 75 lbs. Maker: Intermediate under 70 lbs, interior 30.25 x 20.5 x 22 in, 38 lb. | Certified weight (75 lb engineered dog per snippet) and maker weight guidance (under 70 lb) differ slightly. Medium and Large-without-straps not evidenced. Catalog record lucky-duck-lucky-kennel describes all three sizes; only Intermediate links to Amazon (B0BMQY39R5, title seen in search results only). | 24/12/13/4/7 | 60 | HOLD |
| C03 | Lucky Duck Lucky Ratchet Strap Kit / Lucky Anchor Straps (set of 4) | not in catalog | 4 | C | Maker suggests pairing the kennel with the Ratchet Strap Kit (set of 4), sold separately (catalog record). | Not read this pass. Which strap kit matches which CPS record (Anchor Straps for the Large release; Ratchet Strap Kit for the Intermediate snippet) is unconfirmed. | n/s | n/s | RESERVE |
| C04 | GUNNER G1 Kennel, Small (with Strength-Rated Tie-Down Straps) | `gunner-g1-kennel` | 4,1 | P+M | Gunner blog dated 2017-07-11 (read): G1 Small with Strength-Rated Tie-Down Straps received CPS highest rating in both the crate and carrier classes; links a CPS page at centerforpetsafety.org/gunner-kennel-g1-small/ (not readable here). Maker page: Small for dogs up to 30 lb, interior 21.75 x 14.5 x 15.5 in, 27 lb. | CPS page unread. Only dogs up to 30 lb. Maker page showed all sizes 'Sold Out' on 2026-11-25. Catalog Amazon link (B016LHHXKK) is the Intermediate size and is OFF (no buy box); a Small tan ASIN B0GVGLBLRS is recorded in the catalog notes, unverified. | 14/17/14/4/6 | 55 | HOLD |
| C05 | GUNNER G1 Kennel, Medium | `gunner-g1-kennel` | 4,1 | M | Maker page (read 2026-11-25): 'The Small, Medium & Intermediate kennels are 5 Star Crash Tested per the Center For Pet Safety.' Medium: dogs up to 45 lb, interior 25 x 18 x 19.75 in, 38 lb. Tie-down strap kit sold separately and recommended for the certified rating. | No CPS record read for Medium specifically; no date on the maker page. Sold Out on the maker page 2026-11-25. No Amazon ASIN recorded for Medium. | 18/13/14/3/6 | 54 | HOLD |
| C06 | GUNNER G1 Kennel, Intermediate (with 8 ft Tie-Down Straps) | `gunner-g1-kennel` | 4,1,7 | P+M | Gunner post dated 2016-11-15 (read): G1 Intermediate with 8 ft Tie-Down Straps received a CPS 5 Star Crash Test Rating; names CPS page http://www.centerforpetsafety.org/cps-certified/gunner-kennel-g1-intermediate/ (not readable). Maker page 2026-11-25: Intermediate up to 70 lb, interior 30 x 18 x 25 in, 48 lb; lifetime warranty for the original purchaser. | 2016 post says 'currently only' rating; CPS record and any retest date unread. Sold Out on the maker page 2026-11-25. Catalog Amazon link OFF 2026-11-18 (no buy box). | 22/19/14/4/6 | 65 | HOLD |
| C07 | GUNNER Tie-Down Strap Kit (8 ft) | not in catalog | 4 | M | Maker page: add-on, not included with the kennel; available in Traditional or Combination strap lengths; maker recommends them for the certified rating. | Which kit configuration matches the CPS record is unconfirmed. | n/s | n/s | RESERVE |
| C08 | Sleepypod Clickit Range Crash-Tested Harness (Regular and Long, Small to 2X-Large) | `sleepypod-clickit-range` | 4,1,7 | M+C | Maker page read 2026-11-25 (via the Terrain Plus URL, which returned Clickit Range copy; see Notes): 'Rated up to 110 lbs by Center for Pet Safety'; 'Long and Regular sizes earned a 5 Star rating for dogs 18 to 110 pounds'; includes S-Clip and Buckle Shield. Catalog (earlier read): CPS listing covers Small, Medium, Large and X-Large only, tested at 110 lbs, November 2024. | Maker lists 2X-Large and Long fits that the catalog's CPS listing note does not cover. Warns against non-Sleepypod accessories. All colors showed sold out on the page read today. Amazon: catalog link B0HNBGWPMW OFF (no buy box); three other Range ASINs unverified. | 24/15/12/3/7 | 61 | HOLD |
| C09 | Sleepypod Clickit Sport Plus | `sleepypod-clickit-sport-plus` | 4 | C+S | Maker pages say 5 Star CPS; the CPS record the catalog holds is for the earlier 'Clickit Sport' (July 2014), not 'Sport Plus'. Maker pages disagree on weight (25 lb, 18 to 90 lb, 18 to 110 lb). | Conflicting weight statements; certification of this exact model unconfirmed; Amazon listing B0FS4DL1QF had no buy box and no brand on page (Cowork 2026-11-19). | 20/8/6/2/7 | 43 | REJECT |
| C10 | Sleepypod Clickit Terrain Plus | not in catalog | 4 | S | Search snippet of the maker's site says it is CPS 5 Star certified. A direct fetch of /products/clickit-terrain-plus returned text that names 'Clickit Range', so the page could not be identified. | Nothing verified. Not in catalog. | n/s | n/s | UNSCORED |
| C11 | Saker Canine Bomber Harness (XS to L) | `saker-bomber-harness` | 4 | C | Catalog (read 2026-11-18): CPS lists it as passed, tested November 2022, 75 lb test dog, protocol CPS-001-014.01; sizes by girth XS 13 to 24.8 in to L 14.6 to 45.3 in; seat belt must pass directly through the top handle. | Maker page does not mention CPS and gives two force figures (3,000+ lb and over 3,300 lb). No weight limits on the maker page. No Amazon link or ASIN in the catalog; likely sold elsewhere (UNKNOWN until Cowork). | 18/18/12/4/6 | 58 | HOLD |
| C12 | Sleepypod Atom Crash-Tested Carrier | `sleepypod-atom` | 4,1 | C | Catalog: maker states rated to 12 lb by CPS (an earlier collection page showed 18 lb); soft fold-flat carrier; no non-Sleepypod accessories; page does not say how to secure it in a vehicle. | CPS page not read; weight conflict in maker pages; only very small dogs; active on site today with Amazon link B08J7S6C4V. | 10/10/10/5/6 | 41 | HOLD |
| C13 | Ruffwear Load Up Dog Car Harness | `ruffwear-load-up-car-harness` | 4,1 | C | Catalog: Ruffwear's testing page (read 2026-11-18) says MGA Research ran FMVSS 213 sled tests at 30 mph with 25, 45 and 75 lb mannequins, commissioned by Ruffwear, and that the harness would not meet CPS certification on excursion limits. Girth sizes XXS to L/XL; no weight limits stated. | NOT CPS certified, by the maker's own statement. Can appear in Article 4 only under the label 'maker-commissioned test, not independent certification'. Size ASINs differ (Amazon link is XS-to-L/XL specific). | 22/20/14/4/8 | 68 | RESERVE |
| C14 | Kurgo Enhanced Strength Tru-Fit Dog Car Harness | `kurgo-enhanced-strength-tru-fit` | 4,1 | C+S | Catalog: maker says crash tested for dogs up to 75 lb at an unnamed university facility under the FMVSS for child restraint systems; no CPS mention. A search snippet reports CPS has not certified it (not read at CPS). | Manufacturer claim only; size chart lists XS to XL while the selector shows S, M, L. | 20/6/8/3/8 | 45 | REJECT |
| C15 | PetSafe Happy Ride Collapsible Travel Crate | `petsafe-happy-ride-collapsible-crate` | 1,4 | C | Catalog: up to 60 lb, 27 x 19 x 28 in expanded, headrest strap and seat belt keep it from moving; maker says 'contained, not restrained'; no crash-test claim. | Not shown to be crash tested; may not fit compact vehicles. | 18/14/12/6/7 | 57 | RESERVE |
| W01 | Ruffwear Polar Trex Winter Dog Boots | `ruffwear-polar-trex-boots` | 5,1,6,8 | C | Set of two; sized by paw width 1.50 to 3.25 in in 0.25 in steps (size down if between); waterproof windproof softshell upper, rubber outsole with fiberglass lugs for ice and snow; hand wash. | No insulation or temperature rating on the page; Amazon link opens the 2.50 in size only (other sizes separate ASINs); front and rear paws may need different sizes. | 28/14/15/5/8 | 70 | SHORTLIST |
| W02 | Ruffwear Grip Trex Dog Boots | `ruffwear-grip-trex-boots` | 5,8 | C | Set of two; Vibram outsole, polyester mesh upper, hook-and-loop closure; sized 1.50 to 3.25 in paw width; maker suggests fit check about 15 minutes in. | Three-season trail boot; not described as waterproof or for snow; Amazon link is the 2.00 in size only. | 20/14/13/5/8 | 60 | RESERVE |
| W03 | Hurtta Outback Boots | not in catalog | 5 | N | Not read: the guessed maker URL returned 404; a site search listed only a general product page. | Nothing verified. | n/s | n/s | UNSCORED |
| W04 | Muttluks Fleece Lined Dog Boots | not in catalog | 5 | N | Not read. | Nothing verified. | n/s | n/s | UNSCORED |
| W05 | Pawz Dog Boots (disposable-style rubber boots) | not in catalog | 5 | N | Not read. Vet source PetMD (read) advises against latex or rubber boots because they can trap moisture, so this candidate needs a maker page read before any use. | Nothing verified. | n/s | n/s | UNSCORED |
| W06 | Musher's Secret Paw Protection Wax | not in catalog | 5,1,6 | S | Retailer listings (not the maker): waxes (white and yellow beeswax, carnauba, candelilla) with vegetable oils and vitamin E; apply a thin layer two to three times a week; maker says food-grade and safe if licked. | Maker page not read; ingredient list and 'safe if licked' wording come from retailer pages. Vets note that balm will not protect against sharp ice or temperature extremes (PetMD, VCA, read). | 22/9/11/3/7 | 52 | SHORTLIST |
| W07 | Natural Dog Company Paw Soother | not in catalog | 5 | N | Not read. | Nothing verified. | n/s | n/s | UNSCORED |
| W08 | Burt's Bees for Dogs Paw & Nose Lotion | not in catalog | 5 | N | Not read. | Nothing verified. | n/s | n/s | UNSCORED |
| W09 | Ruffwear Powder Hound Waterproof Insulated Jacket | not in catalog | 1,6,8 | M | Maker page (read 2026-11-25): girth sizes XXS 13-17 in to XL 36-42 in (a second chart on the page shows different ranges, so confirm); 70D nylon ripstop shell, waterproof rated 10,000 mm, 250 g recycled polyester insulation in back and belly; leash portals; cold gentle wash, hang to dry. | No temperature range on the page; two size charts on the page disagree; some colors listed out of stock at fetch. Not in catalog. | 24/15/13/4/7 | 63 | SHORTLIST |
| W10 | Ruffwear Climate Changer Dog Fleece | `ruffwear-climate-changer-fleece` | 1,6 | C | 260 g polyester fleece (75% recycled), sleeves, full-length zipper, XXS to XL by chest girth; wear alone or under coats. | No rating or temperature range; Amazon link default size XXS (many size ASINs). | 22/13/13/5/8 | 61 | RESERVE |
| W11 | Ruffwear Timberline Fuse Fleece Vest | `ruffwear-timberline-fuse-vest` | 1,6 | C | 380 g fleece with 600D oxford back and belly panel, built-in harness with aluminum V-ring; XXS to XL. | Maker says mild to cool weather; no thermal rating; size-specific ASINs. | 20/13/12/5/8 | 58 | RESERVE |
| W12 | Hurtta Extreme Warmer III | not in catalog | 1,6 | S | Search snippet of hurtta.com: foil lining, down-like insulation, taped seams, water column over 10,000 mm, high neck/hood, harness opening in sizes 30 to 65; Hurtta says it is not a raincoat. | Maker page not read directly; Amazon availability unknown; sizing by back length. | 16/8/10/2/6 | 42 | UNSCORED |
| Q01 | Adventure Medical Kits Adventure Dog Wipes (8 wipes per pack) | `adventure-medical-kits-dog-wipes` | 5,1,2,6 | C | 8 x 8 in wipes, rinse-free, aloe, rosemary, witch hazel; 60-day guarantee. VCA and ASPCA (read) advise wiping paws after walks to remove salt and chemicals. | Amazon listing is a 4-pack of the 8-wipe packages (pack count to confirm); no ingredient safety claims beyond maker wording. | 22/14/13/4/8 | 61 | SHORTLIST |
| Q02 | Soggy Doggy Super Shammy Towel | `soggy-doggy-super-shammy-towel` | 5,1,2,6,8 | C | 31 x 14 in microfiber chenille, hand pockets, machine wash alone, tumble dry low; one size. | No absorbency figure; colors have separate ASINs. | 22/13/13/6/9 | 63 | SHORTLIST |
| Q03 | Soggy Doggy Microfiber Doormat (no bone), Large 26 x 36 in / XL 36 x 60 in | `soggy-doggy-microfiber-doormat` | 2,5,6,7 | C | Microfiber chenille, 1 in pile, non-slip backing, machine washable. | Absorbency wording is the maker's; Amazon link opens the Large; XL separate listing. | 21/13/12/6/8 | 60 | RESERVE |
| Q04 | Earth Rated Dog Wipes | not in catalog | 5 | N | Not read. | Nothing verified. | n/s | n/s | UNSCORED |
| Q05 | Dexas MudBuster Portable Dog Paw Cleaner | not in catalog | 5,2 | N | Not read. | Nothing verified. | n/s | n/s | UNSCORED |
| E01 | KONG KONG Classic (size by weight) | `kong-classic` | 3,2,8 | C | Natural rubber, six size bands (XS up to 5 lb to XXL 85+ lb), Puppy KONG softer; maker says supervised use only, discontinue if damaged, no toy is indestructible. | Dishwasher claim not found on the page read earlier; Amazon link is Large sold by a third-party seller; categorised under comfort-and-cooling in the catalog (taxonomy oddity). | 26/14/14/4/9 | 67 | SHORTLIST |
| E02 | KONG Wobbler (Small / Large) | not in catalog | 3,8 | M | Maker page (read 2026-11-25): Small 4.25 x 4.25 x 6 in, Large 5.25 x 5.25 x 7.5 in; 65% sand/rock and 35% PP; dishwasher safe (top shelf), top unscrews; up to 1 cup per filling; Small up to 20 lb, Large about 30 to 65 lb; 'not a chew toy', supervised use only. | Dogs 20 to 30 lb fall between sizes; hard, heavy plastic that moves and may be noisy on hard floors (our inference, not maker text: check on a rental floor); not in catalog. | 24/16/15/6/8 | 69 | SHORTLIST |
| E03 | WOOF Pupsicle (treat tray and Pupsicle toy; sizes vary) | not in catalog | 3 | S | Retailer listings only (Petco, Chewy, PetSmart, REI, Rover; the maker domain woofpets.com is a for-sale page): food-grade silicone tray, freeze wet food, broth or yogurt; sizes Small to X-Large; dishwasher guidance varies (Petco: top rack). | Maker page not found; retailer pages disagree on material (one says natural rubber for the toy) and dishwasher wording. Needs freezer; tray fills make mess risk in a rental (our inference). | 20/7/10/2/6 | 45 | HOLD |
| E04 | West Paw Zogoflex Toppl (Small / Large / XL) | not in catalog | 3,8 | S | Retailer snippets only (westpawdesign.com not reachable from this session): Small, Large, XL sizes that interlock; top-rack dishwasher safe; guarantee wording varies by retailer. | Maker page unread; guarantee terms unconfirmed. | 22/7/10/2/7 | 48 | HOLD |
| E05 | LickiMat Indoor Keeper with LickiMat (model to be chosen) | not in catalog | 3 | M | Maker home page (read 2026-11-25): Indoor Keeper 'fits all Classic and Tuff LickiMats' and is described as 100% dishwasher safe; SloDog described as dishwasher safe; sizes, materials and safety instructions not stated on the page read. | Individual LickiMat product pages not read; some lines marked Australia only; no maker supervision text found. | 20/8/9/2/6 | 45 | HOLD |
| E06 | Starmark Bob-A-Lot | not in catalog | 3 | N | Not read. | Nothing verified. | n/s | n/s | UNSCORED |
| B01 | Kurgo Collaps-A-Bowl (24 oz) | `kurgo-collaps-a-bowl` | 1,6,8 | C | Food-grade silicone, 24 oz, collapses under 1 in, top-rack dishwasher safe per maker; lifetime guarantee (coverage not stated). | Colour variants have separate ASINs (Barn Red linked). | 26/14/16/6/9 | 71 | SHORTLIST |
| B02 | Ruffwear Quencher Collapsible Dog Bowl (Medium, 1 L) | `ruffwear-quencher-bowl` | 1,6,8 | C | 5.5 in opening, 4.2 cups; 300D ripstop shell with lined interior rated 4,000 mm waterproof (maker); hand wash. | Shell water-resistant, not waterproof; maker name differs from catalog 'Packable' label; many size and colour ASINs. | 24/13/14/5/8 | 64 | SHORTLIST |
| B03 | Kurgo Splash Free Wander Dog Water Bowl (24 oz) | `kurgo-splash-free-wander-bowl` | 1,6 | C | Food-grade silicone wedge with tapered edge to reduce splashing; top-rack dishwasher safe. | Dimensions not stated. | 23/13/14/6/8 | 64 | RESERVE |
| B04 | GUNNER Dog Bowl with Travel Lid (7-cup) | `gunner-dog-bowl` | 1,6,7 | C | Nylon (copy) bowl with leak-resistant lid and non-slip feet; top-rack dishwasher safe. | Page copy says nylon, a caption says silicone; Amazon listings disagree on material and dishwasher safety. | 20/11/10/5/8 | 54 | RESERVE |
| B05 | Springland 22oz Classic Travel Dog Water Bottle | `springland-22oz-original-travel-bottle` | 1,6,8 | C | Polypropylene, squeeze to fill attached bowl, leak-proof lock per maker, top-rack dishwasher only; carabiner included. | Catalog name 'Original' vs Amazon 'Classic' (rename flagged by an earlier worker); capacity not separately stated. | 22/13/12/5/8 | 60 | RESERVE |
| B06 | Petmate (Vittles Vault) Travel-Tainer Portable Food Storage Container (6 cup) | `vittles-vault-travel-tainer` | 6,1,8 | C | 6-cup airtight container, two 3-cup bowls and a handle; bowls dishwasher safe, the container is not. | Capacity depends on kibble; single unit linked (2-pack separate). | 22/13/12/6/8 | 61 | SHORTLIST |
| B07 | Kurgo Kibble Carrier | `kurgo-kibble-carrier` | 6,1,8 | C | Holds up to 5 lb of dry food per maker; ripstop with PEVA liner, roll-top; hand wash. | Built for packing not storage; colours have separate ASINs. | 20/13/11/6/8 | 58 | RESERVE |
| S01 | Kurgo Rover Hammock, Extended Width (63 x 56 in) | `kurgo-rover-hammock-extended-width` | 1,7 | C | Bench-seat hammock for full-size trucks and large SUVs, eight attachment points, seat-belt openings, lifetime guarantee. | Not a restraint; Cowork noted the Amazon listing is the extended 63 in model sold by a third party; fit depends on vehicle. | 22/13/13/5/8 | 61 | SHORTLIST |
| S02 | Kurgo Rover Hammock, Standard (55 x 56 in) | `kurgo-rover-hammock-standard` | 1 | C | Standard model, black; maker page confirms size 55 x 56 in. | May not fit large trucks/SUVs; not a restraint. | 20/12/12/5/8 | 57 | RESERVE |
| S03 | PetSafe Happy Ride Quilted Bench Seat Cover (45 x 56 in) | `petsafe-happy-ride-bench-seat-cover` | 1 | C | Heavy cotton twill with waterproof protection, straps, machine washable, seat belts reachable. | Not a restraint. | 18/12/12/6/8 | 56 | RESERVE |
| S04 | Ameritex Waterproof Dog Bed Blanket Cover | `ameritex-waterproof-dog-bed-blanket-cover` | 2,6 | C (Amazon listing) | Listing states waterproof, reversible, machine washable; no dog weight range. | Specs come only from the Amazon listing (no maker page); size not recorded in the catalog summary. | 18/8/9/5/7 | 47 | RESERVE |
| S05 | Pet Parents Pawtect Pads 24 x 36 in (2 pack) | `pet-parents-pawtect-pads-24x36` | 2,6,7 | C | Triple-layer reusable pads with floor-gripping backing, machine washable (maker). | Waterproof and wash-life statements are the maker's; sizes are separate listings. | 18/12/11/6/7 | 54 | RESERVE |
| D01 | Kurgo Loft Wander Dog Bed (Large 36 x 48 in) | `kurgo-loft-wander-dog-bed` | 2,6,8,1 | C | Roll-up bed; water-resistant ripstop top, waterproof non-slip bottom; Medium 27 x 36 in, Large 36 x 48 in; machine wash gentle cold, hang dry. | Amazon link is Large (Medium showed unavailable with an odd shipper); no weight listed. | 26/13/14/5/9 | 67 | SHORTLIST |
| D02 | JOEJOY XL Dog Bed, 41 x 27 x 4 in (fits 41 and 42 in crates) | `joejoy-xl-dog-bed-41-42-inch-crates` | 7,2 | C (Amazon listing) | Listing states egg-crate foam, washable zipper cover, waterproof liner, non-slip bottom, up to 80 lb. | Lesser-known brand; maker page not read. | 18/8/9/5/7 | 47 | RESERVE |
| D03 | Ruffwear Mt. Bachelor Pad | not in catalog | 6 | N | Not read. | Nothing verified. | n/s | n/s | UNSCORED |
| V01 | Waggle RV Pet Monitor 4G Lite | not in catalog | 6 | S | Search snippets of mywaggle.com and retailers: monitors temperature and humidity and sends text or email alerts past thresholds you set; needs an active 4G subscription; power-loss alert works only while plugged in; battery figures vary by listing (24 hours on one page, 192 hours on a retailer). | Operating temperature range not found; Amazon availability unknown (retailers listed were Camping World and Best Buy). A monitor reports conditions; it does not make leaving a pet unattended safe and must not be written as doing so. | 18/9/8/2/5 | 42 | HOLD |
| V02 | Govee WiFi thermometer hygrometer (model to be chosen, e.g. H5179) | not in catalog | 6 | N | Not read (maker site redirected to a home page without specs). | Nothing verified; a general thermometer is not a pet product and RV Wi-Fi availability varies. | n/s | n/s | UNSCORED |
| V03 | Ruffwear The Beacon Dog Safety Light | `ruffwear-the-beacon-dog-safety-light` | 1,6,8 | C | Three modes and colors, up to 20 hrs run time, micro USB charge, waterproof to 1 m for 30 min (maker); clips to Ruffwear light loops. | Maker figures only; compatibility is with Ruffwear collars and apparel loops. | 22/13/12/6/8 | 61 | SHORTLIST |
| V04 | Tractive DOG 6 (and DOG 6 XL for dogs above 44.1 lb) | `tractive-dog-6` | 6,7,8 | C | For dogs above 8.8 lb; subscription required; IP68; 6 days to 2 weeks battery per maker; DOG 6 XL is separate and inactive in catalog. | Amazon page title does not say DOG 6 (identity inferred by Cowork 2026-11-19); a subscription is needed; as a gift it needs the dog's size. | 22/12/11/3/7 | 55 | RESERVE |
| V05 | WhoseID QR Code Dog Tag, NFC, silent silicone, small | `whoseid-qr-nfc-dog-tag-silicone-small` | 8,7,6 | C (Amazon listing) | Listing states one-time purchase, no subscription fee, no app, fits collars 3/8 to 1 in wide, silent slide-on silicone. | Brand page unread; a tag helps only if the profile is filled in. | 20/8/10/5/8 | 51 | RESERVE |
| M01 | MidWest Homes for Pets iCrate 36-inch double door crate (41-70 lb) | `midwest-icrate-36-inch-double-door-crate` | 7,2 | C (Amazon listing) | Listing: 36.5 x 23.25 x 24.75 in, 41-70 lb; maker page lists sizes 18 to 48 in, divider panel, plastic pan, slide-bolt latch. | Home crate, no crash-test claim; folded size and weight not on the maker page; other sizes are separate ASINs; the linked 30 in listing defaults to Amazon Resale. | 22/12/12/6/7 | 59 | RESERVE |
| M02 | Carlson Pet Products Convertible Pet Yard (6 panels, 28 in high) | `carlson-convertible-pet-yard` | 7,2 | C | Six 24 in metal panels, 16.3 in walk-through door, gap between bars 2 to 2.5 in, limited 6-month warranty. | No weight or size limit; 28 in high may not hold jumpers; panel extension is a separate ASIN. | 22/13/12/5/7 | 59 | SHORTLIST |
| M03 | MidWest Homes for Pets Exercise Pen with Door (42 in, model 556-42DR) | `midwest-exercise-pen-with-door` | 7,2 | C | Eight panels with door, ground anchors and corner stabilizers; maker says to remove collars and tags before placing a pet inside and not to leave young animals unsupervised. | Seen 'currently unavailable' by Cowork on 2026-11-25 (not a defect to fix now); the Amazon link opens the 42 in size; heavy pen to carry. | 24/14/14/3/6 | 61 | HOLD |
| M04 | Petmate Precision Pet Soft Side Play Yard (Large) | `petmate-precision-pet-soft-side-play-yard` | 7,2,6 | C | Soft-sided yard with ground stakes, washable floor panels, removable top. | Not shown to hold a determined or large dog; units on the page are missing. | 16/11/9/6/7 | 49 | RESERVE |
| M05 | North States MyPet Universal Petgate (26 in high) | `north-states-mypet-universal-petgate` | 2,7 | C | Adjusts to 26 to 42 in openings; pressure or hardware mount; page says never use tension-only at the top of stairs. | No containment-strength claim; size 26 in high. | 16/13/12/6/7 | 54 | RESERVE |
| M06 | rabbitgoo Dog Car Barrier for SUV, steel wire, foldable | `rabbitgoo-suv-dog-car-barrier` | 1,7 | C (Amazon listing) | Listing: steel wire, triple fold, adjusts about 35.8 to 59.8 in. | Listing does not mention two dogs; a barrier is not a restraint. | 14/8/8/5/7 | 42 | RESERVE |
| G01 | Ruffwear Knot-a-Leash (5 ft, Small or Large) | `ruffwear-knot-a-leash` | 8 | C | 5 ft reflective rope leash, 7 mm (Small) or 11 mm (Large) rope, auto-locking carabiner. | Needs the dog's size; no strength rating on the page. | 20/13/11/5/8 | 57 | RESERVE |
| G02 | Adventure Medical Kits Adventure Dog Medical Kit: Trail Dog | `amk-trail-dog` | 8,6 | C | 12 oz, 7.5 x 5.3 x 1.5 in, waterproof bag, pet first aid handbook, listed contents (gauze, irrigation tool, forceps, saline). | Includes medicines-adjacent items (diphenhydramine tablets): check with a vet before use; maker says the triangular bandage can serve as a muzzle (do not present as advice). | 22/14/13/5/8 | 62 | RESERVE |

`n/s` = not scored because no usable page was read. Rows with evidence code C rely on an earlier worker's read of the maker page; the Cowork pass re-reads them.

## 5. Shortlist per article

Every shortlist item is conditional on the Cowork pass (Amazon link, variant, availability evidence for the brief only). "Evidence" names what we hold today. "No-product alternative" is what the article says if nothing survives.

### Article 1: Winter road trips with dogs

- **W01 Ruffwear Polar Trex Winter Dog Boots** (Boots; catalog id `ruffwear-polar-trex-boots`; total 70/92, tier SHORTLIST)
  - Best suited for: a dog that needs paw coverage in snow, ice and salt, owner willing to measure paw width.
  - Why useful: Maker states a waterproof, windproof softshell upper and ice-and-snow traction; vets say boots are the most reliable barrier on salted ground and to follow the maker's sizing (PetMD, VCA).
  - What to check: paw width in inches against the maker chart, front and rear may differ, fit check on a short walk, remove indoors (PetMD), no insulation rating stated.
  - Not ideal for: dogs that refuse boots; the link opens one size only.
  - Evidence: C + V; sources in section 1 and 4.
- **W09 Ruffwear Powder Hound Waterproof Insulated Jacket** (Dog coat; catalog id not in catalog; total 63/92, tier SHORTLIST)
  - Best suited for: a dog that needs a waterproof outer layer in wet, windy cold.
  - Why useful: Maker states waterproof shell (10,000 mm) and insulation in back and belly; leash portals for use over a harness.
  - What to check: measure chest girth and back length; the page shows two size charts; no temperature range stated.
  - Not ideal for: dogs that overheat easily indoors or in a heated car; check how it sits with a car harness before wearing it in the car.
  - Evidence: M; sources in section 1 and 4.
- **S01 Kurgo Rover Hammock, Extended Width (63 x 56 in)** (Seat hammock; catalog id `kurgo-rover-hammock-extended-width`; total 61/92, tier SHORTLIST)
  - Best suited for: large dogs in a big SUV or truck back seat.
  - Why useful: 63 x 56 in hammock with seat-belt openings protects the seat (maker).
  - What to check: vehicle width; it is not a restraint.
  - Not ideal for: small cars; any claim that it keeps a dog safe in a crash.
  - Evidence: C; sources in section 1 and 4.
- **Q02 Soggy Doggy Super Shammy Towel** (Dog towel; catalog id `soggy-doggy-super-shammy-towel`; total 63/92, tier SHORTLIST)
  - Best suited for: drying a wet dog at the door or in the car, any size.
  - Why useful: One size 31 x 14 in, hand pockets, machine washable (maker).
  - What to check: large or double-coated dogs need more than one towel; dry fully before packing.
  - Not ideal for: a dog that is too big for one towel to dry.
  - Evidence: C; sources in section 1 and 4.

**Reserve:** B01 Kurgo Collaps-A-Bowl, V03 Beacon light, Q01 wipes, W10 Climate Changer fleece, W11 Timberline Fuse vest; restraint: link to Article 4 (no restraint recommended here until Article 4 clears).

**No-product alternative:** Restraint advice with no product: "Use a restraint that fits your dog and read the independent certification record yourself" (Article 4), plus a seat cover and a dry towel from your own home; boots can be replaced by wiping paws at the door (ASPCA, VCA).

### Article 2: Smoky Mountain Christmas cabins with dogs

- **Q03 Soggy Doggy Microfiber Doormat (no bone), Large 26 x 36 in / XL 36 x 60 in** (Door mat; catalog id `soggy-doggy-microfiber-doormat`; total 60/92, tier RESERVE)
  - Best suited for: cabin doorway or RV entry where wet paws arrive.
  - Why useful: Absorbent microfiber mat with non-slip backing, machine washable (maker).
  - What to check: Large 26 x 36 in vs XL 36 x 60 in; whether the host allows adding a mat.
  - Not ideal for: a doorway with no floor space.
  - Evidence: C; sources in section 1 and 4.
- **D01 Kurgo Loft Wander Dog Bed (Large 36 x 48 in)** (Travel bed; catalog id `kurgo-loft-wander-dog-bed`; total 67/92, tier SHORTLIST)
  - Best suited for: a dog that needs its own spot on rental floors or in an RV.
  - Why useful: Roll-up bed with water-resistant top and waterproof non-slip base; machine washable (maker).
  - What to check: Medium vs Large dimensions; Amazon link is Large.
  - Not ideal for: dogs that chew or dig beds; heavy-duty crate use.
  - Evidence: C; sources in section 1 and 4.

**Reserve:** M02 Carlson yard (if the rental has no fence), M05 gate, Q02 shammy towel, S05 Pawtect pads.

**No-product alternative:** The article is about pet policies: ask the property manager about fees, size limits and checkout cleaning; use a bath towel from home and a bed or blanket the dog knows; no product is needed to understand the rules. Never invent a cabin; the plan says stays are not named.

### Article 3: Low-mess enrichment for rentals

- **E01 KONG KONG Classic (size by weight)** (Stuffable rubber toy; catalog id `kong-classic`; total 67/92, tier SHORTLIST)
  - Best suited for: a dog that does well with a stuffable rubber toy, with a person nearby.
  - Why useful: Six weight-based sizes; maker says supervised use only and discard if damaged.
  - What to check: size by weight; the maker states no toy is indestructible; fillings with sticky or messy contents are a rental floor risk (our observation).
  - Not ideal for: power chewers (maker suggests sizing up or Extreme; check the maker page).
  - Evidence: C; sources in section 1 and 4.
- **E02 KONG Wobbler (Small / Large)** (Treat-dispensing feeder; catalog id not in catalog; total 69/92, tier SHORTLIST)
  - Best suited for: dogs that already eat from a puzzle feeder; dry food or small treats.
  - Why useful: Fills with dry food or small treats up to 1 cup, unscrews, top-shelf dishwasher safe (maker).
  - What to check: size (Small up to 20 lb, Large about 30 to 65 lb; 20 to 30 lb is unspecified), not a chew toy; supervised use.
  - Not ideal for: dogs under about 20 to 30 lb in the wrong size; rental floors where rolling noise matters (our inference).
  - Evidence: M; sources in section 1 and 4.

**Reserve:** E03 Woof Pupsicle (HOLD: maker page not found), E04 West Paw Toppl (HOLD: maker page not reachable), E05 LickiMat (HOLD: product pages unread), E06 Starmark Bob-A-Lot (UNSCORED).

**No-product alternative:** Use part of the regular meal in a bowl, or a rolled towel, with a person watching; add a source (veterinary or behaviour college) before publishing this, as it is a general suggestion not yet backed by a page read here. No claims about barking, anxiety or destruction.

### Article 4: Car restraints and crash-test claims

- **C01 Lucky Duck Lucky Kennel, Large (with Lucky Anchor Straps)** (Crash-tested crate; catalog id `lucky-duck-lucky-kennel-large`; total 69/92, tier HOLD)
  - Best suited for: large dogs (about 70 to 110 lb) riding in a vehicle with an anchor system.
  - Why useful: CPS 5 Star with a 110 lb engineered test dog and the Lucky Anchor Straps (press release 2021-04-15).
  - What to check: needs the CPS record page, the test date, which strap kit, whether Amazon sells this exact size and color.
  - Not ideal for: small dogs; any use without the straps.
  - Evidence: P (CPS record UNVERIFIED); sources in section 1 and 4.
- **C02 Lucky Duck Lucky Kennel, Intermediate (with Lucky Ratchet Strap Kit)** (Crash-tested crate; catalog id `lucky-duck-lucky-kennel`; total 60/92, tier HOLD)
  - Best suited for: medium-large dogs under about 70 lb.
  - Why useful: Maker states 5 Star from CPS; snippet reports tested July 2022 up to 75 lb with the Ratchet Strap Kit.
  - What to check: same checks as above; maker weight (under 70 lb) vs certified weight (75 lb) must be stated honestly.
  - Not ideal for: dogs near the top of the size band; any use without straps.
  - Evidence: M (CPS UNVERIFIED); sources in section 1 and 4.
- **C06 GUNNER G1 Kennel, Intermediate (with 8 ft Tie-Down Straps)** (Crash-tested crate; catalog id `gunner-g1-kennel`; total 65/92, tier HOLD)
  - Best suited for: dogs up to 70 lb.
  - Why useful: Maker blogs say 5 Star with 8 ft Tie-Down Straps (2016).
  - What to check: sold out on the maker page 2026-11-25; Amazon link OFF; whether CPS retested.
  - Not ideal for: buyers who need it delivered quickly (not a site claim).
  - Evidence: P (CPS record UNVERIFIED); sources in section 1 and 4.
- **C08 Sleepypod Clickit Range Crash-Tested Harness (Regular and Long, Small to 2X-Large)** (Crash-tested harness; catalog id `sleepypod-clickit-range`; total 61/92, tier HOLD)
  - Best suited for: dogs 18 to 110 lb that ride on a rear seat belt.
  - Why useful: Maker says 5 Star for Regular and Long sizes; catalog records the CPS listing for Small to X-Large (Nov 2024).
  - What to check: 2X-Large and Long are not in the earlier CPS note; Amazon listing had no buy box; do not use non-Sleepypod accessories.
  - Not ideal for: dogs that need 2X-Large until CPS shows it.
  - Evidence: M (copy ambiguous) + C; sources in section 1 and 4.
- **C11 Saker Canine Bomber Harness (XS to L)** (Harness with CPS listing; catalog id `saker-bomber-harness`; total 58/92, tier HOLD)
  - Best suited for: large dogs in a harness that routes the belt through the handle.
  - Why useful: CPS listing recorded earlier: passed, Nov 2022, 75 lb test dog.
  - What to check: Amazon destination unknown; maker page does not mention CPS and shows two force figures.
  - Not ideal for: buyers who need weight limits (none on the maker page).
  - Evidence: C (CPS record UNVERIFIED); sources in section 1 and 4.

**Reserve:** C13 Ruffwear Load Up (label "maker-commissioned sled test, not CPS"), C03 and C07 strap kits (required with C01/C02/C06), C04 and C05 Gunner Small and Medium, C12 Sleepypod Atom for very small dogs; REJECTED for this guide: C09, C14.

**No-product alternative:** Teach readers to check the CPS record themselves and recommend no crash-certified product by name until Cowork reads the exact record. Hold every item above at HOLD until then.

### Article 5: Dog boots vs paw wax

- **W01 Ruffwear Polar Trex Winter Dog Boots** (Boots; catalog id `ruffwear-polar-trex-boots`; total 70/92, tier SHORTLIST)
  - Best suited for: a dog that needs paw coverage in snow, ice and salt, owner willing to measure paw width.
  - Why useful: Maker states a waterproof, windproof softshell upper and ice-and-snow traction; vets say boots are the most reliable barrier on salted ground and to follow the maker's sizing (PetMD, VCA).
  - What to check: paw width in inches against the maker chart, front and rear may differ, fit check on a short walk, remove indoors (PetMD), no insulation rating stated.
  - Not ideal for: dogs that refuse boots; the link opens one size only.
  - Evidence: C + V; sources in section 1 and 4.
- **W06 Musher's Secret Paw Protection Wax** (Paw wax; catalog id not in catalog; total 52/92, tier SHORTLIST)
  - Best suited for: short walks on salted sidewalks or snowballing between pads, as an addition or an alternative for dogs that will not wear boots.
  - Why useful: Forms a barrier against damp and chemicals and keeps snow from clumping (PetMD), applied before a walk (VCA).
  - What to check: wipe paws and re-apply afterward; vets say balm does not stop sharp ice or temperature extremes and is not a substitute for boots; read the maker's ingredient list and any lick caution.
  - Not ideal for: long cold-weather walks on ice; dogs with skin problems (ask a vet).
  - Evidence: S + V; sources in section 1 and 4.
- **Q01 Adventure Medical Kits Adventure Dog Wipes (8 wipes per pack)** (Wipes; catalog id `adventure-medical-kits-dog-wipes`; total 61/92, tier SHORTLIST)
  - Best suited for: wiping salt and grime from paws and belly at the door or in the car.
  - Why useful: ASPCA and VCA both advise wiping or washing paws after walks.
  - What to check: check pack count on the Amazon listing; wipes are for cleanup, not a treatment for cracked or sore pads.
  - Not ideal for: paws with open cracks or sores (see a vet).
  - Evidence: C + V; sources in section 1 and 4.

**Reserve:** W02 Grip Trex (three-season trail boot), W07, W08 balms (UNSCORED), W03, W04 boots (UNSCORED), Q02 towel.

**No-product alternative:** Wipe paws after every walk and shorten walks on salted ground (ASPCA, VCA); ask a vet about paw protectants; no product required.

### Article 6: Winter RV travel with dogs

- **B01 Kurgo Collaps-A-Bowl (24 oz)** (Collapsible bowl; catalog id `kurgo-collaps-a-bowl`; total 71/92, tier SHORTLIST)
  - Best suited for: any dog and trip, from road trips to RV stops.
  - Why useful: 24 oz food-grade silicone bowl that collapses flat; top-rack dishwasher safe (maker).
  - What to check: capacity for a large dog; colour ASINs are separate listings.
  - Not ideal for: dogs that chew silicone.
  - Evidence: C; sources in section 1 and 4.
- **D01 Kurgo Loft Wander Dog Bed (Large 36 x 48 in)** (Travel bed; catalog id `kurgo-loft-wander-dog-bed`; total 67/92, tier SHORTLIST)
  - Best suited for: a dog that needs its own spot on rental floors or in an RV.
  - Why useful: Roll-up bed with water-resistant top and waterproof non-slip base; machine washable (maker).
  - What to check: Medium vs Large dimensions; Amazon link is Large.
  - Not ideal for: dogs that chew or dig beds; heavy-duty crate use.
  - Evidence: C; sources in section 1 and 4.
- **B06 Petmate (Vittles Vault) Travel-Tainer Portable Food Storage Container (6 cup)** (Food storage with bowls; catalog id `vittles-vault-travel-tainer`; total 61/92, tier SHORTLIST)
  - Best suited for: RV or cabin with limited cupboard space.
  - Why useful: 6-cup airtight container with two bowls and a handle (maker).
  - What to check: kibble volume for the trip length; the container is not dishwasher safe, the bowls are.
  - Not ideal for: multi-week supplies for large dogs.
  - Evidence: C; sources in section 1 and 4.
- **W01 Ruffwear Polar Trex Winter Dog Boots** (Boots; catalog id `ruffwear-polar-trex-boots`; total 70/92, tier SHORTLIST)
  - Best suited for: a dog that needs paw coverage in snow, ice and salt, owner willing to measure paw width.
  - Why useful: Maker states a waterproof, windproof softshell upper and ice-and-snow traction; vets say boots are the most reliable barrier on salted ground and to follow the maker's sizing (PetMD, VCA).
  - What to check: paw width in inches against the maker chart, front and rear may differ, fit check on a short walk, remove indoors (PetMD), no insulation rating stated.
  - Not ideal for: dogs that refuse boots; the link opens one size only.
  - Evidence: C + V; sources in section 1 and 4.

**Reserve:** V01 Waggle monitor (HOLD: subscription, power and temperature limits unverified; never described as making a pet safe alone), S05 Pawtect pads, V03 Beacon, Q02 towel, W09 coat.

**No-product alternative:** Use your own washable bed and towels, a household bowl and a thermometer you already own for the RV; never leave a dog alone in a vehicle on the expectation that a gadget will make it safe; no heater is recommended.

### Article 7: Multi-dog rental getaway

- **M02 Carlson Pet Products Convertible Pet Yard (6 panels, 28 in high)** (Pen / gate; catalog id `carlson-convertible-pet-yard`; total 59/92, tier SHORTLIST)
  - Best suited for: two or more dogs in a rental without a fenced yard, as a play or feeding area.
  - Why useful: Six 24 in metal panels, 28 in high, 16.3 in walk-through door (maker).
  - What to check: 28 in height vs jumpers; gap 2 to 2.5 in; no weight limit stated.
  - Not ideal for: dogs that climb or jump; unsupervised use.
  - Evidence: C; sources in section 1 and 4.
- **M01 MidWest Homes for Pets iCrate 36-inch double door crate (41-70 lb)** (Home wire crate; catalog id `midwest-icrate-36-inch-double-door-crate`; total 59/92, tier RESERVE)
  - Best suited for: one dog in a big rental that needs a crate (this listing is for 41 to 70 lb).
  - Why useful: 36 in double-door folding crate with divider and pan (listing and maker).
  - What to check: pick the size for the dog; two dogs need two crates; not a car restraint.
  - Not ideal for: car travel; escape artists (maker makes no strength claim).
  - Evidence: C; sources in section 1 and 4.
- **S01 Kurgo Rover Hammock, Extended Width (63 x 56 in)** (Seat hammock; catalog id `kurgo-rover-hammock-extended-width`; total 61/92, tier SHORTLIST)
  - Best suited for: large dogs in a big SUV or truck back seat.
  - Why useful: 63 x 56 in hammock with seat-belt openings protects the seat (maker).
  - What to check: vehicle width; it is not a restraint.
  - Not ideal for: small cars; any claim that it keeps a dog safe in a crash.
  - Evidence: C; sources in section 1 and 4.

**Reserve:** M03 MidWest pen (HOLD: seen unavailable), M04 soft yard, M05 gate, M06 barrier, V04 Tractive DOG 6, C01 large crate (Article 4 rules apply), B04 Gunner bowl.

**No-product alternative:** Plan separate sleeping spots from existing bedding, a strict door routine and the rental's own rules on dog numbers (see the existing how-many-dogs guide); no product required.

### Article 8: Gifts for dog travelers

A curated set, grouped by how hard the gift is to choose. All from the catalog first; shortlist ids are conditional on Cowork.

**Size-agnostic or one-size (easy to choose without measuring):** B01 Kurgo Collaps-A-Bowl; Q02 Soggy Doggy Super Shammy Towel; Q01 Adventure Dog Wipes; B06 Vittles Vault Travel-Tainer; G02 Adventure Dog Medical Kit Trail Dog (reserve).

**Needs a measurement or the dog's size (say so in the guide):** W01 Ruffwear Polar Trex boots (paw width); D01 Kurgo Loft Wander bed (Medium or Large); E01 KONG Classic (by weight) or E02 KONG Wobbler; G01 Ruffwear Knot-a-Leash (Small or Large); V03 Beacon (clips to Ruffwear loops only); V04 Tractive DOG 6 (above 8.8 lb; subscription).

**Ideas to avoid:** vests or gear implying legal status; anything from the HOLD list; any item whose Amazon link opens one size without telling the giver.

**Evergreen note:** the group above works for road trips, cabins, RV and multi-dog homes. **No-product alternative:** a gift of time, such as a booked pet-friendly stay or a vet-approved treat shared, with the recipient choosing the item; plus a written note of the dog's measurements.

## 6. Rejected candidates and reasons

| Candidate | Reason |
|---|---|
| Sleepypod Clickit Sport Plus (C09) for Article 4 | CPS record held is for the earlier "Clickit Sport" (2014); maker pages give 25, 90 and 110 lb; Amazon listing had no buy box and no brand on the page |
| Sleepypod Clickit Sport (existing inactive record) | Amazon listing is the 2020 model; maker sells Sport Plus; weight ratings conflict |
| Kurgo Enhanced Strength Tru-Fit (C14) as "crash tested" | Maker-only claim at an unnamed facility; a search snippet says CPS has not certified it; stays in the catalog for general use but cannot be called crash tested |
| Ruffwear Load Up as "certified" | The maker says it is not CPS certified; allowed only with an explicit label |
| GUNNER G1 Large | Maker does not list it as CPS certified |
| Lucky Kennel Medium | No evidence found for a CPS record |
| Barriers, boosters and seat covers as restraints | Not restraints; none claims a certification |
| PetSafe Happy Ride Collapsible Crate for "crash-tested" claims | No claim made by the maker |
| Sleepypod Atom as the main small-dog pick | CPS page unread; weight conflict (12 vs 18 lb); tiny dogs only |
| Woof Pupsicle, West Paw Toppl, LickiMat as winners | Maker pages were not readable; retailer wording disagrees; kept as HOLD |
| Waggle RV Pet Monitor as a safety product | Needs a subscription and power; operating temperature unverified; must not be written as making unattended pets safe; kept HOLD for a limited "monitoring" mention only |
| Pawz or other latex/rubber-style boots | PetMD (DVM-authored) advises against latex or rubber boots; not read at maker level |
| Ruffwear Highlands sleeping bag, Gunner Long Haul bed, Orvis throw, KONG cargo liner and KONG XL hammock | Inactive in the catalog (made for outdoor use, not rental furniture, no buy box, or conflicting specs) |
| Any product from the PetMD/ASPCA articles that is not an Amazon product | Owner rule: Amazon products only |

## 7. UNVERIFIED (everything Cowork or the owner still has to close)

1. Every Center for Pet Safety record: the certified-products list and the individual pages for Lucky Kennel (Large and Intermediate), GUNNER G1 (Small, Medium, Intermediate), Sleepypod Clickit Range, Sport Plus and Terrain Plus, Saker Bomber and Sleepypod Atom (pages named in the Cowork brief).
2. The Amazon title, ASIN, variant, seller and buy-box state of every shortlisted and reserve candidate (sections 4 and 5), including strap kits for the Lucky Kennel and GUNNER G1.
3. Which Amazon variant matches each maker page, especially for size-specific boots, coats, beds and bowls.
4. Maker pages not readable here: Woof Pupsicle, West Paw Toppl, LickiMat product pages, Musher's Secret, Hurtta boots and coat, Muttluks, Pawz, Natural Dog Company, Burt's Bees, Earth Rated, Dexas MudBuster, Starmark, Govee, Waggle spec sheet (operating temperature, power, subscription).
5. Whether the Sleepypod Clickit Terrain Plus URL is a distinct product (the fetch returned Clickit Range copy).
6. The owner's decision on which items "OFF in the repo" were meant (ramp and exercise kit: not found OFF).
7. Winter-specific veterinary guidance for RV travel (cold-weather limits, carbon monoxide and heat safety for pets); none was read for Article 6, and no heating product is proposed.
8. A veterinary or behaviour-college source for the enrichment article's general advice (no source read).
9. `docs/editorial/TREND_EIGHT_ARTICLE_PLAN.md` did not exist when this file was written; trend term lists in the Cowork brief are proposals.

## 8. Counts

- Existing catalog products reused (appear in a shortlist, reserve or hold here): 39 of 65 active (ids in section 2.2 and the candidate table).
- Candidates evaluated (rows in section 4): 66, of which 53 scored and 13 UNSCORED (nothing read).
- Shortlist slots: 19 distinct ids; reserve and HOLD items listed in section 5.
- Rejected: 14 explicit rejects in the table above plus the existing inactive records.


## 9. Finalists (2026-11-25; owner decisions applied)

Owner decisions: Article 4 is merged into `dog-car-safety-harness-and-crate-guide` (no CPS-certified winner until the exact model and certification are verified); Article 7 is merged into `how-many-dogs-can-you-bring-to-a-vacation-rental` (no new products); Article 8 is written last and published only if Cowork verifies a strong practical selection. Cowork prompt: `docs/cowork/TREND_AMAZON_PROMPT_2.md` (verifies about 57 products in four batches instead of all 66).

- **Batch 1A (re-verify and paw care):** Polar Trex boots, Musher's Secret, Natural Dog Company Paw Soother, AMK wipes, Super Shammy, Trail Dog kit, Springland 22oz, Soggy Doggy doormat, Kurgo Loft Wander bed, MidWest iCrate, North States gate, KONG Classic.
- **Batch 1B (new slots and reserves):** KONG Wobbler, LickiMat, KONG Extreme, West Paw Toppl, Woof Pupsicle (candidate only), one crumb mat, Collaps-A-Bowl, Vittles Vault, Mt. Bachelor Pad, Waggle (only if sold on Amazon and defensible), Govee, Grip Trex.
- **Batch 2 (car-safety merge):** Lucky Kennel Large and Intermediate plus strap kit, GUNNER G1 Intermediate and Small plus strap kit, Sleepypod Clickit Range, Saker Bomber, Sleepypod Atom (carrier row), Load Up and PetSafe collapsible crate as controls.
- **Batch 3 (gifts):** 10 new checks plus about 10 carried over from Batches 1 and 2.
- **Dropped from further research (not needed for any slot):** C09 Clickit Sport Plus, C10 Terrain Plus, C14 Kurgo Tru-Fit (stays in catalog, never called crash tested), W03, W04, W05 boots, W08 Burt's Bees, W12 Hurtta Warmer, Q04, Q05, E06, B03, B04, S02 to S05, D02, M01, M02, M03 (not placed in the cabin draft), M04, M06, V04, V05.
