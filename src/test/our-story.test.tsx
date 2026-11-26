import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { A1, A2, A3, renderUi } from "./collections-fixtures";
import { StoryTimeline } from "@/components/passport/StoryTimeline";
import {
  _resetForTests,
  completeAdventure,
  getSave,
  newCollection,
  setMemory,
} from "@/passport/local-store";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
const entStatus = vi.hoisted(() => ({ v: "entitled" as "entitled" | "free" }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: entStatus.v,
    premium: [],
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));
vi.mock("@/components/passport/Keepsake", () => ({
  Keepsake: ({ adventure, memory }: { adventure: { title: string }; memory: string }) => (
    <div data-testid="keepsake">{`${adventure.title}|${memory}`}</div>
  ),
}));

beforeEach(() => {
  entStatus.v = "entitled";
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

describe("Our Story", () => {
  it("starts with a friendly empty state", async () => {
    await renderUi(<StoryTimeline />);
    expect(screen.getByText(/Your story starts with the first one/)).toBeInTheDocument();
  });

  it("counts each completed adventure once, even when collections overlap", async () => {
    newCollection({ id: "col-abcd1234", kind: "handpicked", name: "Dupes", ids: [A1.id, A2.id] });
    act(() => {
      completeAdventure(A1.id, 1000);
      completeAdventure(A1.id, 2000); // double tap
      completeAdventure(A2.id, 3000);
    });
    await renderUi(<StoryTimeline />);
    expect(screen.getByText(/^2 adventures completed/)).toBeInTheDocument();
    const titles = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    expect(titles).toEqual([A2.title, A1.title]); // newest first
  });

  it("edits and deletes a memory", async () => {
    act(() => {
      completeAdventure(A3.id, 1000);
      setMemory(A3.id, "Found a stick");
    });
    await renderUi(<StoryTimeline />);
    expect(screen.getByText("Found a stick")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Edit memory/ }));
    fireEvent.change(screen.getByLabelText(A3.memoryPrompt), {
      target: { value: "Found two sticks" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Save memory" }));
    expect(getSave().memories[A3.id]?.text).toBe("Found two sticks");
    fireEvent.click(screen.getByRole("button", { name: /Delete memory/ }));
    expect(getSave().memories[A3.id]).toBeUndefined();
    expect(screen.getByText(/No memory written/)).toBeInTheDocument();
  });

  it("creates a keepsake for a completed adventure with its memory, storing no photo", async () => {
    act(() => {
      completeAdventure(A2.id, 1000);
      setMemory(A2.id, "Cozy");
    });
    await renderUi(<StoryTimeline />);
    const li = screen.getByRole("heading", { name: A2.title }).closest("li")!;
    fireEvent.click(within(li).getByRole("button", { name: /Create a keepsake/ }));
    expect(await screen.findByTestId("keepsake")).toHaveTextContent(`${A2.title}|Cozy`);
    expect(JSON.stringify(getSave())).not.toMatch(/data:image|blob:/);
    expect(screen.getByText(/No photos are saved anywhere/)).toBeInTheDocument();
  });

  it("shows a free visitor the keepsake style, not the editor", async () => {
    entStatus.v = "free";
    act(() => {
      completeAdventure(A2.id, 1000);
    });
    await renderUi(<StoryTimeline />);
    const li = screen.getByRole("heading", { name: A2.title }).closest("li")!;
    fireEvent.click(within(li).getByRole("button", { name: /See the keepsake style/ }));
    expect(screen.queryByTestId("keepsake")).toBeNull();
    expect(li.querySelector('input[type="file"]')).toBeNull();
    expect(within(li).getByRole("link", { name: /what is included/i })).toBeInTheDocument();
  });
});
