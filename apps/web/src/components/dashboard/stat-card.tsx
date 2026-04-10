"use client";

import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Card, CardContent, Stack, Typography } from "@mui/material";

type Props = {
  label: string;
  value: string;
  helper: string;
};

export function StatCard({ label, value, helper }: Props) {
  return (
    <Card
      sx={{
        height: "100%",
        borderTop: "3px solid",
        borderTopColor: "primary.main"
      }}
    >
      <CardContent sx={{ p: 2.25 }}>
        <Stack spacing={1.25}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Typography variant="body2" color="text.secondary" fontWeight={700}>
              {label}
            </Typography>
            <TrendingUpRoundedIcon color="primary" fontSize="small" sx={{ mt: 0.25 }} />
          </Stack>
          <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.1 }}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
