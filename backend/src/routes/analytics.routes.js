import express from "express";
import { getDashboardOverview } from "../controllers/analytics.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/dashboard", getDashboardOverview);

export default router;
