# Cowork product open items, 2026-11-24 (task 16)

All products are Amazon products; links carry the approved Amazon affiliate entry. Specs are worded "the listing states". No prices, stock or photos.

## Wired (new records, content/products.yml and content/affiliates.yml)
- amazon-basics-dog-crate-cover-36-inch (B0DPQ4PFD6), active. Placed in vacation-rental-with-a-reactive-dog next to the window film, worded as blocking the view into a crate, not noise, for a 36-inch wire crate.
- gorilla-grip-dog-crate-cover-36-inch (B0C3WT8C69), inactive alternative (seller GORILLA COMMERCE). Not placed.
- joejoy-xl-dog-bed-41-42-inch-crates (B0FRMRRZV3), active, lesser-known brand, no maker page read, said so in the guide. Placed in two-large-dogs-in-one-car.
- midwest-icrate-36-inch-double-door-crate (B000QFT1R2), active, listing states 41-70 lb. Placed in two-large-dogs-in-one-car as the crate-size example (home crate, no crash claim).
- pet-parents-pawtect-pads-24x36 (B07H2RHVK4), active. puppy-at-a-vacation-rental now links this pack and the "opens the smallest size" caveat is removed.
- whoseid-qr-nfc-dog-tag-silicone-small (B0C9MCCDH9): existing record switched to active. Listing states a one-time purchase, no subscription, no app; brand page could not be read, said so. Placed in the "Put a tag on the collar" prevention step of if-your-dog-gets-loose-on-a-trip (emergency steps have no cards).

## iCrate note
The existing midwest-icrate-dog-crate affiliate (30 in, B000QFWCK0) is unchanged. Its note now lists the verified Buy New listings: 18 in B000TZ59ES, 22 in B000QFUNWY, 24 in B000QFWCJ6, 36 in B000QFT1R2, 42 in B000QFT1RC (all Amazon.com with buy box). 48 in B000QFWCLY has no buy box; the 30 in default offer is Amazon Resale.

## Skipped
- Paw Inspired B0CJXRVMX5 crate pad (not verified).
- iCrate 18, 22, 24, 42 and 48 in as separate records (schema has no size variants; only the 36 in was added).

## relatedProducts
two-large-dogs-in-one-car stays at 6: dropped rabbitgoo-suv-dog-car-barrier and petsafe-happy-ride-dog-barrier from the list (their cards remain in the body) to add the 36 in iCrate and the JOEJOY pad. Reactive guide now 3, lost-dog 5, puppy 4.

## Catalog chips fixed
- Springland 22oz: "22oz-named bottle with bowl".
- Knot-a-Leash: strength chip now "Leash strength not stated", last.
- EzyDog DFD: "XS to XL, girth 19-48 in" (from the record's girth ranges, replacing the weight chip).
- Ruffwear Float Coat: first chip now "Telescoping neck closure" (from the summary).

## Checks
eslint, tsc, and the five listed test files pass.
