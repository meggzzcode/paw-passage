// The printable pages. Everything here is deliberately generic: kinds of adventures and things to notice, never an
// adventure title or any instruction from the library. A test keeps it that way. Nothing is uploaded or stored.
export type PrintableKind = "checklist" | "bingo" | "planner" | "certificate";

export type PrintableGroup = { heading: string; items: readonly string[] };

export type Printable = {
  slug: string;
  title: string;
  teaser: string;
  kind: PrintableKind;
  /** Open to everyone as a free sample; the rest come with the full Passport. */
  sample: boolean;
  landscape?: boolean;
  intro: string;
  groups?: readonly PrintableGroup[];
  /** Bingo: 24 prompts; the middle square is always free. */
  cells?: readonly string[];
  freeSquare?: string;
  /** Extra blank "our own idea" lines on a checklist. */
  blanks?: number;
};

export const PRINTABLES: readonly Printable[] = [
  {
    slug: "adventure-bucket-list",
    title: "Adventure bucket list",
    teaser: "Kinds of little adventures to tick off together, with room for your own.",
    kind: "checklist",
    sample: true,
    intro: "Tick them off at your own pace. There is no order and no deadline.",
    groups: [
      {
        heading: "Out and about",
        items: [
          "A walk somewhere new",
          "A sunrise or sunset outing",
          "A picnic together",
          "A trip to the water",
          "A visit to a pet-friendly spot",
          "A little road trip",
        ],
      },
      {
        heading: "At home",
        items: [
          "A scent game",
          "A puzzle or problem to solve",
          "A rainy-day game",
          "A lazy, cozy afternoon",
          "A homemade treat",
        ],
      },
      {
        heading: "Making things",
        items: [
          "A paw print keepsake",
          "A photo session",
          "A little art project",
          "A letter or story about your dog",
        ],
      },
      {
        heading: "Celebrating",
        items: [
          "A birthday or gotcha day",
          "A seasonal celebration",
          "A day that is all about your dog",
          "A new friend, if your dog enjoys company",
        ],
      },
    ],
    blanks: 4,
  },
  {
    slug: "indoor-discovery-bingo",
    title: "Indoor discovery bingo",
    teaser: "A bingo card of things to notice around the house on a day you are staying in.",
    kind: "bingo",
    sample: true,
    intro: "Notice, point and mark it off. Get five in a row, or fill the whole card.",
    freeSquare: "A happy wag",
    cells: [
      "A sunny spot",
      "A new sound",
      "Something that smells interesting",
      "A favorite blanket",
      "A toy under the furniture",
      "A shadow on the wall",
      "Something shiny",
      "A cozy corner",
      "A rustling noise",
      "Something soft",
      "A door your dog watches",
      "A smell from the kitchen",
      "A window view",
      "A stretch",
      "A big yawn",
      "Something round",
      "A squeaky toy",
      "A patch of warm floor",
      "A funny sleeping pose",
      "A curious head tilt",
      "Something red",
      "A sniff of a new object",
      "A happy sigh",
      "A tail wag at you",
    ],
  },
  {
    slug: "outdoor-discovery-bingo",
    title: "Outdoor discovery bingo",
    teaser: "A bingo card of things to spot on a walk, from puddles to birdsong.",
    kind: "bingo",
    sample: false,
    intro: "Carry it on a walk and mark squares as you notice them. Five in a row wins.",
    freeSquare: "A happy wag",
    cells: [
      "A puddle",
      "A bird",
      "A fallen leaf",
      "A squirrel or rabbit",
      "A very interesting smell",
      "A flower",
      "A cloud shaped like something",
      "A bench",
      "A friendly wave from a neighbor",
      "A bumpy path",
      "A patch of shade",
      "A pinecone or acorn",
      "A mailbox",
      "A butterfly or bee",
      "A stick worth admiring",
      "A hill",
      "Something blue",
      "A new sound",
      "A long, deep sniff",
      "A fence",
      "A sunny patch",
      "A pretty tree",
      "A gentle breeze",
      "A paw print",
    ],
  },
  {
    slug: "weekend-adventure-planner",
    title: "Weekend adventure planner",
    teaser: "A blank two-day planner for fitting little adventures around your weekend.",
    kind: "planner",
    sample: false,
    intro: "Fill it in by hand. Plan as much or as little as you like.",
  },
  {
    slug: "adventure-certificate",
    title: "Adventure achievement certificate",
    teaser: "A certificate to fill in and print for a dog who has earned it.",
    kind: "certificate",
    sample: false,
    landscape: true,
    intro:
      "Type a name, print it and fill in the rest by hand. What you type never leaves this page.",
  },
  {
    slug: "family-adventure-checklist",
    title: "Family adventure checklist",
    teaser: "A simple checklist for planning a calm, happy adventure with the whole household.",
    kind: "checklist",
    sample: false,
    intro: "Run through it together before you head out or settle in.",
    groups: [
      {
        heading: "Before we start",
        items: [
          "Everyone knows the plan",
          "Water for the dog (and for us)",
          "Treats or a favorite toy",
          "Leash, harness and waste bags if going out",
          "A quiet spot where the dog can take a break",
        ],
      },
      {
        heading: "Everyone's part",
        items: [
          "A grown-up stays with the dog the whole time",
          "Children take turns, gently",
          "Let the dog choose to join in or opt out",
          "Keep it short and stop while it is still fun",
        ],
      },
      {
        heading: "Afterwards",
        items: [
          "Fresh water and a rest",
          "Everyone says one thing they liked",
          "A photo or a few words to remember it",
          "Choose the next little adventure",
        ],
      },
    ],
    blanks: 3,
  },
];

export const printableBySlug = (slug: string): Printable | undefined =>
  PRINTABLES.find((p) => p.slug === slug);

/** Every string a printable shows, for the leak test and the page. */
export function allPrintableText(p: Printable): string[] {
  return [
    p.title,
    p.teaser,
    p.intro,
    ...(p.groups ?? []).flatMap((g) => [g.heading, ...g.items]),
    ...(p.cells ?? []),
    p.freeSquare ?? "",
  ];
}
