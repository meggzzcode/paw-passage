import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/refund-policy")({
  head: () =>
    pageHead({
      title: "Refund policy",
      description:
        "How refunds work for the full Adventure Passport: how to ask, what happens to your access and your progress, and where to get help.",
      path: "/refund-policy",
    }),
  component: () => (
    <InfoPage
      title="Refund policy"
      updated="2026-11-26"
      body={`The full Adventure Passport is a one-time purchase, sold through our checkout provider, Gumroad. This page explains how a refund works. It does not set a refund period of its own.

## Refund terms at checkout

Any refund terms that apply to your purchase, including how long you have to ask, are shown on the checkout page before you pay. They are set by our checkout provider and govern the transaction. This page describes our process; if it differs from the provider's terms, the provider's terms for your purchase apply. We do not state a refund window here because it is set on the checkout listing, not on this site.

## How to ask

[Contact us](/contact) and tell us the email address you used to buy and the date of the purchase. Do not send your license key. A refund is issued through Gumroad, to the way you paid. Gumroad's own terms and timing apply to when the money reaches you.

## What happens to your access

When a purchase is refunded, access to the full Passport for that purchase is switched off. Our server re-checks purchases at most once a day, when you use the Passport, so this can take up to about a day after the refund. You can keep using the free Passport.

## What happens to your progress

Your progress is yours. It stays on your device, and your synced copy is kept unless you delete it. Adventures you completed from the full library stay in your history. Keepsake images you already saved are yours and stay on your device. You can download or delete your data any time from your Passport page. See our [privacy policy](/privacy).

## If something went wrong

If you were charged but cannot unlock the Passport, try [restore access](/restore-access) first, with the license key from your purchase email, then [contact us](/contact). A payment dispute or chargeback with your bank also switches access off, so please contact us first.`}
    />
  ),
});
