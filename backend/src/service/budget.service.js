import prisma from "../config/prisma.js";

export const createBudget = async ({ userId, categoryId, amount, month }) => {
  // Cegah duplikasi budget untuk kategori dan bulan yang sama
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
  return await prisma.budget.findMany({
    where: { userId },
    include: {
      category: { select: { name: true } }, // Menampilkan nama kategori, bukan cuma ID
    },
    orderBy: { month: "desc" },
  });
};
