"use client";

import { Box, Button, Stack, Typography } from "@mui/material";
import { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  action?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, action }: Props) {
  return (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        borderRadius: 1.5,
        border: "1px solid #dee2e6",
        backgroundColor: "#ffffff",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.06)"
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", md: "center" }}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", letterSpacing: "0.08em", fontWeight: 700 }}
          >
            {eyebrow}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.25, fontWeight: 600 }}>
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 760 }}>
            {description}
          </Typography>
        </Box>

        {action ?? <Button variant="contained">Novo cadastro</Button>}
      </Stack>
    </Box>
  );
}
