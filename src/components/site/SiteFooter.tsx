import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";
import { hasStays, hasPlaces, hasApprovedAffiliates } from "@/lib/launch";
import { affiliateLinks } from "@/content/affiliates";
import { hasGear } from "@/content/gear-hub";

const cols = [
  { title: "Explore", links: [["/stays", "Stays"], ["/destinations", "Destinations"], ["/guides", "Guides"], ["/gear", "Gear"], ["/dog-rules", "Dog rules"], ["/tools", "Tools"]] },
  { title: "Plan", links: [["/tools/will-my-dog-be-accepted", "Will my dog be accepted?"], ["/tools/pet-cost-check", "Pet cost and host confirmation"], ["/tools/packing-list", "Pack your dog's bag"], ["/tools/checklist", "Before-you-book checklist"], ["/data/pet-policies", "Pet policy data"]] },
  { title: "About", links: [["/about", "About us"], ["/editorial-standards", "Editorial standards"], ["/methodology", "Methodology"], ["/corrections", "Corrections"], ["/list-your-property", "List your property"], ["/contact", "Contact"]] },
  { title: "Legal", links: [["/affiliate-disclosure", "Affiliate disclosure"], ["/privacy", "Privacy"], ["/terms", "Terms"]] },
] as const;

export function SiteFooter() {
  const stays = hasStays();
  const places = hasPlaces();
  const gear = hasGear();
  const shownCols = cols.map((c) => ({ ...c, links: c.links.filter(([to]) => (stays || to !== "/stays") && (places || to !== "/dog-rules") && (gear || to !== "/gear")) }));
  return (
    <footer className="no-print mt-24 bg-primary text-primary-foreground">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.4fr_repeat(4,1fr)]">
        <div>
          <p className="font-display text-2xl">Paws <span className="text-terracotta">&amp;</span> Passage</p>
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/75">{site.tagline} Practical, researched advice for traveling with dogs, without fake reviews or invented listings.</p>
        </div>
        {shownCols.map((c) => (
          <div key={c.title}>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-sage">{c.title}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {c.links.map(([to, label]) => (
                <li key={to}><Link to={to} className="text-primary-foreground/85 hover:text-primary-foreground hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-primary-foreground/15">
        <div className="container-page flex flex-col gap-2 py-6 text-xs text-primary-foreground/65 md:flex-row md:justify-between">
          <p>© {new Date().getFullYear()} {site.name}.{hasApprovedAffiliates() && <> Some links may be affiliate links. See our <Link to="/affiliate-disclosure" className="underline">disclosure</Link>.</>}</p>
          {affiliateLinks.some((l) => l.approved && /vrbo/i.test(l.network)) && <p className="mt-1 text-xs text-muted-foreground">VRBO is a trademark or registered trademark of Expedia, Inc.</p>}
          <p>Always confirm pet policies with the host before booking.</p>
        </div>
      </div>
    </footer>
  );
}
