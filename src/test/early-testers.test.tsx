import { afterEach, describe, expect, it } from "vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { readFileSync } from "node:fs";
import { EarlyTesters } from "@/components/site/EarlyTesters";
import { EARLY_TESTERS, type EarlyTester } from "@/config/testimonials";
import { BRAND } from "@/config/brand";

afterEach(cleanup);

const ok: EarlyTester = {
  quote: "Milo loved the sniff walk.",
  name: "A.",
  connection: "friend of the founder",
  approved: true,
};

describe("early tester notes", () => {
  it("ships with no entries, so nothing renders on the site", () => {
    expect(EARLY_TESTERS).toEqual([]);
    const { container } = render(<EarlyTesters framed />);
    expect(container.innerHTML).toBe("");
  });
  it("renders nothing when the list is empty or no entry is approved", () => {
    expect(render(<EarlyTesters entries={[]} />).container.innerHTML).toBe("");
    cleanup();
    const draft = { ...ok, approved: false };
    expect(render(<EarlyTesters entries={[draft]} />).container.innerHTML).toBe("");
  });
  it("shows the heading, a connection disclosure and the note, never 'verified'", () => {
    render(<EarlyTesters entries={[ok, { ...ok, quote: "Draft", approved: false }]} />);
    expect(screen.getByRole("heading", { name: BRAND.testersHeading })).toBeTruthy();
    expect(document.body.textContent).toMatch(/connected to us/);
    expect(document.body.textContent).toContain("A., friend of the founder");
    expect(document.body.textContent).not.toContain("Draft");
    expect(document.body.textContent).not.toMatch(/verified/i);
    expect(screen.queryByRole("img", { name: /stars/ })).toBeNull();
  });
  it("shows stars only when a rating was supplied", () => {
    render(<EarlyTesters entries={[{ ...ok, rating: 4 }]} />);
    expect(screen.getByRole("img", { name: "4 out of 5 stars" })).toBeTruthy();
  });
  it("is mounted on the home page and /unlock, with no placeholder text in the source", () => {
    expect(readFileSync("src/routes/index.tsx", "utf8")).toContain("<EarlyTesters");
    expect(readFileSync("src/routes/unlock.tsx", "utf8")).toContain("<EarlyTesters");
    for (const f of ["src/components/site/EarlyTesters.tsx", "src/config/testimonials.ts"])
      expect(readFileSync(f, "utf8")).not.toMatch(/lorem|placeholder|coming soon|TODO/i);
  });
});
