# Cowork task 08: verify the 16 new Amazon links (read-only)

Paste everything under the line into Cowork. It uses your signed-in Chrome. Nothing is bought or changed. Price bands stay private.

---

You are helping verify product links for pawsandpassage.com, a dog travel guide. Use my signed-in Chrome. This is READ-ONLY: do not buy anything, do not add to cart or lists, do not change any account setting, do not enter payment or tax details, and do not click any "Buy", "Subscribe" or "Add" button. If Amazon shows a CAPTCHA or a login wall, stop and tell me; do not work around it.

For each row below, open https://www.amazon.com/dp/<ASIN> in a new tab and record exactly what the page shows. Do not guess; write "not shown" when something is missing.

Record for every row:
1. Page title exactly as shown, and the brand.
2. Is it the SAME PRODUCT as the "We expect" column? YES / NO / UNSURE, with one line why (brand, model name, size).
3. Default size, colour or pack shown.
4. Seller or "Ships from / Sold by" line, and whether a buy box with an Add to Cart button is present. If there is no buy box write "NO BUY BOX".
5. Availability text (for example "In stock", "Only 3 left", "Currently unavailable", "Temporarily out of stock").
6. Price band only, in one of: under $25, $25 to $50, $50 to $100, over $100. Never the exact price.
7. If the title or bullets contradict our expectation (different size, different model, a bundle, a subscription requirement, a refurbished or used listing), say so.
8. If the page redirects to a different ASIN, give the final ASIN from the address bar.

| # | ASIN | We expect |
|---|------|-----------|
| 1 | B0FS4DL1QF | Sleepypod Clickit Sport Plus crash-tested car harness (any size; the dog weight range on the page matters) |
| 2 | B0BMQY39R5 | Lucky Duck "Lucky Kennel" / Lucky Dog Kennel, Intermediate size, crash-tested portable crate |
| 3 | B0D6Z4L6BW | Tractive DOG 6 GPS tracker for dogs (the title may only say "Tractive Smart Dog GPS Tracker"; look for model "TG6", "DOG 6", battery up to 14 days, and whether a subscription is required) |
| 4 | B0HMT6Q334 | Ruffwear Grip Trex Dog Boots (set of two; what size does the default show?) |
| 5 | B0DNV6MBKK | Ruffwear Web Master Dog Harness with Handle (default size shown; confirm it has the handle and a chest/front loop) |
| 6 | B005QZ4YZQ | Kurgo Collaps-A-Bowl, Barn Red |
| 7 | B01JFEAL1O | Kurgo Loft Wander Dog Bed, Large |
| 8 | B09CHBNGDT | Springland 22oz Classic portable dog water bottle with built-in bowl (Lilac) |
| 9 | B0C15FWR7J | Springland 20oz Flip portable dog water bottle with collapsible bowl (Black) |
| 10 | B0888TJNRS | Kurgo Backseat Bridge car seat extender, up to 100 lbs |
| 11 | B09T1P2B7J | PetSafe Happy Ride Collapsible Travel Dog Crate |
| 12 | B0016HPTFW | PetSafe Happy Ride Extra Long Telescoping Dog Ramp (47 to 87 in, 18 lb) |
| 13 | B01LY6DXU4 | Kurgo Rover Cargo Cape cargo-area liner |
| 14 | B0DN4JBXSD | Ruffwear Swamp Cooler cooling vest (default size/colour shown) |
| 15 | B0CZ5F9L2H | GUNNER Dog Bowl with spill-proof travel lid, 7-cup |
| 16 | B0991GNL5B | Ruffwear Knot-a-Leash rope lead (default size/colour shown) |

Extra checks for the weaker matches:
- Row 1 (Clickit Sport Plus): the Sleepypod pages disagree on weight rating. Copy the weight range and any "crash tested" or "Center for Pet Safety" wording from the Amazon bullets exactly.
- Row 2 (Lucky Kennel): note the Amazon price BAND. The maker's own price for the Intermediate is about $599.99; if Amazon's band is much lower, tell me whether the page is the real kennel or an accessory. If you see the Medium (B0CTP2VR2T) or Large (B0DW9JGDJM) listings in "other sizes", note which sizes exist.
- Row 3 (Tractive): confirm the model is the DOG 6, not DOG 6 Mini or a bundle with a prepaid subscription. Other listings seen: B0D6Z74WJY (other colour). If the title is ambiguous, open the "Product information" table and copy the model number.
- Rows 4 and 5: tell me which default size the page opens on, and list the size options available.

Finally, for any row where the answer to question 2 is NO or UNSURE, or there is NO BUY BOX, or it is unavailable, search Amazon for the correct listing of the SAME product (brand and model name) and give me the best replacement ASIN, page title, seller and availability. Do not pick a different product.

Return one table in this order with these columns: # | ASIN | Page title | Same product? | Default variant | Seller | Buy box? | Availability | Price band | Flags | Replacement ASIN (if needed). Then a 5-line summary: which rows are good to keep, which must be fixed, which should be switched off. Save the result as a file named amazon-new-links-results.md.
