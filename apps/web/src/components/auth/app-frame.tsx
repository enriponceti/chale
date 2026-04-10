"use client";

import CottageOutlinedIcon from "@mui/icons-material/CottageOutlined";
import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "./auth-provider";
import { AdminShell } from "../layout/admin-shell";

type Props = {
  children: ReactNode;
};

function AuthGate({ children }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useAuth();
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (status === "unauthenticated" && !isLoginPage) {
      router.replace("/login");
    }

    if (status === "authenticated" && isLoginPage) {
      router.replace("/");
    }
  }, [isLoginPage, router, status]);

  if (isLoginPage) {
    return <>{children}</>;
  }

  if (status === "loading" || status === "unauthenticated") {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "grid",
          placeItems: "center",
          px: 3,
          background:
            "radial-gradient(circle at top, rgba(15, 107, 99, 0.14), transparent 42%), #F4F1EA"
        }}
      >
        <Stack spacing={2} alignItems="center">
          <Box
            sx={{
              width: 64,
              height: 64,
              display: "grid",
              placeItems: "center",
              borderRadius: 4,
              background: "linear-gradient(135deg, #0F6B63 0%, #D97706 100%)",
              color: "white"
            }}
          >
            <CottageOutlinedIcon fontSize="large" />
          </Box>
          <CircularProgress size={28} />
          <Typography color="text.secondary">Carregando painel administrativo...</Typography>
        </Stack>
      </Box>
    );
  }

  return <AdminShell>{children}</AdminShell>;
}

export function AppFrame({ children }: Props) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  );
}
