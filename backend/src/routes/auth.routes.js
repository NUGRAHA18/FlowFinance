import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import {
  validateRegister,
  validateLogin,
} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);

export default router;
