import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { nav, site } from "@/config/site";
import { hasStays } from "@/lib/launch";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const stays = hasStays();
  const items = nav.filter((n) => stays || n.to !== "/stays");
  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-6">
        <Link to="/" className="font-display text-xl font-medium tracking-tight text-primary" onClick={() => setOpen(false)}>
          Paws <span className="text-terracotta">&amp;</span> Passage
          <span className="sr-only"> home</span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex" aria-label="Main">
          {items.map((n) => (
            <Link key={n.to} to={n.to} className="text-sm font-medium text-foreground/80 transition-colors hover:text-primary" activeProps={{ className: "text-primary underline decoration-terracotta underline-offset-8" }}>
              {n.label}
            </Link>
          ))}
          <Link to={stays ? "/stays" : "/tools"} className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:bg-primary/90">
            {stays ? "Find a stay" : "Free tools"}
          </Link>
        </nav>
        <button type="button" className="md:hidden" aria-label={open ? "Close menu" : "Open menu"} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>
      {open && (
        <nav className="border-t border-border bg-background md:hidden" aria-label="Mobile">
          <div className="container-page flex flex-col py-3">
            {items.map((n) => (
              <Link key={n.to} to={n.to} className="py-3 font-display text-lg" onClick={() => setOpen(false)}>{n.label}</Link>
            ))}
            <p className="pt-2 text-xs text-muted-foreground">{site.tagline}</p>
          </div>
        </nav>
      )}
    </header>
  );
}
