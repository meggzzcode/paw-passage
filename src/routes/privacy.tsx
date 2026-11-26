import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";
import { AnalyticsChoicesButton } from "@/components/site/ConsentNotice";

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
- Analytics are OFF until you choose "Allow analytics". If you do, we use Google Analytics 4 for page views and a short list of named events, which carry no personal data, and Google sets a cookie. "Essential only" changes nothing about how the site works, and you can change your mind at any time with "Analytics choices" in the footer.
- We do not sell your data, run ads or run a mailing list.

## What your browser stores on your device

The free Passport saves its state in your browser, on your device, and does not send it to us. It uses:

- **Local storage:** your dog's profile and preferences, favorites, saved and completed adventures, memories, collections and the free introductory adventure (the main save, called "pp.save.v1"); the packing planner's checklist; planned adventures; which adventures you have already revealed; your hemisphere choice for seasonal ideas; and small flags such as whether you dismissed an install hint, or whether this browser has a purchase signed in. This is essential: the site cannot keep your progress without it.
- **Your analytics choice** ("pp.consent.v1"): "granted" or "denied" and the date you chose, kept on this device so we do not ask again.
- **Session storage** (cleared when the tab closes): the adventures already offered during the introductory flow (essential). Only if you have allowed analytics, and you arrived from a link with campaign tags (utm_source, utm_medium, utm_campaign), those three short labels, so a purchase click can be counted by campaign. Without your permission they are not stored.

You can export a copy of your progress, or delete everything on this device, from your Passport page. On a shared or borrowed device use "Sign out and clear this device" there: it removes your dog's names and profile, saved items, memories, collections, planned adventures, packing lists and the notification subscription from that browser. A different person signing in on the same device never has the earlier person's progress merged into their account; they are asked whether to start fresh. Clearing your browser's site data also removes all of it. If you clear it without exporting, that progress is gone, because we do not have a copy of free progress.

The site does not install a service worker or offer push notifications at the moment (both are paused). If either is switched on later, we will update this page first. Any older worker or cache from an earlier visit is removed when you open the site.

## Photos never leave your device

In the full Passport, keepsakes are made from a photo you choose, entirely in your browser. The photo is **not uploaded**, not sent to any server, not included in analytics, and not saved by the Passport unless you save the finished image yourself. Exported images are drawn fresh on a new canvas, so they do not carry the original photo's hidden metadata, such as location.

## If you buy the full Passport

- **Payment.** Checkout is handled by our checkout provider, Gumroad. They take your payment and send you a license key by email. We never see your card details, and our server does not request or store your email address. Gumroad's own privacy policy applies to what you give them.
- **Unlocking.** When you enter your license key (on the unlock page or on Restore access), our server sends it to Gumroad to confirm that it is valid. The key travels in the body of a request, never in a web address. We keep it only in sealed (encrypted) form, so we can check later whether the purchase was refunded. We re-check at most about once a day, and only when you use the Passport.
- **What we keep.** A record in storage hosted by Netlify (Netlify Blobs), tied to a random identifier rather than your name or email: your synced progress (the same content that is in your browser's save), your purchase status, and a one-way fingerprint of the purchase reference so the same purchase can be recognized. Your free progress on the device is merged into it. We do not store photos or keepsake images. The full adventure library is delivered to your browser when you are signed in and is held in memory only, not written to your device's storage.
- **A cookie.** Unlocking sets one signed, secure, HTTP-only cookie named pp_session. It identifies your record on that device and expires after 30 days, or sooner if you choose "Sign out of this device" on your Passport page. It is needed for the full Passport to work and is not used for advertising.
- **How long we keep it.** Your record stays until you delete it. We do not delete it automatically. If a purchase is refunded, access is switched off but the progress record stays until you delete it.
- **Your choices.** When you are signed in, your Passport page shows "Download account data", "Sign out of this device" and "Delete account copy". Signing out clears that cookie on the device you are using and hides the full library there; your progress stays on the device, and you can sign back in with your license key via Restore access. It does not sign out your other devices. Downloading gives you a file with your synced progress and your access status. Deleting removes the whole server record: your synced progress, the sealed license key and the purchase fingerprint. It does not undo the purchase and does not touch the copy in your browser. You can restore access later with your license key, which starts a new record. If you cannot sign in on any device and want a record deleted, email us (see Contact); tell us the date of purchase, and do not send the license key itself.

## Analytics (optional, off until you allow it)

Nothing from Google loads, no analytics cookie is set and no campaign tag is kept until you choose "Allow analytics" in the small notice at the bottom of the page. "Essential only" leaves all of that off. If your browser sends a Global Privacy Control or Do Not Track signal we treat it as "Essential only" until you choose otherwise. Analytics also never run in the development or preview copies of the site. Browsing, the introductory adventure, the quiz, revealing and completing adventures, keepsakes, buying, activating, syncing and restoring access all work the same whichever you choose.

If you allow it, we use Google Analytics 4 on the site, including when you use the free Passport. It records page views and basic information such as approximate location, device and browser type, and it sets cookies in your browser (for example "_ga" and a "_ga_" cookie for our measurement ID) to tell visits apart. We do not use it to identify you personally, and we do not use advertising features.

For the Passport and the tools we also send a short list of named events, such as an adventure being revealed or completed, a purchase button clicked, or a keepsake downloaded. Each carries only small labels such as an adventure identifier or the page, and campaign tags if you arrived with them. Any free text is dropped before sending. We never put your dog's name, your memories, your photos, your license key, your email or any customer identifier into an event. A click on a purchase or checkout button is counted as a click, not as a confirmed purchase.

**Changing your mind.** Use "Analytics choices" in the footer (or the button at the end of this page) at any time. Choosing "Essential only" afterwards stops sending, tells Google's tag that analytics storage is denied, and deletes the Google Analytics cookies and the campaign tags we could remove from this browser. Data Google already received is kept by Google under our retention setting; we do not have a way to find and delete one visitor's records, and we do not identify visitors. You can also use Google's [browser add-on](https://tools.google.com/dlpage/gaoptout) or block scripts and cookies in your browser.

The site owner is responsible for confirming which rules apply in the places the site sells to; this page describes what the site does, it does not claim legal compliance.

## Purchases and photos

Payment and the purchase code are handled by Gumroad on gumroad.com, under Gumroad's own privacy policy; we never see your card details. Photos you pick for a keepsake are processed in your browser on your device and are not uploaded.

## Cookies, in full

- **pp_session (essential):** a signed, secure, HTTP-only cookie set only after you unlock or restore the full Passport. It lasts up to 30 days, or until you sign out of this device. It is per device: signing out on one device does not sign out another, and we cannot remotely cancel it before it expires.
- **Google Analytics cookies (optional):** "_ga" and "_ga_" cookies, set only after you choose "Allow analytics", and deleted when you withdraw.
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
    >
      <p className="mt-6">
        <AnalyticsChoicesButton className="pp-btn pp-btn-secondary" />
      </p>
    </InfoPage>
  ),
});
