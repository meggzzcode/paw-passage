import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/config/site";
import { hasStays, hasPlaces } from "@/lib/launch";
import { hasGear } from "@/content/gear-hub";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        btnRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  const stays = hasStays();
  const places = hasPlaces();
  const base: { to: string; label: string }[] = nav.filter(
    (n) => (stays || n.to !== "/stays") && (places || n.to !== "/dog-rules"),
  );
  // "Gear" sits between Guides and Tools once the travel essentials hub has a live category.
  const toolsAt = base.findIndex((n) => n.to === "/tools");
  const items = hasGear()
    ? [
        ...base.slice(0, toolsAt < 0 ? base.length : toolsAt),
        { to: "/gear", label: "Gear" },
        ...base.slice(toolsAt < 0 ? base.length : toolsAt),
      ]
    : base;
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link
          to="/"
          className="font-display text-xl font-medium tracking-tight text-primary"
          onClick={() => setOpen(false)}
        >
          Paws <span className="text-terracotta">&amp;</span> Passage
          <span className="sr-only"> home</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {items.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary"
              activeProps={{
                className: "text-primary underline decoration-terracotta underline-offset-8",
              }}
            >
              {n.label}
            </Link>
          ))}
          <Link
            to={stays ? "/stays" : "/tools"}
            className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
          >
            {stays ? "Find a stay" : "Free tools"}
          </Link>
        </nav>
        <button
          ref={btnRef}
          type="button"
          aria-controls="mobile-nav"
          className="-mr-2 inline-flex size-11 items-center justify-center md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      <noscript>
        <nav
          className="border-t border-border bg-background md:hidden"
          aria-label="Main (no JavaScript)"
        >
          <div className="container-page flex flex-wrap gap-x-5 gap-y-1 py-2">
            {items.map((n) => (
              <a key={n.to} href={n.to} className="py-2 text-sm font-medium">
                {n.label}
              </a>
            ))}
          </div>
        </nav>
      </noscript>
      {open && (
        <nav
          id="mobile-nav"
          className="border-t border-border bg-background md:hidden"
          aria-label="Mobile"
        >
          <div className="container-page flex flex-col py-3">
            {items.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                className="py-3 font-display text-lg"
                onClick={() => setOpen(false)}
              >
                {n.label}
              </Link>
            ))}
            <p className="pt-2 text-xs text-muted-foreground">{site.tagline}</p>
          </div>
        </nav>
      )}
    </header>
  );
}
