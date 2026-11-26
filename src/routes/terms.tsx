import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      title: "Terms of use",
      description:
        "The terms for using Paw & Passage: the Adventure Passport, the one-time purchase and what it includes, refunds, guides, affiliate links and liability.",
      path: "/terms",
    }),
  component: () => (
    <InfoPage
      title="Terms of use"
      updated="2026-11-26"
      body={`By using Paw & Passage you agree to these terms.

## Gentle suggestions, not advice

The adventures and guides are for general information and fun. Every adventure is a suggestion your dog can stop at any time. Nothing on this site is veterinary, training, nutrition, medical or legal advice. Ask your veterinarian about your own dog's health and fitness, and a qualified trainer about behavior. You are responsible for your dog's safety and behavior and for following local laws, leash rules and the rules of any place you visit.

## The free Passport

The free Passport works without an account. Your progress is stored on your device, as described in our [privacy policy](/privacy). If you clear your browser data without exporting, that progress is gone.

## The full Passport: a one-time purchase

The full Passport is a **one-time purchase**. It is not a subscription and does not renew. The price is shown at checkout before you pay. Checkout and payment are handled by our checkout provider, who sends you a license code.

## What you are buying: the edition

The full Passport is sold as an edition. A purchase unlocks the library of the edition you bought, as described on the [Get the Passport](/unlock) page when you bought it. If we add adventures to that edition, they are included. If we ever publish a new edition as a separate product, we will say clearly that it is a new edition and what it costs, and your purchase is not affected.

Your access is for personal use by you and your household, on your own devices. Please do not share your license code or republish the premium adventures.

## Refunds and access

See our [refund policy](/refund-policy). If a purchase is refunded or reversed by a payment dispute, access to the full Passport for that purchase is switched off. Your progress is kept, and the free Passport keeps working.

## Tools and guides

Our guides and the packing list provide suggestions only. Rules, specifications and availability change, so confirm important details with the relevant provider. Guides are researched, not tested, as explained in our [methodology](/methodology).

## Affiliate links and third-party sites

Some links are affiliate links, as explained in our [affiliate disclosure](/affiliate-disclosure). We do not control third-party sites, products or services, and their terms and prices apply.

## Content

The text, design and adventures on this site belong to Paw & Passage. You're welcome to share links and short quotes with attribution. Please don't republish whole guides or adventures. The keepsakes you make from your own photos are yours.

Photos on our guides are licensed from Unsplash under the Unsplash License, which gives us the right to use them. We do not own them and claim no exclusive rights in them.

## Liability

To the extent permitted by law, Paw & Passage is not liable for losses arising from reliance on information on this site or for the actions of third-party sellers and sites. Nothing here limits any right you have under consumer law that cannot be limited.

## Changes

We may update these terms; the date above shows the latest version. Questions? [Contact us](/contact).`}
    />
  ),
});
