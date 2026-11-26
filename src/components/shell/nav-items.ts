// Navigation for each access state. A visitor sees only what applies to them: free visitors are offered the Passport,
// paying customers are never shown a purchase action.
export type NavItem = { to: string; label: string; hash?: string; search?: Record<string, string> };

/** Free visitors (no purchase): browse, read, and take the first adventure. */
export const freeNav: readonly NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/previews", label: "Explore Adventures" },
  { to: "/journal", label: "Journal" },
  { to: "/our-story", label: "Our Story" },
];

/** Shown in the free nav once an intro adventure has been recommended or revealed: a way back to it. */
export const firstAdventureLink: NavItem = { to: "/discover", label: "My First Adventure" };

/**
 * Paying customers. "Saved" is a primary shortcut, not a tab buried inside Collections: it is the thing a customer
 * returns to most, and on a phone a shortcut is one menu tap away where the tab is menu, Collections, Saved.
 */
export const paidNav: readonly NavItem[] = [
  { to: "/discover", label: "Discover" },
  { to: "/collections", label: "Collections" },
  { to: "/passport", label: "My Passport" },
  { to: "/collections", label: "Saved", search: { tab: "favorites" } },
];

/** Paying customers, secondary (the "More" menu on wide screens, below the main links in the phone menu). */
export const paidMore: readonly NavItem[] = [
  { to: "/journal", label: "Journal" },
  { to: "/our-story", label: "Our Story" },
  { to: "/passport", label: "Settings and account", hash: "acct-h" },
  { to: "/contact", label: "Support" },
];

/** Could not confirm access (offline): local progress still works, and nothing asks the customer to buy. */
export const limitedNav: readonly NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/passport", label: "My Passport" },
  { to: "/journal", label: "Journal" },
];

export const unlockCta = { to: "/unlock", label: "Get the Passport" } as const;
export const restoreLink = { to: "/restore-access", label: "Restore access" } as const;
/** Guides are not a primary destination: the footer and the home page link to them. */
export const guidesLink = { to: "/guides", label: "Guides" } as const;
