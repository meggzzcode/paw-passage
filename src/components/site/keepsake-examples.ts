import type { ExampleImage } from "./PhotoFilterExamples";

/**
 * Finished keepsakes drawn by the real keepsake renderer, using original sample art: an illustrated sample dog
 * ("Biscuit"), not a customer's dog. Files live in public/examples/.
 */
export const FILTER_EXAMPLES: readonly ExampleImage[] = [
  {
    src: "/examples/postcard.webp",
    alt: "A travel postcard keepsake: a sample illustrated dog named Biscuit at a lakeside picnic",
    label: "Postcard",
    width: 560,
    height: 560,
  },
  {
    src: "/examples/magazine.webp",
    alt: "A magazine cover keepsake titled The Slow Sniff Issue, with a sample illustrated dog",
    label: "Magazine cover",
    width: 560,
    height: 700,
  },
  {
    src: "/examples/detective.webp",
    alt: "A detective ID card keepsake for a sample dog named Biscuit",
    label: "Detective ID",
    width: 560,
    height: 700,
  },
  {
    src: "/examples/birthday.webp",
    alt: "A birthday magazine cover keepsake reading Biscuit Turns Five",
    label: "Birthday cover",
    width: 560,
    height: 700,
  },
  {
    src: "/examples/camping-patch.webp",
    alt: "A camping patch ticket keepsake for a backyard campout with a sample dog",
    label: "Camping patch",
    width: 560,
    height: 560,
  },
  {
    src: "/examples/then-and-now.webp",
    alt: "A then-and-now keepsake showing a sample puppy and the same sample dog grown up",
    label: "Then and now",
    width: 560,
    height: 560,
  },
  {
    src: "/examples/trading-card.webp",
    alt: "A trading card keepsake for a sample dog named Biscuit the Brave",
    label: "Trading card",
    width: 560,
    height: 700,
  },
  {
    src: "/examples/seasonal.webp",
    alt: "An autumn seasonal frame keepsake titled Leaf Pile Day with a sample dog",
    label: "Seasonal frame",
    width: 560,
    height: 700,
  },
];
