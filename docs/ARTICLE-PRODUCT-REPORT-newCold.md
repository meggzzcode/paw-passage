# Report: newCold (2026-11-19)

New guide: content/guides/cold-weather-dog-gear-for-winter-cabin-trips.md (status published, approvedOn 2026-11-19, category Planning, readingMinutes 8, about 2,640 body words).
Status: INTEGRATED.

## Products placed (4 picks, all in relatedProducts, all earn)
ruffwear-climate-changer-fleece, ruffwear-timberline-fuse-vest, ruffwear-polar-trex-boots, soggy-doggy-super-shammy-towel. Kurgo Loft Wander bed not used (4-pick cap; a bed had no natural job in this guide).

## Research and process
- 8 independent or competitor pages read and listed in research.competitors (AKC boots, PetMD, PetSmart, NBC Select, Outward Hound, ASPCA cold tips; Cornell and ASPCA ice melts used as sources). Maker pages re-read 2026-11-19 for the three Ruffwear products.
- Claims ledger: docs/CLAIMS-cold-weather-dog-gear-for-winter-cabin-trips.md. No separate FACTCHECK file written (not requested); fetches are tool summaries, key numbers and quotes re-fetched for verbatim wording.
- Facts of note: sources disagree on thresholds (PetMD 45/32/20 F, PetSmart 40 F and 10-15 min, Cornell vet via NBC 32/20 F). The Ruffwear fleece page contradicts itself on between sizes (chart: size up or down; fit guide: smaller). Polar Trex: size down, measure all paws, lugs outdoor use only (used for "boots off at the door"). No maker page gives a temperature rating.
- Our own suggestions (arrival routine, vest not a car restraint, cabin tips) are labelled as judgment, level 3.

## Image
Hero and card: Unsplash photo "brown dog in pink jacket runs through snow" by Enrique Leyva (https://unsplash.com/photos/brown-dog-in-pink-jacket-runs-through-snow-ZuYaMEs8q3w), free under the Unsplash License, not Unsplash+, not used elsewhere on the site. Matches the article (dog in a coat running in snow). Made as src/assets/guide-cold-weather-gear.jpg (1600 w), -800.jpg, -card.jpg (960x640) with the same Pillow settings as scripts/optimize-images.py. Registered in src/lib/images.ts (key guide-cold-weather-gear, with alt) and src/content/image-credits.ts. Share image and pin made in public/share and public/pins by calling the make-share-images.py functions for this slug only (did not run the full script, other workers' files are in flux).
Note: the photo is a generic stock photo of a dog in a (non-Ruffwear) jacket, so the page does not imply it shows a recommended product; no caption claims otherwise.

## Inbound links (relatedGuides line added only)
christmas-week-in-a-cabin-with-a-dog, vacation-rental-with-a-senior-dog, dog-ramp-or-steps-for-the-car-and-cabin. Each re-read right before the edit.
Outbound relatedGuides: christmas-week..., dog-friendly-cabin-packing-list, dog-car-safety-harness-and-crate-guide, vacation-rental-with-a-senior-dog. relatedTools: packing-list, checklist.

## Pins: one row, not two
The brief asked for 2 pins. src/test/share-images.test.ts requires exactly one UTM row per public guide (slugs.length must equal the public guide count, utm_content must equal the slug), and make-pin-sheet.py generates one row per guide, so a second row would fail the test and be removed on regeneration. Added one row (docs/pinterest-pins.csv, board Vacation Rental Planning, which is the generator's default for category Planning). If you want a Cabin Vacations board, add the slug to BOARDS in scripts/make-pin-sheet.py (not my file) and re-run it. A second pin image would need a pin-sheet design change.

## Verification
- bunx tsc --noEmit: clean.
- Tests for my guide (content.test.ts "cold-weather" filter: sources, markers, picks, competitors, SEO): 7 pass. Full run shows failures that are not from my files: content-pipeline, gear-parity, packing, pet-cost-workflow, content.test for dog-travel-first-aid-kit-guide, dog-travel-bowls, dog-life-jacket link match (other workers mid-edit), and share-images CSV (a duplicate keep-a-dog-cool row from another worker, 34 lines for 32 guides). Some timeouts at the default 5 s under load, passing with a longer timeout.
- First run flagged: category Gear requires a `gear:` array with at least 3 entries, so I used category Planning as the life jacket guide does.

## For the lead
- Duplicate row for keep-a-dog-cool-on-a-summer-trip.jpg in docs/pinterest-pins.csv (not mine).
- Catalog notes (no edits made): ruffwear-climate-changer-fleece record lacks the fit-guide/chart conflict on between sizes; its summary says "warmth for cold, clear conditions", fine. products.yml relatedGuides for the three Ruffwear products could add this guide's slug.
- Possible overlap with the new dog-hiking-gear-for-a-cabin-vacation guide on boots (another worker).
