import type { Product } from "../gear";

// Specs below are copied from each maker's own product page (see specSource). Not tested by Paws & Passage.
// Availability was checked on 2026-11-16 (each page showed an Add to Cart button) and changes.
export const products: Product[] = [
  {
    id: "orvis-embossed-sherpa-throw",
    name: "Embossed Sherpa Throw",
    brand: "Orvis",
    summary:
      "A two-layer sherpa fleece throw, sold as a general throw rather than a fitted cover, that can be laid over a sofa or chair where the host allows dogs on it.",
    keySpecs: [
      "Size listed as 40 in x 40 in",
      "Two-layer sherpa fleece construction with polyester and leather trim; the reverse side is solid fleece",
      "Care listed as machine wash; no other washing details are given",
      "No waterproof or water-resistant claim is listed on the page",
    ],
    specSource: {
      title: "Embossed Sherpa Throw",
      url: "https://www.orvis.com/product/embossed-sherpa-throw/28F4.html",
      publisher: "Orvis",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "kurgo-loft-wander-dog-bed",
    name: "Loft Wander Dog Bed",
    brand: "Kurgo",
    summary:
      "A roll-up travel bed with a water-resistant ripstop top and a waterproof, non-slip bottom, meant to give a dog its own spot away from home.",
    keySpecs: [
      "Medium open: 27 in x 36 in x 2 in, rolled up 12.5 in x 8 in; Large open: 36 in x 48 in x 3 in, rolled up 17 in x 9.5 in",
      "Upper made with Microtomic ripstop fabric; waterproof bottom made with Rufftex material; filled with 140g Polytech fiber fill",
      "Nonslip bottom",
      "Rolls into a compact bundle; has a handle for toting",
      "Care: wash by hand or machine on a gentle cycle, cold water, mild detergent, no bleach, hang dry",
      "No weight is listed on the page",
    ],
    specSource: {
      title: "Loft Wander Dog Bed",
      url: "https://www.kurgo.com/p/tago-bed/K81022",
      publisher: "Kurgo",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "kurgo-heather-hammock",
    name: "Heather Hammock",
    brand: "Kurgo",
    summary:
      "A bench-seat hammock cover with a center zipper that folds back to free half the seat for a human passenger.",
    keySpecs: [
      "Size: 55 in wide x 56 in long; may not fit large trucks or SUVs",
      "Described as waterproof and stain resistant; no material composition is listed on the page",
      "Attaches at eight points, with Bench Beans anchors and under-seat paracord",
      "Hook-and-loop openings to access seatbelts and latch systems",
      "Center zipper folds back half so a person can sit in the back",
      "Designed for vehicles with bench seats; do not use with bucket seats or over an open space without a bench seat",
      "Care, from the linked instructions PDF: washing by hand and hang air-drying is the best way to care for Kurgo products",
    ],
    specSource: {
      title: "Heather Hammock",
      url: "https://www.kurgo.com/p/heather-hammock/K01598",
      publisher: "Kurgo",
      accessedOn: "2026-11-16",
    },
  },
];
