import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () => pageHead({ title: "Terms of use", description: "The terms for using Paw & Passage's travel guides, tools and stay listings.", path: "/terms" }),
  component: () => <InfoPage title="Terms of use" updated="2026-11-16" body={`By using Paw & Passage you agree to these terms.

## Information, not a guarantee

Our guides, tools and listings are for general information. Pet policies, fees, beach and trail rules, and property conditions change, sometimes without notice. **Always confirm details directly with the host, booking platform or managing agency before you book or travel.** Nothing on this site is veterinary, legal or financial advice. Ask your veterinarian about your own dog's health and fitness to travel.

## Bookings

We are not a booking agent and are not party to any booking you make with a host or platform. Your booking is governed by that provider's terms.

## Tools

Our calculators and generators provide estimates and suggestions. Check totals against the provider's checkout before paying.

## Your responsibility

You are responsible for your dog's safety and behavior, and for following local laws, leash rules and property house rules.

## Content

The text, design and tools on this site belong to Paw & Passage. You're welcome to share links and short quotes with attribution. Please don't republish whole guides.

## Liability

To the extent permitted by law, Paw & Passage is not liable for losses arising from reliance on information on this site or from bookings made with third parties.

## Changes

We may update these terms; the date above shows the latest version. Questions? [Contact us](/contact).`} />,
});
