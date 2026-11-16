// Types for the data the build step generates from /content (see plugins/content.ts).
declare module "virtual:content" {
  import type { Guide } from "@/content/types";
  import type { Stay } from "@/content/stays/types";
  import type { AffiliateLink } from "@/content/affiliates";
  import type { SiteSettings } from "@/content/schema";
  export const guides: Guide[];
  export const stays: Stay[];
  export const affiliates: AffiliateLink[];
  export const settings: SiteSettings;
  export const showDrafts: boolean;
}
