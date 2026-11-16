# Roam & Tail — website without saved data (phase 1)

A complete, polished public site built from both briefs, minus anything that has to save information. The editor area, newsletter storage, host submissions, click tracking and saved research briefs can be added in phase 2 if Lovable Cloud gets turned on.

## Pages
- **Home** (`/`): big hero photo, headline "Their favorite getaway starts here.", a search bar that works (destination, stay type, must-have feature), browse-by-style, featured destinations (Georgia, California), "More than just pet-friendly", featured stays, browse-by-feature, editorial picks, newsletter and host call-to-action, full footer.
- **Search** (`/stays`): filters that work together (location, type, number of dogs, large dogs, fenced yard, private outdoor space, no pet fee, no breed restrictions, beach, mountain, hot tub). Filters stay in the web address so results can be shared. Includes sorting and an empty-results state.
- **Stay detail** (`/stays/$slug`): pet policy laid out clearly, fees, restrictions, yard details, nearby dog-friendly activities, a "check details before you book" note, and a booking button that opens the partner site.
- **Destinations**: `/destinations`, a page for each state (Georgia, California), and a page for each town (Blue Ridge, Ellijay, Helen, Dahlonega, San Diego, Santa Barbara, Monterey, Mendocino).
- **Guides** (`/guides`, `/guides/$slug`): 2 launch articles, "Dog-friendly cabins with fenced yards in Georgia" and "Pet-friendly beachfront rentals in California". Each has the practical extras from the editorial brief: a fence-check list, questions to ask the host, and photos to request. Each article lists its sources and says when it was last checked.
- **Info pages**: About, List your property (host info plus an email link), Contact, Affiliate disclosure, Privacy, Terms, Editorial standards.

## Honesty rules (from your briefs)
- No made-up ratings, reviews, stay counts or statistics.
- The stays are **sample stays** and are clearly labeled as samples until you supply real, verified properties with permission to show them. Booking buttons are placeholders until you have approved affiliate links.
- Before writing each article I'll research the real competing pages on the web. Their findings shape the article, and any research gaps are stated openly. Briefs are kept as notes inside the project for now.
- Photos are travel scenes created for the site and are never presented as a real rental.

## Look
Ivory background, deep evergreen, terracotta accents, sage and pale blue, charcoal text. Fraunces headings and DM Sans body text. A travel-magazine layout with generous spacing, cards that vary in style, gentle hover effects, and a layout built for phones first. No paw-print clutter and no popups.

## SEO
Each page gets its own title, description and sharing tags. Includes structured data (articles, breadcrumbs, places), a sitemap and a robots file. Brand name, tagline and email live in one settings file so they're easy to change.

## Not in phase 1 (needs Lovable Cloud)
Editor/admin area, saving newsletter signups (the form will show a "coming soon" note or link to your email tool), saving host submissions, affiliate click counting, and stored research briefs.

## Technical details
- Data lives in typed TS modules (`src/data/stays.ts`, `destinations.ts`, `guides.ts`), shaped like future database tables so phase 2 can move them over easily.
- Filtering is a pure function with unit tests: combined filters, dog count, no-fee.
- The route files are listed above. Search params are validated with zod.
- Images are generated into `src/assets`.
