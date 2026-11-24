# FIX4: vacation-rentals-that-welcome-large-dogs (from r4 review)

Changed in src/content/guides/vacation-rentals-that-welcome-large-dogs.ts:
- Edit 3: added the "Most of this is about the drive..." sentence before "In the rental".
- Edit 4: table intro shortened as suggested; repeated count/range removed from the short answer.
- Edit 5: added FAQ "Do vacation rentals charge more for large dogs?" (no numbers, links the pet-fee guide); added a destination search sentence in "Find candidates".
- Edit 2 (part): removed the repeated "lifetime guarantee" from the hammock prose.

Skipped:
- Edit 1: button contrast (template, already fixed).
- Edit 2 (grey description line under chips): comes from product data (content/products.yml), not the guide source; owner/product-data change.

Tests: content-pipeline passes; tsc clean. Full vitest has 9 failures in other files, not touched by this change.
