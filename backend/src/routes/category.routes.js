import express from "express";
import {
  createCategory,
  getCategories,
  deleteCategory,
} from "../controllers/category.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { validateCreateCategory } from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateCategory, createCategory);
router.get("/", getCategories);
router.delete("/:id", deleteCategory);

export default router;
