# Report: newCar (2026-11-19)

New guide: content/guides/protect-your-car-interior-from-a-dog-on-a-road-trip.md, status published (approvedBy/On set, researchComplete true, unverified empty). Status INTEGRATED.

Products: 4 picks, all earn (M): petsafe-happy-ride-bench-seat-cover, kurgo-rover-hammock-extended-width, kurgo-rover-cargo-cape, kurgo-rover-backseat-bridge (= relatedProducts). Mentioned in prose only (no pick, cap of 4): petsafe-happy-ride-collapsible-crate, kurgo-heather-booster-seat. Guide states repeatedly that covers, hammocks and extenders are not restraints and links dog-car-safety-harness-and-crate-guide and two-large-dogs-in-one-car.

Competitors read (6, in research.competitors): Vetstreet hammock roundup, Chewy seat-cover guide, Nationwide, NAPA Know How, Seat Cover Solutions, Play Pet Brands. Hepper returned 403 and is not used. Rental-car section rests on Enterprise's US page only; Hertz/Avis US terms were not found and are stated as unknown.

Facts: maker pages re-read 2026-11-19 (PetSafe cover, Kurgo hammock, cape, bridge, ASPCA, Enterprise); crate and booster from catalog records. Ledger docs/CLAIMS-protect-your-car-interior-from-a-dog-on-a-road-trip.md; short docs/FACTCHECK-protect-your-car-interior-from-a-dog-on-a-road-trip.md. Our own suggestions (belt checks, towelling a wet dog, 2 x 60 lb arithmetic) are labelled in the text.

Images: Unsplash License photo by yaed ("two pug dogs sitting in the back seat of a car", free licence confirmed on its page), not used by any other guide. Files src/assets/guide-protect-car-interior{,-card,-800}.jpg, entries added to src/lib/images.ts and src/content/image-credits.ts (key guide-protect-car-interior), same method as other stock heroes. The photo shows a hatchback rear seat, no cover; alt text says so. public/share and public/pins images generated with scripts/make-share-images.py; that script also pruned pins/shares of guides other workers set to draft (breed-restrictions, no-pets-rental, red-flags), which is its normal behaviour.

Inbound links (relatedGuides line only): two-large-dogs-in-one-car, dog-ramp-or-steps-for-the-car-and-cabin, keep-a-dog-cool-on-a-summer-trip.

Pins: 2 rows appended to docs/pinterest-pins.csv (board Dog Travel Gear, campaign dog-travel-gear). The second row uses utm_content "...-seat-cover", as the existing keep-a-dog-cool duplicate does.

Verify: tsc clean. vitest: 485 pass, 1 fail: share-images "one UTM-tagged row per public guide" (32 rows vs 30 guides). Two-pin rows per guide break that test (the keep-a-dog-cool double row already does); drop one of my rows or relax the test, lead's call. Category is Planning because the content test requires a gear: array of 3+ picks for category Gear.

For lead: kurgo-rover-hammock-extended-width spec URL contains "wander-hammock" (live, works). Hammock care PDF not read. packing.ts still lists retired kurgo-heather-hammock (not my file).
