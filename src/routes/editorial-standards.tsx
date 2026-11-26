import { createFileRoute } from "@tanstack/react-router";
import { InfoPage } from "@/components/site/InfoPage";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/editorial-standards")({
  head: () =>
    pageHead({
      title: "Editorial standards",
      description:
        "How Paws & Passage researches guides, writes adventures and handles corrections. No fake reviews, no invented experiences.",
      path: "/editorial-standards",
    }),
  component: () => (
    <InfoPage
      title="Editorial standards"
      updated="2026-11-26"
      body={`## How we research guides

1. **Start with the reader's real question.** We look at what people actually search for and ask.
2. **Read what already exists.** For every guide we review the pages that currently rank for the topic, and note what they cover well and what they leave out.
3. **Fill the gaps from authoritative sources.** Park agencies, veterinary organizations, standards bodies and the makers' own pages. Every source is listed at the end of the guide, with the date we checked it.
4. **Add something genuinely useful.** Each guide aims to include practical points you are unlikely to find elsewhere.
5. **Review it again.** Each guide shows a "last reviewed" date. Rules change, so check the linked official source before you travel.

## How we write adventures

Adventures in the Passport are gentle ideas to try with your dog. They are not training programs, exercise plans, diets or health advice. Every adventure lets the dog stop at any time, and none asks for costumes or forced poses. Where an adventure depends on something we cannot know, such as your dog's comfort with food games, it asks you first and holds back until you answer. We treat missing information as unknown, never as safe. Our internal editorial scores are for deciding what to publish and are not customer ratings.

## Use of Artificial Intelligence

Paws & Passage uses artificial intelligence (AI) tools to assist with research, data analysis, content development, organization and website operations. Our guides, adventures and product recommendations are informed by publicly available information, manufacturer specifications, published policies and other relevant sources. We aim to provide accurate, useful and transparent information. We do not claim firsthand experiences, personal product testing or independent verification unless explicitly stated. Information may change over time, and readers are encouraged to confirm important details directly with the relevant provider.

Our source checks are also done with AI tools: a separate AI review re-reads the cited pages before a guide is published. We do not describe these checks as review by a human fact-checker.

## What we never do

- Claim to have visited a place or tested a product unless we actually did.
- Invent quotes, interviews, ratings, reviews, customer numbers or statistics.
- Publish a guide that relies on claims we could not confirm. Those are held back until checked.
- Suggest captions, hashtags or ready-made posts for your keepsakes, or ask for access to your social accounts.

## Images

Photos on our guides are licensed from Unsplash under the Unsplash License, which gives us the right to use them. We do not own them and claim no exclusive rights in them. They are shown for illustration only. Keepsakes are made from photos you choose, on your own device.

## Money

The Adventure Passport is a one-time purchase. We may also earn commissions from some product links in guides, and an article that contains affiliate links says so at the top. It does not change what we report about a product, but it can affect which products we point to in guides. See our [affiliate disclosure](/affiliate-disclosure).

## Researched is not tested

We research products from maker specifications and independent standards bodies. We do not buy or test them, and nothing is described as tested unless a product page explicitly says so. See our [methodology](/methodology).

## Corrections

Found something wrong or out of date? [Tell us](/contact). We fix verified errors and update the review date, and we record notable changes in our [corrections log](/corrections).`}
    />
  ),
});
