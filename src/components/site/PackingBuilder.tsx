import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BriefcaseMedical,
  Car,
  Check,
  Copy,
  Droplets,
  Fence,
  FileText,
  Dog,
  MapPin,
  Pill,
  Printer,
  Sofa,
  Bed,
  Tag,
  ShieldAlert,
  Package,
  Utensils,
  Shirt,
  type LucideIcon,
} from "lucide-react";
import {
  packItems,
  groupsInOrder,
  recommended,
  defaultProfile,
  packingText,
  type PackProfile,
  type PackItem,
} from "@/lib/packing";
import { getProduct } from "@/content/gear";
import { liveCategoryFor } from "@/content/gear-hub";
import { allGuides } from "@/content/guides";
import { getApprovedLink, isAmazon, AMAZON_DISCLOSURE } from "@/content/affiliates";
import { productButton, productLinkId } from "@/content/affiliate-usage";
import { packPhoto, packPhotoCredits } from "@/lib/pack-images";
import { trackProductClick, trackTool, trackToolOnce } from "@/lib/analytics";

const TOOL = "packing-builder";
const KEY = "pp.packing.v1";
const icons: Record<string, LucideIcon> = {
  "car-restraint": Car,
  "seat-cover": Sofa,
  bed: Bed,
  throw: Shirt,
  bowl: Utensils,
  bottle: Droplets,
  "id-tag": Tag,
  gps: MapPin,
  fence: Fence,
  "first-aid": BriefcaseMedical,
  muzzle: ShieldAlert,
  paperwork: FileText,
  "meds-food": Pill,
  "leash-waste": Dog,
  towels: Package,
};

const toggles: { key: keyof PackProfile; label: string }[] = [
  { key: "car", label: "We are driving" },
  { key: "rental", label: "Staying in a rental" },
  { key: "senior", label: "Older dog" },
  { key: "bolter", label: "My dog bolts or digs" },
  { key: "noFence", label: "The rental has no fence" },
];

function guideFor(productId: string) {
  return allGuides.find((g) => g.gear?.some((x) => x.productId === productId));
}

export function PackingBuilder() {
  const loc = useLocation();
  const [profile, setProfile] = useState<PackProfile>(defaultProfile);
  const [packed, setPacked] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const [pinned, setPinned] = useState(false);
  const [copied, setCopied] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    try {
      const v = JSON.parse(localStorage.getItem(KEY) ?? "null");
      if (v?.profile) setProfile({ ...defaultProfile, ...v.profile });
      if (Array.isArray(v?.packed))
        setPacked(v.packed.filter((x: unknown) => typeof x === "string"));
    } catch {
      /* storage blocked or bad data */
    }
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (loaded) {
      try {
        localStorage.setItem(KEY, JSON.stringify({ profile, packed }));
      } catch {
        /* storage blocked */
      }
    }
  }, [profile, packed, loaded]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(null);
        setPinned(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const rows = useMemo(() => recommended(profile), [profile]);
  const reasonOf = (id: string) => rows.find((r) => r.item.id === id)?.reason ?? null;
  const recIds = rows.filter((r) => r.reason).map((r) => r.item.id);
  const packedRec = recIds.filter((id) => packed.includes(id)).length;
  const pct = recIds.length ? Math.round((packedRec / recIds.length) * 100) : 0;

  const productRows = packItems
    .flatMap((i) => i.productIds.map((id) => getProduct(id)))
    .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => !!p);
  const approved = productRows
    .map((p) => getApprovedLink(productLinkId(p)))
    .filter((l): l is NonNullable<typeof l> => !!l);

  function touch() {
    trackToolOnce("tool_start", { tool: TOOL });
  }
  function setP(key: keyof PackProfile) {
    setProfile((p) => ({ ...p, [key]: !p[key] }));
    touch();
  }
  function toggle(id: string) {
    setPacked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));
    touch();
  }
  function enter(id: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (!pinned) setOpen(id);
  }
  function leave() {
    if (pinned) return;
    closeTimer.current = setTimeout(() => setOpen(null), 180);
  }
  async function copy() {
    try {
      await navigator.clipboard.writeText(packingText(packed));
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
    trackTool("tool_copy", { tool: TOOL, count: packed.length });
  }
  function print() {
    trackTool("tool_print", { tool: TOOL, count: packed.length });
    window.print();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="no-print rounded-xl border bg-card p-5 shadow-card">
          <p className="font-medium">About this trip</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Trip details">
            {toggles.map((t) => (
              <button
                key={t.key}
                type="button"
                aria-pressed={profile[t.key]}
                onClick={() => setP(t.key)}
                className={`rounded-full border px-3 py-1.5 text-sm ${profile[t.key] ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-muted"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative rounded-2xl border-2 border-primary/60 bg-secondary/50 p-5 pt-8">
          <div
            aria-hidden
            className="absolute -top-4 left-1/2 h-8 w-24 -translate-x-1/2 rounded-t-full border-2 border-b-0 border-primary/60 bg-background"
          />
          <p className="font-display text-xl">Your dog's bag</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {packedRec} of {recIds.length} recommended items packed
          </p>
          <div
            className="mt-2 h-2 overflow-hidden rounded-full bg-background"
            role="progressbar"
            aria-valuenow={pct}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Packing progress"
          >
            <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
          </div>
          <ul className="mt-4 flex min-h-12 flex-wrap gap-2" aria-label="Packed items">
            {packed.length === 0 && (
              <li className="text-sm text-muted-foreground">Tap an item to add it to the bag.</li>
            )}
            {packed.map((id) => {
              const Icon = icons[id] ?? Package;
              const it = packItems.find((i) => i.id === id);
              return (
                <li
                  key={id}
                  title={it?.name}
                  className="flex size-10 items-center justify-center rounded-full bg-background shadow-card"
                >
                  <Icon className="size-5 text-primary" aria-label={it?.name} />
                </li>
              );
            })}
          </ul>
          <div className="no-print mt-4 flex gap-2">
            <button
              type="button"
              onClick={copy}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm hover:bg-muted"
            >
              <Copy className="size-4" />
              {copied ? "Copied" : "Copy list"}
            </button>
            <button
              type="button"
              onClick={print}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-3 text-sm hover:bg-muted"
            >
              <Printer className="size-4" />
              Print
            </button>
          </div>
        </div>
      </aside>

      <div>
        {approved.length > 0 && (
          <p className="mb-6 rounded-lg bg-muted p-4 text-sm text-muted-foreground">
            Some links below are affiliate links. If you buy through them we may earn a commission
            at no extra cost to you. It never changes which products we list.{" "}
            {approved.some(isAmazon) && AMAZON_DISCLOSURE}{" "}
            <Link to="/affiliate-disclosure" className="text-primary underline">
              How we earn money
            </Link>
            .
          </p>
        )}
        <p className="mb-6 text-sm text-muted-foreground">
          Hover over, tap or focus an item to see what it is, why you might want it and where to get
          it. We have not tested these products: the picks come from the makers' published
          specifications, explained in our guides.
        </p>
        {groupsInOrder.map((g) => {
          const list = packItems.filter((i) => i.group === g);
          return (
            <section key={g} className="mb-8" aria-labelledby={`grp-${g}`}>
              <h2 id={`grp-${g}`} className="text-xl">
                {g}
              </h2>
              <ul className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-3">
                {list.map((item, idx) => (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => enter(item.id)}
                    onMouseLeave={leave}
                  >
                    <Tile
                      item={item}
                      reason={reasonOf(item.id)}
                      isPacked={packed.includes(item.id)}
                      expanded={open === item.id}
                      onToggle={() => toggle(item.id)}
                      onOpen={() => {
                        setOpen(item.id);
                        setPinned(true);
                      }}
                      onFocus={() => enter(item.id)}
                    />
                    {open === item.id && (
                      <Popover
                        item={item}
                        reason={reasonOf(item.id)}
                        isPacked={packed.includes(item.id)}
                        onToggle={() => toggle(item.id)}
                        onClose={() => {
                          setOpen(null);
                          setPinned(false);
                        }}
                        pathname={loc.pathname}
                        alignRight={idx % 3 === 2}
                      />
                    )}
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {packPhotoCredits().length > 0 && (
          <p className="mt-8 text-xs text-muted-foreground">
            Photos are for illustration and do not show specific products. Credits:{" "}
            {packPhotoCredits().map((c, i) => (
              <span key={c.id}>
                {i > 0 && ", "}
                <a
                  href={c.unsplashUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {c.photographer}
                </a>
              </span>
            ))}{" "}
            on Unsplash.
          </p>
        )}
      </div>
    </div>
  );
}

function Tile({
  item,
  reason,
  isPacked,
  expanded,
  onToggle,
  onOpen,
  onFocus,
}: {
  item: PackItem;
  reason: string | null;
  isPacked: boolean;
  expanded: boolean;
  onToggle: () => void;
  onOpen: () => void;
  onFocus: () => void;
}) {
  const Icon = icons[item.id] ?? Package;
  const photo = packPhoto(item.id);
  return (
    <div
      className={`flex h-full flex-col overflow-hidden rounded-xl border transition ${isPacked ? "border-primary bg-primary/5" : "border-border bg-card hover:border-primary"}`}
    >
      <button
        type="button"
        aria-expanded={expanded}
        aria-haspopup="dialog"
        onClick={onOpen}
        onFocus={onFocus}
        className="flex flex-1 flex-col text-left"
      >
        <span className="relative block aspect-[3/2] w-full bg-secondary">
          {photo ? (
            <img
              src={photo.src}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              width={480}
              height={320}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <span className="absolute inset-0 flex items-center justify-center">
              <Icon className="size-10 text-primary/60" />
            </span>
          )}
          <span
            className={`absolute left-2 top-2 flex size-9 items-center justify-center rounded-full shadow-card ${isPacked ? "bg-primary text-primary-foreground" : "bg-background text-primary"}`}
          >
            {isPacked ? <Check className="size-5" /> : <Icon className="size-5" />}
          </span>
        </span>
        <span className="block p-3">
          <span className="block font-medium leading-tight">{item.name}</span>
          {reason ? (
            <span className="mt-1 block text-xs font-medium text-terracotta">
              Recommended for this trip
            </span>
          ) : (
            <span className="mt-1 block text-xs text-muted-foreground">Optional</span>
          )}
        </span>
      </button>
      <div className="px-3 pb-3">
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isPacked}
          className="no-print h-9 w-full rounded-lg border border-input text-sm hover:bg-muted"
        >
          {isPacked ? "Packed" : "Add to bag"}
        </button>
      </div>
    </div>
  );
}

function Popover({
  item,
  reason,
  isPacked,
  onToggle,
  onClose,
  pathname,
  alignRight,
}: {
  item: PackItem;
  reason: string | null;
  isPacked: boolean;
  onToggle: () => void;
  onClose: () => void;
  pathname: string;
  alignRight: boolean;
}) {
  const products = item.productIds
    .map((id) => getProduct(id))
    .filter((p): p is NonNullable<ReturnType<typeof getProduct>> => !!p);
  const how = products[0] ? guideFor(products[0].id) : undefined;
  const cat = products[0] ? liveCategoryFor(products[0]) : undefined;
  return (
    <div
      role="dialog"
      aria-label={item.name}
      className={`no-print z-50 w-full rounded-xl border bg-background p-4 text-sm shadow-card max-md:fixed max-md:inset-x-3 max-md:bottom-3 max-md:max-h-[70vh] max-md:overflow-auto md:absolute md:top-full md:mt-2 md:w-[22rem] ${alignRight ? "md:right-0" : "md:left-0"}`}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="font-display text-lg">{item.name}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <p className="mt-1">{item.what}</p>
      <p className="mt-2">
        <span className="font-medium">What it is for: </span>
        {item.use}
      </p>
      {reason && <p className="mt-2 text-terracotta">{reason}</p>}
      {products.length > 0 && (
        <div className="mt-3 space-y-3 border-t pt-3">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Picks from our research
          </p>
          {products.slice(0, 3).map((p) => {
            const btn = productButton(p);
            const aff = btn?.kind === "affiliate";
            return (
              <div key={p.id}>
                <p className="font-medium leading-tight">
                  {p.brand} {p.name}
                </p>
                <p className="text-muted-foreground">{p.summary}</p>
                {btn && (
                  <a
                    href={btn.url}
                    target="_blank"
                    rel={aff ? "sponsored nofollow noopener" : "nofollow noopener"}
                    onClick={() =>
                      trackProductClick({
                        product: p.id,
                        partner: aff ? btn.network : "maker website",
                        url: btn.url,
                        page: pathname,
                      })
                    }
                    className={
                      aff
                        ? "mt-1 inline-flex h-9 items-center rounded-full bg-terracotta-button px-4 font-medium text-terracotta-foreground hover:brightness-95"
                        : "mt-1 inline-flex h-9 items-center rounded-full border border-border px-4 hover:bg-muted"
                    }
                  >
                    {btn.label}
                  </a>
                )}
              </div>
            );
          })}
          {how && (
            <p className="text-xs text-muted-foreground">
              How we chose:{" "}
              <Link to="/guides/$slug" params={{ slug: how.slug }} className="underline">
                {how.title}
              </Link>
              . Check size and specs on the seller's page.
            </p>
          )}
          {cat && (
            <p className="text-xs text-muted-foreground">
              {how ? "More options: " : "Researched, not tested: "}
              <Link
                to="/gear/$category"
                params={{ category: cat.slug }}
                hash={products[0]!.id}
                className="underline"
              >
                {cat.name} gear
              </Link>
              . Check size and specs on the seller's page.
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={isPacked}
        className="mt-4 h-10 w-full rounded-lg bg-primary font-medium text-primary-foreground hover:bg-primary/90"
      >
        {isPacked ? "Packed. Tap to remove" : "Add to bag"}
      </button>
    </div>
  );
}
