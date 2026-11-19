# Report: newCool (2026-11-19)

New guide: `content/guides/keep-a-dog-cool-on-a-summer-trip.md` (status published, readingMinutes 9, about 2,700 words, 15 sources, 6 competitors read). Status: INTEGRATED.

## Products placed (all earn, 4 picks, relatedProducts = same 4)
- ruffwear-swamp-cooler (vest for walks and outdoor stops)
- green-pet-shop-cool-pet-pad (pad for car seat, rental floor, rest)
- kurgo-splash-free-wander-bowl (bowl that sits flat on a car seat)
- springland-22oz-original-travel-bottle (one-hand bottle; named "22oz Classic Original" on the maker page)
I chose Kurgo over ruffwear-quencher-bowl because the Quencher page showed "Coming Soon" when read (no stock mention in the article).

## Facts and sources
Ledger: docs/CLAIMS-keep-a-dog-cool-on-a-summer-trip.md; fact-check: docs/FACTCHECK-keep-a-dog-cool-on-a-summer-trip.md. Sources: AKC heatstroke (2026-06-30) and hot pavement (2026-03-30), Cornell heatstroke and summer tips, Humane World (2019), ALDF hot cars (32 states + DC + Guam as of 2025), MSU Animal Legal & Historical Center state table, Royal Kennel Club (UK), Benito 2022 (Animals), UF 2012 vest study, maker pages for the four products, Chewy. Competitors-read field lists AKC x2, Chewy, Cornell, Humane World, Royal Kennel Club.

## Hero and card images
Unsplash License photo "brown short coated dog on blue round plastic basin" by swati arora (https://unsplash.com/photos/brown-short-coated-dog-on-blue-round-plastic-basin-1GPEquhzkTU): tan dog drinking from a basin in shade. Sourced the same way as earlier guides (Unsplash, credit in src/content/image-credits.ts, key `guide-keep-dog-cool` in src/lib/images.ts, hero 1600 px, 800 px and 960 px card in src/assets). Not used by any other guide; I viewed the file and wrote the alt text from it. Unsplash pages sit behind a bot check, so I took the CDN image URL from the photo page (no check bypassed); the license page itself was not re-read, rely on docs/PRODUCT-PHOTOS.md. Also made public/pins and public/share images for the slug.

## Inbound links (relatedGuides line only)
two-large-dogs-in-one-car, dog-life-jacket-for-lakes-and-beaches, vacation-rental-with-a-senior-dog.

## Pins
One row added to docs/pinterest-pins.csv (board Dog Travel Gear) and the slug to BOARDS in scripts/make-pin-sheet.py. The brief said 2 pins, but src/test/share-images.test.ts requires exactly one CSV row per public guide (a second row failed the test), so I removed the second row. The text of a second pin, if you want it: title "Hot Car, Hot Sand, Hot Rental: What Vets and Kennel Clubs Say About Keeping a Dog Cool", utm_content `keep-a-dog-cool-on-a-summer-trip-hot-car`; it needs the test relaxed and a second image.

## For the lead
- AVMA: all avma.org pages returned empty content, so AVMA is not cited (the "AVMA" asked for is listed as unconfirmed in the article table). Please add if you can read them.
- The Green Pet Shop page claims it helps with "heatstroke" and "prevents dangerous overheating" with no test cited; the article gives it no weight. Consider whether the catalog record should say so. Chewy lists its duration as 4 hours; maker says 3.
- Pages were read through a summarising fetch tool; the hot car law table examples (California $100 fine, Texas case) should be re-read on the table page.
- Hot car law count: ALDF page says 32 (as of 2025).

## Verification
`bunx tsc --noEmit`: clean. `bunx vitest run`: 471 pass, 8 fail, none about this guide (failures are in dog-travel-first-aid-kit-guide, dog-travel-bowls-and-food-storage, dog-life-jacket citation-url checks, gear-guide product check and packing test, from other workers' in-progress edits). The share-images test passes after removing the second pin row.
