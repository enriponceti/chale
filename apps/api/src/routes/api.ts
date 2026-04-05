import { Router } from "express";
import { login } from "../modules/auth/auth.service.js";
import { createChale, deleteChale, listChales, updateChale } from "../modules/chales/chales.service.js";
import { chaleSchema } from "../modules/chales/chales.schemas.js";
import {
  createCliente,
  deleteCliente,
  listClientes,
  updateCliente
} from "../modules/clientes/clientes.service.js";
import { clienteSchema } from "../modules/clientes/clientes.schemas.js";
import { getDashboardSummary } from "../modules/dashboard/dashboard.service.js";
import {
  createComodidade,
  deleteComodidade,
  listChaleComodidades,
  listComodidades,
  updateComodidade,
  updateChaleComodidades
} from "../modules/comodidades/comodidades.service.js";
import { chaleComodidadesSchema, comodidadeSchema } from "../modules/comodidades/comodidades.schemas.js";
import {
  createReserva,
  deleteReserva,
  listReservasDetalhadas,
  listReservas,
  updateReserva
} from "../modules/reservas/reservas.service.js";
import { reservaSchema } from "../modules/reservas/reservas.schemas.js";
import { asyncHandler } from "../lib/http.js";
import { authenticate } from "../middlewares/auth.middleware.js";

export const apiRouter = Router();

apiRouter.post(
  "/auth/login",
  asyncHandler(async (req, res) => {
    res.json(await login(req.body));
  })
);

apiRouter.get(
  "/dashboard",
  asyncHandler(async (_req, res) => {
    res.json(await getDashboardSummary());
  })
);

apiRouter.get(
  "/chales",
  asyncHandler(async (_req, res) => {
    res.json(await listChales());
  })
);

apiRouter.get(
  "/chales/:id/comodidades",
  asyncHandler(async (req, res) => {
    res.json(await listChaleComodidades(Number(req.params.id)));
  })
);

apiRouter.put(
  "/chales/:id/comodidades",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(
      await updateChaleComodidades(
        Number(req.params.id),
        chaleComodidadesSchema.parse(req.body)
      )
    );
  })
);

apiRouter.post(
  "/chales",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createChale(chaleSchema.parse(req.body)));
  })
);

apiRouter.put(
  "/chales/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await updateChale(Number(req.params.id), chaleSchema.parse(req.body)));
  })
);

apiRouter.delete(
  "/chales/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await deleteChale(Number(req.params.id)));
  })
);

apiRouter.get(
  "/clientes",
  asyncHandler(async (_req, res) => {
    res.json(await listClientes());
  })
);

apiRouter.get(
  "/comodidades",
  asyncHandler(async (_req, res) => {
    res.json(await listComodidades());
  })
);

apiRouter.post(
  "/comodidades",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createComodidade(comodidadeSchema.parse(req.body)));
  })
);

apiRouter.put(
  "/comodidades/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await updateComodidade(Number(req.params.id), comodidadeSchema.parse(req.body)));
  })
);

apiRouter.delete(
  "/comodidades/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await deleteComodidade(Number(req.params.id)));
  })
);

apiRouter.post(
  "/clientes",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createCliente(clienteSchema.parse(req.body)));
  })
);

apiRouter.put(
  "/clientes/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await updateCliente(Number(req.params.id), clienteSchema.parse(req.body)));
  })
);

apiRouter.delete(
  "/clientes/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await deleteCliente(Number(req.params.id)));
  })
);

apiRouter.get(
  "/reservas",
  asyncHandler(async (_req, res) => {
    res.json(await listReservas());
  })
);

apiRouter.get(
  "/reservas/detalhadas",
  asyncHandler(async (_req, res) => {
    res.json(await listReservasDetalhadas());
  })
);

apiRouter.post(
  "/reservas",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createReserva(reservaSchema.parse(req.body)));
  })
);

apiRouter.put(
  "/reservas/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await updateReserva(Number(req.params.id), reservaSchema.parse(req.body)));
  })
);

apiRouter.delete(
  "/reservas/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await deleteReserva(Number(req.params.id)));
  })
);
