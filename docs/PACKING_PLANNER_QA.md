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
