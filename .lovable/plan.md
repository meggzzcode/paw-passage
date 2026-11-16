# Paw & Passage — launch-ready build plan

The design, page structure and Georgia + California focus from the last plan stay the same. This version restores the full business scope and runs on a Supabase account that you own.

## 1. Brand
- **Paw & Passage** everywhere: page titles, sharing tags, footer, articles and documentation.
- Name, tagline, contact email and disclosure text live in one settings file.

## 2. Backend: your own Supabase (no Lovable Cloud)
- **Why this works:** you own the account and the bill, it is easy to hand to a buyer, and I can build everything on it. I see no technical reason to switch to Lovable Cloud.
- **One limitation:** Lovable's docs describe connecting your own Supabase when a project is created (dashboard, + in the prompt box, Databases, Supabase). This project may need to be recreated that way. If so, I'll carry this plan over.
- **What I'll build on it:**
  - Database tables for stays, places, articles and the money features.
  - Admin sign-in with an admin role stored separately from accounts.
  - Access rules on every table.
  - Photo storage for stays and articles.
- **No fake demo:** until Supabase is connected, I won't fake saving data. Work that doesn't need it gets built first (see milestones).

## 3. Listings
- Search and filters read real database records. Filters stay in the web address so results can be shared.
- **Every stay has a status:** draft, needs verification, verified, published or archived. Only verified and published stays appear publicly.
- Each stay records when it was last verified, its source, and photo permission.
- **Demo stays** are flagged as demos, labeled "Example" on screen, hidden from search engines and left out of the sitemap. Demos can be switched off everywhere with one setting.
- **Admin area for stays:**
  - Add, edit, verify, publish and remove stays.
  - Upload photos.
  - CSV import with a preview, error checking per row, and a downloadable template. Imported stays always start as unverified drafts.

## 4. All ten guides (full articles)
1. Dog-Friendly Cabins With Fenced Yards in Georgia
2. Pet-Friendly Beachfront Rentals in California
3. Dog-Friendly Weekend Getaways From Atlanta
4. Dog-Friendly Weekend Getaways From Los Angeles
5. How to Find a Vacation Rental With a Truly Secure Fenced Yard
6. What to Check Before Booking a Pet-Friendly Airbnb or Vacation Rental
7. Traveling With Two Dogs: Accommodation Booking Checklist
8. How to Find Rentals That Welcome Large Dogs
9. The Ultimate Dog-Friendly Cabin Packing Checklist
10. Understanding Vacation Rental Pet Fees and Restrictions

**For each article:**
- Live web research of at least 5 real competing pages, recording each page's address, title and the date I checked it.
- Gaps in what those pages cover, plus checks against official sources such as state parks, tourism boards, beach rules and leash laws.
- At least 3 genuine extras, where the evidence supports them.
- A full written article in a warm, friend-to-friend voice. No outlines or filler.
- A research brief saved alongside it.

**Articles that will be held as drafts:**
- Any article missing verified facts is held as a draft, and its brief lists what still needs checking.
- No article will name a specific property as dog-friendly unless that property has been verified.

## 5. Article editor (no coding needed)
- Create, edit and preview articles in a rich-text editor.
- **Each article moves through:** draft, research, fact-check, approved, published.
- **Saved with each article:**
  - The research brief: keyword, questions, competitors, gaps, angle and sources.
  - Its sources.
  - Title and description for search engines, and a sharing image.
  - Whether search engines may show it.
  - The last-reviewed date, the author, and related stays and places.
- Places (states, regions, towns) are editable the same way.

## 6. Money features
- **Partner links:** a library of affiliate links for each stay, each with a network name, status (pending/approved) and notes. Booking buttons only show when an approved link exists.
- **Click tracking:** outbound clicks pass through a redirect at `/go/...` that records the stay, the page and the time, then forwards the visitor. The admin sees click totals.
- **Sponsored stays:** an on/off switch with start and end dates and an order setting. Sponsored stays carry a visible "Sponsored" label and sponsored links are marked for search engines.
- **Newsletter:** signups are saved with proof of consent, protected against spam, and exportable as a CSV for the admin. They're ready to connect to an email tool later.
- **Host inquiries:** a "List your property" form that saves to an admin inbox with statuses. Email alerts can be added later.

## 7. Search engines
- Every page is fully built on the server.
- **Every page gets:** its own title and description, a canonical tag, and a noindex setting for drafts, demos and filtered search pages.
- A sitemap generated from published records, plus a robots file.
- **Structured data:** articles, breadcrumbs, lodging details and FAQs where real.
- **Internal links** between guides, destinations and stays.

## 8. Testing
- **Automated tests:**
  - Filters combine correctly.
  - Only verified stays are public.
  - Demo stays are noindexed.
  - The CSV importer flags bad rows.
  - Clicks are recorded.
  - Signups and inquiries save.
  - Non-admins are blocked.
- A real browser run-through of the main paths, done signed in as admin.
- **No fake buttons:** nothing on the site pretends to work. Anything waiting on an outside account says so.

## 9. Handover to a buyer
- A `HANDOVER.md` covering:
  - How to update stays and run CSV imports.
  - How to publish articles.
  - How to export data.
  - How to move the Supabase, GitHub, domain and affiliate accounts to a new owner.
- An export button in the admin area for stays, articles, subscribers, inquiries and clicks.
- **GitHub:** you connect it in Project settings, Git. I can't connect it for you.

## Milestones
1. Design system, layout, public pages, settings file, SEO groundwork.
2. Database, admin sign-in, access rules, storage (once Supabase is connected).
3. Stays: search, detail pages, admin editor, CSV import, demo separation.
4. Article editor, then the ten researched articles: briefs first, then full articles.
5. Money features: partner links, click redirect, sponsored stays, newsletter, host inquiries.
6. Sitemap, structured data, tests, browser run-through, handover guide.

## Who does what
**I can build now:** everything in sections 1–9 except the items below.

**Needs you to connect or approve:**
- Your Supabase project.
- GitHub.
- Affiliate network approvals and their real links.
- An email marketing tool (for newsletter sending).
- Optionally, email alerts for host inquiries.
- Your domain.
- Legal review of the privacy policy, terms and disclosures (I'll draft them).

**Needs independent checking:**
- Every real property: pet policy, fees, fencing, breed and size limits, photos and permission to use them.
- Article facts marked "unverified" in the research briefs.
- Current pricing.

**Can safely wait:**
- Maps.
- Member accounts and saved favorites.
- Advanced analytics.
- Reviews.
- Automated price syncing.
- More states.
