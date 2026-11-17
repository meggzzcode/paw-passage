import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/privacy")({
  head: () => pageHead({ title: "Privacy policy", description: "What information Paws & Passage collects, how analytics works, and your choices.", path: "/privacy" }),
  component: () => <InfoPage title="Privacy policy" updated="2026-11-16" body={`This policy explains what happens to information when you use Paws & Passage.

## Information you type into our tools

The checklist, host question generator, cost calculator and comparison tool run entirely in your browser. What you enter is **not sent to us**. The checklist saves your ticks in your browser's local storage on your device only; you can clear it with the Reset button or your browser settings.

## Analytics

We may use Google Analytics 4 to understand which pages are useful and how many visitors click through to booking partners. Google Analytics uses cookies and collects information such as pages viewed, approximate location, device and browser type. We do not use it to identify you personally. You can opt out with Google's [browser add-on](https://tools.google.com/dlpage/gaoptout).

## Emails you send us

If you email us, we use your message and address only to reply and, for property submissions, to review your listing.

## Links to other sites

Booking partners and other sites we link to have their own privacy policies. Some links are affiliate links; see our [affiliate disclosure](/affiliate-disclosure).

## Children

This site is not directed at children under 13.

## Changes and contact

We'll update this page if our practices change. Questions? [Contact us](/contact).`} />,
});
