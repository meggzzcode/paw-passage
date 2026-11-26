import gearCarSafety from "@/assets/gear-car-safety.jpg";
import gearCarSafetyCard from "@/assets/gear-car-safety-card.jpg";
import gearFirstAid from "@/assets/gear-first-aid.jpg";
import gearFirstAidCard from "@/assets/gear-first-aid-card.jpg";
import gearPortableFence from "@/assets/gear-portable-fence.jpg";
import gearPortableFenceCard from "@/assets/gear-portable-fence-card.jpg";
import guideRampSteps from "@/assets/guide-ramp-steps.jpg";
import guideRampStepsCard from "@/assets/guide-ramp-steps-card.jpg";
import guideLooseDog from "@/assets/guide-loose-dog.jpg";
import guideLooseDogCard from "@/assets/guide-loose-dog-card.jpg";
import guideDogLifeJacket from "@/assets/guide-dog-life-jacket.jpg";
import guideDogLifeJacketCard from "@/assets/guide-dog-life-jacket-card.jpg";
import guideTravelBowls from "@/assets/guide-travel-bowls.jpg";
import guideTravelBowlsCard from "@/assets/guide-travel-bowls-card.jpg";
import guideTwoLargeDogsCar from "@/assets/guide-two-large-dogs-car.jpg";
import guideTwoLargeDogsCarCard from "@/assets/guide-two-large-dogs-car-card.jpg";
import guideColdWeatherGear from "@/assets/guide-cold-weather-gear.jpg";
import guideColdWeatherGearCard from "@/assets/guide-cold-weather-gear-card.jpg";
import guideDogHikingGear from "@/assets/guide-dog-hiking-gear.jpg";
import guideDogHikingGearCard from "@/assets/guide-dog-hiking-gear-card.jpg";
import guideKeepDogCool from "@/assets/guide-keep-dog-cool.jpg";
import guideKeepDogCoolCard from "@/assets/guide-keep-dog-cool-card.jpg";
import guideProtectCarInterior from "@/assets/guide-protect-car-interior.jpg";
import guideProtectCarInteriorCard from "@/assets/guide-protect-car-interior-card.jpg";
import guidePackingListBoots from "@/assets/guide-packing-list-boots.jpg";
import guidePackingListBootsCard from "@/assets/guide-packing-list-boots-card.jpg";

// Editorial stock photographs (Unsplash License), shown for illustration only.
type StockImage = { src: string; card?: string; tile?: string; alt: string };

const stockImages = {
  "gear-car-safety": {
    src: gearCarSafety,
    card: gearCarSafetyCard,
    alt: "A beagle mix wearing a pink car harness over a sweater, sitting in a car and looking out of the window",
  },
  "gear-first-aid": {
    src: gearFirstAid,
    card: gearFirstAidCard,
    alt: "An open orange first aid bag laid out on concrete, with bandages, gauze, tape, sprays and bottles in clear and mesh pockets",
  },
  "gear-portable-fence": {
    src: gearPortableFence,
    card: gearPortableFenceCard,
    alt: "A fluffy brown-and-white dog smiling at the camera from the grass behind a white portable mesh fence",
  },
  "guide-ramp-steps": {
    src: guideRampSteps,
    card: guideRampStepsCard,
    alt: "A brindle and white dog sitting in the open rear cargo area of a white SUV with a dog guard, in the snow",
  },
  "guide-loose-dog": {
    src: guideLooseDog,
    card: guideLooseDogCard,
    alt: "A brown German wirehaired pointer with its tongue out, wearing an orange collar with a green tag and attached to a leash, outdoors in front of dry brush",
  },
  "guide-dog-life-jacket": {
    src: guideDogLifeJacket,
    card: guideDogLifeJacketCard,
    alt: "A small tan and white fluffy dog with its mouth open, wearing a teal life jacket and standing on the carpeted deck of a pontoon boat, with a lake and tree-lined shore behind it under a blue sky",
  },
  "guide-travel-bowls": {
    src: guideTravelBowls,
    card: guideTravelBowlsCard,
    alt: "A tan and white corgi in a teal harness licking its lips and splashing water beside an orange collapsible silicone bowl on a granite rock outdoors, with grass, boulders and a blue sky with clouds behind",
  },
  "guide-two-large-dogs-car": {
    src: guideTwoLargeDogsCar,
    card: guideTwoLargeDogsCarCard,
    alt: "Two large long-haired rough collies, one sitting upright with its mouth open and one lying down, in the open rear cargo area of a parked gray SUV with the tailgate raised, on a black cargo liner",
  },
  "guide-cold-weather-gear": {
    src: guideColdWeatherGear,
    card: guideColdWeatherGearCard,
    alt: "A reddish-brown dog in a pink quilted jacket with black stripes running through bright snow with a ball in its mouth and snow on its muzzle",
  },
  "guide-dog-hiking-gear": {
    src: guideDogHikingGear,
    card: guideDogHikingGearCard,
    alt: "A white, black and tan border collie type dog in an orange harness and collar sitting upright on a rocky mountain path, with a barren slope behind it",
  },
  "guide-keep-dog-cool": {
    src: guideKeepDogCool,
    card: guideKeepDogCoolCard,
    alt: "A tan dog with floppy ears licking water from a shallow teal basin in the shade beside a tree trunk, with green leaves and stones around it",
  },
  "guide-protect-car-interior": {
    src: guideProtectCarInterior,
    card: guideProtectCarInteriorCard,
    alt: "A black pug with its front paws over the rear seat back and a fawn pug in a harness sitting beside it, both looking toward the camera from the back seat of a car with beige upholstery",
  },
  "guide-packing-list-boots": {
    src: guidePackingListBoots,
    card: guidePackingListBootsCard,
    alt: "A golden retriever in a black harness and red-and-black protective dog boots lying on a wooden bench in the sun, panting happily",
  },
} as const satisfies Record<string, StockImage>;

export const images: { [K in keyof typeof stockImages]: StockImage } = stockImages;

export type ImageKey = keyof typeof stockImages;

export type ResolvedImage = StockImage;

/** The photo for a guide: an uploaded file if there is one, otherwise a built-in photo by name. */
export function guideHero(g: {
  heroImage?: string;
  heroUpload?: string;
  heroAlt?: string;
  title: string;
}): ResolvedImage {
  if (g.heroUpload) return { src: g.heroUpload, alt: g.heroAlt || g.title };
  const found = g.heroImage ? (images as Record<string, ResolvedImage>)[g.heroImage] : undefined;
  if (!found)
    throw new Error(
      `Guide "${g.title}" uses a built-in image called "${g.heroImage}" that does not exist.`,
    );
  return found;
}

// 800 px phone variants (made by scripts/optimize-images.py), emitted with hashed names by Vite.
const phoneVariants = import.meta.glob("../assets/*-800.jpg", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

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
