import { createFileRoute, redirect } from "@tanstack/react-router";

// Old address: kept so existing links never 404. Permanent redirect to the tools index (the tool it led to was retired).
export const Route = createFileRoute("/tools/cost-calculator")({
  beforeLoad: () => {
    throw redirect({ to: "/tools", statusCode: 301 });
  },
});
