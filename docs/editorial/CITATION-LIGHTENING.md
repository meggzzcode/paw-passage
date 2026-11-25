# Citation lightening (2026-11-25)

Owner decision: follow the pet-travel peers and make sourcing in sentences light. The trailing parenthetical publisher links (`([Publisher](url))`, rendered as `span.src-paren`) were removed from every published guide by `scripts/lighten-citations.mjs`. Front-matter `sources` were not changed (no source removed), so every guide's collapsible Sources list still shows every source. Natural publisher links already woven into prose stay. Where the source lived only in the tag ("a thread", "one owner wrote", "the page says"), the sentence was rewritten minimally so the publisher is the link text.

Exception guides (safety, medical, restraint, heat or cold, legal and platform policy) keep inline attribution only for those claims. Their natural in-prose links already number more than the cap of about 8 in most of them, so no further tags were added; `bringing-a-dog-to-a-no-pets-rental` keeps 2 tags (service animal and emotional support animals, pet fee and host protection) that are listed in `scripts/lighten-citations.keep.json`.

Re-run: `bun scripts/lighten-citations.mjs` (dry run), `--write`, `--only a,b`, `--skip a,b`, `--show slug`, `--flags`.

Test rule (src/test/content.test.ts): every front-matter source must have title, publisher, URL and date (the Sources list prints them) with no duplicate URLs, and every inline link to an outside site must go to one of the guide's own sources. The parenthetical-label, 2-per-sentence, table-row and `[[n]]` tests are unchanged.

| Guide                                               | Exception guide | Parenthetical publisher links before | After | Natural inline source links now |
| --------------------------------------------------- | --------------- | ------------------------------------ | ----- | ------------------------------- |
| dog-car-safety-harness-and-crate-guide              | yes             | 22                                   | 0     | 14                              |
| cold-weather-dog-gear-for-winter-cabin-trips        | yes             | 18                                   | 0     | 18                              |
| keep-a-dog-cool-on-a-summer-trip                    | yes             | 15                                   | 0     | 10                              |
| bringing-a-dog-to-a-no-pets-rental                  | yes             | 14                                   | 2     | 5                               |
| dog-travel-first-aid-kit-guide                      | yes             | 14                                   | 0     | 12                              |
| vacation-rentals-with-no-pet-fee                    |                 | 13                                   | 0     | 13                              |
| new-years-eve-with-a-dog-in-a-vacation-rental       | yes             | 12                                   | 0     | 18                              |
| dog-ramp-or-steps-for-the-car-and-cabin             |                 | 11                                   | 0     | 4                               |
| airbnb-pet-damage-charge-after-checkout             |                 | 9                                    | 0     | 13                              |
| can-you-leave-a-dog-alone-in-a-vacation-rental      |                 | 8                                    | 0     | 15                              |
| if-your-dog-gets-loose-on-a-trip                    | yes             | 8                                    | 0     | 18                              |
| two-large-dogs-in-one-car                           |                 | 8                                    | 0     | 12                              |
| christmas-week-in-a-cabin-with-a-dog                |                 | 7                                    | 0     | 22                              |
| dog-hiking-gear-for-a-cabin-vacation                | yes             | 7                                    | 0     | 11                              |
| vacation-rental-with-a-senior-dog                   |                 | 7                                    | 0     | 25                              |
| vacation-rentals-that-welcome-large-dogs            |                 | 6                                    | 0     | 12                              |
| dogs-in-georgia-state-park-cabins                   |                 | 5                                    | 0     | 9                               |
| how-many-dogs-can-you-bring-to-a-vacation-rental    |                 | 5                                    | 0     | 9                               |
| portable-dog-fence-and-playpen-guide-for-rentals    |                 | 5                                    | 0     | 3                               |
| dog-travel-bowls-and-food-storage                   |                 | 4                                    | 0     | 11                              |
| protect-your-car-interior-from-a-dog-on-a-road-trip |                 | 4                                    | 0     | 9                               |
| puppy-at-a-vacation-rental                          |                 | 4                                    | 0     | 19                              |
| pet-friendly-vacation-rental-checklist              |                 | 4                                    | 0     | 7                               |
| how-vacation-rental-pet-fees-work                   |                 | 2                                    | 0     | 8                               |
| vacation-rental-with-a-reactive-dog                 |                 | 2                                    | 0     | 20                              |
| vacation-rental-secure-fenced-yard                  |                 | 2                                    | 0     | 9                               |
| can-dogs-go-in-a-rental-pool-or-hot-tub             |                 | 1                                    | 0     | 17                              |
| dog-life-jacket-for-lakes-and-beaches               | yes             | 1                                    | 0     | 17                              |
| what-a-dog-really-costs-on-a-vacation-rental        |                 | 1                                    | 0     | 9                               |
| dog-friendly-cabin-packing-list                     |                 | 1                                    | 0     | 6                               |
| pet-friendly-listing-red-flags                      |                 | 0                                    | 0     | 10                              |
| **Total (31 guides)**                               |                 | **220**                              | **2** |                                 |
