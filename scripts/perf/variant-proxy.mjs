// Experiment proxy for LCP investigations: rewrites the home page HTML per VARIANT, brotli-compresses text (like a CDN),
// and passes everything else through. Real network, so CDP throttling applies to every byte.
// Usage: node scripts/perf/variant-proxy.mjs <listenPort> <targetPort> <variant>
// Variants (combine with +, e.g. hero800+no-ga): baseline | no-preload | naive (no preload, no fetchpriority) | lazy | hero800 (800 px file + preload) | hero800-nopreload | inline-css | no-ga | no-js | no-tiles (drops the lazy below-the-fold card images to show their bandwidth contention)
import http from "node:http";
import zlib from "node:zlib";

const [listen = "4182", target = "4180", variant = "baseline"] = process.argv.slice(2);
const V = new Set(variant.split("+"));
const has = (...n) => n.some((x) => V.has(x));
const TEXT = /^(text\/|application\/(javascript|json|xml|ld\+json)|image\/svg)/;

const get = (path) => new Promise((res, rej) => http.get({ host: "127.0.0.1", port: Number(target), path }, (r) => { const c = []; r.on("data", (d) => c.push(d)); r.on("end", () => res(Buffer.concat(c).toString())); }).on("error", rej));

async function rewrite(html) {
  const heroSmall = html.match(/\/assets\/hero-porch-800-[\w-]+\.jpg/)?.[0];
  if (has("no-preload", "naive", "hero800-nopreload")) html = html.replace(/<link rel="preload" as="image"[^>]*\/>/, "");
  if (has("naive")) html = html.replace(/(<img src="\/assets\/hero-porch-[^>]*?) fetchPriority="high"/, "$1");
  if (has("lazy")) html = html.replace(/(<img src="\/assets\/hero-porch-[^>]*?) fetchPriority="high"/, '$1 loading="lazy"');
  if (has("hero800", "hero800-nopreload")) {
    html = html.replace(/(<img src=")\/assets\/hero-porch-[\w-]+\.jpg(" srcSet=")[^"]*"/, `$1${heroSmall}"`).replace(/(<img src="[^"]*hero-porch-800[^>]*?) sizes="100vw"/, "$1");
    if (has("hero800")) html = html.replace(/(<link rel="preload" as="image")[^>]*\/>/, `$1 href="${heroSmall}" fetchPriority="high"/>`);
  }
  if (has("inline-css")) {
    const m = html.match(/<link rel="stylesheet" href="([^"]+)"[^>]*\/>/);
    if (m) html = html.replace(m[0], `<style>${await get(m[1])}</style>`);
  }
  if (has("no-ga", "no-js")) html = html.replace(/<script src="https:\/\/www\.googletagmanager[^>]*><\/script>/, "").replace(/<script>window\.dataLayer[^<]*<\/script>/, "");
  if (has("no-js")) html = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (s) => (s.includes("ld+json") ? s : "")).replace(/<link rel="modulepreload"[^>]*\/>/g, "");
  if (has("no-tiles")) html = html.replace(/<img src="[^"]*"( alt="[^"]*")? loading="lazy"/g, '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" loading="lazy"');
  return html;
}

http.createServer((req, res) => {
  const up = http.request({ host: "127.0.0.1", port: Number(target), path: req.url, method: req.method, headers: { ...req.headers, "accept-encoding": "identity" } }, async (r) => {
    const type = String(r.headers["content-type"] ?? "");
    const headers = { ...r.headers };
    const br = TEXT.test(type) && String(req.headers["accept-encoding"] ?? "").includes("br");
    const isHome = req.url === "/" || req.url.startsWith("/?");
    let body = r;
    if (isHome && type.includes("html") && !has("baseline")) {
      const c = []; for await (const d of r) c.push(d);
      const out = Buffer.from(await rewrite(Buffer.concat(c).toString()));
      delete headers["content-length"]; body = (await import("node:stream")).Readable.from([out]);
    }
    if (br) { delete headers["content-length"]; headers["content-encoding"] = "br"; headers.vary = "Accept-Encoding"; res.writeHead(r.statusCode ?? 200, headers); body.pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })).pipe(res); }
    else { res.writeHead(r.statusCode ?? 200, headers); body.pipe(res); }
  });
  up.on("error", () => { res.writeHead(502); res.end(); });
  req.pipe(up);
}).listen(Number(listen), () => console.log(`variant ${variant} :${listen} -> :${target}`));
