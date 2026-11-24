# Review (round 3): Can You Leave a Dog Alone in a Vacation Rental? (can-you-leave-a-dog-alone-in-a-vacation-rental)
Verdict: FIX FIRST (every round-2 text issue is fixed and the page is strong; the KONG section now repeats "supervised use only" four times and contradicts itself, and the crate card still shows a fence icon)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 5 | Differentiation 5
(Sum 35 / 4 = 8.75, rounded 8.8. No criterion below 4; under the 9.0 gate by one point. Edits 1 to 3 below add at least two points.)

Basis: source read in full; r2 review, FIX (incl. Round 3) and SEO notes read; rendered at http://localhost:4173/guides/can-you-leave-a-dog-alone-in-a-vacation-rental at 1280 and 390, screenshots and card crops read.
Head: rendered title "Leave a Dog Alone in a Vacation Rental? | Paws & Passage" (56 chars, keyword first, matches SEO primary "leave dog alone in vacation rental"); meta description 148 chars, one keyword use, CTA verb "See". No page-level sideways scroll at 390 (scrollWidth 390); the one table (544 px inside a 350 px wrapper) scrolls in its wrapper with the swipe hint. No prices, ratings, stock or urgency claims; no invented first-hand experience. Affiliate links: 3 products, all Amazon with tag, rel "sponsored nofollow noopener"; each product is linked in prose, card and "What to buy first". Pin row matches the title and description.

## Round-2 issues: verified
1. Buy-first said three times: FIXED. The phrase "buy first" now appears once (the "What to buy first" heading); the two inline sentences are gone.
2. Orphan "If you have time, repeat that at home...": FIXED (removed).
3. Unsourced "KONG is the usual one" and "straightforward way": FIXED ("one the maker sells for it"; opinion line removed).
4. KONG/crate card icons: PARTLY FIXED. KONG now shows a bone and the kicker reads "Supervised use only: practice at home". The iCrate card still shows a picket-fence icon (it looks like a fence, not a crate). Data change in products.yml, not done.
5. "four of 38" repeated: FIXED (intro only, plus the manager list lead-in, which is fine).

## Top 5 issues (most important first)
1. Where: "For step 2, a stuffable rubber toy is one option..." (the KONG paragraph). What: "supervised use only" or its equivalent is said four times in one paragraph and again in the card kicker, card line and the buy list; it also contradicts itself: the paragraph says "ask your vet whether to leave one with your dog alone" and then "not for unattended time", and the ASPCA-sourced routine step 2 says to leave a stuffed toy while the card says never. Fix: edit 1 (one limit statement, one coherent instruction).
2. Where: iCrate spec card icon. What: a picket fence on a crate card is the only card on this page that looks like the wrong product. Fix: edit 2 (set the icon in content/products.yml for midwest-icrate-dog-crate to the crate/kennel icon).
3. Where: "Barking is the usual way an absence becomes a problem." What: an unsourced generalisation; the cited Afar page only says a dog may howl and barking can alert a nearby host. Fix: edit 3.
4. Where: "What to buy first", third bullet ("Any rule: the KONG Classic is for practice at home..."). What: a "Any rule" bullet that tells the buyer to buy a product they should not use unattended sits beside a "buy nothing" bullet; the honest line is fine but it is the weakest pick for a page about being alone. Fix: edit 4 (optional; owner may also drop the KONG).
5. Where: crate guidance. What: no size help beyond "confirm with the maker" (honest, since the catalog has no weight chart). Not blocking. Fix: none needed; note only.

## What works well
- The rule table plus four named managers' alone-time wording and the Airbnb camera section read precisely and state the guest-device gap instead of guessing.
- "What to buy first" now has a no-purchase branch ("No unattended pets: buy nothing for this"), the strongest honesty signal for an affiliate page.
- Clean source discipline: durations are attributed to a named writer and labelled as not a study; the "How sure we are" block separates cited, reported and unknown.

## Buyer walkthrough
1. Lands from "can you leave a dog alone in an airbnb": H1, dek, then a one-sentence answer and four sourced bullets.
2. Reads the rule table and manager wording, reaches the crate rule and the iCrate card where the "crated when alone" rule is explained.
3. Gate card for a dog that dislikes crates, each with a skip line.
4. KONG as practice-only; "What to buy first" maps host rule to product or to nothing.
5. Friction: the KONG paragraph is repetitive and the crate icon is a fence.

## Mobile notes
- First screen is H1, dek, meta row and the top of the hero; the answer is one scroll down, after the disclosure and contents box.
- No sideways page scroll; the rule table scrolls inside its box with the "Swipe sideways" hint.
- Cards stack cleanly; chips wrap; checklist shows checkboxes only.

## Specific edits to make
1. TEXT: replace the whole KONG paragraph (from "For step 2, a stuffable rubber toy..." to "...the maker's limit is supervised use only.") with: "For step 2, a stuffable rubber toy is one option, and the KONG Classic is one the maker sells for it. It comes in six size bands by dog weight, from XS (up to 5 lb) to XXL (85 lb and up); size up if your dog is between sizes or chews hard, and note the maker says no toy is indestructible. [[19]](https://www.kongcompany.com/kong-classic/) The maker's page says to use it under supervision, so treat it as practice only: try it at home while you are in the room, so the first stuffed toy is not also the first night in a strange house. Do not leave one with your dog alone unless your vet agrees, and stop using one that is damaged."
2. PRODUCT: in content/products.yml set the icon of midwest-icrate-dog-crate to the crate or kennel icon (not the fence).
3. TEXT: change "Barking is the usual way an absence becomes a problem." to "Barking is the risk the sources flag most."
4. TEXT (optional): in "What to buy first" change the KONG bullet to "- **Practice at home:** the KONG Classic, with you in the room; the maker says supervised use only."
