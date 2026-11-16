import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/affiliate-disclosure")({
  head: () => pageHead({ title: "Affiliate disclosure", description: "How Paw & Passage earns money through affiliate links and sponsored listings, and how we keep that separate from our recommendations.", path: "/affiliate-disclosure" }),
  component: () => <InfoPage title="Affiliate disclosure" updated="2026-11-16" body={`Paw & Passage is free to read. To keep it that way, some links on this site may be **affiliate links**. If you click one and make a booking, we may earn a commission from the booking platform or partner, at no extra cost to you.

## How this works in practice

- Booking buttons appear only on stays whose details we have verified, and only when we have an approved partnership for that link.
- Affiliate links are marked with the \`sponsored\` attribute for search engines.
- Commissions never decide whether a stay is listed, what we say about it, or which details we report. A stay with no affiliate link is listed the same way as one with a link.

## Sponsored listings

Occasionally a host may pay for extra visibility. Sponsored stays are always labeled **"Sponsored"**, still have to meet the same verification standards, and their pet-policy details are reported exactly as for any other stay.

## Questions

See our [editorial standards](/editorial-standards) or [contact us](/contact).

This disclosure is provided in line with the U.S. Federal Trade Commission's guidance on endorsements.`} />,
});
