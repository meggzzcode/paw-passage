// Compares the <body> of two snapshot folders (from snapshot.mjs) ignoring things that legitimately change with a rebuild:
// script/preload/stylesheet tags and hashed asset names. Prints per-file result and any differing lines.
// Usage: node scripts/perf/compare-html.mjs <beforeDir> <afterDir> [--ignore-faq-jsonld]
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const [a, b, ...flags] = process.argv.slice(2);
const ignoreFaq = flags.includes("--ignore-faq-jsonld");
const norm = (h) => {
  // Only the rendered page (<body>) is compared; <head> changes on purpose (fonts, JSON-LD) and is reviewed separately.
  let s = (h.match(/<body[\s\S]*<\/body>/) ?? [h])[0]
    .replace(/<script\b[^>]*src=[^>]*><\/script>/g, "")
    .replace(/<link rel="(modulepreload|preload|stylesheet)"[^>]*>/g, "")
    // Router hydration data lists the JS chunks of the build, which change by design; the loader data inside is compared via the HTML itself.
    .replace(/<script data-tsr-stream-part[^>]*>[\s\S]*?<\/script>/g, "<TSR/>")
    .replace(/<script>\$_TSR[\s\S]*?<\/script>/g, "<TSR/>")
    .replace(
      /\/assets\/[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.(js|css|jpg|png|webp|woff2)/g,
      "/assets/HASHED.$1",
    );
  if (ignoreFaq)
    s = s.replace(
      /<script type="application\/ld\+json">(?:(?!<\/script>)[\s\S])*"@type":"FAQPage"(?:(?!<\/script>)[\s\S])*<\/script>/g,
      "",
    );
  return s.split(/(?=<)/).filter((x) => x.trim());
};
let bad = 0;
for (const f of readdirSync(a)) {
  const x = norm(readFileSync(join(a, f), "utf8"));
  const y = norm(readFileSync(join(b, f), "utf8"));
  const diffs = [];
  const n = Math.max(x.length, y.length);
  for (let i = 0; i < n; i++)
    if (x[i] !== y[i]) {
      diffs.push([x[i]?.slice(0, 160), y[i]?.slice(0, 160)]);
      if (diffs.length > 3) break;
    }
  console.log(diffs.length ? "DIFF " : "same ", f, `(${x.length} nodes)`);
  if (diffs.length) {
    bad++;
    for (const d of diffs) console.log("   before:", d[0], "\n   after: ", d[1]);
  }
}
process.exit(bad ? 1 : 0);
