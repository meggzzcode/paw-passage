import {
  Backpack,
  BriefcaseMedical,
  Car,
  Compass,
  House,
  Package,
  PawPrint,
  ShieldCheck,
  Tent,
  TreePine,
  Utensils,
  Waves,
  BedDouble,
  type LucideIcon,
} from "lucide-react";

export const TRIP_ICONS: Record<string, LucideIcon> = {
  house: House,
  car: Car,
  waves: Waves,
  tent: Tent,
  compass: Compass,
};

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  "food-water": Utensils,
  "leash-id-safety": ShieldCheck,
  "sleep-comfort": BedDouble,
  "car-travel": Car,
  outdoor: TreePine,
  health: BriefcaseMedical,
  rental: House,
};

export const EXTRAS_ICON: LucideIcon = Backpack;
export const FALLBACK_ICON: LucideIcon = Package;
export const BRAND_ICON: LucideIcon = PawPrint;
