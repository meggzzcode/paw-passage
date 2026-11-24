# Packing planner: product guide

The packing planner at `/tools/packing-list` builds a personalized dog packing list from a short trip description. It is a free tool, saves on the visitor's device only, and shows product suggestions only when the visitor marks an item "Need to buy". Nothing is deployed by this work; the owner's brief is saved in `docs/PACKING_PLANNER_BRIEF.md`.

**Current content (counted 2026-11-24 at `9797221`):** `content/packing.yml` declares 37 items (12 essential, 15 conditional, 10 optional), 5 trip types, 9 conditions and 7 categories; all 65 active Gear products are reachable from the planner or a Gear category it links to (`docs/PACKING_GEAR_COVERAGE.md`). Lists are saved in the visitor's browser only; there are no accounts or sync. Any older "15-item" or "Add to bag" description elsewhere is superseded.

## Purpose and journey
1. Visitor lands (directly, from the Tools page, the Gear hub, or the cabin guide's "Make this list yours" module).
2. Setup: trip type (cabin is preselected for direct visitors; a guide link can preset it), days (1 to 30, counts every day including travel days), dogs (1 to 5), optional meals per dog per day, and optional "anything else" conditions. One button: "Build my packing list".
3. The list appears grouped by category with a summary, progress bar and a sidebar (desktop). "Edit trip" changes the trip without losing work.
4. Per item: Packed, Need to buy (independent), quantity (editable), "Why bring this?" (a quiet ghost button with an info icon that expands the explanation) and "Remove from list" (an outlined, quietly destructive button with an X icon). Removing never touches Packed; an Undo bar (polite live message plus a visible, keyboard-reachable Undo button, about ten seconds or until the next action) brings the item back, and "Removed from your list (n)" keeps every removed suggestion restorable. Custom items can be added and removed (also with Undo).
5. Need to buy always answers immediately, in four states (see "Need to buy responses"). "Things to pick up before you go" collects every marked item.
6. After the checklist, "A few extras worth considering" offers about four optional ideas for the trip with "Add to my list", "See more packing ideas" and "Explore more travel gear" (the Gear collection for the trip). Copy, print and start over sit below.

Screenshots (390 and 1280 wide, from the built site) are in `docs/editorial/img/packing-*.png` (first pass) and `docs/editorial/img/packing-v2-*.png` (item controls, Undo, the Need to buy states, extras, pick-up list, Gear trip collection landing).

## The three levels
`content/packing.yml` states the level of every item through `appears`:
1. Essentials (`essential`): always on the list.
2. Trip-specific recommendations (`conditional`): on the list only when the trip's rule matches.
3. Optional discovery (`optional`): never put on the list by the rules. Offered under "A few extras worth considering" when the item's `when` rule matches the trip; an optional item with no rule is a general idea shown last, under "See more packing ideas". The visitor adds it with "Add to my list", which does not mark Need to buy and opens no product card.

An older dog never puts a ramp on the list (it is an extra offered on a driving trip with an older dog), a beach trip offers a life jacket and no snow boots, a cabin trip does not offer a GPS tracker (that stays a level 2 item for a dog who may slip away). Optional items exist only where an active Gear product backs them (a test enforces it).

## Need to buy responses
Always one of four, immediately on check, never an empty panel:
1. Researched product(s): one primary and at most one meaningfully different alternative as Gear cards (brand, name, one-sentence benefit, up to three verified specs, a "Check:" caution, an accurate button, the disclosure once at the top).
2. No applicable product but a related live Gear category: "Looking for a [item]?" "We don't have a specific pick for this yet, but you can explore related travel gear." and "Explore [category] gear" linking to `/gear/<category>`. The category comes from the item's `gearCategory`, else from the categories of the products it lists; never from the item's name or free text.
3. Neither: "Added to your shopping list." "We don't have a matching product recommendation for this item yet." (a quiet note, not a card).
4. The visitor's own item: can be marked to buy, appears in the pick-up list, gets the same quiet note, and is never matched to a product.
The pick-up list shows, per row, the item, quantity, packed indicator and either the primary product link, "No specific pick yet" with the category link, or "No recommendation yet". It carries the disclosure once, and is not shown at all when nothing is marked.

## File architecture
| Path | Role |
|---|---|
| `content/packing.yml` | All suggestions: trip types, conditions, categories, items, rules, quantity strategies, product ids |
| `src/lib/packing/schema.ts` | zod schema plus `packingProblems()` cross-checks (pure; also loaded by the build) |
| `plugins/content.ts` | Loads and validates `content/packing.yml` with the other content (no second loader); exports `packing` in `virtual:content` |
| `src/content/packing.ts` | Typed access to the validated content |
| `src/lib/packing/engine.ts` | Rule evaluation, quantities, trip normalising (pure, deterministic) |
| `src/lib/packing/state.ts` | Checklist state: packed, buy, exclude/restore, custom items, trip changes, progress |
| `src/lib/packing/storage.ts` | localStorage (v2), migration from `pp.packing.v1`, recovery |
| `src/lib/packing/shopping.ts` | Which products an item may show; labels; uses `resolveProductLink()`; `buyResponseFor()` (the four Need to buy states) |
| `src/lib/packing/coverage.ts`, `coverage-live.ts` | Gear coverage classification and the generated `docs/PACKING_GEAR_COVERAGE.md` (script: `scripts/gear-coverage-report.ts`) |
| `src/lib/packing/export.ts` | "Copy my list" plain text |
| `src/lib/packing/preset.ts` | Validation of URL presets |
| `src/lib/packing/guide-module.ts` | HTML for the `{{planner:...}}` directive |
| `src/components/packing/*` | UI (`PackingPlanner`, `TripSetup`, `Checklist`, `Shopping`, `Extras`) and `packing.css` (incl. print) |
| `src/routes/tools.packing-list.tsx` | Route, metadata, URL preset validation |
| `src/components/site/Markdown.tsx` | The `{{planner:trip-id}}` directive (next to `{{pick:...}}`) |

## Data schema (`content/packing.yml`)
Top level: `tripTypes`, `conditions`, `categories`, `items`. A trip type has `id`, `label`, `short`, `listTitle`, `hint`, `icon`, `implies` and optional `gearTrip` (the Gear trip collection that "Explore more travel gear" opens: `cabin` uses `cabin-stay`, `road-trip` `road-trip`, `beach-lake` `beach-and-lake`, `camping-hiking` `hiking`, `other` none so it links to `/gear`; a test checks every slug exists in `tripCollections`). An item has: `id`, `name`, `category`, `order`, `active`, `what` (what is this for), `why` (shown in "Why bring this?"), `tip`, `appears` (`essential`, `conditional` or `optional`, the three levels above), `when` (`tripTypes`, `anyConditions`, `allConditions`, `unlessConditions`, `minDays`, `maxDays`; every part present must match), `quantity`, `shopFor` (required with `products` or `gearCategory`), `gearCategory` (optional `/gear` category slug for state 2 of Need to buy; the build fails for an unknown category or one with fewer than three active products) and `products`.

Quantity strategies (one per item, never a single formula): `none`, `fixed`, `perDog`, `perDay`, `perDogPerDay`, `dogDays`, `meals` (meal portions if the visitor entered meals per day, labelled a planning calculation, else dog-days), `text` (a sentence; used for medication and water, which never get a dose or volume). Optional `min`, `max`, `note`.

Products: each entry has `id` (a product id from `content/products.yml`), `caution` (required: the one thing to check, from the product record), `because` (required for every entry after the first: how it differs), optional `benefit`, `onlyConditions`, `unlessConditions`. Never put a URL or price here.

## Rules in practice
Essentials (food, bowls, water plan, leash, ID tag, waste bags, records, vet details, bed, dog-only towel, first-aid kit) appear on every list. Level 2 items are conditional: car items only when driving (or a road trip), cold layer when cold, cooling when hot, portable pen with a "ask the host" tip when there is no fence or a dog may slip away. Level 3 items (life jacket, ramp, boots, safety light, collapsible crate, doorway gate, car and trail water bowls, door mat, muzzle) are only offered as extras. A default cabin list for two dogs has 15 items and offers three extras.

## State model
Per item: `packed`, `buy`, `excluded`, `added`, `qty`. Packed and buy never set each other; when both are set the row says so and offers one-click clearing. "Remove from list" removes an item from the list and from the progress count, never from the state, and it can be added back (Undo, or "Removed from your list (n)"). An optional item is on the list only because the visitor added it (`added`) or, for a list saved before extras were visitor-only, already ticked, bought or counted it. Changing the trip keeps custom items, packed/buy/quantity for items that stay relevant, keeps excluded items excluded, adds newly relevant items once and marks them "New". Progress counts only active items.

## Storage
`localStorage` key `pp.packing.v2` (`{ v: 2, trip, built, items, custom, customSeq, fresh }`). The first version's `pp.packing.v1` (`{profile, packed[]}`) is read once and mapped (`LEGACY_ID_MAP` in `storage.ts`); the old key is left in place. Unreadable data is copied to `pp.packing.v2.corrupt` before a fresh start. If storage is blocked the planner works for the visit and says saving is off. "Start over" (after confirmation) clears both keys.

## Product integration and affiliate management
Links always come from `resolveProductLink()` (approved affiliate link, else maker page, else retailer, else nothing). Buttons say "View at Amazon" or "See at the manufacturer". One notice (built from `src/lib/disclosure.ts` plus Amazon's exact sentence "As an Amazon Associate I earn from qualifying purchases.") sits at the top of each shopping surface; there is no per-button label. A product with no usable link is skipped; the item then falls back to its Gear category or to the quiet note (see "Need to buy responses"). Custom items never get suggestions. The category and trip-collection links are internal Gear links, not affiliate links, so they carry no disclosure. To change what an item recommends, edit its `products` list. To change a link or approval, edit `content/affiliates.yml` (the planner follows it). A product turned off in `content/products.yml` while still listed in `packing.yml` stops the build with a clear message.

## Analytics
Reuses `src/lib/analytics.ts`. Events: `tool_start` (planner started), `tool_complete` (list generated, label = trip type), `packing_trip_edited`, `packing_custom_added` (no text), `packing_item_packed` and `packing_item_need_to_buy` (label = content item id, or `custom`), `packing_recommendation_opened` (once per item per visit), `product_click` (existing), `tool_copy`, `tool_print`. Never sent: custom text, medication, list contents. Registered in `EVENT_VOCABULARY` and `docs/ANALYTICS-SETUP.md`.

## Editing content
Verified route: edit `content/packing.yml` directly (YAML, header comments explain each field). Run `npx vitest run src/test/packing-content.test.ts` and a build; errors name the item and field. A Pages CMS form exists in `.pages.yml` ("Packing planner"); its structure is covered by `src/test/pages-config.test.ts`, but the live CMS edit/save/deploy flow has NOT been tried (see the Cowork steps in `docs/PACKING_PLANNER_QA.md`). Product ids are typed, not picked, because Pages CMS can only reference collections. The form does not yet offer the new `gearCategory` and `gearTrip` fields (see "CMS follow-up" in `docs/PACKING_PLANNER_QA.md`); set them in the YAML.

### Add an item (example: reusable dog towel)
Append to `items:` in `content/packing.yml`, with a category id, `appears`, optional `when`, `what`, `why`, `quantity`. No code change. This is tested in `packing-content.test.ts` (Journey F).

### Add or change a recommended product
Add the product to `content/products.yml` (with its approved Amazon link in `content/affiliates.yml`), then list its id under the item's `products` with a `caution`. Keep at most two shown (the planner shows the first usable one, plus one alternative that has a `because`).

## Guide module
`{{planner:cabin}}` on its own line in any guide renders "Make this list yours": a plain GET form (works without JavaScript) with days and dogs selectors and the button "Build my cabin packing list", opening `/tools/packing-list?trip=cabin&days=N&dogs=N`. Any trip id from `packing.yml` works. Parameters are validated and clamped, unknown ones are ignored, the canonical stays `/tools/packing-list`. Precedence: choices made on the planner screen win; a preset only initialises the setup form (it does not build a list); if a saved list conflicts with a preset the planner asks "Continue my saved list" or "Start with this preset" and changes nothing until the visitor builds.

## Troubleshooting
- Build fails naming `content/packing.yml`: read the item and field in the message; most often an unknown category, condition or product id, or an inactive product.
- An item never shows: check `appears`/`when` (a conditional item needs a matching trip); optional items are only ever offered under "A few extras worth considering", and one without a rule only under "See more packing ideas".
- A product does not show: the product is inactive, has no approved link or maker page, or its entry has no `because` and is second.
- A visitor's old list looks different: `LEGACY_ID_MAP` in `storage.ts` maps v1 ids; changing item ids in `packing.yml` orphans saved state for those ids.

## Build and deploy
`npx tsc --noEmit`, `npx eslint . --quiet`, `npx vitest run`, `NITRO_PRESET=node-server npx vite build`, then `node scripts/verify-site.mjs <base-url>`. Browser QA: `scripts/qa/packing-qa.cjs` and `scripts/qa/packing-v2-qa.cjs`. After changing products, packing items or the Gear hub, run `bun scripts/gear-coverage-report.ts` and commit `docs/PACKING_GEAR_COVERAGE.md` (the test `packing-gear.test.ts` fails when it is stale or when any active product is unreachable). Nothing is deployed by these steps.

## Limitations
No accounts, no sync across devices, no AI; lists live in one browser. Suggestions are rule-based and conservative, not veterinary advice. Quantities are practical starting points, never food weights, calories, doses or water volumes. The old per-item photos were removed (no product photography). Real-device Safari, VoiceOver and the Pages CMS flow are unverified.
