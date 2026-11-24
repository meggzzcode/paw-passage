# Gear hub taxonomy (decided 2026-11-24)

Problem: the old 12 categories mixed three different things: trips (road trips, cabin, beach, winter), dogs (large, senior) and product types (car safety, feeding). "Road trips" held 23 of 53 products and "car safety" and "travel safety" overlapped, so a shopper could not tell where a crate or a GPS tracker lived.

Decision: categories are the JOB the product does (what the shopper searches for: "dog ramp", "dog GPS tracker", "dog life jacket"). Trips and dog types stop being categories and become "Shop by" shortcuts on the hub (links to existing guides, /dogs pages and filtered views). Every active product has exactly one PRIMARY category (first in its `categories` list) and at most one SECONDARY (shown as a cross-listing). 11 categories:

| Slug | Name | Tagline | Primary products |
|---|---|---|---|
| car-safety | Car safety and restraints | Harnesses, crash-tested crates, booster and barriers. | sleepypod-clickit-sport, ruffwear-load-up-car-harness, kurgo-enhanced-strength-tru-fit, sleepypod-atom, lucky-duck-lucky-kennel, petsafe-happy-ride-collapsible-crate, kurgo-heather-booster-seat, kurgo-backseat-barrier, petsafe-happy-ride-dog-barrier |
| car-interior | Seat covers and cargo liners | Keep the seats and cargo area clean. | kurgo-rover-hammock-extended-width, petsafe-happy-ride-bench-seat-cover, kurgo-rover-cargo-cape |
| ramps-and-steps | Ramps and steps | Getting a dog into the car or up to the cabin. | petsafe-happy-ride-folding-ramp, petsafe-happy-ride-compact-telescoping-ramp, petsafe-happy-ride-extra-long-ramp, petsafe-happy-ride-side-door-steps, petsafe-happy-ride-hitch-step |
| feeding-and-hydration | Bowls, bottles and food storage | Eating and drinking on the road and in the rental. | ruffwear-quencher-bowl, kurgo-splash-free-wander-bowl, gunner-dog-bowl, kurgo-collaps-a-bowl, springland-22oz-original-travel-bottle, springland-20oz-flip-travel-bottle, kurgo-kibble-carrier, vittles-vault-travel-tainer, iris-usa-airtight-dog-food-container-10-lb |
| pens-and-gates | Pens, fences and gates | Contain a dog in a rental with no fenced yard. | midwest-exercise-pen-with-door, carlson-convertible-pet-yard, petmate-precision-pet-soft-side-play-yard, north-states-mypet-universal-petgate, midwest-icrate-dog-crate |
| comfort-and-cooling | Beds, comfort and cooling | A place to settle, and ways to stay cool. | kurgo-loft-wander-dog-bed, green-pet-shop-cool-pet-pad, ruffwear-swamp-cooler, kong-classic |
| water-and-beach | Life jackets and water safety | For lakes, rivers and beaches. | ruffwear-float-coat, outward-hound-dawson-swim-life-jacket, ezydog-dfd-life-jacket |
| trail-and-hiking | Trail and hiking gear | Harness, boots and leash for the trail. | ruffwear-web-master-harness, ruffwear-grip-trex-boots, ruffwear-knot-a-leash |
| cold-weather | Cold-weather gear | Fleece, vest and snow boots. | ruffwear-climate-changer-fleece, ruffwear-timberline-fuse-vest, ruffwear-polar-trex-boots |
| safety-id-first-aid | ID, GPS and first aid | Find a lost dog and handle a small injury. | fi-series-3-plus, tractive-dog-6, petcube-gps-tracker, ruffwear-the-beacon-dog-safety-light, amk-trail-dog |
| rental-cleanup | Rental cleanup and protection | Towels, mats, pads and wipes. | soggy-doggy-super-shammy-towel, soggy-doggy-microfiber-doormat, pet-parents-pawtect-pads, adventure-medical-kits-dog-wipes |

That is 9 + 3 + 5 + 9 + 5 + 4 + 3 + 3 + 3 + 5 + 4 = 53 active products.

Secondary categories (optional cross-listings, at most one per product): ruffwear-swamp-cooler also water-and-beach; ruffwear-the-beacon-dog-safety-light also trail-and-hiking; kurgo-rover-hammock-extended-width, petsafe-happy-ride-bench-seat-cover also rental-cleanup; kurgo-heather-booster-seat also comfort-and-cooling is NOT wanted (leave single); petsafe-happy-ride-collapsible-crate also pens-and-gates; midwest-icrate-dog-crate also car-safety is NOT wanted (it is a home crate, no crash claim); ruffwear-quencher-bowl also trail-and-hiking; springland bottles also trail-and-hiking; soggy-doggy-super-shammy-towel also water-and-beach.

## "Shop by" shortcuts on the hub (replace the old trip and dog categories)
- By trip: Road trip (links: car-safety, car-interior, ramps-and-steps, feeding-and-hydration), Cabin stay (pens-and-gates, comfort-and-cooling, rental-cleanup), Beach and lake (water-and-beach, comfort-and-cooling), Winter trip (cold-weather), Hiking (trail-and-hiking).
- By dog: Large dogs (/dogs/big-dogs, ramps-and-steps, car-safety), Senior dogs (/dogs/senior-dogs, ramps-and-steps), Escape artists (/dogs/escape-artists, safety-id-first-aid), Multi-dog families (/dogs/multi-dog-families, pens-and-gates).

## Old URL handling
Old category slugs must 301 so nothing 404s: road-trips to car-safety, cabin-vacations to pens-and-gates, beach-vacations to water-and-beach, senior-dogs to ramps-and-steps, large-dogs to car-safety, travel-safety to safety-id-first-aid, travel-comfort to comfort-and-cooling, winter-travel to cold-weather, outdoor-adventures to trail-and-hiking, cleaning-and-rental-protection to rental-cleanup. (car-safety and feeding-and-hydration keep their slugs.)

## GearCategory shape (src/content/gear-categories.ts)
Add `howToChoose: string[]` (3 short bullets: who it is for, what to check before buying, what it does not do; maker-claim wording only, no prices/ratings/tests) and keep `slug`, `name`, `tagline`, `intro`, `guideSlugs`. Guides listed must be public. Copy follows the repo's rules: researched-not-tested, no price or stock, no invented claims.
