# Citation migration (owner approved, 2026-11-24)

Replaces the numbered-citation experience described in `docs/editorial/citation-investigation.md` and `docs/EDITORIAL_STYLE_GUIDE.md` section 7. Shipped in two commits: Phase A (new renderer, codemod, two pilot guides) and Phase B (codemod on every published guide). Nothing was pushed.

## Design as built

**Renderer** (`src/components/site/Markdown.tsx`, `src/components/site/SourcesList.tsx`, `src/styles.css`)
- `[[n]](url)` renders as a small superscript `<sup class="cite"><a id="cite-n-k" href="#src-n">`. It stays on the page (no new tab), is keyboard focusable, shows a 2 px terracotta focus ring, and has an invisible 24 x 24 px hit area (a `::after` box, so layout is unchanged). The old address in the marker is no longer output; it is only used for validation.
- The first marker, or the first inline link to a source's exact URL, for each source gets id `cite-n-1` (later ones `cite-n-2`...). The page passes `sourceUrls` to `Markdown` so inline links get ids.
- The Sources section keeps its heading ("Sources and how we researched this") and gets a one-line intro: "Sources, with the date we read each. We research from published sources; we have not stayed at, inspected or tested anything covered here. See how we research and our use of AI tools." The links go to `/methodology` and `/editorial-standards#use-of-artificial-intelligence` (the existing "Use of Artificial Intelligence" heading id). The old "reviewed N competitor pages" sentence was dropped, as the disclosure audit proposed.
- The list is a `<details id="sources-list">` with a "Show the N sources" summary. Each entry is an `<li id="src-n">` with publisher, the title as an outbound link, "(read 2026-11-18)", and a "back to text" arrow link to `#cite-n-1` (only when the body cites that source). Without JavaScript it is a normal disclosure box. With JavaScript, a small effect opens it on load and on `hashchange` when the hash is `#src-n`, scrolls the entry to the middle of the screen and focuses its title link. The entry targeted is tinted (`:target`).
- Cited rule (`src/content/citations.ts`, used by tests and the codemod): a source counts as cited when the body has a `[[n]]` marker or an inline Markdown link to its exact URL. `sources` frontmatter is unchanged.

**Codemod** (`scripts/migrate-citations.mjs`; run with bun)
- `bun scripts/migrate-citations.mjs --dry-run [--only slug,slug] [--json]` prints a per-guide report; `--write` rewrites files. It handles every published guide in `content/guides/*.md` and `src/content/guides/*.ts` (29 guides; the three Markdown drafts are skipped). It only edits the body; for the .ts guides it edits the template literal.
- (a) Validate each marker URL against `sources[n-1].url`. A mismatch is renumbered only when the URL occurs once in sources; otherwise it is reported and left alone.
- (b) Drop a marker for a source already cited earlier in the same paragraph or list item (a prior inline link counts too). Collapse runs of more than 2 adjacent markers to 2, but never drop a source's only citation.
- (c) Remove markers inside table rows. If that leaves a source with no citation at all, add "Sources for this table: [[n]](url), ..." under that table.
- (d) If the source's publisher name is in the 80 characters before a marker (same sentence, not inside an existing link), link the first mention to the source URL and drop the marker. Matching: the full name, the name without a parenthetical, and an all-caps acronym in parentheses (AVMA). Single-word names must match case exactly (so "Patch", "Apple" or "Fi" do not match ordinary words); multi-word names are case-insensitive whole-word matches.
- Steps repeat until nothing changes, and the script refuses to write a guide if any source cited before would lose all citations or if a second run would change the result (idempotent). Both checks passed for all 29 guides.

## Results

Measured on the built HTML of all 29 public guides (before = build of HEAD b0f371a, after = build of the migration), `sup.cite` counts: **802 markers before, 646 after** (-156, -19 percent). Of the 156 removed: 66 became inline publisher links, 116 were table-row markers (14 re-added as "Sources for this table" lines), 7 same-paragraph duplicates, 4 stack drops.

| Guide | Sources | Markers before | Markers after | Inline links | Duplicates dropped | Stack markers dropped | Table markers removed | Table source lines added | HTML check (entries / frontmatter, broken anchors) |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|
| airbnb-pet-damage-charge-after-checkout | 15 | 29 | 16 | 5 | 0 | 0 | 8 | 0 | 15 / 15, 0 broken |
| can-dogs-go-in-a-rental-pool-or-hot-tub | 17 | 18 | 16 | 1 | 0 | 0 | 7 | 1 | 17 / 17, 0 broken |
| can-you-leave-a-dog-alone-in-a-vacation-rental | 19 | 26 | 22 | 4 | 0 | 0 | 0 | 0 | 19 / 19, 0 broken |
| christmas-week-in-a-cabin-with-a-dog | 18 | 30 | 24 | 5 | 0 | 0 | 3 | 1 | 18 / 18, 0 broken |
| cold-weather-dog-gear-for-winter-cabin-trips | 12 | 46 | 33 | 4 | 2 | 1 | 7 | 1 | 12 / 12, 0 broken |
| dog-hiking-gear-for-a-cabin-vacation | 14 | 34 | 30 | 4 | 0 | 0 | 0 | 0 | 14 / 14, 0 broken |
| dog-life-jacket-for-lakes-and-beaches | 17 | 33 | 26 | 7 | 0 | 0 | 0 | 0 | 17 / 17, 0 broken |
| dog-ramp-or-steps-for-the-car-and-cabin | 11 | 27 | 19 | 0 | 0 | 3 | 5 | 0 | 11 / 11, 0 broken |
| dog-travel-bowls-and-food-storage | 15 | 28 | 19 | 0 | 0 | 0 | 9 | 0 | 15 / 15, 0 broken |
| dogs-in-georgia-state-park-cabins | 17 | 28 | 22 | 1 | 1 | 0 | 10 | 3 | 17 / 17, 0 broken |
| how-many-dogs-can-you-bring-to-a-vacation-rental | 15 | 24 | 12 | 8 | 0 | 0 | 5 | 1 | 15 / 15, 0 broken |
| how-vacation-rental-pet-fees-work | 7 | 13 | 9 | 0 | 0 | 0 | 6 | 1 | 7 / 7, 0 broken |
| if-your-dog-gets-loose-on-a-trip | 20 | 41 | 33 | 1 | 1 | 0 | 7 | 1 | 20 / 20, 0 broken |
| keep-a-dog-cool-on-a-summer-trip | 15 | 29 | 25 | 2 | 2 | 0 | 0 | 0 | 15 / 15, 0 broken |
| new-years-eve-with-a-dog-in-a-vacation-rental | 22 | 41 | 26 | 6 | 0 | 0 | 10 | 1 | 22 / 22, 0 broken |
| protect-your-car-interior-from-a-dog-on-a-road-trip | 13 | 22 | 18 | 4 | 0 | 0 | 0 | 0 | 13 / 13, 0 broken |
| puppy-at-a-vacation-rental | 14 | 24 | 21 | 3 | 0 | 0 | 0 | 0 | 14 / 14, 0 broken |
| two-large-dogs-in-one-car | 16 | 33 | 23 | 0 | 0 | 0 | 10 | 0 | 16 / 16, 0 broken |
| vacation-rental-with-a-reactive-dog | 17 | 27 | 25 | 2 | 0 | 0 | 0 | 0 | 17 / 17, 0 broken |
| vacation-rental-with-a-senior-dog | 32 | 40 | 38 | 2 | 0 | 0 | 0 | 0 | 32 / 32, 0 broken |
| vacation-rentals-with-no-pet-fee | 19 | 23 | 22 | 1 | 0 | 0 | 4 | 1 | 19 / 19, 0 broken |
| what-a-dog-really-costs-on-a-vacation-rental | 13 | 21 | 13 | 2 | 0 | 0 | 15 | 2 | 13 / 13, 0 broken |
| dog-car-safety-harness-and-crate-guide | 16 | 53 | 47 | 2 | 0 | 0 | 4 | 0 | 16 / 16, 0 broken |
| dog-friendly-cabin-packing-list | 22 | 26 | 26 | 0 | 0 | 0 | 0 | 0 | 22 / 22, 0 broken |
| dog-travel-first-aid-kit-guide | 8 | 33 | 30 | 2 | 1 | 0 | 0 | 0 | 8 / 8, 0 broken |
| pet-friendly-vacation-rental-checklist | 11 | 11 | 11 | 0 | 0 | 0 | 0 | 0 | 11 / 11, 0 broken |
| portable-dog-fence-and-playpen-guide-for-rentals | 7 | 9 | 9 | 0 | 0 | 0 | 0 | 0 | 7 / 7, 0 broken |
| vacation-rental-secure-fenced-yard | 11 | 11 | 11 | 0 | 0 | 0 | 0 | 0 | 11 / 11, 0 broken |
| vacation-rentals-that-welcome-large-dogs | 19 | 22 | 20 | 0 | 0 | 0 | 6 | 1 | 19 / 19, 0 broken |
| **All 29** | 463 | 802 | 646 | 66 | 7 | 4 | 116 | 14 | all match, 0 broken |

Automated validation over the built HTML (every guide): every `#src-n` and `#cite-n-k` link resolves to an element id (0 broken); sources shown equals the frontmatter count in all 29; every entry shows its read date; no markers inside tables; stacks of more than 2: 3, all in `vacation-rental-with-a-senior-dog` (see deferred).

## Phase C: numbers removed (owner decision 2026-11-24)

The owner decided the numbered markers go entirely. Phases A and B above are kept as history; the superscript, `cite-n-k` ids, "back to text" links, display-number map and `#src-n` hash-open effect no longer exist.

**Counts (29 published guides, 440 sources).** Body markers `[[n]](url)` before: **609** (plus 2 in FAQ answers of the packing-list guide, removed by hand). After: **0**. They became **573 inline links**: 251 named-publisher links (the first mention of the publisher in the sentence is linked), 309 parenthetical publisher links in 287 groups (at most 2 links per group), and 13 plain links in "Sources for this table" lines; 36 same-paragraph repeats were dropped. Built-HTML check on all 29 guides: 0 `sup`/`cite` elements, 440 of 440 frontmatter source URLs appear as links in the article body, Sources list entries 440 of 440, 0 broken `#` anchors. Validation: 0 marker URLs differed from `sources[n-1].url`. Hand edits: one sentence in if-your-dog-gets-loose-on-a-trip was split at its semicolons (three cases in one sentence would have needed 3 links), and the 2 FAQ markers were deleted. The 3 draft guides (breed-restrictions, no-pets-rental, pet-friendly-listing-red-flags) were not converted; if one is published later, a leftover marker renders as a parenthetical publisher link.

**Codemod** `scripts/remove-citation-numbers.mjs` (bun; `--dry-run`, `--write`, `--only a,b`, `--json`, `--show slug`, `--clutter`): validates URLs, drops repeats of a source in a paragraph or list item, links the publisher name when it is in the sentence (within 320 visible characters, never inside a longer name of another publisher such as "AKC Reunite"), otherwise adds a parenthetical at the end of the sentence, max 2 links per sentence. A paragraph with more than 2 parentheticals loses later single links whose publisher is already linked there when the source is linked elsewhere in the guide (clutter pass). It writes a guide only if every source it cited before is still linked and a second run changes nothing (idempotent: a re-run reports 0 markers).

**Publisher names** come from `sources[].publisher` through `publisherDisplayName` in `src/content/citations.ts`: notes such as "(2018-12-04)", ", 2022", "via ..." are stripped, then a small override map shortens long names (Cornell University College of Veterinary Medicine -> Cornell Vet, U.S. CDC -> CDC, U.S. Department of Justice -> DOJ, American Kennel Club -> AKC, Georgia State Parks (Georgia DNR) -> Georgia State Parks, ...). The same map lists other ways a publisher is written in running text, used to find the mention to link.

**Renderer.** No `sup.cite`. A parenthetical publisher link is wrapped in `<span class="src-paren">` and styled quietly: body text colour, no underline, underline plus terracotta on hover or focus, normal font size. Named-publisher links keep the normal article link style. External links open in a new tab as before. A leftover legacy `[[n]](url)` renders as "(Publisher)" in the same style (`Markdown` takes `sources` for the name; an unknown n shows the address host). `SourcesList` is an unnumbered `<ul>` (publisher, linked title, "read DATE") inside the collapsed `<details id="sources-list">` with the same intro linking /methodology and /editorial-standards#use-of-artificial-intelligence.

**Tests.** Removed: numbering, display-order, `cite-n-k` back-link and `#src-n` assertions, marker range and URL-match tests, the 3-stack exception. Added or changed: no numbered markers in published guides, every source linked by its exact URL, parenthetical labels are publisher names, at most 2 parenthetical links per sentence, no source links in table rows, `publisherDisplayName`, quiet parenthetical markup, legacy-marker fallback, unnumbered Sources list.

**Known limits.** 5 paragraphs still have 3 or 4 parenthetical links (airbnb-pet-damage-charge-after-checkout, if-your-dog-gets-loose-on-a-trip, keep-a-dog-cool-on-a-summer-trip, what-a-dog-really-costs-on-a-vacation-rental, dog-car-safety-harness-and-crate-guide): each link is a different source cited nowhere else in the guide. 7 parenthetical groups pair two pages of the same publisher and show the name twice (for example Georgia State Parks, Georgia State Parks). Parenthetical links beat superscripts for readability but make sentences a little longer.

**Screenshots** (`docs/editorial/img/nonum-{before,after}-{390,1280}-{fees,harness,largedogs,firstaid,georgia,cost}.png`): before = frozen round-7 build, after = this change.

## Mismatches found and how fixed

None. All 802 body markers already used exactly `sources[n-1].url` (the test in `src/test/content.test.ts` also enforces this), so no renumbering was needed. Unresolved: 0.

## Deferred / known limits

- **Three stacks of 3 markers remain** in `vacation-rental-with-a-senior-dog` (after "set fees by property, so get the amount", after "matches the vet sources", and after "bring their own bedding"). Each marker is that source's only citation in the body, so the codemod will not drop one. An editor should re-cite them in separate sentences or move one into the sentence it supports. The test allows exactly these 3.
- **Tables now carry no per-row attribution.** The ramp guide's spec table lost its five product-page markers (each source stays cited in the matching "best for" paragraph); the fees table lost its Airbnb and Vrbo markers (cited elsewhere), and has a "Sources for this table" line for the two Vrbo pages that would otherwise be uncited. Anyone who wants per-row sources should add a "Source" column by hand.
- **Inline conversion is conservative and mechanical.** It only links a publisher name that appears in the 80 characters before the marker. Names written differently (for example "Cornell" for "Cornell University College of Veterinary Medicine") keep their numbered marker. The full "link the publisher in every sentence" rewrite of the investigation was not attempted.
- The investigation counted 1,011 rendered markers across 30 guides; the current tree has 29 public guides and 802 markers (one guide was merged away and the page counts moved since).
- FAQ answers are plain text and may contain `[[n]]` text counted by the old test; the codemod does not touch frontmatter.
- Keyboard check scripts and the screenshots below are one-off; there is no browser test in the repo.

## Verification

- Tests: `bunx tsc --noEmit`, `bunx eslint . --fix` (0 errors) and `bunx vitest run` (564 tests) pass. New or changed tests: marker markup and ids, inline-link back-link id, Sources list markup (details, ids, publisher, read date, back-links, methodology and AI-use links), `content.test.ts` cited rule (marker or inline link), no stacks of 3+ (except the 3 known), no markers in table rows.
- Keyboard and anchors in Chromium (Playwright) on the built pages, 390 px and 1280 px, ramp and fees guides: Tab reaches the first marker (10 and 14 tab stops), outline is solid 2 px terracotta, Enter sets hash `#src-1`, opens the list, scrolls the entry into view and focuses its title link; Tab then Enter on "back to text" returns to `#cite-1-1` with the marker focused; loading `/guides/slug#src-2` opens the list with the entry in view; with JavaScript off the list is a working `<details>`; no page errors, no horizontal scroll. Hit test of the 24 px box (centre and +-11 px) resolved to the marker link when scrolled clear of the sticky header.

## Screenshots (docs/editorial/img/)

Before = build of HEAD, after = this change. Pilot guides: `fees` = how-vacation-rental-pet-fees-work, `ramp` = dog-ramp-or-steps-for-the-car-and-cabin; `cold` = cold-weather-dog-gear-for-winter-cabin-trips (Phase B sample).
- `cite-before-{fees,ramp,cold}-{390,1280}-{text,table,sources}.png` and `cite-after-...` (text = densest paragraph or list, table = first table, sources = the Sources box, opened in the after set).
- `cite-after-focus-{390,1280}.png` (marker with focus ring), `cite-after-jump-{390,1280}.png` (after Enter: list open, entry tinted and focused).

## How to reproduce

`bun scripts/migrate-citations.mjs --dry-run` (after migration it reports no changes), `NITRO_PRESET=node-server bunx vite build`, then serve `.output`.
