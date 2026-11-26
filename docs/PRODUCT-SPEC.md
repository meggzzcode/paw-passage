# Product specification: The Adventure Passport

Everything here is backed by code in this repository unless marked **UNVERIFIED** or **HYPOTHESIS**.

## What it is

A digital, collectible, self-paced library of little adventures to do with a dog, used in the browser (no app, nothing shipped). Each adventure is a short, concrete activity (a game, a walk with a twist, a small project) with a mystery clue, a natural finish, a memory prompt, a stamp and a keepsake. There are no timers, streaks, scores, leaderboards or deadlines.

**Product model (single source of truth, owner directive of 2026-11-26).**

- **Free:** one complete, personalized first adventure from a pool of free adventures. No account, email or card. Selected public previews of the larger collection can be browsed without any onboarding.
- **Paid:** one payment of $19.99 (`offer` in `src/config/site.ts`), not a subscription, unlocks the full library.
- **Brand line:** "A lifetime of little adventures." The homepage headline is "Life is better with a little adventure." The retired slogan stays out of the hero and headings (guard test).

## Journey

1. **Arrive** on the home page and understand within the first screen: a digital dog-adventure product, a substantial library, personalized, one free first adventure, one payment and no subscription.
2. **Find our first adventure.** A few preferences (life stage, energy, size, mobility, comfort with people, dogs and noise, food, car, yard). "Not sure" is always available; skipped answers stay unknown, never "safe".
3. **Personalized recommendation.** The engine picks one free adventure. The visitor first sees practical information only: time, cost, setting, effort, prerequisites and restrictions, never the steps.
4. **Accept, or ask for another** (no limit before the reveal). Accepting reveals the full instructions, which stay available on the device afterward.
5. **Do it and complete it whenever ready.** Completion adds the stamp once; repeats log a memory and never raise the unique count.
6. **Keepsake.** A short memory note (up to 280 characters) and an optional keepsake made on the device.
7. **A tasteful unlock opportunity.** Contextual in-page notes only (no popups, no modals, no urgency). A visitor can browse previews and buy at any time, with no need to finish the free adventure first.
8. **After purchase,** activate with the purchase code, use the library, and (with the sync wiring) have progress follow the code to other devices.

Routes: `/` home, `/discover`, `/previews` (selected previews), `/collections` (and `/collections/<slug>`, `/collections/mine/<id>`), `/passport`, `/unlock`, `/faq`, `/restore-access`, seven landing pages (`/things-to-do-with-your-dog`, `/indoor-dog-adventures`, `/doggy-date-ideas`, `/puppy-bucket-list`, `/senior-dog-adventures`, `/free-things-to-do-with-your-dog`, `/weekend-adventure-finder`), plus guides, gear, the packing list and trust pages. Personalized filter combinations are never indexed or listed in the sitemap.

## Public previews

About 50 curated showcase adventures are served from an allowlisted public record (`GET /api/previews`), never the full adventure record. Public fields: id, public title, teaser, activity label, minutes and cost ranges, setting, effort, prerequisites flags, life stages, keepsake family and theme, role and collections. Never public: instructions, twist, reveal, clue, objective, variations, completion, safety text, supplies detail, photo idea, memory prompt, review scores or research. Pages say previews are "selected previews from a larger collection". Counts on public pages come only from the endpoint (or the live premium summary) and fall back to plain wording; no number such as "150" is ever claimed until verified.

## Commercial pages

- **Home** sections in order: emotional benefit, adventure variety (verified counts with fallback), personalized discovery, mystery reveal demo (a clue only), collectible passport (real stamp art), keepsake demonstrations, what is included, one-time price, FAQ, final call to action.
- **/unlock** is the purchase page; **/faq** answers twenty buyer questions, and the same content is summarized on `/unlock`. Sync and recovery wording must match `ARCHITECTURE.md`.
- **Keepsake demonstrations** are produced by the real renderer from original sample art (an illustrated sample dog named Biscuit, clearly not a customer) and stored as small webp files in `public/examples/` (each under 120 KB, under 1.2 MB in total).
- **Landing pages** hold original owner-perspective guidance (500+ words each), preview cards, a call to action to the free adventure and the Passport, and internal links. They never contain the steps of any adventure. The free landing page states plainly that the free adventure differs from paid access and that many paid adventures cost nothing extra to do.
- **Purchase prompts** are one reusable component (`where`, optional `count`) that fires `purchase_cta_clicked` with the `where` slug.
- No fake testimonials, ratings, counts or urgency anywhere (guard tests scan the new pages).

## Free first adventure (one tailored adventure)

`src/passport/starter.ts` (`selectStarter`, `savedStarter`) runs `rank()` over the public free pool (about 13 to 15 adventures) for the survey answers and takes the top result; "show me another" excludes ones already offered this visit. The pick is saved in the local Save as the additive optional field `starter: { id, at }` (`chooseStarter` in `progress.ts`), so it does not change on each visit. Re-answering the survey may change it only until that adventure is completed; after that it stays as the free keepsake and can be re-read. If no free adventure is eligible the page says so plainly and shows the unlock pitch. The gate is a product and UX choice, not security: the free pool is public in this repository. The free flow makes no network call.

## Discovery modes (full Passport)

Tabs on `/discover` for entitled visitors:

- **Made for You.** A ranked list from the engine (`rank`), using the dog profile, owner preferences and today's filters. Each suggestion shows up to three plain-language reasons. Adventures that depend on an unanswered question are shown as **held**, with the question to answer.
- **Surprise Me.** One adventure drawn from a chosen scope (all, a curated collection, a custom collection, favorites, or done) with more randomness than Made for You. Completed adventures are never drawn unless repeats are requested or the scope is "done"; skipped adventures are avoided.
- **Browse All.** The whole eligible library with filters.

Today's filters (soft; they never override eligibility): time available, budget, indoor or outdoor, activity types, energy, preparation, "what I have" supplies, transport (no car), places, season, weather to avoid, food-free, quiet, new only / done only, favorites only, collection. When filters leave nothing, the engine says which filters to relax.

## Collections

- **Curated collections** are defined in `content/collections.yml` (20 today; 13 have free adventures, 7 are marked premium-only because the premium library fills them). An adventure can belong to several collections and counts once everywhere.
- **Custom collections** are made by the customer and live in their Save: **handpicked** (a list of adventure ids, reorderable) or **smart** (saved filters evaluated against today's profile). Limits: 30 collections, 100 items each, 40-character names. Custom collections never earn collection-complete achievements and never store copies of adventure records.
- Favorites and Done are built-in scopes.

## Dog profile and owner preferences

Every field is optional (`src/passport/profile.ts`). Dog: name, breed (free text), age or life stage, size, energy, limited mobility, restrictions note, personality, favorite activity types, comfort with unfamiliar people, other dogs and crowds, noise sensitivity, food activities, dietary note, water preference, swims, car travel, home type, yard, birthday and adoption date. Owner: how much walking they want (seated to long walk), step-free need, effort, has a car, typical budget, most preparation wanted, preferred types and places, supplies they already have.

Breed is a soft ranking hint only (a small bonus for scent games for a short list of scent-hound words). It is never a penalty and never used for eligibility.

## Eligibility: unknown is never safe

Stage A is a hard filter (`eligibility` in `src/passport/engine.ts`). Ranking, randomness, session filters and "show me more" never override it. An adventure is excluded when a known fact conflicts with what it needs, for example:

- life stage or size not covered; the owner states limited dog mobility and the adventure needs more movement;
- more walking than the owner wants, or steps or uneven ground when the owner needs step-free;
- a nervous dog and the adventure has crowds, strangers, other dogs or noise; a dog that does not do food activities and the adventure is food-based; a dog that avoids water or does not swim and the adventure is in water;
- the adventure needs a car and the owner has none or the dog does not ride; a home type the adventure does not suit; a yard the owner lacks;
- the adventure is a draft, or it is premium and the customer is not unlocked.

When the deciding fact is **missing** (size unknown for a size-limited adventure, food, swimming, car or yard unknown), the adventure is **held** with a question; it is not recommended until answered. Unknown never unlocks a restricted adventure. A skipped profile therefore shows only adventures with no unanswered dependency.

## Adventure schema v2 (summary)

Defined in `src/passport/schema.ts`; the writing rules are in `docs/CONTENT-GUIDE.md`. Each adventure is one YAML file named by a permanent id (`adv-` plus six characters) and starts with `schema: 2`.

- **Story:** title, clue (must not contain the title), reveal, objective, 3 to 9 instructions, twist, up to 4 variations, completion, optional photo idea, memory prompt.
- **Time and money:** minutes min and max, optional active minutes, cost min and max, preparation (none, light, some).
- **Supplies and logistics:** supplies, optional supplies, household substitutes, controlled `requires` keys, transport (none, walkable, car), reservation.
- **Where:** setting, homes, space, places, seasons, weather to avoid.
- **Who it suits (hard eligibility inputs):** life stages, sizes, energy, dog mobility, owner mobility, step-free, crowd, strangers, other dogs, noise, food (with diet notes), water, 1 to 6 safety lines. Personalities are a hint only.
- **Classification and rewards:** 1 to 3 activity types, collections, stamps, achievements, a keepsake (family, theme, headline, subhead), access (free or premium), status (draft or published), related guides, optional affiliate products, research references, internal review scores.

The build rejects violations (for example a car adventure that does not list `car`, a food adventure without diet notes, a published adventure whose internal review average is under 8 or has a score under 7).

## Progress and sync (Save v2)

`src/passport/progress.ts`. A Save holds the profile, owner preferences, and add/remove-timestamped sets for done, favorites and saved-for-later, plus memories, repeat counts, feedback and custom collections. Two devices can only add or remove, never overwrite each other; the newest action per id wins, and everything derived (stamps, milestones) is recomputed. Free progress lives in the browser (`localStorage`, key `pp.save.v1`; v1 saves are upgraded on read) and falls back to memory with a notice if storage is blocked. Export and import as JSON are available on `/passport`. After purchase, the server keeps the synced copy (see `ARCHITECTURE.md`).

## Keepsakes and photo privacy

Ten keepsake families (travel postcard, magazine cover, ID card, trading card, certificate, seasonal frame, event ticket, then-and-now, collage, poster), each with themes. A keepsake is drawn on a canvas on the device in square, portrait or story size, from a chosen photo (or an illustrated option), a dog name and a short memory, then downloaded or shared.

**Photos never leave the device.** They are decoded in memory, limited to 20 MB and 2,400 px on the long edge, never written to browser storage, never sent to a server, never included in analytics, and never part of a Save. The exported PNG is a fresh canvas encode without the original metadata. There is no photo upload endpoint.

## Free versus premium

|                                                      | Free                                                                                                           | Full Passport (one-time purchase)                                                                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adventures                                           | One complete adventure picked for your dog from the free pool, plus selected public previews                   | A much larger library, protected and delivered by the server                                                                                         |
| Account                                              | None                                                                                                           | None; a license code activates access                                                                                                                |
| Discovery, collections, stamps, milestones, memories | Yes                                                                                                            | Yes                                                                                                                                                  |
| Suggestions                                          | "For you today" card, "This season" shelf, occasion card and smart-collection picks, all from the free library | The same, from the much larger library; plus yearly calendar reminders (`.ics`, built on the device) for the dog's birthday and adoption anniversary |
| Keepsakes                                            | Yes (device only)                                                                                              | More designs and premium-only collections                                                                                                            |
| Progress                                             | On the device                                                                                                  | Also synced across devices, restorable with the code                                                                                                 |

Premium adventures are never in this repository, the bundle or any public file. **Status:** the browser loads the premium library into memory only (never storage) for a browser that has activated, and pulls, merges and pushes the Save for sync (see `ARCHITECTURE.md`). This is covered by tests against a fake server and is **UNVERIFIED** against the real Function, Blobs and Gumroad. Public pages therefore describe sync and recovery in plain terms (progress can follow the purchase code to other devices) and nothing more.

## Pricing stance

The price is $19.99, one time, no subscription, held in `offer.price` in `src/config/site.ts` and matching the Gumroad listing. The checkout link is set through the build variable `VITE_CHECKOUT_URL`. Partner discounts are Gumroad discount codes applied on the Gumroad checkout page; the app shows no code. See `DECISIONS.md` for the validation thresholds.

## Gamification philosophy

Collecting, not competing. Stamps and milestones reward doing things with the dog; milestone thresholds (1, 5, 10, 20, 30, 50, 75) are capped to the size of the delivered library so every one is reachable. No streaks, no timers, no points, no public rankings, no pressure to repeat daily. A skipped or "not for us" adventure is simply set aside.

## Analytics

Only allow-listed, named events are sent (`src/passport/events.ts`), each with a few slug-safe fields; free text is dropped. Existing: profile completed, adventure revealed, completed, saved, favorite added, share clicked and completed, unlock viewed, checkout started, purchase confirmed, access restored, affiliate clicked, suggestion revealed, calendar reminder downloaded. Added for the free-first flow and previews: intro_started, intro_personalized, intro_recommended, intro_replaced, intro_revealed, intro_completed, preview_viewed, preview_bookmarked, preview_unbookmarked, collection_preview_viewed, keepsake_created, keepsake_downloaded, keepsake_share_attempted and purchase_cta_clicked (with a `where` slug). Dog names, memories, license codes, emails and customer ids are never sent, and a click is never reported as a verified purchase.

## What is excluded

No AI or generative APIs, no accounts for the free experience, no subscriptions, no ads, no newsletter or email capture, no leaderboards or social feeds, no photo upload or storage, no medical, nutrition or behavior-training claims, no breed-based eligibility, no premium text in the public repository, and no affiliate links other than verified Amazon products.

## Suggestions

Deterministic, no AI, no live weather, no push or email, no accounts for free users (`src/components/passport/Suggestions.tsx`, pure helpers in `src/passport/suggest.ts`). Every pick comes from the engine (`rank`, `pickSurprise`), so hard eligibility, held questions, completed adventures and "unknown is never safe" apply unchanged.

- **For you today** (top of Made for You): one suggestion from `rank()` using the dog profile, owner preferences, the season and optional chips (time I have, at home or outdoors). "Try another" never repeats within the visit and never shows completed adventures; Reveal opens the normal card. Free visitors draw from the free library and see one plain line that the full Passport suggests from a much larger library (no counts).
- **Season** is derived from today's date using meteorological seasons (Dec-Feb winter in the north). Northern is the default; a small selector on the card switches to Southern (remembered in this browser only).
- **This season**: adventures tagged for the current season that suit the dog. Adventures with no season tag are "any season" and are not listed here. Empty state says so.
- **Occasion**: when the birthday or adoption date falls from 3 days before to 14 days after today (year wrap handled; a 29 February date is observed on 28 February in other years) an Occasion card suggests an adventure from `holidays-and-celebrations` or `our-story` where the library has one that suits the dog.
- **Calendar reminders** (full Passport): "Add to my calendar" makes a yearly all-day `.ics` in the browser, titled "<name>: adventure day?". It contains only the dog's name and the dates the owner typed. No network call. Free visitors see a one-line teaser.
- **Smart-collection picks**: up to three "From your collection <name>" cards via `pickSurprise` with the custom scope.
- Analytics add `suggestion_revealed` (source and adventure id) and `calendar_reminder_downloaded` (kind), slugs and ids only.
