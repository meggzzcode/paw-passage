# Final editorial release report

Date: 2026-11-24. Repository HEAD `13a7ce1` (pushed to `main`). **Nothing is deployed:** the owner stopped Netlify builds, so the live site still shows an older deploy. Everything below describes the repository and the final build served locally on port 4199. It does not describe the live site and must not be read as "the live site is updated".

How the numbers were produced: `git log` and `git show` for the old and new text; a small script that strips frontmatter (Markdown guides) or reads the `body` template string (TypeScript guides) and counts whitespace-separated words, run on `dbbbb94`, `b0f371a` and HEAD with the same method; the built site at http://localhost:4199 (95 sitemap URLs fetched, every guide's rendered HTML parsed); `bunx vitest run` (46 files, 605 tests, all passing, 38 s); `docs/buyer/FINAL_QA_CRAWL_2026-11-24.md`; the independent reviewer files in `docs/review/`; and the writers' logs in `docs/editorial/`. Where a number comes from another file and was not re-run, it says so. Body words here count the Markdown body including `{{pick:}}` card directives and link syntax, and exclude FAQs, the Sources list and page chrome, so they are lower than the rendered-page words in the QA crawl.

## A. Baseline

- **Published guides: 29.** At the baseline there were 30; the no-weight-limit guide was merged into the large-dog guide and now returns a 301 (checked on the build).
- **Starting commit for the final pass: `dbbbb94`** ("Add editorial audit, scorecard, style guide, disclosure audit, fix plan and Cowork browser brief", 2026-11-24 17:20 UTC). `b0f371a` (17:55) is the integration commit after the first editorial pass; HEAD is 90 commits after `dbbbb94` and 75 after `b0f371a`.
- **Body words:** the 30 guides at `dbbbb94` held 84,317 words (the 29 survivors 81,901); at `b0f371a` the 29 held 57,011; at HEAD they hold 45,057 (shortest 1,014, longest 2,027). That is 45% fewer words than the baseline for the same 29 topics, with no guide merged except the large-dog pair. Length was a deliberate target of the owner's brief, not a goal for its own sake; section B shows each page.
- **Earlier rubric scores.** The technical review rubric (`docs/review/RUBRIC.md`: accuracy, trust, product placement; pass needs 9.0 and no criterion under 4) had all 30 guides passing at the baseline, as `docs/ARTICLE_SCORECARD.md` records. The separate reader-experience scorecard in that file (reader appeal, formatting, readability, utility, commercial integration, scored by an editor reading the rendered pages) gave a library mean of **6.5 of 10** (range 5.2 to 7.8; the 29 surviving guides average 6.55). Lowest: how-many-dogs 5.2, keep-a-dog-cool 5.2, the no-weight-limit guide 5.4, two-large-dogs 5.6, bowls 5.8. The scorecard itself notes that the two scales disagree on purpose.
- **Known major issues at the baseline** (`docs/EDITORIAL_AUDIT.md`, FACT unless marked): pages of 2,700 to 4,300 rendered words (17 to 27 phone screens) for questions the first 300 to 400 words answer; 1,011 numbered citation markers (11.6 per 1,000 words, tap targets under the WCAG minimum); 297 disclaimer-like blocks; the same short-answer, What-to-buy-first, How-sure-we-are, What-we-could-not-confirm stack on nearly every page; large-dog and no-weight-limit guides duplicating each other, and car-safety content re-explained in two other guides; gear blocks bolted onto pure policy pages (pool, Airbnb damage, how-many-dogs, large-dog rentals); tables 544 px wide in a 350 px wrapper; three weak hero images (cost, packing list, large-dog rentals); a hedge-heavy, clinical voice (JUDGMENT).

## B. Changes by article

All 29 guides, sorted by URL. "Deeply revised" means a structural rewrite in the final pass (a `docs/editorial/FINAL-<slug>.md` file exists: 10 guides). "Lightly edited" means Pass G corrections and the consistency passes in the final pass (`docs/editorial/PASSG-<slug>.md`: 29 files, one per guide); all 19 of these guides also had a heavy trim in the earlier editorial pass, which the `b0f371a` column shows. The writers' own word counts in the FINAL and PASSG files use different methods (whole file, rendered), so they differ from the columns here; these columns use one method throughout. "Reader" is the last independent reader score for that guide (section D); "Rubric" is the technical rubric's round-7 overall, which was run on an earlier build (section D explains why that matters).

| Title | URL | Action | Words `dbbbb94` | Words `b0f371a` | Words HEAD | Change vs `dbbbb94` | Sources linked | Reader | Rubric r7 |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|
| Airbnb Pet Damage Charge After Checkout: What to Do | `/guides/airbnb-pet-damage-charge-after-checkout` | Lightly edited | 2,650 | 1,635 | 1,378 | -48% | 15 | 6.9 | 8.5 |
| Can Dogs Go in a Vacation Rental Pool or Hot Tub? | `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub` | Lightly edited | 2,395 | 1,487 | 1,214 | -49% | 17 | 7.1 | 8.8 |
| Can You Leave a Dog Alone in a Vacation Rental? | `/guides/can-you-leave-a-dog-alone-in-a-vacation-rental` | Lightly edited | 2,602 | 2,063 | 1,479 | -43% | 18 | 6.8 | 8.8 |
| Christmas in a Cabin With Your Dog: Book It, Dog-Proof It | `/guides/christmas-week-in-a-cabin-with-a-dog` | Lightly edited | 3,201 | 1,910 | 1,728 | -46% | 18 | 7.3 | 8.3 |
| Cold-Weather Dog Gear for Winter Cabin Trips: Coat or Boots | `/guides/cold-weather-dog-gear-for-winter-cabin-trips` | Lightly edited | 3,025 | 2,102 | 1,930 | -36% | 12 | 7.1 | 8.8 |
| Crash-Tested Dog Harness or Crate: How to Check One | `/guides/dog-car-safety-harness-and-crate-guide` | Lightly edited | 3,477 | 2,519 | 1,897 | -45% | 16 | 7.1 | 8.8 |
| Dog-Friendly Cabin Packing List: What to Bring | `/guides/dog-friendly-cabin-packing-list` | Deeply revised | 3,123 | 2,213 | 1,159 | -63% | 7 | 7.3 | 7.8 |
| Dog Hiking Gear for a Cabin Vacation: What to Bring and What to Skip | `/guides/dog-hiking-gear-for-a-cabin-vacation` | Deeply revised | 2,890 | 1,897 | 1,199 | -59% | 14 | 7.5 | 8.0 |
| Dog Life Jacket for Lakes and Beaches: Size and Fit | `/guides/dog-life-jacket-for-lakes-and-beaches` | Deeply revised | 2,936 | 1,763 | 1,379 | -53% | 16 | 7.2 | 7.8 |
| Dog Ramp for Car or SUV: Ramp or Steps for a Big Dog? | `/guides/dog-ramp-or-steps-for-the-car-and-cabin` | Lightly edited | 3,368 | 2,320 | 1,533 | -54% | 11 | 6.8 | 8.8 |
| Dog Travel Bowls and Food Storage: What to Pack First | `/guides/dog-travel-bowls-and-food-storage` | Deeply revised | 3,101 | 1,905 | 1,178 | -62% | 15 | 7.0 | 8.5 |
| Dog First Aid Kit for Travel: What to Carry to a Cabin | `/guides/dog-travel-first-aid-kit-guide` | Lightly edited | 2,727 | 1,971 | 1,877 | -31% | 8 | 7.0 | 8.8 |
| Dog Friendly Cabins in Georgia State Parks: Rules, Fee and How to Request | `/guides/dogs-in-georgia-state-park-cabins` | Lightly edited | 2,398 | 1,882 | 1,475 | -38% | 17 | 7.0 | 8.8 |
| How Many Dogs Are Allowed at an Airbnb or Vacation Rental? | `/guides/how-many-dogs-can-you-bring-to-a-vacation-rental` | Lightly edited | 2,908 | 1,730 | 1,429 | -51% | 14 | 6.5 | 8.3 |
| How Vacation Rental Pet Fees Work: Per Night, Per Dog or Per Stay | `/guides/how-vacation-rental-pet-fees-work` | Lightly edited | 2,687 | 1,750 | 1,644 | -39% | 7 | 7.3 | 8.8 |
| Dog Got Loose on Vacation: The First Hour and Prevention | `/guides/if-your-dog-gets-loose-on-a-trip` | Deeply revised | 3,476 | 2,463 | 1,567 | -55% | 16 | 7.2 | 8.3 |
| Keep a Dog Cool in the Car, at the Beach and in a Rental | `/guides/keep-a-dog-cool-on-a-summer-trip` | Lightly edited | 3,283 | 1,391 | 1,516 | -54% | 15 | 6.6 | 8.5 |
| New Year's Eve With a Dog in a Cabin: Plan the Night | `/guides/new-years-eve-with-a-dog-in-a-vacation-rental` | Deeply revised | 2,587 | 2,030 | 1,624 | -37% | 20 | 6.7 | 8.3 |
| Pet-Friendly Vacation Rental Checklist: What to Check Before You Book | `/guides/pet-friendly-vacation-rental-checklist` | Lightly edited | 1,843 | 1,597 | 1,566 | -15% | 11 | 7.5 | 8.8 |
| Portable Dog Fence for Rentals: Pens and Playpens When There Is No Yard | `/guides/portable-dog-fence-and-playpen-guide-for-rentals` | Deeply revised | 2,937 | 2,129 | 1,418 | -52% | 7 | 7.3 | 8.0 |
| Dog Car Seat Cover, Hammock or Cargo Liner: Protect Your Car on a Road Trip | `/guides/protect-your-car-interior-from-a-dog-on-a-road-trip` | Deeply revised | 2,763 | 1,830 | 1,014 | -63% | 13 | 7.4 | 8.0 |
| Taking a Puppy to a Vacation Rental: Age Rules, Accidents and Fees | `/guides/puppy-at-a-vacation-rental` | Lightly edited | 2,816 | 2,278 | 1,838 | -35% | 14 | 7.3 | 8.5 |
| Two Large Dogs in a Car: Crates, Harnesses and Barriers | `/guides/two-large-dogs-in-one-car` | Deeply revised | 3,077 | 2,009 | 1,623 | -47% | 16 | 7.1 | 8.3 |
| How to Find a Vacation Rental With a Truly Secure Fenced Yard | `/guides/vacation-rental-secure-fenced-yard` | Lightly edited | 2,890 | 2,409 | 2,027 | -30% | 11 | 7.0 | 8.5 |
| Traveling With a Reactive Dog: Choose the Right Rental | `/guides/vacation-rental-with-a-reactive-dog` | Lightly edited | 2,814 | 2,185 | 2,027 | -28% | 15 | 7.1 | 8.5 |
| Vacation Rental With a Senior Dog: What to Check Before You Book | `/guides/vacation-rental-with-a-senior-dog` | Lightly edited | 2,508 | 1,967 | 1,668 | -33% | 26 | 7.5 | 8.3 |
| Large Dog Friendly Rentals and No Weight Limit Options | `/guides/vacation-rentals-that-welcome-large-dogs` | Lightly edited | 2,207 | 2,331 | 2,016 | -9% | 18 | 7.2 | 8.5 |
| Vacation Rentals With No Pet Fee: The 3 Managers We Found | `/guides/vacation-rentals-with-no-pet-fee` | Lightly edited | 2,695 | 1,685 | 1,547 | -43% | 19 | 7.4 | 9.0 |
| How Much a Dog Really Costs on a Vacation Rental | `/guides/what-a-dog-really-costs-on-a-vacation-rental` | Deeply revised | 2,517 | 1,560 | 1,107 | -56% | 14 | 7.3 | 8.5 |
| **Total (29 guides)** | | | **81,901** | **57,011** | **45,057** | **-45%** | **420** | mean 7.1 | mean 8.5 |

Citation check, all 29: 420 frontmatter source URLs, and **420 of 420 are linked inside the article text** (before the collapsed Sources list) on the HEAD build; 0 missing. The Sources list count equals the frontmatter on 29 of 29 (QA crawl). No numbered markers remain (`sup.cite` count 0 in the crawl). The two crawl failures for doubled publishers and four for parentheticals inside quotation marks were fixed afterwards (`docs/buyer/CRAWL_FIXES_2026-11-24.md`, `docs/editorial/CROSS-GUIDE-FIXES.md`); the whole crawl was not re-run after those fixes, but the 95-URL check in section D was.

### Airbnb Pet Damage Charge After Checkout: What to Do
- URL: `/guides/airbnb-pet-damage-charge-after-checkout`. Source: `content/guides/airbnb-pet-damage-charge-after-checkout.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-airbnb-pet-damage-charge-after-checkout.md`).
- Reader benefit: The three clocks (24 hours to respond, 14 days for the host to file, 60 days to appeal) are in the first paragraph, and the reply scripts are copy-ready.
- Body words: 2,650 at `dbbbb94`, 1,635 at `b0f371a`, 1,378 at HEAD.
- Major changes: Earlier pass cut the three endings and the gear section. Pass G: clocks now stated in the lede, Do this first and one table only; the open-points table, the 'Confirmed by pages we cite' sentence and the 'not legal advice' line removed; Hometime correction cut to one sentence; closing table turned into a list.
- Product placement: Doormat stays only in the dog-hair and cleanup section, with the line that it does not change how a claim is decided; no product inside the reply steps.
- Citations: all 15 frontmatter source URLs are linked in the article text before the Sources list on the built page (15 of 15; checked at HEAD, section D).
- Final status: published; reader review 6.9; technical rubric (round 7) 8.5.

### Can Dogs Go in a Vacation Rental Pool or Hot Tub?
- URL: `/guides/can-dogs-go-in-a-rental-pool-or-hot-tub`. Source: `content/guides/can-dogs-go-in-a-rental-pool-or-hot-tub.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-can-dogs-go-in-a-rental-pool-or-hot-tub.md`).
- Reader benefit: The finding comes first (six of the seven managers that wrote a pool or hot tub rule bar dogs outright, one blog is mixed) and the reader knows what to ask when a listing is silent.
- Body words: 2,395 at `dbbbb94`, 1,487 at `b0f371a`, 1,214 at HEAD.
- Major changes: Dek, SEO description, FAQ and lede corrected to 'six of seven bar dogs outright, Twiddy blog mixed'; the quote table became a linked list so the duplicate Sources line is gone and every source stays linked; the Adventure wipes sentence no longer reads as a pool rinse; CDC, VCA and Cornell material trimmed to what bears on the pool question.
- Product placement: Towel and mat picks removed earlier. Adventure Dog Wipes kept as a prose mention and related product (no other guide carries it, and a test needs one earning product).
- Citations: all 17 frontmatter source URLs are linked in the article text before the Sources list on the built page (17 of 17; checked at HEAD, section D).
- Final status: published; reader review 7.1; technical rubric (round 7) 8.8.

### Can You Leave a Dog Alone in a Vacation Rental?
- URL: `/guides/can-you-leave-a-dog-alone-in-a-vacation-rental`. Source: `content/guides/can-you-leave-a-dog-alone-in-a-vacation-rental.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-can-you-leave-a-dog-alone-in-a-vacation-rental.md`).
- Reader benefit: 'How long is too long' now comes before 'Is it allowed', so the reader hears about the dog before the rule.
- Body words: 2,602 at `dbbbb94`, 2,063 at `b0f371a`, 1,479 at HEAD.
- Major changes: Parked-car heat and cold bullets cut to one sentence linking the hot-weather guide (both ASPCA links kept); camera section tightened to the practical rule; 'silence is not permission' said once.
- Product placement: KONG card, inline text, relatedProducts entry and source removed; the North States gate card stays (ASPCA alternative, honest limits); iCrate is linked through its card only.
- Citations: all 18 frontmatter source URLs are linked in the article text before the Sources list on the built page (18 of 18; checked at HEAD, section D).
- Final status: published; reader review 6.8; technical rubric (round 7) 8.8.

### Christmas in a Cabin With Your Dog: Book It, Dog-Proof It
- URL: `/guides/christmas-week-in-a-cabin-with-a-dog`. Source: `content/guides/christmas-week-in-a-cabin-with-a-dog.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-christmas-week-in-a-cabin-with-a-dog.md`).
- Reader benefit: Book it, dog-proof it: the short answer points to one hazards list instead of repeating tree water, tinsel and chocolate three times.
- Body words: 3,201 at `dbbbb94`, 1,910 at `b0f371a`, 1,728 at HEAD.
- Major changes: Short answer no longer repeats the hazards; the tree plan refers to the hazards list; product paragraphs keep the reason while specs moved to the cards; a dangling 'below' bridge and an orphan size-chart line fixed; 'How sure we are' cut to the unconfirmed items that are unique.
- Product placement: Four cards kept; card 'why' lines shortened; the boots card stays although the page itself sends coats elsewhere (judged taste).
- Citations: all 18 frontmatter source URLs are linked in the article text before the Sources list on the built page (18 of 18; checked at HEAD, section D).
- Final status: published; reader review 7.3; technical rubric (round 7) 8.3.

### Cold-Weather Dog Gear for Winter Cabin Trips: Coat or Boots
- URL: `/guides/cold-weather-dog-gear-for-winter-cabin-trips`. Source: `content/guides/cold-weather-dog-gear-for-winter-cabin-trips.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-cold-weather-dog-gear-for-winter-cabin-trips.md`).
- Reader benefit: A coat-or-boots decision with the limits stated once: no source gives a temperature cut-off, and fleece is not a shell.
- Body words: 3,025 at `dbbbb94`, 2,102 at `b0f371a`, 1,930 at HEAD.
- Major changes: Two-row table replaced by two bullets with per-claim citations; the car paragraph was re-attributed after reading the pages (ASPCA: never leave a dog in a car in the cold; Cornell: a car gets cold like a refrigerator; an NBC Select vet: not with the heat off); the 'Before you go' link run-on split.
- Product placement: Towel card tied to wet fur after snow in one sentence and relabelled; four cards kept.
- Citations: all 12 frontmatter source URLs are linked in the article text before the Sources list on the built page (12 of 12; checked at HEAD, section D).
- Final status: published; reader review 7.1; technical rubric (round 7) 8.8.

### Crash-Tested Dog Harness or Crate: How to Check One
- URL: `/guides/dog-car-safety-harness-and-crate-guide`. Source: `src/content/guides/dog-car-safety-harness-and-crate-guide.ts`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-dog-car-safety-harness-and-crate-guide.md`).
- Reader benefit: A buyer can check a harness's crash-test claim in the Center for Pet Safety directory in four steps and match a crate size to the dog, with no harness endorsement the site cannot support.
- Body words: 3,477 at `dbbbb94`, 2,519 at `b0f371a`, 1,897 at HEAD.
- Major changes: Sleepypod Clickit Sport removed everywhere (quick pick, section, card, gear entry, related products, CPS source) and replaced by a 'How to check a harness' section plus one plain statement that we recommend no specific harness; Lucky Kennel Large is now the 70 to 110 lb crate card with the Intermediate for under 70 lb; Atom carrier limitation stated in the quick picks, the small-dog text and the card; doubled CPS citation fixed; 'Why restraint matters' cut to two sentences; an uncited hammock sentence removed.
- Product placement: Clickit Sport retired (the Amazon listing is the 2020 model, the maker sells the Sport Plus, and the weight ratings conflict); no replacement harness added (see section E). Heather booster card kept as a small-dog option and labelled as a seat.
- Citations: all 16 frontmatter source URLs are linked in the article text before the Sources list on the built page (16 of 16; checked at HEAD, section D).
- Final status: published; reader review 7.1; technical rubric (round 7) 8.8.

### Dog-Friendly Cabin Packing List: What to Bring
- URL: `/guides/dog-friendly-cabin-packing-list`. Source: `src/content/guides/dog-friendly-cabin-packing-list.ts`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-dog-friendly-cabin-packing-list.md`).
- Reader benefit: A weekend list a reader can tick on a phone from the essentials block alone, then add only the lines the cabin, drive and season call for.
- Body words: 3,123 at `dbbbb94`, 2,213 at `b0f371a`, 1,159 at HEAD.
- Major changes: Structural rewrite from a four-product catch-all: two-sentence intro, a tickable essential checklist in four groups, what changes by cabin, drive, sleep and cleanup, seasonal extras, what can stay home, a link to the packing-list tool and a six-line departure check. Pass G: the tool link now sits beside the essentials, the bear-proof answer appears once, the drive section lists only items not already ticked, and the FAQ went from six entries to one.
- Product placement: One pick kept: the Soggy Doggy towel, after the cleanup paragraph that says an old towel works. The food bin, bed and light picks were dropped and their sources removed (no claim depended on them).
- Citations: all 7 frontmatter source URLs are linked in the article text before the Sources list on the built page (7 of 7; checked at HEAD, section D).
- Final status: published; reader review 7.3; technical rubric (round 7) 7.8.

### Dog Hiking Gear for a Cabin Vacation: What to Bring and What to Skip
- URL: `/guides/dog-hiking-gear-for-a-cabin-vacation`. Source: `content/guides/dog-hiking-gear-for-a-cabin-vacation.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-dog-hiking-gear-for-a-cabin-vacation.md`); also `docs/editorial/FINALFIX-*.md`.
- Reader benefit: A casual hiker sees that leash, water, a bowl and waste bags cover most walks, and that the harness, boots and light are tied to a named condition.
- Body words: 2,890 at `dbbbb94`, 1,897 at `b0f371a`, 1,199 at HEAD.
- Major changes: Structural rewrite into tiers (basics, only for specific conditions, optional). Pass G: the six-foot leash rule stated once, 'X says / Y says' chains cut to one source per fact, 'Which gear for which problem' replaced the comparison section. FINALFIX after the second independent review: the dek is one promise and the four basics appear once.
- Product placement: Cards cut from five to three (bowl, harness, boots); the leash and the Beacon light became linked prose mentions; the Quencher card is worded as 'one packable bowl option' because the page says any collapsible bowl works. One honest all-Ruffwear note kept.
- Citations: all 14 frontmatter source URLs are linked in the article text before the Sources list on the built page (14 of 14; checked at HEAD, section D).
- Final status: published; reader review round 1 6.5, round 2 7.5; technical rubric (round 7) 8.0.

### Dog Life Jacket for Lakes and Beaches: Size and Fit
- URL: `/guides/dog-life-jacket-for-lakes-and-beaches`. Source: `content/guides/dog-life-jacket-for-lakes-and-beaches.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-dog-life-jacket-for-lakes-and-beaches.md`).
- Reader benefit: The reader learns which measurements matter (chest girth first, weight ranges second) and which claims are the maker's versus independent before following a link.
- Body words: 2,936 at `dbbbb94`, 1,763 at `b0f371a`, 1,379 at HEAD.
- Major changes: Structural rewrite: when to consider, fit and sizing, water and environment, one comparison table, fit check and limits, what it does not replace, checklist. Pass G: the 'Maker says / Independent / Our read' explainer deleted; the size column is one clear line per jacket; two sizing FAQs and a beach FAQ removed as duplicates; hedges on boating pages removed.
- Product placement: Three cards kept. Catalog chip text for two jackets still repeats table figures (catalog not edited by the writers; listed as a known nit).
- Citations: all 16 frontmatter source URLs are linked in the article text before the Sources list on the built page (16 of 16; checked at HEAD, section D).
- Final status: published; reader review 7.2; technical rubric (round 7) 7.8.

### Dog Ramp for Car or SUV: Ramp or Steps for a Big Dog?
- URL: `/guides/dog-ramp-or-steps-for-the-car-and-cabin`. Source: `content/guides/dog-ramp-or-steps-for-the-car-and-cabin.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-dog-ramp-or-steps-for-the-car-and-cabin.md`).
- Reader benefit: A reader can measure the cargo floor and see which ramp reaches it before comparing specs.
- Body words: 3,368 at `dbbbb94`, 2,320 at `b0f371a`, 1,533 at HEAD.
- Major changes: Pass G: spec restatements cut from the at-a-glance box, card text and prose (specs live in the table and chips); 'Before you buy' and 'What we could not confirm' removed as duplicates; the reach-by-floor-height figures (19, 22, 27 in at about 18 degrees; 21, 24, 30 in at 20 degrees) moved into a 'Which ramp fits your car?' list near the top and labelled as our arithmetic, not a maker claim.
- Product placement: Five PetSafe products kept as five cards, each with its own reason; single-brand coverage is stated (taste item, rejected as a change).
- Citations: all 11 frontmatter source URLs are linked in the article text before the Sources list on the built page (11 of 11; checked at HEAD, section D).
- Final status: published; reader review 6.8; technical rubric (round 7) 8.8.

### Dog Travel Bowls and Food Storage: What to Pack First
- URL: `/guides/dog-travel-bowls-and-food-storage`. Source: `content/guides/dog-travel-bowls-and-food-storage.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-dog-travel-bowls-and-food-storage.md`).
- Reader benefit: A food-and-water setup chosen in two or three minutes; the bear-country caveat appears once, in the food section.
- Body words: 3,101 at `dbbbb94`, 1,905 at `b0f371a`, 1,178 at HEAD.
- Major changes: Structural rewrite from twelve sections and nine products to seven sections and an answer-first lede. Pass G: Kibble Carrier and IRIS container have inline cards where discussed; the comparison table and a sizing FAQ were removed; the Ruffwear 'waterproof lining' wording corrected to 'lining labelled Food Contact Safe'; the doubled Springland publisher parenthetical fixed in the crawl fixes.
- Product placement: Five cards, each beside the paragraph that explains it; the trailing 'Gear for this trip' block no longer repeats them.
- Citations: all 15 frontmatter source URLs are linked in the article text before the Sources list on the built page (15 of 15; checked at HEAD, section D).
- Final status: published; reader review 7.0; technical rubric (round 7) 8.5.

### Dog First Aid Kit for Travel: What to Carry to a Cabin
- URL: `/guides/dog-travel-first-aid-kit-guide`. Source: `src/content/guides/dog-travel-first-aid-kit-guide.ts`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-dog-travel-first-aid-kit-guide.md`); also `docs/editorial/FINALFIX-*.md`.
- Reader benefit: A packing answer a reader can act on (what to carry, what to leave out, when to call a vet), with poison-control numbers and no doses.
- Body words: 2,727 at `dbbbb94`, 1,971 at `b0f371a`, 1,877 at HEAD.
- Major changes: Pass G: the ready-made kit section rewritten so text and cards agree; a 7-item checklist became one sentence of judging criteria; the duplicate poison FAQ merged. FINALFIX after the second review: heat advice now says call a vet and follow the heat guide (the towel and no-tub instructions were removed so the two guides cannot disagree); one muzzle warning (never muzzle a dog that is vomiting, overheating or struggling to breathe); the hydrogen-peroxide contradiction removed.
- Product placement: FDK thermometer (unfamiliar brand stated) and Baskerville muzzle (sized by snout, no breed mapping) added with cards; the ARCA PET 100-piece kit worded 'the listing states' because no maker page was found.  The page still carries no doses.
- Citations: all 8 frontmatter source URLs are linked in the article text before the Sources list on the built page (8 of 8; checked at HEAD, section D).
- Final status: published; reader review round 1 7.0, round 2 7.0; technical rubric (round 7) 8.8.

### Dog Friendly Cabins in Georgia State Parks: Rules, Fee and How to Request
- URL: `/guides/dogs-in-georgia-state-park-cabins`. Source: `content/guides/dogs-in-georgia-state-park-cabins.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-dogs-in-georgia-state-park-cabins.md`).
- Reader benefit: The $50 timing, the pet rules and the request message sit in one table and one script instead of three places.
- Body words: 2,398 at `dbbbb94`, 1,882 at `b0f371a`, 1,475 at HEAD.
- Major changes: The $50 timing now appears only in the table (with the Animal of Things note) and the message; 'What to ask the park' merged into the message; repeated Georgia State Parks citations cut to one per paragraph; link dump cut to two internal links; leash and water card hedges shortened.
- Product placement: Three water and leash cards kept, each tied to a stated need. Catalog chip text ('Named 22oz bottle') flagged to the owner, not changed.
- Citations: all 17 frontmatter source URLs are linked in the article text before the Sources list on the built page (17 of 17; checked at HEAD, section D).
- Final status: published; reader review 7.0; technical rubric (round 7) 8.8.

### How Many Dogs Are Allowed at an Airbnb or Vacation Rental?
- URL: `/guides/how-many-dogs-can-you-bring-to-a-vacation-rental`. Source: `content/guides/how-many-dogs-can-you-bring-to-a-vacation-rental.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-how-many-dogs-can-you-bring-to-a-vacation-rental.md`).
- Reader benefit: The usual cap, the Airbnb host cap range and a message to send when you have three dogs, with a sample caveat stated once.
- Body words: 2,908 at `dbbbb94`, 1,730 at `b0f371a`, 1,429 at HEAD.
- Major changes: Earlier pass: the manager table cut from ten rows to five, gear pick blocks removed, sibling guide link dropped. Pass G: table sources line names Twiddy, Brindley Beach and Cabin Rentals of Georgia by row; a Vrbo regional-site claim ('23 kg per pet', 'limit 2 total') removed from body, FAQ and frontmatter because the US page returned 429 and the claim could not be verified; the extra-cost section cut to two sentences plus a fees-guide link.
- Product placement: Gate and crate remain as related products only because a test requires one earning product on every published guide; both stay as end-of-page related products.
- Citations: all 14 frontmatter source URLs are linked in the article text before the Sources list on the built page (14 of 14; checked at HEAD, section D).
- Final status: published; reader review 6.5; technical rubric (round 7) 8.3.

### How Vacation Rental Pet Fees Work: Per Night, Per Dog or Per Stay
- URL: `/guides/how-vacation-rental-pet-fees-work`. Source: `content/guides/how-vacation-rental-pet-fees-work.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-how-vacation-rental-pet-fees-work.md`); also `docs/editorial/FINALFIX-*.md`.
- Reader benefit: A labelled worked example right after the opening answers 'which cabin costs less' (Cabin A $850 versus Cabin B $805 for four nights; at two nights A wins $450 to $465).
- Body words: 2,687 at `dbbbb94`, 1,750 at `b0f371a`, 1,644 at HEAD.
- Major changes: Earlier pass: deposits table 6 to 4 rows, break-even example. Pass G: the worked example added; two Vrbo CTAs merged to one; the gear section moved before 'Questions to send' as 'Protect your deposit'. FINALFIX: manager counts recounted from the dataset (38 = 22 state a charge + 3 at $0 + 13 name no amount; nightly $20 to $50, one-time $55 to $300) and the break-even wording corrected to '$80 in total at four nights'.
- Product placement: Two cards (doormat, towel) under 'Protect your deposit'; the pads card dropped as loosely tied.
- Citations: all 7 frontmatter source URLs are linked in the article text before the Sources list on the built page (7 of 7; checked at HEAD, section D).
- Final status: published; reader review round 1 6.7, round 2 7.3; technical rubric (round 7) 8.8.

### Dog Got Loose on Vacation: The First Hour and Prevention
- URL: `/guides/if-your-dog-gets-loose-on-a-trip`. Source: `content/guides/if-your-dog-gets-loose-on-a-trip.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-if-your-dog-gets-loose-on-a-trip.md`); also `docs/editorial/FINALFIX-*.md`.
- Reader benefit: A panicked owner gets four one-action steps first, a tap-to-call AKC Reunite helpline and who to contact, then prevention.
- Body words: 3,476 at `dbbbb94`, 2,463 at `b0f371a`, 1,567 at HEAD.
- Major changes: Structural rewrite into an emergency-action page with a numbered 'Do this first' list. Pass G: the dek stopped repeating the actions; two FAQs merged and one dropped; meta-talk removed. FINALFIX: the list split into four single actions, the AKC Reunite 24/7 helpline number (800-252-7894) confirmed on the cited page and linked as a tap-to-call once.
- Product placement: No cards before 'Who to contact' or in the first-hours text; the WhoseID card moved to a 'For the next trip' lead-in before the tracker section; tracker and light cards keep their honest caveats.
- Citations: all 16 frontmatter source URLs are linked in the article text before the Sources list on the built page (16 of 16; checked at HEAD, section D).
- Final status: published; reader review round 1 7.1, round 2 7.2; technical rubric (round 7) 8.3.

### Keep a Dog Cool in the Car, at the Beach and in a Rental
- URL: `/guides/keep-a-dog-cool-on-a-summer-trip`. Source: `content/guides/keep-a-dog-cool-on-a-summer-trip.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-keep-a-dog-cool-on-a-summer-trip.md`); also `docs/editorial/FINALFIX-*.md`.
- Reader benefit: The steps for a dog that is overheating now are the first thing on the page, above the habits lede.
- Body words: 3,283 at `dbbbb94`, 1,391 at `b0f371a`, 1,516 at HEAD.
- Major changes: Earlier pass cut the length by more than half. Pass G: the numbered block moved first, the confusing 104/105 sentence replaced by plain sourced numbers (AKC above 104 F, Cornell 105 F), state-law bullets condensed. FINALFIX after a NEEDS WORK review: `layout: emergency`, five short steps (heat out, call a vet, cool (not cold) water, no ice baths, vet check even if better); at 390x844 the steps start at y=592.
- Product placement: Bowl and bottle cards kept with stated reasons; no card sits inside the emergency steps. The body grew about 125 words since the earlier pass because the emergency steps were added.
- Citations: all 15 frontmatter source URLs are linked in the article text before the Sources list on the built page (15 of 15; checked at HEAD, section D).
- Final status: published; reader review round 1 6.7, round 2 6.6; technical rubric (round 7) 8.5.

### New Year's Eve With a Dog in a Cabin: Plan the Night
- URL: `/guides/new-years-eve-with-a-dog-in-a-vacation-rental`. Source: `content/guides/new-years-eve-with-a-dog-in-a-vacation-rental.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-new-years-eve-with-a-dog-in-a-vacation-rental.md`).
- Reader benefit: Decide whether the trip is realistic, know what 'firework-free' may not cover, and follow a set-up and evening plan before reading the escape stories.
- Body words: 2,587 at `dbbbb94`, 2,030 at `b0f371a`, 1,624 at HEAD.
- Major changes: Structural rewrite: decision, host questions, quieter setup, rental set-up, evening plan, if distressed, next-morning checklist, then 'Why the doors come first' as short evidence. An unsupported Cabin Rentals of Georgia 'firecrackers' sentence (it was cited to another manager's page) removed. Pass G: the escape stories cut to two New Year's Eve cases and two frontmatter sources dropped because no claim relied on them; the FAQ cut to the medication question the body only partly answers.
- Product placement: The Beacon light card moved out of the evening timeline into 'If your dog bolts'; the Kurgo bed became a conditional ('your own bed first'). No medication detail and no calming guarantees.
- Citations: all 20 frontmatter source URLs are linked in the article text before the Sources list on the built page (20 of 20; checked at HEAD, section D).
- Final status: published; reader review 6.7; technical rubric (round 7) 8.3.

### Pet-Friendly Vacation Rental Checklist: What to Check Before You Book
- URL: `/guides/pet-friendly-vacation-rental-checklist`. Source: `src/content/guides/pet-friendly-vacation-rental-checklist.ts`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-pet-friendly-vacation-rental-checklist.md`).
- Reader benefit: A book-or-skip checklist with a short list of sibling guides rather than thirteen links.
- Body words: 1,843 at `dbbbb94`, 1,597 at `b0f371a`, 1,566 at HEAD.
- Major changes: Pass G: sibling links cut from thirteen to six, including a link to the redirected no-weight-limit URL; duplicate 'crate provided' and 'convenience sample' lines removed; FAQ trimmed to questions the body does not answer; an iCrate fold contradiction fixed. Section order kept (judged taste).
- Product placement: iCrate card blurb no longer restates the paragraph.
- Citations: all 11 frontmatter source URLs are linked in the article text before the Sources list on the built page (11 of 11; checked at HEAD, section D).
- Final status: published; reader review 7.5; technical rubric (round 7) 8.8.

### Portable Dog Fence for Rentals: Pens and Playpens When There Is No Yard
- URL: `/guides/portable-dog-fence-and-playpen-guide-for-rentals`. Source: `src/content/guides/portable-dog-fence-and-playpen-guide-for-rentals.ts`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-portable-dog-fence-and-playpen-guide-for-rentals.md`).
- Reader benefit: The reader knows whether a temporary pen suits their dog and the host before shopping.
- Body words: 2,937 at `dbbbb94`, 2,129 at `b0f371a`, 1,418 at HEAD.
- Major changes: Structural rewrite: host permission, what a pen can do, where it helps, where it may not, how to choose, products and limits, setup and cleanup. The pen-versus-fenced-yard distinction is stated once with a link to the fenced-yard guide. Pass G: 'calm dog, supervised' stated once; defensive spec disclaimers merged; Petmate states plainly that it gives no height.
- Product placement: Four cards (MidWest, Petmate, Carlson, North States) each right after its paragraph and after the choosing reasons; crate is a sourced text mention.
- Citations: all 7 frontmatter source URLs are linked in the article text before the Sources list on the built page (7 of 7; checked at HEAD, section D).
- Final status: published; reader review 7.3; technical rubric (round 7) 8.0.

### Dog Car Seat Cover, Hammock or Cargo Liner: Protect Your Car on a Road Trip
- URL: `/guides/protect-your-car-interior-from-a-dog-on-a-road-trip`. Source: `content/guides/protect-your-car-interior-from-a-dog-on-a-road-trip.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-protect-your-car-interior-from-a-dog-on-a-road-trip.md`).
- Reader benefit: Find where the dog rides in the car and see which cover type fits, in seconds.
- Body words: 2,763 at `dbbbb94`, 1,830 at `b0f371a`, 1,014 at HEAD.
- Major changes: Structural rewrite organised by where the dog rides; safety overlap cut to one link to the car-safety guide. Pass G: the bench/hammock/cargo split told once; 'cargo liner' used throughout (title and description too); one sentence for an SUV with folded seats (no invented product); the hammock switched to the standard 55 x 56 in Kurgo Rover (maker page https://kurgo.com/car-seat-covers/rover-hammock), with the 63 in Extended model only as the wider-vehicle variant.
- Product placement: Heather booster card, its source and its related-products entry removed; five cards kept.
- Citations: all 13 frontmatter source URLs are linked in the article text before the Sources list on the built page (13 of 13; checked at HEAD, section D).
- Final status: published; reader review 7.4; technical rubric (round 7) 8.0.

### Taking a Puppy to a Vacation Rental: Age Rules, Accidents and Fees
- URL: `/guides/puppy-at-a-vacation-rental`. Source: `content/guides/puppy-at-a-vacation-rental.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-puppy-at-a-vacation-rental.md`).
- Reader benefit: The age rules, who pays for accidents and what to ask in writing are in one host message, with $35 (Tahoe) and $150 (Blue Ridge) quotes each beside its own source.
- Body words: 2,816 at `dbbbb94`, 2,278 at `b0f371a`, 1,838 at HEAD.
- Major changes: Pass G: 'ask in writing' kept in the short answer and the host message only; repeats removed from the count-as-a-pet section and message tail; 'What to buy first' deleted; vague 'some reviewers report' asides removed; heading changed to 'Accidents and who pays for them'. Crawl fix: a lone H2 above the first paragraph removed so the opening paragraph reaches the first screen.
- Product placement: Pads: the 24 x 36 Pawtect record was wired later, so the smallest-size caveat was removed; four cards.
- Citations: all 14 frontmatter source URLs are linked in the article text before the Sources list on the built page (14 of 14; checked at HEAD, section D).
- Final status: published; reader review 7.3; technical rubric (round 7) 8.5.

### Two Large Dogs in a Car: Crates, Harnesses and Barriers
- URL: `/guides/two-large-dogs-in-one-car`. Source: `content/guides/two-large-dogs-in-one-car.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-two-large-dogs-in-one-car.md`); also `docs/editorial/FINALFIX-*.md`.
- Reader benefit: Someone with an SUV and two large dogs can name what to measure (cargo floor width, wheel-well width, hatch height, rear belts, girth, anchors) and pick a layout by weight.
- Body words: 3,077 at `dbbbb94`, 2,009 at `b0f371a`, 1,623 at HEAD.
- Major changes: Structural rewrite around a layout decision (under 75 lb each: a harness per dog or two crates; 75 lb or more: a strapped crate). Pass G: the Sleepypod harness section, card and source removed; the 90 lb harness claim replaced by the 75 lb tested range; 'Nobody has tested' became 'We found no independent test'. FINALFIX after the second review: the off-topic iCrate card removed (a linked prose mention in 'Once you arrive'), the Intermediate card relabelled 'Lucky Kennel Intermediate (under 70 lb)', repeated cautions cut.
- Product placement: Cards: Lucky Kennel Large and Intermediate, rabbitgoo SUV barrier (listing does not mention two dogs; measure first), JOEJOY pad kept for the rental only, and barrier cards.
- Citations: all 16 frontmatter source URLs are linked in the article text before the Sources list on the built page (16 of 16; checked at HEAD, section D).
- Final status: published; reader review round 1 7.1, round 2 7.1; technical rubric (round 7) 8.3.

### How to Find a Vacation Rental With a Truly Secure Fenced Yard
- URL: `/guides/vacation-rental-secure-fenced-yard`. Source: `src/content/guides/vacation-rental-secure-fenced-yard.ts`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-vacation-rental-secure-fenced-yard.md`).
- Reader benefit: How to prove a yard is secure before booking (an evidence pack, what to ask, what to measure) without a product pitch on top.
- Body words: 2,890 at `dbbbb94`, 2,409 at `b0f371a`, 2,027 at HEAD.
- Major changes: Pass G: pool separation now only in 'Pool yards'; shared access kept in the gate and Shared yards sections; the tape-measure ask once; the closing 'no source can tell you' line and 'Pick by your dog' recap deleted; the dog-pattern table became a list.
- Product placement: Knot-a-Leash card dropped (kept as a linked prose mention for a calm dog on a lead); remaining card reasons shortened.
- Citations: all 11 frontmatter source URLs are linked in the article text before the Sources list on the built page (11 of 11; checked at HEAD, section D).
- Final status: published; reader review 7.0; technical rubric (round 7) 8.5.

### Traveling With a Reactive Dog: Choose the Right Rental
- URL: `/guides/vacation-rental-with-a-reactive-dog`. Source: `content/guides/vacation-rental-with-a-reactive-dog.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-vacation-rental-with-a-reactive-dog.md`).
- Reader benefit: A reactive-dog owner learns which listing features to ask about first and where the vet fits, without the advice repeated in four places.
- Body words: 2,814 at `dbbbb94`, 2,185 at `b0f371a`, 2,027 at HEAD.
- Major changes: Pass G: vet advice stated once (the short answer points to the vet section); four FAQs dropped, two unique ones kept; defensive closing paragraph and 'In our view' hedges removed; a Fear Free microchip tangent removed. Gear rebuilt around the rabbitgoo frosted window film (blocks views, not sound; ask the host first; the listing states) and a 36 in crate cover.
- Product placement: Crate cover wired from the Cowork-verified Amazon find; the gate and KONG reduced to a linked prose sentence and their sources dropped from the frontmatter.
- Citations: all 15 frontmatter source URLs are linked in the article text before the Sources list on the built page (15 of 15; checked at HEAD, section D).
- Final status: published; reader review 7.1; technical rubric (round 7) 8.5.

### Vacation Rental With a Senior Dog: What to Check Before You Book
- URL: `/guides/vacation-rental-with-a-senior-dog`. Source: `content/guides/vacation-rental-with-a-senior-dog.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-vacation-rental-with-a-senior-dog.md`).
- Reader benefit: A photo-request checklist and a Do-this-first block for older dogs, with the six manager rules in three plain sentences.
- Body words: 2,508 at `dbbbb94`, 1,967 at `b0f371a`, 1,668 at HEAD.
- Major changes: Pass G: 'How sure we are' folded into one line; vet advice reduced to Do-this-first and one dedicated section; the manager-rules list condensed to three rules in prose (all six manager links kept); FAQ cut from six to three unique questions; duplicate Banfield parentheticals removed.
- Product placement: Cards trimmed so reasons live in prose; the Kurgo bed text now differs from the Gear hub, which uses the waterproof cover.
- Citations: all 26 frontmatter source URLs are linked in the article text before the Sources list on the built page (26 of 26; checked at HEAD, section D).
- Final status: published; reader review 7.5; technical rubric (round 7) 8.3.

### Large Dog Friendly Rentals and No Weight Limit Options
- URL: `/guides/vacation-rentals-that-welcome-large-dogs`. Source: `src/content/guides/vacation-rentals-that-welcome-large-dogs.ts`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-vacation-rentals-that-welcome-large-dogs.md`).
- Reader benefit: The old large-dog and no-weight-limit guides are one page that says plainly it is not a rental list and shows how weight limits are written and how to get a big dog approved.
- Body words: 2,207 at `dbbbb94`, 2,331 at `b0f371a`, 2,016 at HEAD.
- Major changes: Merged earlier (the no-weight-limit guide, 2,416 words, now 301-redirects here; the combined body is 2,016 words). Pass G: dek and opening say the page is not a list; the FAQ cut from ten to two unique answers (the raw-markdown pet-fee link answer removed); citations moved outside quotation marks and same-publisher doubles split; dataset hedging shortened.
- Product placement: Kurgo bed replaced by the Ameritex waterproof bed cover as the 'protect the furniture' answer (listing states waterproof, reversible, washable; no dog weight range, said so); Kurgo source dropped.
- Citations: all 18 frontmatter source URLs are linked in the article text before the Sources list on the built page (18 of 18; checked at HEAD, section D).
- Final status: published; reader review 7.2; technical rubric (round 7) 8.5.

### Vacation Rentals With No Pet Fee: The 3 Managers We Found
- URL: `/guides/vacation-rentals-with-no-pet-fee`. Source: `content/guides/vacation-rentals-with-no-pet-fee.md`.
- Action: lightly edited in the final pass (Pass G corrections, see `docs/editorial/PASSG-vacation-rentals-with-no-pet-fee.md`).
- Reader benefit: The three managers that state no pet fee, side by side with what each page does and does not say, and a clear route to confirm a $0 quote.
- Body words: 2,695 at `dbbbb94`, 1,685 at `b0f371a`, 1,547 at HEAD.
- Major changes: Pass G: a three-column table (manager, what the page says, what it does not say) added with a Sources line; repeated '(Hapey Cabin Rentals)' cut from six to three with no more than one link per paragraph; trimmed duplicate sentences and the extra 'Next step' block.
- Product placement: The doormat card stays as the single earning product and now ties to fee-free stays (cleaning expectations unchanged; a messy return invites charges).
- Citations: all 19 frontmatter source URLs are linked in the article text before the Sources list on the built page (19 of 19; checked at HEAD, section D).
- Final status: published; reader review 7.4; technical rubric (round 7) 9.0.

### How Much a Dog Really Costs on a Vacation Rental
- URL: `/guides/what-a-dog-really-costs-on-a-vacation-rental`. Source: `content/guides/what-a-dog-really-costs-on-a-vacation-rental.md`.
- Action: deeply revised (structural rewrite in the final pass; see `docs/editorial/FINAL-what-a-dog-really-costs-on-a-vacation-rental.md`).
- Reader benefit: Within a screen and a half the reader sees a two-rental cost table and how 'real cost' (money you will not get back) differs from 'cash needed up front'.
- Body words: 2,517 at `dbbbb94`, 1,560 at `b0f371a`, 1,107 at HEAD.
- Major changes: Structural rewrite around a worked comparison. Pass G corrected a wrong figure ('$250 more cash on booking day' became $200: $1,500 versus $1,300, because the $250 is a refundable deposit) and split the Cabin Rentals of Georgia example into $250 fee + $75 cleaning = $325 non-refundable, with the $250 deposit separate ($575 leaves the card, $325 is gone for good). Definitions of 'Real cost' and 'Cash needed up front' added under the table.
- Product placement: Doormat is the one earning product, in the cleanup context. Hero image unchanged (see section E).
- Citations: all 14 frontmatter source URLs are linked in the article text before the Sources list on the built page (14 of 14; checked at HEAD, section D).
- Final status: published; reader review 7.3; technical rubric (round 7) 8.5.

## C. Before and after: real text

Old text is from `dbbbb94`; new text is from HEAD. Each shows the opening or the section as the reader meets it.

**1. Rental cost guide, opening** (`what-a-dog-really-costs-on-a-vacation-rental`)

Before: "How much does a dog add to a vacation rental bill? In the 38 managers whose pages we read (a convenience sample, not a survey), nightly pet fees run from $20 to $50 and flat or per-pet fees from $50 to $400, with one manager saying "up to $1,000", and some charge $0. Cleaning, deposits, service fees and taxes come on top, so the total for your dates is the only number that counts."

After: "A rental with no pet fee can still cost more than one that charges $40 a night, because the nightly rate, cleaning fee, deposit and taxes all move too. Compare rentals on one number: the cost you won't get back." Then a two-rental table (Rental A $1,300 real cost, Rental B $1,250; cash needed up front $1,300 against $1,500) labelled "Example numbers, not market data".

Why it helps: the reader gets a counter-intuitive claim and a table they can copy for their own two quotes, instead of a range of fees that does not decide anything.

**2. Cabin packing list, the start of the list** (`dog-friendly-cabin-packing-list`)

Before: "A dog cabin packing list is your dog's usual routine plus what a remote cabin cannot supply: tidy food storage, a way to dry muddy paws at the door, a bed that is clearly theirs, a light for dark toilet trips, offline records and a first-aid kit. A cabin is not a hotel room..." followed by "The short answer" (six bullets, four buys) and a "Pack list at a glance" link list.

After: "Cabin weekends fail on small things: a missing medication dose, muddy paws on a white rug, a food bag left on the porch. Start with the essentials below, then add only what your cabin and season call for." Then, under "Essential packing checklist", four groups of real tick boxes: "- [ ] Your dog's usual food, measured for every day plus one or two spare days", "- [ ] Any medication, in labeled packaging with written doses", "- [ ] Offline folder or phone screenshots: vaccination records, microchip number and registry, a recent photo, your vet's details", and so on, with a link to the packing-list tool beside it.

Why it helps: a hurried reader packs from the first screen, and body words fell from 3,123 to 1,159 without dropping a source that a remaining claim needs.

**3. Lost-dog guide, the emergency steps** (`if-your-dog-gets-loose-on-a-trip`)

Before: "If your dog ran away or got loose on vacation, search close to where it was last seen right now, then call your microchip registry and your host. Do the steps in order; if you only have time for three, those are steps 1, 5 and 6 below." followed by six numbered steps, each with a marker such as [[1]].

After: "## Do this first" then four single-action steps: "1. Start searching where the dog was last seen.", "2. Call local shelters and animal control.", "3. Call your microchip registry. The AKC Reunite 24/7 helpline is 800-252-7894; it will confirm your contact details are current.", "4. Post locally and tell your host." The number is a tap-to-call link and was checked against the cited AKC Reunite page.

Why it helps: a panicked owner does not have to work out which three of six steps matter, and can call with one tap.

**4. A product guide: the ramp guide** (`dog-ramp-or-steps-for-the-car-and-cabin`)

Before: "If your dog used to leap into the back of the car and now stops at the bumper and looks at you, a dog ramp for the car is the usual fix. This guide compares five PetSafe ramps and steps on the numbers their makers publish, shows how to measure your vehicle, and says what the vet and kennel-club pages we read say about jumping." then a "What to buy" paragraph, bullets and a buying checklist that all repeated the same weight and length figures.

After: "If your dog stops at the bumper and looks at you, a ramp is usually the fix... Pick one rated above your dog's weight, with side rails, a non-slip surface and a gentle slope for your vehicle's height." Then a five-line "At a glance: our picks" box and "Which ramp fits your car?": "Floor up to about 19 in: the 62 in Folding Ramp reaches about 19 in", "Floor up to about 27 in: the Extra Long at 87 in reaches about 27 in", with the incline labelled as one source's figure and the reach as our arithmetic, "not a maker claim".

Why it helps: the reader measures the cargo floor once and sees which product reaches it; the honesty about what is arithmetic and what is a maker claim stays.

**5. An overlapping topic: large-dog rentals and no-weight-limit rentals** (`vacation-rentals-that-welcome-large-dogs`)

Before (two pages, 2,207 and 2,416 words, sharing tables, quotes and a host message): "Large dog friendly vacation rentals do exist, but "pets allowed" does not mean your dog is accepted: check the weight limit for this dog, get the yes in writing, then check the stairs, floors, yard and total price. You found the cabin, the listing says "dogs welcome," and your Lab is 80 pounds. Then the rules page says 50."

After (one page, 2,016 words; the other URL returns 301): "Large dog friendly rentals exist, and a few managers say outright that they have no dog weight limit. But a listing that says "dogs welcome" can still cap weight at 50 pounds. This page doesn't list rentals; it shows how the limits are written and how to get a big dog approved." The six quoted limits became a table of the managers' own words ("no larger than 35 pounds", "Dogs over 50 pounds are not permitted.", "Max of 2 dogs, combined weight <= 50 lbs").

Why it helps: one answer for one search intent, with the managers' own wording to quote back to a host, and no second page competing for the same question.

**6. Overlap with the car-safety guide: two large dogs** (`two-large-dogs-in-one-car`)

Before: "Two big dogs, one back seat and a long drive: each needs a restraint, and no single product covers both." then "The short answer" and "The short answer in four lines", which restated the restraint rules from the car-safety guide.

After: "Two large dogs in one car is a layout problem before it is a shopping problem. Each dog needs its own restraint, rated for its weight, and the layout depends on your cargo floor, rear belts and anchors. We found no independent crash test of two dogs side by side, so the aim is to remove the risks you can control." Then "Under 75 lb each: a harness per dog on the rear seat, or two crates if the cargo floor is wide enough. 75 lb or more: use a strapped crate." and "What to measure before buying anything" (cargo floor, wheel-well width, hatch height, belt positions, girth, anchors). Crash-test depth is one link to the car-safety guide.

Why it helps: the reader leaves with a tape-measure list rather than a second explanation of crash testing.

**7. Heat guide: emergency steps first** (`keep-a-dog-cool-on-a-summer-trip`)

Before: "You are packing the car for a week at a rental, the forecast is hot, and the dog will ride, walk, wait and sleep somewhere unfamiliar..." with the emergency steps below the habits lede and two temperature thresholds in one confusing sentence.

After: the page opens on "If your dog is overheating right now": "1. Get the dog out of the heat... 2. Call a vet or an emergency vet now, on the way if possible... 3. Cool the dog with cool (not cold) water... 4. Do not use ice-cold water or ice baths... 5. Even if the dog seems better, a vet check is needed." followed by one sentence stating AKC's 104 F and Cornell's 105 F once. The numbered list starts at y=592 at 390x844.

Why it helps: it is the only page where seconds matter, and the first screen now does the job.

## D. Final quality results

### Independent reader reviews (final round per guide)

29 guides were reviewed by independent readers rendering each page at 390 and 1280 px (`docs/review/FINAL-READER-*.md`, 29 files); six were reviewed a second time (`FINAL2-READER-*.md`). The table in section B shows the last score for each guide. The ten criteria are immediate usefulness, audience relevance, natural voice, scannability, distinctiveness, editorial flow, appropriate length, commercial relevance, trust and accuracy, and overall polish.

- **Mean of the final-round averages: 7.1 of 10** (range 6.5 to 7.5). **No guide scored 8.0 or higher. Six scored under 7.0:** how-many-dogs 6.5, keep-a-dog-cool 6.6, NYE 6.7, ramp 6.8, leave-alone 6.8, Airbnb damage 6.9.
- **Verdicts in the final round:** 28 "READY WITH MINOR FIXES" and 1 "NEEDS WORK" (keep-a-dog-cool, second review, 6.6). Hiking gear was "NEEDS WORK" in round one (6.5) and moved to 7.5 in round two.
- The six guides reviewed twice: hiking 6.5 to 7.5, fees 6.7 to 7.3, loose dog 7.1 to 7.2, first-aid 7.0 to 7.0, two-large-dogs 7.1 to 7.1, keep-cool 6.7 to 6.6.
- **The important timing fact.** The first-round reader reviews (the final scores for 23 of the 29 guides) describe the pages **as they were before Pass G**: the defects they list (for example the packing list's pre-checklist intro and six-entry FAQ) are the ones the Pass G records say were fixed, although the files were committed together with the Pass G integration. The six second-round reviews describe the pages before the `FINALFIX` commits (the keep-cool review's top defect, emergency steps below the first screen, is the one `FINALFIX` fixed). **No guide has been independently re-scored after its last fixes.** The scores in this report therefore describe the state before the corrections; they do not measure the corrections.
- Honest overall: the reviewers found the guides accurate, well sourced and usable, with remaining reader-experience problems in repetition, length and first-screen order. After the corrections, the confirmed defects they named were fixed, but whether any guide now scores 8 or above is unknown. Reaching a mean of 7.1 with 0 of 29 at 8.0 should not be described as "excellent"; "ready with minor fixes, minor fixes then applied, not re-scored" is the accurate description.

### Technical rubric, and the reconciliation

- At the baseline (`dbbbb94`) the technical rubric passed all 30 guides at 9.0 or above.
- In round 7 (`docs/review/ARTICLE-*-r7.md`, 29 files) the overall scores were **7.8 to 9.0, mean 8.5**, with **1 of 29 passing** the 9.0 gate (vacation-rentals-with-no-pet-fee, 9.0). The lowest were the packing list and life-jacket guides at 7.8.
- **Why the scores moved, and why they are not directly comparable:** (1) the rubric scores accuracy, trust and product placement (it rewards buying advice and visible product decisions), while the reader scale scores how a 25 to 35 year old reads the page; the baseline scorecard says the two disagree on purpose. (2) The reader-first rewrites deliberately removed "What to buy first" blocks, cut product cards on policy pages and shortened buying advice, which the technical rubric counts against a page. (3) The round-7 files were taken on a build **before** the final rewrites, the removal of numbered citations (the packing-list r7 review still describes numbered markers and a "four-product catch-all") and Pass G, so they say nothing about the final content. **No technical-rubric run exists on the final text.** I am not claiming a 9.0 pass for any guide.
- **The reader-first decision.** The owner's brief (`docs/FINAL_EDITORIAL_BRIEF.md`) says "A genuinely excellent 8.6 beats an inflated 9.4" and "do not chase perfect scores". After round 7 the work stopped chasing the 9.0 gate, rewrote ten guides for readers, applied the reviewers' confirmed defects and froze. That is why this report relies on the reader reviews for quality and on the verified checks below for correctness.

### Reviewer findings, split

**GENUINE DEFECTS, fixed** (a tally from the Pass G, FINALFIX and crawl-fix logs; a guide counts once per category, so the categories overlap):

| Category | Guides or pages | Examples |
|---|---:|---|
| Wrong, unsupported or unverifiable facts and arithmetic | 12 guides | Cost guide: "$250 more cash on booking day" corrected to $200 and "$325 definite pet cost" split into $250 fee + $75 cleaning; fees guide: the lede mixed nightly and per-pet units and the break-even sentence read "$80 nightly" (fixed to "$80 in total at four nights"), manager counts recounted from the dataset (22 state a charge, 3 say $0, 13 name no amount); pool guide: corrected to six of seven managers barring dogs outright; how-many-dogs: a Vrbo regional-page claim removed because the US page could not be read; NYE: a "firecrackers" sentence cited to the wrong manager removed; two-large-dogs: the 90 lb harness claim replaced by the 75 lb tested range; car-safety: the retired 2020-model Clickit Sport removed |
| Safety-critical wording or placement | 6 guides | Heat guide: steps moved to the first screen and the vet call separated; first-aid: the cooling method aligned with the heat guide, one muzzle warning, the hydrogen-peroxide contradiction removed; loose-dog: four single-action steps and a verified tap-to-call helpline; cold-weather: the cold-car statement re-attributed after reading the pages |
| Product or card faults (off-topic, repeating, or inside urgent text) | 17 guides | Two-large-dogs: an off-topic iCrate card and a "Kennel" card that opened the wrong size removed or relabelled; hiking: five cards cut to three; NYE: a tracker light card moved out of the timeline; loose-dog: the WhoseID card moved out of the ten-minute steps; Airbnb damage and fees: mats kept out of the reply steps; puppy: "What to buy first" deleted; car interior: hammock switched to the standard 55 x 56 in model |
| Repeated answers (same fact in dek, lede, body, FAQ, checklist) | 28 of the 29 Pass G records (all five FINALFIX records too) | Packing list: the bear-proof answer was stated four times and now once, FAQ cut from six to one; large-dog guide: FAQ cut from ten to two; reactive-dog guide: vet advice stated once |
| Citation artifacts | 21 guides changed by one script, 2 FAQ renderers, 1 library-wide reading-time fix | Doubled publisher groups 9 to 0; groups inside quotation marks 4 to 0; raw `](` in FAQ answers (2 guides) now rendered; reading-time header and index card now agree on 29 of 29 |
| First-screen and mobile order | 5 guides | Fees guide first body element 835 to 590 px; loose-dog 1,034 to 536 px; puppy guide's lone H2 removed (716 px first paragraph); heat guide steps at y=592; hero 96 px cap on phones |
| SEO metadata | 22 pages | Meta descriptions under 120 characters rewritten (the 4 legal and contact pages, 6 town pages, 11 gear categories, /tools); verified now: all 95 sitemap URLs have a 120 to 160 character description |
| Gear | 4 of 5 trip views, 11 category pages | Featured section no longer repeats collection cards (checked on the build: 0 repeated Amazon URLs on every trip view); category titles and descriptions made unique |

**REJECTED AS TASTE** (28 of 29 Pass G records carry a "Rejected as taste" line; the life-jacket record is the exception):

| Category | Records | Examples |
|---|---:|---|
| Page length where the topic needs it | 8 | Christmas week, cold-weather gear, Airbnb damage FAQ, pool guide, the host message in the leave-alone guide, the ramp guide's single-brand range, the heat and state-law section |
| Wanting more, fewer or different products | 12 | Dropping the doormat card on the no-fee guide; removing the Petcube and Fi cards (their honest caveats are the point); keeping the Heather booster card because the page says it is a seat; a boots card on a page that sends coats elsewhere; moving "What to buy first" up |
| Template wording the writers do not own | 10 | Amazon's required sentence ("As an Amazon Associate I earn from qualifying purchases"), the "I earn" voice, notice placement, checkbox glyph wrapping |
| Titles, headings and section order | 6 | Removing "Truly" from the fenced-yard title, a "Cabin" title wording, reordering sections |
| Hero photo and icon taste | 3 | Hero photo mismatch on the cold-weather guide, hero size on Christmas week |
| Gear features | not counted | Side-by-side comparison or filters on category pages (the Gear review asked for them; the shop stays photo-free and editorial) |

Verified checks at HEAD (all run on the final build on 2026-11-24):

- Tests: 605 passing in 46 files.
- Sitemap: 95 URLs, every one returns HTTP 200 with a self-referencing canonical, exactly one H1, a title of 60 characters or fewer, a 120 to 160 character meta description and no stray `noindex` (0 failures in each check).
- 420 of 420 frontmatter sources linked in the article text; 0 `Check the current price` lines anywhere; 0 per-button affiliate labels on any guide or Gear page; every tagged Amazon link carries `sponsored` (0 failures).
- Gear: 11 category pages, 65 active products with a working Amazon link, 5 trip views with no repeated product.

## E. Exceptions: what needs new evidence, owner approval, browser access (Cowork) or a Gear change

These are the open items, each with what is missing. None changes a number above.

1. **Deploy pending.** Netlify builds are stopped; the live site is an older deploy. No "live site updated" claim is made anywhere. After a deploy, the sitemap, canonicals, meta descriptions and Amazon-link checks must be re-run on the live domain.
2. **No re-review after the last fixes (needs an independent reader).** 23 guides have reader scores from before Pass G; six have second-round scores from before FINALFIX, and the keep-a-dog-cool guide's last independent verdict is NEEDS WORK (6.6). The fixes were applied and checked by the writers (the steps now start at y=592 at 390 px), not by a reviewer.
3. **Sleepypod harness skipped; no replacement harness (needs evidence).** The Clickit Sport was retired (the Amazon listing is the 2020 model, the maker sells the Sport Plus, the weight ratings conflict). No CPS-certified harness available on Amazon that matches could be verified, so the car-safety guide says "We do not currently recommend a specific harness" and shows how to check one in the CPS directory. A named harness would need a Cowork Amazon check of the exact model, size and CPS listing.
4. **Lucky Kennel Large (verified listing, no conflict).** The Amazon listing (B0DW9JGDJM, sold as "Lucky Dog Kennel Large") was verified by Cowork; the maker page is `luckyduck.com/lucky-kennel-large` (70 to 110 lb, interior 35.75 x 22 x 26.5 in). The maker says "Lucky Kennel" and Amazon says "Lucky Dog Kennel"; the guides use the maker's name. The Intermediate link is a different ASIN and the cards say which size each opens.
5. **No maker page for several products (Amazon-first rule).** Products wired only from the Amazon listing as Cowork read it, with no maker page found (`docs/flip/maker-pages-2026-11-24.md`): ARCA PET first-aid kits (three), FDK and REDDOUDOU thermometers, rabbitgoo window film and SUV barrier, Ameritex bed cover, hyha couch cover, Pet Parents Pawtect 34 x 36, WhoseID tag, and the Baskerville muzzle (maker pages timed out). Their cards and text say "the listing states" and no claim goes beyond the listing. A buyer who wants maker-sourced specs needs a browser session for each.
6. **WhoseID subscription statement is from the Amazon listing only.** The loose-dog guide says the listing states a one-time purchase, no subscription and no app, and that we could not read the brand's page (whoseid.com returned 503 twice). Cowork's own note marked the subscription terms unconfirmed by the maker; the owner decided to activate it with that wording.
7. **Untagged Amazon links.** 14 links on 10 distinct ASINs across 8 guide and Gear pages point to amazon.com/dp without the affiliate tag (citation "Source" and "Amazon listing as read" links, not buy buttons; none uses another tag). Decide whether source links are exempt, or tag them; the QA crawl also flagged this.
8. **Per-button label remains on stay pages, and the disclosure page describes it.** The owner's decision removed per-button labels from Amazon product buttons in guides and Gear (verified: 0). The Vrbo booking buttons on stay pages still carry "Affiliate link · We may earn a commission if you book, at no extra cost to you." (all 23 indexable stay pages checked), and `/affiliate-disclosure` still says every buy or booking button carries its own label. The labels come from code (`src/lib/disclosure.ts`) and a route; I cannot edit them. A code change or an owner decision is needed so the page and the buttons agree.
9. **Hero images.** The baseline audit flagged weak heroes on the cost, packing-list and large-dog guides. The packing-list and large-dog heroes were replaced; **the cost guide's hero (`guide-true-cost`) is unchanged** at the owner's direction. Reader review: the packing-list hero is a dog in boots on a bench, decorative rather than a cabin.
10. **Mobile and accessibility on real devices not done.** Layouts were checked in Playwright Chromium at 320, 375, 390, 430, 768, 1024 and 1440 px (no horizontal overflow in the QA crawl), but not on Safari or an iPhone, and not with VoiceOver or a keyboard pass on real devices. Contrast ratios were judged visually, not measured.
11. **Gear review items still open or not re-measured.** `docs/review/FINAL-GEAR-REVIEW.md` defects 1 and 4 were found unchanged on the build: the trip-view H1 stays "Good gear. Better getaways." for every `?trip=` view, and the cards still show both "Details and specs" and "Details, fit & sources". Defect 7 (hero chips 36 px and inline card links 39 px, under the 44 px of the buttons) was not re-measured. Defect 2 (repeated products on trip views) and defect 5 (templated meta descriptions) are fixed and verified on the build.
12. **GA, Search Console and Bing evidence pending (needs Cowork).** The only search evidence is the owner's earlier reading: 21 of 23 inspected URLs indexed, 236 impressions and 0 clicks over 28 days. It does not show that all 95 sitemap URLs are indexed. Bing status and Search Console coverage have not been captured; the SEO checklist (`docs/buyer/SEO_RELEASE_CHECKLIST.md`) marks items 1, 2, 6, 8 and 9 pending.
13. **Cost-guide and other product-claim re-checks after deploy.** Amazon availability and buy boxes change; Cowork checked on 2026-11-24 only.

## F. Buyer-facing summary

No traffic, ranking, revenue or sales claim is made, and none is supported.

A new, pre-revenue dog-travel site with 29 guides about renting vacation homes with a dog and the gear that goes with the trip. In the final editorial pass the guides were rewritten for readers: 45% fewer words for the same 29 topics (45,057 words in the bodies), answer-first openings, one worked example in the cost guide, tickable packing and emergency steps, and one product only where it helps. All 420 listed sources are linked inside the text by publisher name (no numbered markers), with a collapsible Sources list; the affiliate relationship is stated once at the top of each page with Amazon's required sentence, and product buttons carry no per-button label. The Gear section is a photo-free editorial shop: 11 categories, 65 active products, five curated trip collections. The repository passes 605 automated tests and the 95-URL sitemap checks clean on the final build. Independent reviewers rated the guides "ready with minor fixes" (mean 7.1 of 10 on their scale, before the last corrections); the corrections were applied but not re-scored. The build is in the repository only: the live site has not been updated, so a buyer's first deploy publishes it, and any listing claim about the live site must be re-checked after that deploy.

## FINAL EDITORIAL DECISION

**COMPLETE EXCEPT FOR SPECIFIC VERIFIED BLOCKERS.**

Reasons from the evidence:

- Complete: all 29 guides were restructured or corrected against named defects; 420 of 420 sources are linked in the text; 95 of 95 sitemap URLs pass the mechanical checks; 605 tests pass; the confirmed factual and safety defects the reviewers named were fixed (section D), including a wrong cost figure, an unverifiable fee claim, a retired product and the heat-emergency order.
- Not "editorially complete" without exceptions, because quality is not shown, only the absence of known defects: the independent reader mean was 7.1 and 0 of 29 guides reached 8.0; the corrections were never re-scored; the last independent verdict on one safety guide (heat) was NEEDS WORK; the technical rubric was last run on pre-rewrite pages.
- Not "not ready": no known wrong fact, broken link, unsupported claim or safety-order defect remains open, and the open items in section E are verification, deployment and owner-decision items rather than content defects, apart from the stay-page label mismatch (item 8), which needs a code or owner decision before a listing says "no per-button labels" without qualification.

Blockers, in order: (1) deploy and re-verify on the live domain; (2) one independent re-read of the six twice-reviewed guides, heat guide first; (3) the stay-page label versus `/affiliate-disclosure` mismatch; (4) real-device and Cowork browser checks and the Search Console and Bing evidence.

## FREEZE RECOMMENDATION

Freeze the editorial text now. Do not start another rewrite cycle and do not chase the 9.0 rubric gate. Allowed from here: (a) fixes for a confirmed factual error, broken link or safety defect found by the re-read in blocker 2 or by Cowork; (b) the owner or code change for blocker 3; (c) data corrections if a manager's page changes. Any listing language should say "ready with minor fixes per independent readers, corrections applied and not re-scored" rather than a score, and must carry the deploy-pending note until the first deploy is verified.
