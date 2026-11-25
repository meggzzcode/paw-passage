// Tiny key-value layer over Netlify Blobs. Every record is JSON with an etag so writers can compare-and-set.
// Production uses BlobsKV (strong consistency); tests use MemoryKV, which can inject a conflicting write.
export type Versioned = { value: unknown; etag: string };
export type WriteResult = { ok: boolean; etag?: string };

export interface KV {
  get(key: string): Promise<Versioned | null>;
  /** Creates only if the key does not exist (Blobs onlyIfNew). */
  create(key: string, value: unknown): Promise<WriteResult>;
  /** Replaces only if the stored etag still equals `etag` (Blobs onlyIfMatch). */
  update(key: string, value: unknown, etag: string): Promise<WriteResult>;
  /** Unconditional write (last write wins). Used only for owner-seeded premium content and lookups we own. */
  put(key: string, value: unknown): Promise<void>;
  delete(key: string): Promise<void>;
}

/** The slice of @netlify/blobs Store that BlobsKV needs, so it can be faked and type-checked without the package. */
export interface BlobStoreLike {
  getWithMetadata(
    key: string,
    opts: { type: "json"; consistency?: "strong" | "eventual" },
  ): Promise<{ data: unknown; etag?: string } | null>;
  setJSON(
    key: string,
    value: unknown,
    opts?: { onlyIfNew?: boolean; onlyIfMatch?: string },
  ): Promise<{ modified: boolean; etag?: string }>;
  delete(key: string): Promise<void>;
}

export class BlobsKV implements KV {
  constructor(private store: BlobStoreLike) {}
  async get(key: string): Promise<Versioned | null> {
    const r = await this.store.getWithMetadata(key, { type: "json", consistency: "strong" });
    if (!r || r.data === null || r.data === undefined) return null;
    return { value: r.data, etag: r.etag ?? "" };
  }
  async create(key: string, value: unknown): Promise<WriteResult> {
    const r = await this.store.setJSON(key, value, { onlyIfNew: true });
    return r.etag === undefined ? { ok: r.modified } : { ok: r.modified, etag: r.etag };
  }
  async update(key: string, value: unknown, etag: string): Promise<WriteResult> {
    const r = await this.store.setJSON(key, value, { onlyIfMatch: etag });
    return r.etag === undefined ? { ok: r.modified } : { ok: r.modified, etag: r.etag };
  }
  async put(key: string, value: unknown): Promise<void> {
    await this.store.setJSON(key, value);
  }
  async delete(key: string): Promise<void> {
    await this.store.delete(key);
  }
}

/** In-memory fake with real etag semantics. `beforeUpdate` lets a test land a competing write between read and write. */
export class MemoryKV implements KV {
  private data = new Map<string, { json: string; n: number }>();
  private counter = 0;
  beforeUpdate: ((key: string) => Promise<void> | void) | null = null;
  updateAttempts = 0;

  async get(key: string): Promise<Versioned | null> {
    await Promise.resolve();
    const e = this.data.get(key);
    return e ? { value: JSON.parse(e.json), etag: `e${e.n}` } : null;
  }
  async create(key: string, value: unknown): Promise<WriteResult> {
    await Promise.resolve();
    if (this.data.has(key)) return { ok: false };
    const n = ++this.counter;
    this.data.set(key, { json: JSON.stringify(value), n });
    return { ok: true, etag: `e${n}` };
  }
  async update(key: string, value: unknown, etag: string): Promise<WriteResult> {
    this.updateAttempts++;
    if (this.beforeUpdate) {
      const hook = this.beforeUpdate;
      this.beforeUpdate = null; // one-shot
      await hook(key);
    }
    await Promise.resolve();
    const e = this.data.get(key);
    if (!e || `e${e.n}` !== etag) return { ok: false };
    const n = ++this.counter;
    this.data.set(key, { json: JSON.stringify(value), n });
    return { ok: true, etag: `e${n}` };
  }
  async put(key: string, value: unknown): Promise<void> {
    await Promise.resolve();
    this.data.set(key, { json: JSON.stringify(value), n: ++this.counter });
  }
  async delete(key: string): Promise<void> {
    await Promise.resolve();
    this.data.delete(key);
  }
  keys(): string[] {
    return [...this.data.keys()];
  }
  /** Test helper: everything stored, as one string, to prove no raw secret is persisted. */
  dump(): string {
    return [...this.data.values()].map((e) => e.json).join("\n");
  }
}
