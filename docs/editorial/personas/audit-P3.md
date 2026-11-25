# Persona audit P3: shopping and trust mindsets (10 simulated personas)

Date: 2026-11-25. Site: https://www.pawsandpassage.com (production main@f02e4f9; repo checkout at cffa233 for source reads). Auditor: Claude (editorial audit worker). Scope: topics, navigation, products, calls to action. Not sentence-level prose (other workers are editing it).

**Important:** every persona below is a SIMULATED PERSONA constructed for this audit. None is user research, none quotes a real person, and the scores are editorial judgements with reasons, not measurements. Pages were read through WebFetch (rendered text, not a real phone), plus `src/components/packing/Shopping.tsx` and `PackingPlanner.tsx`. Pages walked: home, /guides, /gear, /gear/car-safety, /gear?trip=road-trip, /tools/packing-list, /stays, a stay detail, /about, /methodology, /editorial-standards, /affiliate-disclosure, and three guides (car safety harness and crate, life jacket, first aid kit).

## What the site does today (shared baseline)

- Product card: brand, name, one-line reason, three or so fact bullets, a "Check:" caution line, a "See it at Amazon" button (affiliate), a "Details and specs" link, and an expandable "Specs, fit & sources" panel that separates maker claims from named independent testing ("none cited" when absent), with a read date.
- Gear hub: five trip cards, eleven categories, four dog-type cards, no sort, no comparison tool, no shortlist, no essentials/optional split, no "best for" badge (the label sits in the card panel text instead).
- Guides: ordered by use case, not rank. The life-jacket guide has a size-fit section, a comparison table and "Who should skip it". The car-safety guide declines to name a harness at all and sends the reader to the Center for Pet Safety directory. The first-aid guide recommends a kit plus a build-your-own hybrid.
- Planner: "Need to buy" opens a panel with one primary pick and at most one "A different approach", else a category pointer, else "Added to your shopping list." A "Things to pick up before you go" list collects marked items, and the page says "You may already have some of these." Copy and print exist; the list saves on the device.
- Disclosure: one notice near the top of affiliate surfaces, the exact Amazon sentence, and a footer link. /affiliate-disclosure says products in articles appear only when an affiliate link exists, and /editorial-standards admits affiliate money "can affect which products we point to".
- Trust: /about names no person ("Paws & Passage Editors", owner chose no bio); /editorial-standards discloses AI tools and an AI re-read "not described as review by a human fact-checker"; /methodology says "researched, not tested"; corrections log exists.

---

## 1. The budget-conscious traveler who hates pet fees and Amazon upsells

**WHO (simulated).** Books cabins twice a year, reads fee lines before photos, assumes any gear page is trying to add to the cart.

**WANTS from a recommendation.** Proof an item is worth buying at all, the cheapest sensible route (borrow, improvise, skip), and no pressure.

**SEES.** Home leads with stays and "no pet fee" filters, which is exactly on mission, and the guides on fees and "3 managers with no pet fee" are strong. Gear cards give a single named pick and "See it at Amazon". The planner closes with "You may already have some of these. Only pick up what you actually need", and the life-jacket guide says "Dogs that only wade: skip".

**MISSING.** A tier within each category without stating prices: "the basic option", "the cheaper-by-skipping option", "make do with what you own" (a towel and a bungee in place of a hammock). Today each category reads as a catalogue of buy-this items. No "skip this whole category if..." at the top of /gear categories. The "A different approach" card in the planner is the right idea but it rarely shows the no-purchase approach.

**LEAVES** when a category page opens with ten cards and no sign anything is optional.

**Scores.** Appeal 6/10 (the fee content is excellent; gear feels like a shop). Click-likelihood 3/10 (he mostly will not click, and the site arguably should not push him to).

**GAP / PROPOSAL.** Add a one-line "Already have a ___? You may not need this" and a "Cheaper route without buying" row to each category's How-to-choose block. No prices needed.

---

## 2. The researcher who reads every source and distrusts affiliate sites

**WHO (simulated).** Opens the "Specs, fit & sources" panel first, checks the maker page, looks for who funds the site.

**WANTS.** Primary sources, claims separated from evidence, an honest account of the conflict of interest.

**SEES.** This is the site's best audience. Maker claims are split from independent testing, conflicts between sources are flagged (Sleepypod weight discrepancy), every card has a read date, the life-jacket guide admits "No maker page names a flotation certification", and /editorial-standards concedes affiliate money "can affect which products we point to". That candour is rare.

**MISSING.** (a) /affiliate-disclosure and /editorial-standards differ in tone: one says commissions do not change what is said, the other that they affect which products appear. A researcher will notice the page never says how many categories contain a non-affiliate maker link, or what happens when no affiliate link exists (the card then shows the maker page, which is good, but this should be said on the hub). (b) No visible list of products considered and rejected. (c) No change log per product (what changed since last read). (d) The AI re-read is not described in enough detail to audit: which model role, what it checks.

**LEAVES** only if a source link is dead or a claim is uncited; the guides are strong here.

**Scores.** Appeal 8/10. Click-likelihood 6/10 (clicks are deliberate and maker-page clicks are likely too, which earns nothing; that is the honest trade).

**GAP / PROPOSAL.** A "How we handled this category" box: sources read, picks considered and left out, whether any pick has no affiliate link. Add per-card "last checked" and "changed since" lines.

---

## 3. The impulse buyer on Pinterest who wants "the best harness" right now

**WHO (simulated).** Lands from a Pin, wants one answer and a button within a scroll.

**WANTS.** A named winner, a visual, a big buy button.

**SEES.** The crash-tested harness guide opens by declining to name a harness ("we cannot verify a current harness listing, so we recommend none") and gives four steps to check the CPS directory. It lists a Lucky Kennel crate, a 12 lb carrier and a booster. The page is an 8-minute read. Gear cards use a stylised glyph panel rather than a photo, so a Pinterest visitor sees no product picture. The home page links Pinterest only from the footer.

**MISSING.** A fast path: a top-of-page "If you only read one thing" box with the one pick per weight band and the single button. A product image or at least a maker-sourced one (licence permitting). Pin-specific landing: Pinterest visitors should land on /gear?trip= or a category, not a long guide.

**LEAVES** within seconds: no photo, no winner, long read.

**Scores.** Appeal 3/10. Click-likelihood 2/10. This persona is a poor fit for the site's honest positioning, but about half of what he wants (a clear pick per weight band) is available and just hidden.

**GAP / PROPOSAL.** Add "Quick pick by dog weight" at the top of each safety guide (under 12 lb, 12 to 70, 70 to 110, "no pick: check CPS directory"), each with the same card button. Where no honest pick exists, say so in one line.

---

## 4. The practical minimalist who wants the 5 things to pack and nothing else

**WHO (simulated).** Packs a single bag, resents "just in case" lists.

**WANTS.** An essentials-only list and permission to skip the rest.

**SEES.** The planner lets her choose trip type and considerations, and the checklist is tailored, which is good. /gear trip views have four groups and nine products for a road trip, but no essentials/optional split. The "Things to pick up" list helps. But the hub offers eleven categories, and the home page shows "Travel essentials" as three categories, none of which is the actual essentials.

**MISSING.** An "Essentials only" toggle in the planner and on trip pages (collar tag, leash, water, food, waste bags, vaccination record). A "must-have vs nice-to-have" tag on each trip product. A short card "The five things" on /gear.

**LEAVES** when the checklist exceeds one screen and nothing says what to drop.

**Scores.** Appeal 6/10. Click-likelihood 4/10 (she buys little, but each purchase is high-intent).

**GAP / PROPOSAL.** Mark every packing item and trip product "Essential" or "Only if...", and add a planner view "Essentials only". Needs no calculator.

---

## 5. The safety-first owner (car restraint, life jacket, first aid) who wants evidence

**WHO (simulated).** Will pay more for evidence, reads standards.

**WANTS.** Independent test results, what the standard is, who skips what.

**SEES.** The strongest segment of the site. The car-safety card says "Not CPS certified" where true; the guide explains that no federal standard exists, that CPS studies are old and use weighted simulants; the life-jacket guide quotes the Coast Guard that there is no federal standard; the first-aid guide uses AVMA as primary source and sets out what not to do. "Who should skip it" exists.

**MISSING.** The headline problem: the main car-safety guide recommends no harness, so he leaves with a method but no product, and cannot tell whether the site stands behind anything. He also lacks a one-screen "evidence ladder" (independent certification > independent test > maker claim > listing only) shown on the cards in a consistent badge. First-aid: the cabin kit has no contents list; the thermometer is "listing only".

**LEAVES** if he feels the answer is "go look it up yourself".

**Scores.** Appeal 8/10. Click-likelihood 5/10 (high trust, but few clickable winners).

**GAP / PROPOSAL.** A consistent "Evidence level" label on every safety card (CPS-certified / independent test named / maker claim only / listing only) using the existing data fields, and a plain "What we would buy today, and why" per weight band even where the evidence is thin (stated as a researched choice, not a test).

---

## 6. The gift buyer looking for a present for a dog-travel friend

**WHO (simulated).** Does not own a dog, knows only that the friend road-trips with one.

**WANTS.** A shortlist of safe gifts, a budget feel, not-too-technical language, maybe gift-wrappable.

**SEES.** No gift guide, no "under a budget" grouping (the site rightly avoids prices), no "gifts" in /guides filters (All, Destination, Planning, Checklist, Gear). Trip cards help a little: "Road trip" gives nine items but includes size-dependent ones (ramps, kennels, harnesses) that are risky gifts.

**MISSING.** "Gifts that need no sizing" (collapsible bowl, water bottle, cargo cape, ID tag), "Don't gift these without asking" (harnesses, life jackets, kennels), and a "Ask the owner these three questions" list. A way to send the shortlist (copy link).

**LEAVES** immediately; nothing speaks to a non-owner.

**Scores.** Appeal 2/10. Click-likelihood 3/10 (clicks happen only if he guesses his way into /gear?trip=road-trip).

**GAP / PROPOSAL.** One page, "Gifts for a dog-travel friend", built only from existing researched products, split into "no sizing needed" and "ask first", with disclosure. No prices, no ratings.

---

## 7. The traveler who already owns lots of gear and wants only what's missing

**WHO (simulated).** Has a crate, harness and bowls from past trips.

**WANTS.** A gap check: "I have X, Y, Z; what am I forgetting?"

**SEES.** The planner is nearly ideal: items can be marked packed or removed, and only items marked "Need to buy" open a shopping panel, which avoids upsell. The "Things to pick up before you go" list gives the gap. Copy and print are available.

**MISSING.** An "I already own this" state distinct from "Packed" (so the Need-to-buy list never suggests it). A first-run question "Do you already own...?" for the big-ticket categories. Trip-specific gaps (winter, beach) pre-surfaced as "items people forget". The panel's fallback "We don't have a matching product recommendation" is a dead end that tells him nothing about how to choose.

**LEAVES** if the planner treats every unchecked item as a purchase candidate.

**Scores.** Appeal 7/10. Click-likelihood 5/10 (few clicks, but they are real needs).

**GAP / PROPOSAL.** Add "Have it" as a third state next to "Packed" and "Need to buy"; show a "What people often forget for this trip type" strip using existing checklist data.

---

## 8. The mobile-only scroller on a phone at the airport or in the car

**WHO (simulated).** One-thumb use, patchy signal, short attention.

**WANTS.** A small answer, offline-friendly, tap targets.

**SEES.** Judged from rendered page structure and CSS class names only, not a real device. Cards are single column with the details behind an expander, which suits a phone. The planner saves on-device with no sign-up, which helps in a car. But the car-safety guide is an 8-minute read with a 16-source list. The "See it at Amazon" link opens a new tab, which on mobile often jumps into the Amazon app and loses the planner context. Pages shipped without JS show setup only (the planner content is JS-driven), so a failed load shows little.

**MISSING.** A sticky "Jump to list" in the planner; an offline-readable saved list (service worker), a share-by-text link of the checklist; a "skip to products" anchor at the top of long guides; confirmation the list survives the Amazon round trip.

**LEAVES** when a long guide forces scrolling past 8 minutes of text to find a button.

**Scores.** Appeal 6/10. Click-likelihood 4/10.

**GAP / PROPOSAL.** Top-of-guide "Jump to products" link, a "Copy list as text" button already exists on the planner (extend it to a shareable summary), and a tap-friendly "Back to my list" anchor after each external link.

---

## 9. The person who wants to book a stay

**WHO (simulated).** Has dates and a dog, wants a place, not gear.

**WANTS.** Filters that match the dog, trustworthy confirmation of fees, fence and limits, and a clear next step.

**SEES.** /stays has 78 listings and filters by state, town, type, dog count, weight limit, and must-haves, where "only stays where the feature is confirmed will match". Cards say "Not confirmed" for many fees. Detail pages state the source (Vrbo listing read on a date, not verified with the host), a policy table, a "Before you book" note, a host-question list, and a link "See photos and check dates on Vrbo" with an affiliate label next to it.

**MISSING.** The confirmed-only filter silently hides the many stays that are merely unknown, so he may see few results with no explanation of how many are hidden. No photos on the directory (sent to Vrbo). Internal contradictions between summary and tags (for example "up to 2 dogs" with "no limits stated"; "Large dogs: No" with no reason). No "send these questions to the host" copy button. No side-by-side shortlist of three stays. The button wording is a plain link, not a clear CTA.

**LEAVES** at the first contradiction, or when filters return too few matches.

**Scores.** Appeal 7/10. Click-likelihood 6/10 (the trust language is strong, but the data quality caps it).

**GAP / PROPOSAL.** Show "N more stays match but are unconfirmed" with a toggle; add a "Copy my questions for the host" button; add a 3-stay shortlist (stored on device). Fix tag/summary conflicts at the data level.

---

## 10. The skeptic who asks "who runs this, are you an AI, why should I trust this?"

**WHO (simulated).** Wary of AI-generated affiliate content, has been burned by fake reviews.

**WANTS.** A named human, the AI role stated plainly, proof of care, a way to check.

**SEES.** /about gives "an independent publication launched in November 2026", "Paws & Passage Editors", no bio (the owner chose none), no AI mention on that page. The AI disclosure lives only on /editorial-standards, which is honest ("AI tools for research, data analysis, content development, organization and website operations"; AI re-read "not described as review by a human fact-checker"). /methodology names no reviewer. "Researched, not tested" is clear and repeated in the footer of /gear. No fake ratings. Corrections log public.

**MISSING.** The AI disclosure is one click too far: /about does not mention it, and the byline "Editors" can read as a human team. No stated human accountability ("a person reads and is answerable for every published page", if true). No explanation of why anyone should trust a site launched this month: no track record, no named experts, no external endorsement. The first-person "we" with no human gives a skeptic nothing to hold onto. The site does honest things (candour about affiliate influence) that are not surfaced where the skeptic looks, which is the first screen of /about.

**LEAVES** when /about is evasive or the AI line is hidden.

**Scores.** Appeal 6/10. Click-likelihood 3/10.

**GAP / PROPOSAL.** Put a three-line "Who and how" box at the top of /about and in the footer of each guide: what AI does here, what a human does (state only what is true), and what we have not done (tested, visited). Add a "Trust checklist" (what to verify yourself in 60 seconds).

---

## Summary table

| Persona | Appeal | Click-likelihood | Top gap |
|---|---|---|---|
| 1 Budget traveler | 6 | 3 | No "skip it / make do" tier per category |
| 2 Researcher | 8 | 6 | No per-category "considered and left out" and inconsistent affiliate-influence wording |
| 3 Pinterest impulse buyer | 3 | 2 | No quick pick, no product picture, long reads |
| 4 Minimalist | 6 | 4 | No essentials/optional split |
| 5 Safety-first | 8 | 5 | Main car guide names no product; no uniform evidence label |
| 6 Gift buyer | 2 | 3 | No gift page or "needs no sizing" grouping |
| 7 Already owns gear | 7 | 5 | No "Have it" state |
| 8 Mobile scroller | 6 | 4 | Long guides, no jump-to-products, new-tab Amazon round trip |
| 9 Stay booker | 7 | 6 | Confirmed-only filter hides unknowns; data contradictions; no host-question copy/shortlist |
| 10 Skeptic | 6 | 3 | No human accountability line; AI disclosure absent from /about |
| **Average** | **5.9** | **4.1** | |

## Selling tactics in use today

| Tactic | Strong | Weak |
|---|---|---|
| Placement | Products sit inside the guide that explains the problem; disclosure precedes them; planner shows products only on explicit "Need to buy" (no upsell). | Long guides bury the first button; no "jump to products" or quick-pick box; Pinterest and home route to stays or long reads. |
| Card design | Single named pick, "Check:" caution, claim-vs-evidence panel with read date, consistent "See it at Amazon", details behind an expander. | No product photo (glyph panel), no "best for" badge, no evidence-level badge, no "skip if" on the card itself (only in guides), no alternative at a different budget. |
| Planner Need-to-buy flow | Honest four-state response, one alternative ("A different approach"), collected "Things to pick up", copy and print, device-only save. | No "Have it" state, dead-end note when no pick, no essentials-only view, no shareable link. |
| Trip collections | Five trips, grouped by purpose, with cautions. | No essentials vs optional, no "best for" or ordering by need, no shortlist. |
| Disclosure | Exact Amazon sentence, one notice per surface, dedicated page, candid statement that commission affects which products appear. | Two pages describe the influence differently; disclosure is far from where the skeptic looks (footer on home). |
| Trust pages | Researched not tested, corrections log, AI disclosed, no fake ratings. | No human named, AI absent from /about, no track record, no reviewer. |

## The 8 highest-impact missing elements, ranked

1. **Quick pick by dog weight or need at the top of each gear guide** (one honest pick, one button, "or skip"). Serves personas 3, 4, 8. Within rules: researched wording, no prices or ratings.
2. **Uniform "Evidence level" label on every safety card** (CPS-certified / independent test named / maker claim only / listing only). Serves 2, 5. Uses data already on the cards.
3. **"Who runs this and how" box on /about and guide footers** with the AI role, the human role stated only as true, and what was not done. Serves 10 and 2.
4. **"Skip it or make do" row per category** (the no-purchase route and who should not buy). Serves 1, 4, 7. Fits "products only when they make the trip easier".
5. **Essentials vs optional tags plus an "Essentials only" planner view.** Serves 4, 1, 8.
6. **"Have it" state in the planner and a "forgot this" strip.** Serves 7, 1.
7. **Stays: "N unconfirmed matches" toggle, "Copy host questions", and a three-stay on-device shortlist, plus data fixes for contradictions.** Serves 9.
8. **Gift page built from existing products** ("no sizing needed" vs "ask first"), plus a unified affiliate-influence statement across /affiliate-disclosure and /editorial-standards. Serves 6 and 2.

All eight avoid stock, prices, ratings, testing claims, calculators, newsletters, accounts and fake urgency, and keep one affiliate notice per page.

## What I could not verify

- A real mobile device or viewport: mobile judgements rest on rendered text and class names, not on screenshots or touch behaviour.
- The planner's Need-to-buy panel as rendered; WebFetch returns static text, so I read `Shopping.tsx` for its states and did not see live output or which items map to which products.
- Whether product images exist at all on cards beyond the glyph panel (WebFetch sees no images).
- Bot-wall or cache effects: WebFetch caches 15 minutes, and the repo is being edited by other workers, so live pages may already differ from the cited wording. Two slugs I guessed first (/guides/crash-tested-dog-harness-or-crate, /guides/dog-first-aid-kit-for-travel, /stays/creekside-cottage) returned 404; the working slugs differ from the titles in /guides.
- Click behaviour, analytics, conversion rates: all scores are editorial judgements, not data.
- Pinterest and Amazon-app behaviour after a click.
