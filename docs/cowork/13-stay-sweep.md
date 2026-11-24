# Cowork brief: the final stay sweep (Georgia and California, Vrbo)

Read this whole file first; it is self-contained. Written 2026-11-24 for the Paws & Passage site (https://www.pawsandpassage.com, repo meggzzcode/paw-passage). Goal: ONE large, final sweep that finds every eligible dog-friendly Vrbo whole-home rental in Georgia and California, so Claude can load them onto the site, grouped by town and by type, each with an affiliate deeplink. Do not repeat this sweep later; be thorough now.

## 0. Rules (apply to every step)
- Phase A uses public Vrbo pages only: do NOT sign in to Vrbo or anything else, do NOT book, reserve, request a quote, message a host, favourite, or enter any personal or payment detail. Phase B needs Megan's signed-in Expedia Group creator hub; before Phase B confirm the signed-in account is Megan's (name only); if it is not, or a login or 2FA screen appears, STOP that phase, mark NEEDS LOGIN and ask Megan to sign in. Never sign in for her, never read or repeat passwords or codes.
- Go slowly: at least 15 seconds between Vrbo page loads. If Vrbo shows HTTP 429, "Access denied", CAPTCHA, "verify you are human", a block or a login wall: STOP the sweep immediately, report where you stopped (town and listing), do not retry, do not work around it. Resume only when Megan says so. Stop after 3 blocks in a row.
- Never copy listing text word for word and never save or download photos (our rule: no listing photos). Paraphrase in your own words, short. Do not record prices, rates, ratings, review scores or review counts.
- Report results as text in the chat (a CSV block). Do NOT commit anything to GitHub.

## 1. What counts as ELIGIBLE (all must be true)
1. Located in Georgia or California, in one of the target towns below (or a clearly adjacent town you name).
2. A whole-home rental (house, cabin, cottage, condo, townhouse, chalet). Not a hotel room, private room, shared home, RV, tent, boat or resort room.
3. The listing's own policies say dogs/pets are allowed (read the "Policies" or pets section). "Pets allowed" with a stated rule, not a silent or unclear one.
4. The page states a dog limit (how many dogs or pets) AND at least ONE more pet detail: a weight limit, a pet fee (note it exists and how it is charged: per stay, per night, per dog; the amount is not needed), fence information, or whether large dogs are fine.
5. Sleeps, bedrooms and bathrooms are shown.
6. The page loads normally today (no "unavailable" or "no longer listed" notice).
7. Not already on our site (exclusion list in section 5).
Mark each candidate ELIGIBLE or REJECT, with a one-line reason for every reject (for example "no dog limit stated", "hotel room", "429 blocked").

## 2. Where to look (target towns; aim for completeness, not a fixed number)
Georgia: Blue Ridge, Cherry Log, Mineral Bluff, McCaysville, Ellijay, Helen, Sautee Nacoochee, Cleveland, Dahlonega, Hiawassee, Clayton and Rabun County, Tybee Island, Savannah, St. Simons Island, Jekyll Island, Amicalola Falls area.
California: Big Bear Lake, South Lake Tahoe, Truckee and Tahoe City, Mendocino, Fort Bragg, Little River and Albion, Santa Barbara, Ventura and Oxnard, San Diego (including Pacific Beach, La Jolla, Ocean Beach, Coronado), Monterey, Carmel and Pacific Grove, Pismo Beach, Morro Bay and Cambria, Santa Cruz, Palm Springs, Joshua Tree, Mammoth Lakes, Yosemite area (Mariposa, Oakhurst), Sonoma and Napa wine country.
Method: on Vrbo's public site search each town with the "Pets allowed" filter, open each result's listing page, apply the eligibility test. Cap: at most 25 ELIGIBLE per town and at most 300 overall; prefer listings whose pet policy is most complete (limit, weight, fee and fence all stated). Skip near-duplicate listings of the same property.

## 3. Phase A output: one CSV block per state
Columns, in this order (blank when not stated; never guess): listing_id, vrbo_url (https://www.vrbo.com/<id> only, no tracking), name (the listing title, trimmed), state (georgia or california), town (lowercase slug like blue-ridge), type (cabin, cottage, vacation-home, beach-house, condo, townhouse or chalet), sleeps, bedrooms, bathrooms, max_dogs, weight_limit_lbs, large_dogs_ok (yes/no/not-confirmed), pet_fee_basis (per-stay/per-night/per-dog/none/not-confirmed), fenced_yard (yes/partial/no/not-confirmed), fence_notes (short, paraphrased), private_outdoor (yes/no), hot_tub (yes/no), beach_nearby (true/false), mountain_setting (true/false), location_note (one sentence, your words), pet_rules (the dog rules in 1 to 3 short bullets, your words, separated by |), eligibility (ELIGIBLE/REJECT), reason, read_date. Give the REJECT rows in a separate short list (id, town, reason) so nothing is rechecked. After the CSVs give a summary: eligible and rejected counts per town and per type.
Stop and report after finishing each STATE, or sooner if blocked. Megan reviews the list before Phase B.

## 4. Phase B (only after Megan approves the ELIGIBLE list in the chat): deeplinks
In Megan's signed-in Expedia Group creator hub, use the same link tool that produced the existing deeplinks (see docs/cowork/06-vrbo-deeplinks.md for the earlier run) to create a deeplink for each approved listing. Copy each link EXACTLY as shown (no editing, shortening or added parameters). Report a table: listing_id, the exact deeplink (or "could not generate" and why), the listing title the hub showed, and anything the hub said about eligibility. Never change account settings; read-only except the link generator. If the hub refuses or throttles, stop and report.

## 5. Already on the site: do not re-research these listing IDs
1056490, 4242052, 3348768, 2295009, 3042489, 3067945, 1445930, 3320896, 4717796, 989362, 5283109, 2363171, 3106796, 3622396, 2908219, 3500343, 889523, 2357464, 3016263, 2193383, 1250124, 317612, 3495924, 4188412, 4396826, 2839563, 2827825, 3441964, 4195368, 4929336, 689968, 3869736
(5 further stays are held back because they have no Vrbo deeplink yet; ignore them.)

## 6. What Claude does after you report (for your information)
Claude loads each approved listing as a stay record (the site's stay format), wires the deeplink so the stay goes live, and builds the Stays section to show the full list grouped by state, then town, with filters by type (cabin, beach house, cottage, vacation home), hot tub, fenced yard and large-dog friendly. A stay is shown only when its deeplink is approved. Town pages appear when a town has enough stays. You do not need to do any of this.
