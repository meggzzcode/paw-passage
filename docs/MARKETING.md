# Marketing plan

Public document. No premium text, no secrets. Everything here is a plan or a hypothesis unless marked otherwise. Nothing in this file is evidence of sales.

Research was done on 2026-11-26 from pages that could actually be read. Keyword volumes were not available and none are invented: "validated" below means the search results page and competitor structure show that the topic is actively published, not how many people search for it.

## 1. Competitor findings

Two direct competitors were read in full. Their claims are their own marketing, not verified sales or review evidence.

### The Original Doggy Date Bucket List Book (thedoggydatebucketlist.com/en-us)

- Promise: a steady stream of ideas so owners never run out; lasting memories; mental and physical enrichment; the dog as part of the family.
- Count: 50 scratch-off date ideas, plus bonus enrichment cards and recipe cards (counts not given).
- Preview: six product photos show the format (scratch-off, peel-off photo areas), none shows an actual idea.
- Price: a physical book listed at 48.00; shipping calculated at checkout; first-order discount for a mailing list signup. The page itself says recommendations are in AUD while showing USD, a small trust wobble.
- Gift: not positioned as a gift, speaks to existing "furry friend families".
- Differentiation: "original" status, enrichment angle, a donation to rescue dogs with every sale.
- Objections handled: how scratching works, do dates in any order, can be done anywhere.

### Doggo Unleashed (thepawfectadventure.com)

- Promise: memories, enrichment, activities for any size, breed or age, including dogs with disabilities; 50 "never-heard-before" adventures.
- Preview: none by design; hidden until scratched, sold as surprise.
- Price: heavy discounting language, a sale price shown higher than the regular price, a countdown at zero, and a "sold out" flag on the same page. Shipping text contradicts itself.
- Gift: labeled "Perfect Gift!".
- Social proof: claims a 4.8 rating from 153 reviews and large audience numbers. Some visible reviews mention slow shipping and an unanswered return. Treated as unverified.
- Objections: cost (most activities free or cheap), disability fit, shipping time, a 60-day money-back guarantee.
- Imagery: bright, playful, GIFs of rules, page photos, stickers.

### Baymard research (product listings, product images)

- Shoppers choose from list items using price, product type, thumbnail, and a few context attributes; Baymard reports half of benchmarked sites omit something important and recommends 1 to 3 category attributes per listing.
- Information hidden in tabs gets missed (21% overlooked it in one case); text overlaid on images or captions helps; keep text readable on mobile.

### Lessons for Paws & Passage

1. Competitors hide the content. We can show a real preview card with practical facts (time, cost, setting, effort, prerequisites) without revealing steps. This is the clearest difference and fits Baymard's "appropriateness and context attributes" advice.
2. They are physical, shipped books with shipping friction and currency confusion. We are instant, one-time, local-first. Say that plainly, without comparing prices.
3. Their price pages feel unreliable (contradictory sale prices, dead countdowns). Keep one honest price, no fake discounts, no urgency. Trust is the contrast.
4. Their "50 adventures" is a headline number. Ours is a library plus a free complete adventure and browseable previews. Do not copy their numbers. State only counts the API returns.
5. Disability and age inclusion is a selling point for them. Our hard eligibility and "dog may always opt out" make it a stronger, safer claim, but do not make medical claims.
6. Gift positioning is weak at the first competitor and generic at the second. See section 5.
7. Do not copy any competitor adventures, artwork or text. This plan and the pin art are original.

## 2. Themes: validated vs hypothesis

"VALIDATED" = the results page showed several independent publishers with dedicated pages for the theme (so the topic is clearly actively served). It is not a volume claim. "HYPOTHESIS" = the results were thin, mixed with product pages, or the query was not directly matched.

| Theme                                                     | Status                  | Evidence seen                                                                                                                                                                      |
| --------------------------------------------------------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| things to do with your dog                                | VALIDATED               | Results from Chewy, Best Friends, Care.com, Dogster, Hepper, WebMD, AOL: lists of roughly 20 to 100 ideas.                                                                         |
| fun things to do with your dog at home / indoor rainy day | VALIDATED               | Dogster, Rover, iHeartDogs, Kinship, AKC, Tractive, Great Pet Care all have dedicated rainy-day and indoor pages.                                                                  |
| doggy date ideas                                          | VALIDATED               | Chewy, AKC, Rover, KONG, PetsRadar, Wag, iHeartDogs and others; many tie to Valentine's. One result claims February 3 is a "doggy date night" (from a snippet, unverified).        |
| dog bucket list                                           | VALIDATED               | Dogster, Care.com, Hepper, Wag, VCA, Chewy, Native Pet, Gingr, AKC (senior list).                                                                                                  |
| senior dog activities / limited mobility                  | VALIDATED               | AKC, Cornell, PetMD, Chewy, PDSA, Dog Aging Project; common message: low impact, vet guidance.                                                                                     |
| weekend dog adventures                                    | VALIDATED (partial)     | Mostly day-trip and "near me" results (Dogster, National Geographic, a "Weekend Dog Adventures: 25 Activities" page). Local intent is hard for us; the guided finder is the angle. |
| puppy bucket list                                         | HYPOTHESIS              | Results were mostly general or senior lists; puppy-specific coverage looked thin. This could be a gap or low demand. Test.                                                         |
| free dog activities                                       | HYPOTHESIS              | The combined query returned indoor-idea lists, no dedicated "free" pages seen. Test as a pin and page angle.                                                                       |
| activities for quiet dogs                                 | HYPOTHESIS              | Results were general indoor and enrichment pages. Phrase may be rare; "calm", "low energy" are alternatives.                                                                       |
| creative things to do with your dog                       | HYPOTHESIS              | Creative ideas (painting, photos) appear inside general lists only.                                                                                                                |
| dog birthday activities                                   | HYPOTHESIS              | Combined search returned recipes and keepsake products, not activity pages.                                                                                                        |
| dog Christmas activities                                  | HYPOTHESIS              | Results were gift guides, not activities. A gifting angle may beat an activity angle.                                                                                              |
| personalized dog keepsakes                                | HYPOTHESIS (commercial) | Retailer product pages dominate (ornaments, cards, books); that is buyer intent but a crowded product SERP. Our keepsake is a by-product of an adventure, not a physical item.     |

Autocomplete and related-search widgets were not readable in this environment. Before investing in any page, check Google Search Console impressions (free) once the site is live.

## 3. First seven landing pages

Owner directive (2026-11-26): no separate thin pages for near-identical keywords. The article answers the question; the collection page shows the offering. One broad hub remains, and the topic pages live in The Adventure Journal.

| Path                        | Target intent                       | Page job                                                                                 | Linked collections                        |
| --------------------------- | ----------------------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------- |
| /things-to-do-with-your-dog | Broad: "things to do with your dog" | Short hub: routes to the ten Journal articles and the collections, a handful of previews | the-curious-explorer, five-minute-wonders |

The former landing pages (/indoor-dog-adventures, /doggy-date-ideas, /puppy-bucket-list, /senior-dog-adventures, /free-things-to-do-with-your-dog, /weekend-adventure-finder) were removed and 301 to the matching `/journal/<slug>` article (see `netlify.toml`). They were never indexed, so the redirects are hygiene only.

Pins point to the hub, a Journal article or /discover. Birthday and keepsake pins point to /things-to-do-with-your-dog or /discover until dedicated pages earn their place.

## 4. Seasonal calendar

Uses existing collections only. Never use a deadline, countdown or "limited time" wording; the product is always available and the price is constant. Seasons are themes, not events with end dates.

| Month                | Theme                       | Collections                                                                         | Pin and page focus                                          |
| -------------------- | --------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------------- |
| January              | A year of adventures        | seasons-together, the-curious-explorer                                              | "Start a year of little adventures", passport pins          |
| February             | Valentine, doggy date       | doggy-date-club                                                                     | Date pins, /journal/doggy-date-ideas                        |
| March to May         | Spring outdoors             | the-great-outdoors, city-explorers                                                  | Weekend and trail pins                                      |
| June to August       | Summer comfort and vacation | beach-days-and-waterside, road-trip-adventures, camping-companions, home-sweet-home | Heat-aware and indoor-cool framing; travel postcard pins    |
| September to October | Autumn harvest              | taste-and-treat, seasons-together                                                   | Cozy and neighborhood pins                                  |
| November             | Gratitude and memory        | our-story, the-golden-years, rescue-and-new-beginnings                              | Keepsake, older dog and adoption-anniversary pins           |
| December             | Holiday and gifting         | holidays-and-celebrations, little-splurges                                          | Gift-angle pins (see section 5); keepsake and passport pins |

## 5. Pinterest routine (owner-operable, about 30 minutes per week, no paid scheduler)

Pinterest's own tools (free) are enough. Pins are made by the generator in /home/user/premium-content/export/pins/ (never in the repo).

1. Monday, 5 minutes: open marketing/pins/pins.json, pick the 5 next unposted pins (rotate themes, favor the current season from section 4). Note the ones posted in marketing/pins/posted.log (create locally if wanted, do not commit).
2. 15 minutes: on Pinterest, create each pin: upload the PNG, paste the `title` and `description` from pins.json, set the link to your site plus the `destination` path. Use a board per theme. Pinterest's native scheduling for a business account can spread the five across the week at no cost (check the current Pinterest interface; this was not verified here).
3. 5 minutes: check Pinterest analytics for outbound clicks per pin; record the top and bottom pin id.
4. 5 minutes: once a month, retire the bottom third of pins and render variants (change a headline in pins.json and run the generator).

Rules: no hashtags, no suggested customer captions, no fake scarcity, no claim that restricted content is free, no premium text. Link to a destination page that exists. Do not claim traffic or sales results from a few pins; judge by outbound clicks over at least a few weeks.

## 6. Gift marketing evaluation

- Checkout provider is Gumroad (see docs/OPERATIONS.md). Search results indicated that Gumroad's help center has an article titled "How do I give a product as a gift" and describe a "Give as a gift" toggle at checkout, limited to one product in a cart. The article body could not be fetched, so details (recipient notification, license code delivery, fit with our license verification) are **UNVERIFIED**.
- Not a launch blocker. Before putting gift wording on any page, the owner should open Gumroad's help article, run one test purchase as a gift, and confirm the recipient receives a working code and that our unlock flow accepts it.
- Until verified: say nothing about gifting on site pages. December pins may use keepsake and passport themes without promising a gift flow.

## 7. Commercial hypotheses and test plan

None of these are results. All are hypotheses until measured.

Primary metric: net revenue per qualified visitor (revenue after refunds and fees, divided by visitors who viewed a preview or started the finder). Secondary: intro_started rate, preview_viewed rate, purchase_cta_clicked rate, checkout_started to purchase.

Rules: change one thing at a time; run each test for a fixed period decided in advance; do not read results from tiny samples (a few dozen visitors says nothing); log the date of each change in docs/DECISIONS.md.

| Order | Test                  | Variants                           | Why it might matter                                                                                       |
| ----- | --------------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------- |
| 1     | Preview count         | about 30 vs about 50 vs more       | More previews may build confidence or add noise.                                                          |
| 2     | Teaser style          | plain facts vs mystery-style title | Does teaser copy change preview clicks?                                                                   |
| 3     | Entry path            | finder-first vs browse-first       | Intro pool vs browse.                                                                                     |
| 4     | Second free adventure | one vs two free                    | Costs revenue potential vs builds trust. Hardest to reverse; test later.                                  |
| 5     | Price                 | $14.99 vs $19.99                   | Only with enough volume; 19.99 is the current offer in src/config/site.ts. Never show a fake "was" price. |
| 6     | Headlines             | outcome vs curiosity               | Lowest risk, test early alongside anything else only if traffic is large enough to separate effects.      |

### Bottleneck diagnosis

| Symptom                             | Likely bottleneck              | First thing to check                            |
| ----------------------------------- | ------------------------------ | ----------------------------------------------- |
| Few visitors                        | Traffic (Pinterest, search)    | Pin outbound clicks, Search Console impressions |
| Visitors, few intro_started         | Landing page clarity           | Headline, first screen, finder visibility       |
| intro_started, few intro_completed  | Adventure quality or fit       | Eligibility, effort level, time shown           |
| Completed, few purchase_cta_clicked | Value after the free adventure | Unlock prompt placement, preview relevance      |
| CTA clicks, few checkout_started    | Price or trust at the CTA      | Price clarity, no dark patterns, refund wording |
| checkout_started, few purchases     | Checkout friction              | Provider flow, license code delivery            |
| Purchases, many refunds             | Expectation mismatch           | Preview honesty, what the library is            |

## 8. Pin assets

See marketing/README.md. 30 initial pins (1000 by 1500) across the directive themes are described in marketing/pins/pins.json; only generic ideas, no premium mechanics.

## 9. Journal pins

The Adventure Journal has ten articles. Each has three pins in marketing/pins/article-pins.json: a practical question or problem, an attractive lifestyle benefit, and a discovery message. Their destinations are the article pages (`/journal/<slug>`) with UTM parameters (`utm_source=pinterest&utm_medium=social&utm_campaign=<slug>-<n>`), so the site can attribute visits to one pin without storing personal data. Pin descriptions are plain prose with no hashtags, never suggest that paid content is free, make no health or behavior claims and reveal nothing about the paid adventures.

Render: `node marketing/pins/generate.mjs --set article` writes 30 PNGs (1000 by 1500) to /home/user/premium-content/export/pins/article/. They are never committed.

### Weekly routine for the owner (about 20 minutes, no paid scheduler)

1. Monday: choose 3 Journal pins, each from a different article, and favor the season or weather (rainy-day pins on wet weeks, weekend pins on Thursdays, doggy-date pins near Valentine's Day).
2. Upload each PNG on Pinterest, paste `title` and `description` from article-pins.json, and set the link to your site address plus the pin's `destination` exactly as written, UTM included.
3. Save each pin to a board named for the article theme (for example "Rainy day dog ideas"). Pinterest's own scheduling for business accounts can spread the three across the week at no cost.
4. Friday: look at outbound clicks per pin in Pinterest analytics and note the best and the weakest `utm_campaign` value.
5. Each month, retire the weakest pins and re-render a variant by editing the headline in article-pins.json. Keep each article's three angles in rotation, and judge results over several weeks, not days.

Keep a private local note of which pins were posted (do not commit it). The same rules as section 5 apply.
