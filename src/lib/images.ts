import heroPorch from "@/assets/hero-porch.jpg";
import gaCabins from "@/assets/guide-ga-cabins.jpg";
import atlantaGetaways from "@/assets/guide-atlanta-getaways.jpg";
import laGetaways from "@/assets/guide-la-getaways.jpg";
import caBeach from "@/assets/guide-ca-beach.jpg";
import petFees from "@/assets/guide-pet-fees.jpg";
import rentalChecklist from "@/assets/guide-rental-checklist.jpg";
import twoDogs from "@/assets/guide-two-dogs.jpg";
import fencedYard from "@/assets/guide-fenced-yard.jpg";
import largeDogs from "@/assets/guide-large-dogs.jpg";
import cabinPacking from "@/assets/guide-cabin-packing.jpg";
import gearCarSafety from "@/assets/gear-car-safety.jpg";
import gearFirstAid from "@/assets/gear-first-aid.jpg";
import gearFeeding from "@/assets/gear-feeding.jpg";
import gearRentalProtection from "@/assets/gear-rental-protection.jpg";
import gearPortableFence from "@/assets/gear-portable-fence.jpg";
import gearIdTracking from "@/assets/gear-id-tracking.jpg";

// Editorial stock photographs (Unsplash License), shown for illustration only and never as pictures of a specific rental.
// Photographer credits live in src/content/image-credits.ts.
export const images = {
  "hero-porch": { src: heroPorch, alt: "A person and a golden-coated dog on a wooden cabin deck looking out over misty, forested mountains" },
  "guide-ga-cabins": { src: gaCabins, alt: "Wooden cabins with mossy roofs among tall pines, with a low picket fence around the grassy yard in warm afternoon light" },
  "guide-atlanta-getaways": { src: atlantaGetaways, alt: "A dog in a harness sitting on a granite outcrop beside hiking gear, looking out over green forested mountain ridges" },
  "guide-la-getaways": { src: laGetaways, alt: "A hiker holding a retractable leash beside a small dog on a sunlit trail among boulders and desert scrub in the Mojave Desert, California" },
  "guide-ca-beach": { src: caBeach, alt: "A dog running along wet sand beside gentle waves, with a large coastal rock rising in the distance" },
  "guide-pet-fees": { src: petFees, alt: "A brown and white dog resting its paws on a wooden surface beside a closed laptop, with flowers in vases behind" },
  "guide-rental-checklist": { src: rentalChecklist, alt: "A small brown dog sitting on a porch doormat in front of a black door, looking up at a person whose face is not shown" },
  "guide-two-dogs": { src: twoDogs, alt: "Two dogs, one tan and one speckled, sitting side by side on green grass and looking happy" },
  "guide-fenced-yard": { src: fencedYard, alt: "A black dog resting its chin on a stone ledge and looking out from behind a metal fence among green leaves" },
  "guide-large-dogs": { src: largeDogs, alt: "A large brindle Great Dane lying on a couch in a living room with a stone fireplace" },
  "guide-cabin-packing": { src: cabinPacking, alt: "A black, white and tan collie-type dog lying beside a packed canvas duffel bag in the open back of a car" },
  "gear-car-safety": { src: gearCarSafety, alt: "A small tan dog and a small curly black dog, the black one in a harness, sitting together in a padded booster seat on the back seat of a car" },
  "gear-first-aid": { src: gearFirstAid, alt: "Close-up of a golden-brown dog's paws and pads resting on a sunlit wooden deck" },
  "gear-feeding": { src: gearFeeding, alt: "A small white dog in a bandana drinking from a bottle with an attached drinking spout held by a person whose face is not shown" },
  "gear-rental-protection": { src: gearRentalProtection, alt: "A pug wrapped in a soft tan throw blanket on a bed with white bedding" },
  "gear-portable-fence": { src: gearPortableFence, alt: "Black-and-white photo of a happy puppy standing inside a white wire exercise pen" },
  "gear-id-tracking": { src: gearIdTracking, alt: "Close-up of a dog's red leather collar with a brass buckle and a round brass ID tag, with a green blurred background outdoors" },
} as const;

export type ImageKey = keyof typeof images;

export type ResolvedImage = { src: string; card?: string; alt: string };

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
