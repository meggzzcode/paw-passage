# Library inventory

Computed by `node scripts/library-stats.mjs` (add `--json` or `--md`). The counts below are the FULL-mode figures: they need the premium folder (`PREMIUM_DIR=<package>/adventures`, or `--premium-dir`). Without it the script runs in a labelled free-only (partial) mode and premium counts read 0. The script is read-only, validates every card with the real schema, and prints only counts and card ids, never premium text. `src/test/library-inventory.test.ts` runs it and checks the numbers agree with each other. Re-run it before quoting any number in copy. Last run: **2026-11-26**.

## Counts

| Measure                                    | Count   | Definition                                                                                                              |
| ------------------------------------------ | ------- | ----------------------------------------------------------------------------------------------------------------------- |
| Unique core adventures                     | 113     | Unique ids across `content/adventures/*.yml` and the premium folder (`PREMIUM_DIR`) that pass the schema                |
| Published / draft                          | 113 / 0 | `status`                                                                                                                |
| Free intro pool                            | 14      | published, `access: free`                                                                                               |
| Premium                                    | 99      | published, `access: premium`                                                                                            |
| Public premium previews                    | 50      | premium cards with `showcase: true` (each has a teaser)                                                                 |
| Curated collections                        | 25      | collections with at least one published card (25 defined; 11 flagged `premiumOnly`)                                     |
| Keepsake themes registered                 | 117     | `THEMES` in `src/passport/keepsake/themes.ts` (10 families)                                                             |
| Adventure-specific keepsake configurations | 113     | distinct family/theme pairs used by published cards, each a registered theme of its own family (every card has its own) |
| Achievements                               | 8       | `content/achievements.yml`                                                                                              |
| Stamps                                     | 12      | `content/stamps.yml`                                                                                                    |
| Variations                                 | 448     | sum of every card's `variations` array (4 per card on average)                                                          |
| Bonus experiences                          | 22      | 6 printables + 6 itineraries + 10 discovery shortcuts                                                                   |

Bonus experiences: the card schema has no bonus role or collection, so this inventory defines them as non-adventure resources shipped beside the cards. They are never added to any adventure count. If the owner means something else, change the definition in the script and here.

Do not combine counts that overlap (for example 113 cards and 117 themes are different things; 113 configurations is the number of cards, not an extra number).

## No additional spending (`costMax` 0)

70 published cards have `costMax` 0: 12 free + 58 premium (2026-11-26). The earlier "70 adventures requiring no additional spending" claim is confirmed against the current library. No card has purchase wording in its supplies, diet notes or steps, and none needs a reservation. Eleven of the 70 call for dog treats (`requires: treats`), so "no additional spending" assumes the household already has treats; say "using things you already have" rather than "nothing at all".

## Distributions (113 published cards)

| Dimension                                | Counts                                                                                                                                                                                                              |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Dog energy                               | gentle 76, moderate 26, lively 11                                                                                                                                                                                   |
| Owner effort (`ownerMobility`)           | seated 37, minimal-walking 37, short-walk 36, long-walk 3                                                                                                                                                           |
| Duration (by `minutesMax`)               | <=10 min: 2, <=15: 3, <=30: 51, <=60: 41, longer: 16                                                                                                                                                                |
| Budget (by `costMax`)                    | free 70, $1-10 24, $11-30 16, higher 3                                                                                                                                                                              |
| Setting                                  | indoor 44, outdoor 44, either 25                                                                                                                                                                                    |
| Life stage (cards may suit several)      | puppy 52, adult 103, senior 97                                                                                                                                                                                      |
| Role                                     | everyday 38, lifestyle 37, signature 23, aspirational 15                                                                                                                                                            |
| Activity types (up to 3 per card)        | outdoor-exploration 47, play-and-games 44, scent-and-discovery 44, memory-making 37, relaxation 32, creative-projects 22, problem-solving 19, celebrations 18, photography 14, food-and-treats 9, travel 6, water 4 |
| Family household tag                     | 10                                                                                                                                                                                                                  |
| Two-dog household tag                    | 1                                                                                                                                                                                                                   |
| Limited-mobility dog (`dogMobility` low) | 65                                                                                                                                                                                                                  |
| Apartment-friendly                       | 110                                                                                                                                                                                                                 |
| No car (transport none or walkable)      | 107                                                                                                                                                                                                                 |

## Public preview showcase (50)

| Dimension                        | Counts                                                   |
| -------------------------------- | -------------------------------------------------------- |
| Role                             | signature 17, aspirational 11, everyday 11, lifestyle 11 |
| Dog energy                       | gentle 27, moderate 14, lively 9                         |
| Setting                          | outdoor 24, indoor 15, either 11                         |
| Local (no car)                   | 44                                                       |
| Family-tagged                    | 4                                                        |
| No additional spending           | 27                                                       |
| Seasonal                         | 11                                                       |
| Celebration (type or collection) | 7                                                        |
| Life stage                       | puppy 22, adult 48, senior 40                            |

## Review findings (the one overpromise found is fixed; the rest are open and optional, see D14 in `COWORK-HANDOFF.md`)

| Finding                                                                                                                                                                                                                             | Severity   | Note                                                                                                   |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------- | ------------------------------------------------------------------------------------------------------ |
| FIXED: the collection with slug `five-minute-wonders` held 22 cards but only 5 run 15 minutes or less (longest 40). It is now titled "Quick Wonders" with a description that promises "short, low-prep" only; the slug is unchanged | Resolved   | Do not market it as five-minute adventures                                                             |
| Several themed collections are thin: after-hours 1, birthday-and-gotcha-day 1, adventures-without-spending 2 (70 free cards exist), apartment-adventures 3 (110 qualify), the-gentle-soul 3                                         | Medium     | Retagging existing cards fixes it; no new cards needed                                                 |
| Two-dog (1) and family (10) tags are sparse                                                                                                                                                                                         | Medium     | Consider before advertising either audience; family is 4 of 50 previews                                |
| Title pattern repeats: "Club" x11, "Mystery" x5, "Expedition" x5, "Room" x5                                                                                                                                                         | Low        | Reads as house style but is visible in a list                                                          |
| Route-choice walks cluster (dog picks the turns, 8 or more cards)                                                                                                                                                                   | Low        | Mechanics differ enough; highest text overlap between any two cards is low                             |
| Two premium titles share the word "camp" while describing very different cards (a new-dog welcome and an overnight trip)                                                                                                            | Low        | Confusing in a list; kept because the card text uses the term. Owner can rename in the private library |
| Thin categories: travel 6, water 4, food-and-treats 9, long-walk owner effort 3, <=10 minutes 2                                                                                                                                     | Low        | Honest scarcity, not a blocker                                                                         |
| Near-duplicates                                                                                                                                                                                                                     | None       | No two cards share a mechanic; the dig and time-capsule cards are related but distinct                 |
| Filler                                                                                                                                                                                                                              | None found | Every card has a distinct hook, variations and a keepsake                                              |
