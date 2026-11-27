// A world page lists several collections that share ONE picture (the world's). Its rows drop the thumbnail so the same
// image is not repeated down the page; other lists keep it.
import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { CollectionRow } from "@/components/collections/parts";
import type { CollectionStats } from "@/components/collections/stats";
import { collections } from "@/passport/content";
import { renderUi } from "./collections-fixtures";

const stats = { countOf: () => 3, suitedOf: () => null } as unknown as CollectionStats;
const c = collections.find((x) => x.slug === "rainy-day-club")!;
afterEach(cleanup);
const html = async (thumb?: boolean) => {
  const { container } = await renderUi(
    <ul>
      <CollectionRow
        c={c}
        stats={stats}
        dogName={undefined}
        {...(thumb === undefined ? {} : { thumb })}
      />
    </ul>,
  );
  return container.innerHTML;
};

describe("CollectionRow thumbnail", () => {
  it("shows the world picture by default", async () => {
    expect(await html()).toContain("<img");
  });
  it("omits it when thumb is false, keeping title and count", async () => {
    const out = await html(false);
    expect(out).not.toContain("<img");
    expect(out).toContain(c.title);
    expect(out).toContain("3 adventures");
  });
});
