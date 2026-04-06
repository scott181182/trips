"use client";

import { AppBar, Container, IconButton, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import { useCallback, useState } from "react";

import { authClient } from "@/lib/auth/client";
import { ProfileIcon } from "./ProfileIcon";

export function AppNavbar() {
  const [anchorElProfile, setAnchorElProfile] = useState<HTMLElement | null>(null);

  const handleMenuClose = useCallback(() => {
    setAnchorElProfile(null);
  }, []);

  const signout = useCallback(() => {
    authClient.signOut();
  }, []);

  return (
    <AppBar>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography sx={{ flexGrow: 1 }}>Trip Planner</Typography>
          <IconButton onClick={(ev) => setAnchorElProfile(ev.currentTarget)}>
            <ProfileIcon />
          </IconButton>
          <Menu anchorEl={anchorElProfile} open={Boolean(anchorElProfile)} onClose={handleMenuClose}>
            <MenuItem onClick={signout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
