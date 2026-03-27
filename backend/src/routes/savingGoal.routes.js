import express from "express";
import {
  createGoal,
  getGoals,
  addAmount,
} from "../controllers/savingGoal.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateCreateSavingGoal,
  validateAddSavingAmount,
} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateSavingGoal, createGoal);
router.get("/", getGoals);
router.put("/:id/add", validateAddSavingAmount, addAmount);

export default router;
