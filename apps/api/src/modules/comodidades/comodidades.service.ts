import { prisma } from "../../lib/prisma.js";
import { isMockMode } from "../../lib/data-source.js";
import { AppError } from "../../lib/http.js";
import { nextId, normalizeComodidade, store } from "../../lib/store.js";
import { ChaleComodidadesInput, ComodidadeInput } from "./comodidades.schemas.js";

function mapComodidade(item: {
  id: number;
  nome: string;
  descricao: string;
  status: string;
}) {
  return {
    id: item.id,
    nome: item.nome,
    descricao: item.descricao,
    status: item.status
  };
}

function mapChaleComodidade(item: {
  idComodidade: number;
  observacao: string | null;
  comodidade: {
    nome: string;
    descricao: string;
    status: string;
  };
}) {
  return {
    idComodidade: item.idComodidade,
    nome: item.comodidade.nome,
    descricao: item.comodidade.descricao,
    status: item.comodidade.status,
    observacao: item.observacao ?? ""
  };
}

export async function listComodidades() {
  if (isMockMode()) {
    return store.comodidades.map(mapComodidade).sort((a, b) => a.nome.localeCompare(b.nome));
  }

  const items = await prisma.comodidade.findMany({
    orderBy: {
      nome: "asc"
    }
  });

  return items.map(mapComodidade);
}

export async function createComodidade(input: ComodidadeInput) {
  const payload = normalizeComodidade(input);

  if (isMockMode()) {
    const nextItem = {
      id: nextId("comodidades"),
      ...payload
    };

    store.comodidades.push(nextItem);
    return nextItem;
  }

  const item = await prisma.comodidade.create({
    data: payload
  });

  return mapComodidade(item);
}

export async function updateComodidade(id: number, input: ComodidadeInput) {
  const payload = normalizeComodidade(input);

  if (isMockMode()) {
    const index = store.comodidades.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("Comodidade nao encontrada", 404);
    }

    const nextItem = {
      ...store.comodidades[index],
      ...payload
    };

    store.comodidades[index] = nextItem;
    return nextItem;
  }

  const existingItem = await prisma.comodidade.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError("Comodidade nao encontrada", 404);
  }

  const item = await prisma.comodidade.update({
    where: { id },
    data: payload
  });

  return mapComodidade(item);
}

export async function deleteComodidade(id: number) {
  if (isMockMode()) {
    const item = store.comodidades.find((entry) => entry.id === id);
    if (!item) {
      throw new AppError("Comodidade nao encontrada", 404);
    }

    const linkedItems = store.chaleComodidades.filter((entry) => entry.idComodidade === id);
    if (linkedItems.length > 0) {
      throw new AppError("Nao e possivel excluir uma comodidade vinculada a um chale", 409);
    }

    store.comodidades = store.comodidades.filter((entry) => entry.id !== id);
    return { success: true };
  }

  const existingItem = await prisma.comodidade.findUnique({
    where: { id }
  });

  if (!existingItem) {
    throw new AppError("Comodidade nao encontrada", 404);
  }

  const linkedItems = await prisma.chaleComodidade.count({
    where: {
      idComodidade: id
    }
  });

  if (linkedItems > 0) {
    throw new AppError("Nao e possivel excluir uma comodidade vinculada a um chale", 409);
  }

  await prisma.comodidade.delete({
    where: { id }
  });

  return { success: true };
}

export async function listChaleComodidades(idChale: number) {
  if (isMockMode()) {
    const chale = store.chales.find((item) => item.id === idChale);
    if (!chale) {
      throw new AppError("Chale nao encontrado", 404);
    }

    return store.chaleComodidades
      .filter((item) => item.idChale === idChale)
      .map((item) => {
        const comodidade = store.comodidades.find((entry) => entry.id === item.idComodidade);

        if (!comodidade) {
          throw new AppError("Comodidade nao encontrada", 404);
        }

        return mapChaleComodidade({
          idComodidade: item.idComodidade,
          observacao: item.observacao,
          comodidade
        });
      })
      .sort((a, b) => a.nome.localeCompare(b.nome));
  }

  const chale = await prisma.chale.findUnique({
    where: { id: idChale }
  });

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  const items = await prisma.chaleComodidade.findMany({
    where: {
      idChale
    },
    include: {
      comodidade: true
    },
    orderBy: {
      comodidade: {
        nome: "asc"
      }
    }
  });

  return items.map(mapChaleComodidade);
}

export async function updateChaleComodidades(idChale: number, input: ChaleComodidadesInput) {
  const normalizedItems = input.itens.map((item) => ({
    idComodidade: item.idComodidade,
    observacao: item.observacao?.trim() ?? ""
  }));

  if (isMockMode()) {
    const chale = store.chales.find((item) => item.id === idChale);
    if (!chale) {
      throw new AppError("Chale nao encontrado", 404);
    }

    for (const item of normalizedItems) {
      const comodidade = store.comodidades.find((entry) => entry.id === item.idComodidade);
      if (!comodidade) {
        throw new AppError("Comodidade nao encontrada", 404);
      }
    }

    store.chaleComodidades = store.chaleComodidades.filter((item) => item.idChale !== idChale);
    store.chaleComodidades.push(
      ...normalizedItems.map((item) => ({
        idChale,
        idComodidade: item.idComodidade,
        observacao: item.observacao
      }))
    );

    return listChaleComodidades(idChale);
  }

  const chale = await prisma.chale.findUnique({
    where: { id: idChale }
  });

  if (!chale) {
    throw new AppError("Chale nao encontrado", 404);
  }

  const comodidades = await prisma.comodidade.findMany({
    where: {
      id: {
        in: normalizedItems.map((item) => item.idComodidade)
      }
    }
  });

  if (comodidades.length !== normalizedItems.length) {
    throw new AppError("Uma ou mais comodidades informadas nao existem", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.chaleComodidade.deleteMany({
      where: {
        idChale
      }
    });

    if (normalizedItems.length > 0) {
      await tx.chaleComodidade.createMany({
        data: normalizedItems.map((item) => ({
          idChale,
          idComodidade: item.idComodidade,
          observacao: item.observacao || null
        }))
      });
    }
  });

  return listChaleComodidades(idChale);
}
