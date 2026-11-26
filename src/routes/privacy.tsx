import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy policy",
      description:
        "What information Paws & Passage keeps on your device and on our server, what we never collect (photos), how analytics and cookies work, and your choices.",
      path: "/privacy",
    }),
  component: () => (
    <InfoPage
      title="Privacy policy"
      updated="2026-11-26"
      body={`This policy explains what happens to information when you use Paws & Passage and the Adventure Passport.

## Your progress stays on your device

The free Passport needs no account. Your dog's profile, your preferences, favorites, saved adventures, completed adventures, memories and collections are saved in your browser's local storage on your device. They are not sent to us. You can export a copy, or clear everything, from your Passport page, or by clearing your browser's site data.

## Photos never leave your device

Keepsakes are made from a photo you choose, entirely on your device. The photo is **not uploaded**, not sent to any server, not included in analytics or error reports, and not saved by the Passport unless you save the finished image yourself. Images you export are re-drawn so they do not carry the original photo's hidden metadata, such as location.

## If you buy the full Passport

- **Payment.** Checkout is handled by our checkout provider, Gumroad. They take your payment and send you a license code by email. We never see your card details. Their own privacy policy applies to what you give them.
- **Unlocking.** When you enter your code, our server sends it to the checkout provider to confirm that it is valid. The code is sent in the body of a request, never in a web address. We keep it only in sealed (encrypted) form so we can check later whether a purchase was refunded.
- **Sync.** To let your progress follow you across devices, we then keep a copy of your progress on our server, in storage hosted by Netlify. The record is tied to a random identifier, not to your name or email. Your free progress on the device is merged into it. We do not store photos or keepsake images there.
- **A cookie.** Unlocking sets one signed, secure cookie that keeps you signed in on that device. It is needed for the full Passport to work and is not used for advertising.
- **Your choices.** You can download your synced progress and you can delete your record from your Passport page. Deleting removes your synced record. It does not undo the purchase.

## Analytics

We may use Google Analytics 4 to understand which pages are useful. For the Passport we send only a short list of named events, such as an adventure being revealed or completed, with small labels like the adventure's identifier. We never put your dog's name, your memories, your license code, your email or any customer identifier in an event. Google Analytics uses cookies and collects information such as pages viewed, approximate location, device and browser type. We do not use it to identify you personally. You can opt out with Google's [browser add-on](https://tools.google.com/dlpage/gaoptout).

## Emails you send us

If you email us, we use your message and address only to reply. Please do not send photos of your dog or your license code.

## Pinterest

The site footer may link to our Pinterest profile. It is an ordinary link: it opens Pinterest only if you click it. Once you are on Pinterest, its own privacy policy applies.

## No newsletter

We do not run a newsletter or collect email addresses for marketing.

## Links to other sites

Sites we link to have their own privacy policies. Some links may be affiliate links; see our [affiliate disclosure](/affiliate-disclosure).

## Affiliate links, cookies and tracking

If you click an affiliate link, the partner's site (or its affiliate network) may set cookies or use similar tracking technologies, such as pixels, to record that you came from our site, so a purchase can be credited to us. Those cookies and what they collect are controlled by the partner and the network, not by us, and are covered by their privacy policies. We also use Google Analytics 4 to count clicks on affiliate and product links on our own pages. You can block or delete cookies in your browser settings, and blocking them does not change the price you pay.

## Children

This site is not directed at children under 13.

## Changes and contact

We'll update this page if our practices change. Questions? [Contact us](/contact).`}
    />
  ),
});
