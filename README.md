# Paw & Passage

A dog-friendly travel site: researched guides, planning tools and a directory of
verified stays. Plain-file content, no database, no admin login.

Built with TanStack Start + Vite + Tailwind. Edited in
[Lovable](https://lovable.dev/projects/0f267d97-888f-41b2-a541-46bc86d899b5), synced to this repository.

**Owner's handbook: see [HANDOVER.md](./HANDOVER.md)** (where content lives, how to add stays,
guides and affiliate links, launch checklist, how to transfer the business).

## Develop

```sh
bun install
bun run dev        # local preview (sample stays and draft guides are visible)
bunx vitest run    # rules and routing tests
bun run lint        # note: existing code has Prettier errors; run `bun run format` to fix
bun run build
```

CI runs tests and build on every push and pull request.

## Publishing rules (enforced in code and tests)

- A guide is public only when `status: "published"`, `research.researchComplete` is `true`,
  and `research.unverified` is empty. Anything else is a noindexed, preview-only draft left out of the sitemap.
- Only `verified` stays appear on the live site. Sample stays never do.
- Booking buttons appear only for verified stays with an approved affiliate link.
