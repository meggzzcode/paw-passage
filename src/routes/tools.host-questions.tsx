import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address: kept so existing links never 404. Permanent redirect to the combined tool.
export const Route = createFileRoute("/tools/host-questions")({
  beforeLoad: () => { throw redirect({ to: "/tools/pet-cost-check", statusCode: 301 }); },
});
