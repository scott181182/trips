"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2C363F",
    },
    secondary: {
      main: "#52CB77",
    },
  },
  typography: {
    h1: { fontSize: "3rem" },
    h2: { fontSize: "2rem" },
    h3: { fontSize: "1.5rem" },
  },
});
