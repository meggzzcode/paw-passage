# Fix report: vacation-rental-with-a-senior-dog (round 2)

## Changed
- H1/title, seoTitle and keyword aligned ("vacation rental with a senior dog"); description rewritten (142 chars).
- Structure: "Buying checklist" section deleted; pack section condensed; forum paragraphs condensed; manager table now 3 columns so the "what it could mean" column fits a phone; "How sure we are" table replaced by a sentence; "[Name]" replaces the hard-coded "She". Reading time is still about 14 minutes (about 3,300 words), down from about 3,500 after additions; I did not reach the 11 to 12 minutes the review suggested without cutting evidence sections. The lead may decide to split the manager-rules section into its own guide.
- Products: ramp and steps cards moved out of the floors section into one section "What to buy, in order" (placed after the vet list), with four picks: Pawtect Pads, Kurgo Loft Wander bed (new), PetSafe folding ramp, PetSafe bench seat cover, each with benefit, one spec, a skip line and a nudge, then a "What to buy first" list. Petful "Best washable" claim removed. Side-door steps are no longer in this article (4-pick limit; the ramp-or-steps guide carries them).
- FAQ: 6 questions; ground-floor question added; accident questions merged. New sources added for the bed, pads and ramp.
- lastReviewed 2026-11-24.

## Could not change / For the lead
- Pawtect Pads affiliate link is the 18x24 in 2-pack (smallest). The text tells the reader to measure the bed and pick a larger size on the maker page; approve a larger variant (34x36 B0C5N8MNWZ) in content/affiliates.yml if you want the card to fit a senior-dog bed.
- Kurgo Loft Wander affiliate link is the Large (36x48 in); the text says so. The catalog keeps the page source accessedOn 2026-11-16.
- petsafe-happy-ride-side-door-steps is removed from this guide's relatedProducts; it still appears in dog-ramp-or-steps-for-the-car-and-cabin. Update the catalog relatedGuides if desired.
- The "31 official sources" chip counts forum threads; a component change (src/components) is needed to separate them. I added a note to "How sure we are".
- docs/pinterest-pins.csv row 21 needs the new title "Vacation Rental With a Senior Dog: What to Check Before You Book" and the new description; the pin image text may need regenerating.
- Card button contrast is a component issue.

# Round 3
- Car gear cut to one pick (seat cover, tied to leaking); ramp and side-door steps cards removed and replaced by one sentence linking the ramp-or-steps guide (both products still appear in dog-ramp-or-steps-for-the-car-and-cabin). relatedProducts now pads, bed, seat cover; sources and citations renumbered (pads 31, bed 32, cover 33). "What to buy first" now has three items.
- "Situation" table turned into four bullets; "seriously ill" and "pack and drive" merged into one short section; both forum paragraphs cut to one sentence each; the "Before you book" checklist removed (the trip checklist is linked instead). First paragraph says "vacation rental". "Buy first" phrasing removed from the paragraphs.
- Sources note in "How sure we are" now says 11 of the listed sources are forum threads. readingMinutes 11.
## For the lead
- Pawtect Pads link is still the 18x24 pack; text says so and points to larger sizes on the maker page. Header "sources cited" chip still counts forum threads (component).
- Pin CSV row is unchanged.
