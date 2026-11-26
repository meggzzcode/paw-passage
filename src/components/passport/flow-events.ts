// Analytics for the introductory flow and the previews. Slugs and ids only: never a name, answer or free text.
import { track } from "@/passport/events";

export type FlowEvent =
  | "intro_started"
  | "intro_personalized"
  | "intro_recommended"
  | "intro_replaced"
  | "intro_revealed"
  | "intro_completed"
  | "preview_viewed"
  | "preview_bookmarked"
  | "preview_unbookmarked"
  | "collection_preview_viewed"
  | "purchase_cta_clicked";

export const flow = (name: FlowEvent, params: Record<string, string | number | boolean> = {}) =>
  track(name, params);
