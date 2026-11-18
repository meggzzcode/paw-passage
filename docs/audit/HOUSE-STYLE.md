# House style for rewrites (the bar for a 9)

Voice: a friend who did the homework. Plain, warm, specific, a little wry. Not a compliance memo, not a brochure.

1. **Open on the reader's problem** in the first 2 sentences (a real moment: a charge on their phone, a host who said two dogs max). Then the answer within the first screen. Never open with a definition or "Traveling with your furry friend".
2. **Hedging cap:** at most 2 hedge phrases per page ("we could not confirm", "we found no", "do not assume", "ask the host"). Say a limit once, in the one box below or the unknowns table, never repeat it per section. Do not open sections with the same label ("Direct answer:", "Short answer:", "Bottom line:") more than three times per page; vary or drop them.
3. **One plain "How sure we are" box** (3 to 5 short lines) near the end replaces repeated methodology paragraphs. Keep the three levels in it (confirmed by a source we cite / what most people report, with the count, small non-random sample / unknown, with who to ask). Remove the long certainty explanations elsewhere. Keep the unknowns table with the "Check for yourself" column.
4. **Length:** 1,200 to 2,000 words of body text unless the page is a table-heavy reference. Cut repetition, restated caveats, near-duplicate sections and filler first. Never cut a number, citation, table row or source that supports a claim you keep; if you remove a claim, remove its citation and source entry too (every source must be cited, every citation must match the sources list order; tests enforce this).
5. **No unverifiable first-hand claims.** Do not write "we tested", "in one check we ran", or any experience we cannot back with a source or a dated screenshot. Hypothetical examples must be labelled hypothetical and use round numbers.
6. **Use our 38-manager dataset** (src/content/manager-policies.ts; tables on the /data/pet-policies page) where it fits, with the sample-size note ("38 managers, convenience sample, read 2026-11-18"). Use real ranges and named managers, not invented dollar figures.
7. **Every dated number** (fee, limit, count, deadline) gets its "as of" date in the sentence or table caption.
8. **One clear next step** at the end: a tool (/tools/pet-cost-check, /tools/will-my-dog-be-accepted, /tools/packing-list, /tools/checklist) or a related guide, with a link. Link other tools naturally in the body too.
9. **No stigma:** no breed stereotyping, no single-incident news used as a pattern.
10. **Affiliate honesty:** never write that "some links are affiliate links" unless the page really contains an approved affiliate link (none are approved right now; the site adds its own notice automatically when one is).
11. YAML front matter: quote any value containing a colon. Keep seoTitle at or under 43 characters and seoDescription 120 to 155. Do not touch status, approvedBy or approvedOn.
12. After editing run: cd /home/user/paw-passage-aff && bunx vitest run src/test/content.test.ts src/test/content-pipeline.test.ts 2>&1 | tail -8 (other agents are editing other files at the same time; ignore failures in files you do not own). Do not run builds. Do not commit.
