// Small crypto helpers (Node's built-in crypto only). Secrets are never logged or returned.
import {
  createCipheriv,
  createDecipheriv,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";

export const hmac = (key: string | Buffer, data: string): string =>
  createHmac("sha256", key).update(data).digest("base64url");

export function safeEqual(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  if (x.length !== y.length) return false;
  return timingSafeEqual(x, y);
}

export const newCustomerId = (): string => `cus_${randomBytes(16).toString("hex")}`;
export const CUSTOMER_ID_RE = /^cus_[0-9a-f]{32}$/;

/** Separate sub-keys per purpose, derived from one secret, so a signature key is never reused as an encryption key. */
export const deriveKey = (secret: string, label: string): Buffer =>
  createHmac("sha256", secret).update(`pp:${label}`).digest();

/** Salted HMAC of the provider purchase reference: stable, so the same purchase always maps to the same customer. */
export const purchaseRefHash = (dataKey: string, provider: string, ref: string): string =>
  hmac(deriveKey(dataKey, "purchase-ref"), `${provider}:${ref}`);

/** AES-256-GCM envelope: v1.<iv>.<tag>.<ciphertext>, all base64url. */
export function seal(dataKey: string, plain: string): string {
  const iv = randomBytes(12);
  const c = createCipheriv("aes-256-gcm", deriveKey(dataKey, "code-enc"), iv);
  const ct = Buffer.concat([c.update(plain, "utf8"), c.final()]);
  return [
    "v1",
    iv.toString("base64url"),
    c.getAuthTag().toString("base64url"),
    ct.toString("base64url"),
  ].join(".");
}
export function open(dataKey: string, env: string): string | null {
  try {
    const [v, iv, tag, ct] = env.split(".");
    if (v !== "v1" || !iv || !tag || !ct) return null;
    const d = createDecipheriv(
      "aes-256-gcm",
      deriveKey(dataKey, "code-enc"),
      Buffer.from(iv, "base64url"),
    );
    d.setAuthTag(Buffer.from(tag, "base64url"));
    return Buffer.concat([d.update(Buffer.from(ct, "base64url")), d.final()]).toString("utf8");
  } catch {
    return null;
  }
}

/** JSON with sorted keys, for comparing saves regardless of key order. */
export function stableStringify(v: unknown): string {
  if (Array.isArray(v)) return `[${v.map(stableStringify).join(",")}]`;
  if (v && typeof v === "object")
    return `{${Object.keys(v as object)
      .sort()
      .map((k) => `${JSON.stringify(k)}:${stableStringify((v as Record<string, unknown>)[k])}`)
      .join(",")}}`;
  return JSON.stringify(v) ?? "null";
}
