import express from "express";
import {
  createWallet,
  getWallets,
  updateWallet,
  deleteWallet,
} from "../controllers/wallet.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import {
  validateCreateWallet,
  validateUpdateWallet,
} from "../middlewares/validate.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", validateCreateWallet, createWallet);
router.get("/", getWallets);
router.put("/:id", validateUpdateWallet, updateWallet);
router.delete("/:id", deleteWallet);

export default router;
