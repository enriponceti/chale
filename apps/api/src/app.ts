import cors from "cors";
import express from "express";
import { env } from "./config/env.js";
import { errorHandler } from "./lib/http.js";
import { router } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.CORS_ORIGIN
    })
  );
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.json({
      name: "Chales API",
      version: "0.1.0",
      docs: {
        health: "/health",
        login: "/api/auth/login",
        dashboard: "/api/dashboard",
        chales: "/api/chales",
        comodidades: "/api/comodidades",
        clientes: "/api/clientes",
        reservas: "/api/reservas"
      }
    });
  });

  app.use(router);
  app.use(errorHandler);

  return app;
}
