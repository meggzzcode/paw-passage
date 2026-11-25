import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { STAMP_LABELS, STAMP_SLUGS, Stamp, StampGrid, StampPreview } from "../passport/art/stamps";

const html = (slug: string, earned: boolean) =>
  render(<Stamp slug={slug} earned={earned} />).container.innerHTML;

describe("passport stamps", () => {
  it("defines the 12 required slugs", () => {
    expect(STAMP_SLUGS).toHaveLength(12);
    expect(new Set(STAMP_SLUGS).size).toBe(12);
  });

  it("renders every slug with an accessible name", () => {
    for (const slug of STAMP_SLUGS) {
      const { container, unmount } = render(<Stamp slug={slug} earned />);
      const svg = container.querySelector("svg")!;
      expect(svg.getAttribute("role")).toBe("img");
      expect(svg.getAttribute("aria-label")).toContain(STAMP_LABELS[slug]);
      unmount();
    }
  });

  it("gives every stamp distinct artwork and a distinct outline", () => {
    const markup = STAMP_SLUGS.map((s) => html(s, true));
    expect(new Set(markup).size).toBe(12);
    const outlines = markup.map((m) => /<path d="([^"]+)" fill="#fbf6ea"/.exec(m)?.[1]);
    expect(outlines.every(Boolean)).toBe(true);
    expect(new Set(outlines).size).toBe(12);
  });

  it("uses at most two ink colours per earned stamp (plus paper)", () => {
    for (const slug of STAMP_SLUGS) {
      const m = html(slug, true);
      const colours = new Set((m.match(/#[0-9a-f]{6}/gi) ?? []).map((c) => c.toLowerCase()));
      colours.delete("#fbf6ea");
      colours.delete("#fffdf7");
      expect(colours.size, slug).toBeLessThanOrEqual(2);
    }
  });

  it("earned has the postmark and a solid edge; unearned is faint, dashed, unmarked", () => {
    for (const slug of STAMP_SLUGS) {
      const earned = html(slug, true);
      const unearned = html(slug, false);
      expect(earned).not.toBe(unearned);
      expect(earned).toContain('data-postmark="true"');
      expect(unearned).not.toContain("data-postmark");
      expect(unearned).toContain("stroke-dasharray");
      expect(earned).toContain("earned");
      expect(unearned).toContain("not yet earned");
    }
  });

  it("honours a custom label and size, and survives an unknown slug", () => {
    const { container } = render(<Stamp slug="mystery" label="Secret" size={64} earned />);
    const svg = container.querySelector("svg")!;
    expect(svg.getAttribute("aria-label")).toBe("Secret stamp, earned");
    expect(svg.getAttribute("width")).toBe("64");
  });

  it("StampGrid and StampPreview list all 12 stamps", () => {
    const { container } = render(<StampGrid earned={["first-adventure"]} />);
    expect(container.querySelectorAll("li")).toHaveLength(12);
    expect(container.querySelectorAll('svg[data-earned="true"]')).toHaveLength(1);
    const p = render(<StampPreview earnedCount={5} />);
    expect(p.container.querySelectorAll('svg[data-earned="true"]')).toHaveLength(5);
    expect(screen.getAllByRole("img").length).toBeGreaterThanOrEqual(24);
  });
});
