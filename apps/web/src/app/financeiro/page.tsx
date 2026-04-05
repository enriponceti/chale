import AttachMoneyRoundedIcon from "@mui/icons-material/AttachMoneyRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";
import { Box, Card, CardContent, Stack, Typography } from "@mui/material";
import { PageHeader } from "../../components/ui/page-header";

const financeCards = [
  {
    title: "Faturamento previsto",
    value: "R$ 126.900",
    helper: "Reservas confirmadas no periodo",
    icon: <TrendingUpRoundedIcon color="primary" />
  },
  {
    title: "Recebido no mes",
    value: "R$ 84.250",
    helper: "Pagamentos conciliados",
    icon: <AttachMoneyRoundedIcon color="primary" />
  }
];

export default function FinanceiroPage() {
  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Financeiro"
        title="Receita, pagamentos e cobrancas"
        description="Tenha uma leitura rapida de faturamento, repasses recebidos e pendencias financeiras das reservas."
      />

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))"
          }
        }}
      >
        {financeCards.map((card) => (
          <Box key={card.title}>
            <Card>
              <CardContent>
                <Stack spacing={2}>
                  {card.icon}
                  <Typography variant="body2" color="text.secondary">
                    {card.title}
                  </Typography>
                  <Typography variant="h4">{card.value}</Typography>
                  <Typography color="text.secondary">{card.helper}</Typography>
                </Stack>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Stack>
  );
}
