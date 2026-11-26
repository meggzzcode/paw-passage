// First launch of the installed home-screen app with an empty device and no valid session: the quickest way back is
// Restore access (purchase code, never in a URL), not a progress file. Renders nothing in an ordinary browser tab, for a
// signed-in customer, or when this device already holds progress.
import { AppLink } from "@/components/shell/AppLink";
import { isStandalone } from "@/lib/pwa";
import { emptySave } from "@/passport/progress";
import { canon } from "@/passport/sync";
import { usePassport } from "@/passport/usePassport";
import { useEntitlement } from "@/passport/useEntitlement";

export function RestoreAccessCallout() {
  const { ready, save } = usePassport();
  const { status, signedIn } = useEntitlement();
  if (!ready || signedIn || status === "checking" || status === "entitled") return null;
  if (!isStandalone()) return null;
  if (canon(save) !== canon(emptySave())) return null;
  return (
    <section className="pa-card" aria-labelledby="ra-h" data-restore-callout>
      <h2 className="pa-h" id="ra-h">
        Bought the Passport already?
      </h2>
      <p>
        This app starts without your saved details. Restore access with the code from your purchase
        email and your progress and plans come back from your account. No second purchase.
      </p>
      <div className="pa-row">
        <AppLink to="/restore-access" className="pp-btn pp-btn-primary">
          Restore access
        </AppLink>
      </div>
      <p className="pa-fine">New here? The free adventure works without a code or an account.</p>
    </section>
  );
}
