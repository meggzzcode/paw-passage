// One-time migration helper: turns a guide written as a code file (src/content/guides/<slug>.ts)
// into an editable Markdown file (content/guides/<slug>.md) for Pages CMS, then removes the code file.
//
//   bun scripts/convert-guide-to-md.ts how-vacation-rental-pet-fees-work [more-slugs...]
//
// The article text is copied word for word. The guide keeps its "approved" status so it stays public.
import { stringify } from "yaml";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dir, "..");
const slugs = process.argv.slice(2);
if (!slugs.length) {
  console.error("Usage: bun scripts/convert-guide-to-md.ts <guide-slug> [more-slugs...]");
  process.exit(2);
}

mkdirSync(join(root, "content", "guides"), { recursive: true });
for (const slug of slugs) {
  const tsFile = join(root, "src", "content", "guides", `${slug}.ts`);
  if (!existsSync(tsFile)) throw new Error(`No code file for guide "${slug}"`);
  const { guide } = (await import(tsFile)) as {
    guide: Record<string, unknown> & { body: string; slug: string; lastReviewed: string };
  };
  const { body, slug: _slug, ...rest } = guide;
  const front: Record<string, unknown> = {
    ...rest,
    approvedBy: (rest as { approvedBy?: string }).approvedBy ?? "Paws & Passage Editors",
    approvedOn: (rest as { approvedOn?: string }).approvedOn ?? guide.lastReviewed,
  };
  for (const k of Object.keys(front)) if (front[k] === undefined) delete front[k];
  const yaml = stringify(front, {
    lineWidth: 0,
    defaultStringType: "PLAIN",
    defaultKeyType: "PLAIN",
  });
  writeFileSync(
    join(root, "content", "guides", `${slug}.md`),
    `---\n${yaml}---\n\n${body.replace(/^\n+/, "").replace(/\s+$/, "")}\n`,
  );
  unlinkSync(tsFile);
  console.log(`converted ${slug}`);
}
