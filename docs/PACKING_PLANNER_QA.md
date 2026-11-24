# Packing planner: QA record

Date: 2026-11-24. Branch `claude/affiliate-setup`. Nothing deployed.

## Automated results
- `npx tsc --noEmit`: clean. `npx eslint . --quiet`: clean.
- `npx vitest run`: 53 files, 714 tests passing (baseline 605 plus other workers' tests plus the planner's: `packing-engine`, `packing-state`, `packing-content`, `packing-shopping`, `packing-routing`, `packing-planner`, `packing-analytics`, plus a packing case in `pages-config`).
- `NITRO_PRESET=node-server npx vite build`: OK.
- `node scripts/verify-site.mjs http://localhost:4311 --site-url https://www.pawsandpassage.com` against the built `.output` copied to the scratchpad: 317 checks passed, 0 failed.

## Browser QA (Playwright Chromium on the built site, `scripts/qa/packing-qa.cjs`)
Screenshots: `docs/editorial/img/packing-*.png` (m = 390 px phone, d = 1280 px desktop, p = print). I reviewed them and fixed: the item rows were too tall on phones (compacted), the print order put the summary last (fixed), and the "Suggested:" prefix before a sentence quantity.
- No horizontal overflow at 320, 375, 390, 430, 768, 1024, 1440 on the planner and on the cabin guide (all "ok").
- Desktop: two columns (list about two thirds, sidebar with summary, progress, edit, copy, print). The sidebar is sticky and stayed inside the viewport (top 88 px, bottom 778 px of 900).
- Print emulation: summary first, grouped checklist with visible boxes, quantities, custom items and a compact "Things to pick up"; no nav, footer, panels or buttons; A4 PDF is 2 pages for a 21-item list.

## Journeys
| | Journey | Result |
|---|---|---|
| A | Cabin weekend, 2 dogs, outdoor activities, 2 meals a day | 20 items, tick tools present, no car items, food "12 meal portions", summary "3 days · 2 dogs · Hiking or outdoors" |
| B | Road trip, 5 days | 16 items, car harness, seat cover and bottle present, no cabin rules |
| C | Beach or lake, 2 days | 14 items, life jacket (Consider) present, no car items, no warm layer |
| D | Older dog, road trip | Ramp offered as "Consider", senior comfort item present; ramp shopping caution says the maker does not describe it as a senior or mobility product |
| E | Budget traveler never marks Need to buy | 0 shopping panels, no pick-up section, no Amazon sentence, 0 Amazon links on the page |
| F | Buyer adds "reusable dog towel" in `packing.yml` only | Test `packing-content.test.ts`: validates, appears on a beach trip after the existing towel, "2 towels" for 2 dogs, and a typo fails the build naming the item and field. No React change |
| Guide | Cabin guide module, 4 days, 2 dogs | Opens `/tools/packing-list?trip=cabin&days=4&dogs=2` with the form preset |

## Acceptance criteria
Met and tested: route/title/canonical/description; server-rendered intro and setup with no personal state; presets validated and clamped; packed and need-to-buy independent; expanding details and shopping controls do not toggle packed; exclude/restore; custom items; quantities (meal portions, no dosing); trip edit keeps work and flags new items; v1 migration, corrupt data and blocked storage; start over with confirmation; copy; print; analytics aggregate-only and non-duplicating; content validation errors for each rule; Amazon sentence exact; no price, rating or product photography; calculators not linked.

## Outstanding issues and UNVERIFIED
- Real devices (iPhone Safari, Android Chrome) and VoiceOver/TalkBack: not tested. Only Chromium emulation.
- Pages CMS form (`.pages.yml` "Packing planner"): structure tested against the schema, but the live edit, save and deploy flow is NOT tested. It also uses YAML anchors (`&conditions`); if the CMS rejects them, expand them. Direct YAML edit is the verified route.
- Clipboard and print dialogs were exercised through code paths and PDF output, not on a physical printer.
- No real-user evidence (no usability testing or analytics yet).
- Left in place by design: `src/lib/pack-images.ts` and `src/content/pack-photos.ts` are now unused (the old tool used them). They sit with the photo worker's files, so I did not delete them.
- The old planner's wording remains as link text in a few places ("Pack your dog's bag").

## Cowork verification brief (real device, CMS)
1. iPhone Safari at the live URL `/tools/packing-list`: build a list (Cabin, 3 days, 2 dogs), tick items, reload, confirm it persists. Open the cabin guide, use the module, confirm the preset.
2. VoiceOver: setup radio group, steppers (spin buttons), checkboxes read "Packed: ..." and "Need to buy: ...", the progress bar, and that "Not bringing this" is announced politely.
3. Mark "Food and water bowls" Need to buy: panel with two options, the Amazon sentence once, "View at Amazon" opens the approved link in a new tab.
4. Print preview in Safari: one clean list, no site chrome.
5. Pages CMS (signed in as owner): open "Packing planner", change the text of one item's "What is this for?", save, confirm a commit changes only `content/packing.yml`, build passes, and the text appears. Then add an item with a deliberately wrong category and confirm the build fails with the item named. Report PASS/FAIL; do not publish the test edits.

## Self-score (honest; 10 = perfect)
| Criterion | Score | Evidence / caveat |
|---|---|---|
| First-time understanding | 9 | Intro, one setup question block, one primary button; no real-user test |
| Setup speed | 9 | Defaults let a visitor build with one click; guide module sets three choices |
| List relevance | 8 | Rules differ by profile (journeys A to E); about 35 items, more could be added |
| Control intuitiveness | 8 | Two separate checkboxes, clear tags; unverified with real users |
| Quantities and reminders | 9 | Item-specific strategies; meals labelled a planning calculation; no dosing |
| Natural product recs | 8 | Only after Need to buy, max two, cautions from records; coverage limited to catalog |
| Accurate links and disclosures | 9 | Links from `resolveProductLink()`, exact Amazon sentence, no prices; live link behavior unverified |
| Mobile | 8 | No overflow 320 to 1440, compact rows, 44 px targets; no real device |
| Buyer content management | 8 | One YAML file, validated with named errors, tested journey F; CMS flow unverified |
| Maintainability | 9 | Pure typed engine, content-driven, 7 focused test files |

## Second pass: Need to buy, extras, Gear discoverability (2026-11-24, not deployed)
Each concern was checked against the code before changing anything.

| Concern | Verdict | What was wrong and what changed |
|---|---|---|
| (a) Need to buy sometimes gives no response | Confirmed | `ShoppingPanel` returned nothing when an item listed no product (or none applied to the trip), so ticking the box did nothing visible. Now four states, always non-empty: researched products, a "Looking for ...?" pointer to a live Gear category, a quiet "Added to your shopping list" note, and the same note for the visitor's own items (never matched to a product). Tested for all four, plus a test that ticks every item and asserts no panel is empty. |
| (b) Discovery limited to manually associated product ids | Confirmed | Only `item.products` was consulted. Added optional `gearCategory` (validated at build against real category slugs and the live-category rule) and a fallback to the categories of the item's own listed products. Coverage is now measured: every active product is reachable (see below). The planner still never infers a product from an item's name or free text. |
| (c) "Not bringing this" looks like "Why this is included" | Confirmed | Both were identical underlined link buttons. Now "Why bring this?" is a quiet ghost button with an info icon (`aria-expanded`, `aria-controls`, labelled region) and "Remove from list" is an outlined, quietly destructive button with an X icon and the accessible name "Remove from list: [item]". Removal shows a polite live message and an Undo button (focus moves to it; it goes away after about ten seconds or the next action); the restore section is "Removed from your list (n)". Removal never touches Packed. |
| (d) Optional suggestions hidden | Confirmed | Optional items without a rule sat inside a collapsed "Other ideas" disclosure; optional items with a rule were silently added to the list as "Consider" (so an older dog on a driving trip got a ramp). Now optional items are never added by the rules and appear in a visible section "A few extras worth considering" after the checklist (about four, "See more packing ideas" for the rest, "Explore more travel gear" to the trip's Gear collection). |

New behaviour covered by `src/test/packing-v2.test.tsx`, `src/test/packing-gear.test.ts`, and updates to the existing planner, state, engine and analytics tests. Browser QA: `scripts/qa/packing-v2-qa.cjs`, screenshots `docs/editorial/img/packing-v2-*.png` (390 and 1280: item controls, Undo, Need to buy states 1 to 3, extras, pick-up list, Gear collection landing). I reviewed them: the controls wrap to two rows on a phone (kept; the three buttons read as distinct), the Undo bar sits above the content at the bottom of the screen, and the Gear link lands on the trip collection heading with "#trip-collection".
- No horizontal overflow at 320, 375, 390, 430, 768, 1024, 1440 with a road-trip list with an older dog, several items marked to buy, an explanation open, a removal and all extras shown.
- Journey 1 (3 days, 2 dogs, cabin): packed a bowl, added the optional pet gate (not marked Need to buy), marked the bed Need to buy, read the product link (`rel="sponsored nofollow noopener"`, `target="_blank"`, "View at Amazon"; the external site was not opened), reloaded as after Back: progress, packed, buy and the added gate all kept. From the planner the Gear link goes to `/gear?trip=cabin-stay#trip-collection`; Back returned to the list with Need to buy still checked.

### Gear coverage
`bun scripts/gear-coverage-report.ts` writes `docs/PACKING_GEAR_COVERAGE.md`. Of 65 active products: 37 are recommended directly by a packing item, 28 are reachable through a live Gear category the planner links to, 0 only through the Gear hub, and **0 unreachable** (class 4 fails the test). Every active product has a valid outbound link; none is information-only. No product was added to a packing item just to reach it.

### Content verification (Phase 6 checklist)
- Essentials are sensible for every trip type; conditionals appear only when their rule matches; optional items are never on the list by the rules (tested for every trip type and condition).
- Quantities: per dog, per day and meal-based strategies checked (2 dogs, 3 days gives 12 meal portions with meals per day, 2 bowl sets, 18 waste bags); all editable, none a dose, weight or water volume.
- Every product association points to an active product (build and test enforce it); every figure in a `caution` (sizes, weights, capacities, counts) appears in the product record (checked by script, no mismatches). No product is listed under two items. No price, rating, "best", "tested" or effectiveness claim (grep clean after the fixes below).
- Fixed: the harness item said "a harness your dog can't back out of" (an unsupported effectiveness claim), now "fits snugly, adjusted and fit-checked"; the ID tag said "the fastest way for a stranger to reach you", now "a way"; the GPS item said it "shows where your dog is", now "reports your dog's location where it has coverage".
- Fixed: Dog boots, the safety light and the life jacket had no relevance rule or an auto-add rule, so boots would have been offered on a beach trip; they now have rules (boots: cold or outdoors; light: outdoors or cold; life jacket: water).
- Fixed: the leash essential had no product although a leash is in the catalog; it now lists the Ruffwear Knot-a-Leash with a caution from its record.
- Added level 3 items, each backed by an active product: collapsible travel crate, doorway pet gate, spill-resistant car water bowl, packable trail water bowl. The water plan and the washable throw got a `gearCategory`.
- Safety notes: product cautions are always visible on the cards; the item-level safety wording (for example "a seat cover is not a restraint", the cooling and life-jacket cautions) is one tap away under "Why bring this?". It is not shown open by default.
- Trip changes keep user choices (existing tests), and a list saved before this change keeps an optional item that was ticked, bought or counted.
- A bad `gearCategory`, an unknown product id or an inactive product fails the build naming the item and field (tested through `loadContent`).

### CMS follow-up (needs an owner of `.pages.yml`)
`content/packing.yml` now accepts `gearCategory` on items and `gearTrip` on trip types. The Pages CMS form in `.pages.yml` has not been updated (that file was being edited for another task, so it was left alone). Add to the "Packing planner" form: under each trip type a `gearTrip` select (cabin-stay, road-trip, beach-and-lake, winter-trip, hiking), and under each item, after `shopFor`, a `gearCategory` select with the eleven slugs in `src/content/gear-categories.ts`; relabel the `why` field "Why bring this?". `src/test/pages-config.test.ts` exempts `gearCategory` only while the form lacks it; once the form has it, field order is checked. The old Cowork step 3 above ("Not bringing this") now reads "Remove from list".

### Still unverified
Real devices and VoiceOver for the new Undo bar and the controls; the live CMS flow; the Gear trip collection under JavaScript-disabled browsing (not part of the planner).
