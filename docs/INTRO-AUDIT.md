# Free introductory experience: audit

Audited against the real free library (17 published free adventures in `content/adventures`). Proof lives in
`src/test/intro-audit.test.tsx` (real library, set `INTRO_AUDIT_TABLE=1` to print the profile table) plus the existing
`free-starter.test.tsx`, `intro-quiz.test.tsx` and `passport-engine.test.ts`.

## Checklist

| Requirement                                                                                 | Proof                                                                                                                                                         |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No account, email or card; no network in the quiz                                           | intro-audit (source scan: no `fetch`/email/password fields in quiz, starter, FreeStarter), intro-quiz "makes no network call", free-starter "no network call" |
| 8 default steps, 10 maximum (counted honestly: "Question n of N")                           | intro-audit, intro-quiz "step count"                                                                                                                          |
| One shared profile, one or several names                                                    | intro-quiz "several dogs, one profile"                                                                                                                        |
| Mixed life stages conservative; variable energy gentle-to-moderate                          | intro-quiz "answers map onto the existing profile"                                                                                                            |
| Ten Journal `?ctx=` presets prefill, never overwrite saved answers or preset safety answers | intro-audit "Journal context presets" (all ten keys)                                                                                                          |
| Replace the recommendation before reveal, never repeating                                   | free-starter "ask for another without limit"                                                                                                                  |
| One complete adventure, "Scratch or tap to reveal."                                         | free-starter "reveals only on accept"                                                                                                                         |
| Intro stamp, static keepsake demo, no uploader/camera/editor                                | free-starter "completion", intro-quiz "keepsake creation is paid", intro-audit source scan                                                                    |
| Contextual (not aggressive) purchase                                                        | one inline line while in progress; the pitch panel only after completion; empty states carry one secondary link                                               |

## Representative profiles (real library)

Eligible = free adventures passing hard eligibility (unknown answers held, not counted). All picks are from the free pool of 17.

| Profile                                           | Eligible                 | Recommendation                                  |
| ------------------------------------------------- | ------------------------ | ----------------------------------------------- |
| Unknown dog (all skipped)                         | 14                       | The Secret Handshake Club                       |
| Active adult                                      | 14                       | The Dog's Time Capsule Dig                      |
| Young puppy                                       | 10                       | The Paw-trait Studio                            |
| Senior, limited mobility                          | 10                       | The Paw-trait Studio                            |
| Puppy + senior                                    | 10                       | The Paw-trait Studio                            |
| Apartment / home only                             | 14                       | The Secret Handshake Club                       |
| Owner seated                                      | 8                        | The Secret Handshake Club                       |
| Family with children                              | 14 (4 are family-suited) | The Little Family Discovery Club                |
| No spending                                       | 14                       | The Secret Handshake Club                       |
| Short time                                        | 14                       | The Secret Handshake Club                       |
| No car                                            | 14                       | The Secret Handshake Club                       |
| Quiet / noise sensitive                           | 10                       | The Paw-trait Studio                            |
| Variable energy                                   | 13                       | The Secret Handshake Club                       |
| Puppy + limited mobility + quiet                  | 9                        | The Paw-trait Studio                            |
| Senior + seated + no spend + short + home         | 7                        | The Secret Handshake Club                       |
| Puppy+adult+senior + variable + children + no car | 9 (family-suited fits)   | The Little Family Discovery Club                |
| Everything restrictive                            | 7                        | NONE strictly; widen finds a family-suited pick |

Every single-trait profile has a result. Empty results arise only from combinations.

## Empty results

- "Nothing free fits all of that": only optional answers (where/time/spend) rule everything out. The page offers
  "Widen where, time and spend" and "Change my answers".
- "No free adventure fits yet": hard rules or household answers leave nothing. The page offers "Change my answers" and one
  secondary link to the full Passport. It is not a pitch panel.

### Defects fixed

1. "Widen" used to drop every filter, including no-car and quiet. Now only the optional preferences are dropped
   (`starterFilters(owner, { relax: true })`): where, time, spend and children joining. No-car and quiet stay. Hard
   eligibility is never relaxed.
2. Empty states showed the full unlock pitch panel and "far more to choose from" copy. Now a single secondary line.

## Decision: children joining is an optional preference (this review)

The two coverage gaps below were reviewed. Decision:

- **Children joining + a puppy or senior in the household.** This was a dead end: the answer was a hard filter, and no free
  adventure is both family-suited and safe for those life stages, so the visitor saw "No free adventure fits yet" with no
  way forward. Children joining is now treated as an OPTIONAL preference (like where, time and spend). Strictly, it still
  narrows the list to family-suited adventures. If nothing fits, the existing "Widen" control now also sets it aside, and
  the button, the empty-state copy and the recommendation say so plainly ("We also set aside the children-joining
  preference."). The saved answer is never changed. While widened, a family-suited adventure that fits is still preferred
  (starter pick and a ranking bonus for the family household tag). "Show me another" keeps the widening the visitor chose.
- **Never relaxed:** dog suitability (life stages, mixed households keep the most cautious), mobility, noise, crowds,
  other dogs, food, water, no-car, quiet. Tests: `intro-audit.test.tsx` (filters, relaxed pick, hard eligibility kept,
  page flow for adult + children + nearby and puppy + senior + children).
- **Honest remaining gap (library, not code):** with children joining set aside, a puppy-and-senior household gets a
  safe, suitable adventure that is not marked family-suited. No family-suited free adventure exists for it. No
  adventures were written.
- **Outdoor options (puppy, limited mobility, noise-sensitive dogs):** a library gap, not a logic problem; nothing was
  changed. The three free outdoor adventures are adult/senior, moderate, with some noise, so "nearby outdoors" is
  honestly narrow for these dogs and the visitor gets the widen offer rather than a risky pick.

What the content owner could add later (not promised, not scheduled): one or two free adventures tagged `family` that
suit puppies and seniors (calm, short, home or yard), and one or two gentle, quiet, low-effort outdoor adventures for
puppy, limited-mobility and noise-sensitive dogs (short, close to home, easy ground).

## Gap closure pass (2026-11-26): what changed and what did not

Owner approved about four experiences to close the two gaps above. Result:

| Concept                           | Outcome                                                                                                                                                                | Tier    |
| --------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------- |
| The Little Family Discovery Club  | NEW card. Supervised, quiet, indoor family observation club; puppy, adult and senior; no food, no strangers, no other dogs                                             | Free    |
| The Family Storybook Afternoon    | NEW card. Gentle family booklet written from three real moments; puppy, adult and senior                                                                               | Free    |
| The Quiet Garden Expedition       | NEW card, in the protected package `premium-2026-11-26-2` (outside the repository). Quiet, seated, low effort; puppy, adult and senior                                 | Premium |
| The Little Outdoor Treasure Trail | NOT written. An existing premium card already covers the same mechanic (puppy-suitable, family-tagged). Adapted as a walking-effort variation on that card (no new id) | n/a     |

Coverage now, strictly (no widening):

- **Puppy + senior + children:** now fits. The family-suited free pool is 4 (was 2), and two of those suit puppy, adult and
  senior dogs. This gap is closed. "Widen" still sets children aside only when nothing family-suited remains.
- **Puppy, limited mobility and noise-sensitive dogs, free pool, indoors:** 8 to 9 eligible adventures (was 6 to 7).
- **Puppy, limited mobility and noise-sensitive dogs, free outdoors:** a gap before; now one free card, The Listening Post (quiet, seated, outdoor, no food), is eligible. The free pool has 4 outdoor adventures and no combination is promised a recommendation: hard rules are unchanged.
- Every new card keeps the hard rules: adult supervision, the dog may always leave, nothing is held or hugged, no food, no
  face-to-face prompts, and nobody collects children's names or ages. Unknown is never treated as safe.

## Library gaps and notes

- Free outdoor options for puppy, limited-mobility and noise-sensitive dogs: one (The Listening Post, added 2026-11-26);
  the premium tier has more gentle outdoor cards for these dogs.
- There is no vaccination field. Puppy suitability depends on authoring: "A Trip Down Memory Lane" is flagged puppy-suitable
  with city and countryside places. Content owner should confirm that is intended for unvaccinated puppies. The new indoor
  family cards avoid the question; the new outdoor premium card tells owners to follow their vet's vaccination advice.
- "Short" means adventures whose minimum is 15 minutes or less. There is no ten-minute option; the shortest free
  adventure is 5 to 10 minutes.
- Family ranking (fixed 2026-11-26): without a children answer the Discovery Club used to be the top pick for young puppy and
  senior profiles. Cause: it was NOT the family bonus (that already required children joining). A puppy or senior profile
  gives the engine no distinguishing signal, so ten cards scored equal and the fixed-seed tie-break happened to pick the family
  card. Fix in `engine.ts`: a family-tagged adventure is preferred only when children are joining (or the visitor filtered for
  family) and otherwise takes a small penalty (0.5) so it cannot win a tie by accident. Hard eligibility is unchanged and the
  card is still reachable by "show me another". Tests: `src/test/family-ranking.test.ts`.
- Free outdoors for gentle dogs: one new free introductory card, The Listening Post (outdoor, seated owner, quiet, no
  food, no cost; puppy, adult, senior with vet and vaccination caveats), now exists. It is eligible for the quiet/puppy/senior
  outdoor profiles but does not always rank first. Adventure expansion is frozen.
