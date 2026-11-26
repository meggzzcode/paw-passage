# Product specification: The Adventure Passport

Everything here is backed by code in this repository unless marked **UNVERIFIED** or **HYPOTHESIS**.

## What it is

A digital, collectible, self-paced library of little adventures to do with a dog, used in the browser (no app, nothing shipped). Each adventure is a short, concrete activity (a game, a walk with a twist, a small project) with a mystery clue, a natural finish, a memory prompt, a stamp and a keepsake style. Free visitors see finished keepsake examples; making a personalized keepsake from their own photo is part of the full Passport. There are no timers, streaks, scores, leaderboards or deadlines.

**Product model (single source of truth, owner directive of 2026-11-26).**

- **Free:** one complete, personalized first adventure from a pool of 14 free adventures. No account, email or card. Selected public previews of the larger collection can be browsed without any onboarding.
- **Paid:** one payment of $19.99 (`offer` in `src/config/site.ts`), yours to keep: no subscription and no renewals. It unlocks the full library (115 published adventures in 25 collections in the repo: the free pool of 16 plus 99 premium; 116 once the staged private premium card is added), personalized keepsake creation and synced progress. The product promises no perpetual service, no future content and no unlimited updates.
- **Status of the paid side:** PWA install prompts and push notifications are paused (`PWA_ENABLED=false`, `flags.notifications=false`); gifting is off (`flags.gifting=false`) until verified on Gumroad.
- **Brand line:** "A lifetime of little adventures." Approved signature phrases (owner, 2026-11-26), all single-sourced in `src/config/brand.ts`: "A lifetime of little adventures.", "Because every dog deserves a little adventure.", "Collect adventures, not just things." (My Passport headline only, never the hero) and "One payment. Yours to keep." The homepage reads "A passport full of little adventures for you and your dog." The library claim ("100+", "Over a hundred") is tied to `LIBRARY_CLAIM_MIN` and checked against the verified library by `src/test/brand-copy.test.ts`.

## Journey

1. **Arrive** on the home page and understand within the first screen: a digital dog-adventure product, a substantial library, personalized, one free first adventure, one payment and no subscription.
2. **Find our first adventure.** A few preferences (life stage, energy, size, mobility, comfort with people, dogs and noise, food, car, yard). "Not sure" is always available; skipped answers stay unknown, never "safe".
3. **Personalized recommendation.** The engine picks one free adventure. The visitor first sees practical information only: time, cost, setting, effort, prerequisites and restrictions, never the steps.
4. **Accept, or ask for another** (no limit before the reveal). Accepting reveals the full instructions, which stay available on the device afterward.
5. **Do it and complete it whenever ready.** Completion adds the stamp once; repeats log a memory and never raise the unique count.
6. **Keepsake.** A short memory note (up to 280 characters). Free visitors see the matching keepsake style as a static example (no photo upload, no keepsake creation); the personalized keepsake made on the device is part of the full Passport.
7. **A tasteful unlock opportunity.** Contextual in-page notes only (no popups, no modals, no urgency). A visitor can browse previews and buy at any time, with no need to finish the free adventure first.
8. **After purchase,** activate with the purchase code, use the library, and (with the sync wiring) have progress follow the code to other devices.

Routes: `/` home, `/discover`, `/previews` (selected previews), `/collections` (and `/collections/<slug>`, `/collections/mine/<id>`), `/passport`, `/unlock`, `/faq`, `/restore-access`, one broad hub (`/things-to-do-with-your-dog`, which links to the ten Journal articles at `/journal/<slug>` and to collections; the six former topic landing pages 301 to their Journal articles), plus guides, gear, the packing list and trust pages. Personalized filter combinations are never indexed or listed in the sitemap.

## Public previews

The 50 curated showcase adventures are served from an allowlisted public record (`GET /api/previews`), never the full adventure record. Public fields: id, public title, teaser, activity label, minutes and cost ranges, setting, effort, prerequisites flags, life stages, keepsake family and theme, role and collections. Never public: instructions, twist, reveal, clue, objective, variations, completion, safety text, supplies detail, photo idea, memory prompt, review scores or research. Pages say previews are "selected previews from a larger collection". Counts on public pages come only from the endpoint (or the live premium summary) and fall back to plain wording; no number such as "150" is ever claimed until verified.

## Commercial pages

- **Home** sections in order: emotional benefit, adventure variety (verified counts with fallback), personalized discovery, mystery reveal demo (a clue only), collectible passport (real stamp art), keepsake demonstrations, what is included, one-time price, FAQ, final call to action.
- **/unlock** is the purchase page; **/faq** answers the buyer questions in `src/components/site/faq-content.ts` (the count changes with that file; a test pins it), and the same content is summarized on `/unlock`. Sync and recovery wording must match `ARCHITECTURE.md`.
- **Public demonstration card:** `src/config/demo-adventure.ts` is one complete, original adventure (steps, twist, safety lines) shown in full on `/unlock` and collapsed on the homepage, labeled "A full adventure, shown in full". It is written for this purpose and is not a library card.
- **Keepsake demonstrations** (examples only for free visitors) are produced by the real renderer and stored as small webp files in `public/examples/`. Six of the eight use real CC0 dog photos from Wikimedia Commons (no people in any photo; sources and licenses in `IMAGE-CREDITS.md`); then-and-now, seasonal and camping-patch stay illustrated and are labeled "(illustration)". None is a customer's keepsake.
- **The hub page** (`/things-to-do-with-your-dog`) holds short original owner-perspective guidance, links to the Journal articles and collections, preview cards and a call to action to the free adventure and the Passport. It never contains the steps of any adventure. Topic questions are answered by the Journal articles, not by separate landing pages (the free-access distinction lives in the free-things article).
- **Purchase prompts** are one reusable component (`where`, optional `count`) that fires `purchase_cta_clicked` with the `where` slug.
- No fake testimonials, ratings, counts or urgency anywhere (guard tests scan the new pages).

## Free first adventure (one tailored adventure)

**The intro quiz** (`src/passport/quiz.ts`, `src/components/passport/IntroQuiz.tsx`): the homepage CTA "Find our first adventure" (support line "Your first adventure is free.") goes straight to the first question: there is no welcome screen, no explainer and no keepsake pitch before it. The default path is FOUR short screens with an honest "Question n of 4" counter (it shrinks only when a saved profile already answers a screen): 1 life stage "Who is your little sidekick?" (puppy, adult, senior, a mix of ages; one shared profile for several dogs, and "mix" lists every stage so the pick must suit all), 2 energy "What's their usual vibe?" (gentle, moderate, lively, it varies; "varies" keeps to gentle-to-moderate), 3 mood "What are we in the mood for?" (cozy at home = where home, a little outdoor adventure = where nearby, something playful = games nudge, surprise us), 4 "Anything we should keep in mind?" (multi-select, explicit button: mobility limits, food restrictions, noise, crowds, other dogs, exercise or health limits, children joining, not sure, nothing in particular). The safety fields stay DISTINCT (`limitedMobility`, `foodActivities`, `noiseSensitive`, `crowds`, `dogs`; children joining is the owner preference `kids`); "Not sure" writes nothing (unknown, never safe); "Nothing in particular" confirms none ONLY for the options shown, never overriding a saved cautious answer; anything an activity depends on that is still unknown is asked once at the existing "Before you reveal" step, or another pick is offered. Single-choice screens advance when you tap an answer (short transition, off for reduced motion); Back is always visible; each move scrolls the new question into view and moves focus to its heading (one visible heading, the answer group is labelled by it); browser Back steps back inside the quiz (history state) and a reload resumes with answers kept (session storage). Optional refinements sit behind ONE control, "Make it more personal (optional)" on the last screen: dog names, available time, budget, walking and step-free, transport, interests; they add no screens and skipped means unknown. Additive fields only, so old saves load unchanged. A `?ctx=` Journal starting point pre-selects unanswered screens and never overwrites a saved answer. Several dogs share one profile: the most cautious answer wins. Personalized keepsake creation is paid; the free flow has no pre-quiz keepsake text, no photo upload, and the static keepsake example opens from the revealed adventure card.

`src/passport/starter.ts` (`selectStarter`, `savedStarter`) runs `rank()` over the public free pool (14 adventures) for the quiz answers and takes the top result; "show me another" excludes ones already offered this visit. The pick is saved in the local Save as the additive optional field `starter: { id, at }` (`chooseStarter` in `progress.ts`), so it does not change on each visit. Re-answering the quiz may change it only until that adventure is completed; after that it stays as the free keepsake and can be re-read. Right after the quiz there is ONE mystery card ("A little adventure awaits...": teaser, time, budget, setting, dog intensity, owner effort, requirements, one reason) with "Scratch or tap to reveal", "Show me another" and a quiet "Edit preferences"; once revealed the adventure is locked in (a returning visitor opens straight to it; retaking the quiz never grants another reveal). "Show me another" is only offered while a different fit remains (never consumes the last one). When nothing fits, `noMatchCause` finds which answered optional preference (where, time, spend, children joining) blocks a match, and the page asks one or two warm explicit questions ("Could you spare a little more time today?", "Do this one without the children joining"); nothing is relaxed silently, hard suitability (life stage, mobility, noise, crowds, dogs, food, water, no car, quiet) is never loosened, and only when even that finds nothing does the page say so kindly with edit/previews/Passport links (`INTRO-AUDIT.md`). The gate is a product and UX choice, not security: the free pool is public in this repository. The free flow makes no network call.

## Discovery modes (full Passport)

Tabs on `/discover` for entitled visitors:

- **Made for You.** A ranked list from the engine (`rank`), using the dog profile, owner preferences and today's filters. Each suggestion shows up to three plain-language reasons. Adventures that depend on an unanswered question are shown as **held**, with the question to answer.
- **Surprise Me.** One adventure drawn from a chosen scope (all, a curated collection, a custom collection, favorites, or done) with more randomness than Made for You. Completed adventures are never drawn unless repeats are requested or the scope is "done"; skipped adventures are avoided.
- **Browse All.** The whole eligible library with filters.

Today's filters (soft; they never override eligibility): time available, budget, indoor or outdoor, activity types, energy, preparation, "what I have" supplies, transport (no car), places, season, weather to avoid, food-free, quiet, new only / done only, favorites only, collection. When filters leave nothing, the engine says which filters to relax.

## Collections

- **Curated collections** are defined in `content/collections.yml` (25 today, every one with at least one published adventure; 11 are marked `premiumOnly` because the premium library fills them). An adventure can belong to several collections and counts once everywhere.
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

The build rejects violations (for example a car adventure that does not list `car`, a food adventure without diet notes, a published adventure whose independent review average is under 7.0 or has a criterion under 6, with originality allowed to be 5 for non-signature roles).

## Progress and sync (Save v2)

`src/passport/progress.ts`. A Save holds the profile, owner preferences, and add/remove-timestamped sets for done, favorites and saved-for-later, plus memories, repeat counts, feedback and custom collections. Two devices can only add or remove, never overwrite each other; the newest action per id wins, and everything derived (stamps, milestones) is recomputed. Free progress lives in the browser (`localStorage`, key `pp.save.v1`; v1 saves are upgraded on read) and falls back to memory with a notice if storage is blocked. Export and import as JSON are available on `/passport`. After purchase, the server keeps the synced copy (see `ARCHITECTURE.md`).

## Keepsakes and photo privacy

Ten keepsake families (travel postcard, magazine cover, ID card, trading card, certificate, seasonal frame, event ticket, then-and-now, collage, poster) with 117 keepsake themes in all. Creating a personalized keepsake is a full Passport feature; free visitors see static examples only. A keepsake is drawn on a canvas on the device in square, portrait or story size, from a chosen photo (or an illustrated option), a dog name and a short memory, then downloaded or shared.

**Photos never leave the device.** They are decoded in memory, limited to 20 MB and 2,400 px on the long edge, never written to browser storage, never sent to a server, never included in analytics, and never part of a Save. The exported PNG is a fresh canvas encode without the original metadata. There is no photo upload endpoint.

## Free versus premium

|                                                      | Free                                                                                                           | Full Passport (one-time purchase)                                                                                                                    |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Adventures                                           | One complete adventure picked for your dog from the free pool, plus selected public previews                   | A much larger library, protected and delivered by the server                                                                                         |
| Account                                              | None                                                                                                           | None; a license code activates access                                                                                                                |
| Discovery, collections, stamps, milestones, memories | Yes                                                                                                            | Yes                                                                                                                                                  |
| Suggestions                                          | "For you today" card, "This season" shelf, occasion card and smart-collection picks, all from the free library | The same, from the much larger library; plus yearly calendar reminders (`.ics`, built on the device) for the dog's birthday and adoption anniversary |
| Keepsakes                                            | Examples and the matching style only; no creation                                                              | Create personalized keepsakes from your own photo (device only), and premium-only collections                                                        |
| Progress                                             | On the device                                                                                                  | Also synced across devices, restorable with the code                                                                                                 |

Premium adventures are never in the browser bundle or any public file the site serves. The premium text is no longer tracked in the repository (the authoritative protected package is kept outside it); no premium text is added to the repo. **Status:** the browser loads the premium library into memory only (never storage) for a browser that has activated, and pulls, merges and pushes the Save for sync (see `ARCHITECTURE.md`). This is covered by tests against a fake server and is **UNVERIFIED** against the real Function, Blobs and Gumroad. Public pages therefore describe sync and recovery in plain terms (progress can follow the purchase code to other devices) and nothing more.

## Pricing stance

The price is $19.99, one time, yours to keep, no subscription and no renewals, held in `offer.price` in `src/config/site.ts` and matching the Gumroad listing. The checkout link is set through the build variable `VITE_CHECKOUT_URL`. Partner discounts are Gumroad discount codes applied on the Gumroad checkout page; the app shows no code. See `DECISIONS.md` for the validation thresholds.

## Gamification philosophy

Collecting, not competing. Stamps and milestones reward doing things with the dog; milestone thresholds (1, 5, 10, 20, 30, 50, 75) are capped to the size of the delivered library so every one is reachable. No streaks, no timers, no points, no public rankings, no pressure to repeat daily. A skipped or "not for us" adventure is simply set aside.

## Analytics

Only allow-listed, named events are sent (`src/passport/events.ts`), each with a few slug-safe fields; free text is dropped. Existing: profile completed, adventure revealed, completed, saved, favorite added, share clicked and completed, unlock viewed, checkout started, purchase confirmed, access restored, affiliate clicked, suggestion revealed, calendar reminder downloaded. Added for the free-first flow and previews: intro_started, intro_personalized, intro_recommended, intro_replaced, intro_revealed, intro_completed, preview_viewed, preview_bookmarked, preview_unbookmarked, collection_preview_viewed, keepsake_created, keepsake_downloaded, keepsake_share_attempted and purchase_cta_clicked (with a `where` slug). Dog names, memories, license codes, emails and customer ids are never sent, and a click is never reported as a verified purchase.

## What is excluded

No AI or generative APIs, no accounts for the free experience, no subscriptions, no ads, no newsletter or email capture, no leaderboards or social feeds, no photo upload or storage, no medical, nutrition or behavior-training claims, no breed-based eligibility, no premium text in the shipped site or bundle (the repository copy is an owner decision, see above), and no affiliate links other than verified Amazon products.

## Suggestions

Deterministic, no AI, no live weather, no push or email, no accounts for free users (`src/components/passport/Suggestions.tsx`, pure helpers in `src/passport/suggest.ts`). Every pick comes from the engine (`rank`, `pickSurprise`), so hard eligibility, held questions, completed adventures and "unknown is never safe" apply unchanged.

- **For you today** (top of Made for You): one suggestion from `rank()` using the dog profile, owner preferences, the season and optional chips (time I have, at home or outdoors). "Try another" never repeats within the visit and never shows completed adventures; Reveal opens the normal card. Free visitors draw from the free library and see one plain line that the full Passport suggests from a much larger library (no counts).
- **Season** is derived from today's date using meteorological seasons (Dec-Feb winter in the north). Northern is the default; a small selector on the card switches to Southern (remembered in this browser only).
- **This season**: adventures tagged for the current season that suit the dog. Adventures with no season tag are "any season" and are not listed here. Empty state says so.
- **Occasion**: when the birthday or adoption date falls from 3 days before to 14 days after today (year wrap handled; a 29 February date is observed on 28 February in other years) an Occasion card suggests an adventure from `holidays-and-celebrations` or `our-story` where the library has one that suits the dog.
- **Calendar reminders** (full Passport): "Add to my calendar" makes a yearly all-day `.ics` in the browser, titled "<name>: adventure day?". It contains only the dog's name and the dates the owner typed. No network call. Free visitors see a one-line teaser.
- **Smart-collection picks**: up to three "From your collection <name>" cards via `pickSurprise` with the custom scope.
- Analytics add `suggestion_revealed` (source and adventure id) and `calendar_reminder_downloaded` (kind), slugs and ids only.

## Commercial config, welcome and household (V5, Q2)

**One commercial config.** `src/config/commercial.ts` holds the price (re-exported from `offer` in `src/config/site.ts`, the one literal), feature flags (`notifications`, `itineraries`, `printables`, `previewsShowcase`; a flag stays false until the feature is shipped, so copy never advertises it), homepage promo copy, the five demo steps, the trust points, the month-to-collection mapping (hemisphere-neutral: only weather-independent collections, copy names the month) and the featured-preview method. Featured previews come from the API, which serves only cards flagged `showcase: true` in the private data; no ids of premium cards appear in public config. Library counts are never written down: they come from `GET /api/previews` (`total`, `collections`) or from the match aggregates, with plain fallback wording (`libraryLine`). `src/test/commercial-config.test.tsx` fails if a price literal or a hard-coded count appears elsewhere in `src/`.

**Match aggregates.** `POST /api/previews/match` additionally returns `matchingNoSpend` (matches whose cost ceiling is 0) and `collections` (slugs of collections with a match, most matches first, max 6), computed with the same hard eligibility. The stored pool now carries `costMax` and `collections` (structural, not text). An index imported before this change lacks them, so the aggregates are omitted until the next `premium-import`; the client shows nothing for an absent number. The "Here's what's waiting for you" panel (`PurchaseValue`) appears only after the visitor presses "Count what matches".

**Welcome (`/welcome`).** Noindex, not in the sitemap, reached from the verified activation or restore success state with a plain link (no code, no query string). It shows verified totals from the library delivered to the browser, the saved-preview count on this device, one next action (Find my next adventure when a profile exists, otherwise Open my Passport), then a note that reminders are optional. (The install card renders nothing while PWA prompts are off.)

**Household evaluation.** The save holds one dog profile (`save.profile`) and one owner preference block; progress (done, favorites, saved previews, stamps, memories) is keyed by adventure id and is not per dog. A purchase code restores that one save on any device. So one purchase serves a household's use on its own devices, but two dogs would share one progress record and one profile. Multi-profile (per-dog profiles with separate progress, and a "who is this for" switcher through discovery, suggestions, keepsakes and sync) touches the save schema, the merge rules, the engine context and every progress count; it is a real piece of work and is NOT implemented or advertised. The FAQ and /unlock say: one purchase covers your household's use on your devices; the Passport keeps one dog profile at a time (switch by editing the profile; progress is shared); separate profiles are possible later and not part of the product today.

**Affiliate and ads.** The affiliate disclosure page and per-article notice are unchanged. No display ads exist in the app (a test scans `src/components/passport` for ad scripts, affiliate notices and Amazon links).
