# Adventure writing guide

Every adventure is one file in `content/adventures/<id>.yml`. The file name equals the `id`, and the id never changes.

## What makes a good adventure

- **A distinctive twist.** If it could be described as "walk your dog" or "give a treat", it is a chore with a new name. The twist line says what makes this one different.
- **Real steps.** 2 to 6 short, practical steps a tired person can follow without reading twice.
- **Honest time and cost.** Use realistic minutes and a cost range. Zero is allowed and welcome.
- **A clue that teases.** One line shown before the reveal. It must not contain the title.
- **A memory prompt.** One short question that leaves a note worth reading in a year.
- **A keepsake.** Pick one of the types in `src/passport/schema.ts`.

## Safety and claims (non-negotiable)

- At least one dog-welfare safety line on every adventure.
- No medical, nutrition, exercise-duration or behaviour-modification claims. Do not use words like cure, diagnose or medication. Say "follow your vet's advice" instead.
- Always adapt to the dog's comfort and stop when the dog loses interest.
- No costumes, forced poses or holding a dog still.
- Water, heat and cold: tell the owner to check conditions and supervise.

## Inclusion

- Include a gentle variation for senior, limited-mobility or apartment dogs. Set `mobilityFriendly: true` only if the adventure can be done at a very gentle pace or in place.
- Set `crowd` and `otherDogs` honestly so nervous dogs are not shown unsuitable adventures.

## Collections and stamps

- Every adventure lists at least one collection slug from `content/collections.yml`.
- Stamps are earned by completing an adventure that lists them. Memory Maker and Adventure Legend are awarded automatically and are never listed on an adventure.
- A collection needs 3 or more free adventures, or is marked `premiumOnly` with a note that the premium library fills it.

## Free versus premium

Only free adventures belong in this public repository. Premium adventures are never committed here. Tests use the clearly marked synthetic fixtures in `src/passport/fixtures/premium.synthetic.ts`.
