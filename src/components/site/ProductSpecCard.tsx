import {
  Bone,
  Box,
  BriefcaseMedical,
  Flashlight,
  Package,
  Bed,
  CarFront,
  CupSoda,
  Fence,
  LifeBuoy,
  MapPin,
  MountainSnow,
  PawPrint,
  ShieldCheck,
  Snowflake,
  Sparkles,
  TriangleRight,
  type LucideIcon,
} from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { productNameOnly } from "@/lib/product-display";
import "./gear-card.css";

export type CardProduct = {
  brand: string;
  name: string;
  categories?: readonly string[] | undefined;
  cardSpecs?: readonly string[] | undefined;
};

export type Tone = "sand" | "sage" | "terracotta";

/** Category to decorative line icon and tint. Our own graphic: no photos, no maker or retailer imagery. */
export const SPEC_CARD_STYLE: Record<string, { icon: LucideIcon; tone: Tone }> = {
  "car-safety": { icon: ShieldCheck, tone: "sage" },
  "car-interior": { icon: CarFront, tone: "sand" },
  "ramps-and-steps": { icon: TriangleRight, tone: "terracotta" },
  "feeding-and-hydration": { icon: CupSoda, tone: "sand" },
  "pens-and-gates": { icon: Fence, tone: "sage" },
  "comfort-and-cooling": { icon: Bed, tone: "terracotta" },
  "water-and-beach": { icon: LifeBuoy, tone: "sage" },
  "trail-and-hiking": { icon: MountainSnow, tone: "sand" },
  "cold-weather": { icon: Snowflake, tone: "sage" },
  "safety-id-first-aid": { icon: BriefcaseMedical, tone: "terracotta" },
  "cleanup-and-protection": { icon: Sparkles, tone: "sand" },
};

/** Product-type icons that fit better than the category icon (matched on the product name; first match wins). */
const NAME_ICONS: [RegExp, LucideIcon][] = [
  [/vest|cooler|cooling|cool pet/i, Snowflake],
  [/gps|tracker|petcube|tractive|\bfi\b|series 3/i, MapPin],
  [/beacon|safety light|\blight\b/i, Flashlight],
  [/first aid|first-aid|medical kit|trail dog/i, BriefcaseMedical],
  [/wipes|towel|shammy|doormat|mat\b|pads?\b/i, Sparkles],
  [/kong/i, Bone],
  [/\bbed\b|loft wander/i, Bed],
  [/crate|kennel/i, Box],
  [/exercise pen|play yard|pet yard|petgate|\bgate\b|barrier/i, Fence],
  [/container|vault|carrier|tainer/i, Package],
  [/bowl|bottle/i, CupSoda],
];

export function styleFor(p: CardProduct): { icon: LucideIcon; tone: Tone } {
  const base = (p.categories?.[0] && SPEC_CARD_STYLE[p.categories[0]]) || {
    icon: PawPrint,
    tone: "sand" as Tone,
  };
  const hit = NAME_ICONS.find(([re]) => re.test(p.name));
  return hit ? { ...base, icon: hit[1] } : base;
}

/** Restrained original vector motif behind the glyph: arcs (sage), dot grid (sand) or stripes (terracotta). Decorative. */
export function SpecMotif({ tone }: { tone: Tone }) {
  return (
    <svg
      className="speccard-motif"
      viewBox="0 0 120 120"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
    >
      {tone === "sage" && [18, 34, 50, 66].map((r) => <circle key={r} cx="104" cy="16" r={r} />)}
      {tone === "sand" &&
        [0, 1, 2, 3, 4].flatMap((y) =>
          [0, 1, 2, 3, 4].map((x) => (
            <circle
              key={`${x}-${y}`}
              cx={64 + x * 12}
              cy={8 + y * 12}
              r="1.6"
              fill="currentColor"
              stroke="none"
            />
          )),
        )}
      {tone === "terracotta" &&
        [0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1={50 + i * 14} y1="0" x2={i * 14} y2="120" />
        ))}
    </svg>
  );
}

/** The line icon in a rounded tile: the glyph never floats on its own. Decorative. */
export function SpecGlyph({ icon: Icon }: { icon: LucideIcon }) {
  return (
    <span className="speccard-badge" aria-hidden="true">
      <Icon className="speccard-glyph" focusable="false" strokeWidth={1.5} />
    </span>
  );
}

/**
 * Compact spec card: tinted panel with a quiet geometric motif, the category line icon in a tile (decorative), brand,
 * product name and up to three fact chips. Real text only. No price, rating or stock. `as` lets it sit under any heading.
 */
export function ProductSpecCard({
  product,
  as: Name = "p",
  className = "",
}: {
  product: CardProduct;
  /** Element for the product name. Use "h3" where the card is the item's heading. */
  as?: "p" | "h2" | "h3" | "h4";
  className?: string;
}) {
  const { icon, tone } = styleFor(product);
  const brand = product.brand.trim();
  const title = productNameOnly(product);
  const chips = (product.cardSpecs ?? []).slice(0, 3);
  return (
    <div className={`speccard speccard-${tone} ${className}`.trim()} data-speccard="">
      <SpecMotif tone={tone} />
      <SpecGlyph icon={icon} />
      <div className="speccard-body">
        {brand && <p className="speccard-brand">{brand}</p>}
        <Name className="speccard-name">{title}</Name>
        {chips.length > 0 && (
          <ul className="speccard-chips">
            {chips.map((c) => (
              <li key={c} className="speccard-chip">
                {c}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/** The same card as an HTML string, for the markdown pick block (which renders strings). */
export function productSpecCardHtml(
  product: CardProduct,
  as: "p" | "h2" | "h3" | "h4" = "p",
): string {
  return renderToStaticMarkup(<ProductSpecCard product={product} as={as} />);
}
