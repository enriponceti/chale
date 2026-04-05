"use client";

import BedOutlinedIcon from "@mui/icons-material/BedOutlined";
import BuildCircleOutlinedIcon from "@mui/icons-material/BuildCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import {
  Box,
  Card,
  CardContent,
  LinearProgress,
  Stack,
  Typography
} from "@mui/material";

const items = [
  {
    icon: <CalendarMonthOutlinedIcon color="primary" />,
    title: "Check-ins de hoje",
    value: "5 previstos",
    progress: 72
  },
  {
    icon: <PaymentsOutlinedIcon color="primary" />,
    title: "Recebimentos",
    value: "R$ 12.480 aguardando baixa",
    progress: 58
  },
  {
    icon: <BedOutlinedIcon color="primary" />,
    title: "Limpeza operacional",
    value: "8 chales prontos para entrada",
    progress: 85
  },
  {
    icon: <BuildCircleOutlinedIcon color="primary" />,
    title: "Fila de manutencao",
    value: "3 chamados abertos",
    progress: 34
  }
];

export function ExperiencePanel() {
  return (
    <Card
      sx={{
        background:
          "linear-gradient(135deg, rgba(15,107,99,0.95) 0%, rgba(10,79,73,0.98) 100%)",
        color: "white"
      }}
    >
      <CardContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.72 }}>
              Centro de operacao
            </Typography>
            <Typography variant="h5" sx={{ mt: 1 }}>
              Visao consolidada da hospedagem, limpeza e faturamento
            </Typography>
          </Box>

          <Stack spacing={2.5}>
            {items.map((item) => (
              <Box key={item.title}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1 }}>
                  {item.icon}
                  <Box>
                    <Typography fontWeight={700}>{item.title}</Typography>
                    <Typography variant="body2" sx={{ opacity: 0.78 }}>
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{
                    height: 10,
                    borderRadius: 99,
                    bgcolor: "rgba(255,255,255,0.15)",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      bgcolor: "#F6B253"
                    }
                  }}
                />
              </Box>
            ))}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
