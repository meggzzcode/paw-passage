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
          <p className="mt-3 max-w-xs text-sm text-primary-foreground/75">{site.tagline}. Practical, researched advice for traveling with dogs, without fake reviews or invented listings.</p>
          {site.pinterestUrl && (
            <a href={site.pinterestUrl} target="_blank" rel="me noopener" aria-label={`${site.name} on Pinterest`} className="mt-5 inline-flex size-10 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground/85 transition hover:bg-primary-foreground/10 hover:text-primary-foreground">
              <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true"><path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" /></svg>
            </a>
          )}
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
