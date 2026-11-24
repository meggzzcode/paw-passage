# Review (round 6): site-level pages (/stays, /affiliate-disclosure, /about, /terms)
Verdict: SHIP with minor fixes. Rendered at 390 and 1280 from localhost:4176; all four return 200, no horizontal overflow (scrollWidth equals viewport at both widths).

## /stays
- Head: title "Dog-friendly stays and their pet policies | Paws & Passage" (58 chars); meta 149 chars ("Dog-friendly cabins, cottages and beach houses, with pet fee, dog limit, weight limit and fenced yard shown for each. Anything unconfirmed is marked."). Both in range and accurate; the meta promises pet fee shown for each, and cards say "Pet fee: Not confirmed" when unknown, so honest.
- Intro: accurate ("whose pet details we read from its public listing", "Not confirmed is unknown, not a yes"). Weaknesses: two paragraphs, about 9 lines at 390, so the first card appears only at the fold bottom; the second paragraph reads "Try Will my dog be accepted?, or see..." (question mark plus comma, link text ends in "?"); "pet policies of 38 managers" sits beside a "32 stays" count, which will confuse (managers vs listings). Fix: shorten to one paragraph; reword to "Not sure your dog will qualify? Use the acceptance tool, or see the pet policies of 38 managers."
- Every card shows a large "Photos are on the booking page" placeholder; 32 repeated tiles dominate the scroll at 390. Not a defect of wording, but consider a shorter placeholder.
- Links in intro all resolve (tools/will-my-dog-be-accepted, data/pet-policies, how-vacation-rental-pet-fees-work, vacation-rental-secure-fenced-yard).

## /affiliate-disclosure
- Amazon sentence present and correct: "As an Amazon Associate I earn from qualifying purchases." in its own paragraph. It also states the per-button label wording and the top-notice rule, which matches what the two guides actually render (top notice, per-button "Affiliate link · We may earn a commission if you buy.", sponsored attribute).
- No retired tool references. Minor: the "How this works in practice" block is four dense paragraphs; the Amazon statement is attached to the end of a sentence about where links go; fine.
- Meta 134 chars, title 37 chars.

## /about
- No retired tool references (mentions packing list and checklist, both live). Wording accurate and honest ("new", no invented people). "pet policies" wording not misused. Meta 114 chars: just under the 120 target; add a few words.
- Slight stale detail: "Last updated 2026-11-18" while stays and tools changed later; harmless.

## /terms
- Last updated 2026-11-23. No retired tool references (packing list and checklist exist). Content accurate; affiliate section points to the disclosure. Meta 76 chars (short of 120; non-critical on a legal page).

## Footer (all pages)
- Vrbo line "VRBO is a trademark or registered trademark of Expedia, Inc." is 12 px, cream at 75% alpha on dark green (oklch 0.39), roughly 7:1 contrast: readable at 390 and 1280. The copyright line carries the affiliate note and "How we earn money" link. "Pet policies we have read" wording appears accurately on the home page and list-your-property ("pet policies we have read from public pages"); not on these four pages.
- Retired tools: /tools/cost-calculator, /tools/pet-cost-check, /tools/host-questions answer 301; none is linked from these four pages or the two guides (grep of rendered HTML found no references).
