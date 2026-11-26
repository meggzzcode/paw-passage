import { Link } from "@tanstack/react-router";
import { BRAND } from "@/config/brand";
import { site } from "@/config/site";
import { hasApprovedAffiliates } from "@/lib/launch";
import { AnalyticsChoicesButton } from "../site/ConsentNotice";
import { AppLink } from "./AppLink";
import { LogoMark } from "./Logo";
import { guidesLink, navItems, restoreLink, unlockCta } from "./nav-items";

const about = [
  ["/about", "About"],
  ["/how-we-write-adventures", "How we write adventures"],
  ["/contact", "Contact"],
  ["/privacy", "Privacy"],
  ["/terms", "Terms"],
  ["/disclaimer", "Disclaimer"],
  ["/affiliate-disclosure", "Affiliate disclosure"],
] as const;

export function SiteFooter() {
  return (
    <footer className="pp-footer no-print mt-16">
      <div className="pp-marquee" aria-hidden="true">
        <div>
          {Array(2)
            .fill(
              "Better adventures, together ✿ Little moments, big memories ✿ Made for the two of you ✿ ",
            )
            .join("")}
        </div>
      </div>
      <div className="pp-container grid gap-8 py-12 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2 font-display text-2xl">
            <LogoMark size={30} /> {site.name}
          </p>
          <p className="mt-3 max-w-xs text-sm opacity-90">{BRAND.lifetime}</p>
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
              <AppLink to={guidesLink.to}>{guidesLink.label}</AppLink>
            </li>
            <li>
              <AppLink to="/journal">The Adventure Journal</AppLink>
            </li>
            <li>
              <AppLink to={unlockCta.to}>{unlockCta.label}</AppLink>
            </li>
            <li>
              <AppLink to={restoreLink.to}>{restoreLink.label}</AppLink>
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
            <li>
              <AnalyticsChoicesButton />
            </li>
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
