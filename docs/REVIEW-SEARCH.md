# Search-appeal review: Paws & Passage

Reviewed 2026-11-17. Read-only review of the 16 published guides (15 in `src/content/guides/*.ts`, 1 in `content/guides/how-vacation-rental-pet-fees-work.md`). `cms-test-article.md` is a draft and does not appear in the built guides index (checked).

## How to read this, and what I could not see

- **Evidence** means something I saw: the site's source, the built HTML, or the result titles and summaries the search tool returned.
- **Opinion** means my judgment. It is labelled "Opinion" or "I suggest".
- The search tool returns result titles, URLs and a short written summary. It does **not** return Google's literal snippets, "People also ask" boxes, autosuggest lists or search volume. Where I name a "People also ask-style" question, I built it from the themes in the results, not from a real PAA box. **Search volume is NOT CONFIRMED for every query in this report.** Nothing here comes from Search Console, Ahrefs, Semrush or Google Trends.
- Most results were host-side software blogs, listing pages and pet-product vendors. Their claims are marketing, so I used them to judge what ranks, not as facts for our pages.
- Every proposed hook below uses a fact the article already contains (a worked example, a count of items, a named place, a stated limit). Check any figure again if you edit the article.

---

## 1. Titles and descriptions, article by article

### Two things that affect every title (evidence)

1. **The site appends " | Paws & Passage" (17 characters) to every `seoTitle`** unless the seoTitle already contains the site name (`src/lib/seo.ts`, line 21). So a 50-character seoTitle shows as 67 characters in the tab and in the likely result. Today 10 of 16 rendered titles are over 60 characters (counting seoTitle plus the suffix). The brand is at the end, so truncation costs little, but the hook must sit in the first ~50 characters. All proposed titles below keep the hook up front and are 38-47 characters before the suffix.
2. `dog-friendly-cabin-packing-list` already has "| Paws & Passage" typed into its seoTitle. It works (no double suffix), but it is the only one done that way. My proposal removes it for consistency.

Opinion: where the page title is the same as the H1 or a near-copy of the top results (most of ours today), it gives a searcher no reason to pick us. The proposals use a number, a named situation, or the question the reader is actually asking.

### Current vs proposed (counts are characters)

| # | Guide (primary keyword) | Current seoTitle (chars) | Proposed seoTitle (chars) | Current seoDescription (chars) | Proposed seoDescription (chars) |
|---|---|---|---|---|---|
| 1 | how-vacation-rental-pet-fees-work ("how vacation rental pet fees work") | How Vacation Rental Pet Fees Actually Work (42) | Vacation Rental Pet Fees: $80 or $160? (38) | Understand per-night, per-stay, and per-dog pet fees, deposits, cleaning charges, Airbnb and Vrbo pricing, and service-animal fee protections. (142) | Same two dogs, same four nights: a pet fee can total $80 or $160 depending on wording. See the four fee structures and how deposits and holds differ. (149) |
| 2 | vacation-rentals-that-welcome-large-dogs ("vacation rentals that welcome large dogs") | How to Find Vacation Rentals for Large Dogs (43) | Booking a Rental for a Large Dog: 5 Checks (42) | Find rentals that accept your large dog, decode weight and breed rules, check stairs and flooring, and get useful written approval before booking. (146) | "Large dogs considered" is not a yes. Read weight and breed limits literally, check stairs and floors, and get written approval naming your dog's weight. (153) |
| 3 | vacation-rental-secure-fenced-yard ("vacation rental secure fenced yard") | How to Find a Rental With a Secure Fenced Yard (46) | Is a Rental's Fenced Yard Really Dog-Safe? (42) | Check fence continuity, gate gaps, shared access, pools, and the photos to request before booking a vacation rental with your dog. (130) | A lawn photo proves nothing. Find the weakest fence section, inspect gates and latches, and ask the host for a sketch, measured photos and a gate video. (152) |
| 4 | pet-friendly-vacation-rental-checklist ("pet friendly vacation rental checklist") | Pet-Friendly Vacation Rental Booking Checklist (46) | Dog-Friendly Rental Checklist: 8 Gate Questions (47) | Verify dog approval, fees, deposits, alone-time rules, yard safety, cancellation terms, local access, and emergency care before booking. (136) | Eight questions before you pay for a dog-friendly rental: written approval, total price, unattended-dog rules, cancellation terms and an emergency vet. (151) |
| 5 | dog-car-safety-harness-and-crate-guide ("dog car safety harness and crate") | Dog Car Safety: Crash-Tested Harness & Crate Guide (50) | Crash-Tested Dog Harness? How to Verify It (42) | How to choose a crash-tested dog harness or secured crate for road trips: what testing means, fit and sizing checks, anchoring, and picks by situation. (151) | "Crash tested" is not regulated. Check a harness or crate in the Center for Pet Safety directory, match your dog's weight, and skip extension tethers. (150) |
| 6 | dog-travel-first-aid-kit-guide ("dog first aid kit for travel") | Dog First-Aid Kit for Travel: What to Pack and Buy (50) | Dog Travel First-Aid Kit: AVMA Checklist (40) | What belongs in a dog first-aid kit for trips and cabin stays, based on AVMA guidance, plus ready-made kits and add-on items worth carrying. (140) | A travel kit built on the AVMA checklist, plus what ready-made kits often skip: a digital thermometer, poison-control numbers and your dog's records. (149) |
| 7 | dog-id-tags-and-gps-trackers-for-travel-guide ("dog ID tags and GPS trackers for travel") | Dog ID Tags, Microchips and GPS Trackers for Travel (51) | Dog GPS Tracker vs Microchip vs ID Tag (38) | What ID tags, microchip registration and GPS or Bluetooth trackers each do on the road, plus a plan if your dog goes missing somewhere unfamiliar. (146) | A microchip does not track your dog. See what a tag, a microchip and a GPS or Bluetooth tracker each do on the road, and what to do if yours goes missing. (154) |
| 8 | traveling-with-two-dogs-accommodation-guide ("traveling with two dogs accommodation") | Traveling With Two Dogs: Accommodation Planning (47) | Two Dogs, One Rental: Fees, Limits, Layout (42) | Plan a two-dog stay with clear fee calculations, weight-limit questions, separate feeding spaces, safe car logistics, and a practical arrival routine. (150) | Does a two-pet limit mean two big dogs? Price the stay for two dogs, ask if weight limits are per dog or combined, and plan separate feeding spaces. (148) |
| 9 | portable-dog-fence-and-playpen-guide-for-rentals ("portable dog fence for rentals") | Portable Dog Fence & Playpen Guide for Rentals (46) | No Fenced Yard? Pens and Gates for Rentals (42) | Exercise pens, pressure-mounted gates and tie-out alternatives for rentals with no fenced yard, with maker-stated specs, host etiquette and honest limits. (154) | Compare exercise pens, pressure-mounted gates and tie-outs for rentals with no fence: five spec-based picks, host etiquette, and when not to use a pen. (151) |
| 10 | dog-friendly-cabin-packing-list ("dog friendly cabin packing list") | Dog-Friendly Cabin Packing List \| Paws & Passage (48, brand already inside) | Cabin Packing List for Dogs: Bears, Ticks, Ice (46) | Pack for a cabin stay with your dog: food, records, first aid, stair barriers, furniture covers, tick checks, winter hazards, and bear-aware storage. (149) | What to pack for a cabin stay with your dog: food and records, stair barriers, tick checks, winter hazards and bear-aware food storage. (135) |
| 11 | dog-friendly-rental-protection-gear-guide ("dog travel gear to protect rental furniture and car") | Rental and Car Protection Gear for Dogs (39) | Protect Rental Furniture and Car From Dog Hair (46) | Washable throws, couch covers, travel mats and back-seat covers for dog trips, plus what to ask your host first. Picks are spec-based, not tested. (146) | Washable throws, couch covers, travel mats and back-seat covers, plus what to ask your host first. Picks are chosen on maker specs, not hands-on tests. (151) |
| 12 | dog-travel-water-and-feeding-gear-guide ("dog travel water and feeding gear") | Dog Travel Water & Feeding Gear Guide (37) | Dog Travel Bowls, Bottles and Food Storage (42) | How to choose collapsible dog bowls, travel water bottles and airtight food containers for road trips and cabins, with heat and wildlife-safe storage advice. (157) | Collapsible bowls, water bottles and airtight food containers for road trips and cabins, with heat and wildlife advice. Picks are spec-based, not tested. (153) |
| 13 | dog-friendly-cabins-fenced-yards-georgia ("dog friendly cabins fenced yards Georgia") | Dog-Friendly Cabins With Fenced Yards in Georgia (48) | North Georgia Fenced-Yard Cabins: What to Check (47) | Choose a North Georgia cabin with a genuinely enclosed yard. Check gates, mountain terrain, decks, pet rules, wildlife precautions, and emergency plans. (152) | Not every "fenced" cabin yard is dog-safe. Check gates, slopes, decks, shared access, bear precautions and the nearest emergency vet before you book. (149) |
| 14 | dog-friendly-weekend-getaways-from-atlanta ("dog friendly weekend getaways from Atlanta") | Dog-Friendly Weekend Getaways From Atlanta (42) | Dog Weekends From Atlanta: 6 Bases by Dog Type (46) | Choose a Georgia weekend by your dog's needs, with mountain bases, official park rules, honest driving assumptions, rental checks, and flexible itineraries. (156) | Dahlonega, Ellijay, Blue Ridge, Helen, Red Top or Tallulah Gorge? Compare six Georgia weekends by dog type, with drive times and park rules. (140) |
| 15 | dog-friendly-weekend-getaways-from-los-angeles ("dog friendly weekend getaways from Los Angeles") | Dog-Friendly Weekend Getaways From Los Angeles (46) | Dog Weekends From LA: Beach, Mountain, Desert (45) | Compare coast, mountain, and desert weekends from LA by your dog's needs, with official park rules, travel-time caveats, and practical rental checks. (149) | Santa Barbara, Big Bear or Palm Springs? Compare weekends about 2 to 2.5 hours from LA by your dog's needs, with drive times and official dog rules. (148) |
| 16 | pet-friendly-beachfront-rentals-california ("pet friendly beachfront rentals California") | Pet-Friendly Beachfront Rentals in California (45) | California Beach Rentals: Dogs on the Sand? (43) | Choose a California beach rental with verified dog access, practical host questions, coastal safety advice, and regional beach-rule comparisons. (144) | A dog-friendly beachfront rental doesn't mean dogs are allowed on the beach. Compare leash rules, snowy-plover season and what to ask the host first. (149) |

All proposed titles are 38-47 characters and all proposed descriptions are 135-154. All proposed descriptions fit within ~155.

### Honesty check on each hook (evidence from the article source)

- #1: the article's worked example is two dogs, four nights: $80 / $100 / $100 / $160 depending on structure. "$80 or $160" is the range of that example, not a market average. The description says "depending on wording".
- #2: the short answer lists exactly five bullets; "large dogs considered means ask, not yes" is in the article.
- #3: the article asks for "a sketch, tape-measure photos and a short gate video"; the short answer lists six bullets.
- #4: the "quick booking gate" has exactly eight checkbox questions.
- #5: CPS directory and extension-tether warning are in the short answer. The old title implied the article gives picks "by situation"; if the article does not rank products, keep that out of the description (my proposal does).
- #7: "A microchip is an ID number, not a tracker" is the article's own line.
- #9: five spec-based picks, "when not to use a portable pen" is a section.
- #10: bear-aware storage, tick section and cold-weather/seasonal chemicals section all exist. "Ice" in the title refers to the winter section; if you think that is vague, use "Winter" instead.
- #11 and #12: both articles state the picks are spec-based and not tested. I kept that in the description because it is honest and unusual. Opinion: it may lower clicks slightly and raise trust; it is the right trade for an affiliate site.
- #13: the title says "what to check", not "best cabins", because the article does not list cabins. See the intent warning below.
- #14: "6 bases" matches the table (Dahlonega, Ellijay, Blue Ridge, Helen, Red Top Mountain, Tallulah Gorge). Drive times in the article are modelled 51-133 minutes.
- #15: the article's modelled times are 117-153 minutes, which is "about 2 to 2.5 hours". Joshua Tree (153) is slightly over 2.5 hours; say "about 2 to 2.5 hours" only if you accept that rounding.
- #16: snowy-plover season is in an FAQ.

### What the top results looked like (evidence), and how our title fits

The search tool gave titles and summaries. Per query:

| Query | What ranked (titles/sites I saw) | Intent I infer (opinion) | Do we differ? |
|---|---|---|---|
| how vacation rental pet fees work | Hostaway "Guest Type Hosting Guides" (fees), hostex, Hospitable "Airbnb Pet Fee: Everything You Need to Know", Evolve, Uplisting, Lodgify, Beyond Pricing "ultimate guide to setting a pet fee" | Mostly **host-side** pages about setting fees. A guest wanting to budget is underserved. | Yes if we lead with the guest's total cost. The old title did not signal that. |
| vacation rentals that welcome large dogs | PetTravel, PureWow, AvantStay, Vacasa destination pages, Vrbo affiliate, Cheapism, BetterPet, Wander | **Listings and "best of" lists.** | Yes. We are a how-to. The title must say we teach the check, not list rentals. |
| vacation rental secure fenced yard dog | AvantStay "pet friendly vacation rentals with fenced yard", Houfy (asks fence height, latch, gaps), BringFido, Twiddy, Cottage Vacations | Listing blogs; Houfy gives a short question list. | Yes. "Weakest section + evidence pack" is more specific than what I saw. |
| pet friendly vacation rental checklist | iTrip "8 Pet-friendly Vacation Tips for Rental Guests", Booking.com tips, GoPetFriendly, BringFido, Afar "9 Tips for Finding Pet-Friendly Airbnb", AARP | Numbered "tips" posts. | Partly. A numbered hook ("8 gate questions") matches the format while being more concrete. |
| dog car safety harness crash tested | Kurgo, Sleepypod, Company of Animals, Choice (AU), Fatherly, GoPetFriendly, Joyride "Do you need a crash tested dog harness" | Product pages and reviews; independent test coverage is thin. | Yes. Our angle is verification, not a product list. |
| dog first aid kit for travel | Orvis, PetPlace "Travel First-Aid Kit for Your Dog", 1800PetMeds/Kurgo, Hepper, Chewy, REI | Product-led. | Yes if we lead with the AVMA basis. |
| dog ID tags microchip GPS tracker travel | Invoxia, Trackimo, Logistimatics, PetLink "Dog GPS Trackers vs Microchips", Life360, Tryfi | Vendor comparison pages for "microchip vs GPS tracker". | Our old title was a list of nouns; the "vs" framing matches how people phrase the question. |
| traveling with two dogs accommodation | AvantStay, Vacasa, VCA, Kayak, BringFido | No dedicated two-dog how-to in what I saw. | Opening for us. |
| portable dog fence for rentals | DIY Danielle, CritterFence "Can renters install temporary pet fences", BarrierBoss, Halo, PetSafe, Bob Vila | DIY and vendors. | Yes: our angle is the host and the short stay, not owning a rental long-term. |
| dog friendly cabin packing list | Unyoked "What to pack when you're cabin-bound with your furry friend", Elk Springs Resort, Chewy, Eagle Creek, Allianz PDF | Lists, some cabin-operator written. | Moderately. Bears/ticks/winter are cabin-specific hooks. |
| dog friendly cabins fenced yard Georgia | Vrbo, Marriott Homes & Villas, Explore Georgia "Dog Friendly Cabin Rentals", Shiny Apple Cabins, Sliding Rock Cabins, Airbnb | **Transactional.** Searcher wants a booking page. | See warning below. |
| dog friendly weekend getaways from Atlanta | BringFido "weekend in dog friendly atlanta", Explore Georgia, BetterPet, Kinship, AJC, Wag Walking campgrounds | Itinerary roundups. | Yes if we lead with "by dog type". |
| dog friendly weekend getaways from Los Angeles | CBS LA, Daily Meal, LAmag, Fora, GlampingHub, Sunset "Top 25 Dog-Friendly Vacations", Discover LA | Roundups. | Yes with "beach, mountain, desert". |
| pet friendly beachfront rentals California dogs allowed on beach | BringFido, Vacasa, DogTrekker, Moon, Hepper, Cuteness, Jetsetter | Listing pages. | Yes. "Can your dog use the sand?" is the real unanswered worry; one result noted a Seal Beach condo whose beach is not pet friendly. |

**Intent warning (opinion, supported by the results above):** for "dog friendly cabins fenced yard Georgia" the first page was booking and listing pages. A how-to guide will struggle to outrank Vrbo, Marriott and Explore Georgia for that exact phrase. Realistic targets are the long-tail versions ("how to check a cabin's fenced yard", "is a fenced deck the same as a fenced yard"), which this article already answers in FAQs. The same applies, less strongly, to "vacation rentals that welcome large dogs".

---

## 2. Query gaps: questions we do not yet answer

All volumes **NOT CONFIRMED**. "Evidence" says what I saw in results; "inferred" means I built the question from the themes. Coverage was checked by searching the guide source for related terms and FAQ lists. "Partly covered" means a mention exists but no direct, findable answer.

Ranked by my judgment of usefulness to a buyer-minded dog traveler and fit with the existing site:

| Rank | Query (constructed, volume NOT CONFIRMED) | Basis | Already covered? | Where it goes | Angle that beats what ranks |
|---|---|---|---|---|---|
| 1 | Can I leave my dog alone in a vacation rental / Airbnb? | Evidence: results were host-side blogs and Airbnb community threads saying "depends on house rules; crate rule; barking". | Partly: the word "alone" appears in 13 files and FAQs in three guides touch it. No single answer page. | **New short article**, then link it from all 13. Also fixes a duplication problem (see section 5). | Guest-side: what the listing wording means ("no unattended pets" vs "crated only"), a script to ask the host, what to do if your dog barks. |
| 2 | What happens if I bring a dog to a rental that doesn't allow pets / without telling the host? | Evidence: Airbnb community and BiggerPockets threads; outcomes (fees, ask to leave, bad review) are anecdotes, no policy. | Partly: related wording appears in 2 files. | FAQ in fees article and in checklist. | Honest consequences, why it risks the booking and your review, and the polite alternative (ask first, pay the fee). Do not frame it as advice to sneak. |
| 3 | Is an AirTag enough for my dog, or do I need a GPS tracker? | Evidence: results were PetLink, Weenect, Petcube, Fi and Invoxia vendor comparisons; they agree an AirTag relies on nearby Apple devices and a cellular tracker needs a plan. | Partly: one FAQ ("Bluetooth tag instead of GPS?"). | Rename that FAQ and add a short section in the ID/GPS article. | Cover the travel case (unfamiliar rural cabin area, few nearby phones) and the breakaway-collar point. |
| 4 | Do dogs have to be restrained in a car in California / Georgia? | Evidence: results said neither state has a general restraint law, California has a pickup-bed rule, and distracted-driving law can still apply. Sources were secondary and I did not find statute text. | No (zero hits). | FAQ in the car-safety guide. | Quote the actual statute text and date it. **Verify against the current California Vehicle Code and Georgia Code before publishing**; I did not. |
| 5 | How much is a typical pet fee at a vacation rental? | Evidence: Hostaway (host-side) says flat $50-$150 per stay is common and $15-$35 per night is used. Vendor figures, not independent data. | Partly: article has structures and a worked example but no typical range. | Fees article, new short section. | Show a range with the source named and a clear "host-side estimate" label. |
| 6 | Airbnb vs Vrbo pet policies: which is easier with a dog? | Inferred from the Airbnb/Vrbo sections already in the fees guide and the SERP. | No (zero hits for the comparison). | Fees article section, or **new** comparison article. | A table of how each shows the pet fee, what the filter does, service-animal fee rules (already researched in the fees article). |
| 7 | How do I find an emergency vet while traveling with my dog? | Evidence: PetMD, GoPetFriendly, AKC, ASPCA pages; advice is "search 24-hour, save numbers, expect higher bills, do not call 911". | Partly: one paragraph in the Georgia cabins guide and a FAQ. | **New short article** "Before you go: your dog's emergency plan" or expand first-aid. | Five-minute pre-trip routine, what to say on the phone, how to find a clinic when the cabin has no cell signal. |
| 8 | Which California beaches allow dogs, and which rentals are near them? | Evidence: results show state beaches often ban dogs while city or county beaches allow them (Rosie's, Ocean Beach, Poplar Beach named). | Partly: some beaches in an FAQ. | Table in the California beach guide. | A short "dog allowed / leash only / not allowed" table by named beach with a source and a date. Only include beaches you can verify. |
| 9 | Dog weekends from LA that I'd expect to see: Ojai, Solvang, Long Beach, Orange County, Catalina | Evidence: these appeared in the LA results; our article covers Santa Barbara, Big Bear, Palm Springs, San Diego, Idyllwild. Ojai appears once; the others zero. | Partly. | LA getaways guide, one or two more rows, or a "closer than Santa Barbara" section. | Long Beach (Rosie's) is the short-drive option the results treat as obvious. Verify rules before adding. |
| 10 | Atlanta: Barnsley Resort, campgrounds near Atlanta, Atlanta itself | Evidence: Barnsley and Duckett Mill / McKinney campgrounds appeared in results; zero in our article. | No. | Atlanta getaways guide, add a "not a cabin" section. | Campgrounds are a different dog trip (bugs, noise, leash). Verify each park's pet rules from the official page. |
| 11 | Will I get my pet deposit back, and how fast? | Inferred; deposit vs fee is a common confusion (sparkrental "pet fee vs pet deposit" ranks). | Partly: "refund" in 5 files but no timeline answer. | Fees article FAQ. | Name what platforms say about timing; if unclear, say what to ask the host. |
| 12 | Can a rental refuse my dog because of breed? Pit-bull-friendly rentals | Evidence: results listed breed lists (Westgate named specific breeds), Best Friends "How size restrictions hurt renters with big dogs". | Partly: "breed" is mentioned in 10 files; one FAQ explains why rules exist. | Large-dogs guide, new section. | What evidence helps (vet letter, training record) and how to phrase the message. Do not promise outcomes. |
| 13 | Snakes (rattlesnake, copperhead) while hiking with a dog in Georgia/California | Inferred; zero hits. | No. | LA guide and Georgia cabins guide, short safety section, or new article. | Region-specific what-to-do with vet and AVMA sources; keep medical claims cited. |
| 14 | Ticks and Lyme at North Georgia cabins | Inferred; "tick" appears in 2 files (packing list). | Partly. | Georgia cabins guide FAQ. | Month-by-month risk only if you have a source; otherwise point to the packing-list section. |
| 15 | Do I need a health certificate or rabies proof to drive my dog across state lines? | Inferred; zero hits for "health certificate". I did not search this. | No. | Checklist FAQ, or the packing list "records" section. | State the rule only after checking official sources per destination; this is a place where a wrong answer is harmful. |
| 16 | Dog life jacket for a lake or beach rental | Evidence: one checklist in results lists life jackets. | Partly (one mention). | California beach guide or water gear guide. | Fit and buoyancy checks, but gear picks would need the same spec-based honesty. |
| 17 | How do I keep my dog calm in a new rental (barking, settling)? | Inferred; "bark" appears in 2 files. | Partly. | Combine with #1. | One short settling routine; avoid training claims you cannot source. |
| 18 | Dog-friendly hotel vs vacation rental: which is easier? | Evidence: Going.com and Kayak hotel/rental tip pages appeared. | Partly: hotels appear in 7 files. | Checklist intro or a short comparison article. | Decision table by dog type; low priority because hotels are outside the site's core. |
| 19 | Do I need a crate in a rental? Can I use a crate on furniture? | Inferred. | Partly (crate in 8 files). | Checklist FAQ. | Link to house-rule examples; low priority. |
| 20 | Hot weather: how long can my dog be in a car while I check in? | Inferred; the water guide has a FAQ. | Yes, partly. | None. | Skip. |

Opinion: the top 3 to build first are #1, #2 and #4. They are real worries at the moment of booking or driving, the existing site has the surrounding context, and the SERP I saw had little guest-side material for #1 and #2. #4 needs legal verification first; a wrong legal answer is worse than none.

---

## 3. Snippet and rich-result opportunities

### What the built HTML contains (evidence)

I started the built server on port 4502, fetched `/guides/dog-travel-first-aid-kit-guide` and `/guides/how-vacation-rental-pet-fees-work`, then stopped the server. Both pages contain these JSON-LD blocks, and every block parsed as valid JSON:

- `Organization` (name, slogan, description; no URL, no logo).
- `Article` with headline (uses the long `title`, not seoTitle), description, `datePublished`, `dateModified`, author (type `Organization`, name "Paws & Passage Editors"), publisher (`Organization`), `mainEntityOfPage` as a **relative** path.
- `BreadcrumbList` (Guides, then the article). Item URLs are **relative**.
- `FAQPage` with the guide's FAQs, one `Question`/`Answer` per FAQ.

### Problems and gaps (evidence unless marked)

1. **No absolute URLs anywhere.** `siteUrl` is empty (`src/config/site.ts`), so the canonical link, `og:url`, `mainEntityOfPage` and breadcrumb item URLs are all relative (e.g. `href="/guides/dog-travel-first-aid-kit-guide"`). `/sitemap.xml` returns the text "Sitemap domain not configured. Set siteUrl in src/config/site.ts." There is also **no `og:image` or `twitter:image`** in the built page; `src/lib/seo.ts` only adds them once siteUrl is set. This is the one issue that blocks everything else. It looks like an intentional pre-launch state (the sitemap message tells you to set it; I did not open the launch docs), but it should be the first thing fixed at launch. Opinion: until `siteUrl` is set the structured data cannot be relied on.
2. **`Article` has no `image`.** Google's Article guidance lists image as recommended. Each guide has a hero image in the page, but it is not in the schema.
3. **`author` is an `Organization`.** Valid. Opinion: a named person (for example a real reviewer, with a short bio page) would carry more trust for health-adjacent guides (first aid, ID/GPS). The site has `approvedBy` fields in the content model; if a real person approves guides, that could be a `Person` author or `reviewedBy`. Do not invent a person.
4. **`Organization` block has no `url` or `logo`.**
5. **`Article` headline vs title tag.** The schema uses the long H1 title; the tag uses the short seoTitle. That is acceptable, but the headline can exceed 110 characters on some guides (the longest titles are ~80), so it is currently fine.
6. **`dateModified` equals `datePublished` for all 16** (all 2026-11-16). That is truthful today. It will need to move when you actually re-check an article. The page also shows "Last reviewed" and `article:modified_time` is set.
7. **FAQPage will probably not produce a rich result.** From general knowledge (not verified in this session): since 2023 Google shows FAQ rich results only for well-known government and health sites. The markup is valid and harmless, and other search tools may read it. Do not count on expandable FAQs in results. Opinion: keep the visible FAQ, because readers use it; do not spend time on more FAQ markup.
8. **Page sections lack anchor ids.** Rendered `<h2>` elements have no `id`, so there are no jump links and Google cannot show "jump to" sitelinks under the result. See section 4.

### Six "direct answer" paragraphs

Each is written to answer the exact question in 40-60 words (word counts in brackets) and can sit directly under a question-style H2. The existing "The short answer" is a bullet list; Google's paragraph snippets generally favour a short plain paragraph directly under a heading that matches the query. (Opinion; I did not test this.)

**1. Fees guide. H2: "Are vacation rental pet fees per night or per stay?" (56 words)**
> Vacation-rental pet fees can be charged per booking, per night, per pet, or per pet per night, so the same $25 or $50 can total very different amounts. For two dogs over four nights, the examples in this guide range from $80 to $160. Ask the host for the full pet charge for your exact dates.

Table already present: "The four fee structures" and the $80 / $100 / $100 / $160 table. Keep them as real HTML tables directly below the paragraph; tables are a common snippet format.

**2. Large dogs guide. H2: "What does 'large dogs considered' mean in a rental listing?" (51 words)**
> "Large dogs considered" is not approval. Listings set their own weight and breed limits, and there is no universal definition of "large". Message the host with your dog's current weight, breed and age, and get a written yes before paying. Then check stairs, flooring and the yard for your dog's size.

Existing table: "Listing wording / Safe interpretation / Question to resolve". Keep it; it is the strongest snippet asset on that page.

**3. Secure fenced yard guide. H2: "How do I check that a rental's fenced yard is really secure?" (52 words)**
> A fenced yard is only as secure as its weakest section. Check the lowest fence height from your dog's side, gaps under or beside gates, latches, and places where two fence types meet. Ask the host for a sketch, measured photos and a short video of the gate closing before you pay.

Add a numbered list of five checks (continuous loop, weakest section, gate gap, latch, shared access) under it. Numbered lists are a common snippet format for "how to check".

**4. ID tags/GPS guide. H2: "Does a microchip track my dog?" (57 words)**
> A microchip is an ID number, not a tracker: it only helps if someone scans your dog and your registry details are current. A GPS tracker shows location but needs a subscription, cell coverage and a charged battery. A Bluetooth tag relies on nearby phones. Use a tag, a registered microchip and, if suited, a tracker together.

Add a 4-row comparison table (tag, microchip, Bluetooth tag, GPS tracker) with columns: tells you where the dog is, needs battery, needs subscription, needs a person to find the dog. The guide has tables already (8 table lines); check whether this one exists before adding.

**5. Car safety guide. H2: "What does 'crash tested' mean for a dog harness?" (about 54 words)**
> "Crash tested" is not a regulated term for dog products. Look up the exact harness or crate model and size in the Center for Pet Safety Certified directory, check the test dog's weight matches yours, and keep a dog that rides on a seat in the back. Avoid extension tethers, which the Center says increase injury risk.

Add a four-step "How to verify" numbered list under the paragraph.

**6. First-aid guide. H2: "What should be in a dog first-aid kit for travel?" (50 words)**
> A dog travel first-aid kit buys time until a vet can help; it does not replace one. Start with the AVMA checklist: thermometer, muzzle, bandage supplies, blunt scissors, gloves, tweezers and saline. Add your dog's records, the nearest emergency clinic's number and poison-control numbers (ASPCA 888-426-4435, Pet Poison Helpline 855-764-7661).

Render the AVMA item list as a single bulleted list directly below. The page already has the FAQ answer in near-identical form; the opportunity is to put it in the body, not only in a collapsed `<details>`.

Opinion: confirm each paragraph against the article text before publishing; I wrote them from the short answer sections and FAQs, which are sourced.

---

## 4. On-page features: what exists, what to add, what to skip

### What exists today (evidence, from `src/routes/guides.$slug.tsx` and built HTML)

- A byline line: "By Paws & Passage Editors, Last reviewed 2026-11-16, 9 min read". So the visible "last checked" date **already exists**; its wording is "Last reviewed".
- "The short answer" section at the top of each article (a bullet list).
- A collapsed FAQ ("Questions people ask") using `<details>`.
- A "Sources and how we researched this" box, with the count of competitor pages reviewed.
- A sidebar with "Tools for this" links (cost calculator, host questions, checklist) and a "Keep reading" related-guides block.
- Visible breadcrumb (`aria-label="Breadcrumb"`), print styles (`no-print` classes), an affiliate notice, and a gear-picks component.
- **Not present:** a table of contents, section jump links (headings have no ids), a pros/cons component, a "printable" button.

### Which are worth it for this reader

This audience is a person about to spend money on a trip, often on a phone, often at the moment of messaging a host. Opinion throughout.

| Feature | Verdict | Why |
|---|---|---|
| Visible "last checked" date | **Already there; keep and make more prominent for time-sensitive pages** | Fees, platform policies and park rules change. A "Last reviewed 2026-11-16" line is a trust signal for this reader. Consider putting "Checked November 2026" in the title only for the two destination guides and the fees guide, where facts change fastest, and only if you will re-check them on a schedule. A stale "2026" in a title is worse than none. |
| Jump links / table of contents | **Worth it, small** | Articles are 8-10 minute reads with 8-12 sections. On phone, a short "Jump to" row (5-8 links) saves scrolling to the one section someone needs (for example, "Cancellation terms"). It also gives Google a chance at sitelinks. Needs heading ids. Keep it compact and collapsed on mobile. |
| "Quick answer" box | **Already there as "The short answer"; improve it, do not add another** | Make the first sentence a one-paragraph direct answer (section 3) rather than only bullets. |
| Copy-ready host message | **Worth it, high** | Several guides end with "send one useful message". The site already has a host-question generator tool. Make the message visible and copyable on those pages. This is the most useful thing for someone about to book. |
| Printable / saveable checklist | **Worth it for 3 pages only** (checklist, packing list, fenced-yard evidence pack) | People print or screenshot a packing list or arrival checklist. The site has print styles and a saved checklist tool; link to it prominently rather than building a new print button. |
| Pros and cons boxes | **Clutter for most pages** | These guides teach checks, not choose between a few products. Exceptions: the portable fence guide (pen vs gate vs tie-out) and the two-dog page could use a compact "when this fails" line per option, which the guides already have in prose. |
| Comparison tables | **Worth it where data is comparative** | Already used well in fees, large dogs, Atlanta and LA. Add the tracker table (section 3). |
| Author bio / who checked this | **Worth it for first-aid and ID/GPS** | Health-adjacent advice benefits from a visible "reviewed by" line. Only if it is true. |
| Cost calculator embed | **Worth it on the fees page** | The site has a trip cost calculator; the fees guide links to it once. A button directly under the worked example ("Try it with your dates") is a natural next step. |
| Reading-time badge | **Fine as is** | No change. |
| Newsletter box | **Leave as is** | Already at the bottom. A top-of-page popup would be clutter on a research-stage visit. |

---

## 5. What to remove, merge or sharpen

### Cannibalization (evidence of overlap, opinion on severity)

I compared H2 headings and primary keywords.

| Overlap | Severity | What I saw | Suggested action |
|---|---|---|---|
| `vacation-rental-secure-fenced-yard` vs `dog-friendly-cabins-fenced-yards-georgia` | **Medium** | Both teach "what does fenced mean", gates, ground, shared yards, pool or deck cases. Primary keywords differ, but a searcher for "fenced yard rental Georgia" could get either. | Keep both. Move the generic fence-checking detail into the generic guide and make the Georgia one link to it and lead with what is Georgia-specific: mountain terrain, decks, bears, nearest vet, which towns. Several of its 12 H2s ("What does fenced mean", "Gates, driveways and arrival", "Check the ground", "Private versus shared") are generic checks that the other guide also has. |
| `portable-dog-fence-and-playpen-guide` vs the two fenced-yard guides | **Low** | Different intent (no fence at all). Cross-links exist. | Keep. Make sure the generic fenced-yard guide links to it under "if there is no fenced yard". |
| `pet-friendly-vacation-rental-checklist` vs `how-vacation-rental-pet-fees-work` | **Medium** | The checklist has a full section "Calculate the actual price" and "Separate pet fees, deposits and damage responsibility" which the fees guide covers in depth. | Shorten those two checklist sections to a 3-line summary plus a link to the fees guide, so the fees query points at one page. |
| `pet-friendly-vacation-rental-checklist` vs `vacation-rentals-that-welcome-large-dogs` vs `traveling-with-two-dogs` | **Low** | Each repeats "get approval in writing". | Acceptable repetition; they target different queries. |
| `dog-friendly-cabin-packing-list` vs the first-aid, water/feeding and protection-gear guides | **Medium** | The packing list has its own sections on first aid ("A practical canine first-aid kit"), food and water, and furniture covers. The three gear guides are the deep dives. | Make the packing list the hub: keep a short bullet version of each and link out. Check that "dog first aid kit for travel" lands on the first-aid guide, not the packing list. |
| `dog-friendly-weekend-getaways-from-atlanta` vs `dog-friendly-cabins-fenced-yards-georgia` | **Low** | Both mention Blue Ridge and Ellijay, but intent differs (where to go vs how to check a cabin). | Keep. Cross-link, which exists. |
| `dog-friendly-weekend-getaways-from-los-angeles` vs `pet-friendly-beachfront-rentals-california` | **Low** | Santa Barbara / Arroyo Burro appears in both. | Keep. |
| `dog-car-safety` vs `rental-protection-gear` (car-seat covers) | **Low** | Rental-gear guide covers back-seat covers and hammocks; it has an FAQ saying a hammock is not a restraint. | Fine; keep the safety pointer. |
| Fleet of "can I leave my dog alone" answers | **Medium (quality, not ranking)** | Variants of the same question appear in at least three FAQs (two-dog, portable pen, Atlanta) with separate answers. | Write one canonical answer (gap #1 above) and have the others link to it, so the advice cannot drift apart. |

No page should be deleted. I found no two guides with the same primary keyword.

### Thin pages
None. Source files are 19-31 KB each and 7-12 H2 sections. The "thinnest" are `vacation-rentals-that-welcome-large-dogs` (~19.6 KB, 11 H2s) and `traveling-with-two-dogs` (~19.8 KB, 10 H2s), and both are still full guides.

### Generic or weak titles (evidence: current titles in section 1)
- "Dog-Friendly Weekend Getaways From Atlanta" and "...From Los Angeles" are the same phrase the top results use. They are the most generic.
- "Dog Travel Water & Feeding Gear Guide", "Portable Dog Fence & Playpen Guide for Rentals" and "Rental and Car Protection Gear for Dogs" name a category and give no reason to click.
- "How to Find Vacation Rentals for Large Dogs" and "How to Find a Rental With a Secure Fenced Yard" promise "find" (listings), which is the wrong signal when the page is a checking guide.

### Other observations
- All 16 guides are dated 2026-11-16 for publish and review, so they will look like a single batch to Google and to readers. That is fine, but stagger real updates after launch so "last reviewed" dates reflect actual checks.
- Opinion: the guides with the best realistic chance to rank are the ones where the SERP I saw had little guest-side how-to content: fees (host-side results dominate), two dogs, fenced-yard checking, ID/GPS "what does each do", and the rental/car protection angle. The least likely: GA cabins (transactional), large-dog rentals as a category, and the two city getaway lists (strong media competitors such as CBS, Sunset and AJC).

---

## Top 5 recommendations

1. **Set `siteUrl` and add an image to the Article schema before launch.** Right now canonical links, `og:url`, schema URLs and breadcrumb URLs are relative, there is no `og:image`, and `/sitemap.xml` says the domain is not configured. Nothing else in this report matters for search until this is fixed. (Evidence from the built HTML and `src/lib/seo.ts`.)
2. **Rewrite the 16 titles and descriptions with the proposals in section 1.** Lead with the reader's question or a number the article actually contains ("$80 or $160", "5 checks", "6 bases by dog type"), and keep the honest "spec-based, not tested" wording on the gear guides. This is a source-text-only change, which suits a small team.
3. **Put a one-paragraph direct answer under a question-style heading in each guide, starting with the six in section 3** (fees, large dogs, fenced yard, ID/GPS, car safety, first aid), and add jump links (needs heading ids) plus a visible copy-ready host message. The "last reviewed" date and "short answer" already exist; improve them instead of adding more boxes.
4. **Close the highest-value query gaps:** one canonical "Can I leave my dog alone in a rental?" article that the other 13 guides link to; FAQ answers on what happens if you bring a dog to a no-pets rental and on typical pet-fee ranges; and a car-restraint-law FAQ **only after checking the statutes**. Volumes are not confirmed, so treat these as informed bets.
5. **Reduce overlap so each query has one clear winner:** shrink the checklist's fee sections to a link to the fees guide, make the Georgia cabin guide lead with Georgia-specific content, and make the packing list a short hub that points to the first-aid, water/feeding and protection guides. Do not delete any page.
