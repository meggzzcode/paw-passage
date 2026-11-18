// Lab performance measurement with Playwright + Chromium: mobile emulation, 4x CPU slowdown, Slow 4G.
// Usage: NODE_PATH=$(npm root -g) node scripts/perf/measure.cjs <baseUrl> [runs=3] [label]
// Prints a JSON array (median of N runs per page). Lighthouse is not used (not installed).
const { chromium, devices } = require("playwright");

const base = process.argv[2] || "http://localhost:4180";
const runs = Number(process.argv[3] || 3);
const pages = [
  ["home", "/"],
  ["guide (markdown)", "/guides/vacation-rentals-with-no-pet-fee"],
  ["guide (code file)", "/guides/dog-car-safety-harness-and-crate-guide"],
  ["stays", "/stays"],
  ["gear", "/gear"],
];
// Slow 4G as used by Lighthouse/DevTools: 1.6 Mbps down, 750 Kbps up, 150 ms RTT (DevTools "Slow 4G" preset).
const NET = {
  offline: false,
  latency: 150,
  downloadThroughput: (1.6 * 1024 * 1024) / 8,
  uploadThroughput: (750 * 1024) / 8,
};

const median = (a) => {
  const s = [...a].sort((x, y) => x - y);
  return s[Math.floor(s.length / 2)];
};

async function once(browser, url) {
  const ctx = await browser.newContext({ ...devices["Pixel 5"], serviceWorkers: "block" });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.emulateNetworkConditions", NET);
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  const res = [];
  cdp.on("Network.loadingFinished", (e) => res.push(e));
  const meta = new Map();
  cdp.on("Network.responseReceived", (e) =>
    meta.set(e.requestId, { url: e.response.url, type: e.type, mime: e.response.mimeType }),
  );
  await page.addInitScript(() => {
    window.__m = { lcp: 0, cls: 0, fcp: 0 };
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) window.__m.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries()) if (!e.hadRecentInput) window.__m.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
    new PerformanceObserver((l) => {
      for (const e of l.getEntries())
        if (e.name === "first-contentful-paint") window.__m.fcp = e.startTime;
    }).observe({ type: "paint", buffered: true });
  });
  await page.goto(url, { waitUntil: "load", timeout: 120000 });
  await page.waitForTimeout(2500);
  const m = await page.evaluate(() => window.__m);
  const nav = await page.evaluate(() => {
    const n = performance.navigation;
    const t = performance.getEntriesByType("navigation")[0];
    return { ttfb: t.responseStart, dcl: t.domContentLoadedEventEnd, load: t.loadEventEnd };
  });
  let total = 0,
    js = 0,
    jsDecoded = 0,
    css = 0,
    font = 0,
    img = 0,
    thirdParty = 0,
    nreq = 0;
  const host = new URL(url).host;
  const rows = res
    .map((e) => ({ ...meta.get(e.requestId), size: e.encodedDataLength }))
    .filter((r) => r.url);
  for (const r of rows) {
    nreq++;
    total += r.size;
    if (/javascript/.test(r.mime)) js += r.size;
    if (r.type === "Stylesheet") css += r.size;
    if (r.type === "Font") font += r.size;
    if (r.type === "Image") img += r.size;
    if (new URL(r.url).host !== host) thirdParty += r.size;
  }
  const resEntries = await page.evaluate(() =>
    performance
      .getEntriesByType("resource")
      .filter((r) => /\.js(\?|$)/.test(r.name))
      .reduce((s, r) => s + (r.decodedBodySize || 0), 0),
  );
  await ctx.close();
  return {
    fcp: m.fcp,
    lcp: m.lcp,
    cls: m.cls,
    ttfb: nav.ttfb,
    total,
    js,
    jsDecoded: resEntries,
    css,
    font,
    img,
    thirdParty,
    nreq,
  };
}

(async () => {
  const browser = await chromium.launch();
  const out = [];
  for (const [name, path] of pages) {
    const rs = [];
    for (let i = 0; i < runs; i++) rs.push(await once(browser, base + path));
    const row = { page: name, path };
    for (const k of Object.keys(rs[0]))
      row[k] =
        k === "cls"
          ? +median(rs.map((r) => r[k])).toFixed(4)
          : Math.round(median(rs.map((r) => r[k])));
    out.push(row);
  }
  await browser.close();
  console.log(JSON.stringify(out, null, 2));
})();
