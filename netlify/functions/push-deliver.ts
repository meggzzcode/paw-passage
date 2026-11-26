// Netlify function that delivers due notifications. PAUSED: push and the PWA are off (flags.notifications=false), so
// this function has NO schedule and never runs on its own (no idle 15-minute invocations).
// TO RESTORE when push is relaunched: add this line back at the end of the file, then redeploy to production
// (scheduled functions run only for published production deploys, not previews or branch deploys):
//   export const config = { schedule: "*/15 * * * *" };
// All logic lives in src/server/passport/push-deliver.ts; this file only wires it.
import { handleScheduled } from "../../src/server/passport/push-netlify";

export default async (
  _req: Request,
  context?: { deploy?: { context?: string } },
): Promise<void> => {
  await handleScheduled(context?.deploy?.context ?? process.env["CONTEXT"]);
};
