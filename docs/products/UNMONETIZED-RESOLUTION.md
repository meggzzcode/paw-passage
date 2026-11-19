# Unmonetized products: resolution (2026-11-19)

Scope: 25 active catalog products with no approved Amazon entry. Result: 17 LINK (one of them also a RENAME), 8 RETIRE, 0 SUBSTITUTE.
YAML for the 17 links: `docs/products/unmonetized-fragment.yml` (not merged into content/affiliates.yml).

## Method and limits (read first)
- Every amazon.com product page fetch returned HTTP 503. I did not work around it. ASINs, titles and specs below come from Amazon search-result titles and snippets, maker pages (tractive.com, luckyduck.com, gunner.com, orvis.com, sakercanine.com) and retailer pages.
- No buy box, price or stock was confirmed by me for any ASIN. "Confidence" means confidence it is the same product as the catalog record, not that it is in stock. The owner must confirm buy box before setting approved true.

## Table
| Product id | Decision | ASIN | Matched title | Conf. | Why |
|---|---|---|---|---|---|
| saker-bomber-harness | RETIRE | none | n/a | n/a | Maker sells only on sakercanine.com / shop.app ($189.95); no Amazon listing. |
| lucky-duck-lucky-kennel | LINK (Intermediate only) | B0BMQY39R5 | Lucky Dog Kennel, Durable Crash Tested Portable Dog Crates, Intermediate | MEDIUM | Same product: Amazon copy gives interior 30.25 x 20.5 x 22 in, 38 lb, CPS 5-star, sold under the Lucky Duck store; matches catalog. Maker page lists Lucky Kennel Medium/Intermediate/Large at $549.99/$599.99/$699.99 and no Amazon link; Amazon Q&A says $499.99, so the "over $100" price needs a look. Link covers Intermediate only. |
| orvis-embossed-sherpa-throw | RETIRE | none | n/a | n/a | Orvis sells on orvis.com ($69); no Amazon listing found. |
| kurgo-loft-wander-dog-bed | LINK | B01JFEAL1O | Kurgo Loft Wander Dog Bed, Chili Red, Large | MEDIUM | Large is 36 x 48 in as in catalog. Medium B00T50S24W showed unavailable (odd shipper), so use Large. |
| kurgo-heather-hammock | LINK | B00VJUIRTG | Kurgo Heather Hammock Seat Cover, Charcoal, 55" Wide | MEDIUM | Name and 55 in width match; centre zipper. Several colours showed unavailable. Half Hammock is a different product. |
| kurgo-rsg-dog-first-aid-kit | RETIRE | B07NZ1WMS3 (exact title, no buy box) | Kurgo RSG Dog First Aid Kit | n/a | Right product but no buy box and it fits only RSG gear. Role is covered by amk-trail-dog, already approved. Re-add if the buy box returns. |
| springland-22oz-original-travel-bottle | LINK + RENAME | B09CHBNGDT | Springland 22oz Classic Portable Dog Water Bottle with Built-in Bowl, Lilac | MEDIUM | Rename to "22oz Classic Travel Dog Water Bottle" (Amazon calls it Classic; the "Original Springer 22oz" B0HP966BFQ is unavailable). Retail copy suggests Classic is the 22oz Original design but none states it outright; maker page not retrievable (guessed URL 404). Alts B09CH926J4, B09CHB8CM8. B09CH9W2XS has no size in title. |
| springland-20oz-flip-travel-bottle | LINK | B0C15FWR7J | Springland 20oz Flip Portable Dog Water Bottle with Collapsible Bowl, Black | HIGH | Exact name, 20 oz, foldable silicone bowl. Alts B0C15GPCKZ, B0FNNJ32NW. |
| akc-reunite-stainless-collar-tag | RETIRE | none | n/a | n/a | AKC Reunite tags are ordered only through AKC Reunite and need an enrolled ID; no Amazon listing. Generic tags are not the same product. |
| tractive-dog-6 | LINK | B0D6Z4L6BW | Tractive Smart Dog GPS Tracker | MEDIUM | Title lacks "DOG 6", but listings give model TG6, dogs over 8 lb, 14-day battery, built-in SIM. Alt colour B0D6Z74WJY. Excluded: B0DZF21KRY (bundle), B0GKGK4PGV (Mini). |
| tractive-dog-6-xl | RETIRE | none | n/a | n/a | Maker page confirms DOG 6 XL (over 44.1 lb, 6-week battery). The Amazon listing titled "XL ... 6-Weeks Battery Life" exists but I could not get its ASIN. B0C2C5LP16 is the older XL (out of stock, 55 lb); B0HG9FYRRG is XL Adventure (different). Re-add if the owner reads the ASIN off the Black 6-week XL page. |
| kurgo-rover-backseat-bridge | LINK | B0888TJNRS | Kurgo Dog Backseat Bridge Car Extender ... Up to 100 lbs | MEDIUM | Specs match catalog (100 lb, 16 x 52 x 1 in, 13 in gap limit); title omits Rover. Older Rover bridge (B004OSUG8A, B0CGX7T3XF) is 75 lb: avoid. |
| petsafe-happy-ride-collapsible-crate | LINK | B09T1P2B7J | PetSafe Happy Ride Collapsible Travel Dog Crate | HIGH | 60 lb, 27 x 19 x 28 in, two zip doors, headrest strap match. |
| petsafe-happy-ride-extra-long-ramp | LINK | B0016HPTFW | PetSafe Happy Ride Extra Long Telescoping Dog Ramp | HIGH | Title and specs (47-87 in, 18 lb, 300 lb) match exactly. The earlier "not found" appears wrong. Avoid bundle B0B541WCCV and Deluxe B000RUJEUU. |
| kurgo-rover-cargo-cape | LINK | B01LY6DXU4 | Kurgo Rover Cargo Cape ... Charcoal | HIGH | 52 x 62 in, centre zipper, bumper flap match. |
| kong-ultimate-cargo-liner | RETIRE | (B0F7JD6DTM, LOW) | Kong Cargo Liner and Trunk Strap | LOW | Maker page and PetSmart sell "Ultimate Cargo Liner w/ Tether" (SKU LPTV16). Amazon only shows a differently named liner with a LATCH anchor; not provably the same product. |
| ruffwear-swamp-cooler | LINK | B0DN4JBXSD | Ruffwear Swamp Cooler Dog Vest ... Compatible with Most Harnesses, Biolumin Blue, Medium | MEDIUM | Non-zip vest with leash portal, XXS-XL, as catalog. Zip vest is a different product. Owner picks size. |
| kurgo-mud-dog-travel-shower | LINK (third-party sellers) | B00TUA98JA | Kurgo Mud Dog Travel Shower ... Easy Bottle Shower Cap | MEDIUM | Same product (16 oz-2 L bottle cap). Only third-party sellers per manual check; owner decision. Alt B07KBC6695 is the Kurgo Go 6 L roll-up shower, a different product: not used. |
| gunner-long-haul-bed | RETIRE | none | n/a | n/a | gunner.com sells it ($115, Small/Medium shown); no Amazon listing. |
| ruffwear-highlands-sleeping-bag | LINK | B082FNTHPS | Ruffwear Highlands Dog Sleeping Bag ... Medium | MEDIUM | Specs match (M 25.2 x 33.5 in, 75D shell). Showed unavailable when indexed: confirm stock. Large B082FNFDPV. |
| petmate-silicone-travel-bowl-duo | RETIRE | none | n/a | n/a | Sold at Chewy, Walmart, Tractor Supply and others; no Amazon listing found. |
| gunner-dog-bowl | LINK | B0CZ5F9L2H | GUNNER Dog Bowl with Spill-Proof Travel Lid, Black, 7-Cup | HIGH | Same product; Amazon gives 7-cup, 7.5 x 3.75 in (catalog has none). Fill capacity/dimensions in the record if wanted. |
| ruffwear-knot-a-leash | LINK | B0991GNL5B | Ruffwear Knot-a-Leash, Reflective 5 ft Rope Lead, Obsidian Black, Large | HIGH | Matches; Small is B098ZVLRNH. Some colours unavailable. |
| ruffwear-grip-trex-boots | LINK | B0HMT6Q334 | Ruffwear Grip Trex Dog Boots | MEDIUM | Generic parent-style listing; per-size ASINs (B01MY7S3H8 2.00 in etc.) are sold as sets of two. Confirm buy box. |
| ruffwear-web-master-harness | LINK | B0DNV6MBKK | Ruffwear Web Master Dog Body Harness, Basalt Gray, Large/X-Large | MEDIUM | Current 2025 model with front attachment (matches catalog's three points). The generic "with Handle" ASIN B0HMT31ZT5 is unavailable. Owner picks size. |

## Actions for the owner
- Retire (active:false): saker-bomber-harness, orvis-embossed-sherpa-throw, akc-reunite-stainless-collar-tag, kurgo-rsg-dog-first-aid-kit, tractive-dog-6-xl, gunner-long-haul-bed, petmate-silicone-travel-bowl-duo, kong-ultimate-cargo-liner. Remove them from any guide that names them (MONETIZATION-PLAN.md cites saker, tag, both Tractives).
- Rename springland-22oz-original-travel-bottle to the 22oz Classic wording; lucky-duck-lucky-kennel copy should say the link goes to the Intermediate size.
- Before merging the fragment, confirm buy box on each ASIN (none checked). Weakest: kurgo-mud-dog-travel-shower (third-party only), ruffwear-highlands-sleeping-bag (unavailable when indexed), ruffwear-grip-trex-boots, tractive-dog-6, lucky-duck-lucky-kennel (price).
