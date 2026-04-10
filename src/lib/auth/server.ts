import type { Role } from "@zenstack/models";
import { zenstackAdapter } from "@zenstackhq/better-auth";
import { betterAuth } from "better-auth";

// ZenStack ORM client
import { db } from "@/server/db";

export const auth = betterAuth({
  database: zenstackAdapter(db, {
    provider: "sqlite",
  }),
  user: {
    additionalFields: {
      role: {
        type: "string",
        input: false,
      },
    },
  },
  socialProviders: {
    google: () => {
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

      if (!clientId || !clientSecret) {
        throw new Error("Could not find $GOOGLE_CLIENT_ID and $GOOGLE_CLIENT_SECRET");
      }

      return {
        clientId,
        clientSecret,
        overrideUserInfoOnSignIn: true,
      };
    },
  },
});

export type AuthSession = typeof auth.$Infer.Session;
export type AuthUser = Omit<AuthSession["user"], "role"> & { role: Role };
