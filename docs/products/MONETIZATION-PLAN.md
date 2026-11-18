# Monetization plan: guides, /gear hub and tools into Amazon Associates revenue

Written 2026-11-18. Plan only, no code. Labels: VERIFIED (read in repo or on a public page today), JUDGMENT (my call), NEEDS-OWNER.
docs/AFFILIATE-PORTFOLIO-STRATEGY.md does not exist on this branch. Facts come from the recovery docs, content/products.yml (58 records), gear-categories.ts (13 categories), gear-links.ts and the swap procedure.

## 0. Starting position (VERIFIED)
- 29 guides: 22 in content/guides, 7 in src/content/guides (index.ts is not a guide). Only one has an affiliate link: a Vrbo link in the pet-fees guide. No product has an affiliate link; content/affiliates.yml holds Vrbo "stay" entries only. Amazon is not applied for.
- 58 product records exist, but the ramp, life jacket and bowl guides discuss products in prose and render no cards yet (RelatedProducts.tsx exists for that).
- Revenue today is effectively zero. The first job is not volume, it is getting 3 genuine Amazon sales inside 180 days of applying, without breaking a rule.
- Amazon pays 3.00% on Pets Products and 0% on pet prescription medicine (our application pack): small money per sale; no prescription items.

## 1. Guide map: shopping intent and product slots
Intent: strong = reader is picking gear; light = one or two honest mentions; none = no product link, keep it clean (stays or rules content, where a gear link would look off-topic).

| Guide (slug) | Intent | Product slots (existing ids first) |
|---|---|---|
| dog-car-safety-harness-and-crate-guide | strong | sleepypod-clickit-range, saker-bomber-harness, sleepypod-atom, gunner-g1-kennel, lucky-duck-lucky-kennel; add ruffwear-load-up-car-harness, kurgo-enhanced-strength-tru-fit |
| two-large-dogs-in-one-car | strong | kurgo-backseat-barrier, petsafe-happy-ride-dog-barrier, clickit, load-up, kong-bench-seat-cover-hammock-xl |
| dog-ramp-or-steps-for-the-car-and-cabin | strong | the four petsafe-happy-ride ramps and steps |
| dog-life-jacket-for-lakes-and-beaches | strong | ruffwear-float-coat, outward-hound-dawson-swim-life-jacket; light: ruffwear-swamp-cooler |
| dog-travel-bowls-and-food-storage | strong | kurgo-collaps-a-bowl, springland x2, vittles-vault-travel-tainer, kurgo-kibble-carrier; add kurgo-splash-free-wander-bowl, ruffwear-quencher-bowl, petmate-silicone-travel-bowl-duo, gunner-dog-bowl |
| dog-travel-first-aid-kit-guide | strong | amk-me-and-my-dog, amk-trail-dog, kurgo x2, baskerville-ultra-muzzle |
| if-your-dog-gets-loose-on-a-trip | strong | akc-reunite-stainless-collar-tag, tractive-dog-6, tractive-dog-6-xl, fi-series-3-plus |
| portable-dog-fence-and-playpen-guide-for-rentals | strong | midwest-exercise-pen-with-door, north-states-petyard, carlson-convertible-pet-yard, petmate-precision-pet-soft-side-play-yard |
| dog-friendly-cabin-packing-list | strong (hub) | one pick per category; links to /gear and the kits. Fix the broken self-link to a rental protection guide first |
| airbnb-pet-damage-charge-after-checkout | light | orvis-embossed-sherpa-throw, kong-ultimate-cargo-liner or a bench seat cover, adventure-medical-kits-dog-wipes |
| can-dogs-go-in-a-rental-pool-or-hot-tub | light | ruffwear-float-coat (one slot, links the life jacket guide) |
| vacation-rental-with-a-senior-dog | light | petsafe-happy-ride-side-door-steps, gunner-long-haul-bed, kurgo-loft-wander-dog-bed (no senior claim; vet caveat stays) |
| puppy-at-a-vacation-rental | light | petmate play yard, petsafe-happy-ride-collapsible-crate. Too thin for a kit (see 2) |
| christmas-week-in-a-cabin-with-a-dog | light | ruffwear-climate-changer-fleece, ruffwear-polar-trex-boots, a pen. The only seasonal guide with a live slot before Black Friday |
| new-years-eve-with-a-dog-in-a-vacation-rental | light | tractive/fi and the tag, via link to the loose-dog guide. No calming products |
| can-you-leave-a-dog-alone-in-a-vacation-rental | light | none by default; no cameras or calming claims |
| what-a-dog-really-costs-on-a-vacation-rental | light | one line each: bowl, bed, first aid; link /tools/pet-cost-check |
| pet-friendly-vacation-rental-checklist, vacation-rental-secure-fenced-yard | light | link to /gear and the fence guide only |
| vacation-rentals-that-welcome-large-dogs | light | kong hammock XL, ramps, link /gear/large-dogs |
| how-vacation-rental-pet-fees-work, vacation-rentals-with-no-pet-fee, vacation-rentals-with-no-dog-weight-limit, how-many-dogs-can-you-bring-to-a-vacation-rental, breed-restrictions-at-vacation-rentals, bringing-a-dog-to-a-no-pets-rental, pet-friendly-listing-red-flags, dogs-in-georgia-state-park-cabins, vacation-rental-with-a-reactive-dog | none | Stay and rules intent: Vrbo links stay the only monetization. Reactive-dog page: no gear (no unsourced behaviour claims) |

Total: 9 strong, 11 light, 9 none = 29. The packing tool (/tools/packing-list) already links items to /gear categories; it is the cabin kit's interactive twin. The pet cost tool (/tools/pet-cost-check) gets one "gear you may need" line after the result, no buttons inside it.

## 2. Page types to build (no collisions: current routes checked; no /kits or /gifts exist)

### 2a. Trip kits
Index /kits and detail /kits/<slug>. Each kit is a short ordered list: item, one line on why it matters on a trip, a "Read why" link to the guide that explains it, product cards (from products.yml via RelatedProducts), and the "Researched, not tested by us" line. 

| URL | Built from existing products | Readiness |
|---|---|---|
| /kits/cabin-weekend | kurgo-loft-wander-dog-bed, orvis throw, midwest pen, kurgo-collaps-a-bowl, vittles-vault, kurgo first aid, wipes, tracker | Ready |
| /kits/beach-day | float coat, Dawson jacket, swamp-cooler, mud-dog shower, quencher bowl, wipes | Ready |
| /kits/road-trip | clickit or load-up, kong hammock XL, splash-free bowl, cargo cape, ramp | Ready |
| /kits/two-large-dogs | backseat barrier, petsafe barrier, clickit, load-up, hammock XL, gunner G1 (one dog per crate) | Ready; guide exists |
| /kits/senior-dog-trip | petsafe steps and ramp, gunner-long-haul-bed, loft bed, first aid | Ready only with "makers do not call these senior products; ask your vet" |
| /kits/puppy-trip | petmate play yard, collapsible crate, wipes, first aid | NOT ready: HUB-IMPLEMENTED says a puppies category failed the 3-product test; research 2 to 3 more products first |

Needs new routes (kits.index.tsx, kits.$slug.tsx), a kit data file and a sitemap entry: engineering work.

### 2b. Seasonal gift guide
Proposed URL: /gifts/people-who-travel-with-dogs (title may carry the year; the slug stays evergreen so it can be reused). Today is 2026-11-18 and Black Friday is 2026-11-27, nine days away.
- Realistic before 2026-11-27: one gift page of 10 to 12 products already in products.yml (first aid kit, travel bowl, bed, throw, GPS tracker, boots, fleece, shower), with plain maker links, linked from the Christmas-week guide, /gear and the home page.
- Amazon links on it by Black Friday: only if the owner applies this week AND gets Site Stripe data for each product by about 2026-11-24 (section 4). Possible, not promised. If not ready, ship with maker links and swap in later with no page change (section 4).
- NOT realistic: organic search traffic for the page before Black Friday (new pages take days to weeks to be crawled, indexed and ranked, JUDGMENT; no tool I could reach measures this); any "deals", "% off" or "cheapest" wording (prices are barred, section 3); the six kits; printable PDFs; comparison tables; new product research. Make no shipping or delivery promises.
- Group gifts by the person (road-trip driver, cabin renter, beach dog), never by budget.

### 2c. Best-value picks inside guides
A boxed section near the end of a strong guide: "Our value pick" with the product, a two-line reason, and a one-line "evidence" row. Allowed evidence only: (a) a named reviewer page that calls it budget or best value (quote under 15 words), (b) maker specs (weight rating, size range, materials, warranty), (c) a named independent tester. Label it "Value pick", never "cheapest". Each box says what we could not confirm.

### 2d. Printable kit checklists
URL /kits/<slug>/checklist is a print-optimised view of the same kit. Product links appear on screen only. In the print stylesheet, hide every affiliate button and URL and print item names only. Amazon bars promotion "in any offline manner" including "printed material, ebook, mailing" (section 3). No downloadable PDF may carry an Amazon link. Maker links and the unlinked list are fine to print.

### 2e. Budget vs premium table pattern
Two or three columns, one row per feature, no money anywhere: size range, weight rating, materials, warranty, what the maker states about testing, what we could not confirm, who it suits, and an "Evidence" row citing the page read. Headers: "Value pick" and "Step-up pick"; do not imply a price difference we cannot show. The private price band (section 4) never appears.

## 3. Amazon Associates rules that constrain us (all read 2026-11-18)
Sources: Operating Agreement https://affiliate-program.amazon.com/help/operating/agreement ; Program Policies https://affiliate-program.amazon.com/help/operating/policies ; application help topic https://affiliate-program.amazon.com/help/node/topic/G8TW5AE9XL2VX9VM ; link-building help https://affiliate-program.amazon.com/help/node/topic/GP38PJ6EUR6PFBEC . The Agreement incorporates the Policies by reference.

| Rule | What the page says | What we do |
|---|---|---|
| Disclosure sentence | Agreement s5: state "As an Amazon Associate I earn from qualifying purchases." "clearly and prominently" on your Site. Policies cite FTC rules generally; no exact placement is given | Put the exact sentence on every page that carries an Amazon link, directly above or beside the first product card, plus the footer of those pages and /affiliate-disclosure. Keep our existing "Affiliate link" label. Placement beside the links is JUDGMENT, the Agreement requires "clearly and prominently" only |
| No prices or ratings | Policies 2(b): prices and availability only if Amazon serves the link or the data comes via Creators API or PA API, with a date/time stamp and disclaimer | Show none. products-schema.ts already rejects price and rating keys. No "deal", no "in stock" |
| Special links | Agreement s1 and Policies 2(a): links must use tagged formats with our Associates ID; 2(b): accessed directly from our Site; do not encourage bookmarking | Link directly to Amazon with our tag. No "/go/" redirect route of our own |
| No cloaking or hiding | Policies 6(v): no cloaking, hiding or obscuring the URL of your site containing Special Links; 6(w): no link shortener that makes it unclear the link goes to Amazon | Button text must say it goes to Amazon ("See it at Amazon"). Our resolver already labels the network |
| Site Stripe | Not named in the Policies pages I read; the help page gives a direct format using ASIN and Associate ID and says it qualifies for the direct link bonus | See section 4 for the format we store |
| No offline or emailed links | Participation Requirements s4: no promotion offline (printed material, ebook, mailing, oral). Links in email or SMS only if solicited and opted in | No PDFs, no print links (section 2d). No Amazon links in newsletters until the owner decides; LEAD-CAPTURE is a separate question |
| Incentives and self-purchase | 6(g): no reward for using links; 6(u): no buying through your own links | No "buy through us" perks, no coupons. Personal orders do not count toward the 3 sales |
| Images | IP licence 2(h): do not store or cache Amazon image content (link only, up to 24h) | Our cards are photo-less. Keep it so: no saved Amazon images |
| Where not to promote | 6(o): no pop-ups, pop-unders, layer ads; 6(p): not in content placed on an Amazon site | Plain inline links only |
| 180 days | Help topic: Associates "require at least three within the first 180 days"; personal orders do not count; a rejected application cannot be reassessed | Apply only when real visits exist; see the 30-day plan |
| Assignment | s12: cannot assign without Amazon's written approval | A buyer applies fresh and re-tags (AFFILIATE-AND-SELLING.md) |

What breaks nothing today: all 29 guides, the hub and both tools show no price, no rating, no Amazon image and no Amazon link, so none of them breaches anything now. Not yet compliant: /affiliate-disclosure covers products and says the Amazon sentence appears on the page, but the sentence itself must be built into the page template before the first Amazon link; HUB-IMPLEMENTED itself says network-specific wording is NOT CONFIRMED. The hub's disclosure line appears only when an affiliate link renders, which is the right behaviour. Also make GearPicks and PackingBuilder use relFor (not done per HUB-IMPLEMENTED; AFFILIATE-OPPORTUNITIES describes an older rel with noreferrer).

## 4. How links work in the central system, and the Amazon record
Existing chain (VERIFIED): products.yml holds NO URL, only two names. affiliateProgram = id of a program entry in content/affiliates.yml; affiliateTrackingId = id of the entry holding that product's link. resolveProductLink returns approved affiliate entry (never kind: stay), else manufacturer page, else retailer, else nothing; relFor gives affiliate "sponsored nofollow noopener". Un-approving an entry sends every product back to the maker link at once. The build fails on a name that does not exist.

Proposal: store a canonical product address with the owner's tag, not a Site Stripe short link.
- Format: https://www.amazon.com/dp/<ASIN>?tag=<OWNER-TAG> (the direct format in Amazon's help page, with the 10-digit ASIN from Product Details). Reasons: the destination is visible to us and to readers (fits 6(v)/6(w)); the tag is a plain string that a buyer can find and replace; a short link hides the ASIN, so we could not check the destination, detect a dead listing or match Associates reports by product. Policies do not name Site Stripe, so a Site Stripe short link is an acceptable fallback; record it in `notes` and expect to re-collect it in a swap.
- affiliates.yml: one program entry `amazon-associates` (network: Amazon Associates, kind: product, approved: false until the account is approved, url: https://www.amazon.com/?tag=<OWNER-TAG>) and one entry per product `amazon-<product id>` (network: Amazon Associates, kind: product, url: the canonical address, approved: false until verified, notes: ASIN, sold-by, checked date).
- products.yml: set affiliateProgram: amazon-associates and affiliateTrackingId: amazon-<product id>. Nothing else changes.
- Buyer swap: Procedure A in AFFILIATE-SWAP-PROCEDURE.md, as one find-and-replace of the tag string in affiliates.yml (about 40 entries), then approved: false on any entry that the new account has not been approved for. Engineering follow-up (optional): a test that every Amazon url carries the same single tag, and an `amazonAsin` field with the tag stored once.
- Private data stays out of the repo: price band and notes live in the owner's own sheet, not in products.yml (the schema rejects price keys; a comment or note field would leak it).

### What a Cowork prompt must collect, per product, from the owner's signed-in Associates account
Cowork opens Amazon only in the owner's signed-in session, never scrapes, and fills a sheet the owner keeps. One row per product id:
1. Our product id and name, and the exact Amazon listing title as shown.
2. Exact model, size and colour the link lands on (must match the maker specs in products.yml keySpecs; flag if the listing changes the size or pack).
3. ASIN (Product Details) and the canonical address with the owner's tag, plus the Site Stripe link as a second column.
4. Sold by: Amazon, the maker, or a third party; ships from; (we link only Amazon or maker-sold listings; a third-party-only listing is "hold").
5. Availability on the day: in stock, limited, unavailable (for our selection only, never published).
6. PRIVATE price band for our selection only: one of three bands (low, mid, high within the category). Never published, never committed, never shown as "cheaper".
7. A yes/no that the listing's weight rating, size range and materials match the maker's page; any mismatch is quoted, not corrected.
8. Date checked and which tracking ID was used.
Stop and ask the owner at any login, CAPTCHA or payment prompt. Buy nothing (self-purchases breach 6(u)).

## 5. 30/60/90 day sequence
Effort is working time for the one builder; "owner" = needs the owner's account or approval.

| When | Work | Effort | Needs owner |
|---|---|---|---|
| Days 1 to 7 (to 2026-11-25) | Ship /gifts/people-who-travel-with-dogs with maker links; add product cards to the 9 strong guides using existing records (no Amazon yet); fix the packing-list broken link; add the Amazon sentence to templates (hidden until an Amazon link renders); post pins | 3 to 4 days | Approve the disclosure wording and any photo choices |
| Days 1 to 14 | Decide whether to apply to Amazon now. The one-shot rejection and the 180-day clock start at application; apply when visits are real (JUDGMENT: Pinterest and indexing first, per the application pack). Answers: AFFILIATE-APPLICATION-PACK 7f | 0.5 day | Owner applies in their own account and gives the Store ID/tag |
| Days 14 to 30 | Run the Cowork collection prompt for the top 15 products (those in the strong guides); load affiliates.yml entries; flip approved: true product by product after the owner checks each | 2 days | Owner supplies the signed-in session and approves each entry |
| Days 31 to 60 | Build /kits, five ready kits, and print checklists; three best-value boxes; budget-vs-premium table in the ramp and life jacket guides; tool links on the cost and packing results | 6 to 8 days | Owner reviews kit wording; product photos only with permission |
| Days 31 to 60 | Research 3 more puppy products, ship /kits/puppy-trip | 2 days | Owner approves candidates |
| Days 61 to 90 | Review GA4 and Associates data (section 6); retire or replace weak or unavailable products; expand to the 20 remaining items; recheck all lastVerified dates older than 90 days; plan the 2027 gift guide for September | 4 to 5 days | Owner exports Associates reports monthly |

The first 3 sales matter more than volume: the likeliest route is the strong-intent guides (car safety, ramp, bowls, first aid) plus pins, not the gift page.

## 6. Measurement
Existing GA4 events (src/lib/analytics.ts, VERIFIED): product_click (product_id, partner, link_url, page_path), hub_card_click (hub, card, page_path), outbound_click (link_url, link_label, page_path), booking_click, accommodation_referral_click, and tool events (tool_name, tool_label, item_count). Nothing a visitor types is sent.
Proposed additions, keep them minimal: add `placement` (inline | kit | gift | value-box | table | tool) and `kit_id` as parameters to product_click, and register product_id, placement and page_path as custom dimensions in GA4 (they do not appear in reports otherwise). Do not send price, ASIN lists or reader input.

| Question | GA4 | Associates |
|---|---|---|
| Which pages produce clicks? | product_click by page_path, placement | Clicks report |
| Which products attract clicks but no sales? | product_click by product_id | Items-ordered report by ASIN, with the Orders report |
| Do kits beat inline slots? | product_click by placement and kit_id | n/a (one tag at launch) |
| Is the gift page working? | hub_card_click and product_click for /gifts | Daily earnings in the week of 2026-11-27 |
| Which tools lead to gear? | tool events then product_click in the same session | n/a |
| Are we near the 3-sale target? | n/a | Orders and Earnings reports; track the application date and day count |
Compare clicks to ordered items per product, only once there are dozens of clicks. Do not publish earnings or rates (Agreement s5 limits public statements).

## 7. Risks and guardrails
| Risk | Guardrail |
|---|---|
| Affiliate-heavy pages look thin to Google | Every kit item links the guide that explains it; each guide keeps its sourced reasoning; gear boxes sit after the explanation, not before. Max one product block per section; no ranked lists with no evidence. Kits get a visible "How we pick" link and a last-verified date. Noindex printable views |
| Out-of-stock or delisted products | Quarterly link check by Cowork; set approved: false and the card falls back to the maker page; no "in stock" text. A third-party-only listing is never linked |
| Price swings | We show no price; the private band is only for choosing. Never write "affordable", "cheap" or "deal". Black Friday wording stays price-free |
| Recalls | Quarterly check of CPSC and maker pages for car safety, crate, harness and first aid products; on a recall set active: false and add a dated /corrections note |
| Safety claims | Quote the maker, name any independent tester (CPS only where the CPS page was read); say "not tested by us"; no "crash-tested" unless a named tester is cited; no medical or behaviour claims (reactive, anxiety, senior). Life jackets stay "flotation aid, supervised" |
| Rule breach (account closure) | Section 3 checklist before each release: disclosure beside links, no prices or ratings, no Amazon images, no PDFs or emails with Amazon links, direct links only. Associates rules are re-read each quarter |

Not confirmed: Site Stripe wording (absent from the policy pages read); tracking ID limits; current traffic (no analytics read).
