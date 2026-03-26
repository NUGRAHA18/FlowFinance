import express from "express";
import {
  createDebt,
  getDebts,
  updateStatus,
} from "../controllers/debt.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createDebt);
router.get("/", getDebts);
router.put("/:id/status", updateStatus);

export default router;
