# Engagement and conversion UX review

Reviewed 2026-11-17 against the production build (`.output`), served locally, viewed in Chromium at 1280x800 and 390x844, full page and first screen. Source was read only to explain what was seen. Screenshots are in `/tmp/claude-0/-home-user/fda9ad27-569d-5e7b-b498-88d7075dfab9/scratchpad/ux/` (names below, `-d` desktop, `-m` phone, `-fold` first screen).

Method note: I did not have analytics. Everything under "Saw" is observed. "Why it matters" and "Proposal" are my opinion, grounded in common reading and click behaviour, with no statistics claimed. The build has no verified stays and no approved affiliate links yet, so "no stays" is the real launch state.

Overall: the site is unusually honest and well made. Typography, colour, tables, FAQ and sources are good. The weak points are almost all about routing the reader to the next click, and about what the first screen of an article and the homepage spend their space on.

Cross-checks that came out fine (no action): no horizontal scroll at 390px on any page; article tables fit at 390px without side scrolling (art-m, am-1500.png); body text is about 18px with generous leading and a 42rem measure (about 65-75 characters); contrast is good; FAQ uses native `details`; sources are numbered and match the `[1]` style citations in the text.

---

## Ranked findings

### 1. On a phone, the answer is below the first screen (article pages)
- Saw: `art-m-fold.png`. At 390x844 the first screen holds breadcrumbs, eyebrow, a 3-line H1, a 3-line dek, the byline, then the top of the hero photo (y 560-727), then blank space. "The short answer" heading begins at about y 855, just under the fold; its bullets are on the second screen (`am-700.png`). The hero is `aspect-[21/9]` with `mt-10`, then `mt-12` before the text, so about 220px of picture and 130px of margin sit between the dek and the answer. Desktop (`art-d-fold.png`) is the same: only the heading and a large photo are visible, the answer starts at about y 880 (`ad-900.png`).
- Why: a Google visitor asking "how do pet fees work" wants confirmation within a screen that this page answers it. The page contains an excellent "short answer" but the reader must scroll past a decorative photo to learn that.
- Proposal: (a) on mobile, drop the hero from the fold: render the image after the short answer, or reduce to `aspect-[16/9]` with `mt-6` and move the byline above it; (b) lift the first H2 "The short answer" content into the header as a bordered "Short answer" card directly under the dek (take the first list from the markdown at build time, or add a `summary` array to the guide schema and render it, keeping the markdown list for SEO); (c) trim header margins (`mt-10` to `mt-6`, hero `mt-10` to `mt-6`, content `mt-12` to `mt-8`) on small screens.
- Effort: S for the spacing and hero move; M for a schema-backed summary card.

### 2. No table of contents or jump links on 9-10 minute articles
- Saw: `art-m.png` is 16,516px tall at 390px wide (about 20 screens). `art2` (first-aid) is 22,954px. Article DOM check: 14 H2s, zero `id` attributes on headings, no contents nav. Desktop sidebar (`ad-900.png`) holds only the "Tools for this" box, which is short and leaves an empty column beside the text for the rest of the article.
- Why: search visitors skim for their sub-question (Airbnb vs Vrbo, service animals, "unexpected charge"). Without anchors they cannot jump, cannot link to a section, and cannot see how long the page is. This is the main scannability gap.
- Proposal: in `Markdown.tsx` add slugged `id`s to H2/H3 (and a `scroll-mt-24` for the sticky header), build the heading list in the loader, and render "On this page" (a) in the desktop aside above "Tools for this", sticky, (b) as a collapsed `<details>` under the dek on mobile. Include "Questions people ask" and "Sources" entries. Optional: highlight the active section with IntersectionObserver.
- Effort: M.

### 3. Dead end at the end of articles: related guides appear after everything, and tool links are in a side box that mobile readers never see
- Saw: after Sources the order is newsletter (hidden when no form address is set, so nothing), then the sticky `aside`, then "Keep reading" (`ad-end.png`). On a phone the aside stacks after the article column, so "Tools for this" lands between Sources and Keep reading, far from the content it relates to (code: `guides.$slug.tsx` lines 93-100). The pet-fees page's own body has "Questions to send before you book" and "A final price-check checklist" but no button to the calculator or host-question generator at that point.
- Why: the best next clicks (tool that does the thing the article just explained) are placed where only desktop readers on the last screen find them.
- Proposal: add a contextual inline tool callout in the body at the two or three natural points (after the fee structures table: "Try the trip cost calculator"; after the questions section: "Generate this message"), via a markdown directive such as `:::tool cost-calculator` rendered by `Markdown.tsx`. On mobile, move "Tools for this" above "Keep reading" as a full-width card pair. Add a final "What next?" block: one primary tool, two related guides, with a one-line reason each.
- Effort: M.

### 4. Homepage features four alphabetical gear guides, not the best entry points; the pet-fees guide is not on the homepage
- Saw: `home-d.png`. "Read before you book" shows Dog Car Safety (wide), Dog First-Aid Kit, Dog ID Tags, Dog Travel Water and Feeding Gear. Code: `featuredGuides = guides.slice(0, 4)` over a list sorted by title (`content/guides/index.ts`), so selection is an accident of the alphabet. "How Pet Fees Actually Work" and the checklist, which fit the site's stated promise and the likely search traffic, are absent from the homepage. The section titled "Read before you book" then leads with a harness article.
- Why: the first guide card is the largest element after the hero and sets what the site seems to be about. Gear articles are the lowest-trust topic for a first-time visitor and look like an affiliate funnel, which the hero copy explicitly distances itself from.
- Proposal: add a `featured: true` (or `featuredRank`) field to the guide schema and use it on the homepage; lead with fees, the booking checklist and the fenced-yard guide. Alternatively hard-code three slugs in `index.tsx`.
- Effort: S.

### 5. Homepage hero and CTA: two equal-weight buttons, a vague headline, and a "Free tools" CTA that repeats the nav
- Saw: `home-d.png`, `home-m-fold.png`. H1 "Their favorite getaway starts here." says nothing concrete; the subline is good ("Researched guides and free tools for renting, driving and vacationing with your dog. Every fact is sourced..."). On phone the hero is about 740px, the full first screen, and the two buttons are stacked at similar weight. The header pill "Free tools" duplicates the "Tools" nav link two items to its left; when stays exist it changes to "Find a stay". Hero "Their favorite" also assumes the dog's favourite getaway, which a skimmer may read as unclear.
- Why: with no stays, the main promise is "answers about booking a dog-friendly rental". A visitor should know within 5 seconds what to click first.
- Proposal: change the H1 to concrete value, for example "Book a dog-friendly rental without the surprises" (opinion; keep the brand voice), and make the primary button a start path: "Start with the booking checklist" or "See how pet fees work", with "Browse all guides" secondary. Shrink the hero on phone (`min-h` smaller) so the next section peeks above the fold. Replace the header pill with something distinct (e.g. "Checklist") or remove it while there are no stays.
- Effort: S.

### 6. Honest but visually heavy "no stays yet" pieces on the homepage and destinations
- Saw: `home-d.png`: a "Featured stays" section containing only a box saying "We're verifying our first stays one by one" with two buttons. Destinations page (`state-d.png`): "Stays in Georgia: We haven't published verified stays here yet." in a bare line at the bottom. A "For hosts: Run a genuinely dog-friendly stay?" band sits near the footer. A "'Pet-friendly' is one checkbox" band with four mini cards explains verification for stays that do not exist yet; its link "How we verify stays" leads to editorial standards.
- Why: the honesty is a differentiator and the copy is good, but the "Featured stays" heading promises a section and delivers an apology, and the page is long (4,476px desktop, 7,524px phone) before reaching the tools.
- Proposal: hide the "Featured stays" section until at least one stay exists; fold the one-line status ("We list a stay only after confirming its pet policy with the host. First verified stays are coming.") into the verification band. Move the tools band up above the guides on mobile, since tools are the unique, working feature. Keep the host band but it can be one line in the footer area.
- Effort: S.

### 7. Trust signals are present but easy to miss; no named author, no reviewer, uniform dates
- Saw: byline "By Paws & Passage Editors · Last reviewed 2026-11-16 · 9 min read" in small muted text (`art-m-fold.png`), in ISO date format. All 16 guide cards say "Reviewed 2026-11-16" (`guides-d.png`). About page (`about-d.png`) has strong "What we don't do" honesty but no person, no contact for corrections, and no description of who reviews. The article's "Sources and how we researched this" box says explicitly that they did not stay at or inspect any property, and the gear articles say "has not tested, used, or reviewed any product in this guide". The affiliate notice sits at the top of body text in smaller type. Schema JSON-LD names an Organization as author.
- Why: the honesty about not testing is a real strength and should be seen early, not only at the bottom. Identical dates across everything reads as a bulk publish and weakens the freshness signal. For health and safety topics (first-aid, car restraints) readers look for a named, accountable human.
- Proposal: (a) human date format ("Reviewed Nov 16, 2026") and a "How we check" link in the byline; (b) a short trust strip under the byline: "Sourced from official pages (7 sources) · No product tested · Affiliate links disclosed" linking to the sources anchor; (c) add a named editor (real, with consent) or at least a corrections email on About, plus a "Report an error" link in each article footer; (d) for the card meta show "Updated Nov 2026". Do not invent credentials.
- Effort: S for format and strip; S-M for About and corrections link (content decision needed).

### 8. /guides has no filter, search, summary of the best starting point, and loads very long
- Saw: `guides-d.png`. 16 guides grouped by four categories (Destination, Planning, Checklists, Gear) with cards; there is no search, no jump nav to the categories, no "start here". The category order puts Destination guides first even though the Planning guides are most useful with no stays published. In the full-page screenshot images for Planning, Checklist and Gear sections render blank: this is the screenshot tool not triggering `loading="lazy"` for off-screen images, not necessarily a bug. In real scrolling `am-9800.png` shows the cards load fine. Cards show title, dek, reading time, date; no tags beyond category.
- Why: 16 cards is the point where users start to need orientation. Phone height is 8,841px.
- Proposal: (a) a "Start here" row of three pinned guides above the categories (fees, checklist, fenced yard) with one-line reasons; (b) sticky category chips linking to the section anchors; (c) reorder sections to Planning, Checklists, Destination, Gear; (d) optional client-side search box over title and dek (about 20 lines, no dependency); (e) smaller images or a compact list on mobile.
- Effort: S for (a)-(c), M with search.

### 9. Tools: clear titles and good outputs, but no results sharing or printing on the calculator, and an empty-state of zeros
- Saw: `tools-d.png` shows a clear index (three tools; "They run in your browser. Nothing you type is sent anywhere." is a good trust line). Host question generator (`host-d.png`) is excellent: it shows a live preview message and Copy / Email it buttons within 5 seconds. Checklist (`check-m.png`) has progress, Print and Reset. The calculator (`calc-d.png`) opens with every field 0 and totals $0.00 everywhere, no example and no benefit line beyond the intro, and has no print, copy or share. "Go deeper" has only two links on each tool. The Compare tool (`compare-d.png`) exists but is not linked from the tools index (it is hidden until stays exist).
- Why: the calculator is the tool most closely tied to the top search intent (pet fees) and is the least rewarding on first view. Visitors who see zeros may leave.
- Proposal: prefill Stay A with illustrative numbers and label it "Example, replace with your numbers" (clear on first edit); add "Copy summary" (plain text of both stays and the difference) and a Print button using the existing `no-print` styles; show a one-line "Difference: Stay A costs $X more than Stay B over N nights" banner. In "Go deeper" use three links with one-line reasons, including the checklist and host-question tool, so the tools chain into each other.
- Effort: M.

### 10. Mobile navigation and the header CTA
- Saw: phone header is logo plus hamburger (`art-m-fold.png`). The desktop nav has Destinations, Guides, Tools and a pill. Footer holds the About, Editorial standards, Contact links; footer has no "Start here".
- Why: on a phone the only way to the tools or checklist from an article is back to the menu. A sticky small tool link is not present.
- Proposal: on article pages add a slim bottom-sticky bar on mobile after the reader scrolls past the short answer: "Before-you-book checklist" or the relevant tool, dismissible. Keep it unobtrusive (one line, no animation). Alternatively skip this if the inline callouts from finding 3 are done.
- Effort: S-M. Lower priority.

### 11. Missing, expected by this audience
- Share / save / print on articles: there is none (Print exists only in the checklist). The Pinterest and Facebook visitor has no pin or share action, and the images are the strongest social asset. Proposal: a small row under the byline: Copy link, Print, Share (via `navigator.share` on mobile, which needs no third-party scripts), and Pinterest pin using the hero image and `description`. Effort S. Print styles already exist (`no-print` classes).
- "Last updated" prominence: addressed in finding 7.
- A "Start here" path: the site has no ordered route. Proposal: a three-step strip on the homepage and guides index ("1 Read how fees work, 2 Use the checklist, 3 Send the host questions") linking to the exact pages. Effort S.
- Honest social proof alternatives (no reviews exist, and none should be invented): counts of sources checked per guide, the "what we don't do" list on the homepage, a "corrections log" page listing what changed and when, and the number of official sources cited. Effort S-M.
- Summaries on index pages: the cards show a good dek. Adding the first short-answer bullet as the card text would give more value, but only if the dek is not already sufficient. Optional.
- Newsletter: silently absent until a form address is set. Fine, but it means the article ends with no capture at all; when enabled, offer something concrete (for example the checklist PDF), not "Get a note when this changes".

### 12. Things to simplify or remove
- "For hosts" band on the homepage and "List your property" in the footer, while no stays exist: the audience is dog owners and this adds a second audience to the page. Consider keeping only the footer link until stays go live.
- Header "Free tools" pill (see finding 5) and the homepage tools band repeat each other.
- The four-card "Fence, in detail / Fees, decoded / Size and breed / Unknown means unknown" block on the homepage promises a stay database; it is explained as method but readers may read it as a feature that exists. Rewording to "How we will list stays" or moving it to About reduces the mismatch.
- `cms-test-article.md` exists in `content/guides`. It was not publicly reachable in the crawl (not among the linked guides), so this is not a visitor issue, but confirm it is gated by status and remove it before launch.
- Guide cards on `/guides` and in "Keep reading" repeat the full 21:9 hero style; at 16 items consider smaller thumbnails.

---

## Page-by-page notes (evidence)
- Home (`home-d.png`, `home-m-fold.png`): see 4, 5, 6. Section order is hero, destinations, method band, stays placeholder, guides, tools, hosts. Reorder to hero, start-here path, guides, tools, destinations is my suggestion (opinion).
- Guides index: see 8.
- Article (pet fees; harness): short answer and table-based structure are the strongest parts of the site; hero sizing and missing jump links are the main drags (1, 2). Gear article leads with the short answer and then "How these picks were made", which is a good honesty move (`harn-900.png`).
- Destinations and state pages (`state-d.png`): clear towns and guide cards; page ends with the apology line for stays; each town page is thin (about 2,000px) and mostly links out. Check that each town page offers a guide and a tool link on every page; I saw a next click, but it is the single "host question generator" link.
- About (`about-d.png`): clear voice; lacks a person, corrections route, and a link into the guides.
- 404 (`nf-d.png`): reviewed only for existence; add links to Guides and Tools if it does not already show them.

---

## Top 8 recommendations by impact and effort
1. Put the answer in the first screen on mobile: shrink or move the hero and margins, then add a schema-backed "Short answer" card under the dek (finding 1). Impact high, effort S then M.
2. Add heading ids plus an "On this page" list (sticky on desktop, collapsible on mobile) (finding 2). Impact high, effort M.
3. Fix the end-of-article path: inline tool callouts in the body, tool box above "Keep reading" on mobile, and a single "What next?" block (finding 3). Impact high, effort M.
4. Choose homepage featured guides on purpose (fees, checklist, fenced yard) rather than the first four alphabetically (finding 4). Impact high, effort S.
5. Rewrite the homepage hero for concrete value with a primary "start here" button, remove the duplicate header pill, and hide the empty "Featured stays" section (findings 5 and 6). Impact medium-high, effort S.
6. Trust strip and named accountability: readable dates, "no product tested / N official sources / affiliate disclosed" line under the byline, corrections route, and real editor details on About (finding 7). Impact medium-high, effort S-M.
7. Calculator: prefilled example, difference banner, Copy summary and Print, and richer "Go deeper" links (finding 9). Impact medium, effort M.
8. Guides index orientation plus share row: "Start here" row, category chips, Planning first, and a Copy link / Print / Share / Pin row on articles for the Pinterest and Facebook arrivals (findings 8 and 11). Impact medium, effort S.
