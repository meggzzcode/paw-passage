import { PawPrint, ShieldCheck } from "lucide-react";
import { Breadcrumbs } from "@/components/site/Breadcrumbs";
import { SPEC_CARD_STYLE } from "@/components/site/ProductSpecCard";
import type { CategoryView } from "@/content/gear-category-view";

const TONE: Record<string, { panel: string; icon: string }> = {
  sage: { panel: "bg-sage/25", icon: "bg-sage/50 text-primary" },
  sand: { panel: "bg-secondary", icon: "bg-background/70 text-primary" },
  terracotta: { panel: "bg-terracotta/15", icon: "bg-terracotta/25 text-primary" },
};

/** Compact category header: breadcrumb, H1, two-sentence intro, decorative icon and what is on the page. */
export function CategoryHero({ view }: { view: CategoryView }) {
  const { category: c, primary, secondary, guides } = view;
  const style = SPEC_CARD_STYLE[c.slug];
  const Icon = style?.icon ?? PawPrint;
  const tone = TONE[style?.tone ?? "sand"]!;
  const jumps = [
    secondary.length > 0 && { href: "#also-useful", label: "Also useful" },
    { href: "#how-to-choose", label: "How to choose" },
    guides.length > 0 && { href: "#related-guides", label: "Related guides" },
  ].filter(Boolean) as { href: string; label: string }[];
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Home", to: "/" },
          { label: "Travel essentials", to: "/gear" },
          { label: c.name },
        ]}
      />
      <header className={`mt-4 rounded-2xl ${tone.panel} px-5 py-6 sm:px-8 md:py-8`}>
        <div className="flex items-start gap-4 sm:gap-6">
          <div className="min-w-0 flex-1">
            <p className="eyebrow">Travel essentials</p>
            <h1 className="mt-2 text-3xl leading-tight text-balance md:text-5xl">{c.name}</h1>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-foreground/85">{c.intro}</p>
            <p className="mt-4 text-sm text-muted-foreground">
              {primary.length} {primary.length === 1 ? "pick" : "picks"}
              {secondary.length > 0 && <> and {secondary.length} more that also fit</>}
            </p>
            <nav aria-label="On this page" className="mt-3">
              <ul className="flex flex-wrap gap-2 text-sm">
                {jumps.map((j) => (
                  <li key={j.href}>
                    <a
                      href={j.href}
                      className="inline-flex min-h-9 items-center rounded-full border border-border bg-background/70 px-3.5 text-foreground transition hover:bg-background focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
                    >
                      {j.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>
          <div
            className={`hidden size-20 shrink-0 items-center justify-center rounded-2xl sm:flex md:size-28 ${tone.icon}`}
            aria-hidden="true"
          >
            <Icon className="size-10 md:size-14" strokeWidth={1.25} focusable="false" />
          </div>
        </div>
      </header>
    </>
  );
}

/** The distinctions that matter most for safety-critical categories, kept visible above the products. */
export function SafetyNote({ text }: { text: string }) {
  return (
    <aside
      role="note"
      aria-label="Know before you choose"
      className="mt-6 flex gap-3 rounded-xl border border-border bg-card p-4 sm:p-5"
    >
      <ShieldCheck
        className="mt-0.5 size-5 shrink-0 text-primary"
        aria-hidden="true"
        focusable="false"
        strokeWidth={1.5}
      />
      <div>
        <p className="text-sm font-semibold">Know before you choose</p>
        <p className="mt-1 text-sm leading-relaxed text-foreground/85">{text}</p>
      </div>
    </aside>
  );
}
