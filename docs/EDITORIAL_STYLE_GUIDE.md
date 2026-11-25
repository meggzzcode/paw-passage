# Paws & Passage editorial style guide

Purpose: one consistent voice and structure across the 30 guides, tuned for a dog owner aged 25 to 35 reading on a phone. Consistent quality, not identical templates. Evidence behind it: `docs/EDITORIAL_AUDIT.md`, `docs/ARTICLE_SCORECARD.md`, `docs/editorial/*`.

## 1. Voice
Warm, practical, a little wry, never defensive. Write like a friend who has done the trip and checked the fine print. Use "you" and short sentences. Say what to do before explaining why. Credibility comes from specific, sourced facts and honest "we could not find this", stated once, in the place it matters. Do not invent first-hand experience; where none exists, write from the sources.
Avoid: "it is important to", "ensure", "a comprehensive", "navigate", "in conclusion", stacked hedges ("unknown", "we found no source") in consecutive sentences, repeating "ask the host in writing" more than once per page, and announcing trustworthiness ("we pride ourselves", "carefully researched").

## 2. Opening
Headline: the reader's question in plain words, 45 to 60 characters where possible (the SEO title may differ). The dek is one sentence, 20 to 28 words, that gives the answer or the payoff. The first paragraph is 2 to 3 sentences: answer first, one concrete detail, no roadmap. Never restate the dek in paragraph one.

## 3. Short answer / key takeaway
Use one boxed "Short answer" or "Do this first" block on any guide where the reader has a decision or an emergency. Maximum 4 bullets. It replaces, not repeats, the opening. Skip it on the checklist and data pages.

## 4. Table of contents
One collapsed contents list on mobile, a sidebar on desktop (existing). Show it only when there are 5 or more H2s. Numbered rows (done).

## 5. Length and rhythm
Target 1,400 to 2,200 words for a question guide, up to 2,800 for a comparison or policy-data guide; cut padding rather than facts. Paragraphs of 1 to 4 lines; one idea each. One H2 about every 200 to 300 words, written as a question or a plain promise. Heading case: sentence case. A reader should reach the answer in 10 to 20 seconds and finish the page in under 8 minutes.

## 6. Lists, tables, callouts
Lists for steps and checklists (3 to 7 items). Tables for true comparisons only, at most 3 columns on a phone-first page (stack extra columns as text under each row). One callout style: the tinted "Do this first" or "Heads-up" box, max 2 per page. Bold only for the single phrase a skimmer needs.

## 7. Citations (numbers removed, owner decision 2026-11-24; see `docs/editorial/CITATION-MIGRATION.md`, Phase C)
No numbered markers anywhere. Name the publisher as an inline link in the sentence ("[Georgia State Parks](url) allows two dogs per cottage"). Inline sourcing is light (owner decision 2026-11-25, following the pet-travel peers): link only where the sentence itself names its source, and add no trailing parenthetical publisher tags. If a sentence says "according to a report" or "the maker says", make the publisher part of the sentence and the link text ("[Airbnb's help center](url) says ..."). Link text is the publisher name (short form: CDC, Cornell Vet), never "source", "here" or a number; one link per source per paragraph. Every `sources` entry must be listed in the front matter, which prints it in the Sources list at the end of the page, and any inline link to an outside site must go to one of the guide's own sources (a test enforces both). In the safety and legal guides keep inline attribution for safety-critical, medical, restraint-testing, heat or cold, legal and platform-policy claims only (about 8 inline source links). `scripts/lighten-citations.mjs` removes leftover trailing tags. Never put source links inside table cells; add one line under the table, "Sources for this table: [Airbnb](url) column; [Vrbo](url) column". The page ends with a compact, collapsed Sources list (unnumbered: publisher, linked title, date read). The codemod `scripts/remove-citation-numbers.mjs` converted the old `[[n]](url)` markers; a leftover legacy marker still renders as a quiet parenthetical publisher link, never a superscript.

## 8. Disclosures (proposed; see `docs/DISCLOSURE_AND_TRUST_AUDIT.md`)
Per page: one short affiliate notice before the first product, the Amazon Associates sentence wherever an Amazon link appears, and an "Affiliate link: we may earn a commission if you buy." label under every buy button. Sources box at the end links to methodology and AI use. No "affiliate disclosed" chips, no price reminders, no repeated independence claims.

## 9. Product and booking recommendations
Place gear where the reader needs it: a short "what to buy" block after the relevant section, not a standard block on every page. Only recommend what fits the page's problem; if nothing does, recommend nothing. 2 to 4 picks, each with a who-for and a skip-it line, a spec card, and one button. Booking links (Vrbo) appear once near the top for stay-search guides and once at the end.

## 10. Policy caveats
State the caveat once, next to the claim ("Policies change; this is what the page said on 2026-11-18"). "How sure we are" stays only where it adds guide-specific information (what is confirmed, what is our judgment, what to ask), not generic method.

## 11. Endings
End with one next step: the most relevant guide, tool or booking link, plus a short related-guides row. No recap of the whole page.

## 12. Images
Hero image should match the topic and never repeat across guides; credit in the footer credit list. Add one in-body photo or illustration every 800 to 1,000 words where a good match exists (none required for a flip).
