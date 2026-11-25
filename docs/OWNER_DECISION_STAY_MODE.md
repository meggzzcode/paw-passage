# Owner decision: stay directory mode

Prepared 2026-11-25. **DECIDED 2026-11-25: owner approved `public-sources`; `content/settings.yml` now says `stayDirectoryMode: "public-sources"` (commit `daa758f`).** Disclosure wording approved in principle with a legibility correction (notices now 14px; one repeat beside the first product card in an article). Nothing is deployed.

## Recommendation

`public-sources`, subject to your approval. Reason: it keeps the 78 stay pages and the 23 indexable ones alive whatever happens to the Vrbo affiliate links (which are the seller's and do not transfer), and it lets the disclosure page say that listing does not depend on commissions. Cost: stays without an approved link earn nothing.

## Numbers (tested in `src/test/stay-mode-public-sources.test.ts`)

| Situation | affiliate-only | public-sources |
|---|---|---|
| Seller Vrbo links in place (today) | 78 listed, 23 indexable, 55 noindex, 23 stay URLs in sitemap | identical: 78 / 23 / 55 / 23 |
| Seller Vrbo links removed | 0 listed, 0 indexable, `/stays` and all stay URLs leave the sitemap, stay pages 404 | 78 listed, 23 indexable, 55 noindex, 23 stay URLs plus `/stays` in sitemap |

The indexing rule (`src/content/publish-rule.ts`) does not look at the mode, so the same 23 stays are indexable in both. 83 stay records exist; 5 have a non-Vrbo source (4 Vacasa, 1 Explore Georgia page) and are never listed in either mode.

## What happens to Vrbo affiliate links

Under `public-sources` while links still exist: a stay with an approved affiliate link keeps its affiliate button (label "See photos and check dates on Vrbo", `rel="sponsored nofollow noopener"`, with the "Affiliate link" label under it). A stay without one gets a plain button, "View the listing on Vrbo", `rel="nofollow noopener"`, no label. Why: hiding a working, labelled link would throw away commission for no honesty gain, and every button states truthfully what it is. Tested. When the seller links are switched off (`node scripts/neutralize-seller-vrbo-links.mjs --write`) all 78 become plain links.

## When buyer IDs are missing

Amazon tracking ID empty: Amazon buttons vanish (see `docs/BUYER_AFFILIATE_TRANSITION.md` section 5). Stays are unaffected in `public-sources`; in `affiliate-only` they all disappear until the buyer adds their own approved Vrbo links.

## Buyer maintenance

`public-sources` needs no affiliate account to keep the directory. The buyer may add their own deeplinks later and tick Approved; those stays then show the labelled affiliate button. Nothing else to maintain except the 78 source URLs (below).

## Remaining source-link risk

- All 78 displayed URLs are `https://www.vrbo.com/<numeric id>`: no query string, no `/affiliate/` path, no tracking parameter (tested for every stay).
- Probe 2026-11-25: 20 of the 78 (evenly spaced), one GET each, 2 s apart, normal browser User-Agent: 20 returned HTTP 200, none 403/429/redirect. A 200 shows the address responds, not that the page is still a live listing for that property. The other 58 were not probed. Listings can be delisted or renamed at any time; no script can confirm the property matches the stay name. Spot-check in a browser.
- Details on the stay pages are read from the listing and say "not confirmed with the host"; the listing text may change after we read it.

## Activation

Change one line in `content/settings.yml`:

```
stayDirectoryMode: "public-sources"
```

Expected effects: no change in visible/indexable counts while links exist; if links are removed later, the directory stays at 78/23. Buttons as above. `/affiliate-disclosure` switches its stay paragraph to "Whether a stay is listed does not depend on commissions..." (see below). Then rebuild and run `scripts/verify-site.mjs`. Revert by restoring `"affiliate-only"`.

## Disclosure wording

The page `/affiliate-disclosure` is built by `affiliateDisclosureBody(mode, amazonSentence)` in `src/lib/disclosure.ts` and now describes only what the code does:

- One notice at the top of articles with an affiliate link; a notice above gear cards and above guide product picks; a notice at the top of each planner shopping panel and the "Things to pick up" list; a label under each stay booking button. No claim that every button has its own label. Amazon's exact sentence appears with every Amazon notice. Verified at 390 px on a built copy: article notice at about y 470, gear notice 500 to 565, stay label directly under the button, planner notices above their links.
- Affiliate links are `sponsored nofollow`; maker and plain retailer links `nofollow`; source-list links (including to Amazon) are plain, untagged.
- Stay paragraph by mode. affiliate-only: "Stays are listed when we have a booking link we can use for them, which means a link that may pay us a commission." public-sources: "Whether a stay is listed does not depend on commissions."
- Products: researched from specifications and standards, not tested; in articles a product is called out only when it has an affiliate link (`PRODUCT_CALLOUTS_REQUIRE_AFFILIATE_LINK`); no paid placements exist today (no `sponsored` stay in content).

For owner review (not legal advice):
1. FTC guidance (Disclosures 101) asks for disclosures close to the endorsement, not hidden at the end or behind a link. A notice at the top of an article, rather than beside each button, is a judgement call; the planner and stay pages put it closer. Consider a legal read.
2. Amazon Operating Agreement section 5 requires the exact sentence "clearly and prominently"; it is shown inside the same small-text notice (11 px on mobile in articles). Whether that is prominent enough is for you or Amazon to decide.
3. `/methodology` says "Commissions do not decide whether a product is included", and `/editorial-standards` says affiliate links "never" change what we report. In articles, products without an affiliate link are not called out, so the methodology sentence is not accurate. I did not edit those pages; they should be aligned.
4. The page names Amazon and Vrbo as programmes. If the buyer is not in them, edit the page (`docs/BUYER_AFFILIATE_TRANSITION.md` section 9).
5. "No product or stay is currently a paid placement" is true of the content today; revisit if sponsorship is ever sold.
