/**
 * Permanent (301) redirect target for a URL whose path ends in a slash, or null when none is needed.
 * The router's own trailing-slash redirect is a 307 (temporary), which search engines treat as weaker.
 * Only GET/HEAD page paths are redirected; the root, asset paths and file-like paths are left alone.
 */
export function trailingSlashRedirect(url: URL, method = "GET"): string | null {
  if (method !== "GET" && method !== "HEAD") return null;
  const path = url.pathname;
  if (path.length <= 1 || !path.endsWith("/") || path.startsWith("/_serverFn")) return null;
  const clean = path.replace(/\/+$/, "");
  if (!clean || clean.startsWith("//")) return null;
  return clean + url.search;
}
