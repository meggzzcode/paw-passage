// The ONLY place the keepsake editor and its template/theme configuration are imported. Both loaders are dynamic, and
// callers run them only after useEntitlement() reports "entitled", so a free visitor never downloads the editor chunk.
// (The source is in a public repo and can be read; the gate is entitlement plus lazy delivery, see docs/ARCHITECTURE.md.)

export const loadKeepsakeEditor = () => import("./Keepsake");

/** The milestone-card renderer, for the same reason. */
export const loadMilestoneRenderer = () => import("@/passport/keepsake/render");
