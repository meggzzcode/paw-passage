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
          needed, and your saved progress comes with you.
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
          Haven't bought it? Your first adventure is free and needs no code or account.{" "}
          <AppLink to="/unlock" className="pa-linkbtn">
            See the Passport
          </AppLink>
          .
        </p>
      </div>
    </Container>
  ),
});
