import express from "express";
import { createBudget, getBudgets } from "../controllers/budget.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createBudget);
router.get("/", getBudgets);

export default router;
