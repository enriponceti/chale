import crypto from "node:crypto";
import { AppError } from "./http.js";

type JwtPayload = {
  sub: string;
  perfil: string;
  nome: string;
  exp: number;
};

const algorithm = "HS256";
const secret = process.env.JWT_SECRET ?? "chales-dev-secret";

function encode(input: string) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function decode(input: string) {
  const normalized = input.replace(/-/g, "+").replace(/_/g, "/");
  const padding = normalized.length % 4 === 0 ? "" : "=".repeat(4 - (normalized.length % 4));
  return Buffer.from(`${normalized}${padding}`, "base64").toString("utf8");
}

function sign(value: string) {
  return crypto
    .createHmac("sha256", secret)
    .update(value)
    .digest("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

export function createToken(payload: Omit<JwtPayload, "exp">, expiresInSeconds = 60 * 60 * 12) {
  const header = encode(JSON.stringify({ alg: algorithm, typ: "JWT" }));
  const body = encode(
    JSON.stringify({
      ...payload,
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds
    })
  );
  const signature = sign(`${header}.${body}`);
  return `${header}.${body}.${signature}`;
}

export function verifyToken(token: string): JwtPayload {
  const [header, payload, signature] = token.split(".");
  if (!header || !payload || !signature) {
    throw new AppError("Token invalido", 401);
  }

  const expected = sign(`${header}.${payload}`);
  if (signature !== expected) {
    throw new AppError("Assinatura invalida", 401);
  }

  const parsed = JSON.parse(decode(payload)) as JwtPayload;
  if (parsed.exp < Math.floor(Date.now() / 1000)) {
    throw new AppError("Token expirado", 401);
  }

  return parsed;
}
