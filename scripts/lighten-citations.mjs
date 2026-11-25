#!/usr/bin/env bun
// Owner decision 2026-11-25: sourcing in sentences is light. This codemod removes the trailing parenthetical publisher
// links ` ([Publisher](url))` / ` ([A](url), [B](url))` (rendered as span.src-paren) from published guides. The
// frontmatter `sources` (and so the collapsible Sources list at the end of every guide) is never touched. Deterministic
// and idempotent (a second run finds nothing to remove). Run with bun (it loads the .ts guides and the yaml package):
//   bun scripts/lighten-citations.mjs                       dry run, per-guide table (before/after counts)
//   bun scripts/lighten-citations.mjs --write               rewrite the guide files
//   bun scripts/lighten-citations.mjs --only a,b            only these slugs
//   bun scripts/lighten-citations.mjs --skip a,b            leave these slugs alone (e.g. files someone else is editing)
//   bun scripts/lighten-citations.mjs --show slug           print each removal for one guide, with its sentence
//   bun scripts/lighten-citations.mjs --flags               list only the "check by hand" removals
//   bun scripts/lighten-citations.mjs --cap 8               inline-link cap for the safety/legal guides
//
// Rules
//  (A) General guides: every trailing parenthetical publisher link is removed. A removal is FLAGGED when the sentence
//      says "according to / the report says / the maker says" but names no publisher of this guide, so the source lived
//      only in the tag, or when the tag sits mid-sentence (removing it would leave a hole). Rewrite those by hand BEFORE --write so the publisher becomes the link text of the sentence
//      ("[Airbnb's help center](url) says ..."); natural in-prose links are never touched.
//  (B) Exception guides (EXCEPTIONS below: safety, medical, restraint, heat/cold, legal and platform-policy): a tag is
//      kept only when its sentence contains a string listed for that guide in scripts/lighten-citations.keep.json
//      (the hand-picked safety-critical claims, about `--cap` inline source links per guide, natural ones included).
//  (C) The script reports external inline links that are not in the guide's sources (a link must point at a source).
//  (D) Table rows are never touched; "Sources:" lines under tables stay.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import { publisherAliases } from "../src/content/citations.ts";

const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const flag = (n) => (args.indexOf(n) >= 0 ? args[args.indexOf(n) + 1] : null);
const set = (n) => (flag(n) ? new Set(flag(n).split(",")) : null);
const ONLY = set("--only");
const SKIP = set("--skip") ?? new Set();
const SHOW = flag("--show");
const FLAGS_ONLY = args.includes("--flags");
const CAP = Number(flag("--cap") ?? 8);

export const EXCEPTIONS = new Set([
  "dog-car-safety-harness-and-crate-guide",
  "keep-a-dog-cool-on-a-summer-trip",
  "dog-travel-first-aid-kit-guide",
  "if-your-dog-gets-loose-on-a-trip",
  "dog-life-jacket-for-lakes-and-beaches",
  "cold-weather-dog-gear-for-winter-cabin-trips",
  "new-years-eve-with-a-dog-in-a-vacation-rental",
  "dog-hiking-gear-for-a-cabin-vacation",
  "bringing-a-dog-to-a-no-pets-rental",
]);

// Exception guides: a tag is kept only when its sentence contains one of these strings (hand-picked safety-critical,
// medical/emergency, restraint-testing, heat/cold physiology, legal and platform-policy claims; about 8 inline source
// links per guide counting the natural ones). Add a string here to keep another tag; everything else is removed.
export const KEEP = JSON.parse(
  readFileSync(join(import.meta.dirname, "lighten-citations.keep.json"), "utf8"),
);

const PAREN = /\(\[[^\]]+\]\(https?:[^)\s]+\)(?:, \[[^\]]+\]\(https?:[^)\s]+\))*\)/g;
const LINK = /\[([^\]]+)\]\((https?:[^)\s]+)(?:\s+"[^"]*")?\)/g;
const isTableRow = (l) => /^\s*\|/.test(l);
const ATTRIB =
  /\b(according to|reports?|reported|says?|said|states?|stated|claims?|claimed|thread|post|guide|page|blog|article|study|survey|found|reviewers?|maker|manufacturer|brand|writes?|wrote|notes?|noted|lists?|publishes?|advises?|recommends?|warns?)\b/i;

async function loadGuides() {
  const out = [];
  const mdDir = join(ROOT, "content/guides");
  for (const f of readdirSync(mdDir)
    .filter((n) => n.endsWith(".md"))
    .sort()) {
    const file = join(mdDir, f);
    const text = readFileSync(file, "utf8");
    const m = /^---\n([\s\S]*?)\n---\n/.exec(text);
    if (!m) continue;
    const data = parseYaml(m[1]);
    if (data.status !== "published") continue;
    out.push({
      slug: f.replace(/\.md$/, ""),
      file,
      sources: data.sources ?? [],
      full: text,
      start: m[0].length,
      end: text.length,
    });
  }
  const tsDir = join(ROOT, "src/content/guides");
  for (const f of readdirSync(tsDir)
    .filter((n) => n.endsWith(".ts") && n !== "index.ts")
    .sort()) {
    const file = join(tsDir, f);
    const g = (await import(pathToFileURL(file).href)).guide;
    if (g.status !== "published") continue;
    const text = readFileSync(file, "utf8");
    const open = text.indexOf("body: `");
    if (open < 0) throw new Error(`${f}: no body template literal`);
    const start = open + "body: `".length;
    let i = start;
    while (i < text.length && !(text[i] === "`" && text[i - 1] !== "\\")) i++;
    out.push({ slug: g.slug, file, sources: g.sources ?? [], full: text, start, end: i });
  }
  return out;
}

const countParen = (body) => [...body.matchAll(PAREN)].length;
/** Sentence (within one line) that holds index i. */
function sentenceAt(line, i) {
  const re = /(?<=[a-z0-9)\]"'”%][.!?]["'”)*_]*)\s+(?=[A-Z"(\[*])/g;
  let from = 0;
  let to = line.length;
  for (const m of line.matchAll(re)) {
    if (m.index + m[0].length <= i) from = m.index + m[0].length;
    else if (m.index >= i) {
      to = m.index;
      break;
    }
  }
  return line.slice(from, to);
}

function lighten(g) {
  const body = g.full.slice(g.start, g.end);
  const exception = EXCEPTIONS.has(g.slug);
  const urls = new Set(g.sources.map((s) => s.url));
  const aliases = g.sources.flatMap((s) => publisherAliases(s.publisher ?? ""));
  const lines = body.split("\n");
  const items = []; // every parenthetical tag
  lines.forEach((line, li) => {
    if (isTableRow(line)) return;
    for (const m of line.matchAll(PAREN)) {
      const sentence = sentenceAt(line, m.index);
      const bare = sentence.replace(PAREN, "").replace(/\[([^\]]+)\]\([^)]*\)/g, "$1");
      const named = aliases.some((a) => bare.toLowerCase().includes(a.toLowerCase()));
      items.push({
        li,
        index: m.index,
        len: m[0].length,
        sentence: sentence.trim(),
        flagged:
          (!named && ATTRIB.test(bare)) || /^\s+[A-Za-z]/.test(line.slice(m.index + m[0].length)),
        keep: false,
      });
    }
  });
  if (exception)
    for (const it of items) it.keep = (KEEP[g.slug] ?? []).some((k) => it.sentence.includes(k));
  // apply removals right to left within each line: drop the tag and the space before it
  const byLine = new Map();
  for (const it of items.filter((x) => !x.keep))
    (byLine.get(it.li) ?? byLine.set(it.li, []).get(it.li)).push(it);
  for (const [li, list] of byLine) {
    let l = lines[li];
    for (const it of list.sort((a, b) => b.index - a.index)) {
      const lead = l.slice(0, it.index).replace(/ +$/, "");
      let rest = l.slice(it.index + it.len);
      l = lead + (/^[\s]/.test(rest) && lead === "" ? rest.trimStart() : rest);
    }
    lines[li] = l;
  }
  const next = lines.join("\n");
  const external = [...next.matchAll(LINK)].map((m) => m[2]).filter((u) => !urls.has(u));
  return {
    slug: g.slug,
    exception,
    sources: g.sources.length,
    before: countParen(body),
    after: countParen(next),
    items,
    next,
    foreign: [...new Set(external)],
    inline: [
      ...next
        .split("\n")
        .filter((l) => !isTableRow(l) && !/^Sources( for this table)?[:,]/.test(l))
        .join("\n")
        .matchAll(LINK),
    ].filter((m) => urls.has(m[2])).length,
  };
}

const guides = (await loadGuides()).filter((g) => (!ONLY || ONLY.has(g.slug)) && !SKIP.has(g.slug));
const rows = [];
for (const g of guides) {
  const r = lighten(g);
  rows.push(r);
  const body = g.full.slice(g.start, g.end);
  if (WRITE && r.next !== body)
    writeFileSync(g.file, g.full.slice(0, g.start) + r.next + g.full.slice(g.end));
  if (SHOW === g.slug)
    for (const it of r.items)
      console.log(`${it.keep ? "KEEP " : it.flagged ? "FLAG " : "drop "} ${it.sentence}`);
  if (FLAGS_ONLY)
    for (const it of r.items.filter((x) => x.flagged && !x.keep))
      console.log(`${g.slug}\n   ${it.sentence}`);
}
if (!FLAGS_ONLY && !SHOW) {
  console.log(
    "slug | exception | sources | paren before | paren after | flagged | inline source links after | links to non-sources",
  );
  for (const r of rows)
    console.log(
      `${r.slug} | ${r.exception ? "yes" : ""} | ${r.sources} | ${r.before} | ${r.after} | ${r.items.filter((i) => i.flagged && !i.keep).length} | ${r.inline} | ${r.foreign.length}`,
    );
  const sum = (k) => rows.reduce((n, r) => n + r[k], 0);
  console.log(
    `TOTAL paren before ${sum("before")} after ${sum("after")} in ${rows.length} guides${WRITE ? " (written)" : " (dry run)"}`,
  );
}
