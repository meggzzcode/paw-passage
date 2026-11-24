# Review (round 4): Large Dog Friendly Vacation Rentals: How to Find One (vacation-rentals-that-welcome-large-dogs)
Verdict: FIX FIRST (all content issues from r3 are fixed on the rendered page; what remains is one template defect, spec text that still appears up to three times per product, and a thin, car-heavy gear section)
Overall: 8.8 / 10 (FAIL)
Scores (1 to 5): Answer clarity 5 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 5 | SEO fit 4 | Differentiation 5
(sum 35 / 4 = 8.75, shown as 8.8; no criterion below 4, so the blocker is a 0.25 gap. Every 4 below has a named issue.)

Evidence: rendered page at 1280 and 390 via Playwright Chromium against localhost:4174, full text read, screenshots in the scratchpad r4/ folder. Head: title "Large Dog Friendly Vacation Rentals: Limits and Checks" (54), meta description 146 chars with the primary phrase once and "under 35 to 65 lb", canonical present, og:title matches, 3 JSON-LD blocks, one H1 (52 chars). Six Amazon links (three product-name links, three "See it at Amazon" buttons), all rel="sponsored nofollow noopener", tag pawspassage-20, three distinct ASINs matching the three products. No unlinked product mentions. All internal links return 200, including the three /gear anchors. Disclosure sits under the byline and an Amazon Associate line is present. No prices, ratings, stock or urgency. Mobile scrollWidth 390; both tables are 544 px inside a 350 px scroll wrapper.

## Round-3 issues: verified on the rendered page
1. "35 to 65" vs the table: FIXED. Dek, meta description, short answer and pin CSV row 31 all say "under 35 to 65"; the Cabin Rentals of Georgia row reads "Under 35 lb".
2. Card "why" repeating specs: FIXED for the "Why we picked it" line (now the job: "For a big dog's own non-slip spot on a hard rental floor...", "For a heavy dog and a high vehicle floor, if you can lift 18 lb..."). The grey description line under the chips still repeats the specs, see issue 2 below.
3. Gear intro sentence "None of these makes a rental accept your dog": FIXED.
4. Filler sentence in the short answer: FIXED.
5. Pick-card button contrast: NOT FIXED. Computed colours are oklch(0.39 0.05 172) dark green text on oklch(0.53 0.11 45) rust; visually it is low contrast, by my estimate under 3:1. Template change, still outstanding.
6. Pin CSV row 31: FIXED (title is the new H1, description matches the meta).

## Top issues (remaining, most important first)
1. **Pick-card button is hard to read.** Where: all three "See it at Amazon" buttons. What: dark green label on a rust fill. It is the conversion element, and it is the weakest-contrast text on the page. Costs Layout (4). Fix: edit 1.
2. **Product specs still appear up to three times.** Where: the Loft Wander bed (prose "water-resistant ripstop top and a waterproof, non-slip bottom"; chips "M 27x36 in, L 36x48 in open"; grey line "A roll-up travel bed with a water-resistant ripstop top and a waterproof, non-slip bottom"); the hammock (63 x 56 in and "lifetime guarantee" in prose, chips and grey line); the ramp (47 to 87 in, 18 lb, aluminum, slides closed in prose, chips and grey line). What: the card is a restatement of the paragraph directly above it. Costs Product placement (4) and Reader flow (4). Fix: edit 2.
3. **Gear is two car items on a rental-search page.** Where: "Gear for a big dog, after the rental says yes". What: only the bed helps at the stay; hammock and ramp are about the drive. This is honest and the page says so, but a buyer who landed on "large dog friendly vacation rentals" gets one rental-side pick. Costs Buying advice (4). Fix: edit 3 (copy, no new product claims).
4. **Same headline stat repeated four times.** Where: dek, short answer ("six state a weight limit, and the limits run from under 35 to 65 pounds"), table intro ("Here are the six managers that state one"), "How sure we are". What: the short answer and the table intro cover the same ground within one scroll. Costs Reader flow (4). Fix: edit 4.
5. **SEO gaps in long-tail coverage.** Where: H2 set and FAQ. What: the FAQ covers pets allowed, large definition, "considered", filter, breed rules, ground floor; it misses "large dog friendly vacation rentals near me / by state" and "do vacation rentals charge more for big dogs". The title tag drops "How to Find One", which is fine, but the page has no short numbered "how to find one" list for a snippet beyond the checks. Costs SEO fit (4). Fix: edit 5.

## What works well
- The six-manager table with a per-dog versus combined column and worked examples (AMI's shared 50 lb, a 60-pound dog clearing Brindley Beach and failing Elk Springs), plus the decode table and the paste-ready host message: nothing comparable in the generic top results.
- "Find candidates" gives named, cited starting points and says plainly "Those are marketing pages, not your reservation, so still get the yes for your dog in writing."
- Honest gear section: maker figures labelled as the maker's (the ramp's 300 lb "independently tested" with no tester named), skip-it lines on each pick, and a buy-first list that starts with "Nothing, until the rental says yes to your dog in writing."

## Buyer walkthrough
1. Lands on the dek, which answers the question in one sentence; the short answer repeats it with the Lab example.
2. Reads the weight table and decode table, copies the host message, tries the tool.
3. Uses "Find candidates" and the /stays filter, then the five checks.
4. Reaches gear after "How sure we are"; picks bed, hammock or ramp by problem; each card links to Amazon and to /gear specs.
5. "What to buy first" closes with tool, packing list, checklist, /gear and two siblings. No dead end.

## Mobile notes (390 px)
- No page-level horizontal scroll (scrollWidth 390, page about 16,300 px); both tables scroll inside their wrapper.
- Hero fills the width; lazy images below the fold report zero natural width until scrolled, not a defect.
- Cards are full width; the button text contrast is the same weak pairing as desktop.

## Specific edits (ready to apply)
1. STRUCTURE. Pick-card component: set the button label to cream (about oklch(0.97 0.01 90)) on the rust fill, or darken the fill, for at least 4.5:1.
2. TEXT. Drop the grey description line on all three picks, or reduce it to a different fact. Suggested replacements: bed "Roll-up and handled, so it travels with you." ; hammock "Hooks to both headrests and covers the whole bench." ; ramp "Slides shut for storage." Remove the repeated "lifetime guarantee" from either prose or chips.
3. TEXT. Add one sentence before "In the rental": "Most of this is about the drive; for the rental itself, the checks above (steps, floor, yard) matter more than any product."
4. TEXT. Cut the table intro to "Here are the six managers that state one (public pages, read 2026-11-18). The 38 managers are a convenience sample, not a survey." and drop the repeated count from the short answer.
5. SEO. Add FAQ "Do vacation rentals charge more for large dogs?" answered from the pet-fee guide (link it) and one sentence in "Find candidates" suggesting the destination plus "dogs any size" search; keep it free of invented numbers.

## Questions for the owner
- None blocking.
