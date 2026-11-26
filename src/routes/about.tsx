import { createFileRoute } from "@tanstack/react-router";
import { BRAND } from "@/config/brand";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () =>
    pageHead({
      title: "About Paws & Passage",
      description:
        "Paws & Passage makes the Adventure Passport, a collectible set of little adventures to share with your dog, plus researched dog travel and outdoor guides.",
      path: "/about",
    }),
  component: () => (
    <InfoPage
      title="About Paws & Passage"
      intro={BRAND.lifetime}
      updated="2026-11-26"
      body={`Paws & Passage makes the **Adventure Passport**: a collectible, self-paced set of little adventures to share with your dog. There are no daily streaks and nothing to keep up with. You pick an adventure when you feel like it, and your dog can stop any time.

## What is here

- **The Adventure Passport.** A free set of adventures to try with no account, and a one-time purchase that unlocks the full library, personalized keepsakes from your own photos and progress that follows you across devices. See [get the Passport](/unlock).
- **Guides.** Researched dog travel and outdoor guides: car safety, first aid, water and cold-weather gear, and what to pack. Sources are listed at the end of each guide. See [guides](/guides).
- **A road trip packing list.** A free planner that runs in your browser. See the [packing list](/tools/packing-list).

## Who publishes this

Paws & Passage is an independent publication. Guides carry the byline "Paws & Passage Editors." That is an editorial process with written standards, not a named individual: the site owner has chosen not to publish a personal bio, and we do not invent people, credentials or experience. We hold no veterinary or trainer credentials, so use a vet for health decisions and a qualified trainer for behavior. How we work is set out in our [editorial standards](/editorial-standards), [methodology](/methodology) and [corrections log](/corrections).

## What we don't do

We don't publish fake reviews, ratings or customer numbers. We don't claim to have visited places or tested products we haven't. We don't ask you to upload your dog's photos: keepsakes in the full Passport are made on your own device. If we don't know something, we say so.

Questions or press: see [contact](/contact). Read our [privacy policy](/privacy), [terms](/terms) and [affiliate disclosure](/affiliate-disclosure).`}
    />
  ),
});
