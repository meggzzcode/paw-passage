import { createFileRoute } from "@tanstack/react-router";
import { Container } from "@/components/shell/Container";
import { AccessForm } from "@/components/passport/AccessForms";
import { pageHead } from "@/lib/seo";

export const Route = createFileRoute("/restore-access")({
  head: () =>
    pageHead({
      title: "Restore access",
      description: "Already bought the Adventure Passport? Restore it on a new device.",
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
          Haven't bought it? The free adventures work without any code or account.
        </p>
      </div>
    </Container>
  ),
});
