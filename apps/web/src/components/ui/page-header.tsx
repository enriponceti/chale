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
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: "1px solid rgba(15, 107, 99, 0.08)",
        backgroundColor: "rgba(255,255,255,0.78)"
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
            variant="overline"
            color="primary.main"
            sx={{ letterSpacing: "0.12em", fontWeight: 700 }}
          >
            {eyebrow}
          </Typography>
          <Typography variant="h3" sx={{ mt: 0.5 }}>
            {title}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1, maxWidth: 760 }}>
            {description}
          </Typography>
        </Box>

        {action ?? <Button variant="contained">Novo cadastro</Button>}
      </Stack>
    </Box>
  );
}
