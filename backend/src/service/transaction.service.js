import prisma from "../config/prisma.js";

export const createTransaction = async ({
  userId,
  accountId,
  categoryId,
  amount,
  type,
  description,
  toAccountId,
}) => {
  return await prisma.$transaction(async (tx) => {
    if (type === "transfer") {
      if (!toAccountId) throw new Error("Akun tujuan wajib diisi untuk transfer");
      if (accountId === toAccountId) throw new Error("Akun asal dan tujuan tidak boleh sama");

      // Kurangi saldo akun asal
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      });

      // Tambah saldo akun tujuan
      await tx.account.update({
        where: { id: toAccountId },
        data: { balance: { increment: amount } },
      });

      // Catat 1 record transfer
      const transaction = await tx.transaction.create({
        data: { userId, accountId, categoryId, amount, type, description: description || `Transfer ke akun lain` },
      });

      return transaction;
    }

    // Income / Expense biasa
    const transaction = await tx.transaction.create({
      data: { userId, accountId, categoryId, amount, type, description },
    });

    if (type === "income") {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      });
    } else if (type === "expense") {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      });
    }

    return transaction;
  });
};

export const getUserTransactions = async (userId, filters = {}) => {
  const { page = 1, limit = 10, type, categoryId, accountId, startDate, endDate } = filters;

  const where = { userId };

  if (type) where.type = type;
  if (categoryId) where.categoryId = categoryId;
  if (accountId) where.accountId = accountId;
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      where.date.lte = end;
    }
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        account: { select: { name: true } },
        category: { select: { name: true } },
      },
      skip,
      take: Number(limit),
    }),
    prisma.transaction.count({ where }),
  ]);

  return {
    data: transactions,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const updateTransaction = async ({
  transactionId,
  userId,
  accountId,
  categoryId,
  amount,
  type,
  description,
}) => {
  return await prisma.$transaction(async (tx) => {
    // 1. Cari transaksi lama
    const oldTx = await tx.transaction.findFirst({
      where: { id: transactionId, userId },
    });

    if (!oldTx) throw new Error("Transaction not found");

    // 2. Reverse efek saldo dari transaksi lama
    if (oldTx.type === "income") {
      await tx.account.update({
        where: { id: oldTx.accountId },
        data: { balance: { decrement: oldTx.amount } },
      });
    } else if (oldTx.type === "expense") {
      await tx.account.update({
        where: { id: oldTx.accountId },
        data: { balance: { increment: oldTx.amount } },
      });
    }

    // 3. Update transaksi
    const updated = await tx.transaction.update({
      where: { id: transactionId },
      data: { accountId, categoryId, amount, type, description },
    });

    // 4. Apply efek saldo baru
    if (type === "income") {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { increment: amount } },
      });
    } else if (type === "expense") {
      await tx.account.update({
        where: { id: accountId },
        data: { balance: { decrement: amount } },
      });
    }

    return updated;
  });
};

export const deleteTransaction = async ({ transactionId, userId }) => {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.transaction.findFirst({
      where: { id: transactionId, userId },
    });

    if (!existing) throw new Error("Transaction not found");

    // Reverse efek saldo
    if (existing.type === "income") {
      await tx.account.update({
        where: { id: existing.accountId },
        data: { balance: { decrement: existing.amount } },
      });
    } else if (existing.type === "expense") {
      await tx.account.update({
        where: { id: existing.accountId },
        data: { balance: { increment: existing.amount } },
      });
    }

    await tx.transaction.delete({
      where: { id: transactionId },
    });

    return existing;
  });
};
