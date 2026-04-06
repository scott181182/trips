"use client";

import { CircularProgress, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

import { authClient } from "@/lib/auth/client";

export function ClientAuthLayout({ children }: PropsWithChildren) {
  const router = useRouter();
  const { data, error, isPending } = authClient.useSession();

  if (isPending) {
    return (
      <Container>
        <CircularProgress />
      </Container>
    );
  }

  if (!data) {
    if (error) {
      console.error({ authSessionError: error });
    }
    router.push("/login");
  } else {
    return children;
  }
}
