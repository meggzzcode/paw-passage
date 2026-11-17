import { Link } from "@tanstack/react-router";
import { site } from "@/config/site";

/**
 * Email signup. It only renders a working form once a Kit or MailerLite form address is set in Business
 * settings (Pages CMS). Until then nothing is shown to visitors, so nobody signs up to a form that saves
 * nothing and no empty "coming soon" box takes up space. In development a preview note explains why.
 *
 * compact = the slim box used at the end of an article and under the checklist tool, where readers are
 * most likely to want updates. Without it, the larger box used on the home page.
 */
export function Newsletter({ compact = false }: { compact?: boolean }) {
  const { formAction, emailFieldName } = site.newsletter;
  if (!formAction) {
    if (!import.meta.env.DEV) return null;
    return (
      <section className={`no-print ${compact ? "mt-12" : "container-page mt-24"}`}>
        <div className="rounded-xl border border-dashed border-terracotta/60 bg-accent/40 p-6 text-sm">
          <p className="font-semibold">Email signup, preview only</p>
          <p className="mt-1 text-muted-foreground">Visitors see nothing here until a Kit or MailerLite form address is entered in Business settings.</p>
        </div>
      </section>
    );
  }
  const form = (id: string) => (
    <form action={formAction} method="post" className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <label htmlFor={id} className="sr-only">Email address</label>
      <input id={id} name={emailFieldName} type="email" required autoComplete="email" placeholder="you@example.com" className="h-12 flex-1 rounded-full border border-input bg-background px-5" />
      <button className="h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90">Get the updates</button>
    </form>
  );
  const fine = (
    <p className="mt-3 text-xs text-muted-foreground">
      One email address, nothing else. Unsubscribe in one click. See our <Link to="/privacy" className="underline">privacy policy</Link>.
    </p>
  );
  if (compact) {
    return (
      <section className="no-print mt-12 rounded-xl bg-secondary p-6" aria-labelledby="nl-compact">
        <h2 id="nl-compact" className="font-display text-xl">Get a note when this changes</h2>
        <p className="mt-1 text-sm text-muted-foreground">Fees, leash rules and policies change. We email when a guide is updated in a way that matters, and when a new one is published.</p>
        <div className="mt-4">{form("nl-email-compact")}</div>
        {fine}
      </section>
    );
  }
  return (
    <section className="no-print container-page mt-24">
      <div className="grid gap-8 rounded-xl bg-secondary p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="eyebrow">The Passage letter</p>
          <h2 className="mt-2 text-3xl">Rule changes and new guides, in your inbox.</h2>
          <p className="mt-3 text-sm text-muted-foreground">Pet fees, leash rules and rental policies change. We email when a guide is updated in a way that matters, and when we publish a new one.</p>
        </div>
        <div className="self-center">
          {form("nl-email")}
          {fine}
        </div>
      </div>
    </section>
  );
}
