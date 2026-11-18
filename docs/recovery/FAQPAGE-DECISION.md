# FAQPage structured data: decision (read 2026-11-18)

**Decision: REMOVE the FAQPage JSON-LD from guide pages. Keep the visible "Questions people ask" accordion exactly as it is.**

## What Google says (read on 2026-11-18)

- Google Search Central changelog, https://developers.google.com/search/updates : entry dated May 8, 2026, "Deprecating the FAQ rich result feature": "This feature will no longer appear in Google Search starting May 7, 2026." Entry dated June 15, 2026, "Removing documentation for the FAQ rich result feature": "The FAQ rich result feature is no longer shown in Google Search results."
- https://developers.google.com/search/docs/appearance/structured-data/faqpage : the page now carries only the deprecation notice (the feature documentation was removed on June 15, 2026).
- Neither page says whether site owners must remove existing FAQPage markup, and neither says it causes errors. (Not verified: whether Search Console still reports on it; no Search Console access.)

## Reasoning

- There is no rich-result benefit left, so the markup earns nothing in Google Search.
- It duplicated visible text on 24 guides, and on 10 of them its text contains the platform names Vrbo/Expedia, which the Expedia affiliate rules keep out of titles and meta tags (src/test/meta-brands.test.ts). Removing it also removes any argument about those names appearing in structured data.
- Removing JSON-LD does not change what visitors or crawlers see on the page. Only the `<script type="application/ld+json">` FAQPage block was removed (`src/routes/guides.$slug.tsx`); Article and BreadcrumbList JSON-LD are untouched; the visible FAQ (accordion and print list) is untouched. Rendered body HTML of the guides was compared before and after and is identical.
- Reversible: re-adding the block is a three-line change if Google or another consumer (Bing, AI assistants) is shown to use it; there is no evidence in the Google documents above that it is.
