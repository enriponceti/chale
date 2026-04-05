"use client";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";
import { appTheme } from "./theme";

type Props = {
  children: ReactNode;
};

export function AppThemeProvider({ children }: Props) {
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
