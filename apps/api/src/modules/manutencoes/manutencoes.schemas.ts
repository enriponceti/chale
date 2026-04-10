import { z } from "zod";

export const manutencaoSchema = z.object({
  idChale: z.coerce.number().int().positive(),
  tipoManutencao: z.enum(["preventiva", "corretiva", "limpeza", "inspescao"]),
  descricaoProblema: z.string().trim().min(5, "Descricao do problema deve ter pelo menos 5 caracteres"),
  dataAbertura: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dataInicio: z.string().optional().default(""),
  dataFim: z.string().optional().default(""),
  status: z.enum(["aberta", "em_andamento", "concluida", "cancelada"]),
  responsavel: z.string().optional().default(""),
  fornecedor: z.string().optional().default(""),
  custo: z.coerce.number().min(0).default(0),
  observacao: z.string().optional().default("")
});

export type ManutencaoInput = z.infer<typeof manutencaoSchema>;
