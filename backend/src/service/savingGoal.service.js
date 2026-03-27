import prisma from "../config/prisma.js";

export const createSavingGoal = async ({
  userId,
  name,
  targetAmount,
  deadline,
}) => {
  return await prisma.savingGoal.create({
    data: {
      userId,
      name,
      targetAmount,
      deadline: new Date(deadline),
    },
  });
};

export const getSavingGoals = async (userId) => {
  return await prisma.savingGoal.findMany({
    where: { userId },
    orderBy: { deadline: "asc" },
  });
};

// Menabung: kurangi saldo dompet, tambah savedAmount (atomic)
export const addSavingAmount = async ({ goalId, userId, amount, accountId }) => {
  return await prisma.$transaction(async (tx) => {
    const goal = await tx.savingGoal.findFirst({
      where: { id: goalId, userId },
    });
    if (!goal) throw new Error("Saving goal not found");

    // Cek saldo dompet cukup
    const account = await tx.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) throw new Error("Dompet tidak ditemukan");
    if (account.balance < amount) throw new Error("Saldo dompet tidak mencukupi");

    // Kurangi saldo dompet
    await tx.account.update({
      where: { id: accountId },
      data: { balance: { decrement: amount } },
    });

    // Tambah savedAmount
    const updated = await tx.savingGoal.update({
      where: { id: goalId },
      data: { savedAmount: { increment: amount } },
    });

    return updated;
  });
};

// Tarik dari tabungan: tambah saldo dompet, kurangi savedAmount (atomic)
export const withdrawSavingAmount = async ({ goalId, userId, amount, accountId }) => {
  return await prisma.$transaction(async (tx) => {
    const goal = await tx.savingGoal.findFirst({
      where: { id: goalId, userId },
    });
    if (!goal) throw new Error("Saving goal not found");
    if (goal.savedAmount < amount) throw new Error("Saldo tabungan tidak mencukupi");

    const account = await tx.account.findFirst({
      where: { id: accountId, userId },
    });
    if (!account) throw new Error("Dompet tidak ditemukan");

    // Tambah saldo dompet
    await tx.account.update({
      where: { id: accountId },
      data: { balance: { increment: amount } },
    });

    // Kurangi savedAmount
    const updated = await tx.savingGoal.update({
      where: { id: goalId },
      data: { savedAmount: { decrement: amount } },
    });

    return updated;
  });
};
