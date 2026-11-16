import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/about")({
  head: () => pageHead({ title: "About Paws & Passage", description: "Why we started a dog-friendly travel guide built around the details that decide whether a stay works for your dog.", path: "/about" }),
  component: () => <InfoPage title="About Paws & Passage" intro="Better adventures, together." body={`Most travel sites treat "pet-friendly" as a single checkbox. Anyone who has turned up at a "fenced" cabin to find three sides of fence and a gravel road on the fourth knows that isn't enough.

Paws & Passage is a travel guide for people who plan around their dogs. We focus on the specifics that decide whether a stay actually works: whether the fence goes all the way around, how the pet fee is charged, weight and breed limits, how many dogs are welcome, and what the local beach and trail rules really say.

## What we do

- **Guides** that answer the questions other articles skip. We research what already ranks, find the gaps, and check facts against official sources: park agencies, city beach rules, veterinary organizations. Every source is listed at the end of each guide.
- **Tools** that make the awkward part of booking easier, like writing a host a precise list of questions, or working out what a stay really costs once per-dog fees are added.
- **Stays**, listed only after we confirm the pet policy, fees and fencing with the host. We would rather list ten stays we trust than a thousand we don't.

## What we don't do

We don't publish fake reviews, ratings or booking numbers. We don't claim to have visited places we haven't. If we don't know something, we say "not confirmed."

We're starting with two regions, the North Georgia mountains and coastal California, and adding more as we can cover them properly.

Read our [editorial standards](/editorial-standards) and [affiliate disclosure](/affiliate-disclosure).`} />,
});
