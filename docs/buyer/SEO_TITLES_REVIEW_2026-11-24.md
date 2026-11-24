# SEO titles and snippets review, 2026-11-24

Read from the built HTML. Limits: title 60 characters or fewer (the brand suffix " | Paws & Passage" is added only when the total fits, otherwise it is dropped), description 120 to 155. No rankings or traffic are claimed. The 38-manager figures come from `src/content/manager-policies.ts` (read 2026-11-18).

## Pages whose head we own (applied)

### Home
- Before: `Paws & Passage: Dog-Friendly Stays, Travel Guides & Gear` (56). Description: "Dog-friendly stays, researched travel guides and gear picks: fenced yards, large dogs, extra dogs, real pet fees and what to pack for the trip." (143)
- Applied: title kept (brand-led home title, fits). Description: "Plan a trip with your dog: dog-friendly stays, what 38 rental managers' pet pages really say about fees and limits, and travel gear." (132). The count is read from the dataset, so it cannot drift. No verification claim.
- Alternative not applied: a benefit-led title such as "Dog-Friendly Rentals, Pet Fees and Gear Guides". It drops the brand from the home page, which is the one page where it should lead.
- H1 "Their favorite getaway starts here." is brand copy and left alone.

### /gear
- Before title: `Dog Travel Gear for Road Trips and Cabins | Paws & Passage` (58), kept. Before description said "with the maker's details and sources", which is process, not benefit.
- Applied description: "Dog travel essentials for road trips, cabin stays and trail days: car safety, feeding, cooling and cleanup gear, picked by trip, category or dog." (145). It names no price, test or store claim.
- Trip views (`?trip=...`) are noindex, nofollow with canonical `/gear`, and are not in the sitemap (checked on the build).

### /data/pet-policies
- Before: `What 38 rental managers say about dogs | Paws & Passage` (55); description "Pet policy data from 38 rental managers' own pages: dog limits, weight limits, breed rules and pet fees, with a source link for each and a CSV." (143)
- Applied title: `Dog Policies at 38 Rental Managers: Fees and Limits` (51, brand dropped because it would exceed 60).
- Applied description: "We read 38 vacation rental managers' own pet pages: 3 charge no pet fee, 6 state a weight limit. Every row has a source link, plus a CSV." (137). The 3 and 6 are computed from the dataset.
- H1 kept: "What 38 vacation rental managers say about dogs". It is a different, plainer phrasing from the title, which is fine.
- Also applied: "Guides that use this data" section linking all five guides and the will-my-dog-be-accepted tool; Dataset JSON-LD now has an absolute `url` and absolute CSV `contentUrl`, and a BreadcrumbList was added.

## Guide pages (head lives in guide files; NOT applied, for the lead after the editorial pass)

Titles in guide front matter are `seoTitle`, descriptions `seoDescription`. The Article JSON-LD headline equals the visible H1 on every guide (checked), which is separate from `seoTitle`.

### how-vacation-rental-pet-fees-work
- Current title: `Vacation Rental Pet Fees: Per Night or Per Stay?` (48). Current description (141): "How vacation rental pet fees work: we read 38 managers, 25 state a fee, 3 charge $0 and 13 name no amount. See the units and price your trip."
- Alternative title: `Vacation Rental Pet Fees: What 38 Managers Charge` (49).
- Recommendation: keep the current title (it names the real question, per night or per stay). Description: swap the comma list for a semicolon to read cleanly: "How vacation rental pet fees work: we read 38 managers; 25 state a fee, 3 charge $0 and 13 name no amount. See the units and price your trip." (141)

### vacation-rentals-with-no-pet-fee
- Current title: `Vacation Rentals With No Pet Fee: 3 of 38 Managers` (50). Current description (148): "Only 3 of 38 managers we read say dogs stay free. See each one's exact wording, what else they charge, and how to compare the total before you book."
- Alternative title: `Vacation Rentals With No Pet Fee: Only 3 of 38 Found` (52).
- Recommendation: keep both. The statistic is the hook and is accurate to the dataset.

### vacation-rentals-that-welcome-large-dogs
- Current title: `Large Dog Friendly Vacation Rentals and No Weight Limit` (55). Current description (149): "We read 38 managers' pet pages: 6 state a dog weight limit and 2 say none. See the exact wording, then copy the message that gets a big dog approved."
- Alternative title: `Large Dog Rentals: 6 of 38 Managers Set a Weight Limit` (54).
- Recommendation: keep the current title for search intent (people type "large dog friendly vacation rentals"); keep the description. "copy the message that gets a big dog approved" is a promise: soften to "copy a message to ask about a big dog" if the editorial pass cannot support "gets approved" (approval is the manager's decision).

### dog-car-safety-harness-and-crate-guide
- Current title: `Crash-Tested Dog Harness or Crate: How to Check One` (51). Current description (147): "Dog car harness or crate: “crash tested” is not regulated. Check the CPS directory, match your dog's weight, skip extension tethers, see our picks."
- Alternative title: `Dog Car Harness or Crate: Check Crash Testing First` (51).
- Recommendation: keep the current title. Description: "Dog car harness or crate: “crash tested” is not regulated. Check the CPS directory, match your dog's weight and skip extension tethers. See our picks." (150). Keep "See our picks" only if the page still carries picks after the editorial pass.

## Page-level notes for the lead
- Category pages (`src/routes/gear.$category.tsx`, not ours): the title template `${c.name} for Dogs` produces "Car safety and restraints for Dogs", "Bowls, bottles and food storage for Dogs", "ID, GPS and first aid for Dogs" (sentence-case then a capital "Dogs"). Proposed: title `${c.name}: Dog Travel Gear` shortened per category, for example "Dog Car Safety Gear and Restraints", "Dog Bowls, Bottles and Food Storage", "Dog ID, GPS and First Aid". The description template lowercases the name ("picks for id, gps and first aid"): proposed "Researched picks for {name}, with the maker's own specs, sources and what we could not confirm." using the original-case name; add a `metaTitle` field to `src/content/gear-categories.ts` and use it in the route.
- Eleven non-key pages have descriptions under 120 characters (/tools 106, /contact 100, /privacy 80, /terms 76, /corrections 88, four Georgia towns 94 to 115, two California towns 92 and 114, all 11 gear categories 99 to 115). None is an error, but the gear categories and town pages are the ones worth lengthening.
