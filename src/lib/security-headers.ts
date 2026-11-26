import { createMiddleware } from "@tanstack/react-start";
import { site } from "@/config/site";

/**
 * Response headers for every HTML page. netlify.toml [[headers]] only reaches static files; pages are rendered by the
 * server function, so these are set here (request middleware runs in dev and in production).
 *
 * Frame policy (deliberate): X-Frame-Options and CSP frame-ancestors are NOT sent. The Lovable editor previews the site
 * inside an iframe, and DENY/SAMEORIGIN would blank that pane. Revisit (frame-ancestors 'self' plus the Lovable origins)
 * once the site no longer needs embedding. HSTS is not sent by the app; Netlify serves HSTS on its own HTTPS domains
 * (confirm on the deployed domain, docs/NETLIFY-PREVIEW.md section 9).
 *
 * Content-Security-Policy is REPORT-ONLY on purpose: the root document has inline scripts and styles that an enforced policy
 * would block without a hash or nonce. Violations show in the browser console only (no reporting endpoint). Enforcing it
 * is a Cowork follow-up: review the console on the deploy preview, then move to hashes/nonces and drop 'unsafe-inline'.
 */
export const CSP_REPORT_ONLY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://gumroad.com https://assets.gumroad.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com data:",
  "img-src 'self' data: blob: https:",
  "connect-src 'self' https://www.google-analytics.com https://*.google-analytics.com https://www.googletagmanager.com",
  "frame-src 'self' https://gumroad.com https://*.gumroad.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://gumroad.com https://*.gumroad.com",
].join("; ");

export const HTML_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "Content-Security-Policy-Report-Only": CSP_REPORT_ONLY,
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

/**
 * True when the request host is not the production site (a Netlify deploy preview or branch deploy, a Lovable preview,
 * localhost). The production hosts are the host of siteUrl and its apex (www and bare). With no siteUrl nothing is flagged.
 * Netlify itself adds X-Robots-Tag to deploy previews and older branch deploys but NOT to the latest branch deploy, and its
 * docs do not say whether it reaches server-rendered pages, so the app adds it too. noindex is a request to search engines,
 * not access control: anyone with the URL can still open the page.
 */
export function isNonProductionHost(host: string | null | undefined, siteUrl: string): boolean {
  if (!siteUrl || !host) return false;
  let prod: string;
  try {
    prod = new URL(siteUrl).hostname.toLowerCase();
  } catch {
    return false;
  }
  const h = host.toLowerCase().replace(/:\d+$/, "");
  const apex = prod.replace(/^www\./, "");
  return h !== prod && h !== apex && h !== `www.${apex}`;
}

/** Adds the headers to an HTML response; other content types are left alone. Returns the response to send. */
export function withHtmlSecurityHeaders(response: Response, nonProduction = false): Response {
  if (!(response.headers.get("content-type") ?? "").toLowerCase().includes("text/html"))
    return response;
  const all: Record<string, string> = nonProduction
    ? { ...HTML_SECURITY_HEADERS, "X-Robots-Tag": "noindex, nofollow" }
    : HTML_SECURITY_HEADERS;
  try {
    for (const [k, v] of Object.entries(all)) response.headers.set(k, v);
    return response;
  } catch {
    // Immutable headers: copy the response with the extra headers.
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(all)) headers.set(k, v);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
}

export const securityHeadersMiddleware = createMiddleware().server(async ({ next, request }) => {
  const result = await next();
  const response = (result as { response?: Response }).response;
  if (response instanceof Response) {
    const updated = withHtmlSecurityHeaders(
      response,
      isNonProductionHost(request.headers.get("host") ?? new URL(request.url).host, site.siteUrl),
    );
    if (updated !== response) return { ...result, response: updated } as typeof result;
  }
  return result;
});
