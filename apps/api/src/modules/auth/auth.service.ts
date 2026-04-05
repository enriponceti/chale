import { z } from "zod";
import { createToken } from "../../lib/auth.js";
import { AppError } from "../../lib/http.js";

const loginSchema = z.object({
  email: z.string().email(),
  senha: z.string().min(4)
});

const demoUser = {
  id: "1",
  nome: "Administrador",
  email: "admin@serra.local",
  senha: "admin123",
  perfil: "admin"
};

export function login(input: unknown) {
  const credentials = loginSchema.parse(input);

  if (credentials.email !== demoUser.email || credentials.senha !== demoUser.senha) {
    throw new AppError("Credenciais invalidas", 401);
  }

  const token = createToken({
    sub: demoUser.id,
    nome: demoUser.nome,
    perfil: demoUser.perfil
  });

  return {
    token,
    user: {
      id: demoUser.id,
      nome: demoUser.nome,
      email: demoUser.email,
      perfil: demoUser.perfil
    }
  };
}
