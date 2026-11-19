# Report: newTrail (2026-11-19)

New guide: `content/guides/dog-hiking-gear-for-a-cabin-vacation.md` (status published, approved by Paws & Passage Editors 2026-11-19, readingMinutes 9). Status: INTEGRATED.

## Products placed (all earn)
- Picks (4): ruffwear-web-master-harness, ruffwear-grip-trex-boots, ruffwear-knot-a-leash, ruffwear-the-beacon-dog-safety-light. relatedProducts = the same 4.
- ruffwear-quencher-bowl mentioned in prose only (spec from catalog record, cited to the maker page), not a pick, to stay within 4 picks/4 related.

## Sources and research
- 14 sources (NPS x2, Forest Service Gila NF, WTA, PetMD, Orvis, AKC boots, Outward Hound, Cornell heatstroke, 5 Ruffwear pages). 5 competitor pages recorded in research.competitors (PetMD, Orvis, AKC, Outward Hound, WTA). REI returned 403 and is not cited.
- Forest Service statement is one forest's page and is labeled as such. No national Forest Service rule is claimed.
- Claims ledger: docs/CLAIMS-dog-hiking-gear-for-a-cabin-vacation.md. Fact-check note: docs/FACTCHECK-dog-hiking-gear-for-a-cabin-vacation.md.
- No prices, ratings, tests, stock or "best" labels. All Ruffwear pages showed Out of stock on 2026-11-19; deliberately not mentioned.

## Image
- Unsplash photo "A dog sits on a rocky mountain path" by Praneeth Peiris (https://unsplash.com/photos/a-dog-sits-on-a-rocky-mountain-path--H5NazLT6I8), Unsplash License, downloaded from images.unsplash.com and cropped to 1600x1067, card 960x640 and 800 px variant. Key `guide-dog-hiking-gear` added to src/lib/images.ts and src/content/image-credits.ts. Dog in a harness on a rocky mountain path; unique (no other guide uses it). Share/pin images made by scripts/make-share-images.py.

## Inbound links (relatedGuides line only, appended)
if-your-dog-gets-loose-on-a-trip, dog-travel-bowls-and-food-storage, dog-life-jacket-for-lakes-and-beaches.

## Pins
One row for the guide in docs/pinterest-pins.csv (regenerated with scripts/make-pin-sheet.py; board Dog Travel Gear defaulted). The brief asked for 2 pins but src/test/share-images.test.ts requires exactly one row per public guide with utm_content = slug, so a second row would fail it. Lead: add the guide to BOARDS in scripts/make-pin-sheet.py if another board is wanted.

## Verification
- `bunx tsc --noEmit`: clean. `vite build`: passes (content validated).
- vitest: all tests for my guide pass (content.test.ts rows for the guide, images, product-pick, article-ux, markdown-safety, guide-related-products). Remaining failures are other workers' work in progress: first-aid and bowls guides (source numbering), life-jacket guide source-URL mismatch (not from my relatedGuides edit), cold-weather guide missing picks, and the pin CSV missing keep-a-dog-cool-on-a-summer-trip (added after my pin run; rerun make-pin-sheet.py last).
- Timeout failures in places/stay/pet-cost tests are load-related and unrelated.

## For the lead
Final pass: run `python3 scripts/make-share-images.py && python3 scripts/make-pin-sheet.py` once all workers finish.
