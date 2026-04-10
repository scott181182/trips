import { schema } from "@zenstack/schema";
import { RPCApiHandler } from "@zenstackhq/server/api";
import { NextRequestHandler } from "@zenstackhq/server/next";
import type { NextRequest } from "next/server";

import { type AuthUser, auth } from "@/lib/auth/server";
import { db } from "@/server/db";

const handler = NextRequestHandler({
  useAppDir: true,
  getClient: async (req: NextRequest) => {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    return session ? db.$setAuth(session.user as AuthUser) : db;
  },
  apiHandler: new RPCApiHandler({
    schema,
  }),
});

export { handler as DELETE, handler as GET, handler as PATCH, handler as POST, handler as PUT };
