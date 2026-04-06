"use client";

import { Avatar } from "@mui/material";

import { authClient } from "@/lib/auth/client";

export function ProfileIcon() {
  const { data } = authClient.useSession();

  if (!data) {
    return;
  }

  if (data.user.image) {
    console.log("Image!");
    return <Avatar alt={data.user.name} src={data.user.image} />;
  } else {
    const initials = data.user.name
      .split(/\s+/)
      .filter((n) => n.length > 0)
      .map((n) => n.charAt(0))
      .join("");
    return <Avatar alt={data.user.name}>{initials}</Avatar>;
  }
}
