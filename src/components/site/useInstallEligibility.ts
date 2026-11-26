// When the quiet install invitation may appear: the launch gate is on AND the customer has bought, activated, and the
// first sync completed (so their intro progress and saved adventures are safely on the server). Never otherwise.
import { PWA_PROMPTS_ENABLED } from "@/lib/pwa";
import { useEntitlement } from "@/passport/useEntitlement";
import { useSyncState } from "@/passport/useSync";

export function useInstallEligible(): boolean {
  const { status } = useEntitlement();
  const { status: sync } = useSyncState();
  return PWA_PROMPTS_ENABLED && status === "entitled" && sync === "saved";
}
