/** One source for the per-button affiliate labels, so every buy or booking button says the same thing. */
export const AFFILIATE_BUY_LABEL = "Affiliate link · We may earn a commission if you buy.";
export const AFFILIATE_BOOK_LABEL =
  "Affiliate link · We may earn a commission if you book, at no extra cost to you.";
/** Tailwind classes: small but readable (not the muted colour). */
export const AFFILIATE_LABEL_CLASS = "text-xs text-foreground/75";
/** One notice at the top of a shopping surface (the packing planner's product panels and its "Things to pick up" list), instead of a label on every button. Followed by Amazon's own sentence. */
export const AFFILIATE_SURFACE_NOTICE =
  "Some links are affiliate links; we may earn a commission, at no extra cost to you.";

/**
 * Body of /affiliate-disclosure. The paragraph about which stays are listed depends on `stayDirectoryMode`
 * (content/settings.yml), so the page is true in both modes. Pure on purpose (tested without the router).
 * `amazonSentence` is Amazon's required statement, passed in from AMAZON_DISCLOSURE so it exists in one place.
 */
export function affiliateDisclosureBody(
  mode: "affiliate-only" | "public-sources",
  amazonSentence: string,
): string {
  const stays =
    mode === "public-sources"
      ? `Whether a stay is listed does not depend on commissions. We list stays whose public Vrbo or Airbnb listing we have read, whether or not we can earn from them. The button on a stay page goes to that public listing. If we hold an affiliate link for that particular stay, the button uses it and carries the "Affiliate link" label. If we do not, the button is a plain link with no label, and we earn nothing from it.`
      : `Stays are listed when we have a booking link we can use for them, which means a link that may pay us a commission. A stay we have researched but have no such link for is not listed. So which stays appear does depend, in part, on whether we can earn from them. Once a stay is listed, what we report about it does not change with the commission: the details come from the public listing, are not confirmed with the host, and anything we could not find is marked "Not confirmed".`;
  return `Paws & Passage is free to read. Some links on this site are **affiliate links**. If you click one and then buy a product or book a stay, we may earn a commission from the company, at no extra cost to you.

## Where you will see a notice

- **Articles** (guides and town "things to do" pages) that contain an affiliate link show one short notice at the top, with a link to this page. The buttons inside the article do not each carry their own label.
- **Gear pages and product picks** show a notice above the product cards or the list of picks.
- **The packing planner** shows a notice at the top of its shopping panels and its "Things to pick up" list.
- **Stay pages**: each affiliate booking button has its own label directly under it: "Affiliate link · We may earn a commission if you book, at no extra cost to you."
- **Amazon.** Wherever a page has an Amazon link, the notice includes Amazon's required statement: ${amazonSentence}
- A notice appears only when the page really contains an affiliate link.

## What the links are

- Our product links go to Amazon, tagged with our tracking ID so Amazon can credit us. Our stay links go to Vrbo and are generated with Vrbo's affiliate tools. We do not make up or edit affiliate links.
- Affiliate links are marked \`sponsored\` and \`nofollow\`, which tells search engines they are commercial links. Links to a maker's own page, or a plain retailer page, are marked \`nofollow\` and earn us nothing.
- Links in a guide's source list go to the page we read. If that page is on Amazon, the link is a plain one with no tracking tag, and we earn nothing from it.

## Which stays are listed

${stays}

## Which products we mention

We choose products by researching the maker's published specifications and independent standards, and each article says so. We have not tested the products. See our [methodology](/methodology). We do not show prices or star ratings, because they change and we have not tested the products.

In articles we call out a product only when we have an affiliate link for it, so a product in an article is one that can earn us a commission. The Gear section lists the products we have researched, with the maker's page where we have no affiliate link. No product or stay is currently a paid placement.

## Maps of places to stay

Some pages may show a map of places to stay from Stay22. We have not checked those listings and the map cannot filter for dogs, so each map says so and points to our checkers. If you book through the map we may earn a commission at no extra cost to you.

## Sponsored listings

"Sponsored" would mean a host paid for placement, and it would always be labeled **"Sponsored"**. A commission link is called an "affiliate link", never "Sponsored". At the moment no stay is a paid placement.

## Questions

See our [editorial standards](/editorial-standards) or [contact us](/contact).

We wrote this page with the U.S. Federal Trade Commission's guidance on endorsements in mind.`;
}
