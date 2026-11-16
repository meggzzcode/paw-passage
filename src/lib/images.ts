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
  "guide-cabin-packing": { src: cabinPacking, alt: "A white dog on a leash wearing a grey and charcoal saddlebag-style pack, standing on a boulder beside a mountain lake" },
  "gear-car-safety": { src: gearCarSafety, alt: "A small tan dog and a small curly black dog, the black one in a harness, sitting together in a padded booster seat on the back seat of a car" },
  "gear-first-aid": { src: gearFirstAid, alt: "A small fluffy white dog in a purple hoodie and yellow protective boots standing on rocks and fallen leaves on a forest trail" },
  "gear-feeding": { src: gearFeeding, alt: "A small white dog in a bandana drinking from a bottle with an attached drinking spout held by a person whose face is not shown" },
  "gear-rental-protection": { src: gearRentalProtection, alt: "A pug wrapped in a soft tan throw blanket on a bed with white bedding" },
  "gear-portable-fence": { src: gearPortableFence, alt: "A fluffy brown-and-white dog smiling at the camera from the grass behind a white portable mesh fence" },
  "gear-id-tracking": { src: gearIdTracking, alt: "Close-up of a dog's red leather collar with a brass buckle and a round brass ID tag, with a green blurred background outdoors" },
} as const;

export type ImageKey = keyof typeof images;
