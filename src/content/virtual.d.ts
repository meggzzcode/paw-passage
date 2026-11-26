// Types for the data the build step generates from /content (see plugins/content.ts).
declare module "virtual:content" {
  import type { Guide } from "@/content/types";
  import type { AffiliateLink } from "@/content/affiliates";
  import type { SiteSettings } from "@/content/schema";
  export const guides: Guide[];
  import type { ProductRecord } from "@/content/products-schema";
  export const products: ProductRecord[];
  import type { PackingConfig } from "@/lib/packing/schema";
  export const packing: PackingConfig;
  export const affiliates: AffiliateLink[];
  export const settings: SiteSettings;
  export const showDrafts: boolean;
}
