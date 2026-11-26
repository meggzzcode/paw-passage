import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

// Guards the handover pack: the documents exist, say the plain things a buyer must be told, and carry no secrets.
const read = (p: string) => readFileSync(p, "utf8");
const transfer = read("docs/OWNERSHIP-TRANSFER.md");
const workflow = read("docs/PREMIUM-CONTENT-WORKFLOW.md");

describe("handover documents", () => {
  it("exist and are linked from OPERATIONS and the README", () => {
    for (const f of ["docs/OWNERSHIP-TRANSFER.md", "docs/PREMIUM-CONTENT-WORKFLOW.md"])
      expect(existsSync(f)).toBe(true);
    for (const f of ["docs/OPERATIONS.md", "README.md"]) {
      expect(read(f)).toContain("PREMIUM-CONTENT-WORKFLOW.md");
      expect(read(f)).toContain("OWNERSHIP-TRANSFER.md");
    }
    expect(read("docs/OPERATIONS.md")).toContain("content/premium");
    expect(read("docs/CONTENT-GUIDE.md")).toContain("content/premium");
  });

  it("says premium text is kept outside the repository, carries no exposure record, and the buyer owns payout and identity", () => {
    for (const t of [transfer, workflow]) expect(t).toMatch(/outside (?:this|the) repository/i);
    expect(transfer).toMatch(/forks and clones/i);
    expect(existsSync(["docs/HISTORICAL", "EXPOSURE.md"].join("-"))).toBe(false);
    expect(workflow).toContain("sanitize-check.mjs");
    expect(transfer).toMatch(/buyer must set up their own Gumroad payout and identity/);
    expect(transfer).toMatch(/not legal advice/i);
    expect(transfer).toMatch(/Trademark clearance for "Paws & Passage" is NOT verified/);
  });

  it("covers every variable and the rotation consequences", () => {
    for (const v of [
      "SESSION_SECRET",
      "PP_DATA_KEY",
      "VAPID_PRIVATE_KEY",
      "NOTIFICATIONS_ENABLED",
      "GUMROAD_PRODUCT_ID",
    ])
      expect(transfer).toContain(v);
    expect(transfer).toMatch(/sealed push subscriptions/);
    expect(transfer).toMatch(/logged out/);
  });

  it("the workflow documents the --dir flow, backup before import, and an Action with a manual write gate", () => {
    expect(workflow).toContain("premium-import.mjs --dir");
    expect(workflow).toContain("PREMIUM_DIR");
    expect(workflow).toContain("premium-export.mjs --dir");
    expect(workflow).toMatch(/workflow_dispatch/);
    expect(workflow).toMatch(/OWNER MUST REVIEW BEFORE ENABLING/);
    expect(workflow).toMatch(/secrets\.NETLIFY_AUTH_TOKEN/);
  });

  it("contains no token-like secrets", () => {
    for (const t of [transfer, workflow])
      expect(t).not.toMatch(/(?:sk|pk|ghp|nfp|gho)_[A-Za-z0-9]{16,}|-----BEGIN/);
  });
});
