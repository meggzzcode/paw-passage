import { describe, expect, it } from "vitest";
import { trailingSlashRedirect } from "@/lib/trailing-slash";

describe("trailingSlashRedirect", () => {
  it("redirects slash URLs and keeps the query string", () => {
    expect(trailingSlashRedirect(new URL("https://x.test/guides/"))).toBe("/guides");
    expect(trailingSlashRedirect(new URL("https://x.test/stays/?q=a"))).toBe("/stays?q=a");
  });
  it("leaves the root, slashless paths and non-GET requests alone", () => {
    expect(trailingSlashRedirect(new URL("https://x.test/"))).toBeNull();
    expect(trailingSlashRedirect(new URL("https://x.test/guides"))).toBeNull();
    expect(trailingSlashRedirect(new URL("https://x.test/guides/"), "POST")).toBeNull();
  });
});
