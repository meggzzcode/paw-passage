// Netlify Scheduled Function: delivers due notifications every 15 minutes (UTC cron). Runs only for published
// production deploys (Netlify does not run scheduled functions for previews or branch deploys). All logic lives in
// src/server/passport/push-deliver.ts; this file only wires it.
import { handleScheduled } from "../../src/server/passport/push-netlify";

export default async (
  _req: Request,
  context?: { deploy?: { context?: string } },
): Promise<void> => {
  await handleScheduled(context?.deploy?.context ?? process.env["CONTEXT"]);
};

export const config = { schedule: "*/15 * * * *" };
