import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";
import { hasApprovedAffiliates } from "@/lib/launch";
import { AppLink } from "./AppLink";
import { LogoMark } from "./Logo";
import { navItems, unlockCta } from "./nav-items";

const about = [
  ["/about", "About"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/affiliate-disclosure", "Affiliate disclosure"],
] as const;

export function SiteFooter() {
  return (
    <footer className="pp-footer no-print mt-16">
      <div className="pp-container grid gap-8 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl">
            <LogoMark size={30} /> {site.name}
          </p>
          <p className="mt-3 max-w-xs text-sm opacity-90">
            The Adventure Passport. A lifetime of little adventures. Collect adventures, not just
            things.
          </p>
        </div>
        <nav aria-label="Explore">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">Explore</p>
          <ul className="mt-2">
            {navItems.map((n) => (
              <li key={n.to}>
                <AppLink to={n.to}>{n.label}</AppLink>
              </li>
            ))}
            <li>
              <AppLink to={unlockCta.to}>{unlockCta.label}</AppLink>
            </li>
          </ul>
        </nav>
        <nav aria-label="About and legal">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] opacity-80">About</p>
          <ul className="mt-2">
            {about.map(([to, label]) => (
              <li key={to}>
                <AppLink to={to}>{label}</AppLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="pp-footer-fine">
        <div className="pp-container py-5">
          <p>
            © {new Date().getFullYear()} {site.name}.
            {hasApprovedAffiliates() && (
              <>
                {" "}
                Some links on this site are affiliate links, and we may earn a commission.{" "}
                <Link to="/affiliate-disclosure" className="underline">
                  How we earn money
                </Link>
                .
              </>
            )}
          </p>
        </div>
      </div>
    </footer>
  );
}
