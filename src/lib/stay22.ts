/** Builds the Stay22 map embed address. Parameter names are from Stay22's own documentation (dev.stay22.com/docs/maps/parameters). */
export interface Stay22Options {
  aid: string;
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
  campaign?: string;
}

export function stay22Src(o: Stay22Options): string | null {
  const aid = o.aid.trim();
  if (!aid || !/^[A-Za-z0-9_-]+$/.test(aid)) return null;
  const q = new URLSearchParams({ aid });
  if (typeof o.lat === "number" && typeof o.lng === "number") {
    q.set("lat", String(o.lat));
    q.set("lng", String(o.lng));
  } else if (o.address?.trim()) q.set("address", o.address.trim());
  else return null;
  if (o.zoom) q.set("zoom", String(o.zoom));
  q.set("campaign", (o.campaign ?? "pawsandpassage").replace(/[^A-Za-z0-9_-]/g, "-").slice(0, 60));
  q.set("maincolor", "2f5d50");
  q.set("invmode", "accommodation");
  return `https://www.stay22.com/embed/gm?${q.toString()}`;
}
