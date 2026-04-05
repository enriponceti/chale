import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const clienteSchema = z.object({
  nomeCompleto: z.string().min(3),
  cpf: z.string().trim().min(11),
  rg: optionalText,
  documentoEstrangeiro: optionalText,
  dataNascimento: optionalText.refine(
    (value) => !value || /^\d{4}-\d{2}-\d{2}$/.test(value),
    "Data de nascimento deve estar no formato YYYY-MM-DD"
  ),
  telefone: optionalText,
  celular: optionalText,
  email: optionalText.refine(
    (value) => !value || z.string().email().safeParse(value).success,
    "E-mail invalido"
  ),
  logradouro: optionalText,
  numero: optionalText,
  complemento: optionalText,
  bairro: optionalText,
  cidade: optionalText,
  estado: optionalText,
  cep: optionalText,
  pais: optionalText,
  status: z.string().min(2),
  observacao: optionalText
});

export type ClienteInput = z.infer<typeof clienteSchema>;
