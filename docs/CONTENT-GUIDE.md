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

## Safety and claims (non-negotiable)

- At least one dog-welfare safety line on every adventure, specific to what the adventure really involves.
- No medical, nutrition, exercise-duration, medication or behaviour-modification claims. Avoid words like cure, diagnose, medication, best, guaranteed, tested. Say "follow your vet's guidance" instead.
- Always let the dog disengage at any time and end on a success. No costumes, forced poses or holding a dog still, and no coercion (never take hold of a paw, never block the way out).
- Water, heat and cold: tell the owner to check conditions and supervise.
- Food adventures need `dietNotes` and must say "ask your vet about diet". Use only foods the dog already eats well; name the foods never to use (chocolate, xylitol, grapes, raisins, onion, garlic, macadamia nuts); count food in the day's portions; provide a no-food variation where possible.
- Never require a specific product or brand. `affiliateProducts` is for optional suggestions only and must not be needed to finish.

## Scoring (six criteria)

Each adventure carries an internal `review` with six scores from 1 to 10: ownerAppeal, dogEnjoyment, originality, adventureFactor, practicality, memoryValue, plus `reviewedOn`. A published adventure needs an average of at least 8 and no score below 7 (the schema enforces this). If it falls short, improve, replace or remove it; never nudge the numbers to pass. After scoring, do a library-wide pass for repeated mechanics, repeated keepsake themes and gaps in who the set serves, and record the result in `docs/CONTENT-REVIEW.md`. That file is public: describe only free adventures and aggregate method, never premium concepts. Scores are internal editorial judgements, never customer ratings, and are never shown to customers.

## Research rule

Add `research` entries (label and https URL) only for pages you actually read. If a page cannot be fetched, do not cite it. Paraphrase and design originally; never copy text from sources or from dog-adventure books. Do not invent sources.

## Collections, stamps, achievements

- Every adventure lists at least one collection slug from `content/collections.yml` and lists `first-adventure` among its stamps.
- The 20 collections are defined in `content/collections.yml`. A collection that has free adventures needs at least 2 of them; one with none is marked `premiumOnly` and its description says the premium library fills it. Collection copy never names premium adventures. Collections are self-paced; there are no deadlines or streaks.
- Memory Maker and Adventure Legend are awarded automatically and are never listed on an adventure.

## Free versus premium

Only free adventures belong in this public repository. Premium adventures are never committed here. Tests use the clearly marked synthetic fixtures in `src/passport/fixtures/premium.synthetic.ts`. Target mix for the free set: about 55% free, 25% costing $1 to $10, 15% costing $11 to $30.
