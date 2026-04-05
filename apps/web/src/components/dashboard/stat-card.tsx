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
    <Card sx={{ height: "100%" }}>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <TrendingUpRoundedIcon color="primary" fontSize="small" />
          </Stack>
          <Typography variant="h4">{value}</Typography>
          <Typography variant="body2" color="text.secondary">
            {helper}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}
