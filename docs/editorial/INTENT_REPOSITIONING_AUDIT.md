# Intent repositioning audit (Part 1 of 2)

Date: 2026-11-25. Author: Claude Code (strategic content audit of source and live-search observations). Status: Part 1 is done from evidence already in the repo plus WebSearch checks run today. Part 2 (Cowork evidence from Search Console, Google Trends and Keyword Planner for the seed queries below) is NOT written yet and will be added as a section at the bottom of this file.

Scope: no site file, guide, product or shared doc was edited. Every proposal below is a HYPOTHESIS to be applied by a later pass, after the reader-first edit pass has landed (section 8 lists the exact files each proposal touches).

## 0. Evidence rules and limits (read first)

1. **No volumes, difficulty, positions or traffic projections are invented.** The only measured numbers are the ones already in the repo: Search Console 2026-11-16 to 11-23 (0 clicks, 306 impressions, average position 17.4, 47 queries; docs/SALE_RELEASE_STATUS.md), a nine-query SERP snapshot (page 1 for 3 of 9: about #1 "no pet fee vacation rentals", #2 "what happens if you bring a dog to a no pets rental", about #9 "per night per dog"; page 2 for 1; absent from the top 30 for 4, among them "vacation rentals large dogs no weight limit", "how many dogs allowed vacation rental", "dog friendly cabins Blue Ridge Georgia", "sneak a dog into an airbnb"), 83 impressions at position 6.6 and 0 clicks for the no-pets guide (older build), and Keyword Planner ranges (about 100 to 1K a month for "airbnb pet fee" and "dog friendly vacation rental"; no data for long-tail phrases). Google Trends was mostly empty for long-tail phrases and is relative anyway.
2. **All of that was measured on the OLD production build** (the domain is about 9 days old; production was stale; SEO root cause doc says do not read rankings as a verdict until 2 to 4 weeks after the final build is deployed). Everything here that depends on those numbers is PROVISIONAL.
3. **SERP observations are from WebSearch (standard mode) on 2026-11-25.** It returns a result list and a summary, not an ordered Google page, and it shows no autocomplete and no People Also Ask. "Seen" below means: these result types and domains were returned for that query. A label such as "listings" means the returned URLs were individual Airbnb, Vrbo, Expedia, Marriott Homes and Villas, Vacasa or BringFido listing pages. I did not read each result page in full.
4. Page content was read from SOURCE (src/content/guides, content/guides, src/routes, src/content/destinations.ts, src/content/town-reads, content/stays) on the current merged main, which already contains the reader-first edits by W3, W4 and W5 (logs in docs/editorial/reader-first). I did not re-fetch the live site: production is a stale build, so source is the right basis for what the next deploy will serve.
5. Search "intent" classes used: INFO (informational), COMM (commercial investigation), TRANS (transactional or booking: the searcher wants to land on a bookable listing), NAV (navigational).
6. Persona audits P2 and P3 exist and were read (docs/editorial/personas/audit-P2.md, audit-P3.md); P1 and P4 were not present when I finished. Persona search phrases are the auditors' hypotheses, not measurements.

## 1. What the SERPs look like (observed today)

| Query searched (2026-11-25) | What was returned | Intent read | Implication |
|---|---|---|---|
| dog friendly cabins in Blue Ridge GA | Explore Georgia dog-friendly cabin page, Marriott Homes and Villas pages, Airbnb listings, Vrbo listings, Expedia/Travelocity cabin pages, Vacasa unit pages, a local directory (blueridgemountains.com) | TRANS | Page 1 is inventory. A policy-research page does not match. Only a page that shows bookable-looking stays plus the dog facts can compete, and it must beat OTAs. |
| no pet fee vacation rentals | Vacasa pet-friendly pages, Twiddy, AARP, Houfy, a pet-travel directory, Vacasa city pages | TRANS/COMM | Our guide is reported #1 for this exact phrase in the earlier snapshot, so the SERP is thin on true "no fee" content. Keep the promise, add a route to where to look. |
| cabins that allow 2 dogs | Airbnb and Expedia listings, BringFido lodging pages, a KOA blog, a resort page | TRANS | Listings dominate; no guide-type result seen. |
| vacation rentals that allow large dogs no weight limit | Only Vacasa dog-friendly pages (about 20 of them) | TRANS/COMM | One operator owns the SERP. No page seen explains how limits are written. Our dataset angle is open, but the searcher wants homes. |
| dog friendly cabins Ellijay GA fenced yard | Expedia, Vrbo, Airbnb listings; Airbnb city page | TRANS | Inventory. |
| dog friendly cabins Smoky Mountains Gatlinburg no pet fee | Cabin-company pet page, Airbnb, Expedia, Vrbo, Marriott Homes and Villas, Vacasa, AAA, a cabin-company blog, one Houfy listing | TRANS | Inventory plus a few operator and AAA guides. |
| large dog friendly cabins Georgia mountains no size limit | Explore Georgia, Sliding Rock Cabins, Airbnb, Vrbo, Expedia, Marriott Homes and Villas, Only In Your State article | TRANS | Inventory. Sliding Rock appears as its own result, so a competitor with "no size limit" wording exists. |
| cabins that allow 3 dogs Blue Ridge Georgia | Airbnb, Explore Georgia, Expedia, Vrbo, Trip.com, a local directory | TRANS | Inventory. Shiny Apple Cabins (a manager) recurs. |
| how to find vacation rental with fully fenced yard for dogs | AvantStay blog, AFAR, AARP, Vacasa, Marriott Homes and Villas, BringFido blog, Booking.com article, Airbnb Community threads, Twiddy blog | INFO | Tip lists from brands. Our verification method (sketch, tape photos, gate video) is a real differentiator. Winnable on the how-to phrasing. |
| dog friendly cabin packing list what to bring | Unyoked, Chewy, Eagle Creek, KOA, PHS-SPCA, Fox News, Marriott, Wag, cabin companies | INFO | Brand blogs; strong incumbents. |
| how much is a pet fee at vacation rentals per dog | Hostaway, Uplisting, Lodgify, Airbnb Community threads, Vacasa, Hostex, Beyond Pricing | INFO (host-side) | Hosts write for hosts. A guest-side, dataset-backed answer is a gap (matches the fees guide). |
| dog friendly Helen GA cabins pet policy | Airbnb city page, Vrbo, Expedia, Vacasa, Explore Georgia | TRANS | Inventory. |
| dog friendly cabins Dahlonega GA | Airbnb city page, Expedia, Vrbo, Travelocity | TRANS | Inventory. |
| pet deposit vs pet fee vacation rental refundable | Zillow, Apartments.com, Rentspree, RentCafe, FindLaw (all long-term lease sources), Lodgify encyclopedia (the only short-term one) | INFO | A vacation-rental-specific answer is a gap, but many incumbents on the generic query. |
| can you sneak a dog into an Airbnb what happens | BiggerPockets threads, Airbnb help article, Airbnb Community threads, Bored Panda, Guesty, an AOL story | INFO | Forums and host guides; our no-pets guide is absent here but is the closest match. |
| dog friendly road trip packing list checklist | Kayak, Orvis, Petco, PetSmart, Dogster, PureWow, Marriott, AOL | INFO | Strong brand publishers. |

Earlier queries read in docs/SEO_ROOT_CAUSE_INVESTIGATION.md section 6 (14 queries, same method) are not repeated here.

**Pattern.** Every query that names a place plus "cabins", a dog count, a size or a fee ("dog friendly cabins in Blue Ridge", "cabins that allow 2 dogs", "no pet fee", "large dog friendly cabins") returns inventory pages. Searchers of those queries are in booking mode. Our pages for those topics deliver policy research. Queries phrased as a question or a how-to ("how many dogs allowed", "how to find a fenced yard", "per night per dog", "what happens if...") return guides and forums, and our pages already match them.

## 2. Page-by-page audit

Reading the columns: Title is the browser title (seoTitle) and H1 is the on-page heading (the guide `title`, or the route heading); they are within the 60-character and 120 to 160 character limits enforced by the content tests. "Mismatch" says whether the promise (title, H1, description) is something the page does not give a searcher of that intent.

Fix categories: RETITLE/REFRAME, ADD A COMPONENT, SPLIT INTENT, LINK/ROUTE, RETARGET THE QUERY, LEAVE.

### 2.1 The three named guides and the other guides

| Page | Current title / H1 / description (summary) | Primary query it appears to target | Intent (from SERP seen) | What it actually delivers | Mismatch? | First screen a searcher would expect | Fix |
|---|---|---|---|---|---|---|---|
| /guides/vacation-rentals-with-no-pet-fee | Title "Vacation Rentals With No Pet Fee: 3 of 38 Managers" (50). H1 "Vacation Rentals With No Pet Fee: The 3 Managers We Found". Desc "Only 3 of 38 managers we read say dogs stay free. See each one's exact wording, what else they charge, and how to compare the total before you book." (148) | "no pet fee vacation rentals" (reported #1) | TRANS/COMM | 721 body words: opening says fee-free is rare and names the three; six host questions; a three-manager table with quoted wording and what each does not say; cost comparison; how to look on Airbnb and Vrbo. No homes to click. | PARTLY. The title promises the three managers and the page delivers that. A booking searcher also expects "where do I book one". The page names Sliding Rock, Hapey, Twiddy but gives no direct "see their dog-friendly homes" route and does not link /stays (0 links to /stays). | A short list of who to look at with a button to each manager's own pet-friendly page, then a one-line catch ("no fee is not no cost"). | KEEP the query promise (it ranks). ADD A COMPONENT (first-screen "Where to look" strip) and LINK/ROUTE to /stays with the no-fee filter. Do not retitle. |
| /guides/vacation-rentals-that-welcome-large-dogs | Title "Large Dog Friendly Vacation Rentals and No Weight Limit" (55). H1 "Large Dog Friendly Rentals and No Weight Limit Options". Desc "We read 38 managers' pet pages: 6 state a dog weight limit and 2 say none. See the exact wording, then copy a message to ask about a big dog." (141). Dek says "Not a rental list". | "large dog friendly rentals", "vacation rentals large dogs no weight limit" (absent in top 30) | TRANS/COMM | 1,389 words: weight-limit wording table (6 managers), how to read a listing, message to ask, five checks, breed rule, furniture. It names the two no-limit managers inside the body, but no stays. 1 link to /stays, 3 to the acceptance tool. | YES, the worst of the guides. The H1 says "Options" and the title says "Large Dog Friendly Vacation Rentals", language of a list, while the dek and first screen say "not a rental list". The first screen is a how-to-read-limits paragraph. | Large-dog-friendly stays or at least the two managers that state no weight limit, with the 6 capped managers shown as "caps to avoid" in a table. | RETITLE/REFRAME plus ADD A COMPONENT (shortlist block) plus LINK/ROUTE to /stays with the large-dog filter. |
| /guides/how-many-dogs-can-you-bring-to-a-vacation-rental | Title "How Many Dogs Are Allowed at an Airbnb or Rental?" (49). H1 "How Many Dogs Are Allowed at an Airbnb or Vacation Rental?" Desc "How many dogs are allowed at an Airbnb? Two is the usual cap. See limits from 38 managers, weight caps, extra-dog fees and a message to ask for a third." (152) | "how many dogs allowed at an Airbnb" (absent in top 30 in the old snapshot); also catches "cabins that allow 2 dogs" in spirit | INFO (the question) but the sibling "cabins that allow 2/3 dogs" is TRANS | 1,100 words: 22 of 38 cap at 2, 2 allow 3, 14 give no number; platform and manager limits; booking worksheet for 2 or more dogs; how to ask for a second or third dog (merged by W4). | NO for its own query. PARTLY for the sibling TRANS queries: nothing shows which listed stays take three or more. 0 links to /stays. | For the question: the number and the message (present). For the cabin query: stays that state 3 or more dogs. | LEAVE title and H1 (the query is an INFO match). ADD A COMPONENT (3-line "stays that state three or more dogs" block, sourced to the stay files) and LINK/ROUTE to /stays (multi-dog filter). SPLIT INTENT only if Cowork shows demand for "cabins that allow 3 dogs". |
| /guides/vacation-rental-secure-fenced-yard | Title "Fenced Yard Vacation Rental: How to Check It's Dog-Safe" (55). H1 "How to Find a Vacation Rental With a Truly Secure Fenced Yard". Desc "Fenced yard vacation rental? A photo proves nothing. Find the weakest fence section, check gates and latches, and ask for a sketch and gate video." (146) | "fenced yard vacation rental dogs how to check", "how to find a rental with a fenced yard" | INFO | 1,377 words: ask-before-you-pay evidence pack (sketch, tape photos, gate video), dog-type table, listing decode, weakest-section and gate checks, bring-your-own-boundary, arrival walk. 1 link to /stays. | NO. The H1 says "find" and the page teaches how to verify; searchers of "fenced yard cabins Blue Ridge" (TRANS) are a different audience and will not land here anyway. | The verification pack above the fold (present). | LEAVE. LINK/ROUTE only: one clause linking the fenced-yard filter in /stays (10 of 83 stay files state a full fence). Own the INFO query; do not chase the TRANS one here. |
| /guides/how-vacation-rental-pet-fees-work | Title "Vacation Rental Pet Fees: Per Night or Per Stay?" (48). H1 "How Vacation Rental Pet Fees Work: Per Night, Per Dog or Per Stay". Desc "How vacation rental pet fees work: we read 38 managers; 22 state a charge, 3 charge $0 and 13 name no amount. See the units and price your trip." (144) | "vacation rental pet fee per night or per stay", "per night per dog" (about #9), "airbnb pet fee" (Keyword Planner 100 to 1K a month) | INFO (host-side incumbents) | 1,235 words: message with exact dates and dog count, charge ranges and units, fee vs deposit vs hold, Airbnb and Vrbo display, service animals, surprise charges, protecting the deposit. | NO. | A formula and a place to total it (present). | LEAVE. Option: test adding "Airbnb" to the title if Cowork confirms "airbnb pet fee" is the better-demand phrase. |
| /guides/airbnb-pet-damage-charge-after-checkout | Title "Airbnb Pet Damage Charge After Checkout" (39). H1 "Airbnb Pet Damage Charge After Checkout: What to Do". Desc "Host asked for pet damage money after checkout? Airbnb's 24-hour, 14-day and 60-day clocks, reply scripts and an evidence checklist to use." (139) | "airbnb pet damage charge after checkout" | INFO (support) | 1,085 words: three clocks, do-this-first, scripts, evidence list. | NO. | The three clocks (present, first line). | LEAVE. |
| /guides/dog-friendly-cabin-packing-list | Title "Dog Cabin Packing List: What to Bring" (37). H1 "Dog-Friendly Cabin Packing List: What to Bring". Desc "A tickable dog cabin packing list for a weekend: essentials, what changes by cabin and season, drive and sleep gear, and what can stay home." (140) | "dog friendly cabin packing list" | INFO | 1,067 words: tickable checklist plus planner block `{{planner:cabin}}`. | NO. | A tickable list near the top (the opening paragraph is two sentences, then the planner). | LEAVE. LINK/ROUTE: the planner (/tools/packing-list) is already embedded. |
| /guides/bringing-a-dog-to-a-no-pets-rental | Title "No-Pets Rental With a Dog: What Happens, What to Do" (51). H1 "What Happens If You Bring a Dog to a No-Pets Rental?" Desc 159 chars. | "what happens if you bring a dog to a no pets rental" (#2 in the earlier snapshot); "sneak a dog into an airbnb" (absent) | INFO | 1,121 words (opened by W4): ask-first message, if the host says no, consequences ($300 to $1,000 in the manager pages we read), service animals, checklist. | NO for the ranking query. | Consequence plus a message to ask (present). | LEAVE. Possible additive test (not a title change): one H2 phrase that mirrors "sneak" wording in a neutral tone (hypothesis; see the cluster F table). |
| /guides/smoky-mountain-cabins-with-dogs (DRAFT, not live, 404) | Title "Smoky Mountain Cabins With Dogs: Pet Rules to Check" (51). Desc 158. | "dog friendly cabins Smoky Mountains Gatlinburg" | TRANS | 1,219 words in draft: message to the manager first, fee, limits, access, winter. | Same mismatch class as the Blue Ridge pages if published as written. | A cabin-company shortlist or a "what to check" first with honest framing. | RETITLE before approval if it goes live: lead with the check, not "cabins with dogs". Decide with Cowork evidence. Not touched here. |
| /guides/dogs-in-georgia-state-park-cabins | Title "Dog Friendly Cabins in Georgia State Parks: Rules" (49). Desc 148. | "dog friendly cabins georgia state parks" | INFO/TRANS | Official rules, fee ($50 per dog), parks named, a request message. | NO. It names parks and rules, which is what that searcher wants; the official reservation site owns the booking. | Rules plus a link to the official reservation page. | LEAVE. |
| /guides/pet-friendly-vacation-rental-checklist | Title "Pet-Friendly Vacation Rental Checklist" (38). | "pet friendly vacation rental checklist" | INFO | Eight-item checklist (audit-B: ON-TARGET). | NO. | Checklist first. | LEAVE. |

### 2.2 Fenced yard, destination and stay pages

| Page | Current title / H1 / description | Primary query it appears to target | Intent | What it delivers | Mismatch? | First screen expected | Fix |
|---|---|---|---|---|---|---|---|
| /destinations | Title "Dog-friendly Georgia and California trips" (40, brand suffix added only if it fits). H1 "Destinations". Desc "Plan dog-friendly trips to the North Georgia mountains and the California coast, with town-by-town notes on yards, beaches and local rules." | "dog friendly Georgia California trips" (no evident real query) | NAV/INFO hub | Two state cards. | PARTLY: H1 "Destinations" says nothing; the description promises "notes on yards, beaches and rules". | Two clear entries and what is behind them. | RETITLE/REFRAME. Low traffic value; it is a hub. |
| /destinations/georgia | Title "Dog-friendly Georgia trip planning". H1 "North Georgia mountains, with room for the dog". Desc is the first 155 characters of the intro, cut mid-sentence. | "dog friendly north georgia cabins" | TRANS (cabins) / INFO (planning) | Intro, four towns, things-to-do reads, two guides, a "Stays in Georgia" grid (at the bottom). | YES. "Trip planning" and an atmospheric H1 do not state "cabins" or "dog rules"; the stays grid is last on the page and the description is truncated. | The four towns plus a clear row of stays with the dog facts. | RETITLE/REFRAME, ADD A COMPONENT (move or mirror a stays shortlist above the guides), fix the description (route head change). |
| /destinations/georgia/blue-ridge | Title "Dog-friendly Blue Ridge: planning notes". H1 "Dog-friendly Blue Ridge". Desc built from the blurb plus "What to check before booking a dog-friendly stay in Blue Ridge." | "dog friendly cabins in Blue Ridge GA" (absent in the old snapshot) | TRANS (SERP seen: listings) | Hero blurb; things to do near Blue Ridge with a suggested read; three planning notes; checklist/acceptance-tool links; a Stay22 map; read-next guides; "Stays in Blue Ridge" grid at the bottom. 14 stay files for this town (all status "unverified", listed only if they have an approved affiliate link). | YES. The title says "planning notes" (honest, but it does not answer a booking query); the page opens with a photo and a blurb and the cabins are at the bottom. | A shortlist of stays with dog limit, fee, fence and a "listing says" label, then the checks. | RETITLE/REFRAME plus ADD A COMPONENT (stays shortlist above the fold) plus LINK/ROUTE (/stays filtered to the town). |
| /destinations/georgia/ellijay | Same pattern: "Dog-friendly Ellijay: planning notes", H1 "Dog-friendly Ellijay". | "dog friendly cabins Ellijay GA fenced yard" | TRANS | 5 stay files, 2 planning notes. | YES, same as Blue Ridge, thinner. | Same. | Same fix; lower priority. |
| /destinations/georgia/helen | "Dog-friendly Helen: planning notes". | "pet friendly cabins Helen GA" | TRANS | 4 stay files (all with a weight limit stated, none with a full fence), 2 planning notes. | YES. | Same. | Same fix; the weakest data, so a shortlist may not be honest yet. Lowest priority. |
| /destinations/georgia/dahlonega | "Dog-friendly Dahlonega: planning notes". | "dog friendly cabins Dahlonega GA" | TRANS | 5 stay files (2 with a full fence), 2 planning notes. | YES. | Same. | Same fix; low priority. |
| /destinations/california | Title "Dog-friendly California trip planning". H1 "Coastal California, beach rules included". | "dog friendly beach rentals California" | TRANS | Intro, four towns, two guides, stays. | YES (same pattern), but California has no hotspot for our data (see section 6). | Same. | LEAVE for now (deprioritize). |
| California towns (San Diego, Santa Barbara, Monterey, Mendocino) | "Dog-friendly San Diego: planning notes" etc. San Diego 5, Santa Barbara 3 stay files; Mendocino 5; Monterey 1. Mendocino and Monterey town pages are noindex (SEO root cause doc). | "dog friendly beach rental San Diego" etc. | TRANS | Planning notes and beach-rule bits. | YES, same pattern. | n/a | LEAVE. These towns face the most OTA competition and our stay data there is thin. |
| 8 town things-to-do pages (Blue Ridge, Ellijay, Helen, Dahlonega, San Diego, Santa Barbara, Monterey, Mendocino) | Titles "Dog-Friendly Things to Do in Blue Ridge, GA" etc. (all within 60); H1 "What Can You Do With a Dog in Blue Ridge, Georgia?"; descriptions name the places and say "with the rule for each". | "dog friendly things to do in Blue Ridge GA" | INFO/local | Each place with the rule and the source page. Blue Ridge things-to-do was "Discovered, not indexed" in the last Search Console read. | NO. Title, H1 and content agree. | The list of places with rules (present). | LEAVE titles. LINK/ROUTE: a one-line "Where to stay with a dog in Blue Ridge" bridge to the town page, once the town page has the shortlist. |
| /stays | Title "Dog-friendly stays and their pet policies". H1 "Dog-friendly stays". Desc "Dog-friendly cabins, cottages and beach houses, with pet fee, dog limit, weight limit and fenced yard shown for each. Anything unconfirmed is marked." | "dog friendly cabins" head term | TRANS | Filter directory: 83 stay files, 78 listed (affiliate gate), 23 indexable (SEO doc), all labelled "Not yet verified". Filtered URLs are noindex. | PARTLY. Honest, but an OTA-dominated head term; "crawled, currently not indexed" in an older Search Console read. | Cards with dog facts (present) and entry chips for the common asks. | RETITLE/REFRAME (title promises the facts), ADD A COMPONENT (chips for fenced, 3+ dogs, no fee, large dogs). Do not expect it to win the head term. |
| /data/pet-policies | Title "Dog Policies at 38 Rental Managers: Fees and Limits". H1 "What 38 vacation rental managers say about dogs". Desc "We read 38 vacation rental managers' own pet pages: 3 charge no pet fee, 6 state a weight limit. Every row has a source link, plus a CSV." | "vacation rental pet policy data", "pet fee statistics" | INFO/research | The only original dataset; table, CSV, method. | NO. | Numbers and the CSV (present). | LEAVE. It is the hub; link to it from every proposal below. |
| /tools/packing-list | Title "Dog Travel Packing List Builder | Paws & Passage". Desc "Create a personalized dog travel packing list, customize it, check items off as you pack and print it. Free, with no signup." | "dog packing list generator" | tool | Planner. | NO. | n/a | LEAVE. |
| /gear and trip collections (/gear?trip=road-trip, cabin-stay, beach-and-lake, winter-trip, hiking and four dog-type shortcuts) | /gear title "Dog Travel Gear for Road Trips and Cabins". Trip views are noindex with canonical /gear. | "dog travel gear" | COMM | Product hub (picked by trip, category or dog). | NO (it is a commerce hub). | n/a | LEAVE. Not a booking-intent page; keep out of the repositioning. |

## 3. Pages that already rank: protect the promise

| Page | Query it already earns (old snapshot) | What not to change |
|---|---|---|
| /guides/vacation-rentals-with-no-pet-fee | about #1 "no pet fee vacation rentals" | seoTitle (50 chars, contains "Vacation Rentals With No Pet Fee"), H1 and the three-manager table. Only add; do not reword. |
| /guides/bringing-a-dog-to-a-no-pets-rental | about #2 "what happens if you bring a dog to a no pets rental"; 83 impressions at position 6.6 in the older build | seoTitle, the consequences section, URL. |
| /guides/how-vacation-rental-pet-fees-work | about #9 "per night per dog" | "Per Night" and "Per Stay" in the title; the unit explanation. |

Important caveat: the snapshot was of the old build with old titles; after deploy these positions may move either way. Re-measure before and after any change (Cowork Part 2 will give a baseline).

## 4. Seed queries (for Cowork)

How to read this table. "Probable intent" is my judgement from the SERP I saw or, where I did not search, from the phrase (labelled "not searched"). "Best URL" is the existing page that is closest. "Satisfies?" is YES, PARTLY or NO for a searcher of that intent landing on that URL. "Winnable?" is a hypothesis from competition seen on the SERP, not a ranking forecast. "Cowork must collect" lists the evidence Part 2 needs; the full list for every row is: Search Console (28-day impressions, average position, clicks, top page for the query, country US), Google Trends (relative interest, 12 months, US, against the benchmark "airbnb pet fee"; label that it is relative), Keyword Planner (volume range; "no data" is a valid answer), and a private-window top-10 snapshot (result types and domains).

### Cluster A: cabins allowing two or more dogs

| # | Query | Probable intent | Best existing URL | Satisfies? | Winnable? (hypothesis, competition seen) | Cowork must collect |
|---|---|---|---|---|---|---|
| A1 | cabins that allow 2 dogs | TRANS (seen: Airbnb, Expedia, BringFido, KOA blog) | /guides/how-many-dogs-can-you-bring-to-a-vacation-rental | PARTLY: gives the cap statistic and a message, no cabins | Not as the head phrase: page 1 is listings | Full list; is the phrase above KP threshold; is GSC showing any impressions for it already |
| A2 | cabins that allow 3 dogs Blue Ridge Georgia | TRANS (seen: Airbnb, Explore Georgia, Expedia, Vrbo, Trip.com) | /guides/how-many-dogs... or /stays (filter) | NO: no list of stays that state three | Possibly, if a verified shortlist exists (Shiny Apple Cabins appears for it, so the demand has a supplier) | Same, plus whether any local page (not OTA) is in the top 10 |
| A3 | how many dogs are allowed at an Airbnb | INFO (seen earlier: Airbnb Help, Hepper, Apartment Therapy) | how-many-dogs guide | YES | Realistic once indexed (earlier SERP note); absent in top 30 in the old snapshot | GSC position by query and page after deploy |
| A4 | can I bring 3 dogs to a vacation rental | INFO/TRANS (not searched) | how-many-dogs guide | YES: third-dog message | Medium (hypothesis) | Same |
| A5 | pet fee for two dogs vacation rental | INFO (not searched; from the trend plan) | /guides/how-vacation-rental-pet-fees-work | YES: units and per-dog totals | Medium (host-side incumbents seen on the sibling "how much is a pet fee" query) | Same |
| A6 | dog friendly vacation rentals multiple dogs | TRANS (not searched) | /dogs/multi-dog-families (not read for this audit) | UNKNOWN | Unknown | Same, and a read of the /dogs page |

### Cluster B: Blue Ridge, Ellijay, Helen, Dahlonega and Smoky Mountain dog-friendly cabins

| # | Query | Probable intent | Best existing URL | Satisfies? | Winnable? | Cowork must collect |
|---|---|---|---|---|---|---|
| B1 | dog friendly cabins in Blue Ridge GA | TRANS (seen: Explore Georgia, Marriott, Airbnb, Vrbo, Expedia, Vacasa) | /destinations/georgia/blue-ridge | PARTLY: notes and a stays grid at the bottom | Head term owned by OTAs and a tourism board. Unlikely for a 9-day-old domain | GSC: do we have impressions; Trends vs "pet friendly cabins Gatlinburg" |
| B2 | dog friendly cabins Ellijay GA fenced yard | TRANS (seen: Expedia, Vrbo, Airbnb) | /destinations/georgia/ellijay | NO | Low | Same |
| B3 | pet friendly cabins Helen GA | TRANS (seen: Airbnb, Vrbo, Expedia, Vacasa, Explore Georgia) | /destinations/georgia/helen | NO | Low | Same |
| B4 | dog friendly cabins Dahlonega GA | TRANS (seen: Airbnb, Expedia, Vrbo) | /destinations/georgia/dahlonega | NO | Low | Same |
| B5 | pet friendly cabins Gatlinburg Pigeon Forge | TRANS (seen: operator page, Airbnb, Expedia, Marriott, Vacasa, AAA) | draft smoky-mountain guide (404 today) | NO (unpublished) | Low as a head term; medium as "what to check" phrasing (hypothesis) | Same; confirm the draft's 4-manager data recheck (trend plan) |
| B6 | dog friendly things to do in Blue Ridge GA | INFO/local (seen earlier: BringFido, Explore Georgia, local rental companies) | /destinations/georgia/blue-ridge/things-to-do | YES | Competitive (directories), medium for smaller towns (Ellijay, Dahlonega) as a hypothesis | GSC impressions per town page; index status (Blue Ridge page was "Discovered, not indexed") |
| B7 | dog friendly cabins georgia state parks | INFO/TRANS (not searched) | /guides/dogs-in-georgia-state-park-cabins | YES | Medium (official source dominates, but we add the request message) | Same |

### Cluster C: no-pet-fee rentals

| # | Query | Probable intent | Best existing URL | Satisfies? | Winnable? | Cowork must collect |
|---|---|---|---|---|---|---|
| C1 | no pet fee vacation rentals | TRANS/COMM (seen: Vacasa, Twiddy, AARP, Houfy) | /guides/vacation-rentals-with-no-pet-fee | PARTLY (names 3 managers, gives no homes) | Already reported #1 in the old snapshot; defend it | Current position and CTR; does a booking-intent click bounce |
| C2 | vacation rentals that don't charge pet fees | INFO/TRANS (not searched) | same | PARTLY | Likely a sibling of C1 | Same |
| C3 | cabins with no pet fee Georgia | TRANS (seen: Airbnb titles with "No Pet Fee", Sliding Rock) | /stays (noFee filter) | NO (2 of 83 stay files state a $0 fee) | Low | Same |
| C4 | no pet fee airbnb | INFO/TRANS (not searched; guide FAQ covers the filter question) | same guide | PARTLY | Medium | Same |
| C5 | does no pet fee mean the dog is free | INFO (not searched) | same guide | YES | Medium; long-tail | Same |

### Cluster D: fenced-yard and large-dog accommodation

| # | Query | Probable intent | Best existing URL | Satisfies? | Winnable? | Cowork must collect |
|---|---|---|---|---|---|---|
| D1 | vacation rentals large dogs no weight limit | TRANS/COMM (seen: Vacasa only) | /guides/vacation-rentals-that-welcome-large-dogs | PARTLY: names the two managers that state none, no homes | The SERP is one operator, but the phrase shows a booking need; our unique angle is the wording table. Medium (hypothesis) | KP range; GSC impressions; whether Vacasa pages actually answer the weight-limit question |
| D2 | large dog friendly cabins Georgia | TRANS (seen: Explore Georgia, Sliding Rock, Airbnb, Vrbo, Expedia, Marriott) | same or /stays (large filter) | NO | Low | Same |
| D3 | how to find a vacation rental with a fenced yard | INFO (seen: AvantStay, AFAR, AARP, Vacasa, Booking.com, Airbnb Community, Twiddy blog) | /guides/vacation-rental-secure-fenced-yard | YES | Realistic (tip lists from brands; our evidence pack is distinct) | Same |
| D4 | cabins with fenced yard for dogs Blue Ridge | TRANS (seen: listings) | /destinations/georgia/blue-ridge | NO | Low | Same |
| D5 | is a fenced yard really secure for my dog at a rental | INFO (not searched) | fenced-yard guide | YES | Medium; long-tail | Same |
| D6 | pet friendly rentals no breed restrictions | TRANS (not searched) | none: the breed guide is a draft (404) | NO | Unknown | Same |

### Cluster E: cabin and road-trip dog packing

| # | Query | Probable intent | Best existing URL | Satisfies? | Winnable? | Cowork must collect |
|---|---|---|---|---|---|---|
| E1 | dog friendly cabin packing list | INFO (seen: Unyoked, Chewy, Eagle Creek, KOA, Wag) | /guides/dog-friendly-cabin-packing-list | YES | Hard (brand publishers). The planner is our edge | GSC position; Trends seasonality |
| E2 | what to bring to a cabin with a dog | INFO (not searched) | same | YES | Medium | Same |
| E3 | dog road trip packing list | INFO (seen: Kayak, Orvis, Petco, PetSmart, Dogster, PureWow) | /tools/packing-list, packing guide | PARTLY (cabin-focused) | Hard | Same |
| E4 | dog travel checklist printable | INFO/tool (not searched) | /tools/packing-list | YES | Medium | Same |
| E5 | dog travel first aid kit | INFO/COMM (not searched) | /guides/dog-travel-first-aid-kit-guide | YES | Hard (vet and brand pages) | Same |
| E6 | winter cabin trip dog gear | INFO/COMM (not searched) | /guides/cold-weather-dog-gear-for-winter-cabin-trips | YES | Seasonal; medium | Same, plus a Nov to Feb Trends window |

### Cluster F: pet fee, dog limit and booking policy questions

| # | Query | Probable intent | Best existing URL | Satisfies? | Winnable? | Cowork must collect |
|---|---|---|---|---|---|---|
| F1 | airbnb pet fee | INFO (Keyword Planner about 100 to 1K a month) | /guides/how-vacation-rental-pet-fees-work | PARTLY: the guide covers it under "Airbnb and Vrbo", the title does not say Airbnb | Competitive (Airbnb Help, host blogs) | Current position; KP range; compare with "vacation rental pet fee" |
| F2 | how much is a pet fee at vacation rentals per dog | INFO (seen: Hostaway, Uplisting, Lodgify, Airbnb Community) | same | YES | Realistic (guest-side data is a gap) | Same |
| F3 | per night per dog pet fee | INFO (about #9 in the old snapshot) | same | YES | Already page 1 | Same |
| F4 | pet deposit vs pet fee vacation rental | INFO (seen: mostly long-term lease sources; one Lodgify) | same | YES (section "fee, deposit and hold") | Medium | Same |
| F5 | what happens if you bring a dog to a no pets rental | INFO (about #2) | /guides/bringing-a-dog-to-a-no-pets-rental | YES | Defend | Same |
| F6 | can you sneak a dog into an airbnb | INFO (seen: BiggerPockets, Airbnb help, Airbnb Community, Bored Panda, Guesty; absent in top 30) | same | PARTLY: the content fits, the wording does not | Medium; forum-dominated, so a calm factual page may stand out (hypothesis); avoid a title that implies advice to sneak | Same |
| F7 | airbnb charged me for pet damage after checkout | INFO (support; seen earlier: Airbnb Community, Airbnb help) | /guides/airbnb-pet-damage-charge-after-checkout | YES | Primary source dominates; our scripts are the edge | Same |
| F8 | dog friendly vacation rental | TRANS/COMM head term (KP about 100 to 1K a month) | /stays | PARTLY | Avoid: OTAs | KP only |

Total: 38 rows (6 + 7 + 5 + 6 + 6 + 8; F8 is a deliberate head-term control). Cowork can drop two of A6, D6, E5, E6 if it must stay at 36.

## 5. Repositioning proposals (apply after the reader-first pass)

All wording is a proposal. Character counts were measured. Every proposal keeps the query promise on pages that already rank. "Touches" = exact fields and blocks.

### 5.1 /guides/vacation-rentals-with-no-pet-fee (DO NOT RETITLE)

- Title: keep "Vacation Rentals With No Pet Fee: 3 of 38 Managers" (50). H1 keep.
- Description (optional, test): "Only 3 of 38 managers we read say dogs stay free. See who they are, what else they charge, and what to ask before you book." (123 characters, inside the 120 to 160 rule.) Purpose: promise "who" rather than "exact wording". Change only if the dek and opening still agree.
- First-screen element: a 3-row "Where to look" strip directly under the opening paragraph: manager name, region, one line ("No pet fees. Ever." and so on, quoting what the guide already quotes), and a button to that manager's own pet-friendly page (the URLs are already in the guide's sources). Then the existing line about cleaning and service fees. No new facts, no prices.
- Route: "Browse stays in our directory that list no pet fee" linking to /stays with the no-fee filter (only 2 of 83 stay files state $0, so show the count honestly: "we list two so far").
- Touches: body (insert after the opening paragraph, before "What should I ask the host?"), no frontmatter beyond the optional description. Collision risk: W3 already rewrote this guide; apply on top of its version.

### 5.2 /guides/vacation-rentals-that-welcome-large-dogs (worst mismatch)

- Title (seoTitle): "Large Dog Friendly Rentals: How Weight Limits Are Written" (57). Alternative: "Vacation Rentals for Large Dogs: Read the Weight Limit First" (60, at the limit).
- H1 (`title`): "Vacation Rentals for Large Dogs: What the Weight Limits Say" (to be length-checked at edit time; no limit on H1 length in tests beyond schema).
- Description: "6 of 38 managers state a dog weight limit and 2 say none. See their exact wording, find stays that list big dogs, then copy a message to ask." (141). Use only if the shortlist (below) ships; otherwise drop "find stays that list big dogs".
- First screen: replace the dek line "Not a rental list" with a two-part block: (a) "Two managers state no weight limit: Sliding Rock Cabins and Hapey Cabin Rentals" with links, (b) "Stays in our directory that list large dogs as OK" (3 Blue Ridge, 1 Ventura, 1 St Simons, 1 Tybee in the stay files; count again at edit time; each marked "listing says"). Then the weight-limit table as the "what to avoid" half.
- Route: /stays with the large-dog filter.
- Query-risk note: the query "vacation rentals large dogs no weight limit" was absent in the old snapshot, so there is no ranking to protect; the retired weight-limit URL redirects here, so keep "No Weight Limit" in the description even if the title changes.
- Touches: frontmatter (`title`, `seoTitle`, `seoDescription`, `dek`) and a block after the opening paragraph; the table stays.

### 5.3 /guides/how-many-dogs-can-you-bring-to-a-vacation-rental

- Title and H1: keep. Description: keep (152).
- First-screen element: after the opening paragraph, a 3-line block "Stays that state three or more dogs": 6 of 83 stay files state a limit of 3 or more (maxDogs of 3 or more: 1 Blue Ridge, 2 Ellijay, others elsewhere; recount at edit time), each linked to its stay page and labelled "listing says; confirm with the host".
- Route: /stays with the multi-dog filter. Optional: a one-line cross-link to /dogs/multi-dog-families.
- Option (SPLIT INTENT, decide after Cowork): a separate page "Cabins That Allow 2 or 3 Dogs: Limits and How to Ask" (52 chars) only if A1 or A2 show demand above the Keyword Planner floor and a verified stay list exists. Do not create it before; the trend plan already merged the multi-dog worksheet into this guide to avoid duplication.
- Touches: body block after the opening; frontmatter unchanged. W4 merged the worksheet here: apply on top.

### 5.4 /guides/vacation-rental-secure-fenced-yard

- Title, H1, description: keep (they match the INFO query).
- Route only: one sentence in "What to ask for before you pay": "Want stays that list a fully fenced yard? Filter our directory" linking /stays with the fenced filter (10 of 83 stay files say full fence).
- Touches: one sentence in the body. Collision risk is high with the reader-first trims, which re-order sections: apply the single sentence last.

### 5.5 /guides/how-vacation-rental-pet-fees-work

- Keep title. Test (needs Cowork F1 evidence): "Airbnb and Vacation Rental Pet Fees: Per Night or Stay?" (55). Only change if "airbnb pet fee" shows the bigger demand and the page already ranks for "per night" terms (do not lose the "Per Night or Per Stay" phrase).
- Touches: `seoTitle` only.

### 5.6 Destination pages

Proposals for Blue Ridge, Ellijay, Helen, Dahlonega (route heads in src/routes/destinations.$state.$town.tsx and a new block):

| Page | Proposed seoTitle | Proposed H1 | Proposed description (length) |
|---|---|---|---|
| Blue Ridge | "Dog-Friendly Cabins in Blue Ridge, GA: What to Check" (52) | "Dog-friendly cabins and things to do in Blue Ridge" | "Blue Ridge cabins and dogs: the dog limit, pet fee and fenced-yard details we could read, what to ask the host, and where dogs can go in town." (142) |
| Ellijay | "Dog-Friendly Cabins in Ellijay, GA: What to Check" (49) | "Dog-friendly cabins and things to do near Ellijay" | to be written at edit time to 120 to 160 |
| Helen | "Dog-Friendly Cabins in Helen, GA: What to Check" (47) | same pattern | same |
| Dahlonega | "Dog-Friendly Cabins in Dahlonega, GA: What to Check" (51) | same pattern | same |
| /destinations/georgia | "Dog-Friendly North Georgia Cabins: Towns and Pet Rules" (54) | keep the existing atmospheric H1 | "Fee, dog limit and fenced-yard details we could read for stays near Blue Ridge, Ellijay, Helen and Dahlonega, plus the pet rules to check before you book." (154) |
| /destinations | "Dog-Friendly Georgia and California: Towns and Rules" (52) | "Dog-friendly Georgia and California" | write at edit time |

- First-screen element (Blue Ridge first, then Ellijay and Dahlonega; skip Helen until data supports it): a "Stays near Blue Ridge" shortlist of up to 5 cards ABOVE "Dog-friendly things to do", chosen by a stated rule (not "best"): stays whose files state the dog limit and fence status, each with "dog limit / pet fee / fence" and the label "listing says; not verified by us". Keep the existing "Stays in Blue Ridge" grid; the shortlist is the same cards, moved up, so no new content has to be created.
- Honesty constraint: the stay files are all `unverified` and carry affiliate links (Vrbo-derived); the page already has the disclosure. The shortlist must say what is unconfirmed instead of filling blanks.
- Route: "See all N stays in Blue Ridge" to /stays with state and town set (the link already exists in the planning box); add a "What to check before you book" anchor link from the shortlist.
- Touches: src/routes/destinations.$state.$town.tsx (head and component order), src/content/destinations.ts only if the headlines change. Not guide files, so no collision with the reader-first pass, but the town pages are `noindex` when a town has no indexable stays and thin text (Mendocino and Monterey): do not change their indexing.

### 5.5b /stays

- Title proposal: "Dog-Friendly Cabins and Rentals: Pet Fee and Dog Limit" (54). Description (147): "Dog-friendly cabins and beach houses with pet fee, dog limit, weight limit and fenced yard shown for each. Anything we could not confirm is marked."
- First screen: five entry chips above the cards that set the existing filters (fully fenced yard, 3 or more dogs, no pet fee, large dogs, mountain or beach) and a one-line explanation of "Not yet verified". No claim of ranking.
- Touches: src/routes/stays.index.tsx head and header. Filtered views stay noindex.

### 5.7 Pages to LEAVE

Fees guide (apart from the optional title test), damage-charge guide, packing guide, state-park cabins guide, checklist, no-pets guide, dataset page, packing planner, /gear and trip collections, all eight things-to-do pages, California town pages.

## 6. Clusters most likely winnable by a young domain with original data (hypotheses)

Reasoning rule I used: a young domain can win where (a) the result types on page 1 are guides, forums or host blogs rather than inventory, (b) our dataset or our verification method adds something no incumbent has, and (c) the page already matches the phrasing. All of this stays PROVISIONAL until Cowork's evidence.

| Rank | Cluster | Why it might be winnable | Why it might not | Pages |
|---|---|---|---|---|
| 1 | Fee units and totals (F2, F3, F4, A5) | Page-1 incumbents are host-side vendor blogs; ours is guest-side with 38 pages of data; already about #9 for "per night per dog" | "airbnb pet fee" has Airbnb's own help pages | fees guide |
| 2 | Defend no-pet-fee (C1, C5) | Already reported #1; SERP is thin on true no-fee content | Booking intent bounces; only 3 managers | no-pet-fee guide |
| 3 | No-pets consequences and asking for an exception (F5, F6) | Already about #2; forums are the competition | Anecdote-driven; tone care | no-pets guide |
| 4 | Dog-count questions (A3, A4) | Dataset: 22 of 38 cap at two; third-dog message is rare | Airbnb Help owns the platform answer | how-many-dogs guide |
| 5 | Fenced-yard verification (D3, D5) | Brand tip lists; our evidence pack is distinct | Brands have authority | fenced-yard guide |
| 6 | Large-dog weight-limit wording (D1) | One operator on page 1 (Vacasa); a wording table is unique | Searchers want homes | large-dogs guide (after repositioning) |
| 7 | Damage charge after checkout (F7) | Scripts and clocks; support queries | Airbnb's own pages | damage guide |
| 8 | Dataset / research angle ("vacation rental pet policy data", link-earning) | Only independent dated dataset found in earlier SERP checks | Not a booking query; value is links, not clicks | /data/pet-policies |
| 9 | Small-town things to do (B6 for Ellijay, Dahlonega) | Directories cover Blue Ridge; smaller towns may be thinner | Unknown volume; pages are young | things-to-do pages |
| 10 | Conditional: three-dog North Georgia cabin shortlist (A2, D4, C3) | A named supplier (Shiny Apple Cabins) shows real demand and a verified shortlist could be original | Needs verified stays; OTAs rank; affiliate trust risk | new page only after Cowork evidence |

**Avoid (hypotheses):** "dog friendly cabins in Blue Ridge GA", "pet friendly cabins Helen/Dahlonega/Gatlinburg" head terms (page 1 is Airbnb, Vrbo, Expedia, Marriott, Vacasa, Explore Georgia); "dog friendly vacation rental" (F8) and "pet friendly vacation rentals" (Vacasa); California beach-town rental queries (heavy OTA competition and thin stay data, 1 to 5 files per town); packing-list head terms (Chewy, Orvis, Petco, Eagle Creek); crash-tested harness and two-large-dogs car gear (publisher and primary-source incumbents, per the SEO root cause doc).

## 7. How this ties into the other research

- **Persona audits.** P2 (dog life-stage) and P3 (travel-style) already list gaps that line up with this audit: P3 asks "which stays take three dogs" and the site has no answer (the 4-dog Cherry Lake cabin exists in content/stays); that is the same gap as proposal 5.3. P2 notes no ground-floor or "no stairs" stay filter, which also belongs on the /stays entry chips (5.5b). The personas' search phrases are hypotheses and none arrives by search today.
- **Trend plan.** Article 2 (Smoky Mountain cabins) is a draft; title it as "what to check", not as inventory (section 2.1). Article 7 (multi-dog worksheet) was already merged into the how-many-dogs guide, so a cabins-that-allow-3-dogs page should stay a split-intent decision, not a default.
- **SEO root cause doc.** It already identified the "no pet fee" mismatch (SERP intent largely inventory) and the large-dog guide as "strong fit, competitive". This audit generalizes that into the destination pages and /stays.
- **Authority.** No page here will rank on a booking head term without links; the dataset page is the link-earning asset, so every route above points back to it.

## 8. Sequencing and file collision list

The reader-first pass is rewriting the openings of these same guides. Apply nothing before it finishes. Logs present when I wrote this: edit-log-W3 (fee, no-fee, damage guides), edit-log-W4 (how-many-dogs, no-pets, leave-alone, reactive, senior, puppy), edit-log-W5 (Christmas, NYE, cooling, loose dog, ramp, life jacket). The large-dogs, fenced-yard and packing-list guides were not in any log yet; check for an edit log before touching them.

| Proposal | Files | Fields or blocks touched | Collision risk with reader-first pass |
|---|---|---|---|
| 5.1 no-pet-fee strip | content/guides/vacation-rentals-with-no-pet-fee.md | body insert after opening; optional seoDescription | W3 done: apply on top |
| 5.2 large-dogs | src/content/guides/vacation-rentals-that-welcome-large-dogs.ts | title, seoTitle, seoDescription, dek, body block after opening | HIGH if the guide is still being trimmed (audit-B target: trim; opening may change). Check for an edit log first |
| 5.3 how-many-dogs | content/guides/how-many-dogs-can-you-bring-to-a-vacation-rental.md | body block after opening | W4 done: apply on top |
| 5.4 fenced yard | src/content/guides/vacation-rental-secure-fenced-yard.ts | one sentence | HIGH while trims run; apply last |
| 5.5 fees guide | content/guides/how-vacation-rental-pet-fees-work.md | seoTitle (optional) | W3 done; wait for Cowork evidence |
| 5.6 destination pages | src/routes/destinations.$state.$town.tsx, destinations.$state.index.tsx, destinations.index.tsx, src/content/destinations.ts | heads, component order, headlines | None with guide editors; check tests that assert the titles (src/test) before editing |
| 5.5b /stays | src/routes/stays.index.tsx, src/lib/stay-search.ts (no change needed) | head, header chips | None |

Tests to run after any edit: content.test.ts (description 120 to 160, title at most 60, no links in tables), internal-guide-links.test.ts, and any test that asserts destination titles.

## 9. One-page summary

**Worst intent mismatches (ranked, hypotheses):**
1. /guides/vacation-rentals-that-welcome-large-dogs: "Options" in the H1 and "Large Dog Friendly Vacation Rentals" in the title promise a list; the dek says "not a rental list". TRANS searchers see no homes.
2. /destinations/georgia/blue-ridge (and Ellijay, Helen, Dahlonega): the booking query "dog friendly cabins in Blue Ridge" meets a "planning notes" title and a stays grid at the bottom.
3. /destinations/georgia and /destinations: atmospheric H1 and "trip planning" title; description cut mid-sentence on the state page.
4. /guides/how-many-dogs: right for its INFO query, but the sibling cabin queries ("cabins that allow 2 or 3 dogs") find no stay list.
5. /guides/vacation-rentals-with-no-pet-fee: ranks, but no route to homes (0 links to /stays). Add, do not retitle.
6. /stays: honest title but no entry points for the common asks.

**Proposed fix per page:** large-dogs RETITLE plus shortlist plus /stays route; Blue Ridge, Ellijay, Dahlonega RETITLE plus shortlist above the fold; Georgia and /destinations RETITLE; how-many-dogs ADD a 3-dog stays block plus route; no-pet-fee ADD a "Where to look" strip plus route; /stays ADD chips; fenced-yard, fees, damage, packing, state-park, checklist, no-pets, dataset, planner, gear, things-to-do pages: LEAVE (one route link at most).

**Priority clusters (hypotheses):** fee units and totals; defend no-pet-fee; no-pets consequences; dog-count questions; fenced-yard verification; large-dog limit wording; damage charge; the dataset as research asset; small-town things-to-do; a conditional three-dog North Georgia shortlist.

**Risks:** (1) every ranking figure is from an older build and a 9-day-old domain; (2) a shortlist of unverified, affiliate-linked stays can damage trust if it implies endorsement: it needs the "listing says, not verified" label; (3) changing titles on pages that rank (no-pet-fee, no-pets, fees) could lose the ranking: do not; (4) over-promising "cabins" on town pages thinner than the claim (Helen 4 stay files, none fenced); (5) the state and town pages' indexing depends on listed stays, which depend on affiliate links, so a shortlist may change what is indexable; (6) the guide edits collide with the reader-first pass if applied early.

**What Cowork must confirm:**
1. For each seed query: GSC impressions, position, clicks and page; any query that triggered the new build vs the old.
2. Google Trends relative interest for A1, B1, C1, D1, F1 against one benchmark, labelled relative.
3. Keyword Planner ranges for the head terms; "no data" for long-tail is a valid result.
4. A private-window top-10 snapshot (result types) for B1, D1, A2, C1, F6 to confirm the TRANS reading.
5. Whether the town pages, the /stays page and the Blue Ridge things-to-do page are indexed after the deploy.
6. Whether Vacasa pages for D1 actually answer the weight-limit question (they were the only result type seen).
7. Whether the three-dog Shiny Apple Cabins listing facts (up to 3 dogs, fenced yard, no pet fee) match the manager's own pages before any shortlist uses them.

**What I could not verify:** actual rank order (WebSearch returns result sets), autocomplete and PAA, search volume, difficulty, Trends, Search Console after the final build, live-page rendering of the new build (read from source), which stay files are listed after the affiliate gate (counts above are stay FILES: 83 total, 78 listed and 23 indexable per the SEO doc; town counts are files), page-1 content depth of each competitor, persona audit P1 and P4 (not present), and whether the large-dogs, fenced-yard and packing-list guides have already been edited by a worker whose log was not yet committed.

## 10. Part 2 (Cowork evidence): not yet written

To be added when Cowork returns: per-query GSC, Trends and Keyword Planner results for the seed queries in section 4, an update of the winnable and avoid lists, and a go/no-go for each proposal in section 5.
