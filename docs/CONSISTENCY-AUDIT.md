# Editorial consistency audit

> Historical audit; its counts predate the 2026-11-24 recount (`docs/buyer/ROUTE_AND_ASSET_COUNTS.md`). <!-- SUPERSEDED-NOTE -->


Audit date: 2026-11-17. Scope: 16 articles (1 Markdown guide, 15 TypeScript guides) plus the 6 gear files in `src/content/gear/`. The test articles `cms-test-article.md` and `cowork-test-article.md` were ignored. I did not edit any article, did not fetch any source page, and did not commit anything.

How to read this file:

- Line numbers are approximate. They are the line numbers of the source file, so the `body` template string, `faqs`, `gear` and `research` blocks all share one numbering per file.
- "Slug" means the guide slug. The Markdown guide is `how-vacation-rental-pet-fees-work`, and its line numbers are file lines.
- Quotes are exact. Where a finding rests on what a cited source really says, the fix says `VERIFY AGAINST SOURCE` and names the URL. I judged those from the article text only.

Severity key:

- SAFETY: a reader could act on the advice and be put at risk, or two articles give opposing safety advice.
- FACTUAL: a number, attribution or claim differs between articles, or a sentence states more than its source plausibly says.
- WORDING: same meaning, different phrasing, or a neutrality or consistency problem that does not change a fact.

Counts: SAFETY 9, FACTUAL 13, WORDING 13, total 35.

Already fixed and confirmed fixed: no article still says "AVMA recommends tethers". `traveling-with-two-dogs-accommodation-guide` (L147) now says AVMA notes that "harnesses, tethers and other accessories for securing pets are sold at most pet supply retailers, but it does not say which of them is safest". `dog-friendly-weekend-getaways-from-atlanta` (L206) says only that AVMA "recommends appropriate vehicle restraint". `dog-car-safety-harness-and-crate-guide` attributes the extension-tether warning to CPS. See S-01 and S-05 for remaining tether wording problems.

---

## SAFETY findings

### S-01 Seat-cover guide tells readers to "attach a harness tether". This is the same kind of conflict as the AVMA tether one.

Topic: car restraint, tethers, hammock covers.

Passages:

- `dog-friendly-rental-protection-gear-guide` L130: "Hook-and-loop openings or zippers let a person use the belt and let you attach a harness tether if the harness maker allows it."
- `dog-car-safety-harness-and-crate-guide` L74: "CPS says extension tethers and zipline-style products increase the risk of injury, and it restricts brands that sell extension tethers from its certification program."
- Same guide L141: "Do not add an extension tether or similar accessory."
- Same guide L175: "No extension tethers or zipline-style add-ons."
- Same guide L86: "Sleepypod warns against using its carriers and harnesses with non-Sleepypod accessories."
- Related ambiguity, car guide L114: the Atom has "a safety tether (described as preventing escapes)". L145: "get the maker's instructions and any tether guidance before your first trip." Gear file `dog-car-safety-harness-and-crate-guide.ts`: "Includes a safety tether to prevent escapes".

Why they conflict:

- The car guide's only tether advice is "do not add one". The protection guide uses the bare word "tether" as something a reader may attach to a harness through a hammock opening.
- The word "tether" now means three different things across the two guides. These are an extension tether (CPS says avoid), a harness's own seat-belt connection, and the Atom's internal escape tether. A reader cannot tell which is meant.
- A hammock is also arguably a "non-Sleepypod accessory" under the Sleepypod warning the car guide repeats.

Fix. Use one vocabulary everywhere:

- In the protection guide, replace the sentence at L130 with: "Hook-and-loop openings or zippers let a person use the belt. They are not a place to add a tether or any accessory to a dog's harness. Connect a harness to the seat belt only as the harness maker instructs, and never add an extension tether or zipline-style device."
- In the car guide, call the Atom's feature a "built-in tether inside the carrier that stops the dog climbing out (not a vehicle tether)". At L145, replace "any tether guidance" with "the maker's instructions for securing the carrier".
- Standard sentence to reuse: "The Center for Pet Safety advises against extension tethers and zipline-style products." See S-05 for the exact CPS wording to verify.

Source to check: https://centerforpetsafety.org/extension-tether-advisory/

---

### S-02 Pressure-mounted gates and stairs: unconditional "no" in one guide, conditional in another, and an opposite-sounding use elsewhere

Topic: fences, gates, stairs.

Passages:

- `portable-dog-fence-and-playpen-guide-for-rentals` L134 and gear watch-out L299: "We do not recommend putting any pressure-mounted gate at the top of a staircase."
- Same guide L22: "A pressure-mounted gate can close off a staircase, a kitchen or a hallway."
- Same guide L51: "Use them to keep a dog out of a bedroom, away from a stairwell, or in the room where you are."
- `dog-friendly-cabin-packing-list` L115: "do not assume an ordinary pressure-fit travel gate is safe at the top. Use only a barrier approved by its manufacturer for that position and installed as directed."
- Same guide FAQ L257: "A portable gate is not automatically safe at the top of stairs. Use only a barrier approved for the position and installed as directed".
- `vacation-rentals-that-welcome-large-dogs` L141 lists "Whether a gate can be used without damaging walls" under stairs and lofts.

Why they conflict:

- The fence guide says never at the top. The cabin guide says it depends on manufacturer approval. A reader who reads the cabin guide could reasonably buy a gate and ask a host for permission to drill.
- The fence guide's own L22 and L51 can be read as "close off the stairs", with no top or bottom distinction.

Fix. Use this canonical sentence in all three guides: "Do not use a pressure-mounted gate at the top of stairs. Use a stair gate only if its maker approves it for that position, which usually means hardware mounting, and get the host's permission before anything is screwed into a wall." In the fence guide L22 and L51, change to "at the bottom of a staircase".

VERIFY AGAINST SOURCE: the Carlson product pages and instruction sheets in the fence guide's sources (https://carlsonpetproducts.com/products/36-extra-tall-walk-thru-pet-gate-white), to see whether any Carlson gate is approved for top-of-stairs use.

---

### S-03 BearWise "screw-top container" claim vs "an ordinary container is not bear-resistant"

Topic: wildlife, bears, food storage.

Passages:

- `dog-travel-water-and-feeding-gear-guide` L108: "BearWise also points out that a bear can drag pet food bags away, and says storing pet food in a screw-top container will keep black bears out of it."
- Same guide L98: "Makers use "airtight" to describe a seal that limits air and moisture... It does not mean a container will stop a determined animal".
- Same guide L110: "None of the products in this guide claims to be bear-resistant... the main protection is where the container is kept, not what it is made of."
- `dog-friendly-cabin-packing-list` L66: "A regular food bin is **not** a bear-resistant container. Neither is an ordinary cooler."
- Same guide FAQ L258: "Do not assume a sealed household bin is bear-resistant."

Why they conflict:

- As written, one reading of BearWise is that a screw-top container works against black bears. The picks (for example the Vittles Vault Travel-Tainer) have an airtight lid, and the cabin guide says an ordinary bin does not.
- A reader could conclude a plastic screw-top tub on a deck is acceptable. That is exactly what the cabin guide and the water guide's own Common mistakes warn against.
- The Georgia guides cite a different BearWise document (Georgia DNR) that says only "do not leave pet food outside".

Fix (VERIFY AGAINST SOURCE: https://bearwise.org/bearwise-basics/never-leave-pet-food-outdoors/):

- If the BearWise page says the screw-top tip applies when the container is stored indoors or in a secured space, say that: "BearWise says storing pet food indoors, or in a closed container where bears cannot see or smell it...".
- Remove "will keep black bears out of it" unless the page says that exactly.
- Use one standard sentence in both guides: "An ordinary or airtight food container is not bear-resistant. Keep dog food, treats and bowls indoors, out of sight and smell, and follow the park's or host's rules."

---

### S-04 Poison control: numbers are identical, but the vomiting and fee wording differ between the first-aid and cabin guides

Topic: first aid, poison control, "don't induce vomiting".

Numbers checked. These match everywhere they appear: ASPCA 888-426-4435, Pet Poison Helpline 855-764-7661. They appear in `dog-travel-first-aid-kit-guide` L71 and FAQ L217, and in `dog-friendly-cabin-packing-list` L186 and FAQ L260. No other article gives a poison number.

Wording that differs:

- First-aid guide L71: "says a consultation fee may apply to either call."
- Cabin guide L186: "ASPCA says a consultation fee may apply... AVMA also lists the Pet Poison Helpline at 855-764-7661, which may also charge."
- First-aid guide L67 and FAQ L217: "not to try to induce vomiting or give any medication to a poisoned pet unless directed to by a veterinarian or poison control center."
- Cabin guide L184: "AVMA's first-aid brochure advises always contacting your veterinarian or poison control center before inducing vomiting."
- Cabin guide FAQ L260 lists only the ASPCA number, with "a consultation fee may apply". The first-aid FAQ lists both numbers.
- Hotline naming: "ASPCA Poison Control" (first-aid) vs "ASPCA Animal Poison Control" (cabin).

Why it matters:

- The cabin L184 phrasing ("contact before inducing vomiting") is softer than the first-aid phrasing ("do not induce unless directed"). A reader who only sees the cabin guide could read it as "call, then induce yourself".
- Fee wording should be identical, as you requested.

Fix. Use this text in both guides:

- "Call your veterinarian, a local emergency hospital, ASPCA Animal Poison Control at 888-426-4435, or Pet Poison Helpline at 855-764-7661. A consultation fee may apply to either hotline. Do not try to induce vomiting or give any medication unless a veterinarian or poison control tells you to."
- Add the Pet Poison Helpline number to the cabin FAQ, since the first-aid FAQ already includes it.

VERIFY AGAINST SOURCE: the AVMA brochure https://ebusiness.avma.org/files/ProductDownloads/mcm-client-brochures-pet-first-aid-2025.pdf. Confirm the exact vomiting wording and that the fee note covers both hotlines. Also check https://www.aspca.org/pet-care/animal-poison-control for the ASPCA number and fee note.

---

### S-05 CPS extension-tether wording varies across three places, and one adds an imperative that may not be in the advisory

Topic: car restraint, tethers.

Passages:

- `traveling-with-two-dogs-accommodation-guide` L147: "The Center for Pet Safety says to use a CPS Certified harness, crate or carrier, never to attach an extension tether or zipline device, and warns that such add-ons can cancel a harness maker's crash-protection claims."
- `dog-car-safety-harness-and-crate-guide` FAQ L194: "does not recommend extension tethers or zipline-style products, says they increase injury risk, and says they can negate a harness maker's crash-protection claims."
- Same guide L74: "CPS says extension tethers and zipline-style products increase the risk of injury, and it restricts brands that sell extension tethers from its certification program."
- Same guide L54 and L62: a CPS listing is "a stronger signal than a maker's own claim. It is still a voluntary program"; "treat the claim as unverified".

Why they conflict:

- "Says to use a CPS Certified harness" is an instruction. The car guide describes certification only as a voluntary, stronger signal, and its own picks include a size (2X-Large) that is not on the CPS listing.
- "Never to attach" and "does not recommend" are different strengths.

Fix: VERIFY AGAINST SOURCE https://centerforpetsafety.org/extension-tether-advisory/. If the advisory does not say "use a CPS Certified product", cut that clause from the two-dog guide. Then use one sentence everywhere: "The Center for Pet Safety advises against extension tethers and zipline-style products, saying they increase the risk of injury and can undermine a harness maker's crash-protection claims."

---

### S-06 Pen guidance says remove collar and tags; the ID guide treats the collar tag as the first and fastest layer

Topic: ID tags, microchips, lost dogs, pens.

Passages:

- `portable-dog-fence-and-playpen-guide-for-rentals` L98: "MidWest also tells owners to remove collars, tags and leads from the pet before placing it inside to prevent possible entanglement."
- Same guide L205: "Remove the dog's collar, tags and leash as the manufacturer instructs".
- `dog-id-tags-and-gps-trackers-for-travel-guide` L36: "A tag is the fastest layer because it needs no equipment."
- Same guide L120: "if someone else finds your dog, the tag and the chip are how they reach you."
- Same guide L175: "Tag is legible, attached securely and shows a mobile number."

Why it matters: the dog most likely to escape a pen, or a pen door left open, is one without ID. Neither guide tells the reader to put the collar back on the moment the dog leaves the pen, or reminds them that the microchip is the only ID left.

Fix. In the fence guide, add after L98 and L205: "Put the collar and ID tag back on as soon as the dog is out of the pen, and make sure the microchip record is current, because the dog has no visible ID while it is inside." In the ID guide, no change needed.

---

### S-07 First-aid kit picks include a triple-antibiotic ointment that the same article says to leave out unless cleared by a vet

Topic: first aid, medications.

Passages:

- `dog-travel-first-aid-kit-guide` L121: "It also lists human-use medications, including aspirin, diphenhydramine and 3% hydrogen peroxide."
- Same guide L127: "it also lists diphenhydramine and hydrogen peroxide, with the same caution applying."
- Same guide L176: "Any antibiotic ointment you have not cleared with your vet."
- Gear file `dog-travel-first-aid-kit-guide.ts`, Me & My Dog keySpecs: "single-use triple antibiotic". Trail Dog keySpecs: "3 single-use triple antibiotic packets".

Why they conflict:

- The body text and the gear watch-outs name aspirin, diphenhydramine and peroxide as the items to discuss with a vet. They do not name the triple antibiotic that both Adventure Medical kits include.
- The article's own "Things to leave out" list tells readers to leave out exactly that product class.

Fix. Add "single-use triple antibiotic ointment" to the human-use medications listed at L121 and L127 and to both gear watch-outs. Standard sentence: "Treat every medication in a ready-made kit (for example aspirin, diphenhydramine, hydrogen peroxide and triple antibiotic ointment) as something to review with your vet before you travel."

---

### S-08 Cabin first-aid list leaves out items the AVMA checklist includes

Topic: first aid.

Passages:

- `dog-friendly-cabin-packing-list` L170-182 ("A useful starting list") has gauze, bandage material, saline, scissors, tweezers or tick tool, gloves, towels, flashlight, medical record and written instructions. It has no thermometer, muzzle, sterile lubricant, eye dropper or syringe, or spare leash and collar.
- `dog-travel-first-aid-kit-guide` L36-61 gives the AVMA checklist. Its FAQ L209 lists "a digital thermometer, a muzzle, a spare leash and collar" among the items.
- Same guide L113: "Most listings do not mention a digital thermometer, contact numbers, or your dog's records."

Why it matters: a reader of the cabin guide, the "remote cabin" case, gets a thinner kit than the AVMA list the sister guide follows. The cabin list is labelled a starting list and says to discuss it with a vet, so this is a gap, not a contradiction.

Fix. Add to the cabin list: "Digital thermometer, a muzzle your dog has practised wearing (never on a vomiting dog), sterile lubricating jelly, an eye dropper or needleless syringe." Link to the first-aid guide for the full AVMA list. The cabin guide does not currently link to it.

---

### S-09 Surf-rescue claim stated flatly; verify

Topic: beach and water safety.

Passage: `pet-friendly-beachfront-rentals-california` L129: the NWS brochure "warns about... going into the water after a dog, noting that dogs pulled into surf almost always get out on their own while their rescuers usually do not." Companion advice L133: "If a dog is swept away, do not enter the water after it."

Why it matters: this is a safety statement that readers may act on. The first half is a sourced claim and the second half is the guide's own advice. The article does not separate them.

Fix: VERIFY AGAINST SOURCE https://www.weather.gov/media/eka/Beach_Safety_Brochure_2022.pdf. If the brochure says "almost always", keep it as a quote. Otherwise soften to "NWS warns that rescuers can be hurt going into surf after a dog". Keep "do not enter the water after the dog" as the guide's own advice with the "call 911" step.

---

## FACTUAL findings

### F-01 Airbnb pet fee and cleaning: "only" appears in one guide and not in the others

Passages:

- `dog-friendly-rental-protection-gear-guide` L51: "Airbnb's help page on pet fees says a pet fee should only cover the expected cleaning, which is different from damage."
- Same guide FAQ L206: "Airbnb's help page says a pet fee should only cover the expected cleaning, which is separate from damage."
- `how-vacation-rental-pet-fees-work` L212: "Airbnb says pet fees should cover the expected cleaning associated with hosting pets. Its help page distinguishes that routine cleaning purpose from unexpected damage."
- `pet-friendly-vacation-rental-checklist` L58: "It also describes pet fees as covering expected pet-related cleaning."

Why they conflict: "should only cover" is a stricter claim than "should cover", and it reads as a rule on hosts. The fee guide, which the protection guide links as the authority on this, does not say "only".

Fix. Use: "Airbnb says a pet fee should cover the expected cleaning that comes with hosting pets, and it separates that from unexpected damage." Cite https://www.airbnb.com/help/article/3623. VERIFY AGAINST SOURCE: confirm whether the help page contains the word "only" before keeping it anywhere.

---

### F-02 Who recommends feeding 3 to 4 hours before travel: CDC only, or CDC and ASPCA

Passages:

- `dog-car-safety-harness-and-crate-guide` L158: "The CDC advises feeding your pet 3 to 4 hours before leaving to prevent car sickness, and the ASPCA specifies a light meal three to four hours before departure and says to avoid feeding your pet in a moving vehicle."
- `dog-travel-water-and-feeding-gear-guide` L74: "The CDC does give one feeding-schedule tip... feed your pet three to four hours before leaving... The ASPCA likewise says not to feed a pet in a moving vehicle, and on longer rides to offer only an occasional small snack."

Why they conflict: the car guide credits both sources with the 3 to 4 hour tip. The water guide credits only the CDC with it. The two guides also cite the ASPCA under different URLs and titles (see W-02), so one may be citing a different page.

Fix: VERIFY AGAINST SOURCE https://www.aspca.org/pet-care/general-pet-care/travel-safety-tips and https://www.aspca.org/node/69318. Make both guides use the same attribution. If the ASPCA gives the timing, the water guide should say so. If not, the car guide should drop the ASPCA clause.

---

### F-03 Arroyo Burro beach rules: the LA guide omits the county/city discrepancy the California guide flags

Passages:

- `dog-friendly-weekend-getaways-from-los-angeles` L32 table: "Arroyo Burro's leashed park and adjacent designated off-leash shoreline". FAQ L236: "Arroyo Burro County Beach Park requires leashes, while an adjacent designated shoreline east of the creek permits off-leash use."
- Same guide L76 cites [9], titled "Celebrate National Dog Day in Santa Barbara" (a city page), for "requires off-leash dogs to be under sight and voice control and says owners must keep a leash with them at all times".
- `pet-friendly-beachfront-rentals-california` L58: "The city's dog-access handout lists Arroyo Burro Beach and several other beaches and parks as off-leash locations... Because the county page and the city handout are worded differently, follow the stricter reading (leashed, except east of the creek) unless signs say otherwise."

Why they conflict: the facts agree on "leashed, except east of the creek". The California guide tells the reader the two official sources differ and to take the stricter reading. The LA guide states one reading with no caveat, and rests the control standard on an event page rather than the rules handout the other guide cites.

Fix. Add to the LA guide, after L76: "The county page and the city's dog-access handout are worded differently; follow the stricter reading (leashed, except east of the creek) unless signs say otherwise." Cite the city handout PDF (the California guide's [7]) for the control standard. VERIFY AGAINST SOURCE: https://sbparksandrec.santabarbaraca.gov/node/9272 (does it state the "sight and voice control" rule?).

---

### F-04 Microchip "required to travel outside the US or to Hawaii" is a broad claim

Passage: `dog-id-tags-and-gps-trackers-for-travel-guide` L138: "AKC Reunite says a microchip is required to travel outside the US or to Hawaii, and that the pet must be microchipped before the health certificate process begins."

Why it matters: "required to travel outside the US" holds for many destinations but not all. A US-only reader could read it as a blanket rule. The sentence also sits in a table row about trips abroad, with no other cross-border advice in the site.

Fix: VERIFY AGAINST SOURCE https://www.akcreunite.org/travel/. If the page is about international travel generally, say: "AKC Reunite says many destinations, including Hawaii, require a microchip, and that the pet must be microchipped before the health certificate process begins. Check your destination's rules."

---

### F-05 Crate "safest" and crate-size claims attributed to ASPCA and CDC

Passages:

- `dog-car-safety-harness-and-crate-guide` L100: "The ASPCA says a crate is the safest option and describes a harness attached to a secured seat belt as the alternative." Repeated in FAQ L186.
- Same guide L90: "Both can be reasonable choices."
- Same guide L44: a crate "that advertised crash testing failed".
- Same guide L82: "CDC and ASPCA both say a crate should let the dog stand, sit, lie down and turn around".
- `dog-friendly-cabins-fenced-yards-georgia` L203 cites the CDC as advising a harness attached to the seat buckle, or a crate secured so it will not slide. It does not rank them.

Why it matters: "safest" is a superlative attributed to one source and is not carried by the CDC, the CPS material or the Georgia guides. It also sits beside the guide's neutral "both can be reasonable".

Fix: VERIFY AGAINST SOURCE https://www.aspca.org/pet-care/general-pet-care/travel-safety-tips (crate "safest"; sizing) and https://www.cdc.gov/healthy-pets/travel/index.html (sizing). If "safest" is accurate, keep it as a quoted attribution with "the ASPCA says" and add "CPS's own testing found crates and harnesses both vary widely". If not, replace with "The ASPCA describes a crate as a preferred option".

---

### F-06 Service animals: public-lands rules in the LA guide vs the ADA summary in the fee and checklist guides

Passages:

- `dog-friendly-weekend-getaways-from-los-angeles` L158 and FAQ L248: Channel Islands "says service animals are admitted only after a vaccination, parasite-prevention, and health-exam protocol, so contact the park directly."
- Same guide L148: Mount San Jacinto "dogs are allowed only in the Idyllwild and Stone Creek campgrounds, not in the wilderness or on the Palm Springs Tram, except for service animals."
- `pet-friendly-vacation-rental-checklist` L134: "they cannot demand certification as proof of service-animal status."
- `how-vacation-rental-pet-fees-work` L310: "The scope matters: the ADA does not automatically apply identically to every privately rented home."

Why they conflict: a reader may see the LA guide's vaccination and health-exam protocol next to the checklist's "cannot demand certification" and conclude one guide is wrong. The difference is the legal setting (a federal park under its own rules, and rentals under platform and ADA rules). None of the three guides says so.

Fix. Add to the LA guide, where the Channel Islands rule appears: "These are the park's own rules. The ADA summary in our fee and checklist guides covers rental accommodation and public businesses, not national-park access." VERIFY AGAINST SOURCE: https://www.nps.gov/chis/planyourvisit/pets.htm.

---

### F-07 "We do not accept payment for placement" vs the site's own disclosure and standards pages

Passages:

- `dog-car-safety-harness-and-crate-guide` L182: "We do not accept payment for placement."
- `src/routes/affiliate-disclosure.tsx` L19: "Occasionally a host may pay for extra visibility. Sponsored stays are always labeled "Sponsored"".
- `src/routes/editorial-standards.tsx` L32: "some placements may be sponsored and labeled as such."
- `src/routes/list-your-property.tsx` L24: "Sponsored placement, if we offer it, is always clearly labeled."

Why they conflict: the car guide is the only one of the six gear guides with this sentence, and it reads as a site-wide promise. The site's own pages allow sponsored placements. The car guide is about product picks, so it may be accurate for products, but the sentence does not say so.

Fix. Either limit it ("We do not accept payment to include or rank a product in this guide") or remove it. Use the same affiliate paragraph in all six gear guides (see W-04).

---

### F-08 Hammock fit: the guide extends the maker's "may not fit large trucks or SUVs" to "smaller SUV"

Passages:

- `dog-friendly-rental-protection-gear-guide` L129: "The Kurgo hammock is 55 inches wide by 56 inches long and says it may not fit large trucks or SUVs."
- Same guide L154: "It suits a typical sedan or smaller SUV with a bench seat."

Why they conflict: the maker says nothing about "smaller SUV" or "typical sedan". The recommendation goes further than the cited spec.

Fix. Replace L154 with: "The maker says it is for bench seats and may not fit large trucks or SUVs; measure your rear seat against 55 by 56 inches." VERIFY AGAINST SOURCE: https://www.kurgo.com/p/heather-hammock/K01598.

---

### F-09 Pet health insurance source used to support a liability claim

Passage: `vacation-rentals-that-welcome-large-dogs` L188: "A pet health policy is not the same product as liability protection for injuries or damage your dog causes. The Insurance Information Institute distinguishes pet health coverage from other financial protections. [[5]](https://www.iii.org/article/facts-about-pet-insurance)"

Why it matters: the source title is "Facts about pet insurance". The sentence says the source separates health cover from liability cover. The vaguer "other financial protections" suggests the writer could not quote it directly.

Fix: VERIFY AGAINST SOURCE https://www.iii.org/article/facts-about-pet-insurance. If the page does not mention liability, cite the Insurance Information Institute dog-bite liability page (already source [4]) for the liability half and keep [5] for the health-insurance half.

---

### F-10 Vrbo FAQ answer reads more definite than the body

Passages:

- `how-vacation-rental-pet-fees-work` FAQ L20: "Vrbo says mandatory fees are included in upfront pricing and identifies pet charges as a standard fee category. Enter accurate pet information and reconcile the displayed total with the property's policy."
- Same guide L269: "Do not rely on a universal claim that a pet fee is always hidden until checkout, or that every pet charge will appear under the same visible label in every regional interface."
- Same guide L275: "They do not justify assuming that every host connection or property-management system offers identical pet-fee configuration."

Why they conflict: the FAQ question is "Does Vrbo include pet fees in its displayed prices?" and the answer joins two separate pages (price display [3] and fee settings [4]). A skim reader can take it as "yes, pet fees are included in the displayed price". The body says to verify the actual quote.

Fix. Change the FAQ to: "Vrbo says displayed prices include mandatory fees, and its fee help lists pets among standard fee categories. Whether a given pet charge appears in the displayed total depends on the listing, so check the full quote before you book."

---

### F-11 Pick-by-situation table recommends a "taller pressure-mounted gate" for hosts who allow pressure mounts only, while the same article says the one tall gate needs wall mounting

Passages:

- `portable-dog-fence-and-playpen-guide-for-rentals` L158: "Jumper, host allows pressure mounts only | Taller pressure-mounted gate | Check the model: some include required wall mounting".
- Same guide L138 and L142: the 36-inch gate has "hardware is included for required wall mounting"; "We could not confirm from the page how it behaves with pressure mounting alone."
- Gear card: "bestFor: A taller gate for an active dog, where the host allows wall mounting".

Why they conflict: the table steers a jumper's owner whose host allows only pressure mounts toward a taller pressure-mounted gate. The only taller gate in the guide is one the maker says requires wall mounting, and the guide cannot confirm it works without it.

Fix. Replace the table cell with: "No gate in this guide is a confirmed tall pressure-only option. Ask the host about wall mounting, or choose another barrier." Keep the "Check the model" caution.

---

### F-12 Verification of CPS listings is shown for one product but skipped for another

Passages:

- `dog-car-safety-harness-and-crate-guide` L108: for the Sleepypod harness, "The 2X-Large size and the Regular/Long split are maker-listed and do not appear on that CPS listing, so confirm certification for those with the maker and CPS."
- Same guide L118: GUNNER "states that the Small, Medium and Intermediate are crash tested per CPS and does not list the Large as certified. CPS lists the Medium... and the Intermediate...". No CPS listing for the Small is cited.
- Gear file: "Maker states the Small, Medium and Intermediate sizes are crash tested per the Center for Pet Safety".

Why it matters: the guide's own rule (criterion 1, "treat the claim as unverified") is applied to Sleepypod and not to the GUNNER Small. The reader is left to assume the Small is CPS listed.

Fix. Add to L118: "We found CPS listings only for the Medium and Intermediate, so confirm the Small with the maker and CPS." VERIFY AGAINST SOURCE: https://www.gunner.com/products/g1-kennel and the CPS directory https://centerforpetsafety.org/cps-certified/.

---

### F-13 "Covers the most common escape route" is not supported in the linked guide

Passage: `dog-id-tags-and-gps-trackers-for-travel-guide` L32: "the [secure fenced yard guide](/guides/vacation-rental-secure-fenced-yard) covers the most common escape route."

Why it matters: no article states or sources that a yard is the most common escape route. The linked guide's own intro says only that a fenced yard "can also be a three-sided lawn with an open driveway".

Fix: "covers one common way dogs get out: a yard with gaps in the boundary", or just "covers checking a yard before you rely on it".

---

## WORDING findings

### W-01 Same Airbnb URL is cited under three different titles

URL https://www.airbnb.com/help/article/3623 appears as:

- "Charging pet fees": `how-vacation-rental-pet-fees-work`, `traveling-with-two-dogs-accommodation-guide`, `dog-friendly-rental-protection-gear-guide`.
- "Pet fees": `pet-friendly-vacation-rental-checklist`.
- "Adding a pet fee", publisher "Airbnb Help Center": `pet-friendly-beachfront-rentals-california`.

Fix: use the page's real title everywhere, and "Airbnb" as the publisher. VERIFY AGAINST SOURCE: the URL above.

---

### W-02 Research notes disagree with each other, and one ASPCA page is cited under two URLs

- `dog-car-safety-harness-and-crate-guide` research.gapsFound: "AVMA vehicle-safety pages could not be loaded during research and are not cited". But `dog-friendly-weekend-getaways-from-atlanta` L206 cites https://www.avma.org/resources-tools/pet-owners/petcare/pets-vehicles, and `traveling-with-two-dogs-accommodation-guide` L147 cites the AVMA travel brochure.
- `dog-travel-water-and-feeding-gear-guide` research.gapsFound: "AVMA pages could not be retrieved during research, so no AVMA claims are made." Other guides cite AVMA heavily.
- `dog-id-tags-and-gps-trackers-for-travel-guide` research.gapsFound: "AVMA, AAHA and CDC pages were not retrievable in this session". Other guides cite the CDC page.
- ASPCA travel advice appears at https://www.aspca.org/pet-care/general-pet-care/travel-safety-tips (car guide, titled "Travel Safety Tips") and at https://www.aspca.org/node/69318 (water guide, titled "Traveling With Pets? Follow These Expert Dos and Don'ts to Keep Them Safe").

Fix: these research notes are only problems if they are rendered to readers. Update or remove them so they are not stale. VERIFY AGAINST SOURCE: whether the two ASPCA URLs are the same page. If so, cite one URL and title.

---

### W-03 Leash-length framing differs between the cabin guide and the destination guides

- `dog-friendly-cabin-packing-list` L107: "Check the rules for each park and trail rather than applying one leash-length rule to an entire state."
- `dog-friendly-cabins-fenced-yards-georgia` L164 and `dog-friendly-weekend-getaways-from-atlanta` L149: Georgia State Parks "generally" allows pets on a leash "no longer than six feet". Atlanta L169: "Keep the leash within the state's six-foot limit".
- `pet-friendly-beachfront-rentals-california` L24 and LA guide L162: California "general state-park rule is a leash no longer than six feet".

These are consistent in substance (six feet at state parks is the default, other managers differ). Fix: in the cabin guide, add "State parks in Georgia and California generally cap leashes at six feet, but national forests, counties and cities differ."

---

### W-04 The "not tested" and affiliate paragraphs vary across the six gear guides

"Has not tested" variants:

- car: "has not tested, used, or reviewed any product in this guide"
- protection and ID: "has not tested, used or reviewed"
- first aid: "has not tested any of these products"
- water: "We have not used these products"
- fence: "Paws & Passage did not test these products"

Affiliate paragraph variants:

- Five guides (first aid, water, ID, fence, protection) carry: "Some links on this site are affiliate links. When an article contains one, a notice appears at the top of the article and the link is marked as sponsored. If you buy through an affiliate link, Paws & Passage may earn a commission at no extra cost to you. A commission never changes which products we list or what we say about them."
- Car guide L182 says "Some links in gear guides are affiliate links" and does not carry the sentence "A commission never changes which products we list or what we say about them". It adds a placement sentence instead (see F-07).
- Protection FAQ L222 uses a third form: "Some product links may be affiliate links".

Fix: use one standard "not tested" sentence and one affiliate paragraph in all six. Suggested "not tested": "Paws & Passage has not tested, used or reviewed these products. Picks are based on criteria and each maker's published specifications." No conflict in substance: every guide says untested and says prices and ratings are not given.

The notice and "marked as sponsored" statements match the site code (`AffiliateNotice.tsx`, "Shown at the top of an article only when the article really contains approved affiliate links").

---

### W-05 Site UI says "Our picks" and "what we recommend"; articles say the site does not recommend one product

- `src/components/site/GearPicks.tsx`: heading "Our picks"; "It never changes what we recommend."
- `dog-car-safety-harness-and-crate-guide` FAQ L206: "Does this site recommend one product above the rest? No."
- `dog-travel-water-and-feeding-gear-guide` L211: "we do not claim they are the best available."
- `AffiliateNotice.tsx`: "It does not change what we write."

Fix: change the UI to "Picks by criteria" and "It never changes which products we list or what we say about them", matching the article paragraph.

---

### W-06 Atlanta guide uses "recommendations" while stating it does not recommend

- `dog-friendly-weekend-getaways-from-atlanta` L26: "It does not recommend individual rentals".
- Same guide L30: "The recommendations below are editorial matches, not claims that every part of a town or park suits every dog."
- Same guide L143: "not as a blanket endorsement".

Fix: "The options below are editorial matches".

---

### W-07 Car guide section heading implies verification the text goes on to qualify

- `dog-car-safety-harness-and-crate-guide` L102 heading: "Four products that meet the criteria".
- L104: "We are not saying they are the only good options, and we have not tested them."
- L108 and L118: several sizes are not CPS listed.

Fix: "Four products we checked against the criteria".

---

### W-08 ID guide leaves out the ASPCA temporary travel tag tip that the car guide quotes

- `dog-car-safety-harness-and-crate-guide` L176: "as the ASPCA suggests, your dog wears a temporary travel tag with your cell phone and destination phone number."
- `dog-id-tags-and-gps-trackers-for-travel-guide` L42-L46 ("What a travel tag should say") does not mention a temporary tag with the destination number.

Fix: add to the ID guide "A temporary tag with the destination phone number, as the ASPCA suggests for travel."

---

### W-09 Food in the car at a park: "depends on the park" vs "do not assume"

- `dog-travel-water-and-feeding-gear-guide` FAQ L242: "some parks allow food stored out of sight inside a car with the windows closed, while others require lockers".
- `dog-friendly-cabin-packing-list` L68: "do not assume that leaving it in the car is an acceptable alternative."
- The two guides cite different NPS pages: https://www.nps.gov/subjects/bears/storingfood.htm (water) and https://www.nps.gov/articles/bearsafetyfood.htm (cabin).

These are compatible. Suggested harmonised line: "Rules vary by park. Some allow food in a closed car out of sight, others require lockers. Ask the park or host before you rely on the car."

---

### W-10 Tie-out wording differs between the body, the FAQ and the checklist

- `portable-dog-fence-and-playpen-guide-for-rentals` L63: "we do not recommend tie-outs for a dog on its own, and we do not feature any."
- FAQ L250: "We do not recommend it for a dog left alone."
- L227: "never leave it tethered."
- L61 paraphrases Humane World for Animals as saying "keeping an animal tethered for long periods or during extreme weather is never acceptable."

Fix: one line, "We do not recommend tie-outs. Humane World for Animals says tethering a dog unattended is a risk factor in serious bites and attacks." VERIFY AGAINST SOURCE: https://www.humaneworld.org/chaining for the "never acceptable" wording.

---

### W-11 Poison hotline naming varies

"ASPCA Poison Control" (`dog-travel-first-aid-kit-guide`) vs "ASPCA Animal Poison Control" (`dog-friendly-cabin-packing-list`). Source titles use "Animal Poison Control" and "ASPCA Poison Control". Use "ASPCA Animal Poison Control" and "Pet Poison Helpline" everywhere (see S-04).

---

### W-12 First-aid guide says a secure yard "prevents some emergencies altogether"

- `dog-travel-first-aid-kit-guide` L160: "since a secure yard prevents some emergencies altogether."
- `vacation-rental-secure-fenced-yard` L19: "no listing description makes a dog escape-proof."

Fix: "since checking the yard can prevent some emergencies".

---

### W-13 Published and modeled distances for the same Georgia towns differ

- `dog-friendly-weekend-getaways-from-atlanta` L51-L53: Dahlonega published 71 miles, modeled 65 mi. Ellijay published about 85 miles, modeled 78 mi.
- The guide explains that published figures use varied starting points and the modeled one uses the Georgia State Capitol.

No conflict between guides (the Georgia cabins guide gives no times). The guide could add "published mileages come from different starting points, which explains the gap".

---

## Coverage table

| Topic | Articles involved | Status |
| --- | --- | --- |
| Car restraint: harness, crate, carrier, back seat, cargo area | car guide, two-dog, Georgia cabins, Atlanta, cabin packing, protection gear | CONFLICT (S-01, S-05; F-05 NEEDS VERIFICATION) |
| Extension tethers; AVMA tether attribution | car guide, two-dog, Atlanta, protection gear | CONFLICT (S-01, S-05); the AVMA "recommends tethers" error is fixed |
| Hammock and seat covers vs restraint | protection gear, car guide | CONFLICT (S-01); F-08 |
| Leaving dogs in cars, cracked windows, heat | car, water, two-dog, Georgia cabins, Atlanta, LA, fees (n/a) | CONSISTENT |
| Hydration, water from home, drinking pool/ocean water | water, first aid, car, California beaches, LA | CONSISTENT; F-02 NEEDS VERIFICATION (feeding timing) |
| Heat illness signs, hot surfaces, cooling | first aid, water, LA, California beaches | CONSISTENT |
| First aid kit contents | first aid, cabin packing | CONFLICT (S-07, S-08) |
| Poison control phone numbers | first aid, cabin packing | CONSISTENT (numbers identical); wording CONFLICT (S-04, W-11) |
| Poison control fee wording | first aid, cabin packing | CONFLICT (S-04) |
| "Don't induce vomiting"; medications; peroxide | first aid, cabin packing | CONFLICT (S-04, S-07) |
| Microchips, tags, trackers, lost dogs | ID guide, car, cabin packing, fence guide | CONFLICT (S-06); F-04 NEEDS VERIFICATION; W-08 |
| Wildlife, bears, food storage | water, cabin packing, Georgia cabins, Atlanta | CONFLICT (S-03 NEEDS VERIFICATION); W-09 |
| Ticks and parasites | cabin packing, first aid | CONSISTENT |
| Fences, gates, pens, stairs | fence guide, fenced yard, cabin packing, large dogs, Georgia cabins | CONFLICT (S-02, F-11) |
| Tie-outs and tethering | fence guide | CONSISTENT in substance; W-10 wording |
| Unattended dogs and crate use | checklist, two-dog, large dogs, cabin packing, fence guide, Georgia, Atlanta, LA | CONSISTENT |
| Host communication and house rules (Airbnb, Vrbo) | fees, checklist, large dogs, two-dog, protection gear, Georgia, Atlanta | CONSISTENT; W-01 source titles |
| Pet fees, deposits, holds, cancellation | fees, checklist, two-dog, large dogs, California beaches | CONFLICT (F-01); F-10 |
| Service animals and the ADA | fees, checklist, LA, large dogs, two-dog | NEEDS VERIFICATION (F-06) |
| Breed, weight and dog-count limits | large dogs, two-dog, checklist, Georgia, Atlanta | CONSISTENT |
| Beach and park leash rules | Georgia cabins, Atlanta, LA, California beaches, cabin packing | CONFLICT (F-03, W-03) |
| Airbnb vs Vrbo fee display | fees, checklist, protection gear, large dogs | CONSISTENT; F-10 |
| "We tested" / "maker says" claims | six gear guides | CONSISTENT in substance; W-04, W-07 |
| Drive times and distances | Atlanta, LA | CONSISTENT; W-13 |
| Dated facts (dates, years) | all | CONSISTENT |
| Numbers in more than one article | all (see below) | CONSISTENT |
| Affiliate links and disclosure | six gear guides, site pages | CONFLICT (F-07, W-04, W-05) |
| Neutrality language vs "best" and "recommend" | gear guides, Atlanta, site UI | CONFLICT (W-05, W-06, W-07) |

---

## Claims I checked and found consistent

- The poison numbers: ASPCA 888-426-4435 and Pet Poison Helpline 855-764-7661 are identical in every place they appear. They appear only in the first-aid and cabin guides.
- Never leave a dog alone in a parked vehicle, and cracking a window is not adequate: car, water, two-dog, Georgia cabins, Atlanta and LA all agree. The CDC says temperatures rise within minutes; the ASPCA says cracking a window is not adequate.
- Back seat for dogs that ride on a seat, harness on a seat belt, or a secured crate: CDC and ASPCA are cited consistently in the car, Georgia cabins and cabin packing guides.
- Separate restraints for two dogs: car guide and two-dog guide agree.
- Heatstroke signs and "contact a vet right away" (first aid, water, LA); no guide recommends cold-water immersion.
- Hot asphalt and flat-faced, elderly, overweight and heart/lung-compromised dogs: water, LA and California beaches all follow the same ASPCA page.
- Feed indoors, bring bowls in at night, and do not leave pet food on a deck: water, cabin packing, Georgia cabins and Atlanta agree.
- Airbnb says to contact the host even when pets are allowed; "Allows pets" filter and adding pets to the guest details: large dogs, two-dog, Georgia, Atlanta, protection gear and the fee guide agree.
- Airbnb's four fee structures (per booking, per night, per pet, per pet per night): fees, checklist, two-dog and California beaches agree. All say verify the actual total.
- Vrbo's house-rules statement (pet type, number and size) and the Vrbo service-animal statement: protection gear and checklist, and fees and checklist, agree.
- Service animals: the fee guide and checklist agree on ADA scope, no pet fee for service animals, and damage charged as for other guests.
- Fee arithmetic: all examples check out ($20 x 2 x 4 = $160; $20 x 2 x 3 = $120; $15 x 2 x 7 = $210; $800 + $120 + $90 = $1,010; plus $250 = $1,260; break-even 4.5 nights; Rental A $850 vs Rental B $840).
- Georgia State Parks: leash no longer than six feet, no pets in swimming areas or beaches, cottages two dogs and no unattended dogs (Georgia cabins and Atlanta). Tallulah Gorge rim trails yes; gorge floor, Sliding Rock Trail and Hurricane Falls staircase no (Georgia cabins, Atlanta, FAQs).
- California: six-foot state-park leash, dogs prohibited on most state beaches, San Diego Dog Beach and Fiesta Island, Arroyo Burro "east of the creek" (LA and California beaches), apart from the caveat in F-03.
- Drive times: Atlanta's table and FAQ both give Helen at about 113 minutes and 87 miles. LA's table, FAQs and body give Big Bear 134 min / 98 mi, San Diego 144 min / 120 mi, Idyllwild 134 min / 109 mi.
- Gear numbers match their gear files: Sleepypod 110 lb and Atom 12 lb; GUNNER Small 30, Medium 45, Intermediate 70 and Large 71+; Lucky Duck under 50, under 70 and 70-110; Carlson 30, 36 and 20 inch gates and fit ranges; MidWest 24-48; North States 26 in and 34.4 sq ft; Tractive 8.8 lb and 44.1 lb with battery figures; Fi 3 months; Kurgo and Springland capacities; Orvis 40 x 40; Kurgo bed and hammock sizes.
- Dates: every article and source is dated 2026-11-16. CPS test dates are consistent between body and gear card.
- "Not tested by Paws & Passage", "no prices", "no ratings": all six gear guides.
- The affiliate notice "at the top of the article, marked as sponsored" matches `AffiliateNotice.tsx` and `rel="sponsored"` behavior described in `AGENTS.md`.

---

## Claims worth checking against their cited source (candidates, not conflicts)

I could not fetch any page. These sentences state specific things a source must say:

1. `dog-car-safety-harness-and-crate-guide` L74: CPS "restricts brands that sell extension tethers from its certification program" (https://centerforpetsafety.org/extension-tether-advisory/).
2. Same guide L54: "CPS does not accept funding from pet product manufacturers" (https://centerforpetsafety.org/cps-certified/).
3. Same guide L100 and L82: ASPCA "crate is the safest option"; CDC and ASPCA crate-size wording (F-05).
4. `dog-travel-water-and-feeding-gear-guide` L108: BearWise "screw-top container will keep black bears out of it" (S-03).
5. `dog-id-tags-and-gps-trackers-for-travel-guide` L138: microchip "required to travel outside the US or to Hawaii" (F-04). L150: "within a 2 mile radius" (https://www.akcreunite.org/lostpettips/).
6. `pet-friendly-vacation-rental-checklist` L76: Airbnb "requires mandatory fees to be disclosed before booking and generally requires their payment on-platform, with stated exceptions for some hosts" (https://www.airbnb.com/help/article/2799). L86: Airbnb host damage protection "includes certain pet-related damage and extra cleaning" (https://www.airbnb.com/help/article/279).
7. `vacation-rentals-that-welcome-large-dogs` L178: III "insurers vary: some restrict certain breeds, some assess individual dogs, and some do not ask about breed" (https://www.iii.org/article/spotlight-on-dog-bite-liability). L188: III on pet health vs liability (F-09).
8. `pet-friendly-beachfront-rentals-california` L129: NWS brochure on rescuing dogs from surf (S-09). L66: Carmel's 25-foot and three-foot voice-control definition (https://ci.carmel.ca.us/post/animal-services). L50: the Mission Bay Park hours and the October 31 overlap (https://www.sandiego.gov/park-and-recreation/parks/dogs/bchdog).
9. `dog-friendly-weekend-getaways-from-los-angeles` L76: city "sight and voice control" rule cited to an event page (F-03). L126: Joshua Tree 100-foot rule and permitted trails (https://www.nps.gov/jotr/planyourvisit/pets.htm).
10. `traveling-with-two-dogs-accommodation-guide` L139: ASPCA "people are often bitten when they try to break up dog fights, because of redirected aggression" (https://www.aspca.org/pet-care/dog-care/common-dog-behavior-issues/aggression).
11. `portable-dog-fence-and-playpen-guide-for-rentals` L61: Humane World for Animals "never acceptable" wording (W-10). The 36-inch Carlson gate's fit gap of 31-34 inches vs the 30-inch gate's 32-34 (both from the maker pages in the sources).
12. `dog-travel-first-aid-kit-guide` L101: AVMA heatstroke cooling steps, including "room-temperature water" and the warning against a tub of cool or cold water (https://ebusiness.avma.org/files/ProductDownloads/mcm-client-brochures-pet-first-aid-2025.pdf).

---

## Fix order I would suggest

1. S-01, S-02, S-03, S-04, S-05: reader-facing safety wording that can be fixed from the text alone, then verified against the named sources.
2. S-06 to S-09, then F-01, F-02, F-03: short wording changes.
3. F-07 and W-04: remove the placement claim and standardise the affiliate and "not tested" paragraphs across the six gear guides.
4. The remaining FACTUAL and WORDING items.
