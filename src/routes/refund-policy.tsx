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
      body={`The full Adventure Passport is a one-time purchase. This page explains how a refund works.

## Refund terms at checkout

Any refund terms that apply to your purchase are shown on the checkout page before you pay. If they differ from this page, the checkout page for your purchase applies.

## How to ask

[Contact us](/contact) and tell us the email address you used to buy and the date of the purchase. Do not send your license code. Checkout and payment are handled by our checkout provider, so a refund is issued through them, to the way you paid.

## What happens to your access

When a purchase is refunded, access to the full Passport for that purchase is switched off. Our server re-checks purchases from time to time, so this can take up to about a day after the refund. You can keep using the free Passport.

## What happens to your progress

Your progress is yours. It stays on your device, and your synced copy is kept unless you delete it. Adventures you completed from the full library stay in your history. You can download or delete your data any time from your Passport page. See our [privacy policy](/privacy).

## If something went wrong

If you were charged but cannot unlock the Passport, try [restore access](/restore-access) first, then [contact us](/contact). We would rather fix it than have you wait.`}
    />
  ),
});
