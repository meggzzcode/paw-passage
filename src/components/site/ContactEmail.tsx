import { site } from "@/config/site";

export function ContactEmail({ subject, label }: { subject: string; label?: string }) {
  if (!site.contactEmail) {
    return <p className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">Our business email address is being set up and will appear here shortly.</p>;
  }
  return (
    <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(subject)}`} className="inline-flex rounded-full bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90">
      {label ?? `Email ${site.contactEmail}`}
    </a>
  );
}
