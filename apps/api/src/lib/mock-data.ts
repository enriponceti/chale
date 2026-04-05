export const dashboardMock = {
  occupancyRate: 78,
  monthlyRevenue: 84250,
  activeReservations: 18,
  maintenanceOpen: 3,
  todayCheckins: 5,
  todayCheckouts: 4,
  recentReservations: [
    {
      id: 1001,
      hospede: "Mariana Costa",
      chale: "Chale das Araucarias",
      periodo: "05/04 - 08/04",
      status: "confirmada",
      valorTotal: 1950
    },
    {
      id: 1002,
      hospede: "Carlos Mendes",
      chale: "Chale Vista do Vale",
      periodo: "06/04 - 09/04",
      status: "pendente",
      valorTotal: 1480
    },
    {
      id: 1003,
      hospede: "Fernanda Rocha",
      chale: "Cabana da Serra",
      periodo: "07/04 - 10/04",
      status: "hospedado",
      valorTotal: 2240
    }
  ]
};

export const chalesMock = [
  {
    id: 1,
    codigo: "CH-001",
    nome: "Chale das Araucarias",
    status: "ativo",
    capacidadeMaxima: 4,
    valorDiariaBase: 650,
    localizacaoInterna: "Alameda Norte"
  },
  {
    id: 2,
    codigo: "CH-002",
    nome: "Cabana da Serra",
    status: "manutencao",
    capacidadeMaxima: 6,
    valorDiariaBase: 740,
    localizacaoInterna: "Mirante Central"
  },
  {
    id: 3,
    codigo: "CH-003",
    nome: "Chale Vista do Vale",
    status: "ativo",
    capacidadeMaxima: 2,
    valorDiariaBase: 520,
    localizacaoInterna: "Bosque Sul"
  }
];

export const clientesMock = [
  {
    id: 1,
    nomeCompleto: "Mariana Costa",
    email: "mariana@example.com",
    celular: "(85) 99999-1001",
    cidade: "Fortaleza",
    status: "ativo"
  },
  {
    id: 2,
    nomeCompleto: "Carlos Mendes",
    email: "carlos@example.com",
    celular: "(85) 99999-2002",
    cidade: "Recife",
    status: "ativo"
  },
  {
    id: 3,
    nomeCompleto: "Fernanda Rocha",
    email: "fernanda@example.com",
    celular: "(85) 99999-3003",
    cidade: "Natal",
    status: "vip"
  }
];

export const reservasMock = [
  {
    id: 1001,
    cliente: "Mariana Costa",
    chale: "Chale das Araucarias",
    checkin: "2026-04-05",
    checkout: "2026-04-08",
    status: "confirmada",
    origem: "site",
    valorTotal: 1950
  },
  {
    id: 1002,
    cliente: "Carlos Mendes",
    chale: "Chale Vista do Vale",
    checkin: "2026-04-06",
    checkout: "2026-04-09",
    status: "pendente",
    origem: "whatsapp",
    valorTotal: 1480
  },
  {
    id: 1003,
    cliente: "Fernanda Rocha",
    chale: "Cabana da Serra",
    checkin: "2026-04-07",
    checkout: "2026-04-10",
    status: "hospedado",
    origem: "booking",
    valorTotal: 2240
  }
];
