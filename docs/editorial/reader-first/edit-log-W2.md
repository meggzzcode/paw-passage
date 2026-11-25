# Edit log W2 (reader-first pass)

Word counts are body words (whitespace split of the body only).

## vacation-rental-secure-fenced-yard: 2,040 -> 1,451 (audit target about 1,300)
- Moved: new 70-word friend opening (sketch, tape-measure photos, gate video, "partially fenced" = leash-only, invisible fence is not a fence); evidence pack checklist and decision table now straight after it.
- Cut: "The short answer" (folded into opening), AKC sentence, duplicated Height/Climbers/Diggers bullets (kept as one weakest-section paragraph), listing glossary shrunk to four bullets, both cabin-operator paragraphs and the Airbnb host-guidance paragraph (kept one Airbnb help link: ask even when the filter says pets allowed), gate type explainer, product maker specs (anchors, warranty, 16.3 in door, rope diameter), invisible-fence duplication kept only once, Next step cut to two links.
- Kept: no stakes/alterations without permission, pool and hot tub separation, CPSC scoped as child guidance, invisible/electric fence not an enclosure, leash first and perimeter walk, "repair or refund is not automatic" backup plan, cleaner/driveway gate questions, can't-leave-alone link, both `{{pick}}` lines.
- Left a little over target (+12 percent) because the checklist, table and gate questions are the core and I did not want to cut them.

## portable-dog-fence-and-playpen-guide-for-rentals: 1,407 -> 1,141 (target about 1,100)
- Opening kept. "What a pen can and cannot do" merged into the opening section (ladder/mesh line and secure-yard link kept). Tie-out paragraph shortened, tether-law sentence dropped. "How to choose" is now a do/skip table. Products cut to who-it-is-for and who-should-skip; read-date sentence, stabilizer detail, 146.5 in, dimension caveats removed; crate paragraph cut to one line.
- Kept: collar/tag removal and put-back, microchip line, stop-using signs, never use the gate at the top of stairs on tension alone, hazards, ask-the-host list, all `{{pick}}` lines.

## vacation-rentals-that-welcome-large-dogs: 2,005 -> 1,453 (target about 1,350)
- Slug and format (TS) unchanged; no `#anchor` links to it exist elsewhere. New opening from the audit; "this page doesn't list rentals" removed. Table kept (links moved to a Sources line under it because the content test forbids links inside table rows); paragraph under it cut to the audit's three lines. "No weight limit" and "Decode the wording" merged into "How to read the listing"; Airbnb/Vrbo section is one sentence; "Where to look" cut to the `aff:vrbo` search link and the stays-filter line, folded into the message section. "Five checks" moved straight after the message with the route and floor items first. Breed-rule section cut to three sentences; furniture-cover section cut to a short paragraph plus the `{{pick}}`.
- Kept: message template and "what to save" untouched, "do not round the weight down", "If the answer is no, do not bring the dog anyway" with the Hearthside $500 warning, service-animal pointer, "do not plan around carrying a heavy dog up steps".
- Dropped inline links to Hostaway, Vacasa, GoPetFriendly and the Vrbo help pages (sources stay in frontmatter).

## cold-weather-dog-gear-for-winter-cabin-trips (md): 1,895 -> 1,273 (target about 1,200)
- Reframed as the coats/cold-gear guide: new opening, action dek ("Which layer, which boots, and when to skip both"), "At a glance" kept. Cold limits replaced by a three-row do-this table plus one line on source disagreement; signs-to-head-inside and vet-call signs kept intact. Fleece and vest paragraphs cut to who-for/who-skip (specs and size-chart contradiction removed; the vest-is-not-a-car-restraint line kept). "What we could not confirm" and "Our routine" deleted. Boots section cut to boots-on-salt/optional-on-clear, wipe-down, poison control, ask the host; ingredient list, Polar Trex sizing, AKC fit and wax paragraphs removed (they live in the boots guide). Super Shammy specs cut. Car/antifreeze section kept.
- Declined: linking to `/guides/dog-boots-or-paw-wax-for-winter`. It is still `status: draft`, and `internal-guide-links.test.ts` fails on links to non-public guides. Add the link in the "Boots, salt and de-icer" section and "At a glance" boots bullet once that guide publishes.
- Kept all `{{pick}}` lines (including boots and towel cards).

## Checks
`bunx tsc --noEmit` clean; eslint clean on the three TS guides; content, internal-guide-links, seo-internal-links and retired-guide-redirects tests pass. Full vitest: see final report.
