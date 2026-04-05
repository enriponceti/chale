import { prisma } from "../../lib/prisma.js";
import { isMockMode } from "../../lib/data-source.js";
import { AppError } from "../../lib/http.js";
import { nextId, store } from "../../lib/store.js";
import { ClienteInput } from "./clientes.schemas.js";

function normalizeOptionalString(value: string | undefined) {
  const normalized = value?.trim();
  return normalized ? normalized : null;
}

function normalizeOptionalDate(value: string | undefined) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function mapCliente(item: {
  id: number;
  nomeCompleto: string;
  cpf: string;
  rg: string | null;
  documentoEstrangeiro: string | null;
  dataNascimento: Date | string | null;
  telefone: string | null;
  celular: string | null;
  email: string | null;
  logradouro: string | null;
  numero: string | null;
  complemento: string | null;
  bairro: string | null;
  cidade: string | null;
  estado: string | null;
  cep: string | null;
  pais: string | null;
  status: string | null;
  observacao: string | null;
}) {
  return {
    id: item.id,
    nomeCompleto: item.nomeCompleto,
    cpf: item.cpf,
    rg: item.rg ?? "",
    documentoEstrangeiro: item.documentoEstrangeiro ?? "",
    dataNascimento:
      item.dataNascimento instanceof Date
        ? item.dataNascimento.toISOString().slice(0, 10)
        : (item.dataNascimento ?? "").toString().slice(0, 10),
    telefone: item.telefone ?? "",
    celular: item.celular ?? "",
    email: item.email ?? "",
    logradouro: item.logradouro ?? "",
    numero: item.numero ?? "",
    complemento: item.complemento ?? "",
    bairro: item.bairro ?? "",
    cidade: item.cidade ?? "",
    estado: item.estado ?? "",
    cep: item.cep ?? "",
    pais: item.pais ?? "",
    status: item.status ?? "ativo",
    observacao: item.observacao ?? ""
  };
}

function normalizeClienteInput(input: ClienteInput) {
  return {
    nomeCompleto: input.nomeCompleto.trim(),
    cpf: input.cpf.trim(),
    rg: normalizeOptionalString(input.rg),
    documentoEstrangeiro: normalizeOptionalString(input.documentoEstrangeiro),
    dataNascimento: normalizeOptionalDate(input.dataNascimento),
    telefone: normalizeOptionalString(input.telefone),
    celular: normalizeOptionalString(input.celular),
    email: normalizeOptionalString(input.email),
    logradouro: normalizeOptionalString(input.logradouro),
    numero: normalizeOptionalString(input.numero),
    complemento: normalizeOptionalString(input.complemento),
    bairro: normalizeOptionalString(input.bairro),
    cidade: normalizeOptionalString(input.cidade),
    estado: normalizeOptionalString(input.estado),
    cep: normalizeOptionalString(input.cep),
    pais: normalizeOptionalString(input.pais),
    status: input.status.trim(),
    observacao: normalizeOptionalString(input.observacao)
  };
}

export async function listClientes() {
  if (isMockMode()) {
    return store.clientes;
  }

  const items = await prisma.cliente.findMany({
    orderBy: {
      nomeCompleto: "asc"
    }
  });

  return items.map(mapCliente);
}

export async function createCliente(input: ClienteInput) {
  const normalized = normalizeClienteInput(input);

  if (isMockMode()) {
    const alreadyExistsByCpf = store.clientes.some((item) => item.cpf === normalized.cpf);
    const alreadyExistsByEmail = normalized.email
      ? store.clientes.some((item) => item.email.toLowerCase() === normalized.email!.toLowerCase())
      : false;

    if (alreadyExistsByCpf) {
      throw new AppError("Ja existe um cliente com esse CPF", 409);
    }

    if (alreadyExistsByEmail) {
      throw new AppError("Ja existe um cliente com esse email", 409);
    }

    const cliente = mapCliente({
      id: nextId("clientes"),
      ...normalized
    });

    store.clientes.push(cliente);
    return cliente;
  }

  const alreadyExistsByCpf = await prisma.cliente.findUnique({
    where: {
      cpf: normalized.cpf
    }
  });

  if (alreadyExistsByCpf) {
    throw new AppError("Ja existe um cliente com esse CPF", 409);
  }

  const alreadyExistsByEmail = normalized.email
    ? await prisma.cliente.findFirst({
        where: {
          email: normalized.email
        }
      })
    : null;

  if (alreadyExistsByEmail) {
    throw new AppError("Ja existe um cliente com esse email", 409);
  }

  const cliente = await prisma.cliente.create({
    data: {
      ...normalized,
      dataCadastro: new Date()
    }
  });

  return mapCliente(cliente);
}

export async function updateCliente(id: number, input: ClienteInput) {
  const normalized = normalizeClienteInput(input);

  if (isMockMode()) {
    const index = store.clientes.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new AppError("Cliente nao encontrado", 404);
    }

    const alreadyExistsByCpf = store.clientes.some(
      (item) => item.id !== id && item.cpf === normalized.cpf
    );
    const alreadyExistsByEmail = normalized.email
      ? store.clientes.some(
          (item) => item.id !== id && item.email.toLowerCase() === normalized.email!.toLowerCase()
        )
      : false;

    if (alreadyExistsByCpf) {
      throw new AppError("Ja existe um cliente com esse CPF", 409);
    }

    if (alreadyExistsByEmail) {
      throw new AppError("Ja existe um cliente com esse email", 409);
    }

    store.clientes[index] = mapCliente({
      id,
      ...normalized
    });

    return store.clientes[index];
  }

  const existing = await prisma.cliente.findUnique({
    where: { id }
  });

  if (!existing) {
    throw new AppError("Cliente nao encontrado", 404);
  }

  const alreadyExistsByCpf = await prisma.cliente.findFirst({
    where: {
      cpf: normalized.cpf,
      id: {
        not: id
      }
    }
  });

  if (alreadyExistsByCpf) {
    throw new AppError("Ja existe um cliente com esse CPF", 409);
  }

  const alreadyExistsByEmail = normalized.email
    ? await prisma.cliente.findFirst({
        where: {
          email: normalized.email,
          id: {
            not: id
          }
        }
      })
    : null;

  if (alreadyExistsByEmail) {
    throw new AppError("Ja existe um cliente com esse email", 409);
  }

  const cliente = await prisma.cliente.update({
    where: { id },
    data: normalized
  });

  return mapCliente(cliente);
}

export async function deleteCliente(id: number) {
  if (isMockMode()) {
    const hasReservations = store.reservas.some((item) => item.idCliente === id);
    if (hasReservations) {
      throw new AppError("Nao e possivel remover um cliente com reservas vinculadas", 409);
    }

    const index = store.clientes.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new AppError("Cliente nao encontrado", 404);
    }

    const [removed] = store.clientes.splice(index, 1);
    return removed;
  }

  const hasReservations = await prisma.reserva.count({
    where: {
      idCliente: id
    }
  });

  if (hasReservations > 0) {
    throw new AppError("Nao e possivel remover um cliente com reservas vinculadas", 409);
  }

  const cliente = await prisma.cliente.findUnique({
    where: { id }
  });

  if (!cliente) {
    throw new AppError("Cliente nao encontrado", 404);
  }

  await prisma.cliente.delete({
    where: { id }
  });

  return mapCliente(cliente);
}
