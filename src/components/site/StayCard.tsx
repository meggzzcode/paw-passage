import { Link } from "@tanstack/react-router";
import type { Stay } from "@/content/stays/types";
import { images } from "@/lib/images";
import { townName } from "@/content/destinations";
import { stayTypeLabels } from "@/lib/filters";
import { describeFee } from "@/lib/stay-format";
import { PreviewBadge } from "./StatusBadge";

export function StayCard({ stay }: { stay: Stay }) {
  const img = images[stay.image];
  const chips: string[] = [];
  if (stay.fencedYard === "full") chips.push("Fully fenced yard");
  else if (stay.fencedYard === "partial") chips.push("Partly fenced");
  if (stay.largeDogsOk) chips.push("Large dogs OK");
  if (stay.maxDogs && stay.maxDogs >= 2) chips.push(`Up to ${stay.maxDogs} dogs`);
  if (stay.beach) chips.push("Beach");
  if (stay.hotTub) chips.push("Hot tub");
  return (
    <Link to="/stays/$slug" params={{ slug: stay.slug }} className="group block overflow-hidden rounded-lg border border-border bg-card shadow-card transition hover:-translate-y-0.5">
      <div className="relative">
        <img src={img.src} alt={stay.status === "sample" ? "Illustrative scene, not the property" : img.alt} loading="lazy" width={1600} height={1008} className="aspect-[4/3] w-full object-cover" />
        <div className="absolute left-3 top-3 flex gap-2">
          {stay.status === "sample" && <PreviewBadge>Sample, preview only</PreviewBadge>}
          {stay.sponsored?.active && <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold">Sponsored</span>}
        </div>
      </div>
      <div className="p-5">
        <p className="eyebrow">{stayTypeLabels[stay.type]} · {townName(stay.town)}</p>
        <h3 className="mt-1.5 font-display text-xl leading-snug group-hover:text-primary">{stay.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{stay.summary}</p>
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {chips.slice(0, 4).map((c) => <li key={c} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{c}</li>)}
        </ul>
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">Pet fee: {describeFee(stay.petFee)}</p>
      </div>
    </Link>
  );
}
