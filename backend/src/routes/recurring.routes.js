import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  createRecurring,
  getRecurrings,
  updateRecurring,
  deleteRecurring,
  processRecurrings,
} from "../controllers/recurring.controller.js";

const router = Router();

router.use(authMiddleware);

router.post("/", createRecurring);
router.get("/", getRecurrings);
router.put("/:id", updateRecurring);
router.delete("/:id", deleteRecurring);
router.post("/process", processRecurrings);

export default router;
