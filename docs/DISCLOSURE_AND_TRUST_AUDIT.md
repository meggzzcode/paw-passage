# Disclosure and trust-language audit

> Historical audit (2026-11-23). Per-button affiliate labels and "Check the current price" lines were removed from guides and Gear afterwards; the Vrbo stay-button label and the `/affiliate-disclosure` wording remain an open owner decision (`docs/FINAL_SALE_CODE_RELEASE.md`). <!-- SUPERSEDED-NOTE -->


Date: 2026-11-24. This file is the full inventory and proposed policy (nothing on the site was changed by the audit). Source research notes: FTC Endorsement Guides and "Disclosures 101", Amazon Associates Operating Agreement, Expedia/Vrbo affiliate terms (URLs and limits are listed in section 1; the literal U.S. Amazon Section 5 sentence and Expedia's trademark Schedule 6 were not retrieved, so check both before editing the Vrbo line). Not legal advice.

Executive summary:
- Guides carry 8 to 13 disclaimer-like blocks each (mean 9.9, 297 across 30 guides) plus 4 footer lines on every page. 108 of the 297 (36%) are one line, "Check the current price on the listing before you buy.", repeated under pick cards; neither Amazon nor the FTC requires it because the site shows no prices.
- The real compliance gap is placement, not volume: the affiliate notice sits about 850 to 1,000 px down, but the first affiliate link is a median 7,900 px below it (22 of 30 guides past 5,000 px), and pick cards carry buy buttons with no disclosure next to them. The FTC says the closer a disclosure is to the recommendation, the better.
- Fix both at once: replace the price line with a per-button label ("Affiliate link: we may earn a commission if you buy."), and remove the repeated reassurance blocks listed in section 5.5.
- Defects to fix regardless: the Amazon sentence is missing from /affiliate-disclosure (which says it is shown); the footer Vrbo trademark line is near-invisible (about 1.4:1 contrast, estimated); /terms and /about still mention the retired cost-calculator and host-questions tools; home and /list-your-property say "pet policies we can verify" (conflicts with the no-verified-claims rule); stay pages call Vrbo commissions "Sponsored link" while "Sponsored" also means host-paid placement.

The detailed inventory follows unchanged.

---


Paws & Passage, audit dated 2026-11-24. Read-only audit: no site files were changed. This file is the only output.

How this was produced
- Source read: `src/components`, `src/routes`, `src/content`, `src/lib`, `content/guides`, `content/settings.yml`, `content/affiliates.yml`.
- Rendered pages: frozen build at `http://localhost:4174`, Playwright Chromium, 390 x 844 viewport. 99 URLs crawled (every URL in the sitemap plus the three retired `/tools/*` addresses, which 301 to `/tools`). Each page's visible text, element positions (y in px from the top of the page) and link `rel` values were captured.
- Counts in section 4 are produced by text matching on the rendered page, so they are exact for boilerplate strings and heuristic for the "host-confirm advice" column (see its note).
- This is a content and compliance audit, not legal advice. Research quotes in section 1 were fetched through a summarising fetch tool; re-read the linked sources before relying on a quotation in a contract or legal context.

---

## 0. Headline findings

1. The site is mostly compliant in substance but repeats itself heavily. A typical guide carries 8 to 13 disclaimer-like blocks (mean 9.9, 297 across the 30 guides) plus 4 footer lines on every page. The single biggest repeat is "Check the current price on the listing before you buy." (108 times in the 30 guides, 36% of all counted blocks; 106 of them are pick-card lines).
2. The one real exposure is placement, not wording. The affiliate notice sits at about y = 840 to 1,000 px (under the hero image) on every guide, but the first affiliate link is anywhere from 1,418 px to 11,609 px further down (median about 7,900 px; 22 of 30 guides have it past 5,000 px; 13 past 8,000 px). Pick cards, which carry the buy buttons, have no disclosure beside them; they carry the price line instead. The FTC's guidance is "the closer the disclosure is to your recommendation, the better". Fix: swap the price line for a one-line affiliate label next to each button. That removes 106 lines of noise and closes the gap.
3. Amazon's required sentence is present and exact ("As an Amazon Associate I earn from qualifying purchases.") wherever an Amazon link renders, but it is absent from `/affiliate-disclosure`, the page that says it is shown. Amazon does not require the "check the current price" line, because the site shows no prices (Amazon's price disclaimer applies only where prices or availability are displayed).
4. Defects found: the footer "VRBO is a trademark..." line is rendered in dark grey on the dark green footer (OKLCH lightness 0.47 on 0.39, roughly 1.4:1), so it is effectively invisible; `/terms` and `/about` still refer to a retired "stay cost calculator" and to "a precise list of questions" tool; home and `/list-your-property` say "properties whose pet policies we can verify" although AGENTS.md says no stay may be called verified unless the host confirmed it; the "Affiliate links disclosed" chip in every guide header announces a disclosure instead of making one and wraps with an orphaned dot at 390 px.
5. Top removals: the 106 pick-card price lines (replace with affiliate label); the "Affiliate links disclosed" header chip (30); the footer "Always confirm pet policies with the host before booking." on all 99 pages (the same advice is already on stay, destination, stays-index, data and tool pages); "without fake reviews or invented listings" from the footer tagline (99 pages; belongs on /about and /methodology); the duplicate affiliate block under "Related gear" on 2 guides; the three "no prices, no ratings" repeats on each gear page; the per-card "Sizes, models and availability change" sentence (62 gear cards, move to once per page).

---

## 1. What the rules actually require (current as of 2026-11-24)

| # | Source | What it says (short quotes) | Applies to this site? |
|---|--------|------------------------------|------------------------|
| R1 | FTC Endorsement Guides, 16 CFR Part 255 as revised 2023 (88 FR 48092, 26 Jul 2023). [Federal Register notice](https://www.federalregister.gov/documents/2023/07/26/2023-14795/guides-concerning-the-use-of-endorsements-and-testimonials-in-advertising), [text of 255.5](https://www.law.cornell.edu/cfr/text/16/255.5) | 255.5: a material connection "must be disclosed clearly and conspicuously". New 255.0(f): "'clear and conspicuous' means that a disclosure is difficult to miss (i.e., easily noticeable) and easily understandable by ordinary consumers. In any communication using an interactive electronic medium, such as social media or the internet, the disclosure should be unavoidable." Also "should not be contradicted or mitigated by, or inconsistent with, anything else". Example 11: a blogger paid through affiliate links should "clearly and conspicuously disclose the compensation". Preamble on a "more" link: a disclosure that needs a click is "not unavoidable and thus is not clear and conspicuous". | Yes. Law-level duty for every page with commissionable links (guides, gear, packing list, stay pages). |
| R2 | FTC, [Endorsement Guides: What People Are Asking](https://www.ftc.gov/business-guidance/resources/ftcs-endorsement-guides-what-people-are-asking) | Disclose "clearly and conspicuously on your site"; sample wording "I get commissions for purchases made through links in this post"; "the closer the disclosure is to your recommendation, the better"; separated review and link means "readers may not make the connection"; "a single disclosure may be adequate" when link and review are seen together; "Paid link" next to an affiliate link "should be adequate"; "'Affiliate link' alone may not be understood by consumers"; "buy now" button not adequate. Not addressed: footers or separate disclosure pages for affiliate links (the nearest analogue says a single home-page disclosure "won't be sufficient" and a hyperlinked disclosure button is "easily avoidable"). | Yes. Drives the per-button label and the wording "we may earn a commission". |
| R3 | FTC, [Disclosures 101 for Social Media Influencers](https://www.ftc.gov/business-guidance/resources/disclosures-101-social-media-influencers) (last updated Nov 2019) | "Place it so it's hard to miss"; "placed with the endorsement message itself"; "Disclosures are likely to be missed if they appear only on an ABOUT ME or profile page"; "Use simple and clear language"; don't mix it into "a group of hashtags or links". Written for social media, but the placement principles are the FTC's stated view. The page does not use "hover/scroll/click-away" terms; the equivalent rule is R1 "unavoidable" and the "MORE click" examples. | By analogy. Confirms: not only in the footer, not behind a click, plain words. |
| R4 | Amazon Associates Program Operating Agreement, [Section 5](https://affiliate-program.amazon.com/help/operating/agreement) (page shows "Updated: October 15, 2025") and [Amazon help: identifying yourself as an Associate](https://affiliate-program.amazon.com/help/node/topic/GPXFHVYZMTGPUMPE) | Exact statement: "As an Amazon Associate I earn from qualifying purchases." (or "substantially similar statement previously allowed"). Agreement: state it "clearly and prominently" on your Site. Help page: it "clearly and conspicuously appears on your Site", and link-level disclosures "should be placed near any affiliate link or product review in a location that customers will notice easily". Neither page says it must be on every page, or confirms a footer or dedicated page is enough. Apart from this statement, public communications about the program need Amazon's consent unless law requires them. I could not retrieve the literal Section 5 sentence from Amazon's U.S. page; the wording above is from the agreement summary and Amazon's own help page. Note it uses "I", so do not reword to "we". | Yes, contractual. `AMAZON_DISCLOSURE` in `src/content/affiliates.ts:17` is correct. |
| R5 | Amazon [Program Policies](https://affiliate-program.amazon.com/help/operating/policies) | Prices and availability may be shown only if Amazon serves the link, or the data comes from Amazon's API. If shown from the API: "Product prices and availability are accurate as of the date/time indicated and are subject to change" adjacent to the price. Special Links may not be shortened or cloaked so that it is unclear they go to Amazon. Associates must not make "inaccurate, overbroad, deceptive or otherwise misleading claims about any Product... or prices". | The site shows no prices, so the price disclaimer is not triggered. Nothing in Amazon's policy requires "Check the current price on the listing". Links use direct `amazon.com/dp/...?tag=` addresses (no shortener). |
| R6 | Expedia Group (Vrbo) [Affiliate Programme Terms and Conditions](https://creator.expediagroup.com/lp/b/affhub/affiliate) (dated 9 Nov 2023; now branded "Travel Creator Program") | No specific disclosure wording. Section 9.2.2(c) and Schedule 1 require compliance with law "including but not limited to the FTC Guidelines". 11.1.3 and 11.1.5: no confusing users about your relationship with Expedia, or misleading users about "origin, affiliation or nature" of your site. 11.1.6: no implied endorsement by Expedia. 12.3 to 12.7: use Expedia/Vrbo marks per the Trademark Usage Guidelines (Vrbo is a listed Expedia mark). 16.18: "promptly remove and/or update any outdated Travel Content". 16.2: no URL shorteners that obscure the link goes to Expedia sites. The last 10,759 characters of the page were not read. | Yes. Disclosure duty is FTC-driven. The trademark line is a courtesy rather than a stated requirement, but trademark use must follow Schedule 6 guidelines (not read). "Not endorsed by Vrbo" is consistent with 11.1.6. |
| R7 | Google, [Qualify your outbound links](https://developers.google.com/search/docs/crawling-indexing/qualify-outbound-links), [2021 reminder](https://developers.google.com/search/blog/2021/07/link-tagging-and-link-spam-update) | "Mark links that are advertisements or paid placements (commonly called paid links) with the sponsored value." `nofollow` "still acceptable", `sponsored` "preferred". 2021 post: sites failing to qualify affiliate links "may" face manual actions. Internal links to your own review pages need no attribute. | Yes (SEO, not legal). All 304 affiliate links rendered in the 30 guides, plus every Vrbo and Amazon button on gear and stay pages, carry `rel="sponsored nofollow noopener"`. Verified in the DOM. |
| R8 | Impact and Awin | Awin: [sponsored-link attribute page](https://www.awin.com/us/how-to-use-awin/sponsored-link-attribute-affiliates) says advertisers "increasingly expect" `rel="sponsored"`; no FTC text. impact.com [disclosure guide](https://impact.com/influencer/affiliate-link-disclosure/) advises the disclosure "as close to your affiliate links as possible, preferably within the same paragraph" and elsewhere on the site as well. Third-party commentary (HubSpot) warns a footer-only disclosure may fail "clear and conspicuous". | Not live today. Only Amazon Associates and Vrbo links are approved in `content/affiliates.yml` (63 Amazon, 33 Vrbo). `docs/AFFILIATE-PROGRAMS.md` plans Awin for Fi and Petmate. When added, the same per-button label serves; check each network's own terms for required wording. |
| R9 | FTC, [Rule on the Use of Consumer Reviews and Testimonials](https://www.ftc.gov/news-events/news/press-releases/2024/08/federal-trade-commission-announces-final-rule-banning-fake-reviews-testimonials) (Aug 2024, effective 21 Oct 2024) | Bans fake or AI-generated reviews and testimonials, reviews by people who did not use the product, buying reviews. No requirement to label ordinary editorial content as AI-written. | Relevant to the claims "We do not claim firsthand experiences" and the stay "Paraphrased from the booking page's guest reviews" block (the paraphrase must not be presented as our own review). |
| R10 | EU AI Act Art. 50(4) (transparency for AI-generated text published to inform the public on matters of public interest, with a carve-out where there is human review or editorial responsibility). Commentary: [Goodwin](https://www.goodwinlaw.com/en/insights/publications/2026/08/alerts-technology-dpc-eu-ai-act-transparency-obligations-now-in-force), [Sidley](https://datamatters.sidley.com/2026/06/24/eu-ai-act-transparency-obligations-preparing-for-compliance-by-2-august-2026/) | Commentary says Art. 50(4) was not delayed by the Digital Omnibus and became applicable 2 Aug 2026. I did not find the carve-out text, and whether dog-travel guides are "matters of public interest" is unsettled. | Uncertain and a counsel question. There is no U.S. federal rule requiring on-page AI labels for ordinary web content (R9 covers reviews only). The site already discloses AI use on `/editorial-standards`; section 5 proposes making it one click from every guide. |

Conclusion on necessity, used in the inventory below
- Legally necessary: a clear, conspicuous, unavoidable, plain-words affiliate disclosure near the links (R1, R2); Amazon's exact sentence on the Site (R4); `rel="sponsored"` or `nofollow` (R7, preferred, not law); privacy-notice mention of partner cookies (privacy law, `/privacy`).
- Contractually necessary and not currently met in full: Amazon statement on `/affiliate-disclosure` is not strictly required but is the obvious home for it. Vrbo marks per Expedia's usage guidelines (the footer line exists but cannot be read).
- Not required by anyone: price reminders, independence claims ("never changes what we write"), "no fake reviews" tagline, repeated "confirm with host" reminders, "Affiliate links disclosed" chip, repeated methodology blurbs. These are trust or helpfulness copy. Keep the ones that give the reader a decision-useful fact; cut the rest.

---

## 2. Inventory

Key. Necessity: LEGAL (law), CONTRACT (partner agreement), GOOD PRACTICE (not required, protects readers or the site), TRUST (brand copy). "Interrupts" means interrupts reading or the buying path at 390 px. Recommendation: KEEP, SHORTEN, MOVE, COMBINE, REWRITE, REMOVE.

### 2A. Site-wide chrome (footer and header, on all 99 crawled pages)

**S1. Footer tagline trust claim**
- Wording: "Dog-Friendly Stays, Travel Guides & Gear. Practical, researched advice for traveling with dogs, without fake reviews or invented listings."
- Where: `src/components/site/SiteFooter.tsx` (brand block, uses `site.tagline` plus fixed sentence). Every page, bottom (y about 83 to 95% of page).
- Why: brand positioning; backs the "we do not invent" stance. Necessity: TRUST.
- Duplicates: `/about` ("We don't publish fake reviews, ratings or booking numbers"), `/methodology` "What we do not do", `/editorial-standards` "What we never do", home line "If a detail isn't confirmed, we say so".
- Interrupts: no (footer), but a negative claim ("without fake...") repeated on 99 pages reads defensive.
- Recommendation: SHORTEN. New: "Dog-friendly stays, guides and gear. Practical, researched advice for traveling with dogs." Keep the "no fake reviews or invented listings" claim on `/about` and `/methodology` only.

**S2. Footer affiliate line**
- Wording: "© 2026 Paws & Passage. Some links may be affiliate links. See our disclosure." (link text "disclosure")
- Where: `SiteFooter.tsx` lines 106 to 118, shown when `hasApprovedAffiliates()` is true. Every page.
- Why: site-wide catch-all pointer. Necessity: GOOD PRACTICE; not sufficient on its own (R1, R2, R8 commentary).
- Duplicates: top-of-guide notice, gear notice, stay button label, `/affiliate-disclosure`.
- Interrupts: no.
- Recommendation: KEEP, REWRITE to be definite rather than hedged ("may be"): "Some links on this site are affiliate links, and we may earn a commission. How we earn money." (link to `/affiliate-disclosure`). It stays a pointer; the working disclosure is on the page.

**S3. Footer Vrbo trademark line**
- Wording: "VRBO is a trademark or registered trademark of Expedia, Inc."
- Where: `SiteFooter.tsx` lines 119 to 123, shown when an approved Vrbo link exists. Every page.
- Why: trademark courtesy, consistent with Expedia terms 12.3 to 12.7 (R6). Necessity: CONTRACT-adjacent (guidelines not read); GOOD PRACTICE.
- Defect: the element uses `text-muted-foreground mt-1 text-xs` on the dark-green footer. Computed colour `oklch(0.47 0.015 170)` on background `oklch(0.39 0.05 172)`: about 1.4:1, so it cannot be read. Other footer text is `primary-foreground` at 65 to 75% opacity.
- Duplicates: none.
- Interrupts: no.
- Recommendation: KEEP, fix colour (use the same `text-primary-foreground/65` as the neighbouring lines). Optionally shorten to "Vrbo is a trademark of Expedia, Inc." only if Expedia's Trademark Usage Guidelines (Schedule 6) allow; check before changing wording.

**S4. Footer host-confirm reminder**
- Wording: "Always confirm pet policies with the host before booking."
- Where: `SiteFooter.tsx` line 123, every page including `/privacy`, `/terms`, `/tools/*`, `/gear/*`, `/guides/*`.
- Why: consumer-protection reminder. Necessity: GOOD PRACTICE (the substantive limitation lives in `/terms`).
- Duplicates (same advice, on the pages where it matters): stay page "Before you book" box, stays index header note, `/data/pet-policies`, destination pages ("What to check before you book here"), checker result text, `/terms` "Information, not a guarantee", home "How we verify stays".
- Interrupts: no, but it is invisible noise on pages with no booking decision.
- Recommendation: REMOVE from the footer. Keep it, in context, on stay pages, stays index, destination pages, rental-policy guides ("Before you book" section), checker, data page and `/terms`. This is not safety information; the dog-safety messages are in guide bodies and are untouched.

**S5. Footer link columns "About" and "Legal"**
- Wording: Editorial standards, Methodology, Corrections, List your property, Contact; Affiliate disclosure, Privacy, Terms.
- Where: `SiteFooter.tsx` `cols`. Every page.
- Necessity: GOOD PRACTICE (findability of legal pages).
- Recommendation: KEEP.

**S6. Header and menu**
- The header and the open menu contain only Stays, Destinations, Guides, Gear, Tools. No disclaimers or trust claims. KEEP.

### 2B. Guide pages (30 guides, template in `src/routes/guides.$slug.tsx`, `src/components/site/*`)

**G1. Trust strip: reviewed date and source count**
- Wording: "Last reviewed Nov 24, 2026 · 11 sources cited"
- Where: `ArticleActions.tsx` `TrustStrip` (lines 85 to 116); under byline in the guide header, y about 3% of page. All 30 guides.
- Why: freshness and evidence. Necessity: TRUST (useful to readers; supports the "rules change" point without a sentence).
- Duplicates: "Reviewed 2026-11-24" on every guide card in lists; "Last updated" on policy pages.
- Interrupts: no (one small line).
- Recommendation: KEEP.

**G2. Trust strip chip "Affiliate links disclosed"**
- Wording: "Affiliate links disclosed"
- Where: `ArticleActions.tsx` line 102, all 30 guides, y about 3%. At 390 px it wraps to its own line and starts with a stray "·".
- Why: pointer to the notice one screen lower. Necessity: none; it is not itself a disclosure ("disclosed" says the work was done; it does not say what the relationship is).
- Duplicates: G3 notice directly below the hero image.
- Interrupts: no, but it adds a claim without content.
- Recommendation: REMOVE. If the owner wants a header signal, make it the real words and a link: "Affiliate links: we may earn a commission" (jumps to the notice). Do not use both.

**G3. Top-of-article affiliate notice**
- Wording: "This article contains affiliate links. If you buy or book through them we may earn a commission at no extra cost to you. It does not change what we write. As an Amazon Associate I earn from qualifying purchases. How we earn money."
- Where: `src/components/site/AffiliateNotice.tsx`, rendered at `guides.$slug.tsx:134`. Shown only when the guide really renders an approved affiliate link (`affiliateUsage().count > 0`), correct behaviour. All 30 guides; always 132 px tall at 390 px, at y = 837 to 1,003 (below the hero image, above the table of contents).
- Why: FTC clear-and-conspicuous disclosure (R1, R2) and Amazon's statement (R4). Necessity: LEGAL + CONTRACT. Good design: plain words, before the content, not behind a click.
- Duplicates: footer S2, gear notice H1, `/affiliate-disclosure`, methodology, editorial standards, terms, privacy. On 2 guides also the "Related gear" block (G10).
- Interrupts: mildly (a grey 5-line box before the article, 132 px of an 844 px screen). Position is the issue: first affiliate link is 1,418 to 11,609 px below it.
- Recommendation: KEEP at the top; SHORTEN by moving the independence sentence out; pair it with a per-button label (G5). New wording: "This guide has affiliate links. If you buy or book through them we may earn a commission, at no extra cost to you. As an Amazon Associate I earn from qualifying purchases. How we earn money." Drop "It does not change what we write" here; it is a trust claim, not a disclosure, and stays on `/affiliate-disclosure` and `/methodology`. Keep the Amazon sentence only when an Amazon link renders (current logic is right).

**G4. Amazon statement (inside G3, G10, H1, U3)**
- Wording: "As an Amazon Associate I earn from qualifying purchases."
- Where: constant in `src/content/affiliates.ts:17`; appended in `AffiliateNotice.tsx`, `GearHubCards.tsx` (GearDisclosure), `GearPicks.tsx`, `PackingBuilder.tsx:243`. Appears 1 time on 28 guides, 2 times on 2 guides (the two with G10).
- Why: Operating Agreement Section 5. Necessity: CONTRACT (exact text).
- Duplicates: only the two guides noted. Not on `/affiliate-disclosure` (which promises it).
- Interrupts: no.
- Recommendation: KEEP exactly as is. Never reword. ADD once to `/affiliate-disclosure` (the "Where a link goes to Amazon" paragraph). Remove the second copy on the two guides (see G10).

**G5. Pick-card price line**
- Wording: "Check the current price on the listing before you buy."
- Where: `src/components/site/Markdown.tsx:110`, inside every pick card (`<aside data-pick>`), text-xs, below the buy button. 106 occurrences in 30 guides (1 to 6 per guide; most: 6 in `two-large-dogs-in-one-car` and `dog-travel-bowls-and-food-storage`). Also 2 prose variants: "Check the current price on any listing; we give none because prices change." (`portable-dog-fence-and-playpen-guide-for-rentals`, `content/.../*.ts:46`) and "Check the current price on the listing." (`dog-travel-first-aid-kit-guide.ts:102`).
- Why: the site shows no prices and says so; this tells readers where to look. Necessity: none. Amazon's price disclaimer (R5) applies only to displayed prices. It is a convenience hint.
- Duplicates: `/methodology` ("No prices, because they change"), HowWePick (H5), gear per-card line (H3), TS-guide body text ("Models, sizes... change, so confirm..."). Repeated up to 6 times in one guide.
- Interrupts: yes for scanning. It is the last line of each card, right after the buy button, so it is the thing the reader sees at the decision point; and it is not the thing the law wants there (an affiliate label).
- Recommendation: REWRITE, using that exact slot for the affiliate label (see section 5). New wording per Amazon card: "Affiliate link: we may earn a commission if you buy." Per Vrbo or other cards: same sentence with "book". Price advice becomes a single sentence at the start of the first pick card group in each guide, or on `/methodology` only: "We show no prices; check the price on the retailer's page."

**G6. "Sources and how we researched this" box**
- Wording: "Before writing, we reviewed 5 of the pages that currently rank for this topic, noted what they leave out, and checked facts against the official sources below. We haven't stayed at or inspected any property for this guide. Read our editorial standards." (number is 5 or 6 per guide), followed by the numbered source list.
- Where: `guides.$slug.tsx:201-229`, bottom of every guide (about 90% of page). 30 guides.
- Why: methodology plus a statement of what we did not do. Necessity: TRUST/GOOD PRACTICE. The "haven't stayed at or inspected" half is a meaningful honesty statement (R9 relevance).
- Duplicates: `/methodology`, `/editorial-standards` "How we research guides", `/about`, the in-body "How sure we are", the guide-index header sentence ("Each one is researched against what's already out there...").
- Interrupts: no; it is at the end where readers expect sources.
- Recommendation: SHORTEN and make the AI-use link visible. New: "Sources, with the date we read each. We research from published sources; we have not stayed at, inspected or tested anything covered here. How we research, including our use of AI tools: editorial standards." (link text "How we research, including our use of AI tools").

**G7. "How sure we are" section (29 guides) / "How we researched this" (1 guide)**
- Wording (template): heading "How sure we are", then 2 to 3 bullets such as "Confirmed by a source we cite: ..." and "Our judgment or unknown: ..." (example: `dog-ramp-or-steps-for-the-car-and-cabin`, and `vacation-rentals-with-no-pet-fee` which adds "What most people report: nothing here..." and "Unknown: ..."). The car-safety guide has "How we researched this" instead, with a body that also says "Models, sizes, and certifications change, so confirm...".
- Where: `content/guides/*.md` and `src/content/guides/*.ts` (author-written). Heading is also a table-of-contents entry (appears as "9How sure we are", "10How sure we are"). Around 78% of page.
- Why: calibrated confidence per guide; the site's strongest trust feature. Necessity: TRUST (verification language, one of the owner's differentiators).
- Duplicates: G6 and `/methodology` for the generic parts; the car-safety guide has both "How we researched this" and the G6 box.
- Interrupts: no (end of article, its own heading).
- Recommendation: KEEP the section, REWRITE bullets that are generic and keep only guide-specific content (what is confirmed, what is unknown, what to ask). Rename the one outlier heading to "How sure we are" and remove its repeated "models and sizes change" sentence. Do not add it to guides that lack it.

**G8. Vet/legal "not advice" lines (7 guides)**
- Exact wording found:
  - `dog-ramp-or-steps-for-the-car-and-cabin`: "We are not vets, and this is not a diagnosis or advice for your dog. These are the statements we read." (`content/guides/dog-ramp-or-steps-for-the-car-and-cabin.md:262`)
  - `puppy-at-a-vacation-rental`: "We are not vets and this guide does not give a vaccine schedule." (`.md:191`)
  - `vacation-rental-with-a-senior-dog`: "This is general information, not veterinary advice. Rules vary by place and host." (`.md:246`) and "This list is a prompt to call, not medical advice." (`.md:346`)
  - `bringing-a-dog-to-a-no-pets-rental` (source only; not in the public sitemap at audit time): "It is general information, not legal advice; rules vary by place and host." (`.md:182`)
  - `two-large-dogs-in-one-car`: "...this page is not legal advice." (`.md:24`) and "That is not legal advice, so read the statutes for each state you will cross." (`.md:250`)
  - `keep-a-dog-cool-on-a-summer-trip`: "...our table summary is not legal advice" (`.md:289`)
  - `breed-restrictions-at-vacation-rentals` (source only; not in the public sitemap at audit time): "This is general information, not legal advice, and it is not a loophole..." (`.md:265`)
  - `airbnb-pet-damage-charge-after-checkout`: "General information from the platforms' help pages, not legal advice." (`.md:184`)
- Why: scope limits on pages that touch health or law. Necessity: GOOD PRACTICE (not required by statute; protects reader and site). Meaningful safety information in these lines: where a guide discusses a sick or old dog the "call your vet" redirect is the safety message.
- Duplicates: `/terms` ("Nothing on this site is veterinary, legal or financial advice"), `/about` ("We hold no veterinary, legal or trainer credentials, so use a vet for health decisions").
- Interrupts: no; they sit in the relevant section.
- Recommendation: KEEP where a guide gives health or legal guidance (senior dog, puppy, ramp vet-source section, breed, two large dogs, hot weather). SHORTEN to one phrase in context. Do not add a generic version to guides that do not need one (the other 22 have none, correctly). Proposed uniform wording: "General information, not veterinary advice; ask your vet about your dog." and "General information, not legal advice; check the rules where you will be." Note that 8 guides carry the legal/vet scope in 1 to 2 places each; none repeats it more than twice.

**G9. Host-confirm advice lines inside guides**
- Examples: "Ask the host first. Does the home allow a live tree...", "Ask the host before bringing anything that could mark a floor...", "Unknown: your host's tree rule... Ask the host or call the clinic."
- Where: guide bodies (about 104 matching lines across 30 guides; heuristic match, mostly genuine advice, not boilerplate).
- Necessity: this is content and safety advice, not disclaimer text.
- Recommendation: KEEP. Excluded from the disclaimer totals in section 4. The only tidy-up: where a guide says "rules and fees change, confirm in writing" in three places, keep it in the guide's own "Before you book" or "What to ask" section.

**G10. "Related gear" duplicate affiliate block (2 guides)**
- Wording: "Some links below are affiliate links. If you buy through them we may earn a commission at no extra cost to you. It never changes which products we list or what we say about them. As an Amazon Associate I earn from qualifying purchases. Affiliate disclosure"
- Where: `RelatedProducts.tsx:43` via `GearDisclosure` (`GearHubCards.tsx:15`). Present on `new-years-eve-with-a-dog-in-a-vacation-rental` and `what-a-dog-really-costs-on-a-vacation-rental` (near the end of the page), which already have G3 at the top.
- Why: reuse of the gear-page component. Necessity: none beyond G3.
- Interrupts: yes (a second grey block mid-page-end, and a second Amazon sentence).
- Recommendation: REMOVE on guide pages. Keep each "Related gear" card's own per-button affiliate label (G5 style). The component can keep the block only for use on `/gear/*`.

**G11. GearPicks notices (dormant)**
- Wording: "Some links below are affiliate links. ... It never changes which products we list or what we say about them." and "We haven't tested these products. They were chosen against the criteria above using the maker's published specifications and independent standards, which are linked for each one." plus per card "Specs from ... confirm on the seller's page."
- Where: `src/components/site/GearPicks.tsx`. Not rendered in the current build (0 of 30 guides show it; `PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK` plus pick cards already in the body suppress it).
- Recommendation: COMBINE with G3/H1 before it is ever re-enabled; if it returns, it must not duplicate G3. No action on live pages.

**G12. Inline product links and tables**
- 304 affiliate links render in the 30 guides: pick-card buttons ("See it at Amazon"), inline text links (`aff:` and auto-linked product names) and table cells. All carry `rel="sponsored nofollow noopener"`; 0 Amazon links lack `sponsored`. The inline links carry no adjacent label (they rely on G3).
- Recommendation: KEEP the `rel`. Inline text links stay covered by G3 plus the label on the card the reader will reach; do not add a label to every inline link.

### 2C. Gear hub and category pages (`/gear`, 11 `/gear/<category>` pages, 62 product cards)

**H1. Gear category affiliate notice**
- Wording: "Some links below are affiliate links. If you buy through them we may earn a commission at no extra cost to you. It never changes which products we list or what we say about them. As an Amazon Associate I earn from qualifying purchases. Affiliate disclosure"
- Where: `GearHubCards.tsx:15` (`GearDisclosure`), rendered in `gear.$category.tsx:104`. At y about 5% of the page (about 740 px), before the first product link (1,548 to 2,508 px). 11 pages.
- Why: LEGAL + CONTRACT. This placement is the right pattern: before the links, short distance.
- Interrupts: mildly; fine.
- Recommendation: KEEP, same shortened wording as G3 (drop the independence sentence; it appears again in HowWePick bullet 3 on the same page, H5). Use one shared string so guides, gear and packing list say the same thing.

**H2. Per-card "Affiliate link" tag**
- Wording: "Affiliate link" (a span near the card actions).
- Where: `GearHubCards.tsx`, all 62 cards.
- Why: per-link marker. Necessity: GOOD PRACTICE. FTC FAQ (R2): "'Affiliate link' alone may not be understood by consumers."
- Recommendation: REWRITE to "Affiliate link: we may earn a commission if you buy." Same words as G5's new label so one component serves guides and gear.

**H3. Per-card spec-source line**
- Wording: "Specs from Sleepypod Atom Crash-Tested Carrier (Sleepypod, accessed 2026-11-16). Last verified 2026-11-16. Sizes, models and availability change: confirm on the seller's page."
- Where: `GearHubCards.tsx:77`, 62 cards; same line in dormant `GearPicks.tsx`.
- Why: dates the facts; limits reliance. Necessity: TRUST/GOOD PRACTICE (dated source is valuable; the generic warning is not).
- Duplicates: the warning sentence repeats 62 times; `/methodology` says "check the maker's page before you buy".
- Interrupts: no, but it is the 3rd "confirm" statement per card.
- Recommendation: SHORTEN the card line to "Specs from {title} ({publisher}), read {date}." Move "Sizes, models and availability change; confirm on the seller's page." to once per gear page, next to the notice (H1) or in HowWePick.

**H4. "Maker's claims and independent testing" label with "none cited"**
- Where: `GearHubCards.tsx:55`. Substantive content (what the maker claims vs what a named tester says). KEEP.

**H5. "No prices, no ratings" and "How we pick" repeats**
- Wording and where (all on each `/gear/<category>` page):
  - header: "No prices, no ratings." (11 pages)
  - `HowWePick` bullets: "Chosen against stated criteria. Every product here comes from the maker's own page or an independent standard. Each card cites its source and the date we read it." / "No prices and no star ratings, because prices change. Where a maker does not state something, we say so." / "A link, if there is one, never changes which products we list or what we write." plus "Read the full methodology, see our editorial standards, or report a correction." (12 pages, `GearHubCards.tsx:144`)
  - `/gear` intro: "Researched gear picks for road trips and rentals. This is not a store: no prices, no ratings, and we say what we could not confirm."
- Why: explains the no-price, no-rating rule and independence. Necessity: TRUST. Note: "never changes which products we list" is a promise repeated from H1.
- Duplicates: "no prices" appears 2 to 3 times per page; independence sentence twice per page (H1 and HowWePick bullet 3).
- Interrupts: no (end of page), but the header chip adds a third.
- Recommendation: REMOVE the header "No prices, no ratings." chip on category pages; REMOVE bullet 3 of HowWePick; keep bullets 1 and 2 and the three links. Keep the `/gear` intro sentence.

**H6. `/gear` footer sentence**
- Wording: "Packing for a trip? Try Pack your dog's bag. How we earn money: affiliate disclosure."
- Where: `gear.index.tsx:~140`. The hub shows category cards only (no affiliate links render).
- Recommendation: REMOVE the "How we earn money" half (no affiliate link on that page; the footer already links the disclosure). Keep "Packing for a trip? ...".

### 2D. Stay pages and stay cards (23 live stays, `/stays`, destination pages, home)

**T1. Stay "Sponsored link" line**
- Wording: "Sponsored link: we may earn a commission if you book, at no extra cost to you."
- Where: `src/components/site/BookingButton.tsx:48`. Rendered under each Vrbo button on all 23 stay pages: twice per page (hero button at y about 600 to 700, "Pet policy at a glance" panel button at about 3,300 to 4,100). Not shown on plain-link stays (those earn nothing).
- Why: FTC disclosure adjacent to the link (R1, R2), Vrbo terms ask for compliance with FTC guides (R6). Necessity: LEGAL.
- Duplicates: top and panel instances on the same page; footer S2.
- Interrupts: no; this is the model placement (directly under the button).
- Recommendation: KEEP both, REWRITE terminology: reserve "Sponsored" for host-paid placements (the "Sponsored" badge in `StayCard.tsx` and `/affiliate-disclosure`'s "Sponsored listings") and use "Affiliate link" here. New: "Affiliate link: we may earn a commission if you book, at no extra cost to you." Rationale: a reader who sees "Sponsored" on one stay and "Sponsored link" on all of them cannot tell paid placement from a commission. The `rel="sponsored"` attribute is unaffected.

**T2. "Photos belong to the host" note**
- Wording: "The photos belong to the host, so we do not copy them here. You can see every photo, the floor plan and live availability on the booking page."
- Where: `stays.$slug.tsx:152`, all 23 stays, y about 9%.
- Why: copyright and the "no listing photos" rule (AGENTS.md). Necessity: GOOD PRACTICE/explains why there is no gallery.
- Interrupts: no (it replaces a gallery).
- Recommendation: KEEP; consider shortening to "Photos stay with the host: see them all on the booking page."

**T3. "What is included" caveat**
- Wording: "As listed on the booking page. If a feature matters to you, confirm it with the host."
- Where: `stays.$slug.tsx:209-213`, all stays, y about 35%.
- Duplicates: T5 and T6 on the same page.
- Recommendation: REMOVE (covered by T5 "Before you book" and T6; the reader has been told twice by this point).

**T4. Guest-review paraphrase caveat**
- Wording: "Paraphrased from the booking page's guest reviews. Not confirmed by us."
- Where: `stays.$slug.tsx:255`, 18 stays, y about 45%.
- Why: R9 hygiene: we are not presenting reviews as our own. Necessity: GOOD PRACTICE.
- Recommendation: KEEP.

**T5. "Before you book" box**
- Wording: "These details come from the listing, and policies change. Confirm the fee, dog limits and fence with the host in writing, and ask any other questions before you book. Anything marked "Not confirmed" is unknown, not a yes. Our before-you-book checklist lists what to ask."
- Where: `stays.$slug.tsx:310-318`, all stays, y about 51%.
- Why: the key accommodation-policy warning. Necessity: GOOD PRACTICE; supports `/terms` "Information, not a guarantee".
- Interrupts: no; it is the right place.
- Recommendation: KEEP as the one stay-page confirmation message. This is the destination of S4's removal. Same copy appears on `/stays` (T8).

**T6. At-a-glance footer line**
- Wording: "Details read from the listing, not confirmed with the host" (or "Last verified {date}" for host-verified, none exist).
- Where: `stays.$slug.tsx:338-341`, directly above the booking button in the panel.
- Why: honest provenance beside the data. Necessity: TRUST/GOOD PRACTICE; contractual with AGENTS.md rule "never claim verified".
- Duplicates: T5, `/stays` header.
- Recommendation: KEEP; this is the useful short form (it sits with the data). Pair: SHORTEN T5 so it does not repeat the "not confirmed with the host" idea.

**T7. "Not confirmed" values**
- Where: stay facts (up to 5 per stay in the panel, `stays.$slug.tsx:71-97`), `StayCard` summary line "Pet fee: Not confirmed" (30 on `/stays`, 3 on home, 3 on each destination page), home "Two or more dogs confirmed".
- Why: filters never treat unknown as yes (AGENTS.md). Necessity: TRUST; this is the product's core data honesty.
- Recommendation: KEEP. The repetition is data, not boilerplate. If cards feel heavy, show "Pet fee: ask" or hide empty facts, but do not drop the unknown marker.

**T8. Stays index and filter notes**
- Wording: header "The details here come from each listing. Ask the host any additional questions before booking. Anything marked "Not confirmed" is unknown, not a yes, and filters only match details that are confirmed." (`stays.index.tsx:174`); filter hints: "Only stays that state a weight limit match. "Not confirmed" never does." and "Only stays where the feature is confirmed will match." (`stays.index.tsx:133`).
- Recommendation: KEEP header; SHORTEN: "Details come from each listing. "Not confirmed" means unknown, not yes, and filters match only confirmed details. Ask the host before booking." Keep filter hints as they are (instructional, they appear where the filter is).

**T9. Stay22 map notice (dormant)**
- Wording: "These listings come from our booking partner Stay22. We have not checked them, and the map cannot filter for dogs. Confirm the dog policy, fees, limits and fencing with the host before you book. Sponsored map: we may earn a commission if you book, at no extra cost to you. Try our dog policy checker and the before-you-book checklist first."
- Where: `src/components/site/Stay22Map.tsx`, used by `stays.index.tsx:329` and `destinations.$state.$town.tsx:140`. Not rendered now (`stay22AccountId: ""` in `content/settings.yml`).
- Why: LEGAL + GOOD PRACTICE when live. Meaningful accommodation-policy warning ("cannot filter for dogs").
- Recommendation: KEEP as is when enabled; rewrite "Sponsored map" to "Affiliate map". Do not shorten the "cannot filter for dogs" sentence.

### 2E. Tools (`/tools`, `/tools/will-my-dog-be-accepted`, `/tools/packing-list`, `/tools/checklist`)

**U1. Privacy assurances**
- Wording: `/tools`: "Small tools for the fiddly parts of booking with a dog. They run in your browser. Nothing you type is sent anywhere." `/tools/will-my-dog-be-accepted`: intro "...It runs in your browser and nothing you enter is sent anywhere." and below the form "Nothing you enter leaves your browser. We only count the tool being used."
- Where: `src/routes/tools.index.tsx`, `tools.will-my-dog-be-accepted.tsx`, `DogAcceptedChecker.tsx`.
- Why: privacy reassurance. Necessity: GOOD PRACTICE; must stay true (the page does send a usage count to GA4; the second sentence says so).
- Duplicates: same sentence twice on one page.
- Recommendation: COMBINE to one sentence under the form (where data is entered): "Runs in your browser; nothing you enter is sent anywhere. We only count that the tool was used." Remove it from the intro.

**U2. Checker result caveat**
- Wording: "...need a question first, and {n} look like a problem. This is based [on each manager's own page] ... so confirm your exact home in writing before you pay." and copy text "(a sample; confirm with the host)".
- Where: `DogAcceptedChecker.tsx:~204-206, 105`.
- Recommendation: KEEP (accommodation-policy warning at the point of use).

**U3. Packing list affiliate block**
- Wording: "Some links below are affiliate links. If you buy through them we may earn a commission at no extra cost to you. It never changes which products we list. As an Amazon Associate I earn from qualifying purchases. How we earn money." and "Hover over, tap or focus an item to see what it is, why you might want it and where to get it. The picks come from the makers' published specifications, explained in our guides."
- Where: `PackingBuilder.tsx:243-256`; `/tools/packing-list` at y about 17%.
- Why: LEGAL + CONTRACT. Placed before the item list, right place.
- Recommendation: KEEP with the shared shortened string; the second paragraph is instruction, KEEP.

**U4. `/tools/checklist`**: no disclosure language. Nothing to change.

### 2F. Home, data, and policy pages

**D1. Home verification language**
- Wording: "If a detail isn't confirmed, we say so instead of guessing." (about 31%); "Anything unconfirmed is marked "not confirmed"." (about 36%); "We read what 38 rental managers actually say about dogs" with "A convenience sample, read 2026-11-18, with a source link for every row." (about 75 to 78%); "We list properties whose pet policies we can verify. There's no cost to be considered." (about 88%).
- Where: `src/routes/index.tsx` and home components; `/list-your-property` repeats "We feature stays whose pet policies we can verify."
- Why: explain the product and invite listings. Necessity: TRUST. The last sentence conflicts with the owner decision (AGENTS.md: all legitimate stays render, details come from public listings; "never claim a stay is verified... unless that happened").
- Duplicates: "not confirmed" explained on home twice, on `/stays`, stay page, `/about`, `/editorial-standards`, `/terms`.
- Recommendation: REWRITE the verify sentences. Home: "We list stays whose pet rules are published or that hosts confirm to us. There's no cost to be considered." `/list-your-property`: "We feature stays whose pet policies are clear. We publish what we can confirm and mark the rest "not confirmed"." Remove the duplicate "Anything unconfirmed is marked "not confirmed"." from home (keep the one sentence in the intro).

**D2. `/data/pet-policies` sample caveats**
- Wording: "We read each manager's own pet policy page and wrote down what it says, with the source for every row. Read on 2026-11-18. This is a convenience sample, not a survey of the market..."; "This is one snapshot. Policies and fees change, so each row links to its source and the whole set is re-read on a schedule."; "Using these numbers? Please cite ... Corrections are welcome."
- Where: `data.pet-policies.tsx` (about 5%, 75%, 76%). The same convenience-sample point appears on home and 12+ guides.
- Why: statistical honesty. Necessity: GOOD PRACTICE/TRUST; needed to prevent misuse of the numbers.
- Recommendation: KEEP, COMBINE the two sample statements into one at the top, keep the re-read note at the bottom.

**P1. `/affiliate-disclosure`**
- Key wording: "Paws & Passage is free to read. To keep it that way, some links on this site may be affiliate links. If you click one and then book a stay or buy a product, we may earn a commission from the company, at no extra cost to you."; "Any article that contains an affiliate link shows a notice at the top, and every affiliate link is marked with the sponsored attribute for search engines."; "Where a link goes to Amazon, the page also shows Amazon's required statement."; "Commissions never decide whether a stay or product is listed, what we say about it, or which details we report."; "Maps of places to stay ... Stay22 ..."; "Sponsored listings: Occasionally a host may pay for extra visibility. Sponsored stays are always labeled "Sponsored"..."; "This disclosure is provided in line with the U.S. Federal Trade Commission's guidance on endorsements."
- Where: `src/routes/affiliate-disclosure.tsx`; in footer and linked from every notice.
- Necessity: LEGAL support; this is the canonical long form. Accurate, plain.
- Issues: (a) says the notice shows "at the top" but is silent on the new per-button label; (b) promises Amazon's statement but does not show it; (c) "may be affiliate links" is vaguer than the facts: 23 stays and 63 product links are approved today; (d) the Stay22 section describes a feature not live.
- Recommendation: KEEP, REWRITE lightly: add "Next to each buy or booking button you will see "Affiliate link"."; add the exact Amazon sentence; say "are affiliate links" (not "may be"); keep Stay22 text but add "when a map is shown".

**P2. `/methodology`**
- Key wording: "We research gear. We do not test it."; "Researched, not tested"; "Nothing on this site is personally tested unless a product page explicitly says so. Today, none do."; "What we do not do: No star ratings or scores. No prices, because they change. No customer reviews, quotes or testimonials... No claims of having used a product, visited a place or trained a dog with it."; "Affiliate relationships: ... Links follow a fixed order. If we have an approved affiliate arrangement ... marked sponsored. If not, we link to the manufacturer..."; "Specifications and certifications change, and recalls happen, so check the maker's page before you buy."
- Where: `src/routes/methodology.tsx`.
- Why: canonical long form for research method. Necessity: TRUST/GOOD PRACTICE.
- Recommendation: KEEP; this is where the removed repeats should land. ADD: one line "We show no prices; check the price on the retailer's page." and the "Sizes, models and availability change" sentence, as the home for G5 and H3.

**P3. `/editorial-standards`**
- Key wording: "Use of Artificial Intelligence: Paws & Passage uses artificial intelligence (AI) tools to assist with research, data analysis, content development, organization and website operations... We do not claim firsthand experiences, personal product testing, property visits or independent verification unless explicitly stated. Information may change over time, and readers are encouraged to confirm important details directly with the relevant provider." and "Our source checks are also done with AI tools: a separate AI review re-reads the cited pages before a guide is published. We do not describe these checks as review by a human fact-checker."; "What we never do"; "How we verify stays ... a listing-based stay is never described as verified."; "Money: We may earn commissions ... some placements may be sponsored and labeled as such. An article that contains affiliate links says so at the top."; "Researched is not tested".
- Where: `src/routes/editorial-standards.tsx`. This is the only AI disclosure on the site; it is reachable from the footer and the G6 box ("Read our editorial standards").
- Why: honest AI disclosure and independence. Necessity: GOOD PRACTICE; see R10 for possible EU duty.
- Duplicates: "Researched is not tested" repeats `/methodology` almost verbatim; "Money" repeats `/affiliate-disclosure`.
- Recommendation: KEEP the AI section as the single source; COMBINE "Researched is not tested" and "Money" into one-line links to `/methodology` and `/affiliate-disclosure`. Update "An article that contains affiliate links says so at the top" if the per-button label is added ("and beside each buy button").

**P4. `/about`**
- Key wording: "Paws & Passage is an independent publication launched in November 2026, so it is new. ... the site owner has chosen not to publish a personal bio, and we do not invent people, credentials or experience... We hold no veterinary, legal or trainer credentials, so use a vet for health decisions."; "What we don't do: We don't publish fake reviews, ratings or booking numbers. We don't claim to have visited places we haven't. If we don't know something, we say "not confirmed.""; plus a "Tools" bullet describing a cost calculator and host-question tool that were retired (`/tools/cost-calculator`, `/tools/host-questions` now 301).
- Where: `src/routes/about.tsx`. The only "we are independent" statement.
- Necessity: TRUST. The stale tool bullet is an accuracy defect.
- Recommendation: KEEP; REWRITE the tools bullet to match the tools that exist (will-my-dog-be-accepted, packing list, checklist). The "independent" claim should be qualified because affiliate income exists: "independent of the companies we link to" (the affiliate relationship is disclosed on `/affiliate-disclosure`).

**P5. `/terms`**
- Key wording: "Information, not a guarantee: Our guides, tools and stay listings are for general information. Stay details are taken from public listings and may be out of date; anything we could not find is marked "Not confirmed", and a listing on this site is not an endorsement, inspection or guarantee. Pet policies, fees, beach and trail rules, and property conditions change, sometimes without notice. Always confirm details directly with the host, booking platform or managing agency before you book or travel. Nothing on this site is veterinary, legal or financial advice. Ask your veterinarian about your own dog's health and fitness to travel."; "Bookings: We are not a booking agent..."; "Tools: Our calculators and generators, including the stay cost calculator, run in your browser and provide estimates and suggestions. Check totals against the provider's checkout before paying."; "Affiliate links and third-party sites"; "Your responsibility: You are responsible for your dog's safety and behavior..."; "Liability: To the extent permitted by law..."
- Where: `src/routes/terms.tsx`. Necessity: GOOD PRACTICE; the liability limitation is meaningful, keep.
- Recommendation: KEEP. Fix the stale "stay cost calculator" (tool retired) and say "tools"; leave everything else.

**P6. `/privacy`**
- Wording: "If you click an affiliate link, the partner's site (or its affiliate network) may set cookies or use similar tracking technologies, such as pixels, to record that you came from our site, so a purchase or booking can be credited to us..."; "We may use Google Analytics 4..."; "We do not run a newsletter..."; "Booking partners and other sites we link to have their own privacy policies. Some links may be affiliate links; see our affiliate disclosure."
- Where: `src/routes/privacy.tsx`. Necessity: LEGAL (privacy notice for partner tracking).
- Recommendation: KEEP. The repeated affiliate sentence (line 41) is harmless inside a privacy notice.

**P7. `/corrections`, `/contact`**
- Wording: "If a rule, fee or detail has changed or is wrong, contact us ... We check it against the source, fix confirmed errors and update the page's review date." Necessity: TRUST. KEEP.

---

## 3. Duplication map (how often the same message appears)

| Message | Where it appears | Count on a typical guide page | Keep where |
|---------|------------------|-------------------------------|------------|
| "We may earn a commission / affiliate" | Footer, chip, top notice, (related-gear block on 2), `/affiliate-disclosure`, `/methodology`, `/editorial-standards`, `/terms`, `/privacy` | 3 (footer, chip, notice) | Notice at top, label on each button, `/affiliate-disclosure`, footer pointer |
| "It does not change what we write / never changes which products we list" | Top notice, gear notice, HowWePick, packing list, `/affiliate-disclosure`, `/methodology`, `/editorial-standards` | 1 on guides, 2 on gear pages, 1 on packing | `/affiliate-disclosure` and `/methodology` only |
| "Check the price / prices change / no prices" | Pick cards (up to 6), HowWePick, header chip, gear intro, `/methodology`, `/affiliate-disclosure` | up to 6 on a guide, 3 on a gear page | Once per guide or gear page, plus `/methodology` |
| "Confirm with the host" | Footer (all pages), stay "Before you book", stay "What is included", panel, stays index, `/terms`, home, checker | footer + guide advice | Stay "Before you book", stays index, checker, `/terms`, in-guide advice |
| "We researched, we did not test or stay" | Sources box, HowWePick, GearPicks (dormant), `/methodology`, `/editorial-standards`, `/about` | 1 per guide | Sources box (short), `/methodology` |
| "Not confirmed" explained | Home x2, `/stays`, stay page x3, `/about`, `/editorial-standards`, `/terms`, `/data` | n/a (stays) | Stay panel line, `/stays` header, `/editorial-standards` |
| "No fake reviews / not invented" | Footer tagline (all pages), `/about`, `/methodology`, `/editorial-standards` | 1 (footer) | `/about`, `/methodology` |
| AI use | `/editorial-standards` only | 0 | One link from the Sources box on every guide |

---

## 4. Disclaimer-like blocks per guide page (30 guides, 390 px render)

Counted per page, excluding the 4 footer lines that appear on every page. Columns:
- Trust chips: "Last reviewed", "N sources cited", "Affiliate links disclosed" (3 per guide).
- Affiliate notices: the top notice, plus the "Related gear" duplicate where present.
- Price lines: occurrences of "Check the current price on (the|any) listing".
- How sure / researched: the "How sure we are" section (or "How we researched this") counted as 1 block.
- Sources box: the "Before writing, we reviewed N pages..." block (1).
- Vet/legal: explicit "not veterinary/legal/medical advice" lines (text match).
- Disclaimer blocks = chips + affiliate notices + price lines + how sure + sources box + vet/legal.
- Host-confirm advice lines: heuristic text match (policies change, confirm with host, ask the host, in writing, verify, etc.). Shown for information only and not in the total, because most are genuine advice in the body (see G9).
- Notice y and first affiliate link y: pixel positions from the top of the page at 390 px width.

Sorted from most to fewest disclaimer blocks.

| # | Guide (slug) | Type | Trust chips | Affiliate notices | Price lines | How sure / researched | Sources box | Vet/legal "not advice" | **Disclaimer blocks** | Host-confirm advice lines (info only) | Notice at y (px) | First affiliate link at y (px) | Affiliate links |
|--|--|--|--|--|--|--|--|--|--|--|--|--|--|
| 1 | two-large-dogs-in-one-car | planning | 3 | 1 | 6 | 1 | 1 | 1 | **13** | 5 | 958 | 3724 | 14 |
| 2 | dog-ramp-or-steps-for-the-car-and-cabin | planning | 3 | 1 | 5 | 1 | 1 | 1 | **12** | 4 | 885 | 3437 | 14 |
| 3 | dog-travel-bowls-and-food-storage | planning | 3 | 1 | 6 | 1 | 1 | 0 | **12** | 5 | 969 | 1418 | 29 |
| 4 | airbnb-pet-damage-charge-after-checkout | planning | 3 | 1 | 4 | 1 | 1 | 1 | **11** | 5 | 930 | 11383 | 8 |
| 5 | dog-hiking-gear-for-a-cabin-vacation | planning | 3 | 1 | 5 | 1 | 1 | 0 | **11** | 0 | 893 | 4942 | 12 |
| 6 | keep-a-dog-cool-on-a-summer-trip | planning | 3 | 1 | 4 | 1 | 1 | 1 | **11** | 3 | 941 | 8705 | 12 |
| 7 | portable-dog-fence-and-playpen-guide-for-rentals | gear | 3 | 1 | 5 | 1 | 1 | 0 | **11** | 8 | 958 | 3793 | 20 |
| 8 | protect-your-car-interior-from-a-dog-on-a-road-trip | planning | 3 | 1 | 5 | 1 | 1 | 0 | **11** | 2 | 930 | 4188 | 12 |
| 9 | puppy-at-a-vacation-rental | planning | 3 | 1 | 4 | 1 | 1 | 1 | **11** | 0 | 930 | 7117 | 8 |
| 10 | christmas-week-in-a-cabin-with-a-dog | planning | 3 | 1 | 4 | 1 | 1 | 0 | **10** | 9 | 1003 | 5033 | 9 |
| 11 | cold-weather-dog-gear-for-winter-cabin-trips | planning | 3 | 1 | 4 | 1 | 1 | 0 | **10** | 3 | 986 | 5442 | 8 |
| 12 | dog-car-safety-harness-and-crate-guide | gear | 3 | 1 | 4 | 1 | 1 | 0 | **10** | 2 | 930 | 2214 | 22 |
| 13 | dog-friendly-cabin-packing-list | checklist | 3 | 1 | 4 | 1 | 1 | 0 | **10** | 0 | 865 | 5934 | 8 |
| 14 | dog-life-jacket-for-lakes-and-beaches | planning | 3 | 1 | 4 | 1 | 1 | 0 | **10** | 1 | 865 | 3251 | 11 |
| 15 | if-your-dog-gets-loose-on-a-trip | planning | 3 | 1 | 4 | 1 | 1 | 0 | **10** | 4 | 930 | 7914 | 12 |
| 16 | new-years-eve-with-a-dog-in-a-vacation-rental | planning | 3 | 2 | 3 | 1 | 1 | 0 | **10** | 5 | 958 | 7329 | 11 |
| 17 | vacation-rental-with-a-senior-dog | planning | 3 | 1 | 2 | 1 | 1 | 2 | **10** | 2 | 930 | 11177 | 4 |
| 18 | can-dogs-go-in-a-rental-pool-or-hot-tub | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 5 | 837 | 9016 | 6 |
| 19 | can-you-leave-a-dog-alone-in-a-vacation-rental | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 7 | 865 | 6296 | 9 |
| 20 | dogs-in-georgia-state-park-cabins | destination | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 0 | 930 | 8820 | 6 |
| 21 | how-many-dogs-can-you-bring-to-a-vacation-rental | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 7 | 885 | 11609 | 9 |
| 22 | how-vacation-rental-pet-fees-work | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 4 | 902 | 6885 | 8 |
| 23 | vacation-rental-secure-fenced-yard | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 1 | 902 | 10052 | 7 |
| 24 | vacation-rental-with-a-reactive-dog | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 5 | 857 | 11382 | 6 |
| 25 | vacation-rentals-that-welcome-large-dogs | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 2 | 885 | 9514 | 6 |
| 26 | vacation-rentals-with-no-pet-fee | planning | 3 | 1 | 3 | 1 | 1 | 0 | **9** | 6 | 913 | 8147 | 9 |
| 27 | what-a-dog-really-costs-on-a-vacation-rental | planning | 3 | 2 | 2 | 1 | 1 | 0 | **9** | 5 | 865 | 10731 | 8 |
| 28 | dog-travel-first-aid-kit-guide | planning | 3 | 1 | 2 | 1 | 1 | 0 | **8** | 0 | 865 | 7981 | 4 |
| 29 | pet-friendly-vacation-rental-checklist | checklist | 3 | 1 | 2 | 1 | 1 | 0 | **8** | 2 | 902 | 8400 | 6 |
| 30 | vacation-rentals-with-no-dog-weight-limit | planning | 3 | 1 | 2 | 1 | 1 | 0 | **8** | 2 | 865 | 9301 | 6 |
Totals across the 30 guides: 90 trust chips, 32 affiliate notices, 108 price lines, 30 "how sure / researched" blocks, 30 sources boxes, 7 vet/legal lines = 297 blocks (mean 9.9, range 8 to 13). Price lines are 36% of the total. Host-confirm advice lines (information only): 104.

Reading the table: the pages with the most blocks (`two-large-dogs-in-one-car`, `dog-travel-bowls-and-food-storage`, `portable-dog-fence...`) are the ones with the most pick cards, because each card adds one price line. The leanest (`dog-travel-first-aid-kit-guide`, `dogs-in-georgia-state-park-cabins`) have 2 to 3 cards. After the proposed policy, a guide's count falls to about 5 to 6: 2 chips, 1 notice, 1 sources box, 1 how-sure section, 0 to 2 vet/legal lines (the per-button labels replace price lines one-for-one and are not counted as blocks since they sit inside the card).

Other page types (not in the 30-guide table), blocks per page excluding the 4 footer lines:
- Stay page (23 live): 8 to 9 (2 "Sponsored link" lines, photos note, included-caveat, review caveat on 18, "Before you book" box, panel provenance line, up to 5 "Not confirmed" values).
- Gear category page (11): 1 notice + 3 "How we pick" bullets + 1 header chip + per card 2 lines (affiliate tag, "Sizes, models..." line). Pages have 3 to 9 cards (62 total), so 10 to 24 blocks.
- `/gear`: 2 (intro sentence, "How we earn money" line) plus the 3 "How we pick" bullets.
- `/stays`: header note + 2 filter hints + 30 "Pet fee: Not confirmed" card lines.
- `/tools/packing-list`: 1 affiliate block (4 sentences) + 1 instruction paragraph.
- `/tools`, `/tools/will-my-dog-be-accepted`: 1 to 2 privacy assurances, 1 result caveat.
- `/tools/checklist`: none.
- `/data/pet-policies`: 3 (sample statements and re-read note).
- Home: 5 trust or verification statements.
- Legal and policy pages: each is itself the disclosure; they are covered in section 2F.

---

## 5. Proposed site-wide disclosure and trust-language policy

### 5.1 Principles
1. A material affiliate relationship is disclosed in plain words, before the reader reaches the link, and again next to each buy or booking button. Never behind a click, never only in the footer (R1, R2, R3).
2. Say each trust claim once, in the place that owns it. Other pages link to it.
3. If the message affects a decision at that moment (a pet policy that is unconfirmed, a vet-or-law limit on advice, "cannot filter for dogs"), it stays where the decision is made.
4. Never hide or shrink below readable size: the affiliate label, the Amazon statement, "Not confirmed", the Stay22 warning, health or safety guidance.
5. One vocabulary. "Affiliate link" means we may earn a commission. "Sponsored" means a host paid for placement. `rel="sponsored nofollow noopener"` on every affiliate link, unchanged.

### 5.2 What appears once per page

| Page type | Once-per-page item | Position | Standard wording |
|-----------|--------------------|----------|------------------|
| Any page that renders an approved affiliate link (guides, gear category, packing list; stay pages use the per-button label only) | Affiliate notice | Top of content, before the first affiliate link. On guides keep it under the hero image, above the table of contents. | "This guide has affiliate links. If you buy or book through them we may earn a commission, at no extra cost to you. [Amazon sentence if an Amazon link renders: As an Amazon Associate I earn from qualifying purchases.] How we earn money." On gear and packing pages replace "This guide" with "This page". |
| Every page | Footer pointer | Footer | "Some links on this site are affiliate links, and we may earn a commission. How we earn money." + Vrbo trademark line (readable) + nav links to the policy pages. |
| Every guide | Trust strip | Under the byline | "Last reviewed {date} · {n} sources cited" (no affiliate chip). |
| Every guide | Sources box | End of article | "Sources, with the date we read each. We research from published sources; we have not stayed at, inspected or tested anything covered here. How we research, including our use of AI tools: editorial standards." |
| Every guide that has one | How sure we are | Near the end, own heading | Guide-specific bullets only: confirmed by a cited source, our judgment, unknown, what to ask. No generic restatement of method. |
| Guides that give health or legal guidance | Scope line | In the relevant section, once | "General information, not veterinary advice; ask your vet about your dog." / "General information, not legal advice; check the rules where you will be." |
| Stay page | "Before you book" box | After the stay description | Keep current wording, minus the repeat of "not confirmed with the host" (that sits in the panel). |
| Stay page | Panel provenance line | Directly above the booking button | "Details read from the listing, not confirmed with the host" (unchanged). |
| `/stays` | Header note | Top | "Details come from each listing. "Not confirmed" means unknown, not yes, and filters match only confirmed details. Ask the host before booking." |
| Gear category page | Specs-change line | With the notice or inside "How we pick" | "Specs are as each maker's page read on the date shown. Sizes, models and availability change; confirm on the seller's page." |
| Gear category page | "How we pick" | End of page | Bullets 1 and 2 plus links to methodology, editorial standards, corrections. |
| Tool pages | Privacy assurance | Under the form | "Runs in your browser; nothing you enter is sent anywhere. We only count that the tool was used." (once) |

### 5.3 What appears per product card or button

| Where | Label | Wording | Notes |
|-------|-------|---------|-------|
| Every affiliate buy button in guides (pick cards, related gear) | Affiliate label, replaces the price line | "Affiliate link: we may earn a commission if you buy." | Same slot as today's price line (below the button, `text-xs`, but use `text-foreground/80` for readability against the card). Use "book" instead of "buy" for Vrbo. Same component on gear cards (replaces the bare "Affiliate link" tag) and related-gear. |
| Every Vrbo booking button on stay pages (hero and panel) | Affiliate label | "Affiliate link: we may earn a commission if you book, at no extra cost to you." | Already adjacent; wording and vocabulary change only. |
| Plain (non-affiliate) manufacturer or listing links | None | | They earn nothing; current behaviour is right. |
| Inline text links to affiliate products | None | | Covered by the top notice. They already carry `rel="sponsored"`. |
| Gear card | Spec source line | "Specs from {title} ({publisher}), read {date}." | Warning moves to the page-level line above. |
| Stay card | "Pet fee: Not confirmed" etc. | unchanged | Data, not boilerplate. |
| Stay with host-paid placement | "Sponsored" badge | unchanged | Dormant today. |

Why this closes the FTC gap: today a reader who lands on a pick card from the table of contents, a search result anchor or a share link sees a buy button and a price reminder and no commission statement. After the change, every button carries its own disclosure within a line of the click, and the top notice still serves readers who start at the top.

### 5.4 What moves to /methodology, /editorial-standards, /affiliate-disclosure

| Message | Moves to |
|---------|----------|
| "It does not change what we write / never changes which products we list" | `/affiliate-disclosure` and `/methodology` (already there). Remove from notices, HowWePick bullet 3, packing list. |
| "No prices, because prices change. Check the price on the retailer's page." | `/methodology` "What we do not do" (add the second sentence). One line per gear page and per guide at most. |
| "Sizes, models and availability change; confirm on the seller's page" | One line per gear page; also add to `/methodology` "Updating and corrections". Remove from the 62 per-card lines. |
| Method of research, "at least five pages", "gap analysis" | `/editorial-standards` (already there). Sources box keeps only the link. |
| "Researched, not tested" | `/methodology` canonical. `/editorial-standards` section collapses to a link. |
| "No fake reviews or invented listings" | `/about` and `/methodology` only (remove from footer tagline). |
| AI use | `/editorial-standards` stays canonical; every guide's Sources box links to it with the words "our use of AI tools". |
| Amazon statement | In every notice that has an Amazon link (unchanged); add once to `/affiliate-disclosure`. |

### 5.5 What is removed

| Item | Count | Why it is safe |
|------|-------|----------------|
| Pick-card "Check the current price on the listing before you buy." (replaced by the affiliate label) | 106 pick cards + 2 prose variants | Not required by Amazon or the FTC; the site shows no prices; the idea survives once per page and on `/methodology`. |
| "Affiliate links disclosed" header chip | 30 | It is not a disclosure; the notice and button labels are. |
| Footer "Always confirm pet policies with the host before booking." | 99 pages | Same advice is on every page where a booking decision exists. |
| Footer tagline "without fake reviews or invented listings" | 99 pages | Kept on `/about` and `/methodology`. |
| Duplicate affiliate block in "Related gear" | 2 guides | Top notice already covers the page. |
| Header chip "No prices, no ratings." and HowWePick bullet 3 | 11 and 12 gear pages | Stated again two lines away. |
| "How we earn money: affiliate disclosure" on `/gear` | 1 | No affiliate link on that page; footer links the page. |
| "As listed on the booking page. If a feature matters to you, confirm it with the host." on stays | 23 | Covered by "Before you book" and the panel line on the same page. |
| Home "Anything unconfirmed is marked "not confirmed"" | 1 | Said in the intro paragraph above it. |
| Duplicate privacy sentence in the checker intro | 1 | Said under the form. |

Net effect on a guide page: about 4 fewer lines (the chip and 2 to 6 price lines become labels), plus 2 fewer footer lines on every page. On a gear page: the header chip, one HowWePick bullet and one spec warning per card go.

### 5.6 What must never be hidden, collapsed, shrunk or moved behind a click
- The affiliate notice and per-button labels. No accordion, no tooltip, no "learn more" gate.
- The Amazon sentence, exactly: "As an Amazon Associate I earn from qualifying purchases."
- "Not confirmed" values and the "unknown, not a yes" explanation on stays.
- The Stay22 "We have not checked them, and the map cannot filter for dogs" warning if the map goes live.
- The "ask your vet", "call before booking" and legal-scope lines where a guide gives health or legal guidance, plus all dog-safety content in the body (heat, restraints, life jackets, first aid). None of the removals touches these.
- Print: the notice and button labels must remain in print (pick cards are `no-print`; if print is meant to be useful, keep the label out of the `no-print` wrapper or add the notice to the printed header).

---

## 6. Implementation checklist (for the owner or a follow-up task; nothing was changed in this audit)

| # | Change | File(s) |
|---|--------|---------|
| 1 | Replace the price line with the affiliate label (guide pick cards) | `src/components/site/Markdown.tsx:110` |
| 2 | Replace bare "Affiliate link" tag with the labelled sentence; shorten per-card spec line; add one page-level "Sizes, models and availability change" line; remove header chip and HowWePick bullet 3 | `src/components/site/GearHubCards.tsx` (lines 15, 77, 144), `src/routes/gear.$category.tsx`, `src/routes/gear.index.tsx` |
| 3 | Shorten notice wording; share one string across guides, gear and packing | `AffiliateNotice.tsx`, `GearHubCards.tsx`, `PackingBuilder.tsx:243`, `GearPicks.tsx` |
| 4 | Remove the "Affiliate links disclosed" chip | `src/components/site/ArticleActions.tsx:102` |
| 5 | Hide `GearDisclosure` on guide pages; keep on `/gear/*` | `src/components/site/RelatedProducts.tsx:43` |
| 6 | Footer: tagline, affiliate sentence, remove host-confirm line, fix Vrbo line colour | `src/components/site/SiteFooter.tsx`, `src/config/site.ts` (tagline) |
| 7 | Vrbo label vocabulary | `src/components/site/BookingButton.tsx:48`, `Stay22Map.tsx` |
| 8 | Remove stay "What is included" caveat; trim stays index header | `src/routes/stays.$slug.tsx:209`, `src/routes/stays.index.tsx:174` |
| 9 | Sources box wording and AI link | `src/routes/guides.$slug.tsx:201-212` |
| 10 | Rewrite "verify" claims on home and `/list-your-property`; fix stale tool references on `/about` and `/terms` | `src/routes/index.tsx`, `list-your-property.tsx`, `about.tsx`, `terms.tsx` |
| 11 | Add Amazon sentence and per-button label description to `/affiliate-disclosure`; add price and "sizes change" lines to `/methodology`; collapse duplicates on `/editorial-standards` | `src/routes/affiliate-disclosure.tsx`, `methodology.tsx`, `editorial-standards.tsx` |
| 12 | Rename the one outlier "How we researched this" heading in the car-safety guide to "How sure we are" and drop its repeated "models and sizes change" sentence | `src/content/guides/dog-car-safety-harness-and-crate-guide.ts` |

Tests that currently assert disclosure wording and must be updated with the change: `src/test/affiliate-links.test.tsx` (Amazon statement; keep the exact sentence), `src/test/gear-hub.test.tsx` (`GearDisclosure`), `src/test/meta-brands.test.ts`.

### Decisions for the owner
1. Amazon statement in the footer as well? Amazon's text does not require every page, and the on-page notice carries it wherever an Amazon link renders. Adding it once to the footer costs one line on every page and removes any doubt about "on your Site". Recommendation: no, add to `/affiliate-disclosure` only; revisit if Amazon ever queries the site.
2. "Affiliate link" vs "Sponsored" wording on stays (T1). Recommendation: "Affiliate link" for commissions, "Sponsored" for host-paid placement only.
3. EU exposure (R10): ask counsel whether the guides need an on-page AI label for EU readers. The Sources box link is a low-cost hedge and is consistent with what `/editorial-standards` already says.
4. Whether to keep "Last reviewed" on lists: it is useful, no change proposed.

### Limits of this audit
- Section 1 quotations came through a summarising fetch tool; the exact U.S. Amazon Section 5 sentence and Expedia's Schedule 6 trademark rules were not retrieved verbatim and should be checked on the live pages before any edit to the Vrbo line.
- The contrast figure for the Vrbo line is estimated from OKLCH lightness values, not measured from a rendered pixel.
- The "host-confirm advice" counts are keyword-based. All other counts are exact string matches on the rendered 390 px pages. Pixel positions are from one Chromium run and will vary by a few pixels with fonts.
- Pages not in the sitemap (3 guides that exist in `content/guides` but are not in the sitemap: `bringing-a-dog-to-a-no-pets-rental`, `breed-restrictions-at-vacation-rentals`, `pet-friendly-listing-red-flags`) were read from source only.
- Hosted pages other than those listed (`/destinations/*`, `/dogs/*`) were crawled and contain only the "Pet fee: Not confirmed" card lines, a "What to check before you book here" heading, and the standard footer; no separate disclosure language.
