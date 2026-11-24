# Cross-guide fixes (reviewer defects 1 to 4)

## 1. Citation artifacts: `scripts/fix-citation-artifacts.mjs`

Run `bun scripts/fix-citation-artifacts.mjs --dry-run [--show]` for the report, `--write` to rewrite. It is deterministic and idempotent (the second run reports "clean" for all 29 guides). It only touches parenthetical publisher groups; frontmatter is never changed. A guide is written only if every source URL linked before (body plus FAQ answers) is still linked after.

Rules: (a) same URL or same publisher twice in a group collapses; (b) a group link is dropped when an inline link to the same URL or publisher sits in the previous 160 characters of the paragraph or list item; (d) the same publisher+URL group item appears once per paragraph; (c) a group inside quotation marks moves after the closing quote (a closing period moves after the group); (f) "word. (X)." becomes "word (X)."; (g) a single-link group whose publisher is already named in plain words in the same sentence links that mention instead; (e) no empty `()`, and a link is never dropped when it is the last link to a source URL. Where two same-publisher links must both stay (each is the only link to its page), the labels are made distinct with the page title.

Totals over 29 published guides: groups 250 to 222, links 270 to 237, groups with a doubled publisher or URL 9 to 0, groups inside quotes 4 to 0, paragraph repeats 8 to 3 (the 3 left are different pages of one publisher, each the only link to that page), groups after a sentence period 1 to 0. 21 guides changed, 8 were already clean.

Per guide (groups, links, doubled, in quotes, repeats, after period; before > after):

| guide | groups | links | doubled | quotes | repeats | after period |
|---|---|---|---|---|---|---|
| airbnb-pet-damage-charge-after-checkout | 9>9 | 10>9 | 1>0 | 0>0 | 2>1 | 0>0 |
| can-you-leave-a-dog-alone-in-a-vacation-rental | 9>9 | 10>10 | 0>0 | 1>0 | 0>0 | 0>0 |
| christmas-week-in-a-cabin-with-a-dog | 8>7 | 8>7 | 0>0 | 0>0 | 0>0 | 1>0 |
| cold-weather-dog-gear-for-winter-cabin-trips | 17>16 | 19>18 | 0>0 | 0>0 | 1>0 | 0>0 |
| dog-hiking-gear-for-a-cabin-vacation | 6>3 | 6>3 | 0>0 | 0>0 | 1>0 | 0>0 |
| dog-ramp-or-steps-for-the-car-and-cabin | 10>10 | 12>11 | 1>0 | 0>0 | 0>0 | 0>0 |
| dog-travel-bowls-and-food-storage | 9>4 | 10>5 | 1>0 | 0>0 | 0>0 | 0>0 |
| dogs-in-georgia-state-park-cabins | 12>12 | 13>13 | 1>0 | 0>0 | 0>0 | 0>0 |
| how-many-dogs-can-you-bring-to-a-vacation-rental | 7>6 | 7>6 | 0>0 | 0>0 | 2>1 | 0>0 |
| if-your-dog-gets-loose-on-a-trip | 9>8 | 11>10 | 1>0 | 0>0 | 0>0 | 0>0 |
| keep-a-dog-cool-on-a-summer-trip | 16>15 | 16>15 | 0>0 | 0>0 | 1>0 | 0>0 |
| new-years-eve-with-a-dog-in-a-vacation-rental | 16>14 | 16>14 | 0>0 | 0>0 | 0>0 | 0>0 |
| protect-your-car-interior-from-a-dog-on-a-road-trip | 5>4 | 5>4 | 0>0 | 0>0 | 0>0 | 0>0 |
| puppy-at-a-vacation-rental | 3>3 | 4>4 | 0>0 | 1>0 | 0>0 | 0>0 |
| two-large-dogs-in-one-car | 8>7 | 8>7 | 0>0 | 0>0 | 0>0 | 0>0 |
| what-a-dog-really-costs-on-a-vacation-rental | 6>1 | 7>2 | 1>0 | 0>0 | 0>0 | 0>0 |
| dog-car-safety-harness-and-crate-guide | 26>23 | 31>25 | 3>0 | 0>0 | 0>0 | 0>0 |
| dog-friendly-cabin-packing-list | 1>0 | 1>0 | 0>0 | 0>0 | 0>0 | 0>0 |
| dog-travel-first-aid-kit-guide | 16>15 | 18>17 | 0>0 | 0>0 | 0>0 | 0>0 |
| portable-dog-fence-and-playpen-guide-for-rentals | 6>5 | 6>5 | 0>0 | 0>0 | 0>0 | 0>0 |
| vacation-rentals-that-welcome-large-dogs | 6>6 | 6>6 | 0>0 | 2>0 | 1>1 | 0>0 |

Clean already (no change): can-dogs-go-in-a-rental-pool-or-hot-tub, dog-life-jacket-for-lakes-and-beaches, how-vacation-rental-pet-fees-work, vacation-rental-with-a-reactive-dog, vacation-rental-with-a-senior-dog, vacation-rentals-with-no-pet-fee, pet-friendly-vacation-rental-checklist, vacation-rental-secure-fenced-yard.

Examples:

- CPS: `... 12 lb test dog ([Center for Pet Safety](.../sleepypod-clickit-sport/), [Center for Pet Safety](.../sleepypod-atom/))` became one `([Center for Pet Safety](.../sleepypod-clickit-sport/))` (the other page is linked elsewhere).
- Airbnb, Airbnb: two Airbnb pages in one group became one.
- Springland, Springland and Fi, Fi and Georgia State Parks, Georgia State Parks: each page is the only link to its source, so both stay with distinct labels, e.g. `([Fi: GPS Dog Collar with Health & Activity Tracking](...), [Fi: Membership and Community](...))`.
- Lead: `... and lists Christmas. ([A Blue Ridge Vacation](url)).` became `[A Blue Ridge Vacation](url), for one, says "..." and lists Christmas.`
- Quotes: `"... unattended ([Airhosts Forum](url))."` became `"... unattended" ([Airhosts Forum](url)).`

## 2. Raw Markdown in FAQ answers

FAQ answers (two guides had `[text](url)`: vacation-rentals-that-welcome-large-dogs and portable-dog-fence-and-playpen-guide-for-rentals) now render through `renderInlineMarkdown()` in `src/components/site/Markdown.tsx` (same marked renderer as the body, inline only: raw HTML escaped, unsafe addresses dropped, web links open in a new tab), both in the accordion and in the print list. `src/lib/faq-text.ts` has `faqPlainText()` and `faqPageJsonLd()` (clean text, no markdown); the site still emits no FAQPage JSON-LD (docs/recovery/FAQPAGE-DECISION.md). Tests: `src/test/cross-guide-fixes.test.tsx` scans every published guide's FAQs for `](` in the rendered HTML and for markdown in JSON-LD answers.

## 3. Reading time

Cause: production list pages get a summary with an empty body, so GuideCard fell back to the frontmatter number (11) while the header counted the real body (8). `guideReadingMinutes()` in `src/lib/reading-time.ts` is now the only function used by the guide header and GuideCard (so also the guides index, home and related-guide cards), and `guideSummary()` in `plugins/content.ts` writes the number computed from the full body into the summary. Test: header and card agree for how-vacation-rental-pet-fees-work and dog-ramp-or-steps-for-the-car-and-cabin, with the card rendered from a body-less summary.

## 4. Mobile first screen (390x844, build on port 4195)

Phone-only changes (desktop classes unchanged): hero max 96 px with object-cover (aspect 2/1), tighter header spacing and type, current-page breadcrumb hidden, byline date as plain text, share row moved to the end of the article on phones, compact two-line affiliate notice ("Some links are affiliate links; we may earn a commission. As an Amazon Associate I earn from qualifying purchases. How we earn", shown only when affiliate links exist, still above the first affiliate link), compact contents toggle. The emergency layout is untouched.

Top of the first body element: how-vacation-rental-pet-fees-work 590 px (was about 835), dog-ramp-or-steps-for-the-car-and-cabin 590 px, if-your-dog-gets-loose-on-a-trip 536 px (was 1034 to the first paragraph). Screenshots: `docs/editorial/img/firstscreen-*.png`.

Also: `src/test/launch-state.test.ts` got a 30 s timeout on one test that already timed out at HEAD under a full parallel run.
