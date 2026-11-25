// Netlify Function v2: every /api/ route of the Adventure Passport server. Logic lives in src/server/passport.
import { handleNetlify, type NetlifyContextLike } from "../../src/server/passport/netlify";

export default async (req: Request, context: NetlifyContextLike): Promise<Response> =>
  handleNetlify(req, context);

export const config = {
  path: [
    "/api/session",
    "/api/access/activate",
    "/api/access/restore",
    "/api/progress",
    "/api/premium/adventures",
    "/api/account/export",
    "/api/account/delete",
  ],
};
