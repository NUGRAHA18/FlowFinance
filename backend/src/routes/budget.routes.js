import express from "express";
import { createBudget, getBudgets, deleteBudget } from "../controllers/budget.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateCreateBudget } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateBudget, createBudget);
router.get("/", getBudgets);
router.delete("/:id", deleteBudget);

export default router;
