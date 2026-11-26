// The one adventure that is shown IN FULL to everyone, so a visitor can judge the depth of the product before buying.
// It is a dedicated public demonstration card, written for this purpose. It is NOT taken from the Passport library:
// no premium card is published here, and this card is not part of the free pool or the premium library.
// Keep it original: never paste a library card into this file (a test checks the title and text are not in content/).
export type DemoAdventure = {
  title: string;
  clue: string;
  twist: string;
  time: string;
  cost: string;
  setting: string;
  effort: string;
  youNeed: readonly string[];
  steps: readonly string[];
  safety: readonly string[];
  variations: readonly string[];
  multiDog: string;
  done: string;
};

/** The label shown above the card, on /unlock and on the homepage. */
export const DEMO_LABEL = "A full adventure, shown in full";

export const DEMO_ADVENTURE: DemoAdventure = {
  title: "The Little Mountain Range",
  clue: "A landscape appears overnight in the living room, and your dog is the first explorer to cross it.",
  twist:
    "You never place your dog or point the way. The only guide is the terrain, and your dog decides which peak is worth the climb.",
  time: "15 to 25 minutes",
  cost: "Free",
  setting: "Indoors, in a quiet room",
  effort: "Gentle for both of you. You can sit for all of it.",
  youNeed: [
    "One or two large blankets or throws",
    "A handful of your dog's usual kibble or a few soft treats from their normal food",
    "A non-slip floor or a rug under the blankets",
  ],
  steps: [
    "Pick a quiet room and clear the floor. Lay a rug or a non-slip mat down first, so the blankets cannot slide when your dog steps on them.",
    "Scrunch the blanket into a low landscape: two or three gentle hills no higher than your dog's elbow, with soft valleys between them. Keep every slope low and wide. Nothing should wobble, and no fabric should dangle where a paw or collar could catch.",
    "Hide a few pieces of kibble in the valleys and just under the folds, a different number in each, so each hill smells a little different. Keep a few extra pieces in your pocket.",
    "Sit down at the edge, a few steps back, with your phone away. Say nothing and let your dog arrive. They may sniff the whole range from the outside first. That counts.",
    "Watch their route. Note which hill they visit first and which valley they return to. If they want to nose a fold open, let them. If they step onto a peak, that is their summit.",
    "When the kibble is gone, or when they walk away, add one small change: gently reshape one hill while your dog watches, and tuck in two more pieces. See whether they notice the new terrain.",
    "Finish while it is still fun. Say one quiet word of praise, leave the range up for a few minutes so your dog can revisit it, then fold the blankets away and pick up any leftover kibble.",
  ],
  safety: [
    "Your dog may stop at any time, and walking away is a complete answer.",
    "Never let your dog chew or swallow the blanket. If they start to, take the blanket away and stop.",
    "Use only food your dog already eats comfortably, and count it toward their normal meals. If your vet limits their diet, use only what your vet has approved.",
    "Keep every hill low and the floor non-slip. If your dog has stiff joints, build the range flat, with soft folds rather than hills.",
    "If your dog tenses over the food or the blankets, stop and put everything away.",
  ],
  variations: [
    "For a young puppy: one tiny hill, one or two pieces of kibble, and a minute or two, then rest.",
    "For a dog with stiff joints: lay the blanket nearly flat with folds only, and set the kibble within a few steps of their bed.",
    "For a dog who does not take to food games: hide a worn T-shirt of yours under a fold instead, and let them find it.",
    "For a long wet afternoon: build a second range in another room and let your dog choose which to visit.",
  ],
  multiDog:
    "With more than one dog, run it one dog at a time, in separate rooms or with a gate, so nobody has to compete for the kibble. Give each dog their own range, and stop if either shows signs of guarding.",
  done: "Your dog has explored a landscape you built, and you saw which parts they chose.",
};
