import {
  Bone,
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
import { productTitle } from "@/lib/product-display";

type CardProduct = {
  brand: string;
  name: string;
  categories?: readonly string[] | undefined;
  cardSpecs?: readonly string[] | undefined;
};

type Tone = "sand" | "sage" | "terracotta";

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
  "rental-cleanup": { icon: Sparkles, tone: "sand" },
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
  [/crate|exercise pen|play yard|pet yard|petgate|\bgate\b|barrier/i, Fence],
  [/container|vault|carrier|tainer/i, Package],
  [/bowl|bottle/i, CupSoda],
];

function styleFor(p: CardProduct) {
  const base = (p.categories?.[0] && SPEC_CARD_STYLE[p.categories[0]]) || {
    icon: PawPrint,
    tone: "sand" as Tone,
  };
  const hit = NAME_ICONS.find(([re]) => re.test(p.name));
  return hit ? { ...base, icon: hit[1] } : base;
}

/**
 * Compact spec card: tinted panel, category line icon (decorative), brand, product name and up to three fact chips.
 * Real text only. No price, rating or stock. `headingLevel` lets it sit under any heading structure.
 */
export function ProductSpecCard({
  product,
  as: Name = "p",
  className = "",
}: {
  product: CardProduct;
  /** Element for the product name. Use "h3" where the card is the item's heading. */
  as?: "p" | "h3" | "h2";
  className?: string;
}) {
  const { icon: Icon, tone } = styleFor(product);
  const brand = product.brand.trim();
  const title = productTitle(product);
  const chips = (product.cardSpecs ?? []).slice(0, 3);
  return (
    <div className={`speccard speccard-${tone} ${className}`.trim()} data-speccard="">
      <Icon className="speccard-icon" aria-hidden="true" focusable="false" strokeWidth={1.25} />
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
export function productSpecCardHtml(product: CardProduct, as: "p" | "h3" | "h2" = "p"): string {
  return renderToStaticMarkup(<ProductSpecCard product={product} as={as} />);
}
