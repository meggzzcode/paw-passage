import { describe, it, expect } from "vitest";
import { existsSync, readFileSync } from "node:fs";

// The favicon is what Google shows beside the search result. It must be the Paws & Passage paw mark, never the
// Lovable heart that the project template shipped with (that file was 20,373 bytes).
describe("site icons", () => {
  it("has the paw icons and links them from the head", () => {
    for (const f of ["favicon.ico", "icon-192.png", "icon-512.png", "apple-touch-icon.png"])
      expect(existsSync(`public/${f}`), f).toBe(true);
    const root = readFileSync("src/routes/__root.tsx", "utf8");
    expect(root).toContain('href: "/favicon.ico"');
    expect(root).toContain('href: "/icon-192.png"');
    expect(root).toContain('href: "/apple-touch-icon.png"');
  });
  it("is not the template's heart favicon", () => {
    expect(readFileSync("public/favicon.ico").length).not.toBe(20373);
  });
});
