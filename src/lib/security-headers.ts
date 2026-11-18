import { createMiddleware } from "@tanstack/react-start";

/**
 * Response headers for every HTML page. netlify.toml [[headers]] only reaches static files; pages are rendered by the
 * server function, so these are set here (request middleware runs in dev and in production).
 *
 * X-Frame-Options is deliberately NOT sent: the Lovable editor previews the site inside an iframe and would show a
 * blank pane. Frame protection is a documented decision in docs/SECURITY-AND-RECOVERY.md.
 */
export const HTML_SECURITY_HEADERS: Record<string, string> = {
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
};

/** Adds the headers to an HTML response; other content types are left alone. Returns the response to send. */
export function withHtmlSecurityHeaders(response: Response): Response {
  if (!(response.headers.get("content-type") ?? "").toLowerCase().includes("text/html"))
    return response;
  try {
    for (const [k, v] of Object.entries(HTML_SECURITY_HEADERS)) response.headers.set(k, v);
    return response;
  } catch {
    // Immutable headers: copy the response with the extra headers.
    const headers = new Headers(response.headers);
    for (const [k, v] of Object.entries(HTML_SECURITY_HEADERS)) headers.set(k, v);
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }
}

export const securityHeadersMiddleware = createMiddleware().server(async ({ next }) => {
  const result = await next();
  const response = (result as { response?: Response }).response;
  if (response instanceof Response) {
    const updated = withHtmlSecurityHeaders(response);
    if (updated !== response) return { ...result, response: updated } as typeof result;
  }
  return result;
});
