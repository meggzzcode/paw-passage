# Review (round 5): Vacation Rental With a Senior Dog: What to Check Before You Book (vacation-rental-with-a-senior-dog)
Verdict: SHIP (marginal pass). All text and structure fixes from round 4 are live on the rendered page; the remaining gaps (sources chip, pads size) are template and owner items and sit at 4, not lower.
Overall: 9.0 / 10 (PASS)
Scores (1 to 5): Answer clarity 5 | Reader flow 5 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 5 | Differentiation 5
(Sum 36 / 4 = 9.0. No criterion below 4. Passes exactly at the threshold; no headroom.)

Method: rendered page at 1280 and 390 px (Playwright, frozen build on :4175), body text and DOM read, head read. Title "Senior Dog Vacation Rental: What to Check Before You Book", meta description present and on-intent. 4 Amazon links (2 products x name + button), all rel "sponsored nofollow noopener", ASINs B07DZSF2C2 (pads) and B01JFEAL1O (bed), tag present. scrollWidth 1280 and 390, no overflowing element outside the table wrapper.

## Round-4 issues: fixed or not
1. "32 sources cited" chip and flat Sources list: NOT FIXED (template). Chip still reads "32 sources cited"; Sources block has no forum sub-heading (no "forum" text in it).
2. Pads link opens the smallest size (18x24, B07DZSF2C2): NOT FIXED (owner). B0C5N8MNWZ (34x36) still in affiliates.yml notes only.
3. Citation order and repeated "What to buy, in order": FIXED. Reads "3 4"; "Nothing here needs buying to book; the two optional items are near the end (jump to what to buy)."; no remaining "What to buy, in order" text. First vet bullet still has no source (stated as unsourced by the fixer).
4. Statement heading and jump link: FIXED. H2 is now "What should you buy for a senior dog's rental stay?" and "Do this first" links to it.
5. Rug gap: FIXED as a stated gap. "We did not pick a rug: measure the route first, since the host may not allow one." renders.

## Remaining issues (most important first)
1. **Trust: the sources chip still overstates authority.**
   Where: header meta row, "32 sources cited"; "Sources and how we researched this".
   What: 11 of the 32 are forum threads (Tripawds, Mumsnet, Airhosts) counted and listed alongside AKC, Banfield and Cornell.
   Fix: STRUCTURE (template): chip counts non-forum sources (21) or reads "32 sources (11 forum threads)"; add a "Forum threads (small samples)" sub-heading in the Sources block.
2. **Product placement: pads card opens the smallest pack.**
   Where: "What if your dog leaks or has accidents?" card, B07DZSF2C2 (18 x 24 in).
   What: the buyer lands on a size that rarely fits a senior's bed and must find another variant; the text discloses it but it is still reader repair work.
   Fix: PRODUCT (owner): point content/affiliates.yml at the 34 x 36 variant (B0C5N8MNWZ) or name which size suits which bed in the card.
3. **Buying advice / Reader flow: small residual gaps.**
   Where: "Your vet says the trip is fine and the dog moves comfortably: go, and check the rental carefully." carries no citation while its siblings do; page is still about 11 minutes.
   What: harmless but the only unsourced bullet in a sourced list; length pushes the buy section to the bottom, softened by the "Do this first" jump link.
   Fix: TEXT: add "(our judgment, not a sourced claim)" to the bullet or merge it into the lead-in; no cut required.

## What works well
- Host message with six numbered questions and the labelled "borrowed photo standard" is original and directly usable before paying.
- Six-manager policy table with an "our inference" column and the "How sure we are" block (confirmed / reported / unknown) are honest and differ from generic senior-travel pages.
- Two spec-honest cards each with a skip line, a deliberate rug-gap sentence, and "Nothing, until the vet and the host have answered" as the first buy advice.

## Buyer walkthrough
1. Lands from "senior dog vacation rental"; first paragraph gives the checks and vet-first rule.
2. "Do this first" plus jump link; listing checks, host message, manager rules.
3. Slippery-floor and stair sections tied to vet sources; rug gap stated.
4. Buy section: pads and bed, each with a skip line; pads link opens a small pack (friction).
5. "What to buy first", then sibling guides and checklists; no dead ends.

## Mobile notes (390 px)
- No sideways page scroll (scrollWidth 390); manager table scrolls inside its wrapper.
- First screen carries breadcrumb, H1, dek with the answer, chips, disclosure.
- Cards full width; rust button contrast is modest (component item).

## Specific edits to make
1. STRUCTURE (template): sources chip and forum tagging.
2. PRODUCT (owner): larger pads variant.
3. TEXT: label or source the first vet bullet.

## Questions for the owner
- Approve the larger Pawtect variant and the sources-chip change?
