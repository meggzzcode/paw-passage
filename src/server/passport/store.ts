// Customer records. One record per customer plus a lookup from the purchase hash, both in the customers-<env> store.
// Conflict rule: every write is a compare-and-set on the etag. On a lost race we re-read, re-apply the change on top of
// the fresh record (progress goes through merge() from src/passport/progress.ts) and retry a bounded number of times.
import { emptySave, merge, migrate, type Save } from "../../passport/progress";
import { newCustomerId, stableStringify } from "./crypto";
import type { KV } from "./kv";

export type EntitlementStatus = "active" | "refunded" | "disputed" | "revoked";
export type Entitlement = {
  v: 1;
  purchaseRefHash: string;
  status: EntitlementStatus;
  createdAt: number;
  lastVerifiedAt: number;
  /** AES-GCM sealed license code, needed only to re-verify with the provider. Never returned or logged. */
  codeSealed?: string;
};
export type CustomerRecord = { v: 1; id: string; save: Save; entitlement: Entitlement };

export const MAX_RETRIES = 6;
export class ConflictError extends Error {
  constructor() {
    super("too many write conflicts");
  }
}

const custKey = (id: string) => `customer/${id}`;
const lookupKey = (hash: string) => `purchase/${hash}`;

const sameSave = (a: Save, b: Save) =>
  stableStringify({ ...a, rev: 0 }) === stableStringify({ ...b, rev: 0 });

/** Merge client progress into stored progress. The client can never set the server revision. */
export function mergeProgress(stored: Save, incoming: Save): { save: Save; changed: boolean } {
  const merged = merge(stored, { ...incoming, rev: 0 });
  if (sameSave(merged, stored)) return { save: stored, changed: false };
  return { save: { ...merged, rev: stored.rev + 1 }, changed: true };
}

export class CustomerStore {
  constructor(
    private kv: KV,
    private now: () => number = Date.now,
  ) {}

  async get(id: string): Promise<{ rec: CustomerRecord; etag: string } | null> {
    const r = await this.kv.get(custKey(id));
    if (!r) return null;
    const rec = r.value as CustomerRecord;
    // Older records hold a v1 Save: upgrade on read, so everything downstream (and every write) is v2.
    return { rec: { ...rec, save: migrate(rec.save) ?? emptySave() }, etag: r.etag };
  }

  /** Read-modify-write with bounded retries. `fn` must be pure: it is re-run on the fresh record after a conflict. */
  async mutate(
    id: string,
    fn: (rec: CustomerRecord) => CustomerRecord | null,
  ): Promise<{ rec: CustomerRecord; changed: boolean } | null> {
    for (let i = 0; i < MAX_RETRIES; i++) {
      const cur = await this.get(id);
      if (!cur) return null;
      const next = fn(cur.rec);
      if (!next) return { rec: cur.rec, changed: false };
      const w = await this.kv.update(custKey(id), next, cur.etag);
      if (w.ok) return { rec: next, changed: true };
    }
    throw new ConflictError();
  }

  /**
   * Finds the customer for a purchase or creates one. The same purchase always resolves to the same customer, on any
   * device. Free local progress is merged in, never replaced.
   */
  async activate(
    hash: string,
    codeSealed: string | undefined,
    local: Save | null,
    status: EntitlementStatus,
  ): Promise<{ rec: CustomerRecord; created: boolean }> {
    for (let i = 0; i < MAX_RETRIES; i++) {
      const found = await this.kv.get(lookupKey(hash));
      if (found) {
        const id = (found.value as { cus: string }).cus;
        const out = await this.mutate(id, (rec) => {
          const m = local ? mergeProgress(rec.save, local) : { save: rec.save };
          const ent: Entitlement = { ...rec.entitlement, status, lastVerifiedAt: this.now() };
          if (codeSealed) ent.codeSealed = codeSealed;
          return { ...rec, save: m.save, entitlement: ent };
        });
        if (out) return { rec: out.rec, created: false };
        // Lookup points at a missing record (partial earlier failure): fall through and repair it below.
        await this.kv.delete(lookupKey(hash));
        continue;
      }
      const id = newCustomerId();
      const t = this.now();
      const base = emptySave();
      const save = local ? mergeProgress(base, local).save : base;
      const ent: Entitlement = {
        v: 1,
        purchaseRefHash: hash,
        status,
        createdAt: t,
        lastVerifiedAt: t,
      };
      if (codeSealed) ent.codeSealed = codeSealed;
      const rec: CustomerRecord = { v: 1, id, save, entitlement: ent };
      const made = await this.kv.create(custKey(id), rec);
      if (!made.ok) continue;
      const link = await this.kv.create(lookupKey(hash), { v: 1, cus: id });
      if (link.ok) return { rec, created: true };
      await this.kv.delete(custKey(id)); // lost the race: another request created this customer first
    }
    throw new ConflictError();
  }

  /** Merge a progress write. Repeating the same write changes nothing (same rev, no write). */
  async applyProgress(id: string, incoming: Save) {
    return this.mutate(id, (rec) => {
      const m = mergeProgress(rec.save, incoming);
      return m.changed ? { ...rec, save: m.save } : null;
    });
  }

  /** Changes entitlement only. Progress is never touched or deleted. */
  async setEntitlement(id: string, patch: Partial<Pick<Entitlement, "status" | "lastVerifiedAt">>) {
    return this.mutate(id, (rec) => ({ ...rec, entitlement: { ...rec.entitlement, ...patch } }));
  }

  /** Deletes the customer's progress and the purchase lookup. */
  async remove(id: string): Promise<boolean> {
    const cur = await this.get(id);
    if (!cur) return false;
    await this.kv.delete(lookupKey(cur.rec.entitlement.purchaseRefHash));
    await this.kv.delete(custKey(id));
    return true;
  }
}

/** Premium library layout in the premium-<env> store: `index` -> {ids}, `adventure/<id>` -> one adventure. */
export async function readPremium(kv: KV): Promise<unknown[]> {
  const idx = await kv.get("index");
  const ids = (idx?.value as { ids?: string[] } | undefined)?.ids ?? [];
  const all = await Promise.all(ids.map((id) => kv.get(`adventure/${id}`)));
  return all.filter((x) => x !== null).map((x) => x.value);
}

/** Public, anonymous shape: counts only. No titles, text or ids. */
export type PremiumSummary = { count: number; collections: { slug: string; count: number }[] };

/**
 * Counts PUBLISHED premium adventures from the store's `index` record. The import script writes
 * `items: [{id, status, collections}]` there, so no adventure body is read. An older index with only `ids` falls back
 * to reading each adventure once. Throws when the store cannot be read (the caller maps that to unknown).
 */
export async function premiumSummary(kv: KV): Promise<PremiumSummary> {
  const idx = (await kv.get("index"))?.value as { ids?: unknown; items?: unknown } | undefined;
  let rows: { status?: unknown; collections?: unknown }[] = [];
  if (Array.isArray(idx?.items)) {
    rows = idx.items as typeof rows;
  } else if (Array.isArray(idx?.ids)) {
    const got = await Promise.all(
      (idx.ids as unknown[])
        .filter((id): id is string => typeof id === "string")
        .map((id) => kv.get(`adventure/${id}`)),
    );
    rows = got.filter((x) => x !== null).map((x) => x.value as (typeof rows)[number]);
  }
  const bySlug = new Map<string, number>();
  let count = 0;
  for (const r of rows) {
    if (!r || r.status !== "published") continue;
    count++;
    const slugs = Array.isArray(r.collections) ? r.collections : [];
    for (const s of new Set(slugs.filter((x): x is string => typeof x === "string")))
      bySlug.set(s, (bySlug.get(s) ?? 0) + 1);
  }
  const collections = [...bySlug.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([slug, n]) => ({ slug, count: n }));
  return { count, collections };
}

export async function findCustomerId(kv: KV, hash: string): Promise<string | null> {
  const f = await kv.get(lookupKey(hash));
  return f ? ((f.value as { cus?: string }).cus ?? null) : null;
}
