import express from "express";
import { exportTransactions } from "../controllers/export.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/transactions", exportTransactions);

export default router;
