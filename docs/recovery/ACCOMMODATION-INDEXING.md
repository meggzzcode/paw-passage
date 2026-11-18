# Accommodation indexing, link check, filters and linking (WP3, 2026-11-18)

Status labels used here: DONE (on the branch, tested), BLOCKED (could not be checked), RECOMMENDED, NEEDS-YOU.
Nothing is deployed. All nine stays are still `status: unverified`: no host was contacted and no property was visited.

## 1. Indexing quality rule (DONE)

Where: `src/content/publish-rule.ts` (`stayIndexability`, `townIndexability`, `stateIndexability`, pure functions) wired through `src/lib/seo.ts` (`stayIsIndexable`, `townIsIndexable`, `stateIsIndexable`). The page `<head>` (noindex tag) and `src/lib/sitemap-entries.ts` call the same functions, and `src/test/stay-indexing.test.ts` asserts that for every stay, town and state the sitemap contains the URL exactly when the rule says indexable. Host verification is not required. Verification status no longer decides indexing; quality does. Samples are never indexed. Every stay stays listed and visible on the site either way (noindex pages are still reachable and filterable).

A stay page is indexable only when ALL of these hold:

1. Public record (verified or unverified, never sample).
2. A dog limit is stated (`maxDogs` not null).
3. At least one more pet-policy detail is known: weight limit, pet fee, fence information, or large-dog yes/no.
4. Sleeps, bedrooms and bathrooms are all stated.
5. A location note exists.
6. At least 5 of the 6 content sections hold something (the space, what is included, location, good to know, stay details, dog rules).
7. The description is at least 250 characters, does not just repeat the summary, and is not a near copy of another stay's description (four-word-phrase overlap below 0.6, so shared boilerplate like "We read this from the public listing" does not count as duplication).

Limit of the rule, stated plainly: code cannot prove a description was written by us, because we hold no copy of the listing text. "Not a copy of the listing" is an editorial rule (descriptions are paraphrased and say they come from the listing, with no pasted text) that the rule backs only with length, summary-repeat and cross-stay duplicate checks. Risk to weigh: these pages are rewrites of public listing data with affiliate buttons. If search engines treat them as thin affiliate content, the safe lever is raising `MIN_STAY_SECTIONS` or adding original material (our own location context, nearby dog-relevant notes sourced from official pages); the constants sit at the top of the rule.

Towns and states: a town page is indexable with at least 1 indexable stay in it, or with substantive own text (at least 3 planning notes and 350 characters including the blurb). A state page needs an intro of at least 200 characters and at least 1 indexable town. Anything else is noindex and out of the sitemap.

### Result for the nine current stays

| Stay | Decision | Why |
|---|---|---|
| 5-Star Cabin with Views and Hot Tub (Cherry Lake) | INDEXABLE | 2 dogs, 50 lb, partial fence listed; 2 bed / 2 bath / sleeps 5; all six sections. Pet fee not confirmed (allowed: the rule needs one other policy detail). |
| Cozy Romantic Cabin with a View and Hot Tub (Near Downtown) | INDEXABLE | 2 dogs, $95 per dog fee, conflicting 20 lb versus 30 lb limit recorded honestly; full size facts; six sections. |
| Romantic Cabin with Secluded Hot Tub (Cherry Log) | INDEXABLE | 1 dog, $50 per stay fee; 1 bed / 1 bath / sleeps 2; six sections. |
| Romantic Hideaway for Hikers (Cherry Log) | INDEXABLE | 2 dogs under 50 lb, adults only; full size facts; six sections. |
| Toccoa River Front Cabin with Hot Tub (Mineral Bluff) | INDEXABLE | 2 dogs, 20 lb, partial fence; 2 bed / 3 bath / sleeps 4; six sections. |
| Blue Ridge Downtown Stay (King Bed) | NOINDEX | Dog limit (1) known, but no weight limit, pet fee amount or fence information. Missing: any second pet-policy detail. |
| Mountain View Cabin (Hilltop Hideaway) | NOINDEX | Dog limit (2) known; no weight limit, fee or fence information. |
| The French Secret (Romantic Getaway) | NOINDEX | Dog limit (3 pets, dogs and cats) known; no weight limit, fee or fence information. |
| Creekside Cottage (Relax, Soak, Swim) | NOINDEX | Dog limit, 30 lb and "small dogs only" known, but bedrooms are missing (the listing record never stated a count). |

What would change a NOINDEX decision: for the three missing a policy detail, any one of weight limit, pet fee amount or fence status read from the listing or confirmed by the host; for Creekside, the bedroom count. I did not add these because they are facts that must come from the listing or the host, and I will not invent them. No YAML was changed.

### Town and state pages today

| Page | Decision | Why |
|---|---|---|
| /destinations/georgia | INDEXABLE | Intro long enough and Blue Ridge is indexable. |
| /destinations/georgia/blue-ridge | INDEXABLE | 2 indexable stays and 3 planning notes. |
| Ellijay, Helen, Dahlonega | NOINDEX | No stays; 2 planning notes, 276 to 288 characters (need 3 notes and 350). Needs one more original planning note each. |
| /destinations/california and its four towns (San Diego, Santa Barbara, Monterey, Mendocino) | NOINDEX | No stays; every town has 2 notes (244 to 311 characters), so no indexable town beneath the state page. Needs a third substantive planning note per town, or a stay. |

Consequence to know about: the California destination page was in the sitemap before; it now leaves it. Cherry Log, Mineral Bluff and McCaysville have stays but no town page in `destinations.ts`, so they have no town page to index.

The Stays directory (/stays, unfiltered) stays indexable once any stay is listed (its filter tool is the content). The AGENTS.md line saying unverified stays are noindexed and the directory waits for a verified stay is now out of date; update it when the lead merges (file not mine).

Structured data: the LodgingBusiness JSON-LD (petsAllowed) is emitted only for verified stays. Listing-based indexable pages get breadcrumb data only.

## 2. Vrbo deeplink check (BLOCKED)

One plain GET per link (`curl -sIL`, normal browser User-Agent, max 5 redirects, 3 s pauses). Every link returned the same: 301 from `vrbo.com/affiliate/<code>` to `www.vrbo.com/affiliate/<code>`, then HTTP 429 (rate limited or bot blocked). Per the instruction I did not retry or work around it. So I cannot say where any link ends up. The generic link `vrbo` (hdPLmiF) was not one of the nine and was not requested.

| affiliateId | Deeplink | Final status | Final URL | Result |
|---|---|---|---|---|
| vrbo-3016263 | vrbo.com/affiliate/OvDjmi2 | 429 | www.vrbo.com/affiliate/OvDjmi2 | BLOCKED |
| vrbo-3067945 | vrbo.com/affiliate/85WJUQc | 429 | www.vrbo.com/affiliate/85WJUQc | BLOCKED |
| vrbo-989362 | vrbo.com/affiliate/hj38sa6 | 429 | www.vrbo.com/affiliate/hj38sa6 | BLOCKED |
| vrbo-1056490 | vrbo.com/affiliate/dpJNgL9 | 429 | www.vrbo.com/affiliate/dpJNgL9 | BLOCKED |
| vrbo-5283109 | vrbo.com/affiliate/8PAjLc3 | 429 | www.vrbo.com/affiliate/8PAjLc3 | BLOCKED |
| vrbo-2839563 | vrbo.com/affiliate/ZZFfMMq | 429 | www.vrbo.com/affiliate/ZZFfMMq | BLOCKED |
| vrbo-3441964 | vrbo.com/affiliate/vjqhYf3 | 429 | www.vrbo.com/affiliate/vjqhYf3 | BLOCKED |
| vrbo-4929336 | vrbo.com/affiliate/kckCpcg | 429 | www.vrbo.com/affiliate/kckCpcg | BLOCKED |
| vrbo-4396826 | vrbo.com/affiliate/U0R4kX5 | 429 | www.vrbo.com/affiliate/U0R4kX5 | BLOCKED |

A 429 is not a broken link. NEEDS-YOU (optional, free): open each of the nine links once in your own browser (Chrome, while logged in or not), confirm each lands on the right property's Vrbo page, and note any that show an error. That also confirms the property matches the stay name.

Id match (DONE, tested in `stay-indexing.test.ts`): all nine stays have an `affiliateId` of `vrbo-<id>` equal to the listing id in their `sourceUrl`: 3016263, 3067945, 989362, 1056490, 5283109, 2839563, 3441964, 4929336, 4396826. Each has an approved entry in `content/affiliates.yml` with the form `https://vrbo.com/affiliate/<code>`. That the code points at that same property is exactly what the blocked check could not show.

## 3. Filter review (DONE)

Owner's list against `src/lib/filters.ts` and the Stays page:

| Owner item | Status |
|---|---|
| Number of dogs | Present (select 1 to 4+). Matches only a stated `maxDogs`. |
| Large dogs | Present ("Large dogs allowed", only `largeDogsOk === true`). |
| Weight restrictions | ADDED: "Weight limit" select (limit of 20, 30, 50 or 70 lb or more stated). Only a stated `weightLimitLbs` matches; no limit stated never matches. |
| Breed restrictions | Present ("No stated breed restrictions", only confirmed false). |
| Pet fees | Present ("No pet fee", only a confirmed 0). Fee amount is shown on cards and pages. |
| Fenced yards | Present (fully fenced only; partial fences deliberately do not match). |
| Beach access | Present. |
| Cabins | Present as Stay type (Cabin, Cottage, Vacation home, Beach house, Unique stay). |
| Multiple dogs | Present (2 or more stated). |
| Amenities | Present: hot tub, private outdoor space. ADDED: air conditioning, barbecue grill, on-site parking, matched only on text the listing gave; a missing mention is "not confirmed", never a no, and the labels say "(listed)". |

Also edited for this: `src/lib/stay-search.ts` (search params; not in my list but it is the schema the filters need). Tests check that unknown (null or absent) never passes any filter.

## 4. Vrbo and Expedia linking opportunities (RECOMMENDED, nothing added)

What the Expedia terms in `docs/AFFILIATE-AND-SELLING.md` allow (read from the program terms 2026-11-18; section numbers may change): use the Hub deeplink exactly as given (no edited parameters, no redirects or intermediate pages, 11.1.1, 16.2, 16.3); no Vrbo or Expedia prices next to other prices (11.3, 16.15.4); only coupon codes Expedia supplies (11.4); no brand marks in domain or meta tags (12.x), which our meta-brands test enforces; no commission figures in public (17.1, 20.4, 20.5); disclose cookies and pixels in the privacy policy (9.1.2). Links render as `rel="sponsored nofollow noopener"` with a sponsored note.

Where a deeplink could legitimately appear, subject to you generating the link in the Hub:

- Stay pages: already the main slot. Nine deeplinks exist and show as sponsored buttons, with plain listing links as fallback.
- A destination page ("Stays in Blue Ridge") already lists the stay cards, which carry the buttons. A Hub generic destination link (search results for Blue Ridge, Cherry Log, Mineral Bluff) could sit under "Plan it properly" on the town pages. This needs a new Hub link: NEEDS-YOU.
- Guides that already discuss rentals and could carry a contextual link: how-vacation-rental-pet-fees-work (already has an `aff:vrbo` link), vacation-rentals-with-no-pet-fee, vacation-rentals-with-no-dog-weight-limit, how-many-dogs-can-you-bring-to-a-vacation-rental, christmas-week-in-a-cabin-with-a-dog, new-years-eve-with-a-dog-in-a-vacation-rental. Only where the text names a rental search step. Guide files belong to others; use the existing `aff:` inline mechanism.
- Not appropriate: product pages, packing tools, or any page where a stay is implied that we have not listed. Never show Vrbo prices.

To add any of these: generate the link in the Expedia hub, add it to `content/affiliates.yml` as approved, then reference it by id. I added none.

## 5. Images (DONE, confirmed)

No listing photos appear: all nine stays have `photoPermission: false` and no `image` or `imageUpload`, so the stay page shows the "photos belong to the host" panel and the booking button. No stock or generated image appears for any real property (the town and state pages use destination photos that depict the area, not a property, and the stay cards carry none). Asserted by a test.

## 6. Wording sweep (DONE)

- Stay page footer line: "Last verified <date>" now shows only when status is verified and a date exists; otherwise "Details read from the listing, not confirmed with the host".
- Town and state pages said "No verified stays published here yet"; changed to "No stays are listed here yet" (stays of both kinds are listed).
- The "Not yet verified" label, the listing-based descriptions and the pet policy panel already used listing-based wording; a test checks no unverified stay text claims verification.
