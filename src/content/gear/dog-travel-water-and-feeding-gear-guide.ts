import type { Product } from "../gear";

// Specs below are copied from each maker's own product page (accessed 2026-11-16).
// No prices, ratings or testing claims are stored here.
export const products: Product[] = [
  {
    id: "kurgo-collaps-a-bowl",
    name: "Collaps A Bowl",
    brand: "Kurgo",
    summary: "A single collapsible silicone travel bowl for water or food that flattens for a bag or door pocket.",
    keySpecs: [
      "Holds 24 ounces",
      "Collapses to less than 1 inch high",
      "Food-grade silicone, described by the maker as PVC and BPA free",
      "Dishwasher safe on the top rack, per the maker",
      "Backed by the maker's Lifetime Guarantee (the page does not say what it covers)",
    ],
    specSource: {
      title: "Collaps A Bowl",
      url: "https://www.kurgo.com/pet-travel-bowls/collaps-a-bowl",
      publisher: "Kurgo",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "springland-22oz-original-travel-bottle",
    name: "22oz Original Travel Dog Water Bottle",
    brand: "Springland (formerly Springer)",
    summary: "A squeeze-to-fill water bottle with an attached bowl, designed to be operated with one hand.",
    keySpecs: [
      "Named 22oz; the page gives no separate capacity figure",
      "Squeeze to fill the attached bowl, release to drain the excess back into the bottle",
      "Food-safe, BPA-free polypropylene plastic; aluminum carabiner included",
      "Described by the maker as having a leak-proof lock design",
      "Dishwasher safe on the top rack only; hand washing with dish soap also listed",
    ],
    specSource: {
      title: "22oz Original Travel Dog Water Bottle",
      url: "https://springlandpets.com/products/22oz-classic-dog-travel-water-bottle",
      publisher: "Springland",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "springland-20oz-flip-travel-bottle",
    name: "20oz Flip Travel Dog Water Bottle",
    brand: "Springland (formerly Springer)",
    summary: "A squeeze-to-drink water bottle topped with a silicone bowl that flips up for drinking and folds down for storage.",
    keySpecs: [
      "Named 20oz; the page gives no separate capacity figure",
      "Silicone top bowl flips up to drink and folds down for compact storage",
      "Food-safe, BPA-free polypropylene plastic; aluminum carabiner included",
      "Described by the maker as having a leak-proof lock design",
      "Dishwasher safe on the top rack only; hand washing with dish soap also listed",
    ],
    specSource: {
      title: "20oz Flip Travel Dog Water Bottle",
      url: "https://springlandpets.com/products/20oz-flip-dog-travel-water-bottle",
      publisher: "Springland",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "vittles-vault-travel-tainer",
    name: "Vittles Vault Travel-Tainer Portable Food Storage Container",
    brand: "Vittles Vault (Gamma2 / Petmate)",
    summary: "A rigid food container with a sealing lid that comes with two bowls and a carry handle.",
    keySpecs: [
      "6-cup food container (the maker notes actual capacity depends on kibble shape and density)",
      "Comes with two 3-cup bowls, one for food and one for water, and a carry handle",
      "Described by the maker as made from BPA-free, food-grade plastic with an airtight seal",
      "Maker says the bowls are dishwasher safe but the clear food container is not",
    ],
    specSource: {
      title: "Vittles Vault Travel-Tainer Portable Food Storage Container",
      url: "https://www.petmate.com/vittles-vault-travel-trainer-portable-food-storage-container/product/4504",
      publisher: "Petmate",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "kurgo-kibble-carrier",
    name: "Kibble Carrier",
    brand: "Kurgo",
    summary: "A soft roll-top bag for carrying a few days of dry food, built for packing rather than long-term storage.",
    keySpecs: [
      "Holds up to 5 lbs of dry food, roughly 20 cups of average-sized kibble, per the maker",
      "Ripstop material with a food-safe PEVA liner and heat-sealed seams",
      "Roll-top closure that rolls and clips, with a simple buckle closure",
      "Hand wash, then air dry",
    ],
    specSource: {
      title: "Kibble Carrier",
      url: "https://www.kurgo.com/dog-travel/kibble-carrier",
      publisher: "Kurgo",
      accessedOn: "2026-11-16",
    },
  },
];
