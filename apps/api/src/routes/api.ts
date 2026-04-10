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
  checklistItemModeloSchema,
  checklistLimpezaSchema
} from "../modules/checklists/checklists.schemas.js";
import {
  createChecklistLimpeza,
  createChecklistModelo,
  deleteChecklistLimpeza,
  deleteChecklistModelo,
  listChecklistModelos,
  listChecklistsLimpeza,
  updateChecklistLimpeza,
  updateChecklistModelo
} from "../modules/checklists/checklists.service.js";
import {
  createManutencao,
  deleteManutencao,
  listManutencoes,
  updateManutencao
} from "../modules/manutencoes/manutencoes.service.js";
import { manutencaoSchema } from "../modules/manutencoes/manutencoes.schemas.js";
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
  "/checklist-modelos",
  asyncHandler(async (_req, res) => {
    res.json(await listChecklistModelos());
  })
);

apiRouter.post(
  "/checklist-modelos",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createChecklistModelo(checklistItemModeloSchema.parse(req.body)));
  })
);

apiRouter.put(
  "/checklist-modelos/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await updateChecklistModelo(Number(req.params.id), checklistItemModeloSchema.parse(req.body)));
  })
);

apiRouter.delete(
  "/checklist-modelos/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await deleteChecklistModelo(Number(req.params.id)));
  })
);

apiRouter.get(
  "/checklists-limpeza",
  asyncHandler(async (_req, res) => {
    res.json(await listChecklistsLimpeza());
  })
);

apiRouter.post(
  "/checklists-limpeza",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createChecklistLimpeza(checklistLimpezaSchema.parse(req.body)));
  })
);

apiRouter.put(
  "/checklists-limpeza/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await updateChecklistLimpeza(Number(req.params.id), checklistLimpezaSchema.parse(req.body)));
  })
);

apiRouter.delete(
  "/checklists-limpeza/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await deleteChecklistLimpeza(Number(req.params.id)));
  })
);

apiRouter.get(
  "/manutencoes",
  asyncHandler(async (_req, res) => {
    res.json(await listManutencoes());
  })
);

apiRouter.post(
  "/manutencoes",
  authenticate,
  asyncHandler(async (req, res) => {
    res.status(201).json(await createManutencao(manutencaoSchema.parse(req.body)));
  })
);

apiRouter.put(
  "/manutencoes/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await updateManutencao(Number(req.params.id), manutencaoSchema.parse(req.body)));
  })
);

apiRouter.delete(
  "/manutencoes/:id",
  authenticate,
  asyncHandler(async (req, res) => {
    res.json(await deleteManutencao(Number(req.params.id)));
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
