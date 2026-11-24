# Spec card chip check

Independent check of all 159 chips (53 active products x 3) in cardspecs-1/2/3.yml against content/products.yml (summary, keySpecs, manufacturerClaimsVsIndependentTesting) and the Amazon link `notes` in content/affiliates.yml.

| Verdict | Count |
|---|---|
| VERIFIED | 135 |
| DISTORTED | 13 |
| UNSUPPORTED | 0 |
| TOO VAGUE | 11 |

Distorted chips were mostly maker or rating claims stated as fact, a dropped "up to", or a chip about a different size than the Amazon link sells (Lucky Kennel Large vs Intermediate link, 42 in pen, boots, wipes 4-pack). Vague chips were mostly "not stated" filler. All chips were changed to 28 characters or fewer.

Left as-is on purpose: safety-relevant "no X stated" chips (crash test, flotation rating, strength rating, temperature range) because the absence is the useful fact for a buyer. Kurgo Heather booster: the weight limit (30 lbs) matches the record, but the link notes say a colour variant's listing shows a different weight limit; owner should confirm the linked colour.

## Changes

| Id | Old chip | New chip | Verdict | Why |
|---|---|---|---|---|
| sleepypod-clickit-sport | Sizes Small to X-Large | CPS-tested: Small to X-Large | DISTORTED | Sizes come only from the CPS listing (no maker size chart is recorded); chip implied maker sizing |
| kurgo-enhanced-strength-tru-fit | Maker: crash tested, 75 lbs | Maker: crash tested to 75 lb | DISTORTED | Record says crash tested for dogs up to 75 lbs; limit was stated as a flat figure |
| lucky-duck-lucky-kennel | Large 70 to 110 lbs | Intermediate: under 70 lbs | DISTORTED | Amazon link is the Intermediate size only; chip described the Large size |
| gunner-dog-bowl | Bowl body plus travel lid | Non-slip rubber feet | TOO VAGUE | Said nothing a buyer could not infer; replaced with a stated feature |
| gunner-dog-bowl | No capacity listed on page | Maker: BPA free, food-grade | TOO VAGUE | 'Not stated' chip; replaced with a real maker statement |
| midwest-exercise-pen-with-door | 24 to 48 size designations | 8 panels; 8 ground anchors | TOO VAGUE | Model-number range told a buyer nothing and the link sells one size (42 in); replaced with real contents |
| midwest-exercise-pen-with-door | Untrained pets may escape | Maker: untrained pets escape | DISTORTED | Dropped attribution: this is the maker's warning (said 'may attempt to escape') |
| carlson-convertible-pet-yard | No dog-size limit stated | Up to 146.5 in as a gate | TOO VAGUE | 'Not stated' chip; replaced with gate width (all six panels) |
| petmate-precision-pet-soft-side-play-yard | Listed as size Large | Water-resistant fabric | TOO VAGUE | Dimensions have no units in the record, so 'Large' tells nothing; replaced with a stated feature |
| petmate-precision-pet-soft-side-play-yard | Folded size not stated | Maker: sets up with no tools | TOO VAGUE | 'Not stated' chip; replaced with a maker statement |
| midwest-icrate-dog-crate | No weights listed on page | Rubber feet protect floors | TOO VAGUE | 'Not stated' chip; replaced with a stated feature |
| kurgo-loft-wander-dog-bed | No weight listed on page | Large rolls to 17 x 9.5 in | TOO VAGUE | 'Not stated' chip; replaced with rolled size of the Large (the linked size) |
| ruffwear-grip-trex-boots | Paw width 1.50-3.25 in | Sizes 1.50-3.25 in; set of 2 | DISTORTED | Read as the fit of the boot linked, which is the 2.00 in listing; now clearly the size range, and the set of two |
| ruffwear-polar-trex-boots | Paw width 1.50-3.25 in | Sizes 1.50-3.25 in; set of 2 | DISTORTED | Same: link is the 2.50 in listing; chip now says it is the size range |
| ruffwear-polar-trex-boots | Waterproof, windproof upper | Maker: waterproof, windproof | DISTORTED | Maker claim stated as fact; no test is named |
| fi-series-3-plus | IP68 and IP66K certification | Maker lists IP68 and IP66K | DISTORTED | Certification wording must say who says it; no tester named |
| tractive-dog-6 | Dogs above 8.8 lbs | Maker: dogs above 8.8 lbs | DISTORTED | Dropped 'maker says' (page also says above 9 lbs) |
| tractive-dog-6 | IP68 waterproof, LED light | Maker: IP68 waterproof, LED | DISTORTED | Maker's rating stated as fact |
| petcube-gps-tracker | IP67 water resistance | Maker: IP67 water resistance | DISTORTED | Record marks IP67 as the maker's figure |
| ruffwear-the-beacon-dog-safety-light | Waterproof to 1 m, 30 min | Maker: waterproof 1 m/30 min | DISTORTED | Maker figure stated as fact; no independent re-test |
| soggy-doggy-super-shammy-towel | No absorbency figure given | Care: tumble dry low | TOO VAGUE | 'Not stated' chip; replaced with a care fact |
| soggy-doggy-microfiber-doormat | No warranty on the page | Machine washable, dryer safe | TOO VAGUE | 'Not stated' chip; replaced with a stated feature |
| pet-parents-pawtect-pads | Warranty terms not shown | Machine washable; 2 per pack | TOO VAGUE | 'Not stated' chip; replaced with stated features |
| adventure-medical-kits-dog-wipes | 8 wipes, each 8 x 8 in | 8 per pack; each 8 x 8 in | DISTORTED | The Amazon link is a 4-pack of the 8-wipe packs; chip now says per pack |

Validation re-run: YAML parses, 3 chips per product, 53 active product ids each covered once, every chip at most 28 characters.
