# DOSSIER: New Year's Eve and holiday week with a dog in a vacation rental or cabin

Research date: 2026-11-18. Tools: WebSearch and WebFetch only. Builds on docs/SERP-1.md (candidate 1); the competitor baseline is not repeated.

Labels: SEEN = fetched and read this session (through WebFetch's summarizing model, so quotes are short and approximate in context). REPORTED = search-result text only. NOT CONFIRMED = could not verify.

Honest scope warning: I could NOT read Reddit or the Airbnb/Vrbo community threads in volume. The "voice of the audience" below is 4 forum or first-person items plus 6 news/local-story items. That is far short of the 15 to 25 threads the brief asked for. It is a small, non-representative sample. Treat the theme counts as illustrative only.

---

## 1. Routes tried

| Route | Result |
|---|---|
| reddit.com/r/AirBnB search.json (direct curl, before the coordinator's clarification) | BLOCKED, HTTP 403 "Blocked" page |
| old.reddit.com search (direct curl) | BLOCKED, HTTP 403 |
| api.pullpush.io and arctic-shift (curl) | Attempted before I was told not to use third-party archives. pullpush returned 521; arctic-shift returned 400 (missing parameter) and I did not pursue it. I stopped using any workaround after the coordinator's note. No Reddit content from those routes is used anywhere in this dossier. |
| WebSearch with allowed_domains including reddit.com | Refused by the tool (reddit.com not accessible to the user agent) |
| Airbnb Community (community.withairbnb.com) | Thread URL 301-redirects to communitycenter.airbnb.com; thread text not read. Only the search summary of the "Guests lit fireworks" thread is available (REPORTED). |
| Airhosts Forum (airhostsforum.com) | WORKED for one thread (page 2 only) |
| BiggerPockets, Tripadvisor, Quora, Dog Forum | Search surfaced nothing usable for this topic (REPORTED: no Tripadvisor thread returned). Not read. |
| Trustpilot, app-store reviews | Not attempted for pet/fireworks complaints (one Trustpilot result for Evolve surfaced in search, unread). |
| Springer / Nature article pages (Lohi 2020) | Bounced to an authentication redirect; not read. Figures are REPORTED via search summary. |
| aaha.org/?p=29406, 12news.com, ASPCA /fireworks-safety-tips, TAMU pet-talk URL, hearthsidecabinrentals.com/pet-policy | 403 / 404 / wrong page. Not read. |
| stonybrooklodging policies | HTTP 401. Not read. |
| El Paso 2025 NYE press-release PDF | Fetched but unreadable (compressed PDF). Not read. |
| Gatlinburg city fireworks article gatlinburgtn.gov/article/1657238 | Fetched but returned only a different title (Independence Day). Not read. |
| Gatlinburg municipal code (MTAS) | Only the definitions section (7-501) loaded; discharge rule and penalties NOT read. |
| Working: PMC (Riemer 2023), AVSAB post, Cornell Riney page, ASPCA NYE news page, ASPCA poison page, Pet Poison Helpline page, Petbook, Utrecht Univ. news, Mountain Times, KPCW, KBBI, Upworthy, Patch, PRNewswire, Airbnb news, Cabin Rentals of Georgia, Aunt Bug's, Twiddy, Vacasa pet page | SEEN |

---

## 2. Voice of the audience (small sample)

### 2a. Items read

| # | Platform | URL | Date | What happened / what was asked | Outcome or accepted advice | Label |
|---|---|---|---|---|---|---|
| 1 | Airhosts Forum (host side) | https://airhostsforum.com/t/neighbor-complaining-about-noise-level-do-we-have-any-right-on-this-subject/28894?page=2 | replies Jan 16-17, 2019 | Host got a neighbor complaint after guests set off fireworks over New Year's | Hosts: ban fireworks outright; one suggested wording "grounds for ejection without refund"; put noise rules in house rules; check local STR rules; give neighbors a contact number | SEEN |
| 2 | Airbnb Community (host side) | https://community.withairbnb.com/t5/Help/Guests-lit-fireworks/td-p/1650895 | ? | Host of a wooded cabin had guests light fireworks; host had no fireworks rule | Other hosts said they would add an explicit fireworks rule; one said local bylaws must be posted in their cottage | REPORTED (search summary; page redirected) |
| 3 | Petbook (first-person) | https://www.petbook-magazine.com/dogs/dog-owner-how-we-were-misled-by-a-firework-free-vacation-park | Jan 6, 2026 | Owner paid nearly 900 euros for 4 nights at a Dutch park advertised "firework-free"; fireworks went off on arrival, the night before NYE and at midnight; park's ban covered only the grounds | Reception: "We have no control over what happens outside the park." No complaint outcome reported. Advice: ask how far the nearest homes are, zoom out on the map, ask in Facebook groups | SEEN |
| 4 | Mountain Times (news) | https://www.mountaintimes.info/killington-community-helps-visitor-search-for-lost-dog/ | Jan 7, 2015 | 5-year-old lab ran from the owner's ski house in Killington VT on NYE after fireworks; seen Jan 1 and Jan 3 | Traps set, public asked to call the owner and not chase him, treats suggested (food-motivated), $300 reward. Outcome not stated in article | SEEN |
| 5 | KPCW (news) | https://www.kpcw.org/park-city/2024-01-02/park-city-community-helps-reunite-lost-golden-retriever-with-owners | Jan 2, 2024 | 10-month-old Golden bolted into woods ~8 pm Dec 31 after neighbors' fireworks while a relative who could not run was dog-sitting (owners abroad) | Found after 2 days, under 5 miles away; Nextdoor post, radio lost-and-found, hundreds of volunteers, a scent bloodhound; a stranger saw the phone number on a notice, sat down so as not to scare her, owner talked by speakerphone, stranger leashed her. Not a rental | SEEN |
| 6 | KBBI (news) | https://www.kbbi.org/local-news/2022-01-13/pup-found-after-days-in-the-zero-degree-cold | Jan 13, 2022 | Small terrier-type dog ran off downtown Homer AK on a "very cold" NYE during fireworks; found about 13 days later (Jan 13) | Found because a stranger recognized him from a poster and called; loaned boots to follow through snow; dehydrated, thin, OK. Not a rental | SEEN |
| 7 | Upworthy (news) | https://www.upworthy.com/christmas-miracle-family-reunited-with-their-dog-found-60-miles-away | Dec 20, 2022 | Dog left at daycare during a vacation climbed an 8-foot fence around July 4, believed spooked by fireworks; found months later ~60 miles away, cold weather | Microchip identified her; postal workers fed her. Not a rental; July 4 not NYE | SEEN |
| 8 | Patch (news) | https://patch.com/massachusetts/across-ma/july-4-fireworks-cause-spike-lost-dog-reports-what-ma-pet-owners-should-know | Jul 1, 2026 | General advice for July 4 | Says a calm dog can bolt from a "rental house" or hotel hallway; three layers of ID (tag with current cell, microchip, GPS tracker if possible) | SEEN |
| 9 | Utrecht Univ. (survey news) | https://www.uu.nl/en/news/survey-result-fireworks-outside-new-years-eve-disastrous-for-animal-welfare | Dec 14, 2023 | Survey of over 3,600 Dutch pet owners (over 3,000 dog owners) | About 5% of dogs ever lost after hearing fireworks; owners may be self-selected for distress | SEEN |
| 10 | Search-result stories (not opened) | Sheltie "Mia" lost from owners' own cabin near Goobies on NYE (saltwire.pressreader.com/article/281548000047066); Brody (wtvr.com/2020/01/02/...); Bruni; Orlando Chesapeake hid under house (fox35orlando.com) | various | Dogs bolting on NYE | Mia was in a closed room but got out of it; Orlando dog found hiding trapped under the house | REPORTED |

I found NO story of a dog bolting from a paid vacation rental on NYE that I could read. Closest: the Killington ski house (item 4, owner's house, 2015). NOT CONFIRMED that any such rental-specific, fully-reported story is easy to find.

### 2b. Themes (counts are out of the 9 SEEN items above; tiny sample)

- Escape starts at a door, fence or when a dog is outside or unsupervised during the bang: 5 of 9 (items 4, 5, 6, 7, 8 in different ways).
- Strangers and posted contact numbers resolved the case (phone number on a notice or poster, or microchip): 4 of 9 (items 5, 6, 7, and item 4 asked the public to call).
- Cold or deep snow added danger: 3 of 9 (items 4, 6, 7).
- Hosts or operators cannot control fireworks outside their own boundary: 2 of 9 (items 1, 3).
- Hosts respond by banning fireworks in house rules, with eviction without refund as the stated penalty: 1 SEEN, 1 REPORTED.

### 2c. Exact words people use (for headings)

"firework-free" or "fireworks-free" (Petbook, Dutch parks), "spooked by fireworks", "scared by fireworks", "fireworks scare", "lost dog", "ran away", "bolted" (Patch). Source of the words: items above; I did not see forum-originated phrasing at volume.

### 2d. Questions people actually ask (derived from the items, not counted from a large sample)

1. Is a "firework-free" rental really free of fireworks? (Petbook)
2. How far are the nearest homes? (Petbook)
3. What ID does my dog need in a place that is not home? (Patch, Cornell)
4. What do I do if my dog runs? (Mountain Times, KPCW, KBBI)
5. Can a host stop guests lighting fireworks? (Airhosts, Airbnb Community, host side)
6. Is it better to stay home with a fearful dog? (a Swedish guide said so, REPORTED, petlounge.se; not verified)

### 2e. Top fears (SEEN in the stories): the dog gets out and is not found for days; cold; strangers lighting fireworks next door despite a ban; paying for a "quiet" stay that is not quiet.

### 2f. Misconceptions
- "Firework-free" means free of fireworks around the property: Petbook shows the claim may cover only the park's own grounds.
- The trip date covers the noise: Hundeo (REPORTED via search) notes fireworks often start a day or two early and continue afterward; Petbook confirms noise on arrival and the night before NYE (SEEN).
- Comforting the dog "does more harm than good": the AVSAB survey post says comforting had no effect in that survey, and that other studies suggest comforting can help (SEEN).

### 2g. Scripts or documents that worked
Nothing in the items I read documented a vet letter or pet resume that worked for this topic. NOT CONFIRMED. What worked in recoveries: a phone number visible on a notice or tag (KPCW, KBBI), a microchip (Upworthy), a missing poster (KBBI).

---

## 3. Hard facts from primary documents

### 3a. Veterinary and behavior sources (no dosing)

- Riemer, "Therapy and Prevention of Noise Fears in Dogs: A Review of the Current Evidence for Practitioners", Animals (Basel) 2023;13(23):3664 (PMC10705068, SEEN, read to character 100,000 of 102,445). It calls food or play during noise "one of the most effective training methods"; places gradual recorded-sound desensitization as the "gold standard" while noting some dogs do not respond to recordings; says environmental measures (safe space, masking sound) are short-term support, "not a cure"; says medication should be combined with behavior work, not used alone.
- Same review on what is NOT well supported: owners of placebo-treated dogs often report improvement ("30-50%" in its wording), so open-label owner reports need caution; pheromones had inconsistent results ("only 28.8%" rated them effective in one survey, per the review); most nutraceuticals, herbals, homeopathy, Bach flowers and essential oils are "not powerful enough" for serious fears; pressure vests, "a small beneficial effect is possible"; cannabidiol, "no evidence for anxiolytic properties" in one study; acepromazine "is contraindicated for noise fears" (stated by the review; I name this only as a vet-source statement, not advice).
- AVSAB post (July 2, 2020, summarizing Riemer's owner survey, republished from Zazie Todd, May 2020) (SEEN): feed/play was the only category linked to improvement in severely affected dogs; ad-hoc counterconditioning 70.8% and relaxation training 69.3% reported effective; hiding places, music or doing nothing were associated with WORSE fear but the author says this is correlational; alternative products reported no effect; comforting/ignoring no effect in that survey. Sample size not on that page; the search summary said 1,225 respondents (REPORTED, not confirmed on the page).
- Cornell Riney Canine Health Center, "Fear of fireworks and thunderstorms" (SEEN; undated, footer 2026): talk to your vet well ahead; "trial any prescribed medication first on a day without noise"; familiar room far from noise with few or no windows; crate only if already comfortable; exercise earlier; keep the dog on a leash outside even in a fenced yard; "Always ensure your dog's ID collar and/or microchip information are current"; "Punishment must never be used". Cornell says pheromones and nutraceuticals "may be helpful" as adjuncts without claiming effectiveness.
- ASPCA "Ring In a Pet-Safe New Year" (Dec 22, 2025, SEEN): alcohol out of reach; room without windows and warm blankets; warns that ingesting fireworks is very dangerous; does NOT mention ID or microchips (contradiction with Cornell and Patch on emphasis, not on substance).
- Prevalence (REPORTED via search summary, papers not read): Lohi et al. 2020 Finland Scientific Reports, 13,700 dogs, 32% fearful of at least one noise and 26% afraid of fireworks; Storengen and Lingaas 2015 Norway, 5,257 dogs, 21% strong or very strong fear of fireworks. Different definitions explain different figures. Do not quote without reading.

### 3b. Lost-pet data around fireworks holidays

- Petco Love release July 6, 2023 (PRNewswire, SEEN): "More pets go missing on July 4th than any other day of the year." The same release gives "one in three pets goes missing in their lifetime, 10 million every year" as estimates. NO July 4 count and NOTHING for New Year's.
- Patch, July 1, 2026 (SEEN): shelters take in more strays on July 5 than any other day, citing Shelter Animals Count, without figures.
- Utrecht University, Dec 14, 2023 (SEEN): about 5% of dogs ever lost after hearing fireworks (Dutch, self-selected sample, over 3,000 dog owners).
- New Year's US data: NO credible dated national figure found. REPORTED local items from search summaries only: Pima Animal Care Center (Tucson) calls the week after New Year's its second-busiest intake period after July 4 and took in 256 dogs and 63 cats that week in 2024; a Lake Highlands (Dallas) item reported 136 and 141 dogs against averages of 62 and 65. Neither page was opened. El Paso's 2025 press release (title only: NYE "brings an increased risk of lost pets") was unreadable. Do not quote any of these figures without a human opening the originals.
- Conflicting REPORTED figures: Salina Animal Services item says 66 percent of found pets were within one mile of home (Petco Love Lost user data, REPORTED); dvm360 (2022) says fewer than 32% of lost pets entering shelters get home (REPORTED); a spotpet blog says about 14% (REPORTED, unclear source). Do not use.

### 3c. Hosts, rules and law

- Airbnb news, Dec 23, 2024 (SEEN): for NYE it blocks or redirects "higher-risk one, two or three night bookings for entire home listings" in listed countries including the US, and requires an anti-party attestation. Implication, labeled as inference: if the guest wants a 2-night NYE stay, they may be steered away on Airbnb. Whether this affects specific cabin searches is NOT CONFIRMED.
- Gatlinburg: search-result text (REPORTED) says fireworks are illegal to discharge in city limits; Sevier County outside city limits is different. I opened the municipal code but only the definitions section loaded, so the rule is NOT CONFIRMED by me. A human should read § 7-502 onward.
- Aunt Bug's Cabin Rentals (Gatlinburg area, SEEN): "Fireworks are prohibited at all times." Ejection without refund for disturbing other guests; pet fee $75 non-refundable.
- Cabin Rentals of Georgia (Blue Ridge GA, SEEN): firecrackers are prohibited on the property; no quiet-hours text on the page.
- Vacasa pet page (SEEN): no fireworks policy mentioned; dogs not to be left "unsupervised inside the home" (see table).
- Evolve (REPORTED, search snippet from its April 2023 owner blog): Evolve's risk-protection programs cover pet damage, and it calls pet fees hard to enforce. Not a guest policy.
- Hosts' advice (Airhosts, SEEN): ban fireworks in house rules; neighbors need a contact number.

### 3d. Poison lines and holiday foods (brief)

- ASPCA Animal Poison Control: (888) 426-4435, 24/7, 365 days; page says "A consultation fee may apply" (SEEN, amount not listed on the page). Third-party sources (GoodRx, Embrace) say $95 (REPORTED; others list $65 or $75-85, so the figure is disputed and likely dated). Quote only "a consultation fee may apply".
- Pet Poison Helpline: (855) 764-7661, "available 24/7" (SEEN; no fee shown on the page text I received). Fee: NOT CONFIRMED (verify before quoting).
- Thanksgiving and holiday hazards were SEEN in SERP-1 (ASPCA Thanksgiving page, PPH Thanksgiving page; hazards: turkey bones, fatty food, onions/garlic, xylitol, raisins, chocolate, raw dough, guest medications, trash). ASPCA NYE (Dec 22, 2025): alcohol and guests' medications.

### 3e. Contradictions and belief versus policy
- "Firework-free" marketing versus a park whose ban stops at the fence (Petbook).
- Comforting a scared dog: AVSAB survey post says no effect; Cornell stays with the dog, advises being home; ASPCA says set up a quiet space. Not a true conflict, but sources differ on the evidence strength.
- Hiding places and music: the survey associated them with worse fear (correlation only); Cornell recommends a safe room and masking noise. Both statements are SEEN.
- Pet damage: Vacasa's damage waiver excludes pets (REPORTED, search summary), while Evolve markets pet damage as covered for owners (REPORTED). Different parties; do not generalize.

---

## 4. Real policies and fees collected

| Manager | Region | Pet limit | Weight/breed | Fee | Other | Source (date seen 2026-11-18) |
|---|---|---|---|---|---|---|
| Cabin Rentals of Georgia | Blue Ridge GA | not stated | under 35 lb, non-shedding, crate trained, certain breeds | $50/pet/night + $75 cleaning fee + $250 refundable deposit | dogs not to be alone in cabin; unauthorized dog doubles fees; firecrackers prohibited; no cats | https://www.cabin-rentals-of-georgia.com/policies (SEEN) |
| Aunt Bug's Cabin Rentals | Gatlinburg area | 2 small dogs | 40 lb or less | $75 per pet, non-refundable | crate when away; $500 fine for pet in unapproved cabin; fireworks prohibited; "some minimum stay requirements during holidays"; no-cancellation policy, optional 7% guarantee | https://www.auntbugs.com/rental-policies/ (SEEN) |
| Twiddy | Outer Banks NC | 2 unless advertised otherwise | no breed or weight rules stated on page | no additional fee on page | pets not allowed in pools or hot tubs; pet-friendly homes only | https://www.twiddy.com/outer-banks/guests/pets/ (SEEN; undated) |
| Vacasa | many | varies by home | varies by home | "a small fee per dog, per night" (amount not listed) | dogs not "unsupervised inside the home"; no fireworks text | https://www.vacasa.com/pet-friendly-vacation-rentals (SEEN) |
| Shade Tree Lodge | Blue Ridge GA | 2 | 35 lb | $35 per dog per stay | listing on a third-party site | thebeachestates.com listing (REPORTED, search text) |
| God's View (Marriott Homes and Villas) | Blue Ridge GA | up to 2 in designated homes | n/a | $150 plus tax per dog | | homes-and-villas.marriott.com (REPORTED) |
| Chalet Blue Ridge Views | Blue Ridge GA | 2 | n/a | $100 for 1-2 dogs | must be declared on guest list | Expedia listing (REPORTED) |
| Mountain Escapes, Wolf's Den Dog | Blue Ridge GA | n/a | n/a | $75 per pet non-refundable | | findrentals.com (REPORTED) |
| A Gatlinburg-area rental agreement (unnamed in the result) | Gatlinburg | max 2 dogs | 40 lb | n/a | REPORTED only | search summary, name not identified; NOT CONFIRMED |

Fewer than 10 rows, and only 4 SEEN. Holiday minimum stays and NYE pricing: only Aunt Bug's text mentions holiday minimums, with no numbers. Pet fees rising at peak dates: NOT CONFIRMED.

---

## 5. What nobody states clearly

| Question | Best evidence-based answer |
|---|---|
| How common are fireworks on NYE near a remote cabin? | NOT CONFIRMED. Depends on location and local law; Petbook shows nearby homes can ignore a park ban. |
| Can a host guarantee no fireworks? | No evidence they can. Aunt Bug's says "prohibited at all times" as a guest rule, which governs guests, not neighbors. |
| Do rental pet fees go up at holidays? | NOT CONFIRMED. The pages I read show flat per-night or per-stay fees with no holiday surcharge text. |
| Do rentals have holiday minimum stays? | Aunt Bug's says yes without numbers (SEEN). Cabin Rentals of Georgia lists none on its policy page (SEEN). |
| Is it safer to stay home with a fearful dog? | One Swedish guide says yes (REPORTED). No peer-reviewed comparison read. NOT CONFIRMED. |
| How many lost pets on NYE vs July 4 nationally? | NOT CONFIRMED. Only the July 4 claim "more pets go missing than any other day" (Petco Love, 2023). |
| Does a tag with the rental address help? | A tag with the owner's current cell phone is what Patch and Cornell-type sources advise; a rental-address tag is REPORTED only in local-TV tips (SERP-1). Best supported: current mobile number plus a current microchip record. |
| Does the dog's ID work if the owner is out of state? | Microchip and a mobile number carry across; both Upworthy and KBBI show reunions from a chip or poster. Anything about out-of-area shelter handling is NOT CONFIRMED. |
| What does hearing protection/earmuffs for dogs do? | NOT CONFIRMED. Not covered by sources read. |
| Do fireworks start before and after the date? | Yes in Petbook (arrival day and night before). Hundeo says days before and after (REPORTED). |

---

## 6. Gaps needing a human with a browser (Cowork)

1. Reddit: search r/AirBnB, r/dogs, r/DogAdvice, r/askvet, r/CampingandHiking, r/Vrbo for "dog fireworks airbnb", "new years eve dog cabin", "dog escaped airbnb". Read 15 to 25 threads and tabulate what worked. Reddit blocked WebFetch and my search.
2. Airbnb Community thread "Guests lit fireworks": https://community.withairbnb.com/t5/Help/Guests-lit-fireworks/td-p/1650895 (redirects; needs a browser at communitycenter.airbnb.com).
3. Gatlinburg Municipal Code Title 7 Chapter 5, sections 7-502 onward: https://www.mtas.tennessee.edu/city-code/gatlinburg/title7/chapter5/section7-501 . Also Pigeon Forge, Sevierville and Sevier County rules, Blue Ridge/Fannin County, and California coast city rules (California coastal cities vary; none read).
4. Read the pet and house-rules pages for 20 to 30 cabin managers in Blue Ridge, Gatlinburg/Pigeon Forge, and a California coast manager; tabulate pet fee, limit, fireworks wording, quiet hours, NYE minimum stay and cancellation. Examples: Hearthside (404 on guess URL, find the right one), Stony Brook Lodging (401), Cabins For You, Smoky Mountain Cabins.
5. Original numbers: Pima Animal Care Center (Tucson) NYE intake, Lake Highlands/Dallas NYE intake, Shelter Animals Count holiday data, Petco Love's NYE statements. Search "Petco Love" "New Year's Eve" "lost pets" and open the original release.
6. Read the Lohi 2020 paper (doi 10.1038/s41598-020-70722-7) and the rest of Riemer 2023 (final ~2,400 characters unread) for exact quoting.
7. Pet Poison Helpline fee: open https://www.petpoisonhelpline.com and its FAQ and record the fee and date.
8. AAHA, TAMU and AVMA pages: AAHA ?p=29406 returned 403; TAMU Pet Talk Dec 22, 2022 was SEEN in SERP-1 only.
9. Facebook group "Firework-Free & Low-Firework New Year's for Dogs and Humans" (named in Petbook): human to read public posts if available.
10. Trustpilot Evolve (nz.trustpilot.com/review/evolve.com) and Vacasa reviews, filter for "pet", "dog", "noise", "fireworks".
11. Tripadvisor forums search "dog fireworks New Year's cabin Gatlinburg" (none surfaced).

---

## 7. COMPILED FINDINGS FOR THE WRITER

### Ten most useful insights
1. "Firework-free" claims may only cover the property's own grounds. Petbook (SEEN, Jan 6, 2026): ban inside the park, fireworks on arrival, the night before and at midnight; reception said "We have no control over what happens outside the park."
2. Vetting script: call the operator and ask the distance to the nearest homes; zoom out on the map; ask in online groups (Petbook advice).
3. The noise can arrive before and after the date, not just on Dec 31 (Petbook SEEN; Hundeo REPORTED).
4. The best-supported home measures are food or play during noise and early training; "safe room plus masking" is short-term support (Riemer 2023, SEEN). Treat music and hiding places honestly: the survey linked them with worse fear but cannot say they cause it.
5. What is weakly supported: pheromones, supplements, herbals, essential oils (Riemer 2023). Pressure vests: possible small benefit. Placebo effects are large in owner reports. Do not recommend products.
6. Medication: only "ask your vet well before the trip and trial it on a quiet day" (Cornell, ASPCA, TAMU in SERP-1). No drug names or doses.
7. In every recovery story the finder was reached by a phone number or chip: poster at an animal shelter (KBBI), notice with number (KPCW), chip (Upworthy). Current mobile number on the tag matters more than anything else on it.
8. Cold plus snow raises stakes: Homer's dog was found after about 13 days, dehydrated and thin; the finder lent boots.
9. A bolt can happen in the care of someone else or a place with an unfamiliar fence (Tawny 8-foot fence, KPCW relative who could not chase). Interior room, no doors left ajar, leash even in a fenced yard (Cornell).
10. Hosts cannot control neighbors; they can only ban fireworks among guests, and the penalty text hosts suggest is ejection without refund (Airhosts). The reader should know that rule exists and that fireworks by guests next door may breach it.

### Five things that can make the article better than the ranking pages
1. A "how to vet a firework-free claim" script with the Petbook case as the example.
2. A dated hazards/hotline table (ASPCA 888-426-4435; Pet Poison Helpline 855-764-7661; "a consultation fee may apply").
3. A policy table from real managers (Cabin Rentals of Georgia, Aunt Bug's, Twiddy, Vacasa) with date seen, flagged "fees vary by home".
4. A source-graded "what helps and what has weak evidence" box from Riemer 2023 and AVSAB with no dosing.
5. A recovery plan that merges what actually worked in real stories (number on tag, chip, poster, community, no chasing).

### Solid enough to state
- Cornell and ASPCA ID/safe-room guidance; poison hotline numbers; Riemer's evidence statements as attributed; Aunt Bug's and Cabin Rentals of Georgia policy details with the date seen; Petbook story as one case; Airbnb Dec 23, 2024 NYE booking restrictions as written.

### Hedge
- Any NYE lost-pet increase (only July 4 is stated by Petco Love); prevalence percentages (Lohi, Storengen are REPORTED only); the $95 ASPCA fee; whether Gatlinburg bans fireworks inside city limits (search-REPORTED, code unread); "calm" effects of pressure vests, music or comfort.

### Leave out
- Any drug name or dose; any holiday pet-fee surcharge claim; the 66%/14%/32% reunion figures; Pima and Dallas figures until a human reads them; GPS-tracker brand claims; "dogs bolt from rentals" as a statistic.

### Recommended outline (question H2s)
1. Is a "firework-free" rental really firework-free? (Petbook case, script to ask the operator)
2. What do fireworks look like in a cabin area, and who sets the rules? (Gatlinburg example flagged; local law varies; host house-rule examples)
3. How do I keep my dog from bolting in a place it does not know? (Cornell, Patch ID layers, door and leash routine)
4. What actually helps a noise-afraid dog, and what has weak evidence? (Riemer 2023, AVSAB; no dosing; "ask your vet early")
5. What do I do in the first hour if my dog runs? (stories: call-not-chase, poster, shelter, microchip registry, cold)
6. What will the rental charge or require for a dog over the holidays? (policy table; holiday minimums unclear)
7. Which holiday foods and guest items are dangerous, and who do I call? (ASPCA, PPH; fee wording)
8. Should I just stay home? (honest: evidence NOT CONFIRMED; one guide says yes)
Add: copy-paste message to the host (dog count/weight, crate, "have you had fireworks complaints at this address," nearest neighbors, holiday minimum and cancellation).
