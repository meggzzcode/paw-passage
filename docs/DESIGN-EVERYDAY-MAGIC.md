# Everyday Magic design concept — handoff

Status: concept only, awaiting owner approval. Not merged into the working product.

## Where it lives
- `/concept` — homepage concept (`src/components/concept/ConceptPage.tsx`)
- `/concept-journey` — every customer-journey screen with demonstration data (`ConceptJourney.tsx`)
- `/concept-system` — rendered tokens and guidelines (`ConceptSystem.tsx`)
- Styles: `src/design/concept.css`, scoped under `.em`, all tokens prefixed `--em-`. It does not touch the live `--pp-*` system.
- All three pages are noindex.

## Integration notes for engineering
- Visual layer only. Keep the existing quiz (8 default questions, max 10, one shared profile with multiple dog names), recommendation, reveal, checkout, restore and on-device storage.
- `ScratchCard.tsx` is a visual reference: one surface, scratch or tap/Enter to reveal, practical info shown before reveal.
- Keepsake editor is for paying customers only; photos stay on the device.
- Not advertised in the concept: gifting, app install, notifications, reviews, discounts or urgency.
- Product numbers used: 113 adventures, 99 premium, 14 intro candidates, 50 public previews, 25 collections, 113 keepsake configurations, 8 achievements, 12 stamp types, 10 Journal articles, $19.99 once.

## Tokens, typography, spacing, components, motion and accessibility
See `/concept-system`; the table there is the source of truth.
