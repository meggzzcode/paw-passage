# Integration fixes, 2026-11-24

1. Georgia state park cabins: the Animal of Things link moved out of the Fee table row into a "Sources:" line under that table; all frontmatter sources stay linked.
2. Hiking gear: the Ruffwear Quencher source was the unlinked one (not Outward Hound); it is now linked in the Water paragraph (net words unchanged).
3. Bowls: the Quencher is now named "Ruffwear Quencher" in prose so the auto-linker links ruffwear-quencher-bowl; the publisher link moved to the end of the sentence. No duplicate cards.
4. gear-products.test.ts: category counts are derived from active products per primary category (each at least MIN_LIVE, sum equals the active total). Verified counts: car-safety 10, car-interior 4, ramps-and-steps 5, feeding-and-hydration 9, pens-and-gates 6, comfort-and-cooling 7, water-and-beach 3, trail-and-hiking 3, cold-weather 3, safety-id-first-aid 9, rental-cleanup 6. The "every active product appears in a published guide" test passes; no unplaced active products.
5. /data/pet-policies linked once each in no-pet-fee, large-dogs and checklist at the first mention of the 38 managers.
6. Titles kept. Large-dogs seoDescription softened to "copy a message to ask about a big dog" (approval is the manager's decision). No-fee and checklist descriptions unchanged.

Checks: eslint (0 errors), tsc clean, vitest src/test 602 passed.
