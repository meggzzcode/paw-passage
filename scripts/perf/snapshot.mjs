// Saves the server-rendered HTML of key pages so two builds can be compared for identical output.
// Usage: node scripts/perf/snapshot.mjs <baseUrl> <outDir>
import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const [base = "http://localhost:4180", out = "perf-snapshot"] = process.argv.slice(2);
const paths = [
  "/",
  "/guides",
  "/gear",
  "/stays",
  "/guides/vacation-rentals-with-no-pet-fee", // markdown guide with FAQ
  "/guides/how-vacation-rental-pet-fees-work", // markdown guide
  "/guides/dog-car-safety-harness-and-crate-guide", // code-file guide with gear picks
  "/guides/dog-friendly-cabin-packing-list", // code-file guide
  "/guides/vacation-rental-secure-fenced-yard", // code-file guide
  "/guides/what-a-dog-really-costs-on-a-vacation-rental", // guide with embedded tool or related links
  "/guides/does-not-exist", // 404
];
mkdirSync(out, { recursive: true });
for (const p of paths) {
  const res = await fetch(base + p);
  let html = await res.text();
  // Hashed asset names change between builds; they are not part of the rendered content.
  html = html.replace(/\/assets\/[A-Za-z0-9_.-]+-[A-Za-z0-9_-]{8}\.(js|css|jpg|png|webp|woff2)/g, "/assets/HASHED.$1");
  writeFileSync(join(out, (p === "/" ? "home" : p.slice(1).replace(/\//g, "__")) + ".html"), `<!-- status ${res.status} -->\n` + html);
  console.log(res.status, p, html.length);
}
