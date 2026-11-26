// Public guidance pages for the main things people search for. Original, owner-to-owner advice. They never contain
// the steps of any Passport adventure (free or premium): that is what the Passport is for. Previews come from the
// public previews endpoint. Keep claims honest: no invented numbers, praise or urgency, and nothing medical.

export type PreviewFilterKey = "any" | "indoor" | "date" | "puppy" | "senior" | "free" | "weekend";

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
          "Planning is the part many owners skip. The Adventure Passport does it for you: tell us a little about your dog and we pick one adventure for them, free, with the practical details first. It is a digital collection of little adventures, from five-minute games at home to doggy dates and weekend outings, each with a keepsake you can make afterward.",
        ],
      },
    ],
    previews: { filter: "any", heading: "A few selected previews" },
    related: [
      { to: "/indoor-dog-adventures", label: "Indoor dog adventures" },
      { to: "/free-things-to-do-with-your-dog", label: "Free things to do with your dog" },
      { to: "/weekend-adventure-finder", label: "Weekend adventure finder" },
      COLL("five-minute-wonders", "Five-Minute Wonders collection"),
    ],
  },
  {
    slug: "indoor-dog-adventures",
    path: "/indoor-dog-adventures",
    title: "Indoor Dog Adventures for Rainy Days",
    description:
      "How to make a rainy day, a cold snap or a tight schedule fun for your dog: indoor activity principles, safety basics and where to start.",
    h1: "Indoor adventures for your dog",
    intro:
      "Rain, heat, snow, a sore paw or a packed calendar: sometimes the adventure has to happen inside. Done well, an indoor day can tire a dog out and bring you closer than another trip around the block.",
    sections: [
      {
        h: "Why indoor days work",
        body: [
          "Dogs are tired by thinking as well as by running. Searching, figuring something out and learning something new all use up energy, and none of it needs a yard. A ten-minute game that makes your dog use their nose often settles a restless dog better than a short, rushed walk.",
          "Indoor time is also when you have your dog's full attention. There are no squirrels, no traffic and no other dogs. That makes it a good moment to try something new.",
        ],
      },
      {
        h: "Set the room up first",
        body: [
          "A few minutes of preparation prevents most indoor mishaps. Clear breakable things from the floor and from low shelves. Check for slippery surfaces; a hard floor is rough on a dog who is excited, older or has sore joints, so lay down a rug or yoga mat where they will be moving. Pick up anything small that could be swallowed. Put away other pets, children's toys and food that is not part of the game.",
          "Keep sessions short. Five to ten minutes of play, then a break, is plenty. Stop while your dog is still keen, not when they are tired of it.",
        ],
      },
      {
        h: "What kinds of games suit a small space",
        body: [
          "Think in categories rather than recipes. Search games use your dog's nose: something they find, rather than something they are handed. Learning games teach a small new skill, a trick or a name for a toy. Gentle movement games get them walking, turning or stepping onto something safe. Quiet comfort time, such as a lick mat on a blanket while you read, counts too, especially for dogs who find play overstimulating.",
          "Mix them. A good indoor afternoon might be a short search game, a few minutes of learning, then a long, settled rest together.",
        ],
      },
      {
        h: "Respect your dog's pace",
        body: [
          "Some dogs love a challenge and some are anxious when asked to figure something out. Make anything new easy at first, reward generously and stop if your dog seems unsure or stressed. Puppies need very short sessions. Senior dogs and dogs with limited mobility do well with calm, low-movement activities. Your dog can always walk away, and a good game leaves that door open.",
          "Watch the food, too. If a game involves treats, count them as part of the day's meals, and avoid anything your dog is not supposed to eat.",
        ],
      },
      {
        h: "A few things to avoid",
        body: [
          "Skip anything that gets your dog wildly overexcited in a small space, such as fast fetch down a hallway on a slick floor. Do not use food that upsets their stomach, and keep rawhide-style chews and small toys away from unsupervised play. If you share a home with other pets, play with your dog separately so nobody feels they have to guard a prize. And if your dog seems frustrated rather than curious, make the game easier or finish it.",
        ],
      },
      {
        h: "Beyond the basics",
        body: [
          "Once you have run out of your own ideas, the Adventure Passport has a whole collection for rainy days, and many adventures that need no car, no yard and little or no spending. Tell us about your dog and we choose one for them to try, free.",
        ],
      },
    ],
    previews: { filter: "indoor", heading: "Indoor previews" },
    related: [
      COLL("rainy-day-club", "Rainy Day Club collection"),
      COLL("home-sweet-home", "Home Sweet Home collection"),
      { to: "/things-to-do-with-your-dog", label: "Things to do with your dog" },
      { to: "/senior-dog-adventures", label: "Adventures for senior dogs" },
    ],
  },
  {
    slug: "doggy-date-ideas",
    path: "/doggy-date-ideas",
    title: "Doggy Date Ideas: A Day Out With Your Dog",
    description:
      "Planning a doggy date for just you and your dog: how to choose a place, what to bring, and how to make it feel special without spending much.",
    h1: "Doggy date ideas",
    intro:
      "A doggy date is simply time set aside for the two of you, planned a little and treated as an occasion. It does not need to be expensive or far away. It just needs your attention.",
    sections: [
      {
        h: "What makes it a date",
        body: [
          "The difference between a walk and a date is intention. You choose somewhere, you leave the phone in your pocket, and you notice what your dog notices. The date can be as small as a bench with a view or a new neighborhood, or as large as a day trip. What matters is that you are doing it on purpose, together.",
        ],
      },
      {
        h: "Choose a place your dog will enjoy",
        body: [
          "Start with your dog, not the Instagram photo. A social dog may love a pet-friendly patio. A cautious dog may much prefer a quiet park at an off-peak hour. A dog who loves water might enjoy a shoreline, as long as the water is safe and they are comfortable. A dog who rides well might enjoy a short drive to somewhere new, while a dog who dislikes the car is better served by a place they can walk to.",
          "Always check the current dog rules before you go. Leash requirements, hours and access change, and a place that was welcoming last year may not be this year. Have a backup plan close by.",
        ],
      },
      {
        h: "What to bring",
        body: [
          "Keep the kit simple: a leash and a well-fitted collar or harness, water and a collapsible bowl, bags, a few of their favorite treats, a towel in the car, and a small blanket if you plan to sit. If the weather is warm, plan for shade and short stays. Never leave a dog in a parked car.",
        ],
      },
      {
        h: "Ideas by kind of dog",
        body: [
          "For a high-energy dog, choose a place with room to move and a plan that mixes a walk with something to think about, such as a scavenger-style stroll where they find a hidden treat at the end. For a homebody, make the date a change of scenery on a short walk, like a quiet bench or a new block, rather than a long outing. For a senior dog, look for flat, shaded, easy-access places and bring a blanket. For a puppy, keep it short and close to home, with plenty of naps. For a dog who loves food, a patio where you can share a small, dog-safe snack makes the occasion.",
        ],
      },
      {
        h: "Little ways to make it feel special",
        body: [
          "Pick one treat that only happens on dates. Take a photo of your dog at the place, not a staged one, just them being themselves. Let your dog choose the pace and, where it is safe, the direction. Afterward, write down one sentence about what they loved. Those sentences become a record of the year that you will be glad to have.",
        ],
      },
      {
        h: "Keeping it kind and low-pressure",
        body: [
          "Some dogs are happiest with fewer dates and shorter ones. If your dog hangs back, pants heavily, refuses treats or keeps trying to leave, call it early. The date was a success if your dog felt safe and you felt close, even if it only lasted twenty minutes.",
        ],
      },
      {
        h: "Dates, planned for you",
        body: [
          "The Adventure Passport has a collection of doggy dates, with the practical details up front: time, cost, setting and effort. Your free first adventure is a complete one, picked for your dog, so you can see how it works before deciding anything else.",
        ],
      },
    ],
    previews: { filter: "date", heading: "Doggy date previews" },
    related: [
      COLL("doggy-date-club", "Doggy Date Club collection"),
      COLL("little-splurges", "Little Splurges collection"),
      { to: "/weekend-adventure-finder", label: "Weekend adventure finder" },
      { to: "/guides", label: "Travel and trip guides" },
    ],
  },
  {
    slug: "puppy-bucket-list",
    path: "/puppy-bucket-list",
    title: "Puppy Bucket List: First Times Worth Remembering",
    description:
      "A gentle puppy bucket list: the first experiences worth planning and remembering, how to keep them safe and positive, and how to record them.",
    h1: "A puppy bucket list",
    intro:
      "Puppyhood goes by quickly, and so many things happen for the first time. A bucket list is a lovely way to notice them, as long as you let your puppy set the pace.",
    sections: [
      {
        h: "Why a list helps",
        body: [
          "New owners are usually busy: training, sleep, chewed shoes. A short list of first-time moments gives you something to look forward to and something to remember. It also nudges you to introduce your puppy to the world a little at a time, instead of all at once or not at all.",
        ],
      },
      {
        h: "First times worth noticing",
        body: [
          "Think small. The first walk around the block. The first time on a new kind of floor or surface. The first car ride. The first rainy day. The first time they meet a calm, friendly person. The first splash in a shallow puddle. The first time they fall asleep on you. The first photo that looks like the dog they are becoming. None of these require equipment or money, but each is a real milestone.",
          "Add personal ones: the first time they bring you a toy, the first time they come when called, the first time they choose to settle by your feet.",
        ],
      },
      {
        h: "Keep every first positive",
        body: [
          "Puppies learn from every experience, so aim for easy, short and rewarding. Introduce one new thing at a time and give your puppy space to approach it. Offer treats, stay calm, and end before they are tired or worried. If your puppy looks scared, make it easier, move away from the thing, and try again another day with more distance.",
          "Check with your veterinarian about vaccinations and when it is safe for your puppy to be in public places and around other dogs. Until then, there is plenty to explore at home and in your own yard.",
        ],
      },
      {
        h: "Short sessions, lots of sleep",
        body: [
          "Puppies need a lot of rest. A few minutes of something new, followed by a nap, is far better than a long, busy day. Overtired puppies get grumpy and mouthy, which is not a behavior problem so much as a sign that they are done.",
        ],
      },
      {
        h: "Record it as you go",
        body: [
          "Take one photo, write one line. A date and a sentence is enough. Later, you can turn a favorite moment into a keepsake such as a postcard or a trading card. The Adventure Passport includes keepsake designs that are drawn on your own device, and your photos are never uploaded.",
        ],
      },
      {
        h: "Gentle ways to meet the world",
        body: [
          "Sights and sounds can be big for a small dog. Sit on a bench near a quiet street and let your puppy watch cars and people go by from a comfortable distance, with treats for staying relaxed. Let them walk on different surfaces, like grass, a rug, a smooth path and a wooden step, one at a time. Introduce a household sound, such as a vacuum, from another room first. Invite one calm, dog-savvy friend over rather than a crowd. If your puppy stops eating treats or tries to leave, you went too far, so back up and make it easier.",
        ],
      },
      {
        h: "A first chapter, planned for you",
        body: [
          "The Adventure Passport has a collection for a puppy's first chapter, and life stage matters in what we recommend: an adventure that does not suit a puppy is not offered to one. Start with your free first adventure and see how it feels.",
        ],
      },
    ],
    previews: { filter: "puppy", heading: "Puppy previews" },
    related: [
      COLL("puppys-first-chapter", "Puppy's First Chapter collection"),
      COLL("rescue-and-new-beginnings", "Rescue & New Beginnings collection"),
      { to: "/indoor-dog-adventures", label: "Indoor dog adventures" },
      { to: "/things-to-do-with-your-dog", label: "Things to do with your dog" },
    ],
  },
  {
    slug: "senior-dog-adventures",
    path: "/senior-dog-adventures",
    title: "Senior Dog Adventures: Gentle Outings and Games",
    description:
      "How to keep an older dog engaged and happy: gentle activity principles, pacing, comfort tips and the kinds of small adventures that suit a slower pace.",
    h1: "Adventures for senior dogs",
    intro:
      "An older dog may walk more slowly, but they are still curious, still affectionate and often better company than ever. The adventures change, and they can be just as meaningful.",
    sections: [
      {
        h: "Slower does not mean smaller",
        body: [
          "Older dogs often love what they always loved, just in smaller doses. A short stroll where they can sniff at leisure, a warm spot in the sun, a favorite game made gentler, a car ride to somewhere calm. Many senior dogs actually enjoy novelty more than owners expect, provided it is easy and unhurried.",
        ],
      },
      {
        h: "Let comfort lead",
        body: [
          "Think about surfaces, steps and temperature. Slippery floors can be a real hazard, so rugs and mats help. Ramps or a boost can make cars and sofas easier. Short, frequent outings are usually better than one long one. Choose shade or warmth as the weather calls for, and keep water close. Move at your dog's pace, and stop when they slow down or lie down.",
          "If your dog has pain, stiffness or a health condition, talk with your veterinarian about what activity is comfortable. We do not give medical advice, and no adventure should ask a dog to do more than they can.",
        ],
      },
      {
        h: "Use the nose and the brain",
        body: [
          "Sniffing and searching are low-effort and highly rewarding. Gentle scent games, calm puzzle toys, and a slow walk where your dog sets the route all give an older dog something to think about without much strain. Keep sessions short and the rewards easy.",
        ],
      },
      {
        h: "Time together counts",
        body: [
          "Sometimes the adventure is simply being together somewhere new for twenty minutes: a quiet bench, a patio, a drive with the window cracked. Bring a blanket. Let them watch the world. Take a photo; senior years are worth documenting, and you will be glad you did.",
        ],
      },
      {
        h: "Watch for signs to ease off",
        body: [
          "Older dogs will often keep going to please you. Watch for slowing, lagging behind, heavy panting, reluctance to move, or turning toward home. Those are signs to stop and rest. A good adventure ends before your dog is worn out, and your dog can always opt out.",
        ],
      },
      {
        h: "Ideas that suit a slower pace",
        body: [
          "A sunny spot in the yard or on a balcony with a blanket and a chew. A leisurely loop of the block where they decide when to stop. A drive to a quiet park, where you sit on a bench instead of walking the whole loop. A gentle game of finding a treat under a cup, with the cup always in easy reach. A slow brushing session while you listen to music, if they enjoy being handled. A visit with a calm friend who knows how to greet an older dog without crowding them.",
          "Whatever you choose, give them a soft place to rest right afterward, and let them have a good nap. Rest is part of the adventure.",
        ],
      },
      {
        h: "Adventures that fit",
        body: [
          "The Adventure Passport has a collection for the golden years, and when you tell us your dog is older or has limited mobility, adventures that need more than that are filtered out before anything is recommended. Every adventure shows its effort level up front. Your free first adventure is a complete one, picked for your dog.",
        ],
      },
    ],
    previews: { filter: "senior", heading: "Gentle previews for older dogs" },
    related: [
      COLL("the-golden-years", "The Golden Years collection"),
      COLL("home-sweet-home", "Home Sweet Home collection"),
      { to: "/guides/dog-ramp-or-steps-for-the-car-and-cabin", label: "Ramp or steps for the car" },
      { to: "/indoor-dog-adventures", label: "Indoor dog adventures" },
    ],
  },
  {
    slug: "free-things-to-do-with-your-dog",
    path: "/free-things-to-do-with-your-dog",
    title: "Free Things to Do With Your Dog",
    description:
      "Free ways to spend time with your dog, plus a plain explanation of what is free, what is paid, and why many paid adventures cost nothing extra to do.",
    h1: "Free things to do with your dog",
    intro:
      "You do not have to spend money to give your dog a good day. Here are ways to do it for nothing, and a plain explanation of how free and paid work at the Adventure Passport.",
    sections: [
      {
        h: "Free ideas that work",
        body: [
          "Walk a new route and let your dog sniff for as long as they like. Visit a park you have not tried. Play a search game with a few of their own treats or kibble. Teach a new trick in the kitchen. Brush them slowly while you listen to music. Have a quiet sit outside and watch what they watch. Visit a friend's calm dog. Take a photo every week and look back at them at the end of the year.",
          "These cost nothing because they use your time and attention, which are what your dog values most.",
        ],
      },
      {
        h: "Free does not have to mean boring",
        body: [
          "The secret is variety. Dogs get used to the same walk and the same toys. Changing one detail, such as the route, the time of day, the game or the place, is often enough to make something feel new. Keep a short list of cheap ideas on your phone so you are not starting from scratch on a tired Tuesday.",
        ],
      },
      {
        h: "What is free at Paws & Passage",
        body: [
          "The free introductory adventure is one complete, personalized adventure. Answer a few questions about your dog and we pick one for them, show you the practical details first (time, cost, setting, effort and anything it needs), and if you would like a different one you can ask for another. When you accept, you get the full instructions, a stamp for your passport and a keepsake you can make. There is no account, no email and no card.",
          "The free adventure is a complete experience, not a teaser. It is also separate from the paid library.",
        ],
      },
      {
        h: "What is paid, and what is not",
        body: [
          "The full Passport is a single payment that unlocks the larger library, with every collection and more keepsake designs. It is not a subscription. You do not need it to enjoy the free adventure or to browse selected previews.",
          "One more honest point: paying for access does not mean paying for each adventure. Many of the adventures in the full library cost nothing extra to do. Each one lists its cost range before you start, and the ones that suggest a treat, a small supply or an outing are marked, so you can choose what suits your budget.",
        ],
      },
      {
        h: "Free ideas for every kind of day",
        body: [
          "On a busy weekday, take five minutes to do a hide-and-find game in the living room. On a rainy afternoon, teach a new name for a favorite toy. On a sunny weekend morning, walk to the farthest park you can reach on foot and let your dog sniff the whole way. On a quiet evening, sit outside together and do nothing. When you want a change, swap walks with a neighbor who has a friendly dog, if both dogs enjoy it. When your dog is older or slower, a few minutes in the sun and a gentle brush count as a full outing.",
        ],
      },
      {
        h: "Try it yourself",
        body: [
          "The easiest way to see the difference is to take the free adventure. If it is not for you, you have spent a few minutes and nothing else.",
        ],
      },
    ],
    previews: { filter: "free", heading: "Previews that cost little or nothing to do" },
    related: [
      { to: "/things-to-do-with-your-dog", label: "Things to do with your dog" },
      { to: "/indoor-dog-adventures", label: "Indoor dog adventures" },
      COLL("five-minute-wonders", "Five-Minute Wonders collection"),
      { to: "/unlock", label: "What the full Passport includes" },
    ],
  },
  {
    slug: "weekend-adventure-finder",
    path: "/weekend-adventure-finder",
    title: "Weekend Adventures With Your Dog: How to Choose",
    description:
      "A simple way to choose a weekend outing with your dog: time, travel, weather and temperament, with links to our road trip and cabin guides.",
    h1: "Find a weekend adventure for you and your dog",
    intro:
      "A good weekend adventure is the right size for your dog, your time and your weather. Here is a quick way to decide, and where to go for the practical details.",
    sections: [
      {
        h: "Four questions that narrow it down",
        body: [
          "How much time do you have? A morning is a very different plan from a full day or an overnight. How far will your dog happily travel? Some dogs love a long drive and some are done after twenty minutes. What is the weather doing? Heat is the main hazard for dogs, so plan shade, water and shorter stays when it is warm. And what does your dog enjoy? Water, trails, people, quiet, food, or just being near you.",
        ],
      },
      {
        h: "Match the size of the outing to the dog",
        body: [
          "A young, energetic dog may enjoy a longer trail. A senior dog may prefer a short, scenic stop with plenty of rest. A nervous dog may be happiest in a quiet park at an off-peak hour instead of a busy festival. There is no ranking here: the best outing is the one your dog can enjoy without being stressed.",
        ],
      },
      {
        h: "Plan the practical bits",
        body: [
          "Check dog rules for the place, including leash requirements and seasonal limits. Bring more water than you think you need, a collapsible bowl, bags, a towel and a spare leash. Secure your dog safely in the car with a harness or a crate. Our guides on car safety, keeping a dog cool, and packing for a cabin weekend cover the details.",
          "If you are staying overnight somewhere, confirm the dog policy and any fees in writing before you book, and keep your dog's routine as familiar as you can.",
        ],
      },
      {
        h: "Leave room to stop",
        body: [
          "The most common mistake is trying to do too much. Build in slack: a place to pull over, a plan B nearby, time for a nap. Watch your dog and be ready to cut the day short. A short outing that ends well beats a long one that ends in a tired, cranky dog.",
        ],
      },
      {
        h: "A simple weekend plan",
        body: [
          "Saturday morning, a trail or a park your dog loves, early, before it gets hot or crowded. Midday, a long rest in the shade while you eat. Late afternoon, something slow, such as a waterside bench or a patio. Sunday, a lighter day: a short walk somewhere new, a photo of your dog in a good spot, and a note about what they enjoyed. That is a full weekend, with room for naps.",
          "If the weather turns, swap to an indoor day. Many of the best small adventures happen at home, and a rainy weekend can still end with a good memory.",
        ],
      },
      {
        h: "Safety on the road and on the trail",
        body: [
          "Never leave a dog alone in a parked car, even for a few minutes. Keep a leash on in unfamiliar places, and make sure your dog's tags and, if they have one, microchip details are current. Carry a small first aid kit, and know where the nearest veterinary clinic is when you travel. Check the ground temperature with the back of your hand before walking on hot pavement or sand. Pack out what you pack in, and stay on marked paths where required.",
        ],
      },
      {
        h: "Let us choose",
        body: [
          "If you would rather not decide, tell us a little about your dog and we will pick an adventure for them, free, with time, cost, setting and what it needs shown up front. The full Passport adds weekend-sized and road trip collections.",
        ],
      },
    ],
    previews: { filter: "weekend", heading: "Weekend-sized previews" },
    related: [
      COLL("road-trip-adventures", "Road Trip Adventures collection"),
      COLL("camping-companions", "Camping Companions collection"),
      COLL("the-great-outdoors", "The Great Outdoors collection"),
      { to: "/guides/dog-friendly-cabin-packing-list", label: "Dog-friendly cabin packing list" },
      { to: "/guides/keep-a-dog-cool-on-a-summer-trip", label: "Keep a dog cool on a trip" },
      { to: "/guides/dog-car-safety-harness-and-crate-guide", label: "Dog car safety guide" },
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
