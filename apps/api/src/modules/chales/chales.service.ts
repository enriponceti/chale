import { prisma } from "../../lib/prisma.js";
import { fromTimeValue, toTimeValue } from "../../lib/date.js";
import { isMockMode } from "../../lib/data-source.js";
import { AppError } from "../../lib/http.js";
import { nextId, store } from "../../lib/store.js";
import { ChaleInput } from "./chales.schemas.js";

function mapChale(item: {
  id: number;
  codigo: string;
  nome: string;
  descricao: string;
  status: string;
  capacidadeMaxima: number;
  qtdQuartos: number;
  qtdBanheiros: number;
  qtdCamasCasal: number;
  qtdCamasSolteiro: number;
  valorDiariaBase: { toString(): string } | number;
  areaM2: { toString(): string } | number;
  localizacaoInterna: string;
  checkinPadrao: Date | string;
  checkoutPadrao: Date | string;
}) {
  return {
    id: item.id,
    codigo: item.codigo,
    nome: item.nome,
    descricao: item.descricao,
    status: item.status,
    capacidadeMaxima: item.capacidadeMaxima,
    qtdQuartos: item.qtdQuartos,
    qtdBanheiros: item.qtdBanheiros,
    qtdCamasCasal: item.qtdCamasCasal,
    qtdCamasSolteiro: item.qtdCamasSolteiro,
    valorDiariaBase: Number(item.valorDiariaBase),
    areaM2: Number(item.areaM2),
    localizacaoInterna: item.localizacaoInterna,
    checkinPadrao: fromTimeValue(item.checkinPadrao),
    checkoutPadrao: fromTimeValue(item.checkoutPadrao)
  };
}

export async function listChales() {
  if (isMockMode()) {
    return store.chales;
  }

  const items = await prisma.chale.findMany({
    orderBy: {
      nome: "asc"
    }
  });

  return items.map(mapChale);
}

export async function createChale(input: ChaleInput) {
  if (isMockMode()) {
    const alreadyExists = store.chales.some(
      (item) => item.codigo.toLowerCase() === input.codigo.toLowerCase()
    );

    if (alreadyExists) {
      throw new AppError("Ja existe um chale com esse codigo", 409);
    }

    const chale = {
      id: nextId("chales"),
      ...input
    };

    store.chales.push(chale);
    return chale;
  }

  const alreadyExists = await prisma.chale.findUnique({
    where: {
      codigo: input.codigo
    }
  });

  if (alreadyExists) {
    throw new AppError("Ja existe um chale com esse codigo", 409);
  }

  const chale = await prisma.chale.create({
    data: {
      codigo: input.codigo,
      nome: input.nome,
      descricao: input.descricao,
      status: input.status,
      capacidadeMaxima: input.capacidadeMaxima,
      qtdQuartos: input.qtdQuartos,
      qtdBanheiros: input.qtdBanheiros,
      qtdCamasCasal: input.qtdCamasCasal,
      qtdCamasSolteiro: input.qtdCamasSolteiro,
      valorDiariaBase: input.valorDiariaBase,
      areaM2: input.areaM2,
      localizacaoInterna: input.localizacaoInterna,
      checkinPadrao: toTimeValue(input.checkinPadrao),
      checkoutPadrao: toTimeValue(input.checkoutPadrao),
      dataCadastro: new Date(),
      dataAtualizacao: new Date()
    }
  });

  return mapChale(chale);
}

export async function updateChale(id: number, input: ChaleInput) {
  if (isMockMode()) {
    const index = store.chales.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new AppError("Chale nao encontrado", 404);
    }

    store.chales[index] = {
      id,
      ...input
    };

    return store.chales[index];
  }

  const existing = await prisma.chale.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError("Chale nao encontrado", 404);
  }

  const chale = await prisma.chale.update({
    where: { id },
    data: {
      codigo: input.codigo,
      nome: input.nome,
      descricao: input.descricao,
      status: input.status,
      capacidadeMaxima: input.capacidadeMaxima,
      qtdQuartos: input.qtdQuartos,
      qtdBanheiros: input.qtdBanheiros,
      qtdCamasCasal: input.qtdCamasCasal,
      qtdCamasSolteiro: input.qtdCamasSolteiro,
      valorDiariaBase: input.valorDiariaBase,
      areaM2: input.areaM2,
      localizacaoInterna: input.localizacaoInterna,
      checkinPadrao: toTimeValue(input.checkinPadrao),
      checkoutPadrao: toTimeValue(input.checkoutPadrao),
      dataCadastro: existing.dataCadastro,
      dataAtualizacao: new Date()
    }
  });

  return mapChale(chale);
}

export async function deleteChale(id: number) {
  if (isMockMode()) {
    const chaleHasReservations = store.reservas.some((item) => item.idChale === id);
    if (chaleHasReservations) {
      throw new AppError("Nao e possivel remover um chale com reservas vinculadas", 409);
    }

    const index = store.chales.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new AppError("Chale nao encontrado", 404);
    }

    const [removed] = store.chales.splice(index, 1);
    return removed;
  }

  const hasReservations = await prisma.reserva.count({
    where: {
      idChale: id
    }
  });

  if (hasReservations > 0) {
    throw new AppError("Nao e possivel remover um chale com reservas vinculadas", 409);
  }

  const chale = await prisma.chale.findUnique({
    where: { id }
  });

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  await prisma.chale.delete({
    where: { id }
  });

  return mapChale(chale);
}
