// Turns a filled-in affiliate worksheet (CSV) into entries for content/affiliates.yml, with plain-English checks.
// Pure functions (no file access) so they can be tested.
import { stringify } from "yaml";

export interface AffLink {
  id: string;
  network: string;
  url: string;
  approved: boolean;
  kind: "stay" | "product";
  notes?: string;
}

/** Minimal CSV reader: quoted fields, commas and line breaks inside quotes, "" for a quote. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let q = false;
  const t = text.replace(/^﻿/, "");
  for (let i = 0; i < t.length; i++) {
    const c = t[i]!;
    if (q) {
      if (c === '"') {
        if (t[i + 1] === '"') { cell += '"'; i++; } else q = false;
      } else cell += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && t[i + 1] === "\n") i++;
      row.push(cell); cell = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else cell += c;
  }
  row.push(cell);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  return rows;
}

export function toCsv(rows: string[][]): string {
  const esc = (v: string) => (/[",\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  return rows.map((r) => r.map(esc).join(",")).join("\n") + "\n";
}

/** Rows with a web address filled in become links; rows left blank are ignored. */
export function rowsToLinks(rows: string[][]): { links: AffLink[]; errors: string[] } {
  const [head, ...body] = rows;
  const errors: string[] = [];
  if (!head) return { links: [], errors: ["The file is empty."] };
  const col = (name: string) => head.map((h) => h.trim().toLowerCase()).indexOf(name);
  const need = ["link_id", "network", "affiliate_url", "approved"];
  for (const n of need) if (col(n) < 0) errors.push(`The sheet needs a column called "${n}".`);
  if (errors.length) return { links: [], errors };
  const links: AffLink[] = [];
  const seen = new Set<string>();
  body.forEach((r, i) => {
    const get = (n: string) => (r[col(n)] ?? "").trim();
    const line = i + 2;
    const url = get("affiliate_url");
    if (!url) return;
    const id = get("link_id");
    if (!/^[a-z0-9-]+$/.test(id)) errors.push(`Row ${line}: the link id "${id}" must use only lowercase letters, numbers and hyphens.`);
    if (seen.has(id)) errors.push(`Row ${line}: the link id "${id}" appears twice.`);
    seen.add(id);
    if (!/^https:\/\/\S+$/.test(url)) errors.push(`Row ${line}: the affiliate address must start with https:// and have no spaces.`);
    if (!get("network")) errors.push(`Row ${line}: say which company the link is for (the "network" column).`);
    const approvedText = get("approved").toLowerCase();
    if (approvedText && !/^(true|yes|y|1|false|no|n|0)$/.test(approvedText)) errors.push(`Row ${line}: "approved" must be yes or no.`);
    const kindCol = col("kind");
    const kind = kindCol >= 0 && get("kind") === "stay" ? "stay" : "product";
    const notes = col("notes") >= 0 ? get("notes") : "";
    links.push({ id, network: get("network"), url, approved: /^(true|yes|y|1)$/.test(approvedText), kind, ...(notes ? { notes } : {}) });
  });
  return { links, errors };
}

/** New links replace existing ones with the same id; other existing links are kept. */
export function mergeLinks(existing: AffLink[], incoming: AffLink[]): AffLink[] {
  const byId = new Map(existing.map((l) => [l.id, l]));
  for (const l of incoming) byId.set(l.id, { ...(byId.get(l.id) ?? {}), ...l });
  return [...byId.values()];
}

export function renderAffiliatesYaml(links: AffLink[]): string {
  const head = `# Affiliate and booking links. Edit in Pages CMS ("Affiliate links").\n# A "Buy" or "Book" button appears on the site ONLY when a link here is switched to Approved.\n`;
  return head + (links.length ? stringify({ links }, { lineWidth: 0 }) : "links: []\n");
}
