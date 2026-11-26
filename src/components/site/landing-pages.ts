// Public guidance pages for the main things people search for. Original, owner-to-owner advice. They never contain
// the steps of any Passport adventure (free or premium): that is what the Passport is for. Previews come from the
// public previews endpoint. Keep claims honest: no invented numbers, praise or urgency, and nothing medical.

export type PreviewFilterKey = "any";

export type Landing = {
  slug: string;
  path: string;
  /** Short page title (the brand is appended when it fits in 60 characters). */
  title: string;
  description: string;
  h1: string;
  intro: string;
  sections: { h: string; body: string[] }[];
  previews: { filter: PreviewFilterKey; heading: string };
  /** Journal articles this hub points to: the articles answer the question, this page only routes to them. */
  journal?: { slug: string; label: string }[];
  /** Internal links shown at the end: other pages and collections that are directly relevant. */
  related: { to: string; label: string }[];
};

const COLL = (slug: string, label: string) => ({ to: `/collections/${slug}`, label });

export const LANDINGS: readonly Landing[] = [
  {
    slug: "things-to-do-with-your-dog",
    path: "/things-to-do-with-your-dog",
    title: "Things to Do With Your Dog: Ideas for Any Day",
    description:
      "Practical ideas for things to do with your dog at home, on a walk or on a day off, plus how to match an activity to the dog you actually have.",
    h1: "Things to do with your dog",
    intro:
      "Most dogs are not asking for a big production. They want you paying attention to them, doing something a little different from yesterday. Here is how to find things that suit your dog, your schedule and your energy.",
    sections: [
      {
        h: "Start with the dog in front of you",
        body: [
          "The best activity is the one your dog actually enjoys, and that depends on the dog. A young retriever and a ten-year-old terrier who hates rain want very different afternoons. Before you pick anything, think about three things: how much energy your dog has on a normal day, what they find rewarding (food, toys, sniffing, people, space to run), and what makes them uneasy (crowds, noise, other dogs, slippery floors).",
          "That small checklist does most of the work. A dog who loves food does well with scent and searching games. A dog who loves people does well with a trip somewhere friendly. A dog who is cautious is often happiest with quiet novelty close to home, such as a new smell to investigate or a new route at a slower pace.",
        ],
      },
      {
        h: "Five-minute things that count",
        body: [
          "You do not need an hour. Five focused minutes of doing something together beats a distracted forty-minute walk with your eyes on your phone. Hide a few treats around a room and let your dog hunt. Teach a silly trick you will never need. Let them lead on a short walk and stop wherever they want to sniff. Sit on the porch and watch the world together.",
          "Short activities are also easy to repeat, which matters more than people expect. Dogs like patterns, and a small ritual you do most days becomes something they look forward to.",
        ],
      },
      {
        h: "Make the ordinary walk different",
        body: [
          "If your life only has room for the daily walk, change one thing about it. Go a different direction. Let your dog choose every turn for a block. Walk the same loop at a different time of day, when the smells and sounds change. Bring a small blanket and stop for a few minutes somewhere with a view. A dog's world is mostly smell, so giving them time to sniff is a real treat.",
        ],
      },
      {
        h: "Weekends and days off",
        body: [
          "With more time, think about a destination or a theme. A trail you have not tried, a pet-friendly cafe patio, a lakeside bench, a farmers market that welcomes dogs. Always check the place's current dog rules before you go, bring water, and keep an exit plan if your dog is overwhelmed. Our guides on road trips and cabin weekends cover the practical side.",
        ],
      },
      {
        h: "Keep it kind",
        body: [
          "Whatever you try, watch your dog's body language and let them opt out. A dog who turns away, freezes, licks their lips repeatedly or will not take a treat is telling you something. Ease off, make it easier, or stop. The goal is a good memory for both of you, not completing a list. If you have concerns about your dog's health or behavior, a veterinarian or qualified trainer is the right person to ask.",
        ],
      },
      {
        h: "When you want the thinking done for you",
        body: [
          "Planning is the part many owners skip. The Adventure Passport does it for you: tell us a little about your dog and we pick one adventure for them, free, with the practical details first. It is a digital collection of little adventures, from five-minute games at home to doggy dates and weekend outings. Completing adventures earns stamps, and personalized keepsake creation is part of the full Passport.",
        ],
      },
    ],
    journal: [
      { slug: "things-to-do-with-your-dog-at-home", label: "Things to do with your dog at home" },
      { slug: "rainy-day-dog-activities", label: "Rainy day dog activities" },
      {
        slug: "things-to-do-with-your-dog-this-weekend",
        label: "Things to do with your dog this weekend",
      },
      { slug: "doggy-date-ideas", label: "Doggy date ideas" },
      { slug: "free-things-to-do-with-your-dog", label: "Free things to do with your dog" },
      { slug: "activities-to-bond-with-your-dog", label: "Activities to bond with your dog" },
      { slug: "puppy-bucket-list", label: "Puppy bucket list" },
      {
        slug: "fun-things-to-do-with-your-senior-dog",
        label: "Fun things to do with your senior dog",
      },
      { slug: "family-activities-with-dogs", label: "Family activities with dogs" },
      { slug: "activities-for-high-energy-dogs", label: "Activities for high-energy dogs" },
    ],
    previews: { filter: "any", heading: "A few selected previews" },
    related: [
      COLL("five-minute-wonders", "Quick Wonders collection"),
      COLL("rainy-day-club", "Rainy Day Club collection"),
      COLL("the-curious-explorer", "The Curious Explorer collection"),
      COLL("adventures-without-spending", "Adventures Without Spending collection"),
    ],
  },
];

export const landingFor = (slug: string): Landing => {
  const l = LANDINGS.find((x) => x.slug === slug);
  if (!l) throw new Error(`Unknown landing page: ${slug}`);
  return l;
};

/** Plain word count of a landing page's own guidance (headings and paragraphs). */
export function landingWords(l: Landing): number {
  const text = [l.intro, ...l.sections.flatMap((s) => [s.h, ...s.body])].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}
