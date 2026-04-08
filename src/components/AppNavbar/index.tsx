"use client";

import { AppBar, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import Link from "next/link";
import { useCallback, useState } from "react";

import type { Role } from "@/../zenstack/models";
import { authClient } from "@/lib/auth/client";
import { ProfileIcon } from "./ProfileIcon";

export function AppNavbar() {
  const session = authClient.useSession();

  const [anchorElProfile, setAnchorElProfile] = useState<HTMLElement | null>(null);

  const handleMenuClose = useCallback(() => {
    setAnchorElProfile(null);
  }, []);

  const signout = useCallback(() => {
    authClient.signOut();
  }, []);

  if (!session.data) {
    return null;
  }
  const userRole = session.data.user.role as Role;

  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography sx={{ flexGrow: 1 }}>Trip Planner</Typography>
          <IconButton onClick={(ev) => setAnchorElProfile(ev.currentTarget)}>
            <ProfileIcon />
          </IconButton>
          <Menu anchorEl={anchorElProfile} open={Boolean(anchorElProfile)} onClose={handleMenuClose}>
            {userRole === "ADMIN" && (
              <MenuItem>
                <Link href="/admin">Admin</Link>
              </MenuItem>
            )}
            <MenuItem onClick={signout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
