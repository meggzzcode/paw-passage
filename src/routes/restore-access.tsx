import { createFileRoute } from "@tanstack/react-router";
import { AppLink } from "@/components/shell/AppLink";
import { Container } from "@/components/shell/Container";
import { AccessForm } from "@/components/passport/AccessForms";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/restore-access")({
  head: () =>
    pageHead({
      title: "Restore access",
      description: "Already have the Adventure Passport? Restore access on a new device.",
      path: "/restore-access",
      noindex: true,
    }),
  component: () => (
    <Container>
      <div className="pa-page">
        <h1 className="pa-h1">Restore access on a new device</h1>
        <p className="pa-sub">
          Bought the Passport already? Enter the code from your purchase email. No second purchase
          needed.
        </p>
        <p className="pa-fine" data-testid="restore-scope">
          Restoring brings back your access and the progress that was synced to your account.
          Progress that only exists on another device and never synced, and private records kept
          only on that device, do not transfer automatically. Your first adventure works without any
          code.
        </p>
        <AccessForm kind="restore" />
        <p className="pa-fine">
          Can't find your code? It was emailed to you by our checkout provider when you paid. Still
          stuck?{" "}
          <AppLink to="/contact" className="pa-linkbtn">
            Contact support
          </AppLink>{" "}
          with the email you bought with (never your code).
        </p>
        <p className="pa-fine">
          Haven't bought it? Your first adventure works without any code, and needs no account.{" "}
          <AppLink to="/unlock" className="pa-linkbtn">
            See the Passport
          </AppLink>
          .
        </p>
      </div>
    </Container>
  ),
});
