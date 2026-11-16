import type { Product } from "../gear";

// Specs below are copied from each maker's own product page (see specSource). Not tested by Paws & Passage.
export const products: Product[] = [
  {
    id: "orvis-grip-tight-furniture-protectors",
    name: "Grip-Tight Furniture Protectors",
    brand: "Orvis",
    summary:
      "A quilted, washable couch cover with a non-slip backing and a water-resistant membrane, sold in loveseat, couch and XL couch widths.",
    keySpecs: [
      "Sizes listed by sofa width: Loveseat 55 in W, Couch 70 in W, XL Couch 86 in W; all protectors have a 26 in seat depth",
      "Materials listed as post-consumer recycled polyester/polyester",
      "Described as having a breathable, water-resistant membrane (the page says water-resistant, not waterproof)",
      "Wraparound flap with non-slip Grip-Tight backing",
      "Machine washable (care label: machine wash)",
      "Quilted upholstery with a fur-masking microweave",
    ],
    specSource: {
      title: "Grip-Tight Furniture Protectors",
      url: "https://www.orvis.com/p/grip-tight-quilted-furniture-protector-with-zip-off-bolster/20NE",
      publisher: "Orvis",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "ruffwear-highlands-dog-pad",
    name: "Highlands Dog Pad",
    brand: "Ruffwear",
    summary:
      "A thin, foldable travel pad with a microsuede-style sleeping surface and a non-slip base, meant to give a dog a defined spot on the floor.",
    keySpecs: [
      "Medium flat: 23.6 in W x 33.25 in L; Large flat: 26.8 in W x 43.3 in L",
      "Folded: Medium 12 in x 5 in, Large 14 in x 6 in; loft 1 in",
      "Weight: Medium 0.75 lbs, Large 1.05 lbs",
      "Upper: 150D polyester suede (50% recycled) with nonfluorinated DWR; base: 600D polyester (100% recycled) with tacky TPE backing",
      "Non-slip waterproof base that creates a moisture barrier",
      "Care: hand wash, mild detergent, air dry",
    ],
    specSource: {
      title: "Highlands Dog Pad",
      url: "https://ruffwear.com/products/mt-bachelor-pad-dog-bed",
      publisher: "Ruffwear",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "ruffwear-dirtbag-seat-cover",
    name: "Dirtbag Dog Car Seat Cover",
    brand: "Ruffwear",
    summary:
      "A back-seat cover that works as a bench cover or a hammock, with a mesh window and zippers for seat-belt access.",
    keySpecs: [
      "Dimensions listed as 55 in wide x 63 in long",
      "Main shell: 300D polyester (100% recycled) with nonfluorinated DWR and tacky TPE backing",
      "Described as a durable, waterproof cover; no specific waterproof rating is given",
      "Convertible bench or hammock configuration; fits the backseat of most passenger vehicles; webbing loops wrap around headrests",
      "Two-way zippers for seat-belt access; bluesign approved mesh window",
      "Described as machine washable; care: remove straps, cold water, gentle cycle, mild detergent, hang dry",
      "The page makes no crash-safety or restraint claims",
    ],
    specSource: {
      title: "Dirtbag Dog Car Seat Cover",
      url: "https://www.ruffwear.com/products/dirtbag-seat-cover",
      publisher: "Ruffwear",
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
      "Care instructions are in a separate PDF that was not reviewed here",
    ],
    specSource: {
      title: "Heather Hammock",
      url: "https://www.kurgo.com/p/heather-hammock/K01598",
      publisher: "Kurgo",
      accessedOn: "2026-11-16",
    },
  },
];
