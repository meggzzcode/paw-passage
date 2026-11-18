import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => pageHead({ title: "Affiliate disclosure", description: "How Paws & Passage earns money through affiliate links and sponsored listings, and how we keep that separate from our recommendations.", path: "/affiliate-disclosure" }),
  component: () => <InfoPage title="Affiliate disclosure" updated="2026-11-16" body={`Paws & Passage is free to read. To keep it that way, some links on this site may be **affiliate links**. If you click one and then book a stay or buy a product, we may earn a commission from the company, at no extra cost to you.

## How this works in practice

- A link appears only when we have an approved arrangement with that company. Booking buttons appear only on stays whose details we have verified.
- Any article that contains an affiliate link shows a notice at the top, and every affiliate link is marked with the \`sponsored\` attribute for search engines.
- Where a link goes to Amazon, the page also shows Amazon's required statement.
- We do not show prices or star ratings for products, because they change and we have not tested the products. We choose products using the maker's published specifications and independent standards, and each article says so.
- Commissions never decide whether a stay or product is listed, what we say about it, or which details we report. A stay or product with no affiliate link is covered in the same way as one with a link.

## Maps of places to stay

Some pages may show a map of places to stay from our booking partner Stay22. We have not checked those listings and the map cannot filter for dogs, so each map says so and points to our checkers. If you book through the map we may earn a commission at no extra cost to you.

## Sponsored listings

Occasionally a host may pay for extra visibility. Sponsored stays are always labeled **"Sponsored"**, still have to meet the same verification standards, and their pet-policy details are reported exactly as for any other stay.

## Questions

See our [editorial standards](/editorial-standards) or [contact us](/contact).

This disclosure is provided in line with the U.S. Federal Trade Commission's guidance on endorsements.`} />,
});
