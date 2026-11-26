import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { site } from "@/config/site";
import { AppLink } from "./AppLink";
import { Button } from "./Button";
import { LogoMark } from "./Logo";
import { MobileNav } from "./MobileNav";
import { freeNav, paidMore, restoreLink, unlockCta } from "./nav-items";
import { linkProps, primaryLinks, useNavMode } from "./useNavMode";

function MoreMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onDown);
    };
  }, [open]);
  return (
    <div className="pp-more" ref={ref}>
      <button
        type="button"
        className="pp-navlink pp-more-btn"
        aria-expanded={open}
        aria-controls="more-nav"
        onClick={() => setOpen((v) => !v)}
      >
        More <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <ul id="more-nav" className="pp-more-list">
          {paidMore.map((n) => (
            <li key={n.label}>
              <AppLink {...linkProps(n)} className="pp-more-link" onClick={() => setOpen(false)}>
                {n.label}
              </AppLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => setOpen(false), [pathname]);
  const { mode, introStarted, retry } = useNavMode();
  const links = primaryLinks(mode, introStarted);
  return (
    <header className="pp-header no-print" data-nav={mode}>
      <div className="pp-container pp-header-row">
        <Link to="/" className="pp-logo">
          <LogoMark />
          <span>{site.name}</span>
          <span className="sr-only"> home</span>
        </Link>
        <nav className="pp-nav" aria-label="Main" aria-busy={mode === "loading" ? true : undefined}>
          {mode === "loading" ? (
            <span className="pp-nav-skeleton" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </span>
          ) : (
            links.map((n) => (
              <AppLink
                key={n.label}
                {...linkProps(n)}
                className="pp-navlink"
                activeProps={{ className: "pp-navlink active" }}
                activeOptions={n.to === "/" || n.search ? { exact: true } : {}}
              >
                {n.label}
              </AppLink>
            ))
          )}
          {mode === "paid" && <MoreMenu />}
        </nav>
        <div className="pp-header-actions">
          {mode === "free" && (
            <>
              <AppLink to={restoreLink.to} className="pp-restore-link">
                {restoreLink.label}
              </AppLink>
              <Button to={unlockCta.to} size="sm" className="pp-header-cta">
                {unlockCta.label}
              </Button>
            </>
          )}
          {mode === "error" && (
            <button type="button" className="pp-restore-link pp-retry" onClick={retry}>
              Retry access check
            </button>
          )}
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
            {freeNav.map((n) => (
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
