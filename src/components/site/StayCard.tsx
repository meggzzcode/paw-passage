import { Link } from "@tanstack/react-router";
import { TreePine, Home, Waves, Sparkles, MapPin, type LucideIcon } from "lucide-react";
import type { Stay } from "@/content/stays/types";
import { stayPhoto } from "@/lib/images";
import { townName } from "@/content/destinations";
import { stayTypeLabels } from "@/lib/filters";
import { describeFee } from "@/lib/stay-format";
import { PreviewBadge } from "./StatusBadge";
import { BookingButton } from "./BookingButton";

export function StayCard({ stay }: { stay: Stay }) {
  // A photo shows only when we hold the owner's permission. Otherwise: a plain panel, never a stock picture of a real property.
  const img = stay.photoPermission && (stay.image || stay.imageUpload) ? stayPhoto(stay) : null;
  const Icon: LucideIcon = ({ cabin: TreePine, "vacation-home": Home, cottage: Home, "beach-house": Waves, unique: Sparkles } as const)[stay.type] ?? MapPin;
  const chips: string[] = [];
  if (stay.fencedYard === "full") chips.push("Fully fenced yard");
  else if (stay.fencedYard === "partial") chips.push("Partly fenced");
  if (stay.largeDogsOk) chips.push("Large dogs OK");
  if (stay.maxDogs && stay.maxDogs >= 2) chips.push(`Up to ${stay.maxDogs} dogs`);
  if (stay.beach) chips.push("Beach");
  if (stay.hotTub) chips.push("Hot tub");
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-card shadow-card transition hover:-translate-y-0.5">
    <Link to="/stays/$slug" params={{ slug: stay.slug }} className="group block">
      <div className="relative">
        {img ? <img src={img.card ?? img.src} alt={img.alt} loading="lazy" decoding="async" width={1600} height={1008} className="aspect-[4/3] w-full object-cover" /> : (
          <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-secondary to-accent/40 text-primary">
            <Icon className="size-10" aria-hidden />
            <p className="text-sm font-medium">{townName(stay.town)}</p>
            <p className="text-xs text-muted-foreground">Photos are on the booking page</p>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          {stay.status === "sample" && <PreviewBadge>Sample, preview only</PreviewBadge>}
          {stay.status === "unverified" && <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold text-terracotta">Not yet verified</span>}
          {stay.sponsored?.active && <span className="rounded-full bg-background/90 px-2.5 py-0.5 text-xs font-semibold">Sponsored</span>}
        </div>
      </div>
      <div className="p-5">
        <p className="eyebrow">{stayTypeLabels[stay.type]} · {townName(stay.town)}</p>
        <h3 className="mt-1.5 font-display text-xl leading-snug group-hover:text-primary">{stay.name}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{stay.summary}</p>
        {(stay.bedrooms || stay.bathrooms || stay.sleeps) && <p className="mt-2 text-xs text-muted-foreground">{[stay.bedrooms ? `${stay.bedrooms} bedroom${stay.bedrooms === 1 ? "" : "s"}` : "", stay.bathrooms ? `${stay.bathrooms} bath${stay.bathrooms === 1 ? "" : "s"}` : "", stay.sleeps ? `sleeps ${stay.sleeps}` : ""].filter(Boolean).join(" · ")}</p>}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {chips.slice(0, 4).map((c) => <li key={c} className="rounded-full bg-secondary px-2.5 py-1 text-xs text-secondary-foreground">{c}</li>)}
        </ul>
        <p className="mt-4 border-t border-border pt-3 text-xs text-muted-foreground">Pet fee: {describeFee(stay.petFee)}</p>
      </div>
    </Link>
      <div className="border-t border-border px-5 py-3"><BookingButton stay={stay} compact /></div>
    </div>
  );
}
