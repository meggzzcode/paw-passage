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
    expect(Object.keys(HTML_SECURITY_HEADERS)).toHaveLength(2);
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
