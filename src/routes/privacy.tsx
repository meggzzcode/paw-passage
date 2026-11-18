import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () =>
    pageHead({
      title: "Privacy policy",
      description:
        "What information Paws & Passage collects, how analytics works, and your choices.",
      path: "/privacy",
    }),
  component: () => (
    <InfoPage
      title="Privacy policy"
      updated="2026-11-18"
      body={`This policy explains what happens to information when you use Paws & Passage.

## Information you type into our tools

Our tools, including the checklist, the packing list, the stay cost calculator and the pet cost and host confirmation tool, run entirely in your browser. What you enter is **not sent to us**. The checklist and packing list save your ticks and choices in your browser's local storage on your device only; you can clear it with the Reset button or your browser settings.

## Analytics

We may use Google Analytics 4 to understand which pages are useful and how many visitors click through to booking partners. Google Analytics uses cookies and collects information such as pages viewed, approximate location, device and browser type. We do not use it to identify you personally. You can opt out with Google's [browser add-on](https://tools.google.com/dlpage/gaoptout).

## Emails you send us

If you email us, we use your message and address only to reply and, for property submissions, to review your listing.

## Pinterest

Some pages have a "Save to Pinterest" link, and the site footer may link to our Pinterest profile. These are ordinary links: they open Pinterest only if you click them. Once you are on Pinterest, its own privacy policy applies.

## No newsletter

We do not run a newsletter or collect email addresses for marketing.

## Links to other sites

Booking partners and other sites we link to have their own privacy policies. Some links may be affiliate links; see our [affiliate disclosure](/affiliate-disclosure).

## Affiliate links, cookies and tracking

If you click an affiliate link, the partner's site (or its affiliate network) may set cookies or use similar tracking technologies, such as pixels, to record that you came from our site, so a purchase or booking can be credited to us. Those cookies and what they collect are controlled by the partner and the network, not by us, and are covered by their privacy policies. We also use Google Analytics 4 to count clicks on affiliate and product links on our own pages; it records the click, not what you type into our tools. If we show a map of places to stay from our booking partner Stay22, that map is loaded from Stay22's servers and Stay22 may set cookies or use similar tracking technologies to credit a booking to us; see Stay22's own privacy policy. You can block or delete cookies in your browser settings, and blocking them does not change the price you pay.

## Children

This site is not directed at children under 13.

## Changes and contact

We'll update this page if our practices change. Questions? [Contact us](/contact).`}
    />
  ),
});
