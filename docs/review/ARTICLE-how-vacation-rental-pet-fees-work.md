# Review: How Pet Fees Actually Work at Vacation Rentals (how-vacation-rental-pet-fees-work)
Verdict: FIX FIRST (best content of the three and honest about its sample, but a self-referencing link, an internal number mismatch, a stat-led title tag and loosely related products hold it back)
Overall: 7.3 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 3 | Buying advice 3 | Product placement 3 | Layout 4 | Trust 4 | SEO fit 3 | Differentiation 5

Review basis: source `content/guides/how-vacation-rental-pet-fees-work.md`; rendered http://localhost:4173/guides/how-vacation-rental-pet-fees-work at 1280 and 390 (screenshots in scratchpad, read). Title tag: "Rental Pet Fees: 25 of 38 State a Fee | Paws & Passage". Meta description: "We read 38 managers' pet pages: 25 state a fee, 3 charge $0, and units vary from per night to one time. See real figures and how to price your trip." Pin row matches the promise. Catalog records read for pet-parents-pawtect-pads, soggy-doggy-microfiber-doormat, soggy-doggy-super-shammy-towel (prose matches keySpecs). The Vrbo affiliate link (aff:vrbo) renders as a sponsored/nofollow link.

## Top 5 issues (most important first)
1. **Where: "Our Airbnb versus Vrbo guide goes deeper on the rest of the comparison."** What: the link target is `/guides/how-vacation-rental-pet-fees-work`, this same page. No Airbnb vs Vrbo guide is linked, and the how-many-dogs guide also sends "Airbnb vs Vrbo with a dog" here, so the reader is promised a deeper guide that does not exist. Fix: edit 1.
2. **Where: "Among the 22 that charge, nightly amounts run from $20 to $75".** What: the table below it gives per-night amounts of "$20 to $50 a night", and the other guide says "$20 a night to a $300 one-time fee"; $75 does not appear as a nightly figure in the table (it appears in the per-pet row). A reader cross-checking finds a contradiction in the lead. Fix: edit 2, verified against src/content/manager-policies.ts.
3. **Where: title tag "Rental Pet Fees: 25 of 38 State a Fee".** What: statistic-led, with no "how", "vacation" or question wording; the H1 and the likely query ("how do pet fees work at vacation rentals", "airbnb pet fee per night or per stay") are better matched than the tag. The tag also reads as if the other 13 managers charge nothing, which the page itself says is not true (13 gave no amount). Fix: edit 3.
4. **Where: "Cut the odds of a damage deduction" (pads, doormat, Super Shammy).** What: the buyer decision this page serves is "which listing, what total", but all three picks are dog-cleanup items placed after the legal and dispute material, with two cards back to back (doormat then towel) and generic "Our pick" labels. The honest hedging ("Nothing you pack guarantees a clean return") is good, but there is no who-should-skip line, and nothing says to ask the host before laying down a mat. Also no pick is tied to the fee question the page answers. Fix: edit 4, edit 5.
5. **Where: the hero position of the fee data ("The short answer" opens with a story).** What: "You booked a cabin for you and a dog, and the checkout page shows a pet charge you cannot quite decode..." is three sentences before the answer ("a pet fee is a formula, not a number"). The key decision (get one total for your dogs and dates) is fine but sits in a bullet list after the stats. Fix: edit 6.

## What works well
- The 38-manager fee table (per night, per pet, tiered, per stay, unknown unit, $0) with named managers, plus the four-unit pricing table and the 4.5-night break-even, is real original content that a top-10 result does not give, and every figure is labelled hypothetical or "as stated on each manager's public page".
- Fees vs deposits vs holds vs damage claims is separated in a clear table with a worked example ($1,010 definite, $1,260 up front), and the ADA section states its limits ("does not automatically apply identically to every privately rented home").
- Affiliate handling is honest: disclosure box above the first sponsored link, `rel` sponsored on every affiliate link, price-free cards, and product claims limited to what the maker pages say (no absorbency figures, "fabric type not stated").

## Buyer walkthrough
1. Lands on the answer plus the bullet stats; the manager table follows within one screen.
2. The reader uses the pricing table and break-even arithmetic to decide between listings; the Vrbo search link appears mid-page in the platform section, a sensible spot.
3. After the legal section, the damage-deduction picks arrive as a separate topic; a buyer who wanted fee advice may skip them.
4. Each card matches its text; the doormat and towel cards sit back to back and look like a pair.
5. Next step: the "questions to send before you book" script and checklist are a strong close; the link to "Airbnb versus Vrbo guide" goes nowhere new.

## Mobile notes
- The Airbnb/Vrbo comparison table renders 358 px in a 350 px wrapper; it nearly fits, but the last words clip at the right edge.
- The 3-column manager table wraps into tall rows, so readable, but the "Managers (examples)" column is long; consider fewer example names per row.
- Page is about 20,200 px on mobile; the checklist and FAQ come late but the "On this page" disclosure is collapsed and usable.

## Specific edits to make
1. TEXT: replace "Our [Airbnb versus Vrbo guide](/guides/how-vacation-rental-pet-fees-work) goes deeper on the rest of the comparison." with "Our [pet-friendly rental checklist](/guides/pet-friendly-vacation-rental-checklist) covers the rest of the booking questions." Also apply the same anchor fix in the how-many-dogs guide (see its edit 9).
2. TEXT: replace "nightly amounts run from $20 to $75" with the figure confirmed from src/content/manager-policies.ts (expected "$20 to $50" to match the table), and re-check the "flat or per-pet amounts from $50 to $300" range against the same file.
3. SEO: change seoTitle to "How Vacation Rental Pet Fees Work (38 Managers)" (under 60 characters before the site suffix is added; check the final length with the suffix), and keep the description, removing any implication that the other 13 are free.
4. PRODUCT: change the three pick labels from "Our pick" to "For puppy or senior-dog accidents" (pads), "Muddy paws at the door" (doormat), "Drying a wet dog" (towel); add "Skip the pads if your dog is house-trained and rarely has accidents" and "Ask the host before putting a mat down" as one sentence each in the prose above the cards.
5. STRUCTURE: put a short transition sentence between the doormat card and the towel card, or merge into one paragraph with one card each, so the two cards do not stack with no text between.
6. TEXT (The short answer): replace the first two sentences with "A vacation-rental pet fee is a formula, not a number: it can be per stay, per night, per dog, or per dog per night, and managers write it in very different ways. Get one total for your dogs and your dates before you book." and move the "$75 for the trip, each night, or each dog" question into the second paragraph.
7. STRUCTURE (mobile): shorten the Airbnb/Vrbo table's longest cells or drop the "Pets and the host" row to keep the table within 350 px.
8. SEO (internal link): add a link to /guides/vacation-rentals-with-no-pet-fee in the "$0" bullet, since the page names three $0 managers and that guide exists.

## Questions for the owner
- Is $75 per night a real figure in the dataset (it would change the lead), or should the range read $20 to $50?
