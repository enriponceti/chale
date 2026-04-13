import { Box, Stack } from "@mui/material";
import { ChalesStatusPanel } from "../components/dashboard/chales-status-panel";
import { ExperiencePanel } from "../components/dashboard/experience-panel";
import { ReservationsTable } from "../components/dashboard/reservations-table";
import { StatCard } from "../components/dashboard/stat-card";
import { getChales, getClientes, getDashboard, getManutencoes, getReservasDetalhadas } from "../lib/api";
import { capitalize, formatCurrency, formatDateRange } from "../lib/format";

export default async function HomePage() {
  const [dashboard, chales, reservas, clientes, manutencoes] = await Promise.all([
    getDashboard(),
    getChales(),
    getReservasDetalhadas(),
    getClientes(),
    getManutencoes()
  ]);
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
      label: "Manutenções abertas",
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

  const activeReservationStatuses = new Set(["pendente", "confirmada", "hospedado"]);
  const activeMaintenanceStatuses = new Set(["aberta", "em_andamento"]);
  const chaleCards = chales.map((chale) => {
    const activeReservation = reservas.find(
      (reserva) =>
        reserva.idChale === chale.id && activeReservationStatuses.has(reserva.statusReserva)
    );
    const activeMaintenance = manutencoes.find(
      (manutencao) =>
        manutencao.idChale === chale.id && activeMaintenanceStatuses.has(manutencao.status)
    );

    const status =
      activeMaintenance
        ? ("manutencao" as const)
        : activeReservation
          ? ("reservado" as const)
          : ("disponivel" as const);

    const detalhe =
      status === "manutencao"
        ? `Manutenção - ${capitalize(activeMaintenance?.tipoManutencao ?? "")}`
        : activeReservation
          ? `Reserva #${activeReservation.id} entre ${formatDateRange(
              activeReservation.dataCheckinPrevisto,
              activeReservation.dataCheckoutPrevisto
            )}`
          : "Livre para nova reserva neste momento.";

    return {
      id: chale.id,
      codigo: chale.codigo,
      nome: chale.nome,
      status,
      detalhe,
      clienteNome: activeReservation
        ? clientes.find((cliente) => cliente.id === activeReservation.idCliente)?.nomeCompleto
        : undefined,
      clienteTelefone: activeReservation
        ? clientes.find((cliente) => cliente.id === activeReservation.idCliente)?.telefone ||
          clientes.find((cliente) => cliente.id === activeReservation.idCliente)?.celular
        : undefined
    };
  });

  return (
    <Stack spacing={3}>
      <ChalesStatusPanel cards={chaleCards} />

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
