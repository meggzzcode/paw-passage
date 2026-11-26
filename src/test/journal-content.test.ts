import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import path from "node:path";

describe("journal content", () => {
  it("passes scripts/validate-journal.mjs", () => {
    const script = path.resolve(__dirname, "../../scripts/validate-journal.mjs");
    let out = "";
    try {
      out = execFileSync(process.execPath, [script], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      });
    } catch (e) {
      const err = e as { stderr?: string; stdout?: string };
      throw new Error(`${err.stderr ?? ""}${err.stdout ?? ""}`);
    }
    expect(out).toContain("journal content OK");
  });
});
