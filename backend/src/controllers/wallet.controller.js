import * as WalletService from "../service/account.service.js";

export const createWallet = async (req, res) => {
  try {
    const { name, type, balance } = req.body;
    const userId = req.userId; // Didapat dari token JWT

    const wallet = await WalletService.createWallet({
      name,
      type,
      balance,
      userId,
    });
    res.status(201).json({ message: "Account created", wallet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getWallets = async (req, res) => {
  try {
    const userId = req.userId;
    const wallets = await WalletService.getUserWallets(userId);
    res.status(200).json(wallets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, balance } = req.body;
    const userId = req.userId;

    const wallet = await WalletService.updateWallet({
      walletId: id,
      userId,
      name,
      balance,
    });
    res.status(200).json({ message: "Wallet updated", wallet });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteWallet = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    await WalletService.deleteWallet({ walletId: id, userId });
    res.status(200).json({ message: "Wallet deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
