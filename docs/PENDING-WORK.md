# Pending work (2026-11-24, paused by the 5-hour API limit; resets 02:30 UTC on 2026-11-25)

State: everything is committed locally on claude/affiliate-setup (nothing pushed; main is dbfa200; Netlify builds are stopped by the owner). Tests 495 of 495 at the last run.

## A. Article quality (owner rule: every article at least 9.0/10 on docs/review/RUBRIC.md)
Round-3 result: 11 pass (secure-fenced-yard 9.3, life-jacket 9.3, no-pet-fee, puppy, car-interior, checklist, cooling, pet-fees, cold-weather, pool, airbnb 9.0), 19 fail (8.0 to 8.8).
Round 4 fixers were started and stopped by the rate limit before editing. Re-launch (or SendMessage-resume) them after the reset, one per group, each applying docs/review/ARTICLE-<slug>-r3.md edit lists:
- A: what-a-dog-really-costs, vacation-rentals-with-no-dog-weight-limit, two-large-dogs-in-one-car (agent a01afe42cb82daeac)
- B: portable-dog-fence (code guide), how-many-dogs, dogs-in-georgia-state-park-cabins + add a second inbound link (agent af51e1befde3f9481)
- C: dog-hiking-gear, dog-friendly-cabin-packing-list (code guide), christmas-week (agent ad33218d29a3289b4)
- D: can-you-leave-a-dog-alone, vacation-rentals-that-welcome-large-dogs (code guide), new-years-eve (agent a5f4854e996a3cd3a)
- E: if-your-dog-gets-loose, dog-travel-bowls-and-food-storage, dog-ramp-or-steps (agent aa1f3ef36d4bc4308)
- F: dog-car-safety-harness-and-crate-guide (code guide), vacation-rental-with-a-senior-dog, vacation-rental-with-a-reactive-dog (agent a55e1ce71cc84621f)
- First aid guide reframe (agent a8347ae62c5d9a488): superseded by Section B below (add real first-aid products, then rewrite the guide around them).
- Hero images for ramp, real-cost and packing-list guides (agent aefdbad16c9b1ab8d).
Then: rebuild, copy .output to the scratchpad review-build, serve on 4173, run round-4 reviewers (fresh agents) on the 19, regenerate pins (`python3 scripts/make-share-images.py && python3 scripts/make-pin-sheet.py`).

## B. First-aid products (owner: "add them")
Add a cabin kit, a thermometer and a muzzle to the catalog so the first-aid guide can sell them. Candidates and the Amazon checks are in docs/cowork/14-amazon-checks-and-first-aid-products.md (Cowork part B). Steps once Cowork returns ASINs: (1) read each maker page and write catalog records in content/products.yml (specSource, keySpecs, manufacturerClaimsVsIndependentTesting, categories [safety-id-first-aid], aliases, cardSpecs of three chips under 29 characters, all from the record); (2) add approved Amazon entries to content/affiliates.yml; (3) rewrite the first-aid guide's product section with 2 to 4 picks (cabin kit, trail kit, thermometer, muzzle) in the house style; (4) tests, then re-review the guide. Search findings so far (2026-11-24): AMK Adventure Dog series (Trail Dog already in the catalog; larger "Vet in a Box" kit has a field-medicine book; the REI/AMK pages name Me & My Dog, which was retired for no buy box), Kurgo 50-item travel kit (no thermometer), ARCA Pet and PushOn kits (reportedly include a thermometer), no kit found that includes a muzzle.

## C. Cowork queue (owner runs later)
- docs/cowork/13-stay-sweep.md: the final Georgia and California stay sweep (Phase A public read, Phase B deeplinks).
- docs/cowork/14-amazon-checks-and-first-aid-products.md: size and variant checks plus first-aid product finds.
- Owner decisions waiting: Netlify certificate renew (recommended yes), when to turn builds back on, price floor, copyright assignment and bill of sale, repo history choice.

## D. Nothing deployed
Do not push or merge until the owner says "deploy" (Netlify credits are low; builds are stopped).
