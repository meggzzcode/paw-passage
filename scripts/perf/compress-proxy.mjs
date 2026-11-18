// Tiny reverse proxy that brotli-compresses text responses, to mimic a CDN such as Netlify (the plain node server sends
// everything uncompressed, which would overstate JS/CSS cost in lab measurements).
// Usage: node scripts/perf/compress-proxy.mjs <listenPort> <targetPort>
import http from "node:http";
import zlib from "node:zlib";

const [listen = "4181", target = "4180"] = process.argv.slice(2);
const TEXT = /^(text\/|application\/(javascript|json|xml|ld\+json)|image\/svg)/;
http
  .createServer((req, res) => {
    const up = http.request({ host: "127.0.0.1", port: Number(target), path: req.url, method: req.method, headers: { ...req.headers, "accept-encoding": "identity" } }, (r) => {
      const type = String(r.headers["content-type"] ?? "");
      const headers = { ...r.headers };
      if (TEXT.test(type) && String(req.headers["accept-encoding"] ?? "").includes("br")) {
        delete headers["content-length"];
        headers["content-encoding"] = "br";
        headers["vary"] = "Accept-Encoding";
        res.writeHead(r.statusCode ?? 200, headers);
        r.pipe(zlib.createBrotliCompress({ params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 5 } })).pipe(res);
      } else {
        res.writeHead(r.statusCode ?? 200, headers);
        r.pipe(res);
      }
    });
    up.on("error", () => { res.writeHead(502); res.end(); });
    req.pipe(up);
  })
  .listen(Number(listen), () => console.log(`compressing proxy :${listen} -> :${target}`));
