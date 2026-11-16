import type { Product } from "../gear";

// Specs below are copied from each maker's own page (accessed 2026-11-16). No prices, ratings or
// testing claims. Where a maker does not state something (weight, dog size), it is left out.
export const products: Product[] = [
  {
    id: "midwest-exercise-pen-with-door",
    name: "MidWest Exercise Pen with Door",
    brand: "MidWest Homes for Pets",
    summary:
      "A folding wire exercise pen with a latched door that sets up as a freestanding enclosure indoors or outdoors.",
    keySpecs: [
      "Instructions cover model numbers 550-24DR, 552-30DR, 554-36DR, 556-42DR and 558-48DR (24 to 48 size designations)",
      "8 connected panels",
      "Includes 8 ground anchors, 8 corner stabilizers and 4 snaps",
      "Corner stabilizers can be placed on the bottom of the pen as floor protectors",
      "Door closes with two slide-bolt latches plus a safety clip for added security",
      "Maker says a pet not trained to be restricted may attempt to escape, which could cause serious injury to the pet or the product",
      "Maker says to remove collars, tags and leads before placing a pet inside, and not to leave young animals unsupervised for extended periods",
    ],
    specSource: {
      title: "Assembly Instructions for Model Number 550-24DR, 552-30DR, 554-36DR, 556-42DR, 558-48DR",
      url: "https://www.midwesthomes4pets.com/wp-content/uploads/ExPen_550DR_Eng.pdf",
      publisher: "MidWest Homes for Pets",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "north-states-petyard-passage-8-panel",
    name: "MyPet Petyard Passage 8-Panel",
    brand: "North States",
    summary:
      "A lightweight plastic play yard of eight pre-connected panels, meant to be used as a freestanding enclosure.",
    keySpecs: [
      "Each panel is 26 inches high and 32 inches wide",
      "Eight interlocking panels, pre-connected",
      "Encloses up to 34.4 square feet, almost 7 feet across corner to corner",
      "Material: plastic",
      "Door is 9.5 x 8 inches and locks for containment",
      "Maker says not to use more than 8 panels at once and to use only square or octagon shapes",
      "Maker says model 8799 should not be used as a barrier and is only intended as a freestanding enclosure",
      "Maker says folding the panels the wrong way risks cracking the plastic",
      "Maker describes it as perfect for households with puppies or multiple pets; no weight or dog-size limit is stated",
    ],
    specSource: {
      title: "North States MyPet Petyard Passage 8-Panel",
      url: "https://northstatesind.com/north-states-mypet-petyard-passage-8-panel/",
      publisher: "North States",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "carlson-extra-wide-walk-thru-gate-0930",
    name: "Extra Wide Walk-Thru Pet Gate with Small Pet Door (#0930 PW)",
    brand: "Carlson Pet Products",
    summary:
      "A 30-inch steel walk-through gate that pressure-mounts in a doorway or hallway opening.",
    keySpecs: [
      "30 inches tall",
      "Expands to fit openings from 29 to 36.5 inches wide",
      "Fits 29 to 32 inches without the extension and 34 to 36.5 inches with the included 4-inch extension; does not fit spaces between 32 and 34 inches",
      "Adjustable pressure mounts by default; wall cups for hardware mounting are also included",
      "Walk-thru door opening is 16.5 inches; small pet door is 7.5 inches wide by 7.75 inches high",
      "100 percent steel frame",
      "Manufacturer's limited 6-month warranty",
      "No weight limit or pet-size limit is listed on the page",
    ],
    specSource: {
      title: "Carlson Extra Wide Walk-Thru Pet Gate (white)",
      url: "https://carlsonpetproducts.com/products/extra-wide-walk-thru-pet-gate-white",
      publisher: "Carlson Pet Products",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "carlson-36-extra-tall-walk-thru-gate",
    name: "36\" Extra Tall Walk-Thru Pet Gate (#0941 PW)",
    brand: "Carlson Pet Products",
    summary:
      "A 36-inch steel walk-through gate aimed at taller or more active dogs, with included hardware for wall mounting.",
    keySpecs: [
      "36 inches tall",
      "Full dimensions 29 to 36.5 inches; fits 29 to 31 inches without the included 4-inch extension and 34 to 36.5 inches with it; does not fit spaces between 31 and 34 inches",
      "Page states hardware is included for required wall mounting, alongside a pressure mount system with wall cups",
      "Door opening width is 16.5 inches; small pet door is 7.5 inches wide by 7.75 inches high",
      "100 percent steel frame",
      "Maker describes it as ideal for larger or active dogs and for taller dogs or any pet that tends to jump over traditional gates",
      "Manufacturer's limited 6-month warranty",
    ],
    specSource: {
      title: "Carlson 36\" Extra Tall Walk-Thru Pet Gate (white)",
      url: "https://carlsonpetproducts.com/products/36-extra-tall-walk-thru-pet-gate-white",
      publisher: "Carlson Pet Products",
      accessedOn: "2026-11-16",
    },
  },
  {
    id: "carlson-design-paw-freestanding-gate",
    name: "Design Paw Extra Wide Freestanding Pet Gate",
    brand: "Carlson Pet Products",
    summary:
      "A low, freestanding wood-and-metal gate that expands across an opening without wall mounting.",
    keySpecs: [
      "20 inches tall",
      "Width 41 to 70 inches",
      "Freestanding design that eliminates the need for wall mounting or drilling",
      "Made from wood and black metal",
      "Maker says it is specifically designed for puppies and toy breeds",
      "Gap width between bars is 2 to 2.5 inches",
      "Does not have extensions",
    ],
    specSource: {
      title: "Carlson Design Paw Extra Wide Freestanding Pet Gate",
      url: "https://carlsonpetproducts.com/products/design-paw-extra-wide-freestanding-pet-gate",
      publisher: "Carlson Pet Products",
      accessedOn: "2026-11-16",
    },
  },
];
