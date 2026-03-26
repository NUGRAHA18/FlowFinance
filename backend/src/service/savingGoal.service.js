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
      deadline: new Date(deadline), // Mengubah string tanggal menjadi format Date
    },
  });
};

export const getSavingGoals = async (userId) => {
  return await prisma.savingGoal.findMany({
    where: { userId },
    orderBy: { deadline: "asc" }, // Urutkan dari deadline terdekat
  });
};

export const addSavingAmount = async ({ goalId, userId, amount }) => {
  // Pastikan celengannya ada dan milik user tersebut
  const goal = await prisma.savingGoal.findFirst({
    where: { id: goalId, userId },
  });

  if (!goal) throw new Error("Saving goal not found");

  return await prisma.savingGoal.update({
    where: { id: goalId },
    data: { savedAmount: { increment: amount } }, // Tambah isi celengan
  });
};
