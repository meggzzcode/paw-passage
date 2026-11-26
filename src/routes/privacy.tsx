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
      body={`This policy explains what happens to information when you use Paws & Passage and the Adventure Passport. It describes what the site does today. It is not legal advice.

## The short version

- The free Passport needs no account, no email and no card. Your dog's profile and progress stay in your browser on your device.
- Photos are never uploaded. Keepsakes are drawn on your device.
- If you buy the full Passport, we keep a copy of your progress on our server so it can follow you across devices. You can download it or delete it yourself.
- We use Google Analytics 4 for page views and a short list of named events. Those events carry no personal data. Google Analytics sets its own cookies.
- We do not sell your data, run ads or run a mailing list.

## What your browser stores on your device

The free Passport saves its state in your browser, on your device, and does not send it to us. It uses:

- **Local storage:** your dog's profile and preferences, favorites, saved and completed adventures, memories, collections and the free introductory adventure (the main save, called "pp.save.v1"); the packing planner's checklist; planned adventures; which adventures you have already revealed; your hemisphere choice for seasonal ideas; and small flags such as whether you dismissed an install hint, or whether this browser has a purchase signed in.
- **Session storage** (cleared when the tab closes): the adventures already offered during the introductory flow, and, if you arrived from a link with campaign tags (utm_source, utm_medium, utm_campaign), those three short labels, so a purchase click can be counted by campaign.

You can export a copy of your progress, or delete everything on this device, from your Passport page. Clearing your browser's site data also removes all of it. If you clear it without exporting, that progress is gone, because we do not have a copy of free progress.

The site does not install a service worker or offer push notifications at the moment (both are paused). If either is switched on later, we will update this page first. Any older worker or cache from an earlier visit is removed when you open the site.

## Photos never leave your device

In the full Passport, keepsakes are made from a photo you choose, entirely in your browser. The photo is **not uploaded**, not sent to any server, not included in analytics, and not saved by the Passport unless you save the finished image yourself. Exported images are drawn fresh on a new canvas, so they do not carry the original photo's hidden metadata, such as location.

## If you buy the full Passport

- **Payment.** Checkout is handled by our checkout provider, Gumroad. They take your payment and send you a license key by email. We never see your card details, and our server does not request or store your email address. Gumroad's own privacy policy applies to what you give them.
- **Unlocking.** When you enter your license key (on the unlock page or on Restore access), our server sends it to Gumroad to confirm that it is valid. The key travels in the body of a request, never in a web address. We keep it only in sealed (encrypted) form, so we can check later whether the purchase was refunded. We re-check at most about once a day, and only when you use the Passport.
- **What we keep.** A record in storage hosted by Netlify (Netlify Blobs), tied to a random identifier rather than your name or email: your synced progress (the same content that is in your browser's save), your purchase status, and a one-way fingerprint of the purchase reference so the same purchase can be recognized. Your free progress on the device is merged into it. We do not store photos or keepsake images. The full adventure library is delivered to your browser when you are signed in and is held in memory only, not written to your device's storage.
- **A cookie.** Unlocking sets one signed, secure, HTTP-only cookie named pp_session. It identifies your record on that device and expires after 30 days. It is needed for the full Passport to work and is not used for advertising.
- **How long we keep it.** Your record stays until you delete it. We do not delete it automatically. If a purchase is refunded, access is switched off but the progress record stays until you delete it.
- **Your choices.** When you are signed in, your Passport page shows "Download account data" and "Delete account copy". Downloading gives you a file with your synced progress and your access status. Deleting removes the whole server record: your synced progress, the sealed license key and the purchase fingerprint. It does not undo the purchase and does not touch the copy in your browser. You can restore access later with your license key, which starts a new record. If you cannot sign in on any device and want a record deleted, email us (see Contact); tell us the date of purchase, and do not send the license key itself.

## Analytics

We use Google Analytics 4 on the site, including when you use the free Passport. It records page views and basic information such as approximate location, device and browser type. It sets cookies in your browser (for example "_ga") to tell visits apart. We do not use it to identify you personally.

For the Passport and the tools we also send a short list of named events, such as an adventure being revealed or completed, a purchase button clicked, or a keepsake downloaded. Each carries only small labels such as an adventure identifier or the page, and campaign tags if you arrived with them. Any free text is dropped before sending. We never put your dog's name, your memories, your photos, your license key, your email or any customer identifier into an event. A click on a purchase or checkout button is counted as a click, not as a confirmed purchase. You can opt out with Google's [browser add-on](https://tools.google.com/dlpage/gaoptout) or by blocking cookies and scripts in your browser. The site works without analytics.

## Cookies, in full

- **pp_session:** set only after you unlock or restore the full Passport, as described above.
- **Google Analytics cookies:** set by Google Analytics as described above.
- **Partner cookies:** only if you click an affiliate link and leave for another site (see below).

We do not set advertising cookies of our own.

## Hosting

The site and its server functions run on Netlify. Like any host, Netlify and its infrastructure process request details such as IP address and browser type to deliver pages and keep the service running. Our server code does not log your license key, progress or request bodies. It keeps short-lived, in-memory counters per IP address to slow down abuse; they are not saved.

## Emails you send us

If you email us, we use your message and address only to reply and to keep a record of the conversation. Please do not send photos of your dog or your license key.

## Pinterest

The site footer may link to our Pinterest profile. It is an ordinary link: it opens Pinterest only if you click it. Once you are on Pinterest, its own privacy policy applies.

## No newsletter

We do not run a newsletter or collect email addresses for marketing.

## Links to other sites

Sites we link to have their own privacy policies. Some links are affiliate links; see our [affiliate disclosure](/affiliate-disclosure).

## Affiliate links, cookies and tracking

If you click an affiliate link, the partner's site (or its affiliate network) may set cookies or use similar tracking technologies, such as pixels, to record that you came from our site, so a purchase can be credited to us. Those cookies and what they collect are controlled by the partner and the network, not by us, and are covered by their privacy policies. We also count clicks on affiliate and product links on our own pages with Google Analytics. You can block or delete cookies in your browser settings, and blocking them does not change the price you pay.

## Children

This site is not directed at children under 13, and we do not knowingly collect information from them.

## Changes and contact

We will update this page, and its date, if our practices change. Questions, or a request to see or delete a record? [Contact us](/contact).`}
    />
  ),
});
