# Independent fact-check: four new guides (2026-11-19)

Method: every cited source and maker page re-fetched through WebFetch (a summarising fetch tool; quotes re-requested verbatim where wording mattered) and compared with the guide text and with content/products.yml. Nothing was bypassed; a blocked page is reported as COULD NOT LOAD. No prices, ratings, stock claims or testing-by-us claims appear in any of the four guides, and the pick labels are descriptive ("For ...", "A ... for ...") with no "Our pick" or "Best value" wording, so none needs support.

| Guide | Verdict | VERIFIED | PARTIAL | WRONG | COULD NOT LOAD |
| --- | --- | --- | --- | --- | --- |
| dog-hiking-gear-for-a-cabin-vacation | AFTER FIXES (fix applied; publish-ready now) | 44 | 1 | 0 | 0 |
| cold-weather-dog-gear-for-winter-cabin-trips | AFTER FIXES (fixes applied; publish-ready now) | 46 | 3 | 1 | 0 |
| keep-a-dog-cool-on-a-summer-trip | AFTER FIXES (fixes applied; one source unreloadable, see below) | 50 | 3 | 1 | 1 |
| protect-your-car-interior-from-a-dog-on-a-road-trip | AFTER FIXES (fixes applied; publish-ready now) | 34 | 4 | 1 | 0 |

## Fixes made

### dog-hiking-gear-for-a-cabin-vacation
- PARTIAL: Cornell heatstroke signs said "diarrhea"; the page says "bloody diarrhea" and also lists confusion and seizures. Corrected.
- Checked and fine: NPS 6 ft leash and booties quotes, Gila leash rule, WTA, PetMD, Orvis, AKC, Outward Hound, all Ruffwear specs (Web Master handle sentence is verbatim, size chart, three attachment points, light loop; Grip Trex sizing quote; Knot-a-Leash 5 ft / 7 mm / 11 mm; Beacon modes, 20 h, 1.5 h, 1 m / 30 min; Quencher).

### cold-weather-dog-gear-for-winter-cabin-trips
- WRONG: "The maker also notes a close, tailored fit" for the Climate Changer fleece. The page's feature list says "Regular Fit"; no tailored wording. Replaced.
- PARTIAL: the NBC Select Cornell vet quote was credited with the "stop licking paws" advice; that is ASPCA's. Reworded and attributed.
- PARTIAL: "paw wax or boots can act as a barrier for sensitive paws" now matches ASPCA ("paw wax or doggie booties provide an excellent barrier to minimize risk to sensitive feet").
- PARTIAL: PetSmart "snug but not tight" changed to "snug but still free to move".
- Checked and fine: PetMD 45/32/20 F bands, Cornell NBC quotes (Dr. Aly Cohen, Dr. Hannah Hart), ASPCA high-collar and antifreeze wording, all Ruffwear and Soggy Doggy specs, the fleece size-chart vs fit-guide conflict.

### keep-a-dog-cool-on-a-summer-trip
- WRONG: Springland bottle described as having an "aluminum clip"; the page says aluminum carabiner. Corrected.
- PARTIAL: "Cornell's list adds drooling ... and collapse" (FAQ and body); AKC also lists drooling and collapse. Now "includes".
- PARTIAL: ALDF "Good Samaritan laws ... in 14 states"; ALDF's heading says 14 but the list names 16. Guide now says so and points to the statute.
- COULD NOT LOAD: Animals 2022 MDPI study (https://www.mdpi.com/2076-2615/12/18/2347) returned HTTP 403. The claims about two vests, military working dogs, nose work, Spain, core temperature and pulse, and the authors' suggestion are unchecked by me. The prior worker's ledger says it was read at abstract level only. Recommend a human confirm the abstract (or soften the sentence) before publishing.
- Verified: AKC 105.8 / 104 / 105 thresholds, Cornell 105 F, AKC pavement 85 F / JAMA 135 F / 10 s, Royal Kennel Club 7 s, UF 2012 (7 dogs, preliminary), Humane World (2019), ALDF 32 states + DC + Guam, MSU table (CA $100 per animal, NC 14-363.3, FL 768.139, TX Lopez v. State), Chewy "up to four hours" vs maker's 3 hours, Green Pet Shop towel, "prevents dangerous overheating" and "shown to help" wording, sizes and dimensions, Swamp Cooler, Kurgo and Springland specs.

### protect-your-car-interior-from-a-dog-on-a-road-trip
- WRONG: ASPCA described as "harness attached to a secured seat belt"; ASPCA says a secured crate first and, if no crate, a harness attached to a seatbelt. Also "windows open" is "windows cracked". Corrected in the FAQ, the first bullet and the heat section.
- PARTIAL: the table said Kurgo's only safety wording is distracted driving; that is the Backseat Bridge page only, and the hammock page says its front-seat barrier keeps everyone safer. Corrected.
- PARTIAL: Chewy "bench covers are easiest to install" is "install easily"; "for swimmers a ... cover is a must" is "worth prioritizing". Reworded (FAQ and body).
- Unsupported implication: the dek and intro said no cover "keeps a dog safe in a crash" / "does not protect the dog". No source tests this; now "no page we read sells one as a crash restraint / claims it protects the dog in a crash".
- Checked and fine: PetSafe bench cover, Kurgo extended hammock (63 x 56, eight attachment points, 55 x 56 smaller hammock), Cargo Cape, Backseat Bridge (100 lb, 13 in), PetSafe crate, Heather booster, Vetstreet quotes, Nationwide, NAPA, Seat Cover Solutions, Play Pet Brands, Enterprise.

## Catalog (content/products.yml) corrections needed
None required for the claims above; the records match the maker pages. Optional: the Springland record id says "original" while the record name says "22oz Classic" (the page calls the product "22oz Original" in its title and "22oz Classic" in its selector); Ruffwear pages and the Beacon, Grip Trex, Polar Trex, Swamp Cooler and Quencher pages all showed out of stock or "Coming Soon" on 2026-11-19, which the guides correctly do not mention.

## Checks run
`bunx tsc --noEmit` clean; `bunx vitest run src/test/content.test.ts` 235 passed. Claims ledgers updated in docs/CLAIMS-<slug>.md for all four guides.
