/** One source for the per-button affiliate label, so every buy button says the same thing. */
export const AFFILIATE_BUY_LABEL = "Affiliate link · We may earn a commission if you buy.";
/** Tailwind classes: small but readable (not the muted colour). */
export const AFFILIATE_LABEL_CLASS = "text-sm text-foreground/80";
/** One notice at the top of a shopping surface (the packing planner's product panels and its "Things to pick up" list), instead of a label on every button. Followed by Amazon's own sentence. */
export const AFFILIATE_SURFACE_NOTICE =
  "Some links are affiliate links; we may earn a commission, at no extra cost to you.";

/**
 * Body of /affiliate-disclosure. Pure on purpose (tested without the router).
 * `amazonSentence` is Amazon's required statement, passed in from AMAZON_DISCLOSURE so it exists in one place.
 */
export function affiliateDisclosureBody(amazonSentence: string): string {
  return `Paws & Passage earns money in two ways. The main one is the one-time purchase of the full Adventure Passport (see the [terms](/terms)). The second is affiliate links in our guides and gear pages: if you click one and then buy a product, we may earn a commission from the company, at no extra cost to you.

## Where you will see a notice

- **Guides** that contain an affiliate link show one short notice at the top, with a link to this page. The buttons inside the guide do not each carry their own label.
- **Gear pages and product picks** show a notice above the product cards or the list of picks.
- **The packing planner** shows a notice at the top of its shopping panels and its "Things to pick up" list.
- **Amazon.** Wherever a page has an Amazon link, the notice includes Amazon's required statement: ${amazonSentence}
- A notice appears only when the page really contains an affiliate link.

## What the links are

- Our product links go to Amazon, tagged with our tracking ID so Amazon can credit us. We do not make up or edit affiliate links.
- Affiliate links are marked \`sponsored\` and \`nofollow\`, which tells search engines they are commercial links. Links to a maker's own page, or a plain retailer page, are marked \`nofollow\` and earn us nothing.
- Links in a guide's source list go to the page we read. If that page is on Amazon, the link is a plain one with no tracking tag, and we earn nothing from it.

## Which products we mention

We choose products by researching the maker's published specifications and independent standards, and each guide says so. We have not tested the products. See our [methodology](/methodology). We do not show prices or star ratings, because they change and we have not tested the products.

In guides we call out a product only when we have an affiliate link for it, so a product in a guide is one that can earn us a commission. The Gear section lists the products we have researched, with the maker's page where we have no affiliate link. No product is currently a paid placement.

## Adventures

The adventures in the Passport are not advertisements. No adventure is sponsored, and affiliate links do not decide which adventures we write or show.

## Questions

See our [editorial standards](/editorial-standards) or [contact us](/contact).

We wrote this page with the U.S. Federal Trade Commission's guidance on endorsements in mind.`;
}
