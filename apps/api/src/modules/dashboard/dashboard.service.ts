import { prisma } from "../../lib/prisma.js";
import { toDateOnly } from "../../lib/date.js";
import { isMockMode } from "../../lib/data-source.js";
import { getReservationListItems, store } from "../../lib/store.js";

export async function getDashboardSummary() {
  if (!isMockMode()) {
    const today = new Date();
    const todayIso = toDateOnly(today);
    const monthPrefix = todayIso.slice(0, 7);

    const [reservas, totalChales, maintenanceOpen] = await Promise.all([
      prisma.reserva.findMany({
        include: {
          cliente: true,
          chale: true
        },
        orderBy: {
          dataReserva: "desc"
        }
      }),
      prisma.chale.count(),
      prisma.chale.count({
        where: {
          status: "manutencao"
        }
      })
    ]);

    const activeStatuses = new Set(["confirmada", "hospedado"]);
    const monthlyRevenue = reservas
      .filter((reserva) => toDateOnly(reserva.dataReserva).startsWith(monthPrefix))
      .reduce((sum, reserva) => sum + Number(reserva.valorTotalReserva), 0);

    const activeReservations = reservas.filter((reserva) => activeStatuses.has(reserva.statusReserva))
      .length;

    const occupiedChales = new Set(
      reservas.filter((reserva) => activeStatuses.has(reserva.statusReserva)).map((reserva) => reserva.idChale)
    ).size;

    return {
      occupancyRate: totalChales ? Math.round((occupiedChales / totalChales) * 100) : 0,
      monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
      activeReservations,
      maintenanceOpen,
      todayCheckins: reservas.filter((reserva) => toDateOnly(reserva.dataCheckinPrevisto) === todayIso).length,
      todayCheckouts: reservas.filter((reserva) => toDateOnly(reserva.dataCheckoutPrevisto) === todayIso).length,
      recentReservations: reservas.slice(0, 5).map((item) => ({
        id: item.id,
        cliente: item.cliente.nomeCompleto,
        chale: item.chale.nome,
        checkin: toDateOnly(item.dataCheckinPrevisto),
        checkout: toDateOnly(item.dataCheckoutPrevisto),
        status: item.statusReserva,
        origem: item.origemReserva,
        valorTotal: Number(item.valorTotalReserva)
      }))
    };
  }

  const today = new Date().toISOString().slice(0, 10);
  const activeStatuses = new Set(["confirmada", "hospedado"]);
  const monthlyRevenue = store.reservas
    .filter((reserva) => reserva.dataReserva.slice(0, 7) === today.slice(0, 7))
    .reduce((sum, reserva) => sum + reserva.valorTotalReserva, 0);

  const activeReservations = store.reservas.filter((reserva) =>
    activeStatuses.has(reserva.statusReserva)
  ).length;

  const occupiedChales = new Set(
    store.reservas
      .filter((reserva) => activeStatuses.has(reserva.statusReserva))
      .map((reserva) => reserva.idChale)
  ).size;

  const occupancyRate = store.chales.length
    ? Math.round((occupiedChales / store.chales.length) * 100)
    : 0;

  const todayCheckins = store.reservas.filter(
    (reserva) => reserva.dataCheckinPrevisto === today
  ).length;
  const todayCheckouts = store.reservas.filter(
    (reserva) => reserva.dataCheckoutPrevisto === today
  ).length;

  return {
    occupancyRate,
    monthlyRevenue: Number(monthlyRevenue.toFixed(2)),
    activeReservations,
    maintenanceOpen: store.chales.filter((item) => item.status === "manutencao").length,
    todayCheckins,
    todayCheckouts,
    recentReservations: getReservationListItems().slice(-5).reverse()
  };
}
