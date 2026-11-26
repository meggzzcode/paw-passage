// Campaign attribution (aggregate only). The first landing URL's utm_source / utm_medium / utm_campaign are sanitized and kept
// in sessionStorage for the tab's lifetime, then attached to purchase_cta_clicked and checkout_handoff as aggregate fields.
//
// Attribution is analytics, so it is stored only while analytics is allowed (see src/lib/consent.ts). The landing URL's tags
// are held in memory first and written to sessionStorage the moment the visitor allows analytics; withdrawing deletes them.
//
// Limits (documented in docs/JOURNAL.md): it is per tab session, so a visitor who returns another day or buys on another
// device is not attributed; Gumroad's own checkout is a separate site, so the confirmed purchase is not attributed here;
// ad blockers or declined analytics drop it. It is a directional signal, never proof of a sale. Internal links never carry utm.
import { analyticsAllowed, onConsentApplied } from "@/lib/consent";

const KEY = "pp_campaign";
const MAX = 40;
const FIELDS = ["utm_source", "utm_medium", "utm_campaign"] as const;
export type CampaignFields = Partial<Record<(typeof FIELDS)[number], string>>;

/** Lowercase, a-z 0-9 _ - only, at most 40 characters; empty after cleaning means dropped. */
export function sanitizeCampaignValue(v: unknown): string | undefined {
  if (typeof v !== "string") return undefined;
  const clean = v
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, MAX)
    .replace(/-+$/g, "");
  return clean || undefined;
}

export function parseCampaign(search: string): CampaignFields {
  const out: CampaignFields = {};
  let params: URLSearchParams;
  try {
    params = new URLSearchParams(search);
  } catch {
    return out;
  }
  for (const k of FIELDS) {
    const v = sanitizeCampaignValue(params.get(k));
    if (v) out[k] = v;
  }
  return out;
}

/** Call once on app start: keeps the FIRST campaign seen this session and never overwrites it. */
let pending: CampaignFields = {};
export function captureCampaign(search: string = globalThis.location?.search ?? ""): void {
  const found = parseCampaign(search);
  if (Object.keys(found).length === 0) return;
  if (Object.keys(pending).length === 0) pending = found; // memory only until analytics is allowed
  if (!analyticsAllowed()) return;
  persistCampaign();
}

/** Writes the held tags to sessionStorage; called once analytics is allowed. Keeps the first campaign of the session. */
export function persistCampaign(): void {
  if (Object.keys(pending).length === 0 || !analyticsAllowed()) return;
  const found = pending;
  try {
    if (sessionStorage.getItem(KEY)) return;
    sessionStorage.setItem(KEY, JSON.stringify(found));
  } catch {
    /* storage blocked: attribution is simply skipped */
  }
}

export function campaignFields(): CampaignFields {
  if (!analyticsAllowed()) return {};
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return {};
    const o = JSON.parse(raw) as Record<string, unknown>;
    const out: CampaignFields = {};
    for (const k of FIELDS) {
      const v = sanitizeCampaignValue(o[k]);
      if (v) out[k] = v;
    }
    return out;
  } catch {
    return {};
  }
}

onConsentApplied((allowed) => {
  if (allowed) persistCampaign();
  else {
    pending = {};
    try {
      sessionStorage.removeItem(KEY);
    } catch {
      /* blocked */
    }
  }
});

// Capture on first load in the browser (this module is imported by the analytics tracker, which loads with the app shell).
if (typeof window !== "undefined") captureCampaign();
