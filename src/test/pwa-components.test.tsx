// @vitest-environment jsdom
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { readFileSync } from "node:fs";

import { InstallPrompt } from "@/components/site/InstallPrompt";
import { InstallGuide } from "@/components/site/InstallGuide";

import { vi } from "vitest";
vi.mock("@/components/shell/AppLink", () => ({
  AppLink: ({ to, children, ...r }: { to: string; children: React.ReactNode }) => (
    <a href={to} {...r}>
      {children}
    </a>
  ),
}));

function mm(standalone: boolean) {
  window.matchMedia = ((q: string) => ({
    matches: standalone && q.includes("standalone"),
  })) as never;
}

describe("InstallPrompt", () => {
  beforeEach(() => {
    cleanup();
    window.localStorage.clear();
    mm(false);
  });
  it("shows the copy, links to /install without a native prompt, and remembers Not now", () => {
    render(<InstallPrompt where="test" />);
    expect(screen.getByText("Keep your adventures one tap away.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Install" }).getAttribute("href")).toBe("/install");
    fireEvent.click(screen.getByRole("button", { name: "Not now" }));
    expect(screen.queryByText("Keep your adventures one tap away.")).toBeNull();
    cleanup();
    render(<InstallPrompt where="test" />);
    expect(screen.queryByText("Keep your adventures one tap away.")).toBeNull();
  });
  it("is not shown when installed", () => {
    mm(true);
    render(<InstallPrompt where="test" />);
    expect(screen.queryByText("Keep your adventures one tap away.")).toBeNull();
  });
});

describe("install guide", () => {
  it("covers each platform, labels illustrations and points to Restore access", () => {
    mm(false);
    const { container } = render(<InstallGuide />);
    for (const h of ["iPhone and iPad", "Android", "Computer (optional)", "Restore access"])
      expect(screen.getByRole("heading", { name: h })).toBeTruthy();
    expect(container.textContent).toMatch(/Safari/);
    expect(container.textContent).toMatch(/iOS 16\.4/);
    const figs = container.querySelectorAll("figure");
    expect(figs.length).toBeGreaterThanOrEqual(4);
    figs.forEach((f) =>
      expect(f.textContent).toContain("Illustration, your screen may look different."),
    );
    expect(container.querySelectorAll("svg[role=img][aria-label]").length).toBe(figs.length);
    expect(container.textContent).not.toMatch(/screenshot/i);
  });
  it("the two mounts exist and the prompt is not mounted in discovery or checkout", () => {
    expect(readFileSync("src/components/passport/FreeStarter.tsx", "utf8")).toContain(
      "InstallPrompt",
    );
    expect(readFileSync("src/components/passport/AccessForms.tsx", "utf8")).toContain(
      "InstallPrompt",
    );
    expect(readFileSync("src/routes/unlock.tsx", "utf8")).not.toContain("InstallPrompt");
  });
});
