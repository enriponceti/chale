import {
  ChaleListItem,
  ChaleComodidadeItem,
  ComodidadeInput,
  ComodidadeListItem,
  ClienteListItem,
  ReservationEntity,
  ReservationListItem
} from "../types/domain.js";

type Counters = {
  chales: number;
  comodidades: number;
  clientes: number;
  reservas: number;
};

type Store = {
  chales: ChaleListItem[];
  comodidades: ComodidadeListItem[];
  chaleComodidades: Array<{ idChale: number; idComodidade: number; observacao: string }>;
  clientes: ClienteListItem[];
  reservas: ReservationEntity[];
  counters: Counters;
};

const initialChales: ChaleListItem[] = [
  {
    id: 1,
    codigo: "CH-001",
    nome: "Chale das Araucarias",
    descricao: "Unidade premium para casais e familias pequenas.",
    status: "ativo",
    capacidadeMaxima: 4,
    qtdQuartos: 2,
    qtdBanheiros: 1,
    qtdCamasCasal: 1,
    qtdCamasSolteiro: 2,
    valorDiariaBase: 650,
    areaM2: 45,
    localizacaoInterna: "Alameda Norte",
    checkinPadrao: "14:00",
    checkoutPadrao: "12:00"
  },
  {
    id: 2,
    codigo: "CH-002",
    nome: "Cabana da Serra",
    descricao: "Cabana ampla com vista principal do empreendimento.",
    status: "manutencao",
    capacidadeMaxima: 6,
    qtdQuartos: 3,
    qtdBanheiros: 2,
    qtdCamasCasal: 2,
    qtdCamasSolteiro: 2,
    valorDiariaBase: 740,
    areaM2: 68,
    localizacaoInterna: "Mirante Central",
    checkinPadrao: "14:00",
    checkoutPadrao: "12:00"
  },
  {
    id: 3,
    codigo: "CH-003",
    nome: "Chale Vista do Vale",
    descricao: "Unidade compacta para hospedagens romanticas.",
    status: "ativo",
    capacidadeMaxima: 2,
    qtdQuartos: 1,
    qtdBanheiros: 1,
    qtdCamasCasal: 1,
    qtdCamasSolteiro: 0,
    valorDiariaBase: 520,
    areaM2: 32,
    localizacaoInterna: "Bosque Sul",
    checkinPadrao: "14:00",
    checkoutPadrao: "12:00"
  }
];

const initialClientes: ClienteListItem[] = [
  {
    id: 1,
    nomeCompleto: "Mariana Costa",
    cpf: "12345678901",
    rg: "2001002001",
    documentoEstrangeiro: "",
    dataNascimento: "1991-04-12",
    telefone: "(85) 3333-1001",
    email: "mariana@example.com",
    celular: "(85) 99999-1001",
    logradouro: "Rua das Flores",
    numero: "128",
    complemento: "Apto 302",
    bairro: "Aldeota",
    cidade: "Fortaleza",
    estado: "CE",
    cep: "60150-160",
    pais: "Brasil",
    status: "ativo",
    observacao: "Cliente recorrente de fim de semana."
  },
  {
    id: 2,
    nomeCompleto: "Carlos Mendes",
    cpf: "23456789012",
    rg: "3002003002",
    documentoEstrangeiro: "",
    dataNascimento: "1987-09-21",
    telefone: "(81) 3222-2002",
    email: "carlos@example.com",
    celular: "(85) 99999-2002",
    logradouro: "Av. Boa Viagem",
    numero: "4500",
    complemento: "",
    bairro: "Boa Viagem",
    cidade: "Recife",
    estado: "PE",
    cep: "51021-000",
    pais: "Brasil",
    status: "ativo",
    observacao: ""
  },
  {
    id: 3,
    nomeCompleto: "Fernanda Rocha",
    cpf: "34567890123",
    rg: "4003004003",
    documentoEstrangeiro: "",
    dataNascimento: "1994-01-08",
    telefone: "(84) 3344-3003",
    email: "fernanda@example.com",
    celular: "(85) 99999-3003",
    logradouro: "Rua do Sol",
    numero: "98",
    complemento: "Casa",
    bairro: "Ponta Negra",
    cidade: "Natal",
    estado: "RN",
    cep: "59090-000",
    pais: "Brasil",
    status: "vip",
    observacao: "Prefere unidades silenciosas."
  }
];

const initialComodidades: ComodidadeListItem[] = [
  {
    id: 1,
    nome: "Lareira",
    descricao: "Ambiente com lareira interna.",
    status: "ativo"
  },
  {
    id: 2,
    nome: "Hidromassagem",
    descricao: "Banheira de hidromassagem privativa.",
    status: "ativo"
  },
  {
    id: 3,
    nome: "Vista para o vale",
    descricao: "Unidade com vista privilegiada.",
    status: "ativo"
  },
  {
    id: 4,
    nome: "Cozinha completa",
    descricao: "Cozinha equipada para longa estadia.",
    status: "ativo"
  }
];

const initialChaleComodidades: Array<{ idChale: number; idComodidade: number; observacao: string }> = [
  { idChale: 1, idComodidade: 1, observacao: "Lareira a lenha." },
  { idChale: 1, idComodidade: 3, observacao: "" },
  { idChale: 2, idComodidade: 2, observacao: "Hidro no banheiro principal." },
  { idChale: 2, idComodidade: 4, observacao: "" },
  { idChale: 3, idComodidade: 3, observacao: "" }
];

const initialReservas: ReservationEntity[] = [
  {
    id: 1001,
    idChale: 1,
    idCliente: 1,
    dataReserva: "2026-04-02",
    dataCheckinPrevisto: "2026-04-05",
    dataCheckoutPrevisto: "2026-04-08",
    dataCheckinReal: "2026-04-05",
    dataCheckoutReal: "",
    qtdAdultos: 2,
    qtdCriancas: 1,
    qtdHospedes: 3,
    qtdNoites: 3,
    valorDiariaAplicada: 650,
    valorTotalHospedagem: 1950,
    valorDesconto: 0,
    valorTaxaLimpeza: 0,
    valorTaxaExtra: 0,
    valorTotalReserva: 1950,
    statusReserva: "confirmada",
    origemReserva: "site",
    observacao: ""
  },
  {
    id: 1002,
    idChale: 3,
    idCliente: 2,
    dataReserva: "2026-04-02",
    dataCheckinPrevisto: "2026-04-06",
    dataCheckoutPrevisto: "2026-04-09",
    dataCheckinReal: "",
    dataCheckoutReal: "",
    qtdAdultos: 2,
    qtdCriancas: 0,
    qtdHospedes: 2,
    qtdNoites: 3,
    valorDiariaAplicada: 480,
    valorTotalHospedagem: 1440,
    valorDesconto: 0,
    valorTaxaLimpeza: 40,
    valorTaxaExtra: 0,
    valorTotalReserva: 1480,
    statusReserva: "pendente",
    origemReserva: "whatsapp",
    observacao: ""
  },
  {
    id: 1003,
    idChale: 2,
    idCliente: 3,
    dataReserva: "2026-04-02",
    dataCheckinPrevisto: "2026-04-07",
    dataCheckoutPrevisto: "2026-04-10",
    dataCheckinReal: "2026-04-07",
    dataCheckoutReal: "",
    qtdAdultos: 4,
    qtdCriancas: 0,
    qtdHospedes: 4,
    qtdNoites: 3,
    valorDiariaAplicada: 720,
    valorTotalHospedagem: 2160,
    valorDesconto: 0,
    valorTaxaLimpeza: 80,
    valorTaxaExtra: 0,
    valorTotalReserva: 2240,
    statusReserva: "hospedado",
    origemReserva: "booking",
    observacao: ""
  }
];

export const store: Store = {
  chales: [...initialChales],
  comodidades: [...initialComodidades],
  chaleComodidades: [...initialChaleComodidades],
  clientes: [...initialClientes],
  reservas: [...initialReservas],
  counters: {
    chales: 3,
    comodidades: 4,
    clientes: 3,
    reservas: 1003
  }
};

export function nextId(key: keyof Counters) {
  store.counters[key] += 1;
  return store.counters[key];
}

export function getReservationListItems(): ReservationListItem[] {
  return store.reservas.map((reserva) => {
    const cliente = store.clientes.find((item) => item.id === reserva.idCliente);
    const chale = store.chales.find((item) => item.id === reserva.idChale);

    return {
      id: reserva.id,
      cliente: cliente?.nomeCompleto ?? "Cliente nao encontrado",
      chale: chale?.nome ?? "Chale nao encontrado",
      checkin: reserva.dataCheckinPrevisto,
      checkout: reserva.dataCheckoutPrevisto,
      status: reserva.statusReserva,
      origem: reserva.origemReserva,
      valorTotal: reserva.valorTotalReserva
    };
  });
}

export function normalizeComodidade(input: ComodidadeInput): ComodidadeInput {
  return {
    nome: input.nome.trim(),
    descricao: input.descricao.trim(),
    status: input.status.trim()
  };
}
