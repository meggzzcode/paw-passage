# Migration plan: moving the rest of the site into Pages CMS

*Status on 2026-11-16: the proof of concept works (see BUYER_HANDOVER.md, section 5). This plan covers what is left. Nothing below has been done yet. Work happens on a separate branch and nothing is merged to `main` without the owner's approval.*

## What is already in the CMS
One article (`how-vacation-rental-pet-fees-work`), one sample stay, affiliate links, business settings, the editing forms (`.pages.yml`), the build-time checks, and tests that keep the forms and the rules in step.

## What is left (inventory)

| Content | Count | Where it is now | Target |
|---|---|---|---|
| Articles | 15 (9 guides, 6 gear guides) | `src/content/guides/*.ts` | `content/guides/*.md` |
| Gear products | 29 across 6 files | `src/content/gear/*.ts` | `content/products/*.yml` |
| Towns and states | 2 states, 8 towns | `src/content/destinations.ts` | `content/destinations/*.yml` |
| Sample stays | 3 | `src/content/stays/samples.ts` | `content/stays/*.yml` |
| Real stays | 0 yet | `src/content/stays/verified.ts` + `scripts/import-stays.ts` (CSV) | `content/stays/*.yml` |
| Page text (About, Privacy, Terms, Affiliate disclosure, Editorial standards) | 5 | `src/routes/*.tsx` text blocks | `content/pages/*.md` |
| Checklist items | 1 list | `src/content/checklist.ts` | `content/checklist.yml` |
| Photo credits | 16 | `src/content/image-credits.ts` | a field on each article / stay |

Stays out of scope (needs a developer): page design, the home page layout and wording, the tools' behaviour, the list of built-in photos.

## Order of work, each step small enough to check on its own

**Step 1: the 15 remaining articles (the biggest win).**
- Run the existing converter: `bun scripts/convert-guide-to-md.ts <slug>` for each article. It copies the text word for word and keeps the approval, so nothing goes offline.
- For each batch: run the tests, rebuild, and compare the rendered pages with the "before" pages (the same character-for-character comparison used on the first article). Anything that differs is a bug.
- Gear articles also need Step 2 first, because they refer to products.
- Risk: citations use `[[1]](link)` numbers that must match the Sources list. The tests already check this; the editor form tells editors to keep the order.

**Step 2: gear products.**
- Add a `products` collection (one file per product: name, brand, summary, key facts, where the facts came from, optional affiliate link id) and a loader like the one for stays.
- Rule to enforce at build time: no prices, ratings or "we tested" claims (the same rule the tests enforce today).
- Affiliate links become editable in one place: a product's link id points at an entry in `content/affiliates.yml`.

**Step 3: towns and states, and page text.**
- Towns become small files so the owner can add a town without code. Pages like About, Privacy and Terms become Markdown files, so a new owner (and their lawyer) can edit them.

**Step 4: stays.**
- Convert the three samples. Update the CSV importer to write `content/stays/*.yml`. Real stays are added through the CMS form from then on.

**Step 5: the real-account checks** (BUYER_HANDOVER.md, section 6): Netlify deploy, Pages CMS sign-in, the edit/draft/approval/mistake tests, collaborator test, domain and email.

**Step 6: tidy-up.**
- Remove the converted `.ts` content files and the code paths that read them, so there is one way to edit each thing.
- Consider replacing Lovable's build configuration package with a standard configuration (BUYER_HANDOVER.md, risk 4).
- Update `AGENTS.md`/`HANDOVER.md` to describe the CMS workflow.

## Safeguards that stay in force during the migration
- Every batch: automatic tests, a clean fresh-clone build, and the identical-pages comparison.
- Unpublished or unapproved content stays out of the website's code (tested).
- No change to the look of any page; any visible difference is treated as a failure.

## Effort (rough, for a developer working with these tools)
Step 1 about one working session; Steps 2 to 4 about one more; Step 5 depends on account setup by the owner; Step 6 about half a session.

## Decisions needed from the owner
1. Do approvals need a **second person**? Today "Approved by" is a name typed in. Real two-person approval would need the branch-and-pull-request flow, which only works if Pages CMS supports it (to be tested in Step 5).
2. Should the legal pages be editable by the new owner in the CMS, or only by a developer? (Recommended: editable, with a note to get legal advice.)
3. Which host is final if the Netlify test in Step 5 fails? (Fallback already prepared: Hostinger, see `HANDOVER.md`.)
