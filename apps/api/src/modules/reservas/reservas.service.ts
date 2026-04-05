import { prisma } from "../../lib/prisma.js";
import { toDateOnly } from "../../lib/date.js";
import { isMockMode } from "../../lib/data-source.js";
import { AppError } from "../../lib/http.js";
import { getReservationListItems, nextId, store } from "../../lib/store.js";
import { ReservationEntity } from "../../types/domain.js";
import { ReservaInput } from "./reservas.schemas.js";

function mapReservationEntity(item: {
  id: number;
  idChale: number;
  idCliente: number;
  dataReserva: Date;
  dataCheckinPrevisto: Date;
  dataCheckoutPrevisto: Date;
  dataCheckinReal: Date | null;
  dataCheckoutReal: Date | null;
  qtdAdultos: number;
  qtdCriancas: number;
  qtdHospedes: number;
  qtdNoites: number;
  valorDiariaAplicada: { toString(): string } | number;
  valorTotalHospedagem: { toString(): string } | number;
  valorDesconto: { toString(): string } | number | null;
  valorTaxaLimpeza: { toString(): string } | number | null;
  valorTaxaExtra: { toString(): string } | number | null;
  valorTotalReserva: { toString(): string } | number;
  statusReserva: string;
  origemReserva: string;
  observacao: string | null;
}): ReservationEntity {
  return {
    id: item.id,
    idChale: item.idChale,
    idCliente: item.idCliente,
    dataReserva: toDateOnly(item.dataReserva),
    dataCheckinPrevisto: toDateOnly(item.dataCheckinPrevisto),
    dataCheckoutPrevisto: toDateOnly(item.dataCheckoutPrevisto),
    dataCheckinReal: item.dataCheckinReal ? toDateOnly(item.dataCheckinReal) : "",
    dataCheckoutReal: item.dataCheckoutReal ? toDateOnly(item.dataCheckoutReal) : "",
    qtdAdultos: item.qtdAdultos,
    qtdCriancas: item.qtdCriancas,
    qtdHospedes: item.qtdHospedes,
    qtdNoites: item.qtdNoites,
    valorDiariaAplicada: Number(item.valorDiariaAplicada),
    valorTotalHospedagem: Number(item.valorTotalHospedagem),
    valorDesconto: Number(item.valorDesconto ?? 0),
    valorTaxaLimpeza: Number(item.valorTaxaLimpeza ?? 0),
    valorTaxaExtra: Number(item.valorTaxaExtra ?? 0),
    valorTotalReserva: Number(item.valorTotalReserva),
    statusReserva: item.statusReserva,
    origemReserva: item.origemReserva,
    observacao: item.observacao ?? ""
  };
}

export async function listReservas() {
  if (isMockMode()) {
    return getReservationListItems();
  }

  const reservas = await prisma.reserva.findMany({
    include: {
      cliente: true,
      chale: true
    },
    orderBy: {
      dataCheckinPrevisto: "asc"
    }
  });

  return reservas.map((item) => ({
    id: item.id,
    cliente: item.cliente.nomeCompleto,
    chale: item.chale.nome,
    checkin: toDateOnly(item.dataCheckinPrevisto),
    checkout: toDateOnly(item.dataCheckoutPrevisto),
    status: item.statusReserva,
    origem: item.origemReserva,
    valorTotal: Number(item.valorTotalReserva)
  }));
}

export async function listReservasDetalhadas() {
  if (isMockMode()) {
    return store.reservas;
  }

  const reservas = await prisma.reserva.findMany({
    orderBy: {
      dataCheckinPrevisto: "asc"
    }
  });

  return reservas.map(mapReservationEntity);
}

function calculateNights(checkin: string, checkout: string) {
  const start = new Date(`${checkin}T00:00:00Z`);
  const end = new Date(`${checkout}T00:00:00Z`);
  const diff = end.getTime() - start.getTime();
  return Math.round(diff / (1000 * 60 * 60 * 24));
}

function hasDateConflict(input: ReservaInput, reservationId?: number) {
  const protectedStatuses = new Set(["confirmada", "hospedado"]);
  const start = new Date(`${input.dataCheckinPrevisto}T00:00:00Z`);
  const end = new Date(`${input.dataCheckoutPrevisto}T00:00:00Z`);

  return store.reservas.some((reserva) => {
    if (reservationId && reserva.id === reservationId) {
      return false;
    }

    if (reserva.idChale !== input.idChale) {
      return false;
    }

    if (!protectedStatuses.has(reserva.statusReserva)) {
      return false;
    }

    const existingStart = new Date(`${reserva.dataCheckinPrevisto}T00:00:00Z`);
    const existingEnd = new Date(`${reserva.dataCheckoutPrevisto}T00:00:00Z`);

    return start < existingEnd && end > existingStart;
  });
}

async function hasDateConflictInPrisma(input: ReservaInput, reservationId?: number) {
  const protectedStatuses = ["confirmada", "hospedado"];
  const conflicts = await prisma.reserva.count({
    where: {
      idChale: input.idChale,
      statusReserva: {
        in: protectedStatuses
      },
      NOT: reservationId
        ? {
            id: reservationId
          }
        : undefined,
      dataCheckinPrevisto: {
        lt: new Date(`${input.dataCheckoutPrevisto}T00:00:00.000Z`)
      },
      dataCheckoutPrevisto: {
        gt: new Date(`${input.dataCheckinPrevisto}T00:00:00.000Z`)
      }
    }
  });

  return conflicts > 0;
}

function buildReservation(
  input: ReservaInput,
  id: number,
  existing?: ReservationEntity
): ReservationEntity {
  const chale = store.chales.find((item) => item.id === input.idChale);
  const cliente = store.clientes.find((item) => item.id === input.idCliente);

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  if (!cliente) {
    throw new AppError("Cliente nao encontrado", 404);
  }

  if (chale.status === "manutencao") {
    throw new AppError("Este chale esta em manutencao e nao pode receber reserva", 409);
  }

  const qtdHospedes = input.qtdAdultos + input.qtdCriancas;
  if (qtdHospedes > chale.capacidadeMaxima) {
    throw new AppError("Quantidade de hospedes excede a capacidade do chale", 409);
  }

  const qtdNoites = calculateNights(input.dataCheckinPrevisto, input.dataCheckoutPrevisto);
  if (qtdNoites <= 0) {
    throw new AppError("A data de checkout deve ser posterior ao check-in", 422);
  }

  if (hasDateConflict(input, id)) {
    throw new AppError("Ja existe reserva confirmada para esse chale no periodo informado", 409);
  }

  const valorTotalHospedagem = Number((input.valorDiariaAplicada * qtdNoites).toFixed(2));
  const valorTotalReserva = Number(
    (
      valorTotalHospedagem +
      input.valorTaxaLimpeza +
      input.valorTaxaExtra -
      input.valorDesconto
    ).toFixed(2)
  );

  const dataCheckinReal = input.dataCheckinReal || existing?.dataCheckinReal || "";
  const dataCheckoutReal = input.dataCheckoutReal || existing?.dataCheckoutReal || "";

  let statusReserva = input.statusReserva;
  if (dataCheckinReal && statusReserva === "pendente") {
    statusReserva = "confirmada";
  }

  if (dataCheckoutReal) {
    statusReserva = "finalizada";
  }

  return {
    id,
    idChale: input.idChale,
    idCliente: input.idCliente,
    dataReserva: existing?.dataReserva ?? new Date().toISOString().slice(0, 10),
    dataCheckinPrevisto: input.dataCheckinPrevisto,
    dataCheckoutPrevisto: input.dataCheckoutPrevisto,
    dataCheckinReal,
    dataCheckoutReal,
    qtdAdultos: input.qtdAdultos,
    qtdCriancas: input.qtdCriancas,
    qtdHospedes,
    qtdNoites,
    valorDiariaAplicada: input.valorDiariaAplicada,
    valorTotalHospedagem,
    valorDesconto: input.valorDesconto,
    valorTaxaLimpeza: input.valorTaxaLimpeza,
    valorTaxaExtra: input.valorTaxaExtra,
    valorTotalReserva,
    statusReserva,
    origemReserva: input.origemReserva,
    observacao: input.observacao
  };
}

export function createReserva(input: ReservaInput) {
  if (!isMockMode()) {
    return createReservaInPrisma(input);
  }

  const reserva = buildReservation(input, nextId("reservas"));
  store.reservas.push(reserva);
  return reserva;
}

export function updateReserva(id: number, input: ReservaInput) {
  if (!isMockMode()) {
    return updateReservaInPrisma(id, input);
  }

  const index = store.reservas.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new AppError("Reserva nao encontrada", 404);
  }

  store.reservas[index] = buildReservation(input, id, store.reservas[index]);
  return store.reservas[index];
}

export function deleteReserva(id: number) {
  if (!isMockMode()) {
    return deleteReservaInPrisma(id);
  }

  const index = store.reservas.findIndex((item) => item.id === id);
  if (index === -1) {
    throw new AppError("Reserva nao encontrada", 404);
  }

  const [removed] = store.reservas.splice(index, 1);
  return removed;
}

async function createReservaInPrisma(input: ReservaInput) {
  const chale = await prisma.chale.findUnique({
    where: { id: input.idChale }
  });
  const cliente = await prisma.cliente.findUnique({
    where: { id: input.idCliente }
  });

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  if (!cliente) {
    throw new AppError("Cliente nao encontrado", 404);
  }

  if (chale.status === "manutencao") {
    throw new AppError("Este chale esta em manutencao e nao pode receber reserva", 409);
  }

  const qtdHospedes = input.qtdAdultos + input.qtdCriancas;
  if (qtdHospedes > chale.capacidadeMaxima) {
    throw new AppError("Quantidade de hospedes excede a capacidade do chale", 409);
  }

  const qtdNoites = calculateNights(input.dataCheckinPrevisto, input.dataCheckoutPrevisto);
  if (qtdNoites <= 0) {
    throw new AppError("A data de checkout deve ser posterior ao check-in", 422);
  }

  if (await hasDateConflictInPrisma(input)) {
    throw new AppError("Ja existe reserva confirmada para esse chale no periodo informado", 409);
  }

  const valorTotalHospedagem = Number((input.valorDiariaAplicada * qtdNoites).toFixed(2));
  const valorTotalReserva = Number(
    (
      valorTotalHospedagem +
      input.valorTaxaLimpeza +
      input.valorTaxaExtra -
      input.valorDesconto
    ).toFixed(2)
  );

  const reserva = await prisma.reserva.create({
    data: {
      idChale: input.idChale,
      idCliente: input.idCliente,
      dataReserva: new Date(),
      dataCheckinPrevisto: new Date(`${input.dataCheckinPrevisto}T00:00:00.000Z`),
      dataCheckoutPrevisto: new Date(`${input.dataCheckoutPrevisto}T00:00:00.000Z`),
      dataCheckinReal: input.dataCheckinReal
        ? new Date(`${input.dataCheckinReal}T00:00:00.000Z`)
        : null,
      dataCheckoutReal: input.dataCheckoutReal
        ? new Date(`${input.dataCheckoutReal}T00:00:00.000Z`)
        : null,
      qtdAdultos: input.qtdAdultos,
      qtdCriancas: input.qtdCriancas,
      qtdHospedes,
      qtdNoites,
      valorDiariaAplicada: input.valorDiariaAplicada,
      valorTotalHospedagem,
      valorDesconto: input.valorDesconto,
      valorTaxaLimpeza: input.valorTaxaLimpeza,
      valorTaxaExtra: input.valorTaxaExtra,
      valorTotalReserva,
      statusReserva:
        input.dataCheckoutReal
          ? "finalizada"
          : input.dataCheckinReal && input.statusReserva === "pendente"
            ? "confirmada"
            : input.statusReserva,
      origemReserva: input.origemReserva,
      observacao: input.observacao
    }
  });

  return mapReservationEntity(reserva);
}

async function updateReservaInPrisma(id: number, input: ReservaInput) {
  const existing = await prisma.reserva.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError("Reserva nao encontrada", 404);
  }

  const chale = await prisma.chale.findUnique({
    where: { id: input.idChale }
  });

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  const qtdHospedes = input.qtdAdultos + input.qtdCriancas;
  if (qtdHospedes > chale.capacidadeMaxima) {
    throw new AppError("Quantidade de hospedes excede a capacidade do chale", 409);
  }

  const qtdNoites = calculateNights(input.dataCheckinPrevisto, input.dataCheckoutPrevisto);
  if (qtdNoites <= 0) {
    throw new AppError("A data de checkout deve ser posterior ao check-in", 422);
  }

  if (await hasDateConflictInPrisma(input, id)) {
    throw new AppError("Ja existe reserva confirmada para esse chale no periodo informado", 409);
  }

  const valorTotalHospedagem = Number((input.valorDiariaAplicada * qtdNoites).toFixed(2));
  const valorTotalReserva = Number(
    (
      valorTotalHospedagem +
      input.valorTaxaLimpeza +
      input.valorTaxaExtra -
      input.valorDesconto
    ).toFixed(2)
  );

  const reserva = await prisma.reserva.update({
    where: { id },
    data: {
      idChale: input.idChale,
      idCliente: input.idCliente,
      dataCheckinPrevisto: new Date(`${input.dataCheckinPrevisto}T00:00:00.000Z`),
      dataCheckoutPrevisto: new Date(`${input.dataCheckoutPrevisto}T00:00:00.000Z`),
      dataCheckinReal: input.dataCheckinReal
        ? new Date(`${input.dataCheckinReal}T00:00:00.000Z`)
        : null,
      dataCheckoutReal: input.dataCheckoutReal
        ? new Date(`${input.dataCheckoutReal}T00:00:00.000Z`)
        : null,
      qtdAdultos: input.qtdAdultos,
      qtdCriancas: input.qtdCriancas,
      qtdHospedes,
      qtdNoites,
      valorDiariaAplicada: input.valorDiariaAplicada,
      valorTotalHospedagem,
      valorDesconto: input.valorDesconto,
      valorTaxaLimpeza: input.valorTaxaLimpeza,
      valorTaxaExtra: input.valorTaxaExtra,
      valorTotalReserva,
      statusReserva:
        input.dataCheckoutReal
          ? "finalizada"
          : input.dataCheckinReal && input.statusReserva === "pendente"
            ? "confirmada"
            : input.statusReserva,
      origemReserva: input.origemReserva,
      observacao: input.observacao
    }
  });

  return mapReservationEntity(reserva);
}

async function deleteReservaInPrisma(id: number) {
  const reserva = await prisma.reserva.findUnique({
    where: { id }
  });

  if (!reserva) {
    throw new AppError("Reserva nao encontrada", 404);
  }

  await prisma.reserva.delete({
    where: { id }
  });

  return mapReservationEntity(reserva);
}
