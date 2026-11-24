# Packing planner: product guide

The packing planner at `/tools/packing-list` builds a personalized dog packing list from a short trip description. It is a free tool, saves on the visitor's device only, and shows product suggestions only when the visitor marks an item "Need to buy". Nothing is deployed by this work; the owner's brief is saved in `docs/PACKING_PLANNER_BRIEF.md`.

## Purpose and journey
1. Visitor lands (directly, from the Tools page, the Gear hub, or the cabin guide's "Make this list yours" module).
2. Setup: trip type (cabin is preselected for direct visitors; a guide link can preset it), days (1 to 30, counts every day including travel days), dogs (1 to 5), optional meals per dog per day, and optional "anything else" conditions. One button: "Build my packing list".
3. The list appears grouped by category with a summary, progress bar and a sidebar (desktop). "Edit trip" changes the trip without losing work.
4. Per item: Packed, Need to buy (independent), quantity (editable), "Why this is included", "Not bringing this". Custom items can be added.
5. Need to buy opens a small panel with at most two researched options; "Things to pick up before you go" collects them. Copy, print and start over sit below.

Screenshots (390 and 1280 wide, from the built site) are in `docs/editorial/img/packing-*.png`: initial, list, expanded explanation, custom item, shopping panel, pick-up list, print, two-column desktop, guide module, senior-dog ramp.

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
| `src/lib/packing/shopping.ts` | Which products an item may show; labels; uses `resolveProductLink()` |
| `src/lib/packing/export.ts` | "Copy my list" plain text |
| `src/lib/packing/preset.ts` | Validation of URL presets |
| `src/lib/packing/guide-module.ts` | HTML for the `{{planner:...}}` directive |
| `src/components/packing/*` | UI (`PackingPlanner`, `TripSetup`, `Checklist`, `Shopping`) and `packing.css` (incl. print) |
| `src/routes/tools.packing-list.tsx` | Route, metadata, URL preset validation |
| `src/components/site/Markdown.tsx` | The `{{planner:trip-id}}` directive (next to `{{pick:...}}`) |

## Data schema (`content/packing.yml`)
Top level: `tripTypes`, `conditions`, `categories`, `items`. An item has: `id`, `name`, `category`, `order`, `active`, `what` (what is this for), `why` (shown in "Why this is included"), `tip`, `appears` (`essential` always; `conditional` when its rule matches; `optional` is "Consider" when its rule matches, else only offered under "Other ideas"), `when` (`tripTypes`, `anyConditions`, `allConditions`, `unlessConditions`, `minDays`, `maxDays`; every part present must match), `quantity`, `shopFor`, `products`.

Quantity strategies (one per item, never a single formula): `none`, `fixed`, `perDog`, `perDay`, `perDogPerDay`, `dogDays`, `meals` (meal portions if the visitor entered meals per day, labelled a planning calculation, else dog-days), `text` (a sentence; used for medication and water, which never get a dose or volume). Optional `min`, `max`, `note`.

Products: each entry has `id` (a product id from `content/products.yml`), `caution` (required: the one thing to check, from the product record), `because` (required for every entry after the first: how it differs), optional `benefit`, `onlyConditions`, `unlessConditions`. Never put a URL or price here.

## Rules in practice
Essentials (food, bowls, water plan, leash, ID tag, waste bags, records, vet details, bed, dog-only towel, first-aid kit) appear on every list. Everything else is conditional: car items only when driving (or a road trip), life jacket as "Consider" for water, cold layer when cold, cooling when hot, ramp as "Consider" only for driving plus an older dog, portable pen with a "ask the host" tip when there is no fence or a dog may slip away, boots only as an idea. A default cabin list has 14 items.

## State model
Per item: `packed`, `buy`, `excluded`, `added`, `qty`. Packed and buy never set each other; when both are set the row says so and offers one-click clearing. "Not bringing this" removes an item from the list and from the progress count, never from the state, and it can be added back. Changing the trip keeps custom items, packed/buy/quantity for items that stay relevant, keeps excluded items excluded, adds newly relevant items once and marks them "New". Progress counts only active items.

## Storage
`localStorage` key `pp.packing.v2` (`{ v: 2, trip, built, items, custom, customSeq, fresh }`). The first version's `pp.packing.v1` (`{profile, packed[]}`) is read once and mapped (`LEGACY_ID_MAP` in `storage.ts`); the old key is left in place. Unreadable data is copied to `pp.packing.v2.corrupt` before a fresh start. If storage is blocked the planner works for the visit and says saving is off. "Start over" (after confirmation) clears both keys.

## Product integration and affiliate management
Links always come from `resolveProductLink()` (approved affiliate link, else maker page, else retailer, else nothing). Buttons say "View at Amazon" or "See at the manufacturer". One notice (built from `src/lib/disclosure.ts` plus Amazon's exact sentence "As an Amazon Associate I earn from qualifying purchases.") sits at the top of each shopping surface; there is no per-button label. A product with no usable link is skipped; an item with none shows no suggestion. Custom items never get suggestions. To change what an item recommends, edit its `products` list. To change a link or approval, edit `content/affiliates.yml` (the planner follows it). A product turned off in `content/products.yml` while still listed in `packing.yml` stops the build with a clear message.

## Analytics
Reuses `src/lib/analytics.ts`. Events: `tool_start` (planner started), `tool_complete` (list generated, label = trip type), `packing_trip_edited`, `packing_custom_added` (no text), `packing_item_packed` and `packing_item_need_to_buy` (label = content item id, or `custom`), `packing_recommendation_opened` (once per item per visit), `product_click` (existing), `tool_copy`, `tool_print`. Never sent: custom text, medication, list contents. Registered in `EVENT_VOCABULARY` and `docs/ANALYTICS-SETUP.md`.

## Editing content
Verified route: edit `content/packing.yml` directly (YAML, header comments explain each field). Run `npx vitest run src/test/packing-content.test.ts` and a build; errors name the item and field. A Pages CMS form exists in `.pages.yml` ("Packing planner"); its structure is covered by `src/test/pages-config.test.ts`, but the live CMS edit/save/deploy flow has NOT been tried (see the Cowork steps in `docs/PACKING_PLANNER_QA.md`). Product ids are typed, not picked, because Pages CMS can only reference collections.

### Add an item (example: reusable dog towel)
Append to `items:` in `content/packing.yml`, with a category id, `appears`, optional `when`, `what`, `why`, `quantity`. No code change. This is tested in `packing-content.test.ts` (Journey F).

### Add or change a recommended product
Add the product to `content/products.yml` (with its approved Amazon link in `content/affiliates.yml`), then list its id under the item's `products` with a `caution`. Keep at most two shown (the planner shows the first usable one, plus one alternative that has a `because`).

## Guide module
`{{planner:cabin}}` on its own line in any guide renders "Make this list yours": a plain GET form (works without JavaScript) with days and dogs selectors and the button "Build my cabin packing list", opening `/tools/packing-list?trip=cabin&days=N&dogs=N`. Any trip id from `packing.yml` works. Parameters are validated and clamped, unknown ones are ignored, the canonical stays `/tools/packing-list`. Precedence: choices made on the planner screen win; a preset only initialises the setup form (it does not build a list); if a saved list conflicts with a preset the planner asks "Continue my saved list" or "Start with this preset" and changes nothing until the visitor builds.

## Troubleshooting
- Build fails naming `content/packing.yml`: read the item and field in the message; most often an unknown category, condition or product id, or an inactive product.
- An item never shows: check `appears`/`when` (a conditional item needs a matching trip); optional items without a rule only appear under "Other ideas".
- A product does not show: the product is inactive, has no approved link or maker page, or its entry has no `because` and is second.
- A visitor's old list looks different: `LEGACY_ID_MAP` in `storage.ts` maps v1 ids; changing item ids in `packing.yml` orphans saved state for those ids.

## Build and deploy
`npx tsc --noEmit`, `npx eslint . --quiet`, `npx vitest run`, `NITRO_PRESET=node-server npx vite build`, then `node scripts/verify-site.mjs <base-url>`. Browser QA: `scripts/qa/packing-qa.cjs`. Nothing is deployed by these steps.

## Limitations
No accounts, no sync across devices, no AI; lists live in one browser. Suggestions are rule-based and conservative, not veterinary advice. Quantities are practical starting points, never food weights, calories, doses or water volumes. The old per-item photos were removed (no product photography). Real-device Safari, VoiceOver and the Pages CMS flow are unverified.
