export type DashboardSummary = {
  occupancyRate: number;
  monthlyRevenue: number;
  activeReservations: number;
  maintenanceOpen: number;
  todayCheckins: number;
  todayCheckouts: number;
  recentReservations: ReservationListItem[];
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
  statusItem: string;
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
  status: string;
  idUsuario: number;
  observacao: string;
  itens: ChecklistLimpezaItemListItem[];
};

export type ChecklistLimpezaItemInput = {
  idItemModelo: number;
  descricao: string;
  statusItem: string;
  dataExecucao: string;
  observacao: string;
};

export type ChecklistLimpezaInput = {
  idManutencao: number;
  dataInicio: string;
  dataFim: string;
  status: string;
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

export type ReservationListItem = {
  id: number;
  cliente: string;
  chale: string;
  checkin: string;
  checkout: string;
  status: string;
  origem: string;
  valorTotal: number;
};

export type ReservationEntity = {
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
