import type { CategoryView } from "@/content/gear-category-view";

/**
 * "How to choose", shown after the products. Ordinary categories show one line and keep the rest in a native
 * <details>. Safety-critical categories already show their essential distinctions above the products, so here the
 * section is open and holds the remaining checks.
 */
export function HowToChoose({ view }: { view: CategoryView }) {
  const { category: c, safetyCritical } = view;
  const [who, check, limit] = c.howToChoose;
  const rest = safetyCritical ? [check] : [check, limit];
  return (
    <section
      id="how-to-choose"
      className="mt-12 scroll-mt-24 rounded-xl border border-border bg-card p-5 sm:p-6"
      aria-labelledby="how-to-choose-h"
    >
      <h2 id="how-to-choose-h" className="text-2xl">
        How to choose
      </h2>
      <p className="mt-3 max-w-2xl leading-relaxed">{who}</p>
      <details
        className="group mt-3 max-w-2xl"
        {...(safetyCritical ? { open: true } : {})}
        data-howto=""
      >
        <summary className="inline-flex min-h-11 cursor-pointer items-center text-sm font-medium text-primary underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          What to check{safetyCritical ? "" : " and what these will not do"}
        </summary>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-sm leading-relaxed text-foreground/85">
          {rest.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      </details>
    </section>
  );
}
