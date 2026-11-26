export const navItems = [
  { to: "/discover", label: "Discover" },
  { to: "/collections", label: "Collections" },
  { to: "/passport", label: "My Passport" },
  { to: "/our-story", label: "Our Story" },
] as const;

export const unlockCta = { to: "/unlock", label: "Get the Passport" } as const;
export const restoreLink = { to: "/restore-access", label: "Restore access" } as const;
/** Guides are not a primary destination: the footer and the home page link to them. */
export const guidesLink = { to: "/guides", label: "Guides" } as const;
