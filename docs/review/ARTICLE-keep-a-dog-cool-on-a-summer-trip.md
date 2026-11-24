# Review: Keep a Dog Cool on a Summer Trip: Car, Beach and Rental (keep-a-dog-cool-on-a-summer-trip)
Verdict: FIX FIRST. The safest and most honest of the three on trust, but the page opens with signs and no action, offers no short "which one do I buy" answer for a vest versus a pad, and has a title tag that will truncate.
Overall: 8.3 / 10 (FAIL)
Scores (1 to 5): Answer clarity 4 | Reader flow 4 | Buying advice 4 | Product placement 4 | Layout 4 | Trust 4 | SEO fit 4 | Differentiation 5  (sum 33 / 4 = 8.25, shown as 8.3)

Method: source `content/guides/keep-a-dog-cool-on-a-summer-trip.md`; rendered page at localhost:4173 read at 1280 and 390 wide (screenshots in the scratchpad `g6/` folder); head read from the page; pin row 15 of `docs/pinterest-pins.csv`; catalog records for ruffwear-swamp-cooler, green-pet-shop-cool-pet-pad, kurgo-splash-free-wander-bowl, springland-22oz-original-travel-bottle.

Head: title tag "Keep a Dog Cool on a Summer Trip: Car, Beach, Rental | Paws & Passage" (about 70 chars, will truncate in results). Meta description 153 chars, accurate and specific.

## Top 5 issues (most important first)

1. **The opening lists signs but gives no action, and the action sits two sections down.**
   Where: the bullet "Heatstroke is an emergency. AKC lists heavy panting, rapid breathing and bright red gums..." in the opening list; the steps are under "Signs of heat illness, and what the sources say to do", after the page's first screenful and a long paragraph on conflicting temperatures. A reader whose dog is panting now has to scroll to learn to cool with cool (not cold) water and call a vet.
   Fix: add a one-line "if this is happening now" sentence to the opening list, linking to the steps (edit 1).

2. **No short decision between a vest, a pad and "just water and shade".**
   Where: "Cooling vest, pad or water: what the evidence and the makers say". The table lists the options and what is unknown, then two long product subsections, but there is no sentence telling a reader which to buy for which trip, and "What to do first" ends with "If you want a vest or pad, size it from the maker's chart". The reader who skims the table cannot tell which row applies to them.
   Fix: add a three-bullet "Which one first" under the table (edit 2), strictly in the article's own terms (walks, resting indoors, any trip) with no efficacy claims.

3. **The pad is pitched for the car seat while the maker warns against hot cars; the pick card puts the warning last.**
   Where: heading "A pad for the seat, the floor or a shaded rest" and the card "A gel pad for the car seat or rental floor". The maker warns against sunlight and hot cars and says to put a towel or blanket on a seat first; the body says this a paragraph later. A skimming buyer sees "car seat" first.
   Fix: change the card label and why-text so the limit comes first (edit 3), and change the H3 to "A pad for a cooled room or a cooled car".

4. **Title tag too long, and long-tail searches are only half answered.**
   Where: `seoTitle` "Keep a Dog Cool on a Summer Trip: Car, Beach, Rental". With the site suffix this is about 70 characters. Questions it answers well: heatstroke signs, "is a parked car ever safe", hot car laws by state, "do cooling vests work". Questions it misses: "cooling vest or cooling mat for a dog" as a direct comparison, and "how to keep a dog cool in a rental without air conditioning" (the body admits no source, which is honest but could be a FAQ answer people can find).
   Fix: shorten the title and add two FAQ entries (edits 5 and 6).

5. **Small density and wording problems that slow the middle of the page.**
   Where: "Never leave a dog in a parked car" has a parenthetical "(its heading says 14 states, though the list under it names 16, so check the statute)" that adds source trivia a traveller cannot act on; "Signs of heat illness..." gives five different temperature figures in a row before the first aid steps; the hero (dog nosing at foliage) shows no cooling cue and I could not confirm the water the alt text describes in the visible crop.
   Fix: trim the 14/16 aside (edit 4), put the first aid steps before the temperature paragraph (edit 7), and check hero alt against the image (question 2).

## What works well
- It states where its sources disagree (AKC 105.8 F vs 104/105/106 F on its pavement page vs Cornell 105 F; Chewy "up to four hours" vs the maker's three) and tells the reader to call a vet at the signs, not at a number.
- Gear is kept subordinate: the table's "What we could not find" column, the pad's "shown to help" claim explicitly given no weight, and the vest's size-chart contradiction flagged for the buyer.
- Product placement follows the problem: vest in the walks section, pad in the rest section, bowl and bottle in hydration, each introduced by the situation, product names linked in prose and each card showing "Details and specs".

## Buyer walkthrough
1. Lands from "keep dog cool in car" or "dog cooling vest", reads the opening bullets and the safety sections.
2. Reaches the evidence table: honest, but no verdict on what to pack.
3. Reads the vest subsection: gets sizing by chest girth and the conflicting between-size instruction; clicks the Ruffwear card.
4. Reads the pad subsection, learns the warnings; bowl and bottle follow with clear "who it is for" lines.
5. Friction: no overall "pack these first" shortlist (only "add water, a bowl and a bottle to the packing list" at the very end) and no answer for dogs in the higher-risk lists about whether the vest or pad is appropriate (only "ask your vet").

## Mobile notes (390 px)
- All three tables fit without sideways scroll (350/350); text in the evidence table is cramped but readable.
- First screen is breadcrumb, H1, long dek and the hero; the page is about 21,400 px tall on mobile.
- Meta row has a stray "·" alone on a line.

## Specific edits to make
1. TEXT: in the opening bullet list, add a first bullet: "**If your dog is showing these signs now:** move it somewhere cool, wet it with cool (not cold) water and call a vet; the sourced steps are [below](#signs-of-heat-illness-and-what-the-sources-say-to-do)."
2. STRUCTURE: after the options table and before "### A vest for walks and outdoor stops", add: "**Which one first.** If you walk or sit outdoors with your dog, a soaked vest is the item the small studies looked at (in other designs, on working dogs). If your dog rests indoors or in a cooled car, a pad is the comfort option, with the maker's warnings. For every trip, a bowl or bottle and shade come before either. None of these replaces working air conditioning or a vet's advice for a dog on the higher-risk lists."
3. PRODUCT: replace the pad pick line with `{{pick:green-pet-shop-cool-pet-pad|A gel pad for a cooled room or car|The maker lists five sizes by weight, from 11.8 x 15.7 in (0-8 lbs) to 27.5 x 43.3 in (above 80 lbs), needs no water or electricity, and warns against direct sunlight and hot cars.|https://www.thegreenpetshop.com/products/cool-pet-pad}}` and rename the H3 "A pad for the seat, the floor or a shaded rest" to "A pad for a cooled room or a cooled car".
4. TEXT: in "What state laws say", replace "(its heading says 14 states, though the list under it names 16, so check the statute)" with "(its own counts differ on the page, so check the statute)".
5. SEO: set `seoTitle` to `Keep a Dog Cool on a Trip: Car, Beach, Rental` (about 62 chars with the suffix).
6. SEO: add two FAQ entries. (a) q: "Is a cooling vest or a cooling pad better for travel?" a: "We found no independent test of either product named here. A soaked vest is made for wearing on walks and the pad for resting on, and both makers' warnings apply: the pad should not be left in sun, heat or a hot car. Shade, water and rest come first." (b) q: "How do I keep a dog cool at a rental without air conditioning?" a: "We found no source on safe indoor temperatures for dogs. Ask the host in writing whether the room the dog will sleep in is air conditioned and whether there is shaded outdoor space, and call a vet if the dog shows heat signs."
7. STRUCTURE: in "Signs of heat illness, and what the sources say to do", move the numbered "What the two pages say to do while you get help" list directly under the first paragraph, and place the paragraph beginning "The pages give different temperatures." after the list.
8. TEXT: in the opening paragraph, remove the final clause "and this guide says where, and what its makers do and do not claim" if it creates a repeat with the "How sure we are" section (optional; keep the researched-not-tested stance once in the dek and once in the table).
9. STRUCTURE: in "What to do first", end with: "If you pack one thing beyond water: choose a bowl or bottle that suits how your dog drinks (flat seat bowl for the car, one-hand bottle for walks); treat the vest and pad as optional." (restates the article's own pick logic, no new claims).

## Questions for the owner
1. Do you want the Chewy retail page counted in the "15 official sources" figure? It is a retailer page used only to cross-check the pad duration.
2. Please confirm the hero (`guide-keep-dog-cool`) matches its alt text (a dog licking water) in the full image; in the visible crop at 1280 it shows a dog nosing at foliage.
