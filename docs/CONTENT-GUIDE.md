# Adventure writing guide (schema v2)

Every adventure is one file in `content/adventures/<id>.yml`. The file name equals the `id`, and the id never changes. The file must start with `schema: 2`. The authoritative field list and the controlled lists (activity types, life stages, homes, places, supplies, keepsake families and so on) live in `src/passport/schema.ts`; a build error names the file and field.

## What makes a good adventure

- **A distinct twist.** If it could be described as "walk your dog" or "give a treat", it is a chore with a new name. `twist` says what makes this one different.
- **A teasing clue.** One line shown before the reveal. It must not contain the title. `reveal` is the introduction shown after.
- **Real steps.** 3 to 9 short, concrete steps (what to do, where, for how long, what to say) that a tired person can follow without any extra research.
- **Natural completion.** `completion` says when it counts as done. Never a timer, a streak or a score.
- **Accessible variations.** Up to four easier or different versions: seated owner, senior or limited-mobility dog, nervous dog, lively dog, puppy.
- **A photo opportunity.** `photoIdea` is optional but wanted; it must never ask for a pose.
- **Honest time and cost.** `minutesMin/Max`, `costMin/Max` (the cost of the full version including optional extras), `prep`, `activeMinutes`.
- **A memory prompt** that leaves a note worth reading in a year, and a **keepsake** with a family, a theme that exists in `THEME_REGISTRY`, and short artwork words.

## Mandatory classification (hard eligibility inputs)

Set every one of these honestly. Missing information is treated as unknown, never safe, so under-declaring a risk hides the adventure from the wrong dogs and over-declaring hides it from the right ones.

`transport`, `setting`, `homes`, `space`, `places`, `lifeStages`, `energy`, `dogMobility`, `ownerMobility`, `stepFree`, `crowd`, `strangers`, `otherDogs`, `noise`, `food`, `water`, `safety`, `activityTypes` (1 to 3), `collections`, `requires` (controlled supply keys for the "what I have" filter), `reservation`. Optional helpers: `substitutes` (household stand-ins for supplies the owner may not have) and `personalities` (who tends to enjoy it: a hint only, never used for eligibility). Do not use breed as an input anywhere.

## Safety lines (non-negotiable, but light)

The app already shows a general "Read your dog" card and two standing lines: "Your dog can walk away at any time. Ending early is a good ending." and "General information from public guidance. Not veterinary advice. Ask your vet about your dog." Adventures must not repeat any of that.

- Every adventure has 1 to 3 `safety` lines (usually 1 or 2). Each is ONE short plain sentence, about 110 characters at most (the test allows 130), written like a friend's tip, not a warning label.
- Write a line only for a hazard that is non-obvious or specific to this activity. Keep: toxic foods people really forget (grapes, raisins, chocolate, xylitol, onion, garlic, macadamia) when food is involved; a heat, cold or surface check outdoors ("Pavement too hot for your hand is too hot for paws"); water quality, algae and currents near water; a real tug, chase or arousal rule when play is physical; "ask your vet first" for puppies before public places and for diet changes; handling and lifting guidance; leash and local rules, once; vehicle restraint when a car is used.
- Cut the obvious and the repeated: tape, string or foil unless truly surprising, "don't leave your dog alone with X", repeated "supervise", "stop if your dog seems unsure" or "skip if uncomfortable", boilerplate "check with your vet" stacked on every card, and anything restating the two standing lines. Keep inline cautions in steps, variations and twist to a minimum so the text stays lively and practical.
- Never remove a hazard line that a reviewer flagged as a blocker if it is still the only mitigation (puppy-outing vet line, food hazards, heat, cold or pavement, water quality, tug rules); shorten it instead.
- Keep `food`, `dietNotes`, `avoidWeather`, `lifeStages`, `strangers` and `otherDogs` consistent with the text. Food adventures need `dietNotes` that say "ask your vet about diet", use only foods the dog already eats well, and offer a no-food variation where possible.

## Claims (non-negotiable)

- No medical, nutrition, exercise-duration, medication or behaviour-modification claims. Avoid words like cure, diagnose, medication, best, guaranteed, tested. Say "follow your vet's guidance" instead.
- No costumes, forced poses or holding a dog still, and no coercion (never take hold of a paw, never block the way out).
- Never require a specific product or brand. `affiliateProducts` is for optional suggestions only and must not be needed to finish.

## Scoring (six criteria)

Each adventure carries an internal `review` with six scores from 1 to 10: ownerAppeal, dogEnjoyment, originality, adventureFactor, practicality, memoryValue, plus `reviewedOn`. The numbers on a published adventure must be independent scores from a reviewer who is not the author, on one consistent scale (5 is an ordinary pet-blog idea, 7 is good, 8 is genuinely excellent). A published adventure needs an average of at least 7.0 and no score below 6 (the schema enforces this through `PUBLISH_MIN_AVERAGE` and `PUBLISH_MIN_CRITERION`); our editorial goal for premium adventures is 7.5 or more. Authors' own scores run about a point generous, so never publish on them. A new or rewritten adventure stays `draft` until it has been independently scored. If it falls short, improve, replace or remove it; never nudge the numbers to pass. After scoring, do a library-wide pass for repeated mechanics, repeated keepsake themes and gaps in who the set serves, and record the result in `docs/CONTENT-REVIEW.md`. That file is public: describe only free adventures and aggregate method, never premium concepts. Scores are internal editorial judgements, never customer ratings, and are never shown to customers.

## Research rule

Add `research` entries (label and https URL) only for pages you actually read. If a page cannot be fetched, do not cite it. Paraphrase and design originally; never copy text from sources or from dog-adventure books. Do not invent sources.

## Collections, stamps, achievements

- Every adventure lists at least one collection slug from `content/collections.yml` and lists `first-adventure` among its stamps.
- The 20 collections are defined in `content/collections.yml`. A collection that has free adventures needs at least 2 of them; one with none is marked `premiumOnly` and its description says the premium library fills it. Collection copy never names premium adventures. Collections are self-paced; there are no deadlines or streaks.
- Memory Maker and Adventure Legend are awarded automatically and are never listed on an adventure.

## Free versus premium

Only free adventures belong in this public repository. Premium adventures are never committed here. Tests use the clearly marked synthetic fixtures in `src/passport/fixtures/premium.synthetic.ts`. Target mix for the free set: about 55% free, 25% costing $1 to $10, 15% costing $11 to $30.
