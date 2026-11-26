import { useEntitlement } from "./useEntitlement";

/** True only for a verified entitlement; "free", "checking", "offline" and "revoked" all return false. */
export function useKeepsakeEntitled(): boolean {
  return useEntitlement().status === "entitled";
}
