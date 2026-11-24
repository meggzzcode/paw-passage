# Numbered source citations on Paws & Passage guides: investigation

Date: 2026-11-24. Status: investigation only, nothing implemented. Method: read the code and guide sources, then measured the frozen build at http://localhost:4174 with Playwright Chromium (1280 px and 390 px). All counts below are from the rendered pages of the 30 public guides (23 Markdown files in `content/guides/` plus 7 TypeScript guides in `src/content/guides/`; 3 Markdown drafts are not published and are excluded).

## Short answer

The numbers are quiet visually but frequent: 1,011 markers in about 87,000 words (11.6 per 1,000 words), 14 to 18 per 1,000 in the heaviest guides. About half the markers sit right after a sentence that already names the publisher ("PetMD says ..."), so the number adds nothing the sentence did not already say. Recommendation: keep every source and its verification data, but switch to one rule. Name the publisher as an inline text link in the sentence. Use a small numbered superscript only when a figure, fee, policy, safety or medical claim has no named publisher in the sentence. Put all sources in one collapsible "Sources" list with the read-on date, and make the superscripts jump to it.

## 1. How the markers are generated

**Syntax (author-typed, in the guide body).** Every marker is hand-written Markdown: `[[7]](https://www.ada.gov/resources/service-animals-2010-requirements/)`. It is an ordinary Markdown link whose text is `[7]`. Example from `content/guides/how-vacation-rental-pet-fees-work.md` line 153:
`- Where the ADA applies, pet fees and deposits must be waived for service animals. [[7]](https://www.ada.gov/...)`. The `.ts` guides use the same syntax inside a template-literal body.

**Data.** The numbers are not computed. The author numbers them by hand, and the same URL is typed again at each use. The matching list is the `sources` array in each guide's frontmatter (`src/content/schema.ts` line 78): `{ title, url, publisher, accessedOn }`, all required, `url` must be https. Marker `n` means `sources[n-1]`, but nothing in code enforces that link. The only check is `src/test/content.test.ts` (line 13), which asserts every source number appears in a `[[n]]` at least once. I verified on the build that today all 1,011 markers match their list entry by URL (zero mismatches in the four guides I checked in depth: car-safety, senior-dog, pet-fees, cold-weather), so the data is clean, but it is held together by discipline.

**Rendering.**
- `src/components/site/Markdown.tsx` lines 37 to 40: in the custom `link` renderer, link text that matches `^\[(\d{1,3})\]$` becomes `<sup class="cite"><a href="URL" aria-label="Source N">N</a></sup>`. The `href` is the external source URL itself, not an anchor to the Sources list. Afterwards a global replace (lines 191 to 194) adds `target="_blank" rel="noopener noreferrer"`. So clicking a marker opens the publisher's page in a new tab.
- `src/styles.css` lines 160 to 164: `sup.cite` is 0.68em, muted colour, `line-height: 0`, no underline until hover or focus.
- `src/routes/guides.$slug.tsx` lines 202 to 232: a section "Sources and how we researched this" with a plain `<ol>` of `title (publisher, accessed DATE)`. List items have no `id`, there is no back-link from the list to the places a source is used, and the list is always expanded. The numbers there come from the browser's `<ol>` counter, not from data.
- Related but separate: `{{pick:id|Label|Why|https://...}}` cards render a "Source" link (Markdown.tsx line 108), and `plugins/content.ts` strips `sources` from the guide meta list (line 477), so the list only exists on the article page.

## 2. Marker counts, all 30 published guides

Words are the visible text of the article body (`.prose-article`, includes tables and product cards, excludes the Sources section). Markers are `sup.cite` elements. "Distinct sources cited" is the number of different URLs the markers point to; in every guide it equals the length of the Sources list (so no source is orphaned today). Sorted by density.

| Guide | Words | Markers | Per 1000 words | Distinct sources cited |
|---|---:|---:|---:|---:|
| vacation-rental-with-a-senior-dog | 2533 | 46 | 18.2 | 32 |
| dog-car-safety-harness-and-crate-guide | 3643 | 64 | 17.6 | 16 |
| cold-weather-dog-gear-for-winter-cabin-trips | 3178 | 53 | 16.7 | 12 |
| new-years-eve-with-a-dog-in-a-vacation-rental | 2655 | 42 | 15.8 | 22 |
| dog-life-jacket-for-lakes-and-beaches | 3071 | 46 | 15.0 | 17 |
| how-many-dogs-can-you-bring-to-a-vacation-rental | 2912 | 42 | 14.4 | 19 |
| airbnb-pet-damage-charge-after-checkout | 2756 | 39 | 14.2 | 19 |
| dog-hiking-gear-for-a-cabin-vacation | 3066 | 43 | 14.0 | 14 |
| vacation-rentals-with-no-pet-fee | 2759 | 38 | 13.8 | 25 |
| if-your-dog-gets-loose-on-a-trip | 3581 | 48 | 13.4 | 20 |
| keep-a-dog-cool-on-a-summer-trip | 3415 | 44 | 12.9 | 15 |
| what-a-dog-really-costs-on-a-vacation-rental | 2517 | 32 | 12.7 | 16 |
| dog-travel-first-aid-kit-guide | 2666 | 33 | 12.4 | 8 |
| two-large-dogs-in-one-car | 3349 | 41 | 12.2 | 16 |
| dogs-in-georgia-state-park-cabins | 2411 | 29 | 12.0 | 17 |
| christmas-week-in-a-cabin-with-a-dog | 3337 | 40 | 12.0 | 18 |
| vacation-rental-with-a-reactive-dog | 2968 | 32 | 10.8 | 17 |
| can-you-leave-a-dog-alone-in-a-vacation-rental | 2692 | 29 | 10.8 | 19 |
| protect-your-car-interior-from-a-dog-on-a-road-trip | 2966 | 31 | 10.5 | 13 |
| vacation-rentals-with-no-dog-weight-limit | 2422 | 24 | 9.9 | 17 |
| dog-travel-bowls-and-food-storage | 3266 | 31 | 9.5 | 15 |
| dog-ramp-or-steps-for-the-car-and-cabin | 3479 | 33 | 9.5 | 11 |
| vacation-rentals-that-welcome-large-dogs | 2280 | 21 | 9.2 | 16 |
| can-dogs-go-in-a-rental-pool-or-hot-tub | 2476 | 22 | 8.9 | 19 |
| dog-friendly-cabin-packing-list | 3312 | 29 | 8.8 | 22 |
| puppy-at-a-vacation-rental | 2984 | 24 | 8.0 | 14 |
| how-vacation-rental-pet-fees-work | 2669 | 16 | 6.0 | 10 |
| pet-friendly-vacation-rental-checklist | 1872 | 11 | 5.9 | 11 |
| portable-dog-fence-and-playpen-guide-for-rentals | 3031 | 17 | 5.6 | 7 |
| vacation-rental-secure-fenced-yard | 2953 | 11 | 3.7 | 11 |
| **All 30** | **87219** | **1011** | **11.6** | **488** (per-guide sum) |


Other totals measured on the same pages:
- Placement: 550 markers in paragraphs, 308 in list items, 153 in table cells.
- 85 markers are stacked directly against another marker ("[1] [2]", "[8] [8]").
- Only 19 markers repeat the same source inside the same paragraph, list item or table row; 202 are repeats of the same source within the same H2/H3 section. So de-duplication alone removes at most 20 percent; the real saving comes from rule changes (section 9).
- Heaviest source hosts by marker count: aspca.org 79, airbnb.com 76, vet.cornell.edu 48, centerforpetsafety.org 46, akc.org 43, help.vrbo.com 38, ruffwear.com 37, kurgo.com 36, petsafe.com 28, petmd.com 26, cdc.gov 23. About 111 markers point to .gov or .edu pages; product-maker spec pages (ruffwear, kurgo, petsafe, soggydoggydoormat, sleepypod and similar) account for a further sizeable share (not counted exactly).
- Heuristic classification (look-back of 350 characters in the same block for the publisher's name, 160 characters for a number or unit): 494 of 1,011 markers (49 percent) follow text that already names the publisher; 293 (29 percent) follow a number, price, temperature, weight or duration; 345 (34 percent) have neither a named publisher nor a figure nearby. These are approximations, good for sizing, not for editing decisions.

## 3. Are they visually intrusive? Real before-examples

At 1280 px they are not, individually: small grey superscripts. They become noticeable in three ways.

1. **Density and stacking in explanatory text.** Cold-weather guide, "The sources agree on the pattern..." paragraph (`content/guides/cold-weather-dog-gear-for-winter-cabin-trips.md` line 174), 390 px, markers 1, 5, 6 and 4 in one 7-line paragraph:
   - Text: "PetMD, written by a veterinarian, gives three bands: cold should not become a problem for most dogs until the temperature falls below 45 F; ... and below 20 F 'all pet parents need to be aware.' [[1]] A Cornell veterinarian quoted by NBC Select says that at 32 F and below it is time to limit all dogs' time outside ... [[5]] PetSmart says anything under 40 F can become risky ... [[6]] ASPCA gives no number, only that if it is too cold for you it is probably too cold for your pet. [[4]]"
   - Screenshot: `docs/editorial/img/before-390-cold-paragraph.png`. At 390 px each marker leaves a visible gap and the numerals trail at line ends, which is the main visual cost.
2. **Stacks of numbers after a short bullet.** `docs/editorial/img/before-390-cold-bullets.png` (lines 164 to 168 of the same guide): "Cold risk depends on the dog. ... [[1]] [[2]]" and "Wipe paws after every outing. ASPCA and Cornell both say so. [[4]] [[2]]". The sentence already tells you who said it, then two numerals repeat it. Also `docs/editorial/img/before-390-car-bullets.png` ("Do not use extension tethers ...: CPS says they increase the risk of injury. [[5]] [[6]]" and "Never leave a dog alone in a parked vehicle. [[7]] [[8]]").
3. **Table cells and spec sentences.** Cold-weather table row (line 178): "Handle cold best. [[1]] [[2]] *Paw care first; do not clip short.* [[2]]" three markers in one cell. Car guide (`before-390-car-weight.png`, line 61): "CPS lists one harness with test dogs of up to 90 lb and one small carrier tested with a 12 lb test dog. [[16]] [[13]]". Pet-fees bullets: `before-390-fees-bullets.png`.

Usability faults found while measuring (these matter more than the look):
- **Tap target.** At 390 px a marker link measures about 6 x 15 CSS px, under the 24 x 24 px minimum in WCAG 2.2 SC 2.5.8 (Target Size, minimum). Phone readers will mis-tap.
- **A number tells the reader nothing.** The aria-label is "Source 5" and the link jumps off-site in a new tab. To learn that 5 is NBC Select you must scroll to the bottom list and count.
- **The list is not a destination.** No marker links to the list, and the list has no anchors, so "check the source" always means leaving the page.
- No horizontal overflow was introduced (document scroll width stayed 390 px).

## 4. Repeated too often?

Yes, in the sense that matters: the same source is announced again and again where the reader gains nothing.
- Cold-weather guide: marker 2 (Cornell) appears 14 times, marker 1 (PetMD) 12 times, in a guide with 53 markers and only 12 sources.
- Car-safety guide: 64 markers and 16 sources; marker 7 appears 10 times, marker 8 nine times.
- 85 stacked pairs, and 49 percent of markers follow a sentence that already names the publisher.
- Density spans 3.7 per 1,000 words (secure fenced yard) to 18.2 (senior dog, which has 32 distinct sources). The spread suggests no house rule on how often to cite.

## 5. Which sources should be inline links, which numbered?

Principle: a source gets a visible number only when the number does a job a link cannot, that is, the claim has no publisher named in its sentence and the reader may need to check it.

| Source type (examples from the guides) | Treatment |
|---|---|
| Publisher already named in the sentence: "PetMD says ...", "AKC's test is ...", "Cornell says ...", "Airbnb says hosts can charge ...", "CPS notes ..." | Inline link on the publisher name or phrase. No number. |
| Platform policy or help-centre page (Airbnb help, Vrbo help, state park rules, manager pages) stating a fee, unit, deadline or rule | Inline link if the publisher is named; otherwise superscript. In fee tables, one source note per table or column rather than per cell. |
| Government or legal text (ADA/DOJ, CDC, NPS, state park pages) behind a rule or requirement | Superscript where the publisher is not named; inline link where it is. |
| Safety figures: temperature thresholds, weight limits, test dog weights, crash-test results, heat/cold limits | Superscript always (even next to a named publisher, to make the figure's origin visible and linkable to the dated list entry). |
| Medical or health claims: poisoning, heatstroke, frostbite signs, first-aid contents (AVMA, VCA, Pet Poison Helpline, Cornell) | Superscript always, plus the dated list entry. |
| Product spec pages (Ruffwear, Kurgo, PetSafe, Soggy Doggy, Sleepypod) behind a size, weight, material or maker claim | Inline link on the product or maker name at first mention in the paragraph; no number. The sentence already says "the maker lists" or "the page says". |
| General background that does not need to be checked line by line | No marker. The source stays in the end list, marked as "also used". |

## 6. Would a compact end references section be better?

An end-only list is better than today's numbers for readability, worse for verification, which is why it should not replace inline attribution:
- Pro: the prose stays clean (this is how Wikipedia-style and long-form guides read well on phones).
- Con: a reader checking "below 20 F" cannot tell which of 12 entries supports it. Today's guides contain claims that rest on one of several sources in the same paragraph.
- The two together work: named inline link for "who said it", numeric superscript for exact figures, and the end list as the dated record. The end list should be collapsible (`<details>`), keep the intro paragraph, show `publisher, title, read on DATE`, give every entry an anchor, and list the back-links ("used in: ...") so verification works in both directions.

## 7. When visible references genuinely help

- **Fees and prices:** a number is only useful if the reader can confirm which page said it and when. "$75 per stay" from a manager page should carry its source and date, because fees change.
- **Policies:** pet rules, breed or weight limits, service-animal law (ADA/DOJ), state park rules, platform damage and cancellation terms. Legal and contractual claims are the ones a reader may need to quote at a host or at the desk.
- **Safety figures:** crash-test weights, cold/heat thresholds, toxic doses, time limits in a hot car.
- **Medical claims:** signs of heatstroke, frostbite, poisoning, first-aid steps. These deserve a named authority plus a traceable link.
- **Not needed:** common-sense advice ("wipe paws after a walk"), opinion, our own framing, how-to steps, and any sentence that already says "PetMD says".

## 8. How established publications handle sourcing

I could fetch only a few pages directly; several sites (nytimes.com, cntraveler.com) were blocked from this environment and some pages 404'd, so conclusions for those are limited to what search results say. I did not find any of these using numbered footnotes in consumer-guide body text.

- **Medical News Today (Healthline Media), `https://www.medicalnewstoday.com/about`** (fetched): "Primary sources, including studies, scientific references, and statistics, are linked within each article" and "appear in the resources section at the bottom." That is the closest real example of the proposed hybrid: inline links plus an end list.
- **Healthline, `https://www.healthline.com/about/process`** (fetched): says its style guide emphasizes "quality sourcing, and clear citations" and trains contributors on sourcing. The page does not describe the inline format; per search results its staff page says it will "cite or link to primary sources in each article" (`https://www.healthline.com/health/staff`). I did not verify a numbered list on a specific Healthline article.
- **The Points Guy, `https://thepointsguy.com/tpg-publishing-standards/`** (fetched): information is "fact-checked by the reporter and vetted by at least one editor", and updated guides "carry a date showing when they were last revised and fact-checked". This supports showing review and read-on dates rather than numbering.
- **Wirecutter:** search found only secondary descriptions (`https://www.wikipedia.org/wiki/The_Wirecutter`): it cites other reviews inline and has a separate "How We Find and Vet Our Expert Sources" explainer under `https://www.nytimes.com/wirecutter/`. The official page could not be fetched, so I make no claim about its footnote style.
- **Condé Nast Traveler, `https://www.cntraveler.com/info/about-us`** (via search snippet only): describes first-person, editor-chosen recommendations; no citation system found. **AKC, `https://www.akc.org/expert-advice/`**: the article pages I tried returned 404 and no editorial-policy page surfaced; no claim made. **Rover, `https://www.rover.com/blog/`**: search showed named veterinary reviewers (for example `https://www.rover.com/blog/reviewer/jennyalonge/`) and a disclaimer, but no citation format.
- **Vetster editorial guidelines, `https://vetster.com/en-us/legal/editorial`** (search result): says it "links out to relevant sources, in text or in footnotes, where possible". Another example of the inline-first pattern.

Reading: established consumer and health publishers lean on named, inline links, a dated "last reviewed" note and a short methodology page; numbered footnotes in body text are rare outside reference works. This is an inference from limited evidence, not a survey.

## 9. Proposed system: one rule, nothing lost

**One rule for the writer:** name the publisher in a text link; if you cannot name it in the sentence and the claim is a number, fee, rule, safety or medical statement, add a numeric superscript that jumps to the dated Sources list. Otherwise write no marker.

Syntax (backward compatible during migration):
- `[PetMD](src:1)` inline attribution link. The renderer resolves the URL from `sources[0]` of the same guide, so URLs live in frontmatter only.
- `[[7]]` superscript (no URL typed). It renders `<sup class="cite"><a href="#src-7" aria-label="Source 7: U.S. Department of Justice, ADA Requirements: Service Animals">7</a></sup>`, with a larger invisible hit area (24 px) and consecutive markers merged ("1,2").
- Old `[[7]](url)` keeps working: it is read as `[[7]]` and the URL is checked against `sources[6]`.
- The Sources section becomes `<details>` (collapsed by default on phones, open on desktop or when a marker is clicked), each entry `id="src-N"`, showing `Publisher, Title, read on 2026-11-16`, an outbound link, and "Used in: section names" back-links.
- Build check (in `plugins/content.ts` or tests): every `src:n` and `[[n]]` refers to an existing source, the URL in an old-style marker matches, and every source is used at least once (inline or superscript) or flagged `alsoUsed`.

Three real before/after examples (text taken from the guides):

**A. Named publisher, bullet (cold-weather guide, line 166 and 168)**

Before:
> **Boots are about the surface.** AKC's test is whether you would walk on it barefoot, and it names deicers and road salts. [[3]](https://www.akc.org/expert-advice/lifestyle/best-dog-boots/)
> **Wipe paws after every outing.** ASPCA and Cornell both say so. [[4]](https://www.aspca.org/pet-care/general-pet-care/cold-weather-safety-tips) [[2]](https://www.vet.cornell.edu/departments-centers-and-institutes/riney-canine-health-center/canine-health-topics/winter-safety-tips)

After:
> **Boots are about the surface.** [AKC's test](src:3) is whether you would walk on it barefoot, and it names deicers and road salts.
> **Wipe paws after every outing.** [ASPCA](src:4) and [Cornell](src:2) both say so.

Same two sources, same URLs, three numerals and two stacked pairs gone.

**B. Safety figure with a named publisher (cold-weather guide, line 174)**

Before:
> PetMD, written by a veterinarian, gives three bands: cold should not become a problem for most dogs until the temperature falls below 45 F; ... and below 20 F "all pet parents need to be aware." [[1]](petmd) A Cornell veterinarian quoted by NBC Select says that at 32 F and below ... short bathroom breaks. [[5]](nbc) PetSmart says anything under 40 F can become risky ... [[6]](petsmart) ASPCA gives no number ... [[4]](aspca)

After:
> [PetMD](src:1), written by a veterinarian, gives three bands: ... below 20 F "all pet parents need to be aware." A Cornell veterinarian quoted by [NBC Select](src:5) says that at 32 F and below ... short bathroom breaks. [PetSmart](src:6) says anything under 40 F can become risky ... [ASPCA](src:4) gives no number ...

The temperature thresholds are still one click from their source and now each source is named where it is used. The dated entry in the Sources list is where the "read on" date lives.

**C. Policy claim with no named publisher, and a table row (pet-fees guide line 153; cold-weather table line 178)**

Before:
> Where the ADA applies, pet fees and deposits must be waived for service animals. [[7]](https://www.ada.gov/resources/service-animals-2010-requirements/)
> | Thick double coat ... | Handle cold best. [[1]](petmd) [[2]](cornell) *Paw care first; do not clip short.* [[2]](cornell) |

After:
> Where the ADA applies, pet fees and deposits must be waived for service animals.<sup>[7](#src-7)</sup>
> | Thick double coat ... | Handle cold best.<sup>1,2</sup> *Paw care first; do not clip short.* |

Because the policy claim does not name the publisher, the superscript stays; it now jumps to "U.S. Department of Justice, ADA Requirements: Service Animals, read on 2026-11-16". In the table the duplicate Cornell marker in the same cell is merged away, and the table keeps one marker group per cell.

Expected effect (estimate, not measured on a prototype): from 1,011 markers (11.6 per 1,000 words) to roughly 350 to 450 numbered superscripts (about 4 to 5 per 1,000 words), because the 494 markers that follow a named publisher and most of the 345 with neither publisher nor figure convert to inline links or disappear. Every source remains in frontmatter and in the visible list.

## 10. Implementation effort and files

This is a template and syntax change plus a content migration. It must not lose source data: `sources` frontmatter and the end list are untouched in substance, only richer.

Code (about 0.5 to 1 day including tests):
- `src/components/site/Markdown.tsx`: accept `sources` as a prop (or via context); resolve `src:n` and `[[n]]`; render superscript to `#src-n`; merge adjacent markers; keep the legacy `[[n]](url)` path. Note `Markdown` currently takes only `source` and is called from `src/routes/guides.$slug.tsx` line 136.
- `src/routes/guides.$slug.tsx`: Sources section as `<details>` with `id="src-N"` entries, "read on" wording from `accessedOn`, back-links.
- `src/styles.css` (lines 160 to 164): larger hit area for `sup.cite a`, merged-marker spacing, `:target` highlight, print styling (print should show the list open).
- `src/content/schema.ts` (optional): `sources[].alsoUsed?: boolean` and maybe `claim?: "fee" | "policy" | "safety" | "medical"`; both default off so existing data stays valid.
- `plugins/content.ts` (optional but recommended): build-time check that every marker refers to an existing source and the URL matches; fail the build with the guide name.
- Tests: `src/test/content.test.ts` (rewrite "every source is cited at least once" to count inline links and superscripts, since the `[[(\d+)]]` regex would miss `src:n`), `src/test/article-ux.test.tsx` (line 50 expects `<sup class="cite">`), `src/test/template-fixes.test.tsx`.

Content (about 1 to 1.5 days, semi-automated):
- 30 published guides plus the 3 Markdown drafts: `content/guides/*.md` (26 files) and `src/content/guides/*.ts` (7 files; `index.ts` unaffected).
- A codemod can handle the mechanical 80 percent: convert `[[n]](url)` to `[[n]]`, merge stacked and same-block repeats, and propose `[Publisher](src:n)` where the publisher name appears in the preceding 350 characters (about 494 candidates). A human or reviewer pass then checks safety, medical and policy claims so no figure loses its superscript. Run the existing "every source is used" test and a URL diff (before and after) to prove no source dropped.
- Risk: moderate on wording (reflowing sentences so the link text reads naturally), low on data. Recommended rollout: ship the renderer with backward compatibility, migrate the 5 densest guides first (senior-dog, car-safety, cold-weather, airbnb-pet-damage, new-years-eve), review them on a 390 px screenshot, then batch the rest.

Total: roughly 2 to 3 working days, of which about 1 is review of medical and policy edits.

## Files

- Evidence screenshots (390 px, before state): `docs/editorial/img/before-390-cold-paragraph.png`, `before-390-cold-bullets.png`, `before-390-car-bullets.png`, `before-390-car-weight.png`, `before-390-fees-bullets.png`.
- Nothing in `src/`, `content/` or `plugins/` was changed.
