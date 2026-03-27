import express from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
} from "../controllers/profile.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateUpdateProfile,
  validateChangePassword,
} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.get("/", getProfile);
router.put("/", validateUpdateProfile, updateProfile);
router.put("/password", validateChangePassword, changePassword);

export default router;
