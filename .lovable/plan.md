# Paw & Passage — content-first build, no backend (v1)

**Brand:** Paw & Passage. **Tagline:** "Better adventures, together."
Both live in one settings file, along with the contact email and disclosure text.

The site is a premium editorial travel publication with a searchable stay directory and practical tools. It runs without Lovable Cloud or Supabase. Everything is stored in organized files inside the project, so it exports cleanly to GitHub and can be hosted anywhere.

## Pages
- Home
- Stays directory (`/stays`) and a page for each stay (`/stays/$slug`)
- Destinations (`/destinations`), Georgia and California pages, and town pages: Blue Ridge, Ellijay, Helen, Dahlonega, San Diego, Santa Barbara, Monterey, Mendocino
- Guides (`/guides`) and a page for each guide (`/guides/$slug`)
- Tools (`/tools`), with a page for each of the 4 tools
- About, Contact, List Your Property, Affiliate Disclosure, Privacy, Terms, Editorial Standards
- Shared header and footer, breadcrumbs, and a 404 page

## Look
Unchanged from the original brief:
- **Colors:** ivory background, deep evergreen, terracotta accents, sage and pale blue, charcoal text
- **Fonts:** Fraunces headings, DM Sans body
- **Layout and feel:** magazine-style, large destination photos, a few card styles that vary, subtle motion, built for phones first
- **Avoid:** paw-print clutter, cartoons and repeated sections

## Stays directory
**Filters that work together:**
- Location and stay type
- Fenced yard, private outdoor space
- Large dogs, multiple dogs, number of dogs
- No pet fee, no breed restrictions
- Beach, mountain, hot tub

**Search page:**
- Filters stay in the web address, so results can be shared
- Sort options and a friendly "nothing found" state
- A filter drawer on phones

**Each stay record holds:**
- A verification status, its source and the date it was last verified
- Photo permission
- An affiliate link (optional)
- Sponsored settings

**What visitors see:**
- Only **verified** stays show as real recommendations.
- Sample stays carry an "Example" label, are hidden from search engines and left out of the sitemap. One setting turns them off everywhere.
- Unverified stays are never shown.

**Adding stays:**
- A stays template (CSV plus matching data format) and a small script that converts the CSV into the stay files.
- No real properties get added until you or I can verify them with permission. Launch therefore starts with labeled examples, and the gap is reported honestly.

## Ten guides (complete articles)
1. Dog-Friendly Cabins With Fenced Yards in Georgia
2. Pet-Friendly Beachfront Rentals in California
3. Dog-Friendly Weekend Getaways From Atlanta
4. Dog-Friendly Weekend Getaways From Los Angeles
5. How to Find a Vacation Rental With a Truly Secure Fenced Yard
6. What to Check Before Booking a Pet-Friendly Vacation Rental
7. Traveling With Two Dogs: The Accommodation Planning Guide
8. How to Find Vacation Rentals That Welcome Large Dogs
9. What to Pack for a Dog-Friendly Cabin Vacation
10. How Pet Fees Actually Work at Vacation Rentals

**Research for each guide:**
- Search intent and the questions readers actually ask
- Live web research of at least 5 real competing pages, recording each page's address, title and the date checked
- What they cover well, and the gaps
- Fact checks against official sources: state parks, tourism boards, beach and leash rules, vet guidance
- A distinctive angle and at least 3 genuine extras

**Each written article includes:**
- A friend-to-friend voice
- Checklists, mistakes to avoid and comparisons
- Links to related guides and tools
- Sources and a "last reviewed" date
- Its own search title and description
- An FAQ, where useful

**Honesty rules:**
- No invented visits, stays or interviews.
- Each article keeps a research brief in its file.
- Any article with unverified facts stays an **unpublished draft**: hidden from search engines and the sitemap, with what's missing listed.
- Property-specific suggestions appear only when the property is verified.

## Interactive tools (work in the browser)
- **Before-you-book checklist:** tick items off, it saves on your device, and it prints neatly.
- **Host question generator:** pick your dog's needs (size, count, fencing, breed, fees, pool, crate, quiet hours) and get a ready-to-copy message for the host, plus a list of photos to request.
- **Pet fee and trip cost calculator:** compare up to 3 stays by nightly rate, pet fees per dog or per stay, cleaning, deposits and taxes, and see the true total.
- **Stay comparison:** verified (or clearly labeled example) stays side by side, with "not confirmed" shown where data is missing.
- Each tool links into the matching guides, and the guides link back to the tools.

## Money features (no backend needed)
- **Affiliate links:** one file stores every affiliate link. Booking buttons appear only when a real link exists and carry the right "sponsored" tags. No made-up partnerships.
- **Sponsored stays:** an on/off switch, a placement setting and a visible "Sponsored" label.
- **Click tracking:** Google Analytics 4 records outbound clicks once you add your measurement ID. Until then nothing is sent and nothing pretends to track.
- **Newsletter:** a setting for a Kit or MailerLite form. With no service connected, the public site shows no signup form, only a preview notice in development.
- **List Your Property:** a clear page explaining what to send, with a business email link.

## Search engines
- Every page is fully built on the server.
- **Every page gets:** a unique title and description, a canonical tag, and social sharing tags.
- Proper heading order and breadcrumbs.
- **Structured data:** articles, breadcrumbs, places, lodging and FAQs, where real.
- A sitemap generated from published content, and a robots file.
- **Hidden from search engines:** drafts, examples and filtered search pages.
- Descriptive alt text, compressed images and internal links between destinations, stays and guides.

## Testing
- **Automated tests:**
  - Filters combine correctly
  - Only verified stays are recommended
  - Drafts and examples are noindexed and left out of the sitemap
  - The question generator gives the right questions for each answer
  - The fee calculator gets the math right
  - Affiliate buttons only appear with a real link
- A real browser run-through of every page on desktop and phone, checking for dead buttons, broken images and broken links.
- A separate review pass on the articles.

## Handover
A `HANDOVER.md` covering how to:
- Add a stay, or update a stay's pet policy
- Add a destination
- Publish a guide
- Update affiliate links and change images
- Connect GA4 and the email service
- Export to GitHub and deploy elsewhere

The code is organized so a database can be added later without a redesign.

## Order of work
1. Design system, settings, layout, info pages
2. Data formats, example stays, destinations, directory and stay pages
3. Tools
4. Guides: research briefs, then all ten articles
5. Search engine setup and sitemap
6. Tests, browser checks, handover guide

## Who does what
**I can do now:** everything above.

**Needs you:**
- Your GA4 measurement ID
- A Kit or MailerLite account and form
- Approved affiliate links
- Your business email
- A domain
- Connecting GitHub (Project settings, Git)
- Legal review of the policies I draft

**Needs independent checking:**
- Every real property (policy, fees, fencing, photos and permission to use them)
- Any article facts flagged in its research brief

**Can wait:**
- A database and admin area
- Member accounts and saved favorites
- Maps, reviews, price syncing
- More states

## Final quality safeguards (agreed)
1. **Guides:** all ten guides are fully researched and fully written. No outlines or filler. Sources are cited, and anything I can't verify is flagged and kept unpublished.
2. **Search engines:** every public page arrives fully built from the server, so search engines can read it without running the page's scripts. I'll confirm this by checking the raw page source, not just the browser view.
3. **Stays:** no invented properties, policies, prices, amenities, availability or ratings. Examples are noindexed and never appear as recommendations.
4. **Easy upkeep:** stays, destinations, guides, sources and affiliate links each live in their own clearly named files, all covered in the handover guide.
5. **Nothing fake:** no forms that don't save, no dead buttons, no pretend tracking.
6. **Resale-ready:** few extra libraries, no paid services required, and the whole site moves cleanly through GitHub.
7. **Launch report:** I'll test the real site, review the guides in a separate pass, and finish with a clear list of what works, what's waiting on verification, and what's waiting on your accounts.
