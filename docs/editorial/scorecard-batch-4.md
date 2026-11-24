# Editorial scorecard, batch 4 (6 rental/car-gear guides)

Method: frozen build http://localhost:4174, Playwright Chromium at 390px and 1280px, article body innerText (includes TOC, FAQ, sources list). Phone scroll heights measured at 800px viewport height. No horizontal page scroll on any page. No real-user testing was done; all judgments are editorial.

## Batch-wide patterns (read first)
- Every page is 3.4k-3.8k rendered words (2.3k for the checklist) and 19-21k px on a phone (about 24-26 screens). The reader's question is usually answered in the first 400 words; the rest is evidence apparatus.
- Trust is asserted far more than it is felt. On every page the reader meets, roughly: top affiliate box + "Affiliate links disclosed" chip + "N sources cited" chip + "How sure we are" + "Sources and how we researched this" + "We haven't stayed at or inspected any property" + "Read our editorial standards", plus per-card caveats. Count is 7-9 explicit self-assurances per page, 12-19 hits for trust vocabulary.
- Template boilerplate leaks: "We haven't stayed at or inspected any property for this guide" appears on the two car-gear pages, where no property is relevant.
- Numbered citation markers render as bare superscript digits, 11.6px font, 6px wide by 15px tall tap targets (aria-label "Source N"). They bunch ("1 2", "2 4") and sit mid-sentence. Two before-examples: two-large-dogs: "...injured if thrown against each other. That is Vetstreet's advice, not a quoted CPS statement. 1" and yard: "...treats jumping, climbing and digging as different problems. 1 2". Too small to tap on a phone; copy-paste yields stray digits.
- Same closing stack on all six: "What to buy first" + FAQ + "What next?" + "Keep reading". Several pages open with a "What to buy:" line AND have a "Buying checklist" AND a "What to buy first" section (portable fence does it three times).
- Voice: evidence-hedging is the house style ("we found no source", "we could not confirm", "common advice, not tested", "our practical suggestion, not a source's rule"). It is honest, but at this density it reads like a compliance memo, not a travel publication. Almost no first-person traveller anecdotes (and "we haven't stayed" bars them).
- Overlap: portable-fence and secure-fenced-yard both carry the same MidWest/Carlson pen cards and a "bring your own boundary" section; checklist, puppy and yard all re-explain "ask the host in writing"; car-interior and two-large-dogs both re-explain "covers are not restraints" and point to the harness/crate guide.
- Tables scroll sideways inside their wrapper on phone (two-large-dogs: table 544px in a 350px frame). Usable but hides the third column ("What is unknown").

---

## 1. Pet-Friendly Vacation Rental Checklist: What to Check Before You Book
- URL: /guides/pet-friendly-vacation-rental-checklist | Source: src/content/guides/pet-friendly-vacation-rental-checklist.ts
- Words: about 2,260 rendered (3,104 incl. source data) | Phone scroll 15,340 px | Citations 11 | Trust/disclaimer sentences about 12 | Tables 0, boxes 5, product cards 4 (6 Amazon links)
- A Fit: strong. Core booking-moment query, right audience.
- B Intro: "A pet-friendly vacation rental checklist comes down to eight checks: written approval for your exact dogs, the complete price, house rules you can follow, a layout and yard that suit your dog, cancellation terms, legal walks and an emergency vet. Clear all eight for the exact listing before you pay anything nonrefundable, because a "pets welcome" badge does not cover a pet fee, a cleaning charge or a no-dogs-alone rule that the photos never mentioned." Good: promise plus stakes. First sentence is a 45-word list; split it.
- C Length: KEEP at about 2.3k, the best-sized of the six. Padded: "How sure we are", "Sources and how we researched this", duplicate "What to buy first" + "What to buy for the lines you flagged" (two buy sections).
- D Voice: "Most stays need none of this. Buy only for a line you flagged" is the right tone. Weaker: "Everything below is detail for these eight. The first box in each section is the one that can stop a booking" (meta-narration).
- E Format: 8 numbered checks, 17 H2s, boxes per section, "message to send" block. Scannable and screenshot-worthy. The H2 "Permission (check 1)" labels are good; 17 H2s is a lot.
- F Affiliate: natural; products only attach to flagged lines and the page says most stays need none. Best commercial restraint of the batch.
- G Verdict: LIGHT EDIT. Scores: appeal 7, format 8, readability 7, utility 9, commercial 8. AVERAGE 7.8.
- Issues: (1) Merge the two buy sections in src/content/guides/pet-friendly-vacation-rental-checklist.ts into one; (2) split opening sentence; (3) cut or collapse "How sure we are" to one line; (4) enlarge citation tap targets (shared component). Priority P2.

## 2. Portable Dog Fence for Rentals: Pens and Playpens When There Is No Yard
- URL: /guides/portable-dog-fence-and-playpen-guide-for-rentals | Source: src/content/guides/portable-dog-fence-and-playpen-guide-for-rentals.ts
- Words: about 3,440 rendered (4,579 incl. data) | Phone scroll 19,400 px | Citations 17 | Trust sentences about 6 | Tables 3, boxes 6, product cards 4 (20 Amazon links, so cards link repeatedly)
- A Fit: good for the search; the audience is narrow (cabin with deck, no fence).
- B Intro: "The cabin has a deck, a lawn and no fence, and your dog needs to be outside for more than a leash walk. A portable dog fence for a rental is usually a freestanding folding pen, used with the host's permission and with you there, and the host's rules decide whether it works." Best scene-setting opening of the six.
- C Length: CUT to about 2.2k. Padded: "Buying checklist" + "The short answer" + "What to buy first" all say "tall freestanding pen, one-hand latch"; "What to check on any pen" repeats card specs; tie-out section is long for a thing it tells you not to buy.
- D Voice: card copy reads like spec-sheet recital: "eight ventilated mesh panels, reinforced corners and protected seams, a removable top". "Why we picked it: The maker lists six 24-inch all-metal panels at 28 inches high..." followed by "no dog-size limit is stated" (hedge as a product line).
- E Format: 3 tables, 6 boxes; tables scroll sideways on phone. Cards plus a table plus prose give the same specs three times.
- F Affiliate: mostly natural (reader needs a pen), but 20 Amazon links for 4 products is heavy; each card has two or three links.
- G Verdict: STRUCTURAL EDIT, and consider MERGE with vacation-rental-secure-fenced-yard (see #6). Scores: appeal 6, format 6, readability 6, utility 7, commercial 6. AVERAGE 6.2.
- Issues: (1) In .ts, collapse intro "What to buy" + "Buying checklist" + "What to buy first" into one; (2) one product table, drop duplicate card spec lists; (3) cut link count per card to one button; (4) shorten the tie-out section to 3 sentences. Priority P1.

## 3. Dog Car Seat Cover, Hammock or Cargo Cape: Protect Your Car on a Road Trip
- URL: /guides/protect-your-car-interior-from-a-dog-on-a-road-trip | Source: content/guides/protect-your-car-interior-from-a-dog-on-a-road-trip.md
- Words: about 3,430 rendered (4,124 incl. data) | Phone scroll 19,480 px | Citations 31 | Trust sentences about 9 | Tables 2, boxes 8, cards 6 (15 Amazon links)
- A Fit: good commercial query, broader than rentals; relevant to road-trippers. Title now says what the page is.
- B Intro: "Muddy paws on a pale bench seat, claws on a door panel, hair in every seam: a long drive with a dog is hard on a back seat. A dog car seat cover, a hammock or a cargo cape keeps most of that off your upholstery, and the right one depends on where your dog rides and how big the vehicle is." Strong. But the standfirst "None of these is a crash restraint." leads with a negative before the benefit.
- C Length: CUT to about 2.3k. Padded: "The gap between the seats" ("We have no maker page we can cite for one" - a section on an item it cannot recommend), "What we could not confirm" (repeats inline hedges), "Seat belts, anchors and headrests" overlaps the harness guide.
- D Voice: "We found no source on drying a wet dog before loading." "We have no source on how rental companies treat cover straps or anchors." Honest but reads like gaps in a research file, not advice. "Chewy says water-resistant or machine-washable covers are worth prioritizing" cites a retailer for common sense. Boilerplate "We haven't stayed at or inspected any property" is wrong for this page.
- E Format: 31 markers is the highest density in the batch; markers cluster after every sentence in the middle sections. Decision is cover vs hammock vs cape; a single comparison table at the top would serve phone readers better than 17 H2s.
- F Affiliate: natural, since product choice is the topic, but the booster seat and travel crate pull toward other guides.
- G Verdict: STRUCTURAL EDIT. Scores: appeal 6, format 6, readability 6, utility 7, commercial 7. AVERAGE 6.4.
- Issues: (1) Move "which one" decision to top as a 3-row picker; (2) delete "The gap between the seats" and "What we could not confirm"; (3) cut citations on common-sense lines (target under 15); (4) remove property boilerplate from the methodology block for non-stay guides (template, shared component). Priority P1.

## 4. Taking a Puppy to a Vacation Rental: Age Rules, Accidents and Fees
- URL: /guides/puppy-at-a-vacation-rental | Source: content/guides/puppy-at-a-vacation-rental.md
- Words: about 3,420 rendered (3,944 incl. data) | Phone scroll 19,400 px | Citations 24 | Trust sentences about 17 (highest) | Tables 1, boxes 7, cards 4 (8 Amazon links)
- A Fit: excellent. A distinct, anxious, high-intent audience, with a genuinely uncommon angle (managers' own age rules).
- B Intro: "Some vacation rentals do allow puppies and some do not, and the rule is often one sentence you have not read yet. In our reading of 38 vacation rental managers' public pet pages (a convenience sample, read 2026-11-18), 5 state a minimum age or a no-puppies rule, so a "pet friendly" listing may still exclude a 14-week-old dog." Hook is good; the parenthetical sample caveat in sentence two slows it, and 5 of 38 is a weak-looking number for a headline claim.
- C Length: LIGHT CUT to about 2.8k. Padded: "Age and vaccination: what the official pages say" ends in "That is the whole of what we can source" and a "ask your vet" row; "What we could not confirm" duplicates it.
- D Voice: "We could not source a schedule and give none / Ask your vet" in a table cell. Hedging stacked: "The practical move is to ask three things first" (generic framing). Otherwise concrete, quotes real manager wording ("may bring up to two well-traveled, adult dogs").
- E Format: the "Age rules in the managers' own words" quoted block is the page's best feature. Single table; first-night plan is a list. Good.
- F Affiliate: pads, crate, KONG, play yard are plausible puppy buys; "If not, start with the pads" ordering is sensible. Natural, mild.
- G Verdict: LIGHT EDIT. Scores: appeal 7, format 7, readability 6, utility 8, commercial 7. AVERAGE 7.0.
- Issues: (1) In .md, drop the vaccination section to 2 sentences plus the vet link; (2) delete "What we could not confirm" (fold the one real gap into the table); (3) trim trust lines (17 hits). Priority P2.

## 5. Traveling With Two Large Dogs in a Car: Crates, Harnesses and Barriers
- URL: /guides/two-large-dogs-in-one-car | Source: content/guides/two-large-dogs-in-one-car.md
- Words: about 3,830 rendered (4,442 incl. data), longest | Phone scroll 20,800 px (longest) | Citations 41 (most) | Trust sentences about 14 | Tables 2, boxes 9, cards 5 (14 Amazon links)
- A Fit: real niche, valid pain. But it overlaps dog-car-safety-harness-and-crate-guide, and the page admits it has no two-dog test.
- B Intro: "Two big dogs, one back seat and a long drive: each needs a restraint, and no single product covers both. The short answer: when you travel with two large dogs in a car, give each dog its own restraint rated for that dog's weight..." Good opener, but then a second "The short answer in four lines" H2 repeats it.
- C Length: CUT to about 2.5k. Padded: "Why two dogs is not just double one", "What not to do", "Unknowns" (table), "How sure we are", "Before you buy" - all restate "one restraint per dog, weight-rated, single-dog evidence only". "Two crates in a wagon or SUV: the arithmetic" is useful; keep.
- D Voice: "That is Vetstreet's advice, not a quoted CPS statement." / "our practical suggestion (not a source's rule)" / "Unknown: what any independent test shows for two dogs, and the rows above." Over-hedged and self-referential; a 25-35 reader will not parse "a named independent listing behind it, but that listing is narrow".
- E Format: 41 markers, 9 boxes, 544px-wide tables in a 350px frame on phone (third column hidden). Weakest scannability of the batch.
- F Affiliate: recommended items (Sleepypod, Lucky Kennel, Ruffwear, Kurgo) are fitting and the safety framing is responsible, but the "Why we picked it" cards contain more caveats than reasons ("we could not read a maker page", "test is old"). That undermines the buy and reads forced.
- G Verdict: STRUCTURAL EDIT, possibly MERGE into the dog car harness/crate guide as a "two dogs" section. Scores: appeal 6, format 5, readability 5, utility 7, commercial 5. AVERAGE 5.6.
- Issues: (1) In .md, collapse the two "short answer" blocks into one; (2) fold "Unknowns", "How sure we are" into 3 bullet lines; (3) make the layout table 2 columns with the unknown folded into the second; (4) reduce markers to under 20; (5) decide merge with harness guide. Priority P1.

## 6. How to Find a Vacation Rental With a Truly Secure Fenced Yard
- URL: /guides/vacation-rental-secure-fenced-yard | Source: src/content/guides/vacation-rental-secure-fenced-yard.ts
- Words: about 3,380 rendered (4,149 incl. data) | Phone scroll 20,740 px | Citations 11 | Trust sentences about 7 | Tables 2, boxes 6, cards 3 (7 Amazon links)
- A Fit: strong and distinctive; anxious-owner query, practical.
- B Intro: "A fenced yard vacation rental is only dog-safe if its weakest fence section, its gates and the people who open them hold up for your dog. The listing says "fenced yard," and the photo shows a nice lawn, but nothing in that photo tells you where the fence ends, what the gate gap is, or who else can walk through." Best-written opener of the batch; concrete and slightly wry.
- C Length: CUT to about 2.6k. 20 H2s is too many. Padded: "Make a decision without false precision", "Measure the weakest section, not the average" and "Check that the boundary forms a continuous loop" can be one inspection section; "Invisible and electric fences" and "A fenced pool yard" are 2 tangents; "If the yard falls short" duplicates the portable-fence guide.
- D Voice: strongest and least hedged. Slips: "Make a decision without false precision", "Request a small evidence pack" (consultant-speak). "Even a good yard needs supervision" is nice and plain.
- E Format: many short H2s (good for scanning, but 20 is a wall of headings on a phone); 2 tables; the "Decode the listing" definitions ("Fenced property", "Enclosed patio", "Natural boundary") are the page's most shareable part.
- F Affiliate: gear is a footnote (Knot-a-Leash, two pens) and the page says buy last. Natural.
- G Verdict: LIGHT EDIT, with section consolidation. Scores: appeal 7, format 6, readability 7, utility 8, commercial 7. AVERAGE 7.0.
- Issues: (1) In .ts, merge the loop/weakest-section/gate sections to one "Inspect it" section; (2) shorten the pen fallback to a link to the portable-fence guide; (3) cut pool and invisible-fence tangents to a paragraph each. Priority P2.

---

## Score table (1-10)
| Article | Appeal | Format | Readability | Utility | Commercial | AVERAGE | Verdict | Priority |
|---|---|---|---|---|---|---|---|---|
| pet-friendly-vacation-rental-checklist | 7 | 8 | 7 | 9 | 8 | 7.8 | LIGHT EDIT | P2 |
| portable-dog-fence-and-playpen-guide-for-rentals | 6 | 6 | 6 | 7 | 6 | 6.2 | STRUCTURAL EDIT / MERGE with #6 | P1 |
| protect-your-car-interior-from-a-dog-on-a-road-trip | 6 | 6 | 6 | 7 | 7 | 6.4 | STRUCTURAL EDIT | P1 |
| puppy-at-a-vacation-rental | 7 | 7 | 6 | 8 | 7 | 7.0 | LIGHT EDIT | P2 |
| two-large-dogs-in-one-car | 6 | 5 | 5 | 7 | 5 | 5.6 | STRUCTURAL EDIT / MERGE | P1 |
| vacation-rental-secure-fenced-yard | 7 | 6 | 7 | 8 | 7 | 7.0 | LIGHT EDIT | P2 |
| Batch average | 6.5 | 6.3 | 6.2 | 7.7 | 6.7 | 6.7 | | |

## Shared (cross-article) fixes
1. Citation marker component: bigger tap target (min 24px), bracket style, and cap at one marker per claim cluster. Example current output: "...as different problems. 1 2".
2. Methodology footer: make property wording conditional (not on car-gear guides) and fold "How sure we are" + "Sources and how we researched this" into one collapsed block; keep one visible affiliate notice at the top, drop the "Affiliate links disclosed" chip if the box already says it.
3. Standardise one closing: a single "What to buy first" (not also a "Buying checklist" and intro "What to buy:"), then FAQ, then Keep reading; drop the "What next?" tool block where the page already links the same tools inline.
4. Tables: stack to cards under 480px or limit to 2 columns.
5. Replace research-memo hedges with a house rule: state the uncertainty once per page, and keep it out of product-card copy.
