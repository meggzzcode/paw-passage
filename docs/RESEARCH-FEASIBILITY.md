# Research: Feasibility of Candidate Tools (Paws & Passage)

Researched 2026-11-17. Labels: SEEN = I fetched/read the page myself in this session; REPORTED = a search-result summary or third-party page said so; NOT CONFIRMED = I could not verify (fetch blocked, 404, or no source). Nothing below is invented; gaps are stated. Many official sites blocked or 404'd the fetch tool, so a number of "official page" claims are NOT CONFIRMED and need a human check in a normal browser.

## Fetch results log (bot blocks matter for maintenance)

| URL | Result |
|---|---|
| nps.gov/pore/planyourvisit/pets.htm | SEEN, readable, dated "Last updated June 27, 2024" |
| nps.gov/chis/planyourvisit/pets.htm | SEEN, readable, dated May 25, 2021 |
| nps.gov/chat/planyourvisit/pets.htm | SEEN, readable, dated May 30, 2019 |
| parks.ca.gov/dogs | SEEN, readable, no revision date (only "(c) 2026") |
| parks.ca.gov/?page_id=30090 | SEEN, but a single-park page (Cuyamaca) under a generic "Dogs" title; no date |
| gastateparks.org/ParkRules | SEEN, readable, no date |
| gastateparks.org/pets | SEEN, but only a category/news landing page, no rules |
| animallaw.info/node/39404 | SEEN (summary), readable |
| delta.com/us/en/pet-travel/overview | SEEN, readable; "last updated" shown without a date |
| united.com pets page | 503 (blocked/unavailable) |
| aa.com pets page | 403 (bot block) |
| marriott.com/support/pet-policy.html, hilton.com/en/p/pet-policy/ | 404 (URL guesses; not verified to exist) |
| motel6.com pet policy | 503 |
| kimptonhotels.com pet page | 403 |
| centerforpetsafety.org/cps-certified/ | fetch returned empty; only search snippet seen |
| aphis.usda.gov pet-travel URLs | 404 (URL guesses wrong; page not located) |
| NPS developer pages | SEEN: API needs a free key; no pet-field list found |

Takeaway: scraping is unreliable (403/503 from airlines, hotels, Kimpton). Any tool must be hand-curated by a person with a browser, not auto-refreshed.

---

## 1. "Can my dog go here?" park/trail/beach lookup

- Data availability: MEDIUM. Official rule text exists for nearly every unit, but as prose, not a structured dataset.
- NPS API: requires a free key (SEEN, nps.gov/subjects/developer/get-started.htm). I could not confirm any dedicated "pets" field in the parks endpoint (NOT CONFIRMED); in practice pet rules live in per-park web pages ("Pets" page under Plan Your Visit), which are the readable source. Rate limits: official guides page says exceeding limits blocks a key for an hour (REPORTED via search); numeric limit NOT CONFIRMED.
- Georgia State Parks: gastateparks.org/ParkRules states the general rules (6-ft leash, not left unattended, max two dogs per cottage, $50/dog fee covering the stay, no dogs in buildings, lodges, yurts, swimming areas, beaches) (SEEN, no date). Fee and rule specifics are exactly what changes silently. Per-park pages not checked.
- CA State Parks: parks.ca.gov/dogs has a statewide rule set plus a table of dog policy per park (SEEN). Statewide rule: 6-ft max leash; dogs generally not on trails/undeveloped areas unless designated; "not permitted on most beaches." Many local exceptions (SEEN: Corona del Mar State Beach allows dogs before 10 a.m. and after 4:30 p.m.; seasonal ski-trail limits Nov 1-May 1 at Burton Creek and Plumas-Eureka). The regulation text itself is also public (REPORTED, search result quoting the California Code of Regulations).
- USFS (Chattahoochee-Oconee NF): fetch redirected and I did not complete it. NOT CONFIRMED. Typically general dog rules apply by recreation area (leash requirements at developed sites); verify per site.
- Legal/reuse: NPS and USFS content is US federal work and generally not copyrightable (REPORTED by third-party API listing citing 17 U.S.C. 105; the official NPS terms statement was NOT CONFIRMED). State sites (GA, CA) have no verified reuse licence; treat as copyrighted. Safe pattern: write our own short paraphrase of the facts, link the official page, never copy the page wholesale.
- Freshness: NPS pages are often old (2019, 2021, 2024 dates seen), which is good for stability but means a stale page may not match reality; check "Current Conditions" pages (the Point Reyes page itself says to). Rules change by closure, season, wildlife protection (Point Reyes: Tomales Bay west-side beaches closed to pets as of May 30, 2023, SEEN).
- Five concrete examples (what the page says, readability):
  1. Channel Islands NP: "pets are not allowed in the park" (islands); service animals only with a health protocol. SEEN, clear, dated 2021. Easy to read reliably. Rule: No.
  2. Point Reyes NS: leash 6 ft always; allowed on Kehoe Beach trail, Limantour Beach, Point Reyes/Great Beach (North Beach lot south to old lifeboat station); other trails closed; Tomales Bay west-side beaches closed. SEEN, dated June 2024. Complex, per-segment rules; needs hand-written summary and map-level care.
  3. Chattahoochee River NRA (Georgia): pets allowed on trails, leashed 6 ft or shorter including in the water, no unattended pets. SEEN, dated 2019. Clear, but five years old.
  4. Georgia State Parks general rules: 6-ft leash, no beaches/swim areas/buildings, $50/dog cottage fee, 2 dogs max. SEEN, undated, readable.
  5. California State Parks statewide: 6-ft leash, not on trails unless designated, not on most beaches, Corona del Mar time-window exception. SEEN, undated; the individual park table (not fully read) holds the exceptions.
  No bot block on these five via fetch; blocks were seen elsewhere (airlines/hotels).
- Rule-text consistency: LOW to MEDIUM. Federal pages follow a template but vary per unit; state pages are prose plus a table. Needs a human to normalize into fields (allowed on trails Y/N/some, beaches Y/N/some, leash length, fees, seasonal limits, exceptions).
- Build effort (static site): S for the page and filter (JSON/YAML/Markdown file, client-side filter). Data entry is the work.
- Maintenance for non-technical buyer: MEDIUM. ~100 entries, each needing a 5-minute recheck; at twice a year that is ~16 hours/yr. Mitigate: prioritize 30 high-traffic entries for 6-month rechecks, rest yearly; a spreadsheet/CSV the buyer edits plus a per-entry "last checked" date.
- Accuracy risk: MEDIUM. A reader could take a dog to a closed beach and be cited, or be turned away. Mitigate: "Last checked: date" and "Official source" link on every row; red "Confirm on official page" banner; show "stale" badge when last-checked is more than 12 months; avoid saying "allowed" without a leash/area qualifier.
- Would an AI chatbot likely be wrong/outdated? Opinion: Often, yes. Rules are local, seasonal, change by closure order and are in pages dated years apart; models tend to blur between similar parks and lack the 2023 Point Reyes change. Your value is a dated, linked, human-verified row.

## 2. State-by-state road-trip rules

- Data availability: MEDIUM for vehicle laws, LOW for a trustworthy single compilation of health-certificate/rabies rules.
- Leaving animals in vehicles: Animal Legal & Historical Center (Michigan State University) has a "Table of State Laws that Protect Animals Left in Parked Vehicles." SEEN summary: about 32 states have such laws; about 14 let any person rescue (incl. AZ, CA, FL, OH); penalties vary; many local ordinances also apply. Georgia's status: search found no specific Georgia statute (REPORTED; NOT CONFIRMED, check the ALHC table's Georgia row). California: Penal Code 597.7 (REPORTED). Counts differ across sources (16/19/31/32), so older blogs are unreliable.
- Restraint: California Vehicle Code 23117 covers dogs in open truck beds (cross-tether, crate, or 46-inch side/tail racks) (REPORTED via animallaw.info/california.public.law). Georgia: no enacted truck-bed statute found; bills (HB1091 vetoed 2014; later HB 290, HB1450) status NOT CONFIRMED. No general dog-restraint-in-cabin statute known; some states penalize via distracted-driving laws (REPORTED by a blog, weak).
- Health certificates/rabies: USDA APHIS has pet-travel pages, but the domestic state-requirements URL I tried returned 404, so I could not confirm what APHIS offers for domestic state links (NOT CONFIRMED). Domestic requirements are set by each state vet office and many states accept a CVI/rabies certificate for entry; the CDC's dog-import rules concern entering the US and are a separate topic (not researched).
- Legal/reuse: Statute text is public, but ALHC's table is a copyrighted compilation; link to it, do not copy it. Our own plain-language summary of a statute with a citation and link is fine, but get legal review for any "must/must not" wording.
- Freshness: statutes change a few times a year nationally; entries per state could change at any session. ALHC table appears updated for 2025 (REPORTED).
- Build effort: M (50 states x several fields, citations). Launch-scope version (GA, CA and neighbors on typical road trips) is S.
- Maintenance burden: HIGH if 50 states, MEDIUM for 6-10 states. Needs someone to read statutes.
- Accuracy risk: HIGH. Legal consequences, nuance (livestock exceptions, local ordinances, "any person may break in" rules that can expose a reader to liability). Mitigate: scope to "heads-up, not legal advice," cite statute numbers, state "last checked," link to the primary source.
- AI chatbot: Likely partly wrong. Bills vs enacted laws are routinely confused, counts differ, and it can state a statute that was never enacted. Strong risk of confident error.

## 3. Airline cabin pet checker (top ~8 US airlines)

- Data availability: HIGH for existence, LOW for reliable reading. Each airline publishes a page, but fetches were blocked (United 503, American 403); only Delta was readable.
- Delta (SEEN, official page): cabin fee $150 each way for U.S. tickets issued on/after April 8, 2025 ($95 before); recommended soft-sided kennel 18x11x11 in, must fit under seat; no weight limit stated; per-cabin pet limits (e.g., Delta First 2, Comfort/Main 4, Delta One/Premium 0). No breed or temperature rules on that page.
- Other airlines: only third-party summaries seen (REPORTED): United $150 each way, American $150, Southwest around $125, Alaska different, JetBlue nothing found, Spirit reported to have ended operations May 2026 (NOT CONFIRMED). Those blogs disagree on carrier dimensions; do not use them as sources.
- Legal/reuse: facts (fee, dimensions) are not copyrightable, but the airline terms may restrict scraping; hand-entry with links is fine.
- Freshness: fees and dimensions change roughly once a year per airline, with rule changes tied to ticket-issue dates (Delta), and per-flight limits and seasonal embargoes (heat, short-nosed breeds) vary by route.
- Build effort: S-M (8 airlines x ~10 fields).
- Maintenance: HIGH relative to value; 8 pages x quarterly check. 
- Accuracy risk: HIGH. Wrong fee or carrier size can cause a denied boarding or a missed flight at the airport; policy depends on ticket date, aircraft, and route. Mitigate: show fee as "about" with a "last checked" date and official link, never claim eligibility.
- AI chatbot: Very likely outdated or wrong (fees changed in 2025; models mix airlines).
- Recommendation: do not build as a checker; at most a dated comparison table.

## 4. Hotel chain pet policy comparison

- Data availability: MEDIUM-LOW from official sources. Fetch of official brand pages failed (404/403/503; my URL guesses may be wrong, so NOT CONFIRMED whether official chain pages exist for each brand).
- REPORTED by third-party guides (NerdWallet, AKC, others): Kimpton allows pets with no fee and no size limit (chain-level); Motel 6 up to two pets free (Studio 6 may charge); Best Western 2 dogs, 80 lb (REPORTED, varies); Marriott, Hilton, Hyatt, Wyndham, Choice, La Quinta are property-level for fees and limits, with no Marriott brand accepting pets at all properties. Fee figures from guides are averages and not current guarantees.
- Legal/reuse: facts fine; avoid copying marketing text or logos beyond nominative use.
- Freshness: chain-level policy rarely changes; property-level policy changes at any time.
- Build effort: S. Maintenance: MEDIUM. Accuracy risk: MEDIUM-HIGH, because the chain policy does not bind the property (the main risk: reader assumes a chain rule applies).
- Value: low differentiation; the real need is property-level, which is already on the property page and booking sites.
- AI chatbot: Moderately accurate on general chain-level tendencies, wrong on fees and property specifics.

## 5. Rental listing red-flag checker (client-side, keyword rules)

- Data availability: HIGH (no outside data needed; the rule set is ours).
- Approach: user pastes listing text; JavaScript checks for presence/absence of: pet policy mentioned at all, pet rent or monthly fee, deposit vs nonrefundable fee, breed or weight restrictions, pet limit, "no pets" or "case by case", service-animal/ESA language, damage or cleaning clauses, pet-interview/references, insurance requirement. Output is a "missing / risky / present" list with suggested questions to ask the landlord.
- Legal: our content only; add a disclaimer (not legal advice). No third-party data, so no licensing issue. Privacy: runs in the browser, nothing sent.
- Limits: keyword matching misses phrasing and sarcasm, negation ("pets not prohibited"), and images; listings often omit pet terms entirely (which the tool flags as missing, a useful signal). Can't judge lease legal validity; fair-housing/ESA rules vary and need care.
- Build effort: S-M (rule list, UI, tests with 20 sample listings). Maintenance: LOW (rules rarely change; no external data). Accuracy risk: LOW-MEDIUM (false negatives; mitigate by wording as "questions to ask," not verdicts).
- AI chatbot: A chatbot could do this well for free, so differentiation is weak; the advantage of ours is private, instant, consistent, and checklist-based. Not outdated, but not data-driven either.

## 6. Crash-tested restraint finder by dog weight

- Data availability: LOW-MEDIUM. The Center for Pet Safety (CPS) has a "CPS Certified" page with Safety Harnesses, Pet Travel Carriers, and Travel Crates (REPORTED via search snippet; direct fetch returned empty, so NOT CONFIRMED). The list appears small: snippet named a few carriers/crates (Gunner G1 kennels, Lucky Duck, Cabela's GunDog, PawsInCar). Harness names were not in the snippet. Sleepypod Clickit Sport sizes/weight (18-90 lb in one blog; another differs) are from retailer blogs (REPORTED, inconsistent), so size/weight ranges must come from the CPS page or the maker.
- Legal/reuse: CPS is a nonprofit; certification marks are its own; terms of reuse NOT CONFIRMED. List facts (product names) are likely fine to reference with a link, but get written permission before reproducing their test reports or ratings; do not use their logo without permission.
- Freshness: low; changes with new certifications, redesigns (Kurgo example, REPORTED). Older studies (2013 harness, 2015 crate) are not the same as current certification.
- Build effort: S (maybe 10-25 products). Maintenance: LOW-MEDIUM (check twice a year). Accuracy risk: MEDIUM (misrepresenting a product as certified, or a size range; product recalls). Mitigate: only list items present on the CPS page, link to the CPS page and the maker, show last checked.
- Affiliate fit: strong (this is a purchase-intent tool). Disclose affiliate links.
- AI chatbot: Often wrong; blogs conflate "crash-tested" (self-claimed) with CPS-certified, and chatbots repeat that.

## 7. Dog-rules map / town cheat sheet for the 8 launch towns

- Data availability: LOW-MEDIUM. The towns were not specified to me, so I did not research specific towns. Typical sources: municipal codes (leash law, dog beach/patio rules), city parks pages, county animal control, local ordinances (often on Municode or American Legal Publishing).
- Legal/reuse: ordinances are public; link to the code section. Our own summary is fine.
- Freshness: ordinances change rarely but silently; patio rules and beach hours change by season.
- Build effort: S for a page per town (a short template: leash law, off-leash areas, beaches, patios, licensing/vaccination, noise/waste fine, who to call). Map: M (requires a map component and coordinates; a plain list is S).
- Maintenance: MEDIUM (8 towns x yearly). Accuracy risk: MEDIUM (misreading municipal code; fines). Mitigate: cite code section and date.
- AI chatbot: Often wrong for small towns; lacks the local code, may state county or neighboring-city rules.
- This doubles as strong local SEO content that an AI answer rarely beats.

---

## Summary table

| # | Tool | Data | Build | Maintenance | Accuracy risk | AI answer likely wrong? |
|---|---|---|---|---|---|---|
| 1 | Park/trail/beach rules | Medium | S | Medium | Medium | Often |
| 2 | Road-trip rules | Medium/Low | M | High (50 states) | High | Likely |
| 3 | Airline checker | High exist / Low readable | S-M | High | High | Very likely |
| 4 | Hotel chain comparison | Med-Low | S | Medium | Med-High | Partly |
| 5 | Rental red-flag checker | High (own) | S-M | Low | Low-Med | Not outdated, but replaceable |
| 6 | Crash-tested restraint finder | Low-Med | S | Low-Med | Medium | Often |
| 7 | Town cheat sheets | Low-Med | S (list) | Medium | Medium | Often for small towns |

## Ranking

1. Park/trail/beach dog rules lookup (scoped)
2. Town dog-rules cheat sheets (8 towns)
3. Rental red-flag checker
4. Crash-tested restraint finder
5. Hotel chain comparison
6. Road-trip rules (limited states)
7. Airline cabin checker

## Recommendation: build the best 2

Note: #1 and #2 pair well (rules by place, one data pipeline, same "last checked" pattern). Rental checker is the lowest-maintenance alternative if the buyer cannot keep data fresh.

### A. Dog rules lookup (minimal version)
- Fields: name; type (state park / national park / forest / beach); region (North GA, coastal CA); town/county; dogs on trails (yes/no/some); dogs on beach (yes/no/some/time-window); leash rule; fees/limits (e.g., $50/dog cabin fee, max 2); key exception (one sentence); seasonal note; official URL; last_checked date; checked_by.
- Launch entries: 30-40 (the most-visited parks, beaches and trails in the two regions), not 100. Add more later.
- Store as one CSV or JSON file in the repo (or Google Sheet exported at build), so the buyer edits one file.
- Show "last checked": date and "Source: official page" link on every card; badge "Needs recheck" if more than 12 months old; a site-wide "rules change; confirm before you go" note. Initial pass uses the pages SEEN above (Point Reyes, Channel Islands, Chattahoochee River NRA, GA State Parks general rules, CA State Parks statewide rules).

### B. Town dog-rules cheat sheets (minimal version)
- Fields per town: leash law and where off-leash is allowed; dog beach/park; patio/restaurant policy; licensing and vaccination; waste/noise rules; vet/emergency vet; who to call; ordinance link; last_checked.
- Launch entries: 8 towns, one short page each (about 150-250 words) plus the official source links.
- Show "last checked" at the top of each page next to the source link; yearly recheck calendar noted in a README for the buyer.

## Caveats
- Several official sites blocked automated fetches, so figures marked REPORTED or NOT CONFIRMED need a human check before publishing.
- Nothing here is legal advice; vehicle-law and airline sections should carry disclaimers.
