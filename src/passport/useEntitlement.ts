// React binding for the in-memory entitlement store. Server render and the first client render both see "free".
import { useEffect, useSyncExternalStore } from "react";
import {
  getEntitlement,
  getServerEntitlement,
  startEntitlement,
  subscribeEntitlement,
  type EntitlementState,
} from "./premium-client";

export function useEntitlement(): EntitlementState {
  const s = useSyncExternalStore(subscribeEntitlement, getEntitlement, getServerEntitlement);
  useEffect(() => {
    startEntitlement(); // once per page load; does nothing for a visitor who never activated
  }, []);
  return s;
}
