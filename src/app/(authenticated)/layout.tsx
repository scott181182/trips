import { Stack } from "@mui/material";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import type { PropsWithChildren } from "react";

import { AppNavbar } from "@/components/AppNavbar";
import { ClientAuthLayout } from "@/components/ClientAuthLayout";
import { auth } from "@/lib/auth/server";

export default async function AuthenticatedLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  } else {
    return (
      <ClientAuthLayout>
        <Stack direction="column">
          <AppNavbar />
          {children}
        </Stack>
      </ClientAuthLayout>
    );
  }
}
