# Fact-check: christmas-week-in-a-cabin-with-a-dog

Checked 2026-11-18 by an independent reviewer (did not write the article). Status kept as draft. All 14 sources and the four manager pages were re-read live. The NFPA PDFs came back as binary through the fetch tool, so I read the PDFs the fetch saved (pdftotext on the downloaded file), not any mirror.

## Corrections

| # | Before | After | Why |
|---|---|---|---|
| 1 | Hotlines: "Both say ... a consultation fee may apply" (body and FAQ) | ASPCA says a consultation fee may apply; Pet Poison Helpline lists a per-incident fee. No amount given. | ASPCA page says "A consultation fee may apply". The Pet Poison Helpline home page states a fee applies (a dollar figure is on that page; deliberately not repeated). "May apply" understated it. |
| 2 | PPH: American mistletoe "usually causes mild stomach upset" | "may cause mild stomach upset (and serious poisoning is not likely)" | Source says "may cause mild stomach upset". |
| 3 | FAQ: "PetMD says neither [tree] is automatically safe" | "PetMD warns that both real and artificial needles can cause problems if chewed" | "Neither is automatically safe" was our paraphrase; PetMD says the needle risk applies to both. |
| 4 | "Holiday terms are usually set per home or per manager, and often live on a policy page rather than the pet page." | Rewritten as what the pages we read showed, "may differ by home" | Unsourced generalization. |
| 5 | "Holiday weeks fill early, and winter travel is weather-dependent." | "can fill early ... can be disrupted by weather" | Unsourced; hedged. |
| 6 | "you also cannot drill into the walls" | "you may not be allowed to attach anything to the walls" | Stated as fact with no source. |
| 7 | "What most people report" bullet describing the 38-page surcharge finding | Relabelled "What our sample shows (3 or more independent pages, not a survey)" with "small non-random convenience sample"; ledger row 5 set to level 2 (was 3, inconsistent with article) | It is our own reading of pages, not what people report; labels and ledger now agree. |
| 8 | readingMinutes: 8 | 9 | 2079 words / 238 = 8.7. |

## Row-by-row result (ledger rows 1-22)

| Row | Result | Note |
|---|---|---|
| 1 A Blue Ridge Vacation | VERIFIED | Quote "There is a 5-night minimum requirement for major holidays" present (lists Christmas); 3-night minor holidays; higher nightly rates for peak seasons and holidays. Page also has cancellation fees; the article does not use them. |
| 2 Aunt Bugs | VERIFIED | "Some minimum stay requirements during holidays, peak periods, etc."; "no cancellation policy"; Guarantee 7% plus tax; refund up to 30 days prior, 1-4 bedroom. |
| 3 Hearthside | VERIFIED | Deposits non-refundable unless Reservation Guarantee; 8%; at least 15 days prior for 1-5 bedroom (60 days for 6+). |
| 4 Tahoe Vacation Rentals | VERIFIED | Full refund 30+ days; 50% for 7-30 days; none under 7 days. |
| 5 38-page sample, 19 re-opened | VERIFIED (absence) | 38 entries in manager-policies.ts. I re-opened 7 live (Tahoe Getaways, Big Bear, Cabins USA, Emmons, Aunt Bugs, Hearthside, Tahoe Vacation Rentals): none states a holiday pet surcharge; fees are flat or per-night/one-time. I did not re-open the other 12 of the 19 or the remaining 19 pages. The CSV holiday column reads "not stated" for 54 of 58 rows; 4 rows are blank (Tahoe Moon, Anna Maria, Island Real Estate, Exclusive 30A), none in the 38. |
| 6 ASPCA tree/water/tinsel | VERIFIED | |
| 7 ASPCA ornaments/wire | VERIFIED | |
| 8 ASPCA plants | VERIFIED | "mild to moderate gastrointestinal irritation" for poinsettia; mistletoe and holly GI upset and cardiovascular problems. |
| 9 ASPCA foods/gifts/candles | VERIFIED | |
| 10 PPH winter tips | VERIFIED | Chocolate/theobromine, xylitol, pancreatitis, snow globes/bubble lights. |
| 11 PPH myths | PARTIAL, fixed | Poinsettia and holly fine; mistletoe wording corrected (correction 2). |
| 12 PetMD tree | VERIFIED | Preservatives make water poisonous; gate/pen; artificial needles; non-flocked; lights away from bottom; tinsel/strings/candy canes off. |
| 13 NFPA tree sheet (2025) | VERIFIED | 3 ft from heat source incl. fireplaces; not blocking exit; add water daily; no lit candles on tree; lights off before leaving or bed. |
| 14 NFPA winter holiday sheet (2025) | VERIFIED | Pets away from lit candles; blow out candles; "More than one-third of home decoration fires are started by candles". |
| 15 ASPCA cold weather | VERIFIED | Quote "if it's too cold for you, it's probably too cold for your pet" present. The page does not use the words "de-icers" or "antifreeze deadly" verbatim (says ice melts dangerous if ingested; antifreeze lethal); the article does not put these in quotes. |
| 16 PetMD vacation | VERIFIED | Quote "Don't wait until a problem occurs to start Googling" present (article truncates it, under 15 words). Medical records: page says to keep a digital copy; article says "bring" (close enough). |
| 17 ASPCA hotline | VERIFIED | 888-426-4435, 24/7 365 days, "A consultation fee may apply"; no dollar amount. |
| 18 PPH hotline | VERIFIED | 855-764-7661, 24/7; page states a per-incident fee (see correction 1). Article gives no amount. |
| 19-21 | Level 3 unknowns | Correctly labelled with "Check for yourself" actions in the article. |
| 22 AVMA | Not used | Confirmed not cited. |

## Counts (ledger rows 1-18)

VERIFIED 17, PARTIAL 1 (row 11, fixed), WRONG 0, COULD NOT LOAD 0. Rows 19-22 are unknown/not-used by design. Net: one article statement (hotline fee wording) was materially inaccurate and is fixed.

## Other checks

- Numbers: 38 managers and 19 re-opened match ledger and dataset; no arithmetic or hypothetical examples in the article.
- Tables: the cancellation table matches all three live pages (numbers, units, percentages, bedroom limits). Caption wording "as of" is "pages we read on 2026-11-18"; "three managers, not a pattern" present.
- Mechanics: [[1]]-[[14]] match the sources list order; every source is cited at least once; relatedGuides slugs and /tools/pet-cost-check, /checklist, /packing-list, /will-my-dog-be-accepted all exist as routes; all external URLs are https.
- Risk areas: no medication names or doses (the checklist says "we give none"); no breed content; no dollar amounts for poison hotlines; no invented statistics (the NFPA one-third figure is sourced).
- `bunx tsc --noEmit` passes; `bunx vitest run` passes (19 files, 317 tests).

## Remaining risks

- Only 7 of the 19 re-opened manager pages were independently re-read by me; the absence-of-surcharge claim is stated as a convenience sample and not proof.
- The A Blue Ridge Vacation and Aunt Bugs pages and the ASPCA/PPH fee wording can change.
- The Pet Poison Helpline fee exists on its home page; readers are told to check the page.
- Hero image is an existing stock key; the followUps note an original photo is still wanted.

## Verdict

PUBLISH-AFTER-NOTED-FIXES. All fixes above are applied and tests pass; status remains draft for the owner to publish.
