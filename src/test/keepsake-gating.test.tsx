import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, render, screen, waitFor } from "@testing-library/react";
import type { Adventure } from "../passport/schema";
import type { EntitlementState } from "../passport/premium-client";

const ent: { s: EntitlementState } = {
  s: { status: "free", premium: [], signedIn: false, csrf: "", message: null },
};
const listeners = new Set<() => void>();
const setStatus = (status: EntitlementState["status"], message: string | null = null) => {
  ent.s = { ...ent.s, status, message };
  act(() => listeners.forEach((l) => l()));
};

vi.mock("../passport/useEntitlement", async () => {
  const { useSyncExternalStore } = await import("react");
  return {
    useEntitlement: () =>
      useSyncExternalStore(
        (fn) => {
          listeners.add(fn);
          return () => listeners.delete(fn);
        },
        () => ent.s,
        () => ent.s,
      ),
  };
});
vi.mock("../passport/events", () => ({ track: () => true }));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ children, ...p }: { children: unknown }) => (
    <a {...(p as object)}>{children as never}</a>
  ),
}));
vi.mock("../components/shell/AppLink", () => ({
  AppLink: ({ children, to, onClick, className }: Record<string, unknown>) => (
    <a href={to as string} onClick={onClick as never} className={className as string}>
      {children as never}
    </a>
  ),
}));

const editorLoads = vi.fn();
vi.mock("../components/passport/Keepsake", () => {
  editorLoads();
  return {
    Keepsake: () => (
      <div data-testid="editor">
        <input type="file" />
      </div>
    ),
  };
});
const loaderCalls = vi.fn();
vi.mock("../components/passport/keepsake-loader", async () => ({
  loadKeepsakeEditor: () => {
    loaderCalls();
    return import("../components/passport/Keepsake");
  },
  loadMilestoneRenderer: () => Promise.reject(new Error("not used")),
}));

import { KeepsakeGate } from "../components/passport/KeepsakeGate";
import { KeepsakeUnlock } from "../components/passport/KeepsakeUnlock";

const adventure = {
  id: "adv-abc123",
  title: "Toy Champion",
  keepsake: { family: "magazine-cover", theme: "toy-champion", headline: "TOY CHAMPION" },
} as unknown as Adventure;

beforeEach(() => {
  ent.s = { status: "free", premium: [], signedIn: false, csrf: "", message: null };
  loaderCalls.mockClear();
  editorLoads.mockClear();
});
afterEach(cleanup);

describe("keepsake gating", () => {
  it("free visitor: no uploader, no canvas, no editor import call", async () => {
    const { container } = render(<KeepsakeGate adventure={adventure} />);
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.queryByTestId("editor")).toBeNull();
    expect(screen.getByRole("link", { name: /what is included/i })).toBeTruthy();
    await new Promise((r) => setTimeout(r, 20));
    expect(loaderCalls).not.toHaveBeenCalled();
    expect(editorLoads).not.toHaveBeenCalled();
  });

  it("entitled customer gets the editor, loaded after verification", async () => {
    ent.s = { ...ent.s, status: "entitled", signedIn: true };
    render(<KeepsakeGate adventure={adventure} />);
    await waitFor(() => expect(screen.getByTestId("editor")).toBeTruthy());
    expect(loaderCalls).toHaveBeenCalledTimes(1);
  });

  it("checking state loads nothing; transitions free -> entitled -> revoked", async () => {
    setStatus("checking");
    const { container } = render(<KeepsakeGate adventure={adventure} />);
    expect(screen.getByText(/checking your passport/i)).toBeTruthy();
    expect(loaderCalls).not.toHaveBeenCalled();
    setStatus("entitled");
    await waitFor(() => expect(screen.getByTestId("editor")).toBeTruthy());
    // (React.lazy caches the module, so the call count is asserted in the test above.)

    setStatus("revoked", "Access is no longer active.");
    expect(screen.queryByTestId("editor")).toBeNull();
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(screen.getByText(/no longer active/)).toBeTruthy();
  });

  it("offline or revoked sessions never mount the editor", () => {
    setStatus("offline");
    const { container } = render(<KeepsakeGate adventure={adventure} />);
    expect(container.querySelector('input[type="file"]')).toBeNull();
    expect(loaderCalls).not.toHaveBeenCalled();
  });
});

describe("KeepsakeUnlock", () => {
  it.each(["intro-complete", "card"] as const)(
    "%s has a static example and no uploader",
    (where) => {
      const { container } = render(<KeepsakeUnlock where={where} />);
      expect(container.querySelector("input")).toBeNull();
      expect(container.querySelector("canvas")).toBeNull();
      expect(container.querySelector("img")).toBeTruthy();
      expect(container.textContent).toMatch(/full Passport/);
      expect(container.querySelector('a[href="/unlock"]')).toBeTruthy();
    },
  );
});
