import heroPorch from "@/assets/hero-porch.jpg";
import mountainCabin from "@/assets/mountain-cabin.jpg";
import beach from "@/assets/beach.jpg";
import fencedYard from "@/assets/fenced-yard.jpg";
import twoDogs from "@/assets/two-dogs.jpg";
import largeDog from "@/assets/large-dog.jpg";
import packing from "@/assets/packing.jpg";
import roadTrip from "@/assets/road-trip.jpg";
import fees from "@/assets/fees.jpg";
import coastBluff from "@/assets/coast-bluff.jpg";

// Editorial scene images (generated illustrations of travel settings, never of a real rental).
export const images = {
  "hero-porch": { src: heroPorch, alt: "A golden retriever resting on a cabin porch above misty mountains at sunset" },
  "mountain-cabin": { src: mountainCabin, alt: "A wooden cabin with a split-rail fence in an autumn forest" },
  beach: { src: beach, alt: "A black Labrador walking along a wide beach below coastal bluffs" },
  "fenced-yard": { src: fencedYard, alt: "A border collie sitting behind a latched wooden gate in a grassy yard" },
  "two-dogs": { src: twoDogs, alt: "A beagle and a shepherd mix sitting together on a lakeside deck" },
  "large-dog": { src: largeDog, alt: "A Great Dane lying on a rug in front of a stone fireplace" },
  packing: { src: packing, alt: "A leash, travel bowl, blanket, first-aid kit and food container laid out for a trip" },
  "road-trip": { src: roadTrip, alt: "A terrier mix looking out of a car window on a winding country road" },
  fees: { src: fees, alt: "A notebook, coffee and a dog collar on a cottage kitchen table" },
  "coast-bluff": { src: coastBluff, alt: "A person walking a small dog on a fenced bluff trail above the ocean" },
} as const;

export type ImageKey = keyof typeof images;
