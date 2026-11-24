# Review (round 2): Pet-Friendly Vacation Rental Checklist: What to Check Before You Book (pet-friendly-vacation-rental-checklist)
Verdict: FIX FIRST. Close: the eight gates now sit in the first paragraph and the gear is tied to rules, but the title tag is long and awkward, the card names repeat brands, and a few structural loose ends keep it just under the gate.
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5  (sum 35 / 4 = 8.8)

Method: read src/content/guides/pet-friendly-vacation-rental-checklist.ts, round-1 review, FIX and SEO notes; rendered http://localhost:4173/guides/pet-friendly-vacation-rental-checklist at 1280 and 390 and read the screenshots. Head: title "Pet-Friendly Vacation Rental Checklist: 8 Gates | Paws & Passage" (64 chars rendered; seoTitle 47), meta 154 chars. Keyword at the start of H1, title and first sentence. No horizontal scroll at 390; the page has no tables. All eight Amazon links are `sponsored nofollow noopener`; prose names (iCrate, Loft Wander, gate, pen) link to the right products. No prices, ratings or stock claims for our products; the two manager fee figures are dated and attributed. No invented testing. Hero (dog on a porch doormat) fits a rental arrival. Pin row in docs/pinterest-pins.csv updated and matches.

## Round-1 issues: status
1. SEO title dropped the keyword: FIXED (keyword-first title and description).
2. Intro buried the answer: FIXED (the eight gates are named in the first paragraph, dangling sentence gone).
3. "8 questions" versus about 35 boxes: FIXED (H2s carry gate numbers 1 to 8, and "Everything below is detail" line). "Service animals" is left as an unnumbered section.
4. Gear at the foot with "Our pick": FIXED (moved after "One message to send", labels name the rule, "skip it if" lines, "Most stays need none of this").
5. Misleading Airbnb vs Vrbo anchor and over-linking: FIXED (platform line reworded; the fees guide is now linked three times, down from five).
Spec cards (icon, brand, name, three chips) are accurate to the catalog and clear.

## Top 5 issues (most important first)
1. **Title tag reads oddly and runs long (SEO fit 4).** Where: head title "Pet-Friendly Vacation Rental Checklist: 8 Gates | Paws & Passage" (64 chars). What is wrong: "8 Gates" is internal jargon that a searcher does not recognise, and the rendered title passes 60 characters so the brand suffix will be cut. Fix: seoTitle "Pet-Friendly Vacation Rental Checklist for Dog Owners" is 53 and rendered 70, too long; use "Pet-Friendly Rental Checklist: 8 Things to Ask" only if the owner accepts dropping "vacation"; otherwise "Pet-Friendly Vacation Rental Checklist" (38 chars, rendered 55) which keeps the exact query at the front. Keep the "eight gates" wording in the meta description.
2. **Spec card shows a duplicated brand (Layout 4, Product placement 4).** Where: the pen card "MIDWEST HOMES FOR PETS / MidWest Homes for Pets MidWest Exercise Pen with Door". What is wrong: brand twice in the same card; the other three cards are clean. Fix: shorten the card title in content/products.yml to "MidWest Exercise Pen with Door" (or have the card skip the brand when the name already begins with it); the same product shows the same defect on the portable-fence guide.
3. **Service animals section is orphaned and gear competes with the checklist (Reader flow 4).** Where: H2 "Service animals" sits between gates 7 and 8 and "One message to send" with no gate number; "What to buy for the lines you flagged" is about a third of the page for a booking checklist. What is wrong: a reader scanning the eight gates cannot place it, and the four cards stretch a 7 minute checklist. Fix: rename to "Service animals (not covered by gate 1)" with one lead sentence "Skip the pet rules if your dog is a service animal; use the platform's accessibility team"; reduce the gear block to the two strongest rule matches (crate and bed) and send the gate and pen to one sentence each with the existing links to the pen guide and /gear/pens-and-gates, or keep four but remove the "Compare it with the other pens" repeat.
4. **Buying advice is thin for the booking-side purchase (Buying advice 4).** Where: "What to buy first" (three items). What is wrong: it tells the reader nothing about the decision a booker actually makes, such as comparing two listings; nothing says which gate to run first when two candidates are close. Fix: add item "4. If two listings tie, choose the one whose approval names your dogs in writing and whose cancellation deadline is later; do not trade those for a better photo." (no products, no prices).
5. **Missing long-tail and share fit (SEO fit 4).** Where: FAQ and H2 set. What is wrong: no heading answers "what questions should I ask a vacation rental host about pets" or "pet policy for vacation rental" directly though "One message to send" does; the share image and pin title are fine. Fix: rename "One message to send" to "What to ask the host: one message to send" and add a FAQ "What should I ask a host about bringing a dog?" answered in 40 to 60 words from gates 1 to 3 without new claims.

## What works well
- The first paragraph states the eight gates in about 90 words and ends on an action rule ("stop at the first line you cannot answer"), so the featured-snippet answer is on the page above the first heading.
- "Bookable / pending / reject" plus the paste-ready host message turns a checklist into a decision; the 38-manager fee example (per night per pet versus per stay) is attributed and dated.
- The gear block is honest and rule-led: each card follows a house-rule line, says who should skip it, and the pen card sends readers to the dedicated pen guide.

## Buyer walkthrough
1. Lands from "pet friendly vacation rental checklist", sees the keyword in the H1 and the eight gates in the first paragraph.
2. Works down the gates, copying the host message; marks each listing bookable, pending or reject.
3. Reaches "What to buy for the lines you flagged" after the message, matches a purchase to a rule, clicks the linked name or the card button.
4. Friction: the pen card name duplicates the brand; gear text is a lot of scroll for readers who only want the checklist.
5. Next: "What to buy first", "Before you leave" (packing guide), checklist tool and fees guide; no dead ends.

## Mobile notes
- scrollWidth 390; no tables, so no sideways scroll; checkboxes wrap cleanly.
- Pick cards stack and keep the button and "Details and specs" on one row; the pen card title wraps to three lines.
- The first phone screen is title, dek and buttons; the gate list is about two screens down.

## Specific edits to make
1. SEO: seoTitle "Pet-Friendly Vacation Rental Checklist" (keep the "eight gates" description).
2. PRODUCT: card title for midwest-exercise-pen-with-door without the repeated brand.
3. STRUCTURE: retitle "Service animals" as in issue 3; trim the gear block to the two strongest rule matches or remove the repeated pen-guide sentence.
4. TEXT: add the tie-break item to "What to buy first" (issue 4).
5. SEO: rename "One message to send" and add the FAQ "What should I ask a host about bringing a dog?" (issue 5).

## Questions for the owner
None.
