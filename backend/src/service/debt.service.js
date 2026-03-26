import prisma from "../config/prisma.js";

export const createDebt = async ({
  userId,
  personName,
  amount,
  dueDate,
  status,
}) => {
  return await prisma.debt.create({
    data: {
      userId,
      personName,
      amount,
      dueDate: new Date(dueDate),
      status: status || "pending", // Default status adalah pending
    },
  });
};

export const getUserDebts = async (userId) => {
  return await prisma.debt.findMany({
    where: { userId },
    orderBy: { dueDate: "asc" }, // Urutkan dari yang paling dekat jatuh tempo
  });
};

export const updateDebtStatus = async ({ debtId, userId, status }) => {
  const debt = await prisma.debt.findFirst({
    where: { id: debtId, userId },
  });

  if (!debt) throw new Error("Debt not found");

  return await prisma.debt.update({
    where: { id: debtId },
    data: { status },
  });
};
