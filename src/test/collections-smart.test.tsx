import { act, cleanup, fireEvent, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderUi } from "./collections-fixtures";
import { MyCollections } from "@/components/passport/CollectionsMine";
import { CollectionEditor } from "@/components/passport/CollectionEditor";
import { _resetForTests, getSave, newCollection, setProfile } from "@/passport/local-store";
import { listCollections } from "@/passport/progress";

vi.mock("@/passport/content", async () => (await import("./collections-fixtures")).contentMock);
vi.mock("@/passport/useEntitlement", () => ({
  useEntitlement: () => ({
    status: "entitled",
    premium: [],
    signedIn: false,
    csrf: "",
    message: null,
  }),
}));

beforeEach(() => {
  window.localStorage.clear();
  _resetForTests();
});
afterEach(cleanup);

const rowTitles = () =>
  [...document.querySelectorAll(".co-row-title")].map((n) => n.textContent?.trim());

describe("smart collections", () => {
  it("one-tap templates create labelled smart collections with readable filter chips", async () => {
    await renderUi(<MyCollections />);
    for (const name of [
      "Rainy Days",
      "Adventures Under $10",
      "Gentle Golden Days",
      "Our Weekend Bucket List",
      "Five-Minute Adventures",
      "No-Car Adventures",
    ])
      expect(
        screen.getByRole("button", { name: new RegExp(name.replace("$", "\\$")) }),
      ).toBeEnabled();
    fireEvent.click(screen.getByRole("button", { name: /Adventures Under \$10/ }));
    const [c] = listCollections(getSave());
    expect(c).toMatchObject({
      kind: "smart",
      name: "Adventures Under $10",
      filters: { budget: 10 },
    });
    const card = screen.getByRole("heading", { name: "Adventures Under $10" }).closest("li")!;
    expect(within(card).getByText("Smart collection")).toBeInTheDocument();
    expect(within(card).getByLabelText("Saved filters").children.length).toBeGreaterThan(0);
    // the same template cannot be added twice
    expect(screen.getByRole("button", { name: /Adventures Under \$10/ })).toBeDisabled();
  });

  it("uses the dog's name in the first template", async () => {
    act(() => setProfile({ name: "Milo" }));
    await renderUi(<MyCollections />);
    expect(screen.getByRole("button", { name: /Rainy Days with Milo/ })).toBeInTheDocument();
  });

  it("members follow the saved filters and the dog's profile", async () => {
    newCollection({
      id: "col-smart001",
      kind: "smart",
      name: "Indoor",
      filters: { setting: "indoor" },
    });
    await renderUi(<CollectionEditor id="col-smart001" />);
    expect(
      screen.getAllByText(/Progress counts the adventures that match right now/).length,
    ).toBeGreaterThan(0);
    expect(rowTitles().sort()).toEqual(["Blanket Fort Picnic", "Cozy Treasure Hunt"]);

    // the profile changes: Cozy Treasure Hunt is not for senior dogs, so it leaves the collection
    act(() => setProfile({ lifeStage: "senior" }));
    expect(rowTitles()).toEqual(["Blanket Fort Picnic"]);
    expect(screen.getByRole("status")).toHaveTextContent(/^0 of 1 done/);
  });

  it("editing the filters changes the members", async () => {
    newCollection({ id: "col-smart001", kind: "smart", name: "Anything", filters: {} });
    await renderUi(<CollectionEditor id="col-smart001" />);
    expect(rowTitles()).toHaveLength(4);
    fireEvent.change(screen.getByLabelText("Where"), { target: { value: "2" } }); // Outdoors
    fireEvent.click(screen.getByRole("button", { name: "Save filters" }));
    expect(listCollections(getSave())[0]).toMatchObject({ filters: { setting: "outdoor" } });
    expect(rowTitles().sort()).toEqual(["Backyard Safari", "Neighborhood Postcard Walk"]);
  });
});
