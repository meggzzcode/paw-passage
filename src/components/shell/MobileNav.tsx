import { useEffect, useRef } from "react";
import { AppLink } from "./AppLink";
import { Button } from "./Button";
import { restoreLink, unlockCta, paidMore } from "./nav-items";
import { linkProps, primaryLinks, useNavMode } from "./useNavMode";

/** Simple dropdown sheet under the header (no focus trap needed: it is part of the page flow). Escape closes it. */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const { mode, introStarted, retry } = useNavMode();
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const links = primaryLinks(mode, introStarted);
  return (
    <nav ref={ref} id="mobile-nav" aria-label="Mobile" className="pp-sheet">
      <div className="pp-container flex flex-col py-2">
        {mode === "loading" && (
          <p className="pa-fine py-3" role="status">
            Checking your access...
          </p>
        )}
        {links.map((n) => (
          <AppLink key={n.label} {...linkProps(n)} className="pp-sheetlink" onClick={onClose}>
            {n.label}
          </AppLink>
        ))}
        {mode === "paid" && (
          <>
            <p className="pp-sheet-k">More</p>
            {paidMore.map((n) => (
              <AppLink
                key={n.label}
                {...linkProps(n)}
                className="pp-sheetlink pp-sheetlink-quiet"
                onClick={onClose}
              >
                {n.label}
              </AppLink>
            ))}
          </>
        )}
        {mode === "error" && (
          <div className="py-3">
            <p className="pa-fine" role="status">
              We couldn't confirm your access. Your progress is safe on this device.
            </p>
            <button type="button" className="pp-btn pp-btn-secondary" onClick={retry}>
              Retry access check
            </button>
          </div>
        )}
        {mode === "free" && (
          <>
            <div className="py-4">
              <Button to={unlockCta.to} className="w-full">
                {unlockCta.label}
              </Button>
            </div>
            <AppLink
              to={restoreLink.to}
              className="pp-sheetlink pp-sheetlink-quiet"
              onClick={onClose}
            >
              {restoreLink.label}
            </AppLink>
          </>
        )}
      </div>
    </nav>
  );
}
