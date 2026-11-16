import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/editorial-standards")({
  head: () => pageHead({ title: "Editorial standards", description: "How Paw & Passage researches guides, verifies dog-friendly stays and handles corrections. No fake reviews, no invented experiences.", path: "/editorial-standards" }),
  component: () => <InfoPage title="Editorial standards" updated="2026-11-16" body={`## How we research guides

1. **Start with the reader's real question.** We look at what people actually search for and ask.
2. **Read what already exists.** For every guide we review at least five of the pages that currently rank for the topic, and note what they cover well and what they leave out.
3. **Fill the gaps from authoritative sources.** Park agencies, city and county beach rules, veterinary organizations, and booking platforms' own help pages. Every source is listed at the end of the guide, with the date we checked it.
4. **Add something genuinely useful.** Each guide aims to include at least three practical insights you're unlikely to find elsewhere.
5. **Review it again.** Each guide shows a "last reviewed" date. Rules change, so check the linked official source before you travel.

## What we never do

- Claim to have visited a place, stayed at a property or tested a product unless we actually did.
- Invent quotes, interviews, ratings, reviews or statistics.
- Recommend a specific rental we haven't verified.
- Publish a guide that relies on claims we couldn't confirm. Those stay as unpublished drafts until checked.

## How we verify stays

A stay appears on Paw & Passage only after we confirm its pet policy (dog count, size and breed rules), pet fees, and fencing with the host or an authoritative listing, and have permission to use its photos. Every stay shows when it was last verified. Details we couldn't confirm are shown as "not confirmed," and our filters never treat "not confirmed" as a yes.

## Images

Photos on our guides and destination pages are illustrative travel scenes. They are never presented as pictures of a specific rental. Property photos appear only with the owner's permission.

## Money

We may earn commissions from some booking links, and some placements may be sponsored and labeled as such. This never changes what we report. See our [affiliate disclosure](/affiliate-disclosure).

## Corrections

Found something wrong or out of date? [Tell us](/contact). We fix verified errors promptly and update the review date.`} />,
});
