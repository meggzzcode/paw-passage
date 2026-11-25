import { useEffect, useRef } from "react";
import { AppLink } from "./AppLink";
import { Button } from "./Button";
import { navItems, unlockCta } from "./nav-items";

/** Simple dropdown sheet under the header (no focus trap needed: it is part of the page flow). Escape closes it. */
export function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return (
    <nav ref={ref} id="mobile-nav" aria-label="Mobile" className="pp-sheet">
      <div className="pp-container flex flex-col py-2">
        {navItems.map((n) => (
          <AppLink key={n.to} to={n.to} className="pp-sheetlink" onClick={onClose}>
            {n.label}
          </AppLink>
        ))}
        <div className="py-4">
          <Button to={unlockCta.to} className="w-full">
            {unlockCta.label}
          </Button>
        </div>
      </div>
    </nav>
  );
}
