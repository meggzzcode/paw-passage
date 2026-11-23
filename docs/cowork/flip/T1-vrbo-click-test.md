# T1: Vrbo button click test (read-only, no login)

Account: none. Do not sign in to Vrbo or anything else. Date: 2026-11-23.

You are checking that every "View on Vrbo" button on the live site lands on the right Vrbo listing. One click per stay, my own affiliate links, never book through them.

Rules: do NOT book, reserve, request a quote, message a host, add to a trip or favourites, create an account, or enter any personal or payment detail. No repeat clicks, no loops, no refreshing. Wait at least 20 seconds between stays. If Vrbo shows HTTP 429, "Access denied", a CAPTCHA, "verify you are human", a block or a login wall: STOP, do not retry, do not work around it, record which stay you were on. Also stop after 3 failures in a row.

Steps for each row: open the stay page on pawsandpassage.com, find the button that goes to Vrbo ("View on Vrbo"), click it once. When the Vrbo page loads record: (1) the final address, and whether it ends on a listing page `vrbo.com/<number>` that matches the Expected listing ID (extra tracking after it is fine); (2) the listing title and whether it plausibly matches the stay name (same town, similar title, bedrooms); (3) status OK / WRONG / UNAVAILABLE / BLOCKED / ERROR; (4) anything odd. Do not record prices. Close the Vrbo tab and continue.

| # | Stay name | Town | Stay page | Expected Vrbo listing ID |
|---|---|---|---|---|
| 1 | 5-Star Cabin with Views and Hot Tub (Cherry Lake) | blue-ridge | https://www.pawsandpassage.com/stays/5-star-cabin-with-views-and-hot-tub-cherry-lake | 1056490 |
| 2 | Azure Springs Mountain Retreat (Dahlonega) | dahlonega | https://www.pawsandpassage.com/stays/azure-springs-secluded-mountain-retreat-dahlonega | 4242052 |
| 3 | Bamby Bungalow Family and Pet Getaway (Ellijay) | ellijay | https://www.pawsandpassage.com/stays/bamby-bungalow-pet-getaway-ellijay | 3348768 |
| 4 | Beach Bungalow, 1920s Charmer (Pierpont, Ventura) | ventura | https://www.pawsandpassage.com/stays/beach-bungalow-pierpont-ventura-dogs-stay-free | 2295009 |
| 5 | Pacific Beach Townhouse near the Beach Park (Dog Friendly) | san-diego | https://www.pawsandpassage.com/stays/beach-townhouse-pacific-beach-half-block-to-beach-park-dog-friendly | 3042489 |
| 6 | Blue Ridge Downtown Stay (Dog Friendly, King Bed) | blue-ridge | https://www.pawsandpassage.com/stays/blue-ridge-downtown-stay-dog-friendly-king-bed | 3067945 |
| 7 | Casa Azzurra, Dog Friendly in West Beach (Santa Barbara) | santa-barbara | https://www.pawsandpassage.com/stays/casa-azzurra-west-beach-santa-barbara-dog-friendly | 1445930 |
| 8 | Cherry Lake Log Cabin, Fenced Yard, Up to 4 Dogs (Blue Ridge) | blue-ridge | https://www.pawsandpassage.com/stays/cherry-lake-log-cabin-fenced-yard-up-to-4-dogs | 3320896 |
| 9 | Coastal Redwood Bliss (Little River) | mendocino | https://www.pawsandpassage.com/stays/coastal-redwood-bliss-little-river | 4717796 |
| 10 | Cozy Romantic Cabin with a View and Hot Tub (Near Downtown) | blue-ridge | https://www.pawsandpassage.com/stays/cozy-romantic-cabin-with-a-view-and-hot-tub-near-downtown | 989362 |
| 11 | Creekside Cottage (Relax, Soak, Swim) | blue-ridge | https://www.pawsandpassage.com/stays/creekside-cottage-relax-soak-swim | 5283109 |
| 12 | Dog Friendly Cottage with Ocean Beach Charm | san-diego | https://www.pawsandpassage.com/stays/dog-friendly-cottage-with-ocean-beach-charm-san-diego | 2363171 |
| 13 | Fenced Firepit Cottage with Views (Ellijay) | ellijay | https://www.pawsandpassage.com/stays/fully-fenced-firepit-cottage-near-ellijay | 3106796 |
| 14 | Hidden Gem Dog Friendly Cabin (Helen) | helen | https://www.pawsandpassage.com/stays/hidden-gem-dog-friendly-cabin-near-golf-helen | 3622396 |
| 15 | In Town Dog Friendly, Hot Tub, Fire Pit (Helen) | helen | https://www.pawsandpassage.com/stays/in-town-dog-friendly-hot-tub-fire-pit-helen | 2908219 |
| 16 | Large Beach House with Sauna and Hot Tub (Mesa, Santa Barbara) | santa-barbara | https://www.pawsandpassage.com/stays/large-beach-house-sauna-hot-tub-mesa-santa-barbara-two-dogs | 3500343 |
| 17 | Lovely 1920's Farmhouse, Family and Pet Friendly (Mendocino) | mendocino | https://www.pawsandpassage.com/stays/lovely-1920s-farmhouse-family-and-pet-friendly-mendocino | 889523 |
| 18 | Mountain Gem, Fenced Yard and Mountain View (Cherry Log) | blue-ridge | https://www.pawsandpassage.com/stays/mountain-gem-cherry-log-fenced-yard-large-dogs | 2357464 |
| 19 | Mountain View Cabin (Hilltop Hideaway) | blue-ridge | https://www.pawsandpassage.com/stays/mountain-view-cabin-hilltop-hideaway | 3016263 |
| 20 | Pacific Beach House with Home Office, 2 Blocks to the Ocean | san-diego | https://www.pawsandpassage.com/stays/pacific-beach-house-3-bedroom-home-office-2-blocks-to-ocean | 2193383 |
| 21 | Palisades Beach House on the Mesa (Santa Barbara) | santa-barbara | https://www.pawsandpassage.com/stays/palisades-beach-house-mesa-santa-barbara-one-dog | 1250124 |
| 22 | Relaxing Privacy Overlooking the Mendocino Coast (Albion) | mendocino | https://www.pawsandpassage.com/stays/relaxing-privacy-overlooking-the-mendocino-coast-albion | 317612 |
| 23 | River Tubing, Hot Tub, Golf Course, Pool, Pet Friendly (Helen, Innsbruck) | helen | https://www.pawsandpassage.com/stays/river-tubing-hot-tub-pool-pet-friendly-innsbruck-helen | 3495924 |
| 24 | Riverfront Fenced Cabin with Sauna (Ellijay) | ellijay | https://www.pawsandpassage.com/stays/riverfront-fenced-cabin-with-sauna-ellijay | 4188412 |
| 25 | Romantic Cabin with Secluded Hot Tub and Mountain Views (Cherry Log) | cherry-log | https://www.pawsandpassage.com/stays/romantic-cabin-with-secluded-hot-tub-and-mountain-views-cherry-log | 4396826 |
| 26 | Romantic Hideaway for Hikers (Cherry Log) | cherry-log | https://www.pawsandpassage.com/stays/romantic-hideaway-for-hikers-cherry-log | 2839563 |
| 27 | Take a Paws, Close to Downtown (Blue Ridge) | blue-ridge | https://www.pawsandpassage.com/stays/take-a-paws-close-to-downtown-blue-ridge | 2827825 |
| 28 | The French Secret (Romantic Getaway) | mccaysville | https://www.pawsandpassage.com/stays/the-french-secret-romantic-getaway | 3441964 |
| 29 | Three Cubs Cottage, Fire Pit and Pool Table (Mineral Bluff) | blue-ridge | https://www.pawsandpassage.com/stays/three-cubs-cottage-pet-friendly-fire-pit-mineral-bluff | 4195368 |
| 30 | Toccoa River Front Cabin with Hot Tub (Mineral Bluff) | mineral-bluff | https://www.pawsandpassage.com/stays/toccoa-river-front-cabin-with-hot-tub-mineral-bluff | 4929336 |
| 31 | Family and Pet Friendly with Privacy Fence (Tybee Island) | tybee-island | https://www.pawsandpassage.com/stays/tybee-family-and-pet-friendly-with-privacy-fence | 689968 |
| 32 | Wine Country Getaway Chalet (Dahlonega) | dahlonega | https://www.pawsandpassage.com/stays/wine-country-getaway-chalet-dahlonega | 3869736 |

Result file: `results/T1-vrbo-results.md`: one table (# | Stay | Status | Listing ID seen | Matches expected? | Title seen | Notes) and a summary: counts per status, which stays need fixing or removal, where you stopped if blocked.
