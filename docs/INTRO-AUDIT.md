# Free introductory experience: audit

Audited against the real free library (14 published free adventures in `content/adventures`). Proof lives in
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

Eligible = free adventures passing hard eligibility (unknown answers held, not counted). All picks are from the free pool of 14.

| Profile                                           | Eligible                 | Recommendation                       |
| ------------------------------------------------- | ------------------------ | ------------------------------------ |
| Unknown dog (all skipped)                         | 11                       | The Secret Handshake Club            |
| Active adult                                      | 11                       | The Dog's Time Capsule Dig           |
| Young puppy                                       | 7                        | The Paw-trait Studio                 |
| Senior, limited mobility                          | 7                        | The Paw-trait Studio                 |
| Puppy + senior                                    | 7                        | The Paw-trait Studio                 |
| Apartment / home only                             | 11                       | The Secret Handshake Club            |
| Owner seated                                      | 5                        | The Secret Handshake Club            |
| Family with children                              | 11 (2 are family-suited) | A Dog's-Eye Adventure                |
| No spending                                       | 11                       | The Secret Handshake Club            |
| Short time                                        | 11                       | The Secret Handshake Club            |
| No car                                            | 11                       | The Secret Handshake Club            |
| Quiet / noise sensitive                           | 7                        | The Paw-trait Studio                 |
| Variable energy                                   | 10                       | The Secret Handshake Club            |
| Puppy + limited mobility + quiet                  | 6                        | The Paw-trait Studio                 |
| Senior + seated + no spend + short + home         | 4                        | The Secret Handshake Club            |
| Puppy+adult+senior + variable + children + no car | 6 (no family fit)        | NONE                                 |
| Everything restrictive                            | 4                        | NONE (children answer leaves no fit) |

Every single-trait profile has a result. Empty results arise only from combinations.

## Empty results

- "Nothing free fits all of that": only optional answers (where/time/spend) rule everything out. The page offers
  "Widen where, time and spend" and "Change my answers".
- "No free adventure fits yet": hard rules or household answers leave nothing. The page offers "Change my answers" and one
  secondary link to the full Passport. It is not a pitch panel.

### Defects fixed

1. "Widen" used to drop every filter, including no-car, quiet and children-joining. Now only where/time/spend are
   dropped (`starterFilters(owner, { relax: true })`). Hard eligibility is never relaxed.
2. Empty states showed the full unlock pitch panel and "far more to choose from" copy. Now a single secondary line.

## Library gaps and notes (no adventures written)

- Children joining + a puppy or senior in the household (all ages): no free family-suited adventure fits. Only 2 of 14 are
  family-suited (one adult/senior only, one lively yard adventure).
- Outdoor options are thin: only 3 outdoor adventures, all adult/senior, moderate dog effort, with some noise. Nearby
  outdoors plus limited mobility, or plus a noise-sensitive dog, relies on the one "either" adventure.
- There is no vaccination field. Puppy suitability depends on authoring: "A Trip Down Memory Lane" is flagged puppy-suitable
  with city and countryside places. Content owner should confirm that is intended for unvaccinated puppies.
- "Short" means adventures whose minimum is 15 minutes or less. There is no ten-minute option; the shortest free
  adventure is 5 to 10 minutes.
