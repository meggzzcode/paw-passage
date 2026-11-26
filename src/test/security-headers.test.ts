import { describe, it, expect } from "vitest";
import { withHtmlSecurityHeaders, HTML_SECURITY_HEADERS } from "@/lib/security-headers";
import { isNotFoundLane } from "@/routes/__root";
import { readFileSync } from "node:fs";

describe("HTML security headers", () => {
  it("adds Referrer-Policy and Permissions-Policy to HTML, never X-Frame-Options", () => {
    const r = withHtmlSecurityHeaders(
      new Response("<p>x</p>", { headers: { "content-type": "text/html; charset=utf-8" } }),
    );
    expect(r.headers.get("referrer-policy")).toBe("strict-origin-when-cross-origin");
    expect(r.headers.get("permissions-policy")).toBe(
      "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
    );
    expect(r.headers.get("x-frame-options")).toBeNull();
    expect(r.headers.get("x-content-type-options")).toBe("nosniff");
    expect(Object.keys(HTML_SECURITY_HEADERS).sort()).toEqual([
      "Content-Security-Policy-Report-Only",
      "Permissions-Policy",
      "Referrer-Policy",
      "X-Content-Type-Options",
    ]);
    expect(r.headers.get("content-security-policy")).toBeNull();
  });
  it("leaves non-HTML responses alone and works on immutable headers", () => {
    expect(
      withHtmlSecurityHeaders(
        new Response("{}", { headers: { "content-type": "application/json" } }),
      ).headers.get("referrer-policy"),
    ).toBeNull();
    const redirect = Response.redirect("https://example.com/", 302);
    expect(() => withHtmlSecurityHeaders(redirect)).not.toThrow();
  });
  it("start.ts registers the middleware", () => {
    expect(readFileSync("src/start.ts", "utf8")).toContain("securityHeadersMiddleware");
  });
});

describe("404 head", () => {
  it("detects a not-found lane", () => {
    expect(isNotFoundLane([{ status: "success" }, { _notFound: {} }])).toBe(true);
    expect(isNotFoundLane([{ status: "notFound" }])).toBe(true);
    expect(isNotFoundLane([{ status: "success" }])).toBe(false);
    expect(isNotFoundLane(undefined)).toBe(false);
  });
});

describe("non-production hosts are asked to stay out of search results", () => {
  const SITE = "https://www.pawsandpassage.com";
  it("flags previews and localhost, never the production hosts", async () => {
    const { isNonProductionHost } = await import("@/lib/security-headers");
    for (const h of [
      "deploy-preview-4--x.netlify.app",
      "main--x.netlify.app",
      "x.lovable.app",
      "localhost:3000",
    ])
      expect(isNonProductionHost(h, SITE), h).toBe(true);
    for (const h of ["www.pawsandpassage.com", "pawsandpassage.com", "WWW.PawsAndPassage.com:443"])
      expect(isNonProductionHost(h, SITE), h).toBe(false);
    expect(isNonProductionHost("x.netlify.app", "")).toBe(false);
  });
  it("adds X-Robots-Tag to HTML only, only when asked", () => {
    const html = () => new Response("<p>x</p>", { headers: { "content-type": "text/html" } });
    expect(withHtmlSecurityHeaders(html(), true).headers.get("x-robots-tag")).toBe(
      "noindex, nofollow",
    );
    expect(withHtmlSecurityHeaders(html(), false).headers.get("x-robots-tag")).toBeNull();
    const json = new Response("{}", { headers: { "content-type": "application/json" } });
    expect(withHtmlSecurityHeaders(json, true).headers.get("x-robots-tag")).toBeNull();
  });
});
