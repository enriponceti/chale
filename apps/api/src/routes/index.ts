import { Router } from "express";
import { apiRouter } from "./api.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    status: "ok",
    service: "chales-api",
    timestamp: new Date().toISOString()
  });
});
router.use("/api", apiRouter);
