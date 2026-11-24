# Editorial fix plan (prioritized)

Date: 2026-11-24. Goal: make the existing asset feel like a polished travel publication for an immediate flip at about $1,500, without a redesign. P0 fix before the flip (quality, compliance, buyer confidence); P1 high-impact quick wins; P2 optional. Estimates are hands-on Claude Code time. "Needs approval" means the owner should approve the direction before substantial rewrites, citation-system changes or disclosure wording changes (per the audit rules).

## P0 (before listing)
| # | Fix | Files | Intended outcome | Est. | Depends on | Acceptance |
|---|---|---|---|---|---|---|
| P0-1 | Per-button affiliate label replaces the pick-card price line; Amazon sentence on /affiliate-disclosure; readable footer Vrbo line; fix wording conflicts ("pet policies we can verify", retired tools in /terms and /about, Vrbo "Sponsored link" label) | `src/components/site/Markdown.tsx`, `ProductSpecCard`/`RelatedProducts`/`GearPicks`, footer component, `content` pages for affiliate-disclosure/terms/about/home, tests | Disclosure sits beside every buy button; 106+ repeated lines gone | 2 to 3 h | owner OK on wording (needs approval) | Every affiliate button has the label; no "Check the current price" line; tests updated; verify-site passes |
| P0-2 | Remove repeated reassurance blocks per disclosure audit 5.5 (header chip, footer lines, duplicate related-gear notice, HowWePick repeats) | components, `src/routes/guides.$slug.tsx`, gear pages | About 4 fewer boilerplate lines per page | 2 h | P0-1 | Per-page disclaimer count falls from about 10 to 5 or fewer; required disclosures untouched |
| P0-3 | Merge large-dog rentals + no-weight-limit into one hub; 301 the other | the two guides, `src/routes` redirects, sitemap, pins CSV, internal links | Removes the largest duplication | 3 to 4 h | owner OK (needs approval) | One URL answers both; 301 works; no 404 links; pins regenerated |
| P0-4 | Trim the 9 longest/weakest pages by 25 to 35% without losing facts or sources (how-many-dogs, keep-a-dog-cool, packing list, Christmas week, portable fence, two-large-dogs, bowls, ramp, car-interior) | the 9 guides | 2,000 to 2,800 words, shorter scroll | 1 to 1.5 d | style guide | Word count within target; every source still cited; reviews at or above 9.0 |
| P0-5 | Mobile: stack or reduce table columns on phones; sticky first column; fix orphan separators in byline and breadcrumb | `src/styles.css`, `Markdown.tsx`, header components | No cut-off columns, clean mobile byline | 3 h | none | 390 px: no clipped column on ramp, bowls, parks, how-many-dogs tables |
| P0-6 | Hero images that miss the topic (cost, packing list, large-dog rentals): replace with credited Unsplash photos; regenerate pins | `src/lib/images.ts`, `src/content/image-credits.ts`, `public/pins` | Heroes match topics | 2 h | owner OK on picks | Images topical, credited, pins regenerated |
| P0-7 | Deploy once after P0 to refresh the live site; re-run live QA | Netlify | Buyer sees the polished version | 30 min | all P0, owner OK (15 credits) | verify-site passes on production |

## P1 (quick wins)
| # | Fix | Files | Outcome | Est. | Dep | Acceptance |
|---|---|---|---|---|---|---|
| P1-1 | Rewrite all 30 openings (20 to 28 word dek, answer-first paragraph, no roadmap) | the 30 guides | Stronger first screen | 1 d | style guide | No dek over 30 words; paragraph one not a restatement |
| P1-2 | Remove gear blocks from pure policy pages (pool, Airbnb damage, how-many-dogs); keep catalog coverage by prose/pick on a fitting page | those guides, `content/products.yml` | Natural commercial fit | 3 h | coverage test | Catalog coverage test passes |
| P1-3 | "At a glance / our pick" box on the five gear guides | guides, small component | Faster buying decision | 3 h | none | Box on each gear guide |
| P1-4 | Marker cleanup: unstack, remove duplicates, remove from table cells; 24 px tap target | guides, `styles.css` | Less academic look, keeps every source | 4 to 6 h | none | No cluster over 2; Sources list unchanged |
| P1-5 | Citation system (inline publisher links, selective superscripts, collapsible Sources with back-links) | `Markdown.tsx`, guide route, styles, tests, codemod | Natural reading with verifiable sources | 2 to 3 d | owner approval (needs approval) | 0 sources dropped; tests updated |
| P1-6 | Fix "haven't stayed at or inspected any property" on car-gear guides; align trust line per page type | guides | Accuracy | 1 h | none | Wording matches page type |
| P1-7 | Fix three tests-adjacent issues: "32 sources cited" chip counting forum threads; footnote order on ramp table; ramp FAQ markup | template, ramp guide | Accuracy and rich results | 2 h | none | Chip excludes forum count or relabeled |
| P1-8 | Cowork browser review (competitors that blocked, mobile QA of deployed site) | brief | Evidence for the rest of the plan | 2 to 3 h Cowork | deploy | Report in the brief's format |

## P2 (optional)
- In-body photos in the five most-visited guides; a named editor byline if the owner wants one; shorter pin titles to match SEO titles; first-aid guide product additions and the ID tag (needs Cowork product finds); a visual "last updated" changelog line; consistent heading capitalization pass.

## Order of work
P0-1, P0-2, P0-5 (template) then P0-3, P0-4, P0-6 (content), re-review the touched guides (target 9.0 on the rubric), deploy (P0-7), then Cowork brief (P1-8). Citation system (P1-5) only after owner approval.
