import express from "express";
import {
  createGoal,
  getGoals,
  addAmount,
} from "../controllers/savingGoal.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createGoal);
router.get("/", getGoals);
router.put("/:id/add", addAmount); // Rute khusus untuk menabung

export default router;
