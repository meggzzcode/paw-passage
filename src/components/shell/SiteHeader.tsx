import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { site } from "@/config/site";
import { AppLink } from "./AppLink";
import { Button } from "./Button";
import { LogoMark } from "./Logo";
import { MobileNav } from "./MobileNav";
import { navItems, unlockCta } from "./nav-items";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  return (
    <header className="pp-header no-print">
      <div className="pp-container pp-header-row">
        <Link to="/" className="pp-logo">
          <LogoMark />
          <span>{site.name}</span>
          <span className="sr-only"> home</span>
        </Link>
        <nav className="pp-nav" aria-label="Main">
          {navItems.map((n) => (
            <AppLink
              key={n.to}
              to={n.to}
              className="pp-navlink"
              activeProps={{ className: "pp-navlink active" }}
            >
              {n.label}
            </AppLink>
          ))}
        </nav>
        <div className="pp-header-actions">
          <Button to={unlockCta.to} size="sm">
            <span className="pp-cta-long">{unlockCta.label}</span>
            <span className="pp-cta-short" aria-hidden="true">
              Get it
            </span>
            <span className="sr-only pp-cta-short">{unlockCta.label}</span>
          </Button>
          <button
            type="button"
            className="pp-menu-btn"
            aria-controls="mobile-nav"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          </button>
        </div>
      </div>
      <noscript>
        <nav aria-label="Main (no JavaScript)" className="pp-sheet">
          <div className="pp-container flex flex-wrap gap-x-5">
            {navItems.map((n) => (
              <a key={n.to} href={n.to} className="inline-flex min-h-11 items-center text-sm">
                {n.label}
              </a>
            ))}
          </div>
        </nav>
      </noscript>
      <MobileNav open={open} onClose={() => setOpen(false)} />
    </header>
  );
}
