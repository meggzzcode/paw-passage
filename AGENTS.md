<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules
- No backend in v1: all content lives in typed files under `src/content/` and `src/config/site.ts` so the site stays portable and backend-free; shapes mirror future DB tables.
- All legitimate stays render in production, verified or not (owner decision, 2026-11-18). Details come from public listings and unknown details say "Not confirmed"; never claim a stay is verified, visited or confirmed with a host unless that happened. Whether a stay, town or state page is indexed depends on the quality rule in `src/content/publish-rule.ts` (`stayIndexability`, `townIndexability`, `stateIndexability`), not on host verification; the sitemap follows the same rule. No listing photos or stock photos on stays. Samples render only in development.
- A guide is public only when `status === "published"`, `research.researchComplete` is true and `research.unverified` is empty; otherwise noindexed, preview-only, and left out of the sitemap, to keep unverified claims off the live site.
- Filters match only confirmed values (`null` = not confirmed never passes), so listings never overstate dog-friendliness.
- Booking buttons render only for approved links in `src/content/affiliates.ts`, using `rel="sponsored"`, to avoid fake or unauthorized affiliate links.
- GA4 and the sitemap stay inert until configured in Business settings, so no feature pretends to work. There is no newsletter (removed by the owner's decision, 2026-11-17).
