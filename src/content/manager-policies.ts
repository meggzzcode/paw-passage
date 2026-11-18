// Built from our reading of 38 vacation rental managers' public pet pages on 2026-11-18, each re-checked against the live page.
// A sample of managers whose sites could be read, not a survey. Policies change and many vary by home.
export interface ManagerPolicy {
  name: string; place: string; url: string;
  /** Stated limit, or null when the page gives none. */
  maxDogs: number | null;
  /** dogs: a dog limit; pets: a limit on pets of any kind; most-homes: usual limit, individual homes may differ. */
  limitBasis: "dogs" | "pets" | "most-homes";
  breed: "named" | "unnamed" | "none" | "not-stated";
  breedNamed?: string[];
  weight?: { lb: number; per: "each" | "combined"; soft?: boolean; note?: string };
  fee: string;
}

export const dataDate = "2026-11-18";

export const managerPolicies: ManagerPolicy[] = [
 {
  "name": "Big Bear Vacations",
  "place": "Big Bear Lake",
  "url": "https://www.bigbearvacations.com/about-us/pet-information/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$40 per night"
 },
 {
  "name": "Tahoe Getaways",
  "place": "South Lake Tahoe",
  "url": "https://tahoegetaways.com/policies",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$35 per night"
 },
 {
  "name": "Tahoe Vacation Rentals",
  "place": "Lake Tahoe",
  "url": "https://www.tahoevacationrentals.com/reservation-information/",
  "maxDogs": 3,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$75 plus tax per pet"
 },
 {
  "name": "Tahoe Signature Properties",
  "place": "Lake Tahoe",
  "url": "https://tahoesignatureproperties.com/know-before-you-go/",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$100"
 },
 {
  "name": "Vacasa",
  "place": "Many locations",
  "url": "https://www.vacasa.com/usa/California/Mammoth-Lakes/explore/Dog-friendly/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "AvantStay",
  "place": "Pismo Beach",
  "url": "https://www.avantstay.com/pet-friendly-vacation-rentals/california/pismo-beach",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "SkyRun Vacation Rentals",
  "place": "Breckenridge",
  "url": "https://skyrun.com/breckenridge/breckenridge-pet-friendly-vacation-rentals/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "Rocky Mountain Resorts",
  "place": "Estes Park",
  "url": "https://www.rockymtnresorts.com/?p=8672",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$25 per night"
 },
 {
  "name": "Newman-Dailey Resort Properties",
  "place": "Destin",
  "url": "https://www.destinvacation.com/pet-friendly",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "My Vacation Haven",
  "place": "Miramar Beach (30A/Destin area)",
  "url": "https://www.myvacationhaven.com/pet-policy",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$250 first pet, $100 second pet"
 },
 {
  "name": "Rosemary Beach Cottage Rental Company",
  "place": "Rosemary Beach (30A)",
  "url": "https://rosemarybeach.com/faq/",
  "maxDogs": 3,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$300 per pet"
 },
 {
  "name": "AMI Locals",
  "place": "Anna Maria Island",
  "url": "https://www.amilocals.com/faqs",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "unnamed",
  "weight": {
   "lb": 50,
   "per": "combined"
  },
  "fee": "$250 per stay"
 },
 {
  "name": "Cabin Rentals of Georgia",
  "place": "Blue Ridge",
  "url": "https://cabin-rentals-of-georgia.com/policies",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "unnamed",
  "weight": {
   "lb": 35,
   "per": "each"
  },
  "fee": "$50 plus $75 cleaning fee per night"
 },
 {
  "name": "A Blue Ridge Cabin Rental",
  "place": "Blue Ridge",
  "url": "https://ablueridgecabinrental.com/cabin-policies/",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$150 per pet"
 },
 {
  "name": "A Blue Ridge Vacation",
  "place": "Blue Ridge",
  "url": "https://www.ablueridgevacation.com/rental-and-cancellation-policies/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$20 plus small cleaning fee per night"
 },
 {
  "name": "Cuddle Up Cabin Rentals",
  "place": "Blue Ridge",
  "url": "http://cuddleupcabinrentals.com/Cabin-Rentals-Pet-Friendly.php",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "Sliding Rock Cabins",
  "place": "Ellijay / Blue Ridge",
  "url": "https://slidingrockcabins.com/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "none",
  "fee": "$0"
 },
 {
  "name": "Enchanted Mountain Retreats (georgiaemr.com)",
  "place": "Blue Ridge",
  "url": "https://www.georgiaemr.com/vacation-rentals/blue-ridge/dog-friendly",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "Emmons Realty",
  "place": "St. Simons Island",
  "url": "https://www.emmonsrealty.com/pages/rental-policies",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "named",
  "breedNamed": [
   "pit"
  ],
  "weight": {
   "lb": 65,
   "per": "each"
  },
  "fee": "$147"
 },
 {
  "name": "Georgia Coast Realty",
  "place": "St. Simons Island",
  "url": "https://www.gacoastrealty.com/rentals/rental-faqs.html",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "St. Simons Island Beach Rentals",
  "place": "St. Simons Island",
  "url": "https://www.stsimonsislandbeachrentals.com/terms-conditions/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$250 first dog, $150 second dog; $400 for stays of 14+ days per stay"
 },
 {
  "name": "Brindley Beach Vacations",
  "place": "Outer Banks",
  "url": "https://www.brindleybeach.com/node/3691",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "weight": {
   "lb": 60,
   "per": "each"
  },
  "fee": "Not stated"
 },
 {
  "name": "Sun Realty",
  "place": "Outer Banks",
  "url": "https://www.sunrealtync.com/node/1163",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$161-$231 plus sales tax, varies by property per pet"
 },
 {
  "name": "Beach Realty & Construction",
  "place": "Outer Banks",
  "url": "https://www.beachrealtync.com/node/707",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "unnamed",
  "fee": "Not stated"
 },
 {
  "name": "Resort Realty",
  "place": "Outer Banks",
  "url": "https://resortrealty.com/outer-banks-pet-friendly",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "up to $1,000, varies by property"
 },
 {
  "name": "Twiddy & Company",
  "place": "Outer Banks",
  "url": "https://blog.twiddy.com/bring-your-pets-on-vacation/",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "not-stated",
  "fee": "$0 on homes listed"
 },
 {
  "name": "Carolina Designs Realty",
  "place": "Outer Banks",
  "url": "https://www.carolinadesigns.com/obx-guide/faq/pet-friendly-outer-banks-rentals/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "Midgett Realty",
  "place": "Hatteras Island",
  "url": "https://www.midgettrealty.com/hatteras-vacation-rental-policies",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "Surf or Sound Realty",
  "place": "Hatteras Island",
  "url": "https://www.surforsound.com/vacation-planning/rental-policies/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$200 plus tax per week"
 },
 {
  "name": "Greybeard Rentals",
  "place": "Asheville",
  "url": "https://www.greybeardrentals.com/asheville-vacation-rentals/pet-friendly",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 },
 {
  "name": "Asheville Cabins of Willow Winds",
  "place": "Asheville",
  "url": "https://www.ashevillecabins.com/accommodations/pet-friendly-cabins/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$100"
 },
 {
  "name": "Hearthside Cabin Rentals",
  "place": "Pigeon Forge/Gatlinburg",
  "url": "https://hearthsidecabinrentals.com/frequently-asked-questions",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "weight": {
   "lb": 35,
   "per": "each",
   "soft": true,
   "note": "Larger dogs are allowed at some cabins for an extra fee."
  },
  "fee": "$55; $75 one time"
 },
 {
  "name": "Aunt Bugs Cabin Rentals",
  "place": "Gatlinburg/Pigeon Forge",
  "url": "https://www.auntbugs.com/rental-policies/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$75 per night"
 },
 {
  "name": "Bear Camp Cabins",
  "place": "Gatlinburg/Pigeon Forge",
  "url": "https://www.bearcampcabins.com/blog/gatlinburg-cabins-pigeon-forge-pet-friendly-cabins",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$75 plus tax per pet"
 },
 {
  "name": "Elk Springs Resort",
  "place": "Gatlinburg",
  "url": "https://elkspringsresort.com/?p=1899",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "named",
  "breedNamed": [
   "pit",
   "doberman",
   "rottweiler",
   "shepherd",
   "chow",
   "dane",
   "akita",
   "malamute",
   "husky"
  ],
  "weight": {
   "lb": 50,
   "per": "each"
  },
  "fee": "$50 per stay"
 },
 {
  "name": "Hapey Cabin Rentals",
  "place": "Smokies TN (town not verified)",
  "url": "https://hapeycabinrentals.com/pet-friendly-smoky-mountain-cabin-rentals/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "none",
  "fee": "$0"
 },
 {
  "name": "Cabins USA",
  "place": "Pigeon Forge/Sevierville",
  "url": "https://www.cabinsusa.com/vacation-cabin-rentals/amenity/pet-friendly-cabin-rentals.php",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$50"
 },
 {
  "name": "Hemlock Hills Cabin Rentals",
  "place": "Pigeon Forge",
  "url": "https://hemlockhillscabinrentals.com/blog/pet-friendly-cabin-pigeon-forge-tennessee/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated"
 }
];
