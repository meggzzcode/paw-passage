// Which navigation to show. Server HTML and the first client render are the free nav (so hydration matches); a browser that
// holds an account flag is "loading" (neutral skeleton, stable layout) until the server has answered, so a paying customer
// never sees the free nav with "Get the Passport" flash by.
import { useEffect, useLayoutEffect, useState } from "react";
import { firstAdventureLink, freeNav, limitedNav, paidNav, type NavItem } from "./nav-items";
import { freeLibrary } from "@/passport/content";
import { hasAccountFlag, refreshEntitlement } from "@/passport/premium-client";
import { savedStarter } from "@/passport/starter";
import { useEntitlement } from "@/passport/useEntitlement";
import { usePassport } from "@/passport/usePassport";

export type NavMode = "loading" | "free" | "paid" | "error";

const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function useNavMode(): { mode: NavMode; introStarted: boolean; retry: () => void } {
  const { status } = useEntitlement();
  const { ready, save } = usePassport();
  const [mounted, setMounted] = useState(false);
  useIsoLayoutEffect(() => setMounted(true), []);

  const flagged = mounted && hasAccountFlag();
  let mode: NavMode = "free";
  if (status === "entitled") mode = "paid";
  else if (status === "checking" || (flagged && status === "free")) mode = "loading";
  else if (status === "offline" && flagged) mode = "error";

  const introStarted = ready && !!save.starter && !!savedStarter(freeLibrary(), save);
  return { mode, introStarted, retry: () => void refreshEntitlement({ force: true }) };
}

/** The main links for an access state (never a purchase action for a paying customer). */
export function primaryLinks(mode: NavMode, introStarted: boolean): readonly NavItem[] {
  if (mode === "paid") return paidNav;
  if (mode === "error") return limitedNav;
  if (mode === "loading") return [];
  return introStarted ? [freeNav[0]!, firstAdventureLink, ...freeNav.slice(1)] : freeNav;
}

export const linkProps = (n: NavItem) => ({
  to: n.to,
  ...(n.hash ? { hash: n.hash } : {}),
  ...(n.search ? { search: n.search as never } : {}),
});
