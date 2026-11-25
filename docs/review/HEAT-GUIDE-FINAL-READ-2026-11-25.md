# Heat guide final read, 2026-11-25

Guide: content/guides/keep-a-dog-cool-on-a-summer-trip.md (layout: emergency). Independent read as a skeptical veterinary-literate editor. Sources fetched live today.

## Sources checked
| Source | Status | Result |
|---|---|---|
| AKC heat-stroke-in-dogs | 200 | Verified: move to cool/AC space; tepid or cool (not cold) water, spray/sponge; fan; room-temperature water only if alert and able to drink; extremely cold water can cause shock; 104 F or cannot get below 105 F: vet right away, AC car; vet visit essential even if recovered; never leave in parked car even briefly; rectal thermometer for kit; at-risk groups (puppies, seniors, overweight, health problems, short-snouted); early/severe signs. AKC gives 105.8 F and 105 F elsewhere on the page; guide's "above 104 F" matches the 104 F escalation sentence. No stopping temperature is given by AKC, so none is claimed. |
| Cornell heatstroke page | 200 | Verified: 105 F; signs (drooling, vomiting, weakness, confusion, seizures, collapse); risk (thick/dark coat, respiratory/cardiac); cool water; car AC to hospital; never leave in car; prevention list. |
| AKC dog paws hot pavement | 200 | Verified: ten-second hand test; 85 F wording; JAMA 135 F at 86 F; early morning/evening, grass/shade. |
| Royal Kennel Club hot pavements | 200 | Verified: seven seconds; sun, wind, humidity. |
| MDPI Animals 2022 vests | 403 bot wall | UNVERIFIABLE (not bypassed). Guide claim is only that it "looked at vests in moderate heat"; matches the title. |
| UF 2012 vest study | 200 | Verified: seven dogs, vests helped some dogs cool faster, preliminary. |
| Humane World | 200 | Verified: 100s on a 70 degree day; AC no guarantee. |
| ALDF hotcars | 200 | Verified: as of 2025, 32 states plus DC and Guam; rescuer prosecution risk; contact law enforcement first. |
| animallaw.info table | 200 | Verified: Florida civil immunity incl. 911 notice; California up to $100 per animal first conviction; Texas no dog-specific statute. |
| Ruffwear Swamp Cooler | 200 | Verified: sizes XXS 13-17 in to XL 36-42 in, soak/re-soak, evaporative, no heat illness claim, two conflicting between-sizes instructions. |
| Green Pet Shop Cool Pet Pad | 200 | Verified: five sizes, 3 hours, 15-20 min recharge, 12-month warranty for defects, sun/hot car/chewing warnings, and the maker's "prevents dangerous overheating" claim (guide discloses it as untested). |
| Chewy | 200 | Verified: pad "up to four hours". |
| Cornell summer safety tips | 200 | Verified: half-hour breaks from water; fresh water beforehand. |
| Kurgo Splash Free Wander | 200 | Verified: wedge lays flat, tapered lip, 24 oz; food-grade silicone confirmed in feature bullets. |
| Springland 22oz | curl 403; WebFetch 200 | Partly verified: squeeze-to-fill, extra drains back, carabiner. "Food-safe BPA-free polypropylene" and "leak-proof lock design" not visible in the text my fetch returned (page appears to render materials dynamically); earlier workers' claims files record them as read live. Not a safety claim; MINOR, left as is. |

All 15 frontmatter sources are linked in the body. No source contradicts a claim. accessedOn 2026-11-19, lastReviewed 2026-11-24: plausible.

## Claims checked
Signs, thresholds (104/105 F, both attributed correctly), cool-not-cold water, no ice baths, vet check after recovery, never leave in car, car heating on a 70 degree day, hot-car law counts and three state examples (all attributed and dated), hand tests (10 s and 7 s, each attributed), paw/asphalt figures, beach water breaks, breeds/groups at risk, vest evidence (small, working dogs, disclosed), product specs and caveats, FAQ answers (inline markdown, no raw HTML), JSON-LD (Article headline/description/dates match frontmatter; no Product, Review, Rating or FAQ-overclaim), title and description (do not promise prevention or guarantees). Medication advice: none. Diagnosis claims: none; the page tells readers to treat uncertainty as an emergency and to see a vet. Product wording: no prevents-heatstroke or guarantee claims in the guide's own voice, no tests, ratings, prices or "best"; caveats present (skip-if lines, pad not for hot cars, chewers); affiliate notice present in the first screen above the first card and the final build adds one. Product pick links use the maker URLs given in the pick tokens; content tests pass.

## Findings
MATERIAL (fixed), 1:
- Emergency step 3 told readers to "offer small sips of water" unconditionally, attributed to AKC and Cornell. AKC says to offer room-temperature water only if the dog is alert and able to drink; Cornell does not mention drinking. Offering water to a collapsed or seizing dog risks aspiration.
  - Before: "Wet the dog's body, fan it, and offer small sips of water"
  - After: "Wet the dog's body, fan it, and offer water only if the dog is alert and able to drink; never force it"
  - Commit edbd6e0. Citations, front matter and word count essentially unchanged; content.test.ts 293 passed.

MINOR (not changed):
- Springland materials/leak-proof wording could not be re-confirmed by my fetch (see above).
- MDPI source unreadable (403).
- The guide does not state a stop-cooling temperature; the cited guidance gives none (AKC only says continue while above 105 F and cool gradually), so omission is correct.
- AKC's own 105.8 F figure is not mentioned; the guide says to treat uncertainty as an emergency.

## Emergency steps as rendered at 390 px
Built with NITRO_PRESET=node-server, served from scratchpad on port 4765, headless Chrome at 390 x 844. First screen shows: title, dek, affiliate notice, collapsed "On this page", and the heading "If your dog is overheating right now" with step 1 (get out of heat) and step 2 (call a vet or emergency vet now, on the way) fully visible and step 3 starting at the fold. Steps 3 to 5 are one short scroll down; the section is the first content section and first in the table of contents. Acceptable; not changed.

## Verdict
FIXED AND SAFE (full vitest suite status noted in the hand-off message).
