import express from "express";
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
} from "../controllers/transaction.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateCreateTransaction,
  validateUpdateTransaction,
} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateTransaction, createTransaction);
router.get("/", getTransactions);
router.put("/:id", validateUpdateTransaction, updateTransaction);
router.delete("/:id", deleteTransaction);

export default router;
