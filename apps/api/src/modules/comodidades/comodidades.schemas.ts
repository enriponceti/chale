import { z } from "zod";

export const comodidadeSchema = z.object({
  nome: z.string().trim().min(2, "Nome deve ter pelo menos 2 caracteres"),
  descricao: z.string().trim().min(5, "Descricao deve ter pelo menos 5 caracteres"),
  status: z.string().trim().min(2, "Status deve ser informado")
});

export const chaleComodidadesSchema = z.object({
  itens: z.array(
    z.object({
      idComodidade: z.coerce.number().int().positive(),
      observacao: z.string().optional().default("")
    })
  )
});

export type ComodidadeInput = z.infer<typeof comodidadeSchema>;
export type ChaleComodidadesInput = z.infer<typeof chaleComodidadesSchema>;
