#!/usr/bin/env bun
// Phase C codemod: removes the numbered citation markers [[n]](url) from every published guide and replaces them with
// natural publisher links. Deterministic and idempotent. Run with bun (it loads the .ts guides and the yaml package):
//   bun scripts/remove-citation-numbers.mjs --dry-run                 per-guide report, change nothing
//   bun scripts/remove-citation-numbers.mjs --dry-run --only a,b      only these slugs
//   bun scripts/remove-citation-numbers.mjs --write [--only a,b]      rewrite the guide files
//   add --json to print the report as JSON; --show slug prints the changed lines of one guide.
//
// For every marker, in reading order, inside each paragraph / list item:
//  (e) its URL must equal sources[n-1].url (a mismatch is reported; it is fixed only if the URL is in sources once);
//  (c) a source already linked earlier in the same paragraph is dropped (one link per source per paragraph);
//  (a) when the publisher is named as a plain word in the sentence, that first mention becomes the link;
//  (b) otherwise a short parenthetical publisher link ends the sentence: ([Airbnb](url)) or ([Airbnb](url), [Vrbo](url)),
//      never more than 2 links per sentence;
//  (d) "Sources for this table:" lines keep their sources as plain publisher links.
// Link text is publisherDisplayName(publisher) from src/content/citations.ts (small override map there).
// The `sources` frontmatter is never touched. A guide is written only when every source it cited before is still
// linked in the body afterwards and a second run would change nothing.
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { parse as parseYaml } from "yaml";
import {
  citedSourceNumbers,
  linkedSourceNumbers,
  publisherAliases,
  publisherDisplayName,
} from "../src/content/citations.ts";

const ROOT = resolve(import.meta.dirname, "..");
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
const JSON_OUT = args.includes("--json");
const arg = (name) => (args.indexOf(name) >= 0 ? args[args.indexOf(name) + 1] : null);
const ONLY = arg("--only") ? new Set(arg("--only").split(",")) : null;
const SHOW = arg("--show");
if (!WRITE && !args.includes("--dry-run")) {
  console.error("Pass --dry-run (report only) or --write.");
  process.exit(2);
}

const MARK = /\[\[(\d{1,3})\]\]\((https?:[^)\s]+)\)/g;
const countMarkers = (t) => [...t.matchAll(MARK)].length;
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const MAX_PER_SENTENCE = 2;
const MENTION_WINDOW = 320;

// ---------- reading guides ----------
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
    const start = m[0].length;
    out.push({
      slug: f.replace(/\.md$/, ""),
      file,
      kind: "md",
      sources: data.sources ?? [],
      body: text.slice(start),
      full: text,
      start,
      end: text.length,
    });
  }
  const tsDir = join(ROOT, "src/content/guides");
  for (const f of readdirSync(tsDir)
    .filter((n) => n.endsWith(".ts") && n !== "index.ts")
    .sort()) {
    const file = join(tsDir, f);
    const mod = await import(pathToFileURL(file).href);
    const g = mod.guide;
    if (g.status !== "published") continue;
    const text = readFileSync(file, "utf8");
    const open = text.indexOf("body: `");
    if (open < 0) throw new Error(`${f}: no body template literal`);
    const start = open + "body: `".length;
    let i = start;
    while (i < text.length && !(text[i] === "`" && text[i - 1] !== "\\")) i++;
    out.push({
      slug: g.slug,
      file,
      kind: "ts",
      sources: g.sources ?? [],
      body: text.slice(start, i),
      full: text,
      start,
      end: i,
    });
  }
  return out;
}

// ---------- text helpers ----------
const isTableRow = (l) => /^\s*\|/.test(l);
const isUnitStart = (l) =>
  /^\s*([-*+]|\d+\.)\s/.test(l) || /^#{1,6}\s/.test(l) || isTableRow(l) || /^\s*>/.test(l);
const isSourcesLine = (l) => /^Sources for this table:/.test(l);

const markersIn = (line) =>
  [...line.matchAll(MARK)].map((m) => ({
    n: Number(m[1]),
    url: m[2],
    start: m.index,
    end: m.index + m[0].length,
  }));

/** Start index of the sentence that ends where `upTo` is (punctuation and spaces just before upTo are ignored). */
function sentenceStart(line, upTo) {
  const before = line.slice(0, upTo).replace(/[\s.!?"'”)*_]+$/u, "");
  const re = /(?<=[a-z0-9)\]"'”%][.!?]["'”)*_]*)\s+(?=[A-Z"(\[*])/g;
  let from = 0;
  for (const m of before.matchAll(re)) from = m.index + m[0].length;
  return from;
}

/** True when index i of line lies inside an existing Markdown link or a URL. */
function insideLink(line, i, len) {
  for (const m of line.matchAll(/\[[^\]]*\]\([^)]*\)|https?:\/\/\S+/g))
    if (i < m.index + m[0].length && i + len > m.index) return true;
  return false;
}

// ---------- the codemod for one body ----------
function convert(g) {
  const rep = {
    slug: g.slug,
    kind: g.kind,
    sources: g.sources.length,
    markersBefore: countMarkers(g.body),
    mismatches: [],
    fixed: [],
    unresolved: [],
    dupDropped: 0,
    mentionLinks: 0,
    parenLinks: 0,
    parenGroups: 0,
    tableLineLinks: 0,
    overflow: [],
    maxParenPerParagraph: 0,
    warnings: [],
  };
  const urlToIdx = new Map();
  g.sources.forEach((s, i) => urlToIdx.set(s.url, [...(urlToIdx.get(s.url) ?? []), i + 1]));
  const display = g.sources.map((s) => publisherDisplayName(s.publisher));
  const aliasesOf = g.sources.map((s) => publisherAliases(s.publisher));
  // every alias of every source, longest first: a match that sits inside a longer alias of another publisher is skipped
  const allAliases = [...new Set(aliasesOf.flat())].sort((a, b) => b.length - a.length);
  const aliasRe = (name) =>
    new RegExp(`(?<![A-Za-z0-9])${esc(name)}(?![A-Za-z0-9])`, /\s/.test(name) ? "gi" : "g");

  let lines = g.body.split("\n");

  // (e) validate
  lines = lines.map((line, li) => {
    let out = line;
    for (const m of [...markersIn(line)].reverse()) {
      const want = g.sources[m.n - 1]?.url;
      if (want === m.url) continue;
      const cands = urlToIdx.get(m.url) ?? [];
      const note = `line ${li + 1}: [[${m.n}]] links ${m.url} but sources[${m.n}] is ${want ?? "(none)"}`;
      rep.mismatches.push(note);
      if (cands.length === 1) {
        out = out.slice(0, m.start) + `[[${cands[0]}]](${m.url})` + out.slice(m.end);
        rep.fixed.push(`${note} -> renumbered to [[${cands[0]}]]`);
      } else rep.unresolved.push(note);
    }
    return out;
  });
  const cited0 = citedSourceNumbers(lines.join("\n"), g.sources);

  // paragraph / list-item units
  let unit = 0;
  const unitOf = lines.map((l) => {
    if (l.trim() === "") unit++;
    else if (isUnitStart(l)) unit++;
    return unit;
  });
  const seen = new Map(); // unit -> Set of source numbers linked so far
  const parenInUnit = new Map();
  const sentenceCount = new Map(); // "li:start" -> links used
  const unitSet = (u) => {
    if (!seen.has(u)) seen.set(u, new Set());
    return seen.get(u);
  };

  for (let li = 0; li < lines.length; li++) {
    let line = lines[li];
    if (/^#{1,6}\s/.test(line) || isTableRow(line)) {
      if (markersIn(line).length)
        rep.warnings.push(`line ${li + 1}: markers in a heading or table row left alone`);
      continue;
    }
    const u = unitOf[li];
    const set = unitSet(u);
    const hidden = new Array(line.length).fill(false);
    for (const m of line.matchAll(/\]\(https?:[^)\s]*\)/g))
      for (let k = m.index + 1; k < m.index + m[0].length; k++) hidden[k] = true;
    const edits = []; // {start, end, text}
    const claimed = []; // [start,end) of mentions linked on this line

    // (d) "Sources for this table: ..." lines: plain publisher links, no parentheses
    if (isSourcesLine(line)) {
      const cut = (() => {
        const m = /\.\s+(?=[A-Z])/.exec(line.slice("Sources for this table:".length));
        return m ? "Sources for this table:".length + m.index + 1 : line.length;
      })();
      const head = line.slice(0, cut);
      let out = head;
      for (const m of [...markersIn(head)].reverse()) {
        const src = g.sources[m.n - 1];
        if (!src || src.url !== m.url) continue;
        const name = display[m.n - 1];
        // "Airbnb column [[1]](url)": link the word that is already there
        const before = out.slice(0, m.start);
        const hit = new RegExp(`(?<![A-Za-z0-9])(${esc(name)})( column)?\\s*$`).exec(before);
        if (hit && !insideLink(out, hit.index, hit[1].length)) {
          out =
            before.slice(0, hit.index) +
            `[${hit[1]}](${src.url})${hit[2] ?? ""}` +
            out.slice(m.end);
        } else out = before.replace(/\s+$/, " ") + `[${name}](${src.url})` + out.slice(m.end);
        rep.tableLineLinks++;
        set.add(m.n);
      }
      // the remainder of the line (if any) is ordinary text and is handled below
      line = out + lines[li].slice(cut);
      lines[li] = line;
      if (!markersIn(line).length) continue;
    }

    // existing inline links to sources count as already linked, in reading order
    const events = [
      ...markersIn(line).map((m) => ({ ...m, kind: "marker" })),
      ...[...line.matchAll(/\]\((https?:[^)\s]+)\)/g)]
        .filter((m) => urlToIdx.has(m[1]) && line.slice(m.index - 1, m.index + 2) !== "]](")
        .map((m) => ({ n: urlToIdx.get(m[1])[0], start: m.index, kind: "link" })),
    ].sort((a, b) => a.start - b.start);

    // group markers into runs (only spaces, commas or semicolons between them)
    const markers = events.filter((e) => e.kind === "marker");
    const runs = [];
    for (const m of markers) {
      const last = runs[runs.length - 1];
      if (last && /^[\s,;]*$/.test(line.slice(last[last.length - 1].end, m.start))) last.push(m);
      else runs.push([m]);
    }

    const handled = new Map(); // marker start -> {keep: bool, text}
    for (const e of events) {
      if (e.kind === "link") {
        set.add(e.n);
        continue;
      }
      const src = g.sources[e.n - 1];
      if (!src || src.url !== e.url) continue;
      if (set.has(e.n)) {
        handled.set(e.start, { drop: true });
        rep.dupDropped++;
        continue;
      }
      // (a) the publisher named in the sentence
      const sStart = sentenceStart(line, e.start);
      // the window holds at most MENTION_WINDOW visible characters (link addresses do not count)
      let wStart = e.start;
      for (let vis = 0; wStart > sStart && vis < MENTION_WINDOW; wStart--)
        if (!hidden[wStart - 1]) vis++;
      const win = line.slice(wStart, e.start);
      let best = null;
      for (const name of aliasesOf[e.n - 1]) {
        for (const m of win.matchAll(aliasRe(name))) {
          const at = wStart + m.index;
          const len = m[0].length;
          if (insideLink(line, at, len)) continue;
          if (claimed.some(([a, b]) => at < b && at + len > a)) continue;
          // inside a longer alias of another publisher (AKC inside "AKC Reunite")?
          const longer = allAliases.find(
            (o) =>
              o.length > name.length &&
              !aliasesOf[e.n - 1].includes(o) &&
              [...win.matchAll(aliasRe(o))].some(
                (x) => wStart + x.index <= at && wStart + x.index + x[0].length >= at + len,
              ),
          );
          if (longer) continue;
          if (!best || at < best.at) best = { at, len, text: m[0] };
          break;
        }
      }
      if (best) {
        edits.push({ start: best.at, end: best.at + best.len, text: `[${best.text}](${src.url})` });
        claimed.push([best.at, best.at + best.len]);
        handled.set(e.start, { mention: true });
        set.add(e.n);
        rep.mentionLinks++;
        continue;
      }
      // (b) a parenthetical link, up to 2 per sentence
      const key = `${li}:${sStart}`;
      const used = sentenceCount.get(key) ?? 0;
      if (used >= MAX_PER_SENTENCE) {
        handled.set(e.start, { drop: true });
        rep.overflow.push(
          `line ${li + 1}: [[${e.n}]] ${display[e.n - 1]} (3rd link in a sentence)`,
        );
        continue;
      }
      sentenceCount.set(key, used + 1);
      set.add(e.n);
      handled.set(e.start, { paren: `[${display[e.n - 1]}](${src.url})` });
    }

    // one edit per run: remove the markers, and place the parenthetical (if any) at the end of the sentence
    for (const run of runs) {
      const links = run.map((m) => handled.get(m.start)?.paren).filter(Boolean);
      const first = run[0];
      const last = run[run.length - 1];
      const pre = line.slice(0, first.start);
      const post = line.slice(last.end);
      const punct = /([.!?]["'”)*_]*)\s*$/.exec(pre);
      let start;
      let text;
      if (punct && links.length) {
        start = pre.slice(0, punct.index).trimEnd().length;
        text = ` (${links.join(", ")})${punct[1]}`;
      } else if (punct) {
        start = pre.trimEnd().length;
        text = "";
      } else {
        start = pre.trimEnd().length;
        text = links.length ? ` (${links.join(", ")})` : "";
      }
      // keep words apart when the text after the run starts straight with a word
      if (/^[A-Za-z0-9*_(]/.test(post) && start + 0 >= 0) text += " ";
      if (links.length) {
        rep.parenGroups++;
        rep.parenLinks += links.length;
        parenInUnit.set(u, (parenInUnit.get(u) ?? 0) + 1);
      }
      // a space before the first word of post is already in post; drop a leading space of post that follows punct
      edits.push({ start, end: last.end, text });
    }

    // apply right to left
    edits.sort((a, b) => b.start - a.start);
    for (const ed of edits) line = line.slice(0, ed.start) + ed.text + line.slice(ed.end);
    lines[li] = line;
  }
  // Clutter pass: a paragraph with more than 2 parenthetical groups loses later single-link groups whose publisher is
  // already linked earlier in the paragraph, as long as the source is linked somewhere else in the guide too.
  const GROUP = /\s\((\[[^\]]+\]\((https?:[^)\s]+)\)(?:, \[[^\]]+\]\((https?:[^)\s]+)\))*)\)/g;
  const urlCount = (url) => lines.join("\n").split(`](${url})`).length - 1;
  rep.clutterDropped = 0;
  for (let again = true; again;) {
    again = false;
    const groupsByUnit = new Map();
    lines.forEach((l, li) => {
      if (isTableRow(l) || /^#{1,6}\s/.test(l)) return;
      for (const m of l.matchAll(GROUP))
        (groupsByUnit.get(unitOf[li]) ?? groupsByUnit.set(unitOf[li], []).get(unitOf[li])).push({
          li,
          index: m.index,
          len: m[0].length,
          urls: [...m[1].matchAll(/\]\((https?:[^)\s]+)\)/g)].map((x) => x[1]),
        });
    });
    for (const [u, groups] of groupsByUnit) {
      if (groups.length <= 2) continue;
      for (const gr of [...groups].reverse()) {
        if (gr.urls.length !== 1) continue;
        const url = gr.urls[0];
        const srcN = urlToIdx.get(url)?.[0];
        const name = srcN && display[srcN - 1];
        if (!name || urlCount(url) < 2) continue;
        // is that publisher linked earlier in this paragraph (any source of the same display name)?
        const earlier = [];
        lines.forEach((l, li) => {
          if (unitOf[li] !== u) return;
          for (const m of l.matchAll(/\]\((https?:[^)\s]+)\)/g))
            if (li < gr.li || (li === gr.li && m.index < gr.index)) earlier.push(m[1]);
        });
        if (!earlier.some((x) => x !== url && display[(urlToIdx.get(x)?.[0] ?? 0) - 1] === name))
          continue;
        lines[gr.li] = lines[gr.li].slice(0, gr.index) + lines[gr.li].slice(gr.index + gr.len);
        rep.clutterDropped++;
        again = true;
        break;
      }
      if (again) break;
    }
  }
  parenInUnit.clear();
  lines.forEach((l, li) => {
    if (!isTableRow(l) && !/^#{1,6}\s/.test(l)) {
      const n = [...l.matchAll(GROUP)].length;
      if (n) parenInUnit.set(unitOf[li], (parenInUnit.get(unitOf[li]) ?? 0) + n);
    }
  });
  rep.parasOver2 = [...parenInUnit.values()].filter((n) => n > 2).length;
  rep.parasOver1 = [...parenInUnit.values()].filter((n) => n > 1).length;

  const body = lines.join("\n");
  rep.markersAfter = countMarkers(body);
  const now = linkedSourceNumbers(body, g.sources);
  const lost = [...cited0].filter((n) => !now.has(n));
  if (lost.length) rep.warnings.push(`sources no longer linked: ${lost.join(", ")}`);
  rep.uncitedBefore = g.sources.map((_, i) => i + 1).filter((n) => !cited0.has(n));
  rep.linked = now.size;
  rep.newBody = body;
  rep.bodyChanged = body !== g.body;
  return rep;
}

// ---------- main ----------
const guides = (await loadGuides()).filter((g) => !ONLY || ONLY.has(g.slug));
const reports = [];
for (const g of guides) {
  const r = convert(g);
  const again = convert({ ...g, body: r.newBody });
  r.idempotent = again.newBody === r.newBody;
  reports.push(r);
  if (SHOW === g.slug) {
    const a = g.body.split("\n");
    const b = r.newBody.split("\n");
    a.forEach((l, i) => {
      if (l !== b[i]) console.log(`- ${l}\n+ ${b[i]}\n`);
    });
  }
  const unresolved = r.unresolved.length || r.markersAfter;
  if (WRITE && r.bodyChanged && !r.warnings.length && r.idempotent && !unresolved) {
    writeFileSync(g.file, g.full.slice(0, g.start) + r.newBody + g.full.slice(g.end));
    r.written = true;
  }
}
const sum = (k) => reports.reduce((s, r) => s + (typeof r[k] === "number" ? r[k] : 0), 0);
if (JSON_OUT)
  console.log(
    JSON.stringify(
      reports.map(({ newBody, ...r }) => r),
      null,
      2,
    ),
  );
else {
  const pad = (s, n) => String(s).padEnd(n);
  console.log(
    pad("guide", 56) +
      "src  before  mention  paren  groups  dup  tbl  over  >2  mism  left  linked  ok",
  );
  for (const r of reports)
    console.log(
      pad(r.slug, 56) +
        [
          r.sources,
          r.markersBefore,
          r.mentionLinks,
          r.parenLinks,
          r.parenGroups,
          r.dupDropped,
          r.tableLineLinks,
          r.overflow.length,

          r.parasOver2,
          r.mismatches.length,
          r.markersAfter,
          r.linked,
          r.idempotent && !r.warnings.length ? "yes" : "NO",
        ]
          .map((x) => pad(x, 6))
          .join("") +
        (r.written ? " written" : ""),
    );
  console.log(
    `\nTOTAL guides ${reports.length}  sources ${sum("sources")}  markers before ${sum("markersBefore")}  mention links ${sum("mentionLinks")}  parenthetical links ${sum("parenLinks")} in ${sum("parenGroups")} groups  table-line links ${sum("tableLineLinks")}  dup dropped ${sum("dupDropped")}  overflow ${reports.reduce((s, r) => s + r.overflow.length, 0)}  markers left ${sum("markersAfter")}  mismatches ${sum("mismatches")}  paragraphs with >2 parentheticals ${sum("parasOver2")}  with >1 ${sum("parasOver1")}`,
  );
  for (const r of reports) {
    for (const k of ["mismatches", "unresolved", "overflow", "warnings"])
      for (const x of r[k]) console.log(`${r.slug} ${k}: ${x}`);
    if (!r.idempotent) console.log(`${r.slug}: NOT idempotent`);
  }
}
if (args.includes("--clutter")) {
  for (const r of reports) {
    let para = [];
    const flush = () => {
      const n = (
        para.join("\n").match(/\(\[[^\]]+\]\(https?:[^)]+\)(?:, \[[^\]]+\]\(https?:[^)]+\))?\)/g) ??
        []
      ).length;
      if (n > 2)
        console.log(
          `--- ${r.slug} (${n})\n${para.join("\n").replace(/\]\(https?:[^)]+\)/g, "](…)")}\n`,
        );
      para = [];
    };
    for (const l of r.newBody.split("\n")) {
      if (l.trim() === "" || isUnitStart(l)) flush();
      para.push(l);
    }
    flush();
  }
}
