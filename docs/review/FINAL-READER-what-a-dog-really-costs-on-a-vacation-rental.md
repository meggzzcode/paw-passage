# Final reader review: How Much a Dog Really Costs on a Vacation Rental

Method: built site at localhost:4179, Playwright Chromium at 320/390/768/1440, screenshots viewed (hero, table, card), text and links extracted. No overflow at any width; all internal links 200.

## Scenario test: "one cabin has a pet fee, another does not, which costs less?"
At 390 px the first screen is breadcrumb, title, deck, byline, hero photo, share buttons. The disclosure box and collapsed "On this page" fill the start of screen 2. The answer sentence ("A rental with no pet fee can still cost more than one that charges $40 a night... Compare two rentals on one number: the cost you won't get back") lands at about 1,000 px, the top of screen 2. The worked table ("Two rentals, one real number") starts at about 1,430 px and finishes at the top of screen 3 (about 1,700 px). So the reader understands the method within two screens, but not on the first; the hero photo and tool buttons push it down. The table fits at 320 and 390 without scrolling sideways; first column wraps ("Refundable deposit" on two lines) but stays legible. Clear yes on the comparison idea, a little late.

## Roles
**First-time search visitor.** Intro states the idea in 3 sentences; table labels the numbers as invented ("round and illustrative, not prices from any listing"). Good.
**Mobile traveler.** Table, bullet list "Charges a dog can add", numbered "How to check the real cost of two rentals" and "Booking checklist" are scannable. 9.9k px at 390.
**Skeptical reader.** Strong sourcing and hedging ("we read it as charged once", "treat these as examples and not a market average").

## Observable problems
1. **Arithmetic/wording error (trust).** Under the table: "Rental B has no pet fee and is $50 cheaper, but it asks for $250 more cash on booking day." Table: A cash up front $1,300, B $1,500, so B needs $200 more cash, not $250 (the $250 is the deposit). Must fix; this is the guide's own worked example.
2. **Ambiguous figure.** "One dog for five nights there is $250 plus the $75 cleaning fee: $325 of definite pet cost, and a deposit on top." The $250 is also the deposit amount in the previous sentence ("refundable $250 pet deposit"), so a reader can't tell that $250 is $50 x 5 nights. State "$50 x 5 = $250".
3. The "Pet fee" bullet says "(Airbnb)" while the Vrbo/Airbnb citations in the "Charges a dog can add" list are doubled "(Vrbo, Vrbo)" in the deposit paragraph: repeated source names read like a glitch.
4. Table section "What 38 rental managers say" repeats the stat set from the no-pet-fee guide (see that review); the second table of four managers is useful but a second table on a cost guide dilutes the main one.
5. Product card (doormat) sits in "Damage and extra cleaning charges" after "Photos at arrival and checkout matter more than any gear" and "Skip it if the entry is carpeted": honest, but still a gear card in a pricing guide. Card is clean (purpose first, three facts, one CTA, no price).
6. FAQ shows 8 collapsed questions; no answers visible without clicking, so scanning the FAQ is only question text. Not a defect, but the visible text of those answers is also not repeated in the body.
7. After the body there are checklist, FAQ, "What next?", tools, "Keep reading" and sources, five blocks of onward navigation.
8. Vrbo affiliate link in body is correctly marked sponsored and covered by the top disclosure.

## Scores (1-10)
| Criterion | Score |
|---|---|
| Immediate usefulness | 8 |
| Audience relevance | 9 |
| Natural voice | 7 |
| Scannability | 8 |
| Distinctiveness | 7 |
| Editorial flow | 7 |
| Appropriate length | 7 |
| Commercial relevance | 6 |
| Trust and accuracy | 6 |
| Overall polish | 8 |
| **Average** | **7.3** |

## Verdict: READY WITH MINOR FIXES
Fix the $250/$200 sentence before publishing (it is a visible error in the key example), clarify the $325 line, consider moving the table above the hero or shortening the pre-content stack on mobile.
