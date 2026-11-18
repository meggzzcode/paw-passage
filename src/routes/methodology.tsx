import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/methodology")({
  head: () => pageHead({ title: "Product review methodology", description: "How Paws & Passage researches and chooses dog travel gear: what we read, what researched means, and why nothing is described as tested unless we say so.", path: "/methodology" }),
  component: () => <InfoPage title="Product review methodology" updated="2026-11-18" intro="We research gear. We do not test it." body={`This page explains how we choose the dog travel gear that appears in our guides. It is short on purpose, and it describes only what we actually do.

## Researched, not tested

When a guide discusses a harness, crate, first aid kit or pen, we have **not** bought, handled or tested it. "Researched" means we read the sources below and compared what they say. **Nothing on this site is personally tested unless a product page explicitly says so.** Today, none do. If that ever changes, a tested product will be labeled as such, with the method and dates, and kept apart from researched pieces.

## What we read

- The maker's own specification and size pages.
- Independent standards or certification bodies where one exists, for example the Center for Pet Safety for crash-test claims.
- Veterinary, government and park-agency pages for health and safety guidance.

Each guide lists its sources with the publisher and the date we checked them. A maker's claim is reported as the maker's claim, not as our finding.

## How we choose what to include

We write the criteria first, for example the safety standard, the size and weight range, the materials, and the return and warranty terms. Then we list the products that fit those criteria. A label such as "closest match for large dogs" means a product fits the stated criteria in the sources we read. It is a comparison of specifications, not a ranking and not a verdict from use.

## What we do not do

- No star ratings or scores.
- No prices, because they change.
- No customer reviews, quotes or testimonials, and no invented ones.
- No claims of having used a product, visited a place or trained a dog with it.

## Affiliate relationships

Some links may earn us a commission. Commissions do not decide whether a product is included or what we say about it, and products without an affiliate link are covered the same way. Links follow a fixed order. If we have an approved affiliate arrangement for the product, we use that link, marked \`sponsored\`. If not, we link to the manufacturer. If there is no suitable manufacturer page, we use a plain retailer link marked \`nofollow\`. We never create an affiliate link we are not approved for. Details are in our [affiliate disclosure](/affiliate-disclosure).

## Updating and corrections

Each guide shows when it was last reviewed. Specifications and certifications change, and recalls happen, so check the maker's page before you buy. If you spot a changed spec or an error, [contact us](/contact). We fix confirmed errors and record notable changes in our [corrections log](/corrections).

## Related

Our wider rules are in the [editorial standards](/editorial-standards).`} />,
});
