// Types for the guide modules the build step generates (see plugins/content.ts).
declare module "virtual:guides-meta" {
  import type { Guide } from "@/content/types";
  /** Every guide WITHOUT its text in a production build (body "", no faqs, sources or research notes). Full in dev and tests. */
  export const guidesMeta: Guide[];
}
declare module "virtual:guide-loaders" {
  import type { Guide } from "@/content/types";
  export const guideLoaders: Record<string, () => Promise<Guide>>;
}
