import heroPorch from "@/assets/hero-porch.jpg";
import gaCabins from "@/assets/guide-ga-cabins.jpg";
import gaCabinsCard from "@/assets/guide-ga-cabins-card.jpg";
import atlantaGetaways from "@/assets/guide-atlanta-getaways.jpg";
import atlantaGetawaysCard from "@/assets/guide-atlanta-getaways-card.jpg";
import laGetaways from "@/assets/guide-la-getaways.jpg";
import laGetawaysCard from "@/assets/guide-la-getaways-card.jpg";
import caBeach from "@/assets/guide-ca-beach.jpg";
import caBeachCard from "@/assets/guide-ca-beach-card.jpg";
import petFees from "@/assets/guide-pet-fees.jpg";
import petFeesCard from "@/assets/guide-pet-fees-card.jpg";
import rentalChecklist from "@/assets/guide-rental-checklist.jpg";
import rentalChecklistCard from "@/assets/guide-rental-checklist-card.jpg";
import twoDogs from "@/assets/guide-two-dogs.jpg";
import twoDogsCard from "@/assets/guide-two-dogs-card.jpg";
import fencedYard from "@/assets/guide-fenced-yard.jpg";
import fencedYardCard from "@/assets/guide-fenced-yard-card.jpg";
import largeDogs from "@/assets/guide-large-dogs.jpg";
import largeDogsCard from "@/assets/guide-large-dogs-card.jpg";
import cabinPacking from "@/assets/guide-cabin-packing.jpg";
import cabinPackingCard from "@/assets/guide-cabin-packing-card.jpg";
import gearCarSafety from "@/assets/gear-car-safety.jpg";
import gearCarSafetyCard from "@/assets/gear-car-safety-card.jpg";
import gearFirstAid from "@/assets/gear-first-aid.jpg";
import gearFirstAidCard from "@/assets/gear-first-aid-card.jpg";
import gearFeeding from "@/assets/gear-feeding.jpg";
import gearFeedingCard from "@/assets/gear-feeding-card.jpg";
import gearRentalProtection from "@/assets/gear-rental-protection.jpg";
import gearRentalProtectionCard from "@/assets/gear-rental-protection-card.jpg";
import gearPortableFence from "@/assets/gear-portable-fence.jpg";
import gearPortableFenceCard from "@/assets/gear-portable-fence-card.jpg";
import gearIdTracking from "@/assets/gear-id-tracking.jpg";
import gearIdTrackingCard from "@/assets/gear-id-tracking-card.jpg";
import guideAirbnbVrbo from "@/assets/guide-airbnb-vrbo.jpg";
import guideAirbnbVrboCard from "@/assets/guide-airbnb-vrbo-card.jpg";
import guideHowManyDogs from "@/assets/guide-how-many-dogs.jpg";
import guideHowManyDogsCard from "@/assets/guide-how-many-dogs-card.jpg";
import guideNoPetsRental from "@/assets/guide-no-pets-rental.jpg";
import guideNoPetsRentalCard from "@/assets/guide-no-pets-rental-card.jpg";
import guideNye from "@/assets/guide-nye.jpg";
import guideNyeCard from "@/assets/guide-nye-card.jpg";
import guideAlone from "@/assets/guide-alone.jpg";
import guideAloneCard from "@/assets/guide-alone-card.jpg";
import guideBreed from "@/assets/guide-breed.jpg";
import guideBreedCard from "@/assets/guide-breed-card.jpg";
import guideSenior from "@/assets/guide-senior.jpg";
import guideSeniorCard from "@/assets/guide-senior-card.jpg";
import guideDamageCharge from "@/assets/guide-damage-charge.jpg";
import guideDamageChargeCard from "@/assets/guide-damage-charge-card.jpg";
import guideNoPetFee from "@/assets/guide-no-pet-fee.jpg";
import guideNoPetFeeCard from "@/assets/guide-no-pet-fee-card.jpg";
import guideChristmasWeek from "@/assets/guide-christmas-week.jpg";
import guideChristmasWeekCard from "@/assets/guide-christmas-week-card.jpg";

// Editorial stock photographs (Unsplash License), shown for illustration only and never as pictures of a specific rental.
// Photographer credits live in src/content/image-credits.ts.
type StockImage = { src: string; card?: string; alt: string };

const stockImages = {
  "hero-porch": { src: heroPorch, alt: "A golden retriever resting on a cabin porch above misty mountains at sunset" },
  "guide-ga-cabins": { src: gaCabins, card: gaCabinsCard, alt: "Wooden cabins with mossy roofs among tall pines, with a low picket fence around the grassy yard in warm afternoon light" },
  "guide-atlanta-getaways": { src: atlantaGetaways, card: atlantaGetawaysCard, alt: "A dog in a harness sitting on a granite outcrop beside hiking gear, looking out over green forested mountain ridges" },
  "guide-la-getaways": { src: laGetaways, card: laGetawaysCard, alt: "A hiker holding a retractable leash beside a small dog on a sunlit trail among boulders and desert scrub in the Mojave Desert, California" },
  "guide-ca-beach": { src: caBeach, card: caBeachCard, alt: "A dog running along wet sand beside gentle waves, with a large coastal rock rising in the distance" },
  "guide-pet-fees": { src: petFees, card: petFeesCard, alt: "A brown and white dog resting its paws on a wooden surface beside a closed laptop, with flowers in vases behind" },
  "guide-rental-checklist": { src: rentalChecklist, card: rentalChecklistCard, alt: "A small brown dog sitting on a porch doormat in front of a black door, looking up at a person whose face is not shown" },
  "guide-two-dogs": { src: twoDogs, card: twoDogsCard, alt: "Two dogs, one tan and one speckled, sitting side by side on green grass and looking happy" },
  "guide-fenced-yard": { src: fencedYard, card: fencedYardCard, alt: "A black dog resting its chin on a stone ledge and looking out from behind a metal fence among green leaves" },
  "guide-large-dogs": { src: largeDogs, card: largeDogsCard, alt: "A large brindle Great Dane lying on a couch in a living room with a stone fireplace" },
  "guide-cabin-packing": { src: cabinPacking, card: cabinPackingCard, alt: "A white dog on a leash wearing a grey and charcoal saddlebag-style pack, standing on a boulder beside a mountain lake" },
  "gear-car-safety": { src: gearCarSafety, card: gearCarSafetyCard, alt: "A small tan dog and a small curly black dog, the black one in a harness, sitting together in a padded booster seat on the back seat of a car" },
  "gear-first-aid": { src: gearFirstAid, card: gearFirstAidCard, alt: "A small fluffy white dog in a purple hoodie and yellow protective boots standing on rocks and fallen leaves on a forest trail" },
  "gear-feeding": { src: gearFeeding, card: gearFeedingCard, alt: "A small white dog in a bandana drinking from a bottle with an attached drinking spout held by a person whose face is not shown" },
  "gear-rental-protection": { src: gearRentalProtection, card: gearRentalProtectionCard, alt: "A pug wrapped in a soft tan throw blanket on a bed with white bedding" },
  "gear-portable-fence": { src: gearPortableFence, card: gearPortableFenceCard, alt: "A fluffy brown-and-white dog smiling at the camera from the grass behind a white portable mesh fence" },
  "gear-id-tracking": { src: gearIdTracking, card: gearIdTrackingCard, alt: "Close-up of a dog's red leather collar with a brass buckle and a round brass ID tag, with a green blurred background outdoors" },
  "guide-airbnb-vrbo": { src: guideAirbnbVrbo, card: guideAirbnbVrboCard, alt: "A merle dachshund puppy resting its chin on a laptop keyboard and looking up at the glowing screen" },
  "guide-how-many-dogs": { src: guideHowManyDogs, card: guideHowManyDogsCard, alt: "Three dogs, two Australian shepherds and a Cavalier King Charles spaniel, together on a wooden platform at sunset" },
  "guide-no-pets-rental": { src: guideNoPetsRental, card: guideNoPetsRentalCard, alt: "A black dog resting in a window opening of a weathered log cabin wall in warm light, with snow below" },
  "guide-nye": { src: guideNye, card: guideNyeCard, alt: "A shaggy gray-brown dog asleep on a blanketed chair in front of a Christmas tree glowing with warm string lights" },
  "guide-alone": { src: guideAlone, card: guideAloneCard, alt: "A slim brindle dog in a blue coat sleeping alone on a tan leather sofa beside a bright window" },
  "guide-breed": { src: guideBreed, card: guideBreedCard, alt: "Close portrait of a black and tan Rottweiler with its mouth open in a relaxed smile, with soft blurred water behind" },
  "guide-senior": { src: guideSenior, card: guideSeniorCard, alt: "An older black Labrador with a graying muzzle resting its head on the arm of a couch, looking calm and sleepy" },
  "guide-damage-charge": { src: guideDamageCharge, card: guideDamageChargeCard, alt: "A fluffy golden-tan dog sitting in the open back of a packed car, with suitcases, bags and a cooler loaded behind it, ready to head home" },
  "guide-no-pet-fee": { src: guideNoPetFee, card: guideNoPetFeeCard, alt: "A Shiba Inu puppy peeking out of a mesh travel carrier, ready to go on a trip" },
  "guide-christmas-week": { src: guideChristmasWeek, card: guideChristmasWeekCard, alt: "A chocolate Labrador with a coral collar standing chest-deep in fresh snow, looking up with its mouth open in front of a snowy wood" },
} as const satisfies Record<string, StockImage>;

export const images: { [K in keyof typeof stockImages]: StockImage } = stockImages;

export type ImageKey = keyof typeof stockImages;

export type ResolvedImage = StockImage;

/** The photo for a guide: an uploaded file if there is one, otherwise a built-in photo by name. */
export function guideHero(g: { heroImage?: string; heroUpload?: string; heroAlt?: string; title: string }): ResolvedImage {
  if (g.heroUpload) return { src: g.heroUpload, alt: g.heroAlt || g.title };
  const found = g.heroImage ? (images as Record<string, ResolvedImage>)[g.heroImage] : undefined;
  if (!found) throw new Error(`Guide "${g.title}" uses a built-in image called "${g.heroImage}" that does not exist.`);
  return found;
}

/** The photo for a stay (same rule). */
export function stayPhoto(s: { image?: string; imageUpload?: string; name: string }): ResolvedImage {
  if (s.imageUpload) return { src: s.imageUpload, alt: `Photo of ${s.name}` };
  const found = s.image ? (images as Record<string, ResolvedImage>)[s.image] : undefined;
  if (!found) throw new Error(`Stay "${s.name}" uses a built-in image called "${s.image}" that does not exist.`);
  return found;
}

// 800 px phone variants (made by scripts/optimize-images.py), emitted with hashed names by Vite.
const phoneVariants = import.meta.glob("../assets/*-800.jpg", { eager: true, query: "?url", import: "default" }) as Record<string, string>;

/** URL of the 800 px-wide variant for a built-in photo, if one exists. */
export function phoneSrcFor(key: ImageKey): string | undefined {
  return phoneVariants[`../assets/${key}-800.jpg`];
}

/** `srcSet` string ("... 800w, ... 1600w") for a built-in photo; undefined when there is no phone variant. */
export function srcSetFor(key: ImageKey): string | undefined {
  const small = phoneSrcFor(key);
  return small ? `${small} 800w, ${images[key].src} 1600w` : undefined;
}

/** Same as srcSetFor but takes a loose key string (e.g. a guide's heroImage field) and ignores unknown keys. */
export function srcSetForKey(key: string | undefined): string | undefined {
  return key && key in images ? srcSetFor(key as ImageKey) : undefined;
}

/** Suggested `sizes` for full-width article/hero images (page column is at most about 760 px on desktop). */
export const HERO_SIZES = "(max-width: 800px) 100vw, 800px";
