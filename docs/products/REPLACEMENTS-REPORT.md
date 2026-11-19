# Amazon replacements (2026-11-19)

Limits: Amazon product pages could not be read (WebFetch got HTTP 503; a direct fetch was blocked by the permission system and was not retried or worked around). ASINs and titles come from Amazon search results only. In-stock status is NOT confirmed for any new or switched entry. Every entry is approved:true as instructed, so check each on Amazon before publishing.

## CPS (centerforpetsafety.org, read 2026-11-19)
Certified harnesses listed: Saker Bomber (already in catalog, no Amazon listing found), Sleepypod Air, Atom, Clickit Range, Clickit Sport. Crates: Cabela's GunDog Kennel (Intermediate, Large), Gunner G1 (Small, Medium, Intermediate), Lucky Duck Lucky Kennel (Medium, Intermediate, Large), Rock Creek Crates Aluminum Kennel (Medium). Ruffwear Load Up is not CPS listed.

## Replaced
| Off item | Replacement | Confidence | Notes |
|---|---|---|---|
| sleepypod-clickit-range | NEW product sleepypod-clickit-sport-plus, B0FS4DL1QF | MEDIUM | CPS lists "Clickit Sport" (tested July 2014), not "Sport Plus"; the record says so. Maker page shows a conflicting "Rated to 25 lbs" line. B0GMS5DTJZ (Range) showed Currently unavailable. |
| gunner-g1-kennel | Existing product lucky-duck-lucky-kennel, new link B0BMQY39R5 (Intermediate) | MEDIUM | CPS lists Lucky Kennel Medium/Intermediate/Large. Amazon title reads "Lucky Dog Kennel ... Intermediate", slug says Lucky-Duck. Medium B0CTP2VR2T, Large B0DW9JGDJM. The product record still says "maker states"; lead may update it to cite CPS. |
| kurgo-dog-first-aid-kit | Existing product kurgo-rsg-dog-first-aid-kit, B07NZ1WMS3 | HIGH on title/brand/model | Different (49-piece, MOLLE) kit. |
| amk-me-and-my-dog | Same product, other listing B01M123H7Y (url edited) | MEDIUM | |
| kurgo-collaps-a-bowl | Same product, Barn Red B005QZ4YZQ (url edited) | MEDIUM | Blue B003EIDR5U shown unavailable. |
| baskerville-ultra-muzzle | Same product, B00596TFVA (url edited) | LOW-MEDIUM | Size/colour unconfirmed; owner to check size 3. |

New affiliates.yml entries: lucky-duck-lucky-kennel, kurgo-rsg-dog-first-aid-kit, sleepypod-clickit-sport-plus. Only one new product record was needed (sleepypod-clickit-sport-plus); the others reuse existing records, which wire to the link by id.

## Not found
- north-states-petyard-passage-8-panel: the brown 8-panel (B00E3AMCSQ) showed unavailable; the gray "Paws" 8-panel B0DQ2LLXGS is a different model, not added. Existing carlson/midwest pens remain approved.
- midwest-lifestages-dog-crate: alternates B00O8QY5UI (dimensions disagree) and B0CYM8G2QC (shown unavailable) not trusted; none switched.
- kong-bench-seat-cover-hammock-xl: no XL listing found; kurgo-rover-hammock-extended-width is already approved.
- Cabela's GunDog Kennel and Rock Creek: no Amazon listing found. Saker Bomber: no Amazon listing.

Tests: bunx tsc --noEmit and bunx vitest run both pass (463 tests).
