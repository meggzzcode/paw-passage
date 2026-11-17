# Record trail

Dated log of decisions and actions, newest at the bottom. Add a line whenever something is decided, bought, set up or changed. Evidence = where to check it.

| Date | What | Evidence |
|---|---|---|
| 2026-11-16 | Site built in Lovable (TanStack Start), content-first, no backend | `.lovable/plan/` |
| 2026-11-16 | Hostinger rejected; stack set to Namecheap + Netlify + GitHub + Pages CMS | BUYER_HANDOVER.md |
| 2026-11-16 | Brand name set to "Paws & Passage" everywhere | git history |
| 2026-11-17 | Photo branch (restored hero, sharper images) approved and merged to main | `main` history |
| 2026-11-17 | Netlify test deploy `paws-passage-test` verified (198 site checks, 61 browser checks) | docs/LIVE-TEST-RESULTS.md |
| 2026-11-17 | Repo made public (free GitHub cannot protect `main` while private) | GitHub settings |
| 2026-11-17 | Bought `pawsandpassage.com` and Private Email "Launch" at Namecheap ($24.16 order) | Namecheap order (screenshot seen by assistant) |
| 2026-11-17 | Pages CMS article editor switched from rich text to plain Markdown after the rich editor turned tick boxes into bullets | LIVE-TEST-RESULTS.md, `.pages.yml` |
| 2026-11-17 | Owner decided to hold Amazon and all affiliate sign-ups for now | AFFILIATE-PROGRAMS.md |
| 2026-11-17 | Owner decided product buttons link directly to makers' pages for now; affiliate link replaces it when approved | `productButton()` in `src/content/affiliate-usage.ts` |
| 2026-11-17 | Two-dog article wording corrected (AVMA does not say "tethers"); source added | guide file |
| 2026-11-17 | Owner decided to skip legal review of privacy, terms and disclosure pages | this log |
| 2026-11-17 | Product photo licensing researched; none added | docs/PRODUCT-PHOTOS.md |
| 2026-11-17 | Business contact email entered in Business settings (`content/settings.yml`); Contact page now shows a mailto button | `content/settings.yml` |
| 2026-11-17 | Consistency audit run across all 16 articles (35 findings). Safety fixes applied: tether wording, stair gates, bear-food storage, poison/vomiting wording, pen collar/ID, first-aid ointment. Surf-rescue claim checked against the NWS brochure: wording confirmed, no change | docs/CONSISTENCY-AUDIT.md |
| 2026-11-17 | Rest of consistency audit applied (factual and wording findings). Sources checked: ASPCA (crate "safest", 3-4 hour feeding), AKC Reunite (microchip wording), Santa Barbara parks page (sight-and-voice rule). Airbnb, AVMA and Humane World pages could not be read by the tools, so those claims were softened instead of confirmed | docs/CONSISTENCY-AUDIT.md |
| 2026-11-17 | Owner approved merging all work to `main`. CMS branch and affiliate/audit branch merged together; Cowork's test cabin, fake affiliate link, test photo and test contact email deliberately left out. Previous `main` was `8f50649` (restore point). Build, 183 tests and 198 live-site checks passed before merge | git history |
