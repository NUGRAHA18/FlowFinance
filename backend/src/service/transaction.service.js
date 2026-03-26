import prisma from "../config/prisma.js";

export const createTransaction = async ({
  userId,
  accountId,
  categoryId,
  amount,
  type,
  description,
}) => {
  // Gunakan Prisma transaction agar data sinkron
  return await prisma.$transaction(async (tx) => {
    // 1. Catat transaksinya
    const transaction = await tx.transaction.create({
      data: { userId, accountId, categoryId, amount, type, description },
    });

    // 2. Update saldo dompetnya
    if (type === "income") {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } }, // Tambah saldo
      });
    } else if (type === "expense") {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } }, // Kurangi saldo
      });
    }

    return transaction;
  });
};

export const getUserTransactions = async (userId) => {
  return await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: "desc" },
    include: {
      // Ambil juga nama dompet dan nama kategorinya
      account: { select: { name: true } },
      category: { select: { name: true } },
    },
  });
};
