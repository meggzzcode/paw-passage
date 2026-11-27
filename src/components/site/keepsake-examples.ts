import type { ExampleImage } from "./PhotoFilterExamples";

/**
 * Keepsake examples, drawn by the real keepsake renderer (scripts/demo/render-examples.mjs, Story format) from real
 * CC0 dog photographs, each shown beside the photo it was made from. Credits: docs/IMAGE-CREDITS.md. They are
 * examples, not customer stories; the dog names on them are sample names. Files live in public/examples/.
 *
 * Then and Now has no public photo example (no provable same-dog puppy and adult pair), so only its labelled
 * illustration remains, used by the free-visitor preview and never shown in the gallery.
 */
const COMMONS = "https://commons.wikimedia.org/wiki/File:";
const SAMPLE = { width: 540, height: 960 } as const;

export const FILTER_EXAMPLES: readonly ExampleImage[] = [
  {
    src: "/examples/birthday.webp",
    alt: "A birthday cover keepsake reading Happy Birthday over a close portrait of a smiling cream-coloured dog in warm backlight",
    label: "Birthday cover",
    ...SAMPLE,
    before: {
      src: "/examples/birthday-photo.webp",
      alt: "The photo it was made from, framed the same way: a smiling cream-coloured dog in warm backlight, taken at a beach",
      width: 360,
      height: 640,
    },
    credit: {
      author: "Samantha Scholl",
      url: `${COMMONS}Happy_dog_at_Anjuna_Beach_(Unsplash).jpg`,
    },
  },
  {
    src: "/examples/magazine.webp",
    alt: "A magazine cover keepsake with the headline Cover Star over a close portrait of a black curly-coated dog tilting its head",
    label: "Magazine cover",
    ...SAMPLE,
    before: {
      src: "/examples/magazine-photo.webp",
      alt: "The photo it was made from, framed the same way: a black curly-coated dog tilting its head, sitting on a pale sofa",
      width: 360,
      height: 640,
    },
    credit: { author: "Reid Campbell", url: `${COMMONS}Black_dog_head_tilt.jpg` },
  },
  {
    src: "/examples/detective.webp",
    alt: "A detective ID keepsake over a close photo of a tan and white dog with a curious look, lying in tall grass",
    label: "Detective ID",
    ...SAMPLE,
    before: {
      src: "/examples/detective-photo.webp",
      alt: "The photo it was made from, framed the same way: a tan and white dog with a curious look, lying in tall grass",
      width: 360,
      height: 640,
    },
    credit: {
      author: "Rodion Kutsaev",
      url: `${COMMONS}Earnest_dog_in_the_grass_(Unsplash).jpg`,
    },
  },
  {
    src: "/examples/postcard.webp",
    alt: "A travel postcard keepsake called Captain's Route over a photo of a white and ginger dog sitting happily on a sandy dune under a blue sky",
    label: "Travel postcard",
    ...SAMPLE,
    before: {
      src: "/examples/postcard-photo.webp",
      alt: "The photo it was made from, framed the same way: a white and ginger dog sitting on a sandy dune under a blue sky",
      width: 360,
      height: 640,
    },
    credit: {
      author: "Maxd2",
      url: `${COMMONS}Dog_smiling_at_the_camera_-_Reta,_Buenos_Aires,_Argentina_(04-01-2024).jpg`,
    },
  },
  {
    src: "/examples/certificate.webp",
    alt: "An achievement certificate keepsake titled Toy Champion over a photo of a golden Labrador looking up at the camera",
    label: "Achievement certificate",
    ...SAMPLE,
    before: {
      src: "/examples/certificate-photo.webp",
      alt: "The photo it was made from, framed the same way: a golden Labrador sitting on grass and looking up at the camera",
      width: 360,
      height: 640,
    },
    credit: { author: "Trashmut", url: `${COMMONS}Beautiful_Labrador_Retriever.jpg` },
  },
  {
    src: "/examples/seasonal.webp",
    alt: "A winter seasonal frame keepsake titled Winter Walk over a profile photo of a fluffy dog in a snowy forest",
    label: "Seasonal frame",
    ...SAMPLE,
    before: {
      src: "/examples/seasonal-photo.webp",
      alt: "The photo it was made from, framed the same way: a fluffy dog in profile in a snowy forest",
      width: 360,
      height: 640,
    },
    credit: { author: "Cam Adams", url: `${COMMONS}Dog_in_a_snowy_forest_(Unsplash).jpg` },
  },
  {
    src: "/examples/trading-card.webp",
    alt: "A collectible trading card keepsake titled Safari Explorer with a photo of a black and white dog sitting on grass",
    label: "Trading card",
    ...SAMPLE,
    before: {
      src: "/examples/trading-card-photo.webp",
      alt: "The photo it was made from, framed the same way: a black and white dog sitting on grass, looking at the camera",
      width: 360,
      height: 640,
    },
    credit: {
      author: "Uusijani",
      url: `${COMMONS}Karjalankarhukoira,_Karelian_Bear_Dog_looking_at_camera.jpg`,
    },
  },
  {
    src: "/examples/then-and-now.webp",
    alt: "An illustration of a then-and-now keepsake showing a sample puppy and the same sample dog grown up",
    label: "Then and now (illustration)",
    width: 560,
    height: 560,
    illustration: true,
  },
];

const byLabel = (...srcs: string[]): readonly ExampleImage[] =>
  srcs.flatMap((s) => FILTER_EXAMPLES.filter((e) => e.src === `/examples/${s}.webp`));

/** The home page shows a short, selective set of the strongest examples. */
export const HOME_EXAMPLES = byLabel("birthday", "magazine", "detective", "postcard");

/** The purchase page keeps a compact row of six. */
export const PURCHASE_EXAMPLES = byLabel(
  "birthday",
  "magazine",
  "detective",
  "postcard",
  "certificate",
  "seasonal",
);
