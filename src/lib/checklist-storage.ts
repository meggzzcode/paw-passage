/** Accept only a plain object of booleans; anything else (null, arrays, numbers) is ignored. */
export function parseChecklist(raw: string | null): Record<string, boolean> {
  if (!raw) return {};
  try {
    const v: unknown = JSON.parse(raw);
    if (!v || typeof v !== "object" || Array.isArray(v)) return {};
    const out: Record<string, boolean> = {};
    for (const [k, val] of Object.entries(v)) if (val === true) out[k] = true;
    return out;
  } catch {
    return {};
  }
}
