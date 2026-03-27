import express from "express";
import {
  createSubscription,
  getSubscriptions,
  deleteSubscription,
} from "../controllers/subscription.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateCreateSubscription } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateSubscription, createSubscription);
router.get("/", getSubscriptions);
router.delete("/:id", deleteSubscription);

export default router;
