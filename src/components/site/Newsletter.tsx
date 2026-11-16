import { site } from "@/config/site";

/** Only renders a working form when an external provider form is configured. */
export function Newsletter() {
  const { formAction, emailFieldName } = site.newsletter;
  if (!formAction) {
    if (!import.meta.env.DEV) {
      return (
        <section className="no-print container-page mt-24">
          <div className="rounded-xl bg-secondary p-8 text-center">
            <p className="eyebrow">The Passage letter</p>
            <h2 className="mt-2 text-2xl">Our newsletter is coming soon.</h2>
            <p className="mt-2 text-sm text-muted-foreground">New guides and verified stays, now and then. Check back shortly.</p>
          </div>
        </section>
      );
    }
    return (
      <section className="no-print container-page mt-24">
        <div className="rounded-xl border border-dashed border-terracotta/60 bg-accent/40 p-8 text-sm">
          <p className="font-semibold">Newsletter signup, preview only</p>
          <p className="mt-1 text-muted-foreground">The live site shows a "coming soon" note here until a Kit or MailerLite form is connected in the site settings, so nobody signs up to a form that saves nothing.</p>
        </div>
      </section>
    );
  }
  return (
    <section className="no-print container-page mt-24">
      <div className="grid gap-8 rounded-xl bg-secondary p-8 md:grid-cols-2 md:p-12">
        <div>
          <p className="eyebrow">The Passage letter</p>
          <h2 className="mt-2 text-3xl">New guides and verified stays, now and then.</h2>
          <p className="mt-3 text-sm text-muted-foreground">No spam, no selling your address. Unsubscribe in one click.</p>
        </div>
        <form action={formAction} method="post" className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <label htmlFor="nl-email" className="sr-only">Email address</label>
          <input id="nl-email" name={emailFieldName} type="email" required placeholder="you@example.com" className="h-12 flex-1 rounded-full border border-input bg-background px-5" />
          <button className="h-12 rounded-full bg-primary px-6 font-medium text-primary-foreground hover:bg-primary/90">Subscribe</button>
        </form>
      </div>
    </section>
  );
}
