import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";

describe("keyboard access", () => {
  it("the page starts with a skip link to the main content, and main can receive focus", () => {
    const root = readFileSync("src/routes/__root.tsx", "utf8");
    expect(root).toMatch(/href="#main"[^>]*className="skip-link"/);
    expect(root.indexOf('className="skip-link"')).toBeLessThan(root.indexOf("<SiteHeader"));
    expect(root).toMatch(/<main id="main" tabIndex=\{-1\}>/);
  });
  it("there is a visible 3px focus ring and a skip-link style", () => {
    const css = readFileSync("src/styles.css", "utf8");
    expect(css).toMatch(/:focus-visible\s*\{[^}]*outline:\s*3px/);
    expect(css).toMatch(/\.skip-link:focus/);
  });
});
