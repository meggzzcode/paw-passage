# Per-article review rubric (reader, buyer, structure, marketing)

Each published guide gets its own review file `docs/review/ARTICLE-<slug>.md`. The reviewer reads the page as a rendered web page (desktop and a 390 px mobile view) AND the source file, as three people in turn: a first-time reader who landed from search, a buyer who wants to decide what to purchase, and a site owner judging structure and marketing. Review only: do not edit any guide, product file or code. Be specific to THIS article: no generic advice that would fit any guide.

## 1. Reader pass
- Does the title and first screen promise exactly what the article delivers? Is the answer or the key decision visible in the first screen without scrolling past filler?
- Does it make sense start to finish? Name any paragraph that is confusing, repetitive, over-hedged, jargon-heavy, or that contradicts another paragraph. Quote the first 8 words of each problem passage.
- Scannability: heading hierarchy, section order, table of contents, paragraph length, tables (do they read on a 390 px phone without sideways scroll?), lists, callouts. Is anything buried that a reader needs?
- Is the length right for the question? What would you cut or move up?
- Trust: are claims sourced where a reader would doubt them? Any statement that sounds like a testing or ranking claim we cannot support? Is the researched-not-tested stance clear without being repeated to exhaustion?

## 2. Buyer pass
- Where in the article does the reader reach a decision moment ("what do I buy?")? Is there a clear answer, a short comparison, and a "what to buy first" close?
- Product placement: is each pick introduced by the problem it solves, in the paragraph where the reader feels it? Does each pick card's "why we picked it" match what the text claimed? Are product names clickable wherever mentioned (prose and tables) and do they go to the right product?
- Is the buying advice complete: who each product is for, who should skip it, size or fit check, what to confirm before buying, and what it does not do? Would a skeptical buyer trust it?
- Is there anything the buyer needs that is missing (sizing, compatibility, rules, a cheaper alternative, a decision shortcut)? Is the number of products right (too few = no choice, too many = paralysis)?
- Does the affiliate relationship read as honest and unobtrusive (disclosure present near the first link and on the page, links marked sponsored, no urgency tricks, no price or stock claims)?
- Conversion path: after buying advice, where does the reader go next (related guides, /gear hub, tools, stays)? Dead ends?

## 3. Structure and layout (rendered page)
- Above the fold on mobile and desktop: title, dek, hero image relevance, reading time, byline/updated date, disclosure placement.
- Pick card layout: position, spacing, button clarity, the "Details and specs" link, how cards look next to tables. Any card that sits in a place where it interrupts the argument?
- Images: hero matches the topic; alt text sensible; nothing overlapping or cut off.
- FAQ block: do the questions match real searches for this topic? Do answers repeat the body or add something?
- Sources block and "Keep reading" block: placed sensibly? Any broken or odd links?
- Any rendering defect (stray markdown, odd characters, misaligned table, broken link, double spaces, leftover template text).

## 4. Marketing and SEO fit
- Title tag and meta description (read from the page head): do they match the likely search intent, are they compelling and accurate, within length?
- Primary question this article should rank for; does the H1 and the first paragraph answer it directly? Name 2 to 3 long-tail questions it answers well and 2 it misses.
- Pinterest/share fit: does the pin title and image (public/pins/<slug>.jpg, docs/pinterest-pins.csv row) fit the article's promise?
- Internal linking: inbound and outbound links sensible; does it link to the right 2 to 3 siblings?
- Differentiation: what does this page offer that a typical top-10 result does not (original data, a decision table, a sourcing method)? If nothing, say so.

## 5. Output format (use exactly this)
```
# Review: <article title> (<slug>)
Verdict: SHIP / FIX FIRST / REWORK  (one line why)
Scores (1 to 5): Answer clarity | Reader flow | Buying advice | Product placement | Layout | Trust | SEO fit | Differentiation
Top 5 issues (most important first): each with where (quote the first 8 words or the heading), what is wrong, the exact fix suggested.
What works well (3 bullets, specific).
Buyer walkthrough: in 5 lines, what a buyer does from landing to clicking a product, and any friction.
Mobile notes: 3 bullets from the 390 px view.
Specific edits to make (numbered list; each edit is a ready-to-apply replacement sentence or instruction, and says whether it is TEXT, STRUCTURE, PRODUCT, or SEO).
Questions for the owner (only if a decision is truly needed).
```
No scores without evidence: each score under 4 must be backed by an issue above. Never suggest adding prices, ratings, stock claims, invented tests or invented first-hand experience.
