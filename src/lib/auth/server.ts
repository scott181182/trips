import { zenstackAdapter } from "@zenstackhq/better-auth";
import { betterAuth } from "better-auth";

// ZenStack ORM client
import { db } from "@/server/db";

export const auth = betterAuth({
  database: zenstackAdapter(db, {
    provider: "sqlite",
  }),
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
