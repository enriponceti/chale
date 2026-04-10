import { prisma } from "../../lib/prisma.js";
import { isMockMode } from "../../lib/data-source.js";
import { AppError } from "../../lib/http.js";
import { nextId, store } from "../../lib/store.js";
import {
  ChecklistItemModeloListItem,
  ChecklistLimpezaItemListItem,
  ChecklistLimpezaListItem
} from "../../types/domain.js";
import {
  ChecklistItemModeloInput,
  ChecklistLimpezaInput
} from "./checklists.schemas.js";

const currentUserId = 1;

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

function mapChecklistModelo(item: {
  id: number;
  descricao: string;
  area: string;
  obrigatorio: boolean;
  ordem: number;
  status: string;
}): ChecklistItemModeloListItem {
  return {
    id: item.id,
    descricao: item.descricao,
    area: item.area,
    obrigatorio: item.obrigatorio,
    ordem: item.ordem,
    status: item.status
  };
}

function mapChecklistLimpezaItem(item: {
  id: number;
  idChecklist: number;
  idItemModelo: number;
  descricao: string;
  statusItem: string;
  dataExecucao: Date | string;
  idUsuario: number;
  observacao?: string | null;
  itemModelo?: { descricao: string };
}): ChecklistLimpezaItemListItem {
  return {
    id: item.id,
    idChecklist: item.idChecklist,
    idItemModelo: item.idItemModelo,
    descricao: item.descricao,
    statusItem: item.statusItem,
    dataExecucao: toDateString(item.dataExecucao),
    idUsuario: item.idUsuario,
    observacao: item.observacao ?? "",
    itemModeloDescricao: item.itemModelo?.descricao ?? item.descricao
  };
}

function mapChecklistLimpeza(item: {
  id: number;
  idManutencao: number;
  dataInicio: Date | string;
  dataFim?: Date | string | null;
  status: string;
  idUsuario: number;
  observacao?: string | null;
  manutencao?: {
    descricaoProblema: string;
    chale: { nome: string };
  };
  itens: Array<{
    id: number;
    idChecklist: number;
    idItemModelo: number;
    descricao: string;
    statusItem: string;
    dataExecucao: Date | string;
    idUsuario: number;
    observacao?: string | null;
    itemModelo?: { descricao: string };
  }>;
}): ChecklistLimpezaListItem {
  return {
    id: item.id,
    idManutencao: item.idManutencao,
    manutencaoDescricao: item.manutencao?.descricaoProblema ?? "",
    chaleNome: item.manutencao?.chale.nome ?? "",
    dataInicio: toDateString(item.dataInicio),
    dataFim: toDateString(item.dataFim),
    status: item.status,
    idUsuario: item.idUsuario,
    observacao: item.observacao ?? "",
    itens: item.itens.map(mapChecklistLimpezaItem)
  };
}

export async function listChecklistModelos() {
  if (isMockMode()) {
    return [...store.checklistModelos].sort((a, b) => a.ordem - b.ordem);
  }

  const items = await prisma.checklistItemModelo.findMany({
    orderBy: [{ ordem: "asc" }, { descricao: "asc" }]
  });

  return items.map(mapChecklistModelo);
}

export async function createChecklistModelo(input: ChecklistItemModeloInput) {
  if (isMockMode()) {
    const item = {
      id: nextId("checklistModelos"),
      ...input,
      descricao: input.descricao.trim(),
      area: input.area.trim(),
      status: input.status.trim()
    };

    store.checklistModelos.push(item);
    return item;
  }

  const item = await prisma.checklistItemModelo.create({
    data: {
      descricao: input.descricao.trim(),
      area: input.area.trim(),
      obrigatorio: input.obrigatorio,
      ordem: input.ordem,
      status: input.status.trim()
    }
  });

  return mapChecklistModelo(item);
}

export async function updateChecklistModelo(id: number, input: ChecklistItemModeloInput) {
  if (isMockMode()) {
    const index = store.checklistModelos.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("Modelo de checklist nao encontrado", 404);
    }

    store.checklistModelos[index] = {
      id,
      descricao: input.descricao.trim(),
      area: input.area.trim(),
      obrigatorio: input.obrigatorio,
      ordem: input.ordem,
      status: input.status.trim()
    };

    return store.checklistModelos[index];
  }

  const existing = await prisma.checklistItemModelo.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Modelo de checklist nao encontrado", 404);
  }

  const item = await prisma.checklistItemModelo.update({
    where: { id },
    data: {
      descricao: input.descricao.trim(),
      area: input.area.trim(),
      obrigatorio: input.obrigatorio,
      ordem: input.ordem,
      status: input.status.trim()
    }
  });

  return mapChecklistModelo(item);
}

export async function deleteChecklistModelo(id: number) {
  if (isMockMode()) {
    const linked = store.checklists.some((checklist) =>
      checklist.itens.some((item) => item.idItemModelo === id)
    );
    if (linked) {
      throw new AppError("Nao e possivel excluir um modelo vinculado a um checklist", 409);
    }

    store.checklistModelos = store.checklistModelos.filter((item) => item.id !== id);
    return { success: true };
  }

  const existing = await prisma.checklistItemModelo.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Modelo de checklist nao encontrado", 404);
  }

  const linked = await prisma.checklistLimpezaItem.count({
    where: { idItemModelo: id }
  });
  if (linked > 0) {
    throw new AppError("Nao e possivel excluir um modelo vinculado a um checklist", 409);
  }

  await prisma.checklistItemModelo.delete({ where: { id } });
  return { success: true };
}

export async function listChecklistsLimpeza() {
  if (isMockMode()) {
    return [...store.checklists].sort((a, b) => b.dataInicio.localeCompare(a.dataInicio));
  }

  const items = await prisma.checklistLimpeza.findMany({
    include: {
      manutencao: {
        include: {
          chale: true
        }
      },
      itens: {
        include: {
          itemModelo: true
        },
        orderBy: {
          id: "asc"
        }
      }
    },
    orderBy: {
      dataInicio: "desc"
    }
  });

  return items.map(mapChecklistLimpeza);
}

export async function createChecklistLimpeza(input: ChecklistLimpezaInput) {
  if (isMockMode()) {
    const manutencao = store.manutencoes.find((item) => item.id === input.idManutencao);
    if (!manutencao) {
      throw new AppError("Manutencao nao encontrada", 404);
    }

    for (const item of input.itens) {
      const modelo = store.checklistModelos.find((entry) => entry.id === item.idItemModelo);
      if (!modelo) {
        throw new AppError("Modelo de checklist nao encontrado", 404);
      }
    }

    const checklistId = nextId("checklists");
    const checklist: ChecklistLimpezaListItem = {
      id: checklistId,
      idManutencao: input.idManutencao,
      manutencaoDescricao: manutencao.descricaoProblema,
      chaleNome: manutencao.chaleNome,
      dataInicio: input.dataInicio,
      dataFim: input.dataFim ?? "",
      status: input.status,
      idUsuario: currentUserId,
      observacao: input.observacao?.trim() ?? "",
      itens: input.itens.map((item) => {
        const modelo = store.checklistModelos.find((entry) => entry.id === item.idItemModelo)!;
        return {
          id: nextId("checklistItens"),
          idChecklist: checklistId,
          idItemModelo: item.idItemModelo,
          descricao: item.descricao.trim(),
          statusItem: item.statusItem,
          dataExecucao: item.dataExecucao,
          idUsuario: currentUserId,
          observacao: item.observacao?.trim() ?? "",
          itemModeloDescricao: modelo.descricao
        };
      })
    };

    store.checklists.push(checklist);
    return checklist;
  }

  const manutencao = await prisma.manutencao.findUnique({
    where: { id: input.idManutencao },
    include: { chale: true }
  });
  if (!manutencao) {
    throw new AppError("Manutencao nao encontrada", 404);
  }

  const modelos = await prisma.checklistItemModelo.findMany({
    where: {
      id: {
        in: input.itens.map((item) => item.idItemModelo)
      }
    }
  });
  if (modelos.length !== input.itens.length) {
    throw new AppError("Um ou mais modelos de checklist nao existem", 404);
  }

  const created = await prisma.checklistLimpeza.create({
    data: {
      idManutencao: input.idManutencao,
      dataInicio: new Date(`${input.dataInicio}T00:00:00.000Z`),
      dataFim: toDateOrNull(input.dataFim),
      status: input.status,
      idUsuario: currentUserId,
      observacao: input.observacao?.trim() || null,
      itens: {
        create: input.itens.map((item) => ({
          idItemModelo: item.idItemModelo,
          descricao: item.descricao.trim(),
          statusItem: item.statusItem,
          dataExecucao: new Date(`${item.dataExecucao}T00:00:00.000Z`),
          idUsuario: currentUserId,
          observacao: item.observacao?.trim() || null
        }))
      }
    },
    include: {
      manutencao: {
        include: {
          chale: true
        }
      },
      itens: {
        include: {
          itemModelo: true
        }
      }
    }
  });

  return mapChecklistLimpeza(created);
}

export async function updateChecklistLimpeza(id: number, input: ChecklistLimpezaInput) {
  if (isMockMode()) {
    const index = store.checklists.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("Checklist nao encontrado", 404);
    }

    const manutencao = store.manutencoes.find((item) => item.id === input.idManutencao);
    if (!manutencao) {
      throw new AppError("Manutencao nao encontrada", 404);
    }

    store.checklists[index] = {
      id,
      idManutencao: input.idManutencao,
      manutencaoDescricao: manutencao.descricaoProblema,
      chaleNome: manutencao.chaleNome,
      dataInicio: input.dataInicio,
      dataFim: input.dataFim ?? "",
      status: input.status,
      idUsuario: currentUserId,
      observacao: input.observacao?.trim() ?? "",
      itens: input.itens.map((item) => {
        const modelo = store.checklistModelos.find((entry) => entry.id === item.idItemModelo);
        if (!modelo) {
          throw new AppError("Modelo de checklist nao encontrado", 404);
        }

        return {
          id: nextId("checklistItens"),
          idChecklist: id,
          idItemModelo: item.idItemModelo,
          descricao: item.descricao.trim(),
          statusItem: item.statusItem,
          dataExecucao: item.dataExecucao,
          idUsuario: currentUserId,
          observacao: item.observacao?.trim() ?? "",
          itemModeloDescricao: modelo.descricao
        };
      })
    };

    return store.checklists[index];
  }

  const existing = await prisma.checklistLimpeza.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Checklist nao encontrado", 404);
  }

  const manutencao = await prisma.manutencao.findUnique({
    where: { id: input.idManutencao }
  });
  if (!manutencao) {
    throw new AppError("Manutencao nao encontrada", 404);
  }

  await prisma.$transaction(async (tx) => {
    await tx.checklistLimpezaItem.deleteMany({
      where: { idChecklist: id }
    });

    await tx.checklistLimpeza.update({
      where: { id },
      data: {
        idManutencao: input.idManutencao,
        dataInicio: new Date(`${input.dataInicio}T00:00:00.000Z`),
        dataFim: toDateOrNull(input.dataFim),
        status: input.status,
        observacao: input.observacao?.trim() || null,
        itens: {
          create: input.itens.map((item) => ({
            idItemModelo: item.idItemModelo,
            descricao: item.descricao.trim(),
            statusItem: item.statusItem,
            dataExecucao: new Date(`${item.dataExecucao}T00:00:00.000Z`),
            idUsuario: currentUserId,
            observacao: item.observacao?.trim() || null
          }))
        }
      }
    });
  });

  const updated = await prisma.checklistLimpeza.findUniqueOrThrow({
    where: { id },
    include: {
      manutencao: {
        include: {
          chale: true
        }
      },
      itens: {
        include: {
          itemModelo: true
        }
      }
    }
  });

  return mapChecklistLimpeza(updated);
}

export async function deleteChecklistLimpeza(id: number) {
  if (isMockMode()) {
    const index = store.checklists.findIndex((item) => item.id === id);
    if (index < 0) {
      throw new AppError("Checklist nao encontrado", 404);
    }

    store.checklists.splice(index, 1);
    return { success: true };
  }

  const existing = await prisma.checklistLimpeza.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError("Checklist nao encontrado", 404);
  }

  await prisma.checklistLimpeza.delete({ where: { id } });
  return { success: true };
}
