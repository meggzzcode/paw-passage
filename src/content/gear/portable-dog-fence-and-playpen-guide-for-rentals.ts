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
      "Corner stabilizers can be placed on the bottom of the pen as floor protectors; manual says all 8 on top gives maximum stability, every other one on the bottom mixes stability and floor protection, and all 8 on the bottom is floor protection only",
      "Door closes with two slide-bolt latches plus a safety clip for added security",
      "Maker says a pet not trained to be restricted may attempt to escape, which could cause serious injury to the pet or the product",
      "Maker says to remove collars, tags and leads before placing a pet inside, and not to leave young animals unsupervised for extended periods",
    ],
    // The spec source below is an assembly manual (a PDF), so the button uses the maker's product page instead.
    productUrl: "https://www.midwesthomes4pets.com/product/dogs/pens-gates-barriers/exercise-pen-with-door/",
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
      "Page describes a 9.5 x 8 inch swinging door panel that locks; which door panel ships is not stated (a 23-inch door panel also exists)",
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
    id: "carlson-convertible-pet-yard",
    name: "Convertible Pet Yard (Model #2200)",
    brand: "Carlson Pet Products",
    summary:
      "A six-panel all-metal pen with a walk-through door that the maker says can also be used as a gate.",
    keySpecs: [
      "28 inches high; six removable 24-inch all-metal panels; hinged for multiple configurations",
      "Gate width up to 146.5 inches when all six panels are used",
      "16.3-inch walk-through door with a sliding safety lock, swinging in both directions",
      "Gap between bars listed as 2 to 2.5 inches",
      "Maker says it can attach to walls; the page does not state whether it stands on its own",
      "Maker lists a limited 6-month warranty; no weight or dog-size limit is stated",
    ],
    specSource: {
      title: "Carlson Convertible Pet Yard",
      url: "https://carlsonpetproducts.com/products/convertible-pet-yard",
      publisher: "Carlson Pet Products",
      accessedOn: "2026-11-18",
    },
    productUrl: "https://carlsonpetproducts.com/products/convertible-pet-yard",
  },
];
