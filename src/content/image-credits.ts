import type { ImageKey } from "@/lib/images";

export type ImageCredit = { key: ImageKey; photographer: string; unsplashUrl: string };

// All photos are used under the Unsplash License (https://unsplash.com/license).
export const imageCredits: ImageCredit[] = [
  { key: "hero-porch", photographer: "Illia Bondar", unsplashUrl: "https://unsplash.com/photos/person-and-dog-on-mountain-deck-H5LOYby0rI8" },
  { key: "guide-ga-cabins", photographer: "Kristīne Kozaka", unsplashUrl: "https://unsplash.com/photos/sf9K6IdfQFM" },
  { key: "guide-atlanta-getaways", photographer: "Kristin Melville", unsplashUrl: "https://unsplash.com/photos/a-dog-sitting-on-a-rock-looking-out-over-a-valley-with-trees-and-mountains-xbv0NB2W2gA" },
  { key: "guide-la-getaways", photographer: "Sasha Matveeva", unsplashUrl: "https://unsplash.com/photos/yAwVnvWDf8Q" },
  { key: "guide-ca-beach", photographer: "Maggie Riordan", unsplashUrl: "https://unsplash.com/photos/JchDHwIKJxs" },
  { key: "guide-pet-fees", photographer: "Ayla Verschueren", unsplashUrl: "https://unsplash.com/photos/a-brown-and-white-dog-sitting-next-to-a-laptop-kddsImNjIus" },
  { key: "guide-rental-checklist", photographer: "Erin Vey", unsplashUrl: "https://unsplash.com/photos/dog-looks-up-at-his-owner-on-a-porch-x6qRuASPLC4" },
  { key: "guide-two-dogs", photographer: "Helena Lopes", unsplashUrl: "https://unsplash.com/photos/KmVc-X1dGe4" },
  { key: "guide-fenced-yard", photographer: "Sanela Arsenić", unsplashUrl: "https://unsplash.com/photos/a-black-dog-peeking-out-from-behind-a-fence-qKDvxV0ImTA" },
  { key: "guide-large-dogs", photographer: "George Pagan III", unsplashUrl: "https://unsplash.com/photos/a-large-brown-dog-laying-on-top-of-a-couch-tcAB9AAEJ4s" },
  { key: "guide-cabin-packing", photographer: "Jamie Pilgrim", unsplashUrl: "https://unsplash.com/photos/white-short-coated-dog-with-black-and-gray-harness-on-gray-rock-near-body-of-water-ERsd-sl6VOQ" },
  { key: "gear-car-safety", photographer: "Gary Samaha", unsplashUrl: "https://unsplash.com/photos/two-dogs-on-pet-bed-in-car-bsAfOX0WDsU" },
  { key: "gear-first-aid", photographer: "Declan Sun", unsplashUrl: "https://unsplash.com/photos/a-white-dog-wearing-a-purple-hoodie-and-yellow-boots-8Kms34hH06w" },
  { key: "gear-feeding", photographer: "Treddy Chen", unsplashUrl: "https://unsplash.com/photos/person-holding-green-water-dispenser-with-dog-drinking-on-it-F94kUL8aQGA" },
  { key: "gear-rental-protection", photographer: "Matthew Henry", unsplashUrl: "https://unsplash.com/photos/pug-covered-with-blanket-on-bedspread-2Ts5HnA67k8" },
  { key: "gear-portable-fence", photographer: "Leo_Visions", unsplashUrl: "https://unsplash.com/photos/a-brown-and-white-dog-standing-next-to-a-wire-fence-WiulP_LbXaA" },
  { key: "gear-id-tracking", photographer: "Lepeto", unsplashUrl: "https://unsplash.com/photos/vFHzS5cxhWY" },
];
