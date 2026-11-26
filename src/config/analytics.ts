// Analytics consent setting, in its own file so the consent code does not pull in the rest of the commercial config.

/**
 * Analytics consent mode (Google Analytics 4 only; nothing else on the site needs consent).
 *  - "opt-in" (DEFAULT): no Google script is requested, no analytics cookie is set and no campaign tag is kept until the
 *    visitor chooses "Allow analytics". Use this when sales may reach the EEA, the UK, California or anywhere unsure.
 *  - "notice-only": analytics runs from the first visit, with a visible notice and a one-click "Essential only" opt-out.
 *    Only for an owner who has confirmed (with their own legal advice) that every market they sell into allows this.
 * In BOTH modes a Global Privacy Control or Do Not Track signal counts as "Essential only" until the visitor says otherwise,
 * and analytics never runs in development, tests, deploy previews or any host other than the production site.
 * This is a product setting, not legal advice: the owner must confirm the requirements of their markets.
 */
export type AnalyticsConsentMode = "opt-in" | "notice-only";
export const ANALYTICS_CONSENT_MODE: AnalyticsConsentMode = "opt-in";
