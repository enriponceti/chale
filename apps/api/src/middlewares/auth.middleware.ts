import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../lib/auth.js";
import { AppError } from "../lib/http.js";

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      sub: string;
      perfil: string;
      nome: string;
    };
  }
}

export function authenticate(req: Request, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    throw new AppError("Autenticacao obrigatoria", 401);
  }

  const token = authHeader.replace("Bearer ", "");
  const payload = verifyToken(token);

  req.user = {
    sub: payload.sub,
    perfil: payload.perfil,
    nome: payload.nome
  };

  next();
}
