# Disclosure cleanup: what changed (2026-11-24)

Implements sections 5 and 6 of `docs/DISCLOSURE_AND_TRUST_AUDIT.md`. Templates, components, route content and tests only; guide content files, `styles.css`, `ArticleActions.tsx` and `stays.index.tsx` were not touched.

## Rules re-checked
- FTC "Disclosures 101" (fetched 2026-11-24, page dated Nov 2019): disclosure must be "hard to miss" and "with the endorsement message itself"; an About or profile page alone is likely missed. Supports a label beside each button plus one page notice. No change to the audit's reading.
- FTC Endorsement Guides (16 CFR 255, 2023) and Amazon Associates (exact sentence "As an Amazon Associate I earn from qualifying purchases.") as cited in audit section 1; wording kept exact. Amazon policy does not require a price disclaimer when no prices are shown.

## Added
- `src/lib/disclosure.ts`: shared labels. Buy: "Affiliate link · We may earn a commission if you buy." Book: "Affiliate link · We may earn a commission if you book, at no extra cost to you." Class `text-xs text-foreground/75`.
- Label beside every affiliate button: pick cards (`Markdown.tsx`, Vrbo products get the book wording), `RelatedProducts`, `GearHubCards`, `GearPicks`, `PackingBuilder`, `BookingButton` (Vrbo, hero and panel). Plain links get none.
- Amazon sentence added to `/affiliate-disclosure`; per-button label described there; "Sponsored" vs "affiliate" defined there.
- `/methodology`: "Check the price on the retailer's page" and "sizes, models and availability change".
- `src/test/disclosure-labels.test.tsx`: every affiliate pick card has the label after its button and no old price line.

## Removed or reworded
| Item | Count |
|------|-------|
| Pick-card "Check the current price..." line (now label, affiliate cards only) | 106 cards |
| Per-card "Sizes, models and availability change" (now once per gear category page, replacing "No prices, no ratings.") | 62 cards |
| HowWePick independence bullet | 12 pages |
| "No prices, no ratings." header chip | 11 pages |
| Duplicate "Related gear" notice (`GearDisclosure` removed from RelatedProducts) | 2 guides |
| Independence sentence ("does not change what we write") from notices | all notices |
| Footer "Always confirm pet policies with the host before booking." | every page |
| Footer tagline "without fake reviews or invented listings" | every page |
| `/gear` "How we earn money" | 1 |
| Stays "As listed on the booking page..." | 23 stays |
| Home "Anything unconfirmed is marked not confirmed" | 1 |
| Checker intro duplicate privacy sentence | 1 |

## Fixes
- Vrbo label no longer "Sponsored link"; Stay22 "Sponsored map" is now "Affiliate map". `rel=sponsored` unchanged.
- Footer Vrbo trademark line now `text-primary-foreground/75` (was ~1.4:1). Footer pointer reads "Some links on this site are affiliate links, and we may earn a commission. How we earn money."
- "pet policies we can verify" replaced with "have read from public pages" (home, `/list-your-property`); home link "How we verify stays" is now "How we research stays".
- `/about` and `/terms` no longer mention the retired cost calculator or host-questions tool.
- Sources box: "We research from published sources; we have not tested or inspected what we cover here."

## Not done (owned by others)
- "Affiliate links disclosed" chip in `ArticleActions.tsx:102` (30 guides) still present.
- Guide-body price prose variants and the car-safety guide heading (content files).
- Audit item 12 and the AI-use link in the Sources box were not added.

## Tests
tsc and eslint clean. In a clean checkout of HEAD plus these changes, vitest: 494 pass; 3 failures in launch-state, rules and stay-indexing (stays data, unrelated). In the shared tree, other workers' in-progress guide deletion currently breaks content loading.
