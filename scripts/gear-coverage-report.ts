// Writes docs/PACKING_GEAR_COVERAGE.md: how every active product in content/products.yml is reachable from the packing
// planner and the Gear hub (classes 1 to 4; class 4, unreachable, must be zero).
//   bun scripts/gear-coverage-report.ts           write the file and print the counts
//   bun scripts/gear-coverage-report.ts --check   exit 1 if the file is out of date or any product is unreachable
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { createServer } from "vite";
import { contentPlugin } from "../plugins/content";

const root = resolve(import.meta.dir, "..");
const out = join(root, "docs", "PACKING_GEAR_COVERAGE.md");
const check = process.argv.includes("--check");

// The content (virtual:content) comes from the project's own content plugin, so this reads exactly what the site builds.
const server = await createServer({
  root,
  configFile: false,
  logLevel: "error",
  appType: "custom",
  server: { middlewareMode: true, hmr: false, watch: null },
  plugins: [contentPlugin()],
  resolve: { alias: { "@": join(root, "src") } },
});
try {
  const live = (await server.ssrLoadModule("/src/lib/packing/coverage-live.ts")) as {
    liveCoverage: () => import("../src/lib/packing/coverage").CoverageReport;
    liveCoverageMarkdown: () => string;
  };
  const report = live.liveCoverage();
  const md = live.liveCoverageMarkdown();
  const c = report.counts;
  console.log(
    `Active products: ${report.total}. Class 1 (direct): ${c[1]}. Class 2 (planner category): ${c[2]}. Class 3 (Gear hub only): ${c[3]}. Class 4 (unreachable): ${c[4]}. No link: ${report.noLink.length}.`,
  );
  if (check) {
    const current = existsSync(out) ? readFileSync(out, "utf8") : "";
    if (current !== md) {
      console.error(
        "docs/PACKING_GEAR_COVERAGE.md is out of date. Run: bun scripts/gear-coverage-report.ts",
      );
      process.exitCode = 1;
    }
    if (c[4] > 0 || report.noLink.length > 0) process.exitCode = 1;
  } else {
    writeFileSync(out, md);
    console.log("Wrote docs/PACKING_GEAR_COVERAGE.md");
  }
} finally {
  await server.close();
}
