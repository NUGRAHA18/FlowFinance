import prisma from "../config/prisma.js";

export const createWallet = async ({ name, type, balance, userId }) => {
  return await prisma.account.create({
    data: {
      name,
      type,
      balance: balance || 0,
      userId,
    },
  });
};

export const getUserWallets = async (userId) => {
  return await prisma.account.findMany({
    where: { userId },
  });
};

export const updateWallet = async ({ walletId, userId, name, balance }) => {
  const existingWallet = await prisma.account.findFirst({
    where: { id: walletId, userId },
  });

  if (!existingWallet) throw new Error("Wallet not found or unauthorized");

  return await prisma.account.update({
    where: { id: walletId },
    data: { name, balance },
  });
};

export const deleteWallet = async ({ walletId, userId }) => {
  const existingWallet = await prisma.account.findFirst({
    where: { id: walletId, userId },
  });

  if (!existingWallet) throw new Error("Wallet not found or unauthorized");

  return await prisma.account.delete({
    where: { id: walletId },
  });
};
