import { describe, expect, it } from "vitest";
import { existsSync, readFileSync } from "node:fs";

// Guards the handover pack: the documents exist, say the plain things a future owner must be told, and carry no secrets.
const read = (p: string) => readFileSync(p, "utf8");
const transfer = read("docs/TRANSFER-INVENTORY.md");
const workflow = read("docs/PREMIUM-CONTENT-WORKFLOW.md");
const ops = read("docs/OPERATIONS.md");

describe("handover documents", () => {
  it("exist and are linked from OPERATIONS and the README", () => {
    for (const f of ["docs/TRANSFER-INVENTORY.md", "docs/PREMIUM-CONTENT-WORKFLOW.md"])
      expect(existsSync(f)).toBe(true);
    expect(read("docs/OPERATIONS.md")).toContain("PREMIUM-CONTENT-WORKFLOW.md");
    expect(read("README.md")).toContain("PREMIUM-CONTENT-WORKFLOW.md");
    for (const f of ["docs/OPERATIONS.md", "README.md"])
      expect(read(f)).toContain("TRANSFER-INVENTORY.md");
    expect(ops).toContain("content/premium");
    expect(read("docs/CONTENT-GUIDE.md")).toContain("content/premium");
  });

  it("carries no migration plan and no removed hand-over documents", () => {
    for (const f of ["REPO-MIGRATION", "FLIP-HANDOFF", "OWNERSHIP-TRANSFER"])
      expect(existsSync(`docs/${f}.md`)).toBe(false);
    for (const t of [transfer, workflow, ops, read("docs/COWORK-HANDOFF.md")])
      expect(t).not.toMatch(/REPO-MIGRATION|new clean repo|OWNERSHIP-TRANSFER|FLIP-HANDOFF/i);
  });

  it("says premium text is outside the repository, and does not assume a Gumroad login handover", () => {
    expect(workflow).toMatch(/outside (?:this|the) repository/i);
    expect(workflow).toContain("sanitize-check.mjs");
    expect(transfer).toMatch(/consent/i);
    expect(transfer).toMatch(/do not assume a login handover/i);
    expect(transfer).toMatch(/not legal advice/i);
    expect(transfer).toMatch(/Trademark clearance for "Paws & Passage" is NOT verified/);
    expect(transfer).toContain("UNVERIFIED");
  });

  it("covers every variable and the rotation consequences", () => {
    for (const v of [
      "SESSION_SECRET",
      "PP_DATA_KEY",
      "VAPID_",
      "NOTIFICATIONS_ENABLED",
      "GUMROAD_PRODUCT_ID",
    ])
      expect(transfer).toContain(v);
    expect(transfer).toMatch(/signed out once/);
  });

  it("documents the customer-data keys, export, restore and minimum recovery", () => {
    for (const k of ["customer/<cus_id>", "purchase/<hash>", "premium-<env>", "customers-<env>"])
      expect(ops).toContain(k);
    expect(ops).toMatch(/Minimum recovery process/);
    expect(ops).toMatch(/NO customer export script/);
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
    for (const t of [transfer, workflow, ops])
      expect(t).not.toMatch(/(?:sk|pk|ghp|nfp|gho)_[A-Za-z0-9]{16,}|-----BEGIN/);
  });
});
