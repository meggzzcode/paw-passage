import { describe, expect, it } from "vitest";
import { mergeLinks, parseCsv, renderAffiliatesYaml, rowsToLinks, toCsv } from "../../scripts/lib/affiliate-import";
import { affiliatesSchema } from "../content/schema";
import { parse } from "yaml";

const HEAD = "link_id,brand,product,used_in_articles,maker_page,network,affiliate_url,approved,notes";

describe("affiliate worksheet import", () => {
  it("reads quoted fields, commas and quotes inside cells", () => {
    const rows = parseCsv('a,b\n"x, y","say ""hi"""\n');
    expect(rows).toEqual([["a", "b"], ["x, y", 'say "hi"']]);
    expect(parseCsv(toCsv(rows))).toEqual(rows);
  });
  it("imports only rows that have an address, and respects the approved column", () => {
    const { links, errors } = rowsToLinks(parseCsv(`${HEAD}\nkurgo-heather-hammock,Kurgo,Hammock,,https://k,Amazon Associates,https://amzn.to/abc,yes,\nruffwear-pad,Ruffwear,Pad,,https://r,,,no,\nsleepypod-atom,Sleepypod,Atom,,https://s,Impact,https://example.com/s,no,wait for approval\n`));
    expect(errors).toEqual([]);
    expect(links.map((l) => [l.id, l.approved])).toEqual([["kurgo-heather-hammock", true], ["sleepypod-atom", false]]);
    expect(links[1]!.notes).toBe("wait for approval");
  });
  it("explains each mistake in plain words", () => {
    const { errors } = rowsToLinks(parseCsv(`${HEAD}\nBad ID,K,H,,m,Amazon,https://x.com/1,yes,\nok-id,K,H,,m,,http://x.com/2,maybe,\nok-id,K,H,,m,Amazon,https://x.com/3,no,\n`));
    expect(errors.join("\n")).toMatch(/lowercase letters/);
    expect(errors.join("\n")).toMatch(/must start with https/);
    expect(errors.join("\n")).toMatch(/which company/);
    expect(errors.join("\n")).toMatch(/yes or no/);
    expect(errors.join("\n")).toMatch(/appears twice/);
  });
  it("reports a missing column", () => {
    expect(rowsToLinks(parseCsv("a,b\n1,2\n")).errors.join(" ")).toMatch(/"link_id"/);
  });
  it("merges into existing links without losing the others, and writes a file the site accepts", () => {
    const merged = mergeLinks(
      [{ id: "keep-me", network: "Vrbo", url: "https://v.example/1", approved: true, kind: "stay", notes: "mine" }],
      [{ id: "new-one", network: "Amazon Associates", url: "https://amzn.to/x", approved: false, kind: "product" }],
    );
    expect(merged.map((l) => l.id)).toEqual(["keep-me", "new-one"]);
    const yaml = renderAffiliatesYaml(merged);
    expect(yaml).toContain("Edit in Pages CMS");
    expect(affiliatesSchema.safeParse(parse(yaml)).success).toBe(true);
    expect(renderAffiliatesYaml([])).toContain("links: []");
  });
});
