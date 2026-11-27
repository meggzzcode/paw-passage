import { useEffect, useState } from "react";
import { useNavMode } from "./useNavMode";

/** Set by the inline script in the root document before first paint, for a browser that holds an account flag. */
export const HOME_PENDING_ATTR = "data-home-pending";

/**
 * Keeps the visitor (sales) home out of sight for a returning customer until it is really gone from the page.
 * The header clears `data-acct` as soon as access is known, which can be a frame or two BEFORE the home page has swapped
 * to the returning-customer home; this separate attribute is only cleared once it is safe: the visitor is confirmed
 * (free) or the visitor home has left the DOM. Renders nothing.
 */
export function HomePendingGate() {
  const { mode } = useNavMode();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  useEffect(() => {
    if (!mounted || mode === "loading") return;
    const root = document.documentElement;
    const clear = () => root.removeAttribute(HOME_PENDING_ATTR);
    if (mode === "free" || !document.querySelector(".pp-home-visitor")) {
      clear();
      return;
    }
    const watch = new MutationObserver(() => {
      if (!document.querySelector(".pp-home-visitor")) {
        clear();
        watch.disconnect();
      }
    });
    watch.observe(document.body, { childList: true, subtree: true });
    const fallback = window.setTimeout(clear, 4000); // never leave the page hidden
    return () => {
      watch.disconnect();
      window.clearTimeout(fallback);
    };
  }, [mounted, mode]);
  return null;
}
