// Pure parser for one journal Markdown file. No Node imports, so tests and the build step share it.
import { parse as parseYaml } from "yaml";
import { journalFrontmatterSchema, countWords, type JournalArticle } from "./journal-schema";

export function parseJournalFile(
  file: string,
  text: string,
): { ok: true; article: JournalArticle } | { ok: false; error: string } {
  const m = text.replace(/\r\n/g, "\n").match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m)
    return {
      ok: false,
      error: `${file}: the file must start with a settings block between two --- lines`,
    };
  let data: unknown;
  try {
    data = parseYaml(m[1]!) ?? {};
  } catch (e) {
    return {
      ok: false,
      error: `${file}: settings block is not valid YAML: ${(e as Error).message}`,
    };
  }
  const r = journalFrontmatterSchema.safeParse(data);
  if (!r.success)
    return {
      ok: false,
      error:
        `${file}:\n` +
        r.error.issues
          .map((i) => `  - ${i.path.map(String).join(" > ") || "(file)"}: ${i.message}`)
          .join("\n"),
    };
  const body = m[2]!.replace(/^\n+/, "");
  if (r.data.slug !== file.replace(/^.*\//, "").replace(/\.md$/, ""))
    return { ok: false, error: `${file}: slug "${r.data.slug}" must match the file name` };
  return { ok: true, article: { ...r.data, body, words: countWords(body) } };
}
