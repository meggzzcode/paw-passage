// LCP diagnosis for the home page: LCP entry details + request waterfall under a throttling profile.
// Usage: NODE_PATH=$(npm root -g) node scripts/perf/lcp.cjs <baseUrl> <profile: slow4g|fast4g|none> [runs=3] [--waterfall] [--path=/]
// Profiles: slow4g = 1.6 Mbps/150 ms RTT + 4x CPU (as measure.cjs); fast4g = 9 Mbps/1.5 Mbps/150 ms RTT + 4x CPU; none = no throttling.
const { chromium, devices } = require("playwright");
const args = process.argv.slice(2);
const base = args[0], profile = args[1] || "slow4g", runs = Number(args[2] || 3);
const wf = args.includes("--waterfall");
const path = (args.find((a) => a.startsWith("--path=")) || "--path=/").slice(7);
const PROFILES = {
  slow4g: { net: { offline: false, latency: 150, downloadThroughput: (1.6 * 1024 * 1024) / 8, uploadThroughput: (750 * 1024) / 8 }, cpu: 4 },
  fast4g: { net: { offline: false, latency: 150, downloadThroughput: (9 * 1024 * 1024) / 8, uploadThroughput: (1.5 * 1024 * 1024) / 8 }, cpu: 4 },
  none: { net: null, cpu: 1 },
};
const P = PROFILES[profile];
const median = (a) => [...a].sort((x, y) => x - y)[Math.floor(a.length / 2)];

async function once(browser) {
  const ctx = await browser.newContext({ ...devices["Pixel 5"], serviceWorkers: "block" });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  if (P.net) await cdp.send("Network.emulateNetworkConditions", P.net);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: P.cpu });
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  const reqs = new Map();
  cdp.on("Network.requestWillBeSent", (e) => reqs.set(e.requestId, { url: e.request.url, t0: e.timestamp, prio: e.request.initialPriority, init: e.initiator.type }));
  cdp.on("Network.responseReceived", (e) => { const r = reqs.get(e.requestId); if (r) { r.type = e.type; r.tResp = e.timestamp; r.status = e.response.status; } });
  cdp.on("Network.loadingFinished", (e) => { const r = reqs.get(e.requestId); if (r) { r.t1 = e.timestamp; r.size = e.encodedDataLength; } });
  await page.addInitScript(() => {
    window.__m = { fcp: 0 };
    new PerformanceObserver((l) => { for (const e of l.getEntries()) { const t = e.element; window.__m.lcp = { start: e.startTime, load: e.loadTime, render: e.renderTime, size: e.size, url: e.url, el: t ? t.tagName + (t.className && typeof t.className === "string" ? "." + t.className.split(" ").slice(0, 2).join(".") : "") : null, cur: t && t.currentSrc ? t.currentSrc : null }; } }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => { for (const e of l.getEntries()) if (e.name === "first-contentful-paint") window.__m.fcp = e.startTime; }).observe({ type: "paint", buffered: true });
  });
  await page.goto(base + path, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(2500);
  const m = await page.evaluate(() => window.__m);
  const nav = await page.evaluate(() => { const t = performance.getEntriesByType("navigation")[0]; return { ttfb: t.responseStart, dcl: t.domContentLoadedEventEnd, load: t.loadEventEnd }; });
  const t00 = Math.min(...[...reqs.values()].map((r) => r.t0));
  const rows = [...reqs.values()].filter((r) => r.t1).map((r) => ({ url: r.url.replace(base, "").slice(0, 70), type: r.type, prio: r.prio, start: Math.round((r.t0 - t00) * 1000), end: Math.round((r.t1 - t00) * 1000), kb: +(r.size / 1024).toFixed(1) })).sort((a, b) => a.start - b.start);
  await ctx.close();
  return { lcp: m.lcp, fcp: m.fcp, nav, rows };
}
(async () => {
  const browser = await chromium.launch();
  const rs = [];
  for (let i = 0; i < runs; i++) rs.push(await once(browser));
  await browser.close();
  const lcps = rs.map((r) => Math.round(r.lcp.start));
  const mid = rs.find((r) => Math.round(r.lcp.start) === median(lcps));
  console.log(JSON.stringify({ profile, base, lcpRuns: lcps, lcpMedian: median(lcps), fcpMedian: Math.round(median(rs.map((r) => r.fcp))), lcpEntry: mid.lcp, nav: mid.nav, ...(wf ? { waterfall: mid.rows } : {}) }, null, 1));
})();
