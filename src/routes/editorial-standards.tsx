import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/editorial-standards")({
  head: () =>
    pageHead({
      title: "Editorial standards",
      description:
        "How Paws & Passage researches guides, lists dog-friendly stays and handles corrections. No fake reviews, no invented experiences.",
      path: "/editorial-standards",
    }),
  component: () => (
    <InfoPage
      title="Editorial standards"
      updated="2026-11-18"
      body={`## How we research guides

1. **Start with the reader's real question.** We look at what people actually search for and ask.
2. **Read what already exists.** For every guide we review at least five of the pages that currently rank for the topic, and note what they cover well and what they leave out.
3. **Fill the gaps from authoritative sources.** Park agencies, city and county beach rules, veterinary organizations, and booking platforms' own help pages. Every source is listed at the end of the guide, with the date we checked it.
4. **Add something genuinely useful.** Each guide aims to include at least three practical insights you're unlikely to find elsewhere.
5. **Review it again.** Each guide shows a "last reviewed" date. Rules change, so check the linked official source before you travel.

## Use of Artificial Intelligence

Paws & Passage uses artificial intelligence (AI) tools to assist with research, data analysis, content development, organization and website operations. Our guides and product recommendations are informed by publicly available information, manufacturer specifications, published policies and other relevant sources. We aim to provide accurate, useful and transparent information. We do not claim firsthand experiences, personal product testing, property visits or independent verification unless explicitly stated. Information may change over time, and readers are encouraged to confirm important details directly with the relevant provider.

Our source checks are also done with AI tools: a separate AI review re-reads the cited pages before a guide is published. We do not describe these checks as review by a human fact-checker.

## What we never do

- Claim to have visited a place, stayed at a property or tested a product unless we actually did.
- Invent quotes, interviews, ratings, reviews or statistics.
- Describe a stay as verified when we have not confirmed it with the host or an authoritative source.
- Publish a guide that relies on claims we couldn't confirm. Those are held back until checked.

## How we verify stays

Stays are listed with the pet policy, fees and fencing details we could find on the public listing, and the date we read it. Anything we could not find is marked **Not confirmed**, and our filters never treat "not confirmed" as a yes. We call a stay **Verified** only after we have confirmed those details with the host or an authoritative source; a listing-based stay is never described as verified.

## Images

Photos on our guides and destination pages are licensed stock photographs (Unsplash License). The large image at the top of the home page is an AI-generated illustration of a travel scene, not a photograph. All images are shown for illustration only and are not pictures of a specific rental. Property photos appear only with the owner's permission.

## Money

We may earn commissions from some booking and product links, and some placements may be sponsored and labeled as such. An article that contains affiliate links says so at the top. This never changes what we report. See our [affiliate disclosure](/affiliate-disclosure).

## Researched is not tested

We research products from maker specifications and independent standards bodies. We do not buy or test them, and nothing is described as tested unless a product page explicitly says so. See our [methodology](/methodology).

## Corrections

Found something wrong or out of date? [Tell us](/contact). We fix verified errors and update the review date, and we record notable changes in our [corrections log](/corrections).`}
    />
  ),
});
