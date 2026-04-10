import {
  fallbackChales,
  fallbackClientes,
  fallbackDashboard,
  fallbackReservas,
  fallbackReservasDetalhadas
} from "./fallback-data";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:3333/api";

export type LoginInput = {
  email: string;
  senha: string;
};

export type AuthUser = {
  id: string;
  nome: string;
  email: string;
  perfil: string;
};

export type AuthSession = {
  token: string;
  user: AuthUser;
};

export type ChaleListItem = {
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
  valorDiariaBase: number;
  areaM2: number;
  localizacaoInterna: string;
  checkinPadrao: string;
  checkoutPadrao: string;
};

export type ClienteListItem = {
  id: number;
  nomeCompleto: string;
  cpf: string;
  rg: string;
  documentoEstrangeiro: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  celular: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  status: string;
  observacao: string;
};

export type ComodidadeListItem = {
  id: number;
  nome: string;
  descricao: string;
  status: string;
};

export type ComodidadeInput = {
  nome: string;
  descricao: string;
  status: string;
};

export type ManutencaoListItem = {
  id: number;
  idChale: number;
  chaleNome: string;
  chaleCodigo: string;
  tipoManutencao: string;
  descricaoProblema: string;
  dataAbertura: string;
  dataInicio: string;
  dataFim: string;
  status: string;
  responsavel: string;
  fornecedor: string;
  custo: number;
  observacao: string;
};

export type ManutencaoInput = {
  idChale: number;
  tipoManutencao: "preventiva" | "corretiva" | "limpeza" | "inspescao";
  descricaoProblema: string;
  dataAbertura: string;
  dataInicio: string;
  dataFim: string;
  status: "aberta" | "em_andamento" | "concluida" | "cancelada";
  responsavel: string;
  fornecedor: string;
  custo: number;
  observacao: string;
};

export type ChecklistItemModeloListItem = {
  id: number;
  descricao: string;
  area: string;
  obrigatorio: boolean;
  ordem: number;
  status: string;
};

export type ChecklistItemModeloInput = {
  descricao: string;
  area: string;
  obrigatorio: boolean;
  ordem: number;
  status: string;
};

export type ChecklistLimpezaItemListItem = {
  id: number;
  idChecklist: number;
  idItemModelo: number;
  descricao: string;
  statusItem: "pendente" | "concluido" | "nao_aplicavel";
  dataExecucao: string;
  idUsuario: number;
  observacao: string;
  itemModeloDescricao: string;
};

export type ChecklistLimpezaListItem = {
  id: number;
  idManutencao: number;
  manutencaoDescricao: string;
  chaleNome: string;
  dataInicio: string;
  dataFim: string;
  status: "aberto" | "em_andamento" | "concluido" | "cancelado";
  idUsuario: number;
  observacao: string;
  itens: ChecklistLimpezaItemListItem[];
};

export type ChecklistLimpezaItemInput = {
  idItemModelo: number;
  descricao: string;
  statusItem: "pendente" | "concluido" | "nao_aplicavel";
  dataExecucao: string;
  observacao: string;
};

export type ChecklistLimpezaInput = {
  idManutencao: number;
  dataInicio: string;
  dataFim: string;
  status: "aberto" | "em_andamento" | "concluido" | "cancelado";
  observacao: string;
  itens: ChecklistLimpezaItemInput[];
};

export type ChaleComodidadeItem = {
  idComodidade: number;
  nome: string;
  descricao: string;
  status: string;
  observacao: string;
};

export type ReservaListItem = {
  id: number;
  cliente: string;
  chale: string;
  checkin: string;
  checkout: string;
  status: string;
  origem: string;
  valorTotal: number;
};

export type ReservaEntity = {
  id: number;
  idChale: number;
  idCliente: number;
  dataReserva: string;
  dataCheckinPrevisto: string;
  dataCheckoutPrevisto: string;
  dataCheckinReal: string;
  dataCheckoutReal: string;
  qtdAdultos: number;
  qtdCriancas: number;
  qtdHospedes: number;
  qtdNoites: number;
  valorDiariaAplicada: number;
  valorTotalHospedagem: number;
  valorDesconto: number;
  valorTaxaLimpeza: number;
  valorTaxaExtra: number;
  valorTotalReserva: number;
  statusReserva: string;
  origemReserva: string;
  observacao: string;
};

export type ChaleInput = {
  codigo: string;
  nome: string;
  descricao: string;
  status: "ativo" | "inativo" | "manutencao";
  capacidadeMaxima: number;
  qtdQuartos: number;
  qtdBanheiros: number;
  qtdCamasCasal: number;
  qtdCamasSolteiro: number;
  valorDiariaBase: number;
  areaM2: number;
  localizacaoInterna: string;
  checkinPadrao: string;
  checkoutPadrao: string;
};

export type ClienteInput = {
  nomeCompleto: string;
  cpf: string;
  rg: string;
  documentoEstrangeiro: string;
  dataNascimento: string;
  telefone: string;
  email: string;
  celular: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  pais: string;
  status: string;
  observacao: string;
};

export type ReservaInput = {
  idChale: number;
  idCliente: number;
  dataCheckinPrevisto: string;
  dataCheckoutPrevisto: string;
  dataCheckinReal?: string;
  dataCheckoutReal?: string;
  qtdAdultos: number;
  qtdCriancas: number;
  valorDiariaAplicada: number;
  valorDesconto: number;
  valorTaxaLimpeza: number;
  valorTaxaExtra: number;
  statusReserva: "pendente" | "confirmada" | "hospedado" | "finalizada" | "cancelada" | "no_show";
  origemReserva: string;
  observacao: string;
};

type ApiErrorPayload = {
  message?: string;
  issues?: {
    formErrors?: string[];
    fieldErrors?: Record<string, string[] | undefined>;
  };
} | null;

function formatApiError(payload: ApiErrorPayload, fallback: string) {
  if (!payload) {
    return fallback;
  }

  const parts: string[] = [];

  if (payload.message) {
    parts.push(payload.message);
  }

  if (payload.issues?.formErrors?.length) {
    parts.push(...payload.issues.formErrors);
  }

  if (payload.issues?.fieldErrors) {
    for (const [field, messages] of Object.entries(payload.issues.fieldErrors)) {
      if (!messages?.length) {
        continue;
      }

      const label = field
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (value) => value.toUpperCase());

      parts.push(`${label}: ${messages.join(", ")}`);
    }
  }

  return parts.length ? parts.join(" | ") : fallback;
}

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      cache: "no-store"
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export async function getDashboard() {
  return safeFetch("/dashboard", fallbackDashboard);
}

export async function getReservas() {
  return safeFetch<ReservaListItem[]>("/reservas", fallbackReservas);
}

export async function getChales() {
  return safeFetch<ChaleListItem[]>("/chales", fallbackChales);
}

export async function getClientes() {
  return safeFetch<ClienteListItem[]>("/clientes", fallbackClientes);
}

export async function getComodidades() {
  return safeFetch<ComodidadeListItem[]>("/comodidades", []);
}

export async function getManutencoes() {
  return safeFetch<ManutencaoListItem[]>("/manutencoes", []);
}

export async function getChecklistModelos() {
  return safeFetch<ChecklistItemModeloListItem[]>("/checklist-modelos", []);
}

export async function getChecklistsLimpeza() {
  return safeFetch<ChecklistLimpezaListItem[]>("/checklists-limpeza", []);
}

export async function getChaleComodidades(idChale: number) {
  return safeFetch<ChaleComodidadeItem[]>(`/chales/${idChale}/comodidades`, []);
}

export async function getReservasDetalhadas() {
  return safeFetch<ReservaEntity[]>("/reservas/detalhadas", fallbackReservasDetalhadas);
}

export async function loginRequest(input: LoginInput): Promise<AuthSession> {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload;
    throw new Error(formatApiError(payload, "Nao foi possivel autenticar com a API."));
  }

  return (await response.json()) as AuthSession;
}

export async function authorizedJson<T>(
  path: string,
  token: string,
  init: RequestInit = {}
): Promise<T> {
  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as ApiErrorPayload;
    throw new Error(formatApiError(payload, "Falha na requisicao autenticada."));
  }

  return (await response.json()) as T;
}
