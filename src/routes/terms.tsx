import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/terms")({
  head: () =>
    pageHead({
      title: "Terms of use",
      description:
        "The terms for using Paws & Passage: the Adventure Passport, the one-time purchase and what it includes, refunds, guides, affiliate links and liability.",
      path: "/terms",
    }),
  component: () => (
    <InfoPage
      title="Terms of use"
      updated="2026-11-26"
      body={`By using Paws & Passage you agree to these terms.

## Gentle suggestions, not advice

The adventures and guides are for general information and fun. Every adventure is a suggestion your dog can stop at any time. Nothing on this site is veterinary, training, nutrition, medical or legal advice. Ask your veterinarian about your own dog's health and fitness, and a qualified trainer about behavior. You are responsible for your dog's safety and behavior and for following local laws, leash rules and the rules of any place you visit.

## The free Passport

The free Passport works without an account. Your progress is stored on your device, as described in our [privacy policy](/privacy). If you clear your browser data without exporting, that progress is gone. The free Passport includes one personalized introductory adventure. Making a personalized keepsake from your own photo is part of the full Passport.

## The full Passport: a one-time purchase

The full Passport is a **one-time purchase**. It is not a subscription and does not renew, so you pay once and it is yours to keep. "Yours to keep" means we will not charge renewals or put a time limit on your purchase. It is not a promise that the service will run unchanged indefinitely: websites, browsers and hosting providers change, and we may change or retire features. Download a backup of your progress from your Passport page now and then. The price is shown at checkout before you pay. Checkout and payment are handled by our checkout provider, Gumroad, who sends you a license key. Refunds and access are covered in our [refund policy](/refund-policy).

## What you are buying: the edition

The full Passport is sold as an edition. A purchase unlocks the library of the edition you bought, as described on the [Get the Passport](/unlock) page. We do not promise to add adventures, features or updates. If we do add adventures to your edition, they are included at no charge. If we ever publish a new edition as a separate product, we will say clearly that it is a new edition and what it costs, and your purchase is not affected.

Your access is for personal use by you and your household, on your own devices. Please do not share your license key or republish the premium adventures. You can restore access on a new device with your license key on the [Restore access](/restore-access) page.

## Refunds and access

See our [refund policy](/refund-policy). If a purchase is refunded or reversed by a payment dispute, access to the full Passport for that purchase is switched off. Your progress on your device is kept, and the free Passport keeps working.

## Tools and guides

Our guides and the packing list provide suggestions only. Rules, specifications and availability change, so confirm important details with the relevant provider. Guides are researched, not tested, as explained in our [methodology](/methodology).

## Affiliate links and third-party sites

Some links are affiliate links, as explained in our [affiliate disclosure](/affiliate-disclosure). We do not control third-party sites, products or services, and their terms and prices apply.

## Content

The text, design and adventures on this site belong to Paws & Passage. You're welcome to share links and short quotes with attribution. Please don't republish whole guides or adventures. The keepsakes you make from your own photos are yours.

Photos on our guides are licensed from Unsplash under the Unsplash License, which gives us the right to use them. We do not own them and claim no exclusive rights in them.

## Liability

To the extent permitted by law, Paws & Passage is not liable for losses arising from reliance on information on this site or for the actions of third-party sellers and sites. Nothing here limits any right you have under consumer law that cannot be limited.

## Changes

We may update these terms; the date above shows the latest version. Questions? [Contact us](/contact).`}
    />
  ),
});
