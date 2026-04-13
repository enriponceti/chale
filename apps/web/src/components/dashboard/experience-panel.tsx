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
    title: "Fila de manutenção",
    value: "3 chamados abertos",
    progress: 34
  }
];

export function ExperiencePanel() {
  return (
    <Card
      sx={{
        borderTop: "3px solid",
        borderTopColor: "warning.main"
      }}
    >
      <CardContent sx={{ p: 0 }}>
        <Stack spacing={3}>
          <Box sx={{ px: 2.5, pt: 2.25 }}>
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: "0.08em" }}>
              CENTRO DE OPERACAO
            </Typography>
            <Typography variant="h6" sx={{ mt: 0.75, fontWeight: 600 }}>
              Visao consolidada da hospedagem, limpeza e faturamento
            </Typography>
          </Box>

          <Stack spacing={0}>
            {items.map((item) => (
              <Box
                key={item.title}
                sx={{
                  px: 2.5,
                  py: 1.75,
                  borderTop: "1px solid #edf0f2"
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.25 }}>
                  {item.icon}
                  <Box>
                    <Typography fontWeight={600}>{item.title}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {item.value}
                    </Typography>
                  </Box>
                </Stack>
                <LinearProgress
                  variant="determinate"
                  value={item.progress}
                  sx={{
                    height: 8,
                    borderRadius: 99,
                    bgcolor: "#e9ecef",
                    "& .MuiLinearProgress-bar": {
                      borderRadius: 99,
                      bgcolor: item.progress > 70 ? "#00a65a" : item.progress > 45 ? "#3c8dbc" : "#f39c12"
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
