# Review r6: Keep a Dog Cool in the Car, at the Beach and in a Rental (keep-a-dog-cool-on-a-summer-trip)
Verdict: FIX FIRST (safety content and citations are solid; the meta description promises a buy-first answer the page no longer gives, and the vest and pad cards are separated from their text)
Overall: 7.8 / 10 (FAIL)  [Product placement 3 and Differentiation 3 are below the 4 floor]
Editorial score (1-10): Reader appeal 7 | Formatting 8 | Readability 8 | Utility 8 | Commercial integration 6 = 7.4 (target 8: not met)

Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 3 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 3

Method: Playwright Chromium at 390 and 1280 against http://localhost:4176; source content/guides/keep-a-dog-cool-on-a-summer-trip.md compared with git b0f371a~12 (body 3,245 -> 1,366 words, about 58 percent cut; rendered page 1,918 words, 12 min read per the byline, which is too high for 1,900 words).

## Checks
1. Answer in 20 seconds: yes. Dek ("Heat illness is an emergency and a parked car is never safe. Shade, water and rest do most of the work; cooling gear is optional.") and the one-sentence first paragraph (three habits) then "If your dog is overheating now" with 4 numbered steps. Dek and paragraph overlap only slightly (parked car, water). 
2. Citations: 25 markers, 15 sources, all resolve. Click jumps to #src-2 and opens the details; back-link returns and is in view; #src-3 direct load opens the details; keyboard Tab x11 then Enter works. Max stack 2; no tables on the page so none in tables. Three sources (src-5, src-9, src-12) are listed but have no marker (inline publisher links are used instead), so the Sources list contains entries the text never points to by number; harmless but note.
3. Affiliates: 4 buttons, 4 "Affiliate link" labels, one top notice with the Amazon sentence, no "Check the current price". 9 Amazon links, all rel="sponsored nofollow noopener".
4. Tables: none. Page overflow none (390/390).
5. Head: title tag 44 chars, meta description 140, H1 55. 29 internal links all 200.

## Material facts lost vs the older version
- State hot-car-law detail: the four-state table is gone. California's $100 first-conviction fine, North Carolina's statute and Florida's civil immunity for forcibly entering a car (the "can I break the window" question) no longer appear; only the ALDF count, the "call law enforcement first" warning and Texas remain. The meta description still promises "hot car laws". Material for a reader in a hot-car emergency; at minimum keep the one-line Florida immunity and the link to the Michigan State table (kept).
- The "What to buy first, in order" list (bowl or bottle, then vest, then pad) was removed; the meta description still says "which cooling gear to buy first".
- AKC's ground-heat threshold (air 85 F or over) was dropped; the 135 F asphalt at 86 F figure and hand test remain.
- Pad details: five sizes by weight, 12-month warranty, "put a towel on a car seat first" were dropped; the sun/hot-car/chewing warnings remain.
- Cornell prevention items "avoid the hottest part of the day" survive in the sentence; "offer room-temperature water during cooling" and the insulated-bowl remark were dropped (minor).
- "What we could not confirm" and "How sure we are" were removed; the key open points (no safe minutes, thermometer disagreement, no independent vest/pad test, no AVMA) still appear in-line except AVMA (immaterial).

## Top issues (most important first)
1. Where: meta description and "Cooling vests and pads: what to look for". What: the description says "which cooling gear to buy first" but the page has no ordered answer any more; the vest and pad appear as bullets with product links, their cards sit under "Gear for this trip" after Sources, while the bowl and bottle get inline cards. Fix: add one sentence at the end of "Before you go" ("Buy in this order: bowl or bottle, then a vest only if you walk a lot, then a pad only if the dog rests indoors") or change the meta description; move the vest and pad cards up beside their bullets or drop the bottom block.
2. Where: "Never leave a dog in a parked car" (second paragraph, "The law varies."). What: legal paragraph is now only a count and a warning; the Florida immunity and California fine were cut, so a reader cannot tell if they may break a window. Fix: add one sentence: "Florida (section 768.139) gives civil immunity to a person who forcibly enters a locked vehicle to remove a domestic animal if conditions such as calling 911 are met; many states give none." Cite the Michigan State table inline.
3. Where: byline "12 min read". What: 1,918 words is about 8 minutes; the metadata (readingMinutes: 12) is stale and makes the page look longer. Fix: set readingMinutes to 8.
4. Where: "Which dogs are at higher risk" and "Shade and surface heat". What: three paragraphs each carry two cite markers and a second sentence naming Cornell's list; fine individually, but "Our suggestion: run the same test on sand..." and "Bring shade (a pop-up umbrella is our suggestion)" repeat the "(our suggestion)" tag four times. Fix: say once "Where no source is cited, it is our suggestion" and delete the repeats.
5. Where: Sources list. What: src-5, src-9, src-12 have no marker. Fix: either cite them with a marker where used or leave inline links and drop the unused ones.

## What works well
- Emergency block first (signs, 4 steps, vet threshold) with the "call at the signs, not a number" resolution of the temperature disagreement.
- The vest/pad section is honest: no independent test, evidence thin, optional, warnings listed. No forced buying.
- Clean, short page at 1,918 words with no tables to fight on a phone.

## Buyer walkthrough
Reader gets the safety steps, reaches the Water section, sees bowl and bottle cards with who-for/skip-it lines, then reads about vest and pad with links in prose; vest/pad buttons are only at page bottom. No explicit "start with the bowl" close.

## Mobile notes
- First screen: title, dek, hero, share buttons, affiliate notice below fold; the emergency section follows after contents.
- No table or overflow problems.
- Marker tap targets 24 px.

## Specific edits
1. TEXT/SEO: add the buy-in-order sentence or fix the meta.
2. TEXT: add the Florida immunity sentence.
3. SEO: set readingMinutes to 8.
4. TEXT: collapse the repeated "(our suggestion)".
5. STRUCTURE: reconcile the unused source entries.
