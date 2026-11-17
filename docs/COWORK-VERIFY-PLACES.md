# Verifying the dog-rules places (prompt for a browser-capable Claude)

Why this exists: the "Can my dog go here?" lookup (`/dog-rules`) lists a place only after someone has read the
official page and recorded the exact sentence. The 14 places in `content/places/` were seeded from our own
articles and are all `status: unverified`, so none is public. A place goes live only when ALL of these are filled
in and `status: verified`: `sourceUrl`, `sourceQuote`, `lastChecked` (see `placeIsPublic` in `src/content/publish-rule.ts`).

How to use it:

1. Open a Claude with a real browser (Cowork) and paste everything between the two lines of `=====` below.
2. It returns one table. Paste the table back to the lead, who copies each row into the matching YAML file.
   Do not set `status: verified` until a human has looked at any row marked `needs human` or with a conflict.
3. To refresh the place list after adding or changing files: `bun scripts/places-verification-sheet.ts --write`
   (or run it without `--write` to just print the list).

=====

You are checking dog rules for parks, trails and beaches against the OFFICIAL page for each place. You have a
browser. Work through the places listed at the bottom, one at a time.

Hard rules:

- Do NOT edit, create, rename or delete any file, and do not change any website or form. You only read pages and report.
- Do NOT guess. Do not fill a gap from memory, from search-result snippets, from a news story or from a travel
  blog. If the official page does not say it, write `not stated on the page`.
- Use only the official page of the agency that manages the place (for example gastateparks.org, parks.ca.gov, nps.gov,
  fs.usda.gov, a county or city government site). If the cited address is not official or has moved, find the
  agency's own page for that place and say which address you used. A third-party page (a tourism board,
  FIND Outdoors, a blog) is never the source: report it as `third party only`.
- If a page would not load, was blocked, needs a login, or shows a captcha, write exactly `page would not load`
  for that place. Do not substitute a cached copy or a summary.
- Copy the exact sentence(s) from the page word for word, in quotation marks. Do not paraphrase, shorten or
  fix spelling inside the quote. If the rule is spread over several sentences, include each one in the same
  quote cell, separated by ` | `.
- Record the page's own "last updated" or "revised" date exactly as shown. If the page shows no date, write `none shown`.
- Compare what the page says with "Our current claim". Say plainly where they differ (wrong, missing, or more
  detail on the page). Also say if two official pages disagree with each other (name both addresses).

For EACH place, return one row in the table below. Return ONE markdown table, one row per place, in the same
order as the list, with exactly these columns and nothing else before or after the table except the final
"Needs a human" list:

| slug | official URL | exact quote | page date | dogs allowed where | leash | fees | exclusions | seasonal | nearbyAlternative | conflictNote | verified | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|

Column rules:

- slug: the slug from the list, unchanged.
- official URL: the exact address you read (https only).
- exact quote: the exact sentence(s) from the page, in quotation marks, or `page would not load`.
- page date: the date the page shows, or `none shown`.
- dogs allowed where: short rows in the form `area = yes | leash | no | some` separated by `;`, using only areas the
  page names. `yes` = allowed (no leash rule stated), `leash` = allowed on a leash, `no` = not allowed,
  `some` = allowed in some places only.
- leash: the leash rule as the page states it (length, off-leash areas), or `not stated on the page`.
- fees: exact fees the page states for dogs or pets, or `none stated`.
- exclusions: areas, buildings, trails or times where the page says dogs are not allowed, or `none stated`.
- seasonal: seasonal closures or dates the page states, or `none stated`.
- nearbyAlternative: a nearby place the page itself suggests for dogs, or `none stated`. Do not invent one.
- conflictNote: where the page disagrees with "Our current claim" or with another official page, naming the
  address. Write `none found` only if you checked and found no conflict.
- verified: `yes` only if the page loaded, you copied the exact sentence, and nothing contradicts it. `no` if
  the page contradicts our claim or states no dog rule. `needs human` if anything is unclear, the page would not
  load, the page is third-party only, or two official pages disagree.
- notes: anything else the lead should know in one or two sentences (for example "page moved to a new
  address", "rule is on a separate trails page"). Keep it short.

Use a `|` inside a cell only if unavoidable, written as `\|`. Put no line breaks inside a cell.

After the table, add a short list headed "Needs a human" naming each slug whose verified value is not `yes`,
with the one-line reason.

Places to check (generated from `content/places/*.yml`):

<!-- PLACES:START (generated by scripts/places-verification-sheet.ts) -->

1. **Alpine Pedal Path, Big Bear Lake** (slug: `alpine-pedal-path-big-bear`)
   - File: `content/places/alpine-pedal-path-big-bear.yml`
   - Managed by: USDA Forest Service (San Bernardino National Forest)
   - Official page we cited: https://www.fs.usda.gov/r05/sanbernardino/recreation/trails/alpine-pedal-path-trail-1e50
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-los-angeles`):
     - Alpine Pedal Path (asphalt path along the north shore of Big Bear Lake): allowed on a leash (Shared with other users; there may be bikes and other dogs.)
     - Leash: Six feet or less, or otherwise under physical restrictive control.

2. **Anna Ruby Falls Recreation Area** (slug: `anna-ruby-falls-recreation-area`)
   - File: `content/places/anna-ruby-falls-recreation-area.yml`
   - Managed by: USDA Forest Service (Chattahoochee-Oconee National Forest)
   - Official page we cited: https://www.fs.usda.gov/r08/chattahoochee-oconee/recreation/anna-ruby-falls-recreation-area
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-atlanta`):
     - Outdoor areas: allowed on a leash (Per FIND Outdoors: dogs are welcome if leashed, well-behaved and under control at all times.)
     - Gift shop and restrooms: NOT allowed (Per FIND Outdoors.)
     - Leash: Leashed and under control at all times (per FIND Outdoors).
     - Fees: Separate entrance area and fee from Unicoi State Park; a Georgia State Park Pass does not cover Anna Ruby Falls admission (per FIND Outdoors). Amounts not stated in our article.
     - Not allowed: Inside the gift shop or restrooms
     - Known conflict we noted: The Forest Service page we cited states no pet rule. The dog guidance in our article comes from FIND Outdoors (https://gofindoutdoors.org/anna-ruby-know-before-you-go/), which is not the managing agency, and the official sources give differing operating details.

3. **Arroyo Burro Beach County Park** (slug: `arroyo-burro-beach-county-park`)
   - File: `content/places/arroyo-burro-beach-county-park.yml`
   - Managed by: Santa Barbara County Parks
   - Official page we cited: https://santabarbaraparks.com/parks/arroyo-burro-county-beach-park/
   - Our current claim (from the article `pet-friendly-beachfront-rentals-california`):
     - Within the county park: allowed on a leash (Dogs must be leashed.)
     - Off-leash beach area east of the creek: dogs allowed (The county visitor page describes an off-leash beach area east of the creek. Confirm the boundary before you unclip the leash.)
     - Leash: Leashed within the county park; the off-leash area is east of the creek.
     - Known conflict we noted: The county page and the City of Santa Barbara's dog-access handout (https://sbparksandrec.santabarbaraca.gov/sites/default/files/2024-08/Where%20Can%20I%20Take%20My%20Dog%20Full%20Page.pdf) are worded differently. The handout lists Arroyo Burro Beach and other beaches as off-leash locations, with dogs under sight and voice control and a leash carried at all times. The county page says dogs must be leashed in the county park, with an off-leash area east of the creek. Our article follows the stricter reading (leashed, except east of the creek) unless signs say otherwise. Locals also call the beach Hendry's.

4. **California State Parks: general dog rules** (slug: `california-state-parks-general-dog-rules`)
   - File: `content/places/california-state-parks-general-dog-rules.yml`
   - Managed by: California State Parks
   - Official page we cited: https://www.parks.ca.gov/Dogs
   - Our current claim (from the article `pet-friendly-beachfront-rentals-california`):
     - Most state beaches: NOT allowed (Individual parks list their own exceptions.)
     - Trails: allowed in some places (Generally not allowed unless a trail is specifically designated as open to dogs on leash.)
     - Where a park permits dogs: allowed on a leash (Leash of six feet or less, dog physically under your control.)
     - Leash: Six feet or less; the dog must be physically under your control.
     - Not allowed: Dogs are prohibited on most state beaches; Dogs are generally not allowed on trails unless a trail is specifically designated as open to dogs on leash
     - Known conflict we noted: A nearby city beach can have a different policy from a state beach.

5. **Carmel Beach** (slug: `carmel-beach`)
   - File: `content/places/carmel-beach.yml`
   - Managed by: City of Carmel-by-the-Sea
   - Official page we cited: https://ci.carmel.ca.us/post/carmel-beach
   - Our current claim (from the article `pet-friendly-beachfront-rentals-california`):
     - Carmel Beach: dogs allowed (Dogs are permitted under voice control. The city defines this: carry a means of leashing the dog, keep it within 25 feet, have it return within three feet on command, and keep it within three feet when other people or animals are present.)
     - Leash: Voice control as the city defines it; the city asks owners to leash dogs at the bottom of stairways and sand ramps when leaving.

6. **Channel Islands National Park** (slug: `channel-islands-national-park`)
   - File: `content/places/channel-islands-national-park.yml`
   - Managed by: National Park Service
   - Official page we cited: https://www.nps.gov/chis/planyourvisit/pets.htm
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-los-angeles`):
     - Islands and park: NOT allowed (Pets are not allowed, to protect island wildlife. Service animals are admitted only after a vaccination, parasite-prevention and health-exam protocol; contact the park directly.)
     - Not allowed: Pets are not allowed on the islands

7. **Georgia State Parks: general pet rules** (slug: `georgia-state-parks-general-pet-rules`)
   - File: `content/places/georgia-state-parks-general-pet-rules.yml`
   - Managed by: Georgia State Parks
   - Official page we cited: https://gastateparks.org/ParkRules
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-atlanta`):
     - Park grounds and trails in general: allowed on a leash (Pets accompanied by their owner are generally welcome.)
     - Buildings, lodges, swimming areas and beaches: NOT allowed
     - Some trails: allowed in some places (Exclusions apply by trail; check the park's own page.)
     - Dog-friendly state-park cottages: allowed in some places (Limited to two dogs; dogs may not be left unattended.)
     - Leash: Leash no longer than six feet.
     - Not allowed: Buildings and lodges; Swimming areas and beaches; Some trails (check the park's own page); Dogs may not be left unattended in a state-park cottage; Cottages are limited to two dogs

8. **Joshua Tree National Park** (slug: `joshua-tree-national-park`)
   - File: `content/places/joshua-tree-national-park.yml`
   - Managed by: National Park Service
   - Official page we cited: https://www.nps.gov/jotr/planyourvisit/pets.htm
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-los-angeles`):
     - Roads, parking areas and campgrounds (within 100 feet): allowed on a leash (Leash no longer than six feet at all times.)
     - Paved Oasis of Mara and Keys View trails: allowed on a leash
     - Hiking trails: NOT allowed
     - Backcountry: NOT allowed
     - Park buildings: NOT allowed
     - Leash: Six feet or less at all times; pets must stay within 100 feet of roads, parking areas and campgrounds.
     - Not allowed: Hiking trails; Backcountry; Park buildings; Leaving a pet unattended is prohibited

9. **Mendocino Headlands State Park** (slug: `mendocino-headlands-state-park`)
   - File: `content/places/mendocino-headlands-state-park.yml`
   - Managed by: California State Parks
   - Official page we cited: https://www.parks.ca.gov/?page_id=442
   - Our current claim (from the article `pet-friendly-beachfront-rentals-california`):
     - Park (state-park leash rules apply): allowed on a leash (The park page lists dogs as permitted. That does not establish that every descent suits your dog; verify your route.)
     - Leash: State-park rule: six feet or less, physically under your control.

10. **Mount San Jacinto State Park** (slug: `mount-san-jacinto-state-park`)
   - File: `content/places/mount-san-jacinto-state-park.yml`
   - Managed by: California State Parks
   - Official page we cited: https://www.parks.ca.gov/?page_id=636
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-los-angeles`):
     - Idyllwild and Stone Creek campgrounds: dogs allowed (The only places the park allows dogs, per our article.)
     - Wilderness: NOT allowed
     - Palm Springs Tram: NOT allowed (Except service animals.)
     - Not allowed: Wilderness; Palm Springs Tram (except service animals)

11. **Pismo State Beach and Oceano Dunes SVRA** (slug: `pismo-state-beach-and-oceano-dunes`)
   - File: `content/places/pismo-state-beach-and-oceano-dunes.yml`
   - Managed by: California State Parks
   - Official page we cited: https://www.parks.ca.gov/?page_id=30471
   - Our current claim (from the article `pet-friendly-beachfront-rentals-california`):
     - Campgrounds, trails and beach at Pismo State Beach and Oceano Dunes SVRA: allowed on a leash (The six-foot leash rule applies.)
     - Oso Flaco Lake: NOT allowed
     - Pismo Dunes Natural Preserve: NOT allowed
     - Leash: Six feet or less (state-park rule).
     - Not allowed: Oso Flaco Lake; Pismo Dunes Natural Preserve

12. **Red Top Mountain State Park** (slug: `red-top-mountain-state-park`)
   - File: `content/places/red-top-mountain-state-park.yml`
   - Managed by: Georgia State Parks
   - Official page we cited: https://gastateparks.org/RedTopMountain
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-atlanta`):
     - Trails and park grounds (state-park general rule): allowed on a leash (We apply the Georgia State Parks general pet rule. Our article says the Red Top Mountain page is cited for trails and closures, not dog policy.)
     - Buildings, lodges, swimming areas and beaches: NOT allowed
     - Leash: Leash no longer than six feet (Georgia State Parks general rule).
     - Not allowed: Buildings and lodges; Swimming areas and beaches; Some trails (check the park's own page)

13. **San Diego: Dog Beach and Fiesta Island** (slug: `san-diego-dog-beach-and-fiesta-island`)
   - File: `content/places/san-diego-dog-beach-and-fiesta-island.yml`
   - Managed by: City of San Diego Parks and Recreation
   - Official page we cited: https://www.sandiego.gov/park-and-recreation/parks/dogs/bchdog
   - Our current claim (from the article `pet-friendly-beachfront-rentals-california`):
     - Dog Beach (west end of the San Diego River Floodway): dogs allowed (Designated leash-free area. Not permission to use other city beaches off leash.)
     - Fiesta Island: dogs allowed (Leash optional, generally open 4 a.m. to 10 p.m.)
     - Other areas of Mission Bay Park: allowed in some places (No dogs during posted daytime hours (see seasonal); leashes required at other times.)
     - Leash: Leash-free only in the designated areas; leashes required elsewhere.
     - Not allowed: Fiesta Island: nesting sites and the Youth Aquatic Center/Camp are excluded
     - Seasonal: Fiesta Island nesting-buffer closures run April 15 through September 15. Other Mission Bay Park areas: no dogs 9 a.m. to 4 p.m. between October 31 and March 31, or 9 a.m. to 6 p.m. between April 1 and October 31.
     - Known conflict we noted: The page's Mission Bay hour ranges overlap on October 31 and the page does not say which applies. It points to the city's Ask Parks contact.

14. **Tallulah Gorge State Park** (slug: `tallulah-gorge-state-park`)
   - File: `content/places/tallulah-gorge-state-park.yml`
   - Managed by: Georgia State Parks
   - Official page we cited: https://gastateparks.org/TallulahGorge/
   - Our current claim (from the article `dog-friendly-weekend-getaways-from-atlanta`):
     - Rim trails: allowed on a leash (Leashed pets are welcome on the rim trails.)
     - Gorge floor: NOT allowed
     - Sliding Rock Trail: NOT allowed
     - Hurricane Falls staircase to the suspension bridge: NOT allowed
     - Leash: Leash no longer than six feet (Georgia State Parks general rule); keep control at overlooks.
     - Not allowed: Gorge floor; Sliding Rock Trail; Hurricane Falls staircase to the suspension bridge

<!-- PLACES:END -->

=====

## For the lead: what to do with the table

- Copy `official URL` into `sourceUrl`, `exact quote` into `sourceQuote` (without the quotation marks), `page date`
  into `sourcePageDate` (leave empty if `none shown`), and the other columns into the matching fields.
- Set `lastChecked` to the day the verifier read the page, `verifiedBy` to the verifier's name, and remove the
  "UNVERIFIED seed" comment at the top of the file.
- Spot-check at least two quotes in a normal browser yourself before setting `status: verified`.
- Rows marked `needs human` stay unverified. Places that cannot be confirmed from an official page stay hidden.
- The site flags a verified place "Needs recheck" 12 months after `lastChecked`; re-run this prompt then.
