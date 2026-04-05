import { Box, Stack } from "@mui/material";
import { ExperiencePanel } from "../components/dashboard/experience-panel";
import { ReservationsTable } from "../components/dashboard/reservations-table";
import { StatCard } from "../components/dashboard/stat-card";
import { PageHeader } from "../components/ui/page-header";
import { getDashboard } from "../lib/api";
import { capitalize, formatCurrency, formatDateRange } from "../lib/format";

export default async function HomePage() {
  const dashboard = await getDashboard();
  const dashboardCards = [
    {
      label: "Ocupacao atual",
      value: `${dashboard.occupancyRate}%`,
      helper: `${dashboard.activeReservations} reservas ativas`
    },
    {
      label: "Receita do mes",
      value: formatCurrency(dashboard.monthlyRevenue),
      helper: `${dashboard.todayCheckins} check-ins previstos hoje`
    },
    {
      label: "Reservas ativas",
      value: String(dashboard.activeReservations),
      helper: `${dashboard.todayCheckouts} check-outs previstos hoje`
    },
    {
      label: "Manutencoes abertas",
      value: String(dashboard.maintenanceOpen),
      helper: "Acompanhe impacto na disponibilidade"
    }
  ];

  const reservationRows = dashboard.recentReservations.map((item) => ({
    id: item.id,
    cliente: item.cliente,
    chale: item.chale,
    periodo: formatDateRange(item.checkin, item.checkout),
    status: capitalize(item.status),
    origem: capitalize(item.origem),
    valor: formatCurrency(item.valorTotal)
  }));

  return (
    <Stack spacing={3}>
      <PageHeader
        eyebrow="Dashboard"
        title="Painel de administracao dos chales"
        description="Acompanhe ocupacao, operacao, manutencao e desempenho comercial em um template pensado para hotelaria e hospedagem."
      />

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            md: "repeat(2, minmax(0, 1fr))",
            xl: "repeat(4, minmax(0, 1fr))"
          }
        }}
      >
        {dashboardCards.map((card) => (
          <Box key={card.label}>
            <StatCard {...card} />
          </Box>
        ))}
      </Box>

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: {
            xs: "1fr",
            xl: "minmax(0, 2fr) minmax(340px, 1fr)"
          }
        }}
      >
        <Box>
          <ReservationsTable rows={reservationRows} title="Reservas recentes" />
        </Box>
        <Box>
          <ExperiencePanel />
        </Box>
      </Box>
    </Stack>
  );
}
