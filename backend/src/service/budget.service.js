import prisma from "../config/prisma.js";

export const createBudget = async ({ userId, categoryId, amount, month }) => {
  const existingBudget = await prisma.budget.findFirst({
    where: { userId, categoryId, month },
  });

  if (existingBudget) {
    throw new Error("Budget for this category and month already exists");
  }

  return await prisma.budget.create({
    data: { userId, categoryId, amount, month },
  });
};

export const getUserBudgets = async (userId) => {
  const budgets = await prisma.budget.findMany({
    where: { userId },
    include: {
      category: { select: { name: true } },
    },
    orderBy: { month: "desc" },
  });

  // Hitung pengeluaran aktual untuk setiap budget
  const budgetsWithSpent = await Promise.all(
    budgets.map(async (budget) => {
      const [year, monthNum] = budget.month.split("-").map(Number);
      const startOfMonth = new Date(year, monthNum - 1, 1);
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59, 999);

      const spent = await prisma.transaction.aggregate({
        where: {
          userId,
          categoryId: budget.categoryId,
          type: "expense",
          date: { gte: startOfMonth, lte: endOfMonth },
        },
        _sum: { amount: true },
      });

      return {
        ...budget,
        spentAmount: spent._sum.amount || 0,
      };
    })
  );

  return budgetsWithSpent;
};

export const deleteBudget = async ({ budgetId, userId }) => {
  const existing = await prisma.budget.findFirst({
    where: { id: budgetId, userId },
  });

  if (!existing) throw new Error("Budget not found");

  return await prisma.budget.delete({
    where: { id: budgetId },
  });
};
