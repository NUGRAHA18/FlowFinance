import express from "express";
import {
  createDebt,
  getDebts,
  payDebt,
  updateStatus,
} from "../controllers/debt.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateCreateDebt,
  validateUpdateDebtStatus,
} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateDebt, createDebt);
router.get("/", getDebts);
router.put("/:id/pay", payDebt);
router.put("/:id/status", validateUpdateDebtStatus, updateStatus);

export default router;
