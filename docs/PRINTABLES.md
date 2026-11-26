# Printables, shortcuts and itineraries

## Printables

Six browser-printed pages: adventure bucket list, indoor and outdoor discovery bingo, weekend adventure planner, adventure achievement certificate and family adventure checklist. They are plain HTML laid out with the design tokens and `src/design/print.css`; the "Print or save as PDF" button calls `window.print()` and the browser's "Save as PDF" makes the file. No PDF service, no upload, no external fonts. The certificate's name fields exist only in the page's memory.

- Routes: `/printables` (index) and `/printables/<slug>`. Two samples (bucket list, indoor bingo) are open to everyone; the other four are for customers with the full Passport. The content is generic, so this is a product choice, not a security gate. Non-sample pages are `noindex`.
- Content lives in `src/components/printables/data.ts`. It must stay generic: kinds of adventures and things to notice, never an adventure title, id or instruction. `src/test/printables.test.tsx` fails if a free adventure title, an `adv-` id or an instruction marker appears. Before adding copy, also check it against the private library titles (a one-off local check; the private titles are not in this repo).
- Copy: printable headers and lines may use the approved phrases sparingly (docs/MARKETING.md section 0), for example "Collect adventures, not just things." on the bucket list; no counts other than "100+", no gifting wording, and no suggested captions or hashtags.
- My Passport link: render `<PrintablesCard />` (exported from `src/components/printables/PrintablesIndex.tsx`).

## Discovery shortcuts

`src/passport/shortcuts.ts` defines ten presets. Each is a `SessionFilters` object run through the existing `rank` / `pickSurprise`, so hard eligibility always comes first. Three presets add one plain check on the adventure's own time or cost that `SessionFilters` cannot say (no additional spending is `costMax === 0`, weekend is `minutesMax >= 60`). For visitors without the full Passport a shortcut filters the public previews using the same fields as `/previews`, or leads to the free intro quiz when previews carry nothing to filter on (family, surprise). Render `<Shortcuts />` on Discover and on the free starter.

## Itineraries

`src/config/itineraries.ts` holds six `{slug, title, teaser, ids[]}` combinations of existing adventure ids (3 or 4 each). Titles and teasers never name an adventure. `src/test/itineraries.test.tsx` checks the shape and that free ids exist in the public library. Premium ids cannot be checked in a public test; run the one-off check against the private library JSON whenever an itinerary changes (every id must exist with `status: published`). Customers can save a combination as a handpicked collection (never twice) and plan an adventure with the existing planner. An adventure that does not fit the dog's profile is marked "May not suit your dog" and is not offered for planning. Render `<Itineraries />` on Discover or Collections.
