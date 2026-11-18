// Built from our reading of 38 vacation rental managers' public pet pages on 2026-11-18, each re-checked against the live page.
// A sample of managers whose sites could be read, not a survey. Policies change and many vary by home.
export interface ManagerPolicy {
  name: string; place: string; region: string; url: string;
  /** Stated limit, or null when the page gives none. */
  maxDogs: number | null;
  /** dogs: a dog limit; pets: a limit on pets of any kind; most-homes: usual limit, individual homes may differ. */
  limitBasis: "dogs" | "pets" | "most-homes";
  breed: "named" | "unnamed" | "none" | "not-stated";
  breedNamed?: string[];
  weight?: { lb: number; per: "each" | "combined"; soft?: boolean; note?: string };
  fee: string;
  /** What the page says about dogs in a pool or hot tub, a minimum dog age, and leaving a dog alone. Absent when the page we read said nothing. */
  pool?: string; minAge?: string; unattended?: string;
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
  "fee": "$40 per night",
  "region": "California",
  "unattended": "advisory only: may not want to leave dog in house alone"
 },
 {
  "name": "Tahoe Getaways",
  "place": "South Lake Tahoe",
  "url": "https://tahoegetaways.com/policies",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$35 per night",
  "region": "California",
  "minAge": "no dogs under 18 months"
 },
 {
  "name": "Tahoe Vacation Rentals",
  "place": "Lake Tahoe",
  "url": "https://www.tahoevacationrentals.com/reservation-information/",
  "maxDogs": 3,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$75 plus tax per pet",
  "region": "California"
 },
 {
  "name": "Tahoe Signature Properties",
  "place": "Lake Tahoe",
  "url": "https://tahoesignatureproperties.com/know-before-you-go/",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$100",
  "region": "California"
 },
 {
  "name": "Vacasa",
  "place": "Many locations",
  "url": "https://www.vacasa.com/usa/California/Mammoth-Lakes/explore/Dog-friendly/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "Many regions"
 },
 {
  "name": "AvantStay",
  "place": "Pismo Beach",
  "url": "https://www.avantstay.com/pet-friendly-vacation-rentals/california/pismo-beach",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "California"
 },
 {
  "name": "SkyRun Vacation Rentals",
  "place": "Breckenridge",
  "url": "https://skyrun.com/breckenridge/breckenridge-pet-friendly-vacation-rentals/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "Colorado and Florida Gulf Coast"
 },
 {
  "name": "Rocky Mountain Resorts",
  "place": "Estes Park",
  "url": "https://www.rockymtnresorts.com/?p=8672",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$25 per night",
  "region": "Colorado and Florida Gulf Coast"
 },
 {
  "name": "Newman-Dailey Resort Properties",
  "place": "Destin",
  "url": "https://www.destinvacation.com/pet-friendly",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "Colorado and Florida Gulf Coast",
  "pool": "dogs not permitted in pool area (hot tub/spa not stated)",
  "unattended": "dogs must be crated when left alone inside property"
 },
 {
  "name": "My Vacation Haven",
  "place": "Miramar Beach (30A/Destin area)",
  "url": "https://www.myvacationhaven.com/pet-policy",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$250 first pet, $100 second pet",
  "region": "Colorado and Florida Gulf Coast",
  "pool": "pets not allowed in pool or hot tub"
 },
 {
  "name": "Rosemary Beach Cottage Rental Company",
  "place": "Rosemary Beach (30A)",
  "url": "https://rosemarybeach.com/faq/",
  "maxDogs": 3,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$300 per pet",
  "region": "Colorado and Florida Gulf Coast"
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
  "fee": "$250 per stay",
  "region": "Colorado and Florida Gulf Coast"
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
  "fee": "$50 per pet per night, plus a $75 cleaning fee",
  "region": "Georgia",
  "unattended": "no dog left unattended in cabin; crate trained required"
 },
 {
  "name": "A Blue Ridge Cabin Rental",
  "place": "Blue Ridge",
  "url": "https://ablueridgecabinrental.com/cabin-policies/",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$150 per pet",
  "region": "Georgia",
  "minAge": "at least 18 months old"
 },
 {
  "name": "A Blue Ridge Vacation",
  "place": "Blue Ridge",
  "url": "https://www.ablueridgevacation.com/rental-and-cancellation-policies/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$20 per night, plus a small cleaning fee",
  "region": "Georgia"
 },
 {
  "name": "Cuddle Up Cabin Rentals",
  "place": "Blue Ridge",
  "url": "http://cuddleupcabinrentals.com/Cabin-Rentals-Pet-Friendly.php",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "Georgia"
 },
 {
  "name": "Sliding Rock Cabins",
  "place": "Ellijay / Blue Ridge",
  "url": "https://slidingrockcabins.com/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "none",
  "fee": "$0",
  "region": "Georgia"
 },
 {
  "name": "Enchanted Mountain Retreats (georgiaemr.com)",
  "place": "Blue Ridge",
  "url": "https://www.georgiaemr.com/vacation-rentals/blue-ridge/dog-friendly",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "Georgia"
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
  "fee": "$147",
  "region": "Georgia",
  "minAge": "at least 1 year old"
 },
 {
  "name": "Georgia Coast Realty",
  "place": "St. Simons Island",
  "url": "https://www.gacoastrealty.com/rentals/rental-faqs.html",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "Georgia"
 },
 {
  "name": "St. Simons Island Beach Rentals",
  "place": "St. Simons Island",
  "url": "https://www.stsimonsislandbeachrentals.com/terms-conditions/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$250 first dog, $150 second dog; $400 for stays of 14+ days per stay",
  "region": "Georgia"
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
  "fee": "Not stated",
  "region": "North Carolina",
  "pool": "dogs not allowed to swim in pool or hot tub",
  "unattended": "dogs should not be left alone unless crated; never lock in a bedroom"
 },
 {
  "name": "Sun Realty",
  "place": "Outer Banks",
  "url": "https://www.sunrealtync.com/node/1163",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$161 to $231 plus tax (a flea-treatment fee; varies by property)",
  "region": "North Carolina",
  "pool": "pets not permitted in pools or hot tubs"
 },
 {
  "name": "Beach Realty & Construction",
  "place": "Outer Banks",
  "url": "https://www.beachrealtync.com/node/707",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "unnamed",
  "fee": "Not stated",
  "region": "North Carolina",
  "pool": "no dogs in pool or hot tub",
  "minAge": "no puppies (adult dogs only)"
 },
 {
  "name": "Resort Realty",
  "place": "Outer Banks",
  "url": "https://resortrealty.com/outer-banks-pet-friendly",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "up to $1,000, varies by property",
  "region": "North Carolina",
  "minAge": "no puppies (adult dogs only)"
 },
 {
  "name": "Twiddy & Company",
  "place": "Outer Banks",
  "url": "https://blog.twiddy.com/bring-your-pets-on-vacation/",
  "maxDogs": 2,
  "limitBasis": "most-homes",
  "breed": "not-stated",
  "fee": "$0 on homes listed",
  "region": "North Carolina",
  "pool": "pets not permitted in pools or hot tubs (Twiddy pet pages, read 2026-11-18)"
 },
 {
  "name": "Carolina Designs Realty",
  "place": "Outer Banks",
  "url": "https://www.carolinadesigns.com/obx-guide/faq/pet-friendly-outer-banks-rentals/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "North Carolina"
 },
 {
  "name": "Midgett Realty",
  "place": "Hatteras Island",
  "url": "https://www.midgettrealty.com/hatteras-vacation-rental-policies",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "North Carolina"
 },
 {
  "name": "Surf or Sound Realty",
  "place": "Hatteras Island",
  "url": "https://www.surforsound.com/vacation-planning/rental-policies/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$200 plus tax per week",
  "region": "North Carolina",
  "pool": "dogs strictly prohibited in the pool and spa"
 },
 {
  "name": "Greybeard Rentals",
  "place": "Asheville",
  "url": "https://www.greybeardrentals.com/asheville-vacation-rentals/pet-friendly",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "North Carolina"
 },
 {
  "name": "Asheville Cabins of Willow Winds",
  "place": "Asheville",
  "url": "https://www.ashevillecabins.com/accommodations/pet-friendly-cabins/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$100",
  "region": "North Carolina"
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
  "fee": "$55 per pet, one time; $75 for a large pet",
  "region": "Smoky Mountains, TN",
  "unattended": "pets must be crated when left alone"
 },
 {
  "name": "Aunt Bugs Cabin Rentals",
  "place": "Gatlinburg/Pigeon Forge",
  "url": "https://www.auntbugs.com/rental-policies/",
  "maxDogs": 2,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$75 per pet",
  "region": "Smoky Mountains, TN",
  "unattended": "dog must be crated when not at the property"
 },
 {
  "name": "Bear Camp Cabins",
  "place": "Gatlinburg/Pigeon Forge",
  "url": "https://www.bearcampcabins.com/blog/gatlinburg-cabins-pigeon-forge-pet-friendly-cabins",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "$75 plus tax per pet",
  "region": "Smoky Mountains, TN",
  "unattended": "pets must be crated if left alone (also phrased as recommended)"
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
  "fee": "$50 per animal",
  "region": "Smoky Mountains, TN"
 },
 {
  "name": "Hapey Cabin Rentals",
  "place": "Smokies TN (town not verified)",
  "url": "https://hapeycabinrentals.com/pet-friendly-smoky-mountain-cabin-rentals/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "none",
  "fee": "$0",
  "region": "Smoky Mountains, TN",
  "unattended": "travel crate recommended when leaving dog alone for a few hours"
 },
 {
  "name": "Cabins USA",
  "place": "Pigeon Forge/Sevierville",
  "url": "https://www.cabinsusa.com/vacation-cabin-rentals/amenity/pet-friendly-cabin-rentals.php",
  "maxDogs": 2,
  "limitBasis": "pets",
  "breed": "not-stated",
  "fee": "$50",
  "region": "Smoky Mountains, TN"
 },
 {
  "name": "Hemlock Hills Cabin Rentals",
  "place": "Pigeon Forge",
  "url": "https://hemlockhillscabinrentals.com/blog/pet-friendly-cabin-pigeon-forge-tennessee/",
  "maxDogs": null,
  "limitBasis": "dogs",
  "breed": "not-stated",
  "fee": "Not stated",
  "region": "Smoky Mountains, TN"
 }
];
