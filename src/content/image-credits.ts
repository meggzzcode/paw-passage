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
  { key: "guide-cabin-packing", photographer: "Christian Crocker", unsplashUrl: "https://unsplash.com/photos/REFa-Kh22KU" },
];
