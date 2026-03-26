import prisma from "../config/prisma.js";

export const createCategory = async ({ name, type, userId }) => {
  return await prisma.category.create({
    data: { name, type, userId },
  });
};

export const getUserCategories = async (userId) => {
  return await prisma.category.findMany({
    where: { userId },
  });
};

export const deleteCategory = async ({ categoryId, userId }) => {
  const existingCategory = await prisma.category.findFirst({
    where: { id: categoryId, userId },
  });

  if (!existingCategory) throw new Error("Category not found");

  return await prisma.category.delete({
    where: { id: categoryId },
  });
};
