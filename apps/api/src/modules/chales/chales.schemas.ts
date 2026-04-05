import { z } from "zod";

export const chaleSchema = z.object({
  codigo: z.string().min(2),
  nome: z.string().min(3),
  descricao: z.string().min(5),
  status: z.enum(["ativo", "inativo", "manutencao"]),
  capacidadeMaxima: z.coerce.number().int().positive(),
  qtdQuartos: z.coerce.number().int().positive(),
  qtdBanheiros: z.coerce.number().int().positive(),
  qtdCamasCasal: z.coerce.number().int().min(0),
  qtdCamasSolteiro: z.coerce.number().int().min(0),
  valorDiariaBase: z.coerce.number().positive(),
  areaM2: z.coerce.number().positive(),
  localizacaoInterna: z.string().min(2),
  checkinPadrao: z.string().regex(/^\d{2}:\d{2}$/),
  checkoutPadrao: z.string().regex(/^\d{2}:\d{2}$/)
});

export type ChaleInput = z.infer<typeof chaleSchema>;
