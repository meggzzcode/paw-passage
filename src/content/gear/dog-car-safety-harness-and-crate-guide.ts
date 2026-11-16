import type { Product } from "../gear";

// Specs below come only from each product's specSource. No prices or ratings are stored here.
export const products: Product[] = [
  {
    id: "sleepypod-clickit-range",
    name: "Clickit Range Crash-Tested Harness",
    brand: "Sleepypod",
    summary:
      "A vest-style car harness that threads onto a rear-seat seat belt and is built for larger dogs and deep-chested builds.",
    keySpecs: [
      "Sizes Small to 2X-Large, each offered in Regular and Long fits",
      "Maker states it is rated up to 110 lbs by the Center for Pet Safety",
      "Three-point design for the rear passenger seat that connects to a vehicle seat belt",
      "Includes an S-Clip and a Buckle Shield",
      "Maker warns it should not be used with non-Sleepypod accessories",
    ],
    specSource: {
      title: "Clickit Range Crash-Tested Harness",
      url: "https://sleepypod.com/products/clickit-range",
      publisher: "Sleepypod",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "sleepypod-atom",
    name: "Atom Crash-Tested Carrier",
    brand: "Sleepypod",
    summary:
      "A soft, fold-flat carrier that doubles as a car seat for very small dogs, with a safety tether inside.",
    keySpecs: [
      "Maker states it is rated to 12 lbs (5.5 kg) by the Center for Pet Safety",
      "Mesh panels on three sides and plush bedding",
      "Folds flat for storage",
      "Includes a safety tether to prevent escapes",
      "Maker warns it should not be used with non-Sleepypod accessories",
    ],
    specSource: {
      title: "Sleepypod Atom Crash-Tested Carrier",
      url: "https://sleepypod.com/products/atom",
      publisher: "Sleepypod",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "gunner-g1-kennel",
    name: "G1 Kennel",
    brand: "GUNNER",
    summary:
      "A double-walled hard kennel with built-in tie-down pins, designed to be anchored in a vehicle with separately sold straps.",
    keySpecs: [
      "Small (up to 30 lbs), Medium (up to 45 lbs), Intermediate (up to 70 lbs) and Large (71+ lbs)",
      "Medium interior 25 x 18 x 19.75 in; Intermediate interior 30 x 18 x 25 in",
      "Kennel weight 38 lbs (Medium) and 48 lbs (Intermediate)",
      "Maker states the Small, Medium and Intermediate sizes are crash tested per the Center for Pet Safety; the Large is not listed as certified",
      "Tie-down straps are a separate add-on that the maker recommends for its crash-test rating",
      "Built-in stainless-steel tie-down pins",
    ],
    specSource: {
      title: "G1 Kennel",
      url: "https://www.gunner.com/products/g1-kennel",
      publisher: "GUNNER Kennels",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "lucky-duck-lucky-kennel",
    name: "Lucky Kennel",
    brand: "Lucky Duck",
    summary:
      "A hard-sided travel kennel with integrated tie-downs, sold in Medium, Intermediate and Large, with a ratchet strap kit sold separately.",
    keySpecs: [
      "Medium recommended for dogs under 50 lbs; Intermediate under 70 lbs; Large 70 to 110 lbs",
      "Interior dimensions: Medium 24 x 18 x 17 in; Intermediate 30.25 x 20.5 x 22 in; Large 35.75 x 22 x 26.5 in",
      "Kennel weight 27 lbs (Medium), 38 lbs (Intermediate), 45 lbs (Large)",
      "Maker states it is crash-test rated by the Center for Pet Safety",
      "Integrated powder-coated tie-downs",
      "Maker suggests pairing it with the Lucky Ratchet Strap Kit (set of 4), sold separately",
      "Listed dimensions are for travel use; the maker suggests sizing up for in-home use",
    ],
    specSource: {
      title: "Lucky Kennel",
      url: "https://www.luckyduck.com/products/lucky-kennel",
      publisher: "Lucky Duck",
      accessedOn: "2026-11-16",
    },
  },
];
