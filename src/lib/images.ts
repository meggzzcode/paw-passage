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

// Editorial stock photographs (Unsplash License), shown for illustration only and never as pictures of a specific rental.
// Photographer credits live in src/content/image-credits.ts.
export const images = {
  "hero-porch": { src: heroPorch, alt: "A person and a golden-coated dog on a wooden cabin deck looking out over misty, forested mountains" },
  "guide-ga-cabins": { src: gaCabins, alt: "A rustic wooden cabin behind a split-rail fence and a gate, surrounded by autumn trees and fallen leaves" },
  "guide-atlanta-getaways": { src: atlantaGetaways, alt: "A dog in a harness sitting on a granite outcrop beside hiking gear, looking out over green forested mountain ridges" },
  "guide-la-getaways": { src: laGetaways, alt: "A fluffy black dog sitting on white sand dunes under a bright sky with distant mountains" },
  "guide-ca-beach": { src: caBeach, alt: "A dog running along wet sand beside gentle waves, with a large coastal rock rising in the distance" },
  "guide-pet-fees": { src: petFees, alt: "A brown and white dog resting its paws on a wooden surface beside a closed laptop, with flowers in vases behind" },
  "guide-rental-checklist": { src: rentalChecklist, alt: "A small brown dog sitting on a porch doormat in front of a black door, looking up at a person whose face is not shown" },
  "guide-two-dogs": { src: twoDogs, alt: "Two dogs, one tan and one speckled, sitting side by side on green grass and looking happy" },
  "guide-fenced-yard": { src: fencedYard, alt: "A black dog resting its chin on a stone ledge and looking out from behind a metal fence among green leaves" },
  "guide-large-dogs": { src: largeDogs, alt: "A large brindle Great Dane lying on a couch in a living room with a stone fireplace" },
  "guide-cabin-packing": { src: cabinPacking, alt: "A large black, white and tan Bernese mountain dog wearing a blue pack, standing on a forest path" },
} as const;

export type ImageKey = keyof typeof images;
