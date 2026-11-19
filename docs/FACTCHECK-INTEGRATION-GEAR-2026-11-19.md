# Independent fact-check: earning products woven into guides (2026-11-19)

Scope: sections rewritten or added since f73636f. Method: every product claim re-read on the maker page (WebFetch plus raw HTML where the fetch tool truncated), CPS pages read as plain HTML with curl (200 OK; centerforpetsafety.org was not blocked), AVMA brochure read as PDF text, Whole Dog Journal and Tree Line Review pages re-read. Catalog (content/products.yml, affiliates.yml) not edited. tsc clean; `vitest run src/test/content.test.ts` 235 passed.

## Verdicts

| Guide | Claims checked | Errors fixed | Verdict |
| --- | --- | --- | --- |
| dog-car-safety-harness-and-crate-guide | ~35 | 6 | Fixed. Three conflicting Sleepypod weight figures disclosed; wrong CPS citation fixed; unsupported "same line as a tested model" removed |
| two-large-dogs-in-one-car | ~25 | 3 | Fixed. Same Sleepypod conflict; Ruffwear "would not meet CPS" omission added; hammock cited |
| dog-ramp-or-steps-for-the-car-and-cabin | ~25 | 1 | Clean apart from "no height numbers" wording |
| vacation-rentals-that-welcome-large-dogs | ~8 | 0 | Clean (Cargo Cape, hammock) |
| vacation-rental-with-a-senior-dog | ~7 | 0 | Clean (bench seat cover) |
| dog-travel-bowls-and-food-storage | ~45 | 1 | Vittles Vault materials wording corrected |
| dog-travel-first-aid-kit-guide | ~25 | 0 | Clean (Trail Dog, wipes, AVMA muzzle) |
| if-your-dog-gets-loose-on-a-trip | ~30 | 3 | Fi "fit chart" invented; Petcube reviewer verdict omitted; both fixed |
| dog-life-jacket-for-lakes-and-beaches | ~25 | 3 | "Best value" label not sourced; small-dog superiority wording; fixed |
| portable-dog-fence-and-playpen-guide-for-rentals | ~45 | 4 | "steel" not on any page; "the one to start with" unsupported; gate anchor wording; fixed |
| dogs-in-georgia-state-park-cabins | ~10 | 0 | Clean (Springland 22oz, Quencher) |

Totals: about 280 claims checked, 21 edits (counted by sentence or label), 0 prices, star ratings or stock statements left in the guides (CPS "5 star" is a CPS test rating and is attributed; a research note about "sold out" sizes was replaced).

## Fixes made

1. Sleepypod Clickit Sport Plus (harness and two-large-dogs guides, FAQ, pick cards, card watch-outs). The maker's product page says 18 to 110 lbs AND "Rated to 25 lbs. by Center for Pet Safety"; the maker's sizing page says 18 to 90 lbs for the Sport Plus (Range is 18 to 110). The guides now state all three and that the pages do not reconcile them. CPS lists only "Sleepypod Clickit Sport" (July 2014, 5 Star, Small 25 lb, Medium 45 to 90, Large 75 to 90, X-Large 90); removed "sits in the line of a model CPS has tested". "Rear-seat belt" changed to the maker's "any vehicle seatbelt".
2. CPS citations: the directory page (/cps-certified/) shows crates only in plain HTML, so the Sport row and the "up to 90 lb" claims now cite /sleepypod-clickit-sport/ (added as source 16 in the harness guide; sources 19 to 21 in two-large-dogs). The Medium dog bullet cited the sizing page for a CPS fact; fixed.
3. Atom "earlier collection page showed 18 lbs": the 18 lb figure is in the site navigation and a carriers banner; the Atom page and CPS both say 12 lb. Reworded (body and card watch-out).
4. Lucky Kennel: verified. CPS Large page 5 Star, July 2022, protocol CPS-002-016.01, 110 lb test dog, "Lucky Kennel with Lucky Ratchet Strap Kit"; directory lists Medium, Intermediate, Large. Maker's CPS link goes to the Intermediate listing. The two-dog arithmetic is correct. No edit needed.
5. Ruffwear Load Up (two-large-dogs): added Ruffwear's own statement that the harness "would not meet CPS's current certification" (excursion limits).
6. Fi Series 3+: "tells buyers to check its fit chart first" is not on the page (page says "Modular design fit for XS to XL dogs"); removed in body and watch-out.
7. Petcube: Tree Line Review lists it as an also-ran and calls it "the most inaccurate location-wise"; guide only said "no award". Added the quote with a new source [23]. Subscription wording ("paid plan required... operate") confirmed. Tractive wording confirmed.
8. EzyDog DFD pick label "Best value" replaced by "Whole Dog Journal's all-around pick" (WDJ says all-around pick, 4 of 4 paws; "best value" is our inference). Float Coat "the one to look at for a small dog" reworded.
9. Fence guide: "steel" appears on no maker page or manual (page: metal wire); replaced throughout. "Is the one to start with" changed. North States "anchors in drywall" changed to the page's "should not be installed using anchors".
10. Vittles Vault table cell: page says "heavy-duty BPA food-grade plastic" and "proprietary sealing system", not "BPA-free ... airtight seal".
11. Hitch Step "gives no height numbers" changed to "no adjustment range" (page lists 12 in product height).

## Confirmed without change
PetSafe compact and extra long ramps, folding ramp, side door steps, hitch step, quilted bench seat cover; Outward Hound Dawson (including "flotation aid... conscious dog in calm waters"); Springland 22oz Classic and 20oz Flip; Kurgo Collaps A Bowl, Splash Free Wander, Kibble Carrier, Heather, Rover Cargo Cape, Rover Hammock, Tru-Fit, Backseat Barrier; Gunner; Ruffwear Quencher and Beacon; Petmate Vittles Vault and soft yard; IRIS; Carlson; MidWest pen manual and iCrate; AMK Trail Dog and wipes; AVMA muzzle wording; Tractive DOG 6.

## Catalog corrections for the owner (not edited)
- sleepypod-clickit-sport-plus: summary and keySpecs say "double D-rings for walking"; the product page does not mention double D-rings. keySpecs "18 to 110 lbs" should add that the sizing page says 18 to 90 lbs. manufacturerClaimsVsIndependentTesting should mention the sizing-page conflict.
- fi-series-3-plus: keySpec "says to check the fit chart before ordering" is not on the page; "Modular design fit for XS to XL dogs" and the Puppy Warranty line are (in the page's embedded strings).
- tractive-dog-6: page also says "Only for dogs above 9 lbs" in one place (8.8 lbs in specs and FAQ).
- petcube-gps-tracker: add Tree Line's "most inaccurate location-wise" wording to the testing note.
- vittles-vault-travel-tainer: URL 301-redirects to https://www.petmate.com/products/vittles-vault-travel-trainer-portable-food-storage-container; materials are "BPA food-grade plastic", not "BPA-free". Pick link for the EzyDog DFD card points at the Whole Dog Journal review, not a maker page.
- midwest-exercise-pen-with-door: any "steel" wording should read "metal wire".
- lucky-duck-lucky-kennel: the maker's CPS link is the Intermediate listing; the Large and Medium listings exist separately.
- ruffwear-quencher-bowl and ruffwear-the-beacon (and Float Coat per the earlier note) showed "Coming Soon" or out of stock on 2026-11-19; not stated in any guide.
