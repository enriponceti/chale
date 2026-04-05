import { z } from "zod";

const dateString = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD");

export const reservaSchema = z.object({
  idChale: z.coerce.number().int().positive(),
  idCliente: z.coerce.number().int().positive(),
  dataCheckinPrevisto: dateString,
  dataCheckoutPrevisto: dateString,
  dataCheckinReal: dateString.optional().or(z.literal("")),
  dataCheckoutReal: dateString.optional().or(z.literal("")),
  qtdAdultos: z.coerce.number().int().min(1),
  qtdCriancas: z.coerce.number().int().min(0).default(0),
  valorDiariaAplicada: z.coerce.number().positive(),
  valorDesconto: z.coerce.number().min(0).default(0),
  valorTaxaLimpeza: z.coerce.number().min(0).default(0),
  valorTaxaExtra: z.coerce.number().min(0).default(0),
  statusReserva: z.enum([
    "pendente",
    "confirmada",
    "hospedado",
    "finalizada",
    "cancelada",
    "no_show"
  ]),
  origemReserva: z.string().min(2),
  observacao: z.string().default("")
});

export type ReservaInput = z.infer<typeof reservaSchema>;
