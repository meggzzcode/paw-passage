import type { ExampleImage } from "./PhotoFilterExamples";

/**
 * Keepsake examples, drawn by the real keepsake editor (scripts/demo/render-examples.mjs). The first six are made
 * from real, licensed dog photographs, shown beside the original photo; credits are in docs/IMAGE-CREDITS.md. The last
 * two (then-and-now, seasonal) are original illustrations, labelled as such, until licensed photos are added.
 * These are examples, not customer stories; the dog names on them are sample names. Files live in public/examples/.
 */
export const FILTER_EXAMPLES: readonly ExampleImage[] = [
  {
    src: "/examples/postcard.webp",
    alt: "A travel postcard keepsake made from a real photo of a brown dog standing on a snowy ridge with mountains behind",
    label: "Postcard",
    width: 560,
    height: 560,
    before: {
      src: "/examples/postcard-photo.webp",
      alt: "A brown dog standing on a snowy mountain ridge, the original photo",
      width: 620,
      height: 520,
    },
  },
  {
    src: "/examples/magazine.webp",
    alt: "A magazine cover keepsake with the headline COVER STAR, made from a real close-up photo of a chocolate Labrador looking up",
    label: "Magazine cover",
    width: 560,
    height: 700,
    before: {
      src: "/examples/magazine-photo.webp",
      alt: "A chocolate Labrador looking up with its mouth open, the original photo",
      width: 620,
      height: 520,
    },
  },
  {
    src: "/examples/detective.webp",
    alt: "A detective ID card keepsake made from a real photo of a black and tan dog sniffing a ball on grass",
    label: "Detective ID",
    width: 560,
    height: 700,
    before: {
      src: "/examples/detective-photo.webp",
      alt: "A black and tan dog sniffing a ball on a lawn, the original photo",
      width: 620,
      height: 520,
    },
  },
  {
    src: "/examples/birthday.webp",
    alt: "A birthday magazine cover keepsake reading Happy Birthday, made from a real photo of a golden dog sitting indoors",
    label: "Birthday cover",
    width: 560,
    height: 700,
    before: {
      src: "/examples/birthday-photo.webp",
      alt: "A golden dog sitting on a tiled floor next to plant pots, the original photo",
      width: 390,
      height: 520,
    },
  },
  {
    src: "/examples/certificate.webp",
    alt: "An achievement certificate keepsake titled Toy Champion, made from a real photo of a chocolate Labrador puppy",
    label: "Certificate",
    width: 560,
    height: 700,
    before: {
      src: "/examples/certificate-photo.webp",
      alt: "A chocolate Labrador puppy, the original photo",
      width: 520,
      height: 520,
    },
  },
  {
    src: "/examples/trading-card.webp",
    alt: "A collectible trading card keepsake titled Safari Explorer, made from a real photo of a cream golden retriever resting in a forest",
    label: "Trading card",
    width: 560,
    height: 700,
    before: {
      src: "/examples/trading-card-photo.webp",
      alt: "A cream golden retriever resting among forest plants, the original photo",
      width: 620,
      height: 520,
    },
  },
  {
    src: "/examples/then-and-now.webp",
    alt: "An illustration of a then-and-now keepsake showing a sample puppy and the same sample dog grown up",
    label: "Then and now (illustration)",
    width: 560,
    height: 560,
  },
  {
    src: "/examples/seasonal.webp",
    alt: "An illustration of an autumn seasonal frame keepsake titled Leaf Pile Day with a sample dog",
    label: "Seasonal frame (illustration)",
    width: 560,
    height: 700,
  },
];
