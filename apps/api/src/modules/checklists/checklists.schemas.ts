import { z } from "zod";

export const checklistItemModeloSchema = z.object({
  descricao: z.string().trim().min(3, "Descricao deve ter pelo menos 3 caracteres"),
  area: z.string().trim().min(3, "Area deve ser informada"),
  obrigatorio: z.coerce.boolean(),
  ordem: z.coerce.number().int().positive(),
  status: z.string().trim().min(2, "Status deve ser informado")
});

export const checklistLimpezaItemSchema = z.object({
  idItemModelo: z.coerce.number().int().positive(),
  descricao: z.string().trim().min(3, "Descricao deve ter pelo menos 3 caracteres"),
  statusItem: z.enum(["pendente", "concluido", "nao_aplicavel"]),
  dataExecucao: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  observacao: z.string().optional().default("")
});

export const checklistLimpezaSchema = z.object({
  idManutencao: z.coerce.number().int().positive(),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dataFim: z.string().optional().default(""),
  status: z.enum(["aberto", "em_andamento", "concluido", "cancelado"]),
  observacao: z.string().optional().default(""),
  itens: z.array(checklistLimpezaItemSchema).min(1, "Informe pelo menos um item")
});

export type ChecklistItemModeloInput = z.infer<typeof checklistItemModeloSchema>;
export type ChecklistLimpezaItemInput = z.infer<typeof checklistLimpezaItemSchema>;
export type ChecklistLimpezaInput = z.infer<typeof checklistLimpezaSchema>;
