# Edit log W1 (reader-first pass)

Word counts are body words (whitespace-split). Targets from the audits are exceeded in places; I stopped cutting where more cuts would have removed decision content (safety, rules, `{{pick}}` lines, source links).

## dog-car-safety-harness-and-crate-guide: 1,840 to 1,655 (target about 1,500)
- Merged Article 4 as directed: new opening (audit's draft), bold "A leash clipped to a seat belt or a collar is not a restraint" directly under it; table renamed "Harness, crate or carrier?" with a Carrier column and a first row "What not to do" (leash on belt or collar and extension tethers / bungee or generic straps / loose carrier); the four "how to check a harness" steps replaced by one worked example, "How to check a restraint", for the Lucky Kennel Large (model, size, 110 lb test dog, strap kit, July 2022, what it tells you, what it does not prove). Every fact in the example is already in this guide and its listed CPS Large listing source (read 2026-11-19), so no research.unverified item was needed and no CPS-certified harness is named.
- Cut: "Why restraint matters" (one point folded into criterion 3); quick picks reduced to three lines and the booster line removed; "crash-tested" section shrunk to four bullets (quasi-static and door/bracket detail removed); seven criteria merged to five; "Install it correctly", "Before you leave" and "What to buy first" merged into one end checklist; small-dog picks turned into three bullets (Atom 18 lb navigation detail stays in the gear block).
- Safety kept: back seat, skip extension tethers, cargo-anchor caution, crate size and ventilation, carriers secured per maker only, replace after crash, never leave a dog in a parked car, strap kit part of tested setup, "we do not recommend a specific harness". Pick lines, frontmatter, FAQs and gear untouched.
- Declined: audit target 1,500 not reached; the table's extra column and the worked example added about 150 words as planned.

## dog-travel-first-aid-kit-guide: 1,848 to 1,605 (target about 1,400)
- New opening (audit's draft) with the poison control number, scenario removed. Removed the source roll-call, "evacuation-style kit" and Mom Goes Camping sentences (kept the "don't give human painkillers" line), the cat-anaphylaxis aside, the ARCA and Trail Dog contents inventories, product copy in the muzzle and thermometer paragraphs (merged into the add-ons list; pick lines kept), the "where it rides" at-a-glance bullet (now in opening), and the six-month review line.
- Kept: AVMA checklist, charcoal and peroxide limits, poison control numbers and no-vomiting line, muzzle cautions, three-layer table, heat signs, basics, "leave out" list, pre-trip checklist.
- Declined: did not reach 1,400; the at-a-glance box and checklist are the useful core.

## two-large-dogs-in-one-car: 1,603 (file body) to 1,365 (target about 1,250)
- Opening plus "Measure first" sentence; heat and stops moved up directly after the layout; "Space and fit" arithmetic cut to the weight-adds-up sentence and one 44 inch figure; "Common setups" shrunk to four bullets; CPS strap-rupture finding kept in those bullets; vehicle bullets lose barrier dimensions (moved into the barrier paragraph); restraint-laws aside reduced to one sentence; headings made questions.
- Declined: did not remove any `{{pick}}` lines (the brief says to keep pick placement; the audit leaves removals to the editor). All 11 picks remain, with surrounding prose cut. Frontmatter and FAQs (which mention Maine and New York) untouched.

## dogs-in-georgia-state-park-cabins: 1,460 (file body 1,269 per my measure) to 1,222 (target about 1,050)
- Opening now states two dogs, $50 per dog, never alone, 6-foot leash (audit draft). "Can you leave a dog alone" moved directly under the table; message to send moved up beside the request steps and now asks the cottage's fee; park inventory collapsed to three official examples plus a one-line third-party leads sentence; $85 vs $75 discrepancy removed; trails turned into three bullets; private-cabin table replaced by three bullets (kept Cabin Rentals of Georgia and Blue Ridge figures; dropped Sliding Rock Cabins line); three product paragraphs cut to short lines.
- Kept all rules, cancellation terms, written-confirmation step, service-animal question, Tallulah restrictions. All three `{{pick}}` lines kept (not removed; see above); the Explore Georgia cottage numbers were dropped.
- Declined: did not remove Springland and Quencher picks, and did not reach 1,050.

## dog-travel-bowls-and-food-storage: 1,172 (file body 1,172 before) to 967 (target about 850)
- Kept opening and three-bullet list. Bowl section now "Pick one"; Gunner and Kurgo Splash Free removed; Giardia reduced to one sentence; hedge sentences (lid claims, "no page cites independent testing", kibble in a hot car) removed; container paragraphs shortened; washing section and host message moved above portions.
- Kept: FDA four rules, bear-country section (NPS, West Virginia, host message), water from home, wash by hand. All `{{pick}}` lines kept; Gunner stays in `relatedProducts`, so I left the frontmatter alone.

## Tests
`bunx tsc --noEmit` clean; `src/test/content.test.ts` and `src/test/internal-guide-links.test.ts` pass (371 tests); eslint clean on the two TS guides. No test asserted a deleted sentence. A transient content-test failure ("source links inside table rows") appeared once mid-pass and did not reproduce.
