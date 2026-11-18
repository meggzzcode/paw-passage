// Experiment proxy for LCP investigations: rewrites the home page HTML per VARIANT, brotli-compresses text (like a CDN),
// and passes everything else through. Real network, so CDP throttling applies to every byte.
// Usage: node scripts/perf/variant-proxy.mjs <listenPort> <targetPort> <variant>
// Set H2_KEY and H2_CERT (PEM paths) to serve HTTP/2 over TLS (closer to Netlify than the HTTP/1.1 node server: with HTTP/1.1, requests queue behind the
// browser's 6-connection limit, which exaggerates the cost of late-discovered images). Use https://localhost:<port> and ignoreHTTPSErrors.
// Variants (combine with +, e.g. hero800+no-ga). "new" = current build untouched. Every other variant first reverts the home hero to the markup before the 2026-11-18 LCP fix
// ("legacy": plain <img srcset> with React's auto preload, tile re-using the 1600 px file) and then applies its change: legacy | no-preload | naive (no preload, no fetchpriority) | lazy | hero800 (800 px file + preload) | hero800-nopreload | inline-css | no-ga | no-js | no-tiles (drops the lazy below-the-fold card images to show their bandwidth contention)
import http from "node:http";
import http2 from "node:http2";
import fs from "node:fs";
import zlib from "node:zlib";

const [listen = "4182", target = "4180", variant = "new"] = process.argv.slice(2);
const V = new Set(variant.split("+"));
const has = (...n) => n.some((x) => V.has(x));
const TEXT = /^(text\/|application\/(javascript|json|xml|ld\+json)|image\/svg)/;

const get = (path) =>
  new Promise((res, rej) =>
    http
      .get({ host: "127.0.0.1", port: Number(target), path }, (r) => {
        const c = [];
        r.on("data", (d) => c.push(d));
        r.on("end", () => res(Buffer.concat(c).toString()));
      })
      .on("error", rej),
  );

async function rewrite(html) {
  const big = html.match(/\/assets\/hero-porch-(?!800|mobile)[\w-]+\.jpg/)?.[0];
  const small0 = html.match(/\/assets\/hero-porch-800-[\w-]+\.jpg/)?.[0];
  html = html.replace(/<picture><source[^>]*\/>(<img[^>]*\/>)<\/picture>/, "$1");
  html = html.replace(/<link rel="preload" as="image"[^>]*\/>/g, "");
  html = html.replace(
    '<link rel="stylesheet"',
    `<link rel="preload" as="image" imageSrcSet="${small0} 800w, ${big} 1600w" imageSizes="100vw" fetchPriority="high"/><link rel="stylesheet"`,
  );
  html = html.replace(
    `<img src="${small0}" alt="" loading="lazy"`,
    `<img src="${big}" alt="" loading="lazy"`,
  );
  const heroSmall = html.match(/\/assets\/hero-porch-800-[\w-]+\.jpg/)?.[0];
  if (has("no-preload", "naive", "hero800-nopreload"))
    html = html.replace(/<link rel="preload" as="image"[^>]*\/>/, "");
  if (has("naive"))
    html = html.replace(/(<img src="\/assets\/hero-porch-[^>]*?) fetchPriority="high"/, "$1");
  if (has("lazy"))
    html = html.replace(
      /(<img src="\/assets\/hero-porch-[^>]*?) fetchPriority="high"/,
      '$1 loading="lazy"',
    );
  if (has("hero800", "hero800-nopreload")) {
    html = html
      .replace(/(<img src=")\/assets\/hero-porch-[\w-]+\.jpg(" srcSet=")[^"]*"/, `$1${heroSmall}"`)
      .replace(/(<img src="[^"]*hero-porch-800[^>]*?) sizes="100vw"/, "$1");
    if (has("hero800"))
      html = html.replace(
        /(<link rel="preload" as="image")[^>]*\/>/,
        `$1 href="${heroSmall}" fetchPriority="high"/>`,
      );
  }
  if (has("inline-css")) {
    const m = html.match(/<link rel="stylesheet" href="([^"]+)"[^>]*\/>/);
    if (m) html = html.replace(m[0], `<style>${await get(m[1])}</style>`);
  }
  if (has("no-ga", "no-js"))
    html = html
      .replace(/<script src="https:\/\/www\.googletagmanager[^>]*><\/script>/, "")
      .replace(/<script>window\.dataLayer[^<]*<\/script>/, "");
  if (has("no-js"))
    html = html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, (s) => (s.includes("ld+json") ? s : ""))
      .replace(/<link rel="modulepreload"[^>]*\/>/g, "");
  if (has("no-tiles"))
    html = html.replace(
      /<img src="[^"]*"( alt="[^"]*")? loading="lazy"/g,
      '<img src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==" loading="lazy"',
    );
  return html;
}

const server = process.env.H2_KEY
  ? (h) =>
      http2.createSecureServer(
        {
          key: fs.readFileSync(process.env.H2_KEY),
          cert: fs.readFileSync(process.env.H2_CERT),
          allowHTTP1: true,
        },
        h,
      )
  : (h) => http.createServer(h);
server((req, res) => {
  const up = http.request(
    {
      host: "127.0.0.1",
      port: Number(target),
      path: req.url,
      method: req.method,
      headers: Object.fromEntries(
        Object.entries({ ...req.headers, "accept-encoding": "identity" }).filter(
          ([k]) => !k.startsWith(":") && k !== "connection",
        ),
      ),
    },
    async (r) => {
      const type = String(r.headers["content-type"] ?? "");
      const headers = { ...r.headers };
      delete headers.connection;
      delete headers["keep-alive"];
      delete headers["transfer-encoding"];
      const br = TEXT.test(type) && String(req.headers["accept-encoding"] ?? "").includes("br");
      const isHome = req.url === "/" || req.url.startsWith("/?");
      let body = r;
      if (isHome && type.includes("html") && !has("new")) {
        const c = [];
        for await (const d of r) c.push(d);
        const out = Buffer.from(await rewrite(Buffer.concat(c).toString()));
        delete headers["content-length"];
        body = (await import("node:stream")).Readable.from([out]);
      }
      if (br) {
        delete headers["content-length"];
        headers["content-encoding"] = "br";
        headers.vary = "Accept-Encoding";
        res.writeHead(r.statusCode ?? 200, headers);
        body
          .pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } }))
          .pipe(res);
      } else {
        res.writeHead(r.statusCode ?? 200, headers);
        body.pipe(res);
      }
    },
  );
  up.on("error", () => {
    res.writeHead(502);
    res.end();
  });
  req.pipe(up);
}).listen(Number(listen), () => console.log(`variant ${variant} :${listen} -> :${target}`));
