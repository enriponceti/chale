import { prisma } from "../../lib/prisma.js";
import { isMockMode } from "../../lib/data-source.js";
import { AppError } from "../../lib/http.js";
import { nextId, store } from "../../lib/store.js";
import { ManutencaoListItem } from "../../types/domain.js";
import { ManutencaoInput } from "./manutencoes.schemas.js";

const activeStatuses = new Set(["aberta", "em_andamento"]);

function normalizeOptionalString(value?: string) {
  const normalized = value?.trim() ?? "";
  return normalized;
}

function toDateString(value: Date | string | null | undefined) {
  if (!value) {
    return "";
  }

  if (typeof value === "string") {
    return value.slice(0, 10);
  }

  return value.toISOString().slice(0, 10);
}

function toDateOrNull(value?: string) {
  return value ? new Date(`${value}T00:00:00.000Z`) : null;
}

function mapManutencao(item: {
  id: number;
  idChale: number;
  tipoManutencao: string;
  descricaoProblema: string;
  dataAbertura: Date | string;
  dataInicio?: Date | string | null;
  dataFim?: Date | string | null;
  status: string;
  responsavel?: string | null;
  fornecedor?: string | null;
  custo?: { toString(): string } | number | null;
  observacao?: string | null;
  chale?: {
    nome: string;
    codigo: string;
  };
}): ManutencaoListItem {
  return {
    id: item.id,
    idChale: item.idChale,
    chaleNome: item.chale?.nome ?? "",
    chaleCodigo: item.chale?.codigo ?? "",
    tipoManutencao: item.tipoManutencao,
    descricaoProblema: item.descricaoProblema,
    dataAbertura: toDateString(item.dataAbertura),
    dataInicio: toDateString(item.dataInicio),
    dataFim: toDateString(item.dataFim),
    status: item.status,
    responsavel: item.responsavel ?? "",
    fornecedor: item.fornecedor ?? "",
    custo: Number(item.custo ?? 0),
    observacao: item.observacao ?? ""
  };
}

async function syncChaleStatusInPrisma(idChale: number) {
  const activeCount = await prisma.manutencao.count({
    where: {
      idChale,
      status: {
        in: Array.from(activeStatuses)
      }
    }
  });

  await prisma.chale.update({
    where: { id: idChale },
    data: {
      status: activeCount > 0 ? "manutencao" : "ativo"
    }
  });
}

function syncChaleStatusInStore(idChale: number) {
  const chale = store.chales.find((item) => item.id === idChale);
  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  const activeCount = store.manutencoes.filter(
    (item) => item.idChale === idChale && activeStatuses.has(item.status)
  ).length;

  chale.status = activeCount > 0 ? "manutencao" : "ativo";
}

export async function listManutencoes() {
  if (isMockMode()) {
    return [...store.manutencoes].sort((a, b) => b.dataAbertura.localeCompare(a.dataAbertura));
  }

  const items = await prisma.manutencao.findMany({
    include: {
      chale: true
    },
    orderBy: {
      dataAbertura: "desc"
    }
  });

  return items.map(mapManutencao);
}

export async function createManutencao(input: ManutencaoInput) {
  if (isMockMode()) {
    const chale = store.chales.find((item) => item.id === input.idChale);
    if (!chale) {
      throw new AppError("Chale nao encontrado", 404);
    }

    const item: ManutencaoListItem = {
      id: nextId("manutencoes"),
      idChale: input.idChale,
      chaleNome: chale.nome,
      chaleCodigo: chale.codigo,
      tipoManutencao: input.tipoManutencao,
      descricaoProblema: input.descricaoProblema.trim(),
      dataAbertura: input.dataAbertura,
      dataInicio: input.dataInicio ?? "",
      dataFim: input.dataFim ?? "",
      status: input.status,
      responsavel: normalizeOptionalString(input.responsavel),
      fornecedor: normalizeOptionalString(input.fornecedor),
      custo: Number(input.custo ?? 0),
      observacao: normalizeOptionalString(input.observacao)
    };

    store.manutencoes.push(item);
    syncChaleStatusInStore(input.idChale);
    return item;
  }

  const chale = await prisma.chale.findUnique({
    where: { id: input.idChale }
  });

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  const item = await prisma.manutencao.create({
    data: {
      idChale: input.idChale,
      tipoManutencao: input.tipoManutencao,
      descricaoProblema: input.descricaoProblema.trim(),
      dataAbertura: new Date(`${input.dataAbertura}T00:00:00.000Z`),
      dataInicio: toDateOrNull(input.dataInicio),
      dataFim: toDateOrNull(input.dataFim),
      status: input.status,
      responsavel: normalizeOptionalString(input.responsavel) || null,
      fornecedor: normalizeOptionalString(input.fornecedor) || null,
      custo: Number(input.custo ?? 0),
      observacao: normalizeOptionalString(input.observacao) || null
    },
    include: {
      chale: true
    }
  });

  await syncChaleStatusInPrisma(input.idChale);
  return mapManutencao(item);
}

export async function updateManutencao(id: number, input: ManutencaoInput) {
  if (isMockMode()) {
    const index = store.manutencoes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("Manutencao nao encontrada", 404);
    }

    const chale = store.chales.find((item) => item.id === input.idChale);
    if (!chale) {
      throw new AppError("Chale nao encontrado", 404);
    }

    const previousChaleId = store.manutencoes[index].idChale;

    store.manutencoes[index] = {
      id,
      idChale: input.idChale,
      chaleNome: chale.nome,
      chaleCodigo: chale.codigo,
      tipoManutencao: input.tipoManutencao,
      descricaoProblema: input.descricaoProblema.trim(),
      dataAbertura: input.dataAbertura,
      dataInicio: input.dataInicio ?? "",
      dataFim: input.dataFim ?? "",
      status: input.status,
      responsavel: normalizeOptionalString(input.responsavel),
      fornecedor: normalizeOptionalString(input.fornecedor),
      custo: Number(input.custo ?? 0),
      observacao: normalizeOptionalString(input.observacao)
    };

    syncChaleStatusInStore(previousChaleId);
    if (previousChaleId !== input.idChale) {
      syncChaleStatusInStore(input.idChale);
    }

    return store.manutencoes[index];
  }

  const existing = await prisma.manutencao.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError("Manutencao nao encontrada", 404);
  }

  const chale = await prisma.chale.findUnique({
    where: { id: input.idChale }
  });

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  const item = await prisma.manutencao.update({
    where: { id },
    data: {
      idChale: input.idChale,
      tipoManutencao: input.tipoManutencao,
      descricaoProblema: input.descricaoProblema.trim(),
      dataAbertura: new Date(`${input.dataAbertura}T00:00:00.000Z`),
      dataInicio: toDateOrNull(input.dataInicio),
      dataFim: toDateOrNull(input.dataFim),
      status: input.status,
      responsavel: normalizeOptionalString(input.responsavel) || null,
      fornecedor: normalizeOptionalString(input.fornecedor) || null,
      custo: Number(input.custo ?? 0),
      observacao: normalizeOptionalString(input.observacao) || null
    },
    include: {
      chale: true
    }
  });

  await syncChaleStatusInPrisma(existing.idChale);
  if (existing.idChale !== input.idChale) {
    await syncChaleStatusInPrisma(input.idChale);
  }

  return mapManutencao(item);
}

export async function deleteManutencao(id: number) {
  if (isMockMode()) {
    const index = store.manutencoes.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("Manutencao nao encontrada", 404);
    }

    const [removed] = store.manutencoes.splice(index, 1);
    syncChaleStatusInStore(removed.idChale);
    return { success: true };
  }

  const existing = await prisma.manutencao.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError("Manutencao nao encontrada", 404);
  }

  await prisma.manutencao.delete({
    where: { id }
  });

  await syncChaleStatusInPrisma(existing.idChale);
  return { success: true };
}
