// Validates content/journal/*.md: frontmatter, slug list, word counts, banned phrases and premium-text leaks.
// Run: node scripts/validate-journal.mjs  (exit 1 on any problem). Also run by src/test/journal-content.test.ts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import YAML from "yaml";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const SLUGS = [
  "things-to-do-with-your-dog-at-home",
  "rainy-day-dog-activities",
  "things-to-do-with-your-dog-this-weekend",
  "doggy-date-ideas",
  "free-things-to-do-with-your-dog",
  "activities-to-bond-with-your-dog",
  "puppy-bucket-list",
  "fun-things-to-do-with-your-senior-dog",
  "family-activities-with-dogs",
  "activities-for-high-energy-dogs",
];
const CTX = [
  "at-home",
  "rainy-day",
  "weekend",
  "doggy-date",
  "no-spend",
  "bond",
  "puppy",
  "senior",
  "family",
  "high-energy",
];
const BANNED = [
  /you haven't/i,
  /you haven’t/i,
  /is waiting/i,
  /streak/i,
  /exhaust/i,
  /\bcures?\b/i,
  /vet-approved/i,
  /guarantee/i,
  /thousands of/i,
  /best-selling/i,
  /\bbestselling\b/i,
  /\bmillions of\b/i,
  /\bscientifically proven\b/i,
];

const norm = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

function split(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) return null;
  return { fm: YAML.parse(m[1]), body: m[2] };
}

export function wordCount(body) {
  const text = body.replace(/\[([^\]]*)\]\([^)]*\)/g, "$1").replace(/[#*_`>]/g, " ");
  return text.split(/\s+/).filter((w) => /[A-Za-z0-9]/.test(w)).length;
}

function premiumSentences() {
  const dir = path.join(root, "content/premium");
  const out = new Set();
  if (!fs.existsSync(dir)) return out;
  for (const f of fs.readdirSync(dir)) {
    if (!f.endsWith(".json")) continue;
    let j;
    try {
      j = JSON.parse(fs.readFileSync(path.join(dir, f), "utf8"));
    } catch {
      continue;
    }
    const parts = [...(Array.isArray(j.instructions) ? j.instructions : []), j.twist].filter(
      (x) => typeof x === "string",
    );
    for (const p of parts) {
      for (const s of p.split(/(?<=[.!?])\s+/)) {
        const n = norm(s);
        if (n.split(" ").length >= 6) out.add(n);
      }
    }
  }
  return out;
}

export function validate() {
  const errors = [];
  const dir = path.join(root, "content/journal");
  const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => f.endsWith(".md")) : [];
  const found = files.map((f) => f.replace(/\.md$/, "")).sort();
  if (JSON.stringify(found) !== JSON.stringify([...SLUGS].sort())) {
    errors.push(`slug list must be exactly the ten contract slugs, found: ${found.join(", ")}`);
  }
  const collections = new Set(
    [
      ...fs
        .readFileSync(path.join(root, "content/collections.yml"), "utf8")
        .matchAll(/slug:\s*"([^"]+)"/g),
    ].map((m) => m[1]),
  );
  const premium = premiumSentences();
  const all = new Set(SLUGS);
  for (const f of files) {
    const slug = f.replace(/\.md$/, "");
    const p = split(fs.readFileSync(path.join(dir, f), "utf8"));
    const e = (msg) => errors.push(`${f}: ${msg}`);
    if (!p) {
      e("missing frontmatter");
      continue;
    }
    const { fm, body } = p;
    for (const k of [
      "title",
      "slug",
      "description",
      "datePublished",
      "dateModified",
      "primaryQuery",
      "intent",
      "collection",
      "ctaLabel",
      "ctaContext",
      "image",
      "imageAlt",
    ]) {
      if (fm[k] === undefined || fm[k] === null || String(fm[k]).trim() === "") e(`missing ${k}`);
    }
    if (fm.slug !== slug) e("slug does not match filename");
    if (String(fm.description ?? "").length > 155)
      e(`description ${String(fm.description).length} > 155`);
    for (const k of ["datePublished", "dateModified"]) {
      const v = fm[k] instanceof Date ? fm[k].toISOString().slice(0, 10) : String(fm[k]);
      if (!/^\d{4}-\d{2}-\d{2}$/.test(v)) e(`${k} must be YYYY-MM-DD`);
    }
    if (!Array.isArray(fm.secondaryQueries) || fm.secondaryQueries.length < 2)
      e("secondaryQueries needs 2+ entries");
    if (!collections.has(fm.collection)) e(`unknown collection ${fm.collection}`);
    if (!CTX.includes(fm.ctaContext)) e(`bad ctaContext ${fm.ctaContext}`);
    if (
      !Array.isArray(fm.related) ||
      fm.related.length !== 2 ||
      fm.related.some((r) => !all.has(r) || r === slug)
    )
      e("related must be two other contract slugs");
    if (!String(fm.image ?? "").startsWith("/journal/")) e("image must live under /journal/");
    if (
      !Array.isArray(fm.sources) ||
      fm.sources.length < 1 ||
      fm.sources.some((s) => !s?.label || !/^https:\/\//.test(s?.url ?? ""))
    )
      e("sources need {label,url}");
    const wc = wordCount(body);
    if (wc < 400 || wc > 650) e(`word count ${wc} outside 400-650`);
    const h1 = (body.match(/^# /gm) ?? []).length;
    if (h1 !== 0) e("body must not contain an h1 (the page renders the title)");
    const text = `${fm.title}\n${fm.description}\n${body}`;
    for (const re of BANNED) if (re.test(text)) e(`banned phrase ${re}`);
    const nb = ` ${norm(body)} `;
    for (const s of premium)
      if (nb.includes(` ${s} `)) e(`contains premium sentence: "${s.slice(0, 60)}..."`);
    for (const m of body.matchAll(/\]\((\/[^)]+)\)/g)) {
      const l = m[1];
      if (l.startsWith("/journal/") && !all.has(l.slice(9))) e(`broken journal link ${l}`);
      if (l.startsWith("/collections/") && !collections.has(l.slice(13)))
        e(`unknown collection link ${l}`);
    }
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const errors = validate();
  if (errors.length) {
    console.error(errors.join("\n"));
    process.exit(1);
  }
  console.log("journal content OK");
}
