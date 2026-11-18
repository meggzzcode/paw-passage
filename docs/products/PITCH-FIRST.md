# Pitch-first products (2026-11-18)

Source: the five cluster research files in this folder (43 candidates). Rules: no prices, ratings or review counts are shown or recorded here; "value" rests on a cited reviewer label or on maker specs and warranty, and the actual price is unknown until the owner checks it (privately) on Amazon. Safety claims are maker claims unless a named independent tester is cited. Nothing is live: every candidate is `active: false` in its cluster file.

| # | Product | Role | Guide that should carry it | Evidence for value | What to confirm on Amazon |
|---|---|---|---|---|---|
| 1 | EzyDog DFD Life Jacket | best overall / value | dog-life-jacket-for-lakes-and-beaches | Whole Dog Journal credits it for "affordability" and buoyancy; GearJunkie: best for big dogs; maker size chart, 1-year warranty | exact size range, sold by maker or Amazon |
| 2 | PetSafe Happy Ride Compact Telescoping Ramp | best value ramp | dog-ramp-or-steps-for-the-car-and-cabin | maker: 28 in collapsed, 14 lb, 300 lb rating (rating wording names no tester) | model, sold by |
| 3 | Kurgo Rover Hammock, Extended Width | best for large vehicles | two-large-dogs-in-one-car, dog-car-safety guide | maker: 63 x 56 in, lifetime guarantee | size, vehicle fit |
| 4 | North States MyPet Universal Petgate | best gate | portable fence guide, can-you-leave-a-dog-alone, vacation-rental-with-a-reactive-dog | maker: 26 in high, fits 26-42 in, pressure mount | model/width |
| 5 | MidWest iCrate | best-value crate | portable fence guide, puppy guide | maker: divider, removable pan, folds flat, seven sizes (no warranty stated) | size, sold by |
| 6 | The Green Pet Shop Cool Pet Pad | best cooling mat | dog-friendly-cabin-packing-list, car safety guide | NBC Select "Best cooling mat", PetsRadar "Best overall"; 12-month warranty | size |
| 7 | IRIS USA Airtight Container (10 lb) | food storage | dog-travel-bowls-and-food-storage | PetsRadar "favorite all-rounder"; 12.75 qt, made in USA; not bear-resistant | size, sold by |
| 8 | Soggy Doggy Super Shammy + Microfiber Doormat | paw and mud towels | dog-friendly-cabin-packing-list, airbnb-pet-damage-charge guide | maker specs (machine-washable microfiber, dimensions) | which mat size |
| 9 | Pet Parents Pawtect Pads | best washable pads | puppy-at-a-vacation-rental, senior guide | Petful "Best washable"; maker: triple layer, machine washable | size/count |
| 10 | MidWest LifeStages Crate | best-value puppy crate | puppy-at-a-vacation-rental | maker: divider panel included, six sizes, folds flat; ASPCA page we cite says use a divider | size |
| 11 | KONG Classic / Puppy KONG | value chew toy | puppy guide, can-you-leave-a-dog-alone | maker size chart and chew guidance | size by age/chew |
| 12 | Ruffwear The Beacon safety light | night-walk safety | if-your-dog-gets-loose, new-years-eve | Tree Line Review "Best waterproof"; maker: 20 h run time, 1 m/30 min waterproof | still sold? |
| 13 | Petcube GPS Tracker | tracker (plan required) | if-your-dog-gets-loose | maker says a paid subscription is required; Tree Line notes "lowest price of subscription-based trackers" (say only that a plan is required, no cost) | current model, plan wording |

Hold or weak (do not pitch yet): Pet Gear Tri-Fold ramp, Arf Pets gel pad, Clickit Sport Plus (page contradicts itself on weight), Garmin Alpha T 20 (no-subscription wording is a reviewer's), Furhaven protector (sold out), Granby Splash (no value evidence), Rock Creek crate (CPS claim unconfirmed), BearVault BV450 (two certification numbers disagree: check the official IGBC list before saying anything about bears).

## How to use the picks without losing trust
- A "Best value" label appears only with its evidence sentence and the words "check the current price"; no dollar figure, discount or star rating, ever.
- A pick that no reviewer names as value is labelled "a lower-cost option" only if the maker's own page shows the simpler, lighter or shorter spec, and the comparison table shows features, not prices.
- Each guide carries at most four products in its "Gear for this trip" block (the existing `relatedProducts` field); the rest go to /gear.

## Next steps
1. Owner runs `docs/cowork/07-amazon-links.md` in Cowork (signed in to Amazon Associates): per product it records the exact model, ASIN, sold-by, availability, the Site Stripe link and a private price band.
2. I add each confirmed product to `content/products.yml` as active, an `amazon-<id>` entry to `content/affiliates.yml` using `https://www.amazon.com/dp/<ASIN>?tag={amazonTrackingId}` (tag pawspassage-20), and the guide placements above; tests must pass.
3. Everything ships on the branch; main only on the owner's say.
