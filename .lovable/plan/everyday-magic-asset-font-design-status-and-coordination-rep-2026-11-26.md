# Everyday Magic: asset, font, design-status and coordination report

## 0. What has already changed (read this first)

Before this request arrived, the owner chose "apply the design and delete the concept pages". In response, commit 59cd632 ("Apply Everyday Magic look site-wide and remove concept pages") was made on main. It:
- deleted src/components/concept/*, src/design/concept.css, src/assets/concept/*.jpg and src/routes/concept*.tsx. The source is still in history at 08168d3.
- re-themed the live app: changed the token blocks in src/design/passport.css, the fonts, radius and heading weight in src/styles.css, and the font preloads in src/routes/__root.tsx.
- replaced the files in public/fonts: removed DM Sans and Fraunces, and added self-hosted Bricolage Grotesque, Figtree and Caveat woff2 files with their OFL texts.
- made one-line edits to docs/DESIGN-SYSTEM.md and docs/OWNERSHIP-TRANSFER.md.

It did not touch content/, scripts/, netlify/, package.json, the lockfile or @lovable.dev/vite-tanstack-config. That was one commit, so one Netlify build. These edits go outside the concept-only scope in item 4. Section 5 gives the options.

## 1. Asset provenance

| File (now deleted, in history at 08168d3) | How it was made | Prompt summary | Recognisable person, dog, brand or place? |
|---|---|---|---|
| src/assets/concept/picnic.jpg (1024x1280) | Lovable imagegen tool, run by the agent in this project | Woman in her late 20s laughing with a golden retriever on a red gingham picnic blanket | Synthetic person, no brand intended. Not checked for accidental likeness |
| cozy.jpg (1024x1024) | Same | Scruffy terrier mix on a knit blanket beside a woman's legs, coffee mug | No face. No brand intended |
| date.jpg (1024x1024) | Same | Couple in their 30s at a sidewalk cafe with a black French bulldog and a pup cup | Synthetic people. A generic street, no named place. Check for stray signage or logos |
| trail.jpg (1024x1024) | Same | Young family with a toddler and a senior labrador on an autumn forest trail | Synthetic people, including a child. Owner should decide if a child image is OK |
| portrait.jpg (1024x1280) | Same | Pit bull mix wearing a flower crown in a meadow | Dog only |
| puppy.jpg (1024x1024) | Same | Corgi puppy in a yellow raincoat in a puddle | Dog only |

Full prompts are in the chat history (messages.md, lines 336-341). The images were made through Lovable's imagegen tool, not a separate OpenAI account held by the owner. The C2PA "gpt-image via API" tag matches that.

Other concept visuals were CSS only: polaroid frames, tape, stickers, stamps, scratch-card canvas and marquee. They used emoji characters (system fonts) and no icon files.

**Commercial rights: UNVERIFIED.** I have not read Lovable's current terms on generated images, or the upstream model terms that would apply, with a date. I can't confirm them from here. Until the owner checks Lovable's Terms of Service (lovable.dev, Terms page) and records the clause and the date, flag all six images "replace or verify". Rules if they are used:
- never caption them as customers, testimonials or completed adventures
- label them as illustrative where the context could suggest real people

None of these six images are used on the live site now. The live homepage still shows its earlier keepsake art. That art and the other generated guide images (src/assets/*.jpg, from chat-history lines 89-98) came from the same tool and carry the same UNVERIFIED status.

## 2. Fonts

| Family | Licence | File | Weights loaded | Use |
|---|---|---|---|---|
| Bricolage Grotesque | SIL OFL 1.1 (public/fonts/OFL-bricolage-grotesque.txt) | bricolage-grotesque-latin-variable.woff2 | 600-800 variable, with optical-size axis | Headings (default 700). The marquee and stickers used 800 |
| Figtree | SIL OFL 1.1 (OFL-figtree.txt) | figtree-latin-variable.woff2 | 400-700 variable | Body 400, UI 500-600, buttons 600 |
| Caveat | SIL OFL 1.1 (OFL-caveat.txt) | caveat-latin-variable.woff2 | 500-600 variable | Decorative notes only, through the `font-hand-note` utility |

- All three are now self-hosted with no Google Fonts call. The runtime link existed only on the deleted concept routes.
- The files are latin subsets taken from Google Fonts' CSS on 2026-11-26. The licence texts come from the google/fonts GitHub repo.
- Known gap: some existing headings ask for weight 500, but Bricolage is loaded from 600, so those headings render at 600. Fix: raise those rules to 600, or load from 500.
- Caveat rule: today the live app uses Caveat nowhere. Port it only for captions and doodle notes. Never use it for safety, eligibility, payment, refund or step-by-step text. Worth adding as a rule in AGENTS.md.

## 3. Design status

| Piece | Status |
|---|---|
| Colours (vanilla, warm ink, cherry, butter, sage, leaf, powder; dark-mode set) | Final, and live. Contrast on cherry-on-vanilla and small text should be checked with a tool |
| Type (the three families above) | Final, and live |
| Corner radius and soft shadow | Final tokens, partly live. Some components still have hard offset shadows set in their own CSS |
| Hero (polaroid collage, butter highlight, handwritten notes) | Concept-final, not ported |
| Quiz (8 questions, progress bar, back button) | Visual only, not wired to real eligibility. Needs porting onto the real quiz logic; breed must not be an input |
| Scratch reveal (canvas plus tap/keyboard fallback) | In refinement: real-phone finger testing not done; reduced-motion check needed |
| Adventure cards (time, cost, type chips, "you'll need", locked steps) | Concept-final layout. Must use only real free-tier fields, with no premium text |
| Collections row | In refinement: two of the ten missing, and two cards reuse a photo |
| Passport scrapbook | Concept-final look. No streaks |
| Purchase section ($19.99 once) | Concept-final look. Gift option shown as "coming with checkout". Needs real checkout wiring |
| Mobile layout | Checked at 320, 390, 768 and 1280 px. Only the 390 px journey screen was reviewed closely |
| Motion (marquee, card tilt, hover lift) | In refinement. Marquee respects reduced motion; the tilt and hover effects were not audited |

The concept source to port from is commit 08168d3, plus docs/DESIGN-EVERYDAY-MAGIC.md.

## 4. Coordination going forward

- No further commits until the owner or Claude says so. When work does happen, it will be batched into one commit.
- I won't touch content/, scripts/, netlify/, package.json, the lockfile or the vite-tanstack-config version.
- I'm ready for Claude's single coordinated commit that removes the premium JSON files.

## 5. Decision needed from the owner or Claude

Pick one:
A. Keep 59cd632 as the base. Claude ports the components on top.
B. Revert the live re-theme and restore the concept files from 08168d3, in one commit. This returns to concept-only scope.
C. Leave main as it is. Claude handles any reconciliation on the engineering branch.
