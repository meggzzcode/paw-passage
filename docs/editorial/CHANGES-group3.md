# Group 3 editorial changes

Body word counts exclude frontmatter (sources, FAQs, metadata). Citation markers keep the existing `[[n]](url)` format; every source is still cited at least once.

## two-large-dogs-in-one-car

- Words before / after: 3077 / 2009 (35% cut)
- Old dek: One restraint per dog, how to lay out a sedan, wagon or SUV, what a barrier does and does not do, and the multi-dog questions no independent test answers yet.
- New dek: Give each dog its own restraint rated for its weight, either a strapped crate or a harness on its own seat belt. No test covers two dogs together.
- Old first paragraph: Two big dogs, one back seat and a long drive: each needs a restraint, and no single product covers both.
- New first paragraph: Measure before you buy. Two large crates side by side need about 44 inches of cargo floor width, and two harnesses need two good seat belt positions on the rear seat. Dogs ride in the back, never up front.

## protect-your-car-interior-from-a-dog-on-a-road-trip

- Words before / after: 2763 / 1830 (34% cut)
- Old dek: None of these is a crash restraint. Bench cover for a car, extended hammock for a big dog in a truck, cargo cape behind the rear seat.
- New dek: A bench cover, extended hammock or cargo cape protects your upholstery, but none restrains a dog. Pick by where your dog rides, then add a real restraint.
- Old first paragraph: Muddy paws on a pale bench seat, claws on a door panel, hair in every seam: a long drive with a dog is hard on a back seat. A dog car seat cover, a hammock or a cargo cape keeps most of that off your upholstery, and the right one depends on where your dog rides and how big the vehicle is. **What to buy:** a waterproof cover sized to where the dog rides, then a separate restraint for the dog, because a cover protects the car, not the dog in a crash.
- New first paragraph: Match the cover to the vehicle first. A bench cover suits a car, an extended hammock suits a big dog in a truck or large SUV, and a cargo cape suits a dog that rides behind the rear seat. Measure before you buy: makers list sizes from 45 by 56 inches (bench cover) to 63 by 56 inches (extended hammock). 2]](https://www.petsafe.com/p/happy-ride-quilted-bench-seat-cover/PTV00-17462/) 3]](https://kurgo.com/car-seat-covers/dog-hammocks/wander-hammock-extended-width)

## dog-ramp-or-steps-for-the-car-and-cabin

- Words before / after: 3368 / 2320 (31% cut)
- Old dek: Your big or older dog can no longer hop into the car. Compare ramps and steps on maker specs, measure your vehicle, and plan for cabin stairs.
- New dek: Most cars and SUVs suit a telescoping ramp, and steps only suit a fixed door sill or hitch. Measure ground to floor and match ramp length to it.
- Old first paragraph: If your dog used to leap into the back of the car and now stops at the bumper and looks at you, a dog ramp for the car is the usual fix. This guide compares five PetSafe ramps and steps on the numbers their makers publish, shows how to measure your vehicle, and says what the vet and kennel-club pages we read say about jumping.
- New first paragraph: If your dog stops at the bumper and looks at you, a ramp is usually the fix, and the vet and kennel-club pages we read lean the same way. Pick one rated above your dog's weight, with side rails, a non-slip surface and a gentle slope for your vehicle's height. Ask your vet before buying if your dog is stiff or sore.

## dog-car-safety-harness-and-crate-guide

- Words before / after: 3477 / 2519 (28% cut)
- Old dek: What “crash-tested” does and does not prove, how to look up a crash-tested dog harness or crate, size and install it, and which products to start with.
- New dek: “Crash tested” is not regulated. Look up the exact model and size in the Center for Pet Safety directory, match your dog’s weight, and skip extension tethers.
- Old first paragraph: A crash-tested dog harness or crate is the fix for a dog that moves around the car, but only if it has a published independent test record, at a test weight that matches your dog, installed the way the maker says.
- New first paragraph: Pick the harness or crate whose independent test record matches your dog's weight, then install it the way the maker says: a harness on a rear-seat belt, or a right-sized crate held by strength-rated anchor straps. The CDC and ASPCA both advise the back seat for dogs that ride on a seat. 7]](https://www.cdc.gov/healthy-pets/travel/index.html) 8]](https://www.aspca.org/pet-care/general-pet-care/travel-safety-tips)

## portable-dog-fence-and-playpen-guide-for-rentals

- Words before / after: 2937 / 2129 (28% cut)
- Old dek: Use a freestanding folding pen taller than your dog can jump, with the host's permission and you present. Here is how to pick one, what to ask the host first, and when to skip it.
- New dek: Bring a freestanding folding pen taller than your dog can jump, get the host's permission first, and stay with your dog. Skip it for escape artists.
- Old first paragraph: The cabin has a deck, a lawn and no fence, and your dog needs to be outside for more than a leash walk. A portable dog fence for a rental is usually a freestanding folding pen, used with the host's permission and with you there, and the host's rules decide whether it works.
- New first paragraph: The MidWest Exercise Pen with Door, in the tallest size that fits your car, is the pick for a dog that jumps. The Carlson Convertible Pet Yard suits a small dog that also needs a doorway barrier. A pen is a short, supervised tool and not a replacement for a fenced yard, and the host's rules decide whether it works at all.

## Notes

- Each guide now has a compact "At a glance: our picks" box near the top, using only products already recommended on the page, plus a short box of takeaways that does not repeat the dek or the first paragraph.
- two-large-dogs-in-one-car and protect-your-car-interior now link to the car-safety guide for crash-test detail instead of re-explaining it. The Lucky Kennel Intermediate/Large caveat appears in the car-safety Quick picks and the crate pick (twice) instead of about five times. In two-large-dogs it appears in the picks box and the crate card.
- Ramp guide: spec table starts with the Compact row, footnotes run 6, 7, 8, 9, 10 in order. FAQs already existed in frontmatter (7 questions); unchanged.
- Portable fence guide: product cards cut to one `{{pick}}` per product (4); body prose names the products without extra links. Any further Amazon links come from the gear block and template (`gear` frontmatter array and card buttons), which this change does not touch. The MidWest iCrate is kept as a prose mention with its citation; gear-products test passes.
- vacation-rental-secure-fenced-yard is linked once for yard-checking; the fence/pen comparison stays here.
- Tests: tsc clean; content, content-pipeline, internal-guide-links, article-ux, gear-products pass. guide-related-products.test.tsx has 2 failures in other workers' files (an Amazon-notice template assertion and guides with no earning product such as airbnb-pet-damage-charge-after-checkout), not in these five guides.
