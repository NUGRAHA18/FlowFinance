import express from "express";
import {
  createWallet,
  getWallets,
  updateWallet,
  deleteWallet,
} from "../controllers/wallet.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Pasang middleware di semua rute wallet
router.use(authMiddleware);

router.post("/", createWallet);
router.get("/", getWallets);
router.put("/:id", updateWallet);
router.delete("/:id", deleteWallet);

export default router;
