import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { Itineraries, MAY_NOT_SUIT } from "@/components/passport/Itineraries";
import { ITINERARIES } from "@/config/itineraries";
import { freeLibrary } from "@/passport/content";
import { _resetForTests, getSave, setProfile } from "@/passport/local-store";
import { listCollections } from "@/passport/progress";
import type { Adventure } from "@/passport/schema";

const library = freeLibrary();
const freeIds = new Set(library.map((a) => a.id));

// Synthetic stand-ins for the private library: the same shape, made-up titles.
const synthetic: Adventure[] = ITINERARIES.flatMap((it) => it.ids)
  .filter((id, n, all) => !freeIds.has(id) && all.indexOf(id) === n)
  .map((id, n) => ({
    ...library[0]!,
    id,
    access: "premium" as const,
    title: `Synthetic Adventure ${n}`,
    lifeStages: ["adult" as const],
  }));

const ent = vi.hoisted(() => ({ status: "free" as "free" | "entitled", premium: [] as unknown[] }));
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: ent.status,
    premium: ent.premium,
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));
vi.mock("@tanstack/react-router", () => ({
  useLocation: () => ({ pathname: "/discover" }),
  Link: ({ children, to }: { children: unknown; to: string }) => (
    <a href={to}>{children as never}</a>
  ),
}));

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
  ent.status = "free";
  ent.premium = [];
});
afterEach(cleanup);

describe("itinerary definitions", () => {
  it("has six itineraries of 3 or 4 unique, well-formed adventure ids", () => {
    expect(ITINERARIES).toHaveLength(6);
    expect(new Set(ITINERARIES.map((i) => i.slug)).size).toBe(6);
    for (const it of ITINERARIES) {
      expect(it.ids.length).toBeGreaterThanOrEqual(3);
      expect(it.ids.length).toBeLessThanOrEqual(4);
      expect(new Set(it.ids).size).toBe(it.ids.length);
      for (const id of it.ids) expect(id).toMatch(/^adv-[a-z0-9]{6}$/);
      expect(it.title.length).toBeLessThanOrEqual(40);
    }
  });

  it("every free id is a published adventure in the public library", () => {
    for (const id of ITINERARIES.flatMap((i) => i.ids).filter((i) => freeIds.has(i))) {
      const a = library.find((x) => x.id === id);
      expect(a?.status).toBe("published");
      expect(a?.access).toBe("free");
    }
  });

  it("teasers never name an adventure", () => {
    const titles = library.map((a) => a.title.toLowerCase());
    for (const it of ITINERARIES)
      for (const t of titles) expect(`${it.title} ${it.teaser}`.toLowerCase()).not.toContain(t);
  });
});

describe("itineraries UI", () => {
  it("free visitors see only title, teaser and a count, never an adventure title", () => {
    const { container } = render(<Itineraries />);
    for (const it of ITINERARIES) {
      const card = screen.getByRole("article", { name: it.title });
      expect(within(card).getByText(it.teaser)).toBeInTheDocument();
      expect(within(card).getByText(new RegExp(`${it.ids.length} adventures`))).toBeInTheDocument();
      expect(within(card).queryByRole("button")).toBeNull();
    }
    for (const a of library) expect(container.textContent).not.toContain(a.title);
    expect(container.innerHTML).not.toMatch(/adv-[a-z0-9]{6}/);
  });

  it("entitled: view, save as a collection once, and plan an adventure that suits", () => {
    ent.status = "entitled";
    ent.premium = synthetic;
    render(<Itineraries />);
    const it = ITINERARIES[0]!;
    const card = screen.getByRole("article", { name: it.title });
    fireEvent.click(within(card).getByRole("button", { name: "View the combination" }));
    expect(within(card).getAllByRole("listitem")).toHaveLength(it.ids.length);

    fireEvent.click(within(card).getByRole("button", { name: "Save as a collection" }));
    const mine = listCollections(getSave());
    expect(mine).toHaveLength(1);
    expect(mine[0]).toMatchObject({ kind: "handpicked", name: it.title });
    expect(within(card).getByRole("button", { name: /Saved as a collection/ })).toBeDisabled();
    expect(listCollections(getSave())).toHaveLength(1);

    fireEvent.click(within(card).getAllByRole("button", { name: /^Plan it/ })[0]!);
    expect(within(card).getByRole("button", { name: "Schedule adventure" })).toBeInTheDocument();
  });

  it("entitled: an adventure that does not fit the dog is marked and not offered for planning", () => {
    ent.status = "entitled";
    ent.premium = synthetic; // adult-only stand-ins
    setProfile({ lifeStage: "puppy" });
    render(<Itineraries />);
    const it = ITINERARIES.find((i) => i.ids.some((id) => !freeIds.has(id)))!;
    const card = screen.getByRole("article", { name: it.title });
    fireEvent.click(within(card).getByRole("button", { name: "View the combination" }));
    const notes = within(card).getAllByText(new RegExp(MAY_NOT_SUIT));
    expect(notes.length).toBe(it.ids.filter((id) => !freeIds.has(id)).length);
    expect(within(card).getAllByRole("button", { name: /^Plan it/ }).length).toBe(
      it.ids.length - notes.length,
    );
  });
});
